"""Reproducible DEV experiment for the SGDClassifier candidate."""

import json
import sys
from pathlib import Path

import pandas as pd
from ml.data.dataset import (
    HOLDOUT_VIDEO_IDS,
    TARGET_COLUMN,
    TEXT_COLUMN,
    VIDEO_ID_COLUMN,
    create_grouped_cv,
    create_holdout_split,
    prepare_binary_dataset,
)
from ml.evaluation.sgd_classifier_cv import evaluate_sgd_classifier_cv
from ml.evaluation.sgd_classifier_tuning import (
    SGDClassifierTuningConfiguration,
    build_first_tuning_configurations,
    evaluate_tuning_configuration,
)
from sklearn.dummy import DummyClassifier
from sklearn.metrics import f1_score

DATA_PATH = Path("data/youtoxic_english_1000.csv")
REPORT_PATH = Path("docs/reports/experiments/sgd_classifier_dev.json")
MODEL_PATH = "backend"


def load_dev() -> tuple[pd.DataFrame, pd.DataFrame]:
    raw = pd.read_csv(DATA_PATH)
    prepared = prepare_binary_dataset(raw)
    dev, test = create_holdout_split(prepared)

    assert len(prepared) == 995, f"expected 995 prepared rows, got {len(prepared)}"
    assert len(dev) == 808, f"expected 808 DEV rows, got {len(dev)}"
    assert set(test[VIDEO_ID_COLUMN]).issubset(HOLDOUT_VIDEO_IDS), "TEST videos leaked"
    assert not set(dev[VIDEO_ID_COLUMN]) & set(test[VIDEO_ID_COLUMN]), "DEV/TEST overlap"
    return dev, test


def dummy_benchmark(dev: pd.DataFrame) -> dict:
    texts = dev[TEXT_COLUMN]
    targets = dev[TARGET_COLUMN]
    groups = dev[VIDEO_ID_COLUMN]
    results = []
    for fold_index, (train_idx, val_idx) in enumerate(
        create_grouped_cv().split(texts, targets, groups=groups), start=1
    ):
        if set(dev.iloc[train_idx][VIDEO_ID_COLUMN]) & set(
            dev.iloc[val_idx][VIDEO_ID_COLUMN]
        ):
            raise ValueError(f"VideoId overlap in Dummy fold {fold_index}")
        dummy = DummyClassifier(strategy="most_frequent")
        dummy.fit(dev.iloc[train_idx][TEXT_COLUMN], dev.iloc[train_idx][TARGET_COLUMN])
        y_pred = dummy.predict(dev.iloc[val_idx][TEXT_COLUMN])
        y_true = dev.iloc[val_idx][TARGET_COLUMN]
        results.append(f1_score(y_true, y_pred, pos_label=True, zero_division=0))
    return {"toxic_f1_mean": sum(results) / len(results)}


def main() -> None:
    sys.path.insert(0, MODEL_PATH)
    dev, _ = load_dev()

    baseline_pipeline = evaluate_sgd_classifier_cv(dev)
    baseline_reproduced = evaluate_sgd_classifier_cv(dev)
    assert baseline_pipeline["summary"] == baseline_reproduced["summary"], (
        "Baseline was not reproduced deterministically"
    )

    configurations = build_first_tuning_configurations()
    tuning_results = [
        evaluate_tuning_configuration(dev, configuration)
        for configuration in configurations
    ]

    best_configuration = max(
        tuning_results, key=lambda result: result["summary"]["validation_f1_mean"]
    )
    best_cfg = SGDClassifierTuningConfiguration(**best_configuration["configuration"])
    selected = evaluate_sgd_classifier_cv(
        dev, pipeline_factory=lambda: selected_factory(best_cfg)
    )

    dummy = dummy_benchmark(dev)

    tuning_folds = {
        fold["fold"]: fold for fold in best_configuration["folds"]
    }
    for fold in selected["folds"]:
        matched = tuning_folds[fold["fold"]]
        assert matched["validation_metrics"]["f1"] == fold["validation_metrics"]["f1"], (
            "Selected CV did not reproduce the tuning fold"
        )
        fold["vocabulary_size"] = matched["vocabulary_size"]
        fold["train_density"] = matched["train_density"]
        fold["validation_density"] = matched["validation_density"]

    report = build_report(
        dev=dev,
        baseline=baseline_pipeline,
        tuning_results=tuning_results,
        best_configuration=best_configuration,
        selected=selected,
        dummy=dummy,
    )

    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text(
        json.dumps(report, indent=2, allow_nan=False), encoding="utf-8"
    )
    print(json.dumps(report, indent=2))


def selected_factory(configuration: SGDClassifierTuningConfiguration):
    from ml.models.sgd_pipeline import create_sgd_pipeline

    return create_sgd_pipeline(alpha=configuration.alpha, penalty=configuration.penalty)


