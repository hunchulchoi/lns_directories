import { App, PluginSettingTab, Setting } from "obsidian";
import { localeOptions, t } from "./i18n";
import { renderLinkList } from "./link-list-ui";
import type LnsDirectoriesPlugin from "./main";
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
			.setName(t(this.plugin, "settings.showExplorerMarkersName"))
			.setDesc(t(this.plugin, "settings.showExplorerMarkersDesc"))
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.showExplorerMarkers)
					.onChange(async (value) => {
						this.plugin.settings.showExplorerMarkers = value;
						await this.plugin.saveSettings();
						this.plugin.refreshExplorerMarkers();
					}),
			);

		new Setting(containerEl)
			.setName(t(this.plugin, "settings.openLinksPanelName"))
			.setDesc(t(this.plugin, "settings.openLinksPanelDesc"))
			.addButton((btn) =>
				btn
					.setButtonText(t(this.plugin, "settings.openLinksPanel"))
					.onClick(() => this.plugin.activateLinksPanel()),
			);

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

		renderLinkList(containerEl, this.plugin, () => this.display());
	}
}
