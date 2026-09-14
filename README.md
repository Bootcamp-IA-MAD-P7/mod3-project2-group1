# Plan de proyecto — detección de contenido de odio

**Estado: propuesta para revisión, sin implementación.** Repositorio objetivo: `Bootcamp-IA-MAD-P7/mod3-project2-group1`. Equipo: Naimireth, María, Veru y Víctor.

Herramienta de apoyo a moderación de comentarios de YouTube. Clasifica contenido y presenta señales para revisión humana; no sanciona personas ni elimina comentarios automáticamente.

## Lectura de la entrega

1. [Assessment y preguntas abiertas](docs/discovery.md).
2. [Arquitectura, decisiones y evolución por niveles](openspec/changes/define-project/design.md).
3. [Contratos HTTP y ML](openspec/changes/define-project/contracts/README.md), con OpenAPI y ejemplos de esquemas Pydantic exclusivamente documentales.
4. [Propuesta OpenSpec](openspec/changes/define-project/proposal.md) y [guía de uso](openspec/README.md).
5. [Épicas, backlog, dependencias, slices y roadmap](docs/planning/backlog.md).
6. [Historias listas para revisión](docs/planning/stories/README.md), [trazabilidad](docs/planning/traceability.md) y [GitHub Project](docs/planning/github-project.md).
7. [Colaboración y DoD](CONTRIBUTING.md), [informes](docs/reports/README.md) y [validación](docs/planning/validation.md).

## Ejecución

Todavía no existe una aplicación ejecutable. No se han creado endpoints, componentes, entrenamiento, EDA, dependencias de producto, Dockerfiles ni Makefile funcional. Los comandos futuros y variables se especifican en el diseño; el README se actualizará al implementar US-02 y US-09. Los ejemplos de contratos son fixtures de diseño, no predicciones reales.

## Incorporación a dev

Esta carpeta es un paquete documental independiente, no un nuevo repositorio. El usuario confirma que el repositorio real es greenfield, con `main` y `dev` sincronizadas; el directorio de ejecución de esta sesión tiene un Git vacío en `main`. No se han hecho operaciones Git de escritura. Antes de incorporar, verificar el checkout real de `dev`, revisar que no haya archivos nuevos en conflicto y copiar el **contenido** de esta carpeta a una rama de documentación derivada de `dev`. No copiar `.git` ni sobrescribir documentación sin revisar. No ejecutar `apply` de OpenSpec en esta fase.

## Alcance de los niveles

Essential entrega predicción manual con ML clásico local. Medium añade ensemble, optimización y análisis de vídeo. Advanced añade comparación neuronal, seguimiento, Docker y despliegue público. Expert añade transformer, historial PostgreSQL y MLflow. Cada ampliación es opcional para arrancar y usar la predicción esencial.
