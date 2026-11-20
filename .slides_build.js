const pptxgen=require("pptxgenjs");
let applyTheme=async()=>console.warn("테마 적용 도구(APPLY_THEME)가 없어 기본 색으로 저장됩니다");
try{if(process.env.APPLY_THEME)({applyTheme}=require(process.env.APPLY_THEME));}catch(e){}
const THEME={name:"Maintenance AI",headFontFace:"Arial",bodyFontFace:"Arial",colors:{dk1:"1B2430",lt1:"FFFFFF",dk2:"0B3C3C",lt2:"EEF5F4",accent1:"0B6E6E",accent2:"F2A33A",accent3:"D9534F",accent4:"5B8DEF",accent5:"7A8B99",accent6:"2E9E6B",hlink:"0B6E6E",folHlink:"7A8B99"}};
const pres=new pptxgen();pres.layout="LAYOUT_WIDE";pres.theme={headFontFace:"Arial",bodyFontFace:"Arial"};
pres.title="유지관리 사업을 위한 AI 교육+실데모";
const C=pres.SchemeColor;
pres.defineSlideMaster({title:"TITLE_DARK",background:{color:C.text2},objects:[{text:{text:"© 2026 khaniyapark-ops · CC BY-NC-SA 4.0 · github.com/khaniyapark-ops/AI-Study",options:{x:0.8,y:6.95,w:11.7,h:0.3,fontSize:10,color:"B9C4D4",margin:0}}}],slideNumber:undefined});
pres.defineSlideMaster({title:"CONTENT",background:{color:C.background1},
 objects:[],
 slideNumber:{x:12.3,y:7.0,w:0.6,h:0.3,fontSize:10,color:C.text1,align:"right"}});
const W=13.33;
function content(title,section){const s=pres.addSlide({masterName:"CONTENT",sectionTitle:section});
 s.addText(title,{x:0.6,y:0.4,w:12.1,h:0.8,fontSize:32,bold:true,color:C.text2,margin:0,isTextBox:true,objectName:"Title"});return s}
function card(s,x,y,w,h,head,body,opt={}){
 s.addShape(pres.ShapeType.roundRect,{x,y,w,h,fill:{color:opt.fill||C.background2},rectRadius:0.12,line:{color:opt.fill||C.background2},objectName:"Card"});
 if(opt.badge){s.addShape(pres.ShapeType.ellipse,{x:x+0.25,y:y+0.25,w:0.55,h:0.55,fill:{color:opt.bc||C.accent1},line:{color:opt.bc||C.accent1}});
  s.addText(opt.badge,{x:x+0.25,y:y+0.25,w:0.55,h:0.55,align:"center",valign:"middle",fontSize:16,bold:true,color:C.background1,margin:0,isTextBox:true});}
 const hx=opt.badge?x+0.95:x+0.3;
 s.addText(head,{x:hx,y:y+0.2,w:w-(hx-x)-0.25,h:0.65,fontSize:18,bold:true,color:C.text2,valign:"middle",margin:0,isTextBox:true});
 s.addText(body,{x:x+0.3,y:y+0.95,w:w-0.6,h:h-1.1,fontSize:opt.fs||15,color:C.text1,valign:"top",margin:0,paraSpaceAfter:6,isTextBox:true});}
function notes(s,t){s.addNotes(t)}


const B=a=>a.map((t,i)=>({text:t,options:{bullet:true,breakLine:i<a.length-1}}));
function sec(t){pres.addSection({title:t})}
function dark(sectionTitle){return pres.addSlide({masterName:"TITLE_DARK",sectionTitle})}
function band(s,x,y,w,h,label,text,fill){ // dark callout
 s.addShape(pres.ShapeType.roundRect,{x,y,w,h,fill:{color:fill||C.text2},line:{color:fill||C.text2},rectRadius:0.12});
 s.addText(label,{x:x+0.3,y:y+0.15,w:w-0.6,h:0.4,fontSize:14,bold:true,color:C.accent2,margin:0,isTextBox:true});
 s.addText(text,{x:x+0.3,y:y+0.6,w:w-0.6,h:h-0.7,fontSize:17,color:C.background1,valign:"top",margin:0,paraSpaceAfter:4,isTextBox:true});}

// ---------- 도입
sec("도입");
let s=dark("도입");
s.addText("유지관리 사업을 위한",{x:0.8,y:1.9,w:11.5,h:0.6,fontSize:24,color:C.accent2,margin:0,isTextBox:true});
s.addText("AI 교육 + 실데모",{x:0.8,y:2.5,w:11.5,h:1.3,fontSize:54,bold:true,color:C.background1,margin:0,isTextBox:true});
s.addText("왜 Agentic AI인가 — 관리자·기획자·운영자·개발자·엔지니어 공통",{x:0.8,y:4.0,w:10.8,h:0.9,fontSize:20,color:C.background2,margin:0,isTextBox:true});
s.addText("종일 과정(약 6시간) · 데모 demo/index.html · 실습 sample-system/ · 실습키트_Agentic.md",{x:0.8,y:6.3,w:11.5,h:0.4,fontSize:14,color:C.accent5,margin:0,isTextBox:true});
s.addNotes("오프닝: 직무가 다양하므로 오전은 공통, 오후는 직무별 트랙입니다. 바로 다음 슬라이드에서 설명 없이 데모부터 보여줍니다.");

