const pptxgen=require("pptxgenjs");
let applyTheme=async()=>console.warn("테마 적용 도구(APPLY_THEME)가 없어 기본 색으로 저장됩니다");
try{if(process.env.APPLY_THEME)({applyTheme}=require(process.env.APPLY_THEME));}catch(e){}
const THEME={name:"Maintenance AI Advanced",headFontFace:"Arial",bodyFontFace:"Arial",colors:{dk1:"1B2430",lt1:"FFFFFF",dk2:"14213D",lt2:"EEF3F8",accent1:"2A6F97",accent2:"F2A33A",accent3:"D9534F",accent4:"5B8DEF",accent5:"7A8B99",accent6:"2E9E6B",hlink:"2A6F97",folHlink:"7A8B99"}};
const pres=new pptxgen();pres.layout="LAYOUT_WIDE";pres.theme={headFontFace:"Arial",bodyFontFace:"Arial"};
pres.title="Agentic AI로 발전하는 과정";
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


// ===== Agentic AI로 발전하는 과정 =====
function table(s,rows,x,y,w,colW,rowH,fs,hl){
 const hd={bold:true,color:C.background1,fill:{color:C.accent1},fontSize:fs||14,valign:"middle"};
 s.addTable(rows.map((r,i)=>r.map((c,j)=>({text:c,options:i===0?hd:{fontSize:fs||14,bold:j===0,color:(hl&&j===hl)?C.accent1:C.text1,valign:"middle",fill:{color:i%2?C.background1:C.background2}}}))),
  {x,y,w,colW,rowH,border:{type:"solid",color:C.background2,pt:1},margin:[0.04,0.12,0.04,0.12]});}
const STAGE=[
 {n:1,name:"규칙 자동화",en:"Rule-based Automation",when:"오래전부터 · 지금도 현역",col:C.accent5,
  can:["정해진 조건이면 정해진 동작 (스크립트, cron, RPA)","임계치 알람, 자동 재기동"],
  limit:["규칙에 없는 상황에서 멈추거나 잘못 반복","규칙이 늘수록 유지 비용 증가"],
  field:"배치가 실패하면 자동 재기동 스크립트가 돈다. 원인(커넥션 점유)이 남아 있으면 재기동도 계속 실패한다",
  next:"규칙으로 다 적을 수 없는 '패턴'을 다뤄야 했다"},
 {n:2,name:"머신러닝 예측",en:"Machine Learning",when:"2010년대 확산",col:C.accent4,
  can:["데이터에서 패턴 학습: 이상 탐지, 고장 예측, 티켓 분류","규칙 없이도 '이상하다'를 알아챔"],
  limit:["과업마다 따로 학습·데이터 필요","알려 줄 뿐, 설명하거나 조치하지 못함"],
  field:"디스크 고장 예측 알람이 울린다. 무엇을, 어떤 순서로 해야 하는지는 사람이 판단한다",
  next:"언어를 이해하고 설명하는 범용 모델의 등장"},
 {n:3,name:"생성형 AI 챗봇",en:"Generative AI · LLM Chatbot",when:"2022년 말 대중화",col:C.accent1,
  can:["언어를 이해하고 만들어 냄: 요약, 설명, 초안, 코드","하나의 모델이 여러 과업을 처리"],
  limit:["붙여넣은 것만 볼 수 있음, 사내·최신 정보 모름","환각, 그리고 직접 실행은 못 함"],
  field:"로그를 복사해 붙여넣으면 원인 후보를 설명해 준다. 단, 근거 확인과 조치는 사람이 한다 (기본 과정 데모 A)",
  next:"모델이 바깥 세계(시스템·문서)를 직접 보게 하자"},
 {n:4,name:"도구 사용 · 검색 연결",en:"Tool Use · RAG",when:"2023년 무렵 확산",col:C.accent6,
  can:["모델이 함수 실행을 요청(도구 호출) → 프로그램이 실행","사내 문서를 검색해 근거로 답변(RAG)"],
  limit:["한두 번 호출하고 끝나는 경우가 많음","여러 단계를 엮고 검증하는 일은 사람이 설계"],
  field:"'로그 조회' 버튼이 달린 챗봇. 묻는 만큼 조회해 주지만, 다음에 무엇을 볼지는 사람이 정한다",
  next:"호출을 반복하며 스스로 계획을 고치게 하자"},
 {n:5,name:"에이전트",en:"Agent",when:"2024년 무렵부터 본격화",col:C.text2,
  can:["목표를 받아 생각 → 도구 → 관찰을 반복 (에이전트 루프)","조사 · 수정 · 검증 · 보고까지 한 흐름으로 (코딩 에이전트 등)"],
  limit:["매번 경로가 달라 평가가 필요","통제(승인 · 권한 · 감사)와 비용이 새 과제"],
  field:"목표 한 문장으로 로그 → DB → 설정 → 테스트를 스스로 조사하고, 운영 변경은 승인 후 실행한다 (데모 8, agent_lab 라이브)",
  next:"한 에이전트로는 길고 큰 일, 여러 시스템 연결이 벅차다"},
 {n:6,name:"다중 에이전트 · 표준 연결",en:"Multi-agent · Open Standards",when:"2025년 이후 확산 중",col:C.accent3,
  can:["역할을 나눈 여러 에이전트(조사 · 검토 · 보고)","MCP 같은 개방형 표준으로 사내 시스템을 도구로 연결","관리형 플랫폼에서 장시간 · 일정 실행"],
  limit:["책임 · 감사 · 비용을 조직 단위로 관리해야","거버넌스가 기술보다 어려워짐"],
  field:"야간 장애에 조사 에이전트와 검토 에이전트가 나눠 일하고, 운영 변경은 당직자가 승인한다 (파일럿 대상의 모습)",
  next:"→ 지금 우리가 준비하는 단계"}];

