const pptxgen=require("pptxgenjs");
let applyTheme=async()=>console.warn("테마 적용 도구(APPLY_THEME)가 없어 기본 색으로 저장됩니다");
try{if(process.env.APPLY_THEME)({applyTheme}=require(process.env.APPLY_THEME));}catch(e){}
const THEME={name:"Maintenance AI Advanced",headFontFace:"Arial",bodyFontFace:"Arial",colors:{dk1:"1B2430",lt1:"FFFFFF",dk2:"14213D",lt2:"EEF3F8",accent1:"2A6F97",accent2:"F2A33A",accent3:"D9534F",accent4:"5B8DEF",accent5:"7A8B99",accent6:"2E9E6B",hlink:"2A6F97",folHlink:"7A8B99"}};
const pres=new pptxgen();pres.layout="LAYOUT_WIDE";pres.theme={headFontFace:"Arial",bodyFontFace:"Arial"};
pres.title="AI 도입 보안 판단";
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


function table(s,rows,x,y,w,colW,rowH,fs,hl){
 const hd={bold:true,color:C.background1,fill:{color:C.accent1},fontSize:fs||14,valign:"middle"};
 s.addTable(rows.map((r,i)=>r.map((c,j)=>({text:c,options:i===0?hd:{fontSize:fs||14,bold:j===0,color:(hl&&j===hl)?C.accent1:C.text1,valign:"middle",fill:{color:i%2?C.background1:C.background2}}}))),
  {x,y,w,colW,rowH,border:{type:"solid",color:C.background2,pt:1},margin:[0.04,0.12,0.04,0.12]});}
sec("보안 판단");
let s=dark("보안 판단");
s.addText("유지관리 사업 AI 도입",{x:0.8,y:1.7,w:11.5,h:0.6,fontSize:24,color:C.accent2,margin:0,isTextBox:true});
s.addText("망분리 · 폐쇄망 · 규정 환경에서의\n보안 판단",{x:0.8,y:2.3,w:11.8,h:2.0,fontSize:44,bold:true,color:C.background1,margin:0,isTextBox:true});
s.addText("쓸 수 있는 곳은 쓰고, 안 되는 곳은 확실히 막는다",{x:0.8,y:4.6,w:11.5,h:0.7,fontSize:22,color:C.background2,margin:0,isTextBox:true});
s.addText("상세: security/AI도입_보안판단가이드.md · 법률 자문이 아니며 최종 판단은 고객사 보안·법무 검토로 확정",{x:0.8,y:6.3,w:11.8,h:0.4,fontSize:14,color:C.accent5,margin:0,isTextBox:true});

s=content("판단 흐름: 다섯 가지 질문","보안 판단");
const qs=[["Q1","외부 AI 서비스 사용을 고객사가 허용하나?","지침 · 계약 · 사전 승인"],["Q2","데이터 등급은?","공개 / 내부 / 개인정보 / 중요·기밀"],["Q3","망 구분은?","인터넷 가능 / 망분리 / 폐쇄망"],["Q4","무엇을 어떤 조건으로 보낼 수 있나?","비식별 · 승인 · 망연계"],["Q5","어디까지 맡기나?","읽기·초안 / 운영 변경"]];
qs.forEach((q,i)=>{const y=1.45+i*0.98;
 s.addShape(pres.ShapeType.roundRect,{x:0.6,y,w:12.1,h:0.85,fill:{color:C.background2},line:{color:C.background2},rectRadius:0.1});
 s.addShape(pres.ShapeType.ellipse,{x:0.85,y:y+0.12,w:0.62,h:0.62,fill:{color:C.accent1},line:{color:C.accent1}});
 s.addText(q[0],{x:0.85,y:y+0.12,w:0.62,h:0.62,fontSize:14,bold:true,color:C.background1,align:"center",valign:"middle",margin:0,isTextBox:true});
 s.addText(q[1],{x:1.7,y,w:6.4,h:0.85,fontSize:17,bold:true,color:C.text2,valign:"middle",margin:0,isTextBox:true});
 s.addText(q[2],{x:8.2,y,w:4.3,h:0.85,fontSize:15,color:C.text1,valign:"middle",margin:0,isTextBox:true});});
s.addText("답이 '모름'이면 가장 보수적으로 가정한다: 최고 등급 데이터, 전송 불가, 읽기·초안까지만",{x:0.6,y:6.5,w:12.1,h:0.5,fontSize:16,bold:true,color:C.accent3,margin:0,isTextBox:true});

