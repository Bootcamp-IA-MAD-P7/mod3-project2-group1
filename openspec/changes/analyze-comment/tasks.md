# Tasks

## 1. Arquitectura y contrato tipado

- [x] 1.1 Crear `frontend/src/features/analyze-comment/` y tipos estrictos alineados con `PredictionRequest`, `Prediction`, `PersistenceStatus` y `ErrorEnvelope`, sin modificar contratos backend. (US-17)
- [x] 1.2 Definir view model y estados `initial`, `invalid`, `ready`, `submitting`, `success`, `validation_error`, `backend_unavailable` y `unexpected_error`; excluir estados de video-analysis. (US-17)
- [x] 1.3 Definir `ManualAnalysisDataSource` y adaptador HTTP aislado; los componentes no llaman directamente a `fetch`. (US-17)

## 2. Formulario y validación

- [x] 2.1 Implementar textarea para un comentario con label visible, conservación literal del texto y CTA. (US-17)
- [x] 2.2 Validar 1–5000 code points y whitespace-only sin bloquear Unicode, multilínea, URLs o caracteres especiales válidos. (US-17)
- [x] 2.3 Asociar errores al textarea y evitar doble envío mientras `submitting`, conservando texto en errores recuperables. (US-17)

## 3. Integración HTTP y errores

- [x] 3.1 Adaptar el data source HTTP para resolver `VITE_API_BASE_URL` o el fallback local `http://localhost:8000/api/v1` y llamar a `${baseUrl}/predictions` con exactamente `{ text }`, sin normalización silenciosa, URL del comentario ni logging de contenido/tokens. (US-09, US-16, US-17)
- [x] 3.2 Mapear 200, 422, 503, 500/red y, cuando ocurran, 413/429/504 a mensajes seguros y recuperables sin inventar capacidades backend. (US-09, US-17)
- [x] 3.3 Mantener la frontera compatible con respuestas de `BundlePredictor` de US-16 y con el fallback `FakePredictor`, sin rehacer presentación ni schemas ni asumir un algoritmo. (US-16)

## 4. Resultado contractual y señal revisable

- [x] 4.1 Presentar Hate / Non-hate como señal de revisión humana, con texto además de color. (US-17)
- [x] 4.2 Mostrar score solo con `score_kind=calibrated_probability`; comunicar `unavailable` sin porcentajes inventados. (US-17)
- [x] 4.3 Mostrar aviso prudente para `model_version=fake-dev-v1`, sin presentarlo como Logistic Regression ni ML real. (US-09)
- [x] 4.4 Comunicar `persistence.status=disabled` como dato secundario, sin prometer History/recuperación y sin mostrar `resource_token`. (US-30)

## 5. Experiencia CIVIKA, accesibilidad y responsive

- [x] 5.1 Aplicar jerarquía CIVIKA: contexto → textarea → CTA → resultado → información secundaria, sin dashboard o landing extensa. (US-17)
- [x] 5.2 Garantizar semántica, teclado, foco visible, `aria-describedby`, `aria-live`, contraste y comprensión independiente del color. (US-17)
- [x] 5.3 Verificar manualmente desktop, tablet, 320 CSS px, zoom 200 % y light/dark sin overflow horizontal global; navegación por teclado, foco visible, ejecución con teclado y legibilidad de formulario y resultado: PASS. (US-17)

## 6. Tests, validación y evidencia

- [x] 6.1 Añadir tests Vitest/Testing Library/MSW de whitespace-only, límite 5000, Unicode, preservación literal, URL por defecto/configurada, success Hate/Non-hate, calibrated_probability, score unavailable/null sin porcentaje, 422, 503, 500/red, submit bloqueado, texto conservado tras error, fake condicional, review_required, persistence disabled y ausencia de renderizado de `resource_token`. (US-17)
- [x] 6.2 Ejecutar `npm test` (34/34 PASS), `npm run build` (PASS) y `git diff --check` (PASS). No hay script de lint configurado en `frontend/package.json`. (US-17)
- [x] 6.3 Realizar revisión manual de light/dark, teclado, foco, 320 CSS px, zoom 200 %, estados Hate/Non-hate, significado de Hate probability, backend con modelo real y ausencia de overflow: PASS. (US-17)
- [ ] 6.4 Ejecutar `openspec validate analyze-comment --strict` y `/opsx:verify` solo si están disponibles; la CLI y `/opsx:verify` no están disponibles en el entorno actual y no se instalarán herramientas. (OpenSpec)

## Fuera de alcance

- Analyze Conversation, Analyze Content, URL de YouTube, análisis múltiple, jobs, polling, History, Logging, persistencia, routing, Sidebar, Header, AppLayout, `App.tsx`, backend, ML, datasets, TEST, entrenamiento, tuning y augmentation.
- Toxic/non-toxic, risk level, Low/Medium/High, severidad, toxicidad porcentual, sentimiento, emociones, tono, motivos, palabras destacadas, recomendaciones o acciones automáticas.
