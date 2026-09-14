# Calidad y accesibilidad

## Purpose

Hacer comprobables los contratos y flujos críticos mediante TDD, pruebas y revisión accesible.

## Scope

TDD, unit/integration/E2E, CI, seguridad visible y accesibilidad.

## Out of Scope

Sustituir revisión manual de accesibilidad por un score automático.

## Level

🟢 Essential; 🟠 Advanced; 🔴 Expert. Cada requisito declara su nivel mínimo; superiores acumulan los anteriores.

## Contracts

Ver [diseño](../../design.md) y [contratos](../../contracts/README.md). Interfaces no HTTP, rutas y estructura pertenecen al diseño; OpenAPI es la fuente formal HTTP.

## Dependencies

Épica EP-07. [Backlog y gates](../../../../../docs/planning/backlog.md) identifica dependencias por historia; las OQ bloqueantes deben cerrarse antes de su trabajo dependiente.

## ADDED Requirements

### Requirement: QA-01 TDD y suites

El equipo MUST aplicar RED GREEN REFACTOR a lógica testeable y mantener unit/integration/E2E diferenciados; pruebas sin red por defecto.

Nivel: 🟢 Essential. Historias: US-02, US-06, US-09, US-18, US-24.

#### Scenario: QA-01 aceptación observable

- **WHEN** una PR modifica regex, inferencia, validación o servicio
- **THEN** incluye evidencia RED útil y GREEN, tests pertinentes y DoD; experimentación documental justifica exclusiones.

### Requirement: QA-02 Acceso inclusivo

Las interfaces MUST tener labels, teclado/foco, mensajes anunciados, contraste verificable, estado con texto y layout usable a 320 CSS px/200% zoom.

Nivel: 🟢 Essential. Historias: US-17, US-18.

#### Scenario: QA-02 aceptación observable

- **WHEN** se completa predicción únicamente con teclado y se provoca un error
- **THEN** el foco y anuncio guían la corrección sin depender de color; la evidencia manual acompaña tests de UI.

### Requirement: QA-03 Exposición controlada

El despliegue MUST usar HTTPS, CORS explícito, límites y manejo de secretos; MUST renderizar comentarios como texto y no registrar tokens/contenido.

Nivel: 🟠 Advanced. Historias: US-28.

#### Scenario: QA-03 aceptación observable

- **WHEN** se envía comentario con HTML/script o se excede límite
- **THEN** la UI no ejecuta HTML y la API produce error estándar; logs no incluyen input ni credenciales.

### Requirement: QA-04 Regresión de degradación

El sistema MUST mantener el flujo Essential ante fallos de servicios opcionales y demostrar la suite acumulada por nivel.

Nivel: 🔴 Expert. Historias: US-33.

#### Scenario: QA-04 aceptación observable

- **WHEN** se detienen DB y MLflow en la demo Expert
- **THEN** predicción manual sigue disponible y reporta guardado fallido; tracking falla de forma visible sin abortar entrenamiento.

## Acceptance Criteria

Cada escenario anterior MUST demostrarse con evidencia de las historias enlazadas. No basta crear archivos ni marcar tareas completas.

## Testing Strategy

Unitarios sobre reglas aisladas, integración de límites y E2E para comportamiento UI/API. Para experimentos: manifiestos, asserts de particiones y reproducción; para documentos: revisión y enlaces. Aplicar TDD y DoD de [CONTRIBUTING](../../../../../CONTRIBUTING.md).

## Failure / Edge Cases

Los escenarios incluyen gates y degradación. Errores HTTP siguen ErrorEnvelope; no ocultar fallos ni usar datos de test para corregir selección. Casos adicionales específicos se detallan en las historias asociadas.

