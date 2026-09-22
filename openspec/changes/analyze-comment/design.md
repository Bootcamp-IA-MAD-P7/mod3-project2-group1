# Diseño: Analyze Comment

## Contexto y límite de producto

Analyze Comment es la interfaz CIVIKA de `manual-analysis`: un moderador escribe un único comentario y solicita una clasificación Hate / Non-hate. Es una señal para revisión humana, no una decisión de moderación automática.

No es Analyze Conversation: no recibe URL, no crea jobs, no consulta comentarios principales, no analiza respuestas ni hace polling. Tampoco es Analyze Content, History o Logging.

La fuente contractual es `POST /api/v1/predictions`. Con `MODEL_PATH` válido, US-16 carga una vez por proceso un bundle íntegro mediante `BundlePredictor`; la respuesta puede contener un score calibrado y una `model_version` opaca. Si no hay bundle en development, `FakePredictor` sigue siendo un fallback real con `model_version: fake-dev-v1`, `score: null` y `score_kind: unavailable`. Un bundle faltante, inválido o incompatible en el escenario correspondiente devuelve 503, no un fallback silencioso. `NullPredictionRepository` mantiene `persistence.status: disabled` y `resource_token: null`.

## Arquitectura frontend

La feature futura reside en `frontend/src/features/analyze-comment/` y separa:

1. **Tipos y view model**: request, `Prediction`, `ErrorEnvelope`, estados UI y etiquetas de producto.
2. **Frontera de datos**: un puerto tipado, por ejemplo `ManualAnalysisDataSource`, para crear una predicción.
3. **Adaptador HTTP**: única capa que conoce `fetch`, `VITE_API_BASE_URL`, el fallback local y respuestas HTTP.
4. **Presentación**: página, formulario, resultado y errores sin llamadas HTTP directas.

El adaptador resuelve `VITE_API_BASE_URL` cuando está configurada, elimina su barra final y, en desarrollo local, usa `http://localhost:8000/api/v1`. La llamada final es `${baseUrl}/predictions`. No se usa una ruta relativa contra Vite como solución de integración. Los componentes deciden el copy desde campos contractuales, sin suponer modelo ni algoritmo.

## Flujo y validación

El formulario envía exactamente `{ "text": textoOriginal }`; no normaliza, recorta ni transforma silenciosamente.

Replica solo reglas contractuales: string de 1–5.000 code points y al menos un carácter no whitespace. Unicode, multilínea, caracteres especiales y URLs son válidos. En `submitting` se deshabilita envío; ante error recuperable se conserva el texto.

## Semántica de respuesta

- `label` se presenta solo como **Hate** o **Non-hate**, con texto además de color.
- `review_required: true` se comunica como necesidad de revisión humana.
- `score` se presenta como probabilidad/confidence solo con `score_kind === "calibrated_probability"` y valor numérico. Con `unavailable` no hay porcentaje ni estimación.
- `model_version === "fake-dev-v1"` activa un aviso visible y prudente de entorno/demo de desarrollo. En cualquier otra versión opaca, la UI no afirma un algoritmo concreto ni una promoción de modelo.
- `prediction_id` y `created_at` no son necesarios para comprender la señal inicial.
- `persistence.status === "disabled"` puede informar secundariamente que el análisis no se guarda; no promete History ni recuperación.
- `resource_token` no se muestra, registra ni pasa a presentación.

No se calculan niveles de riesgo, severidad, toxicidad, sentimiento, tono, explicaciones, motivos, palabras destacadas, recomendaciones ni acciones automáticas.

## Estados UX y errores

| Estado | Origen | Comportamiento |
| --- | --- | --- |
| `initial` | página abierta | textarea vacío y guía concisa |
| `invalid` | regla local | error asociado al textarea; no se envía |
| `ready` | texto válido | CTA disponible |
| `submitting` | petición activa | CTA deshabilitado y estado textual |
| `success` | HTTP 200 | resultado binario revisable e información respaldada |
| `validation_error` | HTTP 422 | mensaje seguro vinculado al campo; conserva texto |
| `backend_unavailable` | HTTP 503 | indisponibilidad recuperable; conserva texto |
| `unexpected_error` | red, 500 u otra respuesta | mensaje genérico seguro y reintento |

413, 429 y 504 están documentados en OpenAPI, pero la ruta actual no los implementa expresamente. El adaptador los manejará con copy seguro si ocurren, sin afirmar capacidades inexistentes. No existen queued, processing, partial, expired, truncated ni polling.

## Accesibilidad, responsive y CIVIKA

La jerarquía es contexto, textarea, CTA, resultado e información secundaria. Se usan violetas/lavandas estructurales, naranja semántico para Hate y verde para Non-hate, sin depender solo de color.

El textarea tendrá label visible, errores mediante `aria-describedby` y resultados/errores con `aria-live` apropiado. Se verificará teclado, foco visible, contraste, light/dark, desktop, tablet, 320 CSS px y zoom 200 %, sin overflow horizontal global.

## Privacidad y seguridad

El comentario no se incluye en URL, consola, logging ni analytics improvisados. Los errores no muestran detalles internos ni hacen eco del input. No se muestra ni registra el token. La UI no asume que el texto se conserve; en el estado actual no se guarda.

## Validación

El frontend ya dispone de Vitest, Testing Library, MSW, `frontend/vitest.config.ts`, `frontend/src/test/setup.ts` y `frontend/src/mocks/server.ts`. Analyze Comment añadirá tests propios para validación contractual, preservación literal, URL por defecto y configurada, resultados Hate/Non-hate, score calibrado/no disponible, errores HTTP/red, envío único, fake condicional, revisión humana, persistencia deshabilitada y ausencia de renderizado de `resource_token`.

Al aplicar: `npm test`, build, lint disponible, `git diff --check`, revisión manual y `openspec validate analyze-comment --strict` / `/opsx:verify` solo si están disponibles, sin instalar herramientas.
