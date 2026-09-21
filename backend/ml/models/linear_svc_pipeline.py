"""Training pipeline for LinearSVC toxicity classification."""

from sklearn.pipeline import Pipeline

from ml.features.tfidf import create_tfidf_vectorizer
from ml.models.linear_svc import create_linear_svc


def create_linear_svc_pipeline(
    *,
    c: float = 1.0,
    min_df: int = 12,
    max_features: int | None = None,
    ngram_range: tuple[int, int] = (1, 2),
) -> Pipeline:
    """Create the complete TF-IDF and LinearSVC pipeline."""
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
            ("classifier", create_linear_svc(c=c)),
        ]
    )