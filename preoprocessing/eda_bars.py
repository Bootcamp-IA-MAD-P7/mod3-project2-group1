
# %% 
# import sys
import sys
from pathlib import Path

ROOT = Path.cwd().parent  # sube de notebooks/ a la raíz del repo
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt


# %%
df = pd.read_csv(ROOT / "data" / "youtoxic_english_100.csv")


# %%
print(df['IsToxic'].value_counts())
df['IsToxic'].value_counts().plot(kind='bar', color=['purple', 'green'])
plt.title('Toxic Distribution')  # Distribución por género
plt.xlabel('IsToxic')  # Género (male/female)
plt.ylabel('Count')  # Cantidad de personas
plt.xticks(rotation=0)  # Etiquetas horizontales
plt.show()
# %%
print(df['IsAbusive'].value_counts())
df['IsAbusive'].value_counts().plot(kind='bar', color=['purple', 'green'])
plt.title('Abusive')  
plt.xlabel('IsAbusive')  
plt.ylabel('Count')  
plt.xticks(rotation=0) 
plt.show()
# %%
print(df['IsThreat'].value_counts())
df['IsThreat'].value_counts().plot(kind='bar', color=['purple', 'green'])
plt.title('Threatoke')  
plt.xlabel('IsThreat')  
plt.ylabel('Count')  
plt.xticks(rotation=0) 
plt.show()
# %%
print(df['IsProvocative'].value_counts())
df['IsProvocative'].value_counts().plot(kind='bar', color=['purple', 'green'])
plt.title('Provocative')  
plt.xlabel('IsProvocative')  
plt.ylabel('Count')  
plt.xticks(rotation=0) 
plt.show()

# %%
print(df['IsProvocative'].value_counts())
df['IsProvocative'].value_counts().plot(kind='bar', color=['purple', 'green'])
plt.title('Provocative')  
plt.xlabel('IsProvocative')  
plt.ylabel('Count')  
plt.xticks(rotation=0) 
plt.show()

# %%
print(df['IsObscene'].value_counts())
df['IsObscene'].value_counts().plot(kind='bar', color=['purple', 'green'])
plt.title('Obscene')  
plt.xlabel('IsObscene')  
plt.ylabel('Count')  
plt.xticks(rotation=0) 
plt.show()
# %%
print(df['IsHatespeech'].value_counts())
df['IsHatespeech'].value_counts().plot(kind='bar', color=['purple', 'green'])
plt.title('Hatespeech')  
plt.xlabel('IsHatespeech')  
plt.ylabel('Count')  
plt.xticks(rotation=0) 
plt.show()
# %%
print(df['IsRacist'].value_counts())
df['IsRacist'].value_counts().plot(kind='bar', color=['purple', 'green'])
plt.title('Racist')  
plt.xlabel('IsRacist')  
plt.ylabel('Count')  
plt.xticks(rotation=0) 
plt.show()
# %%
print(df['IsNationalist'].value_counts())
df['IsNationalist'].value_counts().plot(kind='bar', color=['purple', 'green'])
plt.title('Nationalist')  
plt.xlabel('IsNationalist')  
plt.ylabel('Count')  
plt.xticks(rotation=0) 
plt.show()
# %%
print(df['IsSexist'].value_counts())
df['IsSexist'].value_counts().plot(kind='bar', color=['purple', 'green'])
plt.title('Sexist')  
plt.xlabel('IsSexist')  
plt.ylabel('Count')  
plt.xticks(rotation=0) 
plt.show()
# %%
print(df['IsNationalist'].value_counts())
df['IsNationalist'].value_counts().plot(kind='bar', color=['purple', 'green'])
plt.title('Nationalist')  
plt.xlabel('IsNationalist')  
plt.ylabel('Count')  
plt.xticks(rotation=0) 
plt.show()
# %%
print(df['IsHomophobic'].value_counts())
df['IsHomophobic'].value_counts().plot(kind='bar', color=['purple', 'green'])
plt.title('Homophobic')  
plt.xlabel('IsHomophobic')  
plt.ylabel('Count')  
plt.xticks(rotation=0) 
plt.show()
# %%
print(df['IsReligiousHate'].value_counts())
df['IsReligiousHate'].value_counts().plot(kind='bar', color=['purple', 'green'])
plt.title('ReligiousHate')  
plt.xlabel('IsReligiousHate')  
plt.ylabel('Count')  
plt.xticks(rotation=0) 
plt.show()

# %%
print(df['IsRadicalism'].value_counts())
df['IsRadicalism'].value_counts().plot(kind='bar', color=['purple', 'green'])
plt.title('Radicalism')  
plt.xlabel('IsRadicalism')  
plt.ylabel('Count')  
plt.xticks(rotation=0) 
plt.show()

# %%
print(df['Text'].value_counts())
df['Text'].value_counts().plot(kind='bar', color=['purple', 'green'])
plt.title('Text')  
plt.xlabel('Text')  
plt.ylabel('Count')  
plt.xticks(rotation=0) 
plt.show()


# %%
