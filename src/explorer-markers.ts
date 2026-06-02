import * as path from "path";
import type LnsDirectoriesPlugin from "./main";
import { checkLinkHealth, LinkHealth } from "./symlink-manager";
import { LinkKind } from "./types";

const STYLE_ID = "lns-explorer-markers";

interface MarkerPath {
	rel: string;
	kind: LinkKind;
	health: LinkHealth;
}

function cssEscape(value: string): string {
	if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
		return CSS.escape(value);
	}
	return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function buildMarkerCss(markers: MarkerPath[]): string {
	if (markers.length === 0) return "";

	const blocks: string[] = [
		"/* LNS Directories — symlink markers in file explorer */",
	];

	for (const { rel, kind, health } of markers) {
		const escaped = cssEscape(rel);
		const titleSel =
			kind === "directory"
				? `.nav-folder-title[data-path="${escaped}"]`
				: `.nav-file-title[data-path="${escaped}"]`;
		const contentSel =
			kind === "directory"
				? `${titleSel} .nav-folder-title-content::before`
				: `${titleSel} .nav-file-title-content::before`;

		const color =
			health === "ok"
				? kind === "directory"
					? "var(--color-orange)"
					: "var(--color-cyan)"
				: "var(--color-red)";

		blocks.push(`
${titleSel} {
	color: ${color};
}
${contentSel} {
	content: "⛓ ";
	opacity: ${health === "ok" ? "0.95" : "0.75"};
}
`);
	}

	return blocks.join("\n");
}

function collectMarkers(plugin: LnsDirectoriesPlugin): MarkerPath[] {
	const base = plugin.getVaultBase();
	return plugin.settings.links.map((entry) => {
		const rel = path.relative(base, entry.linkPath).replace(/\\/g, "/");
		return {
			rel,
			kind: entry.kind,
			health: checkLinkHealth(entry).health,
		};
	});
}

export function updateExplorerMarkers(plugin: LnsDirectoriesPlugin): void {
	const existing = document.getElementById(STYLE_ID);
	if (!plugin.settings.showExplorerMarkers) {
		existing?.remove();
		return;
	}

	const css = buildMarkerCss(collectMarkers(plugin));
	let style = existing as HTMLStyleElement | null;
	if (!style) {
		style = document.createElement("style");
		style.id = STYLE_ID;
		document.head.appendChild(style);
	}
	style.textContent = css;
}

export function removeExplorerMarkers(): void {
	document.getElementById(STYLE_ID)?.remove();
}

let layoutDebounce: number | undefined;

export function registerExplorerMarkerRefresh(
	plugin: LnsDirectoriesPlugin,
): void {
	const schedule = () => {
		if (layoutDebounce !== undefined) {
			window.clearTimeout(layoutDebounce);
		}
		layoutDebounce = window.setTimeout(() => {
			layoutDebounce = undefined;
			updateExplorerMarkers(plugin);
		}, 120);
	};

	plugin.registerEvent(plugin.app.workspace.on("layout-change", schedule));
	plugin.registerEvent(plugin.app.vault.on("create", schedule));
	plugin.registerEvent(plugin.app.vault.on("delete", schedule));
	plugin.registerEvent(plugin.app.vault.on("rename", schedule));
}
