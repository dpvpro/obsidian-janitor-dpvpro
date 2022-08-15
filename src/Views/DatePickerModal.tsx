import { App, Modal, TFile } from "obsidian";
import * as React from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useCallback, useState } from "react";
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
				<div> 
				<form onSubmit={this.onApply.bind(this)}>
				Chose a date:	<input type="date" value={this.date} onChange={this.onDateChange.bind(this)} />
				<button type="button" onClick={()=>this.close()}  >Cancel </button>
				<button className="mod-cta" type="submit" onSubmit={this.onApply.bind(this)}>OK</button>
				</form>
				
				</div> 
			</React.StrictMode>
		);
	}

	onApply(event:React.FormEvent){
		console.log(event);
		event.preventDefault();
		this.plugin.updateNoteWithDate(this.file, this.date);
		this.close();
		return false;
	}

	onDateChange(event:React.ChangeEvent<HTMLInputElement>){
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
