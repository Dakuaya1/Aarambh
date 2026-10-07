import type {Exercise} from './lesson-engine';
import {supportsStyle,type GameStyle} from './discovery';
export type GameInput={kind:'choice'|'build'|'shade'|'number'|'order'|'dial';min?:number;max?:number;step?:number;tiles?:{id:number;label:string}[];options?:string[];limit?:number;parts?:number;instruction:string;style:GameStyle};
function fraction(n:number){for(let d=1;d<=200;d++){const numerator=Math.round(n*d);if(Math.abs(numerator/d-n)<=Number.EPSILON*16*Math.max(1,Math.abs(n)))return d===1?String(numerator):`${numerator}/${d}`;}return String(n);}
export function gameExercise(original:Exercise,style:GameStyle,seed:number):Exercise{
 const e:Exercise={...original,visual:original.visual?{...original.visual}:undefined};
 if(!supportsStyle(e.concept,style))throw new Error('Choose an available activity format.');
 if(style==='balance'){
  const x=2+seed%5, multiplier=['multiply','divide','linear','graph_table8','slope','quadratic','simultaneous10'].includes(e.concept)?2+Math.floor(seed/5)%4:1,offset=e.concept==='bonds1'?10-x:1+Math.floor(seed/20)%4;
  e.answer=x;e.visual=undefined;e.unit=undefined;e.format='numbers';
  e.prompt=`Balance lab: ${multiplier===1?'□':multiplier+' × □'} + ${offset} = ${multiplier*x+offset}. What value belongs in the box?`;
  e.hint=`Remove ${offset} from both sides${multiplier===1?'.':`, then share the remainder into ${multiplier} equal groups.`}`;
  e.explanation=`Put ${x} in the box: ${multiplier} × ${x} + ${offset} = ${multiplier*x+offset}. Both sides have the same value.`;
 }
 if(style==='estimate'){
  const exact=e.answer,step=Math.abs(exact)>=100?100:10;
  e.visual=undefined;e.format='numbers';
  e.prompt=`Estimation station: ${e.prompt} Give the result rounded to the nearest ${step}. At halfway, choose the greater multiple.`;
  e.answer=Math.floor(exact/step+0.5)*step;
  e.hint=`Find the result, then compare the two neighbouring multiples of ${step}. This round practises rounding; you can work it out exactly first.`;
  e.explanation=`${e.explanation} Rounded to the nearest ${step}, ${exact} becomes ${e.answer}${e.unit?' '+e.unit:''}.`;
 }
 if(style==='target'){
  e.game={kind:'dial',min:0,max:Math.max(30,Math.ceil(e.answer/10)*10+10),step:1,style,instruction:'Move the dial or use the step buttons to build your answer. Then check it.'};
  return e;
 }
 if(style==='order'){
  const a=2+seed%5,b=1+Math.floor(seed/5)%4;
  let values=[a,a+b,a+2*b,a+3*b],labels:string[]=[];
  if(e.concept==='count'||e.concept==='compare')values=[a,a+1,a+2,a+3];
  if(e.concept==='place')values=[a*10+b,b*10+a,a*10+b+10,b*10+a+20];
  if(e.concept==='hundreds3')values=[a*100+b,a*100+b*10,a*100+b*10+1,(a+1)*100+b];
  if(e.concept==='fraction_compare4'){values=[1,2,3,4].map(n=>n/(b+5));labels=[1,2,3,4].map(n=>`${n}/${b+5}`);}
  if(e.concept==='decimal_compare5')values=[a/10,(a*10-2)/100,(a*100+5)/1000,(a*10+1)/100];
  if(e.concept==='order_integer6'||e.concept==='rational7'){values=[-a-b,-a,0,b];if(e.concept==='rational7'){values=values.map(n=>n/2);labels=[-a-b,-a,0,b].map(n=>`${n}/2`);}}
  if(e.concept==='power'){values=[2,3,4,5].map(n=>n**b);labels=[2,3,4,5].map(n=>`${n}^${b}`);}
  if(e.concept==='real9'){values=[a,a+1,a+2,a+3];labels=values.map(n=>`√${n*n}`);}
  // Equal values can make an ordering ambiguous. Keep every tile mathematically distinct.
  if(new Set(values).size!==4)values=[a*10+b,a*10+b+1,a*10+b+10,a*10+b+11];
  const permutation=[[2,0,3,1],[1,3,0,2],[3,1,2,0],[1,0,3,2]][seed%4];
  const tiles=permutation.map((source,i)=>({id:i+1,label:labels[source]||fraction(values[source]),value:values[source]}));
  const ordered=[...tiles].sort((x,y)=>x.value-y.value);
  e.answer=Number(ordered.map(t=>t.id).join(''));e.visual=undefined;e.unit=undefined;e.format='numbers';
  e.prompt=e.concept==='ap10'?`These four terms belong to an increasing arithmetic progression with step ${b}. Arrange them from least to greatest.`:'Arrange all four tiles from least to greatest. Tap them in the order you choose.';
  e.hint='Find the smallest value first, then compare the remaining values.';
  if(e.concept==='order_integer6'||e.concept==='rational7')e.hint='The smallest value lies furthest left on a number line.';
  if(e.concept==='fraction_compare4')e.hint='The denominator is the same for every tile. Compare how many equal parts each tile has.';
  if(e.concept==='decimal_compare5')e.hint='Align place values. You may add zeros to the right without changing the value.';
  if(['count','compare','place','hundreds3'].includes(e.concept))e.hint='Find the smallest number first. Then compare the numbers that remain.';
  if(e.concept==='power'||e.concept==='real9')e.hint='Work out the value of each expression, then compare the values.';
  e.explanation=`From least to greatest: ${ordered.map(t=>t.label).join(' < ')}.`;
  e.game={kind:'order',tiles:tiles.map(({id,label})=>({id,label})),style,instruction:'Tap tiles to build a trail. Tap a chosen tile to undo it. Every tile is used once.'};
  return e;
 }
 if(style==='repair'){
  const wrong=fraction(e.answer+(Number.isInteger(e.answer)?1:0.25));
  e.prompt=`Robot mix-up! ${e.prompt} The robot claimed the answer was ${wrong}${e.unit?' '+e.unit:''}. That claim is incorrect. What should its answer be?`;
 }
 if(style==='whatif'){
  const a=2+seed%5,b=1+Math.floor(seed/5)%4;
  if(e.concept==='count'){e.prompt=`What if one counter joins ${a+b-1} counters? How many are there now? The model shows the new collection.`;}
  else if(e.concept==='add'){e.prompt=`What if ${b} more counters join a group of ${a}? How many will there be?`;}
  else if(e.concept==='subtract'){e.prompt=`What if ${b} counters are removed from ${a+b}? How many stay?`;}
  else if(e.concept==='multiply'){e.prompt=`What if we add one more group to ${a} groups of ${b}? How many counters will ${a+1} groups hold?`;e.answer=(a+1)*b;e.visual={kind:'groups',a:a+1,b};e.hint=`Count ${a+1} equal groups of ${b}.`;e.explanation=`${a+1} groups of ${b} hold ${(a+1)*b} counters.`;}
  else if(e.concept==='area'){e.prompt=`What if a ${a} cm by ${b} cm rectangle becomes 1 cm longer? What is the new area? The model shows the new rectangle.`;e.answer=(a+1)*b;e.visual={kind:'rectangle',a:a+1,b};e.hint=`The new length is ${a+1} cm. Multiply it by the unchanged width.`;e.explanation=`The new area is ${a+1} × ${b} = ${e.answer} cm².`;}
  else if(e.concept==='integer'){e.prompt=`What if a temperature of −${a}°C rises by ${b}°C? Where does it end up?`;}
  else if(e.concept==='slope'){e.prompt=`For y = ${a}x + ${b}, what if x increases by 2 instead of 1? How much does y increase?`;e.answer=2*a;e.visual={kind:'coordinates',a:0,b,c:2,d:2*a+b};e.hint='Each one-step increase in x changes y by the coefficient of x. Count two such changes.';e.explanation=`The increase is ${a} × 2 = ${2*a}. The intercept stays unchanged.`;}
  else if(e.concept==='sequence9'){e.prompt=`A geometric progression starts at ${a} and multiplies by ${b} each step. What if we go to the sixth term?`;e.answer=a*b**5;e.hint='The sixth term follows five multiplications by the common ratio.';e.explanation=`The sixth term is ${a} × ${b}⁵ = ${e.answer}.`;}
  else if(e.concept==='quadratic'){e.prompt=`The equation (x − ${a})(x − ${a+b}) = 0 has two roots. What if we choose the larger one?`;e.answer=a+b;e.hint='Set each factor equal to zero, then compare the two roots.';e.explanation=`The roots are ${a} and ${a+b}. The larger is ${a+b}.`;}
  else if(e.concept==='ratio'){e.prompt=`A mix uses ${a} cups of water for ${b} cups of juice. What if the water is tripled to ${3*a} cups? How many juice cups keep the same mix?`;e.answer=3*b;e.hint='Multiply both quantities by the same factor.';e.explanation=`The water tripled, so the juice is ${b} × 3 = ${e.answer} cups.`;}
  else if(e.concept==='percent'){const rate=[10,25,50,75][b-1],total=a*40;e.prompt=`What if the collection grows to ${total} books and ${rate}% are borrowed? How many are borrowed now?`;e.answer=total*rate/100;e.visual={kind:'percent',a:rate,b:total};e.hint='Apply the same percentage to the new total.';e.explanation=`${rate}/100 × ${total} = ${e.answer} books.`;}
  else e.prompt=`Try a different situation. ${e.prompt}`;
 }
 if(style==='mystery'){
  const step=Number.isInteger(e.answer)?1:0.25,options=new Set([fraction(e.answer)]);for(let i=1;options.size<4;i++){const candidate=e.answer+(i%2?-1:1)*Math.ceil(i/2)*step;if(e.answer>=0&&candidate<0)continue;options.add(fraction(candidate));}
  const values=[...options];for(let i=values.length-1;i>0;i--){const j=(seed*13+i*7)%(i+1);[values[i],values[j]]=[values[j],values[i]];}
  e.game={kind:'choice',options:values,style,instruction:'Choose the answer that fits. Then you can try one without choices.'};
 }else if(['fraction','fractions3','probability'].includes(e.concept)&&e.answer>0&&e.answer<1){
  const parts=e.concept==='probability'?(e.visual?.a||0)+(e.visual?.b||0):e.visual?.b;
  // The equivalent-fraction activity asks for a numerator, so it uses a constructed number.
  if(parts&&parts<=20&&e.concept!=='fraction')e.game={kind:'shade',parts,style,instruction:`Shade the answer on a new strip with ${parts} equal parts. Each full strip is one whole.`};
 }else if(style==='build'&&Number.isInteger(e.answer)&&e.answer>=0&&e.answer<=30){
  e.game={kind:'build',limit:30,style,instruction:'Make your answer with counters. Add or remove as many as you need.'};
 }
 e.game??={kind:'number',style,instruction:e.unit?`Enter your answer in ${e.unit}.`:'Enter a number or a fraction. You can take your time.'};
 return e;
}
