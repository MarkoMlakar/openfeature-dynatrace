import {
  useBooleanFlagValue,
  useOpenFeatureClientStatus,
  useSuspenseFlag,
} from "@openfeature/react-sdk";
import { Suspense } from "react";
import { SimpleLog } from "../../SimpleLog";

const NEW_MESSAGE_FLAG = "new-message";
const SIMPLE_LOG_FLAG = "dynatrace-simple-log";

const FlagdFallbackContent = () => {
  return (
    <div>
      <p>Waiting for flagd provider to be ready...</p>
      <p>This component will suspend until the provider is fully loaded.</p>
    </div>
  );
};

export const FlagdFlags = () => {
  const { value: showNewMessage, reason } = useSuspenseFlag(
    NEW_MESSAGE_FLAG,
    false
  );
  const showSimpleLog = useBooleanFlagValue(SIMPLE_LOG_FLAG, false);
  const providerStatus = useOpenFeatureClientStatus();

  const flagStatusText = `${NEW_MESSAGE_FLAG} flag: ${
    showNewMessage ? "Enabled" : "Disabled"
  }`;
  const flagValueText = `Flag value: ${showNewMessage.toString()}`;
  const reasonText = `Reason: ${reason}`;
  const providerStatusText = `Provider Status: ${providerStatus}`;

  const toggleFlag = async () => {
    try {
      const newValue = showNewMessage ? "off" : "on";
      await fetch("http://localhost:3001/api/toggle-flag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flagKey: NEW_MESSAGE_FLAG,
          defaultVariant: newValue,
        }),
      });
    } catch (error) {
      console.error("Error toggling flag:", error);
    }
  };

  return (
    <div style={{ border: "1px solid", padding: "10px" }}>
      <h2>Flagd Provider Flags</h2>
      <Suspense fallback={<FlagdFallbackContent />}>
        <div>
          <div>
            <p>{flagStatusText}</p>
          </div>
          <div>
            <p>{flagValueText}</p>
          </div>
          <div>
            <p>{reasonText}</p>
          </div>
          <div>
            <p>{providerStatusText}</p>
          </div>

          {showNewMessage && (
            <h4 style={{ color: "blue" }}>New Message from Flagd!</h4>
          )}

          <div style={{ marginTop: "20px" }}>
            <button
              onClick={toggleFlag}
              style={{
                backgroundColor: showNewMessage ? "red" : "green",
              }}
            >
              {showNewMessage ? "Disable Flag" : "Enable Flag"}
            </button>
          </div>
        </div>
        {showSimpleLog && <SimpleLog />}
      </Suspense>
    </div>
  );
};
