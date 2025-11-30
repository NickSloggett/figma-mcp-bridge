/**
 * figma_list_pages tool
 * Returns all pages in the current Figma document
 */

export const pagesTool = {
  name: 'figma_list_pages',
  description: 'List all pages in the current Figma document. Returns page IDs, names, and indicates which page is currently active.',
  inputSchema: {
    type: 'object',
    properties: {},
    required: []
  }
};

export async function handleListPages(bridge) {
  if (!bridge.isConnected()) {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          error: {
            code: 'NOT_CONNECTED',
            message: 'Figma plugin is not connected. Please open Figma and run the Claude Bridge plugin.'
          }
        }, null, 2)
      }],
      isError: true
    };
  }

  try {
    const result = await bridge.sendCommand('list_pages', {});

    return {
      content: [{
        type: 'text',
        text: JSON.stringify(result, null, 2)
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          error: {
            code: error.code || 'UNKNOWN_ERROR',
            message: error.message
          }
        }, null, 2)
      }],
      isError: true
    };
  }
}
