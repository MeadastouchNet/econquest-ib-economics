import { unit1 } from './unit1.js';
export const UNITS = [
unit1,
{"id": "2", "title": "Microeconomics", "emoji": "🛒", "planned": [{"id": "2.1", "title": "Demand", "hl": false}, {"id": "2.2", "title": "Supply", "hl": false}, {"id": "2.3", "title": "Competitive market equilibrium", "hl": false}, {"id": "2.4", "title": "Critique of the maximizing behaviour of consumers and producers", "hl": false}, {"id": "2.5", "title": "Elasticity of demand", "hl": false}, {"id": "2.6", "title": "Elasticity of supply", "hl": false}, {"id": "2.7", "title": "Role of government in microeconomics", "hl": false}, {"id": "2.8", "title": "Market failure—externalities and common access resources", "hl": false}, {"id": "2.9", "title": "Market failure—public goods", "hl": false}, {"id": "2.10", "title": "Market failure—asymmetric information", "hl": true}, {"id": "2.11", "title": "Market failure—market power", "hl": true}, {"id": "2.12", "title": "The market’s inability to achieve equity", "hl": true}]},
{"id": "3", "title": "Macroeconomics", "emoji": "🏦", "planned": [{"id": "3.1", "title": "Measuring economic activity and illustrating its variations", "hl": false}, {"id": "3.2", "title": "Variations in economic activity—aggregate demand and aggregate supply", "hl": false}, {"id": "3.3", "title": "Macroeconomic objectives", "hl": false}, {"id": "3.4", "title": "Economics of inequality and poverty", "hl": false}, {"id": "3.5", "title": "Demand management—monetary policy", "hl": false}, {"id": "3.6", "title": "Demand management—fiscal policy", "hl": false}, {"id": "3.7", "title": "Supply-side policies", "hl": false}]},
{"id": "4", "title": "The global economy", "emoji": "🌐", "planned": [{"id": "4.1", "title": "Benefits of international trade", "hl": false}, {"id": "4.2", "title": "Types of trade protection", "hl": false}, {"id": "4.3", "title": "Arguments for and against trade control/protection", "hl": false}, {"id": "4.4", "title": "Economic integration", "hl": false}, {"id": "4.5", "title": "Exchange rates", "hl": false}, {"id": "4.6", "title": "Balance of payments", "hl": false}, {"id": "4.7", "title": "Sustainable development", "hl": false}, {"id": "4.8", "title": "Measuring development", "hl": false}, {"id": "4.9", "title": "Barriers to economic growth and development", "hl": false}, {"id": "4.10", "title": "Economic growth and development strategies", "hl": false}]}
];
export const BUILT = UNITS.filter(u => u.sections);
export const SECTIONS = BUILT.flatMap(u => u.sections.map(s => Object.assign(s, { unit: u.id })));
// Each question gets its unit's calculator keys (js/calc.js), if the unit sets `calcKeys`.
for (const u of BUILT) if (u.calcKeys) for (const s of u.sections) for (const q of s.quiz) q.calcKeys = u.calcKeys;
export const findSection = id => SECTIONS.find(s => s.id === id);
export const findUnit = id => UNITS.find(u => u.id === id);
/** Built section or planned topic for an id like "3.4" or "1.2", with its unit. */
export function findTopic(id) {
  const u = findUnit(String(id).split('.')[0]);
  if (!u) return null;
  const built = u.sections?.find(s => s.id === id);
  if (built) return { unit: u, topic: built, built: true };
  const p = u.planned?.find(s => s.id === id);
  return p ? { unit: u, topic: p, built: false } : null;
}
