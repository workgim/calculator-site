/**
 * 사이트 전역 상수. 페이지·컴포넌트가 여기서 값을 가져다 쓴다.
 * 배포 도메인이 정해지면 `url` 을 astro.config.mjs 의 `site` 와 똑같이 맞춘다.
 * (docs/20-seo-google.md §3 #5)
 */
export const SITE = {
  name: '생활 계산기',
  description:
    '연봉 실수령액, BMI, 부가세, 만 나이 등 일상에 필요한 계산기를 한곳에서 빠르게.',
  url: 'https://lifecalcmate.com', // 커스텀 도메인 연결 시 이 값 교체 (astro.config.mjs 의 site 와 동일하게)
  locale: 'ko_KR',
  lang: 'ko',
  author: 'WorkGim',
  /** 기본 Open Graph 이미지 (public/ 기준 절대경로) */
  ogImage: '/images/og-default.png',
  /**
   * 검색엔진 소유확인용 HTML 태그의 content 값. (docs/20 §7, docs/21 §4)
   * 값이 있으면 Head.astro 가 <meta> 를 출력한다. 확인 후에도 그대로 두면 된다.
   */
  verification: {
    google: 'OzP_NcNWR0pvjoqgmzIKtVNS4ajqJ87kqeamfdRGTcg',
    naver: 'a228612f91c6bebefda230688800ee098dead29f',
  },
  /**
   * Google Analytics 4 측정 ID (예: 'G-XXXXXXXXXX').
   * 값이 있으면 Analytics.astro 가 스크립트를 삽입하고, privacy.astro 에 쿠키 고지가 나온다.
   * 비워두면 분석 코드가 전혀 로드되지 않는다.
   */
  gaId: 'G-HC8HX39ETH',
  /**
   * 공개 문의용 이메일. 개인 메일 대신 전용 주소 권장 (예: lifecalcmate.help@gmail.com).
   * 비워두면 /contact 에 "준비 중"으로 표시된다.
   */
  contactEmail: 'workgim3230@gmail.com',
} as const;
