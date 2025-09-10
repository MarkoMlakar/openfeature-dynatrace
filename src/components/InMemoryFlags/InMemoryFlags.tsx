import { useFlag } from "@openfeature/react-sdk";
import { Box, Text, Badge, HStack, Alert } from "@chakra-ui/react";

const NEW_MESSAGE_FLAG = "new-message-in-memory";
export const InMemoryFlags = () => {
  const { value: showNewMessage } = useFlag(NEW_MESSAGE_FLAG, false);

  return (
    <Box p={4} borderWidth="1px" borderRadius="md" bg="white" width="100%">
      <Text fontWeight="semibold" color="blue.600" minW="120px">
        Static In-Memory Provider
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
      </HStack>

      <Box mt={3} textAlign="left">
        <Alert.Root
          status={`${showNewMessage ? "success" : "error"}`}
          size="sm"
          maxW="fit-content"
        >
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>New In-Memory Message!</Alert.Title>
            <Text fontSize="xs" color="gray.500" mb={2}>
              This element is controlled by the "{NEW_MESSAGE_FLAG}" feature
              flag
            </Text>
          </Alert.Content>
        </Alert.Root>
      </Box>
    </Box>
  );
};
