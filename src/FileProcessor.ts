import { OperationType } from './JanitorSettings';
import { App, TFolder } from 'obsidian';
export class FileProcessor {
	app: App;

	constructor(app: App) {
		this.app = app;
	}

	async process(filenames: string[], operation = OperationType.Trash) {
		// ensures that we don't try to delete the same file twice
		const uniq = [...new Set(filenames)];
		let deletedFiles = 0;
		let notDeletedFiles = 0;

		for (const file of uniq) {
			const tfile = this.app.vault.getAbstractFileByPath(file);
			if (tfile) {
				try {

					switch (operation) {

						case OperationType.TrashSystem:
							await this.app.vault.trash(tfile, true);
							deletedFiles++;
							break;

						case OperationType.Trash:
							await this.app.vault.trash(tfile, false);
							deletedFiles++;
							break;
						case OperationType.Delete:
							await this.app.vault.delete(tfile);
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
		return { deletedFiles, notDeletedFiles };
	}

	async processFolders(folderPaths: string[], operation = OperationType.Trash) {
		// ensures that we don't try to delete the same folder twice
		const uniq = [...new Set(folderPaths)];
		let deletedFolders = 0;
		let notDeletedFolders = 0;

		for (const folderPath of uniq) {
			const folder = this.app.vault.getAbstractFileByPath(folderPath);
			if (folder && folder instanceof TFolder) {
				try {
					switch (operation) {
						case OperationType.TrashSystem:
							await this.app.vault.trash(folder, true);
							deletedFolders++;
							break;

						case OperationType.Trash:
							await this.app.vault.trash(folder, false);
							deletedFolders++;
							break;
						case OperationType.Delete:
							await this.app.vault.delete(folder);
							deletedFolders++;
							break;
						default:
							console.warn(`Warning: operation ${operation} unknown`);
							break;
					}
				} catch {
					notDeletedFolders++;
				}
			} else {
				console.warn(`Warning: folder ${folderPath} was not found for deletion!`);
				notDeletedFolders++;
			}
		}
		return { deletedFiles: deletedFolders, notDeletedFiles: notDeletedFolders };
	}
}