s=content("먼저 보겠습니다: 같은 목표, 전혀 다른 결과","도입");
s.addText("목표: \"T-1005 정산 배치가 02:10에 멈췄습니다. 원인을 찾고 안전하게 복구해 주세요.\"",{x:0.6,y:1.35,w:12.1,h:0.5,fontSize:17,bold:true,color:C.text2,margin:0,isTextBox:true});
s.addShape(pres.ShapeType.roundRect,{x:0.6,y:2.05,w:5.4,h:4.1,fill:{color:C.background2},line:{color:C.background2},rectRadius:0.12});
s.addText("A. 챗봇",{x:0.9,y:2.25,w:4.8,h:0.5,fontSize:22,bold:true,color:C.accent5,margin:0,isTextBox:true});
s.addText([{text:"\"원인은 여러 가지가 있을 수 있습니다. DB 커넥션 부족, 메모리 부족, 데이터 이상…",options:{breakLine:true}},{text:" ",options:{breakLine:true}},{text:"로그를 보여주시면 더 정확히 분석해 드릴게요. 우선 재기동해 보세요.\"",options:{}}],{x:0.9,y:2.9,w:4.8,h:2.2,fontSize:16,italic:true,color:C.text1,valign:"top",margin:0,isTextBox:true});
s.addText("근거 0개 · 일반론 · 위험한 조언(무작정 재기동)",{x:0.9,y:5.4,w:4.8,h:0.5,fontSize:14,bold:true,color:C.accent3,margin:0,isTextBox:true});
s.addShape(pres.ShapeType.roundRect,{x:6.3,y:2.05,w:6.4,h:4.1,fill:{color:C.accent1},line:{color:C.accent1},rectRadius:0.12});
s.addText("B. 에이전트",{x:6.6,y:2.25,w:5.8,h:0.5,fontSize:22,bold:true,color:C.accent2,margin:0,isTextBox:true});
s.addText(B(["로그 읽기 → 02:10 커넥션 풀 고갈 발견","DB 조회 → 리포트 쿼리 42분째 점유","설정 읽기 → 두 잡이 02:00·같은 풀","테스트 실행 → 정산 코드는 정상","🛑 잡 중지·재기동은 사람 승인 후 실행"]),{x:6.6,y:2.85,w:5.8,h:2.6,fontSize:16,color:C.background1,valign:"top",paraSpaceAfter:6,margin:0,isTextBox:true});
s.addText("근거 4개 · 원인 특정 · 위험 단계에서 멈춤",{x:6.6,y:5.4,w:5.8,h:0.5,fontSize:14,bold:true,color:C.background1,margin:0,isTextBox:true});
s.addText("차이를 만든 것은 무엇일까요? — 오늘 하루 동안 이 질문에 답합니다",{x:0.6,y:6.4,w:12.1,h:0.5,fontSize:18,bold:true,color:C.accent1,margin:0,isTextBox:true});
s.addNotes("설명 전에 데모 탭 8에서 A(챗봇) → B(에이전트)를 실제로 실행합니다. 이 슬라이드는 실행 후 정리용. 승인 카드가 뜨면 참석자 투표로 승인/거부를 정하세요. 정답(목표·도구·루프·승인)은 아직 말하지 않습니다.");


s=content("누구를 위한 과정인가: 7개 직무, 하나의 유지보수 흐름","도입");
const roles=[["관리자","SLA·리스크·성과 판단"],["기획자","요구 정리·변경요청·영향도"],["운영자","모니터링·장애 1차 대응"],["개발자","코드 이해·수정·테스트"],["S/W 엔지니어","미들웨어·DB·배치 운영"],["N/W 엔지니어","장비 로그·경로 장애"],["H/W 엔지니어","서버·스토리지 점검"]];
roles.forEach((r,i)=>{const col=i%4,row=Math.floor(i/4);const x=0.6+col*3.07,y=1.55+row*2.35;
 s.addShape(pres.ShapeType.roundRect,{x,y,w:2.9,h:2.1,fill:{color:C.background2},line:{color:C.background2},rectRadius:0.12});
 s.addShape(pres.ShapeType.ellipse,{x:x+0.25,y:y+0.25,w:0.6,h:0.6,fill:{color:C.accent1},line:{color:C.accent1}});
 s.addText(String(i+1),{x:x+0.25,y:y+0.25,w:0.6,h:0.6,fontSize:18,bold:true,color:C.background1,align:"center",valign:"middle",margin:0,isTextBox:true});
 s.addText(r[0],{x:x+0.25,y:y+0.95,w:2.5,h:0.45,fontSize:19,bold:true,color:C.text2,margin:0,isTextBox:true});
 s.addText(r[1],{x:x+0.25,y:y+1.4,w:2.5,h:0.6,fontSize:14,color:C.text1,valign:"top",margin:0,isTextBox:true});});
s.addShape(pres.ShapeType.roundRect,{x:9.8,y:3.9,w:2.9,h:2.1,fill:{color:C.text2},line:{color:C.text2},rectRadius:0.12});
s.addText("목표\n내 직무의 업무 1가지에 AI를 안전하게 적용하고 검증한다",{x:10.05,y:4.05,w:2.4,h:1.8,fontSize:15,bold:true,color:C.background1,valign:"middle",margin:0,isTextBox:true});

s=content("종일 시간표 (약 6시간)","도입");
const tt=[["09:30","오프닝 체험: 같은 목표, 다른 결과 (데모 8 A/B)","20분"],["09:50","① 왜 Agentic AI인가: 4요소에 이름 붙이기","40분"],["10:30","② 언플러그드 게임 \"사람 에이전트\"","30분"],["11:00","③ 원칙: 프롬프트 5요소·보안·환각 검증","30분"],["11:30","점심","60분"],["12:30","④ 공통 데모 1~4 + 직무별 데모 5~7","40분"],["13:10","⑤ 데모 8 실험 5가지 (거부·도구 끄기·자동 실행)","20분"],["13:30","⑥ 실전: Claude Code로 버그 수정 + 직무별 미션","50분"],["14:20","휴식","10분"],["14:30","⑦ 에이전트 설계 캔버스 + 조별 발표","40분"],["15:10","⑧ 회상 퀴즈·로드맵·Q&A","20분"]];
tt.forEach((r,i)=>{const y=1.4+i*0.5;const brk=r[1]==="점심"||r[1]==="휴식";
 s.addShape(pres.ShapeType.roundRect,{x:0.6,y,w:12.1,h:0.43,fill:{color:brk?C.background1:C.background2},line:{color:C.background2},rectRadius:0.08});
 s.addText(r[0],{x:0.8,y,w:1.1,h:0.43,fontSize:15,bold:true,color:C.accent1,valign:"middle",margin:0,isTextBox:true});
 s.addText(r[1],{x:2.0,y,w:9.0,h:0.43,fontSize:15,color:C.text1,valign:"middle",margin:0,isTextBox:true});
 s.addText(r[2],{x:11.0,y,w:1.5,h:0.43,fontSize:14,color:C.accent5,align:"right",valign:"middle",margin:0,isTextBox:true});});
s.addText("흐름: 경험 → 이름 붙이기 → 직접 해보기 → 내 업무에 설계 → 회상",{x:0.6,y:6.95,w:11.4,h:0.35,fontSize:14,bold:true,color:C.accent1,margin:0,isTextBox:true});

// ---------- 개념
sec("개념: 왜 Agentic AI인가");
s=content("유지보수 업무 흐름에서 AI가 들어갈 자리","개념: 왜 Agentic AI인가");
const flow=[["접수","분류·우선순위\n답변 초안"],["분석","로그 해석\n원인 가설"],["수정","코드 이해\n수정·테스트"],["배포","영향도 점검\n릴리스 노트"],["보고","월간 보고\n개선 제안"]];
flow.forEach((f,i)=>{const x=0.6+i*2.5;
 s.addShape(pres.ShapeType.roundRect,{x,y:1.6,w:2.2,h:1.0,fill:{color:C.accent1},line:{color:C.accent1},rectRadius:0.12});
 s.addText(f[0],{x,y:1.6,w:2.2,h:1.0,fontSize:22,bold:true,color:C.background1,align:"center",valign:"middle",margin:0,isTextBox:true});
 if(i<4)s.addShape(pres.ShapeType.rightArrow,{x:x+2.22,y:1.95,w:0.26,h:0.3,fill:{color:C.accent2},line:{color:C.accent2}});
 s.addShape(pres.ShapeType.roundRect,{x,y:2.8,w:2.2,h:1.3,fill:{color:C.background2},line:{color:C.background2},rectRadius:0.12});
 s.addText(f[1],{x:x+0.1,y:2.8,w:2.0,h:1.3,fontSize:15,color:C.text1,align:"center",valign:"middle",margin:0,isTextBox:true});});
