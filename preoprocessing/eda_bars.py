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
import matplotlib.pyplot as plt

# %%
df = pd.read_csv(ROOT / "data" / "youtoxic_english_1000.csv")

TARGETS = [c for c in df.columns if c.startswith("Is") if df[c].nunique() > 1]
CONSTANTES = [c for c in df.columns if c.startswith("Is") if df[c].nunique() == 1]

print("Etiquetas a graficar:", TARGETS)
print("Etiquetas constantes (no informan):", {c: df[c].unique().tolist() for c in CONSTANTES})

# %%
# Barras con conteo y % de positivos para detectar el desbalance
for col in TARGETS:
    counts = df[col].value_counts()
    pct_pos = df[col].astype(int).mean()
    ax = counts.plot(kind="bar", color=["#7b2d8b", "#2e8b57"], rot=0)
    for i, v in enumerate(counts.values):
        ax.text(i, v + 8, str(v), ha="center", fontsize=9)
    ax.set_title(f"{col}  —  {pct_pos:.1%} positivos")
    ax.set_xlabel(col)
    ax.set_ylabel("Frecuencia")
    plt.show()
    print(f"{col}: {counts.to_dict()}  ->  {pct_pos:.1%} positivos\n")