// 표지
sec("도입");
let s=dark("도입");
s.addText("유지관리 사업 교육",{x:0.8,y:1.6,w:11.5,h:0.6,fontSize:24,color:C.accent2,margin:0,isTextBox:true});
s.addText("Agentic AI(에이전트형 AI)로\n발전하는 과정",{x:0.8,y:2.2,w:11.8,h:2.0,fontSize:46,bold:true,color:C.background1,margin:0,isTextBox:true});
s.addText("규칙 자동화에서 '일하는 AI'까지 — 유지관리 현장의 눈으로 본 여섯 단계",{x:0.8,y:4.5,w:11.5,h:0.7,fontSize:22,color:C.background2,margin:0,isTextBox:true});
s.addText("60분 모듈 · 강의 진행안: evolution/강의진행안.md",{x:0.8,y:6.3,w:11.5,h:0.4,fontSize:14,color:C.accent5,margin:0,isTextBox:true});
s.addNotes("이 모듈은 기본 과정 ① 앞의 배경 설명, 또는 관리자·의사결정자 대상 단독 세션으로 씁니다.");

s=content("오늘 답할 세 가지 질문","도입");
const qs=[["무엇이 바뀌었나","AI가 '알려주는 것'에서 '일하는 것'으로 바뀐 여섯 단계"],["왜 지금 가능해졌나","모델 능력 · 도구 연결 · 루프 기술 · 평가와 안전 · 비용"],["우리는 어디쯤인가","같은 장애를 시대별로 비교하고, 조직 성숙도를 자가진단"]];
qs.forEach((q,i)=>{const x=0.6+i*4.12;
 s.addShape(pres.ShapeType.roundRect,{x,y:1.6,w:3.95,h:4.2,fill:{color:i===2?C.accent1:C.background2},line:{color:i===2?C.accent1:C.background2},rectRadius:0.12});
 s.addText(String(i+1),{x:x+0.3,y:1.8,w:1,h:1,fontSize:48,bold:true,color:i===2?C.accent2:C.accent1,margin:0,isTextBox:true});
 s.addText(q[0],{x:x+0.3,y:2.9,w:3.4,h:0.6,fontSize:22,bold:true,color:i===2?C.background1:C.text2,margin:0,isTextBox:true});
 s.addText(q[1],{x:x+0.3,y:3.6,w:3.4,h:2.0,fontSize:16,color:i===2?C.background1:C.text1,valign:"top",margin:0,isTextBox:true});});
