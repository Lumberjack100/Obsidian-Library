# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Obsidian knowledge base integrated with Docsify for web-based documentation viewing. The project automatically generates a sidebar navigation from the directory structure and converts Obsidian-specific markdown syntax to standard markdown for web viewing.

## Key Components

1. **Knowledge Base Structure**: Content is organized in the `知识库` (Knowledge Base) directory with subdirectories for different topics
2. **Docsify Integration**: Uses Docsify to serve the knowledge base as a web documentation site
3. **Sidebar Generation**: Automatically generates `_sidebar.md` from the directory structure using `generate-docsify.js`
4. **Obsidian Compatibility**: Converts Obsidian-specific syntax (like [[links]], ==highlights==, callouts) to standard markdown

## Common Development Commands

### Starting the Development Server
```bash
npm start
```
This runs the docsify server on port 3000 with auto-generation of sidebar content.

### Preview Mode
```bash
npm run preview
```
Runs the docsify server on port 3000 and automatically opens the browser.

### Manual Sidebar Generation
```bash
npm run generate
```
Manually regenerates the `_sidebar.md` file based on the current directory structure.

## Architecture Notes

1. **Content Organization**: All knowledge base content is in the `知识库` directory, organized by topic
2. **Sidebar Generation**: The `generate-docsify.js` script walks the directory structure to create the sidebar
3. **Markdown Processing**: The `index.html` file contains Docsify configuration with custom plugins to handle Obsidian-specific syntax
4. **Static Serving**: The site is served statically with Docsify handling client-side routing

## File Structure Overview

- `index.html`: Main Docsify configuration and entry point
- `generate-docsify.js`: Script that generates sidebar from directory structure
- `知识库/`: Main content directory with topic-based subdirectories
- `_sidebar.md`: Auto-generated sidebar navigation
- `package.json`: Contains scripts for development and building

## Development Workflow

1. Add new content as markdown files in the appropriate subdirectories under `知识库`
2. Run `npm run generate` to update the sidebar, or use `npm start` for auto-generation
3. Test changes locally with `npm start` or `npm run preview`
4. The sidebar will automatically reflect the directory structure