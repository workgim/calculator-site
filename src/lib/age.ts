/**
 * 만 나이 계산. 순수 함수. (docs/02-calculator-catalog.md 카테고리 C)
 *
 * 만 나이 = (기준일 연도 − 출생 연도), 생일이 안 지났으면 −1.
 * (2023-06-28 시행 행정기본법·민법 개정으로 "만 나이"로 통일)
 * 연 나이(그 해 만 나이) = 기준일 연도 − 출생 연도.
 */
import { daysBetween } from './dday';

function parseYmd(s: string): { y: number; m: number; d: number } {
  const match = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) throw new Error('날짜는 YYYY-MM-DD 형식으로 입력하세요.');
  const [, y, m, d] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  if (
    date.getFullYear() !== Number(y) ||
    date.getMonth() !== Number(m) - 1 ||
    date.getDate() !== Number(d)
  ) {
    throw new Error('실제로 존재하는 날짜를 입력하세요.');
  }
  return { y: Number(y), m: Number(m), d: Number(d) };
}

const ZODIAC = ['원숭이', '닭', '개', '돼지', '쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양'];

export interface AgeResult {
  fullAge: number; // 만 나이
  yearAge: number; // 연 나이 (기준연도 − 출생연도)
  daysLived: number; // 태어난 날부터 기준일까지 일수
  daysToNextBirthday: number; // 다음 생일까지 (0 = 오늘 생일)
  zodiac: string; // 띠
}

/**
 * @param birth 생년월일 YYYY-MM-DD
 * @param ref   기준일 YYYY-MM-DD (기본: 오늘)
 */
export function calcAge(birth: string, ref?: string): AgeResult {
  const b = parseYmd(birth);
  const refStr = ref ?? new Date().toISOString().slice(0, 10);
  const r = parseYmd(refStr);

  if (refStr < birth) throw new Error('기준일이 생년월일보다 뒤여야 합니다.');

  let fullAge = r.y - b.y;
  const beforeBirthday = r.m < b.m || (r.m === b.m && r.d < b.d);
  if (beforeBirthday) fullAge -= 1;

  // 다음 생일
  let nextBdayYear = r.y;
  if (r.m > b.m || (r.m === b.m && r.d >= b.d)) nextBdayYear += 1;
  const nextBday = `${nextBdayYear}-${String(b.m).padStart(2, '0')}-${String(b.d).padStart(2, '0')}`;
  const daysToNextBirthday = r.m === b.m && r.d === b.d ? 0 : daysBetween(refStr, nextBday);

  return {
    fullAge,
    yearAge: r.y - b.y,
    daysLived: daysBetween(birth, refStr),
    daysToNextBirthday,
    zodiac: ZODIAC[((b.y % 12) + 12) % 12],
  };
}
