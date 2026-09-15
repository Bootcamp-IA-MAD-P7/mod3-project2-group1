from ml.evaluation.metrics import evaluate_binary_classification


def test_evaluate_binary_classification_returns_common_metrics():
    """Todos los modelos deben evaluarse con las mismas métricas."""
    y_true = [True, True, False, False]
    y_pred = [True, False, False, False]

    metrics = evaluate_binary_classification(y_true, y_pred)

    assert set(metrics.keys()) == {
        "accuracy",
        "precision",
        "recall",
        "f1",
        "confusion_matrix",
    }


def test_evaluate_binary_classification_calculates_expected_values():
    """Las métricas deben calcular correctamente la clase tóxica."""
    y_true = [True, True, False, False]
    y_pred = [True, False, False, False]

    metrics = evaluate_binary_classification(y_true, y_pred)

    assert metrics["accuracy"] == 0.75
    assert metrics["precision"] == 1.0
    assert metrics["recall"] == 0.5
    assert metrics["f1"] == 2 / 3
    assert metrics["confusion_matrix"] == [[2, 0], [1, 1]]


def test_evaluate_binary_classification_handles_zero_predictions():
    """La evaluación no debe fallar si el modelo no predice ningún positivo."""
    y_true = [True, False, True, False]
    y_pred = [False, False, False, False]

    metrics = evaluate_binary_classification(y_true, y_pred)

    assert metrics["precision"] == 0.0
    assert metrics["recall"] == 0.0
    assert metrics["f1"] == 0.0