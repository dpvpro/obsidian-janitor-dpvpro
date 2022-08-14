
export interface JanitorSettings {

	runAtStartup: boolean;
	attachmentsExtensions: string;
	useSystemTrash: boolean;
}

export const DEFAULT_SETTINGS: JanitorSettings = {
	runAtStartup: false,
	attachmentsExtensions: ".jpg|.jpeg|.png|.gif|.svg|.pdf",
	useSystemTrash: false
}
