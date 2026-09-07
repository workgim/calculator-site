/**
 * 계산기 입력칸 향상 (브라우저에서 실행).
 *  1) input[data-money] : 입력하는 대로 세 자리 콤마 표시
 *  2) .stepper button[data-step] : 대상 입력값을 일정량만큼 증가 / 지우기
 *
 * 여러 번 호출해도 한 번만 적용된다(idempotent).
 */
import { formatThousands, parseAmount } from '../lib/format';

let applied = false;

export function enhanceInputs(): void {
  if (applied) return;
  applied = true;

  // 1) 금액 입력칸 콤마 자동 포맷
  document.querySelectorAll<HTMLInputElement>('input[data-money]').forEach((input) => {
    const reformat = () => {
      const caretFromEnd = input.value.length - (input.selectionStart ?? input.value.length);
      const n = parseAmount(input.value);
      input.value = Number.isNaN(n) ? '' : formatThousands(Math.trunc(Math.abs(n)));
      const pos = Math.max(0, input.value.length - caretFromEnd);
      try {
        input.setSelectionRange(pos, pos);
      } catch {
        /* 일부 브라우저에서 text 외 타입은 setSelectionRange 불가 — 무시 */
      }
    };
    input.addEventListener('input', reformat);
    reformat();
  });

  // 2) 스텝 버튼
  document.querySelectorAll<HTMLButtonElement>('.stepper button[data-step]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target ?? '') as HTMLInputElement | null;
      if (!target) return;
      const isMoney = target.hasAttribute('data-money');

      if (btn.dataset.step === 'clear') {
        target.value = '';
      } else {
        const step = Number(btn.dataset.step);
        const current = isMoney ? parseAmount(target.value) : parseFloat(target.value);
        const base = Number.isNaN(current) ? 0 : current;
        let next = Math.round((base + step) * 1e6) / 1e6; // 부동소수 오차 보정

        const min = target.min !== '' ? Number(target.min) : null;
        const max = target.max !== '' ? Number(target.max) : null;
        if (min != null && next < min) next = min;
        if (max != null && next > max) next = max;

        target.value = isMoney ? formatThousands(Math.trunc(next)) : String(next);
      }

      target.dispatchEvent(new Event('input', { bubbles: true }));
      target.focus();
    });
  });
}
