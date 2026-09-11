import type { CategoryId } from './categories';

/**
 * 계산기 목록 = 사이트의 중심 데이터.
 * 홈 목록 카드 / 내비게이션 / sitemap / 관련 계산기 링크가 모두 이 배열을 참조한다.
 *
 * 계산기 추가 절차 (docs/11-folder-structure.md §4):
 *   1) src/lib/<slug>.ts        계산 함수 (+ <slug>.test.ts)
 *   2) src/pages/calc/<slug>.astro  화면
 *   3) 여기에 항목 한 개 추가
 */
export interface Calculator {
  /** URL 마지막 조각. /calc/<slug> */
  slug: string;
  /** 페이지 H1 · 목록 카드 제목 */
  title: string;
  /**
   * 검색결과용 제목. 있으면 <title> 에 그대로 쓰인다(사이트명 안 붙임).
   * 요율·세율이 매년 바뀌는 계산기만 "2026년" 표기. (docs/23-content-guide.md §1.7)
   */
  seoTitle?: string;
  /** 카드/리드에 쓰는 한 줄 소개 */
  shortDescription: string;
  /** <meta name="description"> 용. 1~2문장 (docs/23-content-guide.md Part 2) */
  description: string;
  category: CategoryId;
  /** Icon.astro 의 아이콘 이름 */
  icon: string;
  /** 함께 쓰면 좋은 계산기 slug (2~4개, 카테고리 교차 허용). 없으면 같은 카테고리 자동 링크. (docs/23-content-guide.md §1.6) */
  related?: string[];
  /** 이 페이지가 노리는 검색어 (docs/02-calculator-catalog.md) */
  keywords: string[];
  /** 최종 검토/갱신일 YYYY-MM-DD. sitemap 의 lastmod 로도 쓰인다 */
  updated: string;
}

