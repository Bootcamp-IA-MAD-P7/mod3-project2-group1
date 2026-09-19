# Laboratory: evidencia DEV de modelos clásicos

## Why

CIVIKA dispone de evidencia reproducible sobre la evaluación DEV de cuatro modelos clásicos, la selección humana de Logistic Regression y el artefacto DEV-only congelado. Esta evidencia existe en informes y JSON locales, pero no tiene una representación técnica, visual y accesible dentro del frontend.

Laboratory será una sección de desarrollo para hacer comprensible esa evidencia sin convertirla en una promesa de rendimiento global, una consola de producción o una superficie de acceso al TEST sellado.

## What Changes

- Crear una feature frontend Laboratory basada en una snapshot estática y tipada derivada exclusivamente de informes DEV versionados y metadata del artefacto final.
- Presentar Technical Overview, Model Comparison, Selected Model, Fold Analysis, Experiments y Technical Reports/Sources.
- Distinguir de forma explícita el modelo seleccionado por decisión humana (Logistic Regression) del modelo con mayor F1 toxic medio observada en DEV (LinearSVC), sin llamar a ninguno "best model", "winner" ni superior global.
- Presentar la ablación de augmentation de MultinomialNB como experimento independiente, no mezclado con la comparación homogénea.
- Aplicar identidad CIVIKA técnica, responsive y accesible con superficies lavanda/violeta, dark mode, tablas y alternativas textuales para cualquier visualización.

## Capabilities

### Added Capabilities

- `laboratory-dev-evidence`: visualización técnica estática y trazable de evidencia DEV de modelos clásicos.

### Unchanged Capabilities

- `global-navigation`, `dashboard`, `manual-analysis`, `video-analysis`, `prediction-history`, `settings`, Header, AppLayout, Sidebar, contratos HTTP, backend y ML.

## Impact

- Alcance previsto de código: `frontend/src/features/laboratory/**` y, si hiciera falta, tests de la feature.
- No se modifica `App.tsx`, Sidebar, Header ni AppLayout: sin routing aprobado, Laboratory no se conectará como destino navegable en este change.
- No se crea API, no se leen archivos de backend en runtime, no se expone el `.joblib` y no se usa TEST.
- La snapshot deberá identificar fuentes, fecha o versión de evidencia y naturaleza DEV estática para evitar presentar datos locales como tiempo real.
- Relación con Issue: no verificada.
