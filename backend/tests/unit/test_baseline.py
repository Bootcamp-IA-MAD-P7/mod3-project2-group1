from sklearn.dummy import DummyClassifier

from ml.models.baseline import create_dummy_classifier


def test_create_dummy_classifier_returns_dummy_classifier():
    """El baseline común debe utilizar DummyClassifier."""
    model = create_dummy_classifier()

    assert isinstance(model, DummyClassifier)


def test_dummy_classifier_uses_most_frequent_strategy():
    """El baseline debe predecir siempre la clase más frecuente."""
    model = create_dummy_classifier()

    assert model.strategy == "most_frequent"