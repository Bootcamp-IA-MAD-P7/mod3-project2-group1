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
df["word_count"] = df["Text"].str.split().str.len()
TARGETS = [c for c in df.columns if c.startswith("Is") if df[c].nunique() > 1]
df["n_labels"] = df[TARGETS].astype(int).sum(axis=1)

# %%
# Longitud del texto: distribución muy asimétrica (derecha)
df["text_len"].plot(kind="hist", bins=40, edgecolor="black", alpha=0.7, color="skyblue")
plt.title("Distribución de la longitud del texto")
plt.xlabel("caracteres")
plt.ylabel("Frecuencia")
plt.show()

# %%
# Misma distribución en escala log para ver la cola
df["text_len"].plot(kind="hist", bins=40, edgecolor="black", alpha=0.7, color="skyblue", log=True)
plt.title("Longitud del texto (escala log)")
plt.xlabel("caracteres")
plt.show()

# %%
# Palabras por comentario
sns.histplot(df["word_count"], bins=40, kde=True)
plt.title("Distribución de palabras por comentario")
plt.show()

# %%
# Nº de etiquetas por comentario: enseña el esquema multi-etiqueta
sns.histplot(df["n_labels"], discrete=True, shrink=0.8)
plt.title("Número de etiquetas por comentario")
plt.xlabel("n etiquetas")
plt.show()
print(df["n_labels"].value_counts().sort_index())