# manual-analysis Specification

## ADDED Requirements

### Requirement: E2E-01 Producto Essential integrado

El producto Essential MUST entregar el recorrido completo comentario → navegador → API → bundle real, con la feature de análisis manual integrada en la navegación de la app y demostrado por E2E con el bundle congelado (señal con `label`/`score` y `model_version`, y errores presentados de forma accesible). El flujo MUST funcionar sin dependencias opcionales (DB, YouTube, MLflow, paquetes neuronales); cuando el modelo no está disponible, la aplicación MUST mostrar indisponibilidad (`503`/readiness) de forma comprensible y no inventar una señal. El cierre formal del nivel Essential MUST enlazar la evidencia de TDD/tests, EDA/NLP/gap y la revisión accesible.

Nivel: 🟢 Essential. Historias: US-18.

#### Scenario: E2E-01 navegador a bundle real

- **WHEN** se ejecuta el E2E con el bundle real y un comentario de ejemplo
- **THEN** la app integrada (navegación `analyze-comment`) envía el comentario a la API, recibe la señal con versión, la muestra con lenguaje prudente y el test E2E lo verifica de extremo a extremo.

#### Scenario: E2E-01 sin servicios opcionales y modelo faltante

- **WHEN** el E2E arranca sin DB/YouTube/MLflow/neuronales, o con `MODEL_PATH` sin bundle válido (readiness `503`)
- **THEN** el flujo de análisis sigue disponible de forma controlada y la UI muestra indisponibilidad del modelo (sin señal inventada) mientras el resto de la app responde.

#### Scenario: E2E-01 evidencia del gate Essential

- **WHEN** se reúne la evidencia del gate (TDD/tests, EDA/NLP/gap, augmentation US-08 y revisión accesible)
- **THEN** queda enlazada en informe/repo sin declarar cumplidos gates pendientes (promoción US-15 y cierre US-08) como completados.