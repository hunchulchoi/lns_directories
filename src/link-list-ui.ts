import { Notice, Setting, TAbstractFile, TFile } from "obsidian";
import * as path from "path";
import { translateError } from "./errors";
import { t } from "./i18n";
import type { MessageKey } from "./i18n/en";
import type LnsDirectoriesPlugin from "./main";
import { removeSymlink, checkLinkHealth, LinkHealth } from "./symlink-manager";

export function renderLinkList(
	containerEl: HTMLElement,
	plugin: LnsDirectoriesPlugin,
	onChange?: () => void,
): void {
	const listEl = containerEl.createDiv({ cls: "lns-link-list" });

	if (plugin.settings.links.length === 0) {
		listEl.createEl("p", {
			cls: "lns-empty",
			text: t(plugin, "settings.empty"),
		});
		return;
	}

	for (const entry of plugin.settings.links) {
		const status = checkLinkHealth(entry);
		const rel = path
			.relative(plugin.getVaultBase(), entry.linkPath)
			.replace(/\\/g, "/");

		const row = listEl.createDiv({ cls: "lns-link-row" });
		row.createEl("div", {
			cls: `lns-health lns-health-${status.health}`,
			text: healthLabel(plugin, status.health),
		});

		const info = row.createDiv({ cls: "lns-link-info" });
		info.createEl("strong", { text: rel });
		info.createEl("div", {
			cls: "lns-link-detail",
			text: t(plugin, "settings.sourceLabel", { path: entry.source }),
		});
		info.createEl("div", {
			cls: "lns-link-kind",
			text: t(plugin, `kind.${entry.kind}` as MessageKey),
		});

		new Setting(row)
			.addButton((btn) =>
				btn
					.setButtonText(t(plugin, "settings.revealInExplorer"))
					.onClick(() => {
						const abstract =
							plugin.app.vault.getAbstractFileByPath(rel);
						if (!abstract) {
							new Notice(t(plugin, "notice.fileNotInVault"));
							return;
						}
						const leaf = plugin.app.workspace.getLeavesOfType(
							"file-explorer",
						)[0];
						const view = leaf?.view as {
							revealInFolder?: (f: TAbstractFile) => void;
						};
						if (view?.revealInFolder) {
							view.revealInFolder(abstract);
						}
					}),
			)
			.addButton((btn) =>
				btn
					.setButtonText(t(plugin, "settings.showInFinder"))
					.setDisabled(status.health === "missing_link")
					.onClick(() => {
						try {
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							const shell = (window as any).require?.("electron")?.shell;
							shell?.showItemInFolder(entry.linkPath);
						} catch {
							new Notice(t(plugin, "notice.pathOpenFailed"));
						}
					}),
			)
			.addButton((btn) =>
				btn
					.setButtonText(t(plugin, "settings.openNote"))
					.setDisabled(
						entry.kind !== "file" || status.health === "missing_link",
					)
					.onClick(async () => {
						const file = plugin.app.vault.getAbstractFileByPath(rel);
						if (file instanceof TFile) {
							await plugin.app.workspace.getLeaf(false).openFile(file);
						} else {
							new Notice(t(plugin, "notice.fileNotInVault"));
						}
					}),
			)
			.addButton((btn) =>
				btn
					.setButtonText(t(plugin, "settings.removeLink"))
					.setWarning()
					.onClick(async () => {
						try {
							if (status.health !== "missing_link") {
								removeSymlink(entry.linkPath);
							}
							await plugin.removeEntry(entry.id);
							new Notice(t(plugin, "notice.removed", { path: rel }));
							onChange?.();
						} catch (e) {
							new Notice(
								t(plugin, "notice.removeFailed", {
									message: translateError(plugin, e),
								}),
							);
						}
					}),
			);
	}
}

function healthLabel(
	plugin: LnsDirectoriesPlugin,
	health: LinkHealth,
): string {
	return t(plugin, `health.${health}` as MessageKey);
}
