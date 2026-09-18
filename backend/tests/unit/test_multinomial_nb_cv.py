import pandas as pd
import pytest

from ml.evaluation.multinomial_nb_cv import evaluate_selected_multinomial_nb_cv
from scripts.run_multinomial_nb_dev import assert_historical_reproduction


def development_frame() -> pd.DataFrame:
    """Create enough mixed-label VideoIds for the common three-fold splitter."""
    return pd.DataFrame(
        {
            "VideoId": [f"v{video}" for video in range(1, 7) for _ in range(2)],
            "Text": [f"comment {row}" for row in range(12)],
            "IsToxic": [False, True] * 6,
        }
    )


class OverlappingSplitter:
    """Splitter double that leaks a VideoId into both partitions."""

    def split(self, texts, targets, groups=None):
        indices = list(range(len(texts)))
        yield indices, indices


def test_selected_mnb_cv_returns_three_folds_with_no_video_overlap():
    result = evaluate_selected_multinomial_nb_cv(development_frame())

    assert [fold["fold"] for fold in result["folds"]] == [1, 2, 3]
    assert all(fold["video_overlap"] == [] for fold in result["folds"])


def test_selected_mnb_cv_creates_a_fresh_vectorizer_for_each_fold(monkeypatch):
    from ml.evaluation import multinomial_nb_cv

    original_factory = multinomial_nb_cv.create_tfidf_vectorizer
    created_vectorizers = []

    def recording_factory(**kwargs):
        vectorizer = original_factory(**kwargs)
        created_vectorizers.append(vectorizer)
        return vectorizer

    monkeypatch.setattr(
        multinomial_nb_cv, "create_tfidf_vectorizer", recording_factory
    )

    evaluate_selected_multinomial_nb_cv(development_frame())

    assert len(created_vectorizers) == 3
    assert len({id(vectorizer) for vectorizer in created_vectorizers}) == 3


def test_selected_mnb_cv_aborts_when_video_overlap_is_detected(monkeypatch):
    from ml.evaluation import multinomial_nb_cv

    monkeypatch.setattr(
        multinomial_nb_cv, "create_grouped_cv", lambda: OverlappingSplitter()
    )

    with pytest.raises(ValueError, match="VideoId overlap"):
        evaluate_selected_multinomial_nb_cv(development_frame())


def test_selected_mnb_cv_returns_comparison_metrics_and_configuration():
    result = evaluate_selected_multinomial_nb_cv(development_frame())

    assert result["configuration"] == {
        "alpha": 0.01,
        "ngram_range": (1, 2),
        "min_df": 1,
        "max_features": None,
        "augmentation": False,
    }
    assert set(result["summary"]) == {
        "validation_f1_mean",
        "validation_f1_std",
        "validation_f1_min",
        "validation_f1_max",
        "validation_precision_mean",
        "validation_recall_mean",
        "validation_macro_f1_mean",
        "validation_accuracy_mean",
        "train_f1_mean",
        "f1_gap_percentage_points",
    }
    assert {
        "accuracy",
        "precision",
        "recall",
        "f1",
        "macro_f1",
        "confusion_matrix",
    } == set(result["folds"][0]["validation_metrics"])


def test_historical_reproduction_guard_rejects_a_different_f1():
    result = {
        "summary": {"validation_f1_mean": 0.4},
        "folds": [
            {"validation_metrics": {"f1": 0.4}},
            {"validation_metrics": {"f1": 0.4}},
            {"validation_metrics": {"f1": 0.4}},
        ],
    }

    with pytest.raises(RuntimeError, match="Historical mean F1"):
        assert_historical_reproduction(result)
