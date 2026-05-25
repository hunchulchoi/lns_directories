import { execFileSync } from "child_process";
import type LnsDirectoriesPlugin from "./main";
import { t } from "./i18n";
import { LinkKind } from "./types";

interface OpenDialogResult {
	canceled: boolean;
	filePaths: string[];
}

interface ElectronDialog {
	showOpenDialog(
		options: { properties: string[]; title?: string },
	): Promise<OpenDialogResult>;
	showOpenDialogSync?(
		options: { properties: string[]; title?: string },
	): OpenDialogResult;
}

function getElectronDialog(): ElectronDialog | null {
	try {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const req = (window as any).require as ((id: string) => unknown) | undefined;
		if (!req) return null;

		try {
			const remote = req("@electron/remote") as {
				dialog?: ElectronDialog;
			};
			if (remote?.dialog) return remote.dialog;
		} catch {
			/* optional */
		}

		const electron = req("electron") as {
			remote?: { dialog?: ElectronDialog };
			dialog?: ElectronDialog;
		};
		return electron.remote?.dialog ?? electron.dialog ?? null;
	} catch {
		return null;
	}
}

function pickWithMacOsDialog(
	plugin: LnsDirectoriesPlugin,
	kind: LinkKind,
): string | null {
	if (process.platform !== "darwin") return null;
	const prompt =
		kind === "directory"
			? t(plugin, "dialog.pickDirectory")
			: t(plugin, "dialog.pickFile");
	const script =
		kind === "directory"
			? `POSIX path of (choose folder with prompt "${prompt}")`
			: `POSIX path of (choose file with prompt "${prompt}")`;
	try {
		const out = execFileSync("/usr/bin/osascript", ["-e", script], {
			encoding: "utf8",
		}).trim();
		return out || null;
	} catch {
		return null;
	}
}

export async function pickFilesystemPath(
	plugin: LnsDirectoriesPlugin,
	kind: LinkKind,
): Promise<string | null> {
	const properties =
		kind === "directory" ? ["openDirectory", "createDirectory"] : ["openFile"];
	const title =
		kind === "directory"
			? t(plugin, "dialog.pickDirectory")
			: t(plugin, "dialog.pickFile");

	const dialog = getElectronDialog();
	if (dialog) {
		try {
			if (typeof dialog.showOpenDialog === "function") {
				const result = await dialog.showOpenDialog({ title, properties });
				if (!result.canceled && result.filePaths.length > 0) {
					return result.filePaths[0] ?? null;
				}
				return null;
			}
			if (typeof dialog.showOpenDialogSync === "function") {
				const result = dialog.showOpenDialogSync({ title, properties });
				if (!result.canceled && result.filePaths.length > 0) {
					return result.filePaths[0] ?? null;
				}
				return null;
			}
		} catch {
			/* fall through to osascript */
		}
	}

	return pickWithMacOsDialog(plugin, kind);
}
