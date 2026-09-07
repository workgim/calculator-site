# 12. 웹 페이지 / HTML 문서 구조

- 최종 수정일: 2026-09-07
- 관련: [11-folder-structure.md](./11-folder-structure.md), [20-seo-google.md](./20-seo-google.md), [30-design-guide.md](./30-design-guide.md)

이 문서는 "페이지 한 장이 어떤 뼈대로 이루어지는가"를 정한다.
모든 페이지는 이 구조를 따르고, 계산기 페이지는 추가로 "계산기 공통 틀"을 따른다.

---

## 1. HTML 문서의 기본 구조

브라우저가 이해하는 최소 골격. Astro에서는 `BaseLayout.astro`가 이 역할을 한다.

```
<!doctype html>
<html lang="ko">
  <head>
    ... 페이지 "정보" (화면에 안 보임, 검색엔진·브라우저용) ...
  </head>
  <body>
    <header> ... 로고 + 내비게이션 ... </header>
    <main>   ... 이 페이지의 핵심 내용 (페이지마다 다름) ... </main>
    <footer> ... 링크(소개/개인정보처리방침) + 저작권 + 면책 ... </footer>
  </body>
</html>
```

- `<!doctype html>` : 표준 모드로 렌더링하라는 선언. 항상 첫 줄.
- `<html lang="ko">` : 이 페이지의 언어는 한국어. 검색엔진·스크린리더가 참고.
- `<head>` : **화면에 안 보이는** 페이지 정보. 아래 2번.
- `<body>` : 화면에 보이는 것. `header` / `main` / `footer` 3덩이로 나눈다.

---

## 2. `<head>` 구성요소

`Head.astro` 컴포넌트가 만든다. 각 항목은 페이지에서 넘긴 값(props)으로 채운다.

| 태그 | 예시 값 | 역할 | 값의 출처 |
|------|---------|------|-----------|
| `<meta charset="utf-8">` | 고정 | 한글 깨짐 방지 | 고정 |
| `<meta name="viewport" content="width=device-width, initial-scale=1">` | 고정 | 모바일 반응형의 전제 | 고정 |
| `<title>` | `BMI 계산기 - 키·몸무게로 체질량지수 계산 | 사이트명` | 검색결과 제목, 브라우저 탭 | 페이지 props |
| `<meta name="description">` | 이 페이지 요약 1~2문장 | 검색결과 설명문 | 페이지 props |
| `<link rel="canonical" href="https://도메인/calc/bmi">` | 이 페이지의 대표 주소 | 중복 URL 정리 | `site.ts` 도메인 + 현재 경로 |
| `<meta property="og:title" / "og:description" / "og:image" / "og:url" / "og:type">` | 위 값 재사용 + 대표 이미지 | 카톡·페북 등 공유 미리보기, 네이버도 참고 | props + 기본 OG 이미지 |
| `<meta name="twitter:card" content="summary_large_image">` | 고정 | 트위터/X 공유 카드 | 고정 |
| `<meta name="robots" content="index,follow">` | 기본 index / 특정 페이지만 noindex | 색인 허용 여부 | props(기본값 index) |
| `<meta name="google-site-verification">` / `<meta name="naver-site-verification">` | 소유확인 코드 | 검색엔진 소유확인 | `site.ts` 의 `verification.google` / `.naver` (값 있을 때만 출력) |
| `<link rel="icon" href="/favicon.svg">` | 고정 | 탭 아이콘 | 고정 |
| `<link rel="alternate" type="application/rss+xml" ...>` | RSS 도입 후 | 네이버 RSS | 조건부 |
| 구조화 데이터 `<script type="application/ld+json">` | `WebSite`, `BreadcrumbList`, `SoftwareApplication` 등 | 검색엔진에 의미 전달 | [20-seo-google.md](./20-seo-google.md) 매핑표 |

> `<title>`과 `description`은 **페이지마다 반드시 달라야** 한다. 같은 값이 여러 페이지에 있으면 SEO에 나쁘다.
> 기본값·조합 규칙은 [20-seo-google.md](./20-seo-google.md)에 둔다(문서만 고치면 전 페이지 반영되도록).

---

## 3. `<body>` 시맨틱 구조

"의미에 맞는 태그"를 쓰면 검색엔진·스크린리더가 구조를 이해한다. `div`만 쓰지 않는다.

