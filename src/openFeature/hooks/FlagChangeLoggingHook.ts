import type {
  Hook,
  HookContext,
  EvaluationDetails,
  FlagValue,
} from "@openfeature/web-sdk";
import type { DynatraceLogData } from "../../types/LogData";
import { mapToSeverity } from "../types/SeverityMapping";

export class FlagChangeLoggingHook implements Hook {
  private previousValues = new Map<string, FlagValue>();

  after(
    hookContext: HookContext,
    evaluationDetails: EvaluationDetails<FlagValue>
  ) {
    const flagKey = hookContext.flagKey;
    const currentValue = evaluationDetails.value;
    const previousValue = this.previousValues.get(flagKey);

    // check if the flag value has changed
    if (previousValue !== undefined && previousValue !== currentValue) {
      const logData: DynatraceLogData = {
        content: `Feature flag '${flagKey}' changed from '${previousValue}' to '${currentValue}' (${evaluationDetails.reason})`,
        timestamp: new Date().toISOString(),
        severity: mapToSeverity(evaluationDetails),
        operation: "flag_change",
        "feature.flag.name": flagKey,
        "feature.flag.previous_value": String(previousValue),
        "feature.flag.current_value": String(currentValue),
        "feature.flag.variant": evaluationDetails.variant || "default",
        "context.targeting_key": hookContext.context?.targetingKey || "unknown",
        "log.source": "open-feature-hook",
        "service.name": "open-feature-dynatrace",
      };

      this.sendToDynatrace(logData);
      console.log("Flag Change Log:", JSON.stringify(logData, null, 2));
    }

    // store the current value for next comparison
    this.previousValues.set(flagKey, currentValue);
  }

  private async sendToDynatrace(logData: DynatraceLogData) {
    try {
      await fetch("http://localhost:3001/api/v2/logs/ingest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([logData]), // dynatrace expects an array of log entries
      });
    } catch (error) {
      console.error("Failed to send flag change to Dynatrace:", error);
    }
  }
}
