"""Training pipeline for Logistic Regression toxicity classification."""

from sklearn.pipeline import Pipeline

from ml.features.tfidf import create_tfidf_vectorizer
from ml.models.logistic_regression import create_logistic_regression


def create_logistic_pipeline() -> Pipeline:
    """Create the complete TF-IDF and Logistic Regression pipeline."""
    return Pipeline(
        steps=[
            ("tfidf", create_tfidf_vectorizer()),
            ("classifier", create_logistic_regression()),
        ]
    )