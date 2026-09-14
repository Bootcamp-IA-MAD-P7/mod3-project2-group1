# Tasks — futuras, no ejecutadas

La revisión documental no equivale a implementación. Extraer cada slice a su change antes de ejecutar, retirando su delta del maestro. No marcar tareas por haber escrito el plan.

## 1. Entorno y entrega reproducible

- [ ] 1.1 [US-01](../../../docs/planning/stories/US-01.md): Acordar contratos y fixtures de los slices; verificar sus AC mediante Validación de schemas/fixtures y revisión conjunta; al crear handlers de mocks, RED de contratos antes de GREEN.
- [ ] 1.2 [US-02](../../../docs/planning/stories/US-02.md): Preparar entorno reproducible y CI mínima; verificar sus AC mediante Smoke de instalación limpia, validación de configuración con RED para faltantes condicionales y secretos; CI sin credenciales externas.
- [ ] 1.3 [US-27](../../../docs/planning/stories/US-27.md): Empaquetar servicios y PostgreSQL con Docker; verificar sus AC mediante Smoke builds/health/predicción con bundle montado; revisión env/secrets y compose config.
- [ ] 1.4 [US-28](../../../docs/planning/stories/US-28.md): Publicar demo Advanced y validar operación; verificar sus AC mediante Smoke remoto y E2E críticos, tests de límites/HTML, revisión de configuración; despliegue solo en fase autorizada.
- [ ] 1.5 [US-34](../../../docs/planning/stories/US-34.md): Preparar presentación del nivel alcanzado; verificar sus AC mediante Revisión documental y ensayo de comandos/demo; TDD no aplica a redacción, sí a cambios de lógica fuera de esta historia.

## 2. Datos y NLP sin leakage

- [ ] 2.1 [US-03](../../../docs/planning/stories/US-03.md): Registrar dataset y semántica de etiquetas; verificar sus AC mediante Revisión humana y comprobaciones de esquema/hash con RED si se implementa validador; no publicar datos sensibles.
- [ ] 2.2 [US-04](../../../docs/planning/stories/US-04.md): Documentar EDA de development; verificar sus AC mediante Comprobar entrada de notebook limitada a development; validar funciones agregadoras con tests y revisar conclusiones.
- [ ] 2.3 [US-05](../../../docs/planning/stories/US-05.md): Congelar particiones y protocolo comparable; verificar sus AC mediante RED con grupos duplicados, conflicto de labels y clase pequeña; GREEN de split; verificar intersecciones vacías y repetibilidad.
- [ ] 2.4 [US-06](../../../docs/planning/stories/US-06.md): Comparar limpieza y normalización textual; verificar sus AC mediante RED de regex y tokenización con entradas límite; GREEN/REFACTOR; pruebas de determinismo y paridad entrenamiento/inferencia.
- [ ] 2.5 [US-07](../../../docs/planning/stories/US-07.md): Comparar BoW, TF-IDF y n-gramas; verificar sus AC mediante RED con token exclusivo y transform sin fit; GREEN pipeline; tests sparse y serialización mínima.
- [ ] 2.6 [US-08](../../../docs/planning/stories/US-08.md): Evaluar augmentation textual segura; verificar sus AC mediante RED de pertenencia de padres/folds; GREEN; prueba determinista y revisión humana de muestras sintéticas.

## 3. Evidencia y evolución del modelo

- [ ] 3.1 [US-10](../../../docs/planning/stories/US-10.md): Establecer baseline y evaluador común; verificar sus AC mediante RED con matrices pequeñas conocidas, clase sin predicciones y gap exacto; GREEN evaluador y baseline.
- [ ] 3.2 [US-11](../../../docs/planning/stories/US-11.md): Evaluar individualmente Multinomial Naive Bayes; verificar sus AC mediante RED de configuración/reproducibilidad del entrenamiento y evaluador; GREEN run limitado; inspección de errores. 
- [ ] 3.3 [US-12](../../../docs/planning/stories/US-12.md): Evaluar individualmente Logistic Regression; verificar sus AC mediante RED de configuración/reproducibilidad del entrenamiento y evaluador; GREEN run limitado; inspección de errores. 
- [ ] 3.4 [US-13](../../../docs/planning/stories/US-13.md): Evaluar individualmente LinearSVC; verificar sus AC mediante RED de configuración/reproducibilidad del entrenamiento y evaluador; GREEN run limitado; inspección de errores. Verificar que margen SVC no se reporta como probabilidad.
- [ ] 3.5 [US-14](../../../docs/planning/stories/US-14.md): Evaluar individualmente cuarto clásico por confirmar; verificar sus AC mediante RED de configuración/reproducibilidad del entrenamiento y evaluador; GREEN run limitado; inspección de errores. 
- [ ] 3.6 [US-15](../../../docs/planning/stories/US-15.md): Seleccionar y evaluar candidato congelado; verificar sus AC mediante RED del gate en 4.99/5/5.01 pp y métricas insuficientes; GREEN; auditoría de acceso test/manifest.
- [ ] 3.7 [US-19](../../../docs/planning/stories/US-19.md): Optimizar modelos con presupuesto acotado; verificar sus AC mediante RED de presupuesto, acceso a splits y seed; GREEN búsqueda acotada con pequeño fixture antes de dataset real.
- [ ] 3.8 [US-23](../../../docs/planning/stories/US-23.md): Comparar ensemble con clásico; verificar sus AC mediante RED de combinación/orden/contrato, GREEN; run reproducible y auditoría de folds.
- [ ] 3.9 [US-25](../../../docs/planning/stories/US-25.md): Comparar LSTM o RNN apropiada; verificar sus AC mediante RED de shapes/padding/adapter si aplica; GREEN; experimento limitado reproducible, no test de exactitud entrenada en CI.
- [ ] 3.10 [US-31](../../../docs/planning/stories/US-31.md): Evaluar transformer detrás del predictor común; verificar sus AC mediante RED contrato adapter y límites/truncamiento, GREEN; evaluación reproducible con presupuesto.

