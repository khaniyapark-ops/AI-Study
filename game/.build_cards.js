// "사람 에이전트" 게임 카드 (A4 세로, 한 쪽에 카드 4장 · 점선대로 자른다)
//   NODE_PATH=<pptxgenjs 가 있는 node_modules> node game/.build_cards.js
//   soffice --headless --convert-to pdf --outdir game game/사람에이전트_게임카드.pptx
// 원본 문안: 실습키트_Agentic.md 2장. 시나리오 데이터는 교육용 가상 데이터다.
const pptxgen = require("pptxgenjs");
const path = require("path");
const OUT = path.join(__dirname, "사람에이전트_게임카드.pptx");

const K = { ink: "1B2430", navy: "14213D", blue: "2A6F97", orange: "F2A33A", red: "D9534F", gray: "7A8B99",
  green: "2E9E6B", sky: "5B8DEF", pale: "EEF3F8", line: "C9D2DC", white: "FFFFFF" };
const FONT = "Arial";
const PW = 8.27, PH = 11.69, CW = PW / 2, CH = PH / 2;
const LIC = "© 2026 khaniyapark-ops · CC BY-NC-SA 4.0 · github.com/khaniyapark-ops/AI-Study";

const pres = new pptxgen();
pres.defineLayout({ name: "A4P", width: PW, height: PH });
pres.layout = "A4P";
pres.theme = { headFontFace: FONT, bodyFontFace: FONT };
pres.title = "사람 에이전트 게임 카드";

const T = (s, text, o) => s.addText(text, Object.assign({ fontFace: FONT, margin: 0, isTextBox: true, color: K.ink }, o));

// "## 제목" = 굵은 소제목, "- " = 글머리, "> " = 회색 메모, 그 밖 = 본문
function runs(lines, fs, accent) {
  const out = [];
  lines.forEach((l, i) => {
    const last = i === lines.length - 1;
    const o = { breakLine: !last, fontSize: fs };
    if (l.startsWith("## ")) out.push({ text: l.slice(3), options: Object.assign(o, { bold: true, color: accent, paraSpaceBefore: i ? 5 : 0 }) });
    else if (l.startsWith("- ")) out.push({ text: l.slice(2), options: Object.assign(o, { bullet: { indent: 11 } }) });
    else if (l.startsWith("> ")) out.push({ text: l.slice(2), options: Object.assign(o, { color: K.gray, fontSize: fs - 1.5, paraSpaceBefore: 4 }) });
    else out.push({ text: l, options: o });
  });
  return out;
}

function cutLines(s) {
  const dash = { color: "9AA5B1", width: 0.75, dashType: "dash" };
  s.addShape(pres.ShapeType.line, { x: CW, y: 0, w: 0, h: PH, line: dash });
  s.addShape(pres.ShapeType.line, { x: 0, y: CH, w: PW, h: 0, line: dash });
  T(s, "✂", { x: CW - 0.12, y: 0.05, w: 0.24, h: 0.2, fontSize: 9, color: "9AA5B1", align: "center" });
  T(s, "✂", { x: 0.05, y: CH - 0.1, w: 0.24, h: 0.2, fontSize: 9, color: "9AA5B1" });
}

