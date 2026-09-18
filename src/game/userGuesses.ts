import chalk from "chalk";
import { ATTRIBUTES, WORD_BANK, WordEntry } from "./wordBank.js";
import { ask } from "../ui/prompt.js";
import { renderBox } from "../ui/box.js";
import { centerBlock } from "../ui/center.js";

const MAX_QUESTIONS = 20;

export async function runUserGuesses(): Promise<void> {
  const secret: WordEntry = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
  const history: string[] = [];
  let count = 0;

  console.log(centerBlock(chalk.gray(`\n힌트: ${secret.hint}\n`)));

  while (count < MAX_QUESTIONS) {
    renderScreen(history, count, secret.hint);

    const menuLines = ATTRIBUTES.map((a, i) => `${i + 1}. ${a.question}`);
    console.log(centerBlock(menuLines.join("\n")));
    console.log(centerBlock(chalk.dim("\n번호를 입력해 질문하거나, 'g 정답' 형식으로 정답을 맞혀보세요. (예: g 사과)")));

    const input = await ask(centerBlock("> "));

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

    const idx = Number.parseInt(input, 10) - 1;
    const attribute = ATTRIBUTES[idx];
    if (!attribute) {
      console.log(centerBlock(chalk.yellow("\n올바른 번호를 입력해주세요.\n")));
      continue;
    }

    const answer = secret.attrs[attribute.key] ? "예" : "아니오";
    count += 1;
    history.push(`Q${count}. ${attribute.question} → ${answer}`);
  }

  console.log(centerBlock(chalk.red.bold(`\n아쉽지만 20번째 질문까지 못 맞히셨습니다.\n정답은 "${secret.name}" 이었습니다.\n`)));
}

function renderScreen(history: string[], count: number, hint: string): void {
  console.clear();
  const lines = [
    chalk.gray(`힌트: ${hint}`),
    "",
    ...(history.length > 0 ? history : [chalk.dim("아직 질문한 내역이 없습니다.")]),
  ];
  console.log(centerBlock(renderBox(`sgo · 스무고개  Q ${count}/${MAX_QUESTIONS}`, lines)));
}
