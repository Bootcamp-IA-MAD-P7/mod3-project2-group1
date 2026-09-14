# Propuesta de GitHub Project

No se han creado ni modificado Issues, labels o Projects remotos. Revisar diseño primero; después copiar cada historia conservando ID y enlaces relativos adaptados al repositorio.

## Taxonomía y fuentes de verdad

- Nivel: exactamente una label `level:essential`, `level:medium`, `level:advanced`, `level:expert`.
- Área: una o varias `area:frontend`, `area:backend`, `area:ml`, `area:data`, `area:database`, `area:testing`, `area:devops`, `area:docs`.
- Tipo: una label principal `type:feature`, `type:test`, `type:docs`, `type:chore`, `type:research`.

17 labels en total. No labels de prioridad, tamaño o estado. No campos Level/Area duplicados: filtrar por labels. Si se necesitan esos campos para gráficos, deben ser derivados de labels mediante sincronización, nunca editados como segunda fuente. La taxonomía se propone aquí antes de publicar las historias.

Campos manuales Project: **Status**, **Size** (XS/S/M/L/XL; evitar XL), **Epic** (EP-01–EP-07), **Priority** (P0 bloquea primer producto; P1 ampliación comprometida; P2 mejora aplazable). Assignees nativo de Issue. No fechas inventadas. Los tamaños de la entrega son S/M; revisar contra capacidad real antes de Ready. El `Priority` inicial de los archivos se copia al Project; después Project es fuente operativa y los documentos no se mantienen como otro tablero vivo.

## Kanban

| Estado | Entrada | Salida |
|---|---|---|
| Backlog | historia propuesta | priorizada y revisada |
| Ready | DoR, contrato y gates resueltos | responsable toma historia con WIP disponible |
| In Progress | implementación/test RED en curso | AC implementados y PR lista |
| Review | review de otra persona y CI | cambios aprobados y evidencia suficiente |
| Testing | integración/E2E/QA accesible final | DoD completa y merge en dev verificado |
| Done | resultado aceptado | solo reabrir por defecto identificado |

Si Testing descubre defecto, volver a In Progress con evidencia. No mover a Done al abrir PR ni por crear documentación de implementación futura. Bloqueos mediante campo nativo de relación de Issues si está disponible; en caso contrario checklist de dependencias con enlaces. No inventar automatización configurada.

Vistas: Kanban por Status; tabla por Epic/Size/Priority; vista Essential; vista ML individual; dependencias/gates. WIP recomendado cuatro In Progress total y dos Review para equipo de cuatro. Una persona puede apoyar otra historia sin poseer dos entregas simultáneas.

## Épicas y milestones

Usar Epic como single select; no crear siete Issues gigantes que repitan las specs. El [backlog](backlog.md) define objetivo, valor y membresía. Milestones opcionales por resultado `Essential demo`, `Medium demo`, `Advanced public demo`, `Expert demo`, sin fecha hasta acordarla. Si solo repiten nivel y no aportan release gate, omitirlos. No automatizar doble seguimiento redundante.

## Publicación futura

Tras revisión explícita: comprobar labels existentes, reutilizar equivalentes, crear solo faltantes; crear Issues desde archivos, registrar mapa US→número/URL, enlazar dependencias reales y cargar Project. No publicar secretos ni dataset. Esta entrega no ejecuta ese procedimiento ni envía mensajes al equipo.
