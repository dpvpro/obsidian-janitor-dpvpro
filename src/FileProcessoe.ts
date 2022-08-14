import { App } from 'obsidian';
export class FileProcessor {
	app: App;

	constructor( app:App) {
		this.app = app;
	}

	async process(filenames: string[],operation="trash", system=false){
		
		for(const file of filenames){
			const tfile = app.vault.getAbstractFileByPath(file);
			if(tfile){
				switch(operation){
					case "trash":
						await app.vault.trash(tfile, system);
						break;
					case "delete":
						await app.vault.delete(tfile);
						break;
					default:
						console.warn(`Warning: operation ${operation} unknown`);
						break;
				}
				
			} else {
				console.warn(`Warning: file ${file} was not found for thrashing!`)
			}
		}
	}
	// async delete(filenames: string[]){
	// 	for(const file in filenames){
	// 		const tfile = app.vault.getAbstractFileByPath(file);
	// 		if(tfile){
	// 			await app.vault.delete(tfile)
	// 		} else {
	// 			console.warn(`Warning: file ${file} was not found for thrashing!`)
	// 		}
	// 	}
	// }
}
