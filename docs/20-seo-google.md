# 20. 구글 SEO 구현 명세

- 최종 **가이드 확인일**: 2026-09-07
- 다음 확인 예정: 2026-12-07 (분기마다)

---

## 0. 이 문서 사용법 (중요)

이 문서는 "구글 SEO를 위해 우리 사이트가 지켜야 할 것"의 **명세서**다.
구글 가이드라인은 계속 바뀐다. 바뀌면 **코드부터 고치지 말고 이 순서로** 한다:

1. 아래 **[출처]** 링크에서 최신 내용을 확인한다.
2. 이 문서의 **§3 구현 매핑표**와 관련 절을 고친다. **§8 변경 이력**에 기록한다.
3. 매핑표의 "구현 위치" 파일을 열어 문서에 맞춘다.
4. 배포 후 §7 점검을 돌린다.

즉 **"문서 → 코드"** 방향. 이 문서만 최신이면 사이트를 다시 맞출 수 있게 유지한다.

### [출처] (확인은 항상 아래 공식 문서에서)

| 주제 | 공식 URL |
|------|----------|
| Search Essentials (구 웹마스터 가이드) | https://developers.google.com/search/docs/essentials |
| 스팸 정책 | https://developers.google.com/search/docs/essentials/spam-policies |
| SEO 시작 가이드 | https://developers.google.com/search/docs/fundamentals/seo-starter-guide |
| 구조화 데이터 갤러리(지원 목록) | https://developers.google.com/search/docs/appearance/structured-data/search-gallery |
| 문서 업데이트 로그 | https://developers.google.com/search/updates |
| 검색 상태(랭킹 업데이트) | https://status.search.google.com/summary |
| Core Web Vitals | https://web.dev/articles/vitals |
| Search Console | https://search.google.com/search-console |
| 리치 결과 테스트 | https://search.google.com/test/rich-results |

---

## 1. 핵심 원칙 (2026)

구글 검색 노출의 3가지 전제:

1. **크롤링/색인 가능해야 한다** — 봇이 페이지를 가져올 수 있고, `noindex`가 걸려있지 않고, 내용이 HTML에 있어야 한다. (정적 사이트라 유리 — [10-tech-stack.md](./10-tech-stack.md))
2. **사람에게 유용한 콘텐츠여야 한다** — "검색엔진용"이 아니라 "사용자용"으로 만든 원본 콘텐츠. 계산기 + 실제 도움이 되는 설명.
3. **스팸 정책을 어기지 않아야 한다** — §5.

> 2026년 강조점: **대규모 저품질 자동 생성(AI 대량 양산) 페이지 단속 강화**, 그리고 **"맥락적 최신성"**(발행일이 아니라 내용이 현재 현실을 반영하는가). 세율·요율이 든 계산기는 값이 최신인지 관리하는 것이 곧 SEO다 — [02-calculator-catalog.md](./02-calculator-catalog.md).

---

## 2. 페이지 유형별 목표 title / description

`Head.astro`가 아래 규칙으로 생성한다. 규칙이 바뀌면 이 표를 고치고 `Head.astro`를 맞춘다.

| 페이지 | `<title>` 패턴 | `description` 패턴 |
|--------|----------------|--------------------|
| 홈 | `생활 계산기 모음 - {사이트명}` | 사이트가 제공하는 계산기 종류를 1문장 |
| 계산기 | `{계산기명} - {핵심 키워드 구}｜{사이트명}` 예: `BMI 계산기 - 키·몸무게로 체질량지수 계산｜사이트명` | 이 계산기가 무엇을 계산하는지 + 주요 입력값. 1~2문장, 대략 70~150자 |
| 카테고리(나중) | `{카테고리명} 계산기 모음｜{사이트명}` | 해당 카테고리 계산기 나열 |
| about / privacy | `{페이지명}｜{사이트명}` | 페이지 성격 1문장 |

규칙:
- title은 **페이지마다 고유**. 앞쪽에 핵심 키워드.
- 길이는 대략 title 60자, description 160자 이내를 목표(잘려도 의미가 통하게 앞에 중요한 말).
- description은 클릭을 유도하는 요약이지 키워드 나열이 아님. (구글이 무시하고 본문에서 발췌할 수도 있음 — 그래도 작성)

---

## 3. 구현 매핑표 (기술 요구사항 → 코드 위치)

가이드가 바뀌면 "권장값"을 고치고 "구현 위치" 파일을 수정한다.

