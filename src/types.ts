export type LinkKind = "file" | "directory";

export type LnsLocale = "auto" | "en" | "ko";

export interface SymlinkEntry {
	id: string;
	source: string;
	linkPath: string;
	kind: LinkKind;
	createdAt: number;
}

export interface LnsSettings {
	links: SymlinkEntry[];
	locale: LnsLocale;
	/** Highlight registered symlinks in the file explorer (icon + color). */
	showExplorerMarkers: boolean;
	/** Last source path used per link kind (directory vs file). */
	lastSourcePaths?: Partial<Record<LinkKind, string>>;
}

export const DEFAULT_SETTINGS: LnsSettings = {
	links: [],
	locale: "auto",
	showExplorerMarkers: true,
	lastSourcePaths: {},
};
