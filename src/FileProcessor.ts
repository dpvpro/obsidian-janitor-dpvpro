import { App } from 'obsidian';
export class FileProcessor {
	app: App;

	constructor( app:App) {
		this.app = app;
	}

	async process(filenames: string[],operation="trash", system=false){
		// ensures that we don't try to delete the same file twice
		const uniq = [...new Set(filenames)];
		let deletedFiles=0;
		let notDeletedFiles=0;

		for(const file of uniq){
			const tfile = app.vault.getAbstractFileByPath(file);
			if(tfile){
				try {

					switch(operation){
						case "trash":
							await app.vault.trash(tfile, system);
							deletedFiles++;
							break;
						case "delete":
							await app.vault.delete(tfile);
							deletedFiles++;
							break;
						default:
							console.warn(`Warning: operation ${operation} unknown`);
							break;
					}
				} catch {
					notDeletedFiles++;
				}
				
			} else {
				console.warn(`Warning: file ${file} was not found for thrashing!`);
				notDeletedFiles++;
			}
		}
		return {deletedFiles, notDeletedFiles};
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
