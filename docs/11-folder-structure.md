# 11. 폴더 구조

- 최종 수정일: 2026-09-07
- 전제 스택: Astro ([10-tech-stack.md](./10-tech-stack.md))

핵심 규칙 한 줄: **`src/pages/` 안의 파일 경로가 그대로 웹사이트 주소(URL)가 된다.**

---

## 1. 전체 폴더 트리

> 아래 트리는 2026-09-07 실제 구조 기준. 계산기가 늘면 `pages/calc/`·`lib/` 파일만 추가된다.

```
calculator-site/
├─ docs/                       # 이 문서들 (설계 규칙 모음)
│
├─ scripts/                    # 빌드와 무관한 1회성 도구 (클라이언트 코드 아님)
│  └─ generate-og.mjs          #  기본 OG 이미지 생성 (npm run gen:og). sharp 사용
│
├─ public/                     # 가공 없이 그대로 배포되는 파일
│  ├─ favicon.svg
│  ├─ robots.txt               # 검색봇 안내 + sitemap 위치
│  └─ images/
│     └─ og-default.png        # 기본 Open Graph 이미지 (1200×630, scripts/generate-og.mjs 로 생성)
│    (네이버·구글 소유확인은 HTML 태그 방식 → src/config/site.ts 의 verification)
│
├─ src/
│  ├─ layouts/
│  │  ├─ BaseLayout.astro      #  <html><head>…</head><body> + 헤더 + 광고자리 + <slot/> + 푸터
│  │  └─ CalculatorLayout.astro#  BaseLayout 위 계산기 공통 틀(breadcrumb·h1·리드·named slot·광고·JSON-LD)
│  │
│  ├─ components/
│  │  ├─ Head.astro            #  <title>·meta·canonical·OG·소유확인·전역 JSON-LD
│  │  ├─ Header.astro / Footer.astro / Nav.astro   #  Nav = 카테고리 드롭다운
│  │  ├─ ThemeToggle.astro     #  시스템/라이트/다크 전환 버튼
│  │  ├─ Icon.astro            #  Lucide path 맵 (인라인 SVG, currentColor)
│  │  ├─ IconBadge.astro       #  카테고리 색 배지 + Icon
│  │  ├─ AdSlot.astro          #  광고 자리 (빈 상자 + "광고" 라벨, 높이 예약)
│  │  ├─ CalculatorCard.astro  #  홈 목록 카드 (아이콘 배지 + 제목 + 한 줄)
│  │  ├─ Breadcrumb.astro      #  홈 > 카테고리 > 계산기 (+ BreadcrumbList JSON-LD)
│  │  ├─ Faq.astro             #  자주 묻는 질문 아코디언 (<details>, JSON-LD 없음)
│  │  ├─ Analytics.astro       #  GA4 표준 async 태그 (site.ts gaId 있을 때만)
│  │  └─ AmountInput.astro     #  금액(원) 입력 필드: 세 자리 콤마 + 빠른 증감 버튼
│  │
│  ├─ pages/                   # ★ 파일 = URL  (astro.config: trailingSlash 'never', build.format 'file')
│  │  ├─ index.astro  about.astro  contact.astro  privacy.astro  404.astro
│  │  └─ calc/                 # 계산기 16개 (slug = 파일명)
│  │     ├─ 금융·세금 : salary-net  loan  savings  severance-pay  vat  hourly-wage
│  │     ├─ 부동산    : broker-fee  acquisition-tax
│  │     ├─ 건강      : bmi  bmr
│  │     ├─ 날짜      : dday  age  date-add
│  │     └─ 생활·단위 : percentage  pyeong  char-count
│  │
│  ├─ lib/                     # 순수 함수 (DOM·astro import 없음) + 각 파일의 *.test.ts (vitest)
│  │  ├─ bmi  percentage  vat  dday  loan  salary  savings  severance
│  │  ├─ brokerFee  acquisitionTax  wage  age  dateAdd  pyeong  charCount  bmr   (.ts)
│  │  ├─ format.ts             #  parseAmount / formatThousands / moneyStepLabel
│  │  └─ *.test.ts             #  `npm test` (vitest run). 17파일 137케이스
│  │
│  ├─ scripts/                 # 브라우저에서 실행되는 공유 스크립트
│  │  └─ enhance-inputs.ts     #  data-money 콤마 포맷 + .stepper 버튼 처리 (페이지가 import)
│  │
│  ├─ data/
│  │  ├─ calculators.ts        #  계산기 목록·메타데이터 배열 (홈·사이트맵·breadcrumb 이 참조)
│  │  └─ categories.ts         #  카테고리 정의 (finance / health / date / living)
│  │
│  ├─ styles/
│  │  └─ global.css            #  디자인 토큰(CSS 변수) + 기본 요소 + 계산기 폼 공통 클래스 + .stepper
│  │
│  └─ config/
│     └─ site.ts               #  도메인·사이트명·기본 설명·OG 이미지·검색엔진 소유확인 코드
│
├─ astro.config.mjs   vercel.json   tsconfig.json
├─ package.json       .prettierrc.json   .gitattributes   .gitignore
└─ README.md
```

