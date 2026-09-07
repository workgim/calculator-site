import { describe, it, expect } from 'vitest';
import { calcBrokerFee } from './brokerFee';

describe('calcBrokerFee — 매매', () => {
  it('3억 매매 → 0.4%, 한도 없음 → 120만', () => {
    const r = calcBrokerFee({ dealType: 'sale', price: 300_000_000 });
    expect(r.ratePct).toBe(0.4);
    expect(r.cap).toBeNull();
    expect(r.fee).toBe(1_200_000);
  });

  it('4천만 매매 → 0.6%, 240,000 (한도 25만 미달)', () => {
    const r = calcBrokerFee({ dealType: 'sale', price: 40_000_000 });
    expect(r.ratePct).toBe(0.6);
    expect(r.cap).toBe(250_000);
    expect(r.fee).toBe(240_000);
  });

  it('4,500만 매매 → 0.6% × 4,500만 = 270,000 이지만 한도 25만 적용', () => {
    expect(calcBrokerFee({ dealType: 'sale', price: 45_000_000 }).fee).toBe(250_000);
  });

  it('10억 매매 → 0.5%', () => {
    expect(calcBrokerFee({ dealType: 'sale', price: 1_000_000_000 }).ratePct).toBe(0.5);
  });

  it('16억 매매 → 0.7%', () => {
    expect(calcBrokerFee({ dealType: 'sale', price: 1_600_000_000 }).ratePct).toBe(0.7);
  });

  it('부가세 10% 포함', () => {
    const r = calcBrokerFee({ dealType: 'sale', price: 300_000_000, includeVat: true });
    expect(r.vat).toBe(120_000);
    expect(r.total).toBe(1_320_000);
  });
});

describe('calcBrokerFee — 임대차', () => {
  it('전세 3억 → 0.3%', () => {
    const r = calcBrokerFee({ dealType: 'lease', price: 300_000_000 });
    expect(r.ratePct).toBe(0.3);
    expect(r.fee).toBe(900_000);
  });

  it('월세: 보증금 1천만 + 월세 50만 → 거래금액 = 1천만 + 5천만 = 6천만 (5천만 이상)', () => {
    const r = calcBrokerFee({ dealType: 'monthly', deposit: 10_000_000, monthlyRent: 500_000 });
    expect(r.transactionAmount).toBe(60_000_000); // 0.4% 구간
    expect(r.ratePct).toBe(0.4);
  });

  it('월세: 보증금 500만 + 월세 30만 → 합 3,500만 < 5천만 이므로 ×70 적용', () => {
    const r = calcBrokerFee({ dealType: 'monthly', deposit: 5_000_000, monthlyRent: 300_000 });
    // 5,000,000 + 300,000*100 = 35,000,000 < 50,000,000 → 5,000,000 + 300,000*70 = 26,000,000
    expect(r.transactionAmount).toBe(26_000_000);
  });
});

describe('calcBrokerFee — 검증', () => {
  it('매매가 0', () => expect(() => calcBrokerFee({ dealType: 'sale', price: 0 })).toThrow());
  it('음수', () => expect(() => calcBrokerFee({ dealType: 'lease', price: -1 })).toThrow());
});