| 영역 | 태그 | 규칙 |
|------|------|------|
| 페이지 상단 | `<header>` | 로고(홈 링크) + `<nav>`. 모든 페이지 공통 |
| 주 메뉴 | `<nav aria-label="주요">` | 카테고리/주요 계산기 링크 |
| 본문 | `<main>` | 페이지당 **1개**. 이 페이지만의 내용 |
| 본문 내 큰 구획 | `<section>` | 각 구획 시작에 제목(`<h2>` 등) |
| 독립적으로 말이 되는 덩어리 | `<article>` | 계산기 본체, 블로그성 글 |
| 부가 정보 | `<aside>` | (PC) 사이드바 광고·관련 계산기 |
| 이동 경로 | `<nav aria-label="이동 경로">` + `<ol>` | 홈 > 카테고리 > 현재 |
| 페이지 하단 | `<footer>` | 소개·개인정보처리방침 링크, 저작권, **면책 문구** |

### 제목(heading) 규칙

- `<h1>` 은 페이지당 **정확히 1개**. 그 페이지의 주제. (계산기 페이지에서는 계산기 이름)
- 그 아래 구획은 `<h2>`, 더 아래는 `<h3>`. **단계를 건너뛰지 않는다**(h2 다음 바로 h4 금지).
- 헤더 로고는 `<h1>`이 아니다. 로고는 링크일 뿐.

---

## 4. 공통 레이아웃 (`BaseLayout.astro`)

모든 페이지가 이걸 감싸서 쓴다. 페이지는 `<slot />` 자리에 자기 내용만 채운다.

```
BaseLayout(props: title, description, canonicalPath, ogImage?, noindex?)
├─ <head>  →  <Head {...props} />
└─ <body>
   ├─ <Header />                     (로고 + <Nav />)
   ├─ <AdSlot position="top" />       ← 지금은 빈 상자
   ├─ <main>
   │    <slot />                     ← 페이지별 내용이 여기 들어옴
   │  </main>
   ├─ <AdSlot position="bottom" />
   └─ <Footer />                     (링크 + 저작권 + 면책)
```

- 헤더·푸터·광고 자리·`<head>`는 여기서 한 번만 정의 → 전 페이지 일관.
- 페이지(`src/pages/*.astro`)가 하는 일: `BaseLayout`에 title 등 넘기고, 슬롯에 내용 배치.

---

## 5. 계산기 페이지 공통 틀 (`CalculatorLayout.astro`)

`BaseLayout`을 한 번 더 감싸, 모든 계산기 페이지가 **같은 순서**를 갖게 한다.
계산기를 추가할 때 이 틀 덕분에 "무슨 섹션을 넣지?"를 고민하지 않는다.

`CalculatorLayout` 은 props 로 `calculator`(데이터 객체) 하나만 받는다. 그러면 canonical 경로,
title/description(→ `BaseLayout`), breadcrumb, `<h1>`, 리드 문장, `SoftwareApplication` JSON-LD 를
자동으로 만든다. 페이지는 **두 개의 슬롯**만 채운다.

| 순서 | 섹션 | 어디서 | 내용 | 상태 |
|------|------|--------|------|------|
| 1 | 이동 경로 | `CalculatorLayout` (`<Breadcrumb />`) | 홈 > 카테고리 > 계산기명 | 자동 |
| 2 | 제목 | `CalculatorLayout` (`<h1>`) | `calculator.title` | 자동 |
| 3 | 한 줄 소개 | `CalculatorLayout` (`<p class="lead">`) | `calculator.shortDescription` | 자동 |
| 4 | **계산기 본체** | 페이지 → `<... slot="calculator">` | `.calc-box` 안에 `<form>`(입력 + [계산] 버튼) + `.calc-result` + `.calc-error` | 페이지 |
| 5 | 광고 자리 | `CalculatorLayout` (`<AdSlot position="afterResult" />`) | 결과 바로 아래 | 빈 상자 |
| 6~9 | 사용법 / 계산 방법 / 계산 예시 / 주의사항·근거 | 페이지 → 기본 `<slot>` (`<section><h2>…`) | 짧은 설명 텍스트 + 공식 출처 | 페이지 |
| 10 | 최종 업데이트 날짜 | `CalculatorLayout` | `calculator.updated` | 자동 |
| 11 | FAQ | 페이지 (일반 `<section>`, `Faq.astro` 아직 없음) | 자주 묻는 질문 2~5개 | 일부 페이지 |
| 12 | 관련 계산기 | — | 같은 카테고리 링크 | 나중 |

