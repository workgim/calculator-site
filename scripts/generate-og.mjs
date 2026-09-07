/**
 * 기본 Open Graph 이미지(1200×630 PNG)를 생성한다.
 * 브랜딩이 바뀌면 이 파일의 SVG 를 고치고 `node scripts/generate-og.mjs` 를 다시 실행한다.
 * 결과물: public/images/og-default.png (git 에 커밋)
 */
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const root = path.dirname(fileURLToPath(new URL('.', import.meta.url)));
const outDir = path.join(root, 'public', 'images');
const outFile = path.join(outDir, 'og-default.png');

const W = 1200;
const H = 630;

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1d4ed8"/>
      <stop offset="1" stop-color="#2563eb"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect x="72" y="80" width="150" height="180" rx="16" fill="#ffffff"/>
  <rect x="94" y="104" width="106" height="40" rx="8" fill="#2563eb"/>
  <g fill="#2563eb">
    <rect x="94" y="160" width="28" height="28" rx="6"/>
    <rect x="133" y="160" width="28" height="28" rx="6"/>
    <rect x="172" y="160" width="28" height="28" rx="6"/>
    <rect x="94" y="198" width="28" height="28" rx="6"/>
    <rect x="133" y="198" width="28" height="28" rx="6"/>
    <rect x="172" y="198" width="28" height="28" rx="6"/>
  </g>
  <text x="72" y="400" font-family="Malgun Gothic, 'Apple SD Gothic Neo', sans-serif"
        font-size="104" font-weight="700" fill="#ffffff">생활 계산기</text>
  <text x="74" y="470" font-family="Malgun Gothic, 'Apple SD Gothic Neo', sans-serif"
        font-size="40" fill="#dbeafe">연봉·대출·부가세·BMI·D-day 등 일상 계산기 모음</text>
</svg>`;

mkdirSync(outDir, { recursive: true });
await sharp(Buffer.from(svg)).png().toFile(outFile);
console.log('생성 완료:', path.relative(root, outFile));
