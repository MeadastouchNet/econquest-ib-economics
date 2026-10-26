import { icon } from './icons.js';
// Interactive "Play" labs. Each lab gets a container and calls onWin() once its challenge is beaten.
import { h, money, pct, round, slider, lineChart, barChart, speakButton, toast } from './ui.js';
import { sortWidget } from './quiz.js';
import { sfx } from './audio.js';

export function renderLab(el, lab, onWin) {
  const fn = LABS[lab.type];
  if (!fn) { el.append(h('p', {}, `Unknown lab: ${lab.type}`)); return; }
  fn(el, lab, onWin);
}

function challengeBox(text) {
  const box = h('div', { class: 'challenge', html: text });
  box.win = msg => { if (box.classList.contains('won')) return false; box.classList.add('won'); box.innerHTML = `${msg || text}`; return true; };
  return box;
}

/** A list of challenges checked in order; onWin fires when all are beaten. */
function challengeList(texts, onWin) {
  const boxes = texts.map(t => challengeBox(t));
  const done = new Set();
  const wrap = h('div', {}, boxes);
  wrap.check = results => {
    results.forEach((ok, i) => {
      if (ok && !done.has(i)) { done.add(i); boxes[i].win(); sfx('good'); toast('Challenge done!'); }
    });
    if (done.size === texts.length && !wrap.fired) { wrap.fired = true; onWin(); }
  };
  return wrap;
}

