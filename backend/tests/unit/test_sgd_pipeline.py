from ml.models.sgd_pipeline import create_sgd_pipeline
from sklearn.linear_model import SGDClassifier
from sklearn.pipeline import Pipeline


def test_create_sgd_pipeline_contains_tfidf_and_classifier():
    """El pipeline debe encapsular TF-IDF y SGDClassifier."""
    pipeline = create_sgd_pipeline()

    assert isinstance(pipeline, Pipeline)
    assert list(pipeline.named_steps) == ["tfidf", "classifier"]
    assert isinstance(pipeline.named_steps["classifier"], SGDClassifier)


def test_tfidf_is_not_fitted_before_training():
    """TF-IDF no debe aprender vocabulario antes de entrenar el pipeline."""
    pipeline = create_sgd_pipeline()

    vectorizer = pipeline.named_steps["tfidf"]

    assert not hasattr(vectorizer, "vocabulary_")


def test_sgd_pipeline_defaults_remain_the_common_baseline():
    """Selecting SGDClassifier must not change the generic defaults."""
    pipeline = create_sgd_pipeline()

    assert pipeline.named_steps["classifier"].loss == "log_loss"
    assert pipeline.named_steps["classifier"].penalty == "l2"
    assert pipeline.named_steps["classifier"].alpha == 1e-4
    assert pipeline.named_steps["classifier"].random_state == 42
    assert pipeline.named_steps["classifier"].max_iter == 1000
    assert pipeline.named_steps["tfidf"].min_df == 1
    assert pipeline.named_steps["tfidf"].max_features is None
    assert pipeline.named_steps["tfidf"].ngram_range == (1, 2)


def test_sgd_pipeline_accepts_explicit_tuning_parameters():
    """The pipeline must forward the approved tuning parameters."""
    pipeline = create_sgd_pipeline(alpha=1e-3, penalty="elasticnet", min_df=2)

    assert pipeline.named_steps["classifier"].alpha == 1e-3
    assert pipeline.named_steps["classifier"].penalty == "elasticnet"
    assert pipeline.named_steps["tfidf"].min_df == 2