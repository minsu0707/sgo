#!/usr/bin/env node
import { showSplash } from "./ui/splash.js";
import { chooseMode, askPlayAgain } from "./ui/menu.js";
import { runUserGuesses } from "./game/userGuesses.js";
import { runComputerGuesses } from "./game/computerGuesses.js";
import { closePrompt } from "./ui/prompt.js";

async function main() {
  await showSplash();

  let playing = true;
  while (playing) {
    const mode = await chooseMode();
    if (mode === "computer-thinks") {
      await runUserGuesses();
    } else {
      await runComputerGuesses();
    }
    playing = await askPlayAgain();
  }

  closePrompt();
  console.log("\n플레이해주셔서 감사합니다. 안녕히 가세요!\n");
}

main().catch((err) => {
  if (err?.code === "ERR_USE_AFTER_CLOSE") {
    console.log("\n\n입력이 종료되어 게임을 마칩니다. 안녕히 가세요!\n");
    process.exit(0);
  }
  console.error(err);
  process.exit(1);
});
