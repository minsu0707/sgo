import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
const CONFIG_DIR = join(homedir(), ".sgo");
const CONFIG_PATH = join(CONFIG_DIR, "config.json");
function readConfig() {
    try {
        return JSON.parse(readFileSync(CONFIG_PATH, "utf8"));
    }
    catch {
        return {};
    }
}
export function getSavedApiKey() {
    return readConfig().geminiApiKey;
}
export function saveApiKey(key) {
    if (!existsSync(CONFIG_DIR))
        mkdirSync(CONFIG_DIR, { recursive: true });
    const config = readConfig();
    config.geminiApiKey = key;
    writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf8");
}
