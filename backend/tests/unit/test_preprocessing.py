from ml.preprocessing.text import normalize_text


def test_normalize_text_removes_extra_whitespace():
    """Los espacios repetidos y saltos de línea deben normalizarse."""
    text = "This   is\n\na   toxic\tcomment"

    result = normalize_text(text)

    assert result == "This is a toxic comment"


def test_normalize_text_replaces_urls():
    """Las URLs deben sustituirse por un token común."""
    text = "Look at https://example.com/page please"

    result = normalize_text(text)

    assert result == "Look at URL please"


def test_normalize_text_replaces_user_mentions():
    """Las menciones de usuario deben sustituirse por un token común."""
    text = "@username you are horrible"

    result = normalize_text(text)

    assert result == "USER you are horrible"


def test_normalize_text_preserves_hashtag_content():
    """Los hashtags deben conservar su contenido textual."""
    text = "This is #Disgusting"

    result = normalize_text(text)

    assert "Disgusting" in result


def test_normalize_text_preserves_negations():
    """Las negaciones no deben eliminarse durante el preprocesamiento."""
    text = "You are not stupid"

    result = normalize_text(text)

    assert "not" in result


def test_normalize_text_preserves_punctuation():
    """El baseline no debe eliminar agresivamente la puntuación."""
    text = "You are horrible!!!"

    result = normalize_text(text)

    assert "!!!" in result