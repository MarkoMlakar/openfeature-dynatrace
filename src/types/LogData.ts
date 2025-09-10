import type { SeverityLevel } from "../openFeature/types/SeverityMapping";

export interface DynatraceLogData {
  content: string;
  timestamp: string;
  severity: SeverityLevel;
  operation: string;
  "feature.flag.name": string;
  "feature.flag.previous_value": string;
  "feature.flag.current_value": string;
  "feature.flag.variant": string;
  "context.targeting_key": string;
  "log.source": string;
  "service.name": string;
}
