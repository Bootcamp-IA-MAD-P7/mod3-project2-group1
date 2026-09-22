"""Training pipeline for Logistic Regression toxicity classification."""

from sklearn.pipeline import Pipeline

from ml.features.tfidf import create_tfidf_vectorizer
from ml.models.logistic_regression import create_logistic_regression

BEST_LOGISTIC_C_OBSERVED_ON_DEV = 5.0
BEST_LOGISTIC_MIN_DF_OBSERVED_ON_DEV = 12
BEST_LOGISTIC_MAX_FEATURES_OBSERVED_ON_DEV = None
BEST_LOGISTIC_NGRAM_RANGE_OBSERVED_ON_DEV = (1, 1)


def create_logistic_pipeline(
    *,
    c: float = 1.0,
    min_df: int = 1,
    max_features: int | None = None,
    ngram_range: tuple[int, int] = (1, 2),
) -> Pipeline:
    """Create the complete TF-IDF and Logistic Regression pipeline."""
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
            ("classifier", create_logistic_regression(c=c)),
        ]
    )


def create_best_logistic_pipeline_observed_on_dev() -> Pipeline:
    """Create the best configuration observed on DEV, not a global optimum."""
    return create_logistic_pipeline(
        c=BEST_LOGISTIC_C_OBSERVED_ON_DEV,
        min_df=BEST_LOGISTIC_MIN_DF_OBSERVED_ON_DEV,
        max_features=BEST_LOGISTIC_MAX_FEATURES_OBSERVED_ON_DEV,
        ngram_range=BEST_LOGISTIC_NGRAM_RANGE_OBSERVED_ON_DEV,
    )