// 카드 한 장: pos 0~3 (왼위 · 오위 · 왼아래 · 오아래)
function card(s, pos, c) {
  const x0 = (pos % 2) * CW, y0 = Math.floor(pos / 2) * CH;
  const m = 0.28, x = x0 + m, y = y0 + m, w = CW - 2 * m, h = CH - 2 * m;
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.12, fill: { color: K.white }, line: { color: c.color, width: 2 } });
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h: 0.95, rectRadius: 0.12, fill: { color: c.color }, line: { color: c.color } });
  s.addShape(pres.ShapeType.rect, { x, y: y + 0.6, w, h: 0.35, fill: { color: c.color }, line: { color: c.color } });
  let hx = x + 0.2;
  if (c.badge) {
    s.addShape(pres.ShapeType.ellipse, { x: x + 0.16, y: y + 0.17, w: 0.62, h: 0.62, fill: { color: K.white }, line: { color: K.white } });
    T(s, c.badge, { x: x + 0.16, y: y + 0.17, w: 0.62, h: 0.62, fontSize: 20, bold: true, color: c.color, align: "center", valign: "middle" });
    hx = x + 0.9;
  }
  T(s, c.kind, { x: hx, y: y + 0.12, w: x + w - hx - 0.15, h: 0.25, fontSize: 9, bold: true, color: K.white, charSpacing: 1 });
  T(s, c.title, { x: hx, y: y + 0.36, w: x + w - hx - 0.15, h: 0.5, fontSize: c.tfs || 16, bold: true, color: K.white, valign: "middle", fit: "shrink" });
  T(s, runs(c.body, c.fs || 11, c.color), { x: x + 0.22, y: y + 1.12, w: w - 0.44, h: h - 1.6, valign: "top", paraSpaceAfter: 3, lineSpacingMultiple: 1.05 });
  T(s, c.foot || "", { x: x + 0.22, y: y + h - 0.38, w: w - 0.44, h: 0.25, fontSize: 7.5, color: K.gray });
}

function cardPage(cards) {
  const s = pres.addSlide();
  s.background = { color: K.white };
  cutLines(s);
  cards.forEach((c, i) => c && card(s, i, c));
  return s;
}

// 빈칸 줄
const blank = n => Array(n).fill("________________________________");

// ------------------------------------------------------------------ 공통 카드
const ROLES = [
  { kind: "역할 카드", title: "에이전트", badge: "A", color: K.blue, body: [
    "## 하는 일", "목표를 달성한다. 도구를 하나씩 요청하고, 결과를 읽고, 다음에 할 일을 소리 내어 말한다.",
    "## 볼 수 있는 것", "목표 카드 · 도구 메뉴 · 내가 받은 결과 카드만",
    "## 규칙",
    "- 결과 카드에 없는 내용은 \"추정\"이라고 말한다",
    "- 운영 변경은 요청서를 써서 승인자에게 낸다",
    "- 거부되면 우회하지 않는다. 멈추고 보고한다",
    "## 끝낼 때", "원인 · 근거 · 조치 결과 · 남은 불확실성을 보고한다"] },
  { kind: "역할 카드", title: "도구 담당", badge: "T", color: K.gray, body: [
    "## 하는 일", "에이전트가 말한 도구의 결과 카드를 한 장 건넨다.",
    "## 볼 수 있는 것", "결과 카드 전부 (뒤집어 보관)",
    "## 규칙",
    "- 요청하지 않은 카드는 주지 않는다",
    "- 카드 내용을 설명하거나 힌트를 주지 않는다",
    "- ⑥ 운영 변경: 승인 서명이 있는 요청서를 받았을 때만 ⑥ 결과 카드에서 해당 줄을 읽어 준다",
    "## 3회차", "강사가 정한 결과 카드 한 장(정산은 ④)을 회수하고 \"그 도구는 이제 없습니다\"라고 알린다"] },
  { kind: "역할 카드", title: "승인자", badge: "✓", color: K.orange, body: [
    "## 하는 일", "운영 변경 요청서를 읽고 승인하거나 거부한다.",
    "## 볼 수 있는 것", "요청서만 (로그 · 결과 카드는 보지 않는다)",
    "## 규칙",
    "- 근거 · 영향 범위 · 되돌리기 방법이 비어 있으면 거부한다",
    "- 승인하면 서명해서 에이전트에게 돌려준다",
    "## 3회차", "첫 요청은 내용과 상관없이 거부한다 (승인 거부 카드)",
    "> 정리 때 말할 것: 요청서만 보고 판단할 수 있었나?"] },
  { kind: "역할 카드", title: "기록자", badge: "R", color: K.green, body: [
    "## 하는 일", "반복마다 생각 · 도구 · 관찰을 한 줄씩 기록지(또는 화이트보드)에 적는다.",
    "## 볼 수 있는 것", "전부",
    "## 규칙",
    "- 반복마다 번호를 붙인다",
    "- 관찰 때문에 계획이 바뀐 순간에 ★ 표시",
    "- 승인 요청 · 승인 · 거부를 따로 적는다",
    "## 정리 때", "반복 횟수와 ★ 순간을 발표한다"] },
];

