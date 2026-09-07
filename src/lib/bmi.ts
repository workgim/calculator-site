/**
 * BMI(체질량지수) 계산. 화면과 무관한 순수 함수. (docs/11-folder-structure.md §4)
 *
 * 공식: BMI = 몸무게(kg) / 키(m)^2
 * 분류: 대한비만학회 아시아-태평양 기준 (docs/02-calculator-catalog.md 카테고리 B)
 */
export type BmiCategory = '저체중' | '정상' | '과체중' | '비만 1단계' | '비만 2단계' | '비만 3단계';

export interface BmiResult {
  bmi: number; // 소수 첫째 자리로 반올림
  category: BmiCategory;
}

/** 아시아-태평양 기준 경계값 */
function classify(bmi: number): BmiCategory {
  if (bmi < 18.5) return '저체중';
  if (bmi < 23) return '정상';
  if (bmi < 25) return '과체중';
  if (bmi < 30) return '비만 1단계';
  if (bmi < 35) return '비만 2단계';
  return '비만 3단계';
}

/**
 * @param heightCm 키 (cm)
 * @param weightKg 몸무게 (kg)
 * @throws 입력이 유효하지 않으면 Error
 */
export function calcBmi(heightCm: number, weightKg: number): BmiResult {
  if (!Number.isFinite(heightCm) || !Number.isFinite(weightKg)) {
    throw new Error('키와 몸무게를 숫자로 입력하세요.');
  }
  if (heightCm <= 0 || weightKg <= 0) {
    throw new Error('키와 몸무게는 0보다 커야 합니다.');
  }
  if (heightCm < 50 || heightCm > 300) {
    throw new Error('키는 50~300cm 범위로 입력하세요.');
  }
  if (weightKg < 2 || weightKg > 500) {
    throw new Error('몸무게는 2~500kg 범위로 입력하세요.');
  }

  const heightM = heightCm / 100;
  const raw = weightKg / (heightM * heightM);
  const bmi = Math.round(raw * 10) / 10;

  return { bmi, category: classify(bmi) };
}
