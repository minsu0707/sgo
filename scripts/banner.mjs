const BANNER = [
  "███████╗ ██████╗  ██████╗ ",
  "██╔════╝██╔════╝ ██╔═══██╗",
  "███████╗██║  ███╗██║   ██║",
  "╚════██║██║   ██║██║   ██║",
  "███████║╚██████╔╝╚██████╔╝",
  "╚══════╝ ╚═════╝  ╚═════╝ ",
];

const COLORS = [199, 163, 129, 105, 111, 85];

function center(line, width = process.stdout.columns || 80) {
  const pad = Math.max(0, Math.floor((width - line.length) / 2));
  return " ".repeat(pad) + line;
}

console.log();
BANNER.forEach((line, i) => {
  const color = COLORS[i % COLORS.length];
  console.log(center(`\x1b[38;5;${color}m${line}\x1b[0m`));
});
console.log();
console.log(center("\x1b[2msgo 설치 중입니다... 잠시만 기다려주세요\x1b[0m"));
console.log();
