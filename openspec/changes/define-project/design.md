# Arquitectura propuesta

## Context

Ver [assessment y OQ](../../../docs/discovery.md). Las decisiones del briefing son vinculantes; los defaults de este diseño son propuestas revisables antes de implementación. No se dispone del dataset. El problema es detección de contenido potencialmente odioso para apoyo humano, no análisis de sentimiento positivo/negativo ni juicio sobre usuarios.

## Goals / Non-Goals

Entregar un producto ejecutable al cerrar cada nivel; permitir UI con mocks y API con ML fake; separar experimentación de inferencia y medir calidad/coste. Se excluyen microservicio ML, moderación automática, streaming distribuido, Kubernetes, registro de modelos complejo y dependencias pesadas anticipadas.

## Decisions

### D-01 — Monolito modular de backend y frontend independiente

Dos unidades desplegables, comunicación HTTP solo frontend/backend. FastAPI llama directamente a `backend/ml/inference` mediante interfaz Python. Un proceso carga una vez el artefacto al arrancar y reutiliza el pipeline; varios workers implican copias de memoria y deben justificarse. Entrenamiento no se importa desde handlers. Alternativa de microservicio ML rechazada por complejidad de red/versiones sin beneficio demostrado.

```mermaid
flowchart LR
    U[Moderador] --> F[Frontend React]
    F -->|HTTP API v1| A
    subgraph B[Backend: un servicio desplegable]
      A[FastAPI: validación y rutas] --> S[Servicios de aplicación]
      S --> I[Interfaz de inferencia Python]
      I --> C[Pipeline clásico local]
      I -. Advanced .-> N[LSTM/RNN]
      I -. Expert .-> T[Transformer]
      S --> R[Puerto de predicciones]
      R --> Z[Null repository Essential]
      R -. Expert .-> P[Repositorio SQLAlchemy]
      S -. Medium .-> J[Jobs acotados en memoria]
      J --> Y[Adaptador YouTube]
      J --> I
      J -. Advanced .-> M[Seguimiento periódico]
      X[Entrenamiento offline] --> C
      X --> L[Tracking local]
      X -. Expert .-> ML[Adaptador MLflow]
    end
    Y -. API externa .-> YT[YouTube]
    P -.-> DB[(PostgreSQL)]
    ML -.-> MF[MLflow opcional]
```

Los trazos opcionales representan ampliaciones; ningún arranque Essential los importa ni verifica. SQLAlchemy está acordado para persistencia pero su adapter y driver se activan solo al configurar historial. No se usa HTTP entre backend y ML.

### D-02 — Estructura futura, todavía no creada

```text
frontend/
  package.json, package-lock.json, Dockerfile
  src/app/                     # composición y rutas
  src/features/manual-analysis/ # UI, tests y estados por slice
  src/features/video-analysis/
  src/features/history/
  src/shared/api/               # cliente de contrato, sin algoritmos
  src/shared/ui/                # shadcn y semántica accesible
  src/mocks/                   # fixtures derivados del contrato
backend/
  pyproject.toml, uv.lock, Dockerfile
  app/api/v1/                  # transporte HTTP y schemas Pydantic
  app/services/                # casos de uso, composición por inyección
  app/ports/                   # protocolos repositorios/jobs/YouTube
  app/adapters/                # SQLAlchemy, YouTube, stores en memoria
  app/core/                    # configuración, errores, logs
  ml/preprocessing/            # transformaciones compartidas versionadas
  ml/training/                 # CLI offline, sin imports desde app
  ml/evaluation/               # métricas, comparación, controles
  ml/inference/                # contrato Python y adaptadores de modelos
  ml/artifacts/                # manifests pequeños; binarios ignorados
  tests/unit/, tests/integration/
data/raw/, data/splits/, data/processed/ # datos ignorados; manifiestos versionados
notebooks/                     # EDA/experimentos reproducibles, no producción
tests/e2e/
docs/reports/
openspec/
Makefile, compose.yaml, .env.example # tareas futuras
```

Organización por feature en UI; backend con pocos límites explícitos. No crear una clase abstracta para cada función. Las historias señalan rutas; pueden adaptar nombres mediante revisión sin cambiar comportamiento. Frontend desconoce algoritmo, vectorizador, umbral interno y formato del artefacto. Solo muestra señal, advertencia y versión opaca si procede.

### D-03 — ML reproducible y sin leakage

