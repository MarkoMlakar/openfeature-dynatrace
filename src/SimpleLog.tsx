import { useState } from "react";

const apiToken = import.meta.env.VITE_DYNATRACE_API_TOKEN;

export const SimpleLog = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  const sendLog = async () => {
    setIsLoading(true);
    setResult("");

    try {
      // Use proxy to avoid CORS issues
      const endpoint = "http://localhost:3001/api/v2/logs/ingest";

      // Create log data
      const logData = {
        content:
          "Button clicked in React app to make a simple log to Dynatrace",
        "log.source": "react-app",
        timestamp: new Date().toISOString(),
        "service.name": "open-feature-dynatrace",
        loglevel: "INFO",
        operation: "button_click",
        "user.action": "button_click",
        "component.name": "SimpleLog",
      };

      // Send to Dynatrace
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Api-Token ${apiToken}`,
        },
        body: JSON.stringify(logData),
      });

      if (response.ok) {
        setResult("Log sent successfully to Dynatrace!");
      } else {
        const errorText = await response.text();
        setResult(`Error: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      setResult(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "20px" }}>
      <h3>Simple Dynatrace Log</h3>
      <p>Click the button to send one log to Dynatrace:</p>
      <button
        onClick={sendLog}
        style={{
          padding: "10px 20px",
          backgroundColor: "blue",
        }}
      >
        {isLoading ? "Sending..." : "Send Log to Dynatrace"}
      </button>
      {result && (
        <div
          style={{
            marginTop: "10px",
          }}
        >
          {result}
        </div>
      )}
    </div>
  );
};
