import { describe, it, expect } from 'vitest';
import { dday, daysCounting, daysBetween, addDays } from './dday';

describe('dday', () => {
  it('미래 날짜 → D-N', () => {
    expect(dday('2026-12-25', '2026-09-07')).toEqual({ diffDays: 109, label: 'D-109' });
  });
  it('같은 날 → D-DAY', () => {
    expect(dday('2026-09-07', '2026-09-07')).toEqual({ diffDays: 0, label: 'D-DAY' });
  });
  it('과거 날짜 → D+N', () => {
    expect(dday('2026-09-01', '2026-09-07')).toEqual({ diffDays: -6, label: 'D+6' });
  });
  it('시각·시간대 영향 없음 (Date 객체 입력)', () => {
    const t = new Date('2026-12-25T23:59:00+09:00');
    const f = new Date('2026-09-07T00:01:00Z');
    expect(dday(t, f).diffDays).toBe(109);
  });
});

describe('daysCounting — 시작일 = 1일', () => {
  it('2026-06-01 부터 2026-09-08 은 100일째', () => {
    expect(daysCounting('2026-06-01', '2026-09-08')).toBe(100);
  });
  it('같은 날은 1일째', () => {
    expect(daysCounting('2026-09-07', '2026-09-07')).toBe(1);
  });
});

describe('daysBetween / addDays', () => {
  it('2026-01-01 ~ 2026-12-31 은 364일 (평년)', () => {
    expect(daysBetween('2026-01-01', '2026-12-31')).toBe(364);
  });
  it('부호 없음 (순서 무관)', () => {
    expect(daysBetween('2026-12-31', '2026-01-01')).toBe(364);
  });
  it('addDays: 윤년 2월 경계', () => {
    expect(addDays('2024-02-28', 1)).toBe('2024-02-29');
    expect(addDays('2026-02-28', 1)).toBe('2026-03-01');
  });
  it('잘못된 형식은 에러', () => {
    expect(() => dday('2026/12/25')).toThrow();
  });
});
