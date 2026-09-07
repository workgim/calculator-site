import { describe, it, expect } from 'vitest';
import { countChars } from './charCount';

describe('countChars', () => {
  it('빈 문자열', () => {
    expect(countChars('')).toEqual({
      charsWithSpaces: 0,
      charsWithoutSpaces: 0,
      bytesUtf8: 0,
      bytesEucKr: 0,
      words: 0,
      lines: 0,
    });
  });

  it('영문: "hello world"', () => {
    const r = countChars('hello world');
    expect(r.charsWithSpaces).toBe(11);
    expect(r.charsWithoutSpaces).toBe(10);
    expect(r.bytesUtf8).toBe(11);
    expect(r.bytesEucKr).toBe(11);
    expect(r.words).toBe(2);
    expect(r.lines).toBe(1);
  });

  it('한글: "안녕하세요" → UTF-8 15바이트, EUC-KR 10바이트', () => {
    const r = countChars('안녕하세요');
    expect(r.charsWithSpaces).toBe(5);
    expect(r.bytesUtf8).toBe(15);
    expect(r.bytesEucKr).toBe(10);
  });

  it('한글+영문 혼합: "한글abc"', () => {
    const r = countChars('한글abc');
    expect(r.charsWithSpaces).toBe(5);
    expect(r.bytesUtf8).toBe(2 * 3 + 3); // 9
    expect(r.bytesEucKr).toBe(2 * 2 + 3); // 7
  });

  it('줄 수', () => {
    expect(countChars('a\nb\nc').lines).toBe(3);
    expect(countChars('a\r\nb').lines).toBe(2);
  });

  it('공백 제외 / 단어 수', () => {
    const r = countChars('  가  나  다  ');
    expect(r.charsWithoutSpaces).toBe(3);
    expect(r.words).toBe(3);
  });

  it('이모지는 1자', () => {
    expect(countChars('😀').charsWithSpaces).toBe(1);
  });
});
