import { describe, it, expect } from 'vitest';
import { pyeongToSqm, sqmToPyeong, convertArea } from './pyeong';

describe('평 ↔ ㎡', () => {
  it('1평 ≈ 3.31㎡', () => {
    expect(pyeongToSqm(1)).toBe(3.31);
  });
  it('84㎡ ≈ 25.41평 (국민주택 규모)', () => {
    expect(sqmToPyeong(84)).toBe(25.41);
  });
  it('34평 ≈ 112.4㎡', () => {
    expect(pyeongToSqm(34)).toBe(112.4);
  });
  it('convertArea 양방향', () => {
    expect(convertArea(10, 'pyeong')).toEqual({ pyeong: 10, sqm: 33.06 });
    expect(convertArea(33.06, 'sqm').pyeong).toBeCloseTo(10, 1);
  });
  it('0 허용', () => {
    expect(pyeongToSqm(0)).toBe(0);
  });
  it('음수·NaN 에러', () => {
    expect(() => pyeongToSqm(-1)).toThrow();
    expect(() => sqmToPyeong(NaN)).toThrow();
  });
});
