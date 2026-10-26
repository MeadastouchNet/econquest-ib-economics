import * as store from './store.js';
// Included in the app's existing export/import/reset, with lazy migration for older saves.
export function evidence() {
  return (store.get().assessment ||= {drawings:{}, papers:{}, ia:[{},{},{}], cases:{}});
}
export function saveEvidence() { store.save(); }
export function paperState(id) {
  return (evidence().papers[id] ||= {answers:{},numbers:{},reviews:{}});
}
export function wordCount(text='') { return text.trim() ? text.trim().split(/\s+/u).length : 0; }
export function iaWarnings(entries) {
  const warnings=[];
  const used={unit:new Set(),concept:new Set(),source:new Set()};
  entries.forEach((entry,i)=>{
    for (const key of Object.keys(used)) {
      const value=String(entry[key]||'').trim().toLowerCase();
      if(!value) warnings.push(`Commentary ${i+1}: choose a ${key}.`);
      else if(used[key].has(value)) warnings.push(`Commentary ${i+1}: repeated ${key}; choose a different one.`);
      else used[key].add(value);
    }
    if(!entry.url || !/^https?:\/\//i.test(entry.url)) warnings.push(`Commentary ${i+1}: add a news-article link.`);
    const publication=new Date(entry.published+'T12:00:00');
    const writing=new Date(entry.written+'T12:00:00');
    if(!Number.isFinite(+publication)||!Number.isFinite(+writing)) warnings.push(`Commentary ${i+1}: enter publication and writing dates.`);
    else {
      const earliest=new Date(writing); earliest.setFullYear(earliest.getFullYear()-1);
      if(publication>writing || publication<earliest) warnings.push(`Commentary ${i+1}: article must be published within the year before writing.`);
    }
    if(wordCount(entry.draft)>800) warnings.push(`Commentary ${i+1}: draft exceeds 800 words. Check the official counting rules with your teacher.`);
  });
  return warnings;
}
