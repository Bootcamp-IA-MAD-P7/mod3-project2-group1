from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

from ml.models.logistic_pipeline import create_logistic_pipeline


def test_create_logistic_pipeline_contains_tfidf_and_classifier():
    """El pipeline debe encapsular TF-IDF y Logistic Regression."""
    pipeline = create_logistic_pipeline()

    assert isinstance(pipeline, Pipeline)
    assert list(pipeline.named_steps) == ["tfidf", "classifier"]
    assert isinstance(pipeline.named_steps["classifier"], LogisticRegression)


def test_tfidf_is_not_fitted_before_training():
    """TF-IDF no debe aprender vocabulario antes de entrenar el pipeline."""
    pipeline = create_logistic_pipeline()

    vectorizer = pipeline.named_steps["tfidf"]

    assert not hasattr(vectorizer, "vocabulary_")