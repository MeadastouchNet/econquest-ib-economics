const {chromium}=require(process.env.PLAYWRIGHT_PATH || 'C:/Users/jespe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const page=await browser.newPage({viewport:{width:1280,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const go=async route=>{await page.goto('http://127.0.0.1:8877/#/'+route);await page.locator('#app h1').waitFor();};
 await go('assessment');
 const content=await page.evaluate(async()=>{
  const {DIAGRAMS,PAPERS}=await import('/js/content/assessment.js');
  const {findSection}=await import('/js/content/units.js');
  return {diagrams:DIAGRAMS,papers:PAPERS,broken:DIAGRAMS.filter(t=>!findSection(t.topic)).map(t=>t.topic)};
 });
 assert.deepEqual(content.broken,[]);
 for(const p of content.papers)assert.equal(p.parts.reduce((s,q)=>s+q.marks,0),p.marks);
 await go('assessment/diagrams/tax');
 await page.getByRole('button',{name:'Save attempt',exact:true}).click();
 await page.getByRole('status').filter({hasText:'Add a curve'}).waitFor();
 await page.getByLabel('Horizontal axis label',{exact:true}).fill('Quantity / day');
 await page.getByLabel('Vertical axis label',{exact:true}).fill('Price');
 for(const [x,y] of [[10,20],[80,90]]){
  await page.getByLabel('Horizontal coordinate',{exact:true}).fill(String(x));
  await page.getByLabel('Vertical coordinate',{exact:true}).fill(String(y));
  await page.getByRole('button',{name:'Place point',exact:true}).click();
 }
 await page.getByRole('button',{name:'Finish shape',exact:true}).click();
 await page.getByLabel('Tool',{exact:true}).selectOption('label');
 await page.getByRole('textbox',{name:'Annotation text',exact:true}).fill('S + tax');
 await page.getByRole('button',{name:'Place point',exact:true}).click();
 await page.getByLabel('Explain your diagram:',{exact:false}).fill('The tax raises marginal private cost so supply shifts upwards and consumers pay a higher price.');
 await page.getByRole('button',{name:'Save attempt',exact:true}).click();
 await page.getByRole('button',{name:'Reveal guidance',exact:true}).click();
 assert(await page.getByText('Revenue rectangle:',{exact:false}).count());
 await page.reload();await page.getByText('S + tax',{exact:true}).first().waitFor();
 assert.equal(await page.getByLabel('Horizontal axis label',{exact:true}).inputValue(),'Quantity / day');
 let tax=await page.evaluate(async()=>(await import('/js/assessment-store.js')).evidence().drawings.tax);
 assert.equal(tax.attempt.helpUsed,false);assert.equal(tax.strokes.length,1);assert.equal(tax.labels.length,1);
 // Every new route, model and mobile width; drawings never become verified mastery.
 for(const t of content.diagrams){
  await go('assessment/diagrams/'+t.id);
  await page.getByRole('button',{name:'Reveal guidance',exact:true}).click();
  assert(await page.locator('.drawing-board').count());
 }
 for(const p of content.papers){
  await go('assessment/papers/'+p.id);
  await page.getByRole('button',{name:'Start timer',exact:true}).click();
  await page.reload();await page.getByRole('timer').waitFor();
  assert(!(await page.getByRole('timer').innerText()).includes('not started'));
  for(const q of p.parts){
   await page.getByLabel('Your response to '+q.id,{exact:true}).fill('Practice response: explain the model, apply the evidence and evaluate the policy assumptions.');
   if(q.numeric){
    const section=page.locator('section.card').filter({has:page.getByRole('heading',{name:`${q.id} · ${q.marks} marks`,exact:true})});
    await section.getByRole('button',{name:'Check calculation',exact:true}).click();
    assert(await section.getByText('Enter a numerical answer.',{exact:true}).count());
    await page.getByLabel('Numerical answer '+q.id,{exact:true}).fill(String(q.numeric.answer));
    await section.getByRole('button',{name:'Check calculation',exact:true}).click();
    assert(await section.getByText('Result correct.',{exact:false}).count());
   }
  }
  await page.getByRole('button',{name:'Submit for self-review',exact:true}).click();
  await page.getByText('Feedback guide',{exact:true}).first().waitFor();
  const saved=await page.evaluate(async id=>(await import('/js/assessment-store.js')).paperState(id),p.id);
  assert(saved.submission);assert.equal(saved.submission.timed,true);
 }
 await go('assessment/papers/p1');
 await page.evaluate(async()=>{const s=(await import('/js/assessment-store.js')).paperState('p1');s.submittedAt=null;s.deadline=Date.now()-1000;});
 await page.getByRole('button',{name:'Submit for self-review',exact:true}).click();
 assert.equal(await page.evaluate(async()=>(await import('/js/assessment-store.js')).paperState('p1').submission.late),true);
 await go('assessment/ia');
 const ia=page.locator('section.card').filter({has:page.getByRole('heading',{name:'Commentary 1',exact:true})});
 await ia.getByLabel('Syllabus unit',{exact:true}).selectOption('2');
 await ia.getByLabel('Key concept',{exact:true}).selectOption('equity');
 await ia.getByLabel('Article title',{exact:true}).fill('My chosen article');
 await page.reload();await page.getByLabel('Article title',{exact:true}).first().waitFor();
 assert.equal(await page.getByLabel('Article title',{exact:true}).first().inputValue(),'My chosen article');
 const rules=await page.evaluate(async()=>{
  const {iaWarnings}=await import('/js/assessment-store.js');
  const a={unit:'2',concept:'equity',source:'News A',url:'https://example.com',published:'2025-10-26',written:'2026-10-26'};
  const b={...a,unit:'3',concept:'change',source:'News B'};
  const c={...a,unit:'4',concept:'efficiency',source:'News C'};
  return {valid:iaWarnings([a,b,c]),repeated:iaWarnings([a,a,a]),old:iaWarnings([{...a,published:'2025-10-25'}]),words:iaWarnings([{...a,draft:'word '.repeat(801)}])};
 });
 assert.deepEqual(rules.valid,[]);assert(rules.repeated.some(s=>s.includes('repeated')));assert(rules.old.some(s=>s.includes('year before')));assert(rules.words.some(s=>s.includes('800')));
 // Existing app export/import includes assessment evidence; legacy imports migrate lazily.
 const migration=await page.evaluate(async()=>{
  const store=await import('/js/store.js');const {evidence}=await import('/js/assessment-store.js');
  const backup=store.exportJSON();store.reset();const clean=Object.keys(evidence().drawings).length===0;
  store.importJSON(backup);const restored=!!evidence().drawings.tax.attempt;
  store.importJSON('{}');const legacy=Array.isArray(evidence().ia);store.importJSON(backup);
  return {clean,restored,legacy};
 });assert.deepEqual(migration,{clean:true,restored:true,legacy:true});
 await page.setViewportSize({width:375,height:900});
 for(const route of ['assessment','assessment/diagrams','assessment/diagrams/tax','assessment/papers/p3','assessment/cases','assessment/ia','assessment/coverage']){
  await go(route);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route+' overflows');
 }
 await go('assessment/diagrams/tax');
 await page.screenshot({path:'docs/screenshots/assessment-tax-phone.png',fullPage:true});
 await page.setViewportSize({width:1280,height:1000});await go('assessment');
 await page.screenshot({path:'docs/screenshots/assessment-studio.png',fullPage:true});
 await go('assessment/diagrams/tax');await page.screenshot({path:'docs/screenshots/assessment-tax.png',fullPage:true});
 // Repeat practice clears current help flags while retaining previous work.
 await page.getByRole('button',{name:'Start a fresh drawing',exact:true}).click();
 assert.equal(await page.getByText('Schematic comparison model',{exact:true}).count(),0);
 const freshDrawing=await page.evaluate(async()=>(await import('/js/assessment-store.js')).evidence().drawings.tax);
 assert(freshDrawing.previous.attempt);assert.equal(freshDrawing.strokes.length,0);
 await go('assessment/papers/p2');
 await page.getByRole('button',{name:'Start a fresh attempt',exact:true}).click();
 assert.equal(await page.getByText('Feedback guide',{exact:true}).count(),0);
 const freshPaper=await page.evaluate(async()=>(await import('/js/assessment-store.js')).paperState('p2'));
 assert(freshPaper.previous.submission);assert.deepEqual(freshPaper.answers,{});
 assert.deepEqual(errors,[]);
 console.log(JSON.stringify({diagrams:content.diagrams.length,papers:content.papers.length,numericalParts:content.papers.flatMap(p=>p.parts).filter(p=>p.numeric).length,errors:errors.length,checks:'saving, drawing, models, timers, marks, calculations, IA rules, export/import/reset, 375px routes'},null,2));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
