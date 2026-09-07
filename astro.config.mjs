// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { CALCULATORS } from './src/data/calculators.ts';

// ─────────────────────────────────────────────────────────────
// 사이트 전역 빌드 설정
// - site: 최종 배포 도메인. sitemap.xml 과 canonical URL 의 기준이 된다.
//   커스텀 도메인을 붙이면 이 값을 그 도메인으로 교체. (docs/20-seo-google.md §3 #5, #9)
// - trailingSlash + build.format: URL 을 "/calc/bmi" 형태(끝 슬래시 없음)로 통일.
//   (docs/11-folder-structure.md §3, docs/20-seo-google.md §3 #11)
// - sitemap.serialize: 계산기 페이지에 lastmod(= calculators.ts 의 updated) 를 붙여
//   구글이 "최근 바뀐 페이지"를 우선 크롤링하게 한다. (docs/20-seo-google.md §3 #9)
// ─────────────────────────────────────────────────────────────
const BUILD_DATE = new Date().toISOString().slice(0, 10);
const UPDATED_BY_SLUG = new Map(CALCULATORS.map((c) => [c.slug, c.updated]));

export default defineConfig({
  site: 'https://lifecalcmate.com',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  integrations: [
    sitemap({
      serialize(item) {
        const match = item.url.match(/\/calc\/([^/]+)$/);
        item.lastmod = (match && UPDATED_BY_SLUG.get(match[1])) || BUILD_DATE;
        return item;
      },
    }),
  ],
});
