import {
	App,
	Menu,
	Notice,
	Plugin,
	FileSystemAdapter,
	TFolder,
} from "obsidian";
import { LinkModal } from "./link-modal";
import { t } from "./i18n";
import { LnsSettingTab } from "./settings-tab";
import { getVaultBasePath } from "./symlink-manager";
import {
	DEFAULT_SETTINGS,
	LinkKind,
	LnsSettings,
	SymlinkEntry,
} from "./types";

export default class LnsDirectoriesPlugin extends Plugin {
	settings: LnsSettings = DEFAULT_SETTINGS;

	async onload(): Promise<void> {
		await this.loadSettings();

		this.addSettingTab(new LnsSettingTab(this.app, this));

		this.addRibbonIcon("link", t(this, "ribbon.tooltip"), (evt) => {
			const menu = new Menu();
			menu.addItem((item) =>
				item
					.setTitle(t(this, "ribbon.linkDirectory"))
					.setIcon("folder")
					.onClick(() => this.openLinkModal("directory")),
			);
			menu.addItem((item) =>
				item
					.setTitle(t(this, "ribbon.linkFile"))
					.setIcon("file")
					.onClick(() => this.openLinkModal("file")),
			);
			menu.showAtMouseEvent(evt);
		});

		this.addCommand({
			id: "link-directory",
			name: t(this, "cmd.linkDirectory"),
			callback: () => this.openLinkModal("directory"),
		});

		this.addCommand({
			id: "link-file",
			name: t(this, "cmd.linkFile"),
			callback: () => this.openLinkModal("file"),
		});

		this.addCommand({
			id: "refresh-links",
			name: t(this, "cmd.refreshLinks"),
			callback: () => {
				this.refreshSettingsTab();
				new Notice(
					t(this, "notice.refreshCount", {
						count: this.settings.links.length,
					}),
				);
			},
		});

		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file, source) => {
				if (source === "link-context-menu" || source === "canvas-menu") {
					return;
				}
				if (!(file instanceof TFolder)) return;

				const parentFolder = file.path;

				menu.addSeparator();
				menu.addItem((item) =>
					item
						.setTitle(t(this, "menu.addSymDirectory"))
						.setIcon("folder")
						.onClick(() => this.openLinkModal("directory", parentFolder)),
				);
				menu.addItem((item) =>
					item
						.setTitle(t(this, "menu.addSymFile"))
						.setIcon("file")
						.onClick(() => this.openLinkModal("file", parentFolder)),
				);
			}),
		);
	}

	onunload(): void {}

	getVaultBase(): string {
		return getVaultBasePath(this.app.vault.adapter as FileSystemAdapter);
	}

	async loadSettings(): Promise<void> {
		const loaded = (await this.loadData()) as Partial<LnsSettings> | null;
		this.settings = { ...DEFAULT_SETTINGS, ...loaded };
		if (!Array.isArray(this.settings.links)) {
			this.settings.links = [];
		}
		if (!this.settings.locale) {
			this.settings.locale = "auto";
		}
		if (!this.settings.lastSourcePaths) {
			this.settings.lastSourcePaths = {};
		}
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}

	async addEntry(entry: SymlinkEntry): Promise<void> {
		this.settings.links.push(entry);
		if (!this.settings.lastSourcePaths) {
			this.settings.lastSourcePaths = {};
		}
		this.settings.lastSourcePaths[entry.kind] = entry.source;
		await this.saveSettings();
		this.refreshSettingsTab();
	}

	async removeEntry(id: string): Promise<void> {
		this.settings.links = this.settings.links.filter((l) => l.id !== id);
		await this.saveSettings();
	}

	openLinkModal(kind: LinkKind, parentFolder = ""): void {
		if (!(this.app.vault.adapter instanceof FileSystemAdapter)) {
			new Notice(t(this, "notice.localVaultOnly"));
			return;
		}
		new LinkModal(
			this,
			kind,
			async ({ entry }) => {
				await this.addEntry(entry);
			},
			parentFolder,
		).open();
	}

	refreshSettingsTab(): void {
		const setting = (
			this.app as App & {
				setting?: {
					activeTab?: { plugin?: Plugin; display: () => void };
				};
			}
		).setting;
		if (setting?.activeTab?.plugin === this) {
			setting.activeTab.display();
		}
	}

	reloadUi(): void {
		this.refreshSettingsTab();
	}
}
