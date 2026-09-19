# Analyze conversation: comentarios principales de vídeo

## Why

CIVIKA ya define video-analysis: una URL de YouTube inicia un job acotado que obtiene comentarios principales, los clasifica individualmente y expone estado, resumen y resultados paginados. En producto, esta capability se llama Analyze conversation.

La página y el backend de vídeo aún no existen. Este change delimita la experiencia frontend sin presentar una capacidad planificada como disponible, sin duplicar Analyze comment ni Analyze content, y sin reinterpretarla como análisis de threads o de relaciones humanas.

## What Changes

- Definir Analyze conversation como interfaz de producto para video-analysis.
- Especificar URL, validación, solicitud, processing, completed, partial, failed, expired y truncamiento conforme al contrato vigente.
- Preparar modelos y fixtures tipados de demostración, sustituibles por un cliente API cuando exista backend.
- Definir resumen y resultados solo con campos de VideoAnalysisRequest, Job, ResultPage, CommentResult y Prediction.
- Aplicar Look & Feel CIVIKA, responsive y accesibilidad sin modificar navegación global.

## Capabilities

### Added Capabilities

- analyze-conversation: experiencia frontend para comentarios principales de un vídeo de YouTube mediante la capability técnica planificada video-analysis.

### Unchanged Capabilities

- video-analysis, manual-analysis, dashboard, global-navigation, laboratory-dev-evidence, prediction-history, settings, Header, Sidebar, AppLayout, backend, ML, contratos HTTP y routing.

## Impact

- Implementación futura: frontend/src/features/analyze-conversation/** y fixtures locales tipados mientras no exista backend.
- Sin React Router, rutas, cambios en App, Sidebar, Header o AppLayout.
- Sin endpoints, cambios de Predictor, entrenamiento ML ni TEST.
- La integración HTTP, polling y token depende de US-20, US-21 y video-analysis.
- Relación con Issue: no verificada.
