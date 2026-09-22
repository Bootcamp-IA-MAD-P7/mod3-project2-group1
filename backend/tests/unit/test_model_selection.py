import pytest

from ml.model_selection import pick_overfitting_aware_configuration


def candidate(gap: float, validation_f1: float) -> dict:
    return {
        "summary": {
            "f1_gap_percentage_points": gap,
            "validation_f1_mean": validation_f1,
        }
    }


def test_selects_lowest_gap_among_competitive_candidates():
    """Within the competitive F1 band the smallest gap must win."""
    selected = pick_overfitting_aware_configuration(
        [
            candidate(gap=44.69, validation_f1=0.5517),
            candidate(gap=24.58, validation_f1=0.5600),
            candidate(gap=27.60, validation_f1=0.5550),
        ]
    )

    assert selected["summary"]["f1_gap_percentage_points"] == 24.58


def test_excludes_candidates_that_lose_validation_f1():
    """A much lower gap does not win if validation F1 collapses."""
    selected = pick_overfitting_aware_configuration(
        [
            candidate(gap=30.0, validation_f1=0.60),
            candidate(gap=5.0, validation_f1=0.30),
        ]
    )

    assert selected["summary"]["f1_gap_percentage_points"] == 30.0


def test_breaks_ties_by_higher_validation_f1():
    """Equal gaps are resolved by the higher validation F1."""
    selected = pick_overfitting_aware_configuration(
        [
            candidate(gap=25.0, validation_f1=0.50),
            candidate(gap=25.0, validation_f1=0.58),
        ]
    )

    assert selected["summary"]["validation_f1_mean"] == 0.58


def test_rejects_empty_candidate_list():
    """Selection requires at least one candidate."""
    with pytest.raises(ValueError):
        pick_overfitting_aware_configuration([])