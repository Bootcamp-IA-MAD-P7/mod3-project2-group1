# Spec Delta

## MODIFIED Requirements

### Requirement: DH-01 Resumen CIVIKA y accesos visuales

Dashboard/Home MUST presentar un resumen calmado de la actividad de moderación y un Hero de bienvenida con identidad CIVIKA, sin ejecutar análisis ni replicar flujos especializados. MUST mostrar accesos visuales claramente diferenciados a Analizar comentario, Analizar conversación y Analizar contenido. Estos accesos MUST NOT introducir router, navegación global, creación de jobs, polling, formulario de análisis ni resultados detallados.

#### Scenario: DH-01 composición principal

- **WHEN** un moderador abre Dashboard/Home
- **THEN** encuentra Hero, tres accesos de análisis, tres KPI, una visualización principal de toxicidad y actividad reciente compacta, con espacio suficiente entre bloques y sin información que afirme un análisis ya ejecutado.

#### Scenario: DH-01 accesos preparados

- **WHEN** el moderador navega con teclado por los accesos de análisis
- **THEN** cada acceso tiene nombre, explicación y foco visible, pero no dispara navegación ni un flujo de análisis mientras no exista router aprobado.

### Requirement: DH-04 Actividad y evolución acotadas

Dashboard/Home MAY mostrar una muestra limitada de actividad reciente y MUST mostrar como máximo una visualización principal de toxicidad. Ambas usan fixtures mock compatibles con `hate` y `non_hate`; MUST NOT presentarse como historial persistido ni como métricas en tiempo real. MUST NOT crear la categoría `in_review` cuando el modelo de datos actual no la contiene.

#### Scenario: DH-04 información compacta

- **WHEN** se muestra la distribución y actividad de Dashboard/Home
- **THEN** la visualización distingue Hate y Non-hate mediante texto además de color, la actividad se limita a una muestra compacta y no se muestra una tercera categoría inventada ni una tabla extensa.

## ADDED Requirements

### Requirement: DH-06 Identidad visual CIVIKA accesible

Dashboard/Home MUST aplicar una jerarquía visual con morado y lavanda como identidad local, verde para Non-hate y naranja para Hate, sin depender exclusivamente del color ni convertir el rojo en color protagonista. MUST conservar modo oscuro y una composición usable a 320 CSS px y 200 % de zoom sin modificar Header, Sidebar, AppLayout, AppearanceProvider ni estilos globales.

#### Scenario: DH-06 contraste y adaptación

- **WHEN** Dashboard/Home se visualiza en modo claro, oscuro, a 320 CSS px o con 200 % de zoom
- **THEN** Hero, accesos, KPI, visualización y actividad permanecen legibles, navegables por teclado, sin pérdida funcional ni scroll horizontal requerido para comprender la información.
