# Spec Delta

## ADDED Requirements

### Requirement: AMC-01 Comentario único y frontera contractual

Analyze Comment MUST permitir introducir un único comentario manual y enviarlo a `manual-analysis` mediante `POST /api/v1/predictions`. La presentación MUST delegar HTTP en una frontera tipada y MUST NOT llamar directamente a `fetch` desde componentes de UI. El adaptador MUST resolver `VITE_API_BASE_URL` cuando exista o usar el fallback de desarrollo `http://localhost:8000/api/v1`; la URL final MUST ser `${baseUrl}/predictions`.

MUST NOT aceptar URL de vídeo, crear jobs, analizar múltiples comentarios, implementar polling o representar Analyze Conversation, Analyze Content, History o Logging.

Nivel: 🟢 Essential. Trazabilidad: PR-01, PR-04; US-09, US-17 y US-18.

#### Scenario: AMC-01 envío manual único

- **GIVEN** un moderador con un comentario válido
- **WHEN** solicita Analyze Comment
- **THEN** la feature envía únicamente el texto al endpoint manual mediante la frontera tipada y no crea una operación de vídeo o múltiple.

### Requirement: AMC-02 Validación y conservación de entrada

Analyze Comment MUST alinear validación con `PredictionRequest`: string estricto de 1 a 5.000 code points y al menos un carácter no whitespace. MUST conservar contenido literal; Unicode, multilínea, caracteres especiales y URLs válidas no se transforman silenciosamente.

MUST asociar errores al textarea, conservar texto tras error recuperable e impedir doble envío durante la petición.

Nivel: 🟢 Essential. Trazabilidad: PR-01; US-09 y US-17.

#### Scenario: AMC-02 whitespace y límite

- **GIVEN** texto solo whitespace o con más de 5.000 code points
- **WHEN** el moderador intenta enviarlo
- **THEN** la UI comunica el error accesiblemente sin enviar payload inválido y conserva el contenido para corrección.

### Requirement: AMC-03 Resultado binario revisable

Ante `Prediction`, Analyze Comment MUST presentar solo Hate / Non-hate como señal revisable. `review_required=true` MUST comunicarse como necesidad de revisión humana.

MUST NOT usar toxic/non-toxic, Potentially toxic, risk level, Low/Medium/High, severidad, toxicidad porcentual, sentimiento, emociones, tono, razones, explicaciones, palabras destacadas, recomendaciones ni acciones automáticas.

Nivel: 🟢 Essential. Trazabilidad: PR-03; US-17.

#### Scenario: AMC-03 señal humana

- **GIVEN** `label=hate` o `label=non_hate` y `review_required=true`
- **WHEN** se consulta el resultado
- **THEN** se puede leer Hate o Non-hate y que requiere revisión humana, sin afirmar moderación automática.

### Requirement: AMC-04 Score y predictor de desarrollo

Analyze Comment MUST mostrar score como probabilidad/confidence solo con `score_kind=calibrated_probability` y score numérico válido. Con score nulo o `unavailable`, MUST comunicar ausencia de probabilidad calibrada y MUST NOT derivar porcentajes. Cuando US-16 responda desde un `BundlePredictor` válido, la UI MUST consumir la respuesta contractual sin afirmar algoritmo ni promoción de modelo.

Con `model_version=fake-dev-v1`, MUST identificar visiblemente una demo de desarrollo y MUST NOT presentarla como Logistic Regression ni modelo entrenado.

Nivel: 🟢 Essential. Trazabilidad: PR-02, PR-03; US-09, US-16 y US-17.

#### Scenario: AMC-04 fake condicional sin score

- **GIVEN** `score=null`, `score_kind=unavailable` y `model_version=fake-dev-v1`
- **WHEN** se presenta el resultado
- **THEN** la UI no muestra porcentaje, identifica prudentemente la demo y conserva clasificación revisable.

#### Scenario: AMC-04 bundle real con versión opaca

- **GIVEN** una respuesta de `BundlePredictor` con `model_version` opaca y `score_kind=calibrated_probability`
- **WHEN** Analyze Comment presenta el resultado
- **THEN** muestra la probabilidad contractual y la señal revisable sin mostrar el aviso de development preview ni afirmar el algoritmo del bundle.

### Requirement: AMC-05 Errores, persistencia y privacidad

Analyze Comment MUST manejar 422, 503, errores inesperados y de red con mensajes seguros, recuperables y sin eco del comentario ni detalles internos. MAY manejar 413, 429 y 504 si el backend los devuelve, sin afirmar capacidades no implementadas.

Con `persistence.status=disabled`, MAY informar secundariamente que el análisis no se guarda. MUST NOT prometer History, recuperación o almacenamiento y MUST NOT mostrar, registrar ni incluir `resource_token` en URL. El comentario MUST NOT ir a URL, consola, logging o analytics improvisados.

Nivel: 🟢 Essential. Trazabilidad: PR-01, PR-04; US-09, US-17 y US-30.

#### Scenario: AMC-05 backend no disponible

- **GIVEN** respuesta 503 al enviar texto válido
- **WHEN** el moderador solicita el análisis
- **THEN** la UI comunica indisponibilidad recuperable, conserva texto y no expone información interna.

### Requirement: AMC-06 CIVIKA accesible y responsive

Analyze Comment MUST usar jerarquía simple de contexto, textarea, CTA, resultado e información secundaria, conforme a CIVIKA. MUST mantener light/dark, contraste, teclado, foco visible, label visible, `aria-describedby` para errores y `aria-live` apropiado.

MUST ser utilizable en desktop, tablet, 320 CSS px y zoom 200 % sin overflow horizontal global. Hate y Non-hate MUST entenderse mediante texto además de color.

Nivel: 🟢 Essential. Trazabilidad: PR-04; US-17 y US-18.

#### Scenario: AMC-06 pantalla estrecha

- **GIVEN** una persona que utiliza teclado a 320 CSS px o 200 % de zoom
- **WHEN** valida, envía y recibe clasificación
- **THEN** identifica campo, error o resultado y Hate / Non-hate sin depender solo de color ni perder contenido funcional.
