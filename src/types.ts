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
}

export const DEFAULT_SETTINGS: LnsSettings = {
	links: [],
	locale: "auto",
};
