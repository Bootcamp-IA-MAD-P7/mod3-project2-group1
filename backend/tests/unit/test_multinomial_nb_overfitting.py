import pandas as pd

from ml.evaluation.multinomial_nb_overfitting import (
    MultinomialNbOverfittingConfiguration,
    evaluate_multinomial_nb_configuration,
)


def development_frame() -> pd.DataFrame:
    """Create enough mixed-label videos for the common three-fold splitter.

    Seis filas por video garantizan documentos suficientes por fold para los
    min_df probados y mantienen la partición por grupos coherente.
    """
    return pd.DataFrame(
        {
            "VideoId": [f"v{video}" for video in range(1, 13) for _ in range(6)],
            "Text": [f"comment {row}" for row in range(72)],
            "IsToxic": [False, True] * 36,
        }
    )


def test_configuration_exposes_treatment_parameters():
    """The treatment configuration must expose alpha, min_df and ngram_range."""
    configuration = MultinomialNbOverfittingConfiguration(
        alpha=0.1, min_df=12, ngram_range=(1, 1)
    )

    assert configuration.alpha == 0.1
    assert configuration.min_df == 12
    assert configuration.ngram_range == (1, 1)
    assert configuration.max_features is None


def test_result_exposes_configuration_folds_and_summary():
    """Each evaluated configuration must report its parts for comparison."""
    configuration = MultinomialNbOverfittingConfiguration(alpha=0.1, min_df=3)
    result = evaluate_multinomial_nb_configuration(development_frame(), configuration)

    assert result["configuration"] == {
        "alpha": 0.1,
        "ngram_range": [1, 1],
        "min_df": 3,
        "max_features": None,
        "augmentation": False,
    }
    assert [fold["fold"] for fold in result["folds"]] == [1, 2, 3]
    assert "f1_gap_percentage_points" in result["summary"]
    assert "train_f1_mean" in result["summary"]
    assert "validation_f1_mean" in result["summary"]


def test_evaluation_reports_vocabulary_size_and_density():
    """Each fold must expose vocabulary size and matrix density."""
    configuration = MultinomialNbOverfittingConfiguration(alpha=0.1, min_df=1)
    result = evaluate_multinomial_nb_configuration(development_frame(), configuration)

    for fold in result["folds"]:
        assert fold["vocabulary_size"] > 0
        assert 0 < fold["train_density"] <= 1
        assert 0 < fold["validation_density"] <= 1


def test_evaluates_without_video_overlap():
    """Configuration evaluation must train only on DEV folds with zero leakage."""
    configuration = MultinomialNbOverfittingConfiguration(alpha=0.5, min_df=5)

    for fold in evaluate_multinomial_nb_configuration(
        development_frame(), configuration
    )["folds"]:
        assert fold["video_overlap"] == []