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

# %%
df = pd.read_csv(ROOT / "data" / "youtoxic_english_1000.csv")
df.head()

# %%
print(f"Shape: {df.shape}")
print(f"Columnas ({len(df.columns)}): {df.columns.tolist()}")

# %%
print(df.dtypes)

# %%
df.describe().T

# %%
print("Nulos por columna:")
df.isnull().sum()

# %%
print(f"Filas duplicadas exactas: {df.duplicated().sum()}")
print(f"Textos duplicados: {df['Text'].duplicated().sum()}")

# %%
df = df.drop_duplicates()
print(f"Shape tras eliminar duplicados: {df.shape}")

# %%
df.describe(include="object").T

# %%
# Detección de valores extraños tipo "sin dato" que no son NaN
sospechosos = ["?", "", "none", "n/a", "-", "unknown", "  ", "null", "nan"]
for col in df.columns:
    coincidencias = df[col].astype(str).str.lower().isin(sospechosos).sum()
    if coincidencias > 0:
        print(f"{col}: {coincidencias} valores raros")

# %%
# Columnas constantes (no aportan información): con 0 positivos no son entrenables.
constantes = [col for col in df.columns if df[col].nunique() == 1]
print("Columnas constantes:", {c: df[c].unique().tolist() for c in constantes})