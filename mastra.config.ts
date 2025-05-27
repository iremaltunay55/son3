// Mastra Configuration
import { defineConfig } from "@mastra/core";

export default defineConfig({
  name: "Turkish Weather Agent",
  version: "1.0.0",
  
  // Agent'ların bulunduğu dizin
  agents: {
    directory: "./src/agents",
  },
  
  // Tool'ların bulunduğu dizin
  tools: {
    directory: "./src/tools",
  },
  
  // MCP server'ların bulunduğu dizin
  mcpServers: {
    directory: "./src/mcp",
  },
  
  // Development server konfigürasyonu
  dev: {
    port: 4111,
    host: "localhost",
  },
  
  // Build konfigürasyonu
  build: {
    outDir: "./dist",
  },
  
  // Environment variables
  env: {
    OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
});
