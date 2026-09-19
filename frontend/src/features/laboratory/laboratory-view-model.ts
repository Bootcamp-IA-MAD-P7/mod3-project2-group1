export interface ModelMetrics {
  f1: number
  std: number
  precision: number
  recall: number
  macroF1: number
  accuracy: number
  trainValidationGap: number
}

export interface FoldEvidence {
  fold: number
  f1: number
  precision: number
  recall: number
  accuracy: number
  confusionMatrix: [[number, number], [number, number]]
}

export interface ModelEvidence {
  id: "multinomial-nb" | "logistic-regression" | "linear-svc" | "sgd-classifier"
  name: string
  configuration: string
  metrics: ModelMetrics
  folds: FoldEvidence[]
  selected?: boolean
  highestDevF1Observed?: boolean
}

export interface SourceReference {
  label: string
  path: string
  description: string
}
