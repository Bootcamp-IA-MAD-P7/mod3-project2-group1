"""Training pipeline for SGDClassifier toxicity classification."""

from sklearn.pipeline import Pipeline

from ml.features.tfidf import create_tfidf_vectorizer
from ml.models.sgd_classifier import create_sgd_classifier


def create_sgd_pipeline(
    *,
    alpha: float = 5e-4,
    penalty: str = "l2",
    loss: str = "log_loss",
    min_df: int = 12,
    max_features: int | None = None,
    ngram_range: tuple[int, int] = (1, 2),
) -> Pipeline:
    """Create the complete TF-IDF and SGDClassifier pipeline."""
    return Pipeline(
        steps=[
            (
                "tfidf",
                create_tfidf_vectorizer(
                    ngram_range=ngram_range,
                    min_df=min_df,
                    max_features=max_features,
                ),
            ),
            (
                "classifier",
                create_sgd_classifier(
                    loss=loss,
                    penalty=penalty,
                    alpha=alpha,
                ),
            ),
        ]
    )