card(s,0.6,4.5,5.95,2.2,"AI가 돕는 곳",B(["읽기·요약·분류·초안 작성","반복되는 글·코드·로그 작업"]),{badge:"✓",bc:C.accent6});
card(s,6.75,4.5,5.95,2.2,"사람이 쥐는 곳",B(["최종 판단, 고객 약속(SLA)","운영 반영, 정책 결정"]),{badge:"!",bc:C.accent3});

s=content("AI가 잘하는 일 vs 조심할 일","개념: 왜 Agentic AI인가");
card(s,0.6,1.5,5.95,5.1,"잘하는 일",B(["긴 로그·코드·문서 읽고 요약","분류, 초안·표·보고서 작성","처음 보는 코드·장비 로그 설명","가설을 여러 개 빠르게 나열"]),{badge:"O",bc:C.accent6});
card(s,6.75,1.5,5.95,5.1,"조심할 일",B(["없는 사실을 그럴듯하게 지어냄 (환각)","정확한 계산·집계 → 쿼리/도구로","우리 시스템 내부 규칙은 모름 → 자료 제공","책임이 따르는 최종 결정"]),{badge:"△",bc:C.accent3});

s=content("챗봇형 AI vs Agentic AI","개념: 왜 Agentic AI인가");
const cmp=[["챗봇형 (질문→답변)",["사람이 자료를 복사해 붙여넣음","한 번 답하고 끝","사람이 다음 단계를 직접 지시","결과: 글·코드 조각"],C.accent5],["Agentic (목표→수행)",["도구로 로그·DB·파일을 직접 조회","계획 → 실행 → 관찰 → 재계획 반복","테스트로 스스로 결과를 검증","결과: 근거 있는 작업 완료 + 보고"],C.accent1]];
cmp.forEach((c,i)=>{const x=0.6+i*6.15;
 s.addShape(pres.ShapeType.roundRect,{x,y:1.5,w:5.95,h:4.3,fill:{color:i?C.accent1:C.background2},line:{color:i?C.accent1:C.background2},rectRadius:0.12});
 s.addText(c[0],{x:x+0.35,y:1.7,w:5.2,h:0.6,fontSize:22,bold:true,color:i?C.background1:C.text2,margin:0,isTextBox:true});
 s.addText(B(c[1]),{x:x+0.35,y:2.5,w:5.2,h:3.1,fontSize:17,color:i?C.background1:C.text1,valign:"top",paraSpaceAfter:10,margin:0,isTextBox:true});});
s.addText("핵심 차이: '답을 주는 AI'에서 '일을 끝까지 수행하고 근거를 보고하는 AI'로",{x:0.6,y:6.1,w:12.1,h:0.6,fontSize:18,bold:true,color:C.accent1,margin:0,isTextBox:true});

s=content("에이전트 = 목표 + 도구 + 루프 + 승인","개념: 왜 Agentic AI인가");
const fx=[["목표","지시가 아니라\n목표를 준다","\"원인을 찾고 복구해\""],["도구","도구가 곧 능력\n없으면 못 본다","로그·DB·파일·테스트"],["루프","생각→도구→관찰\n→재계획 반복","관찰이 계획을 바꾼다"],["승인","위험 단계는\n프로그램이 멈춘다","🛑 사람이 결정"]];
fx.forEach((f,i)=>{const x=0.6+i*3.15;
 s.addShape(pres.ShapeType.roundRect,{x,y:1.5,w:2.75,h:3.6,fill:{color:i===3?C.accent3:C.accent1},line:{color:i===3?C.accent3:C.accent1},rectRadius:0.14});
 s.addText(f[0],{x,y:1.75,w:2.75,h:0.8,fontSize:36,bold:true,color:C.background1,align:"center",margin:0,isTextBox:true});
 s.addText(f[1],{x:x+0.2,y:2.7,w:2.35,h:1.2,fontSize:17,color:C.background1,align:"center",valign:"top",margin:0,isTextBox:true});
 s.addText(f[2],{x:x+0.2,y:4.1,w:2.35,h:0.8,fontSize:14,italic:true,color:i===3?C.background1:C.accent2,align:"center",valign:"middle",margin:0,isTextBox:true});
 if(i<3)s.addText("+",{x:x+2.75,y:2.8,w:0.4,h:0.8,fontSize:32,bold:true,color:C.accent2,align:"center",margin:0,isTextBox:true});});
band(s,0.6,5.4,12.1,1.3,"오늘 하루 반복할 두 문장","챗봇은 대답하고, 에이전트는 일한다 · 읽기는 맡기고, 쓰기는 승인한다");
s.addNotes("오프닝 데모의 '차이를 만든 것'에 이름을 붙이는 슬라이드. 참석자에게 데모 장면을 4요소에 하나씩 연결하게 하세요. 이후 모듈마다 '지금 본 건 4요소 중 무엇?'을 묻습니다.");


s=content("Agentic AI를 이용해야 하는 이유 6가지","개념: 왜 Agentic AI인가");
const why=[["1","컨텍스트 전환 비용 감소","로그·DB·소스·티켓을 오가며 모으던 일을 에이전트가 수집"],["2","24x7 1차 대응","야간·휴일 장애의 초기 진단을 즉시 시작"],["3","지식의 편중 해소","담당자 개인 노하우를 절차와 도구 사용으로 재현"],["4","반복 업무 자동화","분류·점검·보고 같은 정형 작업을 끝까지 수행"],["5","근거 기반 의사결정","관찰한 증거와 함께 보고해 검토 시간 단축"],["6","품질 일관성","같은 절차·체크리스트를 매번 동일하게 적용"]];
why.forEach((w,i)=>{const col=i%3,row=Math.floor(i/3);const x=0.6+col*4.12,y=1.5+row*2.65;
 card(s,x,y,3.95,2.45,w[1],w[2],{badge:w[0],fs:16});});
s.addNotes("각 이유에 대해 참석자 직무별 예시를 한 가지씩 물어보며 진행. 수치(%)는 제시하지 말고 파일럿 측정으로 확인한다고 안내.");

