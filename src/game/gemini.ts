const MODEL = "gemini-2.0-flash";

export type GeminiAnswer = "예" | "아니오" | "모름";

export async function askGemini(
  apiKey: string,
  question: string,
  secretName: string,
  secretHint: string
): Promise<GeminiAnswer> {
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
          generationConfig: { temperature: 0, maxOutputTokens: 10 },
        }),
      }
    );

    if (!res.ok) return "모름";

    const data = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";

    if (text.includes("아니오") || text.includes("아니요")) return "아니오";
    if (text.includes("예")) return "예";
    return "모름";
  } catch {
    return "모름";
  }
}
