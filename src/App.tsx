import {
  OpenFeatureProvider,
  OpenFeature,
  InMemoryProvider,
} from "@openfeature/react-sdk";
import { InMemoryFlags } from "./components/InMemoryFlags/InMemoryFlags";
import "./App.css";
import { StaticJSONFlags } from "./components/StaticJSONFlags/StaticJSONFlags";
import { StaticJsonProvider } from "./openFeature/providers/StaticJsonProvider";

const flagConfig = {
  "new-message": {
    disabled: false,
    variants: {
      on: true,
      off: false,
    },
    defaultVariant: "on",
  },
};

const IN_MEMORY_PROVIDER_DOMAIN = "in-memory";
const STATIC_JSON_PROVIDER_DOMAIN = "static-json";

OpenFeature.setProvider(
  IN_MEMORY_PROVIDER_DOMAIN,
  new InMemoryProvider(flagConfig)
);

OpenFeature.setProvider(STATIC_JSON_PROVIDER_DOMAIN, new StaticJsonProvider());

function App() {
  return (
    <>
      <OpenFeatureProvider domain={IN_MEMORY_PROVIDER_DOMAIN}>
        <InMemoryFlags />
      </OpenFeatureProvider>
      <OpenFeatureProvider domain={STATIC_JSON_PROVIDER_DOMAIN}>
        <StaticJSONFlags />
      </OpenFeatureProvider>
    </>
  );
}

export default App;
