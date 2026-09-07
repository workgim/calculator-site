/**
 * 숫자 표시/파싱 유틸. 순수 함수.
 * 금액 입력칸의 "세 자리 콤마" 표시와, 그 값을 다시 숫자로 되돌릴 때 쓴다.
 */

/** "1,234,567" · "1234567원" · " 1 234 567 " → 1234567. 유효 숫자가 없으면 NaN */
export function parseAmount(text: string | number): number {
  if (typeof text === 'number') return text;
  const cleaned = text.replace(/[^\d.-]/g, '');
  if (cleaned === '' || cleaned === '-' || cleaned === '.') return NaN;
  return Number(cleaned);
}

/** 1234567 → "1,234,567" (정수부에만 콤마, 소수부·부호는 유지) */
export function formatThousands(value: number | string): string {
  const s = typeof value === 'number' ? String(value) : value;
  const negative = s.trim().startsWith('-');
  const [intPart = '', decPart] = s.replace('-', '').split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return (negative ? '-' : '') + grouped + (decPart != null ? '.' + decPart : '');
}

/** 스텝 버튼 라벨: 10000 → "1만", 10000000 → "1000만", 100000000 → "1억" */
export function moneyStepLabel(n: number): string {
  if (n >= 100_000_000 && n % 100_000_000 === 0) return `${n / 100_000_000}억`;
  if (n >= 10_000 && n % 10_000 === 0) return `${n / 10_000}만`;
  return formatThousands(n);
}
