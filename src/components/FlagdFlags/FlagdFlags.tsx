import {
  useBooleanFlagDetails,
  useOpenFeatureClientStatus,
} from "@openfeature/react-sdk";

const NEW_MESSAGE_FLAG = "new-message";

const FlagdContent = () => {
  const { value: showNewMessage, reason } = useBooleanFlagDetails(
    NEW_MESSAGE_FLAG,
    false
  );
  const providerStatus = useOpenFeatureClientStatus();

  const flagStatusText = `${NEW_MESSAGE_FLAG} flag: ${
    showNewMessage ? "Enabled" : "Disabled"
  }`;
  const flagValueText = `Flag value: ${showNewMessage.toString()}`;
  const reasonText = `Reason: ${reason}`;
  const providerStatusText = `Provider Status: ${providerStatus}`;

  return (
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
    </div>
  );
};

export const FlagdFlags = () => {
  return (
    <div style={{ border: "1px solid", padding: "10px" }}>
      <h2>Flagd Provider Flags</h2>
      <FlagdContent />
    </div>
  );
};
