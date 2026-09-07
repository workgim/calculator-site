/**
 * 시급 → 주휴수당 · 주급 · 월급 환산. 순수 함수. (docs/02-calculator-catalog.md 카테고리 A)
 *
 * 주휴수당: 1주 소정근로시간이 15시간 이상이고 개근하면, 유급 주휴가 발생한다.
 *   주휴시간 = min(1주 소정근로시간, 40) ÷ 40 × 8   (주 40시간 근무 시 8시간분)
 *   주휴수당 = 주휴시간 × 시급
 * 월 환산 = 주급 × (365 ÷ 7 ÷ 12) ≈ 주급 × 4.345
 *
 * 근거: 최저임금위원회, 근로기준법(주휴). 2026년 최저임금 10,320원.
 */
export const MINIMUM_WAGE = {
  year: 2026,
  hourly: 10_320,
  /** 월 환산액 (주 40시간, 월 209시간 기준) */
  monthly209: 2_156_880,
} as const;

const WEEKS_PER_MONTH = 365 / 7 / 12; // ≈ 4.345

export interface WageInput {
  /** 시급 (원) */
  hourly: number;
  /** 1주 소정근로시간 */
  weeklyHours: number;
}

export interface WageResult {
  hourly: number;
  weeklyHours: number;
  weeklyHolidayHours: number; // 주휴시간
  weeklyHolidayPay: number; // 주휴수당 (1주)
  weeklyPay: number; // 주급 (근로 + 주휴)
  monthlyPay: number; // 월급 환산
  belowMinimum: boolean; // 시급이 법정 최저임금 미만인지
  eligibleForHolidayPay: boolean; // 주 15시간 이상
}

const round = (n: number): number => Math.round(n);

export function calcWage(input: WageInput): WageResult {
  const { hourly, weeklyHours } = input;
  if (![hourly, weeklyHours].every(Number.isFinite)) throw new Error('숫자를 입력하세요.');
  if (hourly <= 0) throw new Error('시급을 입력하세요.');
  if (weeklyHours <= 0) throw new Error('1주 근무시간을 입력하세요.');
  if (weeklyHours > 168) throw new Error('1주 근무시간은 168시간을 넘을 수 없습니다.');

  const eligible = weeklyHours >= 15;
  const weeklyHolidayHours = eligible ? (Math.min(weeklyHours, 40) / 40) * 8 : 0;
  const weeklyHolidayPay = round(weeklyHolidayHours * hourly);
  const workPay = weeklyHours * hourly;
  const weeklyPay = round(workPay + weeklyHolidayPay);
  const monthlyPay = round(weeklyPay * WEEKS_PER_MONTH);

  return {
    hourly: round(hourly),
    weeklyHours,
    weeklyHolidayHours: Math.round(weeklyHolidayHours * 100) / 100,
    weeklyHolidayPay,
    weeklyPay,
    monthlyPay,
    belowMinimum: hourly < MINIMUM_WAGE.hourly,
    eligibleForHolidayPay: eligible,
  };
}
