# Dashboard/Home

## Purpose

Proporcionar una pantalla resumen de actividad de moderación y un punto de entrada visual a los flujos de análisis especializados, sin sustituirlos.

## Scope

La composición de Dashboard/Home, su modelo de vista tipado, fixtures mock compatibles con el dominio y accesibilidad local a la feature.

## Out of Scope

Analyze Comment, Analyze Video, History, Settings, router, navegación global, Header, Sidebar, AppLayout, peticiones HTTP, contratos, endpoints, persistencia, polling, jobs, resultados paginados y categorías de riesgo no definidas.

## ADDED Requirements

### Requirement: DH-01 Resumen independiente

Dashboard/Home MUST ser una pantalla de resumen y punto de entrada; MUST NOT ejecutar análisis, crear jobs, hacer polling ni presentar los resultados detallados de Analyze Comment, Analyze Video o History.

#### Scenario: DH-01 límites de feature

- **WHEN** un moderador abre Dashboard/Home
- **THEN** encuentra una visión breve y los accesos visuales a Analyze Comment y Analyze Video, sin formularios de análisis, URL de vídeo, progreso de jobs ni resultados paginados en Home.

### Requirement: DH-02 Datos mock tipados y sustituibles

Durante esta primera versión, Dashboard/Home MUST alimentarse únicamente de fixtures mock explícitos, tipados y separados de los componentes de presentación. MUST NOT realizar llamadas HTTP ni simular estados de carga o error de una API inexistente.

#### Scenario: DH-02 origen de datos visible

- **WHEN** se revisa la implementación de Dashboard/Home
- **THEN** los datos de ejemplo están separados de la presentación, no existe cliente HTTP de Dashboard y los componentes no afirman que los valores sean datos persistidos o en tiempo real.

### Requirement: DH-03 Taxonomía compatible con el dominio

Dashboard/Home MUST limitar sus clasificaciones visibles a `Hate` y `Non-hate`, derivadas de los conceptos contractuales `hate` y `non_hate`. MUST NOT presentar `Safe`, `Potentially toxic`, `High risk` ni escalas de riesgo `low`/`medium`/`high` mientras no exista una especificación formal que las defina.

#### Scenario: DH-03 distribución comprensible

- **WHEN** el Dashboard presenta un conteo o distribución mock de clasificaciones
- **THEN** cada categoría se identifica mediante texto además de color y corresponde únicamente a Hate o Non-hate.

### Requirement: DH-04 Actividad reciente acotada

Dashboard/Home MAY mostrar una muestra limitada de actividad reciente mediante datos mock compatibles con la taxonomía. MUST NOT presentarla como historial persistido, listado público disponible ni fuente de resultados detallados.

#### Scenario: DH-04 actividad de ejemplo

- **WHEN** se muestra Recent Activity con fixtures
- **THEN** la tabla comunica que es una muestra de ejemplo y no expone conceptos de riesgo no definidos ni afirma que exista un endpoint de historial.

### Requirement: DH-05 Accesibilidad local

Dashboard/Home MUST conservar estructura semántica, controles utilizables por teclado, foco visible, contraste verificable e información de clasificación no dependiente exclusivamente del color. El layout MUST seguir siendo usable a 320 CSS px y 200 % de zoom.

#### Scenario: DH-05 revisión con teclado y viewport reducido

- **WHEN** se recorre Dashboard/Home solo con teclado y se visualiza a 320 CSS px o 200 % de zoom
- **THEN** los controles interactivos reciben foco visible, los contenidos permanecen comprensibles y las clasificaciones se entienden mediante texto sin depender del color.

## Validation

Al aplicar el change, ejecutar el build disponible de frontend, revisión manual de accesibilidad y validaciones OpenSpec estrictas cuando la CLI esté disponible. No se requiere instalar infraestructura de tests para esta entrega.