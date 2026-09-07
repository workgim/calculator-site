# 10. 기술 스택

- 최종 수정일: 2026-09-07

이 문서는 "무엇을 왜 쓰는가"의 기록이다. 나중에 스택을 바꾸고 싶어질 때, 과거의 판단 근거를 여기서 확인한다.

---

## 1. 확정 스택

| 구분 | 선택 | 한 줄 이유 |
|------|------|-----------|
| 사이트 생성 방식 | **정적 사이트 생성(SSG)** | 페이지를 미리 HTML로 만들어 둠 → 검색엔진이 읽기 쉽고 빠름 |
| 프레임워크 | **Astro** (최신 안정 버전) | 페이지 파일 = URL, 헤더/푸터 재사용, 기본적으로 JS를 거의 안 실음 |
| 언어 | HTML / CSS / **TypeScript** | 계산 로직은 TS로 작성해 오타·타입 실수를 컴파일 단계에서 잡음 |
| 스타일 | **순수 CSS** + CSS 변수 (`global.css` + 컴포넌트 `<style>`) | 프레임워크 학습 부담 없이 기본기 습득, 반응형은 media query |
| 계산기 상호작용 | Astro `<script>` (필요한 페이지에만) 또는 경량 아일랜드 | 계산기 하나 = 작은 순수 함수 + 입력/출력 바인딩. 무거운 상태관리 불필요 |
| 계산 로직 | `src/lib/*.ts` 순수 함수 | UI와 분리 → 재사용·테스트 쉬움 |
| 데이터 | `src/data/calculators.ts` (배열) | 계산기 목록·메타데이터를 한 파일에서 관리 |
| SEO 보조 | `@astrojs/sitemap` 플러그인 | `sitemap.xml` 자동 생성 |
| 패키지 매니저 | npm | Node.js에 기본 포함, 초보자 자료 가장 많음 |
| 형상관리 | Git + GitHub | 코드 저장 + 배포 트리거 |
| 배포 / 호스팅 | **Vercel** (대안: Netlify, Cloudflare Pages) | GitHub 연결 시 push하면 자동 배포, HTTPS·CDN 무료 |
| 도메인 | 1차: 배포사 기본 도메인 → 이후 커스텀 도메인 구매 | 커스텀 도메인은 광고·SEO 신뢰도에 유리 |

> "최신 안정 버전"으로 적은 이유: 문서가 오래돼도 특정 버전에 묶이지 않도록. 실제 설치 버전은 아래 6번에 기록한다.

---

## 2. 각 선택의 이유 (조금 더 길게)

### 왜 정적 사이트(SSG)인가
계산기 페이지는 대부분 **내용이 고정**되어 있고, 계산만 브라우저에서 처리하면 된다.
서버가 매 요청마다 페이지를 만들 필요가 없다. 미리 만들어 둔 HTML을 CDN에서 그대로 내려주면:
- 검색봇이 자바스크립트 실행 없이 바로 내용을 읽는다 → 색인 잘 됨
- 로딩이 빠르다 → SEO 점수(Core Web Vitals)와 사용자 만족에 유리
- 서버 비용이 사실상 0

### 왜 Astro인가
- **파일 기반 라우팅**: `src/pages/calc/bmi.astro` 파일을 만들면 그게 곧 `/calc/bmi` 주소.
- **컴포넌트 재사용**: 헤더·푸터·SEO 태그·광고 자리를 한 번만 만들어 모든 페이지가 가져다 씀. 한 곳 고치면 전부 반영.
- **기본이 "JS 0"**: React처럼 페이지 전체를 자바스크립트로 그리지 않는다. 계산기처럼 상호작용이 필요한 조각에만 스크립트를 붙인다(아일랜드). → 가볍고 빠름.
- **입문 난이도**: HTML을 아는 사람이 컴포넌트 개념만 얹으면 시작할 수 있다.

### 왜 순수 CSS로 시작하나
Tailwind 같은 도구도 좋지만, 초보 단계에서는 CSS 자체(레이아웃, 반응형, 변수)를 익히는 게 남는다.
디자인 값은 [30-design-guide.md](./30-design-guide.md)에서 CSS 변수로 관리하므로, 나중에 Tailwind로 옮겨도 토큰은 그대로 쓸 수 있다.

### 왜 계산 로직을 함수로 분리하나
`calcBmi(heightCm, weightKg)` 처럼 화면과 무관한 함수로 두면:
- 같은 로직을 여러 곳(페이지, 테스트, 미리보기)에서 재사용
- 나중에 자동 테스트를 붙이기 쉬움
- 화면 코드가 "입력 받기 → 함수 호출 → 결과 표시"로 단순해짐

---

## 3. 검토했지만 지금 쓰지 않는 것

