# %%
import sys
from pathlib import Path

ROOT = Path.cwd()
while not (ROOT / "data" / "youtoxic_english_1000.csv").exists() and ROOT != ROOT.parent:
    ROOT = ROOT.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt

sns.set_theme(style="darkgrid")

# %%
df = pd.read_csv(ROOT / "data" / "youtoxic_english_1000.csv")

TARGETS = [c for c in df.columns if c.startswith("Is") if df[c].nunique() > 1]
df["text_len"] = df["Text"].str.len()
df["word_count"] = df["Text"].str.split().str.len()
df["n_labels"] = df[TARGETS].astype(int).sum(axis=1)
df["avg_word_len"] = df["text_len"] / df["word_count"]

# %%
# Relaciones entre features derivadas del texto, coloreando por odio (IsHatespeech)
g = sns.pairplot(
    df,
    vars=["text_len", "word_count", "avg_word_len", "n_labels"],
    hue="IsHatespeech",
    palette="Set1",
    height=2.5,
)
g.fig.suptitle("Features del texto según IsHatespeech", y=1.02)
plt.show()