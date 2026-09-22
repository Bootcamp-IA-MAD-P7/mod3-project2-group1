# MultinomialNB — Overfitting control experiment (DEV only)

## Scope and protocol

- Model: MultinomialNB with the common TF-IDF preprocessing, replicating the frozen candidate and testing vocabulary-pruning plus smoothing treatments.
- Data: prepared `youtoxic_english_1000.csv`; 995 comments after case-insensitive deduplication. DEV contains 808 comments.
- Holdout: split by `VideoId`. TEST is completely sealed and was not used for fitting, tuning, prediction, metrics, inspection, or this report.
- Validation: `StratifiedGroupKFold(n_splits=3, shuffle=True, random_state=42)` with `VideoId` as groups. Every fold had zero shared videos between train and validation.
- Primary metric: toxic-class F1 on validation. Secondary metrics: precision, recall, macro-F1, accuracy, train F1, train-validation gap, per-fold confusion matrices, vocabulary size, and TF-IDF density.
- Threshold: default classifier threshold; no threshold tuning. No augmentation, resampling, GridSearchCV, Optuna, model bundle, or TEST evaluation.

## Environment

| Dependency | Version |
|---|---:|
| Python | 3.13.5 |
| scikit-learn | 1.9.1 |
| pandas | 3.0.5 |

## Frozen configuration (reproduced)

| Check | Historical | Reproduced |
|---|---:|---:|
| Validation toxic F1 mean | 0.5517 | 0.5517 |
| Train-validation gap | 44.69 pp | 44.69 pp |

Training toxic F1 was 0.9987 (memorisation), so the frozen MultinomialNB candidate keeps the worst gap of the four candidates.

## Treatment — min_df sweep (unigrams, alpha=0.01)

Applied the same lever that reduced overfitting in LinearSVC (PR #61), SGDClassifier (PR #61) and LogisticRegression (PR #64): `ngram_range=(1,1)` with increasing `min_df`.

| min_df | Train F1 | Validation F1 | Gap (pp) |
|---|---:|---:|---:|
| 1 | 0.9891 | 0.5601 | 42.89 |
| 2 | 0.9606 | 0.5287 | 43.19 |
| 3 | 0.9274 | 0.5136 | 41.38 |
| 5 | 0.8753 | 0.5256 | 34.98 |
| 8 | 0.8204 | 0.5084 | 31.20 |
| 10 | 0.7878 | 0.5231 | 26.47 |
| 12 | 0.7669 | 0.5267 | 24.02 |
| 15 | 0.7252 | 0.5029 | 22.23 |
| 20 | 0.6872 | 0.4667 | 22.04 |

`min_df` alone halves the gap (42.89 -> 24.02 pp at `min_df=12`) and brings training F1 down to a plausible level (0.7669). Unlike the discriminative models, pruning slightly lowers validation F1 for Naive Bayes (best unigram at `min_df=1`: 0.5601 vs `min_df=12`: 0.5267), so the selection kept `min_df=12` as the best overfitting-aware balance within a 10 % relative validation-F1 band of the best candidate.

## Treatment — alpha smoothing (min_df=12, unigrams)

| alpha | Train F1 | Validation F1 | Gap (pp) |
|---|---:|---:|---:|
| 0.1 | 0.7632 | 0.5207 | 24.25 |
| 0.5 | 0.7525 | 0.5012 | 25.13 |
| 1.0 | 0.7385 | 0.4726 | 26.59 |

Larger `alpha` did not help: it lowers validation F1 and slightly widens the gap. The frozen `alpha=0.01` remains the best smoothing for this candidate.

## Selected configuration

`alpha=0.01`, `min_df=12`, `max_features=None`, `ngram_range=(1,1)`, no augmentation.

This is the **best overfitting-aware configuration observed on DEV**, not a global optimum.

| Aggregate validation metric | Value |
|---|---:|
| Toxic F1 mean / std | 0.5267 / 0.0639 |
| Toxic F1 min / max | 0.4637 / 0.6017 |
| Toxic precision / recall | 0.6080 / 0.5063 |
| Macro-F1 / accuracy | 0.5913 / 0.6284 |
| Train toxic F1 | 0.7669 |
| Train-validation gap | 24.02 pp |
| Gap reduction vs frozen | 20.67 pp |

| Fold | Train / validation rows | Train / validation videos | Toxic F1 train / validation | Precision | Recall | Macro-F1 | Accuracy | Confusion matrix `[[TN,FP],[FN,TP]]` | Vocabulary | Train / validation density |
|---:|---:|---:|---:|---:|---:|---:|---:|---|---:|---:|
| 1 | 490 / 318 | 6 / 3 | 0.7402 / 0.4637 | 0.4179 | 0.6818 | 0.6095 | 0.6289 | `[[135,73],[35,75]]` | 172 | 4.55% / 4.66% |
| 2 | 524 / 284 | 7 / 2 | 0.7824 / 0.5144 | 0.6415 | 0.4962 | 0.6128 | 0.6367 | `[[117,34],[67,66]]` | 189 | 4.63% / 3.59% |
| 3 | 602 / 206 | 5 / 4 | 0.7570 / 0.6017 | 0.7646 | 0.5039 | 0.5516 | 0.6204 | `[[55,23],[64,64]]` | 215 | 3.73% / 2.39% |

The exact train and validation `VideoId` sets, all metrics, and the explicit empty overlap checks are stored in [`multinomial_nb_overfitting_dev.json`](multinomial_nb_overfitting_dev.json).

## Overfitting assessment

- Gap reduced from **44.69 pp (frozen)** to **24.02 pp**, on par with the treated candidates (LogisticRegression 24.58 pp, SGDClassifier 23.53 pp, LinearSVC 27.60 pp).
- Training F1 drops from 0.9987 to 0.7669: the model stops memorising the training texts.
- This is **reduction of overfitting, not elimination of it**: no configuration closed the gap below the 5 pp gate (ML-03), so the candidate still cannot be promoted to TEST.
- Residual gap is structural: 808 DEV samples across only nine `VideoId` groups.

| Candidate | Best gap (pp) | Method |
|---|---:|---|
| MultinomialNB (this run) | 24.02 | min_df=12 + unigrams |
| SGDClassifier | 23.53 | min_df=12 + alpha=0.0005 |
| LogisticRegression | 24.58 | min_df=12 |
| LinearSVC | 27.60 | min_df=12 |

## Limitations

- DEV has only nine `VideoId` groups and substantial video-level distribution shift.
- MultinomialNB is evaluated on sublinear TF-IDF features, which violate the multinomial-count assumption; its scores are not calibrated probabilities.
- Unlike the discriminative candidates, pruning slightly lowers validation F1 for Naive Bayes; the selection is an overfitting-aware trade-off, not a validation-F1 optimum.
- No threshold tuning, augmentation, resampling, or TEST evaluation was performed. TEST remains sealed.
- This result is DEV-only; it must later be compared fairly with Dummy, LogisticRegression, LinearSVC, and SGDClassifier under the same DEV protocol before one candidate is frozen for a single authorised TEST evaluation.