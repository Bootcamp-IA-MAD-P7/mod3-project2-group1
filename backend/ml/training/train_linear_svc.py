"""Train and evaluate LinearSVC for binary toxicity classification."""

import time
from pathlib import Path

import pandas as pd
  
from ml.data.dataset import (
    TARGET_COLUMN,
    TEXT_COLUMN,
    VIDEO_ID_COLUMN,
    create_grouped_cv,
    create_holdout_split,
    prepare_binary_dataset,
)
from ml.evaluation.linear_svc_tuning import (
    TuningConfiguration,
    build_first_tuning_configurations,
    build_second_tuning_configurations,
    evaluate_linear_svc_configuration,
    select_best_tuning_configuration,
)
from ml.evaluation.metrics import evaluate_binary_classification
from ml.models.baseline import create_dummy_classifier

DATA_PATH = Path(__file__).resolve().parents[3] / "data" / "youtoxic_english_1000.csv"


def _prepare_data() -> tuple[pd.DataFrame, pd.DataFrame]:
    """Load, prepare and split the dataset into dev and sealed test sets."""
    df = pd.read_csv(DATA_PATH)
    prepared = prepare_binary_dataset(df)
    return create_holdout_split(prepared)


def _run_dummy_baseline(development_data: pd.DataFrame) -> dict:
    """Evaluate the common Dummy baseline on the same development folds."""
    texts = development_data[TEXT_COLUMN]
    targets = development_data[TARGET_COLUMN]
    groups = development_data[VIDEO_ID_COLUMN]
    results = []

    for fold_number, (train_indices, validation_indices) in enumerate(
        create_grouped_cv().split(texts, targets, groups=groups), start=1
    ):
        train_data = development_data.iloc[train_indices]
        validation_data = development_data.iloc[validation_indices]

        model = create_dummy_classifier()
        model.fit(train_data[TEXT_COLUMN], train_data[TARGET_COLUMN])
        train_predictions = model.predict(train_data[TEXT_COLUMN])
        validation_predictions = model.predict(validation_data[TEXT_COLUMN])

        train_metrics = evaluate_binary_classification(
            train_data[TARGET_COLUMN], train_predictions
        )
        val_metrics = evaluate_binary_classification(
            validation_data[TARGET_COLUMN], validation_predictions
        )

        results.append(
            {
                "fold": fold_number,
                "train_f1": train_metrics["f1"],
                "val_f1": val_metrics["f1"],
                "gap_f1": train_metrics["f1"] - val_metrics["f1"],
            }
        )

    return {
        "val_f1_mean": sum(f["val_f1"] for f in results) / len(results),
        "val_f1_std": pd.Series([f["val_f1"] for f in results]).std(ddof=0),
        "train_f1_mean": sum(f["train_f1"] for f in results) / len(results),
        "gap_pp": sum(f["gap_f1"] for f in results) / len(results) * 100,
    }


def _print_round(results: list[dict], round_label: str) -> None:
    """Print a formatted round of tuning results."""
    print(f"\n=== {round_label} ===")
    print(f"{'C':<8} {'ngram':<8} {'val_f1_mean':>11} {'val_f1_std':>10} "
          f"{'val_f1_min':>10} {'val_f1_max':>10} {'macro_f1':>8} "
          f"{'acc':>6} {'prec':>6} {'rec':>6} {'train_f1':>9} {'gap_pp':>8}")
    for result in results:
        cfg = result["configuration"]
        s = result["summary"]
        print(
            f"{cfg['c']:<8} {cfg['ngram_range']!s:<8} "
            f"{s['validation_f1_mean']:<11.4f} {s['validation_f1_std']:<10.4f} "
            f"{s['validation_f1_min']:<10.4f} {s['validation_f1_max']:<10.4f} "
            f"{s['validation_macro_f1_mean']:<8.4f} "
            f"{s['validation_accuracy_mean']:<6.4f} "
            f"{s['validation_precision_mean']:<6.4f} "
            f"{s['validation_recall_mean']:<6.4f} "
            f"{s['train_f1_mean']:<9.4f} "
            f"{s['f1_gap_percentage_points']:>+8.2f}"
        )


def _print_fold_details(results: list[dict]) -> None:
    """Print per-fold detail for each result."""
    for result in results:
        cfg = result["configuration"]
        print(f"\nC={cfg['c']} ngram={cfg['ngram_range']}:")
        for fold in result["folds"]:
            vm = fold["validation_metrics"]
            tm = fold["train_metrics"]
            cm = vm["confusion_matrix"]
            print(
                f"  fold={fold['fold']} n_train={fold['train_size']} n_val={fold['validation_size']} "
                f"overlap={fold['video_overlap']} "
                f"val_f1={vm['f1']:.4f} macro={vm['macro_f1']:.4f} "
                f"acc={vm['accuracy']:.4f} prec={vm['precision']:.4f} rec={vm['recall']:.4f} "
                f"train_f1={tm['f1']:.4f} "
                f"cm={cm}"
            )


