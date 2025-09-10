export interface ToggleFlagRequest {
  flagKey: string;
  defaultVariant: string;
}

export interface FlagConfig {
  flags: Record<
    string,
    {
      state: string;
      variants: Record<string, boolean>;
      defaultVariant: string;
    }
  >;
}

export interface LogData {
  content: string;
  "log.source": string;
  timestamp: string;
  "service.name": string;
  operation: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface CustomError extends Error {
  statusCode?: number;
}

export interface Config {
  PORT: number;
  FLAGD_CONFIG_PATH: string;
  DYNATRACE_ENDPOINT: string | undefined;
  DYNATRACE_TOKEN: string | undefined;
}
