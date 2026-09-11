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
| `--color-page` | `#f2f3f5` | 페이지 캔버스(본문 배경). 카드·입력창·결과·표는 `--color-bg`로 그 위에 띄운다 |
| `--color-bg` | `#ffffff` | 올라온 표면: 카드·입력창·결과 박스·표 |
| `--color-surface` | `#f7f8fa` | 보조 표면: 표 헤더·짝수 행 줄무늬, FAQ 닫힘 |
| `--color-surface-2` | `#eef0f3` | 입력창 배경(대체), 더 눌린 영역 |
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
| `--color-primary-tint` | `#eef4ff` (다크 `#1a2942`) | primary 연한 배경 — 계산기 본문 섹션 번호 배지 등 |

**카테고리 색 (아이콘 배지)** — 각 카테고리에 `bg`(연한 배경)·`fg`(아이콘 색) 한 쌍. `IconBadge` 가 `data-cat=<id>` 로 선택. 라이트/다크 각각 정의(다크는 두 다크 블록에 함께).

| 카테고리 | 라이트 bg / fg | 다크 bg / fg |
|---|---|---|
| finance | `#eef4ff` / `#1d4ed8` | `#1a2942` / `#8fb6f9` |
| realestate | `#fff4ec` / `#c2410c` | `#39271b` / `#f0a476` |
| health | `#eafaf0` / `#15803d` | `#17291e` / `#63cc86` |
| date | `#f2effe` / `#6d28d9` | `#241f3c` / `#b096f2` |
| living | `#e8fafc` / `#0e7490` | `#123033` / `#4ac3ce` |

