# Definir la Sidebar global de CIVIKA

## Why

La aplicación ya dispone de una Sidebar compartida a través de `AppLayout`, pero su marca sigue siendo Moder AI y su navegación es una lista plana con Dashboard fijado como sección activa. CIVIKA necesita una estructura global coherente para todas sus páginas, que haga visibles las áreas previstas sin prometer rutas o funcionalidades que todavía no existen.

## What Changes

- Reestructurar la navegación visual de la Sidebar compartida con marca CIVIKA, Dashboard como entrada principal, los grupos ANÁLISIS y RESULTADOS, Laboratorio con indicador `[DEV]` y Configuración como entrada final.
- Presentar Analizar comentario, Analizar conversación y Analizar contenido como tres áreas distintas, sin implementar sus páginas, rutas o flujos.
- Mantener Historial y Configuración visibles para integraciones futuras de sus responsables, sin implementar sus contenidos.
- Mantener Laboratorio como una única entrada técnica; no se crearán submenús de modelos, métricas, experimentos, visualizaciones, logging o informes.
- Conservar el comportamiento responsive actual: Sidebar fija en desktop y panel con overlay en móvil.
- Documentar que el mecanismo `ACTIVE_SECTION` es transitorio y que la navegación real deberá aportar el estado activo cuando se incorpore routing aprobado.

## Capabilities

### Added Capabilities

- `global-navigation`: estructura visual, semántica y accesible de la Sidebar compartida de CIVIKA.

### Unchanged Capabilities

- `dashboard`, `manual-analysis`, `video-analysis`, `prediction-history`, `settings`, Header, AppLayout, backend, ML y contratos HTTP.

## Impact

- Alcance previsto de código: `frontend/src/shared/navigation/nav-items.ts` y `frontend/src/shared/layout/sidebar.tsx`.
- `frontend/src/app/layout/app-layout.tsx` solo podrá modificarse si se demuestra imprescindible para conservar el comportamiento responsive actual; no se introducirá routing.
- No se crearán rutas, páginas, enlaces rotos, fetch, APIs, persistencia ni cambios en Header, perfil inferior o Dashboard central.
- Relación con Issue: no verificada.
