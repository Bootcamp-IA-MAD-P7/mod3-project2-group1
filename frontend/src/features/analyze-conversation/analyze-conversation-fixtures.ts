import type { ConversationScenario } from "@/features/analyze-conversation/analyze-conversation-view-model"

const completedResults = [
  {
    commentId: "demo-comment-001",
    ordinal: 1,
    text: "This community is stronger when people listen before replying.",
    prediction: { label: "non_hate" as const, score: null, scoreKind: "unavailable" as const, modelVersion: "demo-model-v1", reviewRequired: true as const },
  },
  {
    commentId: "demo-comment-002",
    ordinal: 2,
    text: "People like you should not be welcome here.",
    prediction: { label: "hate" as const, score: null, scoreKind: "unavailable" as const, modelVersion: "demo-model-v1", reviewRequired: true as const },
  },
  {
    commentId: "demo-comment-003",
    ordinal: 3,
    text: "I disagree, but I appreciate the perspective shared in this video.",
    prediction: { label: "non_hate" as const, score: null, scoreKind: "unavailable" as const, modelVersion: "demo-model-v1", reviewRequired: true as const },
  },
] satisfies ConversationScenario["results"] extends infer ResultPage | null
  ? ResultPage extends { items: infer Items }
    ? Items
    : never
  : never

export const DEMONSTRATION_VIDEO_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"

export const CONVERSATION_SCENARIOS: ConversationScenario[] = [
  {
    id: "queued",
    label: "Queued",
    description: "The analysis request is accepted and waiting to begin.",
    job: {
      status: "queued",
      videoId: "dQw4w9WgXcQ",
      fetchedCount: 0,
      analyzedCount: 0,
      counts: { hate: 0, nonHate: 0 },
      truncated: false,
      stopReason: null,
      errorMessage: null,
      expiresAt: "2026-09-19T15:30:00Z",
    },
    results: null,
  },
  {
    id: "processing",
    label: "Processing",
    description: "Comments are being obtained and classified.",
    job: {
      status: "processing",
      videoId: "dQw4w9WgXcQ",
      fetchedCount: 38,
      analyzedCount: 26,
      counts: { hate: 6, nonHate: 20 },
      truncated: false,
      stopReason: null,
      errorMessage: null,
      expiresAt: "2026-09-19T15:30:00Z",
    },
    results: null,
  },
  {
    id: "completed",
    label: "Completed",
    description: "A completed demonstration with a compact first results page.",
    job: {
      status: "completed",
      videoId: "dQw4w9WgXcQ",
      fetchedCount: 64,
      analyzedCount: 64,
      counts: { hate: 14, nonHate: 50 },
      truncated: false,
      stopReason: "source_exhausted",
      errorMessage: null,
      expiresAt: "2026-09-19T15:30:00Z",
    },
    results: { items: completedResults, nextCursor: "demo-next-page" },
  },
  {
    id: "partial",
    label: "Partial",
    description: "Some comments were analyzed before a quota-related stop.",
    job: {
      status: "partial",
      videoId: "dQw4w9WgXcQ",
      fetchedCount: 100,
      analyzedCount: 72,
      counts: { hate: 18, nonHate: 54 },
      truncated: false,
      stopReason: "quota_exceeded",
      errorMessage: "The source stopped before every obtained comment could be analyzed.",
      expiresAt: "2026-09-19T15:30:00Z",
    },
    results: { items: completedResults, nextCursor: "demo-next-page" },
  },
  {
    id: "failed",
    label: "Failed",
    description: "A recoverable source failure with no analysis results.",
    job: {
      status: "failed",
      videoId: "dQw4w9WgXcQ",
      fetchedCount: 0,
      analyzedCount: 0,
      counts: { hate: 0, nonHate: 0 },
      truncated: false,
      stopReason: "upstream_error",
      errorMessage: "Comments could not be obtained. You can start a new analysis later.",
      expiresAt: "2026-09-19T15:30:00Z",
    },
    results: null,
  },
  {
    id: "expired",
    label: "Expired",
    description: "An expired resource that must be analyzed again.",
    job: null,
    results: null,
  },
  {
    id: "completed",
    label: "Truncated",
    description: "A completed analysis that reached its requested comment limit.",
    job: {
      status: "completed",
      videoId: "dQw4w9WgXcQ",
      fetchedCount: 100,
      analyzedCount: 100,
      counts: { hate: 25, nonHate: 75 },
      truncated: true,
      stopReason: "limit_reached",
      errorMessage: null,
      expiresAt: "2026-09-19T15:30:00Z",
    },
    results: { items: completedResults, nextCursor: null },
  },
]

export const SUBMITTING_SCENARIO: ConversationScenario = {
  id: "submitting",
  label: "Submitting",
  description: "Preparing the analysis request. A future API connection will create the temporary analysis resource.",
  job: null,
  results: null,
}

export const INITIAL_CONVERSATION_GUIDANCE =
  "CIVIKA analyzes the main comments associated with a YouTube video. Each comment is reviewed individually as Hate or Non-hate."
