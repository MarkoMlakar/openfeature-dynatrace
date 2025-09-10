import { OpenFeatureProvider } from "@openfeature/react-sdk";
import {
  Box,
  Container,
  Heading,
  VStack,
  Text,
  Separator,
  Badge,
  HStack,
} from "@chakra-ui/react";
import { InMemoryFlags } from "./components/InMemoryFlags/InMemoryFlags";
import { StaticJSONFlags } from "./components/StaticJSONFlags/StaticJSONFlags";
import { FlagdFlags } from "./components/FlagdFlags/FlagdFlags";
import "./App.css";
import "./init";

const IN_MEMORY_PROVIDER_DOMAIN = "in-memory";
const STATIC_JSON_PROVIDER_DOMAIN = "static-json";
const FLAGD_PROVIDER_DOMAIN = "flagd";

function App() {
  return (
    <Box minH="100vh" bg="gray.50" py={8} width="100%" minW="100%">
      <Container maxW="none" width="100%">
        <VStack gap={8} align="stretch">
          {/* Header */}
          <Box textAlign="center" mb={8}>
            <Heading as="h1" size="xl" color="gray.800" mb={4}>
              OpenFeature with React, OpenTelemetry and Dynatrace
            </Heading>
            <Text fontSize="lg" color="gray.600" mb={4}>
              Feature Flag Observability Demo
            </Text>
            <HStack gap={2} justify="center">
              <Badge colorPalette="blue" variant="subtle">
                React 19
              </Badge>
              <Badge colorPalette="purple" variant="subtle">
                OpenFeature
              </Badge>
              <Badge colorPalette="orange" variant="subtle">
                OpenTelemetry
              </Badge>
              <Badge colorPalette="green" variant="subtle">
                Dynatrace
              </Badge>
            </HStack>
          </Box>

          <Separator />

          {/* Feature Flag Providers */}

          <Box>
            <Heading as="h2" size="lg" color="gray.700" mb={4}>
              Feature Flag Providers
            </Heading>

            <VStack gap={2} align="stretch">
              <OpenFeatureProvider domain={IN_MEMORY_PROVIDER_DOMAIN}>
                <InMemoryFlags />
              </OpenFeatureProvider>

              <OpenFeatureProvider domain={STATIC_JSON_PROVIDER_DOMAIN}>
                <StaticJSONFlags />
              </OpenFeatureProvider>

              <OpenFeatureProvider domain={FLAGD_PROVIDER_DOMAIN}>
                <FlagdFlags />
              </OpenFeatureProvider>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}

export default App;
