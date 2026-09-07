/**
 * 법정 퇴직금 계산. 순수 함수. (docs/02-calculator-catalog.md 카테고리 A)
 *
 * 퇴직금 = 1일 평균임금 × 30 × (재직일수 / 365)
 *
 * 1일 평균임금 = (퇴직 전 3개월 임금총액 + 상여금·연차수당 안분액) / 그 3개월의 총 일수
 *  - 3개월 임금총액 = (월 기본급 + 월 고정수당) × 3
 *  - 상여금 안분  = 연간 상여금 총액 × (3 / 12)
 *  - 연차수당 안분 = 퇴직 전 1년간 연차수당 × (3 / 12)
 *
 * 근거: 근로자퇴직급여 보장법, 고용노동부 퇴직금 계산 방법.
 * 참고: 평균임금이 통상임금보다 적으면 통상임금을 적용해야 하나(근로기준법), 본 계산기는
 *       평균임금 기준 개략값만 제공한다. 퇴직소득세는 포함하지 않는다(세전).
 */
import { daysBetween, addDays } from './dday';

export interface SeveranceInput {
  /** 입사일 YYYY-MM-DD */
  hireDate: string;
  /** 마지막 근무일 YYYY-MM-DD */
  leaveDate: string;
  monthlyBasePay: number;
  monthlyAllowance?: number;
  annualBonus?: number;
  annualLeaveAllowance?: number;
}

export interface SeveranceResult {
  tenureDays: number;
  tenureText: string; // "3년 2개월 15일"
  threeMonthDays: number;
  avgDailyWage: number;
  severancePay: number; // 세전
  /** 재직 1년 이상 여부 (미만이면 법정 퇴직금 미발생) */
  eligible: boolean;
}

const round = (n: number): number => Math.round(n);

function parseYmd(s: string): { y: number; m: number; d: number } {
  const match = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) throw new Error('날짜는 YYYY-MM-DD 형식으로 입력하세요.');
  return { y: +match[1], m: +match[2], d: +match[3] };
}

function daysInMonth(y: number, m: number): number {
  return new Date(y, m, 0).getDate(); // m: 1~12
}

/** from ~ to 의 연·월·일 차이 (to > from 가정) */
function ymdDiff(fromStr: string, toStr: string): { years: number; months: number; days: number } {
  const from = parseYmd(fromStr);
  const to = parseYmd(toStr);
  let years = to.y - from.y;
  let months = to.m - from.m;
  let days = to.d - from.d;
  if (days < 0) {
    months -= 1;
    const pm = to.m - 1 === 0 ? 12 : to.m - 1;
    const py = to.m - 1 === 0 ? to.y - 1 : to.y;
    days += daysInMonth(py, pm);
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

/** k개월 전 같은 날 (해당 월에 그 날이 없으면 말일로 보정) */
function monthsAgo(y: number, m: number, d: number, k: number): string {
  let ny = y;
  let nm = m - k;
  while (nm <= 0) {
    nm += 12;
    ny -= 1;
  }
  const nd = Math.min(d, daysInMonth(ny, nm));
  return `${ny}-${String(nm).padStart(2, '0')}-${String(nd).padStart(2, '0')}`;
}

/** 퇴사일 이전(포함) 3개월의 달력 일수 */
function threeMonthCalendarDays(leaveDate: string): number {
  const { y, m, d } = parseYmd(leaveDate);
  const start = addDays(monthsAgo(y, m, d, 3), 1);
  return daysBetween(start, leaveDate) + 1;
}

export function calcSeverance(input: SeveranceInput): SeveranceResult {
  const {
    hireDate,
    leaveDate,
    monthlyBasePay,
    monthlyAllowance = 0,
    annualBonus = 0,
    annualLeaveAllowance = 0,
  } = input;

  const nums = [monthlyBasePay, monthlyAllowance, annualBonus, annualLeaveAllowance];
  if (!nums.every(Number.isFinite)) throw new Error('금액을 숫자로 입력하세요.');
  if (nums.some((n) => n < 0)) throw new Error('금액은 0보다 작을 수 없습니다.');
  if (monthlyBasePay <= 0) throw new Error('월 기본급을 입력하세요.');

  if (leaveDate < hireDate) throw new Error('퇴사일이 입사일보다 뒤여야 합니다.');

  // 퇴직일 = 마지막 근무일 다음 날
  const quitDate = addDays(leaveDate, 1);
  const tenureDays = daysBetween(hireDate, quitDate);
  if (tenureDays <= 0) throw new Error('퇴사일이 입사일보다 뒤여야 합니다.');

  const threeMonthDays = threeMonthCalendarDays(leaveDate);
  const wages3mo = (monthlyBasePay + monthlyAllowance) * 3;
  const bonusPortion = annualBonus * (3 / 12);
  const leavePortion = annualLeaveAllowance * (3 / 12);
  const avgDailyWage = (wages3mo + bonusPortion + leavePortion) / threeMonthDays;

  const severancePay = avgDailyWage * 30 * (tenureDays / 365);

  const { years, months, days } = ymdDiff(hireDate, quitDate);

  return {
    tenureDays,
    tenureText: `${years}년 ${months}개월 ${days}일`,
    threeMonthDays,
    avgDailyWage: round(avgDailyWage),
    severancePay: round(severancePay),
    eligible: tenureDays >= 365,
  };
}
