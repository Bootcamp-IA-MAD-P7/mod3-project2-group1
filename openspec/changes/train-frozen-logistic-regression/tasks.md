## 1. Diseño y protección del holdout

- [x] 1.1 Definir el flujo DEV-only y la configuración congelada.
- [x] 1.2 Documentar que TEST no se materializa ni se usa en esta fase.

## 2. Implementación

- [x] 2.1 Implementar selección DEV-only, entrenamiento del pipeline congelado y persistencia del bundle.
- [x] 2.2 Persistir metadata, fingerprint DEV y checksums.
- [x] 2.3 Añadir tests de configuración, exclusión holdout, carga y predicción/probabilidades.

## 3. Ejecución y validación

- [x] 3.1 Entrenar una vez sobre las 808 filas DEV y registrar la metadata generada.
- [x] 3.2 Ejecutar tests relacionados, suite aplicable y validaciones locales.
- [ ] 3.3 Ejecutar `openspec validate train-frozen-logistic-regression --strict` y `/opsx:verify` solo si están disponibles; no instalar herramientas. La indisponibilidad del entorno se registra en `design.md`.

## Fuera de alcance

- Evaluar, inspeccionar o predecir sobre TEST.
- Tuning, threshold tuning, augmentation, selección o comparación de modelos.
- Serving, API y carga de inferencia.