s=content("유지보수가 Agentic AI에 특히 잘 맞는 이유","개념: 왜 Agentic AI인가");
const fit=[["반복·정형","같은 유형의 장애·문의·변경이 계속 반복됨"],["증거가 텍스트","로그·티켓·코드·설정이 모두 읽을 수 있는 텍스트"],["절차가 존재","runbook·체크리스트가 있어 단계 분해가 쉬움"],["검증 수단 있음","테스트·조회 쿼리·모니터링으로 결과 확인 가능"]];
fit.forEach((f,i)=>{const y=1.5+i*1.1;
 s.addShape(pres.ShapeType.roundRect,{x:0.6,y,w:7.4,h:0.95,fill:{color:C.background2},line:{color:C.background2},rectRadius:0.1});
 s.addText(f[0],{x:0.85,y,w:2.2,h:0.95,fontSize:19,bold:true,color:C.accent1,valign:"middle",margin:0,isTextBox:true});
 s.addText(f[1],{x:3.1,y,w:4.7,h:0.95,fontSize:15,color:C.text1,valign:"middle",margin:0,isTextBox:true});});
band(s,8.3,1.5,4.4,4.2,"하지만 이럴 땐 신중히","• 운영 데이터 쓰기·삭제\n• 보안 민감 구간\n• 판단 기준이 모호한 정책 결정\n\n→ 읽기부터 시작, 쓰기는 승인");
s.addText("유지보수의 특성이 곧 에이전트 적합성 조건입니다.",{x:0.6,y:6.1,w:12.1,h:0.5,fontSize:18,bold:true,color:C.accent1,margin:0,isTextBox:true});

s=content("에이전트의 작동 방식: 계획 → 도구 → 관찰 → 검증","개념: 왜 Agentic AI인가");
const loop=[["목표","티켓·알람을\n목표로 수신"],["계획","조사 단계\n분해"],["도구 사용","로그·DB·\n소스 조회"],["관찰·재계획","결과를 읽고\n가설 수정"],["검증","테스트·\n조회로 확인"],["보고","근거·권고·\n불확실성"]];
loop.forEach((l,i)=>{const x=0.6+i*2.05;
 s.addShape(pres.ShapeType.roundRect,{x,y:1.8,w:1.85,h:1.9,fill:{color:i===5?C.accent2:C.accent1},line:{color:C.accent1},rectRadius:0.12});
 s.addText(l[0],{x,y:1.95,w:1.85,h:0.5,fontSize:17,bold:true,color:i===5?C.text1:C.background1,align:"center",margin:0,isTextBox:true});
 s.addText(l[1],{x:x+0.1,y:2.5,w:1.65,h:1.1,fontSize:14,color:i===5?C.text1:C.background1,align:"center",valign:"top",margin:0,isTextBox:true});});
band(s,0.6,4.2,12.1,2.3,"🛑 승인 게이트 — 사람 승인(Human-in-the-Loop)","운영 변경·쓰기 작업·고객 약속 직전에는 반드시 멈추고 사람의 승인을 받는다.\n에이전트는 '조사와 초안'까지, 실행 결정은 사람이 한다.");

s=content("자율성 4단계: 어디까지 맡길 것인가","개념: 왜 Agentic AI인가");
const lv=[["L1","추천","AI가 의견만 제시","모든 직무 · 오늘 시작"],["L2","초안","보고서·CR·코드 초안 작성","사람이 검토 후 사용"],["L3","승인 후 실행","조회는 자동, 변경은 승인","파일럿 후 확대"],["L4","자동 실행","저위험 정형 작업만","충분한 검증 후"]];
lv.forEach((l,i)=>{const x=0.6+i*3.07;const h=2.2+i*0.65;
 s.addShape(pres.ShapeType.roundRect,{x,y:6.6-h,w:2.9,h,fill:{color:i<2?C.accent1:(i===2?C.accent2:C.accent3)},line:{color:C.background1},rectRadius:0.12});
 s.addText(l[0]+" "+l[1],{x:x+0.2,y:6.6-h+0.15,w:2.5,h:0.5,fontSize:20,bold:true,color:i===2?C.text1:C.background1,margin:0,isTextBox:true});
 s.addText(l[2]+"\n"+l[3],{x:x+0.2,y:6.6-h+0.7,w:2.5,h:h-0.8,fontSize:14,color:i===2?C.text1:C.background1,valign:"top",margin:0,isTextBox:true});});
s.addText("오늘의 목표: L1~L2 체득 → L3 시나리오 설계",{x:0.6,y:1.45,w:12.1,h:0.5,fontSize:18,bold:true,color:C.accent1,margin:0,isTextBox:true});

sec("체험");
s=content("언플러그드 게임: \"사람 에이전트\" (30분)","체험");
const rl=[["에이전트","목표 카드와 받은 결과 카드만 볼 수 있다"],["도구 담당","요청받은 도구 결과 카드를 건넨다"],["승인자","운영 변경 요청서에 승인/거부"],["기록자","매 반복의 생각·도구·관찰을 칠판에"]];
s.addText("역할 (4~5명 1조)",{x:0.6,y:1.4,w:5.6,h:0.45,fontSize:18,bold:true,color:C.text2,margin:0,isTextBox:true});
rl.forEach((r,i)=>{const y=1.95+i*1.05;
 s.addShape(pres.ShapeType.roundRect,{x:0.6,y,w:5.6,h:0.9,fill:{color:C.background2},line:{color:C.background2},rectRadius:0.1});
 s.addText(r[0],{x:0.85,y,w:1.6,h:0.9,fontSize:17,bold:true,color:C.accent1,valign:"middle",margin:0,isTextBox:true});
 s.addText(r[1],{x:2.5,y,w:3.55,h:0.9,fontSize:14,color:C.text1,valign:"middle",margin:0,isTextBox:true});});
const rd=[["라운드 1 · 3분","챗봇 규칙: 목표만 보고 바로 답한다"],["라운드 2 · 10분","에이전트 규칙: 도구를 하나씩 요청하며 반복, 변경은 승인 요청"],["라운드 3 · 7분","DB 카드 회수 + 첫 승인 요청은 거부"]];
rd.forEach((r,i)=>{const y=1.4+i*1.5;
 s.addShape(pres.ShapeType.roundRect,{x:6.6,y,w:6.1,h:1.3,fill:{color:i===1?C.accent1:C.text2},line:{color:i===1?C.accent1:C.text2},rectRadius:0.12});
 s.addText(r[0],{x:6.9,y:y+0.12,w:5.5,h:0.45,fontSize:16,bold:true,color:C.accent2,margin:0,isTextBox:true});
 s.addText(r[1],{x:6.9,y:y+0.6,w:5.5,h:0.6,fontSize:15,color:C.background1,valign:"top",margin:0,isTextBox:true});});
s.addText("정리: 근거는 어디서 왔나? 무엇이 계획을 바꿨나? 카드가 없어지자 무엇이 불가능해졌나? 거부당하면 어떻게 해야 하나?",{x:0.6,y:6.25,w:12.1,h:0.7,fontSize:15,bold:true,color:C.accent1,margin:0,isTextBox:true});
s.addNotes("카드 내용과 진행 규칙은 실습키트_Agentic.md 2장. 비개발 직무에게 특히 효과적입니다. 정리 질문 4개가 각각 근거·루프·도구·승인에 대응합니다.");

