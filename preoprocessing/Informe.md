# Informe de Análisis Exploratorio de Datos (EDA)


## 1. Contexto del proyecto

La plataforma en la que trabajamos está pensada para ayudar a una persona moderadora a revisar
comentarios de YouTube de forma más eficiente: el sistema debe leer un comentario y señalar si
contiene contenido tóxico o de odio, para que sea el humano quien decida. El sistema no sanciona
automáticamente a nadie: solo presenta señales para la revisión.

Para que el sistema pueda hacer esa clasificación, primero necesitamos **entender los datos** con
los que vamos a entrenar los modelos.

Los modelos previstos son de clasificación (Detectores de texto): Multinomial Naive Bayes,
Regresión Logística, LinearSVC y SGDClassifier. Todos ellos necesitan saber, para cada comentario,
si es tóxico o no lo es (objetivo binario) y, en una segunda exploración, qué tipo de toxicidad
presenta.

---

## 2. Descripción del dataset

El fichero contiene **1.000 comentarios reales de YouTube** (idioma inglés) con **15 columnas**:

| Bloque | Columnas |
|---|---|
| Identificadores | `CommentId`, `VideoId` |
| Texto | `Text` (el contenido del comentario) |
| Etiquetas de toxicidad (12) | `IsToxic`, `IsAbusive`, `IsThreat`, `IsProvocative`, `IsObscene`, `IsHatespeech`, `IsRacist`, `IsNationalist`, `IsSexist`, `IsHomophobic`, `IsReligiousHate`, `IsRadicalism` |

Las 12 etiquetas son **binarias** (`True`/`False`) y un comentario puede tener **varias a la vez**:
esto se denomina un problema **multietiqueta** (multi-label). Por ejemplo, un mismo comentario puede
ser a la vez abusivo y racista.

---

## 3. Hipótesis de partida

Antes de graficar, formulamos las hipótesis que queremos confirmar o descartar con los datos:

1. **H1 — El desbalance es la norma, no la excepción.** Sospechamos que muy pocas etiquetas
   aparecen con frecuencia y muchas son excepcionales. Si es así, entrenar un modelo por cada
   etiqueta será inviable en las minoritarias.
2. **H2 — El texto tóxico es distinto en forma.** Creemos que los comentarios tóxicos son más
   largos y llevan más palabras que los no tóxicos, lo que daría señales útiles al modelo más allá
   de las palabras en sí.
3. **H3 — Las etiquetas no son independientes.** Sospechamos que hay etiquetas que casi siempre
   aparecen juntas (jerarquía del odio): lo "grueso" (abusivo, provocador) actúa como paraguas de
   lo "fino" (racista, discurso de odio).
4. **H4 — Alguna etiqueta no aporta información.** Es posible que alguna etiqueta no aparezca
   nunca (o aparezca una vez), y que por tanto no pueda entrenarse.
5. **H5 — IsToxic puede ser el mejor objetivo simple.** Si `IsToxic` separa de forma razonable el
   dominio, podremos construir una primera clasificación binaria toxic/no-toxic antes de atacar el
   detalle multilabel.

---

## 4. Análisis y el porqué de cada gráfico

### 4.1 Calidad de los datos (exploración inicial)

**Qué hacemos:** revisión de dimensiones, tipos de dato, nulos, duplicados, valores "extraños"
(`?`, `n/a`, `-`…) y columnas constantes.

**Por qué:** cualquier conclusión posterior solo es válida si los datos están limpios. Si
dejáramos duplicados, un mismo comentario podría estar a la vez en entrenamiento y en validación,
dando una precisión falsamente alta.

**Resultados:**
- Sin valores nulos y sin filas duplicadas exactas.
- **3 textos duplicados** (mismo comentario publicado varias veces): se eliminan en la fase de
  limpieza para no contaminar train/test.
- **Columnas constantes: `IsHomophobic` y `IsRadicalism`**, con 0 positivos. Una columna constante
  no aporta información y no puede entrenarse como objetivo → se descartan para el modelado.

### 4.2 Desbalanceo de las etiquetas (gráficos de barras)

**Métrica analizada:** para cada etiqueta, el **porcentaje de comentarios positivos** y su **ratio
de desbalance** (cuántos negativos hay por cada positivo, notación `1:N`).

