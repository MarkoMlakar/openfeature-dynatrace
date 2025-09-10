import { OpenFeature, InMemoryProvider } from "@openfeature/react-sdk";
import { FlagdWebProvider } from "@openfeature/flagd-web-provider";
import { StaticJsonProvider } from "./openFeature/providers/StaticJsonProvider";
import { initializeOpenTelemetry } from "./openTelemetry/otel-config";

const IN_MEMORY_PROVIDER_DOMAIN = "in-memory";
const STATIC_JSON_PROVIDER_DOMAIN = "static-json";
const FLAGD_PROVIDER_DOMAIN = "flagd";

export function initFlags() {
  // OpenFeature providers
  OpenFeature.setProvider(
    IN_MEMORY_PROVIDER_DOMAIN,
    new InMemoryProvider({
      "new-message-in-memory": {
        disabled: false,
        variants: {
          on: true,
          off: false,
        },
        defaultVariant: "on",
      },
    })
  );

  OpenFeature.setProvider(
    STATIC_JSON_PROVIDER_DOMAIN,
    new StaticJsonProvider()
  );

  OpenFeature.setProvider(
    FLAGD_PROVIDER_DOMAIN,
    new FlagdWebProvider({
      host: "localhost",
      port: 8013,
      tls: false,
    })
  );
}

initFlags();
initializeOpenTelemetry();
