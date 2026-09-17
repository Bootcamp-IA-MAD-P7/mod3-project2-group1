import pandas as pd
import pytest

from ml.evaluation.linear_svc_tuning import (
    TuningConfiguration,
    build_first_tuning_configurations,
    build_second_tuning_configurations,
    evaluate_linear_svc_configuration,
    select_best_tuning_configuration,
)


class RecordingPipeline:
    """Minimal pipeline double used to observe fold-level tuning."""

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


def test_first_tuning_grid_has_6_unique_configurations_and_control():
    """The approved grid must include each combination and the exact control."""
    configurations = build_first_tuning_configurations()
    control = TuningConfiguration(1.0, 1, None, (1, 2))

    assert len(configurations) == 6
    assert len(set(configurations)) == 6
    assert control in configurations

    for configuration in configurations:
        assert configuration.c in {0.01, 0.1, 1.0}
        assert configuration.ngram_range in {(1, 1), (1, 2)}
        assert configuration.min_df == 1
        assert configuration.max_features is None


@pytest.mark.parametrize(
    ("c_star", "expected_c_values"),
    [
        (0.01, [0.0025, 0.005, 0.01, 0.02, 0.04]),
        (0.1, [0.025, 0.05, 0.1, 0.2, 0.4]),
        (1.0, [0.25, 0.5, 1.0, 2.0, 4.0]),
    ],
)
def test_second_tuning_grid_depends_on_round_one_winner(
    c_star: float, expected_c_values: list[float]
):
    """Round 2 must evaluate exactly {C*/4, C*/2, C*, 2C*, 4C*}."""
    configurations = build_second_tuning_configurations(c_star, ngram_range=(1, 2))

    assert [configuration.c for configuration in configurations] == expected_c_values
    assert len(configurations) == 5
    assert len(set(configurations)) == 5


def test_second_tuning_grid_keeps_winner_ngram_and_includes_control():
    """Round 2 must fix ngram_range to the round-one winner and repeat C*."""
    winner_ngram = (1, 1)
    configurations = build_second_tuning_configurations(c_star=1.0, ngram_range=winner_ngram)

    assert all(configuration.ngram_range == winner_ngram for configuration in configurations)
    assert all(configuration.min_df == 1 for configuration in configurations)
    assert all(configuration.max_features is None for configuration in configurations)

    assert TuningConfiguration(1.0, 1, None, winner_ngram) in configurations


def test_selection_uses_exclusively_validation_f1_mean():
    """The best configuration must be chosen by mean validation F1 on DEV."""
    evaluations = [
        {
            "configuration": TuningConfiguration(0.1, 1, None, (1, 2)),
            "summary": {
                "validation_f1_mean": 0.5000,
                "validation_macro_f1_mean": 0.7000,
                "f1_gap_percentage_points": 10.0,
            },
        },
        {
            "configuration": TuningConfiguration(1.0, 1, None, (1, 2)),
            "summary": {
                "validation_f1_mean": 0.5500,
                "validation_macro_f1_mean": 0.6000,
                "f1_gap_percentage_points": 20.0,
            },
        },
    ]

    best = select_best_tuning_configuration(evaluations)

    assert best["configuration"].c == 1.0
    assert best["summary"]["validation_f1_mean"] == 0.5500


def test_selection_prefers_smaller_c_on_near_tie_below_tolerance():
    """A near tie (< 0.0001) must resolve to the smaller C deterministically."""
    evaluations = [
        {
            "configuration": TuningConfiguration(1.0, 1, None, (1, 2)),
            "summary": {
                "validation_f1_mean": 0.50005,
                "validation_macro_f1_mean": 0.6000,
                "f1_gap_percentage_points": 10.0,
            },
        },
        {
            "configuration": TuningConfiguration(0.1, 1, None, (1, 2)),
            "summary": {
                "validation_f1_mean": 0.50000,
                "validation_macro_f1_mean": 0.6000,
                "f1_gap_percentage_points": 10.0,
            },
        },
    ]

    best = select_best_tuning_configuration(evaluations)

    assert best["configuration"].c == 0.1


def test_macro_f1_and_gap_do_not_alter_selection():
    """macro-F1 and gap are recorded but must never change the F1-based choice."""
    evaluations = [
        {
            "configuration": TuningConfiguration(0.1, 1, None, (1, 2)),
            "summary": {
                "validation_f1_mean": 0.5800,
                "validation_macro_f1_mean": 0.4000,
                "f1_gap_percentage_points": 45.0,
            },
        },
        {
            "configuration": TuningConfiguration(1.0, 1, None, (1, 2)),
            "summary": {
                "validation_f1_mean": 0.5000,
                "validation_macro_f1_mean": 0.6500,
                "f1_gap_percentage_points": 20.0,
            },
        },
    ]

    best = select_best_tuning_configuration(evaluations)

    assert best["configuration"].c == 0.1


def test_evaluate_configuration_records_macro_f1_and_gap_on_dev_only():
    """Tuning evaluates DEV folds, records macro-F1 and gap, and never touches TEST."""
    configuration = TuningConfiguration(1.0, 1, None, (1, 2))
    created_pipelines = []

    def pipeline_factory():
        pipeline = RecordingPipeline()
        created_pipelines.append(pipeline)
        return pipeline

    result = evaluate_linear_svc_configuration(
        development_frame(), configuration, pipeline_factory=pipeline_factory
    )

    assert [fold["fold"] for fold in result["folds"]] == [1, 2, 3]
    assert len(created_pipelines) == 3
    for fold in result["folds"]:
        assert "macro_f1" in fold["validation_metrics"]
        assert "f1" in fold["validation_metrics"]

    assert "validation_f1_mean" in result["summary"]
    assert "validation_macro_f1_mean" in result["summary"]
    assert "f1_gap_percentage_points" in result["summary"]