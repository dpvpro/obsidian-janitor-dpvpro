/* eslint-disable @typescript-eslint/no-unused-vars */
import { JanitorView, JanitorViewProps } from './Views/JanitorView';
import { App, Modal } from "obsidian";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { createRoot, Root } from "react-dom/client";

export class JanitorModal extends Modal {
	constructor(app: App) {
		super(app);
		
	}

	root: Root;
	state: any;

	public updateState({scanning, orphans}: any){
		const props = {
			scanning: scanning,
			orphans: orphans
		};
		this.render(props);
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
		
		this.root = createRoot(contentEl/*.children[1]*/);
		
	}

	onClose() {
		const { contentEl } = this;
		// contentEl.empty();
		// ReactDOM.unmountComponentAtNode(contentEl);
		this.root.unmount();
	}
}
