# 01. 로드맵

- 최종 수정일: 2026-09-08

지금까지 한 것과 앞으로 할 순서. 우선순위·완료 현황은 [02-calculator-catalog.md](./02-calculator-catalog.md)와 함께 본다.

---

## 완료 (2026-09-08 기준)

- **1~12단계** (환경 세팅 → Astro 프로젝트 → 공통 레이아웃 → 홈 → 배포 → 커스텀 도메인 `lifecalcmate.com` → 검색엔진 등록)
- **계산기 16개** — 추천 제작 순서 1~12 + Tier 2~3 일부(날짜/평↔㎡/글자수/기초대사량). 카테고리 5개.
- **인프라**: 금액칸 콤마·빠른 증감 버튼(`AmountInput`), 관련 계산기 내부 링크, sitemap `lastmod`,
  기본 OG 이미지, GA4(`G-HC8HX39ETH`, 지연 로드), `about`/`contact`/`privacy`,
  Vitest 테스트(`npm test`, 137케이스), Lighthouse 모바일 100.
- **콘텐츠·SEO 개편 (2026-09-08, 옛 B-2·C)** — 16개 페이지 전부 [23-content-guide.md](./23-content-guide.md) 스펙대로.
  공통: `Head.astro` `seoTitle`, `calculators.ts` `related`/`getRelated()`, `<Faq>` 컴포넌트(`<details>`, JSON-LD 없음), `.terms`/`.table-scroll`.
  페이지별: H2 섹션 재구성 + FAQ 4~6개 + "자주 찾는 값" 표(전부 `lib` 함수로 빌드타임 계산).
  날짜 3종(age·dday·date-add)은 표 대신 질문형 계산 예시.
- **디자인 보강 (2026-09-08, 옛 A)** — "앱 느낌" 중간 강도.
  캔버스/표면 층위(`--color-page`), 카드·표·버튼 그림자, `[계산하기]` 버튼 강조, 결과 박스 좌측 primary 라인,
  표 줄무늬 + 가로 스크롤 힌트(`--edge-fade`), 본문 H2 밑줄, 헤더/내비/홈 카테고리 정돈.
  **다크 모드** — `prefers-color-scheme` 자동 + 헤더 `ThemeToggle`(시스템/라이트/다크), `<html data-theme>` + `localStorage`, `<head>` 인라인 스크립트로 FOUC 방지.

---

## 다음 (가까운 순)

### B. 계산기 종류 확대 ← **2026-09-09 시작 예정**

- Tier 2~3 남은 것: `discount`(할인가) · `unit-converter`(단위 변환, 크게 별도) ·
  `electricity-bill`(전기요금, 여름 시즌) · `unemployment-benefit`(실업급여) ·
  `jeonse-wolse`(전월세 전환) · `dsr` · `income-tax`(5월) · `due-date`(출산예정일) · `gpa` 등
- 새 종류 아이디어도 환영 (사용자가 추가하고 싶어함) → [02-calculator-catalog.md](./02-calculator-catalog.md)에 후보로 먼저 등록
- 추가 절차는 [11-folder-structure.md](./11-folder-structure.md) §4 (파일 3개 + `*.test.ts`)
- **새 계산기도 처음부터** [23-content-guide.md](./23-content-guide.md) §1.2 틀대로: H2 섹션 + `<Faq>` + (해당되면) 빌드타임 표 + `related`.

### D. 색인·트래픽 관찰

- Search Console 노출·클릭·CTR·순위 확인 → 콘텐츠 개편 반응 파악(개편 후 약 4주 ≈ 2026-10월 초). [23-content-guide.md](./23-content-guide.md) §1.8.
- `/calc/dday`, `/calc/percentage`는 색인 요청 미완료(할당량) → 재시도. 개편으로 내용 바뀐 주요 페이지도 재색인 요청.
- GA4 실시간·표준 보고서에서 유입 확인.

---

## AdSense 신청 준비 (약 3~5주 뒤)

신청 전 충족할 것:

- [ ] 주요 페이지가 구글에 색인됨 (Search Console 확인)
- [ ] 계산기 20개 이상 (현재 16개) + 각 페이지 설명 텍스트 충분
- [x] 각 페이지 본문 H2 섹션 + FAQ (2026-09-08 16개 전부 완료)
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
| 2026-09-08 | A(디자인 보강 + 다크 모드)·B-2(16개 콘텐츠 개편)·C(FAQ) 완료로 이동. 다음은 B(계산기 확대, 09-09 시작)·D(색인 관찰). AdSense 체크리스트에 "본문+FAQ" 항목 체크 |
