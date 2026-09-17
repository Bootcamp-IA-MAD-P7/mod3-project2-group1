from sklearn.linear_model import SGDClassifier

from ml.models.sgd_classifier import create_sgd_classifier


def test_create_sgd_classifier_returns_sgd_classifier():
    """El modelo debe utilizar SGDClassifier de scikit-learn."""
    model = create_sgd_classifier()

    assert isinstance(model, SGDClassifier)


def test_sgd_classifier_uses_log_loss_by_default():
    """El cuarto clásico debe usar loss=log_loss por defecto."""
    model = create_sgd_classifier()

    assert model.loss == "log_loss"


def test_sgd_classifier_uses_reproducible_configuration():
    """La configuración inicial debe ser reproducible."""
    model = create_sgd_classifier()

    assert model.random_state == 42
    assert model.max_iter == 1000


def test_sgd_classifier_uses_regularized_defaults():
    """Los defaults deben ser regulares y reproducibles."""
    model = create_sgd_classifier()

    assert model.penalty == "l2"
    assert model.alpha == 1e-4


def test_sgd_classifier_accepts_explicit_alpha_and_penalty():
    """The tuning round must be able to vary the approved parameters."""
    model = create_sgd_classifier(alpha=1e-3, penalty="elasticnet")

    assert model.alpha == 1e-3
    assert model.penalty == "elasticnet"