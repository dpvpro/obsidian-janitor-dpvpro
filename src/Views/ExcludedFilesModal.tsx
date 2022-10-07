
import * as React from "react";
import { App, Modal} from "obsidian";
import { JanitorSettings } from "src/JanitorSettings";
import { createRoot, Root } from "react-dom/client";


export class ExcludedFilesModal extends Modal {
	settings: JanitorSettings;
	root: Root;
	state: any;

	constructor(app: App, settings: JanitorSettings) {
		super(app);
		this.settings = settings;
		this.state = {
		}
	}

	render() {
		this.root.render(
			<React.StrictMode>
				WIP
			</React.StrictMode>
		);
	}

	onOpen() {
		const { contentEl } = this;

		this.root = createRoot(contentEl);
		this.render();

	}

	onClose() {

		this.root.unmount();
	}
}
