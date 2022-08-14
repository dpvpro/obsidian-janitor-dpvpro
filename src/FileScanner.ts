/* eslint-disable @typescript-eslint/no-unused-vars */
import { JanitorSettings } from './JanitorSettings';
import { App, CachedMetadata, Editor, FrontMatterCache, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile } from 'obsidian';
import { asyncFilter, partition } from './Utils';

export interface ScanResults {
	scanning: boolean,
	orphans: TFile[]
}

export class FileScanner {
	app: App;
	settings: JanitorSettings;
	// \S is \s negated
	whiteSpaceRegExp = new RegExp('\\S', '');
	constructor(app: App, settings: JanitorSettings) {
		this.app = app;
		this.settings = settings;
	}

	isNote(file: TFile): boolean {
		return file.extension.toLowerCase() === "md";
	}

	// TODO: consider deleted files returned by getFiles
	async scan(){
		console.log("Scanning Vault...");
		const files = this.app.vault.getFiles();
		// console.log(notes, others);

		// const resolvedLinks = notes.reduce((acc:TFile,))
		const orphans = this.findOrphans(files);
		console.log("Orphans: ");
		console.log(orphans);
		await this.findEmpty(files);
		return {orphans, scanning:false};
	}


	private async findEmpty(files: TFile[]){
		const empty = await asyncFilter(files,async file => {
			if(file.stat.size === 0) return true;
			const content = await this.app.vault.cachedRead(file);
			if(!this.whiteSpaceRegExp.test(content)) return true;
			return false;
		}); 
		console.log("Found the following EMpty Files:", empty);
	}

	private findOrphans(files: TFile[]) {
		const [notes, others] = partition(files,this.isNote);
		const resolvedLinks: { [key: string]: number; } = this.getResolvedLinks();
		// console.log("Consolidated resolvedLinks:");
		// console.log(resolvedLinks);

		// resolvedLinks contains the links outgoing from the notes
		// they could be media, attachments or nother notes
		// they are not the whole story, though, we need to account for
		// files referred to in the frontMatters (annotation-target for example)
		const frontMatters = this.getFrontMatters(notes);
		// console.log("Consolidated FrontMatters:");
		// console.log(frontMatters);

		const resolvedResources = this.combineLinksAndResolvedMetadata(frontMatters, resolvedLinks);

		// console.log("Consolidated resolvedResources:");
		// console.log(resolvedResources);

		// now resolvedLinksAndResolvedProps contains all resolved resources:
		// "others" that we collected and are not here are eligible to be purged
		const orphans = this.getOrphans(others, resolvedResources);
		return orphans;
	}

	private getOrphans(others: TFile[], resolvedLinksAndResolvedProps: { [key: string]: number; }) {
		return others.filter(file => {
			// console.log(`resolvedLinksAndResolvedProps[${file.path}]`, resolvedLinksAndResolvedProps[file.path]);
			return !resolvedLinksAndResolvedProps[file.path];
		});
	}

	private combineLinksAndResolvedMetadata(frontMatters: ({ frontMatter: FrontMatterCache; stringProps: string[]; resolvedProps: string[]; file: TFile; } | undefined)[], resolvedLinks: { [key: string]: number; }) {
		return frontMatters.reduce(
			(rl, fm) => {
				if (fm?.resolvedProps?.length) {
					return ({
						...rl,
						...fm.resolvedProps.reduce((ob, val) => ({ ...ob, [val]: 1 }), {})
					});
				} else {
					return rl;
				}
			},
			resolvedLinks
		);
	}

	private getFrontMatters(notes: TFile[]) {
		return notes.map(file => {
			const frontMatter = app.metadataCache.getFileCache(file)?.frontmatter;
			if (frontMatter) {
				const stringProps: string[] = extractStringProperties(frontMatter);
				if (stringProps?.length) {
					// we should distinguish files from other props maybe...
					const resolvedProps: string[] = stringProps.map(sp => {
						const resolvedFile = app.metadataCache.getFirstLinkpathDest(sp, file.path);
						if (resolvedFile)
							return resolvedFile.path;
					}).filter(sp => !!sp) as string[];
					return {
						frontMatter: frontMatter,
						stringProps,
						resolvedProps,
						file
					};
				}
			}
		}).filter(fm => !!fm);
	}

	private getResolvedLinks() {
		// console.log("MetadataCache:");
		// console.log(app.metadataCache);
		// console.log("resolvedLinks:");
		// console.log(app.metadataCache.resolvedLinks);
		const resolvedLinks: { [key: string]: number; } = Object.keys(app.metadataCache.resolvedLinks).
			reduce((rl: { [key: string]: number; }, fileName: string) => {
				return Object.assign(rl, app.metadataCache.resolvedLinks[fileName]);

			}, {});
		return resolvedLinks;
	}
}

function extractStringProperties(fm: any):string[] {
	return Object.values<string>(fm).filter(o => typeof o === 'string');
}

