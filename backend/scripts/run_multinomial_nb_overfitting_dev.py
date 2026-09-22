"""DEV-only overfitting-control experiment for the MultinomialNB candidate.

Evaluates the frozen configuration (baseline) against vocabulary-pruned and
smoothing treatments on the common grouped DEV folds, mirroring the
min_df-driven workstreams already applied to LinearSVC, SGDClassifier and
LogisticRegression.
"""

import json
import platform
import sys
from pathlib import Path

import pandas as pd
import sklearn

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from ml.data.dataset import (
    HOLDOUT_VIDEO_IDS,
    TARGET_COLUMN,
    TEXT_COLUMN,
    VIDEO_ID_COLUMN,
    create_grouped_cv,
    prepare_binary_dataset,
)
from ml.evaluation.multinomial_nb_overfitting import (
    FROZEN_MULTINOMIAL_NB_ALPHA,
    FROZEN_MULTINOMIAL_NB_MIN_DF,
    FROZEN_MULTINOMIAL_NB_NGRAM_RANGE,
    TREATMENT_ALPHA_GRID,
    TREATMENT_MIN_DF,
    TREATMENT_NGRAM_RANGE,
    MultinomialNbOverfittingConfiguration,
    evaluate_multinomial_nb_configuration,
)
from ml.model_selection import pick_overfitting_aware_configuration

ROOT = Path(__file__).resolve().parents[2]
DATA_PATH = ROOT / "data" / "youtoxic_english_1000.csv"
REPORT_PATH = ROOT / "docs" / "reports" / "experiments" / "multinomial_nb_overfitting_dev.json"

MIN_DF_SWEEP = (1, 2, 3, 5, 8, 10, 12, 15, 20)
FROZEN_HISTORICAL_F1_MEAN = 0.5517
FROZEN_HISTORICAL_GAP_PP = 44.69312470002915


def load_development_data() -> pd.DataFrame:
    """Load prepared DEV only, excluding the sealed holdout before evaluation."""
    prepared = prepare_binary_dataset(pd.read_csv(DATA_PATH))
    development_data = prepared.loc[
        ~prepared[VIDEO_ID_COLUMN].isin(HOLDOUT_VIDEO_IDS)
    ].copy()
    development_data.reset_index(drop=True, inplace=True)

    assert len(prepared) == 995, f"expected 995 prepared rows, got {len(prepared)}"
    assert len(development_data) == 808, (
        f"expected 808 DEV rows, got {len(development_data)}"
    )
    assert not set(development_data[VIDEO_ID_COLUMN]) & HOLDOUT_VIDEO_IDS, (
        "sealed TEST VideoIds leaked into DEV"
    )
    return development_data


def dummy_benchmark(development_data: pd.DataFrame) -> float:
    """Evaluate the common most_frequent Dummy on the same DEV folds."""
    from sklearn.metrics import f1_score

    from ml.models.baseline import create_dummy_classifier

    texts = development_data[TEXT_COLUMN]
    targets = development_data[TARGET_COLUMN]
    groups = development_data[VIDEO_ID_COLUMN]
    results = []
    for _, (train_indices, validation_indices) in enumerate(
        create_grouped_cv().split(texts, targets, groups=groups), start=1
    ):
        if set(development_data.iloc[train_indices][VIDEO_ID_COLUMN]) & set(
            development_data.iloc[validation_indices][VIDEO_ID_COLUMN]
        ):
            raise ValueError("VideoId overlap in Dummy fold")
        dummy = create_dummy_classifier()
        dummy.fit(development_data.iloc[train_indices][TEXT_COLUMN], development_data.iloc[train_indices][TARGET_COLUMN])
        y_pred = dummy.predict(development_data.iloc[validation_indices][TEXT_COLUMN])
        y_true = development_data.iloc[validation_indices][TARGET_COLUMN]
        results.append(f1_score(y_true, y_pred, pos_label=True, zero_division=0))
    return sum(results) / len(results)


def main() -> None:
    """Run the experiment and write the DEV evidence report."""
    development_data = load_development_data()

    frozen = evaluate_multinomial_nb_configuration(
        development_data,
        MultinomialNbOverfittingConfiguration(
            alpha=FROZEN_MULTINOMIAL_NB_ALPHA,
            min_df=FROZEN_MULTINOMIAL_NB_MIN_DF,
            ngram_range=FROZEN_MULTINOMIAL_NB_NGRAM_RANGE,
        ),
    )
    reproduced = evaluate_multinomial_nb_configuration(
        development_data,
        MultinomialNbOverfittingConfiguration(
            alpha=FROZEN_MULTINOMIAL_NB_ALPHA,
            min_df=FROZEN_MULTINOMIAL_NB_MIN_DF,
            ngram_range=FROZEN_MULTINOMIAL_NB_NGRAM_RANGE,
        ),
    )
    assert frozen["summary"] == reproduced["summary"], (
        "Frozen configuration was not reproduced deterministically"
    )
    reported_mean = frozen["summary"]["validation_f1_mean"]
    reported_gap = frozen["summary"]["f1_gap_percentage_points"]
    assert abs(reported_mean - FROZEN_HISTORICAL_F1_MEAN) < 0.001, (
        f"historical mean F1 not reproduced: expected {FROZEN_HISTORICAL_F1_MEAN}, got {reported_mean}"
    )
    assert abs(reported_gap - FROZEN_HISTORICAL_GAP_PP) < 0.05, (
        f"historical gap not reproduced: expected {FROZEN_HISTORICAL_GAP_PP}, got {reported_gap}"
    )

    min_df_results = [
        evaluate_multinomial_nb_configuration(
            development_data,
            MultinomialNbOverfittingConfiguration(
                alpha=FROZEN_MULTINOMIAL_NB_ALPHA,
                min_df=min_df,
                ngram_range=TREATMENT_NGRAM_RANGE,
            ),
        )
        for min_df in MIN_DF_SWEEP
    ]

    alpha_results = [
        evaluate_multinomial_nb_configuration(
            development_data,
            MultinomialNbOverfittingConfiguration(
                alpha=alpha,
                min_df=TREATMENT_MIN_DF,
                ngram_range=TREATMENT_NGRAM_RANGE,
            ),
        )
        for alpha in TREATMENT_ALPHA_GRID
    ]

    candidates = [frozen, *min_df_results, *alpha_results]
    selected = pick_overfitting_aware_configuration(candidates)

    dummy_f1_mean = dummy_benchmark(development_data)

    report = build_report(
        development_data=development_data,
        frozen=frozen,
        min_df_results=min_df_results,
        alpha_results=alpha_results,
        selected=selected,
        dummy_f1_mean=dummy_f1_mean,
    )
    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text(
        json.dumps(report, indent=2, allow_nan=False), encoding="utf-8"
    )
    print(json.dumps(report, indent=2))


