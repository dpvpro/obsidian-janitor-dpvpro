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
	onOrphansSelectionChange: (i:number)=>void
}

export const JanitorView = (props: JanitorViewProps) => {

	// const [state, setState] = useState({
	// 	scanning: true,
	// 	orphans: 0
	// });
	const { scanning, onClose } = props;

	return (
		<div className="janitor-modal-wrapper">
			<div className="janitor-modal-content">
				{scanning ? <h4>Scanning...</h4> : <ScanResults {...props} />}
			</div>
			<div className="janitor-modal-footer">
				<button className="mod-cta" onClick={onClose}>Close</button>
			</div>
		</div>
	)
};
function ScanResults({ orphans, onOrphansSelectionChange }: { orphans: SelectableItem[], onOrphansSelectionChange:(i:number)=>void }) {
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
		,[files,i])
	,[files]);

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
