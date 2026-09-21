"""Final isolated evaluation of the frozen Logistic Regression candidate (US-15)."""

from __future__ import annotations

import json
import time
import tracemalloc
from collections.abc import Sequence
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

import pandas as pd
from sklearn.metrics import f1_score

from ml.data.dataset import (
    HOLDOUT_VIDEO_IDS,
    TARGET_COLUMN,
    TEXT_COLUMN,
    VIDEO_ID_COLUMN,
    create_holdout_split,
)
from ml.evaluation.metrics import evaluate_binary_classification
from ml.training.final_logistic_regression import train_frozen_logistic_pipeline

GAP_THRESHOLD_PERCENTAGE_POINTS = 5.0

_FINAL_EVALUATION_RUN = False


def _macro_f1(y_true: Sequence[bool], y_pred: Sequence[bool]) -> float:
    return float(f1_score(y_true, y_pred, average="macro", zero_division=0))


def compute_final_gate(
    train_macro_f1: float,
    test_macro_f1: float,
    *,
    gap_threshold_pp: float = GAP_THRESHOLD_PERCENTAGE_POINTS,
    min_recall: float | None = None,
    recall_hate: float | None = None,
    dummy_macro_f1: float | None = None,
) -> dict[str, Any]:
    """Evaluate the promotion gate without mutating the frozen configuration."""
    gap_pp = abs(train_macro_f1 - test_macro_f1) * 100.0
    checks: list[dict[str, Any]] = [
        {
            "name": "gap_macro_f1_under_threshold",
            "passed": gap_pp < gap_threshold_pp,
            "value": round(gap_pp, 4),
            "threshold": gap_threshold_pp,
            "active": True,
        }
    ]
    if min_recall is not None:
        if recall_hate is None:
            checks.append(
                {
                    "name": "min_recall_hate",
                    "passed": None,
                    "value": None,
                    "threshold": min_recall,
                    "active": False,
                    "reason": "recall_hate not provided; check awaited OQ-03 decision",
                }
            )
        else:
            checks.append(
                {
                    "name": "min_recall_hate",
                    "passed": recall_hate >= min_recall,
                    "value": round(recall_hate, 4),
                    "threshold": min_recall,
                    "active": True,
                }
            )
    if dummy_macro_f1 is not None:
        checks.append(
            {
                "name": "improve_over_dummy",
                "passed": test_macro_f1 > dummy_macro_f1,
                "value": round(test_macro_f1, 4),
                "threshold": dummy_macro_f1,
                "active": True,
            }
        )
    active_checks = [check for check in checks if check.get("active")]
    passed = all(bool(check["passed"]) for check in active_checks)
    return {"gap_pp": round(gap_pp, 4), "passed": passed, "checks": checks}


def final_metrics(y_true: Sequence[bool], y_pred: Sequence[bool]) -> dict[str, Any]:
    """Per-class and macro metrics plus FN/FP derived from the confusion matrix."""
    binary = evaluate_binary_classification(y_true, y_pred)
    confusion = binary["confusion_matrix"]
    _tn, fp, fn, _tp = confusion[0][0], confusion[0][1], confusion[1][0], confusion[1][1]
    return {
        "accuracy": binary["accuracy"],
        "precision_hate": binary["precision"],
        "recall_hate": binary["recall"],
        "f1_hate": binary["f1"],
        "macro_f1": _macro_f1(y_true, y_pred),
        "confusion_matrix": confusion,
        "fn": fn,
        "fp": fp,
    }


