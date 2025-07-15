export enum OperationType {
	Trash = "trash",
	TrashSystem = "trash-system",
	Delete = "delete"
}
export interface JanitorSettings {

	runAtStartup: boolean;
	addRibbonIcon: boolean;
	promptUser: boolean;
	promptForBigFiles: boolean;
	defaultOperation: OperationType;
	attachmentsExtensions: string;
	// useSystemTrash: boolean;
	expiredAttribute: string;
	expiredDateFormat: string;
	sizeLimitKb: number;

	processOrphans: boolean;
	processEmpty: boolean;
	processExpired: boolean;
	processBig: boolean;
	processEmptyDirectory: boolean;
	honorObsidianExcludedFiles: boolean;
	excludedFilesFilters: string[];
}

export const DEFAULT_SETTINGS: JanitorSettings = {
	runAtStartup: false,
	addRibbonIcon: true,
	promptUser: true,
	promptForBigFiles: true,
	attachmentsExtensions: ".jpg|.jpeg|.png|.gif|.svg|.pdf",
	// useSystemTrash: false,
	defaultOperation: OperationType.Trash,
	expiredAttribute: "expires",
	expiredDateFormat: "YYYY-MM-DD",
	sizeLimitKb: 1024,
	processOrphans: true,
	processEmpty: true,
	processExpired: true,
	processBig: true,
	processEmptyDirectory: true,
	honorObsidianExcludedFiles: true,
	excludedFilesFilters: []
}
