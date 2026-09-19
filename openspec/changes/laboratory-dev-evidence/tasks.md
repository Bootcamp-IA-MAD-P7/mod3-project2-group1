# Tasks

## 1. Snapshot DEV y trazabilidad

- [x] 1.1 Definir el modelo TypeScript tipado de evidencia Laboratory y una snapshot DEV estática derivada solo de fuentes versionadas autorizadas.
- [x] 1.2 Registrar fuente y naturaleza DEV de cada bloque; excluir cualquier dato, referencia o cálculo TEST.
- [ ] 1.3 Añadir tests significativos de integridad de snapshot, procedencia y distinción entre comparación común y augmentation cuando exista infraestructura aplicable.

## 2. Estructura de feature

- [x] 2.1 Crear la feature `frontend/src/features/laboratory/` sin modificar App, Sidebar, Header, AppLayout ni routing.
- [x] 2.2 Definir composición semántica, headings y regiones para Technical Overview, Model Comparison, Selected Model, Fold Analysis, Experiments y Technical Reports/Sources.
- [x] 2.3 Reutilizar componentes y utilidades UI existentes sin añadir dependencias ni duplicar el Dashboard.

## 3. Evidencia técnica

- [x] 3.1 Implementar Technical Overview con protocolo DEV, TEST sealed, tres folds agrupados por VideoId, tamaño DEV, grupos y artefacto final cuando proceda.
- [x] 3.2 Implementar Model Comparison accesible para los cuatro candidatos con métricas disponibles y etiquetas separadas de Selected model y Highest DEV F1 observed.
- [x] 3.3 Implementar Selected Model para Logistic Regression con configuración congelada, TF-IDF, preprocessing, estabilidad, metadata, entorno, checksum y limitaciones.
- [x] 3.4 Implementar Fold Analysis con métricas y matrices de confusión tabulares/textuales disponibles, sin depender solo de barras o color.
- [x] 3.5 Implementar Experiments con tuning de Logistic Regression y ablación de augmentation de MultinomialNB separados explícitamente.
- [x] 3.6 Implementar Technical Reports/Sources como trazabilidad compacta, sin visor completo de Markdown ni lectura runtime de archivos locales.

## 4. Experiencia y accesibilidad

- [x] 4.1 Aplicar Look & Feel CIVIKA técnico: violetas/lavandas, badges DEV, superficies limpias y jerarquía sin exceso de KPI o gráficas.
- [x] 4.2 Mantener equivalentes light/dark, contraste suficiente, foco visible, semántica, teclado y alternativas textuales de visualizaciones.
- [x] 4.3 Adaptar desktop, tablet, móvil ~320 CSS px y zoom 200 %; encapsular tablas amplias en regiones accesibles sin overflow de página.
- [x] 4.4 Confirmar que Laboratory no crea routing, enlaces rotos, promesas de tiempo real ni navegación funcional inexistente.

## 5. Verificación

- [ ] 5.1 Ejecutar tests frontend aplicables y validar integridad de snapshot frente a fuentes autorizadas.
- [x] 5.2 Ejecutar `npm run build` desde `frontend/` y lint disponible si existe.
- [x] 5.3 Revisar manualmente desktop, light/dark, 320 CSS px, zoom 200 %, teclado, foco, tablas y matrices.
- [x] 5.4 Ejecutar `git diff --check`.
- [ ] 5.5 Ejecutar `openspec validate laboratory-dev-evidence --strict` y `/opsx:verify` solo si están disponibles; no instalar herramientas.

## Evidencia de validación manual

- Desktop / light mode: PASS.
- Desktop / dark mode: PASS.
- 320 CSS px / mobile: PASS.
- Zoom 200 %: PASS.
- Navegación mediante teclado: PASS.
- Foco visible: PASS.
- Tablas utilizables: PASS.
- Matrices de confusión utilizables y comprensibles: PASS.
- Ausencia de overflow horizontal global: PASS.
- Look & Feel CIVIKA: PASS.

Las tareas 1.3 y 5.1 permanecen pendientes porque el frontend no dispone de infraestructura de tests. La tarea 5.5 permanece pendiente: OpenSpec CLI y `/opsx:verify` no están disponibles y no se instalarán herramientas.

## Fuera de alcance

- Routing global, navegación funcional desde Sidebar, Sidebar, Header, AppLayout, Dashboard, History, Settings, Analyze Comment, Analyze Conversation, Analyze Content, backend, endpoints, predictor API, entrenamiento ML, reentrenamiento, selección de modelo, evaluación TEST, apertura de TEST, MLflow, persistencia de experimentos y tiempo real.
