import type LnsDirectoriesPlugin from "../main";
import { LnsLocale } from "../types";
import { en, MessageKey } from "./en";
import { ko } from "./ko";

export type UiLocale = "en" | "ko";

const bundles: Record<UiLocale, Record<MessageKey, string>> = { en, ko };

export function format(
	template: string,
	vars?: Record<string, string | number>,
): string {
	if (!vars) return template;
	return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) =>
		String(vars[key] ?? ""),
	);
}

export function resolveUiLocale(plugin: LnsDirectoriesPlugin): UiLocale {
	const pref = plugin.settings.locale ?? "auto";
	if (pref === "en" || pref === "ko") return pref;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const momentLocale = (window as any).moment?.locale?.() as string | undefined;
	if (momentLocale?.toLowerCase().startsWith("ko")) return "ko";
	return "en";
}

export function t(
	plugin: LnsDirectoriesPlugin,
	key: MessageKey,
	vars?: Record<string, string | number>,
): string {
	const locale = resolveUiLocale(plugin);
	const template = bundles[locale][key] ?? bundles.en[key] ?? key;
	return format(template, vars);
}

export function localeOptions(
	plugin: LnsDirectoriesPlugin,
): { value: LnsLocale; label: string }[] {
	return [
		{ value: "auto", label: t(plugin, "locale.auto") },
		{ value: "en", label: t(plugin, "locale.en") },
		{ value: "ko", label: t(plugin, "locale.ko") },
	];
}
