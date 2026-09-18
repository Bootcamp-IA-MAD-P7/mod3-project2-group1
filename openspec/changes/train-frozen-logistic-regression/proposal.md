# Entrenar Logistic Regression congelada sobre DEV

## Why

Tras la decisión humana de US-15, el candidato necesita un bundle reproducible entrenado únicamente con DEV antes de cualquier evaluación TEST autorizada.

## What Changes

- Reutilizar la factoría congelada de Logistic Regression y entrenarla una vez sobre las 808 filas DEV.
- Persistir pipeline completo, metadata auditable y checksums.
- Verificar que los `HOLDOUT_VIDEO_IDS` no participan en la selección ni en el ajuste.

## Capabilities

No se añade ni modifica una capability. Este change implementa la fase de bundle pre-TEST ya prevista por `model-lifecycle` y US-15.

## Impact

- Código ML de entrenamiento y tests unitarios.
- Artefacto local ignorado por Git y metadata versionable.
- No hay cambios de API, inferencia, modelos candidatos, configuración, datos ni contratos.
- Trazabilidad: US-15 se puede demostrar en la planificación; la relación con un número concreto de Issue de GitHub no está verificada.
