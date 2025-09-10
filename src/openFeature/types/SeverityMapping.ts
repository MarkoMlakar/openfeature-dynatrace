import {
  StandardResolutionReasons,
  type EvaluationDetails,
  type FlagValue,
} from "@openfeature/web-sdk";

export type SeverityLevel = "info" | "warning" | "error";

export function mapToSeverity(
  evaluationDetails: EvaluationDetails<FlagValue>
): SeverityLevel {
  if (
    evaluationDetails.reason === StandardResolutionReasons.ERROR ||
    evaluationDetails.errorCode
  ) {
    return "error";
  }
  if (evaluationDetails.reason === StandardResolutionReasons.DEFAULT) {
    return "warning";
  }
  return "info";
}
