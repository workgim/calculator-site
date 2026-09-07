import { describe, it, expect } from 'vitest';
import { calcSalary, SALARY_RATES } from './salary';

describe('calcSalary — 4대보험 (2026 요율)', () => {
  const r = calcSalary({ annualSalary: 36_000_000 }); // 월 300만, 비과세 20만 → 과세 280만

  it('국민연금 = 과세소득 × 4.75%', () => {
    expect(r.nationalPension).toBe(Math.round(2_800_000 * 0.0475)); // 133,000
  });
  it('건강보험 = 과세소득 × 3.595%', () => {
    expect(r.healthInsurance).toBe(Math.round(2_800_000 * 0.03595));
  });
  it('장기요양 = 건강보험료 × 13.14%', () => {
    expect(r.longTermCare).toBe(Math.round(r.healthInsurance * 0.1314));
  });
  it('고용보험 = 과세소득 × 0.9%', () => {
    expect(r.employmentInsurance).toBe(Math.round(2_800_000 * 0.009));
  });
});

describe('calcSalary — 실수령액 근사 (사람인 대조)', () => {
  it('연봉 3,600만 → 월 실수령 약 263만 (사람인 2025 기준 264만대와 1% 이내)', () => {
    const r = calcSalary({ annualSalary: 36_000_000 });
    expect(r.monthlyNet).toBeGreaterThan(2_600_000);
    expect(r.monthlyNet).toBeLessThan(2_670_000);
    expect(r.annualNet).toBe(r.monthlyNet * 12);
  });

  it('연봉이 오르면 실수령도 오른다 (단조 증가)', () => {
    const nets = [24, 36, 50, 70, 100, 150].map(
      (m) => calcSalary({ annualSalary: m * 1_000_000 }).monthlyNet,
    );
    for (let i = 1; i < nets.length; i++) expect(nets[i]).toBeGreaterThan(nets[i - 1]);
  });

  it('국민연금 기준소득월액 상한 적용 (초고소득)', () => {
    const r = calcSalary({ annualSalary: 300_000_000 }); // 월 2,500만
    const cap = SALARY_RATES.nationalPension.baseMax * SALARY_RATES.nationalPension.employeeRate;
    expect(r.nationalPension).toBe(Math.round(cap));
  });
});

describe('calcSalary — 옵션', () => {
  it('부양가족 늘면 소득세 감소', () => {
    const base = calcSalary({ annualSalary: 50_000_000, dependents: 1 });
    const more = calcSalary({ annualSalary: 50_000_000, dependents: 4 });
    expect(more.incomeTax).toBeLessThan(base.incomeTax);
  });

  it('원천징수 80% < 100% < 120%', () => {
    const mk = (w: number) => calcSalary({ annualSalary: 50_000_000, withholdingRate: w }).incomeTax;
    expect(mk(0.8)).toBeLessThan(mk(1));
    expect(mk(1)).toBeLessThan(mk(1.2));
  });

  it('8~20세 자녀 있으면 소득세 감소', () => {
    const a = calcSalary({ annualSalary: 50_000_000, childrenForCredit: 0 });
    const b = calcSalary({ annualSalary: 50_000_000, childrenForCredit: 2 });
    expect(b.incomeTax).toBeLessThan(a.incomeTax);
  });

  it('지방소득세 = 근로소득세 × 10%', () => {
    const r = calcSalary({ annualSalary: 60_000_000 });
    expect(r.localIncomeTax).toBe(Math.round(r.incomeTax * 0.1));
  });
});

describe('calcSalary — 입력 검증', () => {
  it('연봉 0 이하', () => expect(() => calcSalary({ annualSalary: 0 })).toThrow());
  it('부양가족 0', () => expect(() => calcSalary({ annualSalary: 3e7, dependents: 0 })).toThrow());
  it('원천징수 비율 이상값', () =>
    expect(() => calcSalary({ annualSalary: 3e7, withholdingRate: 1.5 })).toThrow());
});
