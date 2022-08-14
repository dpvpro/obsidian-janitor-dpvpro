/* eslint-disable @typescript-eslint/no-unused-vars */
import { JanitorSettings } from './JanitorSettings';
import { App, CachedMetadata, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile } from 'obsidian';

function partition<T>(array: T[], isValid: (el: T) => boolean) :T[][] {
	return array.reduce(([pass, fail]: any, elem: any) => {
		return isValid(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]];
	}, [[], []]);
}

export class FileScanner {
	constructor(app: App, settings: JanitorSettings) {
		
	}

	isNote(file: TFile): boolean {
		return file.extension.toLowerCase() === "md";
	}

	// TODO: consider deleted files returned by getFiles
	async scan(){
		console.log("TODO: actually do something!");
		const files = app.vault.getFiles();
		const [notes, others] = partition(files,this.isNote);
		// console.log(notes, others);

		// const resolvedLinks = notes.reduce((acc:TFile,))
		console.log("MetadataCache:");
		console.log(app.metadataCache);
		console.log("resolvedLinks:");
		console.log(app.metadataCache.resolvedLinks);
		const resolvedLinks:{[key: string]: number} = Object.keys(app.metadataCache.resolvedLinks).
			reduce((rl:{[key: string]: number},fileName:string)=>{
				return Object.assign(rl,app.metadataCache.resolvedLinks[fileName]);
			
			},{});
		console.log("Consolidated resolvedLinks:");
		console.log(resolvedLinks);
		const frontMatters = notes.map(file => {
			return app.metadataCache.getFileCache(file)?.frontmatter
		}).filter(fm=>!!fm);
		console.log("Consolidated FrontMatters:")
		console.log(frontMatters);
	}
}
