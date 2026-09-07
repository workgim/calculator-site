/**
 * 연봉 → 월 실수령액 계산. 순수 함수.
 *
 * ⚠️ 요율·세액표는 2026년 기준이다. 매년 1월(4대보험 요율)과 매년 7월(국민연금 기준소득월액)에
 *    아래 SALARY_RATES 를 확인·갱신한다. (docs/02-calculator-catalog.md 의 "요율·세액 상수 관리")
 *
 * ⚠️ 실제 원천징수 세액은 국세청 「근로소득 간이세액표」를 따른다. 이 함수의 소득세는
 *    간이세액표를 재현한 것이 아니라 연간 세액을 산출해 12로 나눈 근사값이다.
 *    (연말정산에서 정산되므로 최종 세부담과는 다르다.)
 *
 * 근거:
 *  - 국민연금 9.5%(근로자 4.75%), 기준소득월액 상한 6,370,000 / 하한 400,000 — 국민연금공단, 2026
 *  - 건강보험 7.19%(근로자 3.595%) — 보건복지부 2026년 고시
 *  - 장기요양보험료 = 건강보험료 × 13.14% — 보건복지부 2026년 고시
 *  - 고용보험(실업급여) 근로자 0.9% — 고용노동부
 *  - 근로소득공제 · 종합소득세율 · 근로소득세액공제 — 소득세법(2023 개정, 2026년 유효)
 *  - 8~20세 자녀 세액공제(간이세액표 반영, 2026.3 지급분~) — 국세청
 */

export const SALARY_RATES = {
  year: 2026,
  /** 매년 7월 갱신 */
  nationalPensionReviewedUntil: '2026-06',
  nationalPension: {
    employeeRate: 0.0475,
    baseMin: 400_000,
    baseMax: 6_370_000,
  },
  healthInsurance: {
    employeeRate: 0.03595,
  },
  longTermCare: {
    /** 건강보험료(근로자분) 대비 비율 */
    rateOfHealth: 0.1314,
  },
  employmentInsurance: {
    employeeRate: 0.009,
  },
} as const;

/** 근로소득공제 (총급여 구간별). 공제 한도 2,000만원. */
function earnedIncomeDeduction(gross: number): number {
  let d: number;
  if (gross <= 5_000_000) d = gross * 0.7;
  else if (gross <= 15_000_000) d = 3_500_000 + (gross - 5_000_000) * 0.4;
  else if (gross <= 45_000_000) d = 7_500_000 + (gross - 15_000_000) * 0.15;
  else if (gross <= 100_000_000) d = 12_000_000 + (gross - 45_000_000) * 0.05;
  else d = 14_750_000 + (gross - 100_000_000) * 0.02;
  return Math.min(d, 20_000_000);
}

/** 종합소득 산출세액 (누진공제 방식). 2023 개정 세율. */
function progressiveTax(base: number): number {
  if (base <= 0) return 0;
  const brackets: Array<[ceil: number, rate: number, deduct: number]> = [
    [14_000_000, 0.06, 0],
    [50_000_000, 0.15, 1_260_000],
    [88_000_000, 0.24, 5_760_000],
    [150_000_000, 0.35, 15_440_000],
    [300_000_000, 0.38, 19_940_000],
    [500_000_000, 0.4, 25_940_000],
    [1_000_000_000, 0.42, 35_940_000],
    [Number.POSITIVE_INFINITY, 0.45, 65_940_000],
  ];
  for (const [ceil, rate, deduct] of brackets) {
    if (base <= ceil) return base * rate - deduct;
  }
  return 0;
}

/** 근로소득세액공제 (산출세액·총급여 기준 한도 적용) */
function earnedIncomeTaxCredit(calculatedTax: number, gross: number): number {
  const credit =
    calculatedTax <= 1_300_000
      ? calculatedTax * 0.55
      : 715_000 + (calculatedTax - 1_300_000) * 0.3;

  let cap: number;
  if (gross <= 33_000_000) cap = 740_000;
  else if (gross <= 70_000_000) cap = Math.max(660_000, 740_000 - (gross - 33_000_000) * 0.008);
  else if (gross <= 120_000_000) cap = Math.max(500_000, 660_000 - (gross - 70_000_000) * 0.5);
  else cap = Math.max(200_000, 500_000 - (gross - 120_000_000) * 0.25);

  return Math.min(credit, cap);
}

/** 8~20세 자녀 세액공제 (간이세액표 반영분). 월 공제액을 연으로 환산. */
function childTaxCreditAnnual(children: number): number {
  const monthly = [0, 20_830, 45_830, 79_160, 112_490];
  const m = children <= 4 ? monthly[children] : monthly[4] + (children - 4) * 33_330;
  return m * 12;
}

