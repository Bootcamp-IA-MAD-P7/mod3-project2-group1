# Diseño: Dashboard/Home CIVIKA

## Contexto

Home es una pantalla de resumen basada en `DashboardViewModel` y `DASHBOARD_MOCK_DATA`. Actualmente muestra tres KPI, dos vistas de la misma distribución, Recent Activity y Quick Analysis. Header y Sidebar pertenecen a `AppLayout` y son compartidos; este change no los modifica.

## Arquitectura visual

La composición, en este orden, será:

1. **Hero / bienvenida**: saludo, mensaje breve sobre CIVIKA y conversaciones digitales más sanas, explicación concisa e identidad textual local.
2. **Tres accesos de análisis**: Analizar comentario, Analizar conversación y Analizar contenido. Son accesos visuales sin navegación, ejecución ni promesa de funcionalidad ya disponible.
3. **Tres KPI**: Comentarios analizados, Comentarios no tóxicos y Comentarios tóxicos.
4. **Evolución de la toxicidad**: un único bloque principal que muestra la distribución mock `Hate` / `Non-hate`. El modelo actual no contiene `in_review`; no se crea ni simula esa categoría.
5. **Actividad reciente**: una muestra compacta de elementos mock, no una tabla extensa ni un historial persistido.

El layout reservará separación generosa entre regiones. No se añadirán métricas, gráficas o tarjetas para aumentar densidad.

## Sistema visual

- Morado CIVIKA como acento y lavanda/tonos claros como superficies en light mode.
- Verde para `Non-hate` y naranja para `Hate`; rojo no será protagonista.
- Las etiquetas `Hate` y `Non-hate`, valores y leyendas acompañan siempre al color, icono o barra.
- Todas las superficies mantienen equivalentes `dark:` y reutilizan tokens, utilidades Tailwind y componentes UI existentes.

No se introducen dependencias, un sistema de gráficos ni cambios de `index.css`. Si no existe un activo visual oficial de CIVIKA, el Hero usa composición tipográfica e iconografía Lucide; no inventa logotipos.

## Datos y componentes

`DashboardViewModel` y `DASHBOARD_MOCK_DATA` continúan como frontera local tipada. Solo podrá cambiar la propiedad `DASHBOARD_MOCK_DATA`; `NOTIFICATIONS` y `LANGUAGES` permanecen intactos por ser consumidos por Header compartido.

Se evaluará la reutilización de `StatCard`, `ModerationOverview`, `ContentStatus`, `RecentActivity` y `QuickAnalysis`. Se conservará un componente cuando su responsabilidad encaje con la nueva composición; en caso contrario se podrá adaptar o sustituir dentro de `features/dashboard` sin duplicar componentes UI compartidos.

## Límites

- No se modifica Header, Sidebar, AppLayout, AppearanceProvider, shared UI, navegación, tema ni estilos globales.
- No se implementa la entrada Laboratorio, router, callbacks de navegación, fetch, API, persistencia, backend o ML.
- No se presentan datos como reales, sincronizados, históricos o en tiempo real.
- No se añaden categorías de riesgo ni `in_review` sin soporte en el modelo mock actual.

## Accesibilidad y responsive

El Hero, accesos y visualización usan encabezados jerárquicos y regiones semánticas. Los accesos visuales son controles de teclado con foco visible. La clasificación no depende solo de color. El contenido debe conservarse a 320 CSS px, 200 % de zoom, desktop y modo oscuro, sin scroll horizontal funcional.

## Validación al aplicar

- `npm run build` desde `frontend/`.
- Revisión visual en desktop, modo claro/oscuro, 320 CSS px y 200 % de zoom.
- Revisión manual de semántica, foco visible, teclado, contraste y significado textual de toxicidad.
- `git diff --check`.
- `openspec validate redesign-civika-dashboard --strict` y `/opsx:verify` solo si están disponibles; no instalar herramientas.

## Decisiones que requieren revisión humana antes de aplicar

- Confirmar si existe un logo, ilustración o guía de marca CIVIKA aprobada para el Hero. Sin ella se usará identidad textual e iconografía existente.
- Confirmar los destinos futuros de los accesos Analizar conversación y Analizar contenido. Este change no implementa navegación.
