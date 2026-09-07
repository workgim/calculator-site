/**
 * 예금·적금 이자 계산. 순수 함수. (docs/02-calculator-catalog.md 카테고리 A)
 *
 *  - deposit(예금·거치식): 원금을 한 번에 예치, 만기에 원금+이자
 *  - installment(적금·정기적립): 매월 같은 금액을 납입
 *  각각 단리 / 월복리 선택.
 *
 * 이자소득세: 일반과세 15.4%(소득세 14% + 지방소득세 1.4%), 세금우대 9.5%, 비과세 0%.
 */
export type SavingsType = 'deposit' | 'installment';
export type InterestMethod = 'simple' | 'compound'; // 단리 / 월복리
export type TaxType = 'normal' | 'preferential' | 'taxfree';

export const TAX_RATE: Record<TaxType, number> = {
  normal: 0.154,
  preferential: 0.095,
  taxfree: 0,
};

export interface SavingsInput {
  type: SavingsType;
  /** deposit: 예치 원금 / installment: 월 납입액 (원) */
  amount: number;
  /** 연이율 (%) 예: 3.5 */
  annualRatePct: number;
  /** 기간 (개월) */
  months: number;
  method: InterestMethod;
  tax: TaxType;
}

export interface SavingsResult {
  principal: number; // 총 납입 원금
  pretaxInterest: number; // 세전 이자
  tax: number; // 이자과세
  aftertaxInterest: number; // 세후 이자
  maturityAmount: number; // 세후 만기 수령액 (원금 + 세후 이자)
}

const round = (n: number): number => Math.round(n);

export function calcSavings(input: SavingsInput): SavingsResult {
  const { type, amount, annualRatePct, months, method, tax } = input;

  if (![amount, annualRatePct, months].every(Number.isFinite)) {
    throw new Error('숫자를 입력하세요.');
  }
  if (amount <= 0) throw new Error('금액은 0보다 커야 합니다.');
  if (annualRatePct < 0) throw new Error('이율은 0 이상이어야 합니다.');
  if (!Number.isInteger(months) || months <= 0) {
    throw new Error('기간(개월)은 1 이상의 정수로 입력하세요.');
  }
  if (months > 600) throw new Error('기간은 600개월 이하로 입력하세요.');
  if (!(tax in TAX_RATE)) throw new Error('과세 유형이 올바르지 않습니다.');

  const i = annualRatePct / 100 / 12; // 월이자율
  let principal: number;
  let pretaxInterest: number;

  if (type === 'deposit') {
    principal = amount;
    if (method === 'simple') {
      pretaxInterest = amount * (annualRatePct / 100) * (months / 12);
    } else {
      pretaxInterest = amount * ((1 + i) ** months - 1);
    }
  } else {
    // installment: 매월 amount 납입
    principal = amount * months;
    if (method === 'simple') {
      // k번째 납입금은 (months - k + 1)개월치 이자 → 합 = amount * i * n(n+1)/2
      pretaxInterest = amount * i * ((months * (months + 1)) / 2);
    } else {
      // 매월 초 납입, 월복리
      const maturity =
        i === 0
          ? amount * months
          : amount * (1 + i) * (((1 + i) ** months - 1) / i);
      pretaxInterest = maturity - principal;
    }
  }

  const taxAmount = pretaxInterest * TAX_RATE[tax];
  const aftertaxInterest = pretaxInterest - taxAmount;

  return {
    principal: round(principal),
    pretaxInterest: round(pretaxInterest),
    tax: round(taxAmount),
    aftertaxInterest: round(aftertaxInterest),
    maturityAmount: round(principal + aftertaxInterest),
  };
}
