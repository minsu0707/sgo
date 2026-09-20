import chalk from "chalk";
import { visibleWidth } from "./width.js";

const WIDTH = 60;

export function renderBox(title: string, lines: string[]): string {
  const titleWidth = visibleWidth(title);
  const top = "┌─ " + chalk.bold(title) + " " + "─".repeat(Math.max(0, WIDTH - titleWidth - 4)) + "┐";
  const bottom = "└" + "─".repeat(WIDTH) + "┘";
  const body = lines.map((line) => {
    const pad = Math.max(0, WIDTH - 1 - visibleWidth(line));
    return "│ " + line + " ".repeat(pad) + "│";
  });
  return [top, ...body, bottom].join("\n");
}
