import { describe, it, expect } from 'vitest';
import { calcAcquisitionTax } from './acquisitionTax';

describe('calcAcquisitionTax — 1주택 유상취득', () => {
  it('5억 (6억 이하) → 취득세율 1%', () => {
    const r = calcAcquisitionTax({ price: 500_000_000, over85: false });
    expect(r.ratePct).toBe(1);
    expect(r.acquisitionTax).toBe(5_000_000);
    expect(r.localEducationTax).toBe(500_000); // 취득세 × 0.1
    expect(r.ruralTax).toBe(0);
    expect(r.total).toBe(5_500_000);
  });

  it('7.5억 (6~9억) → 세율 2%', () => {
    const r = calcAcquisitionTax({ price: 750_000_000, over85: false });
    expect(r.ratePct).toBe(2); // 7.5*2/3 - 3 = 2
    expect(r.acquisitionTax).toBe(15_000_000);
  });

  it('6억 경계 → 1%, 9억 경계 → 3%', () => {
    expect(calcAcquisitionTax({ price: 600_000_000, over85: false }).ratePct).toBe(1);
    expect(calcAcquisitionTax({ price: 900_000_000, over85: false }).ratePct).toBe(3);
  });

  it('12억 (9억 초과) → 3%', () => {
    const r = calcAcquisitionTax({ price: 1_200_000_000, over85: false });
    expect(r.ratePct).toBe(3);
    expect(r.acquisitionTax).toBe(36_000_000);
    expect(r.localEducationTax).toBe(3_600_000);
  });

  it('전용 85㎡ 초과 → 농특세 0.2% 추가', () => {
    const under = calcAcquisitionTax({ price: 500_000_000, over85: false });
    const over = calcAcquisitionTax({ price: 500_000_000, over85: true });
    expect(over.ruralTax).toBe(1_000_000); // 5억 × 0.2%
    expect(over.total).toBe(under.total + 1_000_000);
  });

  it('가액 0 이하는 에러', () => {
    expect(() => calcAcquisitionTax({ price: 0, over85: false })).toThrow();
  });
});
