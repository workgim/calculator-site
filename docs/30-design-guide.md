# 30. 디자인 가이드

- 최종 수정일: 2026-09-07
- 관련: [12-page-structure.md](./12-page-structure.md), [10-tech-stack.md](./10-tech-stack.md)

이 문서는 디자인 "결정"을 **토큰(값)** 으로 고정한다.
색·글자·여백을 매번 감으로 정하지 않고, 여기 값을 `src/styles/global.css`의 CSS 변수로 옮겨 쓴다.
디자인을 바꾸려면 **이 문서를 고치고 `global.css` 변수만 바꾼다.**

---

## 1. 디자인 원칙

1. **계산이 주인공.** 화면을 열면 입력창과 [계산] 버튼이 먼저 보인다. 장식은 최소.
2. **빠르게.** 웹폰트·이미지·애니메이션을 아껴 로딩과 반응 속도를 지킨다([20-seo-google.md](./20-seo-google.md) §6).
3. **읽기 쉽게.** 본문 16px 이상, 충분한 줄간격, 좁은 본문 폭.
4. **모바일 먼저.** 좁은 화면 기준으로 만들고 넓은 화면에서 여백·단을 늘린다.
5. **광고와 콘텐츠를 구분.** 광고 영역은 "광고" 라벨 + 배경/여백으로 본문과 시각적으로 분리(§9).
6. **일관성.** 버튼·입력창·카드는 어느 페이지든 같은 모양.
7. **접근성은 기본값.** 명도 대비, 포커스 표시, 라벨 연결은 선택이 아니라 규칙(§8).

---

## 2. 색상 토큰

역할 기반으로 이름 짓는다(`--color-primary`처럼). 특정 색 이름(`--blue`)으로 짓지 않는다.
다크 모드는 1차 범위 밖이지만, 변수 구조를 지금 잡아두면 나중에 값만 추가하면 된다.

### 라이트 (기본)

| 변수 | 값 | 용도 |
|------|-----|------|
| `--color-bg` | `#ffffff` | 페이지 배경 |
| `--color-surface` | `#f7f8fa` | 카드·결과 박스 배경 |
| `--color-surface-2` | `#eef0f3` | 입력창 배경, 구분된 영역 |
| `--color-border` | `#e3e6ea` | 테두리·구분선 |
| `--color-text` | `#1a1d21` | 본문 글자 |
| `--color-text-muted` | `#5b6470` | 보조 설명, 캡션 (흰 배경 대비 약 5.6:1) |
| `--color-primary` | `#2563eb` | 주요 버튼, 링크, 강조 (흰 배경 대비 약 4.9:1) |
| `--color-primary-hover` | `#1d4ed8` | 주요 버튼 hover |
| `--color-primary-contrast` | `#ffffff` | primary 위 글자색 |
| `--color-success` | `#15803d` | 정상 결과 강조 |
| `--color-warning` | `#b45309` | 주의 문구 |
| `--color-danger` | `#b91c1c` | 입력 오류 메시지 |
| `--color-focus-ring` | `#2563eb` | 키보드 포커스 윤곽 |
| `--color-ad-bg` | `#f0f2f5` | 광고 영역 배경(본문과 구분) |

