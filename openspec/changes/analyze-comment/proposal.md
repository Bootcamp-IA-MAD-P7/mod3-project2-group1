# Analyze Comment: clasificación manual de un comentario

## Why

CIVIKA expone `POST /api/v1/predictions`, pero aún no existe una experiencia frontend para que un moderador introduzca un único comentario y reciba la señal binaria correspondiente. La entrada visual **Analyze comment** no tiene página, cliente HTTP ni navegación funcional.

US-16 ya integró `BundlePredictor`: con un `MODEL_PATH` válido, el endpoint usa el bundle real congelado y devuelve su versión opaca y score contractual. `FakePredictor` permanece como fallback de development cuando no hay bundle; la interfaz debe identificarlo condicionalmente, sin presentarlo como comportamiento normal de producción ni afirmar un algoritmo concreto. `NullPredictionRepository` sigue sin prometer guardado o recuperación.

## What Changes

- Añadir una feature aislada `frontend/src/features/analyze-comment/` para un único comentario manual.
- Definir una frontera tipada de datos propia que desacople los componentes de HTTP y sea compatible tanto con `BundlePredictor` como con el fallback fake.
- Resolver la API mediante la convención frontend `VITE_API_BASE_URL`, con fallback de desarrollo `http://localhost:8000/api/v1`, y llamar a `${baseUrl}/predictions`.
- Integrar `POST /api/v1/predictions` conforme al contrato vigente: validación estricta, `Prediction` y `ErrorEnvelope`.
- Presentar exclusivamente Hate / Non-hate como señal revisable; mostrar score solo cuando `score_kind` indique probabilidad calibrada.
- Comunicar prudentemente `fake-dev-v1` solo cuando aparezca, además de `review_required` y persistencia deshabilitada, sin exponer tokens ni prometer History.
- Aplicar CIVIKA, accesibilidad, responsive, light/dark y privacidad.

## Scope

`comentario manual → POST /api/v1/predictions → Hate / Non-hate → revisión humana`.

La UI conserva el texto ante error, evita doble envío y contempla initial, invalid, ready, submitting, success, 422, 503, error inesperado/red y persistencia deshabilitada como información secundaria.

## Out of Scope

- Analyze Conversation, URL YouTube, análisis múltiple, jobs, polling, comentarios principales, respuestas o hilos.
- Analyze Content, History, Logging, acciones automáticas y persistencia.
- React Router, rutas, Sidebar, Header, AppLayout, `App.tsx`, navegación global y otras features.
- Backend, schemas, contratos HTTP, Predictor, Logistic Regression, datasets, TEST, entrenamiento, tuning o augmentation.
- Risk level, Low/Medium/High, toxic/non-toxic, toxicidad porcentual, sentimiento, emociones, tono, severidad, explicaciones, palabras resaltadas y recomendaciones.

## Capabilities

### Added Capabilities

- `analyze-comment`: interfaz CIVIKA para clasificar manualmente un único comentario mediante `manual-analysis`.

### Unchanged Capabilities

- `manual-analysis`, `prediction-history`, `video-analysis`, Dashboard, Analyze Conversation, Analyze Content, Laboratory, Login, Settings, Header, Sidebar, AppLayout, navegación global, backend, ML y contratos HTTP.

## Dependencies

- Contrato y backend existente de `manual-analysis` / `POST /api/v1/predictions`.
- US-09: contrato manual y fallback fake de development.
- US-16: inferencia real ya integrada para `MODEL_PATH` válido; Analyze Comment debe consumirla sin asumir algoritmo.
- US-17: interacción manual accesible; US-18: E2E final con bundle real.
- Vitest, Testing Library y MSW ya están disponibles en frontend para pruebas de esta feature.
- Persistencia y recuperación: US-29/US-30, fuera del change.

Relación con Issue: no verificada.
