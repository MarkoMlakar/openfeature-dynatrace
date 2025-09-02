# OpenFeature with React, OpenTelemetry and Dynatrace [WIP]

A work-in-progress showcase of OpenFeature integration with React, demonstrating different feature flag providers and their connection to the Dynatrace platform.

## Current Implementation (placeholder UI!)

This project demonstrates three different OpenFeature providers:

1. **In-Memory Provider** - Feature flags stored in memory
2. **Static JSON Provider** - Feature flags loaded from a static JSON file
3. **Flagd Provider** - Feature flags served from a flagd instance running in Docker

## Project Structure

- `src/components/InMemoryFlags/` - In-memory provider example
- `src/components/StaticJSONFlags/` - Static JSON provider example
- `src/components/FlagdFlags/` - Flagd provider example
- `flagd-provider/` - Docker configuration for flagd
- `src/openFeature/providers/` - Custom provider implementations

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the flagd provider:

   ```bash
   cd flagd-provider
   docker-compose up -d
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## Roadmap

- [ ] Complete OpenTelemetry integration
- [ ] Connect to Dynatrace platform
- [ ] Replace placeholder UI with a more polished one

## Technologies Used

- React 19
- OpenFeature SDK
- Flagd
- OpenTelemetry
- TypeScript
- Vite
