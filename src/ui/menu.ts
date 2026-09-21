import chalk from "chalk";
import { ask } from "./prompt.js";
import { alignToBox, centerBlock } from "./center.js";
import { renderBox } from "./box.js";

export type Mode = "computer-thinks" | "computer-guesses";

export async function chooseMode(): Promise<Mode> {
  console.clear();
  const lines = [
    chalk.bold("게임 방식을 골라주세요"),
    "",
    `${chalk.cyan("1")}. 컴퓨터가 단어를 정하고, 내가 질문해서 맞히기`,
    `${chalk.cyan("2")}. 내가 마음속으로 정하고, 컴퓨터가 질문해서 맞히기`,
  ];
  console.log("\n" + centerBlock(renderBox("sgo · 게임 선택", lines)) + "\n");

  while (true) {
    const input = await ask(alignToBox(chalk.dim("번호 입력 > ")));
    if (input === "1") return "computer-thinks";
    if (input === "2") return "computer-guesses";
    console.log(centerBlock(chalk.yellow("1 또는 2를 입력해주세요.")));
  }
}

export async function askPlayAgain(): Promise<boolean> {
  const input = await ask(centerBlock(chalk.bold("\n다시 하시겠어요? (y/n) > ")));
  return input.trim().toLowerCase().startsWith("y");
}