s.addText("핵심: 새 단계는 이전 단계를 없애지 않고 그 위에 '층'을 더했다",{x:0.6,y:6.15,w:12.1,h:0.5,fontSize:18,bold:true,color:C.accent1,margin:0,isTextBox:true});

// 한 장 타임라인
s=content("한 장으로 보는 여섯 단계","도입");
s.addShape(pres.ShapeType.line,{x:0.9,y:3.15,w:11.5,h:0,line:{color:C.accent5,width:3,endArrowType:"triangle"}});
STAGE.forEach((st,i)=>{const x=0.6+i*2.05;
 s.addShape(pres.ShapeType.ellipse,{x:x+0.6,y:2.85,w:0.6,h:0.6,fill:{color:st.col},line:{color:C.background1,width:2}});
 s.addText(String(st.n),{x:x+0.6,y:2.85,w:0.6,h:0.6,fontSize:16,bold:true,color:C.background1,align:"center",valign:"middle",margin:0,isTextBox:true});
 s.addText(st.when,{x,y:1.6,w:1.85,h:1.0,fontSize:13,color:C.accent5,align:"center",valign:"bottom",margin:0,isTextBox:true});
 s.addShape(pres.ShapeType.roundRect,{x,y:3.75,w:1.85,h:2.6,fill:{color:st.col},line:{color:st.col},rectRadius:0.1});
 s.addText(st.name,{x:x+0.1,y:3.85,w:1.65,h:0.9,fontSize:15,bold:true,color:C.background1,align:"center",valign:"middle",margin:0,isTextBox:true});
 s.addText(st.can[0],{x:x+0.12,y:4.8,w:1.61,h:1.45,fontSize:12,color:C.background1,align:"center",valign:"top",margin:0,isTextBox:true});});
s.addText("시기는 '현장에 널리 퍼진 무렵'의 대략적 구분입니다. 앞 단계는 사라지지 않고 지금도 함께 쓰입니다.",{x:0.6,y:6.65,w:12.1,h:0.4,fontSize:14,color:C.accent5,margin:0,isTextBox:true});
s.addNotes("연도 논쟁보다 '무엇이 새로 가능해졌나'에 집중하세요. 참고로 트랜스포머 구조 논문은 2017년, 대화형 생성 AI 서비스의 대중화는 2022년 말, 개방형 연결 표준 MCP 공개는 2024년 말입니다.");

// 단계별 슬라이드
sec("여섯 단계");
STAGE.forEach(st=>{
 const s=pres.addSlide({masterName:"CONTENT",sectionTitle:"여섯 단계"});
 s.addShape(pres.ShapeType.rect,{x:0,y:0,w:3.6,h:7.5,fill:{color:st.col},line:{color:st.col}});
 s.addText(`${st.n}단계`,{x:0.45,y:0.6,w:2.8,h:0.5,fontSize:18,color:C.background2,margin:0,isTextBox:true});
 s.addText(st.name,{x:0.45,y:1.2,w:2.9,h:1.9,fontSize:st.name.length>8?28:34,bold:true,color:C.background1,valign:"top",margin:0,isTextBox:true,objectName:"Title"});
 s.addText(st.en,{x:0.45,y:3.2,w:2.9,h:0.8,fontSize:15,italic:true,color:C.background2,valign:"top",margin:0,isTextBox:true});
 s.addText(st.when,{x:0.45,y:4.2,w:2.9,h:0.5,fontSize:15,bold:true,color:C.accent2,margin:0,isTextBox:true});
 // 진행 표시
 STAGE.forEach((o,k)=>{s.addShape(pres.ShapeType.ellipse,{x:0.45+k*0.45,y:6.5,w:0.32,h:0.32,fill:{color:k+1===st.n?C.accent2:C.background1},line:{color:C.background1}});});
 card(s,4.0,0.5,4.25,2.75,"새로 할 수 있게 된 것",B(st.can),{badge:"+",bc:C.accent6,fs:15});
 card(s,8.45,0.5,4.25,2.75,"한계",B(st.limit),{badge:"−",bc:C.accent3,fs:15});
 s.addShape(pres.ShapeType.roundRect,{x:4.0,y:3.45,w:8.7,h:2.2,fill:{color:C.background2},line:{color:C.background2},rectRadius:0.12});
 s.addText("유지보수 현장에서는 (T-1005 정산 배치 장애)",{x:4.3,y:3.6,w:8.1,h:0.4,fontSize:14,bold:true,color:st.col===C.text2?C.accent1:st.col,margin:0,isTextBox:true});
 s.addText(st.field,{x:4.3,y:4.05,w:8.1,h:1.5,fontSize:17,color:C.text1,valign:"top",margin:0,isTextBox:true});
 band(s,4.0,5.85,8.7,1.1,"다음 단계로 넘어간 계기",st.next);
 s.addNotes(`${st.n}단계 ${st.name} (${st.en}) — ${st.when}\n현장 예: ${st.field}`);
});

