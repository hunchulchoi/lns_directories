import { FileSystemAdapter, Modal, Notice, Setting } from "obsidian";
import * as path from "path";
import { pickFilesystemPath } from "./dialog";
import { translateError } from "./errors";
import { t } from "./i18n";
import type LnsDirectoriesPlugin from "./main";
import {
	createSymlink,
	detectKind,
	getVaultBasePath,
	normalizeVaultRelative,
	resolveVaultPath,
	suggestLinkRelative,
} from "./symlink-manager";
import { LinkKind, SymlinkEntry } from "./types";

export interface LinkModalResult {
	entry: SymlinkEntry;
}

export class LinkModal extends Modal {
	private sourcePath = "";
	private linkRelative = "";
	private kind: LinkKind;
	private parentFolder: string;
	private plugin: LnsDirectoriesPlugin;
	private onSubmit: (result: LinkModalResult) => void;

	constructor(
		plugin: LnsDirectoriesPlugin,
		kind: LinkKind,
		onSubmit: (result: LinkModalResult) => void,
		parentFolder = "",
	) {
		super(plugin.app);
		this.plugin = plugin;
		this.kind = kind;
		this.onSubmit = onSubmit;
		this.parentFolder = parentFolder;
		if (parentFolder) {
			this.linkRelative = normalizeVaultRelative(parentFolder);
			this.parentFolder = this.linkRelative;
		}
		const lastSource = plugin.settings.lastSourcePaths?.[kind];
		if (lastSource) {
			this.sourcePath = lastSource;
			this.linkRelative = suggestLinkRelative(lastSource, this.parentFolder);
		}
	}

	onOpen(): void {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.createEl("h2", {
			text:
				this.kind === "directory"
					? t(this.plugin, "modal.titleDirectory")
					: t(this.plugin, "modal.titleFile"),
		});
		contentEl.createEl("p", {
			cls: "lns-modal-desc",
			text: t(this.plugin, "modal.description"),
		});

		new Setting(contentEl)
			.setName(t(this.plugin, "modal.sourceName"))
			.setDesc(t(this.plugin, "modal.sourceDesc"))
			.addText((text) => {
				text
					.setPlaceholder(t(this.plugin, "modal.sourcePlaceholder"))
					.setValue(this.sourcePath)
					.onChange((v) => {
						this.sourcePath = v.trim();
						if (this.sourcePath) {
							this.updateLinkRelativeFromSource();
						}
					});
				text.inputEl.style.width = "100%";
			})
			.addButton((btn) =>
				btn.setButtonText(t(this.plugin, "modal.browse")).onClick(async () => {
					const picked = await pickFilesystemPath(this.plugin, this.kind);
					if (picked) {
						this.sourcePath = picked;
						this.updateLinkRelativeFromSource();
						this.refreshSourceInput();
						this.refreshLinkInput();
					}
				}),
			);

		const linkDesc = this.parentFolder
			? t(this.plugin, "modal.vaultLinkDescFolder", {
					folder: this.parentFolder,
				})
			: t(this.plugin, "modal.vaultLinkDescDefault");

		new Setting(contentEl)
			.setName(t(this.plugin, "modal.vaultLinkName"))
			.setDesc(linkDesc)
			.addText((text) => {
				text
					.setPlaceholder(
						this.parentFolder
							? t(this.plugin, "modal.vaultLinkPlaceholderFolder", {
									folder: this.parentFolder,
								})
							: t(this.plugin, "modal.vaultLinkPlaceholderDefault"),
					)
					.setValue(this.linkRelative)
					.onChange((v) => {
						this.linkRelative = v.trim();
					});
				text.inputEl.style.width = "100%";
				this.linkText = text;
			});

		new Setting(contentEl)
			.addButton((btn) =>
				btn
					.setButtonText(t(this.plugin, "modal.create"))
					.setCta()
					.onClick(() => this.submit()),
			)
			.addButton((btn) =>
				btn
					.setButtonText(t(this.plugin, "modal.cancel"))
					.onClick(() => this.close()),
			);
	}

	private linkText?: { setValue: (v: string) => void };

	private refreshSourceInput(): void {
		const input = this.contentEl.querySelector(
			"input[type='text']",
		) as HTMLInputElement | null;
		if (input) input.value = this.sourcePath;
	}

	private refreshLinkInput(): void {
		this.linkText?.setValue(this.linkRelative);
	}

	private updateLinkRelativeFromSource(): void {
		if (!this.sourcePath) return;
		this.linkRelative = suggestLinkRelative(
			this.sourcePath,
			this.parentFolder,
		);
		this.refreshLinkInput();
	}

	private resolveLinkRelative(): string {
		let relative = normalizeVaultRelative(this.linkRelative);
		if (!relative) return "";

		const parent = normalizeVaultRelative(this.parentFolder);
		if (this.sourcePath.trim() && parent) {
			const suggested = suggestLinkRelative(this.sourcePath, parent);
			if (relative === parent) {
				relative = suggested;
			}
		} else if (this.sourcePath.trim()) {
			relative = suggestLinkRelative(this.sourcePath, parent);
		}

		return relative;
	}

	private newEntryId(): string {
		if (typeof crypto !== "undefined" && crypto.randomUUID) {
			return crypto.randomUUID();
		}
		return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
	}

	private async submit(): Promise<void> {
		try {
			if (!this.sourcePath.trim()) {
				new Notice(t(this.plugin, "notice.sourceRequired"));
				return;
			}

			const vaultBase = getVaultBasePath(
				this.app.vault.adapter as FileSystemAdapter,
			);
			const source = path.resolve(this.sourcePath);
			const relative = this.resolveLinkRelative();
			const detected = detectKind(source);
			if (detected !== this.kind) {
				new Notice(
					t(this.plugin, "notice.wrongKind", {
						kind: t(
							this.plugin,
							detected === "directory" ? "kind.directory" : "kind.file",
						),
						expected: t(
							this.plugin,
							this.kind === "directory" ? "kind.directory" : "kind.file",
						),
					}),
				);
				return;
			}

			const linkAbsolute = resolveVaultPath(vaultBase, relative);
			const parentRel = path.dirname(relative).replace(/\\/g, "/");
			if (parentRel && parentRel !== ".") {
				await this.app.vault.createFolder(parentRel).catch(() => undefined);
			}
			createSymlink(source, linkAbsolute, this.kind);

			const entry: SymlinkEntry = {
				id: this.newEntryId(),
				source,
				linkPath: linkAbsolute,
				kind: this.kind,
				createdAt: Date.now(),
			};
			this.onSubmit({ entry });
			new Notice(t(this.plugin, "notice.linked", { path: relative }));
			this.close();
		} catch (e) {
			new Notice(
				t(this.plugin, "notice.linkFailed", {
					message: translateError(this.plugin, e),
				}),
			);
		}
	}
}
