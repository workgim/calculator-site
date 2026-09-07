import { describe, it, expect } from 'vitest';
import { calcBmr, ACTIVITY_FACTOR } from './bmr';

describe('calcBmr — Mifflin-St Jeor', () => {
  it('남 30세 175cm 70kg, 좌식', () => {
    // 10*70 + 6.25*175 - 5*30 + 5 = 700 + 1093.75 - 150 + 5 = 1648.75 → 1649
    const r = calcBmr({ sex: 'male', age: 30, heightCm: 175, weightKg: 70, activity: 'sedentary' });
    expect(r.bmr).toBe(1649);
    expect(r.tdee).toBe(Math.round(1648.75 * 1.2)); // 1979
    expect(r.loseWeight).toBe(r.tdee - 500);
    expect(r.gainWeight).toBe(r.tdee + 500);
  });

  it('여 30세 160cm 55kg, 보통 활동', () => {
    // 10*55 + 6.25*160 - 5*30 - 161 = 550 + 1000 - 150 - 161 = 1239
    const r = calcBmr({ sex: 'female', age: 30, heightCm: 160, weightKg: 55, activity: 'moderate' });
    expect(r.bmr).toBe(1239);
    expect(r.tdee).toBe(Math.round(1239 * 1.55));
  });

  it('활동 수준 높을수록 TDEE 증가', () => {
    const mk = (activity: keyof typeof ACTIVITY_FACTOR) =>
      calcBmr({ sex: 'male', age: 30, heightCm: 175, weightKg: 70, activity }).tdee;
    expect(mk('sedentary')).toBeLessThan(mk('light'));
    expect(mk('light')).toBeLessThan(mk('moderate'));
    expect(mk('moderate')).toBeLessThan(mk('active'));
    expect(mk('active')).toBeLessThan(mk('veryActive'));
  });

  it('남자가 여자보다 BMR 높음 (동일 조건)', () => {
    const base = { age: 30, heightCm: 170, weightKg: 65, activity: 'sedentary' as const };
    expect(calcBmr({ ...base, sex: 'male' }).bmr).toBeGreaterThan(
      calcBmr({ ...base, sex: 'female' }).bmr,
    );
  });

  it('입력 검증', () => {
    const ok = { sex: 'male' as const, age: 30, heightCm: 175, weightKg: 70, activity: 'sedentary' as const };
    expect(() => calcBmr({ ...ok, age: 0 })).toThrow();
    expect(() => calcBmr({ ...ok, heightCm: 40 })).toThrow();
    expect(() => calcBmr({ ...ok, weightKg: 600 })).toThrow();
    expect(() => calcBmr({ ...ok, age: NaN })).toThrow();
  });
});
