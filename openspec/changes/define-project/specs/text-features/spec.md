# NLP y características

## Purpose

Demostrar NLP clásico mediante experimentos controlados y transformaciones reutilizables durante inferencia.

## Scope

Regex, tokens, stopwords, stemming, lematización, BoW, TF-IDF, ngramas y augmentation.

## Out of Scope

Incluir todas las transformaciones automáticamente en producción.

## Level

🟢 Essential. Cada requisito declara su nivel mínimo; superiores acumulan los anteriores.

## Contracts

Ver [diseño](../../design.md) y [contratos](../../contracts/README.md). Interfaces no HTTP, rutas y estructura pertenecen al diseño; OpenAPI es la fuente formal HTTP.

## Dependencies

Épica EP-02. [Backlog y gates](../../../../../docs/planning/backlog.md) identifica dependencias por historia; las OQ bloqueantes deben cerrarse antes de su trabajo dependiente.

## ADDED Requirements

### Requirement: TX-01 Transformaciones medibles

El equipo MUST implementar y comparar regex, tokenización, stopwords, stemming y lematización con pruebas de Unicode, negación, URLs y entrada vacía; documentar inclusión o descarte.

Nivel: 🟢 Essential. Historias: US-06.

#### Scenario: TX-01 aceptación observable

- **WHEN** se ejecutan las ablations con iguales folds
- **THEN** cada técnica tiene resultado y decisión; entrenamiento e inferencia usan la misma transformación versionada.

### Requirement: TX-02 Vectorización sin fuga

El pipeline MUST experimentar BoW, TF-IDF y ngramas; fit de vocabulario e IDF MUST usar solo train del fold.

Nivel: 🟢 Essential. Historias: US-07.

#### Scenario: TX-02 aceptación observable

- **WHEN** validación contiene un token exclusivo
- **THEN** ese token no altera vocabulario/IDF; se puede transformar sin hacer fit ni densificar innecesariamente matrices.

### Requirement: TX-03 Sintéticos trazables solo train

La augmentation MUST aplicarse dentro del train de cada fold y etiquetar parent_id, técnica y seed; MUST NOT alterar validation/test.

Su demostración MUST completarse para declarar Essential completo, pero MUST NOT bloquear la selección e integración del primer clásico. Puede realizarse como ablation posterior sobre development; MUST NOT modificar el candidato congelado ni usar su test para decidir cambios. Una promoción posterior MUST seguir el protocolo existente de nuevo ciclo con holdout independiente.

Nivel: 🟢 Essential. Historias: US-08.

#### Scenario: TX-03 aceptación observable

- **WHEN** se compara un run aumentado con el control
- **THEN** IDs/hash de holdouts permanecen idénticos y ningún padre cruza particiones; se revisa preservación semántica.

#### Scenario: TX-03 ablation posterior a la primera integración

- **WHEN** US-15 y US-16 concluyen mientras US-08 sigue pendiente
- **THEN** el primer clásico puede funcionar y probarse; US-08 compara únicamente folds de development, conserva el bundle aprobado y aporta su evidencia antes de cerrar US-18 como Essential completo.

## Acceptance Criteria

Cada escenario anterior MUST demostrarse con evidencia de las historias enlazadas. No basta crear archivos ni marcar tareas completas.

## Testing Strategy

Unitarios sobre reglas aisladas, integración de límites y E2E para comportamiento UI/API. Para experimentos: manifiestos, asserts de particiones y reproducción; para documentos: revisión y enlaces. Aplicar TDD y DoD de [CONTRIBUTING](../../../../../CONTRIBUTING.md).

## Failure / Edge Cases

Los escenarios incluyen gates y degradación. Errores HTTP siguen ErrorEnvelope; no ocultar fallos ni usar datos de test para corregir selección. Casos adicionales específicos se detallan en las historias asociadas.
