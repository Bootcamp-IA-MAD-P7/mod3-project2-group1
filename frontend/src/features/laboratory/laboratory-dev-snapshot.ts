import type { ModelEvidence, SourceReference } from "./laboratory-view-model"

/**
 * Static DEV-only snapshot derived from the versioned sources listed below.
 * It intentionally contains no TEST results, TEST-derived values, or runtime API data.
 */
export const LABORATORY_SOURCES: SourceReference[] = [
  { label: "Common DEV comparison", path: "docs/reports/experiments/comparison.md", description: "Four-model DEV comparison and human selection record." },
  { label: "Logistic Regression DEV", path: "docs/reports/experiments/logistic_regression_dev.json", description: "Selected model configuration, folds, tuning, and metrics." },
  { label: "LinearSVC DEV", path: "docs/reports/experiments/linear_svc_dev.json", description: "LinearSVC configuration, folds, and metrics." },
  { label: "SGDClassifier DEV", path: "docs/reports/experiments/sgd_classifier_dev.json", description: "SGDClassifier configuration, folds, and metrics." },
  { label: "MultinomialNB DEV", path: "docs/reports/experiments/multinomial_nb_dev.json", description: "MultinomialNB configuration, folds, and metrics." },
  { label: "Augmentation ablation", path: "docs/reports/experiments/augmentation.md", description: "Separate MultinomialNB train-only augmentation experiment." },
  { label: "Final Logistic artifact metadata", path: "backend/ml/artifacts/logistic_regression_dev_final.metadata.json", description: "DEV-only artifact configuration, runtime, checksum, and training composition." },
]

export const LABORATORY_MODELS: ModelEvidence[] = [
  {
    id: "multinomial-nb", name: "MultinomialNB", configuration: "alpha=0.01 · TF-IDF (1,2) · min_df=1",
    metrics: { f1: 0.5517, std: 0.0392, precision: 0.5919, recall: 0.5396, macroF1: 0.5869, accuracy: 0.5964, trainValidationGap: 44.69 },
    folds: [
      { fold: 1, f1: 0.5263, precision: 0.4487, recall: 0.6364, accuracy: 0.6038, confusionMatrix: [[122, 86], [40, 70]] },
      { fold: 2, f1: 0.5217, precision: 0.6186, recall: 0.4511, accuracy: 0.6127, confusionMatrix: [[114, 37], [73, 60]] },
      { fold: 3, f1: 0.6071, precision: 0.7083, recall: 0.5313, accuracy: 0.5728, confusionMatrix: [[50, 28], [60, 68]] },
    ],
  },
  {
    id: "logistic-regression", name: "Logistic Regression", configuration: "C=5.0 · TF-IDF (1,1) · min_df=2",
    selected: true,
    metrics: { f1: 0.5518, std: 0.0059, precision: 0.6343, recall: 0.5127, macroF1: 0.6049, accuracy: 0.6152, trainValidationGap: 43.05 },
    folds: [
      { fold: 1, f1: 0.552, precision: 0.4929, recall: 0.6273, accuracy: 0.6478, confusionMatrix: [[137, 71], [41, 69]] },
      { fold: 2, f1: 0.559, precision: 0.6667, recall: 0.4812, accuracy: 0.6444, confusionMatrix: [[119, 32], [69, 64]] },
      { fold: 3, f1: 0.5446, precision: 0.7432, recall: 0.4297, accuracy: 0.5534, confusionMatrix: [[59, 19], [73, 55]] },
    ],
  },
  {
    id: "linear-svc", name: "LinearSVC", configuration: "C=16.0 · squared_hinge · TF-IDF (1,1)",
    highestDevF1Observed: true,
    metrics: { f1: 0.5741, std: 0.041, precision: 0.6118, recall: 0.551, macroF1: 0.6091, accuracy: 0.6197, trainValidationGap: 42.59 },
    folds: [
      { fold: 1, f1: 0.5185, precision: 0.4737, recall: 0.5727, accuracy: 0.6321, confusionMatrix: [[138, 70], [47, 63]] },
      { fold: 2, f1: 0.5878, precision: 0.6429, recall: 0.5414, accuracy: 0.6444, confusionMatrix: [[111, 40], [61, 72]] },
      { fold: 3, f1: 0.6161, precision: 0.7188, recall: 0.5391, accuracy: 0.5825, confusionMatrix: [[51, 27], [59, 69]] },
    ],
  },
  {
    id: "sgd-classifier", name: "SGDClassifier", configuration: "log_loss · elasticnet · alpha=0.0001 · TF-IDF (1,2)",
    metrics: { f1: 0.537, std: 0.0134, precision: 0.6223, recall: 0.5136, macroF1: 0.5862, accuracy: 0.5967, trainValidationGap: 46.3 },
    folds: [
      { fold: 1, f1: 0.5415, precision: 0.4491, recall: 0.6818, accuracy: 0.6006, confusionMatrix: [[116, 92], [35, 75]] },
      { fold: 2, f1: 0.5189, precision: 0.6962, recall: 0.4135, accuracy: 0.6408, confusionMatrix: [[127, 24], [78, 55]] },
      { fold: 3, f1: 0.5507, precision: 0.7215, recall: 0.4453, accuracy: 0.5485, confusionMatrix: [[56, 22], [71, 57]] },
    ],
  },
]

export const LABORATORY_OVERVIEW = {
  developmentRows: 808,
  videoGroups: 9,
  preparedRows: 995,
  crossValidation: "StratifiedGroupKFold · 3 folds · grouped by VideoId",
  selectedModel: "Logistic Regression",
  testState: "TEST sealed",
  artifactState: "DEV-only artifact available",
} as const

export const SELECTED_MODEL_DETAILS = {
  classifier: "LogisticRegression(C=5.0, class_weight=None, random_state=42, max_iter=1000)",
  tfidf: "ngram_range=(1,1), min_df=2, max_features=None, stop_words=None, sublinear_tf=True",
  preprocessing: "normalize_text followed by casefold",
  experimentRuntime: "Python 3.12.7 · scikit-learn 1.9.1 · pandas 3.0.5",
  artifactRuntime: "Python 3.12.13 · scikit-learn 1.9.1 · pandas 3.0.5 · joblib 1.6.0",
  artifactSha256: "f707df0e23a0a1ebb24ee12b4acf3dc92e162ba0c8a0cd64df2a7848df14ee53",
  generatedAt: "2026-09-18T11:36:57Z",
  devClassDistribution: "437 non-toxic · 371 toxic",
  limitations: ["808 DEV rows across 9 VideoId groups", "3 grouped folds with video-level distribution shift", "43.05 pp train-validation F1 gap", "TEST did not inform selection or this snapshot"],
} as const

export const LOGISTIC_TUNING = {
  rounds: ["Baseline: F1 toxic 0.3542", "Round 1: 24 configurations; best F1 0.4494", "Round 2: 6 C values; best F1 0.5020", "Round 3: 5 C values; best F1 0.5518"],
  evolution: [
    [0.25, 0.2612], [0.5, 0.3694], [0.75, 0.4156], [1, 0.4494], [1.5, 0.4842],
    [2, 0.502], [2.5, 0.517], [3, 0.5344], [4, 0.5397], [5, 0.5518],
  ],
} as const

export const AUGMENTATION_ABLATION = {
  model: "MultinomialNB · alpha=0.01",
  technique: "Deterministic synonym replacement on fold train data only",
  result: "Mean F1 toxic: 0.5517 control → 0.5576 augmented (+0.5894 pp)",
  conclusion: "A separate DEV-only ablation; it does not modify the selected model or the common comparison.",
} as const
