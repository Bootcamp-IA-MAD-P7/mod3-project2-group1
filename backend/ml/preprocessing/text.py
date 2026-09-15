"""Common text preprocessing utilities for toxicity classification."""

import re
import unicodedata


URL_PATTERN = re.compile(r"https?://\S+|www\.\S+", flags=re.IGNORECASE)
USER_MENTION_PATTERN = re.compile(r"(?<!\w)@\w+")
WHITESPACE_PATTERN = re.compile(r"\s+")


def normalize_text(text: str) -> str:
    """Apply conservative normalization while preserving semantic information."""
    normalized = unicodedata.normalize("NFKC", text)

    # Sustituir información variable que no queremos aprender literalmente.
    normalized = URL_PATTERN.sub("URL", normalized)
    normalized = USER_MENTION_PATTERN.sub("USER", normalized)

    # Normalizar espacios, tabulaciones y saltos de línea.
    normalized = WHITESPACE_PATTERN.sub(" ", normalized).strip()

    return normalized