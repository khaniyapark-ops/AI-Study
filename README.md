# 유지관리 사업 Agentic AI 교육 자료

SI·IT 유지관리 사업의 7개 직무(관리자 · 기획자 · 운영자 · 개발자 · S/W · N/W · H/W 엔지니어)를 위한 **Agentic AI(에이전트형 AI) 교육 패키지**입니다.
체험 중심의 기본 과정(6시간), 직접 만들고 통제하는 심화 과정(2일), 그리고 이를 받쳐 주는 발전 과정·용어집·보안 판단·환경 준비 자료로 구성됩니다.

> **공개 페이지**: https://khaniyapark-ops.github.io/AI-Study/ — 실데모와 웹 용어집은 브라우저에서 바로 실행, 슬라이드는 내려받기

> 하루 내내 반복하는 두 문장 — **챗봇은 대답하고, 에이전트는 일한다 · 읽기는 맡기고, 쓰기는 승인한다**
> 심화 과정의 한 문장 — **모델은 제안하고, 하니스가 결정한다**

## 폴더 구성

| 경로 | 내용 | 주 대상 |
|---|---|---|
| [커리큘럼.md](커리큘럼.md) | 기본 과정 6시간 시간표, 직무별 목표, 강사 메모 | 강사 · PM |
| [AI교육_유지관리.pptx](AI교육_유지관리.pptx) | 기본 과정 슬라이드 34장 (발표자 노트 포함) | 강사 |
| [실습키트_Agentic.md](실습키트_Agentic.md) | 언플러그드 게임 카드, 데모 실험 스크립트, Claude Code 관찰 기록지, 설계 캔버스, 회상 퀴즈 | 강사 · 수강생 |
| [demo/index.html](demo/index.html) | 실데모 8종. 탭 8은 실제로 도는 **에이전트 실습실**. 브라우저로 열면 됨 (오프라인 재생 가능) | 전원 |
| [sample-system/](sample-system/README.md) | 실습용 가상 정산 시스템 (티켓 · 장애 로그 · 버그 코드, 테스트 1건 실패가 시작 상태) | 전원 |
| [advanced/](advanced/심화_커리큘럼.md) | **심화 과정 2일**: 커리큘럼, 슬라이드 40장, 트랙별 실습 가이드, 시나리오 교체 가이드 | 강사 · 수강생 |
| [advanced/agent_lab/](advanced/agent_lab/README.md) | 에이전트 실습 키트: 하니스(루프 + 가드레일 + 감사 로그), 직무별 도구팩, 평가기, 마스킹, 양식 기반 도구팩 생성기 | 기술 트랙 |
| [evolution/](evolution/강의진행안.md) | Agentic AI로 **발전하는 과정**: 슬라이드 20장 + 강의 진행안 (60/90분) | 전원 · 관리자 |
| [glossary/](glossary/README.md) | **핵심 용어집** 35개: 카드집, A4 요약표, 웹 용어집(검색 · 퀴즈), 사업 용어 표준안 | 전원 |
| [security/](security/AI도입_보안판단가이드.md) | **망분리 · 폐쇄망 · 규정 환경 보안 판단** 가이드 + 슬라이드 9장 | PM · 관리자 · 보안 담당 |
| [setup/](setup/수강생_환경준비.md) | **수강생 환경 준비** (Windows · macOS) + 사전 점검 스크립트 | 수강생 · 강사 |
| [형상관리_규칙.md](형상관리_규칙.md) · [CHANGELOG.md](CHANGELOG.md) | 형상 항목, 기준선(태그), 변경 절차, 커밋 규칙 · 변경 이력과 알려진 한계 | 자료 관리자 |

## 권장 진행 순서

| 시점 | 할 일 | 자료 |
|---|---|---|
| 교육 3~4주 전 | 고객사 보안 지침 확인, 적용 유형(A~E) 결정 | `security/AI도입_보안판단가이드.md` |
| 교육 1주 전 | 수강생에게 환경 준비 안내 배포, 점검 결과 회신받기 | `setup/수강생_환경준비.md`, `setup/check_env.py` |
| 교육 1주 전 | 사전 학습: 웹 용어집 ★ 필수 7개 + 퀴즈 | `glossary/웹용어집.html` |
| 기본 과정 (6시간) | 경험 → 이름 붙이기 → 해보기 → 설계 → 회상 | `커리큘럼.md` |
| (선택) 관리자 세션 | 발전 과정과 조직 성숙도 자가진단 | `evolution/` |
| 심화 과정 (2일) | 하니스 · 도구 설계 · 가드레일 · 평가 · 거버넌스, 캡스톤 | `advanced/심화_커리큘럼.md` |
| 수료 후 | 실제 사업 사례로 시나리오 교체, 파일럿 L1~L2 착수 | `advanced/시나리오_교체가이드.md` |

## 빠른 시작 (5분)

1. 브라우저로 `demo/index.html`을 엽니다 → 탭 **8. ★ 에이전트 실습실**에서 "A. 챗봇처럼 묻기" → "B. 에이전트에게 맡기기"를 누릅니다.
2. 환경을 점검합니다.

