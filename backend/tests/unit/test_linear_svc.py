from sklearn.svm import LinearSVC

from ml.models.linear_svc import create_linear_svc


def test_create_linear_svc_returns_linear_svc():
    """El modelo debe utilizar LinearSVC de scikit-learn."""
    model = create_linear_svc()

    assert isinstance(model, LinearSVC)


def test_create_linear_svc_uses_reproducible_configuration():
    """La configuración inicial debe ser reproducible."""
    model = create_linear_svc()

    assert model.random_state == 42


def test_create_linear_svc_uses_sufficient_iterations():
    """El modelo debe disponer de suficientes iteraciones para converger."""
    model = create_linear_svc()

    assert model.max_iter == 1000


def test_create_linear_svc_accepts_explicit_regularization_strength():
    """The tuning round must be able to vary only the approved C parameter."""
    model = create_linear_svc(c=0.1)

    assert model.C == 0.1


def test_linear_svc_does_not_expose_probabilities():
    """LinearSVC no produce probabilidades: el margen no debe confundirse con ellas."""
    model = create_linear_svc()

    assert not hasattr(model, "predict_proba")