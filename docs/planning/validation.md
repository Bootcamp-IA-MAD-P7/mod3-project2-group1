# Revisión final — PASO 14

Fecha: 2026-09-14. Entrega documental para revisión; no implementación de producto. Assessment greenfield aceptado según confirmación del usuario.

## Comprobaciones ejecutadas

1. **CLI oficial OpenSpec 1.13.0**: `openspec validate define-project --strict` desde la raíz del paquete. Resultado real: `Change 'define-project' is valid`, exit code 0. Ejecutado mediante `npm exec --yes --package=@fission-ai/openspec@1.13.0 -- openspec validate define-project --strict`; descarga temporal de herramienta, sin dependencia de producto. Se desactivó telemetría. El error inicial de certificado se resolvió usando certificados del sistema; no se desactivó TLS.
2. **Validador local reproducible**: `node tools/validate-planning.cjs`. Comprueba enlaces Markdown locales, secciones de historias, existencia de specs/US, requisitos normativos con escenarios, grafo incluyendo gates de cierre, ausencia de XL y de dependencias Essential hacia niveles superiores, `$ref` JSON y fixtures. Valida únicamente el subconjunto JSON Schema usado por los ejemplos, no sustituye un validador OpenAPI completo ni tests Pydantic futuros.
3. **Revisión semántica manual** de arquitectura, contratos, niveles, privacidad, protocolo ML, paralelización y cobertura del briefing. Se corrigió el ajuste básico de hiperparámetros para que exista desde Essential, además de Optuna posterior.

Inventario: **9 specs de dominio, 35 requisitos y 37 escenarios, 7 épicas, 34 historias, 9 paths HTTP (10 operaciones), 10 fixtures sintéticos**. Todas las historias incluyen AC, Testing, dependencias, DoD, nivel, labels y tamaño S/M. Resultado del chequeo local: **PASS, 690 enlaces locales comprobados, 0 ciclos, 0 fallos**, incluyendo la recopilación de historias. El chequeo incluye límites negativos de requests y coherencia score/score_kind. Dummy precede a las comparaciones NLP/features para que estas puedan usar métricas comunes sin una dependencia circular.

Revalidación tras ajustes aprobados: OpenSpec 1.13.0 `validate define-project --strict` válido (exit 0) y comprobaciones locales PASS. US-08 deja de ser dependencia de US-15/16 y conserva su obligatoriedad como gate de cierre de US-18; la ablation posterior usa solo development, sin alterar el candidato congelado ni reutilizar test. La fase final pasa a «Presentación y cierre»; calidad, seguridad, accesibilidad y hardening continúan durante todas las fases.

## Auditoría requerida

Última revalidación tras revisión final: título US-24 actualizado sin cambiar su contenido; US-28 inicia tras US-27 (que exige US-18) y conserva US-24/25/26 como gates de cierre, además de US-27 y sus propios AC. OpenSpec 1.13.0 `--strict`: válido, exit 0. Validación local, enlaces y ciclos: PASS. Comprobaciones específicas: dependencias de inicio/cierre de US-28 correctas, 34 historias íntegramente sincronizadas en la recopilación, anclas internas válidas y ninguna referencia al título antiguo.

| Comprobación | Resultado / evidencia | Limitación |
|---|---|---|
| Requisitos del briefing sin cubrir | Matriz de trazabilidad general y tabla explícita de técnicas NLP, niveles y evidencias | Cobertura especificada, todavía no ejecutada |
| Historias sin spec | 0 en índice de planificación | El contenido se revisa con contexto/diseño |
| Specs sin historias | 0; todos los requisitos tienen US asociadas | No convierte una historia en implementada |
| Dependencias circulares | 0, incluyendo US-22 → US-21, US-18 → US-08 y US-28 → US-24/25/26 como gates de cierre | Recalcular si cambia backlog |
| Blockers innecesarios | UI manual/dashboard comienzan con contratos+mocks; solo cierre exige integración | Equipo real tiene cuatro personas, no ocho |
| Essential depende de Expert | 0 aristas; NullRepo, tracking local y predictor clásico | Debe demostrarse en E2E US-18/33 |
| Paralelización | Modelos US-11–14 paralelos; UI/API con contratos; DB/transformer/tracking independientes | Asignación ML/EDA pendiente |
| Historias XL | 0; tamaños S/M | Reestimar y dividir por AC si una supera capacidad real |
| Ausencia de tests | Todas las historias tienen Testing; TDD y excepciones documentales explícitas | No hay tests de producto ejecutados porque no hay producto |
| Duplicación de responsabilidades | Spec comportamiento, design decisiones, OpenAPI schema, US entrega, informes resultados, Project estado | No copiar estado operativo a múltiples archivos tras publicar |
| No leakage | Folds compartidos, fit/augmentation dentro de train, test final congelado y nuevos ciclos independientes | Dataset inexistente en esta sesión; protocolo pendiente de datos |
| Gap del briefing | Macro-F1 absoluto ×100, estricto <5 pp; fallo visible y sin retuning sobre test | No se garantiza que se cumpla empíricamente |
| ML con cuatro personas | Cuatro historias personales; candidatos propuestos, sin asignación inventada | Cuarto candidato y distribución requieren dataset/equipo |
| Accesibilidad | AC de UI + DoD + QA-02, manual y automático | Sin certificación ni UI existente |
| Green AI | Presupuestos, tiempo/memoria, caché por fold, carga única y coste de modelos pesados | No medición energética ficticia |
| Git / remotos | No checkout/commit/push ni Issues; paquete documental independiente | Incorporación a dev real pendiente por discrepancia del checkout local |

## Pendientes reales

Las OQ de [discovery](../discovery.md) bloquean únicamente sus historias. Especialmente: dataset/licencia/idioma/etiquetas, mínimos de calidad previos a experimentos, personas/modelos, proveedor y política de datos antes de publicar/guardar datos reales. No se puede elegir el cuarto modelo basándose en características reales aún no disponibles; su recomendación queda expresamente provisional.

Pydantic/FastAPI, Makefile, .env.example operativo, imágenes Docker, EDA, entrenamiento, accesibilidad real, suites de producto y demo son trabajo futuro. No se han ejecutado tests de inferencia, modelos, PostgreSQL, YouTube ni frontend. La aceptación de este plan no equivale a aceptación de esas funcionalidades.

## Revisión recomendada del equipo

Revisar primero OQ-01/02/03 y semántica del contrato; después arquitectura progresiva y dependencias; finalmente granularidad y asignación de historias. Cualquier cambio de taxonomía se revisa antes de integrar ML real. Mantener changes pendientes hasta implementación verificada y no archivar el plan maestro como si todo estuviera construido.
