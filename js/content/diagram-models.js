// Schematic comparison drawings. Numbers on tax/subsidy models match the task equations.
const curve=(points,color='var(--chart-1)',kind='line')=>({points,color,kind});
const label=(x,y,text)=>({x,y,text});
const projection=(x,y)=>curve([[0,y],[x,y],[x,0]],'var(--chart-3)');
const axes=(xLabel,yLabel,strokes,labels)=>({xLabel,yLabel,strokes,labels});
const D=curve([[0,90],[100,30]],'var(--chart-2)');
const S=curve([[0,20],[100,80]]);
export function diagramModel(id) {
 if(['tax','subsidy'].includes(id)) {
  const tax=id==='tax',q=tax?40:80,pc=tax?40:20,pp=tax?20:40;
  return axes('Quantity / period','Price / unit',[
   curve([[0,60],[100,10]],'var(--chart-2)'),curve([[0,0],[100,50]]),
   curve(tax?[[0,20],[100,70]]:[[40,0],[100,30]],'var(--chart-4)'),
   curve([[0,pc],[q,pc],[q,pp],[0,pp]],'var(--chart-2)','area'),
   curve(tax?[[40,20],[40,40],[60,30]]:[[60,30],[80,20],[80,40]],'var(--muted)','area'),
   projection(60,30),projection(q,pc),projection(q,pp)
  ],[label(92,5,'D'),label(95,49,'S'),label(78,tax?70:12,tax?'S + tax':'S − subsidy'),label(2,pc+3,`Pc = ${pc}`),label(2,pp+3,`Pp = ${pp}`),label(2,32,'P0 = 30'),label(60,33,'E0'),label(q+1,pc+3,'E1'),label(57,2,'60'),label(q-2,8,String(q)),label(3,92,tax?'Tax revenue 800; DWL 200':'Spending 1600; DWL 200')]);
 }
 if(/^(negative|positive)-(production|consumption)$/.test(id)) {
  const negative=id.startsWith('negative'),production=id.endsWith('production');
  const qm=58.333,qo=negative?41.667:75,ym=55;
  const shift=production?(negative?20:-20):(negative?-20:20);
  const social=production?curve([[0,20+shift],[100,80+shift]],'var(--chart-4)'):curve(negative?[[0,70],[100,10]]:[[16.667,100],[100,50]],'var(--chart-4)');
  const yo=production?90-0.6*qo:20+0.6*qo;
  const ys=production?20+shift+0.6*qm:90+shift-0.6*qm;
  return axes('Quantity / period','Marginal costs / benefits',[
   D,S,social,curve([[qo,yo],[qm,ym],[qm,ys]],'var(--muted)','area'),projection(qm,ym),projection(qo,yo)
  ],[label(production?77:82,production?25:30,production?'MPB = MSB':'MPB'),label(production?72:75,production?65:80,production?'MPC':'MPC = MSC'),label(production?77:82,production?20+shift+0.6*80:negative?8:56,production?'MSC':'MSB'),label(qm-3,3,'Qm'),label(qo-4,10,'Qopt')]);
 }
 if(id==='ped')return axes('Quantity / period','Price',[
  curve([[0,100],[100,0]],'var(--chart-2)'),projection(20,80),projection(50,50),projection(80,20)
 ],[label(22,83,'P80; Q20; |PED| = 4'),label(52,53,'P50; Q50; |PED| = 1'),label(2,24,'P20; Q80; |PED| = 0.25'),label(82,8,'D')]);
 if(id==='jcurve')return axes('Time after depreciation','Trade balance (surplus + / deficit −)',[
  curve([[0,50],[100,50]],'var(--chart-3)'),curve([[5,35],[20,25],[30,15],[40,12],[50,20],[60,36],[70,50],[85,68],[97,72]],'var(--chart-2)')
 ],[label(0,53,'Zero'),label(8,8,'Initial deterioration'),label(57,80,'Conditional recovery'),label(0,92,'Schematic: no guaranteed time scale')]);
 if(id==='crowding')return axes('Loanable funds / period','Real interest rate',[
  S,curve([[0,70],[100,10]],'var(--chart-2)'),D,projection(41.667,45),projection(58.333,55)
 ],[label(80,11,'D1'),label(80,33,'D2'),label(90,78,'S'),label(1,94,'Government borrowing shifts D right'),label(0,46,'r1'),label(0,57,'r2')]);
 if(id==='money')return axes('Real money balances','Interest rate',[
  D,curve([[40,0],[40,95]]),curve([[65,0],[65,95]],'var(--chart-4)'),projection(40,66),projection(65,51)
 ],[label(35,96,'MS1'),label(62,96,'MS2'),label(80,30,'MD'),label(1,68,'r1'),label(1,53,'r2')]);
 if(id==='labour')return axes('Quantity of labour / period','Real wage',[
  D,S,curve([[0,70],[100,70]],'var(--chart-4)'),projection(33.333,70),projection(83.333,70)
 ],[label(74,24,'DL'),label(84,77,'SL'),label(1,73,'Minimum wage'),label(25,6,'Ld'),label(82,6,'Ls'),label(34,91,'Excess supply of labour: Ls − Ld')]);
 if(id==='fixed-fx')return axes('Quantity of domestic currency / period','Foreign currency per domestic unit',[
  D,curve([[0,70],[100,10]],'var(--chart-2)'),S,curve([[0,55],[100,55]],'var(--chart-4)'),projection(25,55),projection(58.333,55)
 ],[label(80,30,'D1'),label(80,11,'D2'),label(87,78,'S'),label(0,58,'Peg'),label(5,93,'At peg: bank buys excess currency supply'),label(22,5,'Qd'),label(58,5,'Qs')]);
 return null;
}
