# Plataforma progresiva

## Purpose

Definir un entorno y límites que permitan demostrar el producto esencial sin servicios avanzados.

## Scope

Arquitectura, estructura, configuración, Docker, despliegue y documentación.

## Out of Scope

Implementación durante discovery; microservicio ML; infraestructura distribuida.

## Level

🟢 Essential; 🟠 Advanced. Cada requisito declara su nivel mínimo; superiores acumulan los anteriores.

## Contracts

Ver [diseño](../../design.md) y [contratos](../../contracts/README.md). Interfaces no HTTP, rutas y estructura pertenecen al diseño; OpenAPI es la fuente formal HTTP.

## Dependencies

Épica EP-01. [Backlog y gates](../../../../../docs/planning/backlog.md) identifica dependencias por historia; las OQ bloqueantes deben cerrarse antes de su trabajo dependiente.

## ADDED Requirements

### Requirement: PL-01 Independencia de nivel

El sistema MUST permitir predicción manual sin DB, YouTube, MLflow ni paquetes neuronales; modelo real local sí es requisito de readiness.

Nivel: 🟢 Essential. Historias: US-02, US-09, US-18.

#### Scenario: PL-01 aceptación observable

- **WHEN** se arranca Essential sin variables ni servicios opcionales
- **THEN** liveness responde 200 y readiness/predicción funcionan con bundle aprobado; capacidades opcionales se anuncian deshabilitadas.

### Requirement: PL-02 Configuración reproducible

El equipo MUST disponer de un único entorno backend/ML con lock, variables documentadas y comandos simples; frontend se ejecuta por separado.

Nivel: 🟢 Essential. Historias: US-02.

#### Scenario: PL-02 aceptación observable

- **WHEN** una persona prepara una máquina limpia con los locks y el bundle documentado
- **THEN** puede iniciar ambos servicios siguiendo README; ninguna clave aparece en bundle frontend o repositorio.

### Requirement: PL-03 Imágenes y despliegue independientes

El proyecto MUST construir frontend/backend por separado y ofrecer Compose con imagen PostgreSQL opcional, sin servicio ML independiente.

La preparación y validación técnica del despliegue MUST poder comenzar con US-27 y el producto Essential integrado que requiere, sin esperar US-25/26. El equipo MUST NOT cerrar US-28 ni declarar Advanced completo hasta aceptar US-24/25/26/27 y los AC de publicación; desplegar una versión Essential/Medium no sustituye esos gates.

Nivel: 🟠 Advanced. Historias: US-27, US-28.

#### Scenario: PL-03 aceptación observable

- **WHEN** se construyen las imágenes y se arranca el perfil base sin PostgreSQL
- **THEN** el flujo manual funciona; el perfil completo añade PostgreSQL; la publicación usa HTTPS y configuración propia de cada servicio.

#### Scenario: PL-03 despliegue temprano sin declaración Advanced

- **WHEN** US-27 y el producto integrado correspondiente están disponibles, pero faltan capacidades Advanced
- **THEN** se prepara y prueba el deployment del nivel disponible, con los permisos y controles de publicación acordados; US-28 permanece pendiente de sus gates Advanced y de validar los flujos de la versión final publicada.

### Requirement: PL-04 Documentación y colaboración verificables

El equipo MUST mantener specs, contratos, informes y reglas de review enlazados sin presentar planes como resultados.

Nivel: 🟢 Essential. Historias: US-01, US-34.

#### Scenario: PL-04 aceptación observable

- **WHEN** se revisa una PR de historia
- **THEN** se encuentra spec, AC, evidencia y review ajeno; los cambios se integran en dev y no se escribe directamente main.

## Acceptance Criteria

Cada escenario anterior MUST demostrarse con evidencia de las historias enlazadas. No basta crear archivos ni marcar tareas completas.

## Testing Strategy

Unitarios sobre reglas aisladas, integración de límites y E2E para comportamiento UI/API. Para experimentos: manifiestos, asserts de particiones y reproducción; para documentos: revisión y enlaces. Aplicar TDD y DoD de [CONTRIBUTING](../../../../../CONTRIBUTING.md).

## Failure / Edge Cases

Los escenarios incluyen gates y degradación. Errores HTTP siguen ErrorEnvelope; no ocultar fallos ni usar datos de test para corregir selección. Casos adicionales específicos se detallan en las historias asociadas.