---

## 2. 폴더별 역할

| 폴더 | 역할 | 여기에 두면 안 되는 것 |
|------|------|------------------------|
| `docs/` | 설계 규칙 문서 | 실행 코드 |
| `public/` | URL로 그대로 노출되는 정적 파일(favicon, robots.txt, 이미지) | 빌드가 필요한 코드, 비밀값 |
| `src/layouts/` | 여러 페이지가 공유하는 큰 뼈대 | 특정 계산기에만 쓰는 로직 |
| `src/components/` | 재사용 UI 조각 | 계산 공식(→ `lib/`) |
| `src/pages/` | **URL이 되는 파일.** 페이지는 "데이터 가져와 컴포넌트 배치"만 | 복잡한 계산 로직(→ `lib/`), 재사용 UI(→ `components/`) |
| `src/lib/` | 순수 계산 함수 + 테스트 | DOM 조작, import astro 컴포넌트 |
| `src/scripts/` | **브라우저에서** 실행되는 공유 JS (`enhance-inputs.ts` 등). 페이지 `<script>` 가 import | astro 컴포넌트, 순수 계산 로직(→ `lib/`) |
| `src/data/` | 계산기·카테고리 목록 같은 "표 데이터" | 함수 로직 |
| `src/styles/` | 전역 CSS와 디자인 토큰 | 컴포넌트 전용 스타일(그건 각 `.astro`의 `<style>`에) |
| `src/config/` | 사이트 전역 상수 | 페이지별 콘텐츠 |
| `scripts/` (루트) | 빌드와 별개인 1회성 개발 도구 (`generate-og.mjs`). `node` 로 직접 실행 | 사이트에 포함될 코드 |

> `src/lib/` 와 `src/scripts/` 구분: `lib/` 는 입출력만 있는 순수 함수(브라우저·테스트 어디서든), `scripts/` 는 `document` 를 만지는 코드.

---

## 3. URL · 파일 · slug 명명 규칙

| 대상 | 규칙 | 예 |
|------|------|-----|
| 계산기 URL | `/calc/<slug>` 한 단계로 고정 | `/calc/bmi` |
| slug | 영문 소문자 + 숫자 + 하이픈(`-`)만. 공백·한글·언더스코어 금지 | `salary-net`, `due-date` |
| slug 의미 | 검색 친화적으로 **영어 키워드**. 한글 발음 표기(`mannai`)보다 의미 단어(`age`) 우선 | `age` (O) / `mannai` (△) |
| 파일명 | slug와 동일하게. `src/pages/calc/salary-net.astro` | |
| 로직 파일 | `src/lib/<slug 또는 개념>.ts` | `src/lib/bmi.ts` |
| 컴포넌트 파일 | PascalCase | `CalculatorCard.astro` |
| 카테고리 | `src/data/categories.ts`에 `id`(영문 소문자) 정의. URL은 1차엔 안 만듦(나중에 `/category/<id>`) | `finance`, `health`, `date` |
| 트레일링 슬래시 | 사이트 전체에서 한 방식으로 통일(Astro 설정에서 지정) | `/calc/bmi` 로 통일 |

