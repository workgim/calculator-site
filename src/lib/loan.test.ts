import { describe, it, expect } from 'vitest';
import { calcLoan } from './loan';

// 3천만 원 / 연 4.5% / 36개월 기준값 (Node 로 사전 검증, 은행 계산기와 반올림 차이 수 원 이내)
describe('calcLoan — 거치기간 없음', () => {
  it('원리금균등: 매월 동일', () => {
    const r = calcLoan(30_000_000, 4.5, 36, 'equalPayment');
    expect(r.monthlyPayment).toBe(892_408);
    expect(r.firstPayment).toBe(r.lastPayment);
    expect(r.totalPayment).toBe(30_000_000 + r.totalInterest);
  });

  it('원금균등: 첫 달 > 마지막 달, 총이자 = r·P·(n+1)/2', () => {
    const r = calcLoan(30_000_000, 4.5, 36, 'equalPrincipal');
    expect(r.monthlyPayment).toBeNull();
    expect(r.firstPayment).toBe(945_833);
    expect(r.lastPayment).toBe(836_458);
    expect(r.totalInterest).toBe(2_081_250);
  });

  it('만기일시: 매월 이자만, 마지막에 원금', () => {
    const r = calcLoan(30_000_000, 4.5, 36, 'bullet');
    expect(r.firstPayment).toBe(112_500);
    expect(r.lastPayment).toBe(112_500 + 30_000_000);
    expect(r.totalInterest).toBe(112_500 * 36);
  });

  it('이자율 0% → 총이자 0', () => {
    const r = calcLoan(12_000_000, 0, 12, 'equalPayment');
    expect(r.totalInterest).toBe(0);
    expect(r.monthlyPayment).toBe(1_000_000);
  });
});

describe('calcLoan — 거치기간', () => {
  it('거치 두면 총이자가 늘어난다 (원리금균등)', () => {
    const noGrace = calcLoan(30_000_000, 4.5, 36, 'equalPayment', 0);
    const grace12 = calcLoan(30_000_000, 4.5, 36, 'equalPayment', 12);
    expect(grace12.gracePayment).toBe(112_500); // 원금 전액 이자만
    expect(grace12.graceMonths).toBe(12);
    expect(grace12.totalInterest).toBeGreaterThan(noGrace.totalInterest);
  });

  it('거치 12 원금균등: 거치 후 첫 달 = 원금분할 + 원금이자', () => {
    const r = calcLoan(30_000_000, 4.5, 36, 'equalPrincipal', 12);
    expect(r.firstPayment).toBe(1_362_500); // 30,000,000/24 + 30,000,000*0.00375
    expect(r.lastPayment).toBe(1_254_688);
    expect(r.totalInterest).toBe(2_756_250);
  });

  it('거치 0 은 인자 생략과 동일 (하위호환)', () => {
    const a = calcLoan(30_000_000, 4.5, 36, 'equalPayment');
    const b = calcLoan(30_000_000, 4.5, 36, 'equalPayment', 0);
    expect(b).toEqual(a);
  });

  it('bullet 은 거치기간 무시', () => {
    const a = calcLoan(30_000_000, 4.5, 36, 'bullet', 0);
    const b = calcLoan(30_000_000, 4.5, 36, 'bullet', 12);
    expect(b).toEqual(a);
  });

  it('거치 >= 전체기간 → 에러', () => {
    expect(() => calcLoan(30_000_000, 4.5, 36, 'equalPayment', 36)).toThrow();
  });
});

describe('calcLoan — 입력 검증', () => {
  it('원금 0 이하', () => expect(() => calcLoan(0, 4.5, 36, 'equalPayment')).toThrow());
  it('음수 이자율', () => expect(() => calcLoan(1_000_000, -1, 36, 'equalPayment')).toThrow());
  it('기간 소수', () => expect(() => calcLoan(1_000_000, 4.5, 12.5, 'equalPayment')).toThrow());
  it('기간 600 초과', () => expect(() => calcLoan(1_000_000, 4.5, 601, 'equalPayment')).toThrow());
});
