# %% 
# import sys
import sys
from pathlib import Path

ROOT = Path.cwd().parent  # sube de notebooks/ a la raíz del repo
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import pandas as pd
import numpy as np
import matplotlib

# %%
df = pd.read_csv(ROOT / "data" / "youtoxic_english_1000.csv")
df.head(10)
# %%
df.shape
# %%
df.shape
print(f"Columns ({len(df.columns)}): {df.columns}")
# %%
print(f"Types: {df.dtypes}")
print(f"Columns ({len(df.columns)}): {df.columns}")
# %%
df.describe
# %%
df.isnull().sum()
# %% Contar duplicados
df.duplicated()
# %% Eliminar duplicados
print(f"Duplicados: {df.drop_duplicates()}")
# %% 
df.columns.tolist()
# %% 
df.describe(include='object')
# %%
df.head()

# %%

df = df.drop(columns=['VideoId', 'CommentId'])

print("Dataset después de eliminar columnas:")
df.head()

# %%
# Detección de valores extraños tipo "sin dato" que no son NaN
# (caso smoking_status = "Unknown"). Comparación insensible a mayúsculas.
sospechosos = ["?", "", "none", "n/a", "-", "unknown", "  ", "null", "nan"]
for col in df.columns:
    coincidencias = df[col].astype(str).str.lower().isin(sospechosos).sum()
    if coincidencias > 0:
        print(f"{col}: {coincidencias} valores raros")

# 2) Columnas constantes (no aportan información).
constantes = [col for col in df.columns if df[col].nunique() == 1]
print("\nColumnas constantes:", constantes)


