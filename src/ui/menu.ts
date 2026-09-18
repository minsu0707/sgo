import chalk from "chalk";
import { ask } from "./prompt.js";
import { centerBlock } from "./center.js";

export type Mode = "computer-thinks" | "computer-guesses";

export async function chooseMode(): Promise<Mode> {
  console.clear();
  console.log(
    centerBlock(
      [
        chalk.bold("게임 방식을 골라주세요"),
        "",
        "1. 컴퓨터가 단어를 정하고, 내가 질문해서 맞히기",
        "2. 내가 마음속으로 정하고, 컴퓨터가 질문해서 맞히기",
        "",
      ].join("\n")
    )
  );

  while (true) {
    const input = await ask(centerBlock("> "));
    if (input === "1") return "computer-thinks";
    if (input === "2") return "computer-guesses";
    console.log(centerBlock(chalk.yellow("1 또는 2를 입력해주세요.")));
  }
}

export async function askPlayAgain(): Promise<boolean> {
  const input = await ask(centerBlock("\n다시 하시겠어요? (y/n) > "));
  return input.trim().toLowerCase().startsWith("y");
}
