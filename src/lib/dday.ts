/**
 * 날짜 기반 D-day / 경과일 계산. 순수 함수.
 * 시각·타임존의 영향을 없애려고 연·월·일만 사용한다. (docs/02-calculator-catalog.md 카테고리 C)
 */
const MS_PER_DAY = 86_400_000;

/** 'YYYY-MM-DD' 문자열 또는 Date → 자정(UTC) 기준 Date */
function toDateOnly(value: string | Date): Date {
  let d: Date;
  if (typeof value === 'string') {
    const m = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) throw new Error('날짜는 YYYY-MM-DD 형식으로 입력하세요.');
    d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  } else {
    d = new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()));
  }
  if (Number.isNaN(d.getTime())) throw new Error('올바른 날짜를 입력하세요.');
  return d;
}

export interface DdayResult {
  /** 남은 일수. 양수=미래, 0=당일, 음수=과거 */
  diffDays: number;
  /** "D-30" · "D-DAY" · "D+12" */
  label: string;
}

/** from(기본: 오늘) 기준으로 target 까지의 D-day */
export function dday(target: string | Date, from: string | Date = new Date()): DdayResult {
  const diffDays = Math.round((toDateOnly(target).getTime() - toDateOnly(from).getTime()) / MS_PER_DAY);
  let label: string;
  if (diffDays > 0) label = `D-${diffDays}`;
  else if (diffDays === 0) label = 'D-DAY';
  else label = `D+${Math.abs(diffDays)}`;
  return { diffDays, label };
}

/** start 부터 end(기본: 오늘)까지 "며칠째" — 시작일을 1일로 센다. (커플 100일 등) */
export function daysCounting(start: string | Date, end: string | Date = new Date()): number {
  const n = Math.round((toDateOnly(end).getTime() - toDateOnly(start).getTime()) / MS_PER_DAY);
  return n + 1;
}

/** 두 날짜 사이의 일수 (부호 없는 간격) */
export function daysBetween(a: string | Date, b: string | Date): number {
  return Math.abs(
    Math.round((toDateOnly(b).getTime() - toDateOnly(a).getTime()) / MS_PER_DAY),
  );
}

/** 기준일로부터 n일 뒤(음수면 이전) 날짜를 'YYYY-MM-DD'로 */
export function addDays(base: string | Date, n: number): string {
  if (!Number.isInteger(n)) throw new Error('일수는 정수로 입력하세요.');
  const d = new Date(toDateOnly(base).getTime() + n * MS_PER_DAY);
  return d.toISOString().slice(0, 10);
}
