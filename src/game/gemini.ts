const MODEL = "gemini-3.6-flash";

export type GeminiResult =
  | { ok: true; answer: "예" | "아니오" | "모름" }
  | { ok: false; error: string };

export async function askGemini(
  apiKey: string,
  question: string,
  secretName: string,
  secretHint: string
): Promise<GeminiResult> {
  const prompt = [
    "너는 '스무고개' 게임의 출제자야. 정답 단어를 마음속에 정해두고 있고,",
    `정답은 "${secretName}" (분류: ${secretHint})이야.`,
    `플레이어의 질문: "${question}"`,
    "이 질문에 대해 정답 기준으로 예/아니오로만 답해.",
    '반드시 "예", "아니오", "모름" 중 정확히 한 단어로만 답해. 다른 설명은 하지 마.',
    "질문이 예/아니오로 답하기 애매하거나 질문 자체를 이해할 수 없으면 모름 이라고 답해.",
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
            temperature: 0,
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

    if (text.includes("아니오") || text.includes("아니요")) return { ok: true, answer: "아니오" };
    if (text.includes("예")) return { ok: true, answer: "예" };
    return { ok: true, answer: "모름" };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