// 동력
sec("왜 지금인가");
s=content("무엇이 이 진화를 가능하게 했나","왜 지금인가");
const dr=[["모델 능력","더 깊은 추론, 더 긴 문서·대화를 한 번에 다루는 능력"],["도구 연결의 표준화","도구 호출 기능이 API에 기본 탑재, MCP 같은 개방형 연결 표준"],["루프 · 하니스 기술","코딩 에이전트 등에서 '반복하며 검증하는' 방식이 실전 검증됨"],["평가와 안전 기술","평가 · 승인 게이트 · 거절 시 대체 모델 등 통제 수단의 성숙"],["비용과 속도","같은 작업의 비용이 낮아져 반복 호출이 현실적인 수준으로"]];
dr.forEach((d,i)=>{const col=i%3,row=Math.floor(i/3);const x=0.6+col*4.12,y=1.5+row*2.6;card(s,x,y,3.95,2.4,d[0],d[1],{badge:String(i+1),fs:16});});
band(s,8.84,4.1,3.85,2.4,"유지관리 관점","다섯 가지 중 '평가와 안전'이 갖춰져야 운영 업무에 쓸 수 있다");

s=content("각 단계는 이전 단계 위에 층을 더했다","왜 지금인가");
const layers=[["⑥ 협업 · 표준 연결","여러 에이전트 + MCP + 관리형 운영",C.accent3],["⑤ 루프 · 목표","스스로 반복하며 계획을 고친다",C.text2],["④ 도구 · 검색","바깥 세계를 보고 바꾼다",C.accent6],["③ 언어","이해하고 설명하고 쓴다",C.accent1],["② 학습","데이터에서 패턴을 찾는다",C.accent4],["① 규칙","정해진 대로 정확히 반복한다",C.accent5]];
layers.forEach((l,i)=>{const w=5.0+i*0.6,x=0.6,y=1.45+i*0.86;
 s.addShape(pres.ShapeType.roundRect,{x,y,w,h:0.76,fill:{color:l[2]},line:{color:l[2]},rectRadius:0.08});
 s.addText(l[0],{x:x+0.25,y,w:2.6,h:0.76,fontSize:16,bold:true,color:C.background1,valign:"middle",margin:0,isTextBox:true});
 s.addText(l[1],{x:x+2.85,y,w:w-3.0,h:0.76,fontSize:14,color:C.background1,valign:"middle",margin:0,isTextBox:true});});
card(s,9.3,1.45,3.4,5.0,"기본 과정 4요소와 연결",B(["언어 모델 → 모든 것의 바탕","도구 → ④단계","목표 · 루프 → ⑤단계","승인 → 층이 쌓일수록 더 중요"]),{fs:15});
s.addText("규칙 자동화(①)는 사라지지 않는다. 에이전트가 기존 스크립트를 '도구'로 호출하는 방식으로 함께 쓴다",{x:0.6,y:6.75,w:12.1,h:0.5,fontSize:15,bold:true,color:C.accent1,margin:0,isTextBox:true});

