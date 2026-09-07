# 생활 계산기 사이트 (calculator-site)

다양한 생활 계산기를 제공하는 반응형 정적 웹사이트.

## 기술 스택

Astro + 순수 CSS + TypeScript. 자세한 내용은 [docs/10-tech-stack.md](docs/10-tech-stack.md).

## 개발 명령

| 명령 | 설명 |
|------|------|
| `npm install` | 의존성 설치 (최초 1회) |
| `npm run dev` | 개발 서버 실행 → http://localhost:4321 |
| `npm run build` | `dist/` 에 정적 사이트 빌드 |
| `npm run preview` | 빌드 결과 미리보기 |

## 설계 문서

`docs/` 폴더에 모든 규칙이 있습니다. 코드보다 문서가 먼저입니다.

- [docs/README.md](docs/README.md) — 문서 목차
- [00-overview](docs/00-overview.md) · [02-calculator-catalog](docs/02-calculator-catalog.md)
- [11-folder-structure](docs/11-folder-structure.md) · [12-page-structure](docs/12-page-structure.md)
- [20-seo-google](docs/20-seo-google.md) · [21-seo-naver](docs/21-seo-naver.md) · [30-design-guide](docs/30-design-guide.md)

## 계산기 추가 방법

파일 3개만 만지면 됩니다. [docs/11-folder-structure.md](docs/11-folder-structure.md) §4 참고.

1. `src/lib/<slug>.ts` — 계산 함수
2. `src/pages/calc/<slug>.astro` — 화면
3. `src/data/calculators.ts` — 목록에 한 줄 추가
