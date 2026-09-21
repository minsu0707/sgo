import chalk from "chalk";
import { visibleWidth } from "./width.js";

const BORDER_WIDTH = 60;

export function renderBox(title: string, lines: string[]): string {
  const titleWidth = visibleWidth(title);
  const dashCount = Math.max(0, BORDER_WIDTH - 3 - titleWidth);
  const top = "┌─ " + chalk.bold(title) + " " + "─".repeat(dashCount) + "┐";
  const bottom = "└" + "─".repeat(BORDER_WIDTH) + "┘";
  const body = lines.map((line) => {
    const pad = Math.max(0, BORDER_WIDTH - 1 - visibleWidth(line));
    return "│ " + line + " ".repeat(pad) + "│";
  });
  return [top, ...body, bottom].join("\n");
}
