// Application to query page content using Notion API
import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Check Notion API key and page ID
const notionApiKey = process.env.NOTION_API_KEY;
const pageId = process.env.NOTION_DATABASE_ID; // Using the same environment variable name but for page ID

// Verify that API key and page ID are set
if (!notionApiKey) {
  console.error('Notion API key is not set. Please add NOTION_API_KEY to your .env file.');
  process.exit(1);
}

if (!pageId) {
  console.error('Notion page ID is not set. Please add NOTION_DATABASE_ID to your .env file.');
  process.exit(1);
}

// Initialize Notion client
const notion = new Client({
  auth: notionApiKey,
});

/**
 * Function to query page content
 */
async function queryPage() {
  try {
    // Execute page query
    const response = await notion.pages.retrieve({
      page_id: pageId,
    });

    console.log('Page query successful!');
     
    // Print basic page information
    console.log('\n=== Page Information ===');
    
    // Print page ID and URL
    console.log(`ID: ${response.id}`);
    console.log(`URL: ${response.url}`);
    console.log(`Created time: ${response.created_time}`);
    console.log(`Last edited time: ${response.last_edited_time}`);
    
    // Print property information
    console.log('\nProperties:');
    const properties = response.properties;
    
    for (const key in properties) {
      const property = properties[key];
      let value = 'No value';
      
      // Extract value based on property type
      switch (property.type) {
        case 'title':
          value = property.title.map(text => text.plain_text).join('');
          break;
        case 'rich_text':
          value = property.rich_text.map(text => text.plain_text).join('');
          break;
        case 'number':
          value = property.number;
          break;
        case 'select':
          value = property.select ? property.select.name : 'No selection';
          break;
        case 'multi_select':
          value = property.multi_select.map(select => select.name).join(', ');
          break;
        case 'date':
          value = property.date ? `${property.date.start} ~ ${property.date.end || ''}` : 'No date';
          break;
        case 'checkbox':
          value = property.checkbox ? 'Yes' : 'No';
          break;
        case 'url':
          value = property.url || 'No link';
          break;
        case 'email':
          value = property.email || 'No email';
          break;
        case 'phone_number':
          value = property.phone_number || 'No phone number';
          break;
        case 'formula':
          value = property.formula.type === 'string' ? property.formula.string :
                 property.formula.type === 'number' ? property.formula.number :
                 property.formula.type === 'boolean' ? property.formula.boolean :
                 property.formula.type === 'date' ? property.formula.date : 'Formula value';
          break;
        case 'relation':
          value = `Related items: ${property.relation.length}`;
          break;
        case 'people':
          value = property.people.map(person => person.name || person.id).join(', ');
          break;
        case 'files':
          value = `Files: ${property.files.length}`;
          break;
        case 'created_time':
          value = property.created_time;
          break;
        case 'created_by':
          value = property.created_by.name || property.created_by.id;
          break;
        case 'last_edited_time':
          value = property.last_edited_time;
          break;
        case 'last_edited_by':
          value = property.last_edited_by.name || property.last_edited_by.id;
          break;
        default:
          value = `${property.type} type (value extraction not possible)`;
      }
      
      console.log(`  - ${key}: ${value}`);
    }
  } catch (error) {
    console.error('Error occurred during page query:');
    console.error(error);
  }
}

/**
 * Function to print only block content
 */
