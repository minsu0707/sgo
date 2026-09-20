import chalk from "chalk";
import { ATTRIBUTES, WORD_BANK, WordEntry } from "./wordBank.js";
import { ask } from "../ui/prompt.js";
import { renderBox } from "../ui/box.js";
import { centerBlock } from "../ui/center.js";

const MAX_QUESTIONS = 20;

interface Answered {
  question: string;
  isYes: boolean;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function runUserGuesses(): Promise<void> {
  const secret: WordEntry = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
  const history: Answered[] = [];
  const askedIndices = new Set<number>();
  let count = 0;

  while (count < MAX_QUESTIONS) {
    const remaining = ATTRIBUTES.map((a, i) => ({ ...a, originalIndex: i })).filter(
      (a) => !askedIndices.has(a.originalIndex)
    );

    renderScreen(history, count, secret.hint);

    const menuLines = remaining.map((a, i) => `${chalk.cyan(String(i + 1))}. ${a.question}`);
    console.log(centerBlock(renderBox("남은 질문", menuLines)));
    console.log(centerBlock(chalk.dim("\n번호를 입력해 질문하거나, 'g 정답' 형식으로 정답을 맞혀보세요. (예: g 사과)")));

    const input = await ask(centerBlock(chalk.dim("> ")));

    if (input.toLowerCase().startsWith("g ")) {
      const guess = input.slice(2).trim();
      if (guess === secret.name) {
        console.log(centerBlock(chalk.green.bold(`\n🎉 ${count + 1}번째 질문에서 맞히셨습니다! 정답: ${secret.name}\n`)));
        return;
      } else {
        console.log(centerBlock(chalk.red(`\n"${guess}"는 정답이 아닙니다.\n`)));
        continue;
      }
    }

    const pickIdx = Number.parseInt(input, 10) - 1;
    const attribute = remaining[pickIdx];
    if (!attribute) {
      console.log(centerBlock(chalk.yellow("\n올바른 번호를 입력해주세요.\n")));
      continue;
    }
    askedIndices.add(attribute.originalIndex);

    renderScreen(history, count, secret.hint);
    console.log(centerBlock(renderBox("지금 질문", [chalk.bold.yellow(`❓ ${attribute.question}`)])));
    await sleep(500);

    const isYes = secret.attrs[attribute.key];
    count += 1;
    history.push({ question: attribute.question, isYes });
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
