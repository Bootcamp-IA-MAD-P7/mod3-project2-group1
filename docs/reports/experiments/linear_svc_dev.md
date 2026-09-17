# LinearSVC — DEV experiment

## Scope and protocol

- Model: LinearSVC with the common TF-IDF pipeline.
- Data: prepared `youtoxic_english_1000.csv`; 995 comments after case-insensitive deduplication. DEV contains 808 comments.
- Holdout: split by `VideoId`. TEST is completely sealed and was not used for fitting, tuning, prediction, metrics, inspection, or this report.
- Validation: `StratifiedGroupKFold(n_splits=3, shuffle=True, random_state=42)` with `VideoId` as groups. Every fold had zero shared videos between train and validation.
- Primary metric: toxic-class F1 on validation. Secondary metrics: precision, recall, macro-F1, accuracy, train F1, train-validation gap, per-fold confusion matrices.
- Threshold: default classifier threshold; no threshold tuning.
- No `class_weight`, resampling, GridSearchCV, Optuna, model bundle, or TEST evaluation.
- LinearSVC margin (`decision_function`) never reported as probability (design D-04).

## Environment

| Dependency | Version |
|---|---:|
| Python | 3.12.13 |
| scikit-learn | 1.9.1 |
| pandas | 3.0.5 |

## Baseline and tuning history

Baseline: `C=1.0`, `min_df=1`, `max_features=None`, `ngram_range=(1,2)`.

| Stage | Configuration / range | Best validation F1 | Notes |
|---|---|---:|---|
| Baseline | `C=1.0`, `min_df=1`, `(1,2)` | 0.5362 | std 0.0145; train F1 1.0000; gap 46.38 pp |
| Round 1 | `C={0.01,0.1,1}`, `min_df=1`, `max_features=None`, `ngrams={(1,1),(1,2)}` (6 configs) | 0.5536 | `C=1`, unigramas; `C=0.01` severely underperforms (0.17) |
| Round 2 | `C={0.25,0.5,1,2,4}`, `min_df=1`, `ngrams=(1,1)` (5 configs) | 0.5689 | control `C=1` reproduced 0.5536; best C at grid edge |
| Round 3 | `C={1,2,4,8,16}`, `min_df=1`, `ngrams=(1,1)` (5 configs) | 0.5741 | control `C=1` reproduced 0.5536; best C at grid edge (16.0) |

Evolution of validation toxic F1 across tuning rounds:

- Round 1: `0.01(1,1)→0.1718`, `0.01(1,2)→0.1725`, `0.1(1,1)→0.4134`, `0.1(1,2)→0.3380`, `1.0(1,1)→0.5536`, `1.0(1,2)→0.5362`
- Round 2: `0.25→0.4956`, `0.5→0.5457`, `1.0→0.5536`, `2.0→0.5660`, `4.0→0.5689`
- Round 3: `1.0→0.5536`, `2.0→0.5660`, `4.0→0.5689`, `8.0→0.5699`, `16.0→0.5741`

## Selected configuration

`C=16.0`, `min_df=1`, `max_features=None`, `ngram_range=(1,1)`, `loss="squared_hinge"`, `random_state=42`, `max_iter=1000`.

This is the **best configuration observed on DEV**, not a global optimum.

| Aggregate validation metric | Value |
|---|---:|
| Toxic F1 mean / std | 0.5741 / 0.0410 |
| Toxic F1 min / max | 0.5185 / 0.6161 |
| Toxic precision / recall | 0.6118 / 0.5510 |
| Macro-F1 / accuracy | 0.6091 / 0.6197 |
| Train toxic F1 | 1.0000 |
| Train-validation gap | 42.59 pp |

| Fold | Train / validation rows | Train / validation videos | Toxic F1 | Precision | Recall | Macro-F1 | Accuracy | Confusion matrix `[[TN,FP],[FN,TP]]` |
|---:|---:|---:|---:|---:|---:|---:|---:|---|
| 1 | 490 / 318 | 6 / 3 | 0.5185 | 0.4737 | 0.5727 | 0.6104 | 0.6321 | `[[138,70],[47,63]]` |
| 2 | 524 / 284 | 7 / 2 | 0.5878 | 0.6429 | 0.5414 | 0.6375 | 0.6444 | `[[111,40],[61,72]]` |
| 3 | 602 / 206 | 5 / 4 | 0.6161 | 0.7188 | 0.5391 | 0.5793 | 0.5825 | `[[51,27],[59,69]]` |

## Comparison with baseline

Selected configuration versus common baseline (`C=1.0`, `ngram=(1,2)`): toxic F1 `+3.79 pp`, standard deviation `+2.65 pp`, minimum fold F1 `+0.21 pp`, toxic recall `+3.75 pp`, macro-F1 `+2.39 pp`, accuracy `+2.42 pp`, and gap `-3.79 pp`.

Selected configuration versus Dummy most_frequent (shared protocol, `val_f1=0.1713`): toxic F1 `+40.28 pp`.

## Selection methodology

- Selection exclusively by mean validation F1 (toxic class) across 3 DEV folds.
- Near-tie rule: if two candidates differ by less than 0.0001 in mean validation F1, the smaller C is preferred (deterministic).
- macro-F1 and gap were recorded but never used to alter selection.
- Round 3 winner `C=16.0` sits at the upper edge of the evaluated grid, so further exploration at larger C values could improve results (not pursued in this scope).

## Limitations

DEV has only nine `VideoId` groups and substantial video-level distribution shift. The selected configuration still has a 42.59 pp train-validation gap (near-perfect training fit, `train_f1=1.0000` in all folds), so it should not be treated as a final production choice or a global optimum. C=16.0 is at the grid boundary, meaning the optimal C may lie outside the evaluated range. It must later be compared fairly with Dummy, MultinomialNB, LogisticRegression, and SGDClassifier under the same DEV protocol before one candidate is frozen for a single authorised TEST evaluation.