const REQUEST = {
  kind: "⑥ 운영 변경 · 에이전트가 작성", title: "운영 변경 요청서", color: K.orange, fs: 10.5, body: [
    "## 요청 조치 (무엇을 바꾸나)", ...blank(2),
    "## 근거 (어느 결과 카드에서 봤나)", ...blank(2),
    "## 영향 범위 (누가 · 무엇이 영향받나)", ...blank(1),
    "## 되돌리기 방법", ...blank(1),
    "## 승인자", "□ 승인   □ 거부     서명 ____________"] };

const REJECT = {
  kind: "승인자가 건넴", title: "승인 거부", badge: "✕", color: K.red, body: [
    "이 요청은 실행되지 않았습니다.",
    "## 사유 (승인자가 표시)",
    "□ 근거 부족   □ 영향 범위 불명",
    "□ 되돌리기 방법 없음   □ 지금은 할 수 없음",
    "□ 기타 ____________________",
    "## 에이전트가 할 일",
    "- 다른 경로로 같은 일을 하지 않는다",
    "- 지금까지 알아낸 것을 정리한다",
    "- 대안을 제시하고 사람의 결정을 기다린다"] };

// ------------------------------------------------------------------ 시나리오
const SCEN = [
  { name: "정산 배치", tag: "정산 시나리오 · 기본", color: K.navy,
    goal: { id: "T-1005", text: "정산 배치(NIGHTLY_SETTLE)가 새벽 02:10에 멈췄습니다. 원인을 찾고 안전하게 복구하세요." },
    menu: [["①", "파일 목록", "읽기"], ["②", "로그 읽기", "읽기"], ["③", "설정 파일 읽기", "읽기"],
      ["④", "DB 조회 (읽기 전용)", "읽기"], ["⑤", "테스트 실행", "읽기"], ["⑥", "운영 변경 (작업 중지 · 배치 재기동)", "승인"]],
    res: [
      ["①", "파일 목록", ["logs/app.log", "jobs/report_schedule.yaml", "jobs/nightly_settle.yaml", "src/SettleService.java"]],
      ["②", "로그 읽기 · logs/app.log", ["- 02:00 ReportJob 시작 — 장기 쿼리, 시간 초과 없음, conn#17 점유",
        "- 02:09:58 NIGHTLY_SETTLE 시작", "- 02:10 연결 풀 고갈 20/20, 대기 14", "- 02:10:31 order 88231 처리 중 연결 오류",
        "- 02:11 재시도 3회 실패 후 중단"]],
      ["③", "설정 파일 읽기", ["## jobs/report_schedule.yaml (보고서)", "- cron 02:00", "- query_timeout 없음",
        "- 연결 풀 HikariPool-1 (정산과 같이 씀)", "- 11/04 신규 배포",
        "## jobs/nightly_settle.yaml (정산)", "- cron 02:00", "- HikariPool-1 최대 20", "- 재시도 3회"]],
      ["④", "DB 조회 (읽기 전용)", ["- 보고서 쿼리 42분째 실행 중", "- 미처리 주문: order 88231 이후 41,880건"]],
      ["⑤", "테스트 실행", ["- 정산 로직 테스트 12건 모두 통과", "> 코드 자체의 연결 누수 흔적은 없다"]],
    ],
    act: ["## 보고서 작업 중지", "연결 풀 사용 20/20 → 4/20 으로 회복",
      "## 정산 배치 재기동 (보고서 작업을 멈춘 뒤)", "order 88231부터 재처리 진행 중, 오류 0",
      "## 정산 배치 재기동 (보고서 작업이 아직 실행 중)", "연결을 얻지 못해 다시 중단 (보고서 쿼리가 풀을 계속 점유)",
      "> 요청서에 없는 조치는 읽지 않는다"],
    answer: "11/04 새로 배포한 보고서 작업이 정산과 같은 02:00에 같은 연결 풀을 쓰며 시간 제한 없는 긴 쿼리로 풀을 다 썼다. 정산 코드는 정상. 순서: 보고서 작업 중지(승인) → 정산 재기동(승인) → 재발 방지는 일정 분리 · 시간 제한 · 풀 분리 중 결정 필요." },
  { name: "N/W 업링크", tag: "N/W 변형 · 데모 탭 5", color: K.sky,
    goal: { id: "T-2011", text: "새벽 03:14 IDC-B 업링크가 끊기고 DB 복제 지연 알림이 왔습니다. 원인을 찾고 안전하게 복구하세요." },
    menu: [["①", "작업 이력 조회", "읽기"], ["②", "장비 로그 읽기", "읽기"], ["③", "광 레벨 조회 (show transceiver)", "읽기"],
      ["④", "오류 카운터 조회", "읽기"], ["⑤", "상대 장비 로그 읽기", "읽기"], ["⑥", "설정 변경 · 부품 교체 (CAB 승인)", "승인"]],
    res: [
      ["①", "작업 이력 조회", ["- 11/10 22:00 SW-CORE-02 Te1/0/24 광모듈(SFP+ 10G LR) 교체 — 협력사 작업",
        "- 교체 후 광 레벨 측정 기록 없음", "- 그 뒤 구성 변경 없음"]],
      ["②", "장비 로그 · SW-CORE-02", ["- 03:14:07~16 Te1/0/24 down/up 3회", "- 03:14:16 BGP 이웃 10.20.0.1 Down",
        "- 03:14:31 link-flap 감지 → err-disable (포트 차단 지속)", "> Te1/0/24 = IDC-B 업링크"]],
      ["③", "광 레벨 · Te1/0/24", ["- 수신(Rx) -16.9 dBm — 경고 기준 -14.4 보다 낮음", "- 송신(Tx) -2.1 dBm — 정상", "- 모듈 온도 · 전압 정상"]],
      ["④", "오류 카운터 · Te1/0/24", ["- CRC 오류 1,842 (11/10 이전 0)", "- 입력 오류 계속 증가 중"]],
      ["⑤", "상대 장비 로그 · IDC-B 라우터", ["- 같은 시각 링크 down/up 기록", "- 상대 쪽 수신 · 송신 레벨 정상, 오류 없음"]],
    ],
    act: ["## 광모듈 · 패치코드 교체 후 포트 재활성화", "Rx -5.2 dBm, BGP 다시 연결, 복제 지연 해소",
      "## 교체 없이 포트만 재활성화", "10분 뒤 다시 플래핑, err-disable",
      "## 예비 경로로 우회 (설정 변경)", "BGP 우회 경로 수렴, 복제 지연 줄어듦 — 근본 원인은 남음",
      "> 요청서에 없는 조치는 읽지 않는다"],
    answer: "11/10 교체한 광모듈 또는 패치코드 불량 · 오염. 우리 쪽 수신 레벨만 낮고 상대 장비는 정상, CRC 오류가 교체 이후부터. 복제 지연은 업링크 단절의 결과. 포트 재활성화만으로는 재발한다." },
  { name: "H/W 디스크", tag: "H/W 변형 · 데모 탭 6", color: K.green,
    goal: { id: "T-3007", text: "DB-PRD-03 서버에서 하드웨어 경고가 왔습니다. 상태를 판단하고, 데이터를 지키면서 복구하세요." },
    menu: [["①", "장비 정보 · 계약 조회", "읽기"], ["②", "하드웨어 이벤트 로그 (SEL)", "읽기"], ["③", "디스크 SMART 조회", "읽기"],
      ["④", "백업 상태 조회", "읽기"], ["⑤", "전원 · UPS 로그", "읽기"], ["⑥", "현장 작업 (디스크 교체 · RAID 재구성 · 전원)", "승인"]],
    res: [
      ["①", "장비 정보 · 계약", ["- DB-PRD-03 · 5년차 장비", "- 유지보수 계약 만료 3개월 전", "- 예비 디스크 재고 2개 (같은 모델)"]],
      ["②", "하드웨어 이벤트 로그 (SEL)", ["- 11-14 22:41 Drive 3 예측 장애 (SMART)", "- 11-14 22:41 RAID5 가상 디스크 Degraded",
        "- 11-15 01:12 PSU 2 AC 끊김, 전원 이중화 상실", "- 11-15 01:13 PSU 2 AC 복구"]],
      ["③", "디스크 SMART", ["## Drive 3 (/dev/sdd)", "- 재할당 섹터 312", "- 보류 섹터 48 (어제 31 → 증가 중)", "- 가동 41,200시간",
        "## 다른 디스크", "- 재할당 0~2, 정상"]],
      ["④", "백업 상태", ["- 11-14 02:00 전체 백업 성공", "- 11-15 02:00 증분 백업 성공", "- 마지막 복원 시험: 10/02"]],
      ["⑤", "전원 · UPS 로그", ["- 01:12 PDU-B 3번 포트 순간 단절", "> 전원 케이블 접촉 불량 의심", "- UPS 정상, 같은 랙 다른 장비 영향 없음"]],
    ],
    act: ["## Drive 3 교체 → RAID 재구성", "재구성 진행 중 (예상 4시간), 서비스 정상",
      "## PSU 2 전원 케이블 재체결", "전원 이중화 복구",
      "## RAID 재구성을 백업 확인 없이 요청한 경우", "승인자가 거부하는 것이 맞다 — 다시 요청서를 쓴다",
      "> 요청서에 없는 조치는 읽지 않는다"],
    answer: "Drive 3 물리 불량 진행 중(보류 섹터 증가)으로 RAID5 저하 — 하나 더 고장 나면 데이터 손실. 백업 성공을 확인한 뒤 교체 · 재구성(승인). PSU 2는 PDU 케이블 접촉 문제로 별도 조치. 5년차 장비라 같은 배치 디스크 연쇄 고장도 보고에 넣는다." },
];

