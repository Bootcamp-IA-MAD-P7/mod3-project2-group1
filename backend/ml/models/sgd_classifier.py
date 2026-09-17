"""SGDClassifier model for binary toxicity classification."""

from sklearn.linear_model import SGDClassifier


RANDOM_STATE = 42
MAX_ITER = 1000


def create_sgd_classifier(
    *,
    loss: str = "log_loss",
    penalty: str = "l2",
    alpha: float = 1e-4,
    random_state: int = RANDOM_STATE,
    max_iter: int = MAX_ITER,
) -> SGDClassifier:
    """Create the SGDClassifier with log_loss and reproducible settings."""
    return SGDClassifier(
        loss=loss,
        penalty=penalty,
        alpha=alpha,
        random_state=random_state,
        max_iter=max_iter,
        shuffle=True,
    )