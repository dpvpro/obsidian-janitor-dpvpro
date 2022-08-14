import * as React from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useCallback, useState } from "react";

export interface SelectableItem {
	selected: boolean,
	name: string
}
export interface JanitorViewProps {
	scanning: boolean,
	orphans: SelectableItem[],
	onClose: ()=>void,
	onSelectionChange: (i:number,section:string)=>void,
	onPerform(operation:string):void
}

export const JanitorView = (props: JanitorViewProps) => {

	// const [state, setState] = useState({
	// 	scanning: true,
	// 	orphans: 0
	// });
	const { scanning, onClose, onPerform } = props;
	const somethingSelected = props.orphans.some(item=>item.selected);
	const handlePerform = useCallback((operation:string)=>useCallback(()=>{
		onPerform(operation);
	},[operation,onPerform]),[onPerform]);
	const handleTrash = handlePerform("trash");
	const handleDelete = handlePerform("delete");

	return (
		<div className="janitor-modal-wrapper">
			<div className="janitor-modal-content">
				{scanning ? <h4>Scanning...</h4> : <ScanResults {...props} />}
			</div>
			<div className="janitor-modal-footer">
				
				{somethingSelected && <button className="" onClick={handleTrash}>Trash</button>}
				{somethingSelected && <button className="" onClick={handleDelete}>Delete</button>}
				<button className="mod-cta" onClick={onClose}>Close</button>
			</div>
		</div>
	)
};
function ScanResults({ orphans, onSelectionChange }: { orphans: SelectableItem[], onSelectionChange:(i:number,section:string)=>void }) {
	
	const onOrphansSelectionChange = useCallback((i:number)=>{
		onSelectionChange(i,"orphans");
	},[onSelectionChange]);


	return (
		<div className="janitor-scan-results">
			<div className="janitor-scan-section-title">Found {orphans.length} orphans</div>
			<FileList files={orphans} onChange={onOrphansSelectionChange} />
		</div>
	)

}

const FileList = ({files, onChange}:{files:SelectableItem[], onChange:(i:number)=>void}) => {

	const handleOnChange = useCallback((i:number)=>
		useCallback(
			()=>{
				onChange(i);
			}
		,[onChange,i])
	,[onChange]);

	return (<div className="janitor-files-wrapper">
		{
			files.map((file,i)=>(
				<div key={i} className="janitor-file">
					<input 
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
