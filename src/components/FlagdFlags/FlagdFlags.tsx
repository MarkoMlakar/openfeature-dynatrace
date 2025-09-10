import {
  useBooleanFlagValue,
  useOpenFeatureClientStatus,
  useSuspenseFlag,
} from "@openfeature/react-sdk";
import { Suspense } from "react";
import {
  Box,
  Text,
  Badge,
  HStack,
  Alert,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { SimpleLog } from "../SimpleLog/SimpleLog";

const NEW_MESSAGE_FLAG = "new-message-flagd";
const SIMPLE_LOG_FLAG = "dynatrace-simple-log";

const FlagdFallbackContent = () => {
  return (
    <Box p={4} borderWidth="1px" borderRadius="md" bg="white">
      <HStack justify="flex-start" align="center" gap={4}>
        <Text fontWeight="semibold" color="green.600" minW="120px">
          Flagd Provider
        </Text>
        <Spinner size="sm" color="blue.500" />
        <Text fontSize="sm" color="gray.500">
          Loading...
        </Text>
      </HStack>
    </Box>
  );
};

export const FlagdFlags = () => {
  const { value: showNewMessage, reason } = useSuspenseFlag(
    NEW_MESSAGE_FLAG,
    false
  );
  const showSimpleLog = useBooleanFlagValue(SIMPLE_LOG_FLAG, false);
  const providerStatus = useOpenFeatureClientStatus();

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
    <Suspense fallback={<FlagdFallbackContent />}>
      <Box p={4} borderWidth="1px" borderRadius="md" bg="white" width="100%">
        <Text fontWeight="semibold" color="green.600" minW="120px">
          Flagd Provider
        </Text>
        <HStack justify="flex-start" align="center" gap={2} wrap="wrap">
          <Badge colorPalette="purple" variant="outline">
            {NEW_MESSAGE_FLAG}
          </Badge>
          <Badge colorPalette={showNewMessage ? "green" : "red"}>
            {showNewMessage ? "Enabled" : "Disabled"}
          </Badge>
          <Text fontSize="sm" color="gray.600">
            Value: {showNewMessage.toString()}
          </Text>
          <Text fontSize="xs" color="gray.500">
            {String(reason)} | {String(providerStatus)}
          </Text>
          <Button
            onClick={toggleFlag}
            colorPalette={showNewMessage ? "red" : "green"}
            size="sm"
            bg={showNewMessage ? "red.500" : "green.500"}
            color="white"
            _hover={{
              bg: showNewMessage ? "red.600" : "green.600",
            }}
          >
            {showNewMessage ? "Disable" : "Enable"}
          </Button>
        </HStack>

        <Box mt={3} textAlign="left">
          <Box mt={3} textAlign="left">
            <Alert.Root
              status={`${showNewMessage ? "success" : "error"}`}
              size="sm"
              maxW="fit-content"
            >
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>New Flagd Message!</Alert.Title>
                <Text fontSize="xs" color="gray.500" mb={2}>
                  This element is controlled by the "{NEW_MESSAGE_FLAG}" feature
                  flag
                </Text>
              </Alert.Content>
            </Alert.Root>
          </Box>
        </Box>
        <SimpleLog flagKey={SIMPLE_LOG_FLAG} isFlagEnabled={showSimpleLog} />
      </Box>
    </Suspense>
  );
};