| # | 항목 | 권장값 / 규칙 | 구현 위치 | 현재 상태 |
|---|------|----------------|-----------|-----------|
| 1 | 문서 언어 | `<html lang="ko">` | `BaseLayout.astro` | 미구현 |
| 2 | 인코딩·뷰포트 | utf-8 / `width=device-width,initial-scale=1` | `Head.astro` | 미구현 |
| 3 | title | §2 패턴, 페이지 고유 | `Head.astro` ← 페이지 props | 미구현 |
| 4 | meta description | §2 패턴, 페이지 고유 | `Head.astro` ← 페이지 props | 미구현 |
| 5 | canonical | `https://{도메인}{현재경로}` 절대주소, 1개 | `Head.astro` + `src/config/site.ts` | 미구현 |
| 6 | robots 메타 | 기본 `index,follow`. 얇은/중복 페이지만 `noindex` | `Head.astro` ← props(기본 index) | 미구현 |
| 7 | Open Graph | og:title, og:description, og:type(website), og:url, og:image(1200×630 기본 이미지) | `Head.astro` + `public/images/og-default.png` | 미구현 |
| 8 | Twitter 카드 | `summary_large_image` | `Head.astro` | 미구현 |
| 9 | sitemap.xml | 전체 URL 자동 수집, `lastmod` 포함 | `@astrojs/sitemap` in `astro.config.mjs` (+ `site` 설정) | 미구현 |
| 10 | robots.txt | 전체 허용 + `Sitemap: https://{도메인}/sitemap-index.xml` | `public/robots.txt` | 미구현 |
| 11 | 트레일링 슬래시 | 사이트 전역 1가지로 통일 | `astro.config.mjs` (`trailingSlash`) | 미구현 |
| 12 | HTTPS | 강제(배포사가 자동) | Vercel 설정 | 배포 시 |
| 13 | 404 응답 | 실제 404 상태 + 안내 페이지 | `src/pages/404.astro` | 미구현 |
| 14 | 구조화 데이터: 사이트 | `WebSite` (+ 향후 `SearchAction`), `Organization` | `Head.astro`(전역 JSON-LD) | 미구현 |
| 15 | 구조화 데이터: 경로 | `BreadcrumbList` | `Breadcrumb.astro` | 미구현 |
| 16 | 구조화 데이터: 계산기 | `SoftwareApplication`(또는 `WebApplication`), `applicationCategory: UtilitiesApplication`, `offers.price: 0` | `CalculatorLayout.astro` ← 페이지 props | 미구현 |
| 17 | 구조화 데이터: FAQ | §4 참고 — 마크업은 둬도 되나 리치결과 기대 안 함 | `Faq.astro` | 나중 |
| 18 | 이미지 | `alt` 필수, 크기 지정(레이아웃 이동 방지), 지연 로딩 | 각 컴포넌트 / `12-page-structure.md` 규칙 | 규칙만 |
| 19 | 내부 링크 | breadcrumb + 홈↔계산기 + 관련 계산기. 앵커 텍스트에 의미 | `Nav.astro`, `CalculatorLayout.astro` | 부분 |
| 20 | 페이지당 h1 | 정확히 1개, 주제어 포함 | 각 페이지 / 리뷰 체크 | 규칙만 |
| 21 | 모바일 대응 | 반응형, 가로 스크롤 없음, 터치 타겟 | `global.css` — [30-design-guide.md](./30-design-guide.md) | 미구현 |
| 22 | 성능(CWV) | §6 목표치 | 전역(이미지·폰트·JS 최소화) | 측정 필요 |
| 23 | 언어/지역 | 한국어 단일. `hreflang` 불필요(다국어 도입 시 추가) | — | 해당 없음 |

---

## 4. 구조화 데이터 (2026 현재)

### 우리가 쓰는 것

| 타입 | 어디에 | 목적 |
|------|--------|------|
| `WebSite` | 전 페이지(전역) | 사이트 이름 인식 |
| `Organization` | 전 페이지(전역) | 운영 주체 정보(로고, 이름) |
| `BreadcrumbList` | 모든 하위 페이지 | 검색결과에 경로 표시 |
| `SoftwareApplication` / `WebApplication` | 각 계산기 페이지 | "무료 온라인 도구"임을 명시 |

작성 형식: `<script type="application/ld+json">` (JSON-LD). 페이지 눈에 보이는 내용과 **일치**해야 함(거짓 마크업은 위반).

### 지원 종료 / 주의 (2026)

| 타입 | 상태 | 우리 대응 |
|------|------|-----------|
| **FAQ 리치결과** | **2026-05-07 지원 종료.** 정부·보건 등 일부 권위 사이트에만 노출. `FAQPage` 스키마 자체는 유효하고 마크업을 둬도 문제없음. 리치결과 테스트는 2026-06, Search Console API는 2026-08 지원 종료 | FAQ 섹션은 **사용자 가치를 위해** 유지. 스키마는 넣어도 되지만 "리치결과가 뜬다"고 기대하지 않음 |
| **HowTo 리치결과** | 2023년부터 데스크톱 종료, 현재 사실상 폐기. 갤러리에서 빠짐 | HowTo 마크업 사용 안 함. "사용법"은 일반 텍스트로 |