// ---------- 원칙
sec("원칙");
s=content("프롬프트 5요소: 역할 · 맥락 · 자료 · 형식 · 제약","원칙");
const el=[["역할","10년차 운영 엔지니어"],["맥락","정산 배치, 새벽 2시, 어제 배포 있음"],["자료","로그·코드·티켓 원문"],["형식","타임라인 → 가설 3개 → 확인 방법"],["제약","모르면 '확인 필요'로 표시"]];
el.forEach((e,i)=>{const y=1.5+i*0.95;
 s.addShape(pres.ShapeType.ellipse,{x:0.6,y,w:0.62,h:0.62,fill:{color:C.accent1},line:{color:C.accent1}});
 s.addText(String(i+1),{x:0.6,y,w:0.62,h:0.62,fontSize:18,bold:true,color:C.background1,align:"center",valign:"middle",margin:0,isTextBox:true});
 s.addText(e[0],{x:1.45,y,w:1.5,h:0.62,fontSize:20,bold:true,color:C.text2,valign:"middle",margin:0,isTextBox:true});
 s.addText(e[1],{x:3.0,y,w:4.4,h:0.62,fontSize:15,color:C.text1,valign:"middle",margin:0,isTextBox:true});});
s.addShape(pres.ShapeType.roundRect,{x:7.8,y:1.5,w:4.9,h:4.9,fill:{color:C.text2},line:{color:C.text2},rectRadius:0.12});
s.addText([{text:"나쁜 예",options:{bold:true,color:C.accent2,breakLine:true}},{text:"\"이 로그 봐줘\"",options:{color:C.background1,breakLine:true}},{text:" ",options:{breakLine:true}},{text:"좋은 예",options:{bold:true,color:C.accent2,breakLine:true}},{text:"\"운영 엔지니어로서 아래 로그의 타임라인과 원인 가설 3개(가능성%), 확인 SQL을 알려줘. 모르면 '확인 필요'로 표시.\"",options:{color:C.background1}}],{x:8.1,y:1.8,w:4.3,h:4.3,fontSize:16,valign:"top",margin:0,isTextBox:true});

s=content("안전 수칙: 이것만은 지키세요","원칙");
card(s,0.6,1.5,3.9,4.9,"넣지 말 것",B(["주민번호·카드번호 등 개인정보","계정·비밀번호·API 키","고객사 비공개 소스(승인 없이)"]),{badge:"1",bc:C.accent3});
card(s,4.7,1.5,3.9,4.9,"마스킹 후 입력",B(["이름→ 홍○○, 번호→ 010-****","서버·계정·IP 치환","고객사 보안 지침 확인"]),{badge:"2",bc:C.accent2});
card(s,8.8,1.5,3.9,4.9,"결과는 검증 후 사용",B(["수치는 원본과 대조","수정 코드는 테스트로 확인","운영 반영은 사람이 승인"]),{badge:"3",bc:C.accent6});

s=content("환각을 잡는 검증 체크리스트","원칙");
const ck=[["출처 확인","답의 근거가 입력 자료의 어디인지 찾을 수 있는가"],["재현 확인","명령·SQL·테스트를 직접 돌려 같은 결과가 나오는가"],["수치 대조","숫자는 원본 시스템·쿼리 결과와 일치하는가"],["범위 확인","AI가 모르는 내부 규칙·정책을 단정하지 않았는가"],["이상 징후","지나치게 확신하거나 없는 함수·옵션을 말하지 않는가"]];
ck.forEach((c,i)=>{const y=1.5+i*1.02;
 s.addShape(pres.ShapeType.roundRect,{x:0.6,y,w:12.1,h:0.88,fill:{color:C.background2},line:{color:C.background2},rectRadius:0.1});
 s.addShape(pres.ShapeType.ellipse,{x:0.85,y:y+0.2,w:0.48,h:0.48,fill:{color:C.accent6},line:{color:C.accent6}});
 s.addText("✓",{x:0.85,y:y+0.2,w:0.48,h:0.48,fontSize:16,bold:true,color:C.background1,align:"center",valign:"middle",margin:0,isTextBox:true});
 s.addText(c[0],{x:1.6,y,w:2.2,h:0.88,fontSize:18,bold:true,color:C.text2,valign:"middle",margin:0,isTextBox:true});
 s.addText(c[1],{x:3.9,y,w:8.6,h:0.88,fontSize:16,color:C.text1,valign:"middle",margin:0,isTextBox:true});});

// ---------- 공통 데모
sec("공통 데모");
function demo(n,title,problem,how,point,sec_){
 const s=content(`데모 ${n}. ${title}`,sec_);
 card(s,0.6,1.5,5.95,2.4,"상황",problem,{badge:"?",bc:C.accent5});
 card(s,6.75,1.5,5.95,2.4,"AI에게 시키는 법",how,{badge:"→",bc:C.accent1});
 band(s,0.6,4.2,12.1,2.3,"검증 포인트",point);return s}
demo(1,"티켓 분류와 초기 응답","접수된 티켓 4건을 유형·심각도·담당팀으로 나누고 고객 안내를 써야 함","분류 기준(열·등급)을 명시하고 '추정은 표시'하게 한다","AI가 매긴 심각도를 접수 담당자가 확정한다. 안내문의 약속 시각은 사람이 정한다.","공통 데모").addNotes("demo 탭1. 프롬프트의 심각도 기준을 지우고 다시 실행해 결과 차이를 보여주세요.");
demo(2,"새벽 배치 장애 로그 분석","정산 배치가 02:10에 멈춤. 로그와 어제 배포 이력이 있음","로그 + 최근 변경사항을 주고 '가설 3개 + 확인 방법'을 요구","가능성(%)은 추정치. AI가 준 SQL로 실제 세션을 조회해 사실을 확인한다.","공통 데모").addNotes("demo 탭2.");
demo(3,"레거시 코드 이해와 버그 수정","문서 없는 수수료 모듈. 부분취소 시 수수료 이중 차감(T-1004)","코드 + 기대 동작을 주고 '요약→원인→최소 diff→테스트→영향도' 요청","pytest를 직접 실행해 통과 확인. 환급 정책은 업무 담당자가 확정한다.","공통 데모").addNotes("demo 탭3 → 이어서 실습.");
demo(4,"월간 보고서 자동 초안","한 달 42건 티켓을 고객사 제출용 보고서로 정리","집계 수치는 시스템에서 확정해 주고, AI는 해석·문장화만","없는 숫자를 만들지 않았는지 원본과 대조. 표현 수위는 PM이 조정.","공통 데모").addNotes("demo 탭4.");

