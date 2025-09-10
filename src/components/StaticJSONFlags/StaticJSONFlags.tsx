import { useFlag } from "@openfeature/react-sdk";

const NEW_MESSAGE_FLAG = "new-message-static-json";

export const StaticJSONFlags = () => {
  const { value: showNewMessage } = useFlag(NEW_MESSAGE_FLAG, false);
  const flagStatusText = `${NEW_MESSAGE_FLAG} flag: ${
    showNewMessage ? "Enabled" : "Disabled"
  }`;
  const flagValueText = `Flag value: ${showNewMessage.toString()}`;

  return (
    <div style={{ border: "1px solid", padding: "10px" }}>
      <h2>Static JSON Flags</h2>
      <div>
        <p>{flagStatusText}</p>
      </div>
      <div>
        <p>{flagValueText}</p>
      </div>
      {showNewMessage && (
        <h4 style={{ color: "green" }}>New Message from Static JSON! :)</h4>
      )}
    </div>
  );
};
