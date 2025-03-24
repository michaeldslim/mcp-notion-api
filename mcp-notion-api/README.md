# Notion MCP

This project is a simple Node.js application that uses the Notion API to create content blocks in Notion pages.

## Installation

1. Install MCP (Windsurf):
```
npx @composio/mcp setup "https://mcp.composio.dev/notion/nutritious-bashful-nail-e-V22O" --client windsurf
```

2. Add MCP server to `mcp_config.json`:
```
"mcpServers": {
  "https://mcp.composio.dev/notion/nutritious-bashful-nail-e-V22O": {
    "command": "npx",
    "args": [
      "@composio/mcp@latest",
      "start",
      "--url",
      "https://mcp.composio.dev/notion/nutritious-bashful-nail-e-V22O"
    ],
    "env": {
      "npm_config_yes": "true"
    }
  }
}
```

3. Install required packages:
```
npm install
```

4. Configure `.env` file:
```
NOTION_API_KEY=your_notion_api_key_here
NOTION_DATABASE_ID=your_notion_page_id_here
```

## How to Get Notion API Key and Page ID

1. **Get Notion API Key**:
   - Go to the [Notion Developer Page](https://www.notion.so/my-integrations).
   - Click the "New integration" button.
   - Enter integration information and create it.
   - The "Internal Integration Token" is your API key.

2. **Get Page ID**:
   - Open the page you want to view in Notion.
   - Find the page ID in the URL. 
   - Example: `https://www.notion.so/[page ID]?v=...`
   - Or click the "Share" button on the page, select "Copy link", and extract the ID from the URL.
   - The ID is typically a 32-character string separated by hyphens (in the format c9de4b57-aaaa-bbbb-cccc-13056c520983).

3. **Set Integration Permissions**:
   - Click the "..." menu in the top right corner of the page.
   - Find and click "Connections" or "Add connections".
   - Search for and add the integration you created.

## Usage

### Basic Execution

Run the basic application:
```
node index.js
```
or
```
npm start
```

### Creating Blocks

To create date blocks and content, use command line arguments as follows:
```
node index.js "[date]" "content"
```

Example:
```
node index.js "[03/25]" "Topics discussed in today's meeting"
```

This command performs the following:
1. Accesses the Notion page to find the 2025 subpage and the March subpage.
2. Creates the specified date block and content block in the March page.
3. Does not create a new block if a block with the same date already exists.

Execution results are displayed in the console.
