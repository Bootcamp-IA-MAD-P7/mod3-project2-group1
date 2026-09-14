# OpenSpec: uso y fuente de verdad

Convenciones verificadas en las fuentes oficiales el 2026-09-14: [conceptos](https://github.com/Fission-AI/OpenSpec/blob/main/docs/concepts.md), [schema spec-driven](https://github.com/Fission-AI/OpenSpec/blob/main/schemas/spec-driven/schema.yaml) y [CLI](https://github.com/Fission-AI/OpenSpec/blob/main/docs/cli.md).

Se utiliza `changes/define-project/{proposal.md,design.md,tasks.md,specs/<capability>/spec.md}` y `config.yaml` con schema `spec-driven`. Cada delta incluye `## ADDED Requirements`, requisitos normativos y escenarios `#### Scenario:` WHEN/THEN. `contracts/` es documentación de apoyo referenciada desde el diseño, no un artefacto obligatorio inventado de OpenSpec.

Todas las capacidades están **propuestas**, no implementadas. Por eso no se publica una falsa baseline en `openspec/specs/`. Tras revisar el plan, cada slice debe extraer sus requisitos a un change implementable pequeño, retirándolos del change maestro para evitar deltas duplicados. Al implementar, verificar y archivar cada change, OpenSpec sincroniza la capacidad correspondiente a `openspec/specs/`. No archivar el plan completo para aparentar que se ha alcanzado Expert.

La arquitectura y decisiones viven en `design.md`; comportamiento en specs; contrato formal en `contracts/openapi.json`; historias enlazan esos documentos. README orienta y CONTRIBUTING gobierna colaboración. No mantener copias normativas paralelas.

Validación ejecutada desde la raíz de este paquete: `openspec validate define-project --strict`, con CLI **1.13.0**, resultado válido. El informe de validación distingue validación real de CLI y comprobaciones locales. No se ha ejecutado `openspec init` ni se han instalado integraciones de agentes. Se recomienda fijar 1.13.0 como versión comprobada en US-02, revisando futuras actualizaciones. `tasks.md` representa implementación futura y permanece pendiente.
