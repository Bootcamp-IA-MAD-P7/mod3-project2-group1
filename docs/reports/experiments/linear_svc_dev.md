# LinearSVC — DEV experiment (final)

## Objective

Select the final LinearSVC configuration on the development split (DEV) only, minimising the train-validation gap while keeping validation toxic F1 as high as reasonably possible, under the shared evaluation protocol.

## Scope and protocol

- Model: LinearSVC with the common TF-IDF pipeline.
- Data: prepared `youtoxic_english_1000.csv`; 995 comments after case-insensitive deduplication. DEV contains 808 comments from 9 distinct `VideoId` groups.
- Holdout: split by `VideoId`. TEST contains 187 sealed comments and was not used for fitting, tuning, prediction, metrics, inspection, or this report; no TEST metrics exist.
- Validation: `StratifiedGroupKFold(n_splits=3, shuffle=True, random_state=42)` with `VideoId` as groups. Every fold had zero shared videos between train and validation (`video_overlap: []`).
- Primary metric: toxic-class F1 on validation. Secondary metrics: precision, recall, macro-F1, accuracy, train F1, train-validation gap, per-fold confusion matrices.
- Threshold: default classifier threshold; no threshold tuning. No `class_weight`, resampling, GridSearchCV, Optuna, model bundle, or TEST evaluation.
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
|---|---:|---:|---|
| Baseline | `C=1.0`, `min_df=1`, `(1,2)` | 0.5362 | std 0.0145; train F1 1.0000; gap 46.38 pp |
| Round 1 | `C={0.01,0.1,1}`, `min_df=1`, `max_features=None`, `ngrams={(1,1),(1,2)}` (6 configs) | 0.5536 | `C=1`, unigramas; `C=0.01` severely underperforms (0.17) |
| Round 2 | `C={0.25,0.5,1,2,4}`, `min_df=1`, `ngrams=(1,1)` (5 configs) | 0.5689 | control `C=1` reproduced 0.5536; best C at grid edge |
| Round 3 | `C={1,2,4,8,16}`, `min_df=1`, `ngrams=(1,1)` (5 configs) | 0.5741 | control `C=1` reproduced 0.5536; best C at grid edge (16.0) |
| Exp. C sweep | `C={0.25,0.5,1,2,4,8,16}`, `min_df=1` | 0.5741 | lowering C does not reduce the gap (48.60 pp at 0.25 vs 42.59 pp at 16) |
| Exp. learning curve | `C=16.0`, train fraction `{10..100%}` | 0.5741 | val F1 rises monotonically with data; train F1 near 1.0 even at 10% |
| Exp. min_df | `min_df={1,2,3,5,10}`, `C=16` | 0.6172 | gap 42.59 → 34.65 pp; `min_df=10` best on val but std 0.0831 |
| Exp. min_df fine | `min_df={5,8,10,12,15,20}`, `C=16` | 0.6241 | gap 41.71 → 19.97 pp monotonic; val F1 peaks at `min_df=12` |

Evolution of validation toxic F1 across tuning rounds:

- Round 1: `0.01(1,1)→0.1718`, `0.01(1,2)→0.1725`, `0.1(1,1)→0.4134`, `0.1(1,2)→0.3380`, `1.0(1,1)→0.5536`, `1.0(1,2)→0.5362`
- Round 2: `0.25→0.4956`, `0.5→0.5457`, `1.0→0.5536`, `2.0→0.5660`, `4.0→0.5689`
- Round 3: `1.0→0.5536`, `2.0→0.5660`, `4.0→0.5689`, `8.0→0.5699`, `16.0→0.5741`

Controlled overfitting findings (DEV only):

- Lowering C does not fix the gap; the gap grows at low C.
- The gap is dominated by vocabulary size: raising `min_df` is the effective lever.
- `min_df=12` is the sweet spot on validation F1 (0.6241); `min_df>12` reduces the gap further but begins to lower validation F1.

## Preprocessing (TF-IDF)