// 같은 장애
sec("같은 장애, 여섯 시대");
s=content("같은 장애, 여섯 시대: T-1005 정산 배치 중단","같은 장애, 여섯 시대");
table(s,[["단계","누가 무엇을 하나","사람의 일","남는 위험"],
 ["① 규칙","재기동 스크립트가 자동 실행","실패가 반복되면 원인 조사 전부","원인 그대로 재기동 반복"],
 ["② 학습","이상 탐지가 '배치 지연' 알람","알람 확인 후 조사·조치 전부","알람 피로, 조치 지연"],
 ["③ 챗봇","붙여넣은 로그로 원인 후보 설명","자료 수집, 검증, 조치","환각, 근거 부족"],
 ["④ 도구","요청한 만큼 로그·DB 조회","무엇을 볼지 결정, 조치","조사 순서가 사람 역량에 좌우"],
 ["⑤ 에이전트","조사 → 원인 특정 → 승인 요청 → 보고","승인·거부, 결과 검토","통제 설계가 부실하면 오조치"],
 ["⑥ 다중","조사·검토 에이전트 분업, 표준 연결","기준·승인·감사 설계","책임 소재, 비용 관리"]],0.6,1.45,12.1,[1.5,4.0,3.3,3.3],0.72,14);
s.addText("데모 8의 A(챗봇)와 B(에이전트)는 이 표의 ③과 ⑤를 실제로 보여준 것입니다",{x:0.6,y:6.65,w:12.1,h:0.45,fontSize:16,bold:true,color:C.accent1,margin:0,isTextBox:true});
s.addNotes("강의 진행안의 활동 1: 조별로 한 단계씩 맡아 '그 시대의 장애 대응'을 2분간 재연하게 하면 효과적입니다.");

s=content("사람의 역할은 '하는 사람'에서 '정하는 사람'으로","같은 장애, 여섯 시대");
const roleSteps=[["직접 수행","①②: 조사·판단·조치를 사람이 전부"],["자료 제공·검증","③④: AI에게 자료를 주고 답을 검증"],["승인·검토","⑤: 에이전트의 제안을 승인하거나 거부"],["기준·통제 설계","⑥: 무엇을 맡길지, 언제 멈출지를 설계"]];
roleSteps.forEach((r,i)=>{const x=0.6+i*3.07,y=4.6-i*0.85;
 s.addShape(pres.ShapeType.roundRect,{x,y,w:2.9,h:6.4-y,fill:{color:[C.accent5,C.accent1,C.text2,C.accent3][i]},line:{color:C.background1},rectRadius:0.1});
 s.addText(r[0],{x:x+0.2,y:y+0.15,w:2.5,h:0.5,fontSize:18,bold:true,color:C.background1,margin:0,isTextBox:true});
 s.addText(r[1],{x:x+0.2,y:y+0.7,w:2.5,h:1.1,fontSize:14,color:C.background1,valign:"top",margin:0,isTextBox:true});});
s.addText("일이 사라지는 것이 아니라, 판단의 위치가 올라간다",{x:0.6,y:1.5,w:7,h:0.5,fontSize:20,bold:true,color:C.accent1,margin:0,isTextBox:true});
s.addText("그래서 기본·심화 과정은 '승인 · 평가 · 권한 설계'를 가르친다",{x:0.6,y:6.6,w:12.1,h:0.45,fontSize:16,color:C.text1,margin:0,isTextBox:true});

// 비교
sec("비교와 오해");
s=content("RPA · 스크립트와 에이전트는 무엇이 다른가","비교와 오해");
table(s,[["구분","RPA · 스크립트 (①)","에이전트 (⑤)"],
 ["움직이는 방식","정해진 규칙과 순서","목표를 받아 스스로 순서를 정함"],
 ["예상 밖 상황","멈추거나 같은 동작 반복","다른 도구로 조사하며 대응 시도"],
 ["결과의 일관성","항상 같음","경로가 달라질 수 있음 → 평가 필요"],
 ["바꾸는 비용","규칙·화면이 바뀌면 수정","도구·설명·프롬프트 수정"],
 ["잘 맞는 일","정형 반복 (입력, 이관, 정기 점검)","판단이 필요한 조사·분석·초안"],
 ["통제 방법","규칙 자체가 통제","승인 게이트 · 권한 · 감사 · 평가"]],0.6,1.45,12.1,[2.4,4.6,5.1],0.6,15);
