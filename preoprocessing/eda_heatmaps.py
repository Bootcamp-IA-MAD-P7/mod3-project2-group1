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
X = df[TARGETS].replace({"TRUE": 1, "FALSE": 0}).astype(int)

# %%
# [1] Correlación entre etiquetas (Pearson sobre 0/1 ≈ coeficiente phi)
corr = X.corr()
plt.figure(figsize=(10, 8))
sns.heatmap(corr, annot=True, cmap="coolwarm", center=0, vmin=-1, vmax=1,
            linewidths=1, fmt=".2f", square=True)
plt.title("Correlación entre etiquetas de toxicidad")
plt.tight_layout()
plt.show()

print("Correlaciones fuertes (|r| >= 0.3):")
for i, a in enumerate(TARGETS):
    for b in TARGETS[i + 1:]:
        r = corr.loc[a, b]
        if abs(r) >= 0.3:
            print(f"  {a} ~ {b}: {r:+.2f}")

# %%
# [2] Matriz de co-ocurrencia: nº de comentarios donde ambas etiquetas son TRUE
cooc = X.T @ X
mask = np.eye(len(cooc), dtype=bool)
plt.figure(figsize=(10, 8))
sns.heatmap(cooc, annot=True, cmap="YlOrRd", mask=mask, fmt="d",
            square=True, linewidths=1)
plt.title("Co-ocurrencia de etiquetas (nº de comentarios con ambas)")
plt.tight_layout()
plt.show()