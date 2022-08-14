/* eslint-disable @typescript-eslint/no-unused-vars */
import { JanitorView, JanitorViewProps, SelectableItem } from './Views/JanitorView';
import { App, Modal } from "obsidian";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { createRoot, Root } from "react-dom/client";
import { ScanResults } from './FileScanner';
import { FileProcessor } from './FileProcessoe';

function toggleSelection(list: SelectableItem[], ic:number){
	return list.map((o,i)=>i===ic?({...o,selected:!o.selected}):o)
}
export class JanitorModal extends Modal {

	constructor(app: App) {
		super(app);
		
	}

	root: Root;
	state: JanitorViewProps = {
		onClose: ()=>{this.close()},
		scanning: true,
		orphans: [],
		onSelectionChange: (i:number,section:string)=>{
			this.handleSelectionChange(i,section);
		},
		onPerform: (operation:string)=>{
			this.perform(operation);
		}
	};

	handleSelectionChange(ic:number, section:string){

			this.state = {
				...this.state,
				[section]: toggleSelection(((this.state as any)[section]) as SelectableItem[],ic)
			};
			this.render(this.state);
	}

	public updateState(results: ScanResults){
		this.state=  {...this.state,
			scanning: results.scanning,
			orphans: results.orphans.map(tfile =>  ({
				name: tfile.path,
				selected: false
			}))
		};

		this.render(this.state);
	}

	render(state: JanitorViewProps){
		this.root.render(
			<React.StrictMode>
				<JanitorView {...state} />
			</React.StrictMode>
		);
	}

	onOpen() {
		const { contentEl } = this;
		// contentEl.setText('Woah!');
		// this.titleEl.setText("Obsidian Janitor")	
		this.root = createRoot(contentEl/*.children[1]*/);
		this.render(this.state);
		
	}

	onClose() {
		const { contentEl } = this;
		// contentEl.empty();
		// ReactDOM.unmountComponentAtNode(contentEl);
		this.root.unmount();
	}

	async perform(operation: string) {
		console.log(this.state);
		console.log("Janitor: performing "+operation);
		const fileProcessor = new FileProcessor(this.app);
		await fileProcessor.process(this.extractFiles(), operation);
		this.close();
	}

	extractFiles() {
		return this.state.orphans
		.filter(f=>f.selected)
		.map(f=>f.name)
		;
	}
}
