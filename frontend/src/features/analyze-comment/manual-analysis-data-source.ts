import type { ManualPrediction, ManualPredictionRequest } from "@/features/analyze-comment/analyze-comment-view-model"

export interface ManualAnalysisDataSource {
  createPrediction(request: ManualPredictionRequest): Promise<ManualPrediction>
}
