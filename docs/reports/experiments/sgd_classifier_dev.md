# SGDClassifier — DEV experiment

## Scope and protocol

- Model: SGDClassifier with `loss="log_loss"` and the common TF-IDF pipeline (`min_df=1`, `max_features=None`, `ngram_range=(1,2)`).
- Data: prepared `youtoxic_english_1000.csv`; 995 comments after case-insensitive deduplication. DEV contains 808 comments.
- Holdout: split by `VideoId`. TEST is completely sealed and was not used for fitting, tuning, prediction, metrics, inspection, or this report.
- Validation: `StratifiedGroupKFold(n_splits=3, shuffle=True, random_state=42)` with `VideoId` as groups. Every fold had zero shared videos between train and validation.
- Primary metric: toxic-class F1 on validation. Secondary metrics: precision, recall, macro-F1, accuracy, train F1, train-validation gap, per-fold confusion matrices, vocabulary size, and TF-IDF density.
- Threshold: default classifier threshold; no threshold tuning.
- No `class_weight`, resampling, GridSearchCV, Optuna, model bundle, or TEST evaluation.

## Environment

| Dependency | Version |
|---|---:|
| Python | 3.12.7 |
| scikit-learn | 1.9.1 |
| pandas | 3.0.5 |

Run command (from repo root, into the team environment above):

```
PYTHONPATH=backend python backend/scripts/run_sgd_classifier_dev.py
```

## Baseline and tuning history

Baseline: `alpha=1e-4`, `penalty="l2"`, `loss="log_loss"`, `min_df=1`, `max_features=None`, `ngram_range=(1,2)`.

The baseline was reproduced twice with identical aggregate metrics (deterministic run).

| Stage | Configuration / range | Best validation F1 | Notes |
|---|---:|---:|---|
| Baseline | `alpha=1e-4`, `penalty=l2` | 0.5369 | std 0.0171; train F1 1.0000; gap 46.31 pp |
| Round 1 | `alpha={1e-5,1e-4,1e-3}` × `penalty={l2,elasticnet}` | 0.5370 | `alpha=1e-4`, `penalty=elasticnet`; `alpha=1e-3` strongly underfits (0.41–0.44) |

Ranked round-1 validation toxic F1: `(1e-3, l2)→0.4133`, `(1e-3, elasticnet)→0.4376`, `(1e-5, l2)→0.5234`, `(1e-5, elasticnet)→0.5244`, `(1e-4, l2)→0.5369`, `(1e-4, elasticnet)→0.5370`.

## Selected configuration

`loss="log_loss"`, `alpha=1e-4`, `penalty="elasticnet"`, `random_state=42`, `max_iter=1000`, `min_df=1`, `max_features=None`, `ngram_range=(1,2)`.

This is the **best configuration observed on DEV**, not a global optimum. The gain over the baseline (`+0.02 pp`) is negligible.

| Aggregate validation metric | Value |
|---|---:|
| Toxic F1 mean / std | 0.5370 / 0.0134 |
| Toxic F1 min / max | 0.5189 / 0.5507 |
| Toxic precision / recall | 0.6223 / 0.5136 |
| Macro-F1 / accuracy | 0.5862 / 0.5967 |
| Train toxic F1 | 1.0000 |
| Train-validation gap | 46.30 pp |

| Fold | Train / validation rows | Train / validation videos | Toxic F1 | Precision | Recall | Macro-F1 | Accuracy | Confusion matrix `[[TN,FP],[FN,TP]]` | Vocabulary | Train / validation density |
|---:|---:|---:|---:|---:|---:|---:|---:|---|---:|---:|
| 1 | 490 / 318 | 6 / 3 | 0.5415 | 0.4491 | 0.6818 | 0.5939 | 0.6006 | `[[116,92],[35,75]]` | 12,819 | 0.38% / 0.28% |
| 2 | 524 / 284 | 7 / 2 | 0.5189 | 0.6962 | 0.4135 | 0.6162 | 0.6408 | `[[127,24],[78,55]]` | 15,013 | 0.37% / 0.20% |
| 3 | 602 / 206 | 5 / 4 | 0.5507 | 0.7215 | 0.4453 | 0.5485 | 0.5485 | `[[56,22],[71,57]]` | 18,585 | 0.33% / 0.12% |

Folds (train) with the largest error counts: fold 2 has 78 false negatives (toxic comments missed), fold 1 has 92 false positives (non-toxic comments flagged), and fold 3 has 71 false negatives.

## Note on the margin

The fitted score is a linear decision margin, **not a calibrated probability**. It is not presented as a probability; any future per-comment score/confidence must be calibrated (e.g., via `predict_proba` validation) before use in moderation decisions (US-16).

## Comparison with baseline and LR

Selected configuration versus baseline: toxic F1 `+0.02 pp` (negligible improvement, both `alpha=1e-4` variants perform nearly identically on DEV).

| Candidate | Validation toxic F1 | vs SGD |
|---|---:|---:|
| Dummy (most frequent) | 0.1713 | −36.57 pp |
| Logistic Regression (best DEV) | 0.5518 | +1.48 pp |
| SGDClassifier (this report) | 0.5370 | — |

## Limitations

DEV has only nine `VideoId` groups and substantial video-level distribution shift. SGDClassifier(log_loss) is conceptually a linear model with the same loss as Logistic Regression, so the two overlap by construction; their similarity on DEV (0.5370 vs 0.5518) is expected, and the final choice must rest on the ML-01 comparison, not on this change. The selected configuration still has a 46.30 pp train-validation gap, so it should not be treated as a final production choice or a global optimum. It must later be compared fairly with Dummy, MultinomialNB, LinearSVC, and Logistic Regression under the same DEV protocol before one candidate is frozen for a single authorised TEST evaluation.

## Reproduction (AC3 US-14)

Reproducción técnica verificada: `backend/scripts/run_sgd_classifier_dev.py` se re-ejecutó íntegramente sobre el mismo entorno (Python 3.12.7, scikit-learn 1.9.1, pandas 3.0.5) y regeneró `sgd_classifier_dev.json` con checksum SHA-256 idéntico (`a03dad0834cbb2a69603907d44e12fbb260d6b69dfbcff057767ed117e2c4f21`), por lo que baseline y resultados son deterministas. Los folds guardaron `video_overlap: []` en los tres casos y TEST no fue usado en ningún paso.

- [X] A second person reproduced the run with the environment above, reviewed the conclusions, and signed this section (name + date).