### 참고: 2026년 구조화 데이터 갤러리에 존재하는 타입(발췌)
Article, Breadcrumb, Carousel, Course List, Dataset, Discussion Forum, Education Q&A, Event, Image Metadata, Job Posting, Local Business, Math Solver, Movie, Organization, Product, Profile Page, Q&A, Recipe, Review Snippet, **Software App**, Speakable, Subscription/Paywalled Content, Vacation Rental, Video.
→ 계산기 사이트에 해당하는 건 **Software App, Breadcrumb, Organization/WebSite** 정도. 나머지는 억지로 넣지 않는다.

> 최신 목록은 반드시 [출처]의 "구조화 데이터 갤러리"에서 재확인.

---

## 5. 스팸 정책 — 우리가 특히 피할 것 (2026)

전체 목록은 [출처] 참고. 계산기 사이트에서 실수하기 쉬운 항목:

| 정책 | 하지 말 것 |
|------|-----------|
| **대규모 콘텐츠 남용 (scaled content abuse)** | AI로 계산기 설명 글을 대량 찍어내 가치 없이 페이지 수만 늘리기. → 각 페이지는 직접 검토하고 실제 정보를 담는다 |
| **문지기 페이지 (doorway)** | "서울 BMI 계산기", "부산 BMI 계산기"처럼 내용 같은 페이지를 지역·키워드만 바꿔 양산 |
| **얇은 제휴 (thin affiliation)** | 제휴 링크 목적의 알맹이 없는 페이지 |
| **키워드 스터핑** | title·본문에 "계산기 계산기 무료 계산기" 반복 |
| **숨김 텍스트/링크** | 배경색과 같은 글씨로 키워드 숨기기 |
| **링크 스팸** | 링크 구매/교환 |
| **만료 도메인 남용** | 남이 쓰던 도메인을 사서 관련 없는 콘텐츠로 |
| **사이트 평판 남용** | 남의 도메인에 우리 콘텐츠를 얹어 순위 빌리기 |
| **잘못된 기능 표방** | "실시간 환율" 표방하고 실제로는 안 되는 계산기 |

기준: **"검색엔진이 없어도 이 페이지를 이렇게 만들었을까?"** → 아니라면 다시 본다.

---

## 6. Core Web Vitals 목표

| 지표 | 뜻 | 목표(양호) |
|------|-----|-----------|
| **LCP** (Largest Contentful Paint) | 가장 큰 요소가 뜨는 시간 | ≤ 2.5초 |
| **CLS** (Cumulative Layout Shift) | 로딩 중 레이아웃 밀림 정도 | ≤ 0.1 |
| **INP** (Interaction to Next Paint) | 입력에 반응하는 속도 (2024년 FID 대체) | ≤ 200ms |

지키는 법: 이미지에 width/height 지정·지연 로딩, 웹폰트 최소화(가능하면 시스템 폰트 — [30-design-guide.md](./30-design-guide.md)), 광고 자리에 **미리 높이 확보**(CLS 방지), 자바스크립트는 계산기 있는 페이지에만.
측정: 크롬 DevTools > Lighthouse, PageSpeed Insights, 배포 후 Search Console의 "코어 웹 바이탈" 보고서.

---

## 7. 등록 및 정기 점검

### 최초 등록 (배포 직후 1회)

1. [Search Console](https://search.google.com/search-console) 접속 → 속성 추가는 **도메인 속성** 권장(DNS TXT 인증). 커스텀 도메인 없으면 배포 URL로 **URL 접두어 속성**.
2. `sitemap-index.xml` 제출 (색인 > Sitemaps).
3. 주요 페이지 몇 개를 **URL 검사 → 색인 요청**.
4. `robots.txt`가 봇을 막고 있지 않은지 확인.

### 정기 점검 체크리스트 (분기 1회 + 구글 발표 있을 때)

- [ ] [출처]의 "문서 업데이트 로그"에서 지난 분기 변경 확인
- [ ] 구조화 데이터 갤러리에서 우리가 쓰는 타입이 여전히 지원되는지
- [ ] Search Console: 색인 안 된 페이지 / 오류 / 수동 조치 여부
- [ ] Search Console: 코어 웹 바이탈 "불량" URL
- [ ] 리치 결과 테스트로 계산기 페이지 1개 검사
- [ ] 세율·요율이 든 계산기 값이 최신인지([02-calculator-catalog.md](./02-calculator-catalog.md))
- [ ] 이 문서 §0의 "다음 확인 예정" 날짜 갱신

---

## 8. 변경 이력

| 날짜 | 확인한 것 / 바꾼 것 |
|------|---------------------|
| 2026-09-07 | 최초 작성. FAQ 리치결과 2026-05-07 종료·HowTo 폐기 반영. 스팸정책(대규모 콘텐츠 남용 등) 반영. CWV는 LCP/CLS/INP 기준. 구조화 데이터는 WebSite·Organization·BreadcrumbList·SoftwareApplication만 사용하기로 결정 |