> 대비 참고: `--color-primary`(#2563eb)와 `--color-text-muted`(#5b6470)는 흰 배경에서 각각 약 4.9:1, 5.6:1로 본문 기준(4.5:1)을 통과한다. 색을 바꾸면 §8 기준으로 다시 검증한다.

### 다크 (나중에 값 채움 — 구조만)

| 변수 | 예정 값(초안) |
|------|---------------|
| `--color-bg` | `#0f1216` |
| `--color-surface` | `#171b21` |
| `--color-surface-2` | `#1f242c` |
| `--color-border` | `#2a303a` |
| `--color-text` | `#e6e9ee` |
| `--color-text-muted` | `#9aa4b2` |
| `--color-primary` | `#3b82f6` |
| `--color-primary-hover` | `#60a5fa` |
| `--color-primary-contrast` | `#0f1216` |

적용 방식(나중): `@media (prefers-color-scheme: dark)` 또는 `<html data-theme="dark">`에서 위 변수만 재정의.

---

## 3. 타이포그래피

### 글꼴

웹폰트를 받지 않고 **시스템 폰트**를 쓴다(로딩 0, CLS 0).

```
--font-sans:
  -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
  "Apple SD Gothic Neo", "Malgun Gothic", "맑은 고딕",
  "Helvetica Neue", Arial, sans-serif;
--font-mono:
  "SFMono-Regular", Consolas, "D2Coding", "Liberation Mono", Menlo, monospace;
```

- 숫자 결과 표시에는 `--font-mono` 또는 `font-variant-numeric: tabular-nums`(자릿수 정렬).
- 나중에 브랜드 폰트(예: Pretendard)를 쓰고 싶으면 CDN에서 `font-display: swap`으로. 그 전까진 도입 보류.

### 크기 스케일 (기준 16px)

| 변수 | 값 | 용도 |
|------|-----|------|
| `--fs-xs` | `0.8125rem` (13px) | 캡션, 라벨 보조 |
| `--fs-sm` | `0.875rem` (14px) | 보조 텍스트 |
| `--fs-base` | `1rem` (16px) | **본문 기본** |
| `--fs-lg` | `1.125rem` (18px) | 리드 문장 |
| `--fs-xl` | `1.375rem` (22px) | h3 |
| `--fs-2xl` | `1.75rem` (28px) | h2 |
| `--fs-3xl` | `2.25rem` (36px) | h1 (모바일에선 `--fs-2xl`로 줄임) |

### 굵기 · 줄간격 · 자간

| 변수 | 값 |
|------|-----|
| `--fw-regular` | `400` |
| `--fw-medium` | `500` |
| `--fw-bold` | `700` |
| `--lh-body` | `1.6` (본문) |
| `--lh-heading` | `1.25` (제목) |
| 본문 최대 폭 | `--measure: 42rem;` (한 줄이 너무 길지 않게) |

---

## 4. 여백 스케일 (4px 기반)

간격은 아래 값에서만 고른다. 임의의 `13px` 같은 값 금지.

| 변수 | 값 | 대략 용도 |
|------|-----|-----------|
| `--space-1` | `0.25rem` (4px) | 아이콘-텍스트 간격 |
| `--space-2` | `0.5rem` (8px) | 요소 안쪽 여백(작게) |
| `--space-3` | `0.75rem` (12px) | 입력창 안쪽 여백 |
| `--space-4` | `1rem` (16px) | 기본 간격 |
| `--space-5` | `1.5rem` (24px) | 문단·섹션 사이 |
| `--space-6` | `2rem` (32px) | 섹션 사이(큼) |
| `--space-8` | `3rem` (48px) | 페이지 상하 여백 |
| `--space-10` | `4rem` (64px) | 큰 구획 분리 |

---

## 5. 레이아웃

| 변수 / 값 | 내용 |
|-----------|------|
| `--container-narrow: 45rem` (720px) | 계산기·글 페이지 본문 폭 |
| `--container-wide: 68rem` (1088px) | 홈, (나중) 사이드바 있는 레이아웃 |
| 좌우 최소 여백 | 모바일 `--space-4`, 데스크톱 `--space-6` |
| 그리드 | 홈 카드: 모바일 1열 → `--bp-md` 2열 → `--bp-lg` 3열 (CSS Grid `auto-fill, minmax(16rem, 1fr)`) |

### 브레이크포인트

모바일 우선. 아래 지점에서 `min-width` 미디어쿼리로 넓힌다.

| 변수 | 값 | 기준 |
|------|-----|------|
| `--bp-sm` | `30rem` (480px) | 큰 폰 |
| `--bp-md` | `48rem` (768px) | 태블릿 / 2열 시작 |
| `--bp-lg` | `64rem` (1024px) | 데스크톱 / 3열, 사이드바 가능 |
| `--bp-xl` | `80rem` (1280px) | 넓은 데스크톱 (컨테이너 고정, 여백만 증가) |

> CSS 변수는 미디어쿼리 조건에는 못 쓴다. 위 값은 **문서상의 기준**이고, `@media (min-width: 48rem)`처럼 직접 적는다. 한곳에서 관리하려면 SCSS나 PostCSS 도입 시 변수화.

---

## 6. 컴포넌트 스타일 규칙

| 요소 | 규칙 |
|------|------|
| **버튼(주요)** | 배경 `--color-primary`, 글자 `--color-primary-contrast`, 안쪽 여백 `--space-3 --space-5`, 모서리 `--radius-md`, hover 시 `--color-primary-hover`, 높이 최소 44px |
| **버튼(보조)** | 배경 투명, 테두리 `--color-border`, 글자 `--color-text` |
| **입력창** | 배경 `--color-surface-2`(또는 흰색 + 테두리), 테두리 `--color-border`, 안쪽 여백 `--space-3`, 모서리 `--radius-sm`, 글자 `--fs-base`(16px 미만이면 모바일 자동 확대됨 → 16px 유지), 포커스 시 `--color-focus-ring` 윤곽 |
| **라벨** | 입력창 위에 블록으로, `--fs-sm`, `--fw-medium`, `for`/`id`로 연결 |
| **결과 박스** | 배경 `--color-surface`, 테두리 `--color-border`, 안쪽 여백 `--space-4`, 결과 숫자는 `--fs-2xl` + tabular-nums |
| **카드(홈)** | 배경 `--color-bg`, 테두리 `--color-border`, 모서리 `--radius-md`, 안쪽 여백 `--space-4`, hover 시 그림자 `--shadow-md`, 카드 전체가 링크 |
| **표** | 헤더 배경 `--color-surface`, 행 구분선 `--color-border`, 가로 넘치면 `overflow-x:auto` 래퍼 |
| **링크(본문)** | `--color-primary`, 밑줄. 방문 후에도 색 유지(구분 불필요) |
| **에러 메시지** | `--color-danger`, `--fs-sm`, 입력창 아래 |

### 계산기 폼 공통 클래스 (`global.css` 에 정의, `.astro` 는 클래스만 사용)

| 클래스 | 용도 |
|--------|------|
| `.calc-box` | 입력 영역을 감싸는 카드 (`--color-surface` 배경, `--radius-md`) |
| `.calc-field` | 라벨 + 입력 한 묶음. 아래 여백 `--space-4` (마지막은 0) |
| `.calc-row` | 한 줄에 입력 2개 이상 (flex, 각 칸 `flex: 1 1 8rem`) |
| `.calc-hint` | 입력 아래 작은 설명. `--fs-xs`, `--color-text-muted` |
| `.calc-result` | 결과 박스. 안에 `<dl>`(항목/값) 지원 — 값은 오른쪽 정렬 + tabular-nums |
| `.calc-error` | 빨간 오류 문구. `--color-danger`, `--fs-sm` |
| `.stepper` | 빠른 증감 버튼 줄. 버튼은 알약형(`--radius-full`), 최소 높이 36px, `--color-primary` 글자. `.stepper__clear`(C 버튼)는 `--color-text-muted` + 오른쪽 정렬 |
| `.faq details / summary / .faq__a` | 자주 묻는 질문 아코디언(`<details>`). 테두리 `--radius-sm`, summary 오른쪽에 +/− 표시, 답변은 `--color-text-muted`. `<Faq>` 컴포넌트가 사용 (docs/23-content-guide.md §1.5) |

### 모서리 / 그림자 / 테두리

| 변수 | 값 |
|------|-----|
| `--radius-sm` | `6px` (입력창, 작은 요소) |
| `--radius-md` | `10px` (버튼, 카드) |
| `--radius-lg` | `16px` (큰 패널) |
| `--radius-full` | `9999px` (뱃지, 알약형) |
| `--border-width` | `1px` |
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,.06)` |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,.08)` |