US-03 fija procedencia, licencia, hash de datos y IDs estables, clases originales y mapeo aprobado. Dataset elegido y estadísticas **pendientes**. Antes de split, identificar duplicados exactos y grupos con reglas deterministas sin fit; duplicados cercanos requieren política aprobada sin optimizarla contra test. Agrupar por origen/autor/vídeo si existe riesgo de correlación. Conflictos de etiquetas no se resuelven por votación del test: cuarentena trazable. Ningún documento derivado de test informa selección.

Propuesta tras validar tamaños: test fijo 20%, resto development 80%, split estratificado y agrupado si procede, seed 42; si hay grupos/orden temporal prevalece independencia sobre porcentajes exactos. El custodio genera IDs y hashes; guarda test aislado. EDA para decisiones se realiza en development; auditoría inicial global solo de integridad/permiso para establecer particiones, sin explorar texto/etiquetas del test para seleccionar. Si hay clases pequeñas, registrar un protocolo alternativo antes de experimentar.

Comparación principal: 5 folds estratificados o agrupados sobre development, mismos IDs por fold, preprocessing base fijo y misma TF-IDF. Toda transformación aprendida, selección de vocabulario, balanceo, calibración y augmentation se ajusta **dentro del train de cada fold**. Todos reciben igual presupuesto y mismos seeds cuando proceda. Evaluar train original sin sintéticos y validación intacta. Variaciones BoW/TF-IDF/ngramas, stopwords, stemming, lematización se reportan aparte; no confundir ablation distinta con comparación controlada de algoritmo.

Baseline Dummy `most_frequent`; puede añadirse `stratified` con seed como referencia adicional. Cuatro candidatos provisionales: MultinomialNB, LogisticRegression, LinearSVC, SGDClassifier(log_loss). Confirmar cuarto con dimensionalidad/desbalance real (OQ-05), sin afirmar adecuación observada. Cada miembro entrena un candidato, aún sin asignación nominal. Desde Essential cada persona incluye ajuste básico de hiperparámetros mediante pequeña rejilla predefinida, con igual presupuesto y solo folds de development. Optuna en Medium amplía la optimización, no pospone un requisito obligatorio del briefing.

Regex para URLs/menciones/espacios, tokenización, variantes de stopwords preservando negación cuando convenga, stemming y lematización se implementan y miden separadamente. No aplicar stemming y lematización secuencialmente por obligación. BoW, TF-IDF y n-gramas tienen experimentos identificables. Selección final por evidencia, no por incluir todas las transformaciones.

Augmentation: únicamente muestras del train del fold con `synthetic_id,parent_id,technique,seed`; padre y derivados en mismo fold; nunca validation/test ni antes de split. Synonym replacement con control semántico recomendado como ensayo inicial; back translation opt-in por coste/idioma. Revisar que no cambie significado de odio/negación y comparar con control sin augmentation.

US-08 es obligatoria para completar Essential, pero no bloquea US-15 ni US-16: puede realizarse como ablation posterior sobre development. No modifica retrospectivamente el candidato congelado ni reutiliza su test; una eventual promoción posterior sigue el protocolo de nuevo holdout independiente. Su evidencia es gate de cierre de US-18, no de inicio de integración/E2E.

### D-04 — Calidad, gap y puerta final

Métrica principal propuesta **macro-F1** en [0,1], junto con precision/recall/F1 por clase, accuracy descriptiva, matriz de confusión con orden fijo `[non_hate,hate]`, soporte y FN/FP. Gap por fold = `100 * abs(F1_macro_train_original - F1_macro_validation)`; reportar cada fold y media, no esconder casos tras una media. Para selección, propuesta exigir gap medio <5 pp e investigar cualquier fold ≥5; elegir con macro-F1 de validación, mínimos OQ-03 y coste. Empates dentro de 1 pp se resuelven por recall de odio y después menor coste, sin mirar test.

Tras elegir pipeline/hiperparámetros/umbral, congelar manifest y reentrenar en todo development. Medir `F1_macro_train` sobre development original, no sintético. Abrir test **una vez** para evaluación final: `gap_final_pp = 100 * abs(F1_macro_train - F1_macro_test)`, exigencia estricta `<5`, no `<=5`. Ejemplo puramente aritmético: .84 y .80 ⇒ 4 pp; .85 y .80 ⇒ 5 pp y falla. Además mínimos de calidad y mejora sobre Dummy definidos antes de entrenar. La condición del briefing no garantiza buen modelo por sí sola.

