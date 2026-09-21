import chalk from "chalk";
const PARTICLES = ["*", "+", "·", "✦", "✧", "★", "☆"];
const COLORS = [chalk.red, chalk.yellow, chalk.green, chalk.cyan, chalk.magenta, chalk.blueBright];
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function randomFrame(width, height, density) {
    const lines = [];
    for (let y = 0; y < height; y++) {
        let line = "";
        for (let x = 0; x < width; x++) {
            if (Math.random() < density) {
                const char = PARTICLES[Math.floor(Math.random() * PARTICLES.length)];
                const color = COLORS[Math.floor(Math.random() * COLORS.length)];
                line += color(char);
            }
            else {
                line += " ";
            }
        }
        lines.push(line);
    }
    return lines.join("\n");
}
export async function celebrate() {
    const width = Math.min(process.stdout.columns || 60, 70);
    const height = 9;
    const frames = 8;
    for (let i = 0; i < frames; i++) {
        console.clear();
        const density = 0.02 + (Math.sin((i / frames) * Math.PI) * 0.12);
        console.log("\n" + randomFrame(width, height, density));
        await sleep(120);
    }
    console.clear();
}
