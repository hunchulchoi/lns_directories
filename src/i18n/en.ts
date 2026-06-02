export const en = {
	"ribbon.tooltip": "Link external path",
	"ribbon.openLinksPanel": "Open links panel",
	"ribbon.linkDirectory": "Link directory…",
	"ribbon.linkFile": "Link file…",

	"cmd.openLinksPanel": "Open LNS links panel",
	"cmd.linkDirectory": "Link directory (symlink)",
	"cmd.linkFile": "Link file (symlink)",
	"cmd.refreshLinks": "Refresh symlink status",

	"panel.title": "LNS links",
	"panel.refresh": "Refresh",

	"menu.addSymDirectory": "Add symlink directory",
	"menu.addSymFile": "Add symlink file",

	"modal.titleDirectory": "Link directory",
	"modal.titleFile": "Link file",
	"modal.description":
		"Create a symbolic link (ln -s) inside the vault to an external path.",
	"modal.sourceName": "Source path",
	"modal.sourceDesc": "Absolute path to the file or folder to link",
	"modal.sourcePlaceholder": "/Users/me/Documents/notes",
	"modal.browse": "Browse",
	"modal.vaultLinkName": "Link path in vault",
	"modal.vaultLinkDescDefault":
		"Path relative to vault root (e.g. _links/my-notes)",
	"modal.vaultLinkDescFolder": "Under right-clicked folder: {{folder}}",
	"modal.vaultLinkPlaceholderFolder": "{{folder}}/name",
	"modal.vaultLinkPlaceholderDefault": "_links/my-notes",
	"modal.create": "Create link",
	"modal.cancel": "Cancel",

	"dialog.pickDirectory": "Choose directory to link",
	"dialog.pickFile": "Choose file to link",

	"settings.description":
		"Link external files and folders into the vault with symbolic links. Same as ln -s on macOS/Linux.",
	"settings.newLink": "New link",
	"settings.newLinkDesc": "You can also use the command palette.",
	"settings.linkDirectory": "Link directory",
	"settings.linkFile": "Link file",
	"settings.empty": "No links registered.",
	"settings.sourceLabel": "Source: {{path}}",
	"settings.showInFinder": "Show in Finder",
	"settings.openNote": "Open as note",
	"settings.removeLink": "Remove link",
	"settings.revealInExplorer": "Reveal in explorer",
	"settings.showExplorerMarkersName": "Mark links in file explorer",
	"settings.showExplorerMarkersDesc":
		"Show a chain icon and color on registered symlink paths in the sidebar file tree.",
	"settings.openLinksPanelName": "Links panel",
	"settings.openLinksPanelDesc":
		"Open a sidebar view listing all registered links.",
	"settings.openLinksPanel": "Open links panel",
	"settings.localeName": "Language",
	"settings.localeDesc": "UI language for this plugin",

	"locale.auto": "Auto (follow Obsidian)",
	"locale.en": "English",
	"locale.ko": "Korean",

	"health.ok": "OK",
	"health.missing_source": "Source missing",
	"health.missing_link": "Link missing",
	"health.broken": "Broken",

	"kind.directory": "directory",
	"kind.file": "file",

	"notice.refreshCount": "Checked {{count}} link(s)",
	"notice.localVaultOnly": "Only available with a local filesystem vault.",
	"notice.sourceRequired": "Enter a source path or use Browse.",
	"notice.wrongKind": "Selected item is a {{kind}}, not a {{expected}}.",
	"notice.linked": "Linked: {{path}}",
	"notice.linkFailed": "Failed to link: {{message}}",
	"notice.pathOpenFailed": "Could not open path.",
	"notice.fileNotInVault":
		"File not found in vault. Try refreshing the file explorer.",
	"notice.removed": "Removed: {{path}}",
	"notice.removeFailed": "Failed to remove: {{message}}",

	"error.emptyLinkPath": "Enter a link path inside the vault.",
	"error.pathOutsideVault": "Path must stay inside the vault.",
	"error.sourceRequired": "Enter a source path.",
	"error.sourceNotFound": "Source path does not exist: {{path}}",
	"error.invalidSourceKind": "Only files and directories can be linked.",
	"error.pathExists": "Path already exists. Use a different name: {{path}}",
	"error.notSymlink": "Refusing to delete a non-symlink item.",
} as const;

export type MessageKey = keyof typeof en;
