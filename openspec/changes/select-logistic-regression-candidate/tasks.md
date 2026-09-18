## 1. Registro de decisión

- [x] 1.1 Contrastar la decisión humana con la evidencia DEV consolidada de los cuatro candidatos.
- [x] 1.2 Registrar el criterio, trade-off frente a LinearSVC y limitaciones sin alterar métricas históricas.
- [x] 1.3 Congelar explícitamente la configuración seleccionada antes de TEST.

## 2. Validación documental

- [x] 2.1 Comprobar que la documentación no declara superioridad universal ni evaluación TEST.
- [ ] 2.2 Ejecutar `openspec validate select-logistic-regression-candidate --strict` solo si la CLI está disponible; no instalarla.
- [x] 2.3 Validar JSON enlazados y referencias documentales, y ejecutar `git diff --check`.

## Follow-up fuera de este change

- Un change independiente deberá definir fuente de datos, persistencia del artefacto y protocolo de reentrenamiento DEV completo antes de cualquier evaluación TEST autorizada.
- TEST seguirá sellado; un resultado TEST no habilita tuning, cambio de umbral ni iteración adicional sobre TEST.
