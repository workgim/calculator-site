/**
 * 평 ↔ 제곱미터(㎡) 변환. 순수 함수. (docs/02-calculator-catalog.md 카테고리 D)
 * 1평 = 400/121 ㎡ ≈ 3.3058 ㎡ (한국 관습 단위)
 */
export const SQM_PER_PYEONG = 400 / 121;

const round = (n: number, digits = 2): number => {
  const f = 10 ** digits;
  return Math.round(n * f) / f;
};

function assertPositive(n: number): void {
  if (!Number.isFinite(n)) throw new Error('숫자를 입력하세요.');
  if (n < 0) throw new Error('면적은 0보다 작을 수 없습니다.');
}

/** 평 → ㎡ */
export function pyeongToSqm(pyeong: number): number {
  assertPositive(pyeong);
  return round(pyeong * SQM_PER_PYEONG);
}

/** ㎡ → 평 */
export function sqmToPyeong(sqm: number): number {
  assertPositive(sqm);
  return round(sqm / SQM_PER_PYEONG);
}

export interface PyeongResult {
  pyeong: number;
  sqm: number;
}

/** 한쪽 값을 넣으면 양쪽을 반환 */
export function convertArea(value: number, unit: 'pyeong' | 'sqm'): PyeongResult {
  assertPositive(value);
  if (unit === 'pyeong') {
    return { pyeong: round(value), sqm: pyeongToSqm(value) };
  }
  return { pyeong: sqmToPyeong(value), sqm: round(value) };
}
