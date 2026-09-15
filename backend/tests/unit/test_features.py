from sklearn.feature_extraction.text import TfidfVectorizer

from ml.features.tfidf import create_tfidf_vectorizer
from ml.preprocessing.text import normalize_text


def test_create_tfidf_vectorizer_returns_tfidf_vectorizer():
    """La factoría común debe devolver un TfidfVectorizer."""
    vectorizer = create_tfidf_vectorizer()

    assert isinstance(vectorizer, TfidfVectorizer)


def test_tfidf_uses_common_configuration():
    """Todos los modelos deben utilizar la misma configuración inicial de TF-IDF."""
    vectorizer = create_tfidf_vectorizer()

    assert vectorizer.ngram_range == (1, 2)
    assert vectorizer.lowercase is True
    assert vectorizer.sublinear_tf is True
    assert vectorizer.preprocessor is normalize_text


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