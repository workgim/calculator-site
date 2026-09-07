import { describe, it, expect } from 'vitest';
import { calcAge } from './age';

describe('calcAge', () => {
  it('생일 지난 경우: 1990-03-15 기준 2026-09-07 → 만 36세', () => {
    const r = calcAge('1990-03-15', '2026-09-07');
    expect(r.fullAge).toBe(36);
    expect(r.yearAge).toBe(36);
  });

  it('생일 안 지난 경우: 1990-12-25 기준 2026-09-07 → 만 35세, 연 나이 36', () => {
    const r = calcAge('1990-12-25', '2026-09-07');
    expect(r.fullAge).toBe(35);
    expect(r.yearAge).toBe(36);
  });

  it('생일 당일 → 만 나이 +1, 다음 생일까지 0일', () => {
    const r = calcAge('2000-09-07', '2026-09-07');
    expect(r.fullAge).toBe(26);
    expect(r.daysToNextBirthday).toBe(0);
  });

  it('다음 생일까지 일수', () => {
    // 2026-09-07 기준 다음 생일 2026-12-25 = 109일
    expect(calcAge('1990-12-25', '2026-09-07').daysToNextBirthday).toBe(109);
  });

  it('태어난 지 일수', () => {
    expect(calcAge('2026-01-01', '2026-12-31').daysLived).toBe(364);
  });

  it('띠 계산', () => {
    expect(calcAge('2020-05-01', '2026-01-01').zodiac).toBe('쥐');
    expect(calcAge('1988-05-01', '2026-01-01').zodiac).toBe('용');
  });

  it('검증: 기준일이 생년월일보다 앞', () => {
    expect(() => calcAge('2026-01-01', '2020-01-01')).toThrow();
  });
  it('검증: 잘못된 날짜', () => {
    expect(() => calcAge('2026-02-30', '2026-09-07')).toThrow();
  });
});
