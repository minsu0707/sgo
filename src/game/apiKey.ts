import chalk from "chalk";
import { ask } from "../ui/prompt.js";
import { renderBox } from "../ui/box.js";
import { centerBlock } from "../ui/center.js";
import { getSavedApiKey, saveApiKey } from "./config.js";

export async function resolveGeminiKey(): Promise<string | undefined> {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;

  const saved = getSavedApiKey();
  if (saved) return saved;

  console.log(
    centerBlock(
      renderBox("AI 질문 이해 (선택)", [
        "Gemini API 키를 넣으면 질문을 자유롭게 이해할 수 있어요.",
        chalk.dim("무료 발급: https://aistudio.google.com/apikey"),
        "",
        "키를 붙여넣거나, 그냥 Enter를 누르면",
        "키워드 방식으로 진행돼요.",
      ])
    )
  );

  const input = await ask(centerBlock(chalk.dim("API 키 (건너뛰려면 Enter) > ")));
  const key = input.trim();
  if (!key) return undefined;

  const save = await ask(centerBlock(chalk.dim("다음에 또 물어보지 않게 저장할까요? (y/n) > ")));
  if (save.trim().toLowerCase().startsWith("y")) {
    saveApiKey(key);
    console.log(centerBlock(chalk.green(`저장했어요. (${"~/.sgo/config.json"})`)));
  }

  return key;
}
