import { ItemView, WorkspaceLeaf } from "obsidian";
import { t } from "./i18n";
import { renderLinkList } from "./link-list-ui";
import type LnsDirectoriesPlugin from "./main";

export const LNS_LINKS_VIEW_TYPE = "lns-links-panel";

export class LnsLinksPanelView extends ItemView {
	plugin: LnsDirectoriesPlugin;

	constructor(leaf: WorkspaceLeaf, plugin: LnsDirectoriesPlugin) {
		super(leaf);
		this.plugin = plugin;
	}

	getViewType(): string {
		return LNS_LINKS_VIEW_TYPE;
	}

	getDisplayText(): string {
		return t(this.plugin, "panel.title");
	}

	getIcon(): string {
		return "link";
	}

	async onOpen(): Promise<void> {
		this.render();
	}

	async onClose(): Promise<void> {
		this.contentEl.empty();
	}

	render(): void {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.addClass("lns-links-panel");

		const header = contentEl.createDiv({ cls: "lns-panel-header" });
		header.createEl("h4", { text: t(this.plugin, "panel.title") });

		const btnRow = header.createDiv({ cls: "lns-panel-btn-row" });
		btnRow
			.createEl("button", { text: t(this.plugin, "settings.linkDirectory") })
			.addEventListener("click", () => this.plugin.openLinkModal("directory"));
		btnRow
			.createEl("button", { text: t(this.plugin, "settings.linkFile") })
			.addEventListener("click", () => this.plugin.openLinkModal("file"));
		btnRow
			.createEl("button", { text: t(this.plugin, "panel.refresh") })
			.addEventListener("click", () => {
				this.plugin.refreshUi();
				this.render();
			});

		const scroll = contentEl.createDiv({ cls: "lns-panel-scroll" });
		renderLinkList(scroll, this.plugin, () => this.render());
	}
}
