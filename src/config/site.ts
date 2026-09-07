/**
 * 사이트 전역 상수. 페이지·컴포넌트가 여기서 값을 가져다 쓴다.
 * 배포 도메인이 정해지면 `url` 을 astro.config.mjs 의 `site` 와 똑같이 맞춘다.
 * (docs/20-seo-google.md §3 #5)
 */
export const SITE = {
  name: '생활 계산기',
  description:
    '연봉 실수령액, BMI, 부가세, 만 나이 등 일상에 필요한 계산기를 한곳에서 빠르게.',
  url: 'https://example.com', // TODO(11~12단계): 실제 배포 도메인으로 교체
  locale: 'ko_KR',
  lang: 'ko',
  author: 'WorkGim',
  /** 기본 Open Graph 이미지 (public/ 기준 절대경로) */
  ogImage: '/images/og-default.png',
} as const;
