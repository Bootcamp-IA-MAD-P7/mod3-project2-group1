# Historial opcional

## Purpose

Conservar y consultar predicciones autorizadas sin que un fallo de almacenamiento bloquee inferencia.

## Scope

Repositorio desacoplado, PostgreSQL, lectura protegida, retención y pruebas DB.

## Out of Scope

Historial público, cuentas multiusuario, garantía durable de jobs.

## Level

🔴 Expert. Cada requisito declara su nivel mínimo; superiores acumulan los anteriores.

## Contracts

Ver [diseño](../../design.md) y [contratos](../../contracts/README.md). Interfaces no HTTP, rutas y estructura pertenecen al diseño; OpenAPI es la fuente formal HTTP.

## Dependencies

Épica EP-06. [Backlog y gates](../../../../../docs/planning/backlog.md) identifica dependencias por historia; las OQ bloqueantes deben cerrarse antes de su trabajo dependiente.

## ADDED Requirements

### Requirement: DB-01 Guardado independiente

La predicción MUST devolver resultado válido aunque falle guardar; su status de persistencia MUST distinguir stored/failed/disabled.

Nivel: 🔴 Expert. Historias: US-29, US-30.

#### Scenario: DB-01 aceptación observable

- **WHEN** PostgreSQL no responde durante predicción
- **THEN** el resultado sigue siendo 200 con persistence failed dentro del deadline; lectura histórica devuelve 503.

### Requirement: DB-02 Consulta protegida y retención

El historial MUST requerir token de recurso, guardar solo su hash y aplicar política de retención aprobada; MUST NOT guardar texto real sin configuración/política revisadas.

Nivel: 🔴 Expert. Historias: US-30.

#### Scenario: DB-02 aceptación observable

- **WHEN** se consulta con token incorrecto o el recurso expiró
- **THEN** se responde 404 sin revelar existencia; la purga elimina registros vencidos y no aparecen secretos en logs.

### Requirement: DB-03 Semántica real de DB

El proyecto MUST probar migraciones y comportamientos PostgreSQL específicos en PostgreSQL efímero; SQLite solo valida operaciones portables.

Nivel: 🔴 Expert. Historias: US-29.

#### Scenario: DB-03 aceptación observable

- **WHEN** se ejecuta la suite marcada postgres
- **THEN** constraints/migraciones/zonas horarias se verifican sobre PostgreSQL y los tests SQLite no se atribuyen esa cobertura.

## Acceptance Criteria

Cada escenario anterior MUST demostrarse con evidencia de las historias enlazadas. No basta crear archivos ni marcar tareas completas.

## Testing Strategy

Unitarios sobre reglas aisladas, integración de límites y E2E para comportamiento UI/API. Para experimentos: manifiestos, asserts de particiones y reproducción; para documentos: revisión y enlaces. Aplicar TDD y DoD de [CONTRIBUTING](../../../../../CONTRIBUTING.md).

## Failure / Edge Cases

Los escenarios incluyen gates y degradación. Errores HTTP siguen ErrorEnvelope; no ocultar fallos ni usar datos de test para corregir selección. Casos adicionales específicos se detallan en las historias asociadas.

