
export interface JanitorSettings {

	runAtStartup: boolean;
	attachmentsExtensions: string;
	useSystemTrash: boolean;
	expiredAttribute: string;
	expiredDateFormat: string;
	sizeLimitKb: number;

	processOrphans: boolean;
	processEmpty: boolean;
	processExpired: boolean;
	processBig: boolean;
}

export const DEFAULT_SETTINGS: JanitorSettings = {
	runAtStartup: false,
	attachmentsExtensions: ".jpg|.jpeg|.png|.gif|.svg|.pdf",
	useSystemTrash: false,
	expiredAttribute: "expires",
	expiredDateFormat: "YYYY-MM-DD",
	sizeLimitKb: 100,
	processOrphans: true,
	processEmpty: true,
	processExpired: true,
	processBig: true
}