| 후보 | 왜 지금은 아닌가 | 언제 다시 볼까 |
|------|------------------|----------------|
| Next.js / React | 배울 개념(React, 라우팅, 빌드, 렌더링 모드)이 많음. 계산기 사이트엔 과함 | 로그인·회원 기능·서버 DB·대시보드가 필요해질 때 |
| 순수 HTML만 (프레임워크 없음) | 계산기 20개면 헤더/푸터를 20번 복사. 한 곳 고치면 20곳 수정 | 페이지가 3~4개로 영영 안 늘어날 때만 |
| Tailwind CSS | 초기엔 클래스 문법·설정 학습 비용. CSS 기본기부터 | 컴포넌트가 많아지고 스타일 반복이 심해질 때 |
| WordPress | 서버·플러그인·보안 관리 부담, 속도 튜닝 어려움, 계산기는 커스텀 개발 필요 | 블로그성 콘텐츠 비중이 커질 때(그래도 비권장) |
| React 상태관리 라이브러리(Redux 등) | 계산기 하나의 상태는 입력값 몇 개뿐. 불필요 | 해당 없음 |
| 별도 백엔드 서버 | 저장할 사용자 데이터가 없음 | 환율·유가 등 실시간 데이터 API 중계가 필요할 때(서버리스 함수로 최소화) |

---

## 4. 설치해야 할 도구

| 도구 | 용도 | 비고 |
|------|------|------|
| [Node.js](https://nodejs.org) LTS | Astro 실행·빌드 환경 | LTS(짝수 버전) 설치. 설치 시 npm 포함 |
| [VS Code](https://code.visualstudio.com) | 코드 편집기 | 확장: "Astro", "Prettier" |
| [Git](https://git-scm.com) | 버전 관리 | 설치 후 `git config`로 이름·이메일 설정 |
| GitHub 계정 | 원격 저장소 + 배포 연결 | |
| 크롬 브라우저 | 개발자도구로 반응형·성능(Lighthouse) 확인 | |
| Vercel 계정 | 배포 | GitHub 계정으로 로그인 |

터미널 확인용 명령: `node -v`, `npm -v`, `git --version` 이 버전 번호를 출력하면 준비 완료.

---

## 5. 사용할 라이브러리 (계획)

최소로 유지한다. 하나 추가할 때마다 "정말 필요한가"를 묻는다.

| 라이브러리 | 용도 | 필수? |
|-----------|------|-------|
| `astro` | 프레임워크 | 필수 |
| `@astrojs/sitemap` | `sitemap.xml` 자동 생성 | 필수(SEO) |
| `prettier` + `prettier-plugin-astro` | 코드 자동 정렬 | 권장 |
| (나중) `@astrojs/rss` | 네이버용 RSS 피드 생성 | 콘텐츠/글이 쌓이면 |
| (나중) 날짜 라이브러리 | 날짜 계산기용. 우선 표준 `Date`로 시도, 부족하면 도입 | 조건부 |
| `vitest` (dev) | `src/lib/*.test.ts` 계산 함수 테스트. `npm test` | 도입됨 (금융 계산 회귀 방지) |

---

## 6. 실제 설치 버전 기록

| 항목 | 버전 | 비고 |
|------|------|------|
| Node.js | 24.20.0 | PC에 기존 설치본 사용. `C:\Program Files\nodejs` 를 PATH에 추가 |
| npm | 11.19.0 | |
| astro | ^7.3.1 | `import { defineConfig } from 'astro/config'` |
| @astrojs/sitemap | ^3.7.4 | `sitemap-index.xml` + `sitemap-0.xml` 생성 |
| prettier / prettier-plugin-astro | ^3.9.6 / ^0.14.1 | |
| vitest | ^5.0.0 | `npm test` → `vitest run`. 테스트 파일: `src/lib/*.test.ts` |
| sharp | (astro 의존성) | `scripts/generate-og.mjs` 에서 OG 이미지 생성에 사용 |

- `package.json` 에 `allowScripts: { "esbuild@0.28.2": true }` — npm 11+ 의 설치 스크립트 승인 기능.
  최초 `npm install` 후 `npm install-scripts approve esbuild` 로 승인함.
- `astro.config.mjs`: `site` = 배포 도메인, `trailingSlash: 'never'`, `build.format: 'file'` (URL 을 `/calc/bmi` 형태로).
- `vercel.json`: `{ "cleanUrls": true, "trailingSlash": false }`.

---

## 7. 스택을 바꿀 때 영향 범위

| 바꾸는 것 | 영향받는 문서 / 부분 |
|-----------|----------------------|
| 프레임워크(Astro → 다른 것) | [11-folder-structure.md](./11-folder-structure.md), [12-page-structure.md](./12-page-structure.md) 전면 수정 |
| 스타일 방식(CSS → Tailwind 등) | [30-design-guide.md](./30-design-guide.md)의 "구현 매핑" |
| 배포처(Vercel → 다른 곳) | 배포 문서(추후 `44-deployment.md`), `robots.txt`의 사이트 URL |

## 변경 이력

| 날짜 | 변경 내용 |
|------|-----------|
| 2026-09-07 | 최초 작성. Astro + 순수 CSS + Vercel로 확정 |
| 2026-09-07 | 설치 완료(§6): Node 24.20.0 / Astro 7.3.1. Vercel 배포, `vercel.json` 추가. OG 이미지 생성에 sharp 사용 |
| 2026-09-07 | vitest 도입. `src/lib/*.test.ts` (8파일 72케이스). GA4·커스텀 도메인·관련 계산기 링크 반영 |
