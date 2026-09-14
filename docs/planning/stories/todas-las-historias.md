# Todas las historias de usuario

Recopilación de las 34 historias completas, incluidos los ajustes aprobados. Los archivos individuales siguen siendo la fuente de planificación; este documento es una copia para lectura conjunta.

## Índice

- [US-01 — Acordar contratos y fixtures de los slices](#us-01)
- [US-02 — Preparar entorno reproducible y CI mínima](#us-02)
- [US-03 — Registrar dataset y semántica de etiquetas](#us-03)
- [US-04 — Documentar EDA de development](#us-04)
- [US-05 — Congelar particiones y protocolo comparable](#us-05)
- [US-06 — Comparar limpieza y normalización textual](#us-06)
- [US-07 — Comparar BoW, TF-IDF y n-gramas](#us-07)
- [US-08 — Evaluar augmentation textual segura](#us-08)
- [US-09 — Entregar conectividad y API manual con predictor fake](#us-09)
- [US-10 — Establecer baseline y evaluador común](#us-10)
- [US-11 — Evaluar individualmente Multinomial Naive Bayes](#us-11)
- [US-12 — Evaluar individualmente Logistic Regression](#us-12)
- [US-13 — Evaluar individualmente LinearSVC](#us-13)
- [US-14 — Evaluar individualmente cuarto clásico por confirmar](#us-14)
- [US-15 — Seleccionar y evaluar candidato congelado](#us-15)
- [US-16 — Empaquetar e integrar inferencia real](#us-16)
- [US-17 — Construir interacción manual accesible con mocks](#us-17)
- [US-18 — Demostrar el producto Essential integrado](#us-18)
- [US-19 — Optimizar modelos con presupuesto acotado](#us-19)
- [US-20 — Obtener comentarios desde URLs admitidas](#us-20)
- [US-21 — Procesar jobs de vídeo y consultar resultados](#us-21)
- [US-22 — Entregar dashboard de vídeo integrado](#us-22)
- [US-23 — Comparar ensemble con clásico](#us-23)
- [US-24 — Ampliar pruebas de regresión y validar nivel Medium](#us-24)
- [US-25 — Comparar LSTM o RNN apropiada](#us-25)
- [US-26 — Seguir y detener análisis periódico de vídeo](#us-26)
- [US-27 — Empaquetar servicios y PostgreSQL con Docker](#us-27)
- [US-28 — Publicar demo Advanced y validar operación](#us-28)
- [US-29 — Preparar repositorio PostgreSQL y migraciones](#us-29)
- [US-30 — Guardar y consultar una predicción protegida](#us-30)
- [US-31 — Evaluar transformer detrás del predictor común](#us-31)
- [US-32 — Registrar experimentos con MLflow opcional](#us-32)
- [US-33 — Demostrar Expert y degradación acumulada](#us-33)
- [US-34 — Preparar presentación del nivel alcanzado](#us-34)

---

<a id="us-01"></a>

# [US-01] Acordar contratos y fixtures de los slices

## User Story

Como equipo, quiero contratos revisados y ejemplos válidos, para desarrollar frontend y backend en paralelo.

## Context

Esta historia contribuye a EP-01 y satisface PR-01 de [manual-analysis](../../../openspec/changes/define-project/specs/manual-analysis/spec.md). Depende de un contrato revisado y no autoriza implementar en esta fase documental.

## Scope

Revisar OpenAPI, ErrorEnvelope, score nullable, health y rutas opcionales; fixtures sintéticos success/error en documentación y futuro frontend/src/mocks.

## Out of Scope

Endpoints, modelo, UI funcional y publicación remota de Issues.

## Acceptance Criteria

- [ ] AC1: equipo revisa request/response, límites, errores y versionado v1.
- [ ] AC2: fixtures cubren éxito sin score, validación, indisponibilidad y vídeo parcial.
- [ ] AC3: fixtures validan contra schema; mocks identificados como sintéticos; OQ-02 visible.

## Technical Notes

Respetar [diseño](../../../openspec/changes/define-project/design.md) y [contratos](../../../openspec/changes/define-project/contracts/README.md); no cambiar semántica ni límites sin revisar spec. Las rutas de Scope son futuras y no se crean ahora. No introducir dependencia de capacidades Medium/Advanced/Expert.

## Testing

Validación de schemas/fixtures y revisión conjunta; al crear handlers de mocks, RED de contratos antes de GREEN.

Registrar evidencia de cada AC; aplicar RED → GREEN → REFACTOR a código testeable. Tests deben fallar por comportamiento ausente, no por entorno roto.

## Dependencies

Ninguna historia previa.

Gate: Aprobar propuesta binaria para mocks; ML real espera OQ-02. Ver [preguntas abiertas](../../discovery.md). Las dependencias de cierre adicionales declaradas en gate no impiden empezar mocks.

## Definition of Done

Aplicar íntegramente [DoD global](../../../CONTRIBUTING.md). Además:

- [ ] Los tres AC tienen evidencia enlazada y review de otra persona.
- [ ] Tests o validación documental descritos en Testing completados y limitaciones registradas.
- [ ] Se actualiza el informe correspondiente sin inventar resultados.
- [ ] No se reclaman funcionalidades fuera de Scope ni gates pendientes como cumplidos.

## Level

🟢 Essential

## Labels

`level:essential`, `area:backend`, `area:frontend`, `area:docs`, `type:feature`

## Size

M. Si supera una entrega revisable, dividir por AC manteniendo la historia de integración; no crear XL.

## Planning

Epic: EP-01. Priority propuesta: P0. Sin persona asignada. Backend: Veru/Víctor; frontend: Naimireth/María; ML: asignación individual pendiente de equipo.

---

<a id="us-02"></a>

# [US-02] Preparar entorno reproducible y CI mínima

## User Story

Como colaborador, quiero arrancar herramientas y tests con locks, para contribuir sin configurar cada capa a mano.

## Context

Esta historia contribuye a EP-01 y satisface PL-01, PL-02, PL-04 de [platform](../../../openspec/changes/define-project/specs/platform/spec.md). Depende de un contrato revisado y no autoriza implementar en esta fase documental.

## Scope

Futuro backend/pyproject.toml único, uv.lock, frontend package/lock, .env.example raíz, Makefile, scripts, README y CI mínimos.

## Out of Scope

Docker de producto, dependencias ML pesadas y funcionalidades.

## Acceptance Criteria

- [ ] AC1: instalación limpia usa locks y no descarga dataset/modelo ocultamente.
- [ ] AC2: make help/setup/test/lint y equivalentes PowerShell documentados; variables públicas separadas de secretos.
- [ ] AC3: CI ejecuta suites disponibles y chequeos; ausencia de servicios opcionales no bloquea import básico.

## Technical Notes

Respetar [diseño](../../../openspec/changes/define-project/design.md) y [contratos](../../../openspec/changes/define-project/contracts/README.md); no cambiar semántica ni límites sin revisar spec. Las rutas de Scope son futuras y no se crean ahora. No introducir dependencia de capacidades Medium/Advanced/Expert.

## Testing

Smoke de instalación limpia, validación de configuración con RED para faltantes condicionales y secretos; CI sin credenciales externas.

Registrar evidencia de cada AC; aplicar RED → GREEN → REFACTOR a código testeable. Tests deben fallar por comportamiento ausente, no por entorno roto.

## Dependencies

[US-01](#us-01)

Gate: OQ-09. Ver [preguntas abiertas](../../discovery.md). Las dependencias de cierre adicionales declaradas en gate no impiden empezar mocks.

## Definition of Done

Aplicar íntegramente [DoD global](../../../CONTRIBUTING.md). Además:

- [ ] Los tres AC tienen evidencia enlazada y review de otra persona.
- [ ] Tests o validación documental descritos en Testing completados y limitaciones registradas.
- [ ] Se actualiza el informe correspondiente sin inventar resultados.
- [ ] No se reclaman funcionalidades fuera de Scope ni gates pendientes como cumplidos.

## Level

🟢 Essential

## Labels

`level:essential`, `area:devops`, `area:testing`, `type:chore`

## Size

M. Si supera una entrega revisable, dividir por AC manteniendo la historia de integración; no crear XL.

## Planning

Epic: EP-01. Priority propuesta: P0. Sin persona asignada. Backend: Veru/Víctor; frontend: Naimireth/María; ML: asignación individual pendiente de equipo.

---

<a id="us-03"></a>

# [US-03] Registrar dataset y semántica de etiquetas

## User Story

Como equipo ML, quiero una ficha de datos autorizada, para saber qué se predice y con qué limitaciones.

## Context

Esta historia contribuye a EP-02 y satisface DA-01 de [data-lifecycle](../../../openspec/changes/define-project/specs/data-lifecycle/spec.md). Depende de un contrato revisado y no autoriza implementar en esta fase documental.

## Scope

data/manifests futuro y ficha en docs/reports/eda; documentar esquema, fuente, licencia, idioma, hash y mapeo.

## Out of Scope

EDA completo y elegir modelo.

## Acceptance Criteria

- [ ] AC1: procedencia/licencia/idioma/columnas documentados sin valores inventados.
- [ ] AC2: se aprueba relación de cada clase original con taxonomía; ambigüedades registradas.
- [ ] AC3: equipo cierra OQ-01/02 o deja investigación bloqueada explícitamente.

## Technical Notes

Respetar [diseño](../../../openspec/changes/define-project/design.md) y [contratos](../../../openspec/changes/define-project/contracts/README.md); no cambiar semántica ni límites sin revisar spec. Las rutas de Scope son futuras y no se crean ahora. No introducir dependencia de capacidades Medium/Advanced/Expert.

## Testing

Revisión humana y comprobaciones de esquema/hash con RED si se implementa validador; no publicar datos sensibles.

Registrar evidencia de cada AC; aplicar RED → GREEN → REFACTOR a código testeable. Tests deben fallar por comportamiento ausente, no por entorno roto.

## Dependencies

Ninguna historia previa.

Gate: OQ-01/02 se resuelven aquí. Ver [preguntas abiertas](../../discovery.md). Las dependencias de cierre adicionales declaradas en gate no impiden empezar mocks.

## Definition of Done

Aplicar íntegramente [DoD global](../../../CONTRIBUTING.md). Además:

- [ ] Los tres AC tienen evidencia enlazada y review de otra persona.
- [ ] Tests o validación documental descritos en Testing completados y limitaciones registradas.
- [ ] Se actualiza el informe correspondiente sin inventar resultados.
- [ ] No se reclaman funcionalidades fuera de Scope ni gates pendientes como cumplidos.

## Level

🟢 Essential

## Labels

`level:essential`, `area:data`, `area:docs`, `type:research`

## Size

S. Si supera una entrega revisable, dividir por AC manteniendo la historia de integración; no crear XL.

## Planning

Epic: EP-02. Priority propuesta: P0. Sin persona asignada. Backend: Veru/Víctor; frontend: Naimireth/María; ML: asignación individual pendiente de equipo.

---

<a id="us-04"></a>

# [US-04] Documentar EDA de development

## User Story

Como equipo ML, quiero comprender los datos de desarrollo, para justificar preprocessing y riesgos.

## Context

Esta historia contribuye a EP-02 y satisface DA-03 de [data-lifecycle](../../../openspec/changes/define-project/specs/data-lifecycle/spec.md). Depende de un contrato revisado y no autoriza implementar en esta fase documental.

## Scope

notebooks y docs/reports/eda/report.md: nulos, etiquetas, longitudes, duplicados, desbalance, idiomas, sesgos.

## Out of Scope

Explorar test para decidir características; entrenar candidatos.

## Acceptance Criteria

- [ ] AC1: comando y manifest reproducen tablas/gráficos sobre development.
- [ ] AC2: se identifican implicaciones para features, agrupación y error de negocio.
- [ ] AC3: responsable humano asignado y reporte revisado por equipo, incluso con IA.

## Technical Notes

Respetar [diseño](../../../openspec/changes/define-project/design.md) y [contratos](../../../openspec/changes/define-project/contracts/README.md); no cambiar semántica ni límites sin revisar spec. Las rutas de Scope son futuras y no se crean ahora. No introducir dependencia de capacidades Medium/Advanced/Expert.

## Testing

Comprobar entrada de notebook limitada a development; validar funciones agregadoras con tests y revisar conclusiones.

Registrar evidencia de cada AC; aplicar RED → GREEN → REFACTOR a código testeable. Tests deben fallar por comportamiento ausente, no por entorno roto.

## Dependencies

[US-05](#us-05)

Gate: OQ-04. Ver [preguntas abiertas](../../discovery.md). Las dependencias de cierre adicionales declaradas en gate no impiden empezar mocks.

## Definition of Done

Aplicar íntegramente [DoD global](../../../CONTRIBUTING.md). Además:

- [ ] Los tres AC tienen evidencia enlazada y review de otra persona.
- [ ] Tests o validación documental descritos en Testing completados y limitaciones registradas.
- [ ] Se actualiza el informe correspondiente sin inventar resultados.
- [ ] No se reclaman funcionalidades fuera de Scope ni gates pendientes como cumplidos.

## Level

🟢 Essential

## Labels

`level:essential`, `area:data`, `area:ml`, `type:research`

## Size

M. Si supera una entrega revisable, dividir por AC manteniendo la historia de integración; no crear XL.

## Planning

Epic: EP-02. Priority propuesta: P0. Sin persona asignada. Backend: Veru/Víctor; frontend: Naimireth/María; ML: asignación individual pendiente de equipo.

---

<a id="us-05"></a>

# [US-05] Congelar particiones y protocolo comparable

## User Story

Como experimentador, quiero splits compartidos y holdout aislado, para comparar sin leakage.

## Context

Esta historia contribuye a EP-02 y satisface DA-02 de [data-lifecycle](../../../openspec/changes/define-project/specs/data-lifecycle/spec.md). Depende de un contrato revisado y no autoriza implementar en esta fase documental.

## Scope

backend/ml/evaluation y data/splits/manifests; IDs, grupos, duplicados, seed/folds, custodio test y protocolo de acceso.

## Out of Scope

Fit de vectorizadores y decisiones con test.

## Acceptance Criteria

- [ ] AC1: IDs/hash/folds reproducibles; duplicados/grupos no cruzan particiones.
- [ ] AC2: test queda aislado y rutina development rechaza acceso; política de conflictos/estratificación documentada.
- [ ] AC3: cuatro personas pueden consumir el mismo manifiesto y se aprueba protocolo antes de entrenar.

## Technical Notes

Respetar [diseño](../../../openspec/changes/define-project/design.md) y [contratos](../../../openspec/changes/define-project/contracts/README.md); no cambiar semántica ni límites sin revisar spec. Las rutas de Scope son futuras y no se crean ahora. No introducir dependencia de capacidades Medium/Advanced/Expert.

## Testing

RED con grupos duplicados, conflicto de labels y clase pequeña; GREEN de split; verificar intersecciones vacías y repetibilidad.

Registrar evidencia de cada AC; aplicar RED → GREEN → REFACTOR a código testeable. Tests deben fallar por comportamiento ausente, no por entorno roto.

## Dependencies

[US-03](#us-03)

Gate: OQ-01/02 cerradas; tamaños condicionan split. Ver [preguntas abiertas](../../discovery.md). Las dependencias de cierre adicionales declaradas en gate no impiden empezar mocks.

## Definition of Done

Aplicar íntegramente [DoD global](../../../CONTRIBUTING.md). Además:

- [ ] Los tres AC tienen evidencia enlazada y review de otra persona.
- [ ] Tests o validación documental descritos en Testing completados y limitaciones registradas.
- [ ] Se actualiza el informe correspondiente sin inventar resultados.
- [ ] No se reclaman funcionalidades fuera de Scope ni gates pendientes como cumplidos.

## Level

🟢 Essential

## Labels

`level:essential`, `area:data`, `area:ml`, `area:testing`, `type:research`

## Size

M. Si supera una entrega revisable, dividir por AC manteniendo la historia de integración; no crear XL.

## Planning

Epic: EP-02. Priority propuesta: P0. Sin persona asignada. Backend: Veru/Víctor; frontend: Naimireth/María; ML: asignación individual pendiente de equipo.

---

<a id="us-06"></a>

# [US-06] Comparar limpieza y normalización textual

## User Story

Como experimentador, quiero variantes NLP clásicas testeadas, para medir qué transformaciones ayudan.

## Context

Esta historia contribuye a EP-02 y satisface TX-01 de [text-features](../../../openspec/changes/define-project/specs/text-features/spec.md). Depende de un contrato revisado y no autoriza implementar en esta fase documental.

## Scope

backend/ml/preprocessing y reporte: regex, tokenización, stopwords, stemming y lematización por idioma.

## Out of Scope

Decidir pipeline final sin medir o aplicar stem+lemma por obligación.

## Acceptance Criteria

- [ ] AC1: todas las técnicas tienen implementación y experimentos identificados.
- [ ] AC2: Unicode, negación, URL/mención, vacío y texto tras limpieza se prueban.
- [ ] AC3: tabla de ablations bajo folds iguales justifica inclusión/descarte y preserva función reutilizable.

## Technical Notes

Respetar [diseño](../../../openspec/changes/define-project/design.md) y [contratos](../../../openspec/changes/define-project/contracts/README.md); no cambiar semántica ni límites sin revisar spec. Las rutas de Scope son futuras y no se crean ahora. No introducir dependencia de capacidades Medium/Advanced/Expert.

## Testing

RED de regex y tokenización con entradas límite; GREEN/REFACTOR; pruebas de determinismo y paridad entrenamiento/inferencia.

Registrar evidencia de cada AC; aplicar RED → GREEN → REFACTOR a código testeable. Tests deben fallar por comportamiento ausente, no por entorno roto.

## Dependencies

[US-04](#us-04), [US-10](#us-10)

Gate: Idioma aprobado en OQ-01. Ver [preguntas abiertas](../../discovery.md). Las dependencias de cierre adicionales declaradas en gate no impiden empezar mocks.

## Definition of Done

Aplicar íntegramente [DoD global](../../../CONTRIBUTING.md). Además:

- [ ] Los tres AC tienen evidencia enlazada y review de otra persona.
- [ ] Tests o validación documental descritos en Testing completados y limitaciones registradas.
- [ ] Se actualiza el informe correspondiente sin inventar resultados.
- [ ] No se reclaman funcionalidades fuera de Scope ni gates pendientes como cumplidos.

## Level

🟢 Essential

## Labels

`level:essential`, `area:ml`, `area:testing`, `type:feature`

## Size

M. Si supera una entrega revisable, dividir por AC manteniendo la historia de integración; no crear XL.

## Planning

Epic: EP-02. Priority propuesta: P0. Sin persona asignada. Backend: Veru/Víctor; frontend: Naimireth/María; ML: asignación individual pendiente de equipo.

---

<a id="us-07"></a>

# [US-07] Comparar BoW, TF-IDF y n-gramas

## User Story

Como experimentador, quiero vectorización entrenada solo en train, para extraer features sin contaminación.

## Context

Esta historia contribuye a EP-02 y satisface TX-02 de [text-features](../../../openspec/changes/define-project/specs/text-features/spec.md). Depende de un contrato revisado y no autoriza implementar en esta fase documental.

## Scope

backend/ml/training pipelines y evaluación; BoW/TF-IDF/ngramas con presupuesto pequeño y matrices sparse.

## Out of Scope

Vocabulario global y densificación innecesaria.

## Acceptance Criteria

- [ ] AC1: experimentos registran BoW, TF-IDF y ngramas con folds compartidos.
- [ ] AC2: token exclusivo de validación nunca aparece por fit; IDs/IDF verificables.
- [ ] AC3: pipeline base de comparación queda versionado; ajustes posteriores se separan como ablation.

## Technical Notes

Respetar [diseño](../../../openspec/changes/define-project/design.md) y [contratos](../../../openspec/changes/define-project/contracts/README.md); no cambiar semántica ni límites sin revisar spec. Las rutas de Scope son futuras y no se crean ahora. No introducir dependencia de capacidades Medium/Advanced/Expert.

## Testing

RED con token exclusivo y transform sin fit; GREEN pipeline; tests sparse y serialización mínima.

Registrar evidencia de cada AC; aplicar RED → GREEN → REFACTOR a código testeable. Tests deben fallar por comportamiento ausente, no por entorno roto.

## Dependencies

[US-05](#us-05), [US-10](#us-10)

Gate: Dataset y protocolo aprobados. Ver [preguntas abiertas](../../discovery.md). Las dependencias de cierre adicionales declaradas en gate no impiden empezar mocks.

## Definition of Done

Aplicar íntegramente [DoD global](../../../CONTRIBUTING.md). Además:

- [ ] Los tres AC tienen evidencia enlazada y review de otra persona.
- [ ] Tests o validación documental descritos en Testing completados y limitaciones registradas.
- [ ] Se actualiza el informe correspondiente sin inventar resultados.
- [ ] No se reclaman funcionalidades fuera de Scope ni gates pendientes como cumplidos.

## Level

🟢 Essential

## Labels

`level:essential`, `area:ml`, `area:testing`, `type:feature`

## Size

M. Si supera una entrega revisable, dividir por AC manteniendo la historia de integración; no crear XL.

## Planning

Epic: EP-02. Priority propuesta: P0. Sin persona asignada. Backend: Veru/Víctor; frontend: Naimireth/María; ML: asignación individual pendiente de equipo.

---

<a id="us-08"></a>

# [US-08] Evaluar augmentation textual segura

## User Story

Como experimentador, quiero muestras aumentadas trazables solo en train, para medir mejora sin leakage.

## Context

Esta historia contribuye a EP-02 y satisface TX-03 de [text-features](../../../openspec/changes/define-project/specs/text-features/spec.md). Depende de un contrato revisado y no autoriza implementar en esta fase documental.

## Scope

backend/ml/training augmentation y reporte control; ensayo de sustitución de sinónimos adecuado a idioma, revisión semántica.

Experimento obligatorio de Essential, realizable como ablation posterior sobre development sin bloquear selección US-15 ni integración US-16 del primer clásico.

## Out of Scope

Augmentar validación/test; back translation obligatoria.

## Acceptance Criteria

- [ ] AC1: sintéticos tienen ID/padre/técnica/seed dentro de train de cada fold.
- [ ] AC2: hash de validation/test intacto, padres no cruzan folds y negación/etiqueta revisadas.
- [ ] AC3: comparación con control y coste sobre folds de development registra utilidad o descarte; no modifica el candidato congelado ni reutiliza test para seleccionar o promover cambios.

## Technical Notes

Respetar [diseño](../../../openspec/changes/define-project/design.md) y [contratos](../../../openspec/changes/define-project/contracts/README.md); no cambiar semántica ni límites sin revisar spec. Las rutas de Scope son futuras y no se crean ahora. No introducir dependencia de capacidades Medium/Advanced/Expert.

## Testing

RED de pertenencia de padres/folds; GREEN; prueba determinista y revisión humana de muestras sintéticas.

Si se realiza después de US-15, verificar que la ablation no consulta test ni modifica el bundle aprobado. Una eventual promoción posterior requiere nuevo ciclo con holdout independiente según el protocolo existente.

Registrar evidencia de cada AC; aplicar RED → GREEN → REFACTOR a código testeable. Tests deben fallar por comportamiento ausente, no por entorno roto.

## Dependencies

[US-06](#us-06), [US-07](#us-07)

Gate: Ninguna adicional. Ver [preguntas abiertas](../../discovery.md). Las dependencias de cierre adicionales declaradas en gate no impiden empezar mocks.

US-08 no es prerrequisito de US-15/US-16. Su evidencia sí es necesaria para cerrar US-18 y declarar Essential completo; no para comenzar su integración o E2E.

## Definition of Done

Aplicar íntegramente [DoD global](../../../CONTRIBUTING.md). Además:

- [ ] Los tres AC tienen evidencia enlazada y review de otra persona.
- [ ] Tests o validación documental descritos en Testing completados y limitaciones registradas.
- [ ] Se actualiza el informe correspondiente sin inventar resultados.
- [ ] No se reclaman funcionalidades fuera de Scope ni gates pendientes como cumplidos.

## Level

🟢 Essential

## Labels

`level:essential`, `area:ml`, `area:data`, `type:feature`

## Size

M. Si supera una entrega revisable, dividir por AC manteniendo la historia de integración; no crear XL.

## Planning

Epic: EP-02. Priority propuesta: P1. Sin persona asignada. Backend: Veru/Víctor; frontend: Naimireth/María; ML: asignación individual pendiente de equipo.

---

<a id="us-09"></a>

# [US-09] Entregar conectividad y API manual con predictor fake

## User Story

Como desarrollador de producto, quiero un slice ejecutable con inferencia determinista de desarrollo, para integrar UI y API antes del modelo.

## Context

Esta historia contribuye a EP-04 y satisface PR-01 de [manual-analysis](../../../openspec/changes/define-project/specs/manual-analysis/spec.md). Depende de un contrato revisado y no autoriza implementar en esta fase documental.

## Scope

backend/app/api/v1 y services; health y POST predictions con Predictor fake solo en test/desarrollo; indicador conexión frontend.

## Out of Scope

Presentar fake como modelo entrenado; historial y YouTube.

## Acceptance Criteria

- [ ] AC1: health y POST cumplen OpenAPI, validación estricta y ErrorEnvelope.
- [ ] AC2: fake está deshabilitado en producción y claramente identificado en demo de desarrollo.
- [ ] AC3: frontend muestra conectividad/indisponibilidad; tests prueban 422/503 y no requieren DB.

## Technical Notes

Respetar [diseño](../../../openspec/changes/define-project/design.md) y [contratos](../../../openspec/changes/define-project/contracts/README.md); no cambiar semántica ni límites sin revisar spec. Las rutas de Scope son futuras y no se crean ahora. No introducir dependencia de capacidades Medium/Advanced/Expert.

## Testing

RED contratos/servicio; GREEN rutas; integración ASGI fake y smoke UI/backend.

Registrar evidencia de cada AC; aplicar RED → GREEN → REFACTOR a código testeable. Tests deben fallar por comportamiento ausente, no por entorno roto.

## Dependencies

[US-01](#us-01), [US-02](#us-02)

Gate: Contrato US-01 aprobado. Ver [preguntas abiertas](../../discovery.md). Las dependencias de cierre adicionales declaradas en gate no impiden empezar mocks.

## Definition of Done

Aplicar íntegramente [DoD global](../../../CONTRIBUTING.md). Además:

- [ ] Los tres AC tienen evidencia enlazada y review de otra persona.
- [ ] Tests o validación documental descritos en Testing completados y limitaciones registradas.
- [ ] Se actualiza el informe correspondiente sin inventar resultados.
- [ ] No se reclaman funcionalidades fuera de Scope ni gates pendientes como cumplidos.

## Level

🟢 Essential

## Labels

`level:essential`, `area:backend`, `area:frontend`, `area:testing`, `type:feature`

## Size

M. Si supera una entrega revisable, dividir por AC manteniendo la historia de integración; no crear XL.

## Planning

Epic: EP-04. Priority propuesta: P0. Sin persona asignada. Backend: Veru/Víctor; frontend: Naimireth/María; ML: asignación individual pendiente de equipo.

---

<a id="us-10"></a>

# [US-10] Establecer baseline y evaluador común

## User Story

Como equipo ML, quiero Dummy y un evaluador compartido, para comparar mejoras con la misma regla.

## Context

Esta historia contribuye a EP-03 y satisface ML-01, ML-02 de [model-lifecycle](../../../openspec/changes/define-project/specs/model-lifecycle/spec.md). Depende de un contrato revisado y no autoriza implementar en esta fase documental.

## Scope

backend/ml/evaluation, Dummy most_frequent, métricas por clase, matriz, gap, coste y plantilla run.

## Out of Scope

Selección usando test.

## Acceptance Criteria

- [ ] AC1: Dummy ejecuta folds comunes y deja run reproducible.
- [ ] AC2: métricas incluyen macro-F1, precision/recall/F1, FN/FP, matriz y soporte; zero division explícito.
- [ ] AC3: mínimos de calidad/recall y presupuesto quedan fijados antes de candidatos.

## Technical Notes

Respetar [diseño](../../../openspec/changes/define-project/design.md) y [contratos](../../../openspec/changes/define-project/contracts/README.md); no cambiar semántica ni límites sin revisar spec. Las rutas de Scope son futuras y no se crean ahora. No introducir dependencia de capacidades Medium/Advanced/Expert.

## Testing

RED con matrices pequeñas conocidas, clase sin predicciones y gap exacto; GREEN evaluador y baseline.

Registrar evidencia de cada AC; aplicar RED → GREEN → REFACTOR a código testeable. Tests deben fallar por comportamiento ausente, no por entorno roto.

## Dependencies

[US-05](#us-05)

Gate: OQ-03 se cierra antes de entrenar candidatos. Ver [preguntas abiertas](../../discovery.md). Las dependencias de cierre adicionales declaradas en gate no impiden empezar mocks.

## Definition of Done

Aplicar íntegramente [DoD global](../../../CONTRIBUTING.md). Además:

- [ ] Los tres AC tienen evidencia enlazada y review de otra persona.
- [ ] Tests o validación documental descritos en Testing completados y limitaciones registradas.
- [ ] Se actualiza el informe correspondiente sin inventar resultados.
- [ ] No se reclaman funcionalidades fuera de Scope ni gates pendientes como cumplidos.

## Level

🟢 Essential

## Labels

`level:essential`, `area:ml`, `area:testing`, `type:feature`

## Size

M. Si supera una entrega revisable, dividir por AC manteniendo la historia de integración; no crear XL.

## Planning

Epic: EP-03. Priority propuesta: P0. Sin persona asignada. Backend: Veru/Víctor; frontend: Naimireth/María; ML: asignación individual pendiente de equipo.

---

<a id="us-11"></a>

# [US-11] Evaluar individualmente Multinomial Naive Bayes

## User Story

Como miembro asignado, quiero entrenar y explicar mi candidato distinto, para aprender ML y contribuir a comparación justa.

## Context

Esta historia contribuye a EP-03 y satisface ML-01 de [model-lifecycle](../../../openspec/changes/define-project/specs/model-lifecycle/spec.md). Depende de un contrato revisado y no autoriza implementar en esta fase documental.

## Scope

backend/ml/training y reporte individual de Multinomial Naive Bayes; usar pipeline/folds/seed/métricas/presupuesto compartidos.  Incluir ajuste básico de una pequeña rejilla predefinida de hiperparámetros solo en folds de development, con igual presupuesto; Optuna posterior no sustituye este requisito Essential.

## Out of Scope

Ensemble como candidato individual, cambiar splits o consultar test.

## Acceptance Criteria

- [ ] AC1: persona/modelo asignados por equipo sin duplicar los otros tres; protocolo principal idéntico.
- [ ] AC2: run registra hiperparámetros, ajuste básico dentro de development, train/validation, gap, FN/FP y recursos; análisis técnico propio.
- [ ] AC3: otra persona reproduce el run y revisa conclusiones; no se usa test ni se afirma ganador anticipado.

## Technical Notes

Respetar [diseño](../../../openspec/changes/define-project/design.md) y [contratos](../../../openspec/changes/define-project/contracts/README.md); no cambiar semántica ni límites sin revisar spec. Las rutas de Scope son futuras y no se crean ahora. No introducir dependencia de capacidades Medium/Advanced/Expert.

## Testing

RED de configuración/reproducibilidad del entrenamiento y evaluador; GREEN run limitado; inspección de errores. 

Registrar evidencia de cada AC; aplicar RED → GREEN → REFACTOR a código testeable. Tests deben fallar por comportamiento ausente, no por entorno roto.

## Dependencies

[US-06](#us-06), [US-07](#us-07), [US-10](#us-10)

Gate: OQ-05: aprobar candidato y asignación; OQ-03 cerrada. Ver [preguntas abiertas](../../discovery.md). Las dependencias de cierre adicionales declaradas en gate no impiden empezar mocks.

## Definition of Done

Aplicar íntegramente [DoD global](../../../CONTRIBUTING.md). Además:

- [ ] Los tres AC tienen evidencia enlazada y review de otra persona.
- [ ] Tests o validación documental descritos en Testing completados y limitaciones registradas.
- [ ] Se actualiza el informe correspondiente sin inventar resultados.
- [ ] No se reclaman funcionalidades fuera de Scope ni gates pendientes como cumplidos.

## Level

🟢 Essential

## Labels

`level:essential`, `area:ml`, `type:research`

## Size

M. Si supera una entrega revisable, dividir por AC manteniendo la historia de integración; no crear XL.

## Planning

Epic: EP-03. Priority propuesta: P0. Sin persona asignada. Backend: Veru/Víctor; frontend: Naimireth/María; ML: asignación individual pendiente de equipo.

---

<a id="us-12"></a>

# [US-12] Evaluar individualmente Logistic Regression

## User Story

Como miembro asignado, quiero entrenar y explicar mi candidato distinto, para aprender ML y contribuir a comparación justa.

## Context

Esta historia contribuye a EP-03 y satisface ML-01 de [model-lifecycle](../../../openspec/changes/define-project/specs/model-lifecycle/spec.md). Depende de un contrato revisado y no autoriza implementar en esta fase documental.

## Scope

backend/ml/training y reporte individual de Logistic Regression; usar pipeline/folds/seed/métricas/presupuesto compartidos.  Incluir ajuste básico de una pequeña rejilla predefinida de hiperparámetros solo en folds de development, con igual presupuesto; Optuna posterior no sustituye este requisito Essential.

## Out of Scope

Ensemble como candidato individual, cambiar splits o consultar test.

## Acceptance Criteria

- [ ] AC1: persona/modelo asignados por equipo sin duplicar los otros tres; protocolo principal idéntico.
- [ ] AC2: run registra hiperparámetros, ajuste básico dentro de development, train/validation, gap, FN/FP y recursos; análisis técnico propio.
- [ ] AC3: otra persona reproduce el run y revisa conclusiones; no se usa test ni se afirma ganador anticipado.

## Technical Notes

Respetar [diseño](../../../openspec/changes/define-project/design.md) y [contratos](../../../openspec/changes/define-project/contracts/README.md); no cambiar semántica ni límites sin revisar spec. Las rutas de Scope son futuras y no se crean ahora. No introducir dependencia de capacidades Medium/Advanced/Expert.

## Testing

RED de configuración/reproducibilidad del entrenamiento y evaluador; GREEN run limitado; inspección de errores. 

Registrar evidencia de cada AC; aplicar RED → GREEN → REFACTOR a código testeable. Tests deben fallar por comportamiento ausente, no por entorno roto.

## Dependencies

[US-06](#us-06), [US-07](#us-07), [US-10](#us-10)

Gate: OQ-05: aprobar candidato y asignación; OQ-03 cerrada. Ver [preguntas abiertas](../../discovery.md). Las dependencias de cierre adicionales declaradas en gate no impiden empezar mocks.

## Definition of Done

Aplicar íntegramente [DoD global](../../../CONTRIBUTING.md). Además:

- [ ] Los tres AC tienen evidencia enlazada y review de otra persona.
- [ ] Tests o validación documental descritos en Testing completados y limitaciones registradas.
- [ ] Se actualiza el informe correspondiente sin inventar resultados.
- [ ] No se reclaman funcionalidades fuera de Scope ni gates pendientes como cumplidos.

## Level

🟢 Essential

## Labels

`level:essential`, `area:ml`, `type:research`

## Size

M. Si supera una entrega revisable, dividir por AC manteniendo la historia de integración; no crear XL.

## Planning

Epic: EP-03. Priority propuesta: P0. Sin persona asignada. Backend: Veru/Víctor; frontend: Naimireth/María; ML: asignación individual pendiente de equipo.

---

<a id="us-13"></a>

# [US-13] Evaluar individualmente LinearSVC

## User Story

Como miembro asignado, quiero entrenar y explicar mi candidato distinto, para aprender ML y contribuir a comparación justa.

## Context

Esta historia contribuye a EP-03 y satisface ML-01 de [model-lifecycle](../../../openspec/changes/define-project/specs/model-lifecycle/spec.md). Depende de un contrato revisado y no autoriza implementar en esta fase documental.

## Scope

backend/ml/training y reporte individual de LinearSVC; usar pipeline/folds/seed/métricas/presupuesto compartidos.  Incluir ajuste básico de una pequeña rejilla predefinida de hiperparámetros solo en folds de development, con igual presupuesto; Optuna posterior no sustituye este requisito Essential.

## Out of Scope

Ensemble como candidato individual, cambiar splits o consultar test.

## Acceptance Criteria

- [ ] AC1: persona/modelo asignados por equipo sin duplicar los otros tres; protocolo principal idéntico.
- [ ] AC2: run registra hiperparámetros, ajuste básico dentro de development, train/validation, gap, FN/FP y recursos; análisis técnico propio.
- [ ] AC3: otra persona reproduce el run y revisa conclusiones; no se usa test ni se afirma ganador anticipado.

## Technical Notes

Respetar [diseño](../../../openspec/changes/define-project/design.md) y [contratos](../../../openspec/changes/define-project/contracts/README.md); no cambiar semántica ni límites sin revisar spec. Las rutas de Scope son futuras y no se crean ahora. No introducir dependencia de capacidades Medium/Advanced/Expert.

## Testing

RED de configuración/reproducibilidad del entrenamiento y evaluador; GREEN run limitado; inspección de errores. Verificar que margen SVC no se reporta como probabilidad.

Registrar evidencia de cada AC; aplicar RED → GREEN → REFACTOR a código testeable. Tests deben fallar por comportamiento ausente, no por entorno roto.

## Dependencies

[US-06](#us-06), [US-07](#us-07), [US-10](#us-10)

Gate: OQ-05: aprobar candidato y asignación; OQ-03 cerrada. Ver [preguntas abiertas](../../discovery.md). Las dependencias de cierre adicionales declaradas en gate no impiden empezar mocks.

## Definition of Done

Aplicar íntegramente [DoD global](../../../CONTRIBUTING.md). Además:

- [ ] Los tres AC tienen evidencia enlazada y review de otra persona.
- [ ] Tests o validación documental descritos en Testing completados y limitaciones registradas.
- [ ] Se actualiza el informe correspondiente sin inventar resultados.
- [ ] No se reclaman funcionalidades fuera de Scope ni gates pendientes como cumplidos.

## Level

🟢 Essential

## Labels

`level:essential`, `area:ml`, `type:research`

## Size

M. Si supera una entrega revisable, dividir por AC manteniendo la historia de integración; no crear XL.

## Planning

Epic: EP-03. Priority propuesta: P0. Sin persona asignada. Backend: Veru/Víctor; frontend: Naimireth/María; ML: asignación individual pendiente de equipo.

---

<a id="us-14"></a>

# [US-14] Evaluar individualmente cuarto clásico por confirmar

## User Story

Como miembro asignado, quiero entrenar y explicar mi candidato distinto, para aprender ML y contribuir a comparación justa.

## Context

Esta historia contribuye a EP-03 y satisface ML-01 de [model-lifecycle](../../../openspec/changes/define-project/specs/model-lifecycle/spec.md). Depende de un contrato revisado y no autoriza implementar en esta fase documental.

## Scope

backend/ml/training y reporte individual de cuarto clásico por confirmar; usar pipeline/folds/seed/métricas/presupuesto compartidos. Propuesta SGDClassifier(log_loss), condicionada al dataset; documentar alternativa ComplementNB. Incluir ajuste básico de una pequeña rejilla predefinida de hiperparámetros solo en folds de development, con igual presupuesto; Optuna posterior no sustituye este requisito Essential.

## Out of Scope

Ensemble como candidato individual, cambiar splits o consultar test.

## Acceptance Criteria

- [ ] AC1: persona/modelo asignados por equipo sin duplicar los otros tres; protocolo principal idéntico.
- [ ] AC2: run registra hiperparámetros, ajuste básico dentro de development, train/validation, gap, FN/FP y recursos; análisis técnico propio.
- [ ] AC3: otra persona reproduce el run y revisa conclusiones; no se usa test ni se afirma ganador anticipado.

## Technical Notes

Respetar [diseño](../../../openspec/changes/define-project/design.md) y [contratos](../../../openspec/changes/define-project/contracts/README.md); no cambiar semántica ni límites sin revisar spec. Las rutas de Scope son futuras y no se crean ahora. No introducir dependencia de capacidades Medium/Advanced/Expert.

## Testing

RED de configuración/reproducibilidad del entrenamiento y evaluador; GREEN run limitado; inspección de errores. 

Registrar evidencia de cada AC; aplicar RED → GREEN → REFACTOR a código testeable. Tests deben fallar por comportamiento ausente, no por entorno roto.

## Dependencies

[US-06](#us-06), [US-07](#us-07), [US-10](#us-10)

Gate: OQ-05: aprobar candidato y asignación; OQ-03 cerrada. Ver [preguntas abiertas](../../discovery.md). Las dependencias de cierre adicionales declaradas en gate no impiden empezar mocks.

## Definition of Done

Aplicar íntegramente [DoD global](../../../CONTRIBUTING.md). Además:

- [ ] Los tres AC tienen evidencia enlazada y review de otra persona.
- [ ] Tests o validación documental descritos en Testing completados y limitaciones registradas.
- [ ] Se actualiza el informe correspondiente sin inventar resultados.
- [ ] No se reclaman funcionalidades fuera de Scope ni gates pendientes como cumplidos.

## Level

🟢 Essential

## Labels

`level:essential`, `area:ml`, `type:research`

## Size

M. Si supera una entrega revisable, dividir por AC manteniendo la historia de integración; no crear XL.

## Planning

Epic: EP-03. Priority propuesta: P0. Sin persona asignada. Backend: Veru/Víctor; frontend: Naimireth/María; ML: asignación individual pendiente de equipo.

---

<a id="us-15"></a>

# [US-15] Seleccionar y evaluar candidato congelado

## User Story

Como equipo, quiero una selección justificada y evaluación final aislada, para promover un modelo defendible.

## Context

Esta historia contribuye a EP-03 y satisface ML-02, ML-03 de [model-lifecycle](../../../openspec/changes/define-project/specs/model-lifecycle/spec.md). Depende de un contrato revisado y no autoriza implementar en esta fase documental.

## Scope

comparación, congelación del pipeline/umbral, reentrenamiento development y una evaluación test autorizada en protocolo; informes.

Puede seleccionar el primer clásico sin esperar US-08. La augmentation permanece obligatoria como ablation sobre development y no cambia retrospectivamente este candidato ni su evaluación final.

## Out of Scope

Retuning con test fallido o prometer gap sin evidencia.

## Acceptance Criteria

- [ ] AC1: comparación usa mismos folds, calidad y coste; calibración/threshold solo development.
- [ ] AC2: artefacto se congela antes de test; gap final abs(train original-test)*100 es <5 pp y supera gates preacordados o se reporta fallo.
- [ ] AC3: precision/recall/F1, matriz, FN/FP, limitaciones y decisión firmados; fallo no abre iteración sobre mismo test.

## Technical Notes

Respetar [diseño](../../../openspec/changes/define-project/design.md) y [contratos](../../../openspec/changes/define-project/contracts/README.md); no cambiar semántica ni límites sin revisar spec. Las rutas de Scope son futuras y no se crean ahora. No introducir dependencia de capacidades Medium/Advanced/Expert.

## Testing

RED del gate en 4.99/5/5.01 pp y métricas insuficientes; GREEN; auditoría de acceso test/manifest.

Registrar evidencia de cada AC; aplicar RED → GREEN → REFACTOR a código testeable. Tests deben fallar por comportamiento ausente, no por entorno roto.

## Dependencies

[US-11](#us-11), [US-12](#us-12), [US-13](#us-13), [US-14](#us-14)

Gate: OQ-03 cerrada; promoción queda bloqueada si gate falla. Ver [preguntas abiertas](../../discovery.md). Las dependencias de cierre adicionales declaradas en gate no impiden empezar mocks.

## Definition of Done

Aplicar íntegramente [DoD global](../../../CONTRIBUTING.md). Además:

- [ ] Los tres AC tienen evidencia enlazada y review de otra persona.
- [ ] Tests o validación documental descritos en Testing completados y limitaciones registradas.
- [ ] Se actualiza el informe correspondiente sin inventar resultados.
- [ ] No se reclaman funcionalidades fuera de Scope ni gates pendientes como cumplidos.

## Level

🟢 Essential

## Labels

`level:essential`, `area:ml`, `area:docs`, `type:feature`

## Size

M. Si supera una entrega revisable, dividir por AC manteniendo la historia de integración; no crear XL.

## Planning

Epic: EP-03. Priority propuesta: P0. Sin persona asignada. Backend: Veru/Víctor; frontend: Naimireth/María; ML: asignación individual pendiente de equipo.

---

<a id="us-16"></a>

# [US-16] Empaquetar e integrar inferencia real

## User Story

Como moderador, quiero consultar el candidato aprobado en la API, para obtener una señal real reproducible.

## Context

Esta historia contribuye a EP-04 y satisface PR-02 de [manual-analysis](../../../openspec/changes/define-project/specs/manual-analysis/spec.md). Depende de un contrato revisado y no autoriza implementar en esta fase documental.

## Scope

backend/ml/inference, bundle pipeline y metadata/checksums, servicio con predictor real, readiness y errores.

## Out of Scope

Entrenamiento en request, HTTP a ML y uploads de pickle.

## Acceptance Criteria

- [ ] AC1: bundle confiable completo cumple contrato Python y se carga una vez por proceso.
- [ ] AC2: respuestas respetan orden batch, score nullable y versión opaca; paridad con pipeline offline.
- [ ] AC3: bundle corrupto/faltante/incompatible produce 503 readiness sin fallback Dummy; no conecta DB.

## Technical Notes

Respetar [diseño](../../../openspec/changes/define-project/design.md) y [contratos](../../../openspec/changes/define-project/contracts/README.md); no cambiar semántica ni límites sin revisar spec. Las rutas de Scope son futuras y no se crean ahora. No introducir dependencia de capacidades Medium/Advanced/Expert.

## Testing

RED de adapter/carga/checksum/paridad; GREEN; integración con artefacto pequeño confiable y candidato aprobado.

Registrar evidencia de cada AC; aplicar RED → GREEN → REFACTOR a código testeable. Tests deben fallar por comportamiento ausente, no por entorno roto.

## Dependencies

[US-09](#us-09), [US-15](#us-15)

Gate: US-15 gate aprobado. Ver [preguntas abiertas](../../discovery.md). Las dependencias de cierre adicionales declaradas en gate no impiden empezar mocks.

## Definition of Done

Aplicar íntegramente [DoD global](../../../CONTRIBUTING.md). Además:

- [ ] Los tres AC tienen evidencia enlazada y review de otra persona.
- [ ] Tests o validación documental descritos en Testing completados y limitaciones registradas.
- [ ] Se actualiza el informe correspondiente sin inventar resultados.
- [ ] No se reclaman funcionalidades fuera de Scope ni gates pendientes como cumplidos.

## Level

🟢 Essential

## Labels

`level:essential`, `area:ml`, `area:backend`, `type:feature`

## Size

M. Si supera una entrega revisable, dividir por AC manteniendo la historia de integración; no crear XL.

## Planning

Epic: EP-04. Priority propuesta: P0. Sin persona asignada. Backend: Veru/Víctor; frontend: Naimireth/María; ML: asignación individual pendiente de equipo.

---

<a id="us-17"></a>

# [US-17] Construir interacción manual accesible con mocks

## User Story

Como moderador, quiero escribir un comentario y entender una señal, para decidir qué revisar.

## Context

Esta historia contribuye a EP-04 y satisface PR-03 de [manual-analysis](../../../openspec/changes/define-project/specs/manual-analysis/spec.md). Depende de un contrato revisado y no autoriza implementar en esta fase documental.

## Scope

frontend/src/features/manual-analysis, cliente API y MSW; idle/invalid/loading/success/error y score null.

## Out of Scope

Esperar modelo terminado; clasificación de personas.

## Acceptance Criteria

- [ ] AC1: formulario label/teclado/foco y errores vinculados; loading impide doble envío y conserva texto ante error.
- [ ] AC2: fixtures éxito/error/sin score muestran lenguaje prudente y no usan color como única señal.
- [ ] AC3: contraste, 320 CSS px y zoom 200% verificados; mocks fuera de build de producción.

## Technical Notes

Respetar [diseño](../../../openspec/changes/define-project/design.md) y [contratos](../../../openspec/changes/define-project/contracts/README.md); no cambiar semántica ni límites sin revisar spec. Las rutas de Scope son futuras y no se crean ahora. No introducir dependencia de capacidades Medium/Advanced/Expert.

## Testing

RED Testing Library para interacción/error/sin score; GREEN UI; revisión teclado/foco y anuncio aria-live.

Registrar evidencia de cada AC; aplicar RED → GREEN → REFACTOR a código testeable. Tests deben fallar por comportamiento ausente, no por entorno roto.

## Dependencies

[US-01](#us-01), [US-02](#us-02)

Gate: Contrato de mocks aprobado. Ver [preguntas abiertas](../../discovery.md). Las dependencias de cierre adicionales declaradas en gate no impiden empezar mocks.

## Definition of Done

Aplicar íntegramente [DoD global](../../../CONTRIBUTING.md). Además:

- [ ] Los tres AC tienen evidencia enlazada y review de otra persona.
- [ ] Tests o validación documental descritos en Testing completados y limitaciones registradas.
- [ ] Se actualiza el informe correspondiente sin inventar resultados.
- [ ] No se reclaman funcionalidades fuera de Scope ni gates pendientes como cumplidos.

## Level

🟢 Essential

## Labels

`level:essential`, `area:frontend`, `area:testing`, `type:feature`

## Size

M. Si supera una entrega revisable, dividir por AC manteniendo la historia de integración; no crear XL.

## Planning

Epic: EP-04. Priority propuesta: P0. Sin persona asignada. Backend: Veru/Víctor; frontend: Naimireth/María; ML: asignación individual pendiente de equipo.

---

<a id="us-18"></a>

# [US-18] Demostrar el producto Essential integrado

## User Story

Como equipo, quiero un E2E real del comentario manual, para demostrar nivel Essential completo.

## Context

Esta historia contribuye a EP-04 y satisface PR-04 de [manual-analysis](../../../openspec/changes/define-project/specs/manual-analysis/spec.md). Depende de un contrato revisado y no autoriza implementar en esta fase documental.

## Scope

tests/e2e, smoke sin servicios opcionales, informe testing y README ejecución real.

## Out of Scope

Sustituir aceptación ML por mocks.

## Acceptance Criteria

- [ ] AC1: navegador→API→bundle aprobado entrega señal con versión y error accesible.
- [ ] AC2: sin DB/YouTube/MLflow/paquetes neuronales el flujo funciona; faltante modelo muestra indisponibilidad.
- [ ] AC3: evidencia TDD/tests/EDA/NLP/gap, augmentation obligatoria US-08 y revisión accesible enlazadas para gate Essential; la ablation puede ser posterior a la integración del primer clásico.

## Technical Notes

Respetar [diseño](../../../openspec/changes/define-project/design.md) y [contratos](../../../openspec/changes/define-project/contracts/README.md); no cambiar semántica ni límites sin revisar spec. Las rutas de Scope son futuras y no se crean ahora. No introducir dependencia de capacidades Medium/Advanced/Expert.

## Testing

E2E Playwright con modelo real, integración de fallo del modelo y revisión manual de teclado.

Registrar evidencia de cada AC; aplicar RED → GREEN → REFACTOR a código testeable. Tests deben fallar por comportamiento ausente, no por entorno roto.

## Dependencies

[US-16](#us-16), [US-17](#us-17)

Gate: US-15 aprobado y contrato integrado. Ver [preguntas abiertas](../../discovery.md). Las dependencias de cierre adicionales declaradas en gate no impiden empezar mocks.

Gate adicional de cierre: [US-08](#us-08) completada para declarar Essential completo. No bloquea comenzar la integración ni ejecutar el E2E del primer modelo.

## Definition of Done

Aplicar íntegramente [DoD global](../../../CONTRIBUTING.md). Además:

- [ ] Los tres AC tienen evidencia enlazada y review de otra persona.
- [ ] Tests o validación documental descritos en Testing completados y limitaciones registradas.
- [ ] Se actualiza el informe correspondiente sin inventar resultados.
- [ ] No se reclaman funcionalidades fuera de Scope ni gates pendientes como cumplidos.

## Level

🟢 Essential

## Labels

`level:essential`, `area:frontend`, `area:backend`, `area:testing`, `type:feature`

## Size

S. Si supera una entrega revisable, dividir por AC manteniendo la historia de integración; no crear XL.

## Planning

Epic: EP-04. Priority propuesta: P0. Sin persona asignada. Backend: Veru/Víctor; frontend: Naimireth/María; ML: asignación individual pendiente de equipo.

---

<a id="us-19"></a>

# [US-19] Optimizar modelos con presupuesto acotado

## User Story

Como experimentador, quiero optimizar hiperparámetros sin sobrecoste, para evaluar mejoras reproducibles.

## Context

Esta historia contribuye a EP-03 y satisface ML-04 de [model-lifecycle](../../../openspec/changes/define-project/specs/model-lifecycle/spec.md). Depende de un contrato revisado y no autoriza implementar en esta fase documental.

## Scope

backend/ml/training tuning Optuna o equivalente; CV development, presupuesto 20 trials/30 min propuesto por candidato.

## Out of Scope

Consultar test consumido por Essential para seleccionar Medium.

## Acceptance Criteria

- [ ] AC1: búsqueda solo usa development con pipeline por fold y mismo presupuesto por candidato comparado.
- [ ] AC2: timeout/trial fallido documentado, caché por fold y mejor trial reproducible.
- [ ] AC3: informe distingue comparación y eventual nuevo ciclo de evaluación final.

## Technical Notes

Respetar [diseño](../../../openspec/changes/define-project/design.md) y [contratos](../../../openspec/changes/define-project/contracts/README.md); no cambiar semántica ni límites sin revisar spec. Las rutas de Scope son futuras y no se crean ahora. La ampliación debe poder deshabilitarse conservando predicción Essential.

## Testing

RED de presupuesto, acceso a splits y seed; GREEN búsqueda acotada con pequeño fixture antes de dataset real.

Registrar evidencia de cada AC; aplicar RED → GREEN → REFACTOR a código testeable. Tests deben fallar por comportamiento ausente, no por entorno roto.

## Dependencies

[US-10](#us-10), [US-11](#us-11), [US-12](#us-12), [US-13](#us-13), [US-14](#us-14)

Gate: Ninguna adicional. Ver [preguntas abiertas](../../discovery.md). Las dependencias de cierre adicionales declaradas en gate no impiden empezar mocks.

## Definition of Done

Aplicar íntegramente [DoD global](../../../CONTRIBUTING.md). Además:

- [ ] Los tres AC tienen evidencia enlazada y review de otra persona.
- [ ] Tests o validación documental descritos en Testing completados y limitaciones registradas.
- [ ] Se actualiza el informe correspondiente sin inventar resultados.
- [ ] No se reclaman funcionalidades fuera de Scope ni gates pendientes como cumplidos.

## Level

🟡 Medium

## Labels

`level:medium`, `area:ml`, `type:research`

## Size

M. Si supera una entrega revisable, dividir por AC manteniendo la historia de integración; no crear XL.

## Planning

Epic: EP-03. Priority propuesta: P1. Sin persona asignada. Backend: Veru/Víctor; frontend: Naimireth/María; ML: asignación individual pendiente de equipo.

---

<a id="us-20"></a>

# [US-20] Obtener comentarios desde URLs admitidas

## User Story

Como moderador, quiero analizar comentarios principales de un vídeo, para revisar contenido a escala de vídeo.

## Context

Esta historia contribuye a EP-05 y satisface VI-01 de [video-analysis](../../../openspec/changes/define-project/specs/video-analysis/spec.md). Depende de un contrato revisado y no autoriza implementar en esta fase documental.

## Scope

backend/app/adapters/youtube y parser puro; API oficial, paginación, límites, dedup y errores normalizados.

## Out of Scope

Scraping, URLs arbitrarias, respuestas y credenciales frontend.

## Acceptance Criteria

- [ ] AC1: watch/shorts/youtu.be con ID válido aceptados; hosts maliciosos/IDs inválidos rechazados antes de red.
- [ ] AC2: paginación respeta max_comments y dedup; vídeo vacío/inexistente/comentarios desactivados diferenciados.
- [ ] AC3: cuota/timeouts/transitorios tienen política acotada y no filtran API key.

## Technical Notes

Respetar [diseño](../../../openspec/changes/define-project/design.md) y [contratos](../../../openspec/changes/define-project/contracts/README.md); no cambiar semántica ni límites sin revisar spec. Las rutas de Scope son futuras y no se crean ahora. La ampliación debe poder deshabilitarse conservando predicción Essential.

## Testing

RED tabla parser incluyendo dominio sufijado, query repetida e ID inválido; GREEN; HTTP fakes con múltiples páginas, 403/404/timeout.

Registrar evidencia de cada AC; aplicar RED → GREEN → REFACTOR a código testeable. Tests deben fallar por comportamiento ausente, no por entorno roto.

## Dependencies

[US-01](#us-01), [US-02](#us-02)

Gate: OQ-08 antes de verificación live. Ver [preguntas abiertas](../../discovery.md). Las dependencias de cierre adicionales declaradas en gate no impiden empezar mocks.

## Definition of Done

Aplicar íntegramente [DoD global](../../../CONTRIBUTING.md). Además:

- [ ] Los tres AC tienen evidencia enlazada y review de otra persona.
- [ ] Tests o validación documental descritos en Testing completados y limitaciones registradas.
- [ ] Se actualiza el informe correspondiente sin inventar resultados.
- [ ] No se reclaman funcionalidades fuera de Scope ni gates pendientes como cumplidos.

## Level

🟡 Medium

## Labels

`level:medium`, `area:backend`, `area:testing`, `type:feature`

## Size

M. Si supera una entrega revisable, dividir por AC manteniendo la historia de integración; no crear XL.

## Planning

Epic: EP-05. Priority propuesta: P1. Sin persona asignada. Backend: Veru/Víctor; frontend: Naimireth/María; ML: asignación individual pendiente de equipo.

---

<a id="us-21"></a>

# [US-21] Procesar jobs de vídeo y consultar resultados

## User Story

Como moderador, quiero seguir un análisis sin mantener la petición abierta, para obtener resultados parciales y finales fiables.

## Context

Esta historia contribuye a EP-05 y satisface VI-02 de [video-analysis](../../../openspec/changes/define-project/specs/video-analysis/spec.md). Depende de un contrato revisado y no autoriza implementar en esta fase documental.

## Scope

backend services/jobs, cola/store memoria acotados, batch inferencia, token, polling y resultados paginados.

## Out of Scope

DB obligatoria, workers distribuidos y durabilidad implícita.

## Acceptance Criteria

- [ ] AC1: POST 202 y transiciones/contadores cumplen contrato; cola saturada 429.
- [ ] AC2: error tras batch genera partial y conserva resultados; vacío completed; tokens/TTL se verifican.
- [ ] AC3: cursor estable sin duplicados, 404 al expirar/reiniciar y logs sin tokens/texto.

## Technical Notes

Respetar [diseño](../../../openspec/changes/define-project/design.md) y [contratos](../../../openspec/changes/define-project/contracts/README.md); no cambiar semántica ni límites sin revisar spec. Las rutas de Scope son futuras y no se crean ahora. La ampliación debe poder deshabilitarse conservando predicción Essential.

## Testing

RED state machine, límites y acceso; GREEN; integración batch/cuota parcial, reloj fake para TTL y reinicio.

Registrar evidencia de cada AC; aplicar RED → GREEN → REFACTOR a código testeable. Tests deben fallar por comportamiento ausente, no por entorno roto.

## Dependencies

[US-16](#us-16), [US-20](#us-20)

Gate: Ninguna adicional. Ver [preguntas abiertas](../../discovery.md). Las dependencias de cierre adicionales declaradas en gate no impiden empezar mocks.

## Definition of Done

Aplicar íntegramente [DoD global](../../../CONTRIBUTING.md). Además:

- [ ] Los tres AC tienen evidencia enlazada y review de otra persona.
- [ ] Tests o validación documental descritos en Testing completados y limitaciones registradas.
- [ ] Se actualiza el informe correspondiente sin inventar resultados.
- [ ] No se reclaman funcionalidades fuera de Scope ni gates pendientes como cumplidos.

## Level

🟡 Medium

## Labels

`level:medium`, `area:backend`, `area:ml`, `area:testing`, `type:feature`

## Size

M. Si supera una entrega revisable, dividir por AC manteniendo la historia de integración; no crear XL.

## Planning

Epic: EP-05. Priority propuesta: P1. Sin persona asignada. Backend: Veru/Víctor; frontend: Naimireth/María; ML: asignación individual pendiente de equipo.

---

<a id="us-22"></a>

# [US-22] Entregar dashboard de vídeo integrado

## User Story

Como moderador, quiero ver resumen y páginas del análisis, para priorizar comentarios para revisión.

## Context

Esta historia contribuye a EP-05 y satisface VI-03 de [video-analysis](../../../openspec/changes/define-project/specs/video-analysis/spec.md). Depende de un contrato revisado y no autoriza implementar en esta fase documental.

## Scope

frontend video-analysis primero con MSW; integración final y E2E contra US-21 al estar disponible.

## Out of Scope

Esperar backend para iniciar UI; asegurar cobertura total no conocida.

## Acceptance Criteria

- [ ] AC1: URL/loading/progreso/conteos/resultados paginados y vacío/partial/failed/expired visibles con teclado.
- [ ] AC2: polling cesa en terminal/desmontaje, respeta backoff y no repite POST automáticamente.
- [ ] AC3: integración final con US-21 demuestra vídeo sin DB; comentarios se renderizan como texto.

## Technical Notes

Respetar [diseño](../../../openspec/changes/define-project/design.md) y [contratos](../../../openspec/changes/define-project/contracts/README.md); no cambiar semántica ni límites sin revisar spec. Las rutas de Scope son futuras y no se crean ahora. La ampliación debe poder deshabilitarse conservando predicción Essential.

## Testing

RED componentes/estados MSW; GREEN UI; E2E con backend real y YouTube simulado, revisión accesible.

Registrar evidencia de cada AC; aplicar RED → GREEN → REFACTOR a código testeable. Tests deben fallar por comportamiento ausente, no por entorno roto.

## Dependencies

[US-01](#us-01), [US-02](#us-02)

Gate: Puede empezar con US-01/02; cerrar requiere US-21. Ver [preguntas abiertas](../../discovery.md). Las dependencias de cierre adicionales declaradas en gate no impiden empezar mocks.

## Definition of Done

Aplicar íntegramente [DoD global](../../../CONTRIBUTING.md). Además:

- [ ] Los tres AC tienen evidencia enlazada y review de otra persona.
- [ ] Tests o validación documental descritos en Testing completados y limitaciones registradas.
- [ ] Se actualiza el informe correspondiente sin inventar resultados.
- [ ] No se reclaman funcionalidades fuera de Scope ni gates pendientes como cumplidos.

## Level

🟡 Medium

## Labels

`level:medium`, `area:frontend`, `area:backend`, `area:testing`, `type:feature`

## Size

M. Si supera una entrega revisable, dividir por AC manteniendo la historia de integración; no crear XL.

## Planning

Epic: EP-05. Priority propuesta: P1. Sin persona asignada. Backend: Veru/Víctor; frontend: Naimireth/María; ML: asignación individual pendiente de equipo.

---

<a id="us-23"></a>

# [US-23] Comparar ensemble con clásico

## User Story

Como equipo ML, quiero evaluar un ensemble adicional, para justificar si combinar mejora la moderación.

## Context

Esta historia contribuye a EP-03 y satisface ML-05 de [model-lifecycle](../../../openspec/changes/define-project/specs/model-lifecycle/spec.md). Depende de un contrato revisado y no autoriza implementar en esta fase documental.

## Scope

ensemble de candidatos aprobados; propuesta voting duro para evitar falsa probabilidad, blando solo calibrado en folds; informe.

## Out of Scope

Reemplazar un modelo individual por ensemble y reutilizar test para tuning.

## Acceptance Criteria

- [ ] AC1: ensemble se compara en mismos folds contra mejor individual y coste registrado.
- [ ] AC2: score null si no hay calibración válida; calibración no toca holdout.
- [ ] AC3: mejora o descarte documentados; si se promueve, ejecutar gate con holdout independiente del ciclo anterior.

## Technical Notes

Respetar [diseño](../../../openspec/changes/define-project/design.md) y [contratos](../../../openspec/changes/define-project/contracts/README.md); no cambiar semántica ni límites sin revisar spec. Las rutas de Scope son futuras y no se crean ahora. La ampliación debe poder deshabilitarse conservando predicción Essential.

## Testing

RED de combinación/orden/contrato, GREEN; run reproducible y auditoría de folds.

Registrar evidencia de cada AC; aplicar RED → GREEN → REFACTOR a código testeable. Tests deben fallar por comportamiento ausente, no por entorno roto.

## Dependencies

[US-19](#us-19)

Gate: Ninguna adicional. Ver [preguntas abiertas](../../discovery.md). Las dependencias de cierre adicionales declaradas en gate no impiden empezar mocks.

## Definition of Done

Aplicar íntegramente [DoD global](../../../CONTRIBUTING.md). Además:

- [ ] Los tres AC tienen evidencia enlazada y review de otra persona.
- [ ] Tests o validación documental descritos en Testing completados y limitaciones registradas.
- [ ] Se actualiza el informe correspondiente sin inventar resultados.
- [ ] No se reclaman funcionalidades fuera de Scope ni gates pendientes como cumplidos.

## Level

🟡 Medium

## Labels

`level:medium`, `area:ml`, `type:research`

## Size

M. Si supera una entrega revisable, dividir por AC manteniendo la historia de integración; no crear XL.

## Planning

Epic: EP-03. Priority propuesta: P1. Sin persona asignada. Backend: Veru/Víctor; frontend: Naimireth/María; ML: asignación individual pendiente de equipo.

---

<a id="us-24"></a>

# [US-24] Ampliar pruebas de regresión y validar nivel Medium

## User Story

Como equipo, quiero evidencia acumulada de nivel Medium, para demostrar robustez de vídeo y ensemble.

## Context

Esta historia contribuye a EP-07 y satisface QA-01 de [quality-accessibility](../../../openspec/changes/define-project/specs/quality-accessibility/spec.md). Depende de un contrato revisado y no autoriza implementar en esta fase documental.

## Scope

suite unit/integration/E2E y reporte testing actualizado con casos externos simulados.

## Out of Scope

Live APIs obligatorias en CI.

## Acceptance Criteria

- [ ] AC1: parser, cuota, disabled, vacío, pagination, partial y token cubiertos.
- [ ] AC2: suite Essential pasa sin DB/MLflow; baseline/ensemble/tuning tienen informes.
- [ ] AC3: no se declara nuevo modelo validado en test si solo existe comparación de desarrollo.

## Technical Notes

Respetar [diseño](../../../openspec/changes/define-project/design.md) y [contratos](../../../openspec/changes/define-project/contracts/README.md); no cambiar semántica ni límites sin revisar spec. Las rutas de Scope son futuras y no se crean ahora. La ampliación debe poder deshabilitarse conservando predicción Essential.

## Testing

Ejecutar regresión acumulada y revisar que tests significativos cubren AC; no duplicar unitarios triviales.

Registrar evidencia de cada AC; aplicar RED → GREEN → REFACTOR a código testeable. Tests deben fallar por comportamiento ausente, no por entorno roto.

## Dependencies

[US-18](#us-18), [US-21](#us-21), [US-22](#us-22), [US-23](#us-23)

Gate: Ninguna adicional. Ver [preguntas abiertas](../../discovery.md). Las dependencias de cierre adicionales declaradas en gate no impiden empezar mocks.

## Definition of Done

Aplicar íntegramente [DoD global](../../../CONTRIBUTING.md). Además:

- [ ] Los tres AC tienen evidencia enlazada y review de otra persona.
- [ ] Tests o validación documental descritos en Testing completados y limitaciones registradas.
- [ ] Se actualiza el informe correspondiente sin inventar resultados.
- [ ] No se reclaman funcionalidades fuera de Scope ni gates pendientes como cumplidos.

## Level

🟡 Medium

## Labels

`level:medium`, `area:testing`, `type:test`

## Size

S. Si supera una entrega revisable, dividir por AC manteniendo la historia de integración; no crear XL.

## Planning

Epic: EP-07. Priority propuesta: P1. Sin persona asignada. Backend: Veru/Víctor; frontend: Naimireth/María; ML: asignación individual pendiente de equipo.

---

<a id="us-25"></a>

# [US-25] Comparar LSTM o RNN apropiada

## User Story

Como experimentador, quiero evaluar una red neuronal con presupuesto, para comparar con NLP clásico de forma honesta.

## Context

Esta historia contribuye a EP-03 y satisface ML-06 de [model-lifecycle](../../../openspec/changes/define-project/specs/model-lifecycle/spec.md). Depende de un contrato revisado y no autoriza implementar en esta fase documental.

## Scope

backend/ml/training/evaluation, vocabulario/padding dentro de train, early stopping con validation, adapter si se selecciona.

## Out of Scope

Dependencia neuronal para Essential o test como early stopping.

## Acceptance Criteria

- [ ] AC1: OQ-06 justifica arquitectura/idioma, presupuesto y librería opcional.
- [ ] AC2: mismos datos/folds y métricas; coste, truncamiento, early stopping y overfitting registrados.
- [ ] AC3: clásico sigue ejecutable sin paquete neuronal; promoción usa nuevo ciclo/holdout si test previo consumido.

## Technical Notes

Respetar [diseño](../../../openspec/changes/define-project/design.md) y [contratos](../../../openspec/changes/define-project/contracts/README.md); no cambiar semántica ni límites sin revisar spec. Las rutas de Scope son futuras y no se crean ahora. La ampliación debe poder deshabilitarse conservando predicción Essential.

## Testing

RED de shapes/padding/adapter si aplica; GREEN; experimento limitado reproducible, no test de exactitud entrenada en CI.

Registrar evidencia de cada AC; aplicar RED → GREEN → REFACTOR a código testeable. Tests deben fallar por comportamiento ausente, no por entorno roto.

## Dependencies

[US-15](#us-15)

Gate: OQ-06. Ver [preguntas abiertas](../../discovery.md). Las dependencias de cierre adicionales declaradas en gate no impiden empezar mocks.

## Definition of Done

Aplicar íntegramente [DoD global](../../../CONTRIBUTING.md). Además:

- [ ] Los tres AC tienen evidencia enlazada y review de otra persona.
- [ ] Tests o validación documental descritos en Testing completados y limitaciones registradas.
- [ ] Se actualiza el informe correspondiente sin inventar resultados.
- [ ] No se reclaman funcionalidades fuera de Scope ni gates pendientes como cumplidos.

## Level

🟠 Advanced

## Labels

`level:advanced`, `area:ml`, `type:research`

## Size

M. Si supera una entrega revisable, dividir por AC manteniendo la historia de integración; no crear XL.

## Planning

Epic: EP-03. Priority propuesta: P1. Sin persona asignada. Backend: Veru/Víctor; frontend: Naimireth/María; ML: asignación individual pendiente de equipo.

---

<a id="us-26"></a>

# [US-26] Seguir y detener análisis periódico de vídeo

## User Story

Como moderador, quiero seguir un vídeo durante una ventana y detenerlo, para detectar comentarios nuevos con coste controlado.

## Context

Esta historia contribuye a EP-05 y satisface VI-04 de [video-analysis](../../../openspec/changes/define-project/specs/video-analysis/spec.md). Depende de un contrato revisado y no autoriza implementar en esta fase documental.

## Scope

monitor API/UI, scheduler local, intervalos/duración, dedup, acceso por token y último job.

## Out of Scope

Tiempo real garantizado, durabilidad entre reinicios y scheduler externo.

## Acceptance Criteria

- [ ] AC1: crear/consultar/detener cumplen contrato; intervalos ≥300 s y duración ≤24 h.
- [ ] AC2: sin solapamiento ni duplicados; detener no agenda nuevos ciclos; cuota detiene o falla explícitamente.
- [ ] AC3: UI muestra ventana/limitaciones y controles accesibles; reinicio explica pérdida de seguimiento.

## Technical Notes

Respetar [diseño](../../../openspec/changes/define-project/design.md) y [contratos](../../../openspec/changes/define-project/contracts/README.md); no cambiar semántica ni límites sin revisar spec. Las rutas de Scope son futuras y no se crean ahora. La ampliación debe poder deshabilitarse conservando predicción Essential.

## Testing

RED con reloj fake para límites/stop/solapamiento, GREEN; integración y E2E monitor accesible.

Registrar evidencia de cada AC; aplicar RED → GREEN → REFACTOR a código testeable. Tests deben fallar por comportamiento ausente, no por entorno roto.

## Dependencies

[US-21](#us-21), [US-22](#us-22)

Gate: Ninguna adicional. Ver [preguntas abiertas](../../discovery.md). Las dependencias de cierre adicionales declaradas en gate no impiden empezar mocks.

## Definition of Done

Aplicar íntegramente [DoD global](../../../CONTRIBUTING.md). Además:

- [ ] Los tres AC tienen evidencia enlazada y review de otra persona.
- [ ] Tests o validación documental descritos en Testing completados y limitaciones registradas.
- [ ] Se actualiza el informe correspondiente sin inventar resultados.
- [ ] No se reclaman funcionalidades fuera de Scope ni gates pendientes como cumplidos.

## Level

🟠 Advanced

## Labels

`level:advanced`, `area:frontend`, `area:backend`, `area:testing`, `type:feature`

## Size

M. Si supera una entrega revisable, dividir por AC manteniendo la historia de integración; no crear XL.

## Planning

Epic: EP-05. Priority propuesta: P1. Sin persona asignada. Backend: Veru/Víctor; frontend: Naimireth/María; ML: asignación individual pendiente de equipo.

---

<a id="us-27"></a>

# [US-27] Empaquetar servicios y PostgreSQL con Docker

## User Story

Como colaborador, quiero levantar servicios con imágenes independientes, para reproducir demo y desplegar por separado.

## Context

Esta historia contribuye a EP-01 y satisface PL-03 de [platform](../../../openspec/changes/define-project/specs/platform/spec.md). Depende de un contrato revisado y no autoriza implementar en esta fase documental.

## Scope

Dockerfiles frontend/backend, compose base y database profile con imagen PostgreSQL fijada; Makefile y docs.

## Out of Scope

Docker ML, DB obligatoria y secretos en capas de imagen.

## Acceptance Criteria

- [ ] AC1: ambos builds independientes y frontend usa URL accesible por navegador.
- [ ] AC2: compose base funciona sin postgres; full añade postgres y volumen, stop no borra datos.
- [ ] AC3: no instala dependencias Expert en perfil base ni entrena/descarga modelo ocultamente.

## Technical Notes

Respetar [diseño](../../../openspec/changes/define-project/design.md) y [contratos](../../../openspec/changes/define-project/contracts/README.md); no cambiar semántica ni límites sin revisar spec. Las rutas de Scope son futuras y no se crean ahora. La ampliación debe poder deshabilitarse conservando predicción Essential.

## Testing

Smoke builds/health/predicción con bundle montado; revisión env/secrets y compose config.

Registrar evidencia de cada AC; aplicar RED → GREEN → REFACTOR a código testeable. Tests deben fallar por comportamiento ausente, no por entorno roto.

## Dependencies

[US-18](#us-18)

Gate: Ninguna adicional. Ver [preguntas abiertas](../../discovery.md). Las dependencias de cierre adicionales declaradas en gate no impiden empezar mocks.

## Definition of Done

Aplicar íntegramente [DoD global](../../../CONTRIBUTING.md). Además:

- [ ] Los tres AC tienen evidencia enlazada y review de otra persona.
- [ ] Tests o validación documental descritos en Testing completados y limitaciones registradas.
- [ ] Se actualiza el informe correspondiente sin inventar resultados.
- [ ] No se reclaman funcionalidades fuera de Scope ni gates pendientes como cumplidos.

## Level

🟠 Advanced

## Labels

`level:advanced`, `area:devops`, `type:chore`

## Size

M. Si supera una entrega revisable, dividir por AC manteniendo la historia de integración; no crear XL.

## Planning

Epic: EP-01. Priority propuesta: P1. Sin persona asignada. Backend: Veru/Víctor; frontend: Naimireth/María; ML: asignación individual pendiente de equipo.

---

<a id="us-28"></a>

# [US-28] Publicar demo Advanced y validar operación

## User Story

Como profesor, quiero acceder a una demo pública, para evaluar un producto desplegado.

## Context

Esta historia contribuye a EP-01 y satisface PL-03 de [platform](../../../openspec/changes/define-project/specs/platform/spec.md). Depende de un contrato revisado y no autoriza implementar en esta fase documental.

## Scope

hosting a elegir, HTTPS, CORS, límites, health/logs seguros, rollback imagen/bundle y E2E remoto.

Preparar y validar técnicamente el despliegue de una versión Essential integrada desde US-27, que ya depende de US-18; para una versión Medium, verificar también sus flujos integrados correspondientes. Este avance no declara Advanced completo ni cierra la historia antes de sus gates finales.

## Out of Scope

Proveedor decidido sin equipo, historial de datos personales público.

## Acceptance Criteria

- [ ] AC1: frontend y backend se despliegan separados con secrets del proveedor y URLs correctas.
- [ ] AC2: HTTPS, CORS/rate/body limits, XSS textual y logs sin secretos verificados.
- [ ] AC3: para cerrar US-28 y declarar Advanced completo, US-24, US-25, US-26 y US-27 están aceptadas; la demo Advanced funciona sin DB/MLflow/transformer y documenta rollback/limitaciones de memoria. El despliegue previo de Essential/Medium no satisface por sí solo este gate.

## Technical Notes

Respetar [diseño](../../../openspec/changes/define-project/design.md) y [contratos](../../../openspec/changes/define-project/contracts/README.md); no cambiar semántica ni límites sin revisar spec. Las rutas de Scope son futuras y no se crean ahora. La ampliación debe poder deshabilitarse conservando predicción Essential.

## Testing

Smoke remoto y E2E críticos, tests de límites/HTML, revisión de configuración; despliegue solo en fase autorizada.

Registrar por separado la validación técnica temprana del nivel desplegado y la validación final Advanced. Esta última exige evidencias de US-24/25/26/27 y vuelve a ejecutar los flujos críticos de la versión Advanced publicada.

Registrar evidencia de cada AC; aplicar RED → GREEN → REFACTOR a código testeable. Tests deben fallar por comportamiento ausente, no por entorno roto.

## Dependencies

Inicio: [US-27](#us-27), que incorpora el producto Essential integrado de US-18. US-24/25/26 no bloquean preparar y probar ese despliegue.

Cierre y declaración Advanced: [US-24](#us-24), [US-25](#us-25), [US-26](#us-26) y US-27 aceptadas, además de los AC de esta historia. Para validar técnicamente una versión Medium, incluir los flujos Medium que se despliegan; no declarar ese nivel sin su gate US-24.

Gate: OQ-07 y proveedor aprobados. Ver [preguntas abiertas](../../discovery.md). Las dependencias de cierre adicionales declaradas en gate no impiden empezar mocks.

## Definition of Done

Aplicar íntegramente [DoD global](../../../CONTRIBUTING.md). Además:

- [ ] Los tres AC tienen evidencia enlazada y review de otra persona.
- [ ] Tests o validación documental descritos en Testing completados y limitaciones registradas.
- [ ] Se actualiza el informe correspondiente sin inventar resultados.
- [ ] No se reclaman funcionalidades fuera de Scope ni gates pendientes como cumplidos.

## Level

🟠 Advanced

## Labels

`level:advanced`, `area:devops`, `area:testing`, `type:feature`

## Size

M. Si supera una entrega revisable, dividir por AC manteniendo la historia de integración; no crear XL.

## Planning

Epic: EP-01. Priority propuesta: P1. Sin persona asignada. Backend: Veru/Víctor; frontend: Naimireth/María; ML: asignación individual pendiente de equipo.

---

<a id="us-29"></a>

# [US-29] Preparar repositorio PostgreSQL y migraciones

## User Story

Como equipo, quiero guardar predicciones con adapter intercambiable, para añadir historial sin acoplar inferencia.

## Context

Esta historia contribuye a EP-06 y satisface DB-01, DB-03 de [prediction-history](../../../openspec/changes/define-project/specs/prediction-history/spec.md). Depende de un contrato revisado y no autoriza implementar en esta fase documental.

## Scope

backend/app/adapters SQLAlchemy, puerto Null/SQL, migración predictions, constraints y TTL; driver opcional.

## Out of Scope

DB requisito de Essential y asumir SQLite equivalente a PostgreSQL.

## Acceptance Criteria

- [ ] AC1: NullRepo no conecta DB y SQLRepo escribe schema versionado con token hash.
- [ ] AC2: constraints/migraciones pasan PostgreSQL efímero y CRUD portable SQLite memory.
- [ ] AC3: fallo/timeout de guardado produce failed sin alterar señal ni acumular retries.

## Technical Notes

Respetar [diseño](../../../openspec/changes/define-project/design.md) y [contratos](../../../openspec/changes/define-project/contracts/README.md); no cambiar semántica ni límites sin revisar spec. Las rutas de Scope son futuras y no se crean ahora. La ampliación debe poder deshabilitarse conservando predicción Essential.

## Testing

RED repositorio portable, GREEN; suite postgres de migración/constraints/timezones y fallo conexión.

Registrar evidencia de cada AC; aplicar RED → GREEN → REFACTOR a código testeable. Tests deben fallar por comportamiento ausente, no por entorno roto.

## Dependencies

[US-16](#us-16), [US-27](#us-27)

Gate: Política OQ-07 antes de guardar datos reales. Ver [preguntas abiertas](../../discovery.md). Las dependencias de cierre adicionales declaradas en gate no impiden empezar mocks.

## Definition of Done

Aplicar íntegramente [DoD global](../../../CONTRIBUTING.md). Además:

- [ ] Los tres AC tienen evidencia enlazada y review de otra persona.
- [ ] Tests o validación documental descritos en Testing completados y limitaciones registradas.
- [ ] Se actualiza el informe correspondiente sin inventar resultados.
- [ ] No se reclaman funcionalidades fuera de Scope ni gates pendientes como cumplidos.

## Level

🔴 Expert

## Labels

`level:expert`, `area:database`, `area:backend`, `area:testing`, `type:research`

## Size

M. Si supera una entrega revisable, dividir por AC manteniendo la historia de integración; no crear XL.

## Planning

Epic: EP-06. Priority propuesta: P1. Sin persona asignada. Backend: Veru/Víctor; frontend: Naimireth/María; ML: asignación individual pendiente de equipo.

---

<a id="us-30"></a>

# [US-30] Guardar y consultar una predicción protegida

## User Story

Como moderador, quiero recuperar una predicción que he guardado, para revisar su resultado posteriormente.

## Context

Esta historia contribuye a EP-06 y satisface DB-01, DB-02 de [prediction-history](../../../openspec/changes/define-project/specs/prediction-history/spec.md). Depende de un contrato revisado y no autoriza implementar en esta fase documental.

## Scope

slice POST con persistence/token y GET protegido; UI aviso de guardado/fallo y recuperación por recurso; purga según política.

## Out of Scope

Listado público, cuentas multiusuario y texto guardado por defecto.

## Acceptance Criteria

- [ ] AC1: stored permite GET con token; token incorrecto/expirado 404 y ausente 401.
- [ ] AC2: DB caída mantiene POST 200 failed, GET 503 y UI explica ausencia de guardado.
- [ ] AC3: retención aprobada/purga verificada, token no aparece en logs/URL, lectura no repite token.

## Technical Notes

Respetar [diseño](../../../openspec/changes/define-project/design.md) y [contratos](../../../openspec/changes/define-project/contracts/README.md); no cambiar semántica ni límites sin revisar spec. Las rutas de Scope son futuras y no se crean ahora. La ampliación debe poder deshabilitarse conservando predicción Essential.

## Testing

RED autorización/expiry/status, GREEN; integración PostgreSQL y E2E UI de guardado/fallo accesible.

Registrar evidencia de cada AC; aplicar RED → GREEN → REFACTOR a código testeable. Tests deben fallar por comportamiento ausente, no por entorno roto.

## Dependencies

[US-17](#us-17), [US-29](#us-29)

Gate: OQ-07 cerrada. Ver [preguntas abiertas](../../discovery.md). Las dependencias de cierre adicionales declaradas en gate no impiden empezar mocks.

## Definition of Done

Aplicar íntegramente [DoD global](../../../CONTRIBUTING.md). Además:

- [ ] Los tres AC tienen evidencia enlazada y review de otra persona.
- [ ] Tests o validación documental descritos en Testing completados y limitaciones registradas.
- [ ] Se actualiza el informe correspondiente sin inventar resultados.
- [ ] No se reclaman funcionalidades fuera de Scope ni gates pendientes como cumplidos.

## Level

🔴 Expert

## Labels

`level:expert`, `area:frontend`, `area:backend`, `area:database`, `type:feature`

## Size

M. Si supera una entrega revisable, dividir por AC manteniendo la historia de integración; no crear XL.

## Planning

Epic: EP-06. Priority propuesta: P1. Sin persona asignada. Backend: Veru/Víctor; frontend: Naimireth/María; ML: asignación individual pendiente de equipo.

---

<a id="us-31"></a>

# [US-31] Evaluar transformer detrás del predictor común

## User Story

Como equipo ML, quiero comparar un transformer adecuado, para medir si su coste aporta valor.

## Context

Esta historia contribuye a EP-03 y satisface ML-07 de [model-lifecycle](../../../openspec/changes/define-project/specs/model-lifecycle/spec.md). Depende de un contrato revisado y no autoriza implementar en esta fase documental.

## Scope

dependencia opcional, modelo/licencia/idioma aprobados, experimento y adapter de inferencia si se selecciona.

## Out of Scope

Modificar frontend por algoritmo o descargar pesos en cada request.

## Acceptance Criteria

- [ ] AC1: selección OQ-06 documenta idioma/licencia/recursos y compara con clásico/red neuronal.
- [ ] AC2: contrato común, batch y score nullable pasan sin conocer arquitectura en UI.
- [ ] AC3: coste/calidad/latencia registrados; clásico sigue disponible; promoción respeta holdout nuevo cuando proceda.

## Technical Notes

Respetar [diseño](../../../openspec/changes/define-project/design.md) y [contratos](../../../openspec/changes/define-project/contracts/README.md); no cambiar semántica ni límites sin revisar spec. Las rutas de Scope son futuras y no se crean ahora. La ampliación debe poder deshabilitarse conservando predicción Essential.

## Testing

RED contrato adapter y límites/truncamiento, GREEN; evaluación reproducible con presupuesto.

Registrar evidencia de cada AC; aplicar RED → GREEN → REFACTOR a código testeable. Tests deben fallar por comportamiento ausente, no por entorno roto.

## Dependencies

[US-16](#us-16), [US-25](#us-25)

Gate: OQ-06. Ver [preguntas abiertas](../../discovery.md). Las dependencias de cierre adicionales declaradas en gate no impiden empezar mocks.

## Definition of Done

Aplicar íntegramente [DoD global](../../../CONTRIBUTING.md). Además:

- [ ] Los tres AC tienen evidencia enlazada y review de otra persona.
- [ ] Tests o validación documental descritos en Testing completados y limitaciones registradas.
- [ ] Se actualiza el informe correspondiente sin inventar resultados.
- [ ] No se reclaman funcionalidades fuera de Scope ni gates pendientes como cumplidos.

## Level

🔴 Expert

## Labels

`level:expert`, `area:ml`, `type:research`

## Size

M. Si supera una entrega revisable, dividir por AC manteniendo la historia de integración; no crear XL.

## Planning

Epic: EP-03. Priority propuesta: P1. Sin persona asignada. Backend: Veru/Víctor; frontend: Naimireth/María; ML: asignación individual pendiente de equipo.

---

<a id="us-32"></a>

# [US-32] Registrar experimentos con MLflow opcional

## User Story

Como experimentador, quiero tracking central con respaldo local, para comparar y recuperar runs sin perder trabajo.

## Context

Esta historia contribuye a EP-07 y satisface GO-03 de [green-observability](../../../openspec/changes/define-project/specs/green-observability/spec.md). Depende de un contrato revisado y no autoriza implementar en esta fase documental.

## Scope

backend/ml/training tracker local/MLflow; params, métricas, preprocessing/vectorizador/bundle, versión y estado.

## Out of Scope

MLflow dependencia de inferencia o reentrenar solo por fallo de logging.

## Acceptance Criteria

- [ ] AC1: run registra localmente y en MLflow cuando disponible todos los metadatos/artefactos previstos.
- [ ] AC2: caída/timeouts mantienen entrenamiento y manifest con tracking_failed.
- [ ] AC3: reenvío manual recupera registro sin entrenar otra vez ni duplicar run lógico.

## Technical Notes

Respetar [diseño](../../../openspec/changes/define-project/design.md) y [contratos](../../../openspec/changes/define-project/contracts/README.md); no cambiar semántica ni límites sin revisar spec. Las rutas de Scope son futuras y no se crean ahora. La ampliación debe poder deshabilitarse conservando predicción Essential.

## Testing

RED tracker fake que falla, GREEN; integración opt-in MLflow y prueba de import Essential sin librería.

Registrar evidencia de cada AC; aplicar RED → GREEN → REFACTOR a código testeable. Tests deben fallar por comportamiento ausente, no por entorno roto.

## Dependencies

[US-10](#us-10)

Gate: Ninguna adicional. Ver [preguntas abiertas](../../discovery.md). Las dependencias de cierre adicionales declaradas en gate no impiden empezar mocks.

## Definition of Done

Aplicar íntegramente [DoD global](../../../CONTRIBUTING.md). Además:

- [ ] Los tres AC tienen evidencia enlazada y review de otra persona.
- [ ] Tests o validación documental descritos en Testing completados y limitaciones registradas.
- [ ] Se actualiza el informe correspondiente sin inventar resultados.
- [ ] No se reclaman funcionalidades fuera de Scope ni gates pendientes como cumplidos.

## Level

🔴 Expert

## Labels

`level:expert`, `area:ml`, `area:devops`, `type:feature`

## Size

M. Si supera una entrega revisable, dividir por AC manteniendo la historia de integración; no crear XL.

## Planning

Epic: EP-07. Priority propuesta: P1. Sin persona asignada. Backend: Veru/Víctor; frontend: Naimireth/María; ML: asignación individual pendiente de equipo.

---

<a id="us-33"></a>

# [US-33] Demostrar Expert y degradación acumulada

## User Story

Como equipo, quiero verificar el producto con y sin ampliaciones, para demostrar Expert sin romper niveles anteriores.

## Context

Esta historia contribuye a EP-07 y satisface QA-04 de [quality-accessibility](../../../openspec/changes/define-project/specs/quality-accessibility/spec.md). Depende de un contrato revisado y no autoriza implementar en esta fase documental.

## Scope

matriz de smoke/E2E por perfil, fallos DB/MLflow/YouTube/modelo y accesibilidad final.

## Out of Scope

Ocultar gates ML fallidos mediante mocks.

## Acceptance Criteria

- [ ] AC1: evidencia de transformer, persistencia y tracking junto a niveles previos.
- [ ] AC2: DB/MLflow caídos no impiden predicción; bundle ausente sí produce 503 explicable.
- [ ] AC3: informes indican nivel realmente alcanzado y limitaciones; todos los flujos UI revisados.

## Technical Notes

Respetar [diseño](../../../openspec/changes/define-project/design.md) y [contratos](../../../openspec/changes/define-project/contracts/README.md); no cambiar semántica ni límites sin revisar spec. Las rutas de Scope son futuras y no se crean ahora. La ampliación debe poder deshabilitarse conservando predicción Essential.

## Testing

Fault injection acotada y suites acumuladas, asserts de status y disponibilidad; revisión de evidencias.

Registrar evidencia de cada AC; aplicar RED → GREEN → REFACTOR a código testeable. Tests deben fallar por comportamiento ausente, no por entorno roto.

## Dependencies

[US-28](#us-28), [US-30](#us-30), [US-31](#us-31), [US-32](#us-32)

Gate: Ninguna adicional. Ver [preguntas abiertas](../../discovery.md). Las dependencias de cierre adicionales declaradas en gate no impiden empezar mocks.

## Definition of Done

Aplicar íntegramente [DoD global](../../../CONTRIBUTING.md). Además:

- [ ] Los tres AC tienen evidencia enlazada y review de otra persona.
- [ ] Tests o validación documental descritos en Testing completados y limitaciones registradas.
- [ ] Se actualiza el informe correspondiente sin inventar resultados.
- [ ] No se reclaman funcionalidades fuera de Scope ni gates pendientes como cumplidos.

## Level

🔴 Expert

## Labels

`level:expert`, `area:testing`, `area:devops`, `type:feature`

## Size

M. Si supera una entrega revisable, dividir por AC manteniendo la historia de integración; no crear XL.

## Planning

Epic: EP-07. Priority propuesta: P1. Sin persona asignada. Backend: Veru/Víctor; frontend: Naimireth/María; ML: asignación individual pendiente de equipo.

---

<a id="us-34"></a>

# [US-34] Preparar presentación del nivel alcanzado

## User Story

Como equipo, quiero documentación y demo trazables, para explicar lo construido al profesor.

## Context

Esta historia contribuye a EP-01 y satisface PL-04 de [platform](../../../openspec/changes/define-project/specs/platform/spec.md). Depende de un contrato revisado y no autoriza implementar en esta fase documental.

## Scope

README real, informes separados, matriz de requisitos y guion; actualizar incrementalmente si se llega a otros niveles.

## Out of Scope

Afirmar implementadas capacidades pendientes o inventar métricas.

## Acceptance Criteria

- [ ] AC1: cada requisito reclamado enlaza spec/US/evidencia real.
- [ ] AC2: se demuestra producto del nivel alcanzado y se declaran límites/riesgos/preguntas abiertas.
- [ ] AC3: revisión cruzada confirma reproducción y ausencia de secretos/datos indebidos.

## Technical Notes

Respetar [diseño](../../../openspec/changes/define-project/design.md) y [contratos](../../../openspec/changes/define-project/contracts/README.md); no cambiar semántica ni límites sin revisar spec. Las rutas de Scope son futuras y no se crean ahora. No introducir dependencia de capacidades Medium/Advanced/Expert.

## Testing

Revisión documental y ensayo de comandos/demo; TDD no aplica a redacción, sí a cambios de lógica fuera de esta historia.

Registrar evidencia de cada AC; aplicar RED → GREEN → REFACTOR a código testeable. Tests deben fallar por comportamiento ausente, no por entorno roto.

## Dependencies

[US-18](#us-18)

Gate: Ninguna adicional. Ver [preguntas abiertas](../../discovery.md). Las dependencias de cierre adicionales declaradas en gate no impiden empezar mocks.

## Definition of Done

Aplicar íntegramente [DoD global](../../../CONTRIBUTING.md). Además:

- [ ] Los tres AC tienen evidencia enlazada y review de otra persona.
- [ ] Tests o validación documental descritos en Testing completados y limitaciones registradas.
- [ ] Se actualiza el informe correspondiente sin inventar resultados.
- [ ] No se reclaman funcionalidades fuera de Scope ni gates pendientes como cumplidos.

## Level

🟢 Essential

## Labels

`level:essential`, `area:docs`, `type:docs`

## Size

S. Si supera una entrega revisable, dividir por AC manteniendo la historia de integración; no crear XL.

## Planning

Epic: EP-01. Priority propuesta: P1. Sin persona asignada. Backend: Veru/Víctor; frontend: Naimireth/María; ML: asignación individual pendiente de equipo.