// ------------------------------------------------------------------ 1쪽: 강사 진행 안내
{
  const s = pres.addSlide();
  s.background = { color: K.white };
  T(s, "강사용 · 자르지 않는 쪽", { x: 0.5, y: 0.4, w: 7.3, h: 0.25, fontSize: 9, bold: true, color: K.gray });
  T(s, "사람 에이전트 — 진행 안내 (30분)", { x: 0.5, y: 0.65, w: 7.3, h: 0.5, fontSize: 22, bold: true, color: K.navy });
  T(s, "AI 없이 사람이 에이전트 역할을 해 보며, 왜 도구 · 루프 · 승인이 필요한지 몸으로 이해한다. 4~5명 1조, 역할 4개 (5명이면 기록자 2명).",
    { x: 0.5, y: 1.2, w: 7.3, h: 0.45, fontSize: 10.5 });

  const hd = t => ({ text: t, options: { bold: true, color: K.white, fill: { color: K.navy } } });
  const rows = [
    [hd("회차"), hd("시간"), hd("규칙"), hd("기록자 · 강사가 볼 것")],
    ["1회차\n챗봇 규칙", "3분", "에이전트는 목표 카드만 보고 바로 답한다. 도구 요청 금지.", "근거 없는 일반론이 나오는가"],
    ["2회차\n에이전트 규칙", "10분", "도구를 하나씩 요청 → 결과 카드 읽기 → 다음 행동을 소리 내어 말하기. 운영 변경은 요청서 → 승인자.", "생각 / 도구 / 관찰 반복, 계획이 바뀐 순간(★)"],
    ["3회차\n제약", "7분", "도구 담당이 결과 카드 한 장을 회수(아래 인쇄 · 준비 참고). 승인자는 첫 요청을 무조건 거부.", "확신이 줄어든 것을 말하는가, 거부 뒤 우회하지 않는가"],
    ["정리", "10분", "아래 질문 5개로 토론", "조마다 기록자가 반복 횟수 · ★ 발표"],
  ];
  s.addTable(rows, { x: 0.5, y: 1.75, w: 7.27, colW: [1.15, 0.6, 3.17, 2.35], fontFace: FONT, fontSize: 9.5, color: K.ink,
    border: { type: "solid", color: K.line, pt: 0.75 }, margin: [0.05, 0.08, 0.05, 0.08], valign: "middle" });

  T(s, "정리 질문 → 붙일 이름", { x: 0.5, y: 4.45, w: 7.3, h: 0.3, fontSize: 12, bold: true, color: K.blue });
  const q = [
    ["1회차와 2회차에서 답의 근거는 어떻게 달랐나?", "챗봇 vs 에이전트"],
    ["몇 번 반복했나? 어느 관찰이 계획을 바꿨나?", "루프"],
    ["회수한 카드(정산은 ④ DB 조회)가 없어지자 무엇이 불가능해졌나?", "도구가 곧 능력"],
    ["거부당했을 때 어떻게 해야 했나? 우회하면 안 되는 이유는?", "승인"],
    ["승인자가 없었다면 무엇이 위험했을까?", "읽기는 맡기고, 쓰기는 승인한다"],
  ];
  s.addTable(q.map((r, i) => [`${i + 1}. ${r[0]}`, { text: r[1], options: { bold: true, color: K.blue } }]),
    { x: 0.5, y: 4.8, w: 7.27, colW: [4.9, 2.37], fontFace: FONT, fontSize: 9.5, color: K.ink,
      border: { type: "solid", color: K.line, pt: 0.75 }, margin: [0.05, 0.08, 0.05, 0.08], valign: "middle" });

  T(s, "인쇄 · 준비", { x: 0.5, y: 6.75, w: 7.3, h: 0.3, fontSize: 12, bold: true, color: K.blue });
  T(s, runs([
    "- 조마다: 2쪽(역할) · 3쪽(요청서 · 거부, 2부 권장) · 4쪽(기록지) + 시나리오 2쪽",
    "- 시나리오: 정산(기본) 5~6쪽 · N/W 7~8쪽 · H/W 9~10쪽. N/W · H/W 직무 조는 자기 시나리오로",
    "- 점선대로 잘라 카드 4장씩. 결과 카드 ①~⑤와 ⑥ 결과 카드는 도구 담당이 뒤집어 보관",
    "- 3회차의 \"회수\"는 정산 ④ DB 조회 · N/W ③ 광 레벨 · H/W ④ 백업 상태",
    "- 타이머, 화이트보드 또는 기록지, 펜",
  ], 9.5, K.blue), { x: 0.5, y: 7.1, w: 7.27, h: 1.35, valign: "top", paraSpaceAfter: 2 });

  T(s, "시나리오 정답 (강사만)", { x: 0.5, y: 8.55, w: 7.3, h: 0.3, fontSize: 12, bold: true, color: K.red });
  T(s, SCEN.flatMap((c, i) => [
    { text: `${c.name} `, options: { bold: true, fontSize: 9, breakLine: false } },
    { text: c.answer, options: { fontSize: 9, breakLine: i < SCEN.length - 1 } },
  ]), { x: 0.5, y: 8.9, w: 7.27, h: 2.2, valign: "top", paraSpaceAfter: 4 });
  T(s, LIC + " · 시나리오는 교육용 가상 데이터", { x: 0.5, y: 11.3, w: 7.27, h: 0.2, fontSize: 7, color: K.gray });
}

