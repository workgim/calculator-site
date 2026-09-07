import { describe, it, expect } from 'vitest';
import { calcVat } from './vat';

describe('calcVat', () => {
  it('공급가액 → 세액 10%, 합계', () => {
    expect(calcVat(1_000_000, 'supply')).toEqual({
      supply: 1_000_000,
      vat: 100_000,
      total: 1_100_000,
    });
  });

  it('합계 → 공급가액 역산', () => {
    expect(calcVat(1_100_000, 'total')).toEqual({
      supply: 1_000_000,
      vat: 100_000,
      total: 1_100_000,
    });
  });

  it('세액 → 공급가액·합계 역산', () => {
    expect(calcVat(100_000, 'vat')).toEqual({
      supply: 1_000_000,
      vat: 100_000,
      total: 1_100_000,
    });
  });

  it('세 방향 모두 supply+vat === total', () => {
    for (const [amt, basis] of [
      [1_234_567, 'supply'],
      [1_358_024, 'total'],
      [135_802, 'vat'],
    ] as const) {
      const r = calcVat(amt, basis);
      expect(r.supply + r.vat).toBe(r.total);
    }
  });

  it('0원 허용', () => {
    expect(calcVat(0, 'supply')).toEqual({ supply: 0, vat: 0, total: 0 });
  });

  it('음수·NaN 은 에러', () => {
    expect(() => calcVat(-1, 'supply')).toThrow();
    expect(() => calcVat(NaN, 'total')).toThrow();
  });
});
