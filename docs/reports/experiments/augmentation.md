# Ablation US-08 — MultinomialNB con augmentation textual segura

> Rama: `feature/US-08-augmentation`. Fecha: 2026-09-17.
> Técnica: sustitución de sinónimos en inglés, determinista por semilla, solo train de cada fold.

## Objetivo

Medir si la augmentation textual (sustitución de sinónimos, TX-03) mejora el F1 del candidato MNB
sin leakage, sin tocar validación/test ni modificar el candidato congelado de US-11.

## Metodología

- Mismo evaluador común (`evaluate_binary_classification`) y mismos folds `StratifiedGroupKFold` de development.
- Modelo: MultinomialNB con `alpha=0.01` (candidato congelado en US-11; **sin tuning**).
- Control: train del fold sin augmentation. Tratamiento: train del fold + variantes sintéticas
  (`parent_id`, `technique=synonym_replacement`, `seed=42`), respetando negación (`not/never/no/without`).
- Hash de development y de test sellado computados tras cada run; ningún padre cruza folds.

## Resultados (reales, execution 2026-09-17)

| Fold | Control F1 | Augmented F1 | Nuevos sintéticos (solo train) |
|---|---|---|---|
| 1 | 0.5263 | 0.5208 | 128 |
| 2 | 0.5217 | 0.5408 | 150 |
| 3 | 0.6071 | 0.6114 | 176 |
| **Media** | **0.5517** | **0.5576** | **454** |

- `delta_f1_percentage_points = +0.5894`
- `dev_hash_sha256 = 24ddc7…aaab9f` (sin alterar)
- `test_hash_sha256 = c62e3a…bd1e6d` (sellado, sin alterar)
- tiempo de ejecución: `1.47 s`

## Decisiones y evidencia por AC

- **AC1 (sintéticos trazables solo train):** cada variante conserva `parent_id` (índice del padre),
  `technique=synonym_replacement` y `seed`; solo se generan dentro del train de cada fold.
  Cobertura: `tests/unit/test_augmentation.py` (`test_adds_parent_technique_seed_columns`,
  `test_parents_never_cross_folds`).
- **AC2 (hash de validation/test intacto, padres no cruzan folds, negación/etiqueta revisadas):**
  validación y test no reciben sintéticos; hashes de dev y test idénticos entre runs (reportados
  arriba). La negación bloquea el reemplazo (`test_negation_blocks_synonym_replacement`).
- **AC3 (comparación con control y coste, sin modificar candidato ni reutilizar test):** ablación
  sobre development únicamente; resultado **+0.5894 pp** sobre F1 medio. El candidato congelado
  (`alpha=0.01`, bundle US-11) no se modifica y el test sellado no se consultó para decidir.

## Decisión

La ganancia medida es **marginal (+0.59 pp)** en F1 medio de development, con un pequeño beneficio
en 2 de 3 folds. Se documenta como ablation: la técnica queda **disponible y trazable**, pero dada su
mejora acotada y su coste de trazabilidad, **no justifica por sí sola modificar el candidato congelado**.
Si el equipo decide integrarla en una futura promoción, deberá pasar un ciclo con holdout independiente
según el protocolo existente.

## Limitaciones

- Mapa de sinónimos manual (14 entradas) y conservador; cobertura léxica limitada.
- Una sola semilla (`42`); no se exploró sensibilidad a la semilla.
- `back-translation` está fuera de scope (US-08).
- No se modificó ningún contrato ni spec.

## Cobertura y validación

- `uv run pytest` → **56 passed** (45 previos + 11 de augmentation).
- `uv run ruff check .` → **All checks passed**.
- Review humano de muestras sintéticas pendiente (DoD).