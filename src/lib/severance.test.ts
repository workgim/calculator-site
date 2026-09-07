import { describe, it, expect } from 'vitest';
import { calcSeverance } from './severance';

describe('calcSeverance', () => {
  it('기본 케이스: 월 300만, 3년 근속 → 퇴직금 ≈ 900만대', () => {
    const r = calcSeverance({
      hireDate: '2021-01-01',
      leaveDate: '2023-12-31',
      monthlyBasePay: 3_000_000,
    });
    // 재직 3년(2021-01-01 ~ 2024-01-01) = 365×3 = 1095일
    expect(r.tenureDays).toBe(1095);
    expect(r.tenureText).toBe('3년 0개월 0일');
    expect(r.eligible).toBe(true);
    // 평균임금 ≈ 3,000,000*3 / 92 ≈ 97,826 ; 퇴직금 ≈ 97,826*30*(1096/365) ≈ 8,812,000
    expect(r.severancePay).toBeGreaterThan(8_500_000);
    expect(r.severancePay).toBeLessThan(9_200_000);
  });

  it('상여금·수당·연차수당이 늘면 퇴직금도 늘어난다', () => {
    const base = {
      hireDate: '2020-06-01',
      leaveDate: '2024-05-31',
      monthlyBasePay: 2_500_000,
    };
    const a = calcSeverance(base);
    const b = calcSeverance({
      ...base,
      monthlyAllowance: 300_000,
      annualBonus: 6_000_000,
      annualLeaveAllowance: 1_200_000,
    });
    expect(b.severancePay).toBeGreaterThan(a.severancePay);
  });

  it('1년 미만 근무는 eligible = false', () => {
    const r = calcSeverance({
      hireDate: '2024-01-01',
      leaveDate: '2024-08-31',
      monthlyBasePay: 3_000_000,
    });
    expect(r.eligible).toBe(false);
    expect(r.tenureDays).toBeLessThan(365);
  });

  it('재직기간 연·월·일 계산 (입사 2020-03-15, 퇴사 2023-07-20)', () => {
    const r = calcSeverance({
      hireDate: '2020-03-15',
      leaveDate: '2023-07-20',
      monthlyBasePay: 3_000_000,
    });
    // 퇴직일 2023-07-21 기준
    expect(r.tenureText).toBe('3년 4개월 6일');
  });

  it('3개월 총일수는 89~92 범위', () => {
    for (const leaveDate of ['2024-01-31', '2024-03-31', '2024-06-30', '2024-12-31']) {
      const r = calcSeverance({ hireDate: '2020-01-01', leaveDate, monthlyBasePay: 3_000_000 });
      expect(r.threeMonthDays).toBeGreaterThanOrEqual(89);
      expect(r.threeMonthDays).toBeLessThanOrEqual(92);
    }
  });

  it('입력 검증', () => {
    expect(() =>
      calcSeverance({ hireDate: '2023-01-01', leaveDate: '2022-01-01', monthlyBasePay: 3_000_000 }),
    ).toThrow();
    expect(() =>
      calcSeverance({ hireDate: '2023-01-01', leaveDate: '2024-01-01', monthlyBasePay: 0 }),
    ).toThrow();
    expect(() =>
      calcSeverance({
        hireDate: '2023-01-01',
        leaveDate: '2024-01-01',
        monthlyBasePay: 3_000_000,
        annualBonus: -1,
      }),
    ).toThrow();
  });
});