// ------------------------------------------------------------------ 2~3쪽: 공통 카드
const COMMON = "공통 · 사람 에이전트";
cardPage(ROLES.map(r => Object.assign({ foot: COMMON }, r)));
cardPage([REQUEST, REQUEST, REJECT, REJECT].map(r => Object.assign({ foot: COMMON }, r)));

// ------------------------------------------------------------------ 4쪽: 기록지
{
  const s = pres.addSlide();
  s.background = { color: K.white };
  T(s, "기록자용 · 화이트보드 대신 써도 된다", { x: 0.5, y: 0.4, w: 7.3, h: 0.25, fontSize: 9, bold: true, color: K.gray });
  T(s, "루프 기록지", { x: 0.5, y: 0.65, w: 4, h: 0.5, fontSize: 22, bold: true, color: K.navy });
  T(s, "조: ________   시나리오: □ 정산  □ N/W  □ H/W", { x: 3.6, y: 0.75, w: 4.2, h: 0.35, fontSize: 10, align: "right" });
  const hd = t => ({ text: t, options: { bold: true, color: K.white, fill: { color: K.navy }, align: "center" } });
  const rows = [[hd("#"), hd("회차"), hd("생각 — 무엇을 확인하려고?"), hd("도구"), hd("관찰 — 결과 카드에서 알게 된 것"), hd("★")]];
  for (let i = 1; i <= 14; i++) rows.push([{ text: String(i), options: { align: "center", color: K.gray } }, "", "", "", "", ""]);
  s.addTable(rows, { x: 0.5, y: 1.3, w: 7.27, colW: [0.35, 0.5, 2.45, 0.55, 3.0, 0.42], rowH: [0.32, ...Array(14).fill(0.42)],
    fontFace: FONT, fontSize: 9, color: K.ink, border: { type: "solid", color: K.line, pt: 0.75 }, margin: [0.03, 0.05, 0.03, 0.05], valign: "middle" });
  T(s, "승인 요청 기록", { x: 0.5, y: 7.75, w: 7.3, h: 0.3, fontSize: 12, bold: true, color: K.orange });
  const r2 = [[hd("#"), hd("요청한 조치"), hd("승인 / 거부"), hd("그다음 에이전트의 행동")]];
  for (let i = 1; i <= 3; i++) r2.push([{ text: String(i), options: { align: "center", color: K.gray } }, "", "", ""]);
  s.addTable(r2, { x: 0.5, y: 8.1, w: 7.27, colW: [0.35, 3.0, 1.0, 2.92], rowH: [0.32, 0.42, 0.42, 0.42],
    fontFace: FONT, fontSize: 9, color: K.ink, border: { type: "solid", color: K.line, pt: 0.75 }, margin: [0.03, 0.05, 0.03, 0.05], valign: "middle" });
  T(s, "발표할 것", { x: 0.5, y: 9.85, w: 7.3, h: 0.3, fontSize: 12, bold: true, color: K.green });
  T(s, runs(["반복 횟수: 1회차 ____  2회차 ____  3회차 ____",
    "계획이 바뀐 순간(★)과 그 관찰: ______________________________________________",
    "3회차에 확신할 수 없게 된 것: _________________________________________________"], 10, K.green),
    { x: 0.5, y: 10.2, w: 7.27, h: 0.95, valign: "top", paraSpaceAfter: 6 });
  T(s, LIC, { x: 0.5, y: 11.3, w: 7.27, h: 0.2, fontSize: 7, color: K.gray });
}

