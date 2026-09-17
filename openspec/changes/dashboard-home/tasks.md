# Dashboard/Home — tareas

## 1. Modelo y fixtures

- [x] 1.1 Inventariar los datos mock actuales de Dashboard y definir un modelo de vista tipado, local a la feature, con solo `hate` y `non_hate`.
- [x] 1.2 Separar los fixtures mock de la presentación e identificarlos como datos de ejemplo; retirar categorías y escalas de riesgo no definidas.
- [x] 1.3 Eliminar tendencias y períodos temporales que impliquen una fuente histórica real.

## 2. Composición de Dashboard

- [x] 2.1 Adaptar las tarjetas de resumen al modelo de vista, sin cambios en componentes compartidos.
- [x] 2.2 Adaptar Moderation overview y Content status para describir únicamente la distribución mock `Hate`/`Non-hate`, con texto además de color.
- [x] 2.3 Adaptar Recent activity como muestra mock limitada, sin afirmar persistencia, historial o endpoint de listado.
- [x] 2.4 Conservar Quick Analysis como accesos visuales a Analyze Comment y Analyze Video, sin router ni ejecución de análisis.

## 3. Accesibilidad y verificación

- [x] 3.1 Revisar estructura semántica, textos alternativos, teclado, foco visible, contraste y comportamiento a 320 CSS px/200 % de zoom para los componentes modificados.
- [x] 3.2 Ejecutar `npm run build` desde `frontend/` sin instalar dependencias; registrar cualquier bloqueo de entorno de forma fiel.
- [x] 3.3 Validaciones realizadas: `npm ci`, `npm run build`, `git diff --check`, revisión manual de accesibilidad/responsive, 320 CSS px, 200 % de zoom y navegación responsive mediante ☰; todas PASS. El ajuste final `aria-label="Moderation statistics"` se incluyó antes de repetir `npm run build` y `git diff --check`, ambos PASS. `openspec validate dashboard-home --strict` y `/opsx:verify` no están disponibles en este entorno, no se ejecutaron y no se instalaron herramientas para suplirlos.

## Follow-up no bloqueante

La sustitución de mocks locales tipados por datos reales queda fuera de este change. Requiere un change independiente que defina previamente fuente de datos, persistencia y contratos/API; `dashboard-home` no inventa endpoints.