// ---------- 직무별
sec("직무별 트랙");
s=content("직무별 AI·에이전트 활용 지도","직무별 트랙");
const rows=[["직무","대표 활용","에이전트가 맡는 일","사람이 쥐는 일"],
["관리자","KPI·리스크 요약, 보고","실적 집계→요약 초안","우선순위·투자 판단"],
["기획자","요구 정리, 변경요청서","영향도·질문 목록 작성","정책·범위 결정"],
["운영자","알람 분류, 1차 진단","로그·메트릭 조회, 복구안","운영 변경 승인"],
["개발자","코드 이해·수정·테스트","수정안·테스트 작성/실행","리뷰·머지·배포"],
["S/W 엔지니어","배치·DB·미들웨어 장애","세션·쿼리·설정 조회","설정 변경·재기동"],
["N/W 엔지니어","장비 로그, 경로 장애","show 명령 분석·가설","설정 변경(CAB)"],
["H/W 엔지니어","SEL·SMART 해석","점검표·보고 초안","부품 교체·현장 작업"]];
const hdr={bold:true,color:C.background1,fill:{color:C.accent1},fontSize:14,valign:"middle"};
s.addTable(rows.map((r,i)=>r.map((c,j)=>({text:c,options:i===0?hdr:{fontSize:14,bold:j===0,color:j===0?C.text2:C.text1,valign:"middle",fill:{color:i%2?C.background1:C.background2}}}))),{x:0.6,y:1.45,w:12.1,colW:[2.0,3.5,3.6,3.0],rowH:0.62,border:{type:"solid",color:C.background2,pt:1},margin:[0.04,0.1,0.04,0.1],objectName:"RoleTable"});

function role(title,items){ // items: [{who, tasks[], prompt}]
 const s=content(title,"직무별 트랙");
 items.forEach((it,i)=>{const w=items.length===1?12.1:5.95,x=0.6+i*6.15;
  s.addShape(pres.ShapeType.roundRect,{x,y:1.5,w,h:5.1,fill:{color:C.background2},line:{color:C.background2},rectRadius:0.12});
  s.addText(it.who,{x:x+0.3,y:1.65,w:w-0.6,h:0.5,fontSize:22,bold:true,color:C.accent1,margin:0,isTextBox:true});
  s.addText(B(it.tasks),{x:x+0.3,y:2.25,w:w-0.6,h:1.9,fontSize:17,color:C.text1,valign:"top",paraSpaceAfter:8,margin:0,isTextBox:true});
  s.addShape(pres.ShapeType.roundRect,{x:x+0.2,y:4.2,w:w-0.4,h:2.25,fill:{color:C.text2},line:{color:C.text2},rectRadius:0.1});
  s.addText([{text:"프롬프트 예시",options:{bold:true,color:C.accent2,fontSize:14,breakLine:true}},{text:it.prompt,options:{color:C.background1,fontSize:16}}],{x:x+0.4,y:4.3,w:w-0.8,h:2.05,valign:"top",margin:0,isTextBox:true});});
 return s}
role("관리자·기획자: 판단 근거와 문서를 빠르게",[
 {who:"관리자",tasks:["월간 실적·SLA 위반 사유 요약","반복 장애의 비용·리스크 정리","개선 과제 우선순위 근거 작성"],prompt:"아래 11월 지표로 임원 보고용 3줄 요약과 리스크 2가지, 다음 달 개선안 2가지를 작성. 없는 수치는 만들지 말 것."},
 {who:"기획자",tasks:["모호한 요구를 변경요청서로 구조화","확인 질문 목록·누락 요구 탐지","영향 범위·일정 옵션 비교"],prompt:"고객 메일을 변경요청서로 정리하고 확인 질문 5개, 영향 범위, 일정 옵션 2가지를 표로 작성. 공수는 범위로 '추정' 표시."}]);
role("개발자·S/W 엔지니어: 코드와 운영 소프트웨어",[
 {who:"개발자",tasks:["레거시 코드 설명·인수인계 문서","버그 원인과 최소 수정 diff","경계값 테스트·영향도 정리"],prompt:"아래 함수와 기대 동작으로: 3줄 요약 → 버그 원인 → 최소 diff → 테스트 4개 → 호출부 영향 확인점 순으로 답해줘."},
 {who:"S/W 엔지니어",tasks:["배치·DB 장애 로그 분석","세션·락·슬로우쿼리 확인 SQL","재기동·재처리 절차 초안"],prompt:"아래 배치 로그에서 원인 가설 3개와 확인 SQL, 즉시/재발방지 조치를 구분. 운영 변경은 '승인 필요' 표시."}]);
role("운영자·N/W·H/W 엔지니어: 현장 장애 대응",[
 {who:"운영자 · N/W",tasks:["알람 분류·1차 진단 (운영자)","스위치·라우터 로그 해석 (N/W)","show 명령 중심의 확인 순서 제시"],prompt:"스위치 로그에서 타임라인과 가설 3개, 조회 전용 명령, 임시/영구 조치 구분. 설정 변경 명령은 '검토 필요'."},
 {who:"H/W 엔지니어",tasks:["SEL·SMART·RAID 로그 해석","점검 체크리스트·교체 판단 근거","고객 보고 3줄 요약"],prompt:"서버 로그의 위험도(상/중/하), 즉시 조치, 현장 점검 5개, 교체/관찰 판단을 작성. 위험 작업은 '백업 확인 후'로."}]);
s=content("직무별 데모 연결: 데모 탭 5~7","직무별 트랙");
card(s,0.6,1.5,3.9,3.9,"탭 5. N/W 장비 로그",B(["링크 플래핑·BGP 단절","조회 전용 명령 제시","DB 지연과 연관 추론"]),{badge:"5",fs:19});
card(s,4.7,1.5,3.9,3.9,"탭 6. H/W 장애 점검",B(["RAID Degraded·SMART","데이터 보호 우선 판단","고객 보고 3줄"]),{badge:"6",fs:19});
card(s,8.8,1.5,3.9,3.9,"탭 7. 변경요청서",B(["요구→CR 초안","영향도·리스크·일정 옵션","의사결정 요청 정리"]),{badge:"7",fs:19});
s.addText("각자 직무에 맞는 탭을 열고, 프롬프트를 내 업무에 맞게 바꿔 다시 실행해 보세요.",{x:0.6,y:5.8,w:12.1,h:0.6,fontSize:18,bold:true,color:C.accent1,margin:0,isTextBox:true});

