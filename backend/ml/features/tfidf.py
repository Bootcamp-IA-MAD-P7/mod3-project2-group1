"""Common TF-IDF feature extraction for toxicity classification."""

from sklearn.feature_extraction.text import TfidfVectorizer

from ml.preprocessing.text import normalize_text

NGRAM_RANGE = (1, 2)


def preprocess_for_tfidf(text: str) -> str:
    """Normalize text and apply the case-insensitive TF-IDF policy."""
    return normalize_text(text).casefold()


def create_tfidf_vectorizer(
    *,
    ngram_range: tuple[int, int] = NGRAM_RANGE,
    min_df: int = 1,
    max_features: int | None = None,
) -> TfidfVectorizer:
    """Create the common TF-IDF vectorizer used by all classic models."""
    return TfidfVectorizer(
        preprocessor=preprocess_for_tfidf,
        lowercase=False,
        ngram_range=ngram_range,
        min_df=min_df,
        max_features=max_features,
        stop_words=None,
        sublinear_tf=True,
    )
