# Rediseñar Dashboard/Home con identidad CIVIKA

## Why

Dashboard/Home ya cumple su alcance funcional basado en mocks, pero presenta información como varios bloques de resumen sin una jerarquía visual unificada. CIVIKA necesita una portada más tranquila y clara que oriente al moderador hacia los análisis sin convertir Home en una pantalla de métricas densas.

## What Changes

- Reorganizar exclusivamente el contenido central de Dashboard como Hero, tres accesos de análisis, tres KPI y una única visualización principal junto con actividad reciente compacta.
- Aplicar la identidad visual local de CIVIKA mediante morado, lavanda, verde para `Non-hate` y naranja para `Hate`, manteniendo contraste, modo oscuro y significado textual.
- Evolucionar los mocks tipados solo cuando la nueva composición lo requiera; no cambiar `NOTIFICATIONS` ni `LANGUAGES`.
- Mantener los tres accesos como controles visuales preparados para navegación futura, sin router ni flujos de análisis.

## Capabilities

### Modified Capabilities

- `dashboard`: cambia la composición visual de Home y sus accesos de entrada, conservando su naturaleza de resumen mock y sus límites de datos.

### Unchanged Capabilities

- `manual-analysis`, `video-analysis`, `prediction-history`, contratos HTTP y componentes de layout compartidos.

## Impact

- Alcance futuro de código: `frontend/src/features/dashboard/**` y, si es necesario, exclusivamente `DASHBOARD_MOCK_DATA` en `frontend/src/mocks/dashboard.ts`.
- Sin cambios en Header, Sidebar, AppLayout, AppearanceProvider, navegación global, estilos globales, backend, ML, API ni router.
- Relación con Issue: no verificada.
