# Define project — propuesta para revisión

## Why

El equipo necesita convertir un briefing de NLP en un producto de apoyo a moderación que siga funcionando aunque no alcance Expert. Contratos y slices pequeños permiten aprendizaje individual y desarrollo paralelo sin implementar aún producto.

## What Changes

Se proponen requisitos, arquitectura, contratos, 7 épicas y 34 historias, con gates de datos/calidad y trazabilidad. Esta entrega es exclusivamente documental y no declara capacidades implementadas.

## Capabilities

### New Capabilities

- `platform`: Definir un entorno y límites que permitan demostrar el producto esencial sin servicios avanzados.
- `data-lifecycle`: Establecer datos autorizados y particiones reproducibles que permitan experimentos comparables y sin fuga.
- `text-features`: Demostrar NLP clásico mediante experimentos controlados y transformaciones reutilizables durante inferencia.
- `model-lifecycle`: Comparar cuatro modelos personales con baseline y promover un candidato con evidencia reproducible.
- `manual-analysis`: Ofrecer al moderador una señal sobre un comentario mediante UI y API desacopladas del modelo.
- `video-analysis`: Extender el análisis a comentarios de un vídeo mediante extracción limitada y estados comprensibles.
- `prediction-history`: Conservar y consultar predicciones autorizadas sin que un fallo de almacenamiento bloquee inferencia.
- `quality-accessibility`: Hacer comprobables los contratos y flujos críticos mediante TDD, pruebas y revisión accesible.
- `green-observability`: Medir decisiones computacionales y diagnosticar fallos sin añadir dependencias al camino esencial.

### Modified Capabilities

Ninguna: proyecto greenfield confirmado por usuario.

## Impact

Estructura futura frontend/backend, ML local, configuración y servicios opcionales. Solo se crean archivos de documentación/especificación en esta entrega. No endpoints, React, EDA, entrenamiento, Docker funcional ni Issues remotas.

## Review gates

Ver [preguntas](../../../docs/discovery.md). Aprobar contratos de mocks desbloquea trabajo paralelo; datos y mínimos de calidad bloquean solo experimentación/integración real. No archivar deltas de producto sin implementarlos y verificarlos por slice.

