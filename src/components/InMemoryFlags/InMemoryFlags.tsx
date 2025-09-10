import { useFlag } from "@openfeature/react-sdk";

const NEW_MESSAGE_FLAG = "new-message-in-memory";
export const InMemoryFlags = () => {
  const { value: showNewMessage } = useFlag(NEW_MESSAGE_FLAG, false);

  const flagStatusText = `${NEW_MESSAGE_FLAG} flag: ${
    showNewMessage ? "Enabled" : "Disabled"
  }`;
  const flagValueText = `Flag value: ${showNewMessage.toString()}`;

  return (
    <div style={{ border: "1px solid", padding: "10px" }}>
      <h2>In-Memory</h2>
      <div>
        <p>{flagStatusText}</p>
      </div>
      <div>
        <p>{flagValueText}</p>
      </div>
      {showNewMessage && (
        <h4 style={{ color: "green" }}>New Message from in-memory! :)</h4>
      )}
    </div>
  );
};
