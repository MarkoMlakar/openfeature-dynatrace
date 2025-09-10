import { OpenFeatureProvider } from "@openfeature/react-sdk";
import { InMemoryFlags } from "./components/InMemoryFlags/InMemoryFlags";
import { StaticJSONFlags } from "./components/StaticJSONFlags/StaticJSONFlags";
import { FlagdFlags } from "./components/FlagdFlags/FlagdFlags";
import "./App.css";
import "./init";

const IN_MEMORY_PROVIDER_DOMAIN = "in-memory";
const STATIC_JSON_PROVIDER_DOMAIN = "static-json";
const FLAGD_PROVIDER_DOMAIN = "flagd";

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
