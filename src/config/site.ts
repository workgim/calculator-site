/**
 * 사이트 전역 상수. 페이지·컴포넌트가 여기서 값을 가져다 쓴다.
 * 배포 도메인이 정해지면 `url` 을 astro.config.mjs 의 `site` 와 똑같이 맞춘다.
 * (docs/20-seo-google.md §3 #5)
 */
export const SITE = {
  name: '생활 계산기',
  description:
    '연봉 실수령액, BMI, 부가세, 만 나이 등 일상에 필요한 계산기를 한곳에서 빠르게.',
  url: 'https://calculator-site-lilac.vercel.app', // 커스텀 도메인 연결 시 이 값 교체 (astro.config.mjs 의 site 와 동일하게)
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
    google: 'WGE39f22aga1LUhyvbQIg1minUZv6tWDgRbt857wW3A',
    naver: 'e13380b3acd2711f9677cff39d14428b61cf7dca',
  },
} as const;
