import {icon} from './icons.js';
import {h} from './ui.js';
import {SECTIONS, findSection} from './content/units.js';
import {DIAGRAMS,PAPERS,OBJECTIVES,SOURCES,CONCEPTS} from './content/assessment.js';
import {evidence,saveEvidence,paperState,wordCount,iaWarnings} from './assessment-store.js';
import {diagramModel} from './content/diagram-models.js';
import * as store from './store.js';

const button=(text,fn)=>h('button',{class:'btn ghost',onclick:fn},text);
const link=(text,href)=>h('a',{class:'btn ghost',href},text);
const para=(text)=>h('p',{},text);
const note=(text)=>h('p',{class:'muted small'},text);
const card=(...children)=>h('section',{class:'card'},...children);
function field(label,value,oninput,{type='text',multiline=false}={}) {
 const input=h(multiline?'textarea':'input',{type:multiline?null:type,value:multiline?null:value,rows:multiline?5:null,oninput:e=>oninput(e.target.value)});
 if(multiline) input.value=value||'';
 return h('label',{class:'assessment-field'},h('span',{},label),input);
}
function select(label,values,value,onchange) {
 return h('label',{class:'assessment-field'},h('span',{},label),h('select',{'aria-label':label,onchange:e=>onchange(e.target.value,e.target)},values.map(([v,t])=>h('option',{value:v,selected:v===value},t))));
}
const table=(rows)=>h('div',{class:'table-wrap'},h('table',{class:'fin'},h('thead',{},h('tr',{},h('th',{},'Evidence / variable'),h('th',{},'Observation'))),h('tbody',{},rows.map(([a,b])=>h('tr',{},h('th',{scope:'row'},a),h('td',{},b))))));
function download(name,text,type='text/plain') {
 const url=URL.createObjectURL(new Blob([text],{type}));
 const a=h('a',{href:url,download:name}); a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function assessmentView(app,area,id) {
 app.replaceChildren(h('a',{href:'#/'},'← Home'),h('h1',{},'Assessment studio'),
  h('nav',{class:'row assessment-nav','aria-label':'Assessment studio'},[
   ['Overview','#/assessment'],['Diagram lab','#/assessment/diagrams'],['Exam practice','#/assessment/papers'],['Real evidence','#/assessment/cases'],['IA planner','#/assessment/ia'],['Skills tracker','#/assessment/coverage']
  ].map(([title,href])=>link(title,href))));
 const body=h('div',{class:'assessment'});app.append(body);
 if(area==='diagrams') diagramView(body,id);
 else if(area==='papers') papersView(body,id);
 else if(area==='cases') casesView(body);
 else if(area==='ia') iaView(body);
 else if(area==='coverage') coverageView(body);
 else overview(body);
}
export function assessmentLinks(topic) {
 const tasks=DIAGRAMS.filter(t=>t.topic===topic);
 return h('div',{class:'row small',style:'margin:10px 0'},
  ...tasks.map(t=>h('a',{href:`#/assessment/diagrams/${t.id}`,class:'btn ghost small'},icon('chart-column'), t.title)),
  h('a',{href:'#/assessment/papers',class:'muted'},'Written exam practice'));
}
function overview(el) {
 el.append(card(h('h2',{},'Move from knowing to doing'),para('Read a model, practise it, then try an unfamiliar task without help. Your quiz recall, lesson completion and assessed skills are different kinds of evidence.'),
  para('Start with a blank diagram. Explain the mechanism. Use evidence. Compare alternatives and defend a conclusion.'),
  note('Original practice aligned to the first-assessment-2022 framework. Written feedback is a structured self-review, not automated examiner marking. Teacher review is needed to verify independent performance.')),
  h('div',{class:'grid'},[
   ['Diagram lab',`${DIAGRAMS.length} construction challenges, including HL extensions.`, '#/assessment/diagrams'],
   ['Exam practice','75-minute Paper 1, 105-minute Paper 2, and 105-minute HL Paper 3.', '#/assessment/papers'],
   ['Real evidence','Historical official inflation data and a two-country SDG investigation.', '#/assessment/cases'],
   ['IA planner','Three commentary plans, distinct concepts, article dates and a feedback checklist.', '#/assessment/ia']
  ].map(([title,text,href])=>card(h('h2',{},title),para(text),link('Open →',href)))),
  card(h('h2',{},'What progress means'),para('Taught = a lesson is available. Practised = an answer or drawing is saved. Self-reviewed = you compared your work against guidance. Independently assessed and mastered require judgement beyond this app; they are not awarded by a completion click.'),link('See evidence by objective','#/assessment/coverage'),h('p',{},h('a',{href:SOURCES.ib,target:'_blank',rel:'noopener'},'IB Economics HL subject brief · assessment framework'))));
}

// SVG editor: tap points or enter coordinates; student supplies all curves, axes labels and annotations.
function svgNode(tag,attrs={},text) {
 const node=document.createElementNS('http://www.w3.org/2000/svg',tag);
 Object.entries(attrs).forEach(([k,v])=>node.setAttribute(k,v));
 if(text!==undefined) node.textContent=text;
 return node;
}
const legacyColours = {'#12a99a':'var(--chart-1)', '#9a7aff':'var(--chart-2)', '#9c9fb9':'var(--chart-3)', '#ef9457':'var(--chart-4)', '#ed668c':'var(--muted)'};
const diagramColour = value => legacyColours[value] || value || 'var(--chart-1)';
function drawingSVG(data) {
 const svg=svgNode('svg',{viewBox:'0 0 600 420',role:'img','aria-label':'Your economics diagram',class:'drawing-board'});
 const defs=svgNode('defs'),marker=svgNode('marker',{id:'flow-arrow',viewBox:'0 0 10 10',refX:9,refY:5,markerWidth:5,markerHeight:5,orient:'auto-start-reverse'});
 marker.append(svgNode('path',{d:'M0 0L10 5L0 10Z',fill:'var(--chart-1)'}));defs.append(marker);svg.append(defs);
 if(data.axes!==false)svg.append(svgNode('path',{d:'M50 30V370H560',stroke:'currentColor','stroke-width':2,fill:'none'}));
 const px=x=>50+x*5.1, py=y=>370-y*3.4;
 for(const stroke of data.strokes||[]) {
  const points=stroke.points.map(([x,y])=>`${px(x)},${py(y)}`).join(' ');
  const shape=stroke.kind==='area'?'polygon':'polyline';
  const path=svgNode(shape,{points,fill:shape==='polygon'?'color-mix(in srgb, var(--chart-2) 25%, transparent)':'none',stroke:diagramColour(stroke.color),'stroke-width':3});
  if(stroke.kind==='arrow')path.setAttribute('marker-end','url(#flow-arrow)');svg.append(path);
 }
 for(const item of data.labels||[]) svg.append(svgNode('text',{x:px(item.x),y:py(item.y),fill:'currentColor','font-size':16},item.text));
 svg.append(svgNode('text',{x:300,y:411,fill:'currentColor','text-anchor':'middle','font-size':15},data.xLabel||''),svgNode('text',{x:6,y:19,fill:'currentColor','font-size':15},data.yLabel||''));
 return svg;
}
function diagramView(el,id) {
 const task=DIAGRAMS.find(d=>d.id===id);
 if(!task) {
  const list=h('div',{class:'grid'});
  const filter=select('Show level',[['all','All challenges'],['common','Shared SL / HL'],['hl','HL only']],'all',v=>render(v));
  const render=v=>list.replaceChildren(...DIAGRAMS.filter(t=>v==='all'||(v==='hl'?t.hl:!t.hl)).map(t=>card(h('h2',{},t.title),note(`${t.topic} · ${t.hl?'HL only':'SL / HL (any numerical extensions labelled)'}`),para(t.prompt),link(evidence().drawings[t.id]?'Resume drawing →':'Draw from scratch →',`#/assessment/diagrams/${t.id}`))));
  render('all');el.append(para('Construct curves, shaded areas and labels on a blank canvas. Click points to create a line or shape; the coordinate controls also work with a keyboard. Guidance stays hidden until you ask for it.'),filter,list);return;
 }
 const data=(evidence().drawings[id] ||= {strokes:[],labels:[],explanation:'',checks:[],axes:!['flow','equity-flow','poverty-cycle'].includes(id)});
 let pending=[],mode='line',colour='var(--chart-1)';
 const board=h('div'),status=h('p',{role:'status',class:'muted small'}),answer=h('div');
 const persist=()=>{data.updated=Date.now();saveEvidence();};
 const redraw=()=>{
  const svg=drawingSVG({...data,strokes:[...data.strokes,...(pending.length?[{points:pending,color:colour,kind:mode}]:[])]});
  svg.setAttribute('tabindex','0');
  svg.setAttribute('aria-label','Diagram canvas. Click to place points; use coordinate inputs below for keyboard drawing.');
  svg.addEventListener('click',e=>{
   const pt=svg.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;
   const loc=pt.matrixTransform(svg.getScreenCTM().inverse());
   addPoint(Math.max(0,Math.min(100,(loc.x-50)/5.1)),Math.max(0,Math.min(100,(370-loc.y)/3.4)));
  });
  board.replaceChildren(svg);
 };
 const addPoint=(x,y)=>{
  if(mode==='label') {
   if(!labelText.value.trim()){status.textContent='Type annotation text first.';return;}
   data.labels.push({x,y,text:labelText.value.trim().slice(0,100)});(data.history ||= []).push('label');persist();
  } else pending.push([x,y]);
  status.textContent=mode==='label'?'Annotation saved.':`${pending.length} points in current ${mode}. Finish the shape before saving your attempt.`;
  redraw();
 };
 const finish=()=>{
  const min=mode==='area'?3:2;
  if(pending.length<min){status.textContent=`Add at least ${min} points.`;return;}
  data.strokes.push({points:pending,kind:mode,color:colour});(data.history ||= []).push('stroke');pending=[];persist();redraw();status.textContent='Shape saved. Choose another colour or add a label.';
 };
 const labelText=h('input',{'aria-label':'Annotation text',placeholder:'D, S + tax, Qopt, household…',maxlength:100});
 const x=h('input',{type:'number',min:0,max:100,value:50,'aria-label':'Horizontal coordinate'});
 const y=h('input',{type:'number',min:0,max:100,value:50,'aria-label':'Vertical coordinate'});
 const reflection=field('Explain your diagram: mechanism, stakeholder effects and assumptions',data.explanation,v=>{data.explanation=v;persist();},{multiline:true});
 const comparison=()=>{
  answer.replaceChildren(h('h2',{},'Compare and improve'),para(task.answer),
   ...task.checks.map((c,i)=>h('label',{class:'review-check'},h('input',{type:'checkbox',checked:data.checks[i],onchange:e=>{data.checks[i]=e.target.checked;persist();}}),c)),
   note('These are your judgements, not verified marks. Check the construction with a teacher. Save an attempt before revealing guidance to record that it was attempted without the solution.'));
  const model=diagramModel(id);
  if(model)answer.prepend(card(h('h3',{},'Schematic comparison model'),drawingSVG(model),note('Compare curve relationships, labels and welfare areas. Position and scale may differ from your drawing.')));
 };
 el.append(link('← All diagram challenges','#/assessment/diagrams'),card(h('h2',{},task.title),note(`${task.topic} · ${task.hl?'HL only':'SL / HL'}`),para(task.prompt),link('Revisit the lesson',`#/s/${task.topic}`)),
  card(h('h2',{},'Construct your diagram'),button('Start a fresh drawing',()=>{const previous=structuredClone(data);delete previous.previous;evidence().drawings[id]={strokes:[],labels:[],checks:[],explanation:'',axes:data.axes,previous};saveEvidence();el.replaceChildren();diagramView(el,id);}),note('A fresh drawing hides guidance again and retains the previous drawing in your exported progress.'),
   h('div',{class:'assessment-controls'},
    select('Tool',[['line','Curve / line (join points)'],['arrow','Directional flow arrow'],['area','Shade a region (polygon)'],['label','Text annotation']],'line',(v,input)=>{if(pending.length){status.textContent='Finish or undo the pending shape before changing tool.';input.value=mode;return;}mode=v;}),
    select('Curve colour',[['var(--chart-1)','Ink'],['var(--chart-2)','Gold'],['var(--chart-3)','Grey'],['var(--chart-4)','Orange']],colour,v=>{colour=v;redraw();})),
   h('label',{class:'review-check'},h('input',{type:'checkbox',checked:data.axes!==false,onchange:e=>{data.axes=e.target.checked;persist();redraw();}}),'Show chart axes (turn off for flow diagrams)'),
   field('Horizontal axis label',data.xLabel||'',v=>{data.xLabel=v;persist();redraw();}),field('Vertical axis label',data.yLabel||'',v=>{data.yLabel=v;persist();redraw();}),
   board,h('label',{class:'assessment-field'},'Annotation text',labelText),
   h('div',{class:'assessment-controls'},h('label',{},'X (0–100)',x),h('label',{},'Y (0–100, up)',y),button('Place point',()=>{
    if(x.value===''||y.value===''||!Number.isFinite(+x.value)||!Number.isFinite(+y.value)||+x.value<0||+x.value>100||+y.value<0||+y.value>100){status.textContent='Enter coordinates between 0 and 100.';return;}
    addPoint(+x.value,+y.value);
   })),
   h('div',{class:'row'},button('Finish shape',finish),button('Undo',()=>{if(pending.length)pending.pop();else if(data.history?.length){if(data.history.pop()==='label')data.labels.pop();else data.strokes.pop();}else if(data.labels.length)data.labels.pop();else data.strokes.pop();persist();redraw();}),
    button('Download SVG',()=>{const svg=drawingSVG(data);svg.setAttribute('xmlns','http://www.w3.org/2000/svg');const theme=getComputedStyle(document.documentElement); svg.style.color=theme.getPropertyValue('--text'); svg.style.background=theme.getPropertyValue('--bg-2'); for(const token of ['--chart-1','--chart-2','--chart-3','--chart-4','--muted']) svg.style.setProperty(token,theme.getPropertyValue(token));download(`econquest-${id}.svg`,new XMLSerializer().serializeToString(svg),'image/svg+xml');})),
   status,reflection,
   button('Save attempt',()=>{
    if(pending.length){status.textContent='Finish the current shape first.';return;}
    if(!data.strokes.length||!data.labels.length||wordCount(data.explanation)<10){status.textContent='Add a curve/flow, at least one annotation, and an explanation of at least 10 words.';return;}
    data.attempt={at:Date.now(),helpUsed:!!data.revealed,strokes:structuredClone(data.strokes),labels:structuredClone(data.labels),xLabel:data.xLabel,yLabel:data.yLabel,explanation:data.explanation};persist();status.textContent='Attempt saved. Compare it with guidance and ask for teacher feedback.';
   }),button('Reveal guidance',()=>{data.revealed=true;persist();comparison();})),answer);
 redraw();if(data.revealed)comparison();
}

function papersView(el,id) {
 const paper=PAPERS.find(p=>p.id===id);
 if(!paper){el.append(para('Write before revealing feedback. Each exercise is original practice, with a saved timer and responses. P1 and P2 include shared content; P3 is HL only.'),...PAPERS.map(p=>card(h('h2',{},p.title),note(`${p.level} · ${p.minutes} minutes · ${p.marks} marks`),para(p.intro),link('Open practice →',`#/assessment/papers/${p.id}`))));return;}
 const state=paperState(id), timer=h('p',{class:'timer',role:'timer','aria-label':'Time remaining'}),message=h('p',{role:'status'});
 const save=()=>saveEvidence();
 const update=()=>{
  if(!timer.isConnected)return;
  let remaining=state.deadline?Math.max(0,Math.ceil((state.deadline-Date.now())/1000)):paper.minutes*60;
  if(state.submittedAt) timer.textContent='Attempt submitted · feedback available';
  else if(state.deadline&&remaining===0){timer.textContent='Time finished · finish and submit your attempt';if(!state.expired){state.expired=true;save();}}
  else timer.textContent=`${Math.floor(remaining/60)}:${String(remaining%60).padStart(2,'0')} remaining${state.deadline?'':' · timer not started'}`;
  setTimeout(update,1000);
 };
 const submit=button('Submit for self-review',()=>{
  if(!paper.parts.every(p=>String(state.answers[p.id]||'').trim())){message.textContent='Write a response for every part before submitting. Partial responses are saved automatically.';return;}
  state.submittedAt=Date.now();state.submission={answers:structuredClone(state.answers),numbers:structuredClone(state.numbers),timed:!!state.deadline,late:!!state.deadline&&Date.now()>state.deadline,helpUsed:!!state.feedback||Object.values(state.numbers).some(n=>n.checked)};save();papersViewReplace();
 });
 const papersViewReplace=()=>{el.replaceChildren();papersView(el,id);};
 el.append(link('← All papers','#/assessment/papers'),card(h('h2',{},paper.title),note(`${paper.level} · ${paper.marks} marks`),para(paper.intro),timer,
  button('Start timer',()=>{if(!state.deadline&&!state.submittedAt){state.startedAt=Date.now();state.deadline=Date.now()+paper.minutes*60000;save();}}),
  button('Download responses',()=>download(`econquest-${id}.txt`,paper.title+'\n\n'+paper.parts.map(p=>`${p.id} [${p.marks}] ${p.prompt}\n${state.answers[p.id]||''}`).join('\n\n'))),
  button('Start a fresh attempt',()=>{const previous=structuredClone(state);delete previous.previous;evidence().papers[id]={answers:{},numbers:{},reviews:{},previous};saveEvidence();papersViewReplace();}),
  note('Responses save on this device as you type. The timer keeps running when you leave. You can keep working after time expires; the attempt records that it was late. A fresh attempt retains the immediately previous one in your Usage stats progress export.')));
 if(paper.data.length)el.append(card(h('h2',{},'Evidence'),table(paper.data),paper.source?h('a',{href:paper.source,target:'_blank',rel:'noopener'},paper.sourceLabel):note('All figures in this evidence table are fictional model assumptions.')));
 paper.parts.forEach(p=>{
  const result=h('p',{role:'status'}),review=h('div');
  const response=field(`Your response to ${p.id}`,state.answers[p.id]||'',v=>{state.answers[p.id]=v;save();},{multiline:true});
  const box=card(h('h2',{},`${p.id} · ${p.marks} marks`),para(p.prompt),note(p.marks>=10?'AO1 / AO2 / AO3 / AO4 · Write an argument with evidence and a justified judgement.':p.numeric?'AO4 · Include method and units.':'AO1 / AO2 / AO4 · Answer the command term and use the context.'),response);
  if(p.numeric){
   const value=h('input',{type:'number',step:'any','aria-label':`Numerical answer ${p.id}`,value:state.numbers[p.id]?.value??'',oninput:e=>{const n=(state.numbers[p.id] ||= {});n.value=e.target.value;delete n.correct;save();}});
   box.append(h('label',{class:'assessment-field'},`Numerical result (${p.numeric.unit||'multiplier'})`,value),button('Check calculation',()=>{
    if(value.value.trim()===''||!Number.isFinite(+value.value)){result.textContent='Enter a numerical answer.';return;}
    const correct=Math.abs(+value.value-p.numeric.answer)<=p.numeric.tol;
    const existing=state.numbers[p.id];
    state.numbers[p.id]={value:value.value,correct,checked:true,firstCorrect:existing?.firstCorrect??correct,helpUsed:existing?.helpUsed??!!state.feedback};save();
    result.textContent=correct?'Result correct. Check that your written method and units are clear.':'Check the equation, units and sign, then try again. Worked solutions are available after submission or by revealing guidance.';
   }),result);
  }
  if(state.feedback||state.submittedAt){
   review.append(h('h3',{},'Feedback guide'),para(p.guide));
   const criteria=p.marks>=10?['Economic mechanism is accurate and linked to the question','Evidence and diagrams are explained, not merely mentioned','Alternative outcomes, stakeholders and limitations are developed','Conclusion weighs the evidence and answers the question']:['Relevant terms and method are correct','Answer is applied to this question, with units/diagram labels where relevant'];
   criteria.forEach((c,i)=>review.append(h('label',{class:'review-check'},h('input',{type:'checkbox',checked:state.reviews[p.id]?.[i],onchange:e=>{(state.reviews[p.id] ||= [])[i]=e.target.checked;save();}}),c)));
   review.append(note('Self-review only. This checklist does not assign an IB mark; ask a teacher to judge the quality of the reasoning.'));
  }
  box.append(review);el.append(box);
 });
 el.append(card(submit,button('Reveal guidance before submitting',()=>{state.feedback=true;save();papersViewReplace();}),message,note('Revealing guidance flags this as a supported attempt. Starting a timer does not by itself establish independent examination readiness.')));
 setTimeout(update,0);
}

function casesView(el) {
 const cases=evidence().cases;
 const save=(id,key,value)=>{((cases[id] ||= {}))[key]=value;saveEvidence();};
 el.append(card(h('h2',{},'UK soft drinks levy · reformulation incentives'),note('Shared SL / HL · 2.5, 2.7 and 2.8 · historical evidence, source checked 26 October 2026'),
  para('The UK government’s 2025 consultation reports a 46% fall in the sales-weighted average sugar content of drinks within the levy’s scope over the historical period to 2020. A tax with sugar-content thresholds can reward reformulation as well as change prices.'),
  h('a',{href:SOURCES.sugar,target:'_blank',rel:'noopener'},'HM Treasury / HMRC · consultation evidence'),
  field('Fact: what exactly fell by 46%, and why is that different from a 46% fall in drinks consumed?',cases.sugar?.fact||'',v=>save('sugar','fact',v),{multiline:true}),
  field('Model: compare a per-unit tax diagram with a producer changing its recipe to avoid a levy threshold.',cases.sugar?.model||'',v=>save('sugar','model',v),{multiline:true}),
  field('Evaluate: consider substitution, incidence, income groups and evidence needed to judge health outcomes. Why is reformulation alone not proof of every policy benefit?',cases.sugar?.evaluation||'',v=>save('sugar','evaluation',v),{multiline:true}),
  link('Practise tax construction','#/assessment/diagrams/tax'),link('Use a real example in Paper 1','#/assessment/papers/p1')),
 card(h('h2',{},'UK disinflation · historical evidence'),note('Shared SL / HL · 3.3b, 3.5 and 3.6 · source checked 26 October 2026'),
  para('The ONS reported annual CPI inflation of 11.1% in October 2022 and 4.0% in December 2023. These are historical annual rates, not a measure of cumulative inflation between those months.'),
  h('a',{href:SOURCES.ons,target:'_blank',rel:'noopener'},'Open ONS bulletin · published 17 January 2024'),
  field('Fact: calculate the percentage-point change and explain what it measures',cases.uk?.fact||'',v=>save('uk','fact',v),{multiline:true}),
  field('Model: propose a demand-side and a supply-side explanation; identify evidence needed to distinguish them',cases.uk?.model||'',v=>save('uk','model',v),{multiline:true}),
  field('Judgement: who might benefit or lose, and why can the rates alone not prove policy success?',cases.uk?.judgement||'',v=>save('uk','judgement',v),{multiline:true}),
  link('Use this evidence in Paper 2','#/assessment/papers/p2')),
  card(h('h2',{},'Two-country SDG evidence investigation'),note('Shared SL / HL · 4.7, 4.8 and 4.10 · SDG 7: access to electricity'),
   para('Start with this verified historical snapshot from the World Bank Sovereign ESG country profiles, checked 26 October 2026. Both indicators refer to 2023 and use percentage of population. These levels show remaining gaps, not rates of progress over time.'),
   table([['Kenya · electricity access, 2023','76.2%'],['Viet Nam · electricity access, 2023','99.8%'],['Kenya · clean cooking access, 2023','31.6%'],['Viet Nam · clean cooking access, 2023','98.7%']]),
   h('p',{},h('a',{href:'https://esgdata.worldbank.org/data/countries?iso3=KEN',target:'_blank',rel:'noopener'},'World Bank · Kenya'), ' · ',h('a',{href:'https://esgdata.worldbank.org/data/countries?iso3=VNM',target:'_blank',rel:'noopener'},'World Bank · Viet Nam')),
   field('Compare the remaining gaps to universal electricity and clean cooking access. Which policy priorities differ between these countries?',cases.sdg?.snapshot||'',v=>save('sdg','snapshot',v),{multiline:true}),
   para('Now compare electricity progress over time using indicator EG.ELC.ACCS.ZS and two common years. Retrieve an earlier observation for each country from the linked official data, and verify the later values. Revisions can change historical estimates; record the retrieval date. The trend extension requires your data entry.'),
   h('p',{},h('a',{href:SOURCES.electricity,target:'_blank',rel:'noopener'},'World Bank · electricity access (% of population)'), ' · ',h('a',{href:SOURCES.sdg,target:'_blank',rel:'noopener'},'UN SDG database')),
   ...['Earlier common year','Later common year','Kenya earlier value (%)','Kenya later value (%)','Viet Nam earlier value (%)','Viet Nam later value (%)','Retrieval date and exact source'].map((label,i)=>field(label,cases.sdg?.[i]||'',v=>save('sdg',i,v))),
   field('Calculate both percentage-point changes. Compare progress towards universal access; distinguish levels from changes.',cases.sdg?.analysis||'',v=>save('sdg','analysis',v),{multiline:true}),
   field('Evaluate: compare grid investment with off-grid energy. Consider financing, reliability, affordability, regional inequality and sustainability. What else must be measured?',cases.sdg?.evaluation||'',v=>save('sdg','evaluation',v),{multiline:true}),
   note('Electricity access alone is not proof of reliable, affordable or clean energy, or of achieving an entire SDG. Compare it with clean cooking and other evidence. Cross-country levels do not establish policy causality; the time-series extension still needs your own research.')));
}

function iaView(el) {
 const entries=evidence().ia, warnings=h('div',{'aria-live':'polite'});
 const validate=()=>{const results=iaWarnings(entries);warnings.replaceChildren(h('h2',{},'Portfolio checks'),...(results.length?results.map(para):[para('Date, source, concept and unit checks pass for the information entered. Article suitability and draft quality still need teacher review.')]));};
 const update=(i,key,value)=>{entries[i][key]=value;saveEvidence();validate();};
 el.append(card(h('h2',{},'Plan your own three commentaries'),para('Choose your own news articles from microeconomics, macroeconomics and the global economy. Use a different source and key concept for each. An article must be published within the year before the commentary is written. Maximum 800 words per commentary.'),
  note('This planner offers formative prompts. It does not select an article or write your assessed commentary. The word counter is approximate; apply the official exclusions with your teacher. Old evidence cases elsewhere in this app are practice material, not automatically eligible IA articles.'),
  h('a',{href:SOURCES.ib,target:'_blank',rel:'noopener'},'IB subject brief'),button('Download portfolio plans',()=>download('econquest-ia-plans.json',JSON.stringify(entries,null,2),'application/json'))));
 entries.forEach((entry,i)=>{
  const counter=note(`Approximate draft words: ${wordCount(entry.draft)} / 800`);
  const box=card(h('h2',{},`Commentary ${i+1}`),
   select('Syllabus unit',[['','Choose unit'],['2','2 · Microeconomics'],['3','3 · Macroeconomics'],['4','4 · Global economy']],entry.unit||'',v=>update(i,'unit',v)),
   select('Key concept',[['','Choose concept'],...CONCEPTS.map(c=>[c,c])],entry.concept||'',v=>update(i,'concept',v)),
   ...[['title','Article title','text'],['url','Article URL','url'],['source','Publisher / news source','text'],['published','Publication date','date'],['written','Commentary writing date','date']].map(([key,label,type])=>field(label,entry[key]||'',v=>update(i,key,v),{type})),
   ...[['issue','What specific economic problem does the article report? Include two facts from it.'],['model','Which diagram will you construct, and how will its labels match the article?'],['conceptLink','How does your key concept explain the issue throughout the analysis?'],['evaluation','Compare stakeholders, short/long run, assumptions and an alternative policy. What supports your judgement?']].map(([key,label])=>field(label,entry[key]||'',v=>update(i,key,v),{multiline:true})),
   field('Your own practice draft',entry.draft||'',v=>{update(i,'draft',v);counter.textContent=`Approximate draft words: ${wordCount(v)} / 800`;},{multiline:true}),counter,
   h('h3',{},'Formative review · A–E'),
   ...['A · Diagrams: accurate, fully labelled and explained in the article context (3)','B · Terminology: relevant terms used accurately throughout (2)','C · Application and analysis: sustained causal reasoning tied to the article (3)','D · Key concept: a distinct concept is meaningfully linked throughout (3)','E · Evaluation: balanced reasoning supports a justified judgement (3)'].map((c,j)=>h('label',{class:'review-check'},h('input',{type:'checkbox',checked:entry.checks?.[j],onchange:e=>{(entry.checks ||= [])[j]=e.target.checked;saveEvidence();}}),c)),
   note('The numbers show criterion maxima, not a mark awarded by the app. Criterion F (3) applies across the portfolio. Final assessment and authenticity checks belong to your teacher.'));
  el.append(box);
 });
 el.append(card(warnings));validate();
}

function coverageView(el) {
 el.append(card(h('h2',{},'Evidence, not completion-based mastery'),para('This initial register maps the diagram objectives added in response to the review. It does not yet enumerate every official syllabus sub-point. Existing lessons and spaced quizzes remain available for all four units.'),
  para('Understand → apply → analyse → evaluate → demonstrate independently. The records below show where you have practised; they cannot verify the quality or independence of written work.'),
  note('“Taught” means material is available, not that you read it. “Attempt before guidance” is a browser record, not independent assessment. All independent assessment and mastery judgements remain unverified.')));
 const rows=OBJECTIVES.map(o=>{
  const data=evidence().drawings[o.diagram];
  const s=findSection(o.topic);
  return h('tr',{},h('td',{},h('a',{href:`#/assessment/diagrams/${o.diagram}`},o.label),note(`${o.topic} · ${o.hl?'HL only':'SL / HL'} · ${o.ao}`)),
   h('td',{},s?h('a',{href:`#/s/${s.id}`},'Taught: lesson available'):'Not mapped',note(data?.attempt?'Practised: attempt saved':'Not yet practised'),note(data?.checks?.some(Boolean)?'Self-review recorded':'No self-review recorded'),note(data?.attempt?data.attempt.helpUsed?'Supported attempt':'Attempt saved before guidance':'No attempt evidence')),
   h('td',{},'Unverified',note('Teacher review needed')));
 });
 el.append(h('div',{class:'table-wrap'},h('table',{class:'fin'},h('thead',{},h('tr',{},h('th',{},'Objective'),h('th',{},'Evidence'),h('th',{},'Independent assessment / mastery'))),h('tbody',{},rows))));
 const pending=OBJECTIVES.find(o=>!evidence().drawings[o.diagram]?.attempt);
 if(pending)el.append(card(h('h2',{},'Suggested next practice'),para(`${pending.label}: no saved construction attempt yet.`),link('Try it independently',`#/assessment/diagrams/${pending.diagram}`)));
 const attempted=PAPERS.filter(p=>evidence().papers[p.id]?.submittedAt);
 el.append(card(h('h2',{},'Written practice'),para(`${attempted.length} of ${PAPERS.length} paper exercises submitted for self-review. Submission and checklist ticks do not establish exam readiness.`)));
}
