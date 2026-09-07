import { describe, it, expect } from 'vitest';
import { calcDateAdd } from './dateAdd';

describe('calcDateAdd', () => {
  it('일 더하기', () => {
    const r = calcDateAdd({ base: '2026-09-07', direction: 'add', days: 100 });
    expect(r.date).toBe('2026-12-16');
    expect(r.diffDays).toBe(100);
  });

  it('빼기', () => {
    expect(calcDateAdd({ base: '2026-09-07', direction: 'subtract', days: 7 }).date).toBe(
      '2026-08-31',
    );
  });

  it('주 + 일 조합', () => {
    expect(calcDateAdd({ base: '2026-01-01', direction: 'add', weeks: 2, days: 3 }).date).toBe(
      '2026-01-18',
    );
  });

  it('개월 더하기: 없는 날은 말일 보정 (1/31 + 1개월 → 2/28)', () => {
    expect(calcDateAdd({ base: '2026-01-31', direction: 'add', months: 1 }).date).toBe('2026-02-28');
  });

  it('년 넘어가는 개월', () => {
    expect(calcDateAdd({ base: '2026-11-15', direction: 'add', months: 3 }).date).toBe('2027-02-15');
  });

  it('요일 계산', () => {
    // 2026-09-07 은 월요일
    expect(calcDateAdd({ base: '2026-09-07', direction: 'add', days: 0 }).weekday).toBe('월');
    expect(calcDateAdd({ base: '2026-09-07', direction: 'add', days: 5 }).weekday).toBe('토');
  });

  it('윤년 2/29', () => {
    expect(calcDateAdd({ base: '2024-01-29', direction: 'add', months: 1 }).date).toBe('2024-02-29');
  });

  it('검증: 음수·소수·잘못된 날짜', () => {
    expect(() => calcDateAdd({ base: '2026-09-07', direction: 'add', days: -1 })).toThrow();
    expect(() => calcDateAdd({ base: '2026-09-07', direction: 'add', days: 1.5 })).toThrow();
    expect(() => calcDateAdd({ base: '2026-13-01', direction: 'add', days: 1 })).toThrow();
  });
});
