const { chromium } = require('C:/Users/jespe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
(async () => {
 const browser = await chromium.launch({headless:true,channel:'msedge'});
 const page = await browser.newPage({viewport:{width:1280,height:900}});
 const errors=[]; page.on('pageerror', e=>errors.push(e.message));
 const base='http://127.0.0.1:8873/';
 const go=async hash=>{await page.goto(base+hash);await page.locator('#app h1').waitFor();};
 await go('');
 const sections=await page.evaluate(async()=> (await import('/js/content/units.js')).SECTIONS);
 const plain=s=>s.replace(/<[^>]*>/g,'');
 async function sortItems(lab,wrap=page) {
  for(const item of lab.items){
   const row=wrap.locator('.sort-item').filter({has:page.getByText(plain(item.t),{exact:true})});
   await row.getByRole('button',{name:plain(lab.buckets[item.b]),exact:true}).click();
  }
  await wrap.getByRole('button',{name:'Check',exact:true}).click();
 }
 let questions=0,labs=0;
 for(const s of sections){
  for(const step of ['hook','worked','explain']) await go(`#/s/${s.id}/${step}`);
  for(let i=0;i<s.cards.length;i++){await go(`#/s/${s.id}/learn/${i}`);assert(await page.locator('.lesson-card').count(),s.id);assert.equal(await page.locator('.katex-error').count(),0,`Formula ${s.id}/${i}`);}
  await go(`#/s/${s.id}/lab`);
  for(let i=0;i<s.labs.length;i++){
   const lab=s.labs[i],wrap=page.locator('#app .card').filter({has:page.locator('h2').filter({hasText:plain(lab.title)})});
   if(lab.type==='sort') await sortItems(lab,wrap);
   if(lab.type==='scenarios') for(const item of lab.items) await wrap.getByRole('button',{name:plain(item.options.find(o=>o.ok).t),exact:true}).click();
   if(lab.type==='equilibrium'){
    const set=(n,v)=>wrap.locator('input[type=range]').nth(n).evaluate((el,v)=>{el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));},v);
    await set(0,20);await set(0,0);await set(1,lab.mode==='fx'?-20:20);
    assert.equal(await wrap.locator('.challenge.won').count(),2,s.id);
   }
   if(['sort','scenarios'].includes(lab.type)) assert.equal(await wrap.locator('.challenge.won').count(),1,s.id);
   labs++;
  }
  await go(`#/s/${s.id}/quiz`);
  for(const q of s.quiz){
   if(q.type==='num'){
    for(const td of await page.locator('td.blank').all()) await td.locator('input').fill(await td.getAttribute('data-a'));
    const answer=page.getByRole('textbox',{name:'Your answer',exact:true});
    if(await answer.count()) await answer.fill(String(q.answer));
    await page.getByRole('button',{name:'Check',exact:true}).click();
   }else if(q.type==='sort') await sortItems(q);
   else await page.getByRole('button',{name:q.type==='tf'?(q.answer?'True':'False'):plain(q.options[q.answer]),exact:true}).click();
   assert(await page.locator('.feedback.good').count(),q.id);
   await page.getByRole('button',{name:'Next →',exact:true}).click();questions++;
  }
  assert((await page.locator('#app').innerText()).includes(`${s.quiz.length}/${s.quiz.length} first try`),s.id);
 }
 for(const hash of ['#/formulas','#/stats','#/review','#/boss/2','#/u/2','#/u/3','#/u/4','#/settings','#/']){await go(hash);assert.equal(await page.locator('.katex-error').count(),0,hash);}
 await go('#/s/1.1b/learn/3');await page.locator('.term').first().click();assert(await page.locator('[role=dialog]').count());
 await page.setViewportSize({width:375,height:812});
 for(const s of sections){
  for(const step of ['lab','quiz',...s.cards.map((_,i)=>`learn/${i}`)]){
   await go(`#/s/${s.id}/${step}`);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`Mobile overflow ${s.id}/${step}`);
  }
 }
 await go('#/formulas');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Formula overflow');
 fs.mkdirSync(path.join(__dirname,'../docs/screenshots'),{recursive:true});
 await page.evaluate(()=>localStorage.clear());await page.reload();
 await go('#/u/4');await page.screenshot({path:path.join(__dirname,'../docs/screenshots/global-mobile.png'),fullPage:true});
 await page.setViewportSize({width:1280,height:900});await go('#/');await page.screenshot({path:path.join(__dirname,'../docs/screenshots/course-desktop.png'),fullPage:true});
 assert.deepEqual(errors,[]);
 console.log(`PASS: ${sections.length} lessons, ${questions} quiz answers, ${labs} labs rendered; generic and equilibrium challenges solved; all cards, glossary, formulas, review, stats and 375px layouts. No page errors.`);
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