### 아이콘

- 인라인 SVG만 사용(아이콘 폰트·외부 요청 금지). `currentColor`로 색 상속.
- 크기: 텍스트 옆 16px 또는 20px. `aria-hidden="true"` (의미 없는 장식일 때).

### 모션

- 기본 트랜지션: `--transition: 150ms ease;` (색·그림자 정도만).
- `@media (prefers-reduced-motion: reduce)`에서 애니메이션 제거.
- 스크롤 연동 애니메이션·큰 이동 효과는 쓰지 않는다(성능·CLS).

---

## 7. 아이콘·이미지·OG

| 항목 | 규칙 |
|------|------|
| favicon | `public/favicon.svg` 1개(단색, 단순 형태) |
| 기본 OG 이미지 | `public/images/og-default.png`, 1200×630, 사이트명 + 짧은 문구 |
| 본문 이미지 | 되도록 안 씀. 쓰면 `width`/`height` 지정 + `loading="lazy"` + `alt` |
| 일러스트/사진 | 1차 없음. 필요하면 라이선스 확인된 것만 |

---

## 8. 접근성 최소 기준 (규칙, 선택 아님)

- **명도 대비**: 본문 텍스트/배경 4.5:1 이상, 큰 텍스트·UI 요소 3:1 이상. (§2 색상은 이 기준으로 골랐음. 색 바꾸면 재검증 — WebAIM Contrast Checker)
- **포커스 표시**: 키보드 `Tab` 이동 시 `--color-focus-ring` 윤곽이 보여야 함. `outline: none`만 주고 대체 안 하는 것 금지.
- **터치 타겟**: 주요 버튼·링크 최소 44×44px. (예외: `.stepper` 의 빠른 증감 버튼은 보조 조작이라 36px — 주 입력과 [계산] 버튼은 44px 유지)
- **라벨 연결**: 모든 `<input>`에 연결된 `<label>`. placeholder는 라벨 대체 불가.
- **색만으로 정보 전달 금지**: 오류를 빨간색"만"으로 표시하지 말고 텍스트도 함께.
- **의미 있는 마크업**: 버튼은 `<button>`, 링크는 `<a>`. `<div onclick>` 금지.
- **이미지 대체텍스트**: 정보 전달용은 `alt` 작성, 장식용은 `alt=""`.
- 자세한 규칙은 나중에 `32-accessibility.md`로 분리.

