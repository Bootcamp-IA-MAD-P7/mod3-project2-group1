# Logistic Regression — DEV experiment

## Scope and protocol

- Model: Logistic Regression with the common TF-IDF pipeline.
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

## Baseline and tuning history

Baseline: `C=1.0`, `min_df=1`, `max_features=None`, `ngram_range=(1,2)`.

| Stage | Configuration / range | Best validation F1 | Notes |
|---|---|---:|---|
| Baseline | `C=1.0`, `min_df=1`, `(1,2)` | 0.3542 | std 0.1535; train F1 0.9725; gap 61.82 pp |
| Round 1 | `C={0.01,0.1,1}`, `min_df={1,2}`, `max_features={None,10000}`, ngrams `{(1,1),(1,2)}` | 0.4494 | `C=1`, `min_df=2`, unigramas; `max_features=10000` had no effect |
| Round 2 | `C={0.25,0.5,0.75,1,1.5,2}` | 0.5020 | control `C=1` reproduced 0.4494 |
| Round 3 | `C={2,2.5,3,4,5}` | 0.5518 | control `C=2` reproduced 0.5020; range intentionally closed at 5 |

Evolution of validation toxic F1: `0.25→0.2612`, `0.50→0.3694`, `0.75→0.4156`, `1.00→0.4494`, `1.50→0.4842`, `2.00→0.5020`, `2.50→0.5170`, `3.00→0.5344`, `4.00→0.5397`, `5.00→0.5518`.

## Selected configuration

`C=5.0`, `min_df=2`, `max_features=None`, `ngram_range=(1,1)`, `class_weight=None`, `random_state=42`, `max_iter=1000`.

This is the **best configuration observed on DEV**, not a global optimum.

| Aggregate validation metric | Value |
|---|---:|
| Toxic F1 mean / std | 0.5518 / 0.0059 |
| Toxic F1 min / max | 0.5446 / 0.5590 |
| Toxic precision / recall | 0.6343 / 0.5127 |
| Macro-F1 / accuracy | 0.6049 / 0.6152 |
| Train toxic F1 | 0.9823 |
| Train-validation gap | 43.05 pp |

| Fold | Train / validation rows | Train / validation videos | Toxic F1 | Precision | Recall | Macro-F1 | Accuracy | Confusion matrix `[[TN,FP],[FN,TP]]` | Vocabulary | Train / validation density |
|---:|---:|---:|---:|---:|---:|---:|---:|---|---:|---:|
| 1 | 490 / 318 | 6 / 3 | 0.5520 | 0.4929 | 0.6273 | 0.6309 | 0.6478 | `[[137,71],[41,69]]` | 1,067 | 1.77% / 2.12% |
| 2 | 524 / 284 | 7 / 2 | 0.5590 | 0.6667 | 0.4812 | 0.6305 | 0.6444 | `[[119,32],[69,64]]` | 1,247 | 1.78% / 1.53% |
| 3 | 602 / 206 | 5 / 4 | 0.5446 | 0.7432 | 0.4297 | 0.5532 | 0.5534 | `[[59,19],[73,55]]` | 1,505 | 1.63% / 0.99% |

## Comparison with baseline

Selected configuration versus baseline: toxic F1 `+19.76 pp`, standard deviation `-14.76 pp`, minimum fold F1 `+34.74 pp`, toxic recall `+14.09 pp`, macro-F1 `+11.95 pp`, accuracy `+8.14 pp`, and gap `-18.78 pp`.

## Limitations

DEV has only nine `VideoId` groups and substantial video-level distribution shift. The selected configuration still has a 43.05 pp train-validation gap, so it should not be treated as a final production choice or a global optimum. It must later be compared fairly with Dummy, MultinomialNB, LinearSVC, and SGDClassifier under the same DEV protocol before one candidate is frozen for a single authorised TEST evaluation.