| Etiqueta | Positivos | % positivos | Ratio 1:N | Clasificación |
|---|---|---|---|---|
| `IsToxic` | 462 | 46,2 % | 1 : 1,2 | **Balanceado** |
| `IsAbusive` | 353 | 35,3 % | 1 : 1,8 | Moderado |
| `IsProvocative` | 161 | 16,1 % | 1 : 5,2 | Desbalanceado |
| `IsHatespeech` | 138 | 13,8 % | 1 : 6,2 | Desbalanceado |
| `IsRacist` | 125 | 12,5 % | 1 : 7,0 | Desbalanceado |
| `IsObscene` | 100 | 10,0 % | 1 : 9,0 | Desbalanceado |
| `IsThreat` | 21 | 2,1 % | 1 : 46,6 | Muy desbalanceado |
| `IsReligiousHate` | 12 | 1,2 % | 1 : 82,3 | Crítico |
| `IsNationalist` | 8 | 0,8 % | 1 : 124 | Crítico |
| `IsSexist` | 1 | 0,1 % | 1 : 999 | Crítico |
| `IsHomophobic` | 0 | 0 % | — | **Imposible de entrenar** |
| `IsRadicalism` | 0 | 0 % | — | **Imposible de entrenar** |

**Qué significan "balanceado" y "desbalanceado" y por qué importa.**

Decimos que una etiqueta está *balanceada* cuando los dos valores posibles aparecen con frecuencias
parecidas. Está *desbalanceada* cuando un valor (aquí, el "no tóxico") domina claramente al otro.

La razón es sencilla: un modelo que solo viera "proporción" podría "acertar" casi siempre diciendo
**no**, sin aprender nada. Por eso, cuando el desbalance es extremo, un clasificador ingenuo
alcanza una precisión muy alta (por ejemplo, si el 98 % de los comentarios no son amenaza, un
modelo que siempre diera "no amenaza" acertaría el 98 % de las veces **sin examinar el texto**).
Por eso no podemos medir estos problemas solo con accuracy, y por eso algunas etiquetas no se
pueden modelar con 1.000 filas: no hay suficientes ejemplos positivos para que el algoritmo aprenda
su patrón.

En la práctica, este proyecto prioriza una detección binaria *toxic/no-toxic* (business reality de
aplicación), lo que encaja con las etiquetas de mayor presencia.

### 4.3 Outliers (boxplots)

**Qué hacemos:** boxplot de la longitud del texto (en caracteres), dividiendo también por etiqueta.

**Por qué boxplots y no otra cosa:** las columnas binarias solo tienen dos valores (`True`/`False`),
de modo que no poseen "datos atípicos" que detectar; los boxplots en este dataset tienen sentido
sobre la variable numérica que podemos derivar del texto: su **longitud**.

**Resultados:**
- Longitud media **186** caracteres, mediana **102** → distribución muy asimétrica (cola larga a la
  derecha: hay pocos comentarios muy largos).
- Usando el criterio clásico **Q3 + 1,5 × IQR** (Q3 = 217, IQR = 170 → umbral ≈ 472), encontramos
  **80 comentarios atípicos por longitud**, con un máximo de **4.474** caracteres.
- **Decisión:** no se eliminan. Un comentario largo no es un error de datos; es información (puede
  ser un discurso elaborado). Se marcan para análisis puntual y para vigilar que no desvirtúen el
  entrenamiento. La escala logarítmica ayudará a visualizarlos sin que aplaquen el resto.

### 4.4 Distribuciones (histogramas)

**Qué hacemos:** histogramas de la longitud, del número de palabras por comentario y del número de
etiquetas por comentario.

**Por qué:** complementan a los boxplots mostrando la *forma* de la distribución y, sobre todo,
revelan el **esquema multietiqueta** del problema.

**Resultados:**
- Longitud y palabras siguen una **caída exponencial** (pocos muy largos).
- Distribución de etiquetas por comentario: **538 comentarios con 0 etiquetas** (los no-tóxicos) y
  los tóxicos con **2 a 6 etiquetas**. Es decir, en esta muestra, todo comentario marcado como
  tóxico lleva al menos dos subetiquetas. Confirma **H2/H3**: la toxicidad no aparece sola y el
  número de etiquetas puede ser una señal de alerta.

### 4.5 Relaciones entre etiquetas (heatmaps de correlación y co-ocurrencia)

**Qué hacemos:** dos matrices. La **correlación** mide si dos etiquetas tienden a moverse juntas
(en valores 0/1 equivale al coeficiente phi). La **co-ocurrencia** cuenta, directamente, cuántos
comentarios tienen marcadas dos etiquetas a la vez.

**Por qué:** si el odio es jerárquico o redundante, esto se ve aquí antes de entrenar ningún
modelo, y nos evita construir clasificadores duplicados.