> 대비 참고: `--color-primary`(#2563eb)·`--color-text-muted`(#5b6470)는 흰 카드 위에서 약 4.9:1·5.6:1, 캔버스(#f2f3f5) 위에서 약 4.7:1·4.9:1로 모두 본문 기준(4.5:1)을 통과한다. 색을 바꾸면 §8 기준으로 다시 검증한다.

### 다크 (구현됨 — 2026-09-08)

`global.css` 상단에서 색 토큰만 재정의한다. `color-scheme: dark`도 같이 지정해 `<input type="date">` 등 네이티브 위젯도 어둡게.

- **모드 3가지**: 시스템(기본) / 라이트 / 다크. 헤더의 `ThemeToggle` 버튼이 `시스템 → 라이트 → 다크` 순환.
- `<html data-theme>` 없음 = 시스템 → `@media (prefers-color-scheme: dark)` 안의 `:root:not([data-theme])` 가 적용.
- `data-theme="dark"` = `:root[data-theme='dark']` 블록(같은 다크 토큰). `data-theme="light"` = `:root` 기본값이 라이트라 별도 블록 불필요.
- **다크 토큰 블록이 두 벌**(미디어쿼리용 + `[data-theme='dark']`용). 하나 고치면 다른 하나도 같이 고칠 것.
- 선택은 `localStorage['theme']`('light'|'dark', 시스템이면 키 삭제)에 저장. **FOUC 방지**: `BaseLayout` `<head>` 맨 앞 인라인 스크립트가 first paint 전에 `data-theme` 를 심는다.

| 변수 | 값 | 비고 |
|------|-----|------|
| `--color-page` | `#0f1216` | 캔버스(가장 어두움) |
| `--color-bg` | `#171b21` | 올라온 표면 |
| `--color-surface` | `#1e232b` | 보조 표면 |
| `--color-surface-2` | `#262c35` | |
| `--color-border` | `#2c333d` | |
| `--color-text` | `#e6e9ee` | |
| `--color-text-muted` | `#9aa4b2` | `#171b21` 대비 약 6.6:1 |
| `--color-primary` | `#5b9dff` | 링크·강조. 다크 표면 대비 약 6.4:1 |
| `--color-primary-hover` | `#7fb3ff` | |
| `--color-primary-contrast` | `#0b1524` | primary 버튼 위 글자 (약 7:1) |
| `--color-success` | `#48c774` | |
| `--color-warning` | `#d99a3d` | |
| `--color-danger` | `#f0777e` | |
| `--color-focus-ring` | `#5b9dff` | |
| `--color-ad-bg` | `#1b2027` | |
| `--shadow-sm` / `--shadow-md` | 알파 0.5 / 0.6 | 어두운 배경에서 그림자가 약해 alpha를 올림 |

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
| `--fs-xl` | `1.375rem` (22px) | h3, **계산기 본문 섹션 h2**(`.calc-content h2` — 섹션이 많아 전역 h2는 과함) |
| `--fs-2xl` | `1.75rem` (28px) | h2(데스크톱), h1(모바일) |
| `--fs-3xl` | `2.25rem` (36px) | h1(데스크톱) |

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
| `.calc-field` | 라벨 + 입력 한 묶음. 아래 여백 `--space-4`. 폼 안의 `[type=submit]` 버튼은 위에 `--space-2` 추가 여백(증감 버튼과 안 겹치게) |
| `.calc-row` | 한 줄에 입력 2개 이상 (flex, 각 칸 `flex: 1 1 8rem`) |
| `.calc-hint` | 입력 아래 작은 설명. `--fs-xs`, `--color-text-muted` |
| `.calc-result` | 결과 박스. 안에 `<dl>`(항목/값) 지원 — 값은 오른쪽 정렬 + tabular-nums |
| `.calc-error` | 빨간 오류 문구. `--color-danger`, `--fs-sm` |
| `.stepper` | 빠른 증감 버튼 줄. 버튼은 알약형(`--radius-full`), 최소 높이 36px, `--color-primary` 글자. `.stepper__clear`(C 버튼)는 `--color-text-muted` + 오른쪽 정렬 |
| `.faq details / summary / .faq__a` | 자주 묻는 질문 아코디언(`<details>`). 테두리 `--radius-sm`, summary 오른쪽에 +/− 표시, 답변은 `--color-text-muted`. `<Faq>` 컴포넌트가 사용 (docs/23-content-guide.md §1.5) |
| `.terms` | "계산에 사용되는 용어" 정의 목록(`<dl>`). 2열 그리드(용어/설명), 좁은 화면에서 1열. (docs/23-content-guide.md §Part2) |
| `.table-scroll` | 넓은 표를 감싸 가로 스크롤. `<table>` 을 `<div class="table-scroll">` 로 감쌈. 좌우 안쪽 경계 그림자(`--edge-fade`)로 스크롤 암시 |
| `.icon-badge` / `.icon-badge--sm` | 카테고리 색 둥근 사각 배지 + 아이콘. `IconBadge.astro` 가 사용, 색은 `[data-cat=<id>]` → `--cat-*` 토큰. 기본 2.25rem / sm 1.75rem |
| `.related__grid` / `.related-card` | 계산기 페이지 하단 "관련 계산기" — 아이콘 배지 + 제목 + 한 줄 설명의 2열 카드. `CalculatorLayout` 이 사용 |

### 내비게이션 드롭다운 (`Nav.astro`, 2026-09-11)

- 헤더의 각 카테고리는 `<button>` + `.nav__panel`(그 카테고리 계산기 목록 + "전체 보기" 링크).
- **데스크톱**: `:hover` 로 열림(버튼–패널 사이 `::before` 투명 다리로 hover 유지). **터치·키보드**: 버튼 클릭/Enter 로 `[data-open]` 토글, 바깥 클릭·Esc 로 닫힘(JS ~25줄). `aria-expanded`/`aria-controls`.
- 좁은 화면(`< 48rem`)은 `.nav__item` 을 `position: static` 으로 두고 패널을 내비 전체 폭으로. 넓은 화면은 오른쪽 끝 2개 카테고리만 패널 우측 정렬.
- 계산기·카테고리 아이콘 이름은 데이터에 있음: `calculators.ts` 의 `icon`, `categories.ts` 의 `icon`.

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
| `--edge-fade` | `rgba(0,0,0,.12)` (다크 `.55`) — 가로 스크롤 표 좌우 경계 그림자 |

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
| UI 아이콘 | `Icon.astro` — [Lucide](https://lucide.dev)(ISC) 아이콘의 path 데이터만 인라인. 24×24 viewBox, `stroke="currentColor" stroke-width="1.8"`. 외부 요청 0. 새 아이콘은 Lucide에서 `<svg>` 안쪽만 복사해 `PATHS` 에 추가. 계산기별 아이콘 이름은 `calculators.ts` 의 `icon`, 카테고리는 `categories.ts` 의 `icon` |
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
| 다크 모드 | `global.css` `:root` 바로 뒤: `@media (prefers-color-scheme: dark) :root:not([data-theme])` + `:root[data-theme='dark']` (색·shadow 토큰 두 벌) |
| 테마 토글 | `src/components/ThemeToggle.astro`(헤더, 시스템↔라이트↔다크 순환) + `BaseLayout` `<head>` 맨 앞 FOUC 방지 인라인 스크립트 + `global.css` `.theme-toggle` |
| 아이콘 | `src/components/Icon.astro`(Lucide path 맵) + `src/components/IconBadge.astro`(카테고리 색 배지). `global.css` `--cat-*` 토큰 + `.icon-badge` |
| 내비 드롭다운 | `src/components/Nav.astro` — 스코프 `<style>` + 스코프 `<script>`(약 25줄). §6 참고 |
| 표면 층위 | 캔버스 `--color-page`(body) → 카드 `--color-bg`(`.calc-box`·`.card`·`table`·`.calc-result`·`.faq details`) → 보조 `--color-surface`(표 헤더·줄무늬) |

> 원칙: `.astro` 파일 안에서 색·간격을 **숫자로 직접 쓰지 않는다.** 항상 `var(--...)`.
> 새 값이 필요하면 먼저 이 문서에 토큰을 추가하고 `global.css`에 정의한 뒤 쓴다.

---

## 11. 변경 이력

| 날짜 | 변경 내용 |
|------|-----------|
| 2026-09-07 | 최초 작성. 색/타이포/여백/레이아웃/컴포넌트/접근성/광고영역 토큰 정의. 시스템 폰트 사용, 다크모드는 구조만 |
| 2026-09-07 | 구현 반영: §6 계산기 폼 공통 클래스 + `.stepper`(빠른 증감 버튼, 36px 예외) 추가, §10 매핑에 `enhance-inputs.ts`·`AmountInput.astro` |
| 2026-09-08 | 디자인 보강("앱 느낌" 중간 강도): `--color-page` 캔버스 토큰 도입(body 회색, 카드는 흰색으로 띄움), `.calc-box`·`table`·카드에 그림자, `[계산하기]` 버튼 가로 꽉·48px·lg, 결과 박스 좌측 primary 라인, 표 짝수 행 줄무늬+`.table-scroll` 라운드 테두리, 본문 H2 얇은 밑줄, 헤더 그림자+로고 primary, 내비 알약 hover, 카드 제목 primary+호버 리프트. **다크 모드 구현**(prefers-color-scheme, 토큰만 재정의) |
| 2026-09-08 | 웹 내 테마 토글 추가: 헤더 `ThemeToggle`(시스템→라이트→다크), `<html data-theme>` + `localStorage`, `<head>` 인라인 스크립트로 FOUC 방지. 다크 토큰이 두 블록(미디어쿼리 + `[data-theme='dark']`)으로 중복됨 |
| 2026-09-08 | 마감 손질: 모바일에서 헤더 내비 가로 스크롤 한 줄(`.nav` shrink + `overflow-x`), `.table-scroll` 좌우 안쪽 경계 그림자(`--edge-fade` 토큰)로 스크롤 암시, `.calc-result` 강조 크기 분리(`dd strong`=2xl / 한 문장형 `>strong`=lg+primary), 홈 카테고리 구분선+여백 정리 |
| 2026-09-11 | **아이콘 시스템 + 내비 드롭다운 + 관련 계산기 카드화**: Lucide 기반 `Icon.astro`/`IconBadge.astro`, `calculators.ts`·`categories.ts` 에 `icon` 필드, `--cat-*` 카테고리 색 토큰(라이트+다크). 헤더 내비를 카테고리 드롭다운(데스크톱 hover / 터치·키보드 클릭)으로. 홈 카드·카테고리 제목·관련 계산기에 아이콘 배지. 관련 계산기 링크 목록 → 2열 미니 카드(`.related-card`) |
| 2026-09-11 | 후속 조정: 모바일 내비는 가로 스크롤 스트립 유지(드롭다운 패널은 `.nav__item` static 으로 클리핑 회피). 헤더를 `[로고+토글] 바 + 내비` 로 분리 — 토글이 로고와 같은 줄, 데스크톱은 `display:contents`+`order` 로 한 줄. 계산기 본문 섹션 h2 를 22px(`--fs-xl`)로 축소 + 위 여백 `--space-6` |
| 2026-09-11 | 계산기 본문 정리(레퍼런스 참고): 섹션마다 **번호 배지**(CSS counter, primary 통일색 `--color-primary-tint`) — `.calc-content > section:not(.faq) > h2::before`. 표: 헤더 `--fw-bold`, 첫 칸(항목명) 강조, 행 hover 배경(`--color-surface-2`) |
