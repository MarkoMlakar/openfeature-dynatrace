import { promises as fs } from "fs";
import fetch, { Response as FetchResponse } from "node-fetch";
import { Config, LogData, FlagConfig } from "./types";

export const createLogData = (content: string = "REACT-APP"): LogData => ({
  content,
  "log.source": "react-app",
  timestamp: new Date().toISOString(),
  "service.name": "open-feature-dynatrace",
  operation: "button_click",
});

export const sendToDynatrace = async (
  logData: LogData,
  config: Config
): Promise<FetchResponse> => {
  if (!config.DYNATRACE_ENDPOINT || !config.DYNATRACE_TOKEN) {
    throw new Error("Dynatrace configuration not available");
  }
  const response = await fetch(config.DYNATRACE_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Api-Token ${config.DYNATRACE_TOKEN}`,
    },
    body: JSON.stringify(logData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Dynatrace API error: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  return response;
};

export const readFlagConfig = async (
  configPath: string
): Promise<FlagConfig> => {
  try {
    const configContent = await fs.readFile(configPath, "utf8");
    return JSON.parse(configContent) as FlagConfig;
  } catch (error) {
    throw new Error(
      `Failed to read flag configuration: ${(error as Error).message}`
    );
  }
};

export const writeFlagConfig = async (
  config: FlagConfig,
  configPath: string
): Promise<void> => {
  try {
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));
  } catch (error) {
    throw new Error(
      `Failed to write flag configuration: ${(error as Error).message}`
    );
  }
};

export const updateFlagValue = (
  config: FlagConfig,
  flagKey: string,
  defaultVariant: string
): FlagConfig => {
  if (!config.flags?.[flagKey]) {
    throw new Error(`Flag '${flagKey}' not found in configuration`);
  }

  config.flags[flagKey].defaultVariant = defaultVariant;
  return config;
};
