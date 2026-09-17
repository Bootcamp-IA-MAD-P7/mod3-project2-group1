# Workflow obligatorio de OpenSpec

## 1. Flujo de trabajo

Para cada cambio que afecte comportamiento, arquitectura, contratos, requisitos o especificaciones debe utilizarse OpenSpec.

El workflow es:

`/opsx:explore specs/<capacidad>`

Este paso es opcional.

Después: `/opsx:propose`.

El change debe contener y mantener, cuando corresponda: `design`, `proposal` y `tasks`.

Después de tener definido el change: `/opsx:apply`.

La implementación debe realizarse siguiendo las tasks del change.

## 2. Validación antes de considerar terminado un cambio

Antes de considerar una implementación preparada para integración deben ejecutarse, cuando estén disponibles y sean aplicables:

- tests;
- lint;
- validaciones del proyecto;
- `openspec validate <change> --strict`;
- `/opsx:verify`.

No continuar con el cierre del change si alguna validación relevante falla.

## 3. Sincronización de specs

Cuando la implementación y sus tasks estén completas, y hayan pasado tests, validaciones, OpenSpec validate y `/opsx:verify`, ejecutar `/opsx:sync`.

La finalidad de sync es sincronizar los delta specs del change con los specs principales.

No ejecutar sync sobre cambios incompletos.

## 4. Archive

Antes de que un change terminado pueda ser integrado definitivamente debe ejecutarse `/opsx:archive`.

Solo se puede archivar un change cuando exista evidencia de que:

- la implementación correspondiente está completa;
- las tasks correspondientes están completas;
- las validaciones han pasado;
- verify ha pasado;
- sync se ha realizado cuando corresponda.

No utilizar archive para declarar terminado un plan maestro, capability o change cuya implementación siga pendiente.

## 5. Trazabilidad con GitHub Issues

Todo trabajo debe mantener trazabilidad con la Issue correspondiente cuando esa relación pueda demostrarse.

Los commits serán realizados manualmente por una persona del equipo.

El agente puede proponer un Conventional Commit como `feat(frontend): implement dashboard (#10)`, pero no puede ejecutar el commit.

Cuando un change finalizado deba cerrar una Issue, el agente debe proponer `Closes #10`.

La referencia debe utilizar el número real de la Issue correspondiente.

Nunca inventar números de Issue ni inferir relaciones que no puedan demostrarse mediante:

- specs;
- tasks;
- documentación;
- historial Git;
- referencias existentes del proyecto.

Si no puede verificarse la relación, indicar `relación con issue no verificada` y solicitar revisión humana.

## 6. Git y GitHub: control humano obligatorio

Los agentes de IA no pueden ejecutar `git add`, `git commit`, `git push` ni `git merge`.

Tampoco pueden:

- crear Pull Requests;
- mergear Pull Requests;
- borrar ramas;
- cerrar Issues;
- ejecutar acciones equivalentes que integren o publiquen cambios.

Estas acciones son exclusivamente humanas.

Los agentes pueden utilizar comandos Git de solo lectura para comprobar el estado del trabajo, por ejemplo: `git status`, `git status --short`, `git diff`, `git diff --check`, `git diff --name-only`, `git log` y `git show`.

Al finalizar una implementación, el agente debe detenerse y proporcionar al equipo:

1. resumen de los cambios realizados;
2. archivos modificados o creados;
3. tests ejecutados y resultados;
4. lint y validaciones ejecutadas;
5. resultado de OpenSpec validate;
6. resultado de `/opsx:verify`;
7. estado de sync/archive cuando corresponda;
8. Issue relacionada, si está verificada;
9. propuesta de Conventional Commit;
10. propuesta de `Closes #<issue>` cuando corresponda.

Después debe esperar a que una persona revise el trabajo y realice manualmente Git/GitHub.

## 7. Principio de seguridad

Nunca:

- archivar specs incompletos;
- sincronizar cambios incompletos;
- declarar tests pasados sin haberlos ejecutado;
- declarar validaciones correctas sin haberlas ejecutado;
- inventar resultados;
- inventar Issues;
- modificar contratos fuera del change correspondiente;
- ampliar el alcance de una tarea sin aprobación;
- hacer merge automáticamente.

Si existe duda sobre el estado de un change, una Issue o una operación destructiva, detenerse y solicitar revisión humana.

## Situación actual del repositorio

- No ejecutar `/opsx:sync` sobre `define-project`.
- No ejecutar `/opsx:archive` sobre `define-project`.
- No archivar ningún spec mientras `define-project` siga siendo un plan/change maestro documental con tareas pendientes.
- No cerrar ninguna Issue sin una relación verificada y revisión humana.
- Si la CLI `openspec` no está disponible, no instalar herramientas ni dependencias sin autorización del equipo.
