# Tasks

## 1. Contrato y modelo de vista

- [x] 1.1 Crear tipos de dominio/vista alineados con VideoAnalysisRequest, AnalysisAccepted, Job, ResultPage, CommentResult y Prediction, sin cambiar contrato.
- [x] 1.2 Aplicar el mapping Analyze conversation (producto/UI) → video-analysis (capability/contrato técnico).
- [x] 1.3 Crear fixtures tipados de demostración para initial, processing, completed, partial, failed, expired y truncated; sin fetch ni resultados presentados como reales.
- [ ] 1.4 Añadir tests relevantes de tipos, fixtures y estados cuando exista infraestructura frontend aplicable.

## 2. Entrada y estados

- [x] 2.1 Implementar URL de YouTube y ayuda de validación accesible, manteniendo el backend como autoridad final.
- [x] 2.2 Implementar initial, validation, submitting, queued y processing sin porcentaje ficticio ni POST repetido.
- [x] 2.3 Implementar completed, partial, failed y expired con mensajes recuperables y accesibles.
- [x] 2.4 Comunicar truncamiento y diferenciar fetched_count de analyzed_count.

## 3. Resumen y resultados

- [x] 3.1 Implementar resumen con conteos Hate / Non-hate y estado, sin categorías ni métricas inventadas.
- [x] 3.2 Implementar resultados individuales desde fixtures con texto, ordinal, label y campos Prediction respaldados.
- [x] 3.3 Mostrar score solo con score_kind calibrated_probability; representar unavailable sin porcentaje.
- [x] 3.4 Preparar paginación compatible con ResultPage.next_cursor sin navegación HTTP.
- [x] 3.5 Mantener resource token fuera de la presentación y reservar su gestión para el futuro adaptador API.

## 4. Experiencia CIVIKA y desacoplamiento

- [x] 4.1 Aplicar CIVIKA: violetas/lavandas; Hate naranja y Non-hate verde con texto equivalente.
- [x] 4.2 Garantizar semántica, foco, teclado, contraste, dark/light, 320 CSS px, zoom 200 % y ausencia de overflow global.
- [x] 4.3 No modificar App, Sidebar, Header, AppLayout, routing, backend o ML; no crear endpoints ni usar TEST.
- [x] 4.4 Definir frontera futura de cliente API para sustituir fixtures sin rehacer componentes, sin realizar HTTP.

## 5. Validación

- [ ] 5.1 Ejecutar tests frontend aplicables cuando exista infraestructura.
- [x] 5.2 Ejecutar npm run build, lint disponible y git diff --check.
- [x] 5.3 Revisar manualmente desktop, dark/light, 320 CSS px, zoom 200 %, teclado, foco, estados, resultados y tablas/listados.
- [x] 5.4 Verificar que no se incorpora HTTP, contrato falso, dato TEST o cambio fuera de alcance.
- [ ] 5.5 Ejecutar openspec validate analyze-conversation --strict y opsx verify solo si están disponibles; no instalar herramientas.

## Dependencias

- La integración de URL, job, polling y resultados depende de US-20, US-21 y rutas video-analyses aún no implementadas.
- US-22 aporta la integración frontend final y E2E; esta feature es su superficie UI Analyze conversation.
- El routing global es un change independiente posterior.
- Relación con Issue: no verificada.

## Evidencia de validación manual

- Look & Feel CIVIKA: PASS.
- Estados initial/ready, processing, completed, partial, failed, expired y truncated: PASS.
- Light mode y dark mode: PASS.
- Viewport 320 CSS px y zoom 200 %: PASS.
- Navegación por teclado y foco visible: PASS.
- Resultados individuales y distribución Hate / Non-hate: PASS.
- Sin overflow horizontal global: PASS.

Las tareas 1.4 y 5.1 permanecen pendientes porque el frontend no dispone de infraestructura de tests. La tarea 5.5 permanece pendiente: OpenSpec CLI y /opsx:verify no están disponibles y no se instalarán herramientas.
