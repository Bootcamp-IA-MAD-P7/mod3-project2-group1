from sklearn.linear_model import LogisticRegression

from ml.models.logistic_regression import create_logistic_regression


def test_create_logistic_regression_returns_logistic_regression():
    """El modelo debe utilizar LogisticRegression de scikit-learn."""
    model = create_logistic_regression()

    assert isinstance(model, LogisticRegression)


def test_logistic_regression_uses_reproducible_configuration():
    """La configuración inicial debe ser reproducible."""
    model = create_logistic_regression()

    assert model.random_state == 42


def test_logistic_regression_uses_sufficient_iterations():
    """El modelo debe disponer de suficientes iteraciones para converger."""
    model = create_logistic_regression()

    assert model.max_iter == 1000


def test_logistic_regression_accepts_explicit_regularization_strength():
    """The tuning round must be able to vary only the approved C parameter."""
    model = create_logistic_regression(c=0.1)

    assert model.C == 0.1
