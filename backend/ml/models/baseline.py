"""Common dummy baseline for toxicity classification."""

from sklearn.dummy import DummyClassifier


def create_dummy_classifier() -> DummyClassifier:
    """Create the common baseline classifier used for model comparison."""
    return DummyClassifier(strategy="most_frequent")