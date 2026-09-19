import type { ConversationJobView, ConversationResultPage } from "@/features/analyze-conversation/analyze-conversation-view-model"

export interface VideoAnalysisRequest {
  youtubeUrl: string
  maxComments?: number
}

export interface AnalysisAccepted {
  analysisId: string
  status: "queued"
  expiresAt: string
}

/**
 * Boundary for the future video-analysis HTTP adapter.
 *
 * This feature currently uses local demonstration fixtures and does not
 * instantiate or implement this interface. The resource token is intentionally
 * passed only to the future adapter, never to presentation components.
 */
export interface ConversationAnalysisDataSource {
  createAnalysis(request: VideoAnalysisRequest): Promise<AnalysisAccepted>
  getAnalysis(analysisId: string, resourceToken: string): Promise<ConversationJobView>
  getResults(analysisId: string, resourceToken: string, cursor?: string): Promise<ConversationResultPage>
}
