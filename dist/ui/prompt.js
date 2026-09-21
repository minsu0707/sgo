import * as readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
let rl;
function getRl() {
    if (!rl)
        rl = readline.createInterface({ input: stdin, output: stdout });
    return rl;
}
export async function ask(question) {
    const answer = await getRl().question(question);
    return answer.trim();
}
export function closePrompt() {
    rl?.close();
    rl = undefined;
}
