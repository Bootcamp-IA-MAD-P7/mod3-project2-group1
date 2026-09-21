"""Unit tests for final evaluation tooling (US-15), synthetic data only (no real TEST)."""

from __future__ import annotations

import json
from typing import Any

import pandas as pd
import pytest
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)

import ml.evaluation.final_evaluation as fe
from ml.data.dataset import HOLDOUT_VIDEO_IDS, TARGET_COLUMN, TEXT_COLUMN, VIDEO_ID_COLUMN
from ml.models.logistic_pipeline import create_best_logistic_pipeline_observed_on_dev

GAP_THRESHOLD_PERCENTAGE_POINTS = 5.0


@pytest.fixture(autouse=True)
def _reset_single_run_guard() -> Any:
    fe._FINAL_EVALUATION_RUN = False
    yield
    fe._FINAL_EVALUATION_RUN = False


def _synthetic_prepared(*, include_holdout: bool = False) -> pd.DataFrame:
    rows = [
        ("vid-a", "this is a nice and honest comment", False),
        ("vid-a", "i really love this content", False),
        ("vid-a", "great video thanks for sharing", False),
        ("vid-a", "yes this is kind and respectful", False),
        ("vid-a", "thanks for an excellent post", False),
        ("vid-a", "this video is very helpful", False),
        ("vid-b", "you are a complete fool", True),
        ("vid-b", "hate you and everyone like you", True),
        ("vid-b", "shut up you disgusting person", True),
        ("vid-b", "idiot nonsense get lost", True),
        ("vid-b", "stupid comments from a hateful user", True),
        ("vid-b", "go away nobody wants you here", True),
    ]
    if include_holdout:
        rows.append(("TZxEyoplYbI", "this holdout row must never leak into training", True))
    return pd.DataFrame(rows, columns=[VIDEO_ID_COLUMN, TEXT_COLUMN, TARGET_COLUMN])


def test_gate_border_cases():
    assert fe.compute_final_gate(0.8, 0.7501)["passed"] is True
    assert fe.compute_final_gate(0.8, 0.7500)["passed"] is False
    assert fe.compute_final_gate(0.8, 0.7499)["passed"] is False

    gap_under = fe.compute_final_gate(0.8, 0.7501)
    assert gap_under["gap_pp"] < GAP_THRESHOLD_PERCENTAGE_POINTS
    check = gap_under["checks"][0]
    assert check["name"] == "gap_macro_f1_under_threshold"
    assert check["passed"] is True


def test_gate_min_recall_and_dummy_checks():
    gate_pass = fe.compute_final_gate(
        0.8, 0.795, gap_threshold_pp=5.0, min_recall=0.4, recall_hate=0.5, dummy_macro_f1=0.55
    )
    assert gate_pass["passed"] is True
    names = {check["name"]: check for check in gate_pass["checks"]}
    assert names["min_recall_hate"]["passed"] is True
    assert names["improve_over_dummy"]["passed"] is True

    gate_fail_recall = fe.compute_final_gate(
        0.8, 0.795, min_recall=0.6, recall_hate=0.5, dummy_macro_f1=0.55
    )
    assert gate_fail_recall["passed"] is False

    gate_fail_dummy = fe.compute_final_gate(
        0.8, 0.795, min_recall=0.4, recall_hate=0.5, dummy_macro_f1=0.80
    )
    assert gate_fail_dummy["passed"] is False
    assert gate_fail_dummy["checks"][2]["name"] == "improve_over_dummy"

    assert fe.GAP_THRESHOLD_PERCENTAGE_POINTS == GAP_THRESHOLD_PERCENTAGE_POINTS


def test_final_metrics_match_sklearn():
    y_true = [True, False, True, True, False, True, False]
    y_pred = [True, True, True, False, False, True, False]
    metrics = fe.final_metrics(y_true, y_pred)

    assert metrics["accuracy"] == accuracy_score(y_true, y_pred)
    assert metrics["precision_hate"] == precision_score(y_true, y_pred, pos_label=True, zero_division=0)
    assert metrics["recall_hate"] == recall_score(y_true, y_pred, pos_label=True, zero_division=0)
    assert metrics["f1_hate"] == f1_score(y_true, y_pred, pos_label=True, zero_division=0)
    assert metrics["macro_f1"] == float(f1_score(y_true, y_pred, average="macro", zero_division=0))
    assert metrics["confusion_matrix"] == confusion_matrix(y_true, y_pred, labels=[False, True]).tolist()
    _, fp, fn, _ = confusion_matrix(y_true, y_pred, labels=[False, True]).ravel()
    assert metrics["fn"] == int(fn)
    assert metrics["fp"] == int(fp)


