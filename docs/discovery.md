# Discovery y decisiones pendientes

## PASO 1 — Repository assessment completado por verificación del usuario

El 14 de septiembre de 2026 el usuario confirmó un proyecto **greenfield** con commit inicial, ramas `main` y `dev` creadas y sincronizadas con `origin`. No hay implementación ni decisiones previas que preservar. No se dispone de dataset ni de una configuración OpenSpec previa verificada. README, CONTRIBUTING, tooling y documentación de producto se diseñan desde cero según el briefing.

La inspección local encontró únicamente `.git`, sin commits ni remoto; GitHub CLI respondió 401 y Git tuvo errores TLS. Esto describe el entorno de la sesión, no contradice ni sustituye el assessment del repositorio real. La entrega se prepara fuera de su checkout operativo, sin escribir en referencias Git. No se afirma haber inspeccionado archivos remotos ni datos.

Decisiones acordadas por el briefing: dos servicios desplegables; React/Vite/Tailwind/shadcn; FastAPI/Pydantic; ML dentro de backend y un solo `backend/pyproject.toml`; uv, Polars, scikit-learn, SQLAlchemy; PostgreSQL; SQLite compatible para tests; TDD; objetivo Expert con Essential independiente. No existe aún lockfile ni versión de runtime acordada.

## PASO 2 — OPEN QUESTIONS

BLOCKING significa bloqueante **para las historias indicadas**, no para toda la planificación. Ninguna pregunta impide redactar esta propuesta ni desarrollar mocks tras aprobar contratos. Los valores propuestos no se presentan como acuerdos del equipo.

| ID | Estado y gate | Decisión necesaria | Alternativas y recomendación | Trade-off / responsable de cierre |
|---|---|---|---|---|
| OQ-01 | BLOCKING US-03–08, US-11–15, US-25, US-31 | Dataset, licencia, procedencia, idioma, unidad, etiquetas y permiso de uso | Inspeccionar candidato real y ficha de datos antes de elegir. Recomendar dataset etiquetado con licencia compatible y lengua conocida; no inventar URL ni distribución | Disponibilidad frente a adecuación a YouTube; equipo, con EDA revisado |
| OQ-02 | BLOCKING US-05–08 y selección | Mapeo de etiquetas a `hate`/`non_hate` y protocolo comparable | Recomendar clasificación binaria solo si ontología lo permite. `offensive` no equivale automáticamente a odio. Conservar clases originales en manifiesto | Simplificación frente a pérdida semántica; equipo valida tras ficha/EDA |
| OQ-03 | BLOCKING US-15 promoción | Umbral mínimo de calidad y recall de odio | Recomendar macro-F1 principal, gap absoluto <5 pp y mejora sobre Dummy; fijar umbrales de recall y mínimos antes de entrenar candidatos | FN perjudica detección; FP sobrecarga moderación y daña confianza. Equipo + criterio del profesor |
| OQ-04 | NON-BLOCKING; antes de US-04 | Responsable del EDA | Veru o trabajo asistido por IA; recomendar un responsable humano nombrado y revisión de los cuatro | Capacidad disponible; IA no aprueba resultados |
| OQ-05 | NON-BLOCKING; antes de US-11–14 | Cuatro modelos y asignación personal | Propuesta MNB, Logistic Regression, LinearSVC y SGDClassifier(loss=log_loss). El cuarto es provisional para texto disperso; confirmar con dimensiones/clases reales, o sustituir por ComplementNB si desbalance lo justifica | SGD añade aprendizaje incremental pero se solapa con LR; ComplementNB menos diverso. Cada persona posee un modelo distinto; no asignado aquí |
| OQ-06 | NON-BLOCKING; antes de US-25/31 | Arquitectura neuronal y transformer | LSTM pequeña si lengua/volumen lo permiten; transformer compacto adecuado al idioma. Elegir solo con presupuesto y evidencia | Coste, licencia y latencia frente a mejora; responsables ML |
| OQ-07 | BLOCKING US-28 publicación / US-30 historial real | Hosting, acceso, retención y uso de datos externos | Recomendar demo pública sin historial público; historial y jobs protegidos por token de acceso al recurso, datos de demo por defecto. Aprobar retención antes de activar guardado real | Menor complejidad frente a colaboración multiusuario; equipo |
| OQ-08 | NON-BLOCKING; antes de US-20 live | Credenciales, presupuesto/cuota y alcance de comentarios | Propuesta: comentarios principales, no respuestas; máximo 500 por análisis. Revisar contra cuota real y condiciones de API | Cobertura incompleta claramente visible; equipo |
| OQ-09 | NON-BLOCKING; antes de US-02 | Versiones exactas, package manager frontend y herramienta OpenSpec | Recomendar Node LTS compatible, npm con lockfile, Python compatible con dependencias mínimas; fijar versiones al preparar entorno. OpenSpec schema `spec-driven`, CLI se valida y registra | Reproducibilidad frente a compatibilidad; no se afirma una versión instalada |

Los contratos binarios quedan como **propuesta condicionada a OQ-02**. Si el dataset requiere salida multiclase, aprobar una revisión de contrato antes de integrar ML real. Mocks y estructura no dependen de resolverlo.