function printBlockContent(block) {
  // Extract content based on block type
  if (block.type === 'paragraph') {
    const text = block.paragraph.rich_text.map(t => t.plain_text).join('');
    console.log(`Content: ${text || '(Empty paragraph)'}`);  
  } else if (block.type === 'heading_1') {
    const text = block.heading_1.rich_text.map(t => t.plain_text).join('');
    console.log(`Heading 1: ${text}`);
  } else if (block.type === 'heading_2') {
    const text = block.heading_2.rich_text.map(t => t.plain_text).join('');
    console.log(`Heading 2: ${text}`);
  } else if (block.type === 'heading_3') {
    const text = block.heading_3.rich_text.map(t => t.plain_text).join('');
    console.log(`Heading 3: ${text}`);
  } else if (block.type === 'bulleted_list_item') {
    const text = block.bulleted_list_item.rich_text.map(t => t.plain_text).join('');
    console.log(`• ${text}`);
  } else if (block.type === 'numbered_list_item') {
    const text = block.numbered_list_item.rich_text.map(t => t.plain_text).join('');
    console.log(`• ${text}`);
  } else if (block.type === 'to_do') {
    const text = block.to_do.rich_text.map(t => t.plain_text).join('');
    const checked = block.to_do.checked ? '✓' : '☐';
    console.log(`${checked} ${text}`);
  } else if (block.type === 'toggle') {
    const text = block.toggle.rich_text.map(t => t.plain_text).join('');
    console.log(`Toggle: ${text}`);
  } else if (block.type === 'child_page') {
    console.log(`Child page: ${block.child_page.title}`);
  } else if (block.type === 'child_database') {
    console.log(`Child database: ${block.child_database.title}`);
  } else if (block.type === 'image') {
    const url = block.image.type === 'external' ? block.image.external.url : block.image.file.url;
    console.log(`Image: ${url}`);
  } else if (block.type === 'code') {
    const code = block.code.rich_text.map(t => t.plain_text).join('');
    console.log(`Code(${block.code.language}):\n${code}`);
  } else if (block.type === 'quote') {
    const text = block.quote.rich_text.map(t => t.plain_text).join('');
    console.log(`Quote: ${text}`);
  } else if (block.type === 'callout') {
    const text = block.callout.rich_text.map(t => t.plain_text).join('');
    const emoji = block.callout.icon?.emoji || '';
    console.log(`${emoji} Callout: ${text}`);
  } else if (block.type === 'bookmark') {
    console.log(`Bookmark: ${block.bookmark.url}`);
  } else if (block.type === 'table') {
    console.log(`Table: ${block.table.table_width} columns x ${block.table.has_column_header ? 'with header' : 'without header'}`);
  } else if (block.type === 'divider') {
    console.log(`Divider ---`);
  } else {
    console.log(`Unsupported block type: ${block.type}`);
  }
  
  // Only indicate if there are child blocks
  if (block.has_children) {
    console.log(`(Has child blocks)`); 
  }
}

/**
 * Function to retrieve only block content (excluding child blocks)
 */
async function fetchBlocksContent(blockId) {
  try {
    // Get list of child blocks
    const response = await notion.blocks.children.list({
      block_id: blockId,
    });
    
    const blocks = response.results;
    
    // Return only basic blocks without adding child block information
    for (const block of blocks) {
      // Only indicate if it can have children but don't actually fetch child blocks
      if (block.has_children) {
        block.children = [];
      }
    }
    
    return blocks;
  } catch (error) {
    console.error(`Error retrieving items for block ${blockId}:`, error.message);
    return [];
  }
}

/**
 * Function to create a new block in a page
 * @param {string} pageId - The ID of the page to add the block to
 * @param {string} content - The content of the block
 * @param {boolean} addAtTop - Whether to add the block at the top of the page (default: false)
 */
async function createNewBlock(pageId, content, addAtTop = false) {
  try {
    const blockData = {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: content
            }
          }
        ]
      }
    };

    let response;
    if (addAtTop) {
      // First get the first block ID to insert after the title
      const firstBlocks = await notion.blocks.children.list({
        block_id: pageId,
        page_size: 1
      });
      
      // If there are blocks, insert after the first one (which is typically the title)
      if (firstBlocks.results.length > 0) {
        response = await notion.blocks.children.append({
          block_id: pageId,
          children: [blockData],
          // This doesn't actually work as expected in the Notion API
          // but we're doing our best to try to add at the top
          after: firstBlocks.results[0].id
        });
      } else {
        // If no blocks, just append normally
        response = await notion.blocks.children.append({
          block_id: pageId,
          children: [blockData]
        });
      }
    } else {
      // Regular append to the end
      response = await notion.blocks.children.append({
        block_id: pageId,
        children: [blockData]
      });
    }
    
    console.log(`New block created with content: "${content}"`);
    return response;
  } catch (error) {
    console.error(`Error creating new block:`, error.message);
    return null;
  }
}

