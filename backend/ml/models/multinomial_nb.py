"""Multinomial Naive Bayes model factory for toxicity classification."""

from sklearn.naive_bayes import MultinomialNB


def create_multinomial_nb(alpha: float = 1.0) -> MultinomialNB:
    """Create a Multinomial Naive Bayes classifier."""
    return MultinomialNB(alpha=alpha)