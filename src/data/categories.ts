/**
 * 계산기 카테고리 정의. (docs/02-calculator-catalog.md 의 카테고리 A~F 중 1차 사용분)
 * 새 카테고리가 필요하면 여기에 추가한다.
 */
export type CategoryId = 'finance' | 'health' | 'date' | 'living';

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  { id: 'finance', name: '금융·세금', description: '연봉·대출·세금 계산' },
  { id: 'health', name: '건강', description: '체중·칼로리 등 건강 지표' },
  { id: 'date', name: '날짜·시간', description: '만 나이·D-day·날짜 계산' },
  { id: 'living', name: '생활·단위', description: '단위 변환·비율·생활 계산' },
];

export const getCategory = (id: CategoryId): Category | undefined =>
  CATEGORIES.find((c) => c.id === id);
