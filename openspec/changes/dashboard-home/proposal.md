# Dashboard/Home — propuesta

## Why

La primera sección de la aplicación ya dispone de una composición visual, pero sus datos son mocks y no existe una capability que delimite su comportamiento. El uso de términos no definidos como "Safe", "Potentially toxic" y "High risk" impide afirmar que la interfaz represente el dominio real.

## What Changes

Definir Dashboard/Home como la pantalla resumen y punto de entrada del sistema. La entrega evoluciona la UI existente mediante un modelo de vista tipado y fixtures explícitamente mock, conservando la composición compatible y aplicando accesibilidad. La taxonomía visible queda limitada a `Hate` y `Non-hate`, los conceptos de riesgo no definidos se eliminan y Quick Analysis conserva accesos visuales sin implementar routing ni análisis.

## Capabilities

### New Capabilities

- `dashboard`: Presentar un resumen de moderación basado en datos mock compatibles con el dominio y orientar al moderador hacia los flujos de análisis especializados.

### Modified Capabilities

Ninguna. Este change no modifica `manual-analysis`, `video-analysis`, `prediction-history`, contratos HTTP ni componentes globales.

## Impact

Solo afecta en una fase posterior a `frontend/src/features/dashboard/` y sus mocks locales. No habrá llamadas HTTP, endpoints, persistencia, routing global, polling ni cambios en Header, Sidebar, AppLayout o temas. Los datos reales requerirán una decisión posterior sobre API, autorización, retención y agregación.

## GitHub Issue relation

GitHub Issue relation: not verified