---

## 9. 광고 영역 스타일 규칙

실제 광고는 나중(`41-ads-adsense.md`)이지만, 자리(`AdSlot`)의 겉모양은 지금 정한다.

- 광고 블록 위에 `광고` 또는 `Sponsored` 라벨 — `--fs-xs`, `--color-text-muted`.
- 배경 `--color-ad-bg` 또는 위아래 구분선으로 **본문과 분리**.
- 위아래 여백 `--space-6`.
- **높이를 미리 확보**(예: `min-height`)해서 광고 로드 시 레이아웃이 밀리지 않게(CLS 방지).
- 본문 첫 화면(스크롤 전)에 광고가 콘텐츠보다 크게 차지하지 않게. 계산기 입력창이 항상 먼저 보이도록.
- 위치는 [12-page-structure.md](./12-page-structure.md)에 정의: 헤더 아래 / 계산 결과 아래 / 푸터 위.

---

## 10. 구현 매핑

| 이 문서의 내용 | 코드 위치 |
|----------------|-----------|
| §2 색상, §3 타이포, §4 여백, §5 컨테이너, §6 모서리·그림자 변수 | `src/styles/global.css`의 `:root { ... }` |
| 기본 요소 스타일(body, a, h1~h3, input, button, table) | `src/styles/global.css` |
| §6 계산기 폼 공통 클래스(`.calc-box`/`.calc-field`/`.calc-row`/`.calc-hint`/`.calc-result`/`.calc-error`) + `.stepper` | `src/styles/global.css` (하단) |
| 컴포넌트별 세부 스타일 | 각 `.astro` 파일의 `<style>` (토큰 변수만 사용, 하드코딩 값 금지) |
| 금액 입력 UI(콤마·증감 버튼) | `src/components/AmountInput.astro` + `src/scripts/enhance-inputs.ts` |
| 브레이크포인트 수치 | 각 미디어쿼리에 직접(`48rem` 등). 기준값은 이 문서 §5 |
| 다크 모드 | (나중) `global.css`의 `@media (prefers-color-scheme: dark)` 블록 |

> 원칙: `.astro` 파일 안에서 색·간격을 **숫자로 직접 쓰지 않는다.** 항상 `var(--...)`.
> 새 값이 필요하면 먼저 이 문서에 토큰을 추가하고 `global.css`에 정의한 뒤 쓴다.

---

## 11. 변경 이력

| 날짜 | 변경 내용 |
|------|-----------|
| 2026-09-07 | 최초 작성. 색/타이포/여백/레이아웃/컴포넌트/접근성/광고영역 토큰 정의. 시스템 폰트 사용, 다크모드는 구조만 |
| 2026-09-07 | 구현 반영: §6 계산기 폼 공통 클래스 + `.stepper`(빠른 증감 버튼, 36px 예외) 추가, §10 매핑에 `enhance-inputs.ts`·`AmountInput.astro` |