export const CALCULATORS: Calculator[] = [
  {
    slug: 'bmi',
    icon: 'gauge',
    title: 'BMI 계산기',
    shortDescription: '키와 몸무게로 체질량지수(BMI)와 비만도를 계산합니다.',
    description:
      '키와 몸무게를 입력하면 BMI(체질량지수)와 비만도 분류를 계산합니다. 아시아-태평양 기준 저체중·정상·과체중·비만 판정과 결과 해석을 제공합니다.',
    category: 'health',
    related: ['bmr'],
    keywords: ['bmi 계산기', '비만도 계산', '체질량지수', '표준체중'],
    updated: '2026-09-07',
  },
  {
    slug: 'percentage',
    icon: 'percent',
    title: '퍼센트 계산기',
    shortDescription: '전체의 몇 %, 비율, 증가율·감소율을 한 번에 계산합니다.',
    description:
      'A의 B%, A는 B의 몇 %, 증가율·감소율, 할인율을 계산합니다. 50000원의 20%, 할인가 계산 등 예시를 제공합니다.',
    category: 'living',
    related: ['vat', 'loan'],
    keywords: ['퍼센트 계산기', '% 계산', '비율 계산', '증가율 계산'],
    updated: '2026-09-08',
  },
  {
    slug: 'salary-net',
    icon: 'wallet',
    title: '연봉 실수령액 계산기',
    seoTitle: '연봉 실수령액 계산기 | 2026년 월급 실수령액',
    shortDescription: '세전 연봉에서 4대보험과 세금을 공제한 월·연 실수령액을 계산합니다.',
    description:
      '2026년 기준 세전 연봉을 입력하면 국민연금·건강보험·고용보험과 소득세를 공제한 월 실수령액과 연 실수령액을 계산합니다. 연봉 3000·4000·5000만원 실수령액 표를 제공합니다.',
    category: 'finance',
    related: ['hourly-wage', 'severance-pay', 'loan', 'savings'],
    keywords: ['연봉 실수령액', '월급 실수령액 계산기', '실수령액 계산기', '세후 월급'],
    updated: '2026-09-07',
  },
  {
    slug: 'hourly-wage',
    icon: 'clock',
    title: '시급·주휴수당 계산기',
    seoTitle: '주휴수당 계산기 | 2026년 시급·근무시간별 주휴수당',
    shortDescription: '시급과 1주 근무시간으로 주휴수당·주급·월급 환산액을 계산합니다.',
    description:
      '시급과 1주 근무시간을 입력하면 주휴수당, 주급, 월급 환산액을 계산합니다. 2026년 최저임금 10,320원 기준이며 주 15·20·40시간 주휴수당 예시를 제공합니다.',
    category: 'finance',
    related: ['salary-net', 'severance-pay'],
    keywords: ['주휴수당 계산기', '최저시급 계산', '시급 계산기', '주급 월급 환산'],
    updated: '2026-09-07',
  },
  {
    slug: 'broker-fee',
    icon: 'handshake',
    title: '부동산 중개보수(복비) 계산기',
    seoTitle: '부동산 중개보수 계산기 | 매매·전세·월세 복비',
    shortDescription: '매매·전세·월세 거래금액으로 법정 중개보수 상한액을 계산합니다.',
    description:
      '매매·전세·월세 거래금액을 입력하면 공인중개사법 상한요율에 따른 중개보수(복비) 상한액을 계산합니다. 매매 3·5·10억, 전세 1·3·5억 복비 표를 제공합니다.',
    category: 'realestate',
    related: ['acquisition-tax', 'pyeong', 'loan'],
    keywords: ['부동산 복비 계산기', '중개수수료 계산', '중개보수 요율', '전세 복비'],
    updated: '2026-09-07',
  },
  {
    slug: 'acquisition-tax',
    icon: 'landmark',
    title: '취득세 계산기',
    seoTitle: '취득세 계산기 | 2026년 주택 취득세·지방교육세',
    shortDescription: '주택 취득가액으로 취득세·지방교육세·농특세와 합계를 계산합니다.',
    description:
      '1세대 1주택 유상취득 기준 취득가액을 입력하면 취득세율(1~3%), 지방교육세, 농어촌특별세와 총 납부액을 계산합니다. 3·5·7·10억 주택 취득세 표를 제공합니다.',
    category: 'realestate',
    related: ['broker-fee', 'pyeong', 'loan'],
    keywords: ['취득세 계산기', '부동산 취득세율', '주택 취득세', '취득세 지방교육세'],
    updated: '2026-09-07',
  },
  {
    slug: 'date-add',
    icon: 'calendar-days',
    title: '날짜 계산기',
    shortDescription: '기준일에 년·개월·주·일을 더하거나 빼서 결과 날짜와 요일을 계산합니다.',
    description:
      '기준일에 년·개월·주·일을 더하거나 빼면 결과 날짜와 요일, 기준일로부터의 일수를 계산합니다. 며칠 후·몇 주 후·몇 개월 후 날짜를 구할 수 있습니다.',
    category: 'date',
    related: ['dday', 'age'],
    keywords: ['날짜 계산기', '며칠 후 날짜', '날짜 더하기', '몇 주 후 날짜'],
    updated: '2026-09-08',
  },
  {
    slug: 'pyeong',
    icon: 'ruler',
    title: '평 ↔ 제곱미터 변환기',
    seoTitle: '평수 계산기 | 평 ↔ 제곱미터(㎡) 변환',
    shortDescription: '평과 제곱미터(㎡)를 서로 변환합니다. 1평 ≈ 3.3058㎡.',
    description:
      '평을 제곱미터로, 제곱미터를 평으로 변환합니다. 1평 = 3.3058㎡. 59㎡·84㎡·114㎡ 몇 평인지, 25평·34평 몇 ㎡인지 변환표를 제공합니다.',
    category: 'living',
    related: ['broker-fee', 'acquisition-tax'],
    keywords: ['평수 계산기', '평 제곱미터 변환', '㎡ 평 변환', '평 계산'],
    updated: '2026-09-07',
  },
  {
    slug: 'char-count',
    icon: 'type',
    title: '글자 수 세기',
    seoTitle: '글자수 세기 | 공백 포함·제외·바이트 계산',
    shortDescription: '공백 포함/제외 글자 수와 UTF-8·EUC-KR 바이트를 실시간으로 셉니다.',
    description:
      '입력하는 즉시 공백 포함·제외 글자 수, UTF-8·EUC-KR 바이트, 단어·줄 수를 셉니다. 자기소개서·블로그 글자수 제한 확인에 사용하세요.',
    category: 'living',
    keywords: ['글자수 세기', '자소서 글자수', '바이트 계산', '글자 수 계산기'],
    updated: '2026-09-08',
  },
  {
    slug: 'bmr',
    icon: 'flame',
    title: '기초대사량·권장 칼로리 계산기',
    seoTitle: '기초대사량 계산기 | BMR·하루 권장 칼로리(TDEE)',
    shortDescription: '성별·나이·체중·활동량으로 기초대사량(BMR)과 하루 권장 칼로리를 계산합니다.',
    description:
      '성별·나이·키·몸무게·활동량을 입력하면 Mifflin-St Jeor 공식으로 기초대사량(BMR)과 하루 유지·감량·증량 칼로리를 계산합니다.',
    category: 'health',
    related: ['bmi'],
    keywords: ['기초대사량 계산기', 'bmr 계산', '하루 권장 칼로리', '유지 칼로리 계산'],
    updated: '2026-09-07',
  },
  {
    slug: 'age',
    icon: 'cake',
    title: '만 나이 계산기',
    shortDescription: '생년월일로 만 나이, 연 나이, 다음 생일까지 남은 일수를 계산합니다.',
    description:
      '생년월일을 입력하면 만 나이, 연 나이, 다음 생일까지 남은 일수, 태어난 지 며칠째인지, 띠를 계산합니다. 2023년 만 나이 통일 기준입니다.',
    category: 'date',
    related: ['dday', 'date-add'],
    keywords: ['만나이 계산기', '만 나이', '나이 계산', '연 나이'],
    updated: '2026-09-08',
  },
  {
    slug: 'vat',
    icon: 'receipt',
    title: '부가가치세(VAT) 계산기',
    seoTitle: '부가세 계산기 | 부가가치세 포함·별도 금액 계산',
    shortDescription: '공급가액·합계금액·부가세액 중 하나만 넣으면 나머지를 계산합니다.',
    description:
      '공급가액·합계금액·부가세액 중 하나만 입력하면 나머지를 계산합니다. 부가세 10% 포함 금액에서 공급가액 역산, 금액별 부가세 표를 제공합니다.',
    category: 'finance',
    related: ['salary-net', 'percentage'],
    keywords: ['부가세 계산기', '부가가치세 계산', '공급가액 계산', '부가세 포함 계산'],
    updated: '2026-09-07',
  },
  {
    slug: 'dday',
    icon: 'hourglass',
    title: 'D-day 계산기',
    shortDescription: '목표 날짜까지 남은 일수, 시작일부터 며칠째, 두 날짜 사이 일수를 계산합니다.',
    description:
      '목표 날짜까지 남은 일수(D-day), 시작일부터 며칠째(100일 등), 두 날짜 사이 일수를 계산합니다. 시험·기념일·여행·전역 등에 활용하세요.',
    category: 'date',
    related: ['date-add', 'age'],
    keywords: ['디데이 계산기', 'd-day 계산', '날짜 계산기', '100일 계산기'],
    updated: '2026-09-08',
  },
  {
    slug: 'savings',
    icon: 'piggy-bank',
    title: '예금·적금 이자 계산기',
    seoTitle: '예금·적금 이자 계산기 | 세전·세후 만기 수령액',
    shortDescription: '예금·적금의 만기 이자와 이자소득세를 뗀 세후 수령액을 계산합니다.',
    description:
      '예금(거치식) 또는 적금(정기적립)의 원금·금리·기간을 입력하면 단리·월복리 방식별 세전 이자, 이자소득세(15.4%), 세후 만기 수령액을 계산합니다.',
    category: 'finance',
    related: ['loan', 'salary-net'],
    keywords: ['적금 이자 계산기', '예금 이자 계산기', '만기 수령액', '적금 계산기'],
    updated: '2026-09-07',
  },
  {
    slug: 'severance-pay',
    icon: 'briefcase',
    title: '퇴직금 계산기',
    seoTitle: '퇴직금 계산기 | 평균임금 기준 퇴직금 예상액',
    shortDescription: '입사일·퇴사일과 퇴직 전 3개월 임금으로 법정 퇴직금을 계산합니다.',
    description:
      '입사일·퇴사일과 퇴직 전 3개월 임금을 입력하면 1일 평균임금과 법정 퇴직금(세전)을 계산합니다. 근속 1·3·5·10년 퇴직금 예시를 제공합니다.',
    category: 'finance',
    related: ['salary-net', 'hourly-wage'],
    keywords: ['퇴직금 계산기', '퇴직금 계산 방법', '평균임금 계산', '법정 퇴직금'],
    updated: '2026-09-07',
  },
  {
    slug: 'loan',
    icon: 'hand-coins',
    title: '대출 이자 계산기',
    seoTitle: '대출 이자 계산기 | 원리금균등·원금균등 월 상환액',
    shortDescription: '원리금균등·원금균등·만기일시 상환 방식별 월 상환액과 총 이자를 계산합니다.',
    description:
      '대출 원금·금리·기간을 입력하면 원리금균등상환, 원금균등상환, 만기일시상환 방식별 월 상환액과 총 이자를 비교합니다. 5천만·1억·2억·3억 대출 예시를 제공합니다.',
    category: 'finance',
    related: ['salary-net', 'savings'],
    keywords: ['대출이자 계산기', '원리금균등상환', '원금균등상환', '대출 상환 계산기'],
    updated: '2026-09-07',
  },
];

export const getCalculatorsByCategory = (id: CategoryId): Calculator[] =>
  CALCULATORS.filter((c) => c.category === id);

export const getCalculator = (slug: string): Calculator | undefined =>
  CALCULATORS.find((c) => c.slug === slug);

/** 큐레이션된 관련 계산기. related 가 없으면 같은 카테고리로 폴백. */
export const getRelated = (calc: Calculator, limit = 4): Calculator[] => {
  if (calc.related?.length) {
    return calc.related
      .map((s) => getCalculator(s))
      .filter((c): c is Calculator => c !== undefined)
      .slice(0, limit);
  }
  return getCalculatorsByCategory(calc.category)
    .filter((c) => c.slug !== calc.slug)
    .slice(0, limit);
};
