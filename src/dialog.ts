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
	if (!dialog) return null;

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
		}
	} catch {
		return null;
	}

	return null;
}
