
import * as React from "react";
import { App, Modal} from "obsidian";
import { JanitorSettings } from "src/JanitorSettings";
import { createRoot, Root } from "react-dom/client";
import CloseIcon from "../svg/close.svg";
import { useRef, useState } from "react";
import { Info, SettingControl, SettingItem, SettingsInfo } from "./SettingControls";
import { getFolders } from "src/Utils";
import { SelectObs } from "./Select";

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
		const folders = getFolders(this.app).map(f => ({ value: f, label: f }));
	
		this.root.render(
			<React.StrictMode>
				<ExcudedFilesView 
					filters={this.settings.excludedFilesFilters} 
					folders={folders}
				/>
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

type ExcudedFilesViewProps = {
	filters: string[],
	folders: {
        value: string;
        label: string;
    }[]
}
// https://stackoverflow.com/questions/54890660/react-select-dropdown-opens-inside-modal
// https://stackoverflow.com/questions/57089251/react-select-can-not-overlay-react-modal
const ExcudedFilesView = ({filters, folders}: ExcudedFilesViewProps) => {

	const [list, update] = useState(filters);
	const ref = useRef<HTMLDivElement>(null);

	const onAdd = React.useCallback((e:React.MouseEvent)=>{

	},[])

	return <div ref={ref}>
		{list.map(filter=>(
			<div className="mobile-option-setting-item">
				<span className="mobile-option-setting-item-name">{filter}</span>
				<span className="mobile-option-setting-item-option-icon"><CloseIcon /></span>
			</div>
		))}
		<SettingItem>
			<SettingsInfo name="Filter" description="" />
			<SettingControl>
			<SelectObs
						container={ref.current || document.body}
                        options={folders}
                        placeholder="Select a folder..." />
						<button onClick={onAdd}>Add</button>
			</SettingControl>
		</SettingItem>
	</div>
}