s=content("적용 유형 A~E","보안 판단");
const ty=[["A","외부 API 직접","공개·내부 데이터, 인터넷 가능","L3",C.accent6],["B","마스킹 후 외부 API","개인정보 가능성 → 자동 마스킹 + 사람 확인","L3 (개인정보 조치 L2)",C.accent1],["C","고객사 클라우드 경유","고객사 클라우드(Bedrock · Vertex AI · Foundry) 계약 안에서 처리","A·B와 같음",C.accent4],["D","망분리 환경","승인된 망연계로 반출한 비식별 자료만 분석","L1~L2",C.accent2],["E","완전 폐쇄망","실데이터 적용 없음, 가상 데이터로 교육·설계","—",C.accent3]];
ty.forEach((t,i)=>{const x=0.6+i*2.47;
 s.addShape(pres.ShapeType.roundRect,{x,y:1.5,w:2.3,h:4.6,fill:{color:t[4]},line:{color:t[4]},rectRadius:0.12});
 s.addText(t[0],{x:x+0.2,y:1.65,w:1.9,h:0.8,fontSize:40,bold:true,color:i===3?C.text1:C.background1,margin:0,isTextBox:true});
 s.addText(t[1],{x:x+0.2,y:2.5,w:1.9,h:0.8,fontSize:17,bold:true,color:i===3?C.text1:C.background1,valign:"top",margin:0,isTextBox:true});
 s.addText(t[2],{x:x+0.2,y:3.35,w:1.9,h:1.8,fontSize:14,color:i===3?C.text1:C.background1,valign:"top",margin:0,isTextBox:true});
 s.addText("자율성 상한: "+t[3],{x:x+0.2,y:5.25,w:1.9,h:0.7,fontSize:13,bold:true,color:i===3?C.text1:C.background1,valign:"top",margin:0,isTextBox:true});});
s.addText("C·E의 제공 형태(지역 · 설치 방식 · 계약)는 바뀔 수 있으니 제안 시점에 공급사와 클라우드 사업자에 다시 확인",{x:0.6,y:6.4,w:12.1,h:0.5,fontSize:14,color:C.accent5,margin:0,isTextBox:true});

s=content("데이터 반출 판단표 (출발점)","보안 판단");
table(s,[["데이터","기본 판단","조건"],["시스템 로그 (개인정보 없음)","조건부 가능","마스킹 실행 + 필요한 시간대만"],["장애 티켓 본문","조건부 가능","마스킹 + 사람 확인 (이름·주소는 자동으로 안 잡힘)"],["설정 파일","조건부 가능","비밀번호·키·인증서 제거 확인"],["소스코드","고객사 승인 필요","계약상 반출 가능 여부 확인"],["DB 실데이터 (고객 정보)","원칙적 금지","스키마·집계 결과만"],["인증 정보","금지","어떤 경우에도 전송하지 않음"]],0.6,1.45,12.1,[3.6,2.3,6.2],0.68,15,1);
s.addText("첫째 원칙: 보낼 필요가 없는 데이터는 보내지 않는다. 마스킹은 그다음 방어선",{x:0.6,y:6.45,w:12.1,h:0.5,fontSize:17,bold:true,color:C.accent1,margin:0,isTextBox:true});

s=content("마스킹: 자동으로 가리는 것과 사람이 봐야 하는 것","보안 판단");
s.addShape(pres.ShapeType.roundRect,{x:0.6,y:1.5,w:6.0,h:3.9,fill:{color:C.text1},line:{color:C.text1},rectRadius:0.1});
s.addText([{text:"마스킹 전",options:{bold:true,color:C.accent2,breakLine:true}},{text:"접수자: 홍길동 / 010-1234-5678",options:{breakLine:true}},{text:"카드 4321-8765-1111-2222",options:{breakLine:true}},{text:"환불 계좌: 110-234-567890",options:{breakLine:true}},{text:"password=Tmp#2026, 10.20.31.7",options:{breakLine:true}},{text:" ",options:{breakLine:true}},{text:"마스킹 후",options:{bold:true,color:C.accent2,breakLine:true}},{text:"접수자: 홍길동 / [휴대전화]",options:{breakLine:true}},{text:"카드 [카드번호]",options:{breakLine:true}},{text:"환불 계좌: [계좌번호]",options:{breakLine:true}},{text:"password=[비밀번호], [IP]",options:{}}],{x:0.9,y:1.7,w:5.5,h:3.5,fontSize:14,fontFace:"Courier New",color:C.background1,valign:"top",margin:0,isTextBox:true});
card(s,6.9,1.5,5.8,1.8,"자동으로 가리는 것",[{text:"주민번호 · 카드 · 이메일 · 전화 · 계좌 · IP · API 키 · 비밀번호 값",options:{}}],{badge:"✓",bc:C.accent6,fs:15});
card(s,6.9,3.5,5.8,1.9,"사람이 봐야 하는 것",[{text:"이름 · 주소 · 회사·부서명 · 사내 고유명칭 (예: '홍길동'은 남는다)",options:{}}],{badge:"!",bc:C.accent3,fs:15});
s.addText("python3 mask.py 파일   ·   python3 agent.py --pack settle --mask   (감사 로그에는 원문 없이 건수만)",{x:0.6,y:5.7,w:12.1,h:0.45,fontSize:15,fontFace:"Courier New",color:C.text1,margin:0,isTextBox:true});
s.addText("규칙은 mask.py의 RULES에 있다. 사번·고객번호 같은 사업 고유 형식은 규칙과 테스트를 추가한다",{x:0.6,y:6.3,w:12.1,h:0.5,fontSize:15,bold:true,color:C.accent1,margin:0,isTextBox:true});
s.addNotes("실습: advanced/agent_lab/samples/ticket_with_pii.txt를 마스킹해 결과를 함께 보고, 남은 이름을 수강생이 찾게 하세요.");

