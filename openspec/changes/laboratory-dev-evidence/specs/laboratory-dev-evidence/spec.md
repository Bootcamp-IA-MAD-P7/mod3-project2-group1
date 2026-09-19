# Spec Delta

## ADDED Requirements

### Requirement: LAB-01 Snapshot DEV trazable y sellado de TEST

Laboratory MUST usar una snapshot TypeScript estática, tipada y trazable derivada exclusivamente de informes DEV versionados y metadata autorizada del artefacto Logistic Regression. La snapshot MUST identificar que representa evidencia DEV y MUST NOT contener datos, cálculos, predicciones, métricas, inspección ni referencias derivadas de TEST.

#### Scenario: LAB-01 procedencia de datos

- **GIVEN** las fuentes DEV autorizadas de comparación, modelos, augmentation y metadata
- **WHEN** Laboratory presenta una métrica, configuración o detalle de artefacto
- **THEN** el valor procede de una fuente versionada identificable, se presenta como evidencia DEV estática y no afirma ser tiempo real.

#### Scenario: LAB-01 protección de TEST

- **WHEN** se revisa la snapshot y la página Laboratory
- **THEN** TEST aparece únicamente como estado sellado y no existe ningún valor, resultado, cálculo, endpoint o acción que lo abra o lo use.

### Requirement: LAB-02 Comparación técnica sin ganador global

Laboratory MUST comparar MultinomialNB, Logistic Regression, LinearSVC y SGDClassifier con F1 toxic, desviación, precision, recall, macro-F1, accuracy y gap train-validation cuando estén disponibles. La comparación MUST tener representación accesible textual o tabular y no depender exclusivamente de color.

Logistic Regression MAY llevar la etiqueta textual **Selected**. LinearSVC MAY indicar **Highest DEV F1 observed** cuando la fuente DEV lo respalde. La UI MUST NOT usar "best model", "winner", "superior model" ni afirmaciones de superioridad global.

#### Scenario: LAB-02 selección frente a F1 observada

- **GIVEN** la evidencia DEV consolidada
- **WHEN** un usuario consulta la comparación
- **THEN** distingue la decisión humana de seleccionar Logistic Regression de la mayor F1 toxic media observada de LinearSVC, junto con las limitaciones de la evidencia disponible.

### Requirement: LAB-03 Modelo seleccionado y artefacto DEV-only

Laboratory MUST presentar Logistic Regression como modelo seleccionado por decisión humana, con configuración congelada, TF-IDF, preprocessing, estabilidad observada, tamaño y grupos DEV, entorno y metadata del artefacto cuando estén disponibles. MUST explicar que la selección consideró evidencia conjunta y no solo F1 toxic.

La página MAY mostrar checksum técnico de metadata aprobada, pero MUST NOT exponer ni descargar el `.joblib`.

#### Scenario: LAB-03 metadata auditable

- **WHEN** un usuario abre la sección Selected Model
- **THEN** puede consultar la configuración y metadata DEV-only derivadas de fuentes autorizadas, además de limitaciones de tamaño DEV, grupos, folds y gap train-validation, sin presentar una evaluación TEST.

### Requirement: LAB-04 Folds y experimentos separados

Laboratory MUST mostrar evidencia por fold disponible mediante valores textuales o tablas con cabeceras, incluyendo F1 toxic, precision, recall, accuracy y matrices de confusión cuando existan. Las matrices MUST ser comprensibles sin color.

Laboratory MUST presentar el tuning de Logistic Regression y la ablación de augmentation de MultinomialNB como experimentos separados. La augmentation MUST NOT mezclarse con la comparación homogénea principal ni reinterpretarse como modificación del modelo seleccionado.

#### Scenario: LAB-04 evidencia de experimentos

- **WHEN** un usuario revisa experimentos
- **THEN** identifica qué resultados pertenecen al tuning de Logistic Regression y cuáles a la ablación independiente de MultinomialNB, incluyendo sus límites metodológicos.

### Requirement: LAB-05 CIVIKA técnica accesible y responsive

Laboratory MUST conservar identidad CIVIKA mediante violetas/lavandas, superficies limpias y detalles técnicos sobrios. MUST funcionar en desktop, tablet, móvil ~320 CSS px y zoom 200 %, con modo claro y oscuro, estructura semántica, headings, teclado, foco visible y contraste suficiente.

Las tablas o matrices amplias MUST quedar dentro de regiones accesibles con caption y cabeceras; no deben provocar overflow horizontal de toda la página. Cualquier barra o visualización MUST disponer de valores y explicación textual equivalente.

#### Scenario: LAB-05 consulta adaptable

- **WHEN** Laboratory se consulta a 320 CSS px, 200 % de zoom, modo claro u oscuro, o solo con teclado
- **THEN** el contenido técnico sigue siendo legible, navegable y comprensible sin pérdida funcional, sin depender exclusivamente de color ni de una visualización gráfica.

### Requirement: LAB-06 Sin navegación ni API nueva

Laboratory MUST NOT introducir React Router, rutas, enlaces a páginas inexistentes, navegación funcional desde Sidebar, backend, endpoints, APIs, tiempo real, MLflow, persistencia de experimentos ni cambios de entrenamiento o modelo.

#### Scenario: LAB-06 feature desacoplada

- **WHEN** se aplica el change Laboratory
- **THEN** la feature queda preparada como página técnica desacoplada, pero no modifica Sidebar, Header, AppLayout ni la navegación global mientras no exista un change de routing aprobado.
