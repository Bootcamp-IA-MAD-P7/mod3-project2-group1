from ml.evaluation.logistic_regression_tuning import (
    TuningConfiguration,
    build_first_tuning_configurations,
    build_second_tuning_configurations,
    build_third_tuning_configurations,
)


def test_first_tuning_grid_has_24_unique_configurations_and_baseline_control():
    """The approved grid must include each combination and the exact baseline."""
    configurations = build_first_tuning_configurations()
    baseline = TuningConfiguration(1.0, 1, None, (1, 2))

    assert len(configurations) == 24
    assert len(set(configurations)) == 24
    assert baseline in configurations


def test_second_tuning_grid_varies_only_the_approved_c_values():
    """The second round keeps the selected feature configuration fixed."""
    configurations = build_second_tuning_configurations()

    assert [configuration.c for configuration in configurations] == [
        0.25,
        0.50,
        0.75,
        1.00,
        1.50,
        2.00,
    ]
    assert all(configuration.min_df == 2 for configuration in configurations)
    assert all(configuration.max_features is None for configuration in configurations)
    assert all(configuration.ngram_range == (1, 1) for configuration in configurations)


def test_third_tuning_grid_has_the_final_approved_c_values():
    """The final round must include its control and not expand the C range."""
    configurations = build_third_tuning_configurations()

    assert [configuration.c for configuration in configurations] == [2.0, 2.5, 3.0, 4.0, 5.0]
    assert all(configuration.min_df == 2 for configuration in configurations)
    assert all(configuration.max_features is None for configuration in configurations)
    assert all(configuration.ngram_range == (1, 1) for configuration in configurations)
