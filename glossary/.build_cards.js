const pptxgen=require("pptxgenjs");
let applyTheme=async()=>console.warn("테마 적용 도구(APPLY_THEME)가 없어 기본 색으로 저장됩니다");
try{if(process.env.APPLY_THEME)({applyTheme}=require(process.env.APPLY_THEME));}catch(e){}
const THEME={name:"Maintenance AI Advanced",headFontFace:"Arial",bodyFontFace:"Arial",colors:{dk1:"1B2430",lt1:"FFFFFF",dk2:"14213D",lt2:"EEF3F8",accent1:"2A6F97",accent2:"F2A33A",accent3:"D9534F",accent4:"5B8DEF",accent5:"7A8B99",accent6:"2E9E6B",hlink:"2A6F97",folHlink:"7A8B99"}};
const pres=new pptxgen();pres.layout="LAYOUT_WIDE";pres.theme={headFontFace:"Arial",bodyFontFace:"Arial"};
pres.title="Agentic AI 핵심 용어집 카드";
const C=pres.SchemeColor;
pres.defineSlideMaster({title:"TITLE_DARK",background:{color:C.text2},objects:[],slideNumber:undefined});
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


// ===== 용어 카드집 (terms.json에서 생성) =====
const fs=require("fs");
const D=JSON.parse(fs.readFileSync(process.env.TERMS||__dirname+"/terms.json","utf8"));
const T=D.terms, byId=Object.fromEntries(T.map(t=>[t.id,t]));
const CH={1:C.accent5,2:C.accent1,3:C.accent4,4:C.text2,5:C.accent3,6:C.accent6};
const ROLE=D.roles;

// 표지
sec("소개");
let s=dark("소개");
s.addText("유지관리 사업 교육",{x:0.8,y:1.7,w:11.5,h:0.6,fontSize:24,color:C.accent2,margin:0,isTextBox:true});
s.addText(D.title,{x:0.8,y:2.3,w:11.8,h:1.3,fontSize:52,bold:true,color:C.background1,margin:0,isTextBox:true});
s.addText(`용어 카드 ${T.length}장 · 6장 구성 · 전 직무 필수 ${T.filter(t=>t.core).length}개`,{x:0.8,y:3.8,w:11.5,h:0.7,fontSize:22,color:C.background2,margin:0,isTextBox:true});
s.addText(`${D.version} · 같은 말을 같은 뜻으로`,{x:0.8,y:6.3,w:11.5,h:0.4,fontSize:14,color:C.accent5,margin:0,isTextBox:true});

// 카드 읽는 법
s=content("카드 읽는 법","소개");
const parts=[["한 줄 정의","무엇인가"],["유지보수 비유","현장 말로 바꾸면"],["교육에서 본 장면","기본·심화 과정의 어디서 봤나"],["흔한 오해","\"…\" → 바로잡기"],["쓰는 예문","보고서·회의에서 이렇게 쓴다"],["관련 용어","함께 기억할 카드"]];
parts.forEach((p,i)=>{const col=i%3,row=Math.floor(i/3);card(s,0.6+col*4.12,1.5+row*2.2,3.95,2.0,p[0],p[1],{badge:String(i+1),fs:16});});
s.addShape(pres.ShapeType.roundRect,{x:0.6,y:6.0,w:12.1,h:0.95,fill:{color:C.background2},line:{color:C.background2},rectRadius:0.1});
s.addText([{text:"★ 필수",options:{bold:true,color:C.accent3}},{text:"  전 직무가 반드시 알아야 할 용어      ",options:{color:C.text1}},{text:"M · O · D",options:{bold:true,color:C.accent1}},{text:"  그 용어를 꼭 알아야 할 직무 (M 관리·기획 / O 운영·N/W·H/W / D 개발·S/W)",options:{color:C.text1}}],{x:0.85,y:6.0,w:11.7,h:0.95,fontSize:15,valign:"middle",margin:0,isTextBox:true});

