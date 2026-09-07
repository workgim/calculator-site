/**
 * 부동산 취득세 계산 (주택 유상취득 · 개인 · 1주택 기준). 순수 함수.
 * (docs/02-calculator-catalog.md 카테고리 E)
 *
 * ⚠️ 다주택자·법인·증여·상속·분양권/오피스텔·조정대상지역 중과는 반영하지 않는다.
 *    1세대 1주택 유상취득(매매)의 기본 세율만 계산한다.
 *
 * 취득세율 (취득가액 기준):
 *  - 6억 이하        : 1%
 *  - 6억 초과 9억 이하 : (가액(억) × 2 / 3 − 3) %  (1% ~ 3% 선형)
 *  - 9억 초과        : 3%
 * 지방교육세 = 과세표준 × (취득세율 × 50%) × 20%  = 과세표준 × 취득세율 × 0.1
 * 농어촌특별세 = 전용면적 85㎡ 초과 시 과세표준 × 0.2% (85㎡ 이하 비과세)
 *
 * 근거: 지방세법, 위택스 취득세 안내.
 */
export interface AcquisitionTaxInput {
  /** 취득가액 (원) */
  price: number;
  /** 전용면적 85㎡ 초과 여부 */
  over85: boolean;
}

export interface AcquisitionTaxResult {
  ratePct: number; // 취득세율 (%)
  acquisitionTax: number;
  localEducationTax: number; // 지방교육세
  ruralTax: number; // 농어촌특별세
  total: number;
}

const round = (n: number): number => Math.round(n);

/** 6~9억 구간 세율 (소수 4째자리 반올림) */
function midRatePct(price: number): number {
  const eok = price / 100_000_000;
  const r = (eok * 2) / 3 - 3;
  return Math.round(r * 10_000) / 10_000;
}

export function calcAcquisitionTax(input: AcquisitionTaxInput): AcquisitionTaxResult {
  const { price, over85 } = input;
  if (!Number.isFinite(price)) throw new Error('취득가액을 숫자로 입력하세요.');
  if (price <= 0) throw new Error('취득가액은 0보다 커야 합니다.');

  let ratePct: number;
  if (price <= 600_000_000) ratePct = 1;
  else if (price <= 900_000_000) ratePct = midRatePct(price);
  else ratePct = 3;

  const acquisitionTax = round((price * ratePct) / 100);
  const localEducationTax = round(((price * ratePct) / 100) * 0.1);
  const ruralTax = over85 ? round(price * 0.002) : 0;

  return {
    ratePct,
    acquisitionTax,
    localEducationTax,
    ruralTax,
    total: acquisitionTax + localEducationTax + ruralTax,
  };
}
