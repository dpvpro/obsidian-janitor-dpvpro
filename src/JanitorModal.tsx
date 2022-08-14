/* eslint-disable @typescript-eslint/no-unused-vars */
import { JanitorView, JanitorViewProps } from './Views/JanitorView';
import { App, Modal } from "obsidian";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { createRoot, Root } from "react-dom/client";
import { ScanResults } from './FileScanner';

export class JanitorModal extends Modal {
	constructor(app: App) {
		super(app);
		
	}

	root: Root;
	state: JanitorViewProps = {
		onClose: ()=>{this.close()},
		scanning: true,
		orphans: [],
		onOrphansSelectionChange: (ic:number)=>{
			this.state = {
				...this.state,
				orphans: this.state.orphans.map((o,i)=>i===ic?({...o,selected:!o.selected}):o)
			};
			this.render(this.state);
		}
	};

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
		console.log(this.state);
		const { contentEl } = this;
		// contentEl.empty();
		// ReactDOM.unmountComponentAtNode(contentEl);
		this.root.unmount();
	}

	// close() {
	// 	this.close()
	// }
}