// 용어 지도: 6장 × 용어
s=content("용어 지도: 4요소로 묶은 6장","소개");
D.chapters.forEach((c,i)=>{const col=i%3,row=Math.floor(i/3);const x=0.6+col*4.12,y=1.45+row*2.75;
 s.addShape(pres.ShapeType.roundRect,{x,y,w:3.95,h:2.55,fill:{color:CH[c.no]},line:{color:CH[c.no]},rectRadius:0.12});
 s.addText(`${c.no}장 ${c.name}`,{x:x+0.25,y:y+0.15,w:3.45,h:0.45,fontSize:18,bold:true,color:C.background1,margin:0,isTextBox:true});
 s.addText(c.pillar,{x:x+0.25,y:y+0.6,w:3.45,h:0.35,fontSize:13,italic:true,color:C.background2,margin:0,isTextBox:true});
 const names=T.filter(t=>t.ch===c.no).map(t=>(t.core?"★ ":"")+t.ko);
 s.addText(names.join("  ·  "),{x:x+0.25,y:y+1.0,w:3.45,h:1.45,fontSize:14,color:C.background1,valign:"top",margin:0,isTextBox:true});});
s.addText("에이전트 = 목표 + 도구 + 루프 + 승인 · 읽기는 맡기고, 쓰기는 승인한다",{x:0.6,y:6.95,w:12.1,h:0.4,fontSize:15,bold:true,color:C.accent1,margin:0,isTextBox:true});

// 직무별 필수 용어
s=content("직무별로 꼭 알아야 할 용어","소개");
const lv={M:"판단 기준으로 쓸 수 있는 수준",O:"런북을 도구로 바꿀 수 있는 수준",D:"코드로 구현할 수 있는 수준"};
["M","O","D"].forEach((r,i)=>{const y=1.45+i*1.85;const list=T.filter(t=>t.roles.includes(r));
 s.addShape(pres.ShapeType.roundRect,{x:0.6,y,w:12.1,h:1.7,fill:{color:C.background2},line:{color:C.background2},rectRadius:0.1});
 s.addShape(pres.ShapeType.ellipse,{x:0.85,y:y+0.25,w:0.7,h:0.7,fill:{color:C.accent1},line:{color:C.accent1}});
 s.addText(r,{x:0.85,y:y+0.25,w:0.7,h:0.7,fontSize:20,bold:true,color:C.background1,align:"center",valign:"middle",margin:0,isTextBox:true});
 s.addText(ROLE[r],{x:1.7,y:y+0.2,w:3.0,h:0.45,fontSize:17,bold:true,color:C.text2,margin:0,isTextBox:true});
 s.addText(`${list.length}개 · ${lv[r]}`,{x:1.7,y:y+0.65,w:3.0,h:0.8,fontSize:13,color:C.accent5,valign:"top",margin:0,isTextBox:true});
 s.addText(list.map(t=>(t.core?"★":"")+t.ko).join(" · "),{x:4.8,y:y+0.15,w:7.7,h:1.4,fontSize:14,color:C.text1,valign:"middle",margin:0,isTextBox:true});});

