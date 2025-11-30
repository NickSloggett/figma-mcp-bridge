#!/usr/bin/env node

/**
 * Figma MCP Bridge - Entry Point
 *
 * Starts the WebSocket server for Figma plugin communication
 * and the MCP server for Claude communication.
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { FigmaBridge } from './websocket.js';
import { createServer } from './server.js';

const PORT = parseInt(process.env.FIGMA_BRIDGE_PORT || '3055', 10);

async function main() {
  console.error('[FigmaMCP] Starting Figma MCP Bridge...');

  // Create and start WebSocket bridge
  const bridge = new FigmaBridge(PORT);
  await bridge.start();

  // Log connection events
  bridge.on('connected', (info) => {
    console.error(`[FigmaMCP] Figma connected: ${info.fileName}`);
  });

  bridge.on('disconnected', () => {
    console.error('[FigmaMCP] Figma disconnected');
  });

  // Create MCP server
  const server = createServer(bridge);

  // Connect to stdio transport (Claude communication)
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error(`[FigmaMCP] MCP server running on port ${PORT}. Waiting for Figma plugin connection...`);

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.error('[FigmaMCP] Shutting down...');
    await bridge.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.error('[FigmaMCP] Shutting down...');
    await bridge.stop();
    process.exit(0);
  });
}

main().catch((error) => {
  console.error('[FigmaMCP] Fatal error:', error);
  process.exit(1);
});
