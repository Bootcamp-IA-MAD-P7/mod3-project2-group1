# Diseño: Analyze conversation

## Mapping de producto

Analyze conversation es el nombre de producto/UI para la capability técnica video-analysis.

Flujo: URL de YouTube → validación → solicitud → obtención limitada de comentarios principales → clasificación individual Hate / Non-hate → resumen agregado → resultados consultables.

No es análisis manual de múltiples textos. No afirma comprensión de conversaciones humanas, threads, respuestas, autores, causalidad, sentimiento, emociones, severidad, engagement ni contexto completo del vídeo. Las respuestas/hilos de YouTube quedan fuera de la primera versión según video-analysis. Analyze content es otra área futura: contenido del propio vídeo, no sus comentarios.

Fuentes de verdad:

- openspec/changes/define-project/specs/video-analysis/spec.md
- openspec/changes/define-project/contracts/openapi.json
- openspec/changes/define-project/contracts/README.md
- openspec/changes/define-project/design.md
- docs/planning/stories/US-20.md, US-21.md y US-22.md

## Estado de dependencia

### Implementado ahora

El backend solo monta health y POST /api/v1/predictions para un comentario manual. No existen rutas video-analyses, store de jobs, adaptador YouTube, polling ni resultados de vídeo. El predictor vigente en desarrollo es fake.

### Especificado / planificado

El contrato define:

- POST /api/v1/video-analyses con youtube_url y max_comments opcional; rango 1–500 y default 100.
- GET /api/v1/video-analyses/{analysis_id} y GET /api/v1/video-analyses/{analysis_id}/results, protegidos con resource token.
- Estados queued, processing, completed, partial y failed; expiración o reinicio como 404.
- fetched_count y analyzed_count separados; conteos hate/non_hate, truncated, stop_reason, error y expires_at.
- ResultPage con cursor y CommentResult con texto, ordinal y Prediction.
- Prediction binaria, score nullable con score_kind, model_version y review_required.

La UI puede avanzar con fixtures tipados de demostración. No hará fetch, polling real ni prometerá datos live hasta que exista este backend.

## Arquitectura frontend

La feature separará tipos de contrato/vista, fixtures locales tipados, componentes de presentación y una frontera futura de cliente API. La validación de URL en UI será ayuda; el backend conserva la autoridad contractual. Resource token no se muestra ni se registra en la interfaz.

Estados requeridos:

- Initial y validación: URL YouTube y errores accesibles.
- Submitting, queued y processing: estado textual y conteos conocidos, sin porcentaje exacto ni reenvío automático.
- Completed: resumen y resultados paginados.
- Partial: resultados disponibles y razón normalizada.
- Failed: error seguro y recuperable.
- Expired: recurso perdido por TTL/reinicio; permitir nuevo análisis.
- Truncated: límite alcanzado sin afirmar cobertura completa.

Los resultados muestran texto, ordinal y Hate/Non-hate. Score solo se muestra con score_kind calibrated_probability; unavailable nunca genera porcentaje. Model version y review_required solo se muestran cuando aporten señal revisable y procedan del contrato.

## CIVIKA, accesibilidad y límites

Usar violetas/lavandas para estructura y naranja/verde semánticos con texto para Hate/Non-hate. Reutilizar shared UI y tokens existentes; no copiar Laboratory ni usar estética de terminal.

Garantizar semántica, labels, foco visible, teclado, contraste, dark/light, 320 CSS px y zoom 200 %. Tablas/listados amplios se encapsulan sin overflow horizontal global.

No modificar Analyze comment, Analyze content, Login, Settings, Logging, Dashboard, Laboratory, Sidebar, Header, AppLayout, App, routing, backend, ML, datasets o TEST. No se crea React Router ni navegación temporal.

## Validación al aplicar

- Tests de tipos, fixtures y componentes cuando exista infraestructura frontend.
- Build, lint disponible y git diff --check.
- Revisión manual de estados, desktop, dark/light, 320 CSS px, zoom 200 %, teclado, foco y resultados.
- Confirmar ausencia de HTTP contra endpoints inexistentes y que fixtures son demostración.
- Ejecutar OpenSpec strict y opsx verify solo si están disponibles; no instalar herramientas.
