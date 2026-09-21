import chalk from "chalk";
import { ask } from "../ui/prompt.js";
import { renderBox } from "../ui/box.js";
import { centerBlock } from "../ui/center.js";
import { getSavedApiKey, saveApiKey } from "./config.js";

export async function resolveGeminiKey(): Promise<string> {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;

  const saved = getSavedApiKey();
  if (saved) return saved;

  console.log(
    centerBlock(
      renderBox("AI 질문 이해 (필수)", [
        "이 모드는 자유 질문을 이해하기 위해 Gemini API 키가 필요해요.",
        chalk.dim("무료 발급: https://aistudio.google.com/apikey"),
      ])
    )
  );

  let key = "";
  while (!key) {
    const input = await ask(centerBlock(chalk.dim("API 키 > ")));
    key = input.trim();
    if (!key) {
      console.log(centerBlock(chalk.yellow("API 키를 입력해야 진행할 수 있어요.")));
    }
  }

  const save = await ask(centerBlock(chalk.dim("다음에 또 물어보지 않게 저장할까요? (y/n) > ")));
  if (save.trim().toLowerCase().startsWith("y")) {
    saveApiKey(key);
    console.log(centerBlock(chalk.green("저장했어요. (~/.sgo/config.json)")));
  }

  return key;
}