Si falla test, informar que no se alcanza gate; no retocar con test ni repetir hasta aprobar. Un nuevo ciclo necesita un nuevo holdout independiente y protocolo revisado, o declarar limitación. No se prometen métricas inexistentes. Umbral de clasificación y eventual calibración se eligen solo con folds de development; un margen LinearSVC nunca se presenta como probabilidad.

### D-05 — Contratos primero y artefactos opacos

Ver [contratos](contracts/README.md). `/api/v1` mantiene semántica compatible entre modelos. Entrada única, salida binaria propuesta condicionada a OQ-02. `score` nullable: solo probabilidad calibrada de **hate**, no confianza de etiqueta ni margen bruto. Essential permite null; UI no exige porcentaje. `model_version` es opaca y no obliga a mostrar algoritmo.

Bundle indivisible versionado: pipeline completo con preprocessing/vectorizador/modelo, `metadata.json`, hashes. Metadata: versión artefacto y schema, dataset/hash, split/hash, git SHA, lock/runtime, idioma/taxonomía, preprocessing, algoritmo, fecha UTC, métricas de desarrollo/final, umbral/calibración y checksum. Cargar únicamente artefactos propios confiables; formatos pickle/joblib no aceptan uploads del usuario. Validar checksum, schema y compatibilidad al arrancar. Incompatibilidad implica readiness 503, nunca Dummy silencioso en producción. Rollback selecciona bundle anterior completo. No registry obligatorio.

### D-06 — Jobs Medium y seguimiento Advanced sin DB obligatoria

Análisis de vídeo asíncrono en el mismo backend, cola acotada en memoria (propuesta 2 ejecuciones y 10 pendientes), un worker de aplicación para este perfil. `202` con ID y token de acceso opaco; polling y páginas de resultados. TTL propuesto 60 min, resultado y token se pierden al reiniciar; UI lo informa. No prometer durabilidad ni progreso porcentual exacto: conteos conocidos, estados y razón de terminación. Estado parcial por cuota/error con resultados previos; reintentos limitados a 2 con backoff/jitter en errores transitorios; nunca reintentar indefinidamente errores permanentes.

Solo parsear hosts admitidos (`youtube.com`, `www.youtube.com`, `m.youtube.com`, `youtu.be`) y video ID validado de 11 caracteres `[A-Za-z0-9_-]`. Formas propuestas `/watch?v=`, `/shorts/`, `youtu.be/<id>`. No descargar la URL suministrada ni seguir redirects: usar ID con API oficial. Comentarios principales, sin respuestas en primera versión; sin comentarios es resultado vacío válido. Paginación mediante token oficial hasta límite 500 o fin; deduplicar por comment ID. Mostrar truncamiento y cobertura. Cuota y errores son mapeados, no cuerpos externos crudos. Credenciales solo backend.

Seguimiento Advanced usa polling acotado, no tiempo real: intervalo mínimo propuesto 300 s y hasta 24 h; deduplicación por ID; detener/cancelar al pedirlo o agotar ventana. No se garantiza detectar ediciones, borrados o todos los mensajes entre polls. No requiere WebSockets, scheduler externo ni DB. Repositorio durable de jobs es ampliación futura si se requieren réplicas; **no** se promete escalado horizontal del store en memoria.

### D-07 — Persistencia y privacidad progresiva

Essential usa NullPredictionRepository. Predicción correcta devuelve 200 aunque el adapter SQL falle; `persistence.status` será `failed`, `disabled` o `stored`, sin ocultar pérdida ni prometer recuperación. Deadline propuesto 500 ms para guardar, sin cola durable ni garantía exactly-once; cada solicitud produce su propio prediction_id y no se reintenta POST automáticamente. Fallo queda en métrica/log sin texto ni secreto.

Expert: PostgreSQL mediante SQLAlchemy y migraciones versionadas. Tabla `predictions`: UUID PK, created_at UTC, label, score nullable, model_version, origin (`manual`/`youtube`), analysis_id nullable, hash de token de acceso, expires_at, y texto opcional protegido según OQ-07; constraints de enum/rango, índice created_at y expiry. No FK hacia jobs volátiles. Guardar texto desactivado por defecto; no guardar author/channel ID. Endpoint de lectura requiere token de recurso en header; el token no se almacena en claro, no aparece en query/logs ni URLs. ID no sustituye autorización. Para demo sin usuarios basta este acceso por capacidad; auth multiusuario fuera del alcance inicial. Retención/aprobación necesarias antes de datos reales. DB caída bloquea lectura histórica con 503, no predicción.

