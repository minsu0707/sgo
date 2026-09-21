const MODEL = "gemini-3.6-flash";

export type GeminiMove =
  | { ok: true; type: "question"; text: string }
  | { ok: true; type: "guess"; text: string }
  | { ok: false; error: string };

export interface HistoryEntry {
  question: string;
  answer: "예" | "아니오" | "모름";
}

export async function askGeminiNextMove(
  apiKey: string,
  history: HistoryEntry[],
  wrongGuesses: string[]
): Promise<GeminiMove> {
  const historyText = history.length
    ? history.map((h, i) => `${i + 1}. ${h.question} → ${h.answer}`).join("\n")
    : "(아직 없음)";
  const wrongText = wrongGuesses.length ? wrongGuesses.join(", ") : "(없음)";

  const prompt = [
    "너는 '스무고개' 게임에서 상대방이 마음속으로 떠올린 대상(사물/동물/사람/개념 등 무엇이든 가능)을 맞히는 역할이야.",
    "지금까지의 질문과 답변 기록:",
    historyText,
    `이미 틀린 것으로 확인된 추측: ${wrongText}`,
    "",
    "다음 둘 중 하나를 해:",
    "1) 아직 확신이 부족하면, 예/아니오로 답할 수 있는 새로운 질문을 하나 만들어. 이미 물어본 질문과 겹치지 않게, 지금까지의 답변을 근거로 후보를 최대한 좁히는 질문을 골라.",
    "2) 충분히 좁혀졌다고 판단되면 구체적인 정답 하나를 추측해.",
    "",
    "반드시 아래 두 형식 중 정확히 하나로만 답해. 다른 설명이나 문장은 절대 쓰지 마:",
    "QUESTION: <질문 내용>",
    "GUESS: <추측한 단어>",
  ].join("\n");

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200,
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      }
    );

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { ok: false, error: `HTTP ${res.status}: ${body.slice(0, 200)}` };
    }

    const data = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[];
    };
    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text?.trim() ?? "";

    if (!text) {
      return { ok: false, error: `빈 응답 (finishReason: ${candidate?.finishReason ?? "unknown"})` };
    }

    const guessMatch = text.match(/GUESS:\s*(.+)/i);
    if (guessMatch) return { ok: true, type: "guess", text: guessMatch[1].trim() };

    const questionMatch = text.match(/QUESTION:\s*(.+)/i);
    if (questionMatch) return { ok: true, type: "question", text: questionMatch[1].trim() };

    return { ok: true, type: "question", text };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
