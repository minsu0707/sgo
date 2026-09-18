import chalk from "chalk";

const WIDTH = 60;

export function renderBox(title: string, lines: string[]): string {
  const top = "┌─ " + chalk.bold(title) + " " + "─".repeat(Math.max(0, WIDTH - title.length - 4)) + "┐";
  const bottom = "└" + "─".repeat(WIDTH) + "┘";
  const body = lines.map((line) => {
    const plain = line.replace(/\x1b\[[0-9;]*m/g, "");
    const pad = Math.max(0, WIDTH - 1 - plain.length);
    return "│ " + line + " ".repeat(pad) + "│";
  });
  return [top, ...body, bottom].join("\n");
}
