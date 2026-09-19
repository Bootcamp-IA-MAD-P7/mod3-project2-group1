# Tasks

## 1. Preparación y modelo de vista

- [x] 1.1 Revisar `DashboardViewModel` y `DASHBOARD_MOCK_DATA`; modificar exclusivamente los datos necesarios para Hero, tres accesos, KPI, visualización y actividad compacta.
- [x] 1.2 Mantener `Hate` / `Non-hate` como únicas clasificaciones y no introducir `in_review` si el modelo mock no lo soporta.
- [x] 1.3 No modificar `NOTIFICATIONS`, `LANGUAGES`, Header, Sidebar, AppLayout, AppearanceProvider, shared UI ni estilos globales.

## 2. Composición CIVIKA

- [x] 2.1 Implementar Hero con bienvenida, copy calmado, identidad textual CIVIKA y semántica correcta.
- [x] 2.2 Implementar tres accesos visuales de análisis sin router ni navegación nueva.
- [x] 2.3 Conservar solo tres KPI y adaptar/reutilizar `StatCard` cuando corresponda.
- [x] 2.4 Implementar un único bloque de Evolución de la toxicidad y eliminar redundancia visual entre bloques previos de distribución.
- [x] 2.5 Adaptar actividad reciente como resumen compacto; conservar semántica y presentación móvil accesible.
- [x] 2.6 Mantener equivalentes dark mode, contraste y espacio visual suficiente sin añadir densidad artificial.

## 3. Verificación

- [x] 3.1 Ejecutar `npm run build` desde `frontend/`.
- [x] 3.2 Revisar manualmente desktop, light/dark, 320 CSS px y 200 % de zoom; verificar teclado, foco visible, contraste e información no dependiente del color.
- [x] 3.3 Ejecutar `git diff --check`.
- [ ] 3.4 Ejecutar `openspec validate redesign-civika-dashboard --strict` y `/opsx:verify` solo si están disponibles; no instalar herramientas.

## Evidencia de validación manual

- Desktop light mode: PASS.
- Desktop dark mode: PASS.
- Zoom al 200 %: PASS para el contenido del Dashboard.
- 320 CSS px: PASS para el contenido propio del Dashboard.
- Teclado y foco visible: PASS. Las acciones Analyze comment, Analyze conversation y Analyze content son alcanzables mediante teclado y muestran foco visible.
- El Hero CIVIKA conserva legibilidad y comportamiento responsive; la ilustración decorativa se oculta en tamaños pequeños para priorizar el contenido.
- No se detectó overflow causado por componentes propios del Dashboard.

## Follow-up global conocido

A 320 CSS px, el Header compartido no dispone de espacio suficiente para todos sus controles: el selector de idioma y los controles a su derecha pueden quedar recortados o fuera del viewport. Este seguimiento corresponde al layout/Header global y queda fuera del alcance de `redesign-civika-dashboard`; no es un fallo del contenido del Dashboard.

## Fuera de alcance

- Navegación global, Laboratorio, API, backend, ML, persistencia, datos reales, nuevos gráficos técnicos, router y cambios de layout compartido.