// 장별 카드
D.chapters.forEach(c=>{
 const secName=`${c.no}장 ${c.name}`;sec(secName);
 const dv=pres.addSlide({masterName:"TITLE_DARK",sectionTitle:secName});
 dv.background={color:CH[c.no]};
 dv.addText(`${c.no}장`,{x:0.8,y:1.8,w:6,h:0.8,fontSize:28,color:C.background2,margin:0,isTextBox:true});
 dv.addText(c.name,{x:0.8,y:2.6,w:11.5,h:1.2,fontSize:54,bold:true,color:C.background1,margin:0,isTextBox:true});
 dv.addText(T.filter(t=>t.ch===c.no).map(t=>(t.core?"★ ":"")+t.ko).join("   ·   "),{x:0.8,y:4.2,w:11.5,h:1.2,fontSize:20,color:C.background1,valign:"top",margin:0,isTextBox:true});
 T.filter(t=>t.ch===c.no).forEach(t=>{
  const s=pres.addSlide({masterName:"CONTENT",sectionTitle:secName});
  const col=CH[c.no];
  s.addShape(pres.ShapeType.rect,{x:0,y:0,w:4.3,h:7.5,fill:{color:col},line:{color:col},objectName:"TermPanel"});
  s.addText(`${c.no}장 · ${c.name}`,{x:0.5,y:0.55,w:3.4,h:0.4,fontSize:14,color:C.background2,margin:0,isTextBox:true});
  if(t.core){s.addShape(pres.ShapeType.roundRect,{x:0.5,y:1.1,w:1.25,h:0.45,fill:{color:C.accent2},line:{color:C.accent2},rectRadius:0.2});
   s.addText("★ 필수",{x:0.5,y:1.1,w:1.25,h:0.45,fontSize:14,bold:true,color:C.text1,align:"center",valign:"middle",margin:0,isTextBox:true});}
  s.addText(t.ko,{x:0.5,y:1.9,w:3.5,h:1.9,fontSize:t.ko.length>8?30:38,bold:true,color:C.background1,valign:"bottom",margin:0,isTextBox:true,objectName:"Title"});
  s.addText(t.en,{x:0.5,y:3.95,w:3.5,h:0.9,fontSize:17,italic:true,color:C.background2,valign:"top",margin:0,isTextBox:true});
  s.addText("꼭 알아야 할 직무",{x:0.5,y:5.6,w:3.4,h:0.35,fontSize:12,color:C.background2,margin:0,isTextBox:true});
  ["M","O","D"].forEach((r,i)=>{const on=t.roles.includes(r);const x=0.5+i*0.75;
   s.addShape(pres.ShapeType.ellipse,{x,y:6.0,w:0.6,h:0.6,fill:{color:on?C.background1:col},line:{color:C.background1,width:1}});
   s.addText(r,{x,y:6.0,w:0.6,h:0.6,fontSize:16,bold:true,color:on?col:C.background1,align:"center",valign:"middle",margin:0,isTextBox:true});});
  // 오른쪽
  s.addText("한 줄 정의",{x:4.8,y:0.5,w:8,h:0.35,fontSize:13,bold:true,color:col,margin:0,isTextBox:true});
  s.addText(t.def,{x:4.8,y:0.9,w:8.0,h:1.55,fontSize:19,bold:true,color:C.text2,valign:"top",margin:0,isTextBox:true});
  const boxes=[["유지보수 비유",t.analogy],["교육에서 본 장면",t.scene],["흔한 오해",t.myth],["쓰는 예문",t.example]];
  boxes.forEach((b,i)=>{const x=4.8+(i%2)*4.1,y=2.65+Math.floor(i/2)*2.0;
   s.addShape(pres.ShapeType.roundRect,{x,y,w:3.9,h:1.85,fill:{color:C.background2},line:{color:C.background2},rectRadius:0.1});
   s.addText(b[0],{x:x+0.2,y:y+0.12,w:3.5,h:0.35,fontSize:13,bold:true,color:i===2?C.accent3:col,margin:0,isTextBox:true});
   s.addText(b[1],{x:x+0.2,y:y+0.5,w:3.5,h:1.25,fontSize:14,color:C.text1,valign:"top",margin:0,isTextBox:true});});
  s.addText([{text:"관련 용어  ",options:{bold:true,color:col}},{text:t.related.map(r=>byId[r].ko).join("  ·  "),options:{color:C.text1}}],{x:4.8,y:6.75,w:8.0,h:0.4,fontSize:14,margin:0,isTextBox:true});
  s.addNotes(`${t.ko} (${t.en})\n정의: ${t.def}\n비유: ${t.analogy}\n오해: ${t.myth}`);
 });
});