// ---------- Agentic
sec("Agentic 실데모");
s=content("데모 8. 에이전트 실습실: 5가지 실험","Agentic 실데모");
const ex=[["실험","조작","관찰 포인트","붙일 이름"],["① 비교","A 챗봇 → B 에이전트","일반론 vs 증거 기반 보고","챗봇 vs 에이전트"],["② 거부","🛑 재기동 요청 거부","우회하지 않고 대안·위험 보고","승인 게이트"],["③ 도구 끄기","DB 조회 도구 해제 (라이브)","'확인 필요'가 늘고 결론이 약해짐","도구가 곧 능력"],["④ 자동 실행","승인 없이 자동 실행 켜기","사람 확인 없이 운영 변경 실행","자율성 L4의 위험"],["⑤ 한도","최대 반복 3회","목표 달성 전에 멈춤","반복 한도도 가드레일"]];
const xh={bold:true,color:C.background1,fill:{color:C.accent1},fontSize:15,valign:"middle"};
s.addTable(ex.map((r,i)=>r.map((c,j)=>({text:c,options:i===0?xh:{fontSize:15,bold:j===0||j===3,color:j===3?C.accent1:C.text1,valign:"middle",fill:{color:i%2?C.background1:C.background2}}}))),{x:0.6,y:1.45,w:12.1,colW:[1.9,3.4,4.0,2.8],rowH:0.7,border:{type:"solid",color:C.background2,pt:1},margin:[0.04,0.12,0.04,0.12],objectName:"ExperimentTable"});
band(s,0.6,5.9,12.1,1.0,"실험 ④ 뒤에 꼭 물을 질문","우리 시스템에서 이 체크박스를 켜도 되는 작업은 무엇인가요?");
s.addNotes("demo/index.html 탭 8. 키 없이도 오프라인 재생으로 ①②④⑤ 진행 가능, ③은 라이브 모드(API 키)에서 효과가 보입니다. 승인 게이트는 모델이 아니라 프로그램이 강제한다는 점을 강조.");
s=content("가드레일 설계: 에이전트를 안전하게 쓰는 5가지","Agentic 실데모");
const gr=[["최소 권한","읽기 전용 계정부터 시작"],["승인 게이트","쓰기·재기동·고객 발송은 사람 승인"],["감사 로그","모든 도구 호출과 근거 기록"],["롤백 계획","변경 전 원복 절차 확인"],["범위 제한","허용 도구·대상 시스템 명시"]];
gr.forEach((g,i)=>{const col=i%3,row=Math.floor(i/3);const x=0.6+col*4.12,y=1.5+row*2.65;
 card(s,x,y,3.95,2.45,g[0],g[1],{badge:String(i+1),bc:i===1?C.accent3:C.accent1,fs:17});});
band(s,8.72,4.15,3.95,2.45,"도입 원칙","읽기 → 초안 → 승인 후 실행 순서로 권한을 넓힌다");

// ---------- 실습
sec("실습");
s=content("실습 ①: Claude Code에 '목표'만 주고 지켜보기","실습");
const st=[["준비","cd sample-system\npython3 -m pytest -q\n→ 1 failed 확인"],["목표 한 문장","파일·위치는 알려주지 않고 오른쪽 문장만 입력"],["관찰","짝이 기록: 도구 순서, 반복 횟수, 권한을 물은 순간"],["확인","pytest 3 passed\ndiff 최소화 리뷰\n정책은 사람이 결정"]];
st.forEach((r,i)=>{const x=0.6+(i%2)*3.15,y=1.5+Math.floor(i/2)*2.35;
 s.addShape(pres.ShapeType.roundRect,{x,y,w:2.95,h:2.15,fill:{color:C.background2},line:{color:C.background2},rectRadius:0.12});
 s.addShape(pres.ShapeType.ellipse,{x:x+0.2,y:y+0.2,w:0.5,h:0.5,fill:{color:C.accent1},line:{color:C.accent1}});
 s.addText(String(i+1),{x:x+0.2,y:y+0.2,w:0.5,h:0.5,fontSize:15,bold:true,color:C.background1,align:"center",valign:"middle",margin:0,isTextBox:true});
 s.addText(r[0],{x:x+0.85,y:y+0.2,w:2.0,h:0.5,fontSize:17,bold:true,color:C.text2,valign:"middle",margin:0,isTextBox:true});
 s.addText(r[1],{x:x+0.2,y:y+0.85,w:2.6,h:1.2,fontSize:14,color:C.text1,valign:"top",margin:0,isTextBox:true});});
s.addShape(pres.ShapeType.roundRect,{x:7.1,y:1.5,w:5.6,h:3.0,fill:{color:C.text2},line:{color:C.text2},rectRadius:0.12});
s.addText([{text:"Claude Code에 입력할 목표",options:{bold:true,color:C.accent2,fontSize:14,breakLine:true}},{text:" ",options:{fontSize:8,breakLine:true}},{text:"\"T-1004 고객 민원: 부분취소할 때 수수료가 이중으로 차감됩니다. 원인을 찾아 최소한으로 고치고, 테스트가 모두 통과하는지 확인해 주세요.\"",options:{color:C.background1,fontSize:17}}],{x:7.4,y:1.7,w:5.0,h:2.6,valign:"top",margin:0,isTextBox:true});
band(s,7.1,4.7,5.6,1.95,"연결 포인트","Claude Code가 파일 수정·명령 실행 전에 묻는 권한 확인 = 오늘 배운 승인 게이트");
s.addNotes("실습키트_Agentic.md 4장의 관찰 기록지를 나눠주세요. 개발·S/W는 직접 실행, 다른 직무는 짝 관찰. 정답(부분취소 분기에서 -original_fee 반환)은 실습 후 공개.");
s=content("실습 ②: 직무별 미션 (sample-system 자료 사용)","실습");
const ms=[["관리자·기획자","tickets.csv로 월간 요약과 변경요청서(T-1004) 작성"],["운영자·S/W","app.log로 T-1005 원인 가설과 확인 SQL 작성"],["개발자","billing.py 버그 수정 + 테스트 2개 추가"],["N/W·H/W","데모 탭 5·6 입력을 내 장비 사례로 바꿔 재실행"]];
ms.forEach((m,i)=>{const y=1.5+i*1.15;
 s.addShape(pres.ShapeType.roundRect,{x:0.6,y,w:12.1,h:1.0,fill:{color:C.background2},line:{color:C.background2},rectRadius:0.1});
 s.addText(m[0],{x:0.9,y,w:2.8,h:1.0,fontSize:19,bold:true,color:C.accent1,valign:"middle",margin:0,isTextBox:true});
 s.addText(m[1],{x:3.8,y,w:8.7,h:1.0,fontSize:16,color:C.text1,valign:"middle",margin:0,isTextBox:true});});
s.addText("공통 산출물: ① 쓴 프롬프트 ② AI가 틀리거나 부족했던 점 ③ 내가 검증한 방법",{x:0.6,y:6.2,w:12.1,h:0.5,fontSize:16,bold:true,color:C.accent1,margin:0,isTextBox:true});