band(s,0.6,5.95,12.1,1.0,"대체가 아니라 조합","정형 반복은 스크립트가, 판단은 에이전트가. 에이전트는 검증된 스크립트를 '도구'로 호출한다");

s=content("진화에 대한 흔한 오해 네 가지","비교와 오해");
const myths=[["\"새 단계가 옛 단계를 대체한다\"","층이 쌓인다. 스크립트·예측 모델은 에이전트의 도구가 된다"],["\"에이전트면 사람이 필요 없다\"","역할이 바뀐다. 승인·기준·통제 설계는 사람의 일"],["\"단계를 건너뛸 수 있다\"","조회 도구, 사용 지침, 감사 체계 없이 에이전트부터 쓰면 실패한다"],["\"최신 모델이면 해결된다\"","성패는 하니스 · 평가 · 거버넌스가 가른다 (심화 과정 실측)"]];
myths.forEach((m,i)=>{const x=0.6+(i%2)*6.15,y=1.5+Math.floor(i/2)*2.55;
 card(s,x,y,5.95,2.35,m[0],[{text:"→ "+m[1],options:{}}],{badge:"✗",bc:C.accent3,fs:16});});

// 우리는 어디쯤
sec("우리는 어디쯤인가");
s=content("유지관리 조직의 AI 성숙도 5단계","우리는 어디쯤인가");
const mat=[["L0","수작업 · 스크립트","AI 공식 사용 없음, 규칙 자동화 중심"],["L1","개인별 활용","담당자 개인이 챗봇 사용, 지침·보안 기준 불명확"],["L2","팀 표준화","공용 프롬프트 템플릿, 마스킹 규칙, 조회 도구 연결"],["L3","에이전트 파일럿","읽기는 자동, 쓰기는 승인, 감사 로그 축적"],["L4","운영 내재화","평가 합격선 · 승인 RACI · 비용 관리 · 정기 재평가"]];
mat.forEach((m,i)=>{const x=0.6+i*2.47,h=1.8+i*0.55;
 s.addShape(pres.ShapeType.roundRect,{x,y:6.3-h,w:2.3,h,fill:{color:[C.accent5,C.accent4,C.accent1,C.text2,C.accent6][i]},line:{color:C.background1},rectRadius:0.1});
 s.addText(m[0],{x:x+0.2,y:6.3-h+0.12,w:1.9,h:0.55,fontSize:24,bold:true,color:C.accent2,margin:0,isTextBox:true});
 s.addText(m[1],{x:x+0.2,y:6.3-h+0.65,w:1.9,h:0.5,fontSize:16,bold:true,color:C.background1,margin:0,isTextBox:true});
 s.addText(m[2],{x:x+0.2,y:6.3-h+1.15,w:1.9,h:h-1.25,fontSize:13,color:C.background1,valign:"top",margin:0,isTextBox:true});});
s.addText("성숙도(L0~L4)는 '조직'의 준비 수준, 자율성 단계(L1~L4)는 '조치'별로 맡기는 범위 — 둘은 다른 척도",{x:0.6,y:1.45,w:12.1,h:0.5,fontSize:16,bold:true,color:C.accent1,margin:0,isTextBox:true});
s.addText("기준은 강의 진행안의 자가진단 체크리스트로 판정합니다",{x:0.6,y:6.55,w:12.1,h:0.4,fontSize:14,color:C.accent5,margin:0,isTextBox:true});

