import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const CONFIG_DIR = join(homedir(), ".sgo");
const CONFIG_PATH = join(CONFIG_DIR, "config.json");

interface Config {
  geminiApiKey?: string;
}

function readConfig(): Config {
  try {
    return JSON.parse(readFileSync(CONFIG_PATH, "utf8"));
  } catch {
    return {};
  }
}

export function getSavedApiKey(): string | undefined {
  return readConfig().geminiApiKey;
}

export function saveApiKey(key: string): void {
  if (!existsSync(CONFIG_DIR)) mkdirSync(CONFIG_DIR, { recursive: true });
  const config = readConfig();
  config.geminiApiKey = key;
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf8");
}
