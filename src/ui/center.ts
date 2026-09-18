export function centerLine(line: string, width: number = process.stdout.columns || 80): string {
  const visibleLength = stripAnsi(line).length;
  const pad = Math.max(0, Math.floor((width - visibleLength) / 2));
  return " ".repeat(pad) + line;
}

export function centerBlock(text: string, width: number = process.stdout.columns || 80): string {
  return text
    .split("\n")
    .map((line) => centerLine(line, width))
    .join("\n");
}

function stripAnsi(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1b\[[0-9;]*m/g, "");
}