`TfidfVectorizer` with `min_df=12`, `max_features=None`, `ngram_range=(1,1)`, default sublinear/analyzer settings, fitted per fold on training text only (vocabulary sizes 164 / 201 / 244).

## Selected configuration (final)

`C=16.0`, `loss="squared_hinge"`, `min_df=12`, `max_features=None`, `ngram_range=(1,1)`, `random_state=42`, `max_iter=1000`. No threshold tuning, no resampling, no `class_weight`.

This is the **best configuration observed on DEV**, not a global optimum.

| Aggregate validation metric | Value |
|---|---:|
| Toxic F1 mean / std | 0.6241 / 0.0851 |
| Toxic F1 min / max | 0.5210 / 0.7295 |
| Toxic precision / recall | 0.6237 / 0.6277 |
| Macro-F1 / accuracy | 0.6429 / 0.6552 |
| Train toxic F1 | 0.9000 |
| Train-validation gap | 27.60 pp |

| Fold | Train / validation rows | Train / validation videos | Toxic F1 | Precision | Recall | Macro-F1 | Accuracy | Confusion matrix `[[TN,FP],[FN,TP]]` | Vocabulary |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 490 / 318 | 6 / 3 | 0.5210 | 0.4844 | 0.5636 | 0.6173 | 0.6415 | `[[142,66],[48,62]]` | 164 |
| 2 | 524 / 284 | 7 / 2 | 0.6217 | 0.6194 | 0.6241 | 0.6431 | 0.6444 | `[[100,51],[50,83]]` | 201 |
| 3 | 602 / 206 | 5 / 4 | 0.7295 | 0.7672 | 0.6953 | 0.6683 | 0.6796 | `[[51,27],[39,89]]` | 244 |

## Comparison with baseline and Dummy

Selected configuration versus common baseline (`C=1.0`, `min_df=1`, `ngram=(1,2)`): toxic F1 `+8.79 pp`, standard deviation `+7.06 pp` (fold variance grows with `min_df`), minimum fold F1 `+0.46 pp`, maximum fold F1 `+17.88 pp`, toxic precision `+0.43 pp`, toxic recall `+11.41 pp`, macro-F1 `+5.77 pp`, accuracy `+5.97 pp`, and gap `-18.78 pp` (train F1 drops from 1.0000 to 0.9000, i.e. less memorisation).

| Candidate | Validation toxic F1 | vs final |
|---|---:|---:|
| Dummy (most frequent) | 0.1713 | −45.27 pp |
| Baseline (`C=1`, `min_df=1`, `(1,2)`) | 0.5362 | −8.79 pp |
| Previous selection (`C=16`, `min_df=1`) | 0.5741 | −5.00 pp |
| LinearSVC final (this report) | 0.6241 | — |

## Overfitting assessment

- Improvement **on validation**: `min_df=12` raises validation toxic F1 to 0.6241, the highest LinearSVC result observed on DEV (+5.00 pp over the previous `min_df=1` selection).
- Reduction of the gap: train F1 falls from 1.0000 to 0.9000 and the train-validation gap drops from 42.59 pp to 27.60 pp (−14.99 pp vs previous selection, −18.78 pp vs baseline). The model still memorises substantially and the gap remains far above 5 pp, so overfitting is **reduced but not solved** — no tested configuration closed the gap below 5 pp.
- Fold variance increased (std 0.0851; fold 3 clearly better than folds 1–2), consistent with vocabulary pruning removing shared features across folds.

TEST remains sealed (187 comments, never used); no TEST metrics exist for this or any other configuration.

## Conclusion

`C=16.0` with `min_df=12` and `ngram_range=(1,1)` is the final LinearSVC configuration delivered to the model comparison: it achieves the best validation toxic F1 observed for LinearSVC on DEV (0.6241) while visibly reducing overfitting (gap 27.60 pp, down from 42.59 pp). The residual gap, the high fold variance, and the grid-edge C value mean this must not be treated as a global optimum or an exhausted search, and it still requires a fair comparison with Dummy, MultinomialNB, LogisticRegression, and SGDClassifier under the same DEV protocol before a single authorised TEST evaluation.