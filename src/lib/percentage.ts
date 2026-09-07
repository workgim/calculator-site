/**
 * 기본 백분율 계산 3종. 순수 함수. (docs/02-calculator-catalog.md 카테고리 D)
 */

function assertFinite(...values: number[]): void {
  for (const v of values) {
    if (!Number.isFinite(v)) throw new Error('숫자를 입력하세요.');
  }
}

/** 반올림: 소수 최대 `digits` 자리 */
function round(value: number, digits = 2): number {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}

/** A의 B% 는 얼마인가?  → A * B / 100 */
export function percentOf(a: number, b: number): number {
  assertFinite(a, b);
  return round((a * b) / 100);
}

/** A 는 B 의 몇 % 인가?  → A / B * 100 */
export function whatPercent(a: number, b: number): number {
  assertFinite(a, b);
  if (b === 0) throw new Error('기준값(B)은 0이 될 수 없습니다.');
  return round((a / b) * 100);
}

/** old → new 증감률(%)  → (new - old) / |old| * 100 */
export function changeRate(oldValue: number, newValue: number): number {
  assertFinite(oldValue, newValue);
  if (oldValue === 0) throw new Error('처음 값은 0이 될 수 없습니다.');
  return round(((newValue - oldValue) / Math.abs(oldValue)) * 100);
}
