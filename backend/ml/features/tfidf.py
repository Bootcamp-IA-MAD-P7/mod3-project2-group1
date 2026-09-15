"""Common TF-IDF feature extraction for toxicity classification."""

from sklearn.feature_extraction.text import TfidfVectorizer

from ml.preprocessing.text import normalize_text


NGRAM_RANGE = (1, 2)


def preprocess_for_tfidf(text: str) -> str:
    """Normalize text and apply the case-insensitive TF-IDF policy."""
    return normalize_text(text).casefold()


def create_tfidf_vectorizer() -> TfidfVectorizer:
    """Create the common TF-IDF vectorizer used by all classic models."""
    return TfidfVectorizer(
        preprocessor=preprocess_for_tfidf,
        lowercase=False,
        ngram_range=NGRAM_RANGE,
        stop_words=None,
        sublinear_tf=True,
    )
