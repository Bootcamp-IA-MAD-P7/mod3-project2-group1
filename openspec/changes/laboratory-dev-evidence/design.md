# Diseño: Laboratory DEV evidence

## Contexto y fuentes de verdad

Laboratory es una página técnica de CIVIKA para explicar evidencia DEV de modelos clásicos. No es una funcionalidad principal de moderación, una página de usuario final ni un panel de producción.

La implementación posterior solo podrá derivar datos de estas fuentes versionadas:

- `docs/reports/experiments/comparison.md`.
- `docs/reports/experiments/logistic_regression_dev.json`.
- `docs/reports/experiments/linear_svc_dev.json`.
- `docs/reports/experiments/sgd_classifier_dev.json`.
- `docs/reports/experiments/multinomial_nb_dev.json`.
- `docs/reports/experiments/augmentation.md`.
- `backend/ml/artifacts/logistic_regression_dev_final.metadata.json`.

El TEST permanece sellado. No se copia, calcula, inspecciona ni presenta información TEST.

## Modelo de datos y trazabilidad

La feature tendrá un módulo TypeScript de snapshot DEV explícito y tipado dentro de `frontend/src/features/laboratory/`. Será una representación controlada de evidencia versionada, no un mock ni una fuente live.

Cada bloque de la snapshot debe conservar referencias de procedencia suficientes para identificar informe o metadata fuente. Su actualización será manual y deliberada: antes de cambiarla se deben reconciliar los valores con los informes de origen y mantener la distinción entre evidencia DEV, ablaciones y artefacto final.

El entorno de ejecución también se etiqueta por fuente: los informes de experimento registran Python 3.12.7, mientras la metadata del artefacto final registra Python 3.12.13. Laboratory MUST NOT fusionar ambos valores como si pertenecieran a la misma ejecución.

No se importarán archivos desde `backend/` o `docs/` en runtime del navegador. No se añadirá API ni lectura arbitraria del filesystem. El `.joblib` no se expone; solo se muestra metadata técnica aprobada, como checksum, configuración, entorno y composición DEV cuando sea pertinente.

## Composición de la página

1. **Technical Overview**: evidencia DEV, TEST sealed, protocolo `StratifiedGroupKFold` de tres folds agrupados por `VideoId`, tamaño DEV, número de grupos, modelo seleccionado y existencia de artefacto DEV-only.
2. **Model Comparison**: tabla y/o barras comparativas accesibles de MultinomialNB, Logistic Regression, LinearSVC y SGDClassifier con F1 toxic, desviación, precision, recall, macro-F1, accuracy y gap cuando existan.
3. **Selected Model**: Logistic Regression, configuración congelada, TF-IDF, preprocessing, estabilidad observada, metadata del artefacto, entorno, checksum, grupos DEV y limitaciones. Debe explicar que fue una decisión humana fundada en evidencia conjunta.
4. **Fold Analysis**: evidencia por fold disponible para cada candidato, con métricas y matrices de confusión tabulares/textuales.
5. **Experiments**: tuning de Logistic Regression y ablación de augmentation de MultinomialNB en bloques separados. La ablación no modifica ni reemplaza la comparación común.
6. **Technical Reports / Sources**: lista compacta de fuentes versionadas; no se implementa un visor de Markdown completo.

La UI evitará una proliferación de KPI o gráficas. Las barras pueden complementar valores textuales, nunca sustituirlos. Las matrices serán tablas con cabeceras, etiquetas de clase y texto explicativo.

## Selección humana y lenguaje

El lenguaje debe mantener dos hechos diferentes:

- **Selected model**: Logistic Regression, por decisión humana previa a TEST, teniendo en cuenta rendimiento DEV, estabilidad observada y `predict_proba`.
- **Highest DEV F1 observed**: LinearSVC, con F1 toxic media de 0.5741 frente a 0.5518 para Logistic Regression bajo la comparación DEV disponible.

Ninguna etiqueta equivale a "best model", "winner", modelo superior universal o generalización demostrada. La página debe mostrar las limitaciones: solo 808 filas DEV, 9 `VideoId`, tres folds agrupados, cambio de distribución por vídeo y gaps train-validation elevados.

## Integración temporal

La Sidebar ya contiene Laboratory con badge DEV, pero no hay router. Este change no añade React Router, rutas, enlaces ni callbacks de navegación. La página permanecerá desacoplada hasta un change global de navegación que establezca destinos reales para todas las entradas de Sidebar.

## Identidad visual, responsive y accesibilidad

Laboratory reutiliza layout, tokens y componentes UI existentes. Su personalidad técnica usa violetas/lavandas, badges DEV, tablas cuidadas y detalles sutiles de experimentación, sin estética terminal ni dashboard corporativo genérico. Los colores no codifican por sí solos selección, clases o resultados.

- Desktop: comparación y detalle pueden convivir en columnas cuando haya espacio.
- Tablet: las regiones pasan a una columna o dos según legibilidad.
- Móvil ~320 CSS px y zoom 200 %: contenido funcional en una columna; cualquier tabla amplia se encapsula en su propia región con scroll horizontal accesible, caption y cabeceras visibles, sin desbordar la página.
- Light/dark: cada superficie, texto, borde, foco y visualización tendrá equivalente legible.
- Semántica: `main`, secciones con headings, tablas con caption y cabeceras, controles de teclado si existen, foco visible y alternativas textuales para barras o matrices.

## Límites

- No routing global, navegación funcional desde Sidebar, cambios en Sidebar, Header, AppLayout, Dashboard, History, Settings ni áreas Analyze.
- No backend, endpoints, predictor API, ML, entrenamiento, reentrenamiento, selección de modelo adicional, MLflow, persistencia de experimentos ni tiempo real.
- No apertura, evaluación, predicción, métrica, inspección ni representación de TEST.

## Validación al aplicar

- Tests de datos/snapshot y componentes cuando exista infraestructura aplicable.
- `npm run build` desde `frontend/` y lint disponible, si existe.
- Revisión manual desktop, light/dark, 320 CSS px, zoom 200 %, navegación por teclado, foco visible, tablas y matrices.
- Confirmar que las fuentes de snapshot coinciden con los informes y que no contiene datos TEST.
- `git diff --check`.
- `openspec validate laboratory-dev-evidence --strict` y `/opsx:verify` solo si están disponibles; no instalar herramientas.

## Riesgos y decisiones pendientes

- La snapshot duplica de manera controlada valores de informes; se requiere un proceso humano de reconciliación para evitar drift.
- Laboratory no será accesible desde la UI hasta que se resuelva routing global de forma coherente para todas las áreas.
- El informe `comparison.md` conserva una frase histórica inicial que afirma que la consolidación no contiene bundle, aunque más adelante documenta el bundle DEV-only creado después y el artefacto/metadata existen. Para Laboratory, la existencia del artefacto se sustentará en `logistic_regression_dev_final.metadata.json` y no en esa frase histórica.
