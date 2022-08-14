/* eslint-disable @typescript-eslint/no-unused-vars */
import JanitorPlugin from 'main';
import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

export default class JanitorSettingsTab extends PluginSettingTab {
	plugin: JanitorPlugin;

	constructor(app: App, plugin: JanitorPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Janitor Settings'});

		new Setting(containerEl)
			.setName('Run at Startup')
			.setDesc('Is enabled the plugin will perform a scan automatically everytime you open a vault.')
			// .addText(text => text
			// 	.setPlaceholder('Enter your secret')
			// 	.setValue(this.plugin.settings.mySetting)
			// 	.onChange(async (value) => {
			// 		console.log('Secret: ' + value);
			// 		this.plugin.settings.mySetting = value;
			// 		await this.plugin.saveSettings();
			// 	}));
			.addToggle(bool => bool
				.setValue(this.plugin.settings.runAtStartup)
				.onChange(async (value) => {
					console.log('changing runAtStartup: ', value);
					this.plugin.settings.runAtStartup = value;
					await this.plugin.saveSettings();
				})
				)
	}
}