// 마무리 퀴즈
sec("정리");
s=content("자가 점검: 카드 없이 설명할 수 있나요?","정리");
const qz=[["에이전트 루프","챗봇과 무엇이 다른가?"],["하니스","모델과 하니스 중 실행 여부를 정하는 쪽은?"],["사람 승인 · 승인 게이트","둘의 차이는?"],["자율성 단계","배치 재기동은 몇 단계가 적절한가, 이유는?"],["프롬프트 인젝션","탐지만으로 충분하지 않은 이유는?"],["평가","모의 평가가 통과하면 모델도 잘한다고 볼 수 있나?"]];
qz.forEach((q,i)=>{const y=1.45+i*0.88;
 s.addShape(pres.ShapeType.roundRect,{x:0.6,y,w:12.1,h:0.76,fill:{color:C.background2},line:{color:C.background2},rectRadius:0.1});
 s.addText(q[0],{x:0.85,y,w:3.6,h:0.76,fontSize:17,bold:true,color:C.accent1,valign:"middle",margin:0,isTextBox:true});
 s.addText(q[1],{x:4.6,y,w:7.9,h:0.76,fontSize:16,color:C.text1,valign:"middle",margin:0,isTextBox:true});});
s.addText("답은 각 카드의 '한 줄 정의'와 '흔한 오해' 칸에 있습니다",{x:0.6,y:6.85,w:12.1,h:0.4,fontSize:14,color:C.accent5,margin:0,isTextBox:true});

(async()=>{await pres.writeFile({fileName:"용어카드집.pptx"});await applyTheme("용어카드집.pptx",THEME);
 // ---- A4 한 장 요약표 (별도 파일) ----
 const p2=new pptxgen();p2.defineLayout({name:"A4L",width:11.69,height:8.27});p2.layout="A4L";
 p2.theme={headFontFace:"Arial",bodyFontFace:"Arial"};p2.title=D.title+" 요약표";
 const C2=p2.SchemeColor;const sl=p2.addSlide();sl.background={color:"FFFFFF"};
 sl.addText(D.title+" — 한 장 요약",{x:0.4,y:0.25,w:7.5,h:0.45,fontSize:18,bold:true,color:"14213D",margin:0,isTextBox:true});
 sl.addText("에이전트 = 목표 + 도구 + 루프 + 승인  ·  읽기는 맡기고, 쓰기는 승인한다  ·  모델은 제안하고, 하니스가 결정한다",{x:0.4,y:0.72,w:10.9,h:0.3,fontSize:10,bold:true,color:"2A6F97",margin:0,isTextBox:true});
 sl.addText(`★ 전 직무 필수 · ${D.version}`,{x:8.0,y:0.3,w:3.3,h:0.35,fontSize:9,color:"7A8B99",align:"right",margin:0,isTextBox:true});
 const HEX={1:"7A8B99",2:"2A6F97",3:"5B8DEF",4:"14213D",5:"D9534F",6:"2E9E6B"};
 const rows=[];D.chapters.forEach(c=>{rows.push({h:c});T.filter(t=>t.ch===c.no).forEach(t=>rows.push({t}));});
 const half=Math.ceil(rows.length/2);const cols=[rows.slice(0,half),rows.slice(half)];
 // 장 제목이 열 끝에 홀로 남지 않게 조정
 if(cols[0][cols[0].length-1].h){cols[1].unshift(cols[0].pop());}
 cols.forEach((cr,ci)=>{const tb=cr.map(r=>r.h?
   [{text:`${r.h.no}장 ${r.h.name}`,options:{colspan:2,bold:true,color:"FFFFFF",fill:{color:HEX[r.h.no]},fontSize:9}}]:
   [{text:(r.t.core?"★ ":"")+r.t.ko+"\n"+r.t.en,options:{bold:true,color:"14213D",fontSize:8}},{text:r.t.def,options:{color:"1B2430",fontSize:8}}]);
  sl.addTable(tb,{x:0.4+ci*5.55,y:1.12,w:5.35,colW:[1.55,3.8],border:{type:"solid",color:"DDE3EA",pt:0.5},margin:[0.02,0.06,0.02,0.06],valign:"middle",autoPage:false});});
 await p2.writeFile({fileName:"용어요약표_A4.pptx"});
 console.log("ok");})();
