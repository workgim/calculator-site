import { describe, it, expect } from 'vitest';
import { calcBmi } from './bmi';

describe('calcBmi', () => {
  it('170cm / 65kg → 22.5, 정상', () => {
    expect(calcBmi(170, 65)).toEqual({ bmi: 22.5, category: '정상' });
  });
  it('경계값 분류 (아시아-태평양 기준)', () => {
    expect(calcBmi(170, 53).category).toBe('저체중'); // BMI 18.3
    expect(calcBmi(170, 70).category).toBe('과체중'); // BMI 24.2
    expect(calcBmi(170, 75).category).toBe('비만 1단계'); // BMI 26.0
    expect(calcBmi(170, 90).category).toBe('비만 2단계'); // BMI 31.1
    expect(calcBmi(170, 105).category).toBe('비만 3단계'); // BMI 36.3
  });
  it('소수 첫째 자리 반올림', () => {
    expect(calcBmi(175, 70).bmi).toBe(22.9);
  });
  it('범위 밖 입력은 에러', () => {
    expect(() => calcBmi(0, 65)).toThrow();
    expect(() => calcBmi(170, 0)).toThrow();
    expect(() => calcBmi(40, 65)).toThrow();
    expect(() => calcBmi(170, 600)).toThrow();
    expect(() => calcBmi(NaN, 65)).toThrow();
  });
});
