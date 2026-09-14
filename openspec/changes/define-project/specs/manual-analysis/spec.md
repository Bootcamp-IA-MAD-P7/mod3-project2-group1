# Predicción y conectividad

## Purpose

Ofrecer al moderador una señal sobre un comentario mediante UI y API desacopladas del modelo.

## Scope

Health, validación, inferencia, artefactos, errores y frontend manual.

## Out of Scope

Moderación irreversible, entrenamiento en petición, dependencia DB.

## Level

🟢 Essential. Cada requisito declara su nivel mínimo; superiores acumulan los anteriores.

## Contracts

Ver [diseño](../../design.md) y [contratos](../../contracts/README.md). Interfaces no HTTP, rutas y estructura pertenecen al diseño; OpenAPI es la fuente formal HTTP.

## Dependencies

Épica EP-04. [Backlog y gates](../../../../../docs/planning/backlog.md) identifica dependencias por historia; las OQ bloqueantes deben cerrarse antes de su trabajo dependiente.

## ADDED Requirements

### Requirement: PR-01 Contrato manual estable

La API MUST aceptar texto no vacío de hasta 5000 code points y devolver schema Prediction o ErrorEnvelope; MUST NOT aceptar tipos/coerciones/campos extra inválidos.

Nivel: 🟢 Essential. Historias: US-01, US-09.

#### Scenario: PR-01 aceptación observable

- **WHEN** se envía texto válido o whitespace con contrato revisado
- **THEN** el primero recibe 200 y el segundo 422 estándar sin eco sensible; mocks y Pydantic respetan OpenAPI.

### Requirement: PR-02 Inferencia real y versión

El backend MUST cargar un bundle confiable compatible una vez por proceso y ejecutar preprocessing idéntico al entrenado; MUST NOT usar Dummy silencioso ante fallo.

Nivel: 🟢 Essential. Historias: US-16.

#### Scenario: PR-02 aceptación observable

- **WHEN** el bundle falta, falla checksum o es incompatible
- **THEN** readiness devuelve 503 y la UI muestra indisponibilidad; liveness continúa respondiendo.

### Requirement: PR-03 Semántica de señal y score

La interfaz MUST presentar clasificación de contenido como señal revisable y soportar score null; MUST NOT mostrar un margen como probabilidad.

Nivel: 🟢 Essential. Historias: US-17.

#### Scenario: PR-03 aceptación observable

- **WHEN** un modelo sin calibración devuelve non_hate y score null
- **THEN** la UI muestra resultado con limitación sin porcentaje y sin afirmación absoluta sobre una persona.

### Requirement: PR-04 Slice completo

El producto MUST demostrar entrada manual a resultado con artefacto real, errores y controles accesibles desde frontend, sin capacidades de otros niveles.

Nivel: 🟢 Essential. Historias: US-18.

#### Scenario: PR-04 aceptación observable

- **WHEN** se ejecuta E2E con DB/YouTube/MLflow ausentes
- **THEN** el flujo manual y health pasan con evidencia y ningún mock sustituye la inferencia de aceptación final.

## Acceptance Criteria

Cada escenario anterior MUST demostrarse con evidencia de las historias enlazadas. No basta crear archivos ni marcar tareas completas.

## Testing Strategy

Unitarios sobre reglas aisladas, integración de límites y E2E para comportamiento UI/API. Para experimentos: manifiestos, asserts de particiones y reproducción; para documentos: revisión y enlaces. Aplicar TDD y DoD de [CONTRIBUTING](../../../../../CONTRIBUTING.md).

## Failure / Edge Cases

Los escenarios incluyen gates y degradación. Errores HTTP siguen ErrorEnvelope; no ocultar fallos ni usar datos de test para corregir selección. Casos adicionales específicos se detallan en las historias asociadas.

