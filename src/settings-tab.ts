import { App, Notice, PluginSettingTab, Setting, TFile } from "obsidian";
import * as path from "path";
import { translateError } from "./errors";
import { localeOptions, t } from "./i18n";
import type { MessageKey } from "./i18n/en";
import type LnsDirectoriesPlugin from "./main";
import { removeSymlink, checkLinkHealth, LinkHealth } from "./symlink-manager";
import { LnsLocale } from "./types";

export class LnsSettingTab extends PluginSettingTab {
	plugin: LnsDirectoriesPlugin;

	constructor(app: App, plugin: LnsDirectoriesPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl("h2", { text: "LNS Directories" });
		containerEl.createEl("p", {
			text: t(this.plugin, "settings.description"),
		});

		new Setting(containerEl)
			.setName(t(this.plugin, "settings.localeName"))
			.setDesc(t(this.plugin, "settings.localeDesc"))
			.addDropdown((dropdown) => {
				for (const opt of localeOptions(this.plugin)) {
					dropdown.addOption(opt.value, opt.label);
				}
				dropdown.setValue(this.plugin.settings.locale);
				dropdown.onChange(async (value) => {
					this.plugin.settings.locale = value as LnsLocale;
					await this.plugin.saveSettings();
					this.display();
					this.plugin.refreshSettingsTab();
				});
			});

		new Setting(containerEl)
			.setName(t(this.plugin, "settings.newLink"))
			.setDesc(t(this.plugin, "settings.newLinkDesc"))
			.addButton((btn) =>
				btn
					.setButtonText(t(this.plugin, "settings.linkDirectory"))
					.onClick(() => {
						this.plugin.openLinkModal("directory");
					}),
			)
			.addButton((btn) =>
				btn
					.setButtonText(t(this.plugin, "settings.linkFile"))
					.onClick(() => {
						this.plugin.openLinkModal("file");
					}),
			);

		const listEl = containerEl.createDiv({ cls: "lns-link-list" });

		if (this.plugin.settings.links.length === 0) {
			listEl.createEl("p", {
				cls: "lns-empty",
				text: t(this.plugin, "settings.empty"),
			});
			return;
		}

		for (const entry of this.plugin.settings.links) {
			const status = checkLinkHealth(entry);
			const rel = path.relative(
				this.plugin.getVaultBase(),
				entry.linkPath,
			);

			const row = listEl.createDiv({ cls: "lns-link-row" });
			row.createEl("div", {
				cls: `lns-health lns-health-${status.health}`,
				text: this.healthLabel(status.health),
			});

			const info = row.createDiv({ cls: "lns-link-info" });
			info.createEl("strong", { text: rel });
			info.createEl("div", {
				cls: "lns-link-detail",
				text: t(this.plugin, "settings.sourceLabel", { path: entry.source }),
			});

			new Setting(row)
				.addButton((btn) =>
					btn
						.setButtonText(t(this.plugin, "settings.showInFinder"))
						.setDisabled(status.health === "missing_link")
						.onClick(() => {
							try {
								// eslint-disable-next-line @typescript-eslint/no-explicit-any
								const shell = (window as any).require?.("electron")?.shell;
								shell?.showItemInFolder(entry.linkPath);
							} catch {
								new Notice(t(this.plugin, "notice.pathOpenFailed"));
							}
						}),
				)
				.addButton((btn) =>
					btn
						.setButtonText(t(this.plugin, "settings.openNote"))
						.setDisabled(
							entry.kind !== "file" || status.health === "missing_link",
						)
						.onClick(async () => {
							const file = this.app.vault.getAbstractFileByPath(rel);
							if (file instanceof TFile) {
								await this.app.workspace.getLeaf(false).openFile(file);
							} else {
								new Notice(t(this.plugin, "notice.fileNotInVault"));
							}
						}),
				)
				.addButton((btn) =>
					btn
						.setButtonText(t(this.plugin, "settings.removeLink"))
						.setWarning()
						.onClick(async () => {
							try {
								if (status.health !== "missing_link") {
									removeSymlink(entry.linkPath);
								}
								await this.plugin.removeEntry(entry.id);
								new Notice(
									t(this.plugin, "notice.removed", { path: rel }),
								);
								this.display();
							} catch (e) {
								new Notice(
									t(this.plugin, "notice.removeFailed", {
										message: translateError(this.plugin, e),
									}),
								);
							}
						}),
				);
		}
	}

	private healthLabel(health: LinkHealth): string {
		return t(this.plugin, `health.${health}` as MessageKey);
	}
}
