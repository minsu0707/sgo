import chalk from "chalk";
import { ATTRIBUTES, WORD_BANK, WordEntry, AttrKey } from "./wordBank.js";
import { ask } from "../ui/prompt.js";
import { renderBox } from "../ui/box.js";
import { centerBlock } from "../ui/center.js";

const MAX_QUESTIONS = 20;

type Answer = "예" | "아니오" | "모름";

interface Answered {
  question: string;
  answer: Answer;
}

export async function runComputerGuesses(): Promise<void> {
  console.log(
    centerBlock(
      chalk.gray(
        "\n마음속으로 무언가(사물/동물/사람/개념 등)를 하나 떠올려보세요.\n준비되면 Enter를 눌러주세요.\n"
      )
    )
  );
  await ask(centerBlock("> "));

  let candidates: WordEntry[] = [...WORD_BANK];
  const askedAttrs = new Set<AttrKey>();
  const history: Answered[] = [];
  let count = 0;
  const tried = new Set<string>();

  while (count < MAX_QUESTIONS) {
    if (candidates.length === 0) {
      renderScreen(history, count);
      console.log(centerBlock(chalk.red.bold("\n제가 졌습니다! 무엇을 생각하셨는지 알려주시겠어요? (그냥 구경만 하셔도 됩니다)\n")));
      return;
    }

    const shouldGuessNow = candidates.length === 1 || askedAttrs.size >= ATTRIBUTES.length || count === MAX_QUESTIONS - 1;

    if (shouldGuessNow) {
      const guess = pickGuess(candidates, tried);
      if (!guess) {
        renderScreen(history, count);
        console.log(centerBlock(chalk.red.bold("\n더 이상 추측할 후보가 없어요. 제가 졌습니다!\n")));
        return;
      }
      tried.add(guess.name);
      renderScreen(history, count);
      const question = `혹시 그건 "${guess.name}" 인가요?`;
      console.log(centerBlock(renderBox("지금 질문", [chalk.bold.yellow(`> ${question}`)])));
      const confirm = await ask(centerBlock(chalk.dim("(y/n) > ")));
      count += 1;
      const isYes = confirm.toLowerCase().startsWith("y");
      history.push({ question, answer: isYes ? "예" : "아니오" });

      if (isYes) {
        renderScreen(history, count);
        console.log(centerBlock(chalk.green.bold(`\n🎉 ${count}번째 질문 만에 맞혔습니다! 정답: ${guess.name}\n`)));
        return;
      }
      candidates = candidates.filter((c) => c.name !== guess.name);
      continue;
    }

    const attribute = pickSplittingAttribute(candidates, askedAttrs);
    askedAttrs.add(attribute.key);
    renderScreen(history, count);
    console.log(centerBlock(renderBox("지금 질문", [chalk.bold.yellow(`> ${attribute.question}`)])));
    const raw = await ask(centerBlock(chalk.dim("(y/n/모름) > ")));
    const normalized = raw.trim().toLowerCase();
    count += 1;

    if (normalized.startsWith("y") || normalized === "예") {
      history.push({ question: attribute.question, answer: "예" });
      candidates = candidates.filter((c) => c.attrs[attribute.key]);
    } else if (normalized.startsWith("n") || normalized === "아니오") {
      history.push({ question: attribute.question, answer: "아니오" });
      candidates = candidates.filter((c) => !c.attrs[attribute.key]);
    } else {
      history.push({ question: attribute.question, answer: "모름" });
    }
  }

  renderScreen(history, count);
  console.log(centerBlock(chalk.red.bold("\n20번의 질문 안에 맞히지 못했습니다. 제가 졌습니다!\n")));
}

function pickSplittingAttribute(candidates: WordEntry[], asked: Set<AttrKey>) {
  const remaining = ATTRIBUTES.filter((a) => !asked.has(a.key));
  let best = remaining[0];
  let bestScore = Number.POSITIVE_INFINITY;
  for (const attr of remaining) {
    const trueCount = candidates.filter((c) => c.attrs[attr.key]).length;
    const falseCount = candidates.length - trueCount;
    const score = Math.abs(trueCount - falseCount);
    if (score < bestScore) {
      bestScore = score;
      best = attr;
    }
  }
  return best;
}

function pickGuess(candidates: WordEntry[], tried: Set<string>): WordEntry | undefined {
  return candidates.find((c) => !tried.has(c.name)) ?? candidates[0];
}

function renderScreen(history: Answered[], count: number): void {
  console.clear();
  const lines =
    history.length > 0
      ? history.map((entry, i) => formatHistoryLine(entry, i + 1, i === history.length - 1))
      : [chalk.dim("아직 질문한 내역이 없습니다.")];
  console.log(centerBlock(renderBox(`sgo · 스무고개 (컴퓨터가 맞히기)  Q ${count}/${MAX_QUESTIONS}`, lines)));
}

function formatHistoryLine(entry: Answered, index: number, isCurrent: boolean): string {
  const color = entry.answer === "예" ? chalk.green.bold : entry.answer === "아니오" ? chalk.red.bold : chalk.yellow.bold;
  const answer = color(entry.answer);
  const label = `Q${index}.`;
  if (isCurrent) {
    return `${chalk.bold(label)} ${chalk.bold(entry.question)} → ${answer}`;
  }
  return `${chalk.dim(label)} ${chalk.dim(entry.question)} → ${answer}`;
}
