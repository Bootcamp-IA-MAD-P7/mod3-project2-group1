from sklearn.naive_bayes import MultinomialNB

from ml.models.multinomial_nb import create_multinomial_nb


def test_create_multinomial_nb_returns_multinomial_nb():
    """El modelo debe ser un clasificador MultinomialNB."""
    model = create_multinomial_nb()

    assert isinstance(model, MultinomialNB)


def test_multinomial_nb_uses_default_alpha():
    """Por defecto alpha debe ser 1.0 (suavizado de Laplace)."""
    model = create_multinomial_nb()

    assert model.alpha == 1.0


def test_multinomial_nb_applies_custom_alpha():
    """El alpha proporcionado debe aplicarse al modelo."""
    model = create_multinomial_nb(alpha=0.5)

    assert model.alpha == 0.5