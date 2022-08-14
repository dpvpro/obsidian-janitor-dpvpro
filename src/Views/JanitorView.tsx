import * as React from "react";
import { useState } from "react";

export interface JanitorViewProps {
	scanning: boolean,
	orphans: number
}

export const JanitorView = (props:JanitorViewProps) => {

	// const [state, setState] = useState({
	// 	scanning: true,
	// 	orphans: 0
	// });
	const {scanning, orphans} = props;
	
	if(scanning){
		return <h4>Scanning...</h4>;
	} else {
		return <h4>Found {orphans} orphans</h4>
	}
};
