# 🧪 Markdown 기반 API 테스트케이스 자동 생성기

API 명세가 Markdown으로 주어지면, 이를 기반으로 테스트 시나리오(TC)를 자동 생성해주는 QA 도구입니다.  
AI를 활용하여 **스펙 → 테스트케이스 → 자동화 코드**의 첫 단계를 자동화합니다.

---

## ✨ 주요 기능

- ✅ Markdown 형식의 API 명세 입력
- ✅ 입력된 명세로부터 자동 테스트케이스(TC) 생성
- ✅ TC는 QA 업무에 적합한 시나리오로 정리됨
- ✅ 파일 업로드 (.md/.txt) 지원
- ✅ 향후 GPT/Gemini API 연동으로 AI 기반 시나리오 강화 예정

---

## 🧑‍💻 사용법

### 1. 설치
```bash
npm install
```

### 2. 실행
```bash
npm run dev
```

### 3. 사용
- 웹 UI에서 Markdown 입력 or 파일 업로드
- 자동으로 테스트케이스 테이블이 생성됩니다

---

## 📁 프로젝트 구조

```
src/
├── App.tsx                        # 메인 컴포넌트
├── components/
│   ├── MarkdownEditor.tsx        # 에디터 및 파일 업로드
│   ├── TestCaseTable.tsx         # TC 테이블 출력
│   └── ui/
│       ├── textarea.tsx
│       ├── table.tsx
│       └── card.tsx
├── utils/
│   └── parseMarkdownToTCs.ts     # 마크다운 → TC 파서
```

---

## 🧠 AI 프롬프트 전략 (추후 적용 시)

- 각 서비스(G마켓, 쿠팡 등)에 특화된 프롬프트 구성
- QA 전문가 시나리오 형식으로 프롬프트 설계
- 민감한 프롬프트는 `.env` 또는 `promptStore.json` 등으로 안전하게 관리
- 프론트엔드에 직접 프롬프트 노출하지 않음 (백엔드에서만 사용)

```env
# 예시 .env
GMARKET_PROMPT="너는 G마켓의 API QA 전문가야. 다음 스펙으로 TC를 작성해줘..."
COUPANG_PROMPT="쿠팡 장바구니 API 테스트케이스 생성해줘..."
```

```gitignore
# 예시 .gitignore
.env
promptStore.json
```

---

## 🔧 기술 스택

- **React + TypeScript**
- **Vite**: 빠른 개발 서버와 빌드 환경
- **TailwindCSS**: 빠른 UI 스타일링
- **OpenAI GPT** / **Gemini API** (추후 연동 예정)

---

## 📌 향후 개선 계획

- [ ] GPT API 연동으로 고도화된 TC 생성
- [ ] G마켓, 쿠팡 등 특화 프롬프트 지원
- [ ] 생성된 TC 기반 자동 테스트 코드 생성기
- [ ] TC 다운로드 (.csv / .json)
- [ ] 프롬프트 관리 인터페이스 및 사용자 커스터마이징

---

## 🛡️ 보안 주의사항

- 모든 프롬프트/키는 `.env` 혹은 비공개 스토리지에 저장
- Git에 민감 정보 커밋하지 않도록 `.gitignore` 설정 필수
- 프론트엔드에서는 프롬프트나 API Key 노출 절대 금지

---

## 🧩 예시 입력 (Markdown)

```md
### POST /api/login

- 요청 바디:
  - email: string, required
  - password: string, required

- 성공 응답:
  - status: 200
  - body: { token: string }

- 실패 응답:
  - status: 401
  - body: { error: 'Invalid credentials' }
```

---