| Windows (PowerShell) | macOS (터미널) |
|---|---|
| `py -3 setup\check_env.py` | `python3 setup/check_env.py` |

3. 에이전트를 모의 실행합니다 (키 · 인터넷 불필요).

| Windows | macOS |
|---|---|
| `cd advanced\agent_lab` | `cd advanced/agent_lab` |
| `py -3 agent.py --pack settle --mock` | `python3 agent.py --pack settle --mock` |
| `py -3 eval.py` | `python3 eval.py` |

## 역할별로 먼저 볼 것

| 역할 | 먼저 볼 것 |
|---|---|
| 강사 | `커리큘럼.md` → `실습키트_Agentic.md` → `setup/수강생_환경준비.md`의 "당일 대체 진행" |
| PM · 관리자 | `evolution/` → `security/` → `advanced/심화_실습가이드.md` 트랙 M |
| 보안 담당 | `security/AI도입_보안판단가이드.md` → `advanced/agent_lab/mask.py` |
| 운영 · N/W · H/W | `advanced/시나리오_교체가이드.md` → `advanced/agent_lab/specs/dbbackup.json` (양식 예시) |
| 개발 · S/W | `advanced/agent_lab/README.md` → `harness.py` |

## 검증 상태 (2026-11-20 기준)

| 항목 | 상태 |
|---|---|
| 심화 실습 모의 평가 | ✅ 10/10 통과 (양식 예시 2개 포함, 라이브 전용 1개 제외) |
| 심화 실습 라이브 (실제 Claude) | ✅ 단일 실행 · 평가 9/9 · 압박 목표 재검증 2/2 통과. 단, **케이스당 1회**만 실행 |
| 마스킹 규칙 | ✅ 테스트 8건 통과. 이름·주소 등 형식 없는 정보는 자동으로 잡지 못함 (설계상 한계) |
| Windows 호환 | ⚠️ macOS에서 cp949 출력 환경을 흉내 내 점검만 함. **실제 Windows PC 검증 필요** |
| 기본 과정 웹 데모 라이브 모드 | ⚠️ API 연결(인증 오류 응답)까지만 확인. **실제 키로 미시험** |
| 슬라이드 (기본 34 · 심화 40 · 발전 20 · 보안 9 · 용어 카드 46) | ✅ 전체 렌더링 점검과 파일 검증 통과 (LibreOffice 기준) |
| 시나리오 | ⚠️ 모두 가상 데이터. N/W · H/W 명령 체계는 현업 검토 전 |

## 자료 다시 만들기

| 자료 | 원본 | 명령 |
|---|---|---|
| 슬라이드 4종 | `.slides_build.js`, `advanced/.slides_build_adv.js`, `evolution/.build_slides.js`, `security/.build_slides.js` (숨김 파일) | `npm install pptxgenjs` 후 `node <스크립트>` → 실행한 폴더에 .pptx 생성 |
| 용어 카드집 · 요약표 | `glossary/terms.json` | `node glossary/.build_cards.js` |
| 웹 용어집 | `glossary/terms.json` | `python3 glossary/build_web.py` |
| 양식 기반 도구팩 | `advanced/agent_lab/specs/*.json` | `python3 advanced/agent_lab/new_pack.py specs/<파일>.json` |

- 슬라이드 스크립트는 테마 색 적용 도구(환경변수 `APPLY_THEME`)가 없으면 Office 기본 색으로 저장됩니다. 내용은 같고 색만 다릅니다.

## 모델 · 단가가 바뀌면 고칠 곳

자료는 **Claude Opus 5.5** (입력 $4 / 출력 $20, 100만 토큰당, 2026-11 기준)로 작성했습니다. 바뀌면 아래를 함께 고치세요.
- 모델 이름: `demo/index.html`(`MODEL`), `advanced/agent_lab/harness.py`(`MODEL`), `커리큘럼.md`, `실습키트_Agentic.md`, `advanced/심화_커리큘럼.md`, `advanced/심화_실습가이드.md`, `advanced/agent_lab/README.md`, 심화 슬라이드 스크립트
- 단가·실측 비용: `advanced/심화_실습가이드.md`(M-4), `advanced/agent_lab/README.md`, 심화 슬라이드 스크립트(비용 슬라이드), `glossary/사업용어_표준안.md`(예문)
- 바꾼 뒤에는 `python3 advanced/agent_lab/eval.py --live`로 다시 평가하세요. 모델이 바뀌면 행동도 바뀝니다.

## 주의

- **API 키**는 터미널이나 브라우저 입력란에만 넣고, 파일에 저장하지 마세요. 교육용 임시 키를 쓰고 교육 후 폐기하세요.
- 실습 데이터는 모두 **가상**입니다. 실제 고객 데이터를 쓰려면 보안 판단 → 마스킹 → 사람 확인 → 승인을 거치세요 (`advanced/시나리오_교체가이드.md`).
- 효과 수치(절감률 등)는 자료에 넣지 않았습니다. 파일럿의 감사 로그로 실측해 보고하세요.
- 용어 표기는 `glossary/사업용어_표준안.md`를 따릅니다.
