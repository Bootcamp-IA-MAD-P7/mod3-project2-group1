# manual-analysis Specification

## ADDED Requirements

### Requirement: UI-01 Análisis manual accesible

El frontend MUST exponer un formulario de análisis manual que consume `POST /api/v1/predictions` con un cliente API y estados `idle`, `invalid`, `loading`, `success`, `error` y `score null`, usando lenguaje prudente que no acusa personas ni presenta la probabilidad no calibrada como porcentaje inventado. El formulario MUST tener label vinculado al campo, errores asociados y anunciados al control, foco que guía la corrección, estado de carga que bloquea el doble envío y conserva el texto ante error, y `aria-live` para el resultado; la señal MUST mostrarse con texto y no solo con color. Los mocks del contrato (MSW y fixtures) MUST quedar fuera del build de producción.

Nivel: 🟢 Essential. Historias: US-17.

#### Scenario: UI-01 estados del formulario

- **WHEN** un moderador escribe un comentario y lo envía (y/o provoca texto no válido o error del servicio)
- **THEN** la interfaz transita `idle → loading → success|error` (o `invalid` si no válido), el botón se deshabilita durante la carga evitando doble envío, y el texto introducido se conserva si ocurre un error.

#### Scenario: UI-01 señal prudente y score null

- **WHEN** el servicio devuelve un `label` con `score` (calibrado) o `score null`
- **THEN** la UI muestra la señal con lenguaje prudente y sin color como única señal; si `score` es `null` no muestra un porcentaje inventado y sí presenta el caso como señal sin probabilidad.

#### Scenario: UI-01 accesibilidad y mocks

- **WHEN** se usa solo teclado (tab/foco), se provoca un error de validación y se navega un resultado, y se comprueba `320 CSS px` / `200%` zoom / contraste
- **THEN** el label, los errores asociados, los anuncios y el foco guían la corrección sin depender solo del color, y la UI es usable en 320px/200% con contraste verificado; los mocks no están presentes en el build de producción.