> slug는 한 번 정하면 **바꾸지 않는다**(검색 색인·외부 링크가 깨짐). 바꿔야 하면 옛 URL → 새 URL 301 리다이렉트를 배포 설정에 추가.

---

## 4. ★ 계산기 1개를 추가할 때 만지는 파일 (딱 3곳)

새 계산기 `example`을 추가한다고 하자.

1. **`src/lib/example.ts`** — 계산 공식 함수 작성 (+ `example.test.ts` 로 값 검증)
   ```
   export function calcExample(a: number, b: number) { ... }
   ```
2. **`src/pages/calc/example.astro`** — 화면.
   `CalculatorLayout`을 가져와 입력창·결과 영역(`.calc-box`/`.calc-field`/`.calc-result`/`.calc-error` 클래스)·
   설명(공식/예시/주의)·FAQ를 배치하고, `<script>`에서 `calcExample`을 호출해 결과를 채운다.
   - 금액(원) 입력이 있으면 `<AmountInput>` 컴포넌트를 쓰고, `<script>`에서
     `import { enhanceInputs } from '../../scripts/enhance-inputs'; enhanceInputs();` 호출,
     값은 `parseAmount(el.value)` 로 읽는다. (콤마·빠른 증감 버튼 자동)
3. **`src/data/calculators.ts`** — 배열에 항목 한 개 추가
   ```
   { slug: 'example', title: '예시 계산기', icon: 'calculator',
     shortDescription: '...', description: '...', category: 'living',
     related: ['...'], keywords: ['예시 계산기', ...], updated: '2026-09-11' }
   ```
   → 이 한 줄로 **홈 목록 카드**, **사이트맵 포함**, **내비게이션 드롭다운**, **관련 계산기**에 자동 반영된다.
   `icon` 은 `Icon.astro` 의 이름(없으면 `calculator` 폴백). 새 아이콘은 [Lucide](https://lucide.dev)에서 골라 `Icon.astro` 의 `PATHS` 에 추가.

**건드리지 않아도 되는 것**: 헤더, 푸터, 광고 자리, SEO 태그 틀, 디자인, `astro.config.mjs`.
이게 "확장하기 쉬운 구조"의 핵심이다. — 절차 체크리스트는 나중에 `14-workflow.md`로 분리.

---

## 5. 데이터 파일이 구조의 중심인 이유

`src/data/calculators.ts` 배열 하나를 여러 곳이 참조한다:

```
calculators.ts (배열)
   ├─▶ src/pages/index.astro        → 카드 목록 렌더
   ├─▶ src/components/Nav.astro      → 카테고리별 메뉴
   ├─▶ @astrojs/sitemap             → sitemap.xml 항목
   └─▶ src/pages/calc/[각 페이지]    → breadcrumb·관련 계산기 링크
```

그래서 계산기 정보를 **한 곳에서만** 관리하면 나머지는 따라온다.

## 변경 이력

| 날짜 | 변경 내용 |
|------|-----------|
| 2026-09-07 | 최초 작성. Astro 기준 폴더 트리·명명 규칙·계산기 추가 절차 정리 |
| 2026-09-07 | 실제 구조 반영: `scripts/`(루트)·`src/scripts/`·`lib/format.ts`·`AmountInput.astro`·`vercel.json` 추가, 계산기 6개, `build.format:'file'`, 소유확인은 메타태그 방식 |