const LABS = {
  equilibrium(el, lab, onWin) {
    const mode = lab.mode || 'market';
    const labels = mode === 'macro'
      ? {d:'AD',s:'SRAS',x:'Real GDP (index)',y:'Price level (index)',dShift:'Autonomous spending shift',sShift:'Supply cost shift',rise:'Raise aggregate demand by 20; leave supply unchanged.',supply:'Reset demand, then raise production costs by 20.'}
      : mode === 'fx'
      ? {d:'D currency',s:'S currency',x:'Currency traded (million)',y:'Foreign currency per domestic unit (index)',dShift:'Demand for domestic currency',sShift:'Domestic currency supply cost shift',rise:'Raise demand for domestic currency by 20.',supply:'Reset demand, then increase currency supply (cost shift −20).'}
      : {d:'Demand',s:'Supply',x:'Quantity (cups per day)',y:'Price (DKK per cup)',dShift:'Demand shift',sShift:'Production cost shift',rise:'Raise demand by 20; leave supply unchanged.',supply:'Reset demand, then raise production costs by 20.'};
    const state = {d:0,s:0};
    const graph = h('div'), info = h('p',{'aria-live':'polite'});
    const checks = challengeList([labels.rise,labels.supply],onWin);
    const update = () => {
      // P = 100 + d − Q; P = 20 + s + Q. Fixed axes allow shifts to be compared.
      const quantity = (80 + state.d - state.s)/2;
      const price = 60 + (state.d + state.s)/2;
      const points = (d,s) => [
        {name:labels.d,color:'var(--chart-1)',points:[[0,100+d],[80,20+d]]},
        {name:labels.s,color:'var(--chart-2)',points:[[0,20+s],[80,100+s]]}
      ];
      graph.replaceChildren(lineChart([
        {name:'',color:'var(--muted)',dash:'4 4',points:[[0,100],[80,20]]},
        {name:'',color:'var(--muted)',dash:'4 4',points:[[0,20],[80,100]]},
        ...points(state.d,state.s),
        {name:'Equilibrium',color:'var(--warn)',points:[[quantity,price]],dots:true},
        {name:'',color:'transparent',points:[[0,0],[80,140]]}
      ],{title:`${labels.d} and ${labels.s}: ${labels.y} against ${labels.x}`,xLabel:labels.x}));
      info.textContent = `Equilibrium: ${labels.x} = ${quantity}; ${labels.y} = ${price}. Baseline: quantity 40, vertical value 60. Dashed curves show the baseline.`;
      checks.check([state.d===20&&state.s===0,state.d===0&&state.s===(mode==='fx'?-20:20)]);
    };
    el.append(h('h2',{},icon('gamepad-2'), lab.title),h('p',{},`Vertical axis: ${labels.y}. Horizontal axis: ${labels.x}. Move a curve and compare both equilibrium values.`),
      h('p',{class:'muted'},mode==='macro'?'A simplified upward-sloping SRAS model for the short run. It does not represent long-run potential output.':mode==='fx'?'A floating exchange rate model. A negative supply cost shift moves currency supply right.':'A competitive market with linear curves, holding other influences constant.'),checks,
      slider({label:labels.dShift,min:-20,max:20,step:10,value:0,oninput:v=>{state.d=v;update();}}),
      slider({label:labels.sShift,min:-20,max:20,step:10,value:0,oninput:v=>{state.s=v;update();}}),graph,info);
    update();
  },
  // ------------------------------------------------------------ classify
  sort(el, lab, onWin) {
    const render = () => {
      el.replaceChildren(h('h2', {}, icon('gamepad-2'), lab.title), challengeBox(lab.challenge));
      const ch = el.lastChild;
      el.append(sortWidget({ buckets: lab.buckets, items: lab.items }, (all, right, total) => {
        if (all) { ch.win(`${lab.challenge} Done!`); onWin(); }
        else el.append(h('p', { class: 'muted', style: 'margin-top:10px' }, `${right}/${total} correct.`),
          h('button', { class: 'btn ghost', onclick: render }, icon('rotate-ccw'), 'Shuffle and try again'));
      }));
    };
    render();
  },

  // ------------------------------------------------------------ pick the best option per scenario
  scenarios(el, lab, onWin) {
    const solved = new Set();
    const ch = challengeBox(lab.challenge);
    el.append(h('h2', {}, icon('gamepad-2'), lab.title), ch);
    lab.items.forEach((it, i) => {
      const fb = h('div');
      const opts = it.options.map(o => {
        const b = h('button', { class: 'opt', html: o.t });
        b.onclick = () => {
          b.classList.add(o.ok ? 'correct' : 'wrong');
          sfx(o.ok ? 'good' : 'bad');
          fb.replaceChildren(h('div', { class: `feedback ${o.ok ? 'good' : 'bad'}` }, o.fb));
          if (o.ok) {
            opts.forEach(x => { x.disabled = true; });
            solved.add(i);
            if (solved.size === lab.items.length && ch.win()) onWin();
          }
        };
        return b;
      });
      el.append(h('div', { class: 'card flat', style: 'background:var(--card-2)' },
        h('div', { class: 'spread', style: 'align-items:start' }, h('p', { html: `<b>${i + 1}.</b> ${it.s}` }), speakButton(it.s)),
        h('div', { class: 'options' }, opts), fb));
    });
  },



  ppc(el, lab, onWin) {
    const s = { meals: 40, use: 70, growth: 0, curved: true };
    const graph = h('div'), info = h('p', { 'aria-live': 'polite' });
    const checks = challengeList([
      'Use all resources and choose 60 meal boxes.',
      'Reduce resource use to 70%, then restore it to 100%.',
      'Expand capacity by 20% while keeping full resource use.'
    ], onWin);
    let efficientSeen = false, idleSeen = false;
    const update = () => {
      const capacity = 100 * (1 + s.growth / 100);
      const frontier = x => 20 * (1 + s.growth / 100) * (s.curved ? 1 - (x / capacity) ** 2 : 1 - x / capacity);
      const x = s.meals * s.use / 100, y = frontier(s.meals) * s.use / 100;
      const points = Array.from({length:51}, (_,i) => { const x = capacity * i / 50; return [x,frontier(x)]; });
      graph.replaceChildren(lineChart([
        {name:'PPC',color:'var(--chart-1)',points},
        {name:'Your output',color:'var(--chart-2)',points:[[x,y]],dots:true}
      ],{title:'Production possibilities: meal boxes horizontally, music sets vertically',xLabel:'Meal boxes per day'}));
      const state = s.use === 100 ? 'On the frontier: productively efficient.' : 'Inside the frontier: resources are idle or inefficiently used.';
      info.textContent = `${round(x,1)} meal boxes and ${round(y,1)} music sets. ${state} Capacity expansion: ${s.growth}%. ${s.curved ? 'Bowed PPC: increasing opportunity cost.' : 'Straight PPC: constant opportunity cost.'}`;
      if (s.use === 100 && s.meals === 60) efficientSeen = true;
      if (efficientSeen && s.use === 70) idleSeen = true;
      checks.check([efficientSeen, idleSeen && s.use === 100, idleSeen && s.use === 100 && s.growth === 20]);
    };
    const toggle = h('button', {class:'btn ghost',onclick:() => {s.curved = !s.curved; toggle.textContent = s.curved ? 'Compare a straight PPC' : 'Compare a bowed PPC'; update();}}, 'Compare a straight PPC');
    el.append(h('h2',{},icon('gamepad-2'), lab.title),h('p',{},'Vertical axis: music sets per day. Horizontal axis: meal boxes per day.'),h('p',{},'Change the output mix, resource use and capacity. The mix slider selects a point on the frontier; resource use scales actual output inside it.'),checks,
      slider({label:'Meal boxes at full resource use',min:0,max:100,step:10,value:s.meals,oninput:v=>{s.meals=v;update();}}),
      slider({label:'Resources actually used (%)',min:40,max:100,step:10,value:s.use,oninput:v=>{s.use=v;update();}}),
      slider({label:'Capacity expansion (%)',min:0,max:50,step:10,value:s.growth,oninput:v=>{s.growth=v;update();}}),toggle,graph,info);
    update();
  },
  flow(el, lab, onWin) {
    const s = {saving:100,tax:150,imports:50,investment:60,government:100,exports:80};
    const graph = h('div'), info = h('p',{'aria-live':'polite'});
    const checks = challengeList(['Set investment to balance all planned flows.','After balancing, raise investment until injections exceed leakages by DKK 40.'],onWin);
    let balanced = false;
    const update = () => {
      const L = s.saving+s.tax+s.imports, J = s.investment+s.government+s.exports;
      if (L===J) balanced=true;
      info.textContent = `Leakages: DKK ${L}; injections: DKK ${J}; gap: DKK ${J-L}. `+(J===L?'Planned-flow equilibrium.':J>L?'Upward pressure on income in the simple model.':'Downward pressure on income in the simple model.');
      graph.replaceChildren(barChart([{label:'Leakages',value:L,color:'var(--warn)'},{label:'Injections',value:J,color:'var(--accent)'}],{title:'Planned leakages and injections, DKK per period'}));
      checks.check([balanced,balanced && J-L===40]);
    };
    const flows = h('div',{class:'card flat',html:'<p><b>Real flows</b><br>Households → factors of production → Firms<br>Firms → goods and services → Households</p><p><b>Money flows</b><br>Firms → factor incomes → Households<br>Households → consumption spending → Firms</p><p>Households → saving → <b>Finance</b> → investment finance → Firms<br>Households/firms → taxes → <b>Government</b> → purchases → Firms<br>Domestic spending → imports → <b>Foreign sector</b><br><b>Foreign sector</b> → export spending → Domestic firms</p>'});
    el.append(h('h2',{},icon('gamepad-2'), lab.title),h('p',{},'All values are fictional DKK per period. Change investment while other planned flows remain fixed. The gap gives an initial direction of pressure, not a final GDP forecast.'),flows,checks);
    for (const [key,label] of [['saving','Saving (S)'],['tax','Taxes (T)'],['imports','Imports (M)'],['investment','Investment (I)'],['government','Government purchases (G)'],['exports','Exports (X)']])
      el.append(slider({label,min:0,max:300,step:10,value:s[key],fmt:v=>'DKK '+v,oninput:v=>{s[key]=v;update();}}));
    el.append(graph,info); update();
  }
};