s=content("자가진단: 우리 팀은 어디쯤인가","우리는 어디쯤인가");
const chk=["AI 도구 사용 지침과 마스킹 규칙이 문서로 있다","팀이 같은 프롬프트 템플릿을 공유한다","AI가 로그·티켓을 직접 조회할 수 있는 도구가 있다 (읽기 전용)","에이전트의 쓰기 조치에 승인자가 정해져 있다","에이전트 행동이 감사 로그로 남는다","평가 케이스와 합격선이 있다","에이전트 1건당 비용을 실측해 관리한다","사고 시 자율성을 낮추는 기준이 있다"];
chk.forEach((c,i)=>{const col=i%2,row=Math.floor(i/2);const x=0.6+col*6.15,y=1.5+row*1.1;
 s.addShape(pres.ShapeType.roundRect,{x,y,w:5.95,h:0.95,fill:{color:C.background2},line:{color:C.background2},rectRadius:0.1});
 s.addShape(pres.ShapeType.rect,{x:x+0.25,y:y+0.3,w:0.35,h:0.35,fill:{color:C.background1},line:{color:C.accent1,width:1.5}});
 s.addText(c,{x:x+0.8,y,w:5.0,h:0.95,fontSize:15,color:C.text1,valign:"middle",margin:0,isTextBox:true});});
band(s,0.6,5.95,12.1,1.0,"판정 (제안)","0개 L0 · 1~2개 L1 · 3~4개 L2 · 5~6개 L3 · 7~8개 L4 — 점수보다 '비어 있는 칸'이 다음 투자 대상");

s=content("다음 단계로 가려면 무엇에 투자하나","우리는 어디쯤인가");
table(s,[["이동","핵심 투자","관련 교육"],
 ["L0 → L1","사용 지침, 보안·마스킹 규칙, 전 직원 기초 교육","기본 과정 · 용어집"],
 ["L1 → L2","프롬프트 템플릿 공유, 읽기 전용 조회 도구","기본 과정 데모 1~7"],
 ["L2 → L3","하니스 · 승인 게이트 · 감사 로그, 파일럿 1건","기본 데모 8 · 심화 과정"],
 ["L3 → L4","평가 체계 · 합격선 · 승인 RACI · 비용 관리","심화 과정 트랙 M · 캡스톤"]],0.6,1.5,12.1,[1.6,6.8,3.7],0.8,16);
band(s,0.6,6.0,12.1,0.95,"원칙","한 번에 한 단계씩. 각 단계에서 쌓인 기록(지침 · 로그 · 평가)이 다음 단계의 근거가 된다");

// 마무리
sec("정리");
s=content("앞으로: 능력이 커질수록 통제 설계의 가치가 커진다","정리");
card(s,0.6,1.5,5.95,3.6,"계속 커질 것",B(["더 길고 복잡한 작업을 맡김","더 많은 사내 시스템과 연결","여러 에이전트가 나눠서 일함"]),{badge:"↑",bc:C.accent1,fs:19});
card(s,6.75,1.5,5.95,3.6,"그래서 더 중요해질 것",B(["무엇을 맡기고 언제 멈출지 (자율성 · 승인)","제대로 했는지 확인하는 법 (평가 · 감사)","누가 책임지는지 (RACI · 계약)"]),{badge:"!",bc:C.accent3,fs:19});
band(s,0.6,5.4,12.1,1.3,"유지관리 사업의 기회","시스템을 가장 잘 아는 조직이 '에이전트가 일할 도구와 규칙'을 설계할 수 있다");

s=dark("정리");
s.addText("AI는 '답하는 도구'에서\n'일하는 동료'로",{x:0.8,y:1.3,w:11.8,h:2.0,fontSize:44,bold:true,color:C.background1,margin:0,isTextBox:true});
s.addText("그 동료가 일하는 범위는 우리가 설계한다",{x:0.8,y:3.4,w:11.5,h:0.7,fontSize:26,color:C.accent2,margin:0,isTextBox:true});
s.addText(B(["기본 과정: 4요소 체험 (목표 · 도구 · 루프 · 승인)","심화 과정: 하니스 · 가드레일 · 평가 · 거버넌스 직접 설계","용어집: 같은 말을 같은 뜻으로"]),{x:0.8,y:4.5,w:11.5,h:2,fontSize:20,color:C.background2,paraSpaceAfter:10,valign:"top",margin:0,isTextBox:true});

(async()=>{await pres.writeFile({fileName:"에이전트로의_진화.pptx"});await applyTheme("에이전트로의_진화.pptx",THEME);console.log("ok")})();
