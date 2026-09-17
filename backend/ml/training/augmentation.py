"""Safe textual augmentation applied only to training folds (TX-03)."""

import random

import pandas as pd

AUGMENTATION_TECHNIQUE = "synonym_replacement"

# Sinónimos en inglés (dataset youtoxic_english_1000). Valores en tuplas para
# permitir variantes deterministas por semilla.
SYNONYM_MAP: dict[str, tuple[str, ...]] = {
    "happy": ("glad", "pleased", "delighted"),
    "sad": ("unhappy", "down", "gloomy"),
    "angry": ("upset", "furious", "annoyed"),
    "good": ("fine", "nice", "great"),
    "very": ("really", "quite", "extremely"),
    "love": ("adore", "like", "enjoy"),
    "hate": ("dislike", "detest", "despise"),
    "nice": ("kind", "pleasant", "friendly"),
    "big": ("large", "huge", "great"),
    "small": ("little", "tiny", "compact"),
    "bad": ("poor", "unpleasant", "awful"),
    "people": ("folks", "individuals", "persons"),
    "great": ("excellent", "wonderful", "fantastic"),
}

TECHNIQUE_COLUMN = "technique"
PARENT_ID_COLUMN = "parent_id"
SEED_COLUMN = "seed"
LEAK_MARK_COLUMNS = (PARENT_ID_COLUMN, TECHNIQUE_COLUMN, SEED_COLUMN)

NEGATION_MARKERS = ("not", "never", "no", "without")


def _is_negated(tokens: list[str], index: int) -> bool:
    if index == 0:
        return False
    previous = tokens[index - 1]
    return any(previous.casefold() == marker for marker in NEGATION_MARKERS)


def _replace_with_synonym(
    text: str,
    candidates: list[int],
    rng: random.Random,
) -> str:
    """Replace one candidate word with a deterministic synonym."""
    tokens = text.split()
    word_index = rng.choice(candidates)
    word = tokens[word_index]
    options = SYNONYM_MAP[word.casefold()]
    synonym = rng.choice(options)
    if word.isupper():
        synonym = synonym.upper()
    elif word[:1].isupper():
        synonym = synonym.capitalize()
    tokens[word_index] = synonym
    return " ".join(tokens)


def _synthetic_variants(row: pd.Series, seed: int) -> list[dict]:
    """Build traced synthetic rows for a training row."""
    text = str(row["Text"])
    rng = random.Random(seed)
    tokens = text.split()
    candidates = [
        index
        for index, token in enumerate(tokens)
        if token.casefold() in SYNONYM_MAP and not _is_negated(tokens, index)
    ]
    if not candidates:
        return []
    variant_text = _replace_with_synonym(text, candidates, rng)
    return [
        {
            **row.to_dict(),
            "Text": variant_text,
            PARENT_ID_COLUMN: row.name,
            TECHNIQUE_COLUMN: AUGMENTATION_TECHNIQUE,
            SEED_COLUMN: seed,
        }
    ]


def apply_augmentation(
    train_df: pd.DataFrame,
    *,
    seed: int = 42,
) -> pd.DataFrame:
    """Return train rows plus traced synthetic variants for the given seed.

    Synthetic rows inherit the parent's fold membership via ``parent_id`` and are
    marked with the technique and seed. Input rows keep the leak-mark columns
    empty. The caller must pass only the training slice of a fold.
    """
    augmented = train_df.copy()
    for column in LEAK_MARK_COLUMNS:
        if column not in augmented.columns:
            augmented[column] = None

    variants: list[dict] = []
    for _, row in train_df.iterrows():
        variants.extend(_synthetic_variants(row, seed))

    if variants:
        augmented = pd.concat(
            [augmented, pd.DataFrame(variants)],
            ignore_index=True,
        )
    return augmented