// Function to get child page content
async function getChildPageContent(childPageId, childPageTitle) {
  try {
    console.log(`\nRetrieving content for child page: ${childPageTitle}...`);
    
    // Get blocks from the child page
    const childBlocks = await fetchBlocksContent(childPageId);
    
    // Find the last non-empty block
    let lastNonEmptyBlock = null;
    let lastNonEmptyBlockIndex = -1;
    
    for (let i = childBlocks.length - 1; i >= 0; i--) {
      const block = childBlocks[i];
      // Check if block is not an empty paragraph
      if (block.type === 'paragraph' && 
          block.paragraph.rich_text && 
          block.paragraph.rich_text.length > 0 && 
          block.paragraph.rich_text[0].plain_text.trim() !== '') {
        lastNonEmptyBlock = block;
        lastNonEmptyBlockIndex = i;
        break;
      } else if (block.type !== 'paragraph') {
        // If it's not a paragraph, consider it non-empty
        lastNonEmptyBlock = block;
        lastNonEmptyBlockIndex = i;
        break;
      }
    }
    
    // Print the last non-empty block if found
    if (lastNonEmptyBlock) {
      console.log(`\n=== ${childPageTitle} Last Non-Empty Block ===`);
      console.log(`\n[Block ${lastNonEmptyBlockIndex + 1}] Type: ${lastNonEmptyBlock.type}`);
      printBlockContent(lastNonEmptyBlock);
    } else {
      console.log(`\nNo non-empty blocks found in ${childPageTitle} page.`);
    }
    
    return childBlocks;
  } catch (error) {
    console.error(`Error retrieving child page content for ${childPageTitle}:`, error.message);
    return [];
  }
}

// Run application
console.log('Starting Notion page query...');
queryPage().then(async () => {
  // Get content for the 2025 child page
  const childPageId = '16d86b3a-74e3-80a7-9f5f-cf3b92b17235'; // ID of the 2025 page
  await getChildPageContent(childPageId, '2025');
  
  // Get content for the March child page
  const marchPageId = '1ac86b3a-74e3-8027-b030-dfe52b7f538f'; // ID of the March page
  const marchBlocks = await getChildPageContent(marchPageId, 'March');
  
  // Check if command line arguments were provided
  const args = process.argv.slice(2);
  
  if (args.length >= 2) {
    // Get block title and content from command line arguments
    const blockTitle = args[0];
    const blockContent = args[1];
    
    // Add blocks using command line arguments
    await addNewBlocksToPage(marchPageId, blockTitle, blockContent, marchBlocks);
  } else {
    console.log('\nTo create a new block, use the following command:');
    console.log('node index.js "[date]" "block content"');
  }
});

/**
 * Function to add a new block to a page if it doesn't already exist
 * @param {string} pageId - The ID of the page to add the block to
 * @param {string} blockTitle - The title of the block
 * @param {string} blockContent - The content of the block
 * @param {Array} existingBlocks - The existing blocks on the page
 */
async function addNewBlocksToPage(pageId, blockTitle, blockContent, existingBlocks, addAtTop = true) {
  // Check if the block already exists
  let blockExists = false;
  
  for (const block of existingBlocks) {
    if (block.type === 'paragraph' && 
        block.paragraph.rich_text && 
        block.paragraph.rich_text.length > 0 && 
        block.paragraph.rich_text[0].plain_text === blockTitle) {
      blockExists = true;
      break;
    }
  }
  
  if (!blockExists) {
    // Create the new blocks
    console.log(`\nCreating ${blockTitle} block...`);
    
    // Create content block first (will appear below the title block)
    await createNewBlock(pageId, blockContent, addAtTop);
    
    // Create title block (will appear at the top)
    await createNewBlock(pageId, blockTitle, addAtTop);
    
    console.log('New block created successfully!');
  } else {
    console.log(`\n${blockTitle} block already exists. Not creating a new block.`);
  }
}
