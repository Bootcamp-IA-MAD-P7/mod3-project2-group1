"""Run the single authorized final TEST evaluation and produce the report (US-15)."""

from __future__ import annotations

import argparse
from pathlib import Path

import pandas as pd

from ml.data.dataset import prepare_binary_dataset
from ml.evaluation.final_evaluation import run_final_evaluation, write_final_evaluation_report

ROOT = Path(__file__).resolve().parents[2]
DATA_PATH = ROOT / "data" / "youtoxic_english_1000.csv"
ARTIFACT_PATH = ROOT / "backend" / "ml" / "artifacts" / "logistic_regression_dev_final.joblib"
REPORT_JSON = ROOT / "docs" / "reports" / "experiments" / "final-evaluation.json"
REPORT_MARKDOWN = ROOT / "docs" / "reports" / "experiments" / "final-evaluation.md"


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Evaluación final única del candidato congelado sobre el holdout TEST."
    )
    parser.add_argument(
        "--confirm-authorized-test",
        action="store_true",
        help="Confirmar la autorización humana de la única corrida TEST (requerido).",
    )
    parser.add_argument(
        "--min-recall",
        type=float,
        default=None,
        help="Umbral mínimo de recall de odio (gate OQ-03) si el equipo lo ha fijado.",
    )
    parser.add_argument(
        "--dummy-macro-f1",
        type=float,
        default=None,
        help="Macro-F1 del baseline Dummy para exigir mejora (gate OQ-03) si se define.",
    )
    args = parser.parse_args()

    if not args.confirm_authorized_test:
        print(
            "TEST evaluation NOT authorized: requiere autorización humana de la única corrida "
            "TEST y, en su caso, el cierre del gate OQ-03. "
            "Usa --confirm-authorized-test para ejecutarla."
        )
        raise SystemExit(1)

    prepared_data = prepare_binary_dataset(pd.read_csv(DATA_PATH))
    result = run_final_evaluation(
        prepared_data,
        bundle_path=ARTIFACT_PATH,
        min_recall=args.min_recall,
        dummy_macro_f1=args.dummy_macro_f1,
    )
    write_final_evaluation_report(result, json_path=REPORT_JSON, markdown_path=REPORT_MARKDOWN)
    print(f"Informe escrito en:\n- {REPORT_JSON}\n- {REPORT_MARKDOWN}")
    print(f"Gate: {'PASS' if result['gate']['passed'] else 'FAIL'} (gap {result['gate']['gap_pp']} pp)")


if __name__ == "__main__":
    main()