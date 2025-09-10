import { OpenFeature, InMemoryProvider } from "@openfeature/react-sdk";
import { FlagdWebProvider } from "@openfeature/flagd-web-provider";
import { StaticJsonProvider } from "./openFeature/providers/StaticJsonProvider";
import { initializeOpenTelemetry } from "./openTelemetry/otel-config";
import { FlagChangeLoggingHook } from "./openFeature/hooks";

const IN_MEMORY_PROVIDER_DOMAIN = "in-memory";
const STATIC_JSON_PROVIDER_DOMAIN = "static-json";
const FLAGD_PROVIDER_DOMAIN = "flagd";

export function initFlags() {
  // always re-initialize static providers to pick up file changes
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

  // don't re-initialize dynamic providers as they handle the file channges

  if (
    OpenFeature.getProvider(FLAGD_PROVIDER_DOMAIN).metadata.name !== "flagd"
  ) {
    console.log(
      "provider: ",
      OpenFeature.getProvider(FLAGD_PROVIDER_DOMAIN).metadata.name
    );
    console.log("FLAG D PROVIDER: ", FlagdWebProvider.name);
    OpenFeature.setProvider(
      FLAGD_PROVIDER_DOMAIN,
      new FlagdWebProvider({
        host: "localhost",
        port: 8013,
        tls: false,
      })
    );
  }
  // add a global hook to listen to flag changes (only once)
  if (OpenFeature.getHooks().length === 0) {
    OpenFeature.addHooks(new FlagChangeLoggingHook());
  }
}

initFlags();
initializeOpenTelemetry();
