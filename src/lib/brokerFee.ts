/**
 * 부동산 중개보수(복비) 계산. 순수 함수. (docs/02-calculator-catalog.md 카테고리 E)
 *
 * 공인중개사법 시행규칙 별표1 의 **상한요율**(전국 기준, 2021-10-19 개정). 실제 보수는 이 한도
 * 안에서 협의한다. 시·도 조례로 세부가 다를 수 있다. 오피스텔·상가·토지는 요율이 다르다(주택만 대상).
 *
 * 거래금액 산정:
 *  - 매매: 매매가격
 *  - 전세: 전세보증금
 *  - 월세: 보증금 + 월세×100. 단 그 합이 5천만원 미만이면 보증금 + 월세×70.
 */
export type DealType = 'sale' | 'lease' | 'monthly';

interface Bracket {
  /** 이 금액 "미만" 까지 적용 */
  under: number;
  rate: number;
  /** 한도액(있으면 이 값을 넘지 못함) */
  cap: number | null;
}

export const BROKER_FEE_RATES = {
  updated: '2021-10-19',
  sale: [
    { under: 50_000_000, rate: 0.006, cap: 250_000 },
    { under: 200_000_000, rate: 0.005, cap: 800_000 },
    { under: 900_000_000, rate: 0.004, cap: null },
    { under: 1_200_000_000, rate: 0.005, cap: null },
    { under: 1_500_000_000, rate: 0.006, cap: null },
    { under: Number.POSITIVE_INFINITY, rate: 0.007, cap: null },
  ] as Bracket[],
  rent: [
    { under: 50_000_000, rate: 0.005, cap: 200_000 },
    { under: 100_000_000, rate: 0.004, cap: 300_000 },
    { under: 600_000_000, rate: 0.003, cap: null },
    { under: 1_200_000_000, rate: 0.004, cap: null },
    { under: 1_500_000_000, rate: 0.005, cap: null },
    { under: Number.POSITIVE_INFINITY, rate: 0.006, cap: null },
  ] as Bracket[],
} as const;

export interface BrokerFeeInput {
  dealType: DealType;
  /** 매매가 또는 전세보증금 */
  price?: number;
  /** 월세: 보증금 */
  deposit?: number;
  /** 월세: 월 차임 */
  monthlyRent?: number;
  /** 중개보수에 부가세 10% 더할지 (일반과세 중개사무소) */
  includeVat?: boolean;
}

export interface BrokerFeeResult {
  transactionAmount: number;
  ratePct: number;
  cap: number | null;
  fee: number; // 상한 (부가세 별도)
  vat: number;
  total: number;
}

const round = (n: number): number => Math.round(n);

export function calcBrokerFee(input: BrokerFeeInput): BrokerFeeResult {
  const { dealType, price = 0, deposit = 0, monthlyRent = 0, includeVat = false } = input;

  if (![price, deposit, monthlyRent].every(Number.isFinite)) {
    throw new Error('금액을 숫자로 입력하세요.');
  }
  if ([price, deposit, monthlyRent].some((n) => n < 0)) {
    throw new Error('금액은 0보다 작을 수 없습니다.');
  }

  let transactionAmount: number;
  if (dealType === 'monthly') {
    if (deposit + monthlyRent <= 0) throw new Error('보증금과 월세를 입력하세요.');
    const base = deposit + monthlyRent * 100;
    transactionAmount = base < 50_000_000 ? deposit + monthlyRent * 70 : base;
  } else {
    if (price <= 0) throw new Error('거래 금액을 입력하세요.');
    transactionAmount = price;
  }

  const table = dealType === 'sale' ? BROKER_FEE_RATES.sale : BROKER_FEE_RATES.rent;
  const bracket = table.find((b) => transactionAmount < b.under)!;

  let fee = transactionAmount * bracket.rate;
  if (bracket.cap != null) fee = Math.min(fee, bracket.cap);
  fee = round(fee);

  const vat = includeVat ? round(fee * 0.1) : 0;

  return {
    transactionAmount: round(transactionAmount),
    ratePct: Math.round(bracket.rate * 1000) / 10, // 부동소수 보정
    cap: bracket.cap,
    fee,
    vat,
    total: fee + vat,
  };
}