## 4. Moderación manual asistida

- [ ] 4.1 [US-09](../../../docs/planning/stories/US-09.md): Entregar conectividad y API manual con predictor fake; verificar sus AC mediante RED contratos/servicio; GREEN rutas; integración ASGI fake y smoke UI/backend.
- [ ] 4.2 [US-16](../../../docs/planning/stories/US-16.md): Empaquetar e integrar inferencia real; verificar sus AC mediante RED de adapter/carga/checksum/paridad; GREEN; integración con artefacto pequeño confiable y candidato aprobado.
- [ ] 4.3 [US-17](../../../docs/planning/stories/US-17.md): Construir interacción manual accesible con mocks; verificar sus AC mediante RED Testing Library para interacción/error/sin score; GREEN UI; revisión teclado/foco y anuncio aria-live.
- [ ] 4.4 [US-18](../../../docs/planning/stories/US-18.md): Demostrar el producto Essential integrado; verificar sus AC mediante E2E Playwright con modelo real, integración de fallo del modelo y revisión manual de teclado.

## 5. Moderación por vídeo

- [ ] 5.1 [US-20](../../../docs/planning/stories/US-20.md): Obtener comentarios desde URLs admitidas; verificar sus AC mediante RED tabla parser incluyendo dominio sufijado, query repetida e ID inválido; GREEN; HTTP fakes con múltiples páginas, 403/404/timeout.
- [ ] 5.2 [US-21](../../../docs/planning/stories/US-21.md): Procesar jobs de vídeo y consultar resultados; verificar sus AC mediante RED state machine, límites y acceso; GREEN; integración batch/cuota parcial, reloj fake para TTL y reinicio.
- [ ] 5.3 [US-22](../../../docs/planning/stories/US-22.md): Entregar dashboard de vídeo integrado; verificar sus AC mediante RED componentes/estados MSW; GREEN UI; E2E con backend real y YouTube simulado, revisión accesible.
- [ ] 5.4 [US-26](../../../docs/planning/stories/US-26.md): Seguir y detener análisis periódico de vídeo; verificar sus AC mediante RED con reloj fake para límites/stop/solapamiento, GREEN; integración y E2E monitor accesible.

## 6. Historial protegido

- [ ] 6.1 [US-29](../../../docs/planning/stories/US-29.md): Preparar repositorio PostgreSQL y migraciones; verificar sus AC mediante RED repositorio portable, GREEN; suite postgres de migración/constraints/timezones y fallo conexión.
- [ ] 6.2 [US-30](../../../docs/planning/stories/US-30.md): Guardar y consultar una predicción protegida; verificar sus AC mediante RED autorización/expiry/status, GREEN; integración PostgreSQL y E2E UI de guardado/fallo accesible.

## 7. Calidad y operación medible

- [ ] 7.1 [US-24](../../../docs/planning/stories/US-24.md): Ampliar pruebas de regresión y validar nivel Medium; verificar sus AC mediante Ejecutar regresión acumulada y revisar que tests significativos cubren AC; no duplicar unitarios triviales.
- [ ] 7.2 [US-32](../../../docs/planning/stories/US-32.md): Registrar experimentos con MLflow opcional; verificar sus AC mediante RED tracker fake que falla, GREEN; integración opt-in MLflow y prueba de import Essential sin librería.
- [ ] 7.3 [US-33](../../../docs/planning/stories/US-33.md): Demostrar Expert y degradación acumulada; verificar sus AC mediante Fault injection acotada y suites acumuladas, asserts de status y disponibilidad; revisión de evidencias.