### D-08 — Tracking y Green AI

Tracker local (JSON/manifests) es baseline offline. Adapter MLflow Expert registra parámetros, dataset/split, versiones, métricas y bundle. Timeout y fallo del servidor no abortan entrenamiento ni carga del modelo; mantener manifest local y estado `tracking_failed`, sincronización manual opt-in. MLflow no participa en ruta de inferencia.

Propuesta de presupuesto inicial comparable: tuning máximo 20 trials o 30 min por candidato, lo que ocurra antes; mismo hardware y folds; registrar tiempo, memoria pico, tamaño del bundle, CPU/GPU y seeds. Reutilizar cache solo si su clave incluye dataset/split/fold/preprocessing para no cruzar folds. No repetir runs con misma configuración salvo variabilidad justificada. Inference batch en vídeo, carga única por proceso y límite de longitud. Deep Learning/transformer requieren comparación coste/calidad documentada, no sustituyen clásico por prestigio. Medición energética estimada solo si metodología disponible; no inventar CO2.

### D-09 — Configuración y ejecución futura

Configuración backend Pydantic Settings propuesta desde entorno; `.env` solo local, nunca secretos en Git. Único `.env.example` raíz futuro documenta variables; Compose inyecta solo las que necesita cada servicio. Frontend recibe únicamente variables públicas `VITE_*`; su URL es de navegador, no `http://backend:8000` interno de Docker. Validación condicional: faltar DATABASE_URL no bloquea Essential; faltar MODEL_PATH válido sí bloquea readiness, no liveness. Faltar key solo deshabilita vídeo.

| Variable propuesta | Uso / default seguro |
|---|---|
| APP_ENV | `development`; producción desactiva debug |
| MODEL_PATH | ruta local a bundle aprobado; sin default que simule modelo |
| PERSISTENCE_ENABLED | false; activa adapter al tener configuración válida |
| DATABASE_URL | solo backend; ejemplo documental `postgresql+psycopg://app:CHANGE_ME@postgres:5432/moderation` |
| YOUTUBE_ENABLED / YOUTUBE_API_KEY | false / vacío; API key nunca frontend |
| MLFLOW_ENABLED / MLFLOW_TRACKING_URI | false / vacío; solo entrenamiento |
| VITE_API_BASE_URL | `http://localhost:8000/api/v1` en navegador local |
| CORS_ORIGINS | lista explícita `http://localhost:5173`; restringir al publicar |
| JOB_TTL_SECONDS / MAX_VIDEO_COMMENTS | 3600 / 500 propuestos |
| STORE_TEXT / RETENTION_DAYS | false / pendiente de OQ-07 antes de activar |
| LOG_LEVEL | INFO; sin textos, tokens ni keys |

Dockerfiles independientes multistage, backend sin entrenamiento en build, no bajar modelos ocultamente al arrancar. Compose base frontend/backend, perfil `database` añade imagen oficial PostgreSQL con versión fijada y volumen; `make docker-up-full` activa ese perfil. Sin `depends_on: postgres` obligatorio para backend Essential. Imagen ML separada excluida. Despliegue público HTTPS, CORS allowlist, rate/body limits, artefacto verificado y health; secrets del proveedor. Frontend se despliega separado y se configura su base URL de build. Provider pendiente. Usar DB PostgreSQL también en desarrollo del perfil Expert, no SQLite como reemplazo habitual.

| Make target futuro | Delegación simple / resultado |
|---|---|
| help | enumera comandos, requisitos y equivalentes para PowerShell sin make |
| setup | `uv sync` backend y `npm ci` frontend con locks; no descarga datos/modelos |
| dev-backend / dev-frontend | uvicorn en reload / Vite, terminales separadas |
| dev | documenta/abre ambos con herramienta de procesos mínima; no ocultar logs |
| start / stop | aliases documentados de docker-up / docker-down |
| test | test-backend + test-frontend; sin live APIs |
| test-backend / test-frontend | pytest / script npm de tests |
| test-e2e / test-postgres | suites separadas con entorno explícito |
| lint / format | Ruff backend y ESLint/Prettier frontend propuestos |
| docker-up / docker-down | compose up --build / down, nunca `down -v` implícito |
| docker-up-full | compose --profile database up --build |

