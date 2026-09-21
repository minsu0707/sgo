import chalk from "chalk";
import { WORD_BANK, WordEntry } from "./wordBank.js";
import { ask } from "../ui/prompt.js";
import { renderBox } from "../ui/box.js";
import { alignToBox, centerBlock } from "../ui/center.js";
import { resolveGeminiKey } from "./apiKey.js";
import { askGemini } from "./gemini.js";

const MAX_QUESTIONS = 20;

interface Answered {
  question: string;
  isYes: boolean;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function runUserGuesses(): Promise<void> {
  const apiKey = await resolveGeminiKey();

  const secret: WordEntry = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
  const history: Answered[] = [];
  let count = 0;

  console.log(centerBlock(chalk.gray(`\n힌트: ${secret.hint}\n`)));
  console.log(
    centerBlock(
      chalk.dim("질문을 자유롭게 문장으로 입력하세요. 정답을 맞히려면 'g 정답' 형식으로 입력하세요. (예: g 사과)\n")
    )
  );

  while (count < MAX_QUESTIONS) {
    renderScreen(history, count, secret.hint);

    const input = await ask(alignToBox(chalk.dim("질문 > ")));

    if (input.toLowerCase().startsWith("g ")) {
      const guess = input.slice(2).trim();
      if (guess === secret.name) {
        console.log(centerBlock(chalk.green.bold(`\n🎉 ${count + 1}번째 질문에서 맞히셨습니다! 정답: ${secret.name}\n`)));
        return;
      } else {
        console.log(centerBlock(chalk.red(`\n"${guess}"는 정답이 아닙니다.\n`)));
        await sleep(800);
        continue;
      }
    }

    if (!input.trim()) {
      continue;
    }

    console.log(centerBlock(renderBox("지금 질문", [chalk.bold.yellow(`> ${input}`)])));
    console.log(centerBlock(chalk.dim("AI가 생각 중...")));

    const result = await askGemini(apiKey, input, secret.name, secret.hint);

    if (!result.ok) {
      console.log(centerBlock(chalk.red(`\nAI 호출에 실패했어요: ${result.error}\n`)));
      await sleep(1800);
      continue;
    }

    if (result.answer === "모름") {
      console.log(centerBlock(chalk.yellow("\nAI가 판단하기 애매한 질문이래요. 다른 표현으로 다시 질문해주세요! (질문 횟수에 포함되지 않아요)\n")));
      await sleep(1200);
      continue;
    }

    count += 1;
    history.push({ question: input, isYes: result.answer === "예" });
  }

  console.log(centerBlock(chalk.red.bold(`\n아쉽지만 20번째 질문까지 못 맞히셨습니다.\n정답은 "${secret.name}" 이었습니다.\n`)));
}

function renderScreen(history: Answered[], count: number, hint: string): void {
  console.clear();
  const historyLines =
    history.length > 0
      ? history.map((entry, i) => formatHistoryLine(entry, i + 1, i === history.length - 1))
      : [chalk.dim("아직 질문한 내역이 없습니다.")];

  const lines = [chalk.gray(`힌트: ${hint}`), "", ...historyLines];
  console.log(centerBlock(renderBox(`sgo · 스무고개  Q ${count}/${MAX_QUESTIONS}`, lines)));
}

function formatHistoryLine(entry: Answered, index: number, isCurrent: boolean): string {
  const answer = entry.isYes ? chalk.green.bold("예") : chalk.red.bold("아니오");
  const label = `Q${index}.`;
  if (isCurrent) {
    return `${chalk.bold(label)} ${chalk.bold(entry.question)} → ${answer}`;
  }
  return `${chalk.dim(label)} ${chalk.dim(entry.question)} → ${answer}`;
}
