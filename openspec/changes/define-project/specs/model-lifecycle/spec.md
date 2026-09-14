# Experimentos y selección

## Purpose

Comparar cuatro modelos personales con baseline y promover un candidato con evidencia reproducible.

## Scope

Baseline, cuatro candidatos, métricas, gap, tuning, ensemble y modelos avanzados.

## Out of Scope

Asignaciones personales arbitrarias; usar test para escoger modelos.

## Level

🟢 Essential; 🟡 Medium; 🟠 Advanced; 🔴 Expert. Cada requisito declara su nivel mínimo; superiores acumulan los anteriores.

## Contracts

Ver [diseño](../../design.md) y [contratos](../../contracts/README.md). Interfaces no HTTP, rutas y estructura pertenecen al diseño; OpenAPI es la fuente formal HTTP.

## Dependencies

Épica EP-03. [Backlog y gates](../../../../../docs/planning/backlog.md) identifica dependencias por historia; las OQ bloqueantes deben cerrarse antes de su trabajo dependiente.

## ADDED Requirements

### Requirement: ML-01 Comparación personal controlada

El equipo MUST comparar Dummy y cuatro modelos distintos, uno por persona, con mismos datos/folds/preprocessing principal/métricas/presupuesto; MUST incluir ajuste básico de hiperparámetros dentro de development desde Essential; asignación requiere acuerdo.

Nivel: 🟢 Essential. Historias: US-10, US-11, US-12, US-13, US-14.

#### Scenario: ML-01 aceptación observable

- **WHEN** se agregan los informes de los cuatro candidatos
- **THEN** metadatos confirman comparabilidad y diferencias de ablation se muestran separadas; todos comparan contra Dummy y documentan ajuste básico sin test.

### Requirement: ML-02 Evaluación con coste de error

La selección MUST usar macro-F1 propuesta, precision/recall/F1 por clase, matriz, FN/FP, mínimos preacordados y coste; MUST NOT basarse solo en accuracy.

Nivel: 🟢 Essential. Historias: US-10, US-15.

#### Scenario: ML-02 aceptación observable

- **WHEN** dos candidatos se comparan en development
- **THEN** la decisión justifica FN/FP, métricas y coste con umbrales fijados antes de entrenar.

### Requirement: ML-03 Gap y test final

La promoción MUST cumplir gap final absoluto de macro-F1 menor que 5 pp y mínimos de calidad; MUST congelar pipeline antes de abrir test y reportar fallos sin retuning sobre test.

Nivel: 🟢 Essential. Historias: US-15.

#### Scenario: ML-03 aceptación observable

- **WHEN** train macro-F1 es 0.85 y test 0.80 en un caso de prueba
- **THEN** el gate falla por 5 pp exactos; no se altera el modelo usando ese holdout.

### Requirement: ML-04 Optimización acotada

El equipo MUST optimizar con Optuna o técnica apropiada solo en development con presupuesto registrado y pipeline dentro de folds.

Nivel: 🟡 Medium. Historias: US-19.

#### Scenario: ML-04 aceptación observable

- **WHEN** se agota tiempo o número de trials
- **THEN** la búsqueda se detiene, registra mejor trial válido y no consulta test.

### Requirement: ML-05 Ensemble comparado

El equipo MUST entrenar ensemble separado de los cuatro modelos individuales y compararlo con el candidato clásico bajo igual protocolo.

Nivel: 🟡 Medium. Historias: US-23.

#### Scenario: ML-05 aceptación observable

- **WHEN** se ejecuta evaluación de ensemble
- **THEN** se registran mejora/coste; no se presenta margen sin calibrar como probabilidad ni se usa test repetidamente.

### Requirement: ML-06 Comparación neuronal

El equipo MUST evaluar una red neuronal adecuada, preferiblemente LSTM/RNN justificada, con truncamiento/padding aprendidos solo en train y presupuesto comparable.

Nivel: 🟠 Advanced. Historias: US-25.

#### Scenario: ML-06 aceptación observable

- **WHEN** la red no supera el clásico bajo criterios registrados
- **THEN** la comparación satisface aprendizaje y el clásico sigue siendo deployable sin dependencia neuronal.

### Requirement: ML-07 Transformer intercambiable

El equipo MUST evaluar un transformer adecuado al idioma/licencia y probarlo detrás del contrato común sin cambio frontend.

Nivel: 🔴 Expert. Historias: US-31.

#### Scenario: ML-07 aceptación observable

- **WHEN** el adapter transformer sustituye al clásico en una suite de contrato
- **THEN** la respuesta conserva semántica v1; si no se selecciona, Essential continúa con clásico.

## Acceptance Criteria

Cada escenario anterior MUST demostrarse con evidencia de las historias enlazadas. No basta crear archivos ni marcar tareas completas.

## Testing Strategy

Unitarios sobre reglas aisladas, integración de límites y E2E para comportamiento UI/API. Para experimentos: manifiestos, asserts de particiones y reproducción; para documentos: revisión y enlaces. Aplicar TDD y DoD de [CONTRIBUTING](../../../../../CONTRIBUTING.md).

## Failure / Edge Cases

Los escenarios incluyen gates y degradación. Errores HTTP siguen ErrorEnvelope; no ocultar fallos ni usar datos de test para corregir selección. Casos adicionales específicos se detallan en las historias asociadas.