def test_training_never_sees_holdout(monkeypatch):
    captured: dict[str, Any] = {}
    original = fe.train_frozen_logistic_pipeline

    def spy(development_data):
        captured["dev_video_ids"] = set(development_data[VIDEO_ID_COLUMN])
        return original(development_data)

    monkeypatch.setattr(fe, "train_frozen_logistic_pipeline", spy)
    fe.run_final_evaluation(_synthetic_prepared(include_holdout=True))

    assert not captured["dev_video_ids"] & HOLDOUT_VIDEO_IDS


def test_cost_fields_present_and_non_negative(tmp_path):
    bundle = tmp_path / "bundle.joblib"
    bundle.write_bytes(b"fake-artifact")
    result = fe.run_final_evaluation(
        _synthetic_prepared(include_holdout=True), bundle_path=bundle
    )
    cost = result["cost"]
    assert cost["runtime_seconds"] >= 0
    assert cost["peak_memory_bytes"] is None or cost["peak_memory_bytes"] >= 0
    assert cost["bundle_size_bytes"] == bundle.stat().st_size


def test_single_run_guard_raises_on_second_call():
    fe.run_final_evaluation(_synthetic_prepared(include_holdout=True))
    with pytest.raises(RuntimeError, match="single-run guard"):
        fe.run_final_evaluation(_synthetic_prepared(include_holdout=True))


def test_parity_between_bundle_and_offline_factory(monkeypatch):
    prepared = _synthetic_prepared(include_holdout=True)
    dev = prepared.loc[~prepared[VIDEO_ID_COLUMN].isin(HOLDOUT_VIDEO_IDS)]
    offline = create_best_logistic_pipeline_observed_on_dev()
    offline.fit(dev[TEXT_COLUMN], dev[TARGET_COLUMN])

    captured: dict[str, Any] = {}
    original = fe.train_frozen_logistic_pipeline

    def spy(development_data):
        captured["pipeline"] = original(development_data)
        return captured["pipeline"]

    monkeypatch.setattr(fe, "train_frozen_logistic_pipeline", spy)
    fe.run_final_evaluation(prepared)

    samples = [
        "this is a nice and honest comment",
        "hate you and everyone like you",
        "a completely new unseen sentence",
    ]
    assert captured["pipeline"].predict(samples).tolist() == offline.predict(samples).tolist()


def test_report_writer_creates_json_and_markdown(tmp_path):
    json_path = tmp_path / "final-evaluation.json"
    markdown_path = tmp_path / "final-evaluation.md"
    result = {
        "generated_at_utc": "2026-09-21T00:00:00+00:00",
        "protocol": {
            "gap_threshold_pp": 5.0,
            "min_recall": None,
            "dummy_macro_f1": None,
            "dev_rows": 12,
            "test_rows": 1,
            "holdout_video_ids_excluded": sorted(HOLDOUT_VIDEO_IDS),
        },
        "train": {"macro_f1": 0.95},
        "test": {
            "accuracy": 1.0,
            "precision_hate": 1.0,
            "recall_hate": 1.0,
            "f1_hate": 1.0,
            "macro_f1": 0.5,
            "confusion_matrix": [[0, 0], [0, 1]],
            "fn": 0,
            "fp": 0,
        },
        "gate": {"gap_pp": 45.0, "passed": False, "checks": []},
        "cost": {"runtime_seconds": 0.1, "peak_memory_bytes": None, "bundle_size_bytes": 13},
    }
    fe.write_final_evaluation_report(result, json_path=json_path, markdown_path=markdown_path)

    assert json_path.is_file() and markdown_path.is_file()
    assert json.loads(json_path.read_text(encoding="utf-8"))["gate"]["passed"] is False
    assert "Evaluación final" in markdown_path.read_text(encoding="utf-8")
    assert "Gate" in markdown_path.read_text(encoding="utf-8")