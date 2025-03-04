# Joplin AI Assistant Plugin

A plugin for [Joplin](https://joplinapp.org/) that leverages OpenAI's API to provide AI-powered features for your notes.

## Features

### 1. Note Summarization

Automatically generate concise bullet-point summaries of your notes. This is helpful for:
- Quickly understanding long notes without reading them entirely
- Creating executive summaries of research documents
- Extracting key points from meeting notes

### 2. Tag Suggestions

Get AI-powered tag suggestions based on your note content. Benefits include:
- More consistent tagging across your notes
- Discovery of relevant tags you might not have considered
- Better organization of your knowledge base

## Installation

1. Download the latest release (.jpl file) from the [releases page](https://github.com/yourusername/joplin-plugin-ai/releases)
2. Open Joplin
3. Navigate to Tools > Options > Plugins
4. Click "Install from file" and select the downloaded .jpl file
5. Restart Joplin (if necessary)

## Configuration

1. Go to Tools > Options > AI Assistant
2. Enter your OpenAI API key
3. (Optional) Select a different OpenAI model (default is gpt-3.5-turbo)

## Usage

### Summarize Note
1. Select a note you want to summarize
2. Navigate to Tools > Summarize Note
3. A dialog will appear with the generated summary

### Suggest Tags
1. Select a note for which you want tag suggestions
2. Navigate to Tools > Suggest Tags
3. A dialog will appear with suggested tags

## Keyboard Shortcuts

The plugin registers the following commands that can be mapped to keyboard shortcuts:
- `aiSummarizeNote`: Summarize the current note
- `aiSuggestTags`: Suggest tags for the current note

To set up keyboard shortcuts:
1. Go to Tools > Options > Keyboard Shortcuts
2. Search for "AI" to find the plugin commands
3. Assign your preferred shortcuts

## Requirements

- Joplin v3.2 or newer
- OpenAI API key

## Development

### Building from source

```bash
# Clone the repository
git clone https://github.com/yourusername/joplin-plugin-ai.git
cd joplin-plugin-ai

# Install dependencies
npm install

# Build the plugin
npm run dist
```

The compiled plugin will be available in the `publish/` directory.

## License

MIT

## Acknowledgments

- Joplin team for creating an excellent note-taking application with a robust plugin system
- OpenAI for providing the API that powers this plugin's features

For information on the Joplin Plugin API, please see [GENERATOR_DOC.md](./GENERATOR_DOC.md)
