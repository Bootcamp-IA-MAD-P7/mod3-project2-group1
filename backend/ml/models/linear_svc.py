"""LinearSVC model for binary toxicity classification."""

from sklearn.svm import LinearSVC


RANDOM_STATE = 42
MAX_ITER = 1000


def create_linear_svc(*, c: float = 1.0, loss: str = "squared_hinge") -> LinearSVC:
    """Create the LinearSVC classifier with reproducible settings.

    Nota: LinearSVC no expone predict_proba; decision_function() devuelve un
    margen, no una probabilidad, y no debe documentarse como tal.
    """
    return LinearSVC(
        C=c,
        loss=loss,
        random_state=RANDOM_STATE,
        max_iter=MAX_ITER,
    )