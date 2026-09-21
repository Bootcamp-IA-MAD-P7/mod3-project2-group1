# SGDClassifier — DEV experiment (final)

## Objective

Select the final SGDClassifier configuration on the development split (DEV) only, minimising the train-validation gap while keeping validation toxic F1 as high as reasonably possible, under the shared evaluation protocol.

## Scope and protocol

- Model: SGDClassifier with `loss="log_loss"` and the common TF-IDF pipeline (`min_df=12`, `max_features=None`, `ngram_range=(1,2)`).
- Data: prepared `youtoxic_english_1000.csv`; 995 comments after case-insensitive deduplication. DEV contains 808 comments from 9 distinct `VideoId` groups.
- Holdout: split by `VideoId`. TEST contains 187 sealed comments and was not used for fitting, tuning, prediction, metrics, inspection, or this report; no TEST metrics exist.
- Validation: `StratifiedGroupKFold(n_splits=3, shuffle=True, random_state=42)` with `VideoId` as groups. Every fold had zero shared videos between train and validation (`video_overlap: []`).
- Primary metric: toxic-class F1 on validation. Secondary metrics: precision, recall, macro-F1, accuracy, train F1, train-validation gap, per-fold confusion matrices, vocabulary size, and TF-IDF density.
- Threshold: default classifier threshold; no threshold tuning. No `class_weight`, resampling, GridSearchCV, Optuna, model bundle, or TEST evaluation.

## Environment

| Dependency | Version |
|---|---:|
| Python | 3.12.13 |
| scikit-learn | 1.9.1 |
| pandas | 3.0.5 |

All final metrics in this report were recomputed from scratch with the definitive configuration under this environment, DEV only, with the same protocol (deterministic run).

## Baseline and tuning history

Baseline: `alpha=1e-4`, `penalty="l2"`, `loss="log_loss"`, `min_df=1`, `max_features=None`, `ngram_range=(1,2)`.

The baseline was reproduced twice with identical aggregate metrics (deterministic run).

| Stage | Configuration / range | Best validation F1 | Notes |
|---|---|---:|---|
| Baseline | `alpha=1e-4`, `penalty=l2` | 0.5369 | std 0.0171; train F1 1.0000; gap 46.31 pp |
| Round 1 | `alpha={1e-5,1e-4,1e-3}` × `penalty={l2,elasticnet}` | 0.5370 | `alpha=1e-4`, `penalty=elasticnet`; `alpha=1e-3` strongly underfits (0.41–0.44) |
| Exp. min_df | `min_df={1,5,10,12}`, `alpha=1e-4` | 0.6094 | gap 46.30 → 29.05 pp; val F1 monotonic 0.5370 → 0.6094 |
| Exp. alpha×ngram×max_features | `min_df=12` fixed; `alpha={1e-4,5e-4,1e-3,5e-3}` × `{(1,1),(1,2)}` × `{None,500,1000,2000}` (32 configs) | 0.6094 | `max_features` inert (vocab < 500); `alpha=0.0005,(1,2)` best gap/trade-off |

Ranked round-1 validation toxic F1: `(1e-3, l2)→0.4133`, `(1e-3, elasticnet)→0.4376`, `(1e-5, l2)→0.5234`, `(1e-5, elasticnet)→0.5244`, `(1e-4, l2)→0.5369`, `(1e-4, elasticnet)→0.5370`.

Controlled overfitting findings (DEV only):

- As in LinearSVC, raising `min_df` is the dominant lever: it reduces the gap and, at the same time, improves validation F1 monotonically up to `min_df=12`.
- Under `min_df=12`, `alpha` regulates the gap/trade-off: `alpha=0.0001` keeps the highest validation F1 (0.6094) but with the largest variance (std 0.0570); `alpha=0.0005` loses +0.54 pp in validation F1 (0.6040), halves the fold variance (std 0.0290) and cuts the gap to 23.53 pp. `alpha=0.001` underfits (~0.56); `alpha=0.005` severely underfits (0.41–0.44).
- `max_features` has no effect once `min_df=12` prunes the vocabulary (≈203 unigrams / ≈250 bigrams regardless of the added cap).

## Preprocessing (TF-IDF)

`TfidfVectorizer` with `min_df=12`, `max_features=None`, `ngram_range=(1,2)`, default sublinear/analyzer settings, fitted per fold on training text only (vocabulary sizes 194 / 251 / 306).

## Selected configuration (final)

`loss="log_loss"`, `alpha=0.0005`, `penalty="elasticnet"`, `random_state=42`, `max_iter=1000`, `min_df=12`, `max_features=None`, `ngram_range=(1,2)`. No threshold tuning, no resampling, no `class_weight`.

This is the **final configuration observed on DEV**, not a global optimum. It does not hold the raw highest validation F1 of the grid (`alpha=0.0001` does), but it is the best *overfitting-aware* trade-off selected for delivery.

