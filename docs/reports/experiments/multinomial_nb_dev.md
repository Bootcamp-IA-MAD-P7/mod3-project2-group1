# MultinomialNB — DEV evidence completion

## Scope and protocol

- Model: MultinomialNB with the common TF-IDF preprocessing.
- Configuration reproduced: `alpha=0.01`, `ngram_range=(1,2)`, `min_df=1`, `max_features=None`.
- Data: prepared `youtoxic_english_1000.csv`; 995 comments after case-insensitive deduplication. DEV contains 808 comments.
- TEST: sealed. This run creates only the DEV dataframe by excluding the fixed holdout `VideoId`s. TEST was not fitted, tuned, predicted, evaluated, or inspected.
- Validation: `StratifiedGroupKFold(n_splits=3, shuffle=True, random_state=42)` grouped by `VideoId`. Every fold had zero overlapping videos.
- Primary metric: toxic-class F1 mean on validation. Secondary metrics: toxic precision and recall, macro-F1, accuracy, train F1, train-validation gap, per-fold confusion matrices, vocabulary size, and TF-IDF density.
- No alpha search, augmentation, resampling, threshold tuning, GridSearchCV, Optuna, or TEST evaluation was performed.

## Environment

| Dependency | Version |
|---|---:|
| Python | 3.12.14 |
| scikit-learn | 1.9.1 |
| pandas | 3.0.5 |

## Historical selection and reproduction control

The historical US-11 tuning selected `alpha=0.01` from `{0.0001, 0.001, 0.01, 0.1}` using DEV grouped CV. Its historical validation toxic F1 was 0.5517, with fold F1 values 0.5263, 0.5217, and 0.6071.

This evidence-completion run evaluated only that frozen configuration. It reproduced the historical result within a tolerance of 0.0001 before this report and JSON artifact were written.

| Check | Historical | Reproduced |
|---|---:|---:|
| Validation toxic F1 mean | 0.5517 | 0.5517 |
| Fold 1 toxic F1 | 0.5263 | 0.5263 |
| Fold 2 toxic F1 | 0.5217 | 0.5217 |
| Fold 3 toxic F1 | 0.6071 | 0.6071 |

## Selected configuration

`alpha=0.01`, `ngram_range=(1,2)`, `min_df=1`, `max_features=None`, with original DEV data and no augmentation.

This is the historically selected configuration reproduced on DEV. It is not a new tuning result or a global optimum claim.

| Aggregate validation metric | Value |
|---|---:|
| Toxic F1 mean / std | 0.5517 / 0.0392 |
| Toxic F1 min / max | 0.5217 / 0.6071 |
| Toxic precision / recall | 0.5919 / 0.5396 |
| Macro-F1 / accuracy | 0.5869 / 0.5964 |
| Train toxic F1 | 0.9987 |
| Train-validation gap | 44.69 pp |

| Fold | Train / validation rows | Train / validation videos | Toxic F1 train / validation | Precision | Recall | Macro-F1 | Accuracy | Confusion matrix `[[TN,FP],[FN,TP]]` | Vocabulary | Train / validation density |
|---:|---:|---:|---:|---:|---:|---:|---:|---|---:|---:|
| 1 | 490 / 318 | 6 / 3 | 0.9981 / 0.5263 | 0.4487 | 0.6364 | 0.5929 | 0.6038 | `[[122,86],[40,70]]` | 12,819 | 0.38% / 0.28% |
| 2 | 524 / 284 | 7 / 2 | 0.9979 / 0.5217 | 0.6186 | 0.4511 | 0.5981 | 0.6127 | `[[114,37],[73,60]]` | 15,013 | 0.37% / 0.20% |
| 3 | 602 / 206 | 5 / 4 | 1.0000 / 0.6071 | 0.7083 | 0.5312 | 0.5695 | 0.5728 | `[[50,28],[60,68]]` | 18,585 | 0.33% / 0.12% |

The exact train and validation `VideoId` sets, all metrics, and the explicit empty overlap checks are stored in [`multinomial_nb_dev.json`](multinomial_nb_dev.json).

## Augmentation

The common comparison uses original data with **no augmentation**. The separate US-08 MultinomialNB ablation remains in [`augmentation.md`](augmentation.md); its augmented result is not mixed into the four-model comparison because it changes the fold training data.

## Limitations

DEV has only nine `VideoId` groups and substantial video-level distribution shift. The 44.69 pp train-validation gap is a DEV diagnostic, not a final train-TEST generalization result. A later US-15 decision must compare the four frozen candidate pipelines and define the error-cost criterion before any authorised, one-time TEST evaluation.
