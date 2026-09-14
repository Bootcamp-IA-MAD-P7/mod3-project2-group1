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
df["text_len"] = df["Text"].str.len()

TARGETS = [c for c in df.columns if c.startswith("Is") if df[c].nunique() > 1]

# %%
# Las columnas binarias no tienen outliers: aquí los outliers están en la longitud del texto
q1, q3 = df["text_len"].quantile([0.25, 0.75])
iqr = q3 - q1
umbral = q3 + 1.5 * iqr
outliers = df[df["text_len"] > umbral]

df.boxplot(column="text_len", patch_artist=True, boxprops=dict(facecolor="lightgreen"))
plt.title(f"Longitud del texto (outliers por 1.5·IQR: {len(outliers)})")
plt.ylabel("caracteres")
plt.show()
print(f"Q1={q1:.0f}, Q3={q3:.0f}, umbral={umbral:.0f}, outliers={len(outliers)}")

# %%
# ¿Cambia la longitud según la etiqueta? Boxplot de longitud por etiqueta
for col in TARGETS:
    sns.boxplot(x=col, y="text_len", data=df, hue=col, palette="Set2", legend=False)
    plt.title(f"Longitud del texto según {col}")
    plt.xlabel(col)
    plt.ylabel("caracteres")
    plt.show()

# %%
# Número de etiquetas por comentario vs longitud (outliers multi-etiqueta)
df["n_labels"] = df[TARGETS].astype(int).sum(axis=1)
sns.boxplot(x="n_labels", y="text_len", data=df, palette="viridis")
plt.title("Longitud del texto según número de etiquetas")
plt.show()
print(df["n_labels"].value_counts().sort_index())