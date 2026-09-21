import chalk from "chalk";
import { ask } from "../ui/prompt.js";
import { renderBox } from "../ui/box.js";
import { alignToBox, centerBlock } from "../ui/center.js";
import { celebrate } from "../ui/fireworks.js";
import { resolveGeminiKey } from "./apiKey.js";
import { askGeminiNextMove, HistoryEntry } from "./geminiGuesser.js";

const MAX_QUESTIONS = 20;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function runComputerGuesses(): Promise<void> {
  const apiKey = await resolveGeminiKey();

  console.log(
    centerBlock(
      chalk.gray(
        "\n마음속으로 무언가(사물/동물/사람/개념 등)를 하나 떠올려보세요.\n준비되면 Enter를 눌러주세요.\n"
      )
    )
  );
  await ask(centerBlock("> "));

  const history: HistoryEntry[] = [];
  const wrongGuesses: string[] = [];
  let count = 0;

  while (count < MAX_QUESTIONS) {
    renderScreen(history, count);
    console.log(centerBlock(chalk.dim("AI가 다음 질문을 생각하는 중...")));

    const move = await askGeminiNextMove(apiKey, history, wrongGuesses);

    if (!move.ok) {
      console.log(centerBlock(chalk.red(`\nAI 호출에 실패했어요: ${move.error}\n`)));
      await sleep(1500);
      continue;
    }

    if (move.type === "guess") {
      renderScreen(history, count);
      const question = `혹시 그건 "${move.text}" 인가요?`;
      console.log(centerBlock(renderBox("지금 질문", [chalk.bold.yellow(`> ${question}`)])));
      const confirm = await ask(alignToBox(chalk.dim("(y/n) > ")));
      count += 1;
      const isYes = confirm.trim().toLowerCase().startsWith("y");
      history.push({ question, answer: isYes ? "예" : "아니오" });

      if (isYes) {
        await celebrate();
        console.log(centerBlock(chalk.green.bold(`\n🎉 ${count}번째 질문 만에 맞혔습니다! 정답: ${move.text}\n`)));
        return;
      }
      wrongGuesses.push(move.text);
      continue;
    }

    renderScreen(history, count);
    console.log(centerBlock(renderBox("지금 질문", [chalk.bold.yellow(`> ${move.text}`)])));
    const raw = await ask(alignToBox(chalk.dim("(y/n/모름) > ")));
    const normalized = raw.trim().toLowerCase();
    count += 1;

    const answer =
      normalized.startsWith("y") || normalized === "예"
        ? "예"
        : normalized.startsWith("n") || normalized === "아니오"
          ? "아니오"
          : "모름";
    history.push({ question: move.text, answer });
  }

  renderScreen(history, count);
  console.log(centerBlock(chalk.red.bold("\n20번의 질문 안에 맞히지 못했습니다. 제가 졌습니다!\n")));
}

function renderScreen(history: HistoryEntry[], count: number): void {
  console.clear();
  const lines =
    history.length > 0
      ? history.map((entry, i) => formatHistoryLine(entry, i + 1, i === history.length - 1))
      : [chalk.dim("아직 질문한 내역이 없습니다.")];
  console.log(centerBlock(renderBox(`sgo · 스무고개 (컴퓨터가 맞히기)  Q ${count}/${MAX_QUESTIONS}`, lines)));
}

function formatHistoryLine(entry: HistoryEntry, index: number, isCurrent: boolean): string {
  const color = entry.answer === "예" ? chalk.green.bold : entry.answer === "아니오" ? chalk.red.bold : chalk.yellow.bold;
  const answer = color(entry.answer);
  const label = `Q${index}.`;
  if (isCurrent) {
    return `${chalk.bold(label)} ${chalk.bold(entry.question)} → ${answer}`;
  }
  return `${chalk.dim(label)} ${chalk.dim(entry.question)} → ${answer}`;
}
