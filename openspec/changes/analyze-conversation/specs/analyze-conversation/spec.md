# Spec Delta

## ADDED Requirements

### Requirement: ACV-01 Mapping a video-analysis

Analyze conversation MUST ser la interfaz de CIVIKA para la capability técnica video-analysis: comentarios principales asociados a una URL admitida de YouTube. MUST clasificarlos individualmente como Hate / Non-hate y MUST NOT afirmar comprensión de conversaciones humanas, threads, respuestas, relaciones entre autores, causalidad, sentimiento, emociones, severidad, engagement o contexto completo.

Nivel: 🟡 Medium. Trazabilidad: VI-01, VI-02 y VI-03; US-20, US-21 y US-22.

#### Scenario: ACV-01 alcance de comentarios principales

- **GIVEN** una URL de vídeo admitida y una solicitud de análisis
- **WHEN** el moderador utiliza Analyze conversation
- **THEN** la experiencia se refiere a comentarios principales clasificados individualmente, sin presentar respuestas o hilos de YouTube como capacidad disponible.

### Requirement: ACV-02 Estados de job contractuales

Analyze conversation MUST preparar initial, validación, submitting, queued, processing, completed, partial, failed y expired conforme a VideoAnalysisRequest, AnalysisAccepted, Job y ResultPage. MUST diferenciar fetched_count de analyzed_count, comunicar truncated y MUST NOT prometer porcentaje exacto ni cobertura total desconocida.

Nivel: 🟡 Medium. Trazabilidad: VI-01, VI-02 y VI-03; US-20, US-21 y US-22.

#### Scenario: ACV-02 resultado parcial o truncado

- **GIVEN** un Job con partial o truncated=true
- **WHEN** Analyze conversation presenta el estado
- **THEN** explica el resultado disponible y su límite con texto accesible, conserva los conteos conocidos y no lo presenta como análisis completo sin restricciones.

#### Scenario: ACV-02 expiración

- **GIVEN** que el recurso no puede recuperarse por TTL o reinicio
- **WHEN** la consulta recibe el comportamiento de expiración contractual
- **THEN** la UI indica que debe iniciarse un nuevo análisis y no lo atribuye a un fallo de clasificación.

### Requirement: ACV-03 Resumen y resultados individuales contractuales

Analyze conversation MUST usar solo campos de Job, ResultPage, CommentResult y Prediction: estado, conteos binarios, texto, ordinal, label y score bajo su semántica contractual. Los resultados MUST ser accesibles y compatibles con paginación.

Nivel: 🟡 Medium. Trazabilidad: VI-02 y VI-03; US-21 y US-22.

#### Scenario: ACV-03 score no disponible

- **GIVEN** un resultado con score_kind=unavailable y score nulo
- **WHEN** la UI muestra la predicción
- **THEN** presenta Hate o Non-hate como señal revisable sin inventar porcentaje, severidad ni confianza.

### Requirement: ACV-04 Frontend desacoplado sin backend

Mientras video-analyses no esté implementado, Analyze conversation MAY usar fixtures tipados de demostración. MUST identificarlos como demostración, MUST NOT hacer fetch a endpoints inexistentes ni crear contratos falsos, y MUST permitir sustituirlos por cliente API sin rehacer la presentación.

Nivel: 🟡 Medium. Trazabilidad: US-22.

#### Scenario: ACV-04 preview sin backend

- **GIVEN** que el backend no monta video-analyses
- **WHEN** se revisa la experiencia frontend
- **THEN** utiliza escenarios de demostración explícitos y no afirma disponibilidad de producción.

### Requirement: ACV-05 CIVIKA accesible sin navegación local

Analyze conversation MUST respetar CIVIKA, light/dark, teclado, foco visible, contraste, labels accesibles, 320 CSS px y zoom 200 %. Hate y Non-hate MUST tener texto además de color. Tablas/listados amplios MUST evitar overflow horizontal global.

MUST NOT introducir React Router, rutas falsas ni cambios en App, Sidebar, Header o AppLayout. Cuando exista cliente API, el polling MUST detenerse en estado terminal o desmontaje; no se implementará contra endpoints inexistentes.

Nivel: 🟡 Medium. Trazabilidad: VI-03; US-22 y quality-accessibility.

#### Scenario: ACV-05 pantalla estrecha

- **WHEN** el moderador consulta resultados a 320 CSS px, 200 % de zoom o solo con teclado
- **THEN** puede leer estado, resumen y resultados sin pérdida funcional, sin depender solo del color y sin overflow horizontal de la página.
