# Vídeo y seguimiento

## Purpose

Extender el análisis a comentarios de un vídeo mediante extracción limitada y estados comprensibles.

## Scope

URLs, API YouTube, jobs, resultados, paginación y monitor acotado.

## Out of Scope

Respuestas a comentarios en primera versión, scraping, durabilidad o tiempo real garantizados.

## Level

🟡 Medium; 🟠 Advanced. Cada requisito declara su nivel mínimo; superiores acumulan los anteriores.

## Contracts

Ver [diseño](../../design.md) y [contratos](../../contracts/README.md). Interfaces no HTTP, rutas y estructura pertenecen al diseño; OpenAPI es la fuente formal HTTP.

## Dependencies

Épica EP-05. [Backlog y gates](../../../../../docs/planning/backlog.md) identifica dependencias por historia; las OQ bloqueantes deben cerrarse antes de su trabajo dependiente.

## ADDED Requirements

### Requirement: VI-01 URL y extracción limitada

El sistema MUST validar hosts/formas/ID permitidos, usar API oficial y paginar comentarios principales con deduplicación y límite; MUST NOT descargar URLs arbitrarias.

Nivel: 🟡 Medium. Historias: US-20.

#### Scenario: VI-01 aceptación observable

- **WHEN** se recibe URL de host no permitido o con ID inválido
- **THEN** se devuelve 422 antes de red; con vídeo válido se respeta max_comments y se informa truncamiento.

### Requirement: VI-02 Jobs y fallos explícitos

El sistema MUST devolver 202 y recurso protegido, procesar en cola acotada y distinguir completed vacío, partial y failed; MUST conservar resultados previos hasta TTL.

Nivel: 🟡 Medium. Historias: US-21.

#### Scenario: VI-02 aceptación observable

- **WHEN** YouTube agota cuota tras un batch analizado
- **THEN** Job termina partial con QUOTA_EXCEEDED y conteos exactos; no se pierde el batch ni se reintenta indefinidamente.

### Requirement: VI-03 Dashboard paginado

La UI MUST mostrar progreso por conteos, resumen y páginas, estados vacíos/errores/expiración y cobertura sin afirmar total desconocido.

Nivel: 🟡 Medium. Historias: US-22.

#### Scenario: VI-03 aceptación observable

- **WHEN** un job devuelve completed sin comentarios o expira
- **THEN** se anuncia estado accesible y se permite nuevo análisis; no se muestra un falso fallo ML o resumen de cobertura total.

### Requirement: VI-04 Seguimiento controlable

El sistema MUST permitir crear/consultar/detener monitor acotado, deduplicar comentarios y no solapar ciclos; MUST informar pérdida de estado al reiniciar.

Nivel: 🟠 Advanced. Historias: US-26.

#### Scenario: VI-04 aceptación observable

- **WHEN** se detiene un monitor con ciclo en curso
- **THEN** no se programan nuevos ciclos, el actual puede finalizar y los resultados previos permanecen hasta TTL.

## Acceptance Criteria

Cada escenario anterior MUST demostrarse con evidencia de las historias enlazadas. No basta crear archivos ni marcar tareas completas.

## Testing Strategy

Unitarios sobre reglas aisladas, integración de límites y E2E para comportamiento UI/API. Para experimentos: manifiestos, asserts de particiones y reproducción; para documentos: revisión y enlaces. Aplicar TDD y DoD de [CONTRIBUTING](../../../../../CONTRIBUTING.md).

## Failure / Edge Cases

Los escenarios incluyen gates y degradación. Errores HTTP siguen ErrorEnvelope; no ocultar fallos ni usar datos de test para corregir selección. Casos adicionales específicos se detallan en las historias asociadas.

