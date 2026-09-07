/**
 * 글자 수 / 바이트 세기. 순수 함수. (docs/02-calculator-catalog.md 카테고리 F)
 * 자기소개서 글자수 제한, 게시판 바이트 제한 등에 사용.
 */
export interface CharCountResult {
  charsWithSpaces: number; // 공백 포함 글자 수
  charsWithoutSpaces: number; // 공백 제외
  bytesUtf8: number; // UTF-8 바이트 (한글 3, 영문/숫자 1)
  bytesEucKr: number; // EUC-KR 근사 (한글 2, 영문/숫자 1)
  words: number; // 공백 기준 단어 수
  lines: number; // 줄 수
}

/** 문자열 → 각종 카운트. (이모지 등 서로게이트 쌍은 1자로 셈) */
export function countChars(text: string): CharCountResult {
  const chars = Array.from(text); // 코드포인트 단위

  const charsWithSpaces = chars.length;
  const charsWithoutSpaces = chars.filter((c) => !/\s/.test(c)).length;

  let bytesUtf8 = 0;
  let bytesEucKr = 0;
  for (const ch of chars) {
    const cp = ch.codePointAt(0)!;
    // UTF-8
    if (cp <= 0x7f) bytesUtf8 += 1;
    else if (cp <= 0x7ff) bytesUtf8 += 2;
    else if (cp <= 0xffff) bytesUtf8 += 3;
    else bytesUtf8 += 4;
    // EUC-KR 근사: ASCII 1바이트, 그 외(한글·한자 등) 2바이트
    bytesEucKr += cp <= 0x7f ? 1 : 2;
  }

  const trimmed = text.trim();
  const words = trimmed === '' ? 0 : trimmed.split(/\s+/).length;
  const lines = text === '' ? 0 : text.split(/\r\n|\r|\n/).length;

  return { charsWithSpaces, charsWithoutSpaces, bytesUtf8, bytesEucKr, words, lines };
}
