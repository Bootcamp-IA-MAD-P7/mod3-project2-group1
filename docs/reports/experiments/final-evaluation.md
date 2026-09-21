# Evaluación final — candidato congelado (US-15)

- Fecha/hora (UTC): 2026-09-21T07:40:31.940792+00:00
- DEV rows: 808; TEST rows: 187
- Holdout excluido del train: 4rCweDxDqdw, 5vF4si3hoRA, 8HB18hZrhXc, TZxEyoplYbI

## Métricas TEST (una única corrida autorizada)

| Métrica | Valor |
|---|---:|
| Macro-F1 | 0.6458 |
| F1 hate | 0.6250 |
| Precision hate | 0.6111 |
| Recall hate | 0.6395 |
| Accuracy | 0.6471 |
| FN | 31 |
| FP | 35 |
| Matriz (TN, FP, FN, TP) | [[66, 35], [31, 55]] |

## Train (DEV completo)

- Macro-F1: 0.9825

## Gate

- Gap macro-F1 (pp): `33.6701` — umbral `5.0`
- Resultado global: **FAIL**

## Coste (GO-01)

- Tiempo (s): 0.2787
- Memoria pico (bytes): 2005751
- Tamaño bundle (bytes): 48756

## Limitaciones

- Corrida única preacordada; un resultado FAIL se reporta sin tuning ni re-iteración sobre TEST.
- Umbrales adicionales de OQ-03 y revisión cruzada de AC3 pendientes de decisión humana.
