# Informes reproducibles

No hay resultados todavía. No rellenar métricas, distribución o mejoras sin ejecutar el trabajo futuro.

| Informe | Ubicación futura | Contenido y evidencia |
|---|---|---|
| EDA | `docs/reports/eda/report.md` | Dataset/hash/licencia, comando/notebook y versión, nulos, etiquetas, duplicados/grupos, longitudes, idiomas, sesgos y decisiones; sin exponer holdout para selección |
| Experimentos | `docs/reports/experiments/<run-id>.md` | Persona/modelo, commit, entorno/lock, split/hash, seed, pipeline, hiperparámetros, train/CV, coste, ablations, errores, artefactos y limitaciones |
| Comparación | `docs/reports/experiments/comparison.md` | Cuatro modelos + Dummy, mismo protocolo, validación principal y ablations separadas, elección previa al test |
| Evaluación final | `docs/reports/experiments/final-evaluation.md` | Candidato congelado, test aislado, gap, métricas/clases, matriz, FN/FP, gate aprobado o fallido sin ocultarlo |
| Testing | `docs/reports/testing/report.md` | Commit, comandos, suites, entorno, resultados reales, exclusiones, accesibilidad, fallos y evidencias E2E |

Cada informe distingue resultado observado, interpretación y propuesta. Artefactos grandes y datasets quedan fuera de Git; enlazar manifest con hash y recuperación autorizada. Usar ejemplos anonimizados o sintéticos en presentaciones. La evidencia de IA debe ser revisada por una persona.
