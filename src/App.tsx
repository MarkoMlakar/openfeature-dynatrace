import {
  OpenFeatureProvider,
  OpenFeature,
  InMemoryProvider,
} from "@openfeature/react-sdk";
import { InMemoryFlags } from "./components/InMemoryFlags/InMemoryFlags";
import "./App.css";
import { StaticJSONFlags } from "./components/StaticJSONFlags/StaticJSONFlags";
import { FlagdFlags } from "./components/FlagdFlags/FlagdFlags";
import { StaticJsonProvider } from "./openFeature/providers/StaticJsonProvider";
import { FlagdWebProvider } from "@openfeature/flagd-web-provider";

const IN_MEMORY_PROVIDER_DOMAIN = "in-memory";
const STATIC_JSON_PROVIDER_DOMAIN = "static-json";
const FLAGD_PROVIDER_DOMAIN = "flagd";

// HACK to ensure only one provider will be initialized once per domain
// only run once per runtime (important for hot reload when making changes to the staticJsonFlags.json since it is part of the module graph)
let initialized = false;

export function initFlags() {
  if (initialized) return;
  initialized = true;

  OpenFeature.setProvider(
    IN_MEMORY_PROVIDER_DOMAIN,
    new InMemoryProvider({
      "new-message": {
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

function App() {
  return (
    <>
      <OpenFeatureProvider domain={IN_MEMORY_PROVIDER_DOMAIN}>
        <InMemoryFlags />
      </OpenFeatureProvider>
      <OpenFeatureProvider domain={STATIC_JSON_PROVIDER_DOMAIN}>
        <StaticJSONFlags />
      </OpenFeatureProvider>
      <OpenFeatureProvider domain={FLAGD_PROVIDER_DOMAIN}>
        <FlagdFlags />
      </OpenFeatureProvider>
    </>
  );
}

export default App;
