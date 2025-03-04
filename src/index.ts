import joplin from 'api';
import { SettingItemType, MenuItemLocation } from './types';

// Simple implementation for making OpenAI API calls without the full library
interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

async function callOpenAI(apiKey: string, model: string, messages: any[]): Promise<OpenAIResponse> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.5,
        max_tokens: 500
      })
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('OpenAI API call failed:', error);
    throw error;
  }
}

async function summarizeNote() {
	try {
		const apiKey = await joplin.settings.value('openaiApiKey');
		
		if (!apiKey) {
			await joplin.views.dialogs.showMessageBox('Please set your OpenAI API key in the plugin settings.');
			return;
		}

		const note = await joplin.workspace.selectedNote();
		if (!note) {
			await joplin.views.dialogs.showMessageBox('Please select a note first.');
			return;
		}

		const content = note.body;
		if (!content || content.trim().length === 0) {
			await joplin.views.dialogs.showMessageBox('The selected note is empty.');
			return;
		}

		// Show loading dialog
		await joplin.views.dialogs.showMessageBox('Generating summary...');

		// Generate summary using OpenAI
		const model = await joplin.settings.value('openaiModel');
		const messages = [
			{
				role: 'system',
				content: 'You are a helpful assistant that summarizes text concisely.'
			},
			{
				role: 'user',
				content: `Please summarize the following text in 3-5 bullet points:\n\n${content}`
			}
		];
		
		const response = await callOpenAI(apiKey, model, messages);
		const summary = response.choices[0]?.message?.content || 'No summary generated.';

		// Show the summary
		await joplin.views.dialogs.showMessageBox(summary);
	} catch (error) {
		console.error('Error generating summary:', error);
		await joplin.views.dialogs.showMessageBox(`An error occurred: ${error.message}`);
	}
}

async function suggestTags() {
	try {
		const apiKey = await joplin.settings.value('openaiApiKey');
		
		if (!apiKey) {
			await joplin.views.dialogs.showMessageBox('Please set your OpenAI API key in the plugin settings.');
			return;
		}

		const note = await joplin.workspace.selectedNote();
		if (!note) {
			await joplin.views.dialogs.showMessageBox('Please select a note first.');
			return;
		}

		const content = note.body;
		if (!content || content.trim().length === 0) {
			await joplin.views.dialogs.showMessageBox('The selected note is empty.');
			return;
		}

		// Show loading dialog
		await joplin.views.dialogs.showMessageBox('Generating tag suggestions...');

		// Generate tags using OpenAI
		const model = await joplin.settings.value('openaiModel');
		const messages = [
			{
				role: 'system',
				content: 'You are a helpful assistant that suggests relevant tags for notes. Provide a comma-separated list of 5-7 tags that describe the content well.'
			},
			{
				role: 'user',
				content: `Please suggest tags for the following note:\n\n${content}`
			}
		];
		
		const response = await callOpenAI(apiKey, model, messages);
		const suggestions = response.choices[0]?.message?.content || 'No tags suggested.';

		// Show tag suggestions
		await joplin.views.dialogs.showMessageBox(suggestions);
	} catch (error) {
		console.error('Error generating tag suggestions:', error);
		await joplin.views.dialogs.showMessageBox(`An error occurred: ${error.message}`);
	}
}

joplin.plugins.register({
	onStart: async function() {
		console.info('AI Assistant plugin started!');
		
		// Register settings
		await joplin.settings.registerSection('aiAssistantSettings', {
			label: 'AI Assistant',
			iconName: 'fas fa-robot'
		});

		await joplin.settings.registerSettings({
			'openaiApiKey': {
				value: '',
				type: SettingItemType.String,
				section: 'aiAssistantSettings',
				public: true,
				secure: true,
				label: 'OpenAI API Key',
				description: 'Your OpenAI API key'
			},
			'openaiModel': {
				value: 'gpt-3.5-turbo',
				type: SettingItemType.String,
				section: 'aiAssistantSettings',
				public: true,
				label: 'OpenAI Model',
				description: 'The AI model to use for generating content (e.g., gpt-3.5-turbo, gpt-4)',
			}
		});

		// Check for API key presence
		const apiKey = await joplin.settings.value('openaiApiKey');
		if (!apiKey) {
			console.info('OpenAI API key not set');
		}

		// Register commands
		await joplin.commands.register({
			name: 'summarizeNote',
			label: 'Summarize Note',
			iconName: 'fas fa-file-alt',
			execute: summarizeNote,
		});

		await joplin.commands.register({
			name: 'suggestTags',
			label: 'Suggest Tags',
			iconName: 'fas fa-tags',
			execute: suggestTags,
		});

		// Register as accelerators/keyboard shortcuts
		await joplin.commands.register({
			name: 'aiSummarizeNote',
			label: 'AI: Summarize Note',
			execute: summarizeNote,
		});

		await joplin.commands.register({
			name: 'aiSuggestTags',
			label: 'AI: Suggest Tags',
			execute: suggestTags,
		});
		
		// Add to Tools menu
		await joplin.views.menuItems.create('summarizeNoteMenuItem', 'summarizeNote', MenuItemLocation.Tools);
		await joplin.views.menuItems.create('suggestTagsMenuItem', 'suggestTags', MenuItemLocation.Tools);
	}
});