def build_report(
    development_data,
    frozen,
    min_df_results,
    alpha_results,
    selected,
    dummy_f1_mean,
) -> dict:
    """Build a structured, comparable DEV-only evidence artifact."""
    dense_summary = lambda result: result["summary"]
    rank_by_gap = lambda results: sorted(
        results, key=lambda result: result["summary"]["f1_gap_percentage_points"]
    )

    return {
        "model": "MultinomialNB",
        "selection_label": "overfitting-aware configuration observed on DEV (min_df + unigram + alpha smoothing)",
        "environment": {
            "python": platform.python_version(),
            "scikit_learn": sklearn.__version__,
            "pandas": pd.__version__,
        },
        "data_protocol": {
            "source": "youtoxic_english_1000.csv",
            "prepared_rows": 995,
            "development_rows": len(development_data),
            "holdout_group_column": VIDEO_ID_COLUMN,
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
        "frozen_configuration": {
            "alpha": FROZEN_MULTINOMIAL_NB_ALPHA,
            "ngram_range": list(FROZEN_MULTINOMIAL_NB_NGRAM_RANGE),
            "min_df": FROZEN_MULTINOMIAL_NB_MIN_DF,
            "reproduced_on_dev": True,
            "reported_validation_f1_mean": FROZEN_HISTORICAL_F1_MEAN,
            "reported_f1_gap_percentage_points": FROZEN_HISTORICAL_GAP_PP,
            "summary": dense_summary(frozen),
        },
        "overfitting_experiments": {
            "min_df_impact": {
                "min_df_values": list(MIN_DF_SWEEP),
                "ngram_range": list(TREATMENT_NGRAM_RANGE),
                "alpha": FROZEN_MULTINOMIAL_NB_ALPHA,
                "ranked_by_gap": [
                    {
                        "configuration": result["configuration"],
                        "validation_f1_mean": result["summary"]["validation_f1_mean"],
                        "train_f1_mean": result["summary"]["train_f1_mean"],
                        "f1_gap_percentage_points": result["summary"][
                            "f1_gap_percentage_points"
                        ],
                    }
                    for result in rank_by_gap(min_df_results)
                ],
            },
            "alpha_smoothing": {
                "alpha_values": list(TREATMENT_ALPHA_GRID),
                "min_df": TREATMENT_MIN_DF,
                "ngram_range": list(TREATMENT_NGRAM_RANGE),
                "ranked_by_gap": [
                    {
                        "configuration": result["configuration"],
                        "validation_f1_mean": result["summary"]["validation_f1_mean"],
                        "train_f1_mean": result["summary"]["train_f1_mean"],
                        "f1_gap_percentage_points": result["summary"][
                            "f1_gap_percentage_points"
                        ],
                    }
                    for result in rank_by_gap(alpha_results)
                ],
            },
        },
        "selected_configuration": selected["configuration"],
        "selected_results": {
            "summary": dense_summary(selected),
            "folds": selected["folds"],
        },
        "dummy_benchmark": {"toxic_f1_mean": dummy_f1_mean},
        "overfitting_assessment": {
            "train_f1_mean": selected["summary"]["train_f1_mean"],
            "validation_f1_mean": selected["summary"]["validation_f1_mean"],
            "f1_gap_percentage_points": selected["summary"][
                "f1_gap_percentage_points"
            ],
            "gap_below_5_pp": selected["summary"]["f1_gap_percentage_points"] < 5,
            "not_solved_indicator": "gap remains well above 5 pp",
            "reduction_vs_frozen_gap_pp": (
                FROZEN_HISTORICAL_GAP_PP
                - selected["summary"]["f1_gap_percentage_points"]
            ),
            "improvement_distinction": (
                "training F1 drops towards a plausible level while validation F1 "
                "is preserved or improved; this is reduction of overfitting, not "
                "elimination of it"
            ),
        },
        "limitations": [
            "Only nine VideoId groups in DEV",
            "Substantial video-level distribution shift",
            "MultinomialNB is evaluated on TF-IDF sublinear features, which violate the multinomial-count assumption; scores are not calibrated probabilities",
            "No threshold tuning was performed",
            "No TEST evaluation was performed; TEST remains sealed",
        ],
    }


if __name__ == "__main__":
    main()