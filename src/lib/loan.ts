/**
 * 대출 상환 계산. 순수 함수.
 * 3가지 상환 방식. (docs/02-calculator-catalog.md 카테고리 A — 표준 상환식)
 *  - equalPayment  원리금균등상환: 매달 갚는 금액(원금+이자)이 동일
 *  - equalPrincipal 원금균등상환: 매달 갚는 원금이 동일, 이자는 점점 줄어 총액이 감소
 *  - bullet        만기일시상환: 매달 이자만, 원금은 만기에 한 번에
 */
export type RepaymentType = 'equalPayment' | 'equalPrincipal' | 'bullet';

export interface LoanResult {
  type: RepaymentType;
  /** 매달 금액이 동일한 경우에만 값, 아니면 null */
  monthlyPayment: number | null;
  firstPayment: number; // 첫 회차 납입액
  lastPayment: number; // 마지막 회차 납입액
  totalInterest: number; // 총 이자
  totalPayment: number; // 총 상환액 (원금 + 총 이자)
}

const round = (n: number): number => Math.round(n);

/**
 * @param principal   대출 원금 (원)
 * @param annualRatePct 연이자율 (%)  예: 4.5
 * @param months      대출 기간 (개월)
 */
export function calcLoan(
  principal: number,
  annualRatePct: number,
  months: number,
  type: RepaymentType,
): LoanResult {
  if (![principal, annualRatePct, months].every(Number.isFinite)) {
    throw new Error('숫자를 입력하세요.');
  }
  if (principal <= 0) throw new Error('대출 원금은 0보다 커야 합니다.');
  if (annualRatePct < 0) throw new Error('이자율은 0 이상이어야 합니다.');
  if (!Number.isInteger(months) || months <= 0) {
    throw new Error('기간(개월)은 1 이상의 정수로 입력하세요.');
  }
  if (months > 600) throw new Error('기간은 600개월(50년) 이하로 입력하세요.');

  const r = annualRatePct / 100 / 12; // 월 이자율

  if (type === 'bullet') {
    const monthlyInterest = principal * r;
    const totalInterest = monthlyInterest * months;
    return {
      type,
      monthlyPayment: null,
      firstPayment: round(monthlyInterest),
      lastPayment: round(monthlyInterest + principal),
      totalInterest: round(totalInterest),
      totalPayment: round(principal + totalInterest),
    };
  }

  if (type === 'equalPrincipal') {
    const principalPart = principal / months;
    let totalInterest = 0;
    let firstPayment = 0;
    let lastPayment = 0;
    for (let i = 0; i < months; i++) {
      const remaining = principal - principalPart * i;
      const interest = remaining * r;
      totalInterest += interest;
      const pay = principalPart + interest;
      if (i === 0) firstPayment = pay;
      if (i === months - 1) lastPayment = pay;
    }
    return {
      type,
      monthlyPayment: null,
      firstPayment: round(firstPayment),
      lastPayment: round(lastPayment),
      totalInterest: round(totalInterest),
      totalPayment: round(principal + totalInterest),
    };
  }

  // equalPayment (원리금균등)
  const payment =
    r === 0 ? principal / months : (principal * r * (1 + r) ** months) / ((1 + r) ** months - 1);
  const totalPayment = payment * months;
  return {
    type,
    monthlyPayment: round(payment),
    firstPayment: round(payment),
    lastPayment: round(payment),
    totalInterest: round(totalPayment - principal),
    totalPayment: round(totalPayment),
  };
}
