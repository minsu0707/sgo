import figlet from "figlet";
import gradient from "gradient-string";
import chalk from "chalk";
import { centerBlock } from "./center.js";
import { ask } from "./prompt.js";

export async function showSplash(): Promise<void> {
  const banner = figlet.textSync("SGO", { font: "ANSI Shadow" });
  const colored = gradient(["#ff6ec4", "#7873f5", "#4ade80"]).multiline(banner);

  const bannerLines = banner.split("\n").length;
  const totalContentLines = bannerLines + 5; // blank, welcome, subtitle, blank, prompt
  const rows = process.stdout.rows || 24;
  const topPad = Math.max(0, Math.floor((rows - totalContentLines) / 2));

  console.clear();
  console.log("\n".repeat(topPad));
  console.log(centerBlock(colored));
  console.log("\n");
  console.log(centerBlock(chalk.bold.underline("W E L C O M E   T O   S G O")));
  console.log(centerBlock(chalk.gray("스무고개에 오신 걸 환영합니다")));
  console.log("\n");

  await ask(centerBlock(chalk.dim("Press ENTER to start > ")));
}
