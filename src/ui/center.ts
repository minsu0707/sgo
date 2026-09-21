import { visibleWidth } from "./width.js";
import { BOX_TOTAL_WIDTH } from "./box.js";

export function centerLine(line: string, width: number = process.stdout.columns || 80): string {
  const pad = Math.max(0, Math.floor((width - visibleWidth(line)) / 2));
  return " ".repeat(pad) + line;
}

export function alignToBox(line: string, width: number = process.stdout.columns || 80): string {
  const pad = Math.max(0, Math.floor((width - BOX_TOTAL_WIDTH) / 2));
  return " ".repeat(pad) + line;
}

export function centerBlock(text: string, width: number = process.stdout.columns || 80): string {
  return text
    .split("\n")
    .map((line) => centerLine(line, width))
    .join("\n");
}
