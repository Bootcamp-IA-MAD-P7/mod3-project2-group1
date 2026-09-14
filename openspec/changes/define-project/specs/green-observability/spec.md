# Coste y observabilidad

## Purpose

Medir decisiones computacionales y diagnosticar fallos sin añadir dependencias al camino esencial.

## Scope

Coste, caché segura, carga única, logs y tracking local/MLflow.

## Out of Scope

Afirmaciones ambientales sin medición; MLflow obligatorio para arrancar.

## Level

🟢 Essential; 🔴 Expert. Cada requisito declara su nivel mínimo; superiores acumulan los anteriores.

## Contracts

Ver [diseño](../../design.md) y [contratos](../../contracts/README.md). Interfaces no HTTP, rutas y estructura pertenecen al diseño; OpenAPI es la fuente formal HTTP.

## Dependencies

Épica EP-07. [Backlog y gates](../../../../../docs/planning/backlog.md) identifica dependencias por historia; las OQ bloqueantes deben cerrarse antes de su trabajo dependiente.

## ADDED Requirements

### Requirement: GO-01 Coste registrado

Cada experimento MUST registrar hardware, tiempo, memoria, tamaño y presupuesto; MUST justificar reejecuciones y modelos pesados.

Nivel: 🟢 Essential. Historias: US-10, US-15.

#### Scenario: GO-01 aceptación observable

- **WHEN** dos modelos tienen calidad similar
- **THEN** la elección documenta coste/latencia y favorece menor consumo suficiente, sin inventar estimaciones energéticas.

### Requirement: GO-02 Reutilización segura

La inferencia MUST reutilizar bundle cargado y experimentación MUST aislar caché por dataset/split/fold/preprocessing.

Nivel: 🟢 Essential. Historias: US-16, US-19.

#### Scenario: GO-02 aceptación observable

- **WHEN** se repite inferencia o se cambia de fold
- **THEN** no se recarga el modelo por request y no se reutiliza estado aprendido de otro fold.

### Requirement: GO-03 Tracking con fallback

El entrenamiento MUST registrar localmente incluso si MLflow está caído; adapter MLflow MUST adjuntar parámetros/métricas/vectorización/preprocessing y artefactos sin participar en inferencia.

Nivel: 🔴 Expert. Historias: US-32.

#### Scenario: GO-03 aceptación observable

- **WHEN** MLflow falla al registrar un run
- **THEN** el run continúa con manifest local y tracking_failed; puede recuperarse manualmente sin reentrenar.

## Acceptance Criteria

Cada escenario anterior MUST demostrarse con evidencia de las historias enlazadas. No basta crear archivos ni marcar tareas completas.

## Testing Strategy

Unitarios sobre reglas aisladas, integración de límites y E2E para comportamiento UI/API. Para experimentos: manifiestos, asserts de particiones y reproducción; para documentos: revisión y enlaces. Aplicar TDD y DoD de [CONTRIBUTING](../../../../../CONTRIBUTING.md).

## Failure / Edge Cases

Los escenarios incluyen gates y degradación. Errores HTTP siguen ErrorEnvelope; no ocultar fallos ni usar datos de test para corregir selección. Casos adicionales específicos se detallan en las historias asociadas.

