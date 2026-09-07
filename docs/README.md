# 문서 목록 (docs/)

사이트를 만들기 전에 정해두는 "규칙 모음"입니다.
코드보다 이 문서가 먼저입니다. 규칙이 바뀌면 **먼저 이 문서를 고치고**, 그 다음 코드를 맞춥니다.

- 배포 주소: <https://lifecalcmate.com> (커스텀 도메인, `.vercel.app` → 308 리다이렉트)
- 진행 상황(2026-09-07): 1~12단계 완료. 계산기 6개(`bmi` `percentage` `vat` `dday` `loan` `salary-net`).
  이후: 금액칸 콤마·증감 버튼, 관련 계산기 내부 링크, sitemap lastmod, 커스텀 도메인,
  GA4 플러밍(`site.ts` `gaId` 채우면 활성). 다음: `savings` 계산기, GA4 측정 ID 입력.

## 목차

| 파일 | 내용 | 상태 |
|------|------|------|
| [00-overview.md](./00-overview.md) | 사이트 목표 / 타겟 사용자 / 1차 버전 범위 | 작성됨 |
| [02-calculator-catalog.md](./02-calculator-catalog.md) | 만들 계산기 후보 목록 (카테고리 · 검색 키워드 · 공식 출처) | 작성됨 (계속 갱신) |
| [10-tech-stack.md](./10-tech-stack.md) | 사용할 기술과 이유, 설치 도구 | 작성됨 |
| [11-folder-structure.md](./11-folder-structure.md) | 폴더 구조, 파일=URL 규칙, 계산기 추가 절차 | 작성됨 |
| [12-page-structure.md](./12-page-structure.md) | 웹 페이지 / HTML 문서 구조, 공통 레이아웃 | 작성됨 |
| [20-seo-google.md](./20-seo-google.md) | 구글 SEO 구현 명세 (가이드 바뀌면 이 문서만 고침) | 작성됨 |
| [21-seo-naver.md](./21-seo-naver.md) | 네이버 SEO 구현 명세 (가이드 바뀌면 이 문서만 고침) | 작성됨 |
| [30-design-guide.md](./30-design-guide.md) | 색 · 타이포 · 여백 · 컴포넌트 스타일 토큰 | 작성됨 |

## 아직 안 만든 문서 (나중에 채움)

`01-roadmap`, `13-coding-conventions`, `14-workflow`,
`22-seo-page-checklist`, `23-content-guide`,
`31-responsive-guide`, `32-accessibility`,
`40-legal-pages`, `41-ads-adsense`, `42-analytics`, `43-performance`, `44-deployment`

> 파일 번호는 띄엄띄엄 매겨서 중간에 새 문서를 끼워넣을 수 있게 했습니다.
