# Colaboración

Esta entrega autoriza únicamente especificación y planificación. La implementación requiere la revisión de diseño solicitada por el equipo. No crear Issues remotas todavía.

## Entrega de una historia a una persona o agente

Leer historia, spec enlazada, diseño, contrato y esta DoD. Confirmar dependencias y preguntas abiertas que actúen como gate. Trabajar solo en su Scope y rutas indicadas; no implementar ampliaciones de nivel, cambiar contratos, entrenar modelos ajenos ni tocar secretos. Registrar cualquier contradicción como cambio de spec, sin improvisar. Los ejemplos JSON no sustituyen modelos reales.

## Git y revisiones

Repositorio real: `main` estable, `dev` integración, ramas cortas `feature/US-XX-descripcion` o `docs/US-XX-descripcion` desde `dev`; ramas creadas por Codex pueden usar `codex/US-XX-descripcion`. No commits directos sobre `main`. No hacer operaciones que afecten `main` desde esta sesión sin autorización expresa. PRs de trabajo apuntan a `dev`; releases futuras `dev` → `main` requieren revisión y autorización correspondiente.

Una historia puede dividirse en PRs pequeños por contrato/mocks/integración; permanece abierta hasta demostrar el slice completo. Un review de otro miembro mínimo; autor no se autoaprueba. Veru/Víctor revisan backend entre sí; Naimireth/María frontend entre sí; agregar review cruzado en contratos y ML. Cada miembro entrena su modelo y otra persona revisa reproducibilidad. No asignar todavía candidatos ML.

Commits descriptivos, recomendación `docs: define contrato de predicción (US-01)`, `test: cubre entrada vacía (US-09)`, `feat: añade inferencia local (US-16)`. Conservar evidencia TDD en commits o log de PR aunque se haga squash. Actualizar desde `dev` antes de pedir review; resolver conflictos con la persona responsable de los archivos y repetir tests afectados. No reescribir ramas compartidas ni hacer force-push para ocultar conflictos.

## Definition of Ready

Historia con spec y contrato revisados, tamaño ≤L, AC comprobables, dependencias reales identificadas, OQ bloqueantes cerradas, datos de prueba sin secretos y responsable asignado. Contratos revisados desbloquean frontend con mocks; la disponibilidad del backend no es requisito para comenzar la UI.

## TDD y Definition of Done global

Para lógica: RED con fallo esperado por comportamiento ausente, GREEN mínimo, REFACTOR manteniendo verde. No aceptar un test que falla solo por entorno roto como RED. Experimentos exploratorios y documentación no requieren un RED artificial; sí lo requieren sus funciones reproducibles, validaciones, transformaciones y evaluadores.

- [ ] AC de la historia y escenarios de spec cubiertos con evidencia.
- [ ] TDD documentado donde corresponde; exclusiones justificadas.
- [ ] Tests pertinentes escritos y pasando, incluidos contratos y regresiones.
- [ ] Integración respeta contrato; mocks no se confunden con evidencia de inferencia real.
- [ ] Lint/format y validación de documentación correctos.
- [ ] Sin secretos, texto sensible en logs ni código muerto innecesario.
- [ ] Documentación e informe pertinente actualizados, enlaces válidos.
- [ ] Accesibilidad revisada con teclado y lector/inspección semántica para UI.
- [ ] Coste computacional registrado para experimentos; sin leakage.
- [ ] PR revisada por otro miembro; CI pasando cuando exista.
- [ ] Merge en `dev` sin conflictos, smoke test del nivel afectado.

## Testing por capas

Unitarios: preprocessing/regex, validadores, parser URL, reglas y adaptadores con fakes; sin red ni DB externa. Integración: API completa con interfaz ML falsa determinista; segunda prueba con artefacto pequeño real; repositorio SQLAlchemy con SQLite en memoria solo para SQL portable. Compartir conexión/sesión de test correctamente y activar foreign keys cuando proceda. Migraciones, JSONB, zona horaria, índices, concurrencia y constraints específicas se prueban contra PostgreSQL efímero en una suite marcada `postgres`, nunca se consideran demostradas con SQLite.

Frontend: Vitest y Testing Library propuestos; MSW para contratos y estados. Backend: pytest propuesto. E2E: Playwright propuesto; flujo manual real, errores y desconexión; vídeo con API externa simulada y contrato real del backend; historial y seguimiento en sus perfiles. Integración externa live opt-in, presupuesto limitado y sin secretos en PRs externas. CI mínima desde Essential aunque el nivel Medium exija explícitamente tests unitarios en el briefing.
