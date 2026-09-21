export type AttrKey =
  | "living"
  | "animal"
  | "plant"
  | "human"
  | "electronic"
  | "edible"
  | "fruit"
  | "vehicle"
  | "handheld"
  | "household"
  | "outdoor"
  | "clothing"
  | "abstract"
  | "famous"
  | "korean";

export const ATTRIBUTES: { key: AttrKey; question: string }[] = [
  { key: "living", question: "지금 살아 숨쉬는 생명체(였)인가요?" },
  { key: "animal", question: "동물인가요?" },
  { key: "plant", question: "식물이거나 식물에서 나는 것인가요?" },
  { key: "human", question: "사람(인물)인가요?" },
  { key: "electronic", question: "전자제품이나 기계인가요?" },
  { key: "edible", question: "먹을 수 있는 것인가요?" },
  { key: "fruit", question: "과일인가요?" },
  { key: "vehicle", question: "탈것(이동수단)인가요?" },
  { key: "handheld", question: "한 손에 들 수 있을 만큼 작은가요?" },
  { key: "household", question: "집 안에서 흔히 볼 수 있나요?" },
  { key: "outdoor", question: "주로 실외에서 보이나요?" },
  { key: "clothing", question: "옷이나 패션 아이템인가요?" },
  { key: "abstract", question: "손으로 만질 수 없는 개념인가요?" },
  { key: "famous", question: "유명한 사람이나 캐릭터인가요?" },
  { key: "korean", question: "한국에서 유래했거나 한국적인 것인가요?" },
];

export interface WordEntry {
  name: string;
  hint: string;
  attrs: Record<AttrKey, boolean>;
}

function attrs(overrides: Partial<Record<AttrKey, boolean>>): Record<AttrKey, boolean> {
  const base: Record<AttrKey, boolean> = {
    living: false,
    animal: false,
    plant: false,
    human: false,
    electronic: false,
    edible: false,
    fruit: false,
    vehicle: false,
    handheld: false,
    household: false,
    outdoor: false,
    clothing: false,
    abstract: false,
    famous: false,
    korean: false,
  };
  return { ...base, ...overrides };
}

export const WORD_BANK: WordEntry[] = [
  { name: "사과", hint: "먹을 수 있는 것", attrs: attrs({ plant: true, edible: true, fruit: true, handheld: true, household: true }) },
  { name: "바나나", hint: "먹을 수 있는 것", attrs: attrs({ plant: true, edible: true, fruit: true, handheld: true, household: true }) },
  { name: "강아지", hint: "생물", attrs: attrs({ living: true, animal: true, household: true, outdoor: true }) },
  { name: "고양이", hint: "생물", attrs: attrs({ living: true, animal: true, household: true, outdoor: true }) },
  { name: "코끼리", hint: "생물", attrs: attrs({ living: true, animal: true, outdoor: true }) },
  { name: "나무", hint: "생물", attrs: attrs({ living: true, plant: true, outdoor: true }) },
  { name: "장미", hint: "생물", attrs: attrs({ living: true, plant: true, handheld: true, household: true, outdoor: true }) },
  { name: "스마트폰", hint: "사물", attrs: attrs({ electronic: true, handheld: true, household: true }) },
  { name: "노트북", hint: "사물", attrs: attrs({ electronic: true, handheld: true, household: true }) },
  { name: "자동차", hint: "사물", attrs: attrs({ electronic: true, vehicle: true, outdoor: true }) },
  { name: "자전거", hint: "사물", attrs: attrs({ vehicle: true, outdoor: true }) },
  { name: "비행기", hint: "사물", attrs: attrs({ electronic: true, vehicle: true, outdoor: true, famous: false }) },
  { name: "티셔츠", hint: "사물", attrs: attrs({ clothing: true, handheld: true, household: true }) },
  { name: "우산", hint: "사물", attrs: attrs({ handheld: true, household: true, outdoor: true }) },
  { name: "손목시계", hint: "사물", attrs: attrs({ electronic: true, handheld: true, household: true }) },
  { name: "안경", hint: "사물", attrs: attrs({ handheld: true, household: true }) },
  { name: "축구공", hint: "사물", attrs: attrs({ handheld: true, outdoor: true }) },
  { name: "피아노", hint: "사물", attrs: attrs({ household: true }) },
  { name: "기타", hint: "사물", attrs: attrs({ handheld: true, household: true }) },
  { name: "세종대왕", hint: "인물", attrs: attrs({ human: true, famous: true, korean: true }) },
  { name: "아이유", hint: "인물", attrs: attrs({ living: true, human: true, famous: true, korean: true }) },
  { name: "산타클로스", hint: "인물", attrs: attrs({ living: true, human: true, famous: true }) },
  { name: "사랑", hint: "개념", attrs: attrs({ abstract: true }) },
  { name: "시간", hint: "개념", attrs: attrs({ abstract: true }) },
  { name: "인터넷", hint: "개념", attrs: attrs({ abstract: true, electronic: true }) },
  { name: "김치", hint: "먹을 수 있는 것", attrs: attrs({ edible: true, household: true, korean: true }) },
  { name: "라면", hint: "먹을 수 있는 것", attrs: attrs({ edible: true, household: true, korean: true }) },
  { name: "태권도", hint: "개념", attrs: attrs({ abstract: true, korean: true, famous: true }) },
  { name: "한글", hint: "개념", attrs: attrs({ abstract: true, korean: true, famous: true }) },
  { name: "무지개", hint: "자연현상", attrs: attrs({ abstract: true, outdoor: true }) },
];
