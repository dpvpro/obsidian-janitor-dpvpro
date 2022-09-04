import { App, Modal, TFile } from "obsidian";
import * as React from "react";
import { createRoot, Root } from "react-dom/client";
import JanitorPlugin from '../../main';
import { moment } from "obsidian";

export class DatePickerModal extends Modal {

	plugin: JanitorPlugin;
	root: Root;
	file: TFile;
	date: string;

	constructor(app: App, plugin: JanitorPlugin, file: TFile) {
		super(app);
		this.plugin = plugin;
		this.file = file;
		this.date = moment().format('YYYY-MM-DD');
	}

	render() {
		this.root.render(
			<React.StrictMode>
				<div className="janitor-date-picker">
					<form onSubmit={this.onApply.bind(this)}>
						<label>
							<span>Choose a date:</span><input type="date" value={this.date} onChange={this.onDateChange.bind(this)} />
						</label>
						<div className="janitor-date-picker-buttons">
							<button type="button" onClick={(e) => this.close()}  >Cancel </button>
							<button className="mod-cta" type="submit" >OK</button>

						</div>
						<div className="janitor-date-shortcuts">
							<button onClick={(e)=>this.dateShortcut(e,1,"weeks")} className="janitor-date-shortcut=button">In a Week</button>
							<button onClick={(e)=>this.dateShortcut(e,1,"months")} className="janitor-date-shortcut=button">In a Month</button>
							<button onClick={(e)=>this.dateShortcut(e,1,"years")} className="janitor-date-shortcut=button">In a Year</button>
						</div>
					</form>

				</div>
			</React.StrictMode>
		);
	}
	dateShortcut(e: React.MouseEvent<HTMLButtonElement>, n: number, what: any) {
		// e.preventDefault();
		this.date = moment()
			.add(n, what)
			.format('YYYY-MM-DD');
		this.render();
		// return false;
	}

	onApply(event: React.FormEvent) {
		console.log(event);
		event.preventDefault();
		const dateToSet = moment(this.date, "YYYY-MM-DD").format(this.plugin.settings.expiredDateFormat);
		this.plugin.updateNoteWithDate(this.file, dateToSet);
		this.close();
		return false;
	}

	onDateChange(event: React.ChangeEvent<HTMLInputElement>) {
		console.log(event);
		this.date = event.target.value;
		this.render();
	}

	onOpen() {
		const { contentEl } = this;
		// contentEl.setText('Woah!');
		// this.titleEl.setText("Obsidian Janitor")	
		this.root = createRoot(contentEl/*.children[1]*/);
		this.render();

	}

	onClose() {
		// const { contentEl } = this;
		// contentEl.empty();
		// ReactDOM.unmountComponentAtNode(contentEl);
		this.root.unmount();
	}

}
