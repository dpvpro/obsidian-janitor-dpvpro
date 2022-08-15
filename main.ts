import { OperationType } from './src/JanitorSettings';
import { JanitorModal } from './src/JanitorModal';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { App, Editor, MarkdownView, Modal, Notice, Plugin } from 'obsidian';
import { FileScanner } from 'src/FileScanner';
import { DEFAULT_SETTINGS, JanitorSettings } from 'src/JanitorSettings';
import JanitorSettingsTab from 'src/PluginSettingsTab';
import { delay } from 'src/Utils';
import { FileProcessor } from 'src/FileProcessor';

// Remember to rename these classes and interfaces!


export default class JanitorPlugin extends Plugin {
	settings: JanitorSettings;
	statusBarItemEl: HTMLElement;

	async onload() {
		await this.loadSettings();

		if (this.settings.addRibbonIcon) {
			const ribbonIconEl = this.addRibbonIcon('trash', 'Janitor: scan vault', (evt: MouseEvent) => {
				this.scanFiles();
			});
			// Perform additional things with the ribbon
			ribbonIconEl.addClass('janitor-ribbon-class');
		}

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		this.statusBarItemEl = this.addStatusBarItem();
		this.updateStatusBar("");

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'janitor-scan-files',
			name: 'Scan Files',
			callback: () => {
				this.scanFiles();
			}
		});
		this.addCommand({
			id: 'janitor-scan-files-noprompt',
			name: 'Scan Files (without prompt)',
			callback: () => {
				this.scanFiles(false,true);
			}
		});
		this.addCommand({
			id: 'janitor-scan-files-with-prompt',
			name: 'Scan Files (with prompt)',
			callback: () => {
				this.scanFiles(true, false);
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new JanitorSettingsTab(this.app, this));


		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
		if (this.settings.runAtStartup) {
			console.log("Janitor: running at startUp")
			this.scanFiles();
		}
	}

	private updateStatusBar(message: string){
		this.statusBarItemEl.setText(message);
	}

	private async scanFiles(forcePrompt=false, noPrompt=false) {
		this.updateStatusBar("Janitor Scanning...");
		let modal;
		const results = await new FileScanner(this.app, this.settings).scan();
		// artificially introduce waiting for testing purposes
		// await delay(1000);

		this.updateStatusBar("");
		// We determine if we have to prompt the user,
		// even if user disabled prompting, we could have to prompt
		// for big files to avoid deleting important stuff in an unattended way
		if (this.settings.promptUser && !noPrompt 
			|| (results.big?.length && this.settings.promptForBigFiles)
			|| forcePrompt
			) {
			modal = new JanitorModal(this.app, this);
			modal.open();
		}
		if (modal) {
			// if we have to prompt the user let's him/her decide which files
			// and which action to perform
			modal.updateState(results);
		} else {
			// we should process all available files
			let files = [results.orphans, results.empty, results.expired, results.big]
				.flatMap(list => list ?
					list.map(file => file.path)
					: []
				);
			files = [...new Set(files)];
			this.perform(this.settings.defaultOperation, files)
		}
	}

	async perform(operation: OperationType, files: string[]) {
		// console.log(this.state);
		console.log("Janitor: performing " + operation);
		const fileProcessor = new FileProcessor(this.app);
		const processingResult = await fileProcessor.process(files, operation);
		new Notice(`${processingResult.deletedFiles} files deleted.`
			+ (processingResult.notDeletedFiles ?
				`${processingResult.notDeletedFiles} files not deleted` : "")
		);
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




