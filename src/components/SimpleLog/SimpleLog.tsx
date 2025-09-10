import { useState } from "react";
import { Box, Text, Button, HStack, Alert, Badge } from "@chakra-ui/react";
import type { DynatraceLogData } from "../../types/LogData";

const apiToken = import.meta.env.VITE_DYNATRACE_API_TOKEN;

interface SimpleLogProps {
  flagKey: string;
  isFlagEnabled: boolean;
}

export const SimpleLog = ({ flagKey, isFlagEnabled }: SimpleLogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  const sendLog = async () => {
    setIsLoading(true);
    setResult("");

    try {
      // Use proxy to avoid CORS issues
      const endpoint = "http://localhost:3001/api/v2/logs/ingest";

      // Create log data using the DynatraceLogData interface
      const logData: DynatraceLogData = {
        content:
          "Button clicked in React app to make a simple log to Dynatrace",
        timestamp: new Date().toISOString(),
        severity: "info",
        "feature.flag.name": "simple-log-test",
        "feature.flag.previous_value": "unknown",
        "feature.flag.current_value": "clicked",
        "feature.flag.variant": "default",
        "context.targeting_key": "simple-log-user",
        "log.source": "react-app",
        "service.name": "open-feature-dynatrace",
        operation: "button_click",
      };

      // Send to Dynatrace
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Api-Token ${apiToken}`,
        },
        body: JSON.stringify([logData]), // Wrap in array as Dynatrace expects
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
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="md"
      bg="blue.50"
      borderColor="blue.200"
      mt={3}
    >
      <Text fontWeight="semibold" color="blue.600" minW="120px">
        Test connection to Dynatrace
      </Text>
      <HStack justify="flex-start" align="center" gap={2} wrap="wrap">
        <Badge colorPalette="purple" variant="outline">
          {flagKey}
        </Badge>

        <Badge colorPalette={isFlagEnabled ? "green" : "red"}>
          {isFlagEnabled ? "Enabled" : "Disabled"}
        </Badge>

        <Text fontSize="sm" color="gray.600">
          Value: {isFlagEnabled.toString()}
        </Text>

        <Button onClick={sendLog} size="sm" backgroundColor="blue.600">
          {isLoading ? "Sending..." : "Send Log to Dynatrace"}
        </Button>
      </HStack>

      <Text fontSize="xs" color="gray.500" mb={2}>
        This component is controlled by the "dynatrace-simple-log" feature flag
      </Text>

      {result && (
        <Box mt={3}>
          <Alert.Root
            status={result.includes("Error") ? "error" : "success"}
            size="sm"
          >
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>{result}</Alert.Title>
            </Alert.Content>
          </Alert.Root>
        </Box>
      )}
    </Box>
  );
};
