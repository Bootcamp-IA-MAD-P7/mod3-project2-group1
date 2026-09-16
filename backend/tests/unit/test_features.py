from sklearn.feature_extraction.text import TfidfVectorizer

from ml.features.tfidf import create_tfidf_vectorizer, preprocess_for_tfidf


def test_create_tfidf_vectorizer_returns_tfidf_vectorizer():
    """La factoría común debe devolver un TfidfVectorizer."""
    vectorizer = create_tfidf_vectorizer()

    assert isinstance(vectorizer, TfidfVectorizer)


def test_tfidf_uses_common_configuration():
    """Todos los modelos deben utilizar la misma configuración inicial de TF-IDF."""
    vectorizer = create_tfidf_vectorizer()

    assert vectorizer.ngram_range == (1, 2)
    assert vectorizer.lowercase is False
    assert vectorizer.min_df == 1
    assert vectorizer.max_features is None
    assert vectorizer.sublinear_tf is True
    assert vectorizer.preprocessor is preprocess_for_tfidf


def test_tfidf_does_not_remove_stopwords():
    """El baseline común debe conservar stopwords y negaciones."""
    vectorizer = create_tfidf_vectorizer()

    assert vectorizer.stop_words is None


def test_tfidf_learns_vocabulary_only_when_fitted():
    """El vocabulario no debe existir antes de ajustar el vectorizador."""
    vectorizer = create_tfidf_vectorizer()

    assert not hasattr(vectorizer, "vocabulary_")

    vectorizer.fit(
        [
            "this is a normal comment",
            "you are not stupid",
            "this comment is horrible",
        ]
    )

    assert hasattr(vectorizer, "vocabulary_")
    assert len(vectorizer.vocabulary_) > 0


def test_tfidf_preprocessor_casefolds_text_without_duplicate_case_tokens():
    """TF-IDF must treat uppercase and lowercase tokens as the same feature."""
    vectorizer = create_tfidf_vectorizer()

    assert vectorizer.build_analyzer()("HATE hate") == ["hate", "hate", "hate hate"]

    vectorizer.fit(["HATE hate"])

    assert "hate" in vectorizer.vocabulary_
    assert "HATE" not in vectorizer.vocabulary_


def test_tfidf_accepts_tuning_parameters_without_changing_preprocessing():
    """Tuning may vary feature limits while retaining common preprocessing."""
    vectorizer = create_tfidf_vectorizer(
        ngram_range=(1, 1), min_df=2, max_features=100
    )

    assert vectorizer.ngram_range == (1, 1)
    assert vectorizer.min_df == 2
    assert vectorizer.max_features == 100
    assert vectorizer.preprocessor is preprocess_for_tfidf
