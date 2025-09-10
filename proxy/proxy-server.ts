import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { ToggleFlagRequest, ApiResponse, CustomError, Config } from "./types";
import {
  sendToDynatrace,
  readFlagConfig,
  writeFlagConfig,
  updateFlagValue,
} from "./utils";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Configuration
const CONFIG: Config = {
  PORT: 3001,
  FLAGD_CONFIG_PATH: path.join(
    __dirname,
    "../flagd-provider/flags/demo.flagd.json"
  ),
  DYNATRACE_ENDPOINT: process.env.VITE_DYNATRACE_ENDPOINT,
  DYNATRACE_TOKEN: process.env.VITE_DYNATRACE_API_TOKEN,
};

const handleError = (
  error: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(`${req.method} ${req.path} - Error:`, error.message);

  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";

  const response: ApiResponse = {
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
  };

  res.status(statusCode).json(response);
};

// Express app setup
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Dynatrace logs endpoint
app.post(
  "/api/v2/logs/ingest",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Sending logs to Dynatrace...");

      const logData = req.body;
      await sendToDynatrace(logData, CONFIG);

      const response: ApiResponse = {
        success: true,
        message: "Log sent to Dynatrace successfully",
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      next(error as CustomError);
    }
  }
);

// Flag toggle endpoint
app.post(
  "/api/toggle-flag",
  async (
    req: Request<ToggleFlagRequest>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { flagKey, defaultVariant } = req.body;

      // Input validation
      if (!flagKey || !defaultVariant) {
        const error: CustomError = new Error(
          "Missing required fields: flagKey and defaultVariant"
        );
        error.statusCode = 400;
        throw error;
      }

      const config = await readFlagConfig(CONFIG.FLAGD_CONFIG_PATH);
      const updatedConfig = updateFlagValue(config, flagKey, defaultVariant);
      await writeFlagConfig(updatedConfig, CONFIG.FLAGD_CONFIG_PATH);

      const response: ApiResponse<{ flagKey: string; defaultVariant: string }> =
        {
          success: true,
          message: `Flag '${flagKey}' toggled to '${defaultVariant}'`,
          data: {
            flagKey,
            defaultVariant,
          },
          timestamp: new Date().toISOString(),
        };

      res.json(response);
    } catch (error) {
      next(error as CustomError);
    }
  }
);

app.use(handleError);

const startServer = (): void => {
  try {
    if (!CONFIG.DYNATRACE_ENDPOINT || !CONFIG.DYNATRACE_TOKEN) {
      throw new Error(
        "Missing Dynatrace configuration. Please check your .env file."
      );
    }

    app.listen(CONFIG.PORT, () => {
      console.log(`Proxy server running on http://localhost:${CONFIG.PORT}`);
      console.log(`Dynatrace endpoint: ${CONFIG.DYNATRACE_ENDPOINT}`);
      console.log(`Flag config path: ${CONFIG.FLAGD_CONFIG_PATH}`);
    });
  } catch (error) {
    console.error("Failed to start server:", (error as Error).message);
    process.exit(1);
  }
};

// Start the server
startServer();