s=content("고객사에 확인할 질문 (요약)","보안 판단");
const ask=[["보안 지침 · 승인",["외부 생성형 AI 사용 지침과 승인 절차","허용 서비스 목록 · 클라우드 제한","외부 API 호출 · 방화벽 예외 절차"]],["데이터",["로그 · 티켓 · 코드 · 설정의 데이터 등급","개인정보 전송 가능 여부와 비식별 기준","데이터 처리 지역 요구"]],["서비스 조건",["전송 데이터의 보관 기간 · 삭제","모델 학습 사용 여부","처리 지역 · 재위탁 · 보안 인증"]],["운영 · 책임",["쓰기 조치 승인자 (수행사 / 고객사)","감사 로그 보관 · 제공","사고 보고 절차 · 책임 분담"]]];
ask.forEach((a,i)=>{const x=0.6+(i%2)*6.15,y=1.5+Math.floor(i/2)*2.55;card(s,x,y,5.95,2.35,a[0],B(a[1]),{badge:String(i+1),fs:14});});
s.addText("전체 질문은 가이드 4장. '서비스 조건'은 공급사 약관·계약 문서로 확인한다",{x:0.6,y:6.65,w:12.1,h:0.4,fontSize:14,color:C.accent5,margin:0,isTextBox:true});

s=content("고객사 요구 → 기술 통제 대응표","보안 판단");
table(s,[["고객사 요구","대응 통제","교육 자료 위치"],["개인정보 외부 전송 최소화","자동 마스킹 + 사람 확인","mask.py, --mask"],["운영 변경은 승인 후","쓰기 도구 승인 게이트","harness.py Policy.decide()"],["모든 행동 추적","감사 로그 (마스킹 건수만 기록)","runs/*/audit.jsonl"],["최소 권한","읽기 전용 계정, 도구 범위 제한","계정 발급 · 도구팩 설계"],["폭주 · 비용 통제","반복 · 호출 한도","--max-iter"],["외부 데이터 속 지시문","탐지 · 표시 + 승인 게이트","scan_untrusted()"]],0.6,1.45,12.1,[3.6,4.3,4.2],0.68,15);
s.addText("교육에서 배운 가드레일이 그대로 고객사 보안 요구에 대한 답이 된다",{x:0.6,y:6.45,w:12.1,h:0.5,fontSize:17,bold:true,color:C.accent1,margin:0,isTextBox:true});

s=content("제안서 · 계약에 반드시 넣을 것","보안 판단");
const ct=["적용 유형(A~E)과 근거","외부 전송 데이터 범위와 비식별 방법","쓰기 조치 승인자와 자율성 단계","감사 로그 보관 기간과 제공 방식","서비스 데이터 처리 조건 확인 근거","사고 시 보고 · 중단(L1 강등) 절차"];
ct.forEach((c,i)=>{const col=i%2,row=Math.floor(i/2);const x=0.6+col*6.15,y=1.5+row*1.35;
 s.addShape(pres.ShapeType.roundRect,{x,y,w:5.95,h:1.15,fill:{color:C.background2},line:{color:C.background2},rectRadius:0.1});
 s.addShape(pres.ShapeType.rect,{x:x+0.3,y:y+0.38,w:0.4,h:0.4,fill:{color:C.background1},line:{color:C.accent1,width:1.5}});
 s.addText(c,{x:x+0.95,y,w:4.8,h:1.15,fontSize:17,color:C.text1,valign:"middle",margin:0,isTextBox:true});});
band(s,0.6,5.7,12.1,1.2,"폐쇄망 고객사의 교육","기본 데모는 오프라인 재생, 심화 실습은 모의 실행으로 진행한다 — 둘 다 키와 인터넷 없이 동작");

s=dark("보안 판단");
s.addText("판단 없이 도입하면 사고,\n판단 없이 금지하면 기회 손실",{x:0.8,y:1.5,w:11.8,h:2.0,fontSize:40,bold:true,color:C.background1,margin:0,isTextBox:true});
s.addText(B(["다섯 질문으로 적용 유형(A~E)을 정한다","보낼 필요 없는 데이터는 보내지 않고, 보낼 데이터는 마스킹 후 사람이 확인한다","결정과 근거를 제안서·계약에 남긴다"]),{x:0.8,y:3.9,w:11.5,h:2.4,fontSize:22,color:C.background2,paraSpaceAfter:12,valign:"top",margin:0,isTextBox:true});

(async()=>{await pres.writeFile({fileName:"보안판단_슬라이드.pptx"});await applyTheme("보안판단_슬라이드.pptx",THEME);console.log("ok")})();
