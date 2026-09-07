/**
 * 대출 상환 계산. 순수 함수.
 * 3가지 상환 방식 + 거치기간(이자만 내는 기간) 지원.
 * (docs/02-calculator-catalog.md 카테고리 A — 표준 상환식)
 *
 *  - equalPayment   원리금균등상환: 거치 후 매달 갚는 금액(원금+이자)이 동일
 *  - equalPrincipal 원금균등상환: 거치 후 매달 갚는 원금이 동일, 이자는 점점 감소
 *  - bullet         만기일시상환: 기간 내내 이자만, 원금은 만기에 일시 상환
 *                   (구조상 전체가 거치이므로 거치기간 입력은 무시)
 *
 * 거치기간(graceMonths): 그 기간 동안 원금 전액에 대한 이자만 납부하고,
 * 남은 (전체기간 − 거치기간) 동안 원금을 상환한다.
 */
export type RepaymentType = 'equalPayment' | 'equalPrincipal' | 'bullet';

export interface LoanResult {
  type: RepaymentType;
  graceMonths: number;
  /** 거치기간 중 매월 납입액(이자만). 거치기간이 없으면 null */
  gracePayment: number | null;
  /** 거치 후 매월 납입액이 동일하면 그 값(원리금균등), 아니면 null */
  monthlyPayment: number | null;
  /** 거치 후 첫 회차 납입액 (거치기간이 없으면 1회차) */
  firstPayment: number;
  /** 마지막 회차 납입액 */
  lastPayment: number;
  totalInterest: number; // 총 이자
  totalPayment: number; // 총 상환액 (원금 + 총 이자)
}

const round = (n: number): number => Math.round(n);

/**
 * @param principal     대출 원금 (원)
 * @param annualRatePct 연이자율 (%)  예: 4.5
 * @param months        전체 대출 기간 (개월)
 * @param type          상환 방식
 * @param graceMonths   거치기간 (개월). 기본 0. bullet 방식에서는 무시된다.
 */
export function calcLoan(
  principal: number,
  annualRatePct: number,
  months: number,
  type: RepaymentType,
  graceMonths = 0,
): LoanResult {
  if (![principal, annualRatePct, months, graceMonths].every(Number.isFinite)) {
    throw new Error('숫자를 입력하세요.');
  }
  if (principal <= 0) throw new Error('대출 원금은 0보다 커야 합니다.');
  if (annualRatePct < 0) throw new Error('이자율은 0 이상이어야 합니다.');
  if (!Number.isInteger(months) || months <= 0) {
    throw new Error('기간(개월)은 1 이상의 정수로 입력하세요.');
  }
  if (months > 600) throw new Error('기간은 600개월(50년) 이하로 입력하세요.');
  if (!Number.isInteger(graceMonths) || graceMonths < 0) {
    throw new Error('거치기간(개월)은 0 이상의 정수로 입력하세요.');
  }

  const r = annualRatePct / 100 / 12; // 월 이자율

  if (type === 'bullet') {
    // 만기일시상환: 전체가 이자만 납부 → 거치기간 개념이 이미 포함됨
    const monthlyInterest = principal * r;
    const totalInterest = monthlyInterest * months;
    return {
      type,
      graceMonths: 0,
      gracePayment: null,
      monthlyPayment: null,
      firstPayment: round(monthlyInterest),
      lastPayment: round(monthlyInterest + principal),
      totalInterest: round(totalInterest),
      totalPayment: round(principal + totalInterest),
    };
  }

  if (graceMonths >= months) {
    throw new Error('거치기간은 전체 기간보다 짧아야 합니다.');
  }

  const repayMonths = months - graceMonths; // 원금을 갚는 기간
  const graceInterest = principal * r * graceMonths; // 거치기간 동안 낸 이자 합계
  const gracePayment = graceMonths > 0 ? round(principal * r) : null;

  if (type === 'equalPrincipal') {
    const principalPart = principal / repayMonths;
    let repayInterest = 0;
    let firstPayment = 0;
    let lastPayment = 0;
    for (let i = 0; i < repayMonths; i++) {
      const remaining = principal - principalPart * i;
      const interest = remaining * r;
      repayInterest += interest;
      const pay = principalPart + interest;
      if (i === 0) firstPayment = pay;
      if (i === repayMonths - 1) lastPayment = pay;
    }
    const totalInterest = graceInterest + repayInterest;
    return {
      type,
      graceMonths,
      gracePayment,
      monthlyPayment: null,
      firstPayment: round(firstPayment),
      lastPayment: round(lastPayment),
      totalInterest: round(totalInterest),
      totalPayment: round(principal + totalInterest),
    };
  }

  // equalPayment (원리금균등) — 거치 후 repayMonths 동안 원금 전액을 균등 상환
  const payment =
    r === 0
      ? principal / repayMonths
      : (principal * r * (1 + r) ** repayMonths) / ((1 + r) ** repayMonths - 1);
  const repayTotal = payment * repayMonths;
  const totalInterest = graceInterest + (repayTotal - principal);
  return {
    type,
    graceMonths,
    gracePayment,
    monthlyPayment: round(payment),
    firstPayment: round(payment),
    lastPayment: round(payment),
    totalInterest: round(totalInterest),
    totalPayment: round(principal + totalInterest),
  };
}
