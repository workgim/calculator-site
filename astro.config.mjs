// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// ─────────────────────────────────────────────────────────────
// 사이트 전역 빌드 설정
// - site: 최종 배포 도메인. sitemap.xml 과 canonical URL 의 기준이 된다.
//   TODO(11~12단계): 배포 후 실제 도메인으로 교체. (docs/20-seo-google.md §3 #5, #9)
// - trailingSlash + build.format: URL 을 "/calc/bmi" 형태(끝 슬래시 없음)로 통일.
//   (docs/11-folder-structure.md §3, docs/20-seo-google.md §3 #11)
// ─────────────────────────────────────────────────────────────
export default defineConfig({
  site: 'https://example.com',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  integrations: [sitemap()],
});
