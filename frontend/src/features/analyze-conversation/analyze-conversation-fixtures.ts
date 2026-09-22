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
    labelKey: "conversation.queued",
    descriptionKey: "conversation.scenario.queued",
    job: {
      status: "queued",
      videoId: "dQw4w9WgXcQ",
      fetchedCount: 0,
      analyzedCount: 0,
      counts: { hate: 0, nonHate: 0 },
      truncated: false,
      stopReason: null,
      errorMessageKey: null,
      expiresAt: "2026-09-19T15:30:00Z",
    },
    results: null,
  },
  {
    id: "processing",
    labelKey: "conversation.processing",
    descriptionKey: "conversation.scenario.processing",
    job: {
      status: "processing",
      videoId: "dQw4w9WgXcQ",
      fetchedCount: 38,
      analyzedCount: 26,
      counts: { hate: 6, nonHate: 20 },
      truncated: false,
      stopReason: null,
      errorMessageKey: null,
      expiresAt: "2026-09-19T15:30:00Z",
    },
    results: null,
  },
  {
    id: "completed",
    labelKey: "conversation.completed",
    descriptionKey: "conversation.scenario.completed",
    job: {
      status: "completed",
      videoId: "dQw4w9WgXcQ",
      fetchedCount: 64,
      analyzedCount: 64,
      counts: { hate: 14, nonHate: 50 },
      truncated: false,
      stopReason: "source_exhausted",
      errorMessageKey: null,
      expiresAt: "2026-09-19T15:30:00Z",
    },
    results: { items: completedResults, nextCursor: "demo-next-page" },
  },
  {
    id: "partial",
    labelKey: "conversation.partial",
    descriptionKey: "conversation.scenario.partial",
    job: {
      status: "partial",
      videoId: "dQw4w9WgXcQ",
      fetchedCount: 100,
      analyzedCount: 72,
      counts: { hate: 18, nonHate: 54 },
      truncated: false,
      stopReason: "quota_exceeded",
      errorMessageKey: "conversation.error.partial",
      expiresAt: "2026-09-19T15:30:00Z",
    },
    results: { items: completedResults, nextCursor: "demo-next-page" },
  },
  {
    id: "failed",
    labelKey: "conversation.failed",
    descriptionKey: "conversation.scenario.failed",
    job: {
      status: "failed",
      videoId: "dQw4w9WgXcQ",
      fetchedCount: 0,
      analyzedCount: 0,
      counts: { hate: 0, nonHate: 0 },
      truncated: false,
      stopReason: "upstream_error",
      errorMessageKey: "conversation.error.failed",
      expiresAt: "2026-09-19T15:30:00Z",
    },
    results: null,
  },
  {
    id: "expired",
    labelKey: "conversation.expired",
    descriptionKey: "conversation.scenario.expired",
    job: null,
    results: null,
  },
  {
    id: "completed",
    labelKey: "conversation.truncated",
    descriptionKey: "conversation.scenario.truncated",
    job: {
      status: "completed",
      videoId: "dQw4w9WgXcQ",
      fetchedCount: 100,
      analyzedCount: 100,
      counts: { hate: 25, nonHate: 75 },
      truncated: true,
      stopReason: "limit_reached",
      errorMessageKey: null,
      expiresAt: "2026-09-19T15:30:00Z",
    },
    results: { items: completedResults, nextCursor: null },
  },
]

export const SUBMITTING_SCENARIO: ConversationScenario = {
  id: "submitting",
  labelKey: "conversation.starting",
  descriptionKey: "conversation.scenario.submitting",
  job: null,
  results: null,
}

export const INITIAL_CONVERSATION_GUIDANCE =
  "CIVIKA analyzes the main comments associated with a YouTube video. Each comment is reviewed individually as Hate or Non-hate."