sec("설계");
s=content("에이전트 설계 캔버스: 내 업무에 붙인다면","설계");
const cv=[["목표","한 문장 목표"],["완료 기준","끝났다는 증거"],["읽기 도구","마음껏 쓸 조회"],["쓰기 도구","승인이 필요한 변경"],["승인 지점 🛑","누가·언제"],["금지 사항","절대 하면 안 되는 것"],["검증 방법","테스트·조회·대사"],["멈춤 조건","반복·시간·비용 한도"],["자율성 단계","L1 ~ L4"],["측정 지표","효과를 재는 숫자"]];
cv.forEach((c,i)=>{const col=i%5,row=Math.floor(i/5);const x=0.6+col*2.45,y=1.5+row*2.05;const gate=c[0].includes("🛑")||c[0]==="쓰기 도구";
 s.addShape(pres.ShapeType.roundRect,{x,y,w:2.3,h:1.85,fill:{color:gate?C.accent3:C.background2},line:{color:gate?C.accent3:C.background2},rectRadius:0.1});
 s.addText(c[0],{x:x+0.2,y:y+0.2,w:1.9,h:0.5,fontSize:17,bold:true,color:gate?C.background1:C.accent1,margin:0,isTextBox:true});
 s.addText(c[1],{x:x+0.2,y:y+0.8,w:1.9,h:0.8,fontSize:14,color:gate?C.background1:C.text1,valign:"top",margin:0,isTextBox:true});});
s.addText("조별로 직무 업무 1개를 골라 작성 → 3분 발표 → 가장 빨리 L2로 시작할 수 있는 캔버스를 파일럿 후보로 선정",{x:0.6,y:5.8,w:12.1,h:0.8,fontSize:16,bold:true,color:C.accent1,margin:0,isTextBox:true});
s.addNotes("워크시트와 N/W 엔지니어 작성 예시는 실습키트_Agentic.md 5장. 빨간 칸(쓰기 도구·승인 지점)을 비워둔 조는 발표 전에 반드시 채우게 하세요.");

// ---------- 정리
sec("정리");
s=content("효과는 이렇게 측정하세요","정리");
const mk=[["처리시간","티켓당 분류·분석에 걸린 시간 전/후"],["SLA 준수율","미준수 건 사유 변화"],["재작업률","AI 초안 수정·반려 비율"],["문서 공수","월간 보고·CR 작성 시간"]];
mk.forEach((m,i)=>{const x=0.6+(i%2)*6.15,y=1.5+Math.floor(i/2)*2.5;card(s,x,y,5.95,2.2,m[0],m[1],{badge:String(i+1),fs:18});});
s.addText("※ 절감 수치는 정해진 값이 아니라 파일럿에서 직접 측정해 확인합니다.",{x:0.6,y:6.6,w:12.1,h:0.4,fontSize:14,color:C.accent5,margin:0,isTextBox:true});
s=content("도입 로드맵: 작게 시작해서 넓힙니다","정리");
const rm=[["1개월","파일럿 (L1~L2)","티켓 분류·보고서·로그 요약\n마스킹 규칙·사용 가이드 확정"],["2개월","확산 (L2~L3)","직무별 프롬프트 템플릿 공유\n읽기 전용 에이전트 파일럿"],["3개월","정착","효과 지표 리뷰\n승인 게이트 기반 자동화 확대"]];
rm.forEach((r,i)=>{const x=0.6+i*4.15;
 s.addShape(pres.ShapeType.roundRect,{x,y:1.6,w:3.9,h:4.2,fill:{color:i===0?C.accent1:C.background2},line:{color:i===0?C.accent1:C.background2},rectRadius:0.12});
 s.addText(r[0],{x:x+0.3,y:1.85,w:3.3,h:0.6,fontSize:28,bold:true,color:i===0?C.accent2:C.accent1,margin:0,isTextBox:true});
 s.addText(r[1],{x:x+0.3,y:2.5,w:3.3,h:0.5,fontSize:20,bold:true,color:i===0?C.background1:C.text2,margin:0,isTextBox:true});
 s.addText(r[2],{x:x+0.3,y:3.2,w:3.3,h:2.3,fontSize:20,color:i===0?C.background1:C.text1,valign:"top",margin:0,isTextBox:true});});
s=content("회상 퀴즈: 1주 뒤에도 답할 수 있나요?","정리");
const qz=["챗봇과 에이전트의 가장 큰 차이를 한 문장으로?","에이전트의 4요소는?","데모에서 승인 게이트를 강제한 주체는 모델인가, 프로그램인가?","도구를 하나 빼면 에이전트는 어떻게 되나?","우리 업무에서 '읽기는 맡기고 쓰기는 승인'의 예는?"];
qz.forEach((q,i)=>{const y=1.5+i*1.0;
 s.addShape(pres.ShapeType.roundRect,{x:0.6,y,w:12.1,h:0.85,fill:{color:C.background2},line:{color:C.background2},rectRadius:0.1});
 s.addShape(pres.ShapeType.ellipse,{x:0.85,y:y+0.15,w:0.55,h:0.55,fill:{color:C.accent2},line:{color:C.accent2}});
 s.addText("Q"+(i+1),{x:0.85,y:y+0.15,w:0.55,h:0.55,fontSize:14,bold:true,color:C.text1,align:"center",valign:"middle",margin:0,isTextBox:true});
 s.addText(q,{x:1.65,y,w:10.8,h:0.85,fontSize:18,color:C.text1,valign:"middle",margin:0,isTextBox:true});});
s.addText("같은 5문항을 1주 후 다시 보냅니다",{x:0.6,y:6.6,w:12.1,h:0.4,fontSize:14,color:C.accent5,margin:0,isTextBox:true});
s.addNotes("정답: 1) 챗봇은 대답하고 에이전트는 도구로 직접 일한다 2) 목표·도구·루프·승인 3) 프로그램(하니스) — 모델의 선의에 맡기지 않는다 4) 그 능력이 사라지고 '확인 필요'가 늘어난다. 도구 설계가 곧 에이전트 설계 5) 직무별 자유 답변");
s=dark("정리");
s.addText("챗봇은 대답하고, 에이전트는 일한다",{x:0.8,y:1.2,w:11.8,h:0.9,fontSize:40,bold:true,color:C.background1,margin:0,isTextBox:true});
s.addText("내일 바로 해볼 것",{x:0.8,y:2.2,w:11.5,h:0.5,fontSize:20,bold:true,color:C.accent2,margin:0,isTextBox:true});
s.addText(B(["내 직무에서 '읽고 정리하는' 일 1개를 고른다","프롬프트 5요소로 작성하고, 개인정보는 마스킹한다","결과를 원본과 대조해 고친 점을 기록한다","내 설계 캔버스를 L1~L2로 시범 적용하고 1주 후 공유한다"]),{x:0.8,y:2.9,w:11.2,h:3,fontSize:22,color:C.background2,paraSpaceAfter:12,valign:"top",margin:0,isTextBox:true});
(async()=>{await pres.writeFile({fileName:"AI교육_유지관리.pptx"});await applyTheme("AI교육_유지관리.pptx",THEME);console.log("ok")})();