| Aggregate validation metric | Value |
|---|---:|
| Toxic F1 mean / std | 0.6040 / 0.0290 |
| Toxic F1 min / max | 0.5633 / 0.6283 |
| Toxic precision / recall | 0.6381 / 0.5845 |
| Macro-F1 / accuracy | 0.6331 / 0.6428 |
| Train toxic F1 | 0.8393 |
| Train-validation gap | 23.53 pp |

| Fold | Train / validation rows | Train / validation videos | Toxic F1 | Precision | Recall | Macro-F1 | Accuracy | Confusion matrix `[[TN,FP],[FN,TP]]` | Vocabulary | Train / validation density |
|---:|---:|---:|---:|---:|---:|---:|---:|---|---:|---:|
| 1 | 490 / 318 | 6 / 3 | 0.5633 | 0.5111 | 0.6273 | 0.6448 | 0.6635 | `[[142,66],[41,69]]` | 194 | 6.72% / 8.39% |
| 2 | 524 / 284 | 7 / 2 | 0.6204 | 0.6786 | 0.5714 | 0.6662 | 0.6725 | `[[115,36],[57,76]]` | 251 | 6.47% / 5.81% |
| 3 | 602 / 206 | 5 / 4 | 0.6283 | 0.7245 | 0.5547 | 0.5884 | 0.5922 | `[[51,27],[57,71]]` | 306 | 6.05% / 3.83% |

Fold error counts: fold 1 has the most false positives (66) and fold 3 the most false negatives (57); fold 2 is balanced.

## Note on the margin

The fitted score is a linear decision margin, **not a calibrated probability**. It is not presented as a probability; any future per-comment score/confidence must be calibrated (e.g., via `predict_proba` validation) before use in moderation decisions (US-16).

## Comparison with baseline, Dummy and LR

Selected configuration versus baseline (`alpha=1e-4`, `penalty=l2`, `min_df=1`): toxic F1 `+6.71 pp`, gap `-22.79 pp` (from 46.31 pp). Versus the previous selection (`alpha=1e-4`, `min_df=1`): toxic F1 `+6.70 pp`, gap `-22.77 pp`.

| Candidate | Validation toxic F1 | vs final |
|---|---:|---:|
| Dummy (most frequent) | 0.1713 | −43.27 pp |
| Logistic Regression (best DEV) | 0.5518 | −5.22 pp |
| Baseline (`alpha=1e-4`, `l2`, `min_df=1`) | 0.5369 | −6.71 pp |
| Previous selection (`alpha=1e-4`, `min_df=1`) | 0.5370 | −6.70 pp |
| SGDClassifier final (this report) | 0.6040 | — |

Note: these are DEV results under the shared protocol; they are not a substitute for the ML-01 model comparison.

## Overfitting assessment

- Improvement **on validation**: `min_df=12` combined with the `(1,2)` n-grams raises validation toxic F1 to 0.6040, the best SGDClassifier figure reported with a stable fold spread (std 0.0290). The improvement is a genuine validation-side gain, not a fit-side artifact.
- Reduction of the gap: train F1 falls from 1.0000 to 0.8393 and the train-validation gap drops from 46.30 pp to 23.53 pp. The model still memorises part of the training data and the gap remains far above 5 pp, so overfitting is **reduced but not solved** — no tested configuration closed the gap below 5 pp.
- The selected `alpha=0.0005` trades 0.54 pp of validation F1 against half the fold variance and a 5.5 pp smaller gap than `alpha=0.0001`; this is distinguished explicitly from the (higher) raw `alpha=0.0001` figure, which was not used for the final metrics.

TEST remains sealed (187 comments, never used); no TEST metrics exist for this or any other configuration.

## Conclusion

`alpha=0.0005`, `loss="log_loss"`, `penalty="elasticnet"`, `min_df=12`, `ngram_range=(1,2)` is the final SGDClassifier configuration delivered to the model comparison. It is the best overfitting-aware trade-off observed on DEV (validation toxic F1 0.6040, gap 23.53 pp, fold std 0.0290). The residual gap, the small dataset, and the conceptual overlap with Logistic Regression mean this must not be treated as a global optimum; it still requires a fair comparison with Dummy, MultinomialNB, LinearSVC, and Logistic Regression under the same DEV protocol before one candidate is frozen for a single authorised TEST evaluation.

## Reproduction

All final metrics were recomputed from scratch with the definitive configuration on DEV only (Python 3.12.13, scikit-learn 1.9.1, pandas 3.0.5), deterministically. The historical tuning script `backend/scripts/run_sgd_classifier_dev.py` (unchanged) reproduces only the earlier `alpha=1e-4`, `min_df=1` rounds. Every fold reported `video_overlap: []` and TEST was never used.