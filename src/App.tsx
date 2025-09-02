import {
  OpenFeatureProvider,
  OpenFeature,
  InMemoryProvider,
} from "@openfeature/react-sdk";
import { InMemoryFlags } from "./components/InMemoryFlags/InMemoryFlags";
import "./App.css";

const flagConfig = {
  "new-message": {
    disabled: false,
    variants: {
      on: true,
      off: false,
    },
    defaultVariant: "off",
  },
};

const IN_MEMORY_PROVIDER_DOMAIN = "in-memory";

OpenFeature.setProvider(
  IN_MEMORY_PROVIDER_DOMAIN,
  new InMemoryProvider(flagConfig)
);

function App() {
  return (
    <>
      <OpenFeatureProvider domain={IN_MEMORY_PROVIDER_DOMAIN}>
        <InMemoryFlags />
      </OpenFeatureProvider>
    </>
  );
}

export default App;