def main() -> None:
    """Run the full LinearSVC training protocol."""
    start = time.perf_counter()

    dev, test = _prepare_data()
    print(f"dev_samples={len(dev)} test_samples={len(test)} (sellado)")

    # ---- Baseline ----
    dummy = _run_dummy_baseline(dev)

    # ---- ROUND 1 ----
    round1_configs = build_first_tuning_configurations()
    round1_results = [evaluate_linear_svc_configuration(dev, cfg) for cfg in round1_configs]
    _print_round(round1_results, "ROUND 1")
    winner1 = select_best_tuning_configuration(round1_results)
    w1_cfg = winner1["configuration"]
    print(f"\nGANADOR ROUND 1: C={w1_cfg['c']} ngram={w1_cfg['ngram_range']} "
          f"val_f1_mean={winner1['summary']['validation_f1_mean']:.4f}")

    # ---- ROUND 2 ----
    round2_configs = build_second_tuning_configurations(
        w1_cfg["c"], w1_cfg["ngram_range"]
    )
    round2_results = [evaluate_linear_svc_configuration(dev, cfg) for cfg in round2_configs]
    _print_round(round2_results, "ROUND 2")
    winner2 = select_best_tuning_configuration(round2_results)
    w2_cfg = winner2["configuration"]
    print(f"\nGANADOR ROUND 2: C={w2_cfg['c']} ngram={w2_cfg['ngram_range']} "
          f"val_f1_mean={winner2['summary']['validation_f1_mean']:.4f}")

    # ---- ROUND 3 ----
    round3_configs = [
        TuningConfiguration(c, min_df=1, max_features=None, ngram_range=(1, 1))
        for c in (1.0, 2.0, 4.0, 8.0, 16.0)
    ]
    round3_results = [evaluate_linear_svc_configuration(dev, cfg) for cfg in round3_configs]
    _print_round(round3_results, "ROUND 3")
    winner3 = select_best_tuning_configuration(round3_results)
    w3_cfg = winner3["configuration"]
    print(f"\nGANADOR ROUND 3: C={w3_cfg['c']} ngram={w3_cfg['ngram_range']} "
          f"val_f1_mean={winner3['summary']['validation_f1_mean']:.4f}")

    # ---- DETALLE POR FOLD (GANADOR FINAL) ----
    print("\n=== DETALLE POR FOLD (GANADOR FINAL) ===")
    for fold in winner3["folds"]:
        vm = fold["validation_metrics"]
        tm = fold["train_metrics"]
        cm = vm["confusion_matrix"]
        print(
            f"fold={fold['fold']} n_train={fold['train_size']} n_val={fold['validation_size']} "
            f"overlap={fold['video_overlap']} "
            f"val_f1={vm['f1']:.4f} macro={vm['macro_f1']:.4f} "
            f"train_f1={tm['f1']:.4f} "
            f"acc={vm['accuracy']:.4f} prec={vm['precision']:.4f} rec={vm['recall']:.4f} "
            f"cm={cm}"
        )

    # ---- RESUMEN FINAL ----
    s = winner3["summary"]
    print("\n=== FINAL LINEAR SVC ===")
    print(f"c_final={w3_cfg['c']}")
    print(f"ngram_range_final={w3_cfg['ngram_range']}")
    print("min_df_final=1 max_features_final=None")
    print(f"validation_f1_mean={s['validation_f1_mean']:.4f}")
    print(f"validation_f1_std={s['validation_f1_std']:.4f}")
    print(f"validation_f1_min={s['validation_f1_min']:.4f}")
    print(f"validation_f1_max={s['validation_f1_max']:.4f}")
    print(f"validation_macro_f1_mean={s['validation_macro_f1_mean']:.4f}")
    print(f"train_f1_mean={s['train_f1_mean']:.4f}")
    print(f"f1_gap_percentage_points={s['f1_gap_percentage_points']:+.2f}")

    # ---- COMPARACIÓN CON BASELINE DUMMY ----
    print("\n=== COMPARACIÓN CON BASELINE DUMMY (most_frequent) ===")
    print(f"dummy_val_f1={dummy['val_f1_mean']:.4f} dummy_gap_pp={dummy['gap_pp']:+.2f}")
    print(f"lsvc_val_f1={s['validation_f1_mean']:.4f} lsvc_gap_pp={s['f1_gap_percentage_points']:+.2f}")
    print(f"diferencia_val_f1_lsvc_minus_dummy={s['validation_f1_mean'] - dummy['val_f1_mean']:+.4f}")

    elapsed = time.perf_counter() - start
    print(f"\nrecursos_tiempo_seg={elapsed:.2f}")
    print(f"train_samples={len(dev)} test_samples={len(test)} (sellado, sin usar)")


if __name__ == "__main__":
    main()