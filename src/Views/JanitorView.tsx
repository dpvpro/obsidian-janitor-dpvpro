import * as React from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useCallback, useState } from "react";

export interface SelectableItem {
	selected: boolean,
	name: string
}
export interface JanitorViewProps {
	scanning: boolean,
	orphans: SelectableItem[] | false,
	empty: SelectableItem[] | false,
	big: SelectableItem[] | false,
	expired: SelectableItem[] | false,
	onClose: ()=>void,
	onSelectionChange: (i:number,section:string)=>void,
	onPerform(operation:string):void,
	useSystemTrash: boolean,
	onSettingChange:(setting:string, value:any)=>void
}

export const JanitorView = (props: JanitorViewProps) => {

	// const [state, setState] = useState({
	// 	scanning: true,
	// 	orphans: 0
	// });
	const { scanning, onClose, onPerform, useSystemTrash, onSettingChange } = props;
	const somethingSelected = [props.orphans, props.empty, props.expired, props.big]
	.some(files => files && files.some(item=>item.selected))
	


	const handlePerform = useCallback((operation:string)=>useCallback(()=>{
		onPerform(operation);
	},[operation,onPerform]),[onPerform]);
	const handleTrash = handlePerform("trash");
	const handleDelete = handlePerform("delete");

	const handleTrashChange = useCallback(()=>{
		onSettingChange("useSystemTrash", !useSystemTrash);
	},[onSettingChange,useSystemTrash]);

	return (
		<div className="janitor-modal-wrapper">
			<div className="janitor-modal-content">
				{scanning ? <h4>Scanning...</h4> : <ScanResults {...props} />}
			</div>
			<div className="janitor-modal-footer">
				<div className="janitor-footer-settings">
					<label htmlFor="useSystemTrash">Use System Trash</label>
					<input name="useSystemTrash" id="useSystemTrash" type="checkbox" checked={useSystemTrash} onChange={handleTrashChange} />
				</div>
				<div className="janitor-footer-buttons">
					{somethingSelected && <button className="" onClick={handleTrash}>Trash</button>}
					{somethingSelected && <button className="" onClick={handleDelete}>Delete</button>}
					<button className="mod-cta" onClick={onClose}>Close</button>
				</div>	
			</div>
		</div>
	)
};
function ScanResults({ orphans,empty,big,expired, onSelectionChange }: 
	{ orphans: SelectableItem[] | false, 
		empty: SelectableItem[] | false,
		big: SelectableItem[] | false,
		expired: SelectableItem[] | false,
		onSelectionChange:(i:number,section:string)=>void }) {
	
	const handleSelectionChange =
		useCallback((section:string)=>
			useCallback((i:number)=>{
				onSelectionChange(i,section);
			},[onSelectionChange,section])	
		,[onSelectionChange ])

	;


	return (
		<div className="janitor-scan-results">
			{orphans && <FileList files={orphans} onChange={handleSelectionChange("orphans")} title="Orphans" />}
			{empty && <FileList title="Empty" files={empty} onChange={handleSelectionChange("empty")} />}
			{expired && <FileList title="Expired" files={expired} onChange={handleSelectionChange("expired")} />}
			{big && <FileList title="Big" files={big} onChange={handleSelectionChange("big")} />}
		</div>

	)

}

const FileList = ({files, onChange, title}:{files:SelectableItem[], 
	onChange:(i:number)=>void,
	title: string}
	) => {

	const handleOnChange = useCallback((i:number)=>
		useCallback(
			()=>{
				onChange(i);
			}
		,[onChange,i])
	,[onChange]);

	
	const allSelected = files.every(file => file.selected);

	return (<div className="janitor-files-wrapper">
		<div className="janitor-scan-section-title">
			<input type="checkbox" checked={allSelected} onChange={handleOnChange(-1)} />
			{title} ({files.length} items) </div>
		{
			files.map((file,i)=>(
				<div key={i} className="janitor-file">
					<input 
						checked={file.selected}
						value={file.name} 
						onChange={handleOnChange(i)}
						type="checkbox" />
					<span>{file.name}</span>
				</div>
			))
		}
	</div>
	);
}
