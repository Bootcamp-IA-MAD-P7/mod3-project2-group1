"""Train and evaluate Multinomial Naive Bayes for binary toxicity classification."""

import time
from pathlib import Path

import pandas as pd

from ml.data.dataset import (
    TARGET_COLUMN,
    VIDEO_ID_COLUMN,
    create_grouped_cv,
    create_holdout_split,
    prepare_binary_dataset,
)
from ml.evaluation.metrics import evaluate_binary_classification
from ml.features.tfidf import create_tfidf_vectorizer
from ml.models.baseline import create_dummy_classifier
from ml.models.multinomial_nb import create_multinomial_nb

DATA_PATH = Path(__file__).resolve().parents[3] / "data" / "youtoxic_english_1000.csv"

ALPHA_GRID = [0.0001, 0.001, 0.01, 0.1]


def _prepare_data() -> tuple[pd.DataFrame, pd.DataFrame]:
    """Load, prepare and split the dataset into dev and sealed test sets."""
    df = pd.read_csv(DATA_PATH)
    prepared = prepare_binary_dataset(df)
    return create_holdout_split(prepared)


def _run_grouped_cv(
    X: pd.DataFrame, y: pd.Series, alpha: float
) -> dict:
    """Evaluate one alpha using grouped CV on development data."""
    results = []
    groups = X[VIDEO_ID_COLUMN]

    for fold_n, (train_idx, val_idx) in enumerate(
        create_grouped_cv().split(X, y, groups=groups), start=1
    ):
        vectorizer = create_tfidf_vectorizer()
        X_train_tfidf = vectorizer.fit_transform(X.loc[train_idx, "Text"])
        X_val_tfidf = vectorizer.transform(X.loc[val_idx, "Text"])

        model = create_multinomial_nb(alpha=alpha)
        model.fit(X_train_tfidf, y.loc[train_idx])

        train_metrics = evaluate_binary_classification(
            y.loc[train_idx], model.predict(X_train_tfidf)
        )
        val_metrics = evaluate_binary_classification(
            y.loc[val_idx], model.predict(X_val_tfidf)
        )

        results.append(
            {
                "fold": fold_n,
                "alpha": alpha,
                "train_accuracy": train_metrics["accuracy"],
                "train_f1": train_metrics["f1"],
                "val_accuracy": val_metrics["accuracy"],
                "val_precision": val_metrics["precision"],
                "val_recall": val_metrics["recall"],
                "val_f1": val_metrics["f1"],
                "gap_f1": train_metrics["f1"] - val_metrics["f1"],
                "false_negatives": val_metrics["confusion_matrix"][1][0],
                "false_positives": val_metrics["confusion_matrix"][0][1],
            }
        )

    return results


def _run_dummy_baseline(X: pd.DataFrame, y: pd.Series) -> list[dict]:
    """Evaluate the common Dummy baseline on the same development folds.

    El DummyClassifier con strategy="most_frequent" ignora las features, así
    que se usa la misma X solo para respetar la partición por grupos.
    """
    groups = X[VIDEO_ID_COLUMN]
    results = []

    for fold_n, (train_idx, val_idx) in enumerate(
        create_grouped_cv().split(X, y, groups=groups), start=1
    ):
        model = create_dummy_classifier()
        model.fit(X.loc[train_idx], y.loc[train_idx])
        train_metrics = evaluate_binary_classification(
            y.loc[train_idx], model.predict(X.loc[train_idx])
        )
        val_metrics = evaluate_binary_classification(
            y.loc[val_idx], model.predict(X.loc[val_idx])
        )
        results.append(
            {
                "fold": fold_n,
                "train_f1": train_metrics["f1"],
                "val_f1": val_metrics["f1"],
                "gap_f1": train_metrics["f1"] - val_metrics["f1"],
            }
        )

    return results


def _select_best_alpha(results_by_alpha: dict[float, list[dict]]) -> float:
    """Select the alpha with the highest mean validation F1 across folds."""
    mean_f1 = {
        alpha: sum(fold["val_f1"] for fold in folds) / len(folds)
        for alpha, folds in results_by_alpha.items()
    }
    return max(mean_f1, key=mean_f1.get)


def main() -> None:
    """Run the full Multinomial Naive Bayes training protocol."""
    start = time.perf_counter()

    dev, test = _prepare_data()
    y = dev[TARGET_COLUMN]
    X = dev[["VideoId", "Text"]]

    results_by_alpha: dict[float, list[dict]] = {}
    for alpha in ALPHA_GRID:
        results_by_alpha[alpha] = _run_grouped_cv(X, y, alpha)

    best_alpha = _select_best_alpha(results_by_alpha)
    best_folds = results_by_alpha[best_alpha]

    mean = lambda key: sum(fold[key] for fold in best_folds) / len(best_folds)

    print("=== MULTINOMIAL NAIVE BAYES: RESULTADOS POR ALPHA ===")
    for alpha, folds in results_by_alpha.items():
        val_f1 = sum(f["val_f1"] for f in folds) / len(folds)
        gap = sum(f["gap_f1"] for f in folds) / len(folds)
        mark = " <-- mejor" if alpha == best_alpha else ""
        print(f"alpha={alpha:<6} val_f1={val_f1:.4f} gap_f1={gap:+.4f}{mark}")

    print("\n=== DETALLE DEL MEJOR ALPHA POR FOLD ===")
    for fold in best_folds:
        print(
            f"fold={fold['fold']} "
            f"acc={fold['val_accuracy']:.4f} "
            f"prec={fold['val_precision']:.4f} "
            f"rec={fold['val_recall']:.4f} "
            f"f1={fold['val_f1']:.4f} "
            f"gap={fold['gap_f1']:+.4f} "
            f"FN={fold['false_negatives']} FP={fold['false_positives']}"
        )

    print("\n=== RESUMEN ALPHA SELECCIONADO ===")
    print(f"best_alpha={best_alpha}")
    print(f"val_f1_mean={mean('val_f1'):.4f}")
    print(f"gap_f1_mean={mean('gap_f1'):+.4f}")
    print(f"false_negatives_total={sum(f['false_negatives'] for f in best_folds)}")
    print(f"false_positives_total={sum(f['false_positives'] for f in best_folds)}")

    elapsed = time.perf_counter() - start
    print(f"\nrecursos_tiempo_seg={elapsed:.2f}")
    print(f"train_samples={len(dev)} test_samples={len(test)} (sellado, sin usar)")

    print("\n=== COMPARACIÓN CON BASELINE DUMMY (most_frequent) ===")
    dummy_folds = _run_dummy_baseline(X, y)
    dummy_val_f1 = sum(f["val_f1"] for f in dummy_folds) / len(dummy_folds)
    dummy_gap = sum(f["gap_f1"] for f in dummy_folds) / len(dummy_folds)
    mnb_val_f1 = mean("val_f1")
    print(f"dummy_val_f1={dummy_val_f1:.4f} dummy_gap_f1={dummy_gap:+.4f}")
    print(f"mnb_val_f1={mnb_val_f1:.4f} mnb_gap_f1={mean('gap_f1'):+.4f}")
    print(f"diferencia_val_f1_mnb_minus_dummy={mnb_val_f1 - dummy_val_f1:+.4f}")


if __name__ == "__main__":
    main()