from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

from ml.models.logistic_pipeline import (
    create_best_logistic_pipeline_observed_on_dev,
    create_logistic_pipeline,
)


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


def test_generic_pipeline_defaults_remain_the_common_baseline():
    """Selecting Logistic Regression must not change the generic defaults."""
    pipeline = create_logistic_pipeline()

    assert pipeline.named_steps["classifier"].C == 1.0
    assert pipeline.named_steps["classifier"].class_weight is None
    assert pipeline.named_steps["classifier"].random_state == 42
    assert pipeline.named_steps["classifier"].max_iter == 1000
    assert pipeline.named_steps["tfidf"].min_df == 1
    assert pipeline.named_steps["tfidf"].max_features is None
    assert pipeline.named_steps["tfidf"].ngram_range == (1, 2)


def test_best_pipeline_observed_on_dev_has_the_selected_configuration():
    """The selected factory must expose every DEV-selected parameter explicitly."""
    pipeline = create_best_logistic_pipeline_observed_on_dev()

    assert pipeline.named_steps["classifier"].C == 5.0
    assert pipeline.named_steps["classifier"].class_weight is None
    assert pipeline.named_steps["classifier"].random_state == 42
    assert pipeline.named_steps["classifier"].max_iter == 1000
    assert pipeline.named_steps["tfidf"].min_df == 2
    assert pipeline.named_steps["tfidf"].max_features is None
    assert pipeline.named_steps["tfidf"].ngram_range == (1, 1)
