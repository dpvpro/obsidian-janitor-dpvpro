/* eslint-disable @typescript-eslint/no-unused-vars */
import { JanitorView, JanitorViewProps, SelectableItem } from './Views/JanitorView';
import { App, Modal, Notice, TFile } from "obsidian";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { createRoot, Root } from "react-dom/client";
import { ScanResults } from './FileScanner';
import { FileProcessor } from './FileProcessor';
import JanitorPlugin from 'main';
import { threadId } from 'worker_threads';
import { OperationType } from './JanitorSettings';

function toggleSelection(list: SelectableItem[], ic: number) {
	return list.map((o, i) => i === ic ? ({ ...o, selected: !o.selected }) : o)
}
export class JanitorModal extends Modal {

	plugin: JanitorPlugin;
	root: Root;
	state: JanitorViewProps;

	constructor(app: App, plugin: JanitorPlugin) {
		super(app);
		this.plugin = plugin;
		this.state = {
			onClose: () => { this.close() },
			scanning: true,
			orphans: [],
			empty: [],
			big: [],
			expired: [],
			onSelectionChange: (i: number, section: string) => {
				this.handleSelectionChange(i, section);
			},
			onPerform: (operation:OperationType) => {
				this.perform(operation);
			},
			// defaultOperation: this.plugin.settings.defaultOperation,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			onSettingChange: (setting: string, value: any) => {
				this.onSettingChange(setting, value);
			}
		};
	}
	perform(operation:OperationType) {
		this.plugin.perform(operation, this.extractFiles());
		this.close();
	}

	/**
	 * @deprecated The method should not be used
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onSettingChange(setting: string, value: any) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(this.plugin.settings as any)[setting] = value;
		this.plugin.saveSettings();
		this.state = {
			...this.state,
			// useSystemTrash: this.plugin.settings.useSystemTrash
		}
		// console.log(this.state);
		this.render();
	}



	handleSelectionChange(ic: number, section: string) {
		const files = ((this.state as any)[section]) as SelectableItem[];
		if (ic >= 0) {
			this.state = {
				...this.state,
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				[section]: toggleSelection(files, ic)
			};
		} else {
			const allSelected = files.every(file => file.selected);
			this.state = {
				...this.state,
				[section]: files.map(file => ({ ...file, selected: !allSelected }))
			}
		}

		this.render();
	}

	public updateState(results: ScanResults) {
		this.state = {
			...this.state,
			scanning: results.scanning,
			orphans: this.fileToSelectableItem(results.orphans),
			empty: this.fileToSelectableItem(results.empty),
			expired: this.fileToSelectableItem(results.expired),
			big: this.fileToSelectableItem(results.big)
		};

		this.render();
	}

	private fileToSelectableItem(files: TFile[] | false): SelectableItem[]|false {
		return files && files.map(tfile => ({
			name: tfile.path,
			selected: false
		}));
	}

	render() {
		this.root.render(
			<React.StrictMode>
				<JanitorView {...this.state} />
			</React.StrictMode>
		);
	}

	onOpen() {
		const { contentEl } = this;
		// contentEl.setText('Woah!');
		// this.titleEl.setText("Obsidian Janitor")	
		this.root = createRoot(contentEl/*.children[1]*/);
		this.render();

	}

	onClose() {
		const { contentEl } = this;
		// contentEl.empty();
		// ReactDOM.unmountComponentAtNode(contentEl);
		this.root.unmount();
	}



	extractFiles() {
		return [this.state.orphans, this.state.empty, this.state.big, this.state.expired]
			.flatMap(list =>
				list ? list.filter(f => f.selected).map(f => f.name) : []
			)

	}
}
