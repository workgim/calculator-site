import { describe, it, expect } from 'vitest';
import { calcSavings } from './savings';

describe('calcSavings — 예금(거치식)', () => {
  it('단리: 원금 10,000,000 / 3% / 12개월 → 세전이자 300,000', () => {
    const r = calcSavings({
      type: 'deposit',
      amount: 10_000_000,
      annualRatePct: 3,
      months: 12,
      method: 'simple',
      tax: 'normal',
    });
    expect(r.principal).toBe(10_000_000);
    expect(r.pretaxInterest).toBe(300_000);
    expect(r.tax).toBe(Math.round(300_000 * 0.154)); // 46,200
    expect(r.aftertaxInterest).toBe(300_000 - 46_200);
    expect(r.maturityAmount).toBe(10_000_000 + (300_000 - 46_200));
  });

  it('월복리는 단리보다 이자가 크거나 같다', () => {
    const base = {
      type: 'deposit' as const,
      amount: 10_000_000,
      annualRatePct: 3,
      months: 24,
      tax: 'normal' as const,
    };
    const simple = calcSavings({ ...base, method: 'simple' });
    const compound = calcSavings({ ...base, method: 'compound' });
    expect(compound.pretaxInterest).toBeGreaterThan(simple.pretaxInterest);
  });

  it('비과세면 세금 0, 세후이자 = 세전이자', () => {
    const r = calcSavings({
      type: 'deposit',
      amount: 5_000_000,
      annualRatePct: 4,
      months: 12,
      method: 'simple',
      tax: 'taxfree',
    });
    expect(r.tax).toBe(0);
    expect(r.aftertaxInterest).toBe(r.pretaxInterest);
  });
});

describe('calcSavings — 적금(정기적립)', () => {
  it('단리: 월 100,000 / 4% / 12개월 → 원금 1,200,000, 세전이자 26,000', () => {
    const r = calcSavings({
      type: 'installment',
      amount: 100_000,
      annualRatePct: 4,
      months: 12,
      method: 'simple',
      tax: 'normal',
    });
    expect(r.principal).toBe(1_200_000);
    // 100,000 * (0.04/12) * (12*13/2) = 333.33 * 78 = 26,000
    expect(r.pretaxInterest).toBe(26_000);
  });

  it('월복리 적금은 단리보다 이자가 크다', () => {
    const base = {
      type: 'installment' as const,
      amount: 100_000,
      annualRatePct: 4,
      months: 24,
      tax: 'normal' as const,
    };
    expect(calcSavings({ ...base, method: 'compound' }).pretaxInterest).toBeGreaterThan(
      calcSavings({ ...base, method: 'simple' }).pretaxInterest,
    );
  });

  it('세금우대(9.5%) 적용', () => {
    const r = calcSavings({
      type: 'installment',
      amount: 100_000,
      annualRatePct: 4,
      months: 12,
      method: 'simple',
      tax: 'preferential',
    });
    expect(r.tax).toBe(Math.round(r.pretaxInterest * 0.095));
  });
});

describe('calcSavings — 입력 검증', () => {
  const ok = {
    type: 'deposit' as const,
    amount: 1_000_000,
    annualRatePct: 3,
    months: 12,
    method: 'simple' as const,
    tax: 'normal' as const,
  };
  it('금액 0 이하', () => expect(() => calcSavings({ ...ok, amount: 0 })).toThrow());
  it('음수 이율', () => expect(() => calcSavings({ ...ok, annualRatePct: -1 })).toThrow());
  it('기간 소수', () => expect(() => calcSavings({ ...ok, months: 12.5 })).toThrow());
  it('NaN', () => expect(() => calcSavings({ ...ok, amount: NaN })).toThrow());
});