Son contratos de tooling, no comandos disponibles ahora. Versiones/locks se fijan al implementar US-02; no añadir torch/transformers/MLflow/Optuna al core antes de su historia.

### D-10 — UI, seguridad y pruebas

UI por slices y un cliente HTTP tipado; MSW utiliza OpenAPI y fixtures. Estado manual: idle/invalid/loading/success/error; botón evita doble envío, conserva texto ante fallo y permite retry explícito. Renderizar texto como texto, nunca HTML de comentarios. Mensaje: «Señal de posible contenido de odio; requiere revisión humana». Para non_hate: «No se detectó señal; puede haber errores». score null oculta porcentaje sin esconder resultado.

Semántica, label visible, errores vinculados, aria-live polite en progreso/resultado, foco lógico tras validación, teclado completo, contraste propuesto 4.5:1 texto normal/3:1 grande, icono+texto y color, no scroll horizontal a 320 CSS px, zoom 200%. Tests automáticos no sustituyen revisión manual de teclado/foco/lector. Propuesta objetivo WCAG AA; no afirmar certificación. Accesibilidad bloquea cierre de historias UI.

Límites propuestos: 5.000 code points por comentario, JSON 32 KiB, timeout inferencia 10 s, sin logs de texto. Rate limit público propuesto 30 predicciones/min por IP y 5 jobs/min por IP, refinado con carga; tokens de recurso en header, TLS y no listado público de jobs/predicciones. Errores estandarizados sin stack trace. Liveness 200 si proceso responde; readiness 503 sin modelo compatible; capacidades opcionales fallidas aparecen deshabilitadas sin tumbar la esencial.

## Level architecture

| Componente | Essential | Medium | Advanced | Expert |
|---|---|---|---|---|
| React + FastAPI | entrada manual, health, mocks | vídeo y resultados paginados | seguimiento + acceso público | consulta privada de resultado guardado |
| ML local | Dummy comparación + cuatro clásicos; candidato aprobado | ensemble y Optuna | LSTM/RNN comparada | transformer intercambiable |
| Datos | EDA, regex, stemming, lemma, stopwords, BoW/TF-IDF/ngramas, augmentation train | mismo protocolo | mismo holdout/ciclo controlado | mismo protocolo y manifiestos |
| Calidad | TDD, integración/E2E mínimos, gap final <5 pp | amplía suite vídeo/ensemble | E2E seguimiento/publicación | persistencia/tracking/fallos |
| YouTube | ausente | adapter, jobs volátiles | polling acotado | opcional igual |
| PostgreSQL | no requerido | no requerido para jobs | imagen prevista en Compose; perfil opcional | historial activable |
| Docker / hosting | ejecución local sin Docker | local | imágenes independientes + despliegue | incorpora DB opcional |
| Tracking | informes/manifests locales | igual | coste neuronal | MLflow adapter con fallback local |

Para demostrar independencia, US-18 ejecuta perfil Essential sin variables/paquetes/servicios opcionales. US-22 repite Medium sin DB; US-28 demuestra Advanced sin MLflow/transformer; US-33 apaga DB y MLflow en Expert y mantiene 200 en predicción válida. Desactivar capacidades oculta controles correspondientes e informa motivos; no simula éxitos.

## Risks / Trade-offs

Datos desconocidos → gates OQ-01/02 y cuarto candidato provisional. Jobs volátiles → límites/TTL explícitos, una instancia y errores recuperables. Gap exigente → informar fallo real en vez de optimizar con test. Contrato binario puede requerir revisión → aprobación antes de ML integrado. Un backend sirve entrenamiento offline e inferencia, pero en procesos/comandos separados → evitar que dependencias experimentales entren al runtime base. Tokens por recurso simplifican demo → no equivalen a plataforma multiusuario.

## Migration Plan

Primero revisar este plan en `dev` real. Implementar por slices y promover specs solo con evidencia. Habilitar flags opcionales después de tests; rollback desactiva flag o restaura imagen/bundle anteriores. Migraciones DB se prueban en PostgreSQL y conservan backup antes de cambios destructivos futuros; no se ejecuta ninguna ahora. Frontend/back despliegues separados se verifican con contrato v1 compatible.

## Open Questions

Fuente única: [discovery](../../../docs/discovery.md). No declarar lista para implementación real una historia cuyo gate siga abierto. Las historias de investigación cierran las preguntas que dependen de datos; contratos de mocks pueden revisarse ahora.
