import type { CategoryId } from './categories';

/**
 * 계산기 목록 = 사이트의 중심 데이터.
 * 홈 목록 카드 / 내비게이션 / sitemap / 관련 계산기 링크가 모두 이 배열을 참조한다.
 *
 * 계산기 추가 절차 (docs/11-folder-structure.md §4):
 *   1) src/lib/<slug>.ts        계산 함수
 *   2) src/pages/calc/<slug>.astro  화면
 *   3) 여기에 항목 한 개 추가
 */
export interface Calculator {
  /** URL 마지막 조각. /calc/<slug> */
  slug: string;
  /** 페이지 H1 · 목록 카드 제목 */
  title: string;
  /** 카드/리드에 쓰는 한 줄 소개 */
  shortDescription: string;
  /** <meta name="description"> 용. 1~2문장 (docs/20-seo-google.md §2) */
  description: string;
  category: CategoryId;
  /** 이 페이지가 노리는 검색어 (docs/02-calculator-catalog.md) */
  keywords: string[];
  /** 최종 검토/갱신일 YYYY-MM-DD. sitemap 의 lastmod 로도 쓰인다 */
  updated: string;
}

export const CALCULATORS: Calculator[] = [
  {
    slug: 'bmi',
    title: 'BMI 계산기',
    shortDescription: '키와 몸무게로 체질량지수(BMI)와 비만도를 계산합니다.',
    description:
      '키와 몸무게를 입력하면 BMI(체질량지수)와 비만도 분류를 바로 확인할 수 있는 무료 계산기입니다. 아시아-태평양 기준으로 저체중·정상·과체중·비만을 구분합니다.',
    category: 'health',
    keywords: ['bmi 계산기', '비만도 계산', '체질량지수', '표준체중'],
    updated: '2026-09-07',
  },
  {
    slug: 'percentage',
    title: '퍼센트 계산기',
    shortDescription: '전체의 몇 %, 비율, 증가율·감소율을 한 번에 계산합니다.',
    description:
      'A의 B%는 얼마인지, A는 B의 몇 %인지, 두 값 사이의 증감률은 몇 %인지 세 가지 기본 백분율 계산을 처리하는 무료 퍼센트 계산기입니다.',
    category: 'living',
    keywords: ['퍼센트 계산기', '% 계산', '비율 계산', '증가율 계산'],
    updated: '2026-09-07',
  },
  {
    slug: 'salary-net',
    title: '연봉 실수령액 계산기',
    shortDescription: '세전 연봉에서 4대보험과 세금을 공제한 월·연 실수령액을 계산합니다.',
    description:
      '세전 연봉을 입력하면 국민연금·건강보험·장기요양·고용보험과 근로소득세·지방소득세를 공제한 2026년 기준 월 실수령액과 연 실수령액을 계산하는 무료 계산기입니다.',
    category: 'finance',
    keywords: ['연봉 실수령액', '월급 실수령액 계산기', '실수령액 계산기', '세후 월급'],
    updated: '2026-09-07',
  },
  {
    slug: 'vat',
    title: '부가가치세(VAT) 계산기',
    shortDescription: '공급가액·합계금액·부가세액 중 하나만 넣으면 나머지를 계산합니다.',
    description:
      '공급가액에서 부가세(10%)와 합계금액을, 또는 부가세 포함 합계금액에서 공급가액을 역산하는 무료 부가가치세 계산기입니다.',
    category: 'finance',
    keywords: ['부가세 계산기', '부가가치세 계산', '공급가액 계산', '부가세 포함 계산'],
    updated: '2026-09-07',
  },
  {
    slug: 'dday',
    title: 'D-day 계산기',
    shortDescription: '목표 날짜까지 남은 일수, 시작일부터 며칠째, 두 날짜 사이 일수를 계산합니다.',
    description:
      '기념일·시험일 등 목표 날짜까지 남은 D-day, 사귄 지 며칠째(100일 등), 두 날짜 사이의 일수를 계산하는 무료 날짜 계산기입니다.',
    category: 'date',
    keywords: ['디데이 계산기', 'd-day 계산', '날짜 계산기', '100일 계산기'],
    updated: '2026-09-07',
  },
  {
    slug: 'savings',
    title: '예금·적금 이자 계산기',
    shortDescription: '예금·적금의 만기 이자와 이자소득세를 뗀 세후 수령액을 계산합니다.',
    description:
      '예금(거치식) 또는 적금(정기적립)의 원금·연이율·기간을 입력하면 단리·월복리 방식별 세전 이자, 이자소득세(15.4% 등), 세후 만기 수령액을 계산하는 무료 계산기입니다.',
    category: 'finance',
    keywords: ['적금 이자 계산기', '예금 이자 계산기', '만기 수령액', '적금 계산기'],
    updated: '2026-09-07',
  },
  {
    slug: 'loan',
    title: '대출 이자 계산기',
    shortDescription: '원리금균등·원금균등·만기일시 상환 방식별 월 상환액과 총 이자를 계산합니다.',
    description:
      '대출 원금, 연이자율, 기간을 입력하면 원리금균등상환·원금균등상환·만기일시상환 방식별로 월 상환액, 총 이자, 총 상환액을 계산하는 무료 대출 계산기입니다.',
    category: 'finance',
    keywords: ['대출이자 계산기', '원리금균등상환', '원금균등상환', '대출 상환 계산기'],
    updated: '2026-09-07',
  },
];

export const getCalculatorsByCategory = (id: CategoryId): Calculator[] =>
  CALCULATORS.filter((c) => c.category === id);

export const getCalculator = (slug: string): Calculator | undefined =>
  CALCULATORS.find((c) => c.slug === slug);
