# 01. 로드맵

- 최종 수정일: 2026-09-07

지금까지 한 것과 앞으로 할 순서. 우선순위·완료 현황은 [02-calculator-catalog.md](./02-calculator-catalog.md)와 함께 본다.

---

## 완료 (2026-09-07 기준)

- **1~12단계** (환경 세팅 → Astro 프로젝트 → 공통 레이아웃 → 홈 → 배포 → 커스텀 도메인 `lifecalcmate.com` → 검색엔진 등록)
- **계산기 16개** — 추천 제작 순서 1~12 + Tier 2~3 일부(날짜/평↔㎡/글자수/기초대사량). 카테고리 5개.
- **인프라**: 금액칸 콤마·빠른 증감 버튼(`AmountInput`), 관련 계산기 내부 링크, sitemap `lastmod`,
  기본 OG 이미지, GA4(`G-64XL4FTB03`, 지연 로드), `about`/`contact`/`privacy`,
  Vitest 테스트(`npm test`, 137케이스), Lighthouse 모바일 100.

---

## 다음 (가까운 순)

### A. 디자인 보강 (사용자 우선순위)

- 현재는 [30-design-guide.md](./30-design-guide.md) 토큰 기반의 최소 스타일. 기능은 다 되지만 밋밋함.
- 후보: 홈 히어로 영역, 계산기 카드/결과 박스 시각적 강화, 헤더/푸터 정돈, 카테고리 아이콘,
  결과 강조(색·타이포), 여백·구분선 정리, (선택) 다크 모드.
- 규칙: 새 색·간격 값이 필요하면 **먼저 `30-design-guide.md`에 토큰 추가 → `global.css` 정의 → 사용.**
  하드코딩 금지, Lighthouse 100·CLS 0 유지.

### B. 계산기 종류 확대 (사용자 우선순위)

- Tier 2~3 남은 것: `discount`(할인가) · `unit-converter`(단위 변환, 크게 별도) ·
  `electricity-bill`(전기요금, 여름 시즌) · `unemployment-benefit`(실업급여) ·
  `jeonse-wolse`(전월세 전환) · `dsr` · `income-tax`(5월) · `due-date`(출산예정일) · `gpa` 등
- 새 종류 아이디어도 환영 (사용자가 추가하고 싶어함) → [02-calculator-catalog.md](./02-calculator-catalog.md)에 후보로 먼저 등록
- 추가 절차는 [11-folder-structure.md](./11-folder-structure.md) §4 (파일 3개 + `*.test.ts`)

### B-2. 기존 16개 페이지 콘텐츠 개편 (SEO)

- **[23-content-guide.md](./23-content-guide.md)** 에 16개 계산기 각각의 제목·설명·H2 개요·"자주 찾는 값" 표·FAQ·내부링크·타깃 키워드가 정리돼 있음.
- 먼저 공통 작업(1회): `Head.astro` `seoTitle` 지원, `CalculatorLayout` `related` 필드, `<Faq>` 컴포넌트 + `.faq` 스타일, "자주 찾는 값" 표 패턴.
- 그다음 우선순위대로 페이지별 본문·표·FAQ 채우기 (23번 §1.8 주차별 안).
- "자주 찾는 값" 표는 **손으로 숫자 쓰지 말고 `lib` 함수로 빌드타임 계산**.

### C. FAQ 섹션 — **후순위** (사용자가 미룸)

- `<Faq>` 컴포넌트(`<details>` 아코디언 + 선택적 `FAQPage` JSON-LD) 만들고 계산기별 Q&A 배열 작성.
- DB·백엔드 불필요 (운영자가 쓰는 고정 텍스트). 롱테일 검색·체류시간·애드센스 콘텐츠 보강 효과.

### D. 색인·트래픽 관찰

- Search Console에서 주요 페이지 색인 확인 (2~4주 소요). `/calc/dday`, `/calc/percentage`는 색인 요청 미완료(할당량) → 나중에.
- GA4 실시간·표준 보고서에서 유입 확인.

---

## AdSense 신청 준비 (약 3~5주 뒤)

신청 전 충족할 것:

- [ ] 주요 페이지가 구글에 색인됨 (Search Console 확인)
- [ ] 계산기 20개 이상 + 각 페이지 설명 텍스트 충분 (FAQ 있으면 더 안전)
- [ ] 사이트가 3~4주 이상 운영됨 (확립된 사이트로 보이게)
- [ ] 소량이라도 자연 유입 발생
- [x] `privacy` / `about` / `contact` 페이지, 명확한 내비게이션, 자체 도메인, HTTPS

신청 시:
1. adsense.google.com → 사이트 `lifecalcmate.com` 등록
2. `<head>`에 확인 코드 삽입 (GA·소유확인과 같은 `site.ts` 패턴으로 추가)
3. `privacy.astro`에 **광고 쿠키 문단 추가** (승인/게재 시점에)
4. 승인되면 `AdSlot.astro` 안에 광고 코드 삽입 + `public/ads.txt` 추가

세부는 나중에 `41-ads-adsense.md`로 분리.

---

## 변경 이력

| 날짜 | 변경 |
|------|------|
| 2026-09-07 | 최초 작성. 완료 현황 + 디자인/계산기/FAQ/애드센스 순서 정리 |
