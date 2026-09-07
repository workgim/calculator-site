/**
 * 날짜에 기간을 더하거나 빼기. 순수 함수. (docs/02-calculator-catalog.md 카테고리 C)
 * 연·월을 더할 때 그 달에 없는 날(예: 1/31 + 1개월)이면 말일로 보정한다.
 */
import { daysBetween } from './dday';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

function parseYmd(s: string): { y: number; m: number; d: number } {
  const match = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) throw new Error('날짜는 YYYY-MM-DD 형식으로 입력하세요.');
  const [, y, m, d] = match.map(Number);
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) {
    throw new Error('실제로 존재하는 날짜를 입력하세요.');
  }
  return { y, m, d };
}

const daysInMonth = (y: number, m1to12: number): number => new Date(y, m1to12, 0).getDate();

export interface DateAddInput {
  /** 기준일 YYYY-MM-DD */
  base: string;
  /** 'add' | 'subtract' */
  direction: 'add' | 'subtract';
  years?: number;
  months?: number;
  weeks?: number;
  days?: number;
}

export interface DateAddResult {
  /** 결과 날짜 YYYY-MM-DD */
  date: string;
  /** 요일 (예: "수") */
  weekday: string;
  /** 기준일로부터의 일수 차이 (부호 없음) */
  diffDays: number;
}

export function calcDateAdd(input: DateAddInput): DateAddResult {
  const { base, direction, years = 0, months = 0, weeks = 0, days = 0 } = input;
  const parts = [years, months, weeks, days];
  if (!parts.every(Number.isFinite)) throw new Error('숫자를 입력하세요.');
  if (parts.some((n) => !Number.isInteger(n) || n < 0)) {
    throw new Error('기간은 0 이상의 정수로 입력하세요.');
  }

  const { y, m, d } = parseYmd(base);
  const sign = direction === 'subtract' ? -1 : 1;

  // 연·월 먼저 (말일 보정)
  let ny = y + sign * years;
  let nmIndex = m - 1 + sign * months; // 0-based
  ny += Math.floor(nmIndex / 12);
  nmIndex = ((nmIndex % 12) + 12) % 12;
  const nm = nmIndex + 1;
  const nd = Math.min(d, daysInMonth(ny, nm));

  // 주·일 더하기
  const dt = new Date(ny, nm - 1, nd);
  dt.setDate(dt.getDate() + sign * (weeks * 7 + days));

  const resultStr = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(
    dt.getDate(),
  ).padStart(2, '0')}`;

  return {
    date: resultStr,
    weekday: WEEKDAYS[dt.getDay()],
    diffDays: daysBetween(base, resultStr),
  };
}
