import { useFlag } from "@openfeature/react-sdk";

const NEW_MESSAGE_FLAG = "new-message";
export const InMemoryFlags = () => {
  const { value: showNewMessage } = useFlag(NEW_MESSAGE_FLAG, false);

  return (
    <div>
      <div>In Memory Flags</div>
      {showNewMessage && <h3>New Message :)</h3>}
    </div>
  );
};
