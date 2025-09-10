import {
  WebTracerProvider,
  SimpleSpanProcessor,
  ConsoleSpanExporter,
} from "@opentelemetry/sdk-trace-web";
import { ZoneContextManager } from "@opentelemetry/context-zone";

// Simple console exporter for testing
const traceExporter = new ConsoleSpanExporter();

export function initializeOpenTelemetry() {
  console.log("Initializing OpenTelemetry with tracing");

  // Create tracer provider with console exporter
  const traceProvider = new WebTracerProvider({
    spanProcessors: [new SimpleSpanProcessor(traceExporter)],
  });

  // Register the provider
  traceProvider.register({
    contextManager: new ZoneContextManager(),
  });

  console.log("OpenTelemetry initialized with console exporter");
  return traceProvider;
}
