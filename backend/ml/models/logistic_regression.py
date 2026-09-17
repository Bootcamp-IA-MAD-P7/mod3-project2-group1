"""Logistic Regression model for binary toxicity classification."""

from sklearn.linear_model import LogisticRegression

RANDOM_STATE = 42
MAX_ITER = 1000


def create_logistic_regression(*, c: float = 1.0) -> LogisticRegression:
    """Create the Logistic Regression classifier with reproducible settings."""
    return LogisticRegression(
        C=c,
        random_state=RANDOM_STATE,
        max_iter=MAX_ITER,
    )
