/**
 * 기초대사량(BMR)과 하루 권장 칼로리(TDEE) 계산. 순수 함수.
 * (docs/02-calculator-catalog.md 카테고리 B)
 *
 * BMR: Mifflin-St Jeor 공식 (현재 가장 널리 쓰임)
 *   남: 10×체중(kg) + 6.25×키(cm) − 5×나이 + 5
 *   여: 10×체중(kg) + 6.25×키(cm) − 5×나이 − 161
 * TDEE = BMR × 활동계수(PAL)
 *
 * 근거: Mifflin MD, St Jeor ST (1990). 활동계수는 일반적으로 통용되는 값.
 */
export type Sex = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';

export const ACTIVITY_FACTOR: Record<ActivityLevel, number> = {
  sedentary: 1.2, // 거의 운동 안 함 (좌식 생활)
  light: 1.375, // 가벼운 운동 주 1~3회
  moderate: 1.55, // 보통 운동 주 3~5회
  active: 1.725, // 활발한 운동 주 6~7회
  veryActive: 1.9, // 매우 활발 (육체노동/선수)
};

export interface BmrInput {
  sex: Sex;
  age: number; // 만 나이
  heightCm: number;
  weightKg: number;
  activity: ActivityLevel;
}

export interface BmrResult {
  bmr: number; // 기초대사량 (kcal/일)
  tdee: number; // 활동대사량 = 유지 칼로리 (kcal/일)
  loseWeight: number; // 감량 목표 (유지 − 500)
  gainWeight: number; // 증량 목표 (유지 + 500)
}

const round = (n: number): number => Math.round(n);

export function calcBmr(input: BmrInput): BmrResult {
  const { sex, age, heightCm, weightKg, activity } = input;

  if (![age, heightCm, weightKg].every(Number.isFinite)) {
    throw new Error('숫자를 입력하세요.');
  }
  if (age < 1 || age > 120) throw new Error('나이는 1~120 범위로 입력하세요.');
  if (heightCm < 50 || heightCm > 300) throw new Error('키는 50~300cm 범위로 입력하세요.');
  if (weightKg < 2 || weightKg > 500) throw new Error('몸무게는 2~500kg 범위로 입력하세요.');
  if (!(activity in ACTIVITY_FACTOR)) throw new Error('활동 수준을 선택하세요.');

  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  const bmr = base + (sex === 'male' ? 5 : -161);
  const tdee = bmr * ACTIVITY_FACTOR[activity];

  return {
    bmr: round(bmr),
    tdee: round(tdee),
    loseWeight: round(tdee - 500),
    gainWeight: round(tdee + 500),
  };
}
