# Dashboard/Home — diseño

## Context

Dashboard/Home es la primera sección visible en la Sidebar. Analyze Comment, Analyze Video e History son features independientes: Home no ejecuta sus flujos ni replica sus resultados. La UI actual ya incluye tarjetas, una vista de distribución, actividad reciente y Quick Analysis, todos alimentados desde mocks.

Los contratos propuestos solo describen predicciones individuales protegidas y jobs de vídeo. No existe un endpoint para historial público, actividad reciente ni estadísticas agregadas. Por tanto, esta entrega no puede representar integración de datos reales.

## Goals

- Conservar y evolucionar la composición visual actual de Home cuando sea compatible con el dominio.
- Separar presentación de un modelo de vista explícito y fixtures mock.
- Mostrar únicamente categorías compatibles con la taxonomía contractual: `hate` y `non_hate`, con etiquetas de UI `Hate` y `Non-hate`.
- Ofrecer Quick Analysis como acceso visual a Analyze Comment y Analyze Video.
- Mantener semántica, teclado, foco visible, contraste y una composición usable a 320 CSS px y 200 % de zoom.
- Dejar una frontera de datos que pueda sustituirse por una fuente real en un change futuro.

## Non-Goals

- Ejecutar predicciones, crear jobs, realizar polling o mostrar resultados paginados.
- Añadir router, navegación global, llamadas HTTP, endpoints, OpenAPI, persistencia o MSW.
- Definir períodos temporales, tendencias o agregaciones globales.
- Definir categorías `Safe`, `Potentially toxic`, `High risk` o niveles `low`/`medium`/`high`.
- Convertir la actividad reciente en History ni alterar Header, Sidebar, AppLayout, AppearanceProvider o el tema global.

## Decisions

### D-01 — Dashboard es resumen y punto de entrada

Home presenta una visión breve de actividad y conserva accesos visuales a los dos flujos de análisis. No contiene formularios de análisis ni estados propios de jobs de vídeo. Los botones de Quick Analysis no ejecutan una acción de análisis; mientras no exista una estrategia de routing aprobada, permanecen como controles visuales sin afirmar navegación implementada.

### D-02 — Modelo de vista mock y fronteras de datos

Los componentes de Dashboard reciben datos mediante tipos locales de la feature o fixtures mock tipados, separados de la presentación. Los fixtures son inequívocamente de ejemplo y solo representan conteos y clasificaciones permitidos. No se añade un cliente HTTP ni se simulan respuestas, carga o errores de una API inexistente.

Una futura integración requerirá una fuente autorizada para: totales agregados, distribución por clasificación, actividad reciente limitada y su período temporal. Esa fuente no se diseña en este change.

### D-03 — Taxonomía y lenguaje prudente

Los datos visibles usan `hate` y `non_hate`; la presentación usa `Hate` y `Non-hate`. Una clasificación es una señal revisable, no una afirmación sobre una persona ni una garantía de seguridad. Se eliminan `Safe`, `Potentially toxic`, `High risk` y escalas de riesgo porque no están definidos por el dominio o los contratos.

### D-04 — Componentes del Home

Se mantienen, adaptados al modelo de vista:

- tarjetas de resumen sin tendencias temporales;
- Moderation overview y Content status con distribución `Hate`/`Non-hate`;
- Recent activity limitada y explícitamente mock, sin presentar persistencia o listado disponible;
- Quick Analysis con los dos accesos visuales.

El diseño no obliga a conservar una forma concreta de gráfica ni valores de ejemplo. La información textual acompaña color, iconos y barras para que no sean el único canal de significado.

### D-05 — Estados de UI

Esta fase dispone únicamente de estado de datos mock. No se representa `loading` ni `error`, porque no existe petición asíncrona que los justifique. Los componentes deben evitar acoplamientos que impidan añadir, posteriormente y con requisitos reales, estados de carga, ausencia de actividad, datos disponibles y error de recuperación.

## Accessibility

Aplican QA-02 y las decisiones existentes de layout: encabezados jerárquicos, regiones y tablas semánticas cuando correspondan, etiquetas textuales, contraste verificable, foco visible para controles interactivos y uso por teclado. La adaptación responsive debe conservar contenido y controles a 320 CSS px y 200 % de zoom. No se usará el color como único indicador de clasificación.

## Validation

Validaciones realizadas y PASS: `npm ci`, `npm run build`, `git diff --check`, revisión visual de escritorio, revisión manual a 320 CSS px, 200 % de zoom y navegación responsive mediante menú ☰. La corrección responsive de Recent Activity y el ajuste final de accesibilidad `aria-label="Moderation statistics"` se verificaron antes de repetir `npm run build` y `git diff --check`, ambos PASS.

No hay infraestructura de tests de componentes aprobada para este change. La CLI `openspec` y el comando ejecutable `/opsx:verify` no están disponibles en este entorno; por ello `openspec validate dashboard-home --strict` y `/opsx:verify` no se ejecutaron. No se instalaron herramientas para suplir esa indisponibilidad.

## Risks and follow-up

No se debe convertir una fixture en evidencia de métricas reales. Dashboard/Home continúa usando mocks locales tipados. Su futura sustitución requiere un change independiente que defina antes la fuente de datos, persistencia, autorización, retención, agregación y contratos/API necesarios. Este change no diseña ni inventa endpoints.