> 6~9번의 "설명 텍스트"는 SEO·신뢰도·애드센스 심사에 중요하다. 위젯만 있고 글이 없는 페이지는 검색에서 약하다.

### 계산기 폼 공통 클래스 (`global.css`)

`.astro` 마다 스타일을 복붙하지 않도록 폼 UI 클래스를 `global.css` 에 모아 둔다:
`.calc-box`(입력 영역 카드) · `.calc-field`(라벨+입력 묶음) · `.calc-row`(한 줄에 여러 입력) ·
`.calc-hint`(입력 아래 작은 설명) · `.calc-result`(결과 박스, 안에 `<dl>` 지원) · `.calc-error`(빨간 오류 문구) ·
`.stepper`(빠른 증감 버튼 줄). 값·규칙은 [30-design-guide.md](./30-design-guide.md) §6.

### 계산기 본체의 동작 방식

1. `<form>` 안에 `<label>` + `<input>` (label·input 은 `for`/`id` 로 연결). 금액칸은 `<AmountInput>` 컴포넌트.
2. `<script>` 에서 `src/lib/<slug>.ts` 함수 호출 → `.calc-result` 갱신, 오류 시 `.calc-error` 표시.
3. 금액칸이 있으면 `enhanceInputs()` 호출(콤마·증감 버튼), 값은 `parseAmount(el.value)` 로 읽는다.
4. `calculate()` 를 별도 함수로 두고 `submit` + (결과가 떠 있으면) `input` 에 연결 → 값 바꾸면 자동 재계산.
5. 페이지 새로고침 없이 결과만 바뀜.

---

## 6. 홈페이지(`index.astro`) 구조

| 순서 | 섹션 | 내용 |
|------|------|------|
| 1 | `<h1>` | 사이트 한 줄 정체성 (예: "생활 계산기 모음") |
| 2 | 소개 문단 | 어떤 계산기가 있는지 1~2문장 |
| 3 | (나중) 인기/추천 | 자주 쓰는 계산기 몇 개 |
| 4 | 카테고리별 목록 | `categories.ts` 순회 → 각 카테고리 `<section><h2>` + `<CalculatorCard>` 그리드 |
| 5 | `<AdSlot position="bottom" />` | 빈 상자 |

카드에는 계산기명 + 한 줄 설명 + 링크. 데이터는 전부 `src/data/calculators.ts`에서 온다.

---

## 7. 정적 페이지(about / privacy / 404) 구조

- `BaseLayout` + `<main>` 안에 `<h1>` + 본문 `<section>`들.
- `privacy`(개인정보처리방침)는 나중에 애드센스·분석 도입 시 항목을 채운다(수집 항목, 쿠키, 광고 고지). 세부는 나중에 `40-legal-pages.md`.
- `404.astro`는 "페이지를 찾을 수 없음" + 홈 링크 + 전체 계산기 목록 링크.

---

## 8. 페이지를 만들 때 지키는 최소 체크

- [ ] `<h1>` 이 딱 1개인가
- [ ] `<title>`, `<meta description>` 가 이 페이지 고유값인가
- [ ] `<main>` 이 1개이고 핵심 내용이 그 안에 있는가
- [ ] 이미지에 `alt` 가 있는가
- [ ] 모바일 폭(375px)에서 가로 스크롤이 안 생기는가
- [ ] 입력창마다 `<label>` 이 연결됐는가
- [ ] 광고 자리(`AdSlot`)가 콘텐츠를 가리지 않는가

## 변경 이력

| 날짜 | 변경 내용 |
|------|-----------|
| 2026-09-07 | 최초 작성. 문서 골격 · head 구성 · 시맨틱 구조 · 공통 레이아웃 · 계산기 공통 틀 정리 |
| 2026-09-07 | 구현 반영: head 에 소유확인 meta, `CalculatorLayout` 이 breadcrumb/h1/리드/JSON-LD 자동 생성 + named slot 2개, 폼 공통 클래스(`global.css`)·`AmountInput`·`enhanceInputs`·자동 재계산 |
