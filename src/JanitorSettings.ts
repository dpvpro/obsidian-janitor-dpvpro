
export interface JanitorSettings {

	mySetting: string;
	attachmentsExtensions: string;
	useSystemTrash: boolean;
}

export const DEFAULT_SETTINGS: JanitorSettings = {
	mySetting: 'default',
	attachmentsExtensions: ".jpg|.jpeg|.png|.gif|.svg|.pdf",
	useSystemTrash: false
}