def build_report(dev, baseline, tuning_results, best_configuration, selected, dummy):
    summary = selected["summary"]
    folds = []
    for fold in selected["folds"]:
        v = fold["validation_metrics"]
        folds.append(
            {
                "fold": fold["fold"],
                "train_size": fold["train_size"],
                "validation_size": fold["validation_size"],
                "train_video_count": fold["train_video_count"],
                "validation_video_count": fold["validation_video_count"],
                "video_overlap": fold["video_overlap"],
                "vocabulary_size": fold["vocabulary_size"],
                "train_density": fold["train_density"],
                "validation_density": fold["validation_density"],
                "validation_metrics": {
                    "accuracy": v["accuracy"],
                    "precision": v["precision"],
                    "recall": v["recall"],
                    "f1": v["f1"],
                    "macro_f1": v["macro_f1"],
                    "confusion_matrix": v["confusion_matrix"],
                },
            }
        )
    baseline_summary = baseline["summary"]
    best_cfg = best_configuration["configuration"]
    sorted_tuning = sorted(
        tuning_results, key=lambda r: r["summary"]["validation_f1_mean"]
    )

    return {
        "model": "SGDClassifier",
        "selection_label": "best configuration observed on DEV",
        "environment": {"python": "3.12.7", "scikit_learn": "1.9.1", "pandas": "3.0.5"},
        "data_protocol": {
            "source": "youtoxic_english_1000.csv",
            "prepared_rows": 995,
            "development_rows": 808,
            "holdout_group_column": "VideoId",
            "test_sealed": True,
            "test_used_for_fitting_tuning_prediction_metrics_or_inspection": False,
            "cross_validation": {
                "strategy": "StratifiedGroupKFold",
                "n_splits": 3,
                "shuffle": True,
                "random_state": 42,
                "zero_video_overlap_per_fold": True,
            },
            "primary_metric": "toxic_class_f1_validation_mean",
        },
        "selected_configuration": {
            "loss": "log_loss",
            "alpha": best_cfg["alpha"],
            "penalty": best_cfg["penalty"],
            "random_state": 42,
            "max_iter": 1000,
            "min_df": 1,
            "max_features": None,
            "ngram_range": [1, 2],
            "threshold_tuning": False,
            "resampling": False,
        },
        "baseline": {
            "configuration": {"alpha": 1e-4, "penalty": "l2"},
            "reproduced_deterministically": True,
            "validation_f1_mean": baseline_summary["validation_f1_mean"],
            "validation_f1_std": baseline_summary["validation_f1_std"],
            "validation_precision_mean": baseline_summary["validation_precision_mean"],
            "validation_recall_mean": baseline_summary["validation_recall_mean"],
            "validation_macro_f1_mean": baseline_summary["validation_macro_f1_mean"],
            "validation_accuracy_mean": baseline_summary["validation_accuracy_mean"],
            "train_f1_mean": baseline_summary["train_f1_mean"],
            "f1_gap_percentage_points": baseline_summary["f1_gap_percentage_points"],
        },
        "tuning": {
            "round_1": {
                "candidate_count": len(tuning_results),
                "grid": {
                    "alpha": [1e-5, 1e-4, 1e-3],
                    "penalty": ["l2", "elasticnet"],
                },
                "best_configuration": best_cfg,
                "best_validation_f1_mean": best_configuration["summary"][
                    "validation_f1_mean"
                ],
                "ranked": [
                    {
                        "configuration": result["configuration"],
                        "validation_f1_mean": result["summary"]["validation_f1_mean"],
                        "validation_macro_f1_mean": result["summary"][
                            "validation_macro_f1_mean"
                        ],
                        "f1_gap_percentage_points": result["summary"][
                            "f1_gap_percentage_points"
                        ],
                    }
                    for result in sorted_tuning
                ],
            }
        },
        "selected_results": {
            "summary": {
                "validation_f1_mean": summary["validation_f1_mean"],
                "validation_f1_std": summary["validation_f1_std"],
                "validation_precision_mean": summary["validation_precision_mean"],
                "validation_recall_mean": summary["validation_recall_mean"],
                "validation_macro_f1_mean": summary["validation_macro_f1_mean"],
                "validation_accuracy_mean": summary["validation_accuracy_mean"],
                "train_f1_mean": summary["train_f1_mean"],
                "f1_gap_percentage_points": summary["f1_gap_percentage_points"],
            },
            "folds": folds,
        },
        "dummy_benchmark": {**dummy},
        "comparison": {
            "logistic_regression_best_validation_f1_mean": 0.5518354735036822,
            "sgd_best_validation_f1_mean": summary["validation_f1_mean"],
            "vs_lr_f1_pp": (
                summary["validation_f1_mean"] - 0.5518354735036822
            )
            * 100,
            "vs_dummy_f1_pp": (summary["validation_f1_mean"] - dummy["toxic_f1_mean"])
            * 100,
        },
        "limitations": [
            "Only nine VideoId groups in DEV",
            "Substantial video-level distribution shift",
            "SGDClassifier(log_loss) overlaps conceptually with Logistic Regression (linear model, log-loss); the final choice rests on the ML-01 comparison, not on this change",
            f"Train-validation gap remains {summary['f1_gap_percentage_points']:.2f} percentage points",
            "margin/score is not calibrated and is not presented as probability",
        ],
    }


if __name__ == "__main__":
    main()