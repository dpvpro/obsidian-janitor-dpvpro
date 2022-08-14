import { JanitorModal } from './src/JanitorModal';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { App, Editor, MarkdownView, Modal, Notice, Plugin } from 'obsidian';
import { FileScanner } from 'src/FileScanner';
import { DEFAULT_SETTINGS, JanitorSettings } from 'src/JanitorSettings';
import JanitorSettingsTab from 'src/PluginSettingsTab';
import { delay } from 'src/Utils';

// Remember to rename these classes and interfaces!


export default class JanitorPlugin extends Plugin {
	settings: JanitorSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Scan Files', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			// new Notice('This is a notice!');
			this.scanFiles();
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('janitor-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		// const statusBarItemEl = this.addStatusBarItem();
		// statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'janitor-scan-files',
			name: 'Scan Files',
			callback: () => {
				this.scanFiles();
			}
		});
		
		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new JanitorSettingsTab(this.app, this));


		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	private async scanFiles() {
		const modal = new JanitorModal(this.app);
		modal.open();
		const {orphans} = await new FileScanner(this.app, this.settings).scan();
		await delay(1000);
		modal.updateState({scanning: false, orphans: orphans});
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}




