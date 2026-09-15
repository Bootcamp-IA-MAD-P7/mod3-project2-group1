"""Utilities for preparing and splitting datasets used by the ML pipeline."""

import pandas as pd


VIDEO_ID_COLUMN = "VideoId"
TEXT_COLUMN = "Text"
TARGET_COLUMN = "IsToxic"

HOLDOUT_VIDEO_IDS = {
    "4rCweDxDqdw",
    "5vF4si3hoRA",
    "8HB18hZrhXc",
    "TZxEyoplYbI",
}


def prepare_binary_dataset(df: pd.DataFrame) -> pd.DataFrame:
    """Prepare the binary toxicity dataset preserving metadata needed for splitting."""
    result = df[[VIDEO_ID_COLUMN, TEXT_COLUMN, TARGET_COLUMN]].copy()

    # Clave temporal para detectar textos duplicados sin distinguir mayúsculas.
    dedup_key = result[TEXT_COLUMN].str.casefold()

    result = result.loc[~dedup_key.duplicated(keep="first")]

    return result.reset_index(drop=True)


def create_holdout_split(
    df: pd.DataFrame,
) -> tuple[pd.DataFrame, pd.DataFrame]:
    """Split the dataset into development and sealed test sets by VideoId."""
    is_holdout = df[VIDEO_ID_COLUMN].isin(HOLDOUT_VIDEO_IDS)

    dev = df.loc[~is_holdout].copy().reset_index(drop=True)
    test = df.loc[is_holdout].copy().reset_index(drop=True)

    return dev, test