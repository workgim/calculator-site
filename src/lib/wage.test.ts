import { describe, it, expect } from 'vitest';
import { calcWage, MINIMUM_WAGE } from './wage';

describe('calcWage — 주휴수당', () => {
  it('주 40시간, 시급 10,320 → 주휴 8시간분', () => {
    const r = calcWage({ hourly: 10_320, weeklyHours: 40 });
    expect(r.weeklyHolidayHours).toBe(8);
    expect(r.weeklyHolidayPay).toBe(10_320 * 8);
    expect(r.weeklyPay).toBe(10_320 * 40 + 10_320 * 8);
  });

  it('주 20시간 → 주휴 4시간분', () => {
    const r = calcWage({ hourly: 12_000, weeklyHours: 20 });
    expect(r.weeklyHolidayHours).toBe(4);
    expect(r.weeklyHolidayPay).toBe(48_000);
  });

  it('주 15시간 미만 → 주휴수당 없음', () => {
    const r = calcWage({ hourly: 12_000, weeklyHours: 14 });
    expect(r.eligibleForHolidayPay).toBe(false);
    expect(r.weeklyHolidayPay).toBe(0);
  });

  it('주 48시간 → 주휴는 40시간 기준으로 상한 (8시간분)', () => {
    expect(calcWage({ hourly: 10_320, weeklyHours: 48 }).weeklyHolidayHours).toBe(8);
  });

  it('월 환산 = 주급 × 4.345', () => {
    const r = calcWage({ hourly: 10_320, weeklyHours: 40 });
    expect(r.monthlyPay).toBe(Math.round(r.weeklyPay * (365 / 7 / 12)));
  });

  it('2026 최저임금 40시간 월 환산 ≈ 215만원대', () => {
    const r = calcWage({ hourly: MINIMUM_WAGE.hourly, weeklyHours: 40 });
    expect(r.monthlyPay).toBeGreaterThan(2_140_000);
    expect(r.monthlyPay).toBeLessThan(2_170_000);
  });

  it('최저임금 미만 감지', () => {
    expect(calcWage({ hourly: 9_000, weeklyHours: 40 }).belowMinimum).toBe(true);
    expect(calcWage({ hourly: 10_320, weeklyHours: 40 }).belowMinimum).toBe(false);
  });

  it('검증: 시급/시간 0 이하, 168시간 초과', () => {
    expect(() => calcWage({ hourly: 0, weeklyHours: 40 })).toThrow();
    expect(() => calcWage({ hourly: 10_000, weeklyHours: 0 })).toThrow();
    expect(() => calcWage({ hourly: 10_000, weeklyHours: 200 })).toThrow();
  });
});
