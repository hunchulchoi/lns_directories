import type { MessageKey } from "./i18n/en";
import type LnsDirectoriesPlugin from "./main";
import { t } from "./i18n";

export class LnsError extends Error {
	constructor(
		public readonly code: MessageKey,
		public readonly params?: Record<string, string>,
	) {
		super(code);
		this.name = "LnsError";
	}
}

export function translateError(
	plugin: LnsDirectoriesPlugin,
	error: unknown,
): string {
	if (error instanceof LnsError) {
		return t(plugin, error.code, error.params);
	}
	if (error instanceof Error) return error.message;
	return String(error);
}