// ------------------------------------------------------------------ 5~10쪽: 시나리오 카드
SCEN.forEach(sc => {
  const foot = `${sc.tag} · 교육용 가상 데이터`;
  const goal = { kind: `목표 카드 · ${sc.goal.id}`, title: "목표", badge: "!", color: K.red, fs: 13, foot, body: [
    sc.goal.text, "",
    "## 보고에 담을 것", "- 원인", "- 근거 (어느 결과 카드에서)", "- 조치 결과", "- 남은 불확실성 (확인 필요)"] };
  const menu = { kind: "도구 메뉴 · 에이전트에게 공개", title: "도구 메뉴", color: sc.color, fs: 12, foot, body: [
    ...sc.menu.map(m => `${m[0]} ${m[1]}${m[2] === "승인" ? "  — 승인 필요" : ""}`),
    "",
    "## 쓰는 법",
    "- 한 번에 하나씩, 도구 번호로 요청한다",
    "- ⑥은 요청서를 쓰고 승인자 서명을 받아야 한다",
    "> 읽기 도구는 몇 번이든 쓸 수 있다"] };
  const res = sc.res.map(r => ({ kind: "도구 결과 · 도구 담당만 보관", title: r[1], badge: r[0], color: sc.color, fs: 13, tfs: 14, foot, body: r[2] }));
  const act = { kind: "⑥ 결과 · 도구 담당만 보관", title: "운영 변경 실행 결과", badge: "⑥", color: K.orange, fs: 11.5, tfs: 14, foot, body: [
    "승인 서명이 있는 요청서의 조치만 해당 줄을 읽어 준다.", ...sc.act] };
  cardPage([goal, menu, res[0], res[1]]);
  cardPage([res[2], res[3], res[4], act]);
});

pres.writeFile({ fileName: OUT }).then(f => console.log("ok", f));
