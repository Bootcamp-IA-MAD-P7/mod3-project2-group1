# Spec Delta

## ADDED Requirements

### Requirement: GN-01 Sidebar CIVIKA compartida

La aplicación MUST mantener una única Sidebar global compartida por las páginas que usan `AppLayout`. La Sidebar MUST mostrar la marca textual CIVIKA y MUST NOT quedar acoplada a la implementación de Dashboard/Home.

#### Scenario: GN-01 marca y disponibilidad global

- **WHEN** una página CIVIKA se renderiza dentro de `AppLayout`
- **THEN** presenta la misma Sidebar con la marca CIVIKA, navegación principal y perfil inferior existente, sin duplicar navegación por feature.

### Requirement: GN-02 Estructura global de navegación

La Sidebar MUST presentar Dashboard como entrada principal; el grupo ANÁLISIS con Analizar comentario, Analizar conversación y Analizar contenido; el grupo RESULTADOS con Historial; una separación visual; Laboratorio con badge textual `[DEV]`; y Configuración como entrada final.

Laboratorio MUST ser una única entrada y MUST NOT incluir submenús de modelos, métricas, experimentos, visualizaciones, logging o informes. Logging MUST NOT aparecer como entrada independiente.

#### Scenario: GN-02 agrupación visible

- **WHEN** un usuario consulta la Sidebar
- **THEN** puede identificar por etiquetas textuales los grupos ANÁLISIS y RESULTADOS, las tres áreas de análisis como entradas independientes, Laboratorio `[DEV]` como una única entrada y Configuración al final.

### Requirement: GN-03 Navegación futura sin destinos falsos

Mientras el frontend no tenga routing aprobado, la Sidebar MUST NOT crear rutas, `href`, enlaces rotos ni callbacks que aparenten navegar a páginas no implementadas. Historial y Configuración MAY ser visibles como destinos previstos aunque sus páginas no existan todavía.

`ACTIVE_SECTION` puede representar temporalmente el estado visual actual, pero MUST documentarse como mecanismo transitorio que será sustituido por estado derivado de navegación o ruta cuando se implemente routing real.

#### Scenario: GN-03 ítems futuros visibles

- **WHEN** el usuario alcanza una entrada de análisis, Historial, Laboratorio o Configuración sin routing disponible
- **THEN** la entrada se presenta como parte de la estructura futura sin abrir una ruta inexistente ni afirmar que su página ya está implementada.

### Requirement: GN-04 Sidebar accesible y responsive

La Sidebar MUST permanecer fija en desktop y MUST conservar el panel lateral con overlay en móvil. MUST usar estructura semántica de navegación, soporte de teclado, foco visible, contraste suficiente y `aria-current="page"` para el ítem activo cuando corresponda.

#### Scenario: GN-04 navegación adaptable

- **WHEN** una persona usa la Sidebar con teclado, en modo claro u oscuro, o desde un viewport móvil
- **THEN** puede abrir o cerrar el panel móvil y recorrer los ítems de navegación con foco visible y etiquetas comprensibles, sin depender exclusivamente del color.
