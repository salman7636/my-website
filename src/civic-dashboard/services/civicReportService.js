export function createReport({
  issueType,
  image,
  location,
  analysis,
}) {
  return {
    id: `CV-${Date.now()}`,

    issueType,

    description:
      analysis?.binStatus ===
      "Empty"
        ? "AI verified that the garbage bin is empty or available."
        : analysis?.binStatus ===
          "Full"
        ? "AI detected a full or overflowing garbage bin."
        : `AI verified ${issueType} from the submitted evidence.`,

    image,

    location,

    analysis,

    status: "Submitted",

    points: Number(
      analysis?.points || 0
    ),

    eligibleForReward:
      Boolean(
        analysis?.eligibleForReward
      ),

    createdAt:
      new Date().toLocaleString(),

    verifiedAt: null,

    assignedAt: null,

    resolvedAt: null,
  };
}