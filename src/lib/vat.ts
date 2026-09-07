/**
 * 부가가치세(VAT) 계산. 화면과 무관한 순수 함수.
 * 대한민국 일반 세율 10%. (docs/02-calculator-catalog.md 카테고리 A / 국세청)
 *
 * 세 방향으로 계산한다:
 *  - 공급가액 → 세액·합계
 *  - 합계(공급가액+세액) → 공급가액·세액 (역산)
 *  - 세액 → 공급가액·합계 (역산)
 */
export const VAT_RATE = 0.1;

export type VatBasis = 'supply' | 'total' | 'vat';

export interface VatBreakdown {
  supply: number; // 공급가액
  vat: number; // 부가세액
  total: number; // 합계금액
}

function assertAmount(n: number): void {
  if (!Number.isFinite(n)) throw new Error('금액을 숫자로 입력하세요.');
  if (n < 0) throw new Error('금액은 0보다 작을 수 없습니다.');
}

const round = (n: number): number => Math.round(n);

export function calcVat(amount: number, basis: VatBasis): VatBreakdown {
  assertAmount(amount);

  if (basis === 'supply') {
    const supply = round(amount);
    const vat = round(amount * VAT_RATE);
    return { supply, vat, total: supply + vat };
  }

  if (basis === 'total') {
    const total = round(amount);
    const supply = round(amount / (1 + VAT_RATE));
    return { supply, vat: total - supply, total };
  }

  // basis === 'vat'
  const vat = round(amount);
  const supply = round(amount / VAT_RATE);
  return { supply, vat, total: supply + vat };
}
