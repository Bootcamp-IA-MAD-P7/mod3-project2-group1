# Datos y EDA

## Purpose

Establecer datos autorizados y particiones reproducibles que permitan experimentos comparables y sin fuga.

## Scope

Dataset, etiquetas, licencia, split, EDA y manifiestos.

## Out of Scope

Ejecutar EDA en esta entrega; seleccionar pipeline observando test.

## Level

🟢 Essential. Cada requisito declara su nivel mínimo; superiores acumulan los anteriores.

## Contracts

Ver [diseño](../../design.md) y [contratos](../../contracts/README.md). Interfaces no HTTP, rutas y estructura pertenecen al diseño; OpenAPI es la fuente formal HTTP.

## Dependencies

Épica EP-02. [Backlog y gates](../../../../../docs/planning/backlog.md) identifica dependencias por historia; las OQ bloqueantes deben cerrarse antes de su trabajo dependiente.

## ADDED Requirements

### Requirement: DA-01 Ficha y ontología

El equipo MUST registrar origen, licencia, idioma, esquema, hash y mapeo explícito de etiquetas antes de entrenar; MUST NOT equiparar ofensivo a odio sin justificación.

Nivel: 🟢 Essential. Historias: US-03.

#### Scenario: DA-01 aceptación observable

- **WHEN** el dataset se propone para entrenamiento
- **THEN** la ficha está revisada, se cierran OQ-01/02 y datos sin permiso o etiquetas ambiguas no se promueven.

### Requirement: DA-02 Split y holdout aislado

El protocolo MUST separar grupos/duplicados antes de cualquier fit y generar IDs/hash de folds compartidos; test MUST permanecer fuera de EDA decisional, tuning y thresholds.

Nivel: 🟢 Essential. Historias: US-05.

#### Scenario: DA-02 aceptación observable

- **WHEN** dos experimentos cargan el manifiesto de particiones
- **THEN** obtienen los mismos IDs, no hay grupos compartidos y la rutina de desarrollo no abre test.

### Requirement: DA-03 EDA revisado

El equipo MUST analizar nulos, etiquetas, longitudes, idioma, desbalance, duplicados y sesgos sobre development y producir informe reproducible revisado.

Nivel: 🟢 Essential. Historias: US-04.

#### Scenario: DA-03 aceptación observable

- **WHEN** la persona responsable ejecuta el EDA en development
- **THEN** el informe identifica datos/commit/comando y limita sus conclusiones; no expone holdout para selección.

## Acceptance Criteria

Cada escenario anterior MUST demostrarse con evidencia de las historias enlazadas. No basta crear archivos ni marcar tareas completas.

## Testing Strategy

Unitarios sobre reglas aisladas, integración de límites y E2E para comportamiento UI/API. Para experimentos: manifiestos, asserts de particiones y reproducción; para documentos: revisión y enlaces. Aplicar TDD y DoD de [CONTRIBUTING](../../../../../CONTRIBUTING.md).

## Failure / Edge Cases

Los escenarios incluyen gates y degradación. Errores HTTP siguen ErrorEnvelope; no ocultar fallos ni usar datos de test para corregir selección. Casos adicionales específicos se detallan en las historias asociadas.

