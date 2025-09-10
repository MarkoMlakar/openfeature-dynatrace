import {
  ClientProviderStatus,
  JsonValue,
  Provider,
  TrackingEventDetails,
  StandardResolutionReasons,
  type EvaluationContext,
  type Logger,
  type Paradigm,
  type ProviderMetadata,
  type ResolutionDetails,
} from "@openfeature/react-sdk";

interface FlagConfig {
  state: "ENABLED" | "DISABLED";
  defaultVariant: string;
  variants: Record<string, boolean>;
}

interface StaticJsonConfig {
  flags: Record<string, FlagConfig>;
}

// StaticJsonProvider loads feature flag definitions from a static JSON file at build time.
// It implements the OpenFeature Provider interface for static, file-based flag evaluation.
export class StaticJsonProvider implements Provider {
  runsOn: Paradigm = "client";
  config: StaticJsonConfig | null = null;
  status?: ClientProviderStatus | undefined;

  async initialize?(_context?: EvaluationContext): Promise<void> {
    try {
      const { default: staticJsonConfig } = await import(
        "./staticJsonFlags.json"
      );
      if (!staticJsonConfig || typeof staticJsonConfig !== "object") {
        throw new Error("Invalid static JSON configuration");
      }
      this.config = staticJsonConfig as StaticJsonConfig;

      if (!this.config.flags || typeof this.config.flags !== "object") {
        throw new Error("No flags found in configuration");
      }
      this.status = ClientProviderStatus.READY;

      const flagCount = Object.keys(this.config.flags).length;
      console.log(
        `StaticJsonProvider initialized successfully with ${flagCount} flags:`,
        Object.keys(this.config.flags)
      );
    } catch (error) {
      this.status = ClientProviderStatus.ERROR;
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(`Failed to initialize StaticJsonProvider: ${errorMessage}`);
      throw error;
    }
  }
  metadata: ProviderMetadata = {
    name: StaticJsonProvider.name,
  };

  resolveBooleanEvaluation(
    flagKey: string,
    defaultValue: boolean,
    _context: EvaluationContext,
    logger: Logger
  ): ResolutionDetails<boolean> {
    if (!this.config) {
      logger.warn(
        `Provider not initialized, returning default value for flag: ${flagKey}`
      );
      return {
        value: defaultValue,
        reason: StandardResolutionReasons.UNKNOWN,
      };
    }

    const flagConfig = this.config.flags[flagKey];
    if (!flagConfig) {
      logger.warn(`Flag not found: ${flagKey}, returning default value`);
      return {
        value: defaultValue,
        reason: StandardResolutionReasons.DEFAULT,
      };
    }

    if (flagConfig.state === "DISABLED") {
      logger.info(`Flag ${flagKey} is disabled, returning default value`);
      return {
        value: defaultValue,
        reason: StandardResolutionReasons.DISABLED,
        variant: flagConfig.defaultVariant,
      };
    }

    const variantValue = flagConfig.variants[flagConfig.defaultVariant];
    const booleanValue =
      typeof variantValue === "boolean" ? variantValue : defaultValue;

    logger.info(
      `Flag ${flagKey} resolved to: ${booleanValue} (variant: ${flagConfig.defaultVariant})`
    );

    return {
      value: booleanValue,
      reason: StandardResolutionReasons.STATIC,
      variant: flagConfig.defaultVariant,
    };
  }

  onContextChange?(
    _oldContext: EvaluationContext,
    _newContext: EvaluationContext
  ): Promise<void> | void {
    // flags are evaluated statically based on the JSON config
  }

  resolveNumberEvaluation(
    _flagKey: string,
    _defaultValue: number,
    _context: EvaluationContext,
    _logger: Logger
  ): ResolutionDetails<number> {
    throw new Error("Method not implemented.");
  }
  resolveObjectEvaluation<T extends JsonValue>(
    _flagKey: string,
    _defaultValue: T,
    _context: EvaluationContext,
    _logger: Logger
  ): ResolutionDetails<T> {
    throw new Error("Method not implemented.");
  }
  track?(
    _trackingEventName: string,
    _context: EvaluationContext,
    _trackingEventDetails: TrackingEventDetails
  ): void {
    throw new Error("Method not implemented.");
  }
  resolveStringEvaluation(
    _flagKey: string,
    _defaultValue: string,
    _context: EvaluationContext,
    _logger: Logger
  ): ResolutionDetails<string> {
    throw new Error("Method not implemented.");
  }
}