def run_final_evaluation(
    prepared_data: pd.DataFrame,
    *,
    bundle_path: Path | None = None,
    gap_threshold_pp: float = GAP_THRESHOLD_PERCENTAGE_POINTS,
    min_recall: float | None = None,
    dummy_macro_f1: float | None = None,
) -> dict[str, Any]:
    """Fit the frozen pipeline once on DEV and evaluate once on the sealed TEST.

    Single-run guard: a second call in the same process raises to prevent
    accidental re-iteration over TEST.
    """
    global _FINAL_EVALUATION_RUN
    if _FINAL_EVALUATION_RUN:
        raise RuntimeError(
            "final evaluation already executed in this process; "
            "single-run guard blocks re-iteration over TEST"
        )
    _FINAL_EVALUATION_RUN = True

    development_data, test_data = create_holdout_split(prepared_data)
    if set(development_data[VIDEO_ID_COLUMN]) & HOLDOUT_VIDEO_IDS:
        raise ValueError("HOLDOUT_VIDEO_IDS leaked into DEV training data")

    try:
        tracemalloc.start()
    except RuntimeError:
        pass

    try:
        started = time.perf_counter()
        pipeline = train_frozen_logistic_pipeline(development_data)
        train_macro_f1 = _macro_f1(
            development_data[TARGET_COLUMN], pipeline.predict(development_data[TEXT_COLUMN])
        )
        test_metrics = final_metrics(
            test_data[TARGET_COLUMN], pipeline.predict(test_data[TEXT_COLUMN])
        )
    finally:
        elapsed_seconds = time.perf_counter() - started
        peak_memory_bytes: int | None = None
        if tracemalloc.is_tracing():
            peak_memory_bytes = tracemalloc.get_traced_memory()[1]
            tracemalloc.stop()

    gate = compute_final_gate(
        train_macro_f1,
        test_metrics["macro_f1"],
        gap_threshold_pp=gap_threshold_pp,
        min_recall=min_recall,
        recall_hate=test_metrics["recall_hate"],
        dummy_macro_f1=dummy_macro_f1,
    )

    cost = {
        "runtime_seconds": round(elapsed_seconds, 4),
        "peak_memory_bytes": peak_memory_bytes,
        "bundle_size_bytes": (
            bundle_path.stat().st_size if bundle_path is not None and bundle_path.is_file() else None
        ),
    }

    return {
        "generated_at_utc": datetime.now(UTC).isoformat(),
        "protocol": {
            "gap_threshold_pp": gap_threshold_pp,
            "min_recall": min_recall,
            "dummy_macro_f1": dummy_macro_f1,
            "dev_rows": len(development_data),
            "test_rows": len(test_data),
            "holdout_video_ids_excluded": sorted(HOLDOUT_VIDEO_IDS),
        },
        "train": {"macro_f1": train_macro_f1},
        "test": test_metrics,
        "gate": gate,
        "cost": cost,
    }

    return {
        "generated_at_utc": datetime.now(UTC).isoformat(),
        "protocol": {
            "gap_threshold_pp": gap_threshold_pp,
            "min_recall": min_recall,
            "dummy_macro_f1": dummy_macro_f1,
            "dev_rows": len(development_data),
            "test_rows": len(test_data),
            "holdout_video_ids_excluded": sorted(HOLDOUT_VIDEO_IDS),
        },
        "train": {"macro_f1": train_macro_f1},
        "test": test_metrics,
        "gate": gate,
        "cost": cost,
    }


def _render_markdown(result: dict[str, Any]) -> str:
    """Render the report markdown exclusively from real evaluation results."""
    protocol = result["protocol"]
    train = result["train"]
    test = result["test"]
    gate = result["gate"]
    cost = result["cost"]
    return "\n".join(
        [
            "# Evaluación final — candidato congelado (US-15)",
            "",
            f"- Fecha/hora (UTC): {result['generated_at_utc']}",
            f"- DEV rows: {protocol['dev_rows']}; TEST rows: {protocol['test_rows']}",
            f"- Holdout excluido del train: {', '.join(protocol['holdout_video_ids_excluded'])}",
            "",
            "## Métricas TEST (una única corrida autorizada)",
            "",
            "| Métrica | Valor |",
            "|---|---:|",
            f"| Macro-F1 | {test['macro_f1']:.4f} |",
            f"| F1 hate | {test['f1_hate']:.4f} |",
            f"| Precision hate | {test['precision_hate']:.4f} |",
            f"| Recall hate | {test['recall_hate']:.4f} |",
            f"| Accuracy | {test['accuracy']:.4f} |",
            f"| FN | {test['fn']} |",
            f"| FP | {test['fp']} |",
            f"| Matriz (TN, FP, FN, TP) | {test['confusion_matrix']} |",
            "",
            "## Train (DEV completo)",
            "",
            f"- Macro-F1: {train['macro_f1']:.4f}",
            "",
            "## Gate",
            "",
            f"- Gap macro-F1 (pp): `{gate['gap_pp']}` — umbral `{protocol['gap_threshold_pp']}`",
            f"- Resultado global: **{'PASS' if gate['passed'] else 'FAIL'}**",
            "",
            "## Coste (GO-01)",
            "",
            f"- Tiempo (s): {cost['runtime_seconds']}",
            f"- Memoria pico (bytes): {cost['peak_memory_bytes']}",
            f"- Tamaño bundle (bytes): {cost['bundle_size_bytes']}",
            "",
            "## Limitaciones",
            "",
            "- Corrida única preacordada; un resultado FAIL se reporta sin tuning ni re-iteración sobre TEST.",
            "- Umbrales adicionales de OQ-03 y revisión cruzada de AC3 pendientes de decisión humana.",
            "",
        ]
    )


def write_final_evaluation_report(
    result: dict[str, Any],
    *,
    json_path: Path,
    markdown_path: Path,
) -> None:
    """Persist the real evaluation report as JSON and markdown."""
    json_path.parent.mkdir(parents=True, exist_ok=True)
    markdown_path.parent.mkdir(parents=True, exist_ok=True)
    json_path.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    markdown_path.write_text(_render_markdown(result), encoding="utf-8")