**Resultados:**
- `IsHatespeech` ↔ `IsRacist`: **0,94** (125 comentarios llevan ambas) → prácticamente redundantes.
  Modelar las dos por separado duplicaría el trabajo; conviene elegir una o tratarlas como una sola
  clase "odio".
- `IsToxic` ↔ `IsAbusive`: **0,80** (353 co-occurrencias); `IsAbusive` ↔ `IsProvocative`: **0,59**;
  `IsAbusive` ↔ `IsObscene`: **0,45**.
- Las co-ocurrencias más frecuentes forman el núcleo *tóxico–abusivo–provocador*: confirma **H3**
  (jerarquía), en la que lo grueso (abuso/provocación) es el contenedor de lo fino (odio/racismo).

### 4.6 Relaciones entre texto y etiquetas (pairplot)

**Qué hacemos:** pairplot de las características derivadas del texto (longitud, nº de palabras,
longitud media de palabra, nº de etiquetas) coloreado por `IsHatespeech`.

**Por qué:** comprobar H2 visualmente y ver si esas variables separan por sí solas los comentarios
de odio (si lo hicieran, servirían como features adicionales al modelo).

**Resultados:** los comentarios de odio tienden a concentrarse en longitudes medias-altas y con más
etiquetas, aunque con solapamiento: la longitud no basta por sí sola como clasificador, pero sí
aporta como señal complementaria al texto.

---

## 5. Conclusiones y su impacto en el modelado

1. **`IsToxic` es el objetivo binario a usar.** Está casi balanceado (46,2 % positivos) y coincide
   con la lógica del negocio (detectar toxicidad). Los modelos pueden compararse con una línea base
   (Dummy) y con la métrica macro-F1, sin trampas de accuracy.

2. **El resto de etiquetas está desbalanceado de forma extrema y en cascada.** De los 1.000
   comentarios, solo 462 son tóxicos y de ahí se reparte el resto: abuso 353, provocación 161,
   odio 138, racismo 125, obsceno 100, y luego una cola con menos del 3 % (amenaza, odio religioso,
   nacionalismo, sexismo). **Qué significa y por qué:** el ratio 1:N crece de 1,2 hasta 1.000,
   por lo que esas etiquetas minoritarias no podrán entrenarse con fiabilidad con estas 1.000 filas.
   Si el negocio las exige, habrá que recopilar más datos o agrupar etiquetas (familias de odio).

3. **Hay que descartar y/o agrupar.** `IsHomophobic` y `IsRadicalism` no se entrenan (0 ejemplos).
   `IsHatespeech` y `IsRacist` son casi redundantes (0,94) → una única clase reduce complejidad sin
   perder casi información.

4. **El esquema es multietiqueta con jerarquía.** Los tóxicos llevan 2–6 etiquetas y las gruesas
   contienen a las finas. Estrategia natural: primero una binaria `IsToxic`, y después (si el
   negocio lo pide) una segunda fase por familias de etiquetas en lugar de 12 clasificadores.

5. **El texto tiene señales de forma.** Longitud y nº de etiquetas distinguen algo entre tóxico y no
   tóxico; sirven como features auxiliares, nunca como sustituto del análisis de las palabras.

6. **Los 80 comentarios de longitud extrema y los 3 duplicados** requieren tratamiento en la fase
   de preparación (deduplicación; y en outliers, decisión explícita de conservar o truncar).

---

## 6. Próximos pasos

1. Confirmar con el equipo la **definición de objetivo**: binario `IsToxic` como MVP.
2. Decidir el **mapeo de etiquetas** para las subclases (agrupar familias; descartar o marcar como
   "sin entrenamiento" las minoritarias).
3. Definir la **métrica oficial** (macro-F1 como principal, con recall mínimo en la clase de odio).
4. Preparar los datos: deduplicación, *train/test estratificado* por `IsToxic`, y vectorización
   TF-IDF sobre el texto.
5. Entrenar la línea base (Dummy) y los modelos clásicos propuestos, midiendo siempre contra esa
   línea base.

---

## 7. Reproducibilidad

Los análisis se generan con los scripts de esta carpeta (`eda_exploring.py`, `eda_bars.py`,
`eda_boxplots.py`, `eda_heatmaps.py`, `eda_hists.py`, `eda_pairplots.py`), que leen directamente
`data/youtoxic_english_1000.csv`. Las cifras de este informe se obtuvieron sobre la muestra de
1.000 registros del archivo indicado.