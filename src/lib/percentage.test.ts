import { describe, it, expect } from 'vitest';
import { percentOf, whatPercent, changeRate } from './percentage';

describe('percentOf — A의 B%', () => {
  it('20000의 15% = 3000', () => expect(percentOf(20_000, 15)).toBe(3_000));
  it('소수 둘째 자리 반올림', () => expect(percentOf(333, 33)).toBe(109.89));
});

describe('whatPercent — A는 B의 몇 %', () => {
  it('3000은 20000의 15%', () => expect(whatPercent(3_000, 20_000)).toBe(15));
  it('기준값 0 은 에러', () => expect(() => whatPercent(1, 0)).toThrow());
});

describe('changeRate — 증감률', () => {
  it('20000 → 23000 은 +15%', () => expect(changeRate(20_000, 23_000)).toBe(15));
  it('20000 → 17000 은 -15%', () => expect(changeRate(20_000, 17_000)).toBe(-15));
  it('처음 값 0 은 에러', () => expect(() => changeRate(0, 100)).toThrow());
});

describe('입력 검증', () => {
  it('NaN 은 에러', () => {
    expect(() => percentOf(NaN, 10)).toThrow();
    expect(() => changeRate(10, NaN)).toThrow();
  });
});
