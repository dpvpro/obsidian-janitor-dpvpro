import { DatePickerModal } from "./src/Views/DatePickerModal";
import { OperationType } from "./src/JanitorSettings";
import { JanitorModal } from "./src/JanitorModal";

import {
	MarkdownView,
	Notice,
	Plugin,
	stringifyYaml,
	TFile,
} from "obsidian";
import { FileScanner } from "src/FileScanner";
import { DEFAULT_SETTINGS, JanitorSettings } from "src/JanitorSettings";
import JanitorSettingsTab from "src/PluginSettingsTab";
import { FileProcessor } from "src/FileProcessor";
import moment from "moment";

// Remember to rename these classes and interfaces!

export default class JanitorPlugin extends Plugin {
	settings: JanitorSettings;
	statusBarItemEl: HTMLElement;

	async onload() {
		await this.loadSettings();

		if (this.settings.addRibbonIcon) {
			const ribbonIconEl = this.addRibbonIcon(
				"trash",
				"Janitor: scan vault",
				(evt: MouseEvent) => {
					this.scanFiles();
				}
			);
			// Perform additional things with the ribbon
			ribbonIconEl.addClass("janitor-ribbon-class");
		}

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		this.statusBarItemEl = this.addStatusBarItem();
		this.updateStatusBar("");

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: "scan-files",
			name: "Scan Files",
			callback: () => {
				this.scanFiles();
			},
		});
		this.addCommand({
			id: "scan-files-noprompt",
			name: "Scan Files (without prompt)",
			callback: () => {
				this.scanFiles(false, true);
			},
		});
		this.addCommand({
			id: "scan-files-with-prompt",
			name: "Scan Files (with prompt)",
			callback: () => {
				this.scanFiles(true, false);
			},
		});

		this.addCommand({
			id: "set-expiration",
			name: "Sets the expiration date of the current note",
			checkCallback: (checking: boolean) => {
				// console.log(editor.getSelection());

				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					if (!checking) {
						this.chooseDate(markdownView);
					}
					return true;
				}
				return false;
			},
		});

		this.createShortcutCommand(
			"set-expiretion-1week",
			"Set Expiration (1 week)",
			1,
			"week"
		);
		this.createShortcutCommand(
			"set-expiretion-1month",
			"Set Expiration (1 month)",
			1,
			"month"
		);
		this.createShortcutCommand(
			"set-expiretion-1year",
			"Set Expiration (1 year)",
			1,
			"year"
		);

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new JanitorSettingsTab(this.app, this));

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
		if (this.settings.runAtStartup) {
			console.log("Janitor: running at startUp");
			this.scanFiles();
		}
	}

	frontMatterRegEx = /^---$(.*)^---/ms;

	private createShortcutCommand(id: string, name: string, n: number, w: any) {
		this.addCommand({
			id: id,
			name: name,
			checkCallback: (checking: boolean) => {
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					if (!checking) {
						this.updateNoteWithDate(
							markdownView.file,
							moment()
								.add(n, w)
								.format(this.settings.expiredDateFormat)
						);
					}
					return true;
				}
				return false;
			},
		});
	}

	async chooseDate(view: MarkdownView) {
		new DatePickerModal(this.app, this, view.file).open();
	}


	async updateNoteWithDate(
		file: TFile,
		dateToSet: string
	) {
		const metaData = this.app.metadataCache.getFileCache(file)?.frontmatter;
		let start = metaData?.position.start.offset || 0;
		let end = metaData?.position.end.offset || 0;
		// no metadata could also mean empty metadata secion
		const newMetadata = {...metaData, ...{[this.settings.expiredAttribute]: dateToSet}, position: undefined}
		const newYaml = stringifyYaml(newMetadata);
		const content = await this.app.vault.cachedRead(file);
		const m = this.frontMatterRegEx.exec(content);
		if(!metaData && m) {
			//empty frontmatter
			start = m.index;
			end = m.index+m[0].length
		}
		const newContent = content.substring(0,start)+"---\n"+newYaml+"---"+content.substring(end);
		this.app.vault.modify(file, newContent);
	}

	private updateStatusBar(message: string) {
		this.statusBarItemEl.setText(message);
	}

	private async scanFiles(forcePrompt = false, noPrompt = false) {
		this.updateStatusBar("Janitor Scanning...");
		let modal;
		const results = await new FileScanner(this.app, this.settings).scan();
		// artificially introduce waiting for testing purposes
		// await delay(1000);
		const foundSomething =
			results.orphans || results.empty || results.expired || results.big;
		this.updateStatusBar("");
		if (!foundSomething) {
			new Notice(`Janitor scanned and found nothing to cleanup`);
			return;
		}
		// We determine if we have to prompt the user,
		// even if user disabled prompting, we could have to prompt
		// for big files to avoid deleting important stuff in an unattended way
		if (
			(this.settings.promptUser && !noPrompt) ||
			(results.big?.length && this.settings.promptForBigFiles) ||
			forcePrompt
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
			let files = [
				results.orphans,
				results.empty,
				results.expired,
				results.big,
			].flatMap((list) => (list ? list.map((file) => file.path) : []));
			files = [...new Set(files)];
			this.perform(this.settings.defaultOperation, files);
		}
	}

	async perform(operation: OperationType, files: string[]) {
		// console.log(this.state);
		console.log("Janitor: performing " + operation);
		const fileProcessor = new FileProcessor(this.app);
		const processingResult = await fileProcessor.process(files, operation);
		new Notice(
			`${processingResult.deletedFiles} files deleted.` +
				(processingResult.notDeletedFiles
					? `${processingResult.notDeletedFiles} files not deleted`
					: "")
		);
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
