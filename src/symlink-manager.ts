import * as fs from "fs";
import * as path from "path";
import { FileSystemAdapter } from "obsidian";
import { LnsError } from "./errors";
import { LinkKind, SymlinkEntry } from "./types";

export type LinkHealth = "ok" | "missing_source" | "missing_link" | "broken";

export interface LinkStatus {
	entry: SymlinkEntry;
	health: LinkHealth;
	resolvedSource?: string;
}

export function getVaultBasePath(vaultAdapter: FileSystemAdapter): string {
	const base = vaultAdapter.getBasePath();
	try {
		return fs.realpathSync.native(base);
	} catch {
		try {
			return fs.realpathSync(base);
		} catch {
			return base;
		}
	}
}

export function normalizeVaultRelative(relativePath: string): string {
	return relativePath.replace(/\\/g, "/").replace(/^\/+/, "").replace(/\/+$/, "");
}

export function resolveVaultPath(vaultBase: string, relativePath: string): string {
	const normalized = normalizeVaultRelative(relativePath);
	if (!normalized) {
		throw new LnsError("error.emptyLinkPath");
	}
	const absolute = path.resolve(vaultBase, normalized);
	const rel = path.relative(vaultBase, absolute);
	if (rel.startsWith("..") || path.isAbsolute(rel)) {
		throw new LnsError("error.pathOutsideVault");
	}
	return absolute;
}

export function detectKind(sourcePath: string): LinkKind {
	if (!sourcePath.trim()) {
		throw new LnsError("error.sourceRequired");
	}
	const resolved = path.resolve(sourcePath);
	if (!fs.existsSync(resolved)) {
		throw new LnsError("error.sourceNotFound", { path: resolved });
	}
	const stat = fs.lstatSync(resolved);
	if (stat.isDirectory()) return "directory";
	if (stat.isFile()) return "file";
	throw new LnsError("error.invalidSourceKind");
}

export function createSymlink(
	source: string,
	linkAbsolute: string,
	kind: LinkKind,
): void {
	const src = path.resolve(source);
	if (!fs.existsSync(src)) {
		throw new LnsError("error.sourceNotFound", { path: src });
	}

	let exists = false;
	try {
		fs.lstatSync(linkAbsolute);
		exists = true;
	} catch {
		exists = false;
	}

	if (exists) {
		const stat = fs.lstatSync(linkAbsolute);
		if (stat.isSymbolicLink()) {
			fs.unlinkSync(linkAbsolute);
		} else {
			throw new LnsError("error.pathExists", { path: linkAbsolute });
		}
	}

	const parentDir = path.dirname(linkAbsolute);
	if (parentDir && parentDir !== ".") {
		fs.mkdirSync(parentDir, { recursive: true });
	}

	if (process.platform === "win32") {
		const linkType = kind === "directory" ? "dir" : "file";
		fs.symlinkSync(src, linkAbsolute, linkType);
	} else {
		fs.symlinkSync(src, linkAbsolute);
	}
}

export function removeSymlink(linkAbsolute: string): void {
	let stat: fs.Stats;
	try {
		stat = fs.lstatSync(linkAbsolute);
	} catch {
		return;
	}
	if (!stat.isSymbolicLink()) {
		throw new LnsError("error.notSymlink");
	}
	fs.unlinkSync(linkAbsolute);
}

export function readLinkTarget(linkAbsolute: string): string | null {
	try {
		return fs.readlinkSync(linkAbsolute);
	} catch {
		return null;
	}
}

export function checkLinkHealth(entry: SymlinkEntry): LinkStatus {
	const sourceExists = fs.existsSync(entry.source);
	let linkExists = false;
	try {
		fs.lstatSync(entry.linkPath);
		linkExists = true;
	} catch {
		linkExists = false;
	}

	if (!linkExists) {
		return { entry, health: "missing_link" };
	}
	const target = readLinkTarget(entry.linkPath);
	if (!target) {
		return { entry, health: "broken" };
	}
	const resolved = path.resolve(path.dirname(entry.linkPath), target);
	if (!sourceExists) {
		return { entry, health: "missing_source", resolvedSource: resolved };
	}
	if (
		resolved !== path.resolve(entry.source) &&
		path.resolve(entry.source) !== resolved
	) {
		return { entry, health: "broken", resolvedSource: resolved };
	}
	return { entry, health: "ok", resolvedSource: resolved };
}

export function suggestLinkRelative(
	sourcePath: string,
	parentFolder = "",
): string {
	const base = path.basename(path.resolve(sourcePath));
	const parent = normalizeVaultRelative(parentFolder);
	if (parent) {
		return path.posix.join(parent, base);
	}
	return path.posix.join("_links", base);
}