export interface SalaryInput {
  /** 연봉 (원, 세전) */
  annualSalary: number;
  /** 월 비과세액 (원). 기본 200,000 (식대 등) */
  monthlyNonTax?: number;
  /** 부양가족 수 (본인 포함). 기본 1 */
  dependents?: number;
  /** 8~20세 자녀 수 (자녀 세액공제용). 기본 0 */
  childrenForCredit?: number;
  /** 원천징수 비율 0.8 | 1.0 | 1.2. 기본 1.0 */
  withholdingRate?: number;
}

export interface SalaryResult {
  monthlyGross: number; // 월 세전 (연봉 / 12)
  nationalPension: number; // 국민연금
  healthInsurance: number; // 건강보험
  longTermCare: number; // 장기요양보험
  employmentInsurance: number; // 고용보험
  incomeTax: number; // 근로소득세 (간이세액표 근사)
  localIncomeTax: number; // 지방소득세
  totalDeduction: number; // 공제 합계
  monthlyNet: number; // 월 실수령액
  annualNet: number; // 연 실수령액 (월 실수령액 × 12)
}

const round = (n: number): number => Math.round(n);

export function calcSalary(input: SalaryInput): SalaryResult {
  const {
    annualSalary,
    monthlyNonTax = 200_000,
    dependents = 1,
    childrenForCredit = 0,
    withholdingRate = 1.0,
  } = input;

  if (!Number.isFinite(annualSalary) || annualSalary <= 0) {
    throw new Error('연봉을 0보다 큰 숫자로 입력하세요.');
  }
  if (!Number.isFinite(monthlyNonTax) || monthlyNonTax < 0) {
    throw new Error('비과세액은 0 이상으로 입력하세요.');
  }
  if (!Number.isInteger(dependents) || dependents < 1) {
    throw new Error('부양가족 수는 본인 포함 1명 이상이어야 합니다.');
  }
  if (!Number.isInteger(childrenForCredit) || childrenForCredit < 0) {
    throw new Error('자녀 수는 0 이상의 정수로 입력하세요.');
  }
  if (![0.8, 1.0, 1.2].includes(withholdingRate)) {
    throw new Error('원천징수 비율은 80%, 100%, 120% 중에서 선택하세요.');
  }

  const monthlyGross = annualSalary / 12;
  const monthlyTaxable = Math.max(0, monthlyGross - monthlyNonTax);

  // ── 4대보험 (근로자 부담분) ──
  const R = SALARY_RATES;
  const pensionBase = Math.min(
    Math.max(monthlyTaxable, R.nationalPension.baseMin),
    R.nationalPension.baseMax,
  );
  const nationalPension = round(pensionBase * R.nationalPension.employeeRate);
  const healthInsurance = round(monthlyTaxable * R.healthInsurance.employeeRate);
  const longTermCare = round(healthInsurance * R.longTermCare.rateOfHealth);
  const employmentInsurance = round(monthlyTaxable * R.employmentInsurance.employeeRate);

  // ── 근로소득세 (간이세액표 근사: 연간 결정세액 ÷ 12) ──
  const annualGross = Math.max(0, annualSalary - monthlyNonTax * 12);
  const earnedIncome = annualGross - earnedIncomeDeduction(annualGross); // 근로소득금액
  const personalDeduction = 1_500_000 * dependents; // 인적공제(기본공제)
  const pensionDeduction = nationalPension * 12; // 연금보험료 소득공제
  const taxBase = Math.max(0, earnedIncome - personalDeduction - pensionDeduction);
  const calculatedTax = progressiveTax(taxBase);
  const taxCredit = earnedIncomeTaxCredit(calculatedTax, annualGross);
  const annualIncomeTax = Math.max(
    0,
    calculatedTax - taxCredit - childTaxCreditAnnual(childrenForCredit),
  );
  const incomeTax = round((annualIncomeTax / 12) * withholdingRate);
  const localIncomeTax = round(incomeTax * 0.1);

  const totalDeduction =
    nationalPension +
    healthInsurance +
    longTermCare +
    employmentInsurance +
    incomeTax +
    localIncomeTax;
  const monthlyNet = round(monthlyGross - totalDeduction);

  return {
    monthlyGross: round(monthlyGross),
    nationalPension,
    healthInsurance,
    longTermCare,
    employmentInsurance,
    incomeTax,
    localIncomeTax,
    totalDeduction: round(totalDeduction),
    monthlyNet,
    annualNet: monthlyNet * 12,
  };
}
