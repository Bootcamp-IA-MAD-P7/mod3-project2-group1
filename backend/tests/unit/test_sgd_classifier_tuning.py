import pandas as pd

from ml.evaluation.sgd_classifier_tuning import (
    SGDClassifierTuningConfiguration,
    build_first_tuning_configurations,
    evaluate_tuning_configuration,
)


def development_frame() -> pd.DataFrame:
    """Create enough mixed-label videos for the common three-fold splitter.

    Cuatro filas por video garantizan que cada fold de entrenamiento tenga
    al menos 12 documentos, requisito del min_df=12 del pipeline definitivo.
    """
    return pd.DataFrame(
        {
            "VideoId": [f"v{video}" for video in range(1, 7) for _ in range(4)],
            "Text": [f"comment {row}" for row in range(24)],
            "IsToxic": [False, True] * 12,
        }
    )


def test_first_tuning_grid_has_6_unique_configurations():
    """The approved 3 × 2 alpha/penalty grid must be complete and unique."""
    configurations = build_first_tuning_configurations()

    assert len(configurations) == 6
    assert len(set(configurations)) == 6


def test_first_tuning_grid_variates_only_approved_alpha_and_penalty():
    """Only the two tuning parameters may change in the first round."""
    configurations = build_first_tuning_configurations()

    assert {configuration.alpha for configuration in configurations} == {1e-5, 1e-4, 1e-3}
    assert {configuration.penalty for configuration in configurations} == {"l2", "elasticnet"}
    assert all(configuration.loss == "log_loss" for configuration in configurations)


def test_tuning_result_exposes_configuration_folds_and_summary():
    """Each evaluated configuration must report its parts for comparison."""
    configuration = SGDClassifierTuningConfiguration(alpha=1e-4, penalty="l2")
    result = evaluate_tuning_configuration(development_frame(), configuration)

    assert result["configuration"] == {
        "alpha": 1e-4,
        "penalty": "l2",
        "loss": "log_loss",
    }
    assert [fold["fold"] for fold in result["folds"]] == [1, 2, 3]
    assert "f1_gap_percentage_points" in result["summary"]


def test_tuning_evaluates_every_configuration_without_video_overlap():
    """All configurations must train only on DEV folds with zero leakage."""
    for configuration in build_first_tuning_configurations():
        result = evaluate_tuning_configuration(development_frame(), configuration)

        assert all(fold["video_overlap"] == [] for fold in result["folds"])