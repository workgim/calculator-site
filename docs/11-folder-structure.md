# 11. 폴더 구조

- 최종 수정일: 2026-09-07
- 전제 스택: Astro ([10-tech-stack.md](./10-tech-stack.md))

핵심 규칙 한 줄: **`src/pages/` 안의 파일 경로가 그대로 웹사이트 주소(URL)가 된다.**

---

## 1. 전체 폴더 트리

```
calculator-site/
├─ docs/                       # 이 문서들 (설계 규칙 모음)
│
├─ public/                     # 가공 없이 그대로 배포되는 파일
│  ├─ favicon.svg
│  ├─ robots.txt               # 검색봇 안내 + sitemap 위치
│  ├─ naver<인증코드>.html      # 네이버 소유확인 파일 (메타태그 방식이면 불필요)
│  └─ images/
│     └─ og-default.png        # 기본 Open Graph 이미지
│
├─ src/
│  ├─ layouts/                 # 모든 페이지가 공유하는 "뼈대"
│  │  ├─ BaseLayout.astro      #  <html><head>…</head><body> + 헤더 + <slot/> + 푸터
│  │  └─ CalculatorLayout.astro#  BaseLayout 위에 계산기 페이지 공통 틀(제목·설명·광고자리)
│  │
│  ├─ components/              # 재사용 UI 조각
│  │  ├─ Head.astro            #  <title>·meta·canonical·OG 태그 모음 (SEO의 실체)
│  │  ├─ Header.astro
│  │  ├─ Footer.astro
│  │  ├─ Nav.astro
│  │  ├─ AdSlot.astro          #  광고 자리. 지금은 빈 상자 + "광고" 라벨 자리
│  │  ├─ CalculatorCard.astro  #  홈 목록에 뿌리는 카드
│  │  ├─ Breadcrumb.astro      #  홈 > 카테고리 > 계산기
│  │  └─ Faq.astro             #  질문/답변 목록 (+ 구조화 데이터)
│  │
│  ├─ pages/                   # ★ 파일 = URL
│  │  ├─ index.astro           # →  /
│  │  ├─ about.astro           # →  /about
│  │  ├─ privacy.astro         # →  /privacy
│  │  ├─ 404.astro             # →  없는 주소 처리
│  │  └─ calc/
│  │     ├─ bmi.astro          # →  /calc/bmi
│  │     └─ percentage.astro   # →  /calc/percentage
│  │
│  ├─ lib/                     # 계산 "로직"만 (화면과 무관한 순수 함수 + 그 테스트)
│  │  ├─ bmi.ts                #  export function calcBmi(heightCm, weightKg)
│  │  ├─ bmi.test.ts           #  (테스트 도입 후)
│  │  └─ percentage.ts
│  │
│  ├─ data/
│  │  ├─ calculators.ts        #  계산기 목록·메타데이터 배열 (홈·사이트맵·내비가 참조)
│  │  └─ categories.ts         #  카테고리 정의 (id, 이름, 설명)
│  │
│  ├─ styles/
│  │  └─ global.css            #  디자인 토큰(CSS 변수) + 기본 요소 스타일 + 공통 반응형
│  │
│  └─ config/
│     └─ site.ts               #  사이트 전역 설정 (도메인, 사이트명, 기본 설명, SNS 등)
│
├─ astro.config.mjs            # Astro 설정 (site URL, sitemap 플러그인 등)
├─ package.json
├─ tsconfig.json
├─ .prettierrc
├─ .gitignore
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
| `src/data/` | 계산기·카테고리 목록 같은 "표 데이터" | 함수 로직 |
| `src/styles/` | 전역 CSS와 디자인 토큰 | 컴포넌트 전용 스타일(그건 각 `.astro`의 `<style>`에) |
| `src/config/` | 사이트 전역 상수 | 페이지별 콘텐츠 |

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

1. **`src/lib/example.ts`** — 계산 공식 함수 작성
   ```
   export function calcExample(a: number, b: number) { ... }
   ```
2. **`src/pages/calc/example.astro`** — 화면.
   `CalculatorLayout`을 가져와 입력창·결과 영역·설명(공식/예시/주의)·FAQ를 배치하고,
   `<script>`에서 `calcExample`을 호출해 결과를 채운다.
3. **`src/data/calculators.ts`** — 배열에 항목 한 개 추가
   ```
   { slug: 'example', title: '예시 계산기', description: '...',
     category: 'living', keywords: ['예시 계산기', ...], updated: '2026-09-07' }
   ```
   → 이 한 줄로 **홈 목록 카드**, **사이트맵 포함**, **내비게이션**에 자동 반영된다.

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
