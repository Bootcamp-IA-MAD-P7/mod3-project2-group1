import pandas as pd

from ml.evaluation.logistic_regression_cv import evaluate_logistic_regression_cv


class RecordingPipeline:
    """Minimal pipeline double used to observe fold-level fitting."""

    def __init__(self):
        self.fit_calls = 0

    def fit(self, texts, targets):
        self.fit_calls += 1
        return self

    def predict(self, texts):
        return [False] * len(texts)


def development_frame() -> pd.DataFrame:
    """Create enough mixed-label videos for the common three-fold splitter."""
    return pd.DataFrame(
        {
            "VideoId": [f"v{video}" for video in range(1, 7) for _ in range(2)],
            "Text": [f"comment {row}" for row in range(12)],
            "IsToxic": [False, True] * 6,
        }
    )


def test_grouped_cv_returns_three_folds_without_video_overlap():
    """DEV evaluation must expose exactly the three disjoint group folds."""
    result = evaluate_logistic_regression_cv(
        development_frame(), pipeline_factory=RecordingPipeline
    )

    assert [fold["fold"] for fold in result["folds"]] == [1, 2, 3]
    assert all(fold["video_overlap"] == [] for fold in result["folds"])


def test_grouped_cv_creates_a_fresh_pipeline_for_each_fold():
    """Each fold must fit its own pipeline, preventing learned-state reuse."""
    created_pipelines = []

    def pipeline_factory():
        pipeline = RecordingPipeline()
        created_pipelines.append(pipeline)
        return pipeline

    evaluate_logistic_regression_cv(development_frame(), pipeline_factory=pipeline_factory)

    assert len(created_pipelines) == 3
    assert len({id(pipeline) for pipeline in created_pipelines}) == 3
    assert [pipeline.fit_calls for pipeline in created_pipelines] == [1, 1, 1]


def test_grouped_cv_returns_fold_metrics_and_aggregate_summary():
    """The result must retain per-fold metrics and the requested aggregate values."""
    result = evaluate_logistic_regression_cv(
        development_frame(), pipeline_factory=RecordingPipeline
    )

    expected_metric_keys = {"accuracy", "precision", "recall", "f1", "confusion_matrix"}
    expected_summary_keys = {
        "validation_f1_mean",
        "validation_f1_std",
        "validation_accuracy_mean",
        "validation_precision_mean",
        "validation_recall_mean",
        "train_f1_mean",
        "f1_gap_percentage_points",
        "f1_gap_below_5_percentage_points",
    }

    for fold in result["folds"]:
        assert fold["train_metrics"].keys() == expected_metric_keys
        assert fold["validation_metrics"].keys() == expected_metric_keys
        assert fold["train_video_count"] > 0
        assert fold["validation_video_count"] > 0

    assert result["summary"].keys() == expected_summary_keys
