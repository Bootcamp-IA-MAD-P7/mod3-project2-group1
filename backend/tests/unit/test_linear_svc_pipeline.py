from sklearn.pipeline import Pipeline
from sklearn.svm import LinearSVC

from ml.features.tfidf import create_tfidf_vectorizer
from ml.models.linear_svc_pipeline import create_linear_svc_pipeline


def test_create_linear_svc_pipeline_contains_tfidf_and_classifier():
    """El pipeline debe encapsular TF-IDF y LinearSVC."""
    pipeline = create_linear_svc_pipeline()

    assert isinstance(pipeline, Pipeline)
    assert list(pipeline.named_steps) == ["tfidf", "classifier"]
    assert isinstance(pipeline.named_steps["classifier"], LinearSVC)


def test_tfidf_is_not_fitted_before_training():
    """TF-IDF no debe aprender vocabulario antes de entrenar el pipeline."""
    pipeline = create_linear_svc_pipeline()

    vectorizer = pipeline.named_steps["tfidf"]

    assert not hasattr(vectorizer, "vocabulary_")


def test_pipeline_reuses_the_shared_tfidf_vectorizer():
    """El pipeline debe reutilizar el vectorizador común del proyecto con min_df seleccionado."""
    pipeline = create_linear_svc_pipeline()

    assert pipeline.named_steps["tfidf"].get_params() == create_tfidf_vectorizer(min_df=12).get_params()


def test_generic_pipeline_defaults_match_the_selected_linear_svc_configuration():
    """Los defaults del pipeline deben reflejar la configuración seleccionada de LinearSVC."""
    pipeline = create_linear_svc_pipeline()

    assert pipeline.named_steps["classifier"].C == 1.0
    assert pipeline.named_steps["classifier"].loss == "squared_hinge"
    assert pipeline.named_steps["classifier"].random_state == 42
    assert pipeline.named_steps["classifier"].max_iter == 1000
    assert pipeline.named_steps["tfidf"].min_df == 12
    assert pipeline.named_steps["tfidf"].max_features is None
    assert pipeline.named_steps["tfidf"].ngram_range == (1, 2)


def test_pipeline_accepts_explicit_c_regularization_strength():
    """El pipeline debe permitir configurar C."""
    pipeline = create_linear_svc_pipeline(c=0.1)

    assert pipeline.named_steps["classifier"].C == 0.1


def test_pipeline_accepts_explicit_tfidf_feature_parameters():
    """El pipeline debe permitir configurar min_df, max_features y ngram_range."""
    pipeline = create_linear_svc_pipeline(
        min_df=2,
        max_features=100,
        ngram_range=(1, 1),
    )

    assert pipeline.named_steps["tfidf"].min_df == 2
    assert pipeline.named_steps["tfidf"].max_features == 100
    assert pipeline.named_steps["tfidf"].ngram_range == (1, 1)