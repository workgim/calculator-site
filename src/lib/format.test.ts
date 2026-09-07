import { describe, it, expect } from 'vitest';
import { parseAmount, formatThousands, moneyStepLabel } from './format';

describe('parseAmount', () => {
  it('콤마·원·공백 제거', () => {
    expect(parseAmount('1,234,567원')).toBe(1_234_567);
    expect(parseAmount('  36000000 ')).toBe(36_000_000);
  });
  it('숫자는 그대로', () => expect(parseAmount(4200)).toBe(4200));
  it('유효 숫자 없으면 NaN', () => {
    expect(parseAmount('')).toBeNaN();
    expect(parseAmount('원')).toBeNaN();
  });
});

describe('formatThousands', () => {
  it('정수부 3자리 콤마', () => {
    expect(formatThousands(1234567)).toBe('1,234,567');
    expect(formatThousands('30000000')).toBe('30,000,000');
  });
  it('소수부·부호 유지', () => {
    expect(formatThousands(4.5)).toBe('4.5');
    expect(formatThousands(-12000)).toBe('-12,000');
  });
  it('1000 미만은 그대로', () => expect(formatThousands(999)).toBe('999'));
});

describe('moneyStepLabel', () => {
  it('만/억 단위 라벨', () => {
    expect(moneyStepLabel(10_000)).toBe('1만');
    expect(moneyStepLabel(100_000)).toBe('10만');
    expect(moneyStepLabel(10_000_000)).toBe('1000만');
    expect(moneyStepLabel(100_000_000)).toBe('1억');
  });
});
