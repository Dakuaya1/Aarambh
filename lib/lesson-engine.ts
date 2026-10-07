import { concepts } from './curriculum';
import type {GameInput} from './game-engine';
import {extraExercise} from './extra-lessons';
import {questionVisual,type QuestionVisual} from './question-visuals';
export type Exercise={game?:GameInput;concept:string;format:string;prompt:string;answer:number;unit?:string;hint:string;explanation:string;visual?:QuestionVisual;review:boolean};
export function makeExercise(id:string,index:number,seed:number,review=false):Exercise {
 const a=2+seed%5,b=1+Math.floor(seed/5)%4,c=1+Math.floor(seed/20)%3;
 let format=['visual','numbers','story'][index%3];
 let p='',numeric='',answer=0,hint='',explanation='',visual:Exercise['visual'],unit='';
 switch(id){
 case 'add':answer=a+b;p=`You have ${a} counters. You add ${b} more. How many counters do you have now?`;numeric=`What is ${a} + ${b}?`;hint='Start with the first group. Count on once for each counter in the other group.';explanation=`${a} and ${b} together make ${answer}.`;visual={kind:'counters',a,b};break;
 case 'subtract':answer=a;p=`${a+b} birds are on a fence. ${b} fly away. How many remain?`;numeric=`What is ${a+b} − ${b}?`;hint=`Begin at ${a+b} and count back ${b} steps.`;explanation=`${a+b} − ${b} = ${a}.`;visual={kind:'subtract',a:a+b,b};break;
 case 'place':answer=a;p=`A box contains ${a*10+b} pencils. How many complete bundles of ten can you make?`;numeric=`How many tens are in ${a*10+b}?`;hint='The digit on the left tells you how many complete groups of ten there are.';explanation=`${a*10+b} is ${a} tens and ${b} ones.`;visual={kind:'place',a,b};break;
 case 'tens':answer=10*a+b+17;p=`You collected ${10*a+b} stamps, then found 17 more. How many stamps now?`;numeric=`What is ${10*a+b} + 17?`;hint='Add 10 first, then add 7. Exchange ten ones for a ten if needed.';explanation=`${10*a+b} + 10 = ${10*a+b+10}; adding 7 gives ${answer}.`;break;
 case 'multiply':answer=a*b;p=`There are ${a} trays with ${b} cups on each. How many cups are there?`;numeric=`What is ${a} × ${b}?`;hint=`Add ${b} to itself ${a} times.`;explanation=`${a} × ${b} = ${answer}.`;visual={kind:'groups',a,b};break;
 case 'divide':answer=a;p=`Share ${a*b} counters equally between ${b} groups. How many in each group?`;numeric=`What is ${a*b} ÷ ${b}?`;hint=`Which number multiplied by ${b} gives ${a*b}?`;explanation=`${a*b} ÷ ${b} = ${a}. Each group has ${a}.`;visual={kind:'groups',a:b,b:a};break;
 case 'fraction':answer=b*2;p=`Half a ribbon is coloured. It has ${b*4} equal sections. How many sections are coloured?`;numeric=`Complete 1/2 = ?/${b*4}. Enter the numerator.`;hint=`The denominator 2 is multiplied by ${b*2}. Multiply the numerator by the same number.`;explanation=`Multiplying both parts by ${b*2} gives ${answer}/${b*4}.`;visual={kind:'fraction',a:b*2,b:b*4};break;
 case 'perimeter':answer=2*(a+b);p=`A rectangle is ${a} cm long and ${b} cm wide. What is its perimeter?`;numeric=`Calculate 2 × (${a} + ${b}).`;unit='cm';hint='Add all four sides: length + width + length + width.';explanation=`${a} + ${b} + ${a} + ${b} = ${answer} cm.`;visual={kind:'rectangle',a,b};break;
 case 'decimal':answer=(a+b)/10;p=`One ribbon is ${(a/10).toFixed(1)} m and another is ${(b/10).toFixed(1)} m. What is their total length?`;numeric=`What is ${(a/10).toFixed(1)} + ${(b/10).toFixed(1)}?`;hint='Count the tenths together, then write them as a decimal.';explanation=`${a} tenths + ${b} tenths = ${a+b} tenths = ${answer}.`;break;
 case 'area':answer=a*b;p=`A rectangle is ${a} cm long and ${b} cm wide. What is its area?`;numeric=`Calculate ${a} × ${b}.`;unit='cm²';hint='Multiply the number of rows by the number of squares in each row.';explanation=`${a} × ${b} = ${answer} square centimetres.`;visual={kind:'rectangle',a,b};break;
 case 'integer':answer=b-a;p=`The temperature is −${a}°C. It rises by ${b}°C. What is the new temperature?`;numeric=`What is −${a} + ${b}?`;hint=`Start at −${a} on a number line and move ${b} steps to the right.`;explanation=`Moving ${b} right from −${a} lands at ${answer}.`;break;
 case 'ratio':answer=b*2;p=`A mixture uses ${a} cups of water for ${b} cups of juice. With ${a*2} cups of water, how many cups of juice keep the same ratio?`;numeric=`Complete the equivalent ratio: ${a}:${b} = ${a*2}:?`;hint='The first quantity doubled. Apply the same change to the second.';explanation=`${b} × 2 = ${answer}.`;break;
 case 'equation':answer=a;p=`You had some cards and received ${b} more. You now have ${a+b}. How many did you start with?`;numeric=`Find x: x + ${b} = ${a+b}.`;hint=`Subtract ${b} from both sides.`;explanation=`x = ${a+b} − ${b} = ${a}.`;break;
 case 'percent':{const rate=[10,25,50,75][b-1],total=a*20;answer=total*rate/100;p=`A collection has ${total} books. ${rate}% are borrowed. How many are borrowed?`;numeric=`What is ${rate}% of ${total}?`;hint='Write the percentage as a fraction over 100, then multiply by the whole.';explanation=`${rate}/100 × ${total} = ${answer}.`;break;}
 case 'power':answer=a**(b+c);p=`A number is multiplied by ${a}, ${b} times, then by ${a}, ${c} more times. What is the overall multiplication factor?`;numeric=`Evaluate ${a}^${b} × ${a}^${c}.`;hint='For powers with the same base, combine the repeated factors by adding the exponents.';explanation=`${a}^${b} × ${a}^${c} = ${a}^${b+c} = ${answer}.`;break;
 case 'linear':answer=a;p=`${b+1} identical notebooks and a ₹${b} pencil cost ₹${(b+1)*a+b}. What does one notebook cost?`;numeric=`Solve ${b+1}x + ${b} = ${(b+1)*a+b}.`;hint=`First subtract ${b} from both sides, then divide by ${b+1}.`;explanation=`${b+1}x = ${(b+1)*a}, so x = ${a}.`;break;
 case 'slope':answer=a;p=`A taxi charges ₹${b} to start and ₹${a} per kilometre. How much does the fare increase for one extra kilometre?`;numeric=`In y = ${a}x + ${b}, how much does y increase when x increases by 1?`;hint='The coefficient multiplying x tells you the change for each one-step increase in x.';explanation=`y increases by ${a}. The slope is ${a}.`;break;
 case 'triangle':answer=5*b;p=`A right triangle has shorter sides ${3*b} cm and ${4*b} cm. Find the hypotenuse.`;numeric=`Find √(${3*b}² + ${4*b}²).`;unit='cm';hint='Square the two shorter sides, add the results, then take the square root.';explanation=`√(${3*b}² + ${4*b}²) = √${25*b*b} = ${5*b} cm.`;visual={kind:'triangle',a:3*b,b:4*b};break;
 case 'quadratic':answer=a;p=`Two possible measurements satisfy (x − ${a})(x − ${a+b}) = 0. What is the smaller measurement?`;numeric=`Find the smaller root: (x − ${a})(x − ${a+b}) = 0.`;hint='A product is zero when at least one of its factors is zero.';explanation=`The roots are ${a} and ${a+b}. The smaller is ${a}.`;break;
 case 'probability':answer=a/(a+b);p=`A bag has ${a} green counters and ${b} blue counters, identical apart from colour. A counter is drawn at random. What is P(green)? Enter a fraction.`;numeric=`${a} of ${a+b} equally likely outcomes are favourable. What is the probability? Enter a fraction.`;hint='Divide the favourable outcome count by the total equally likely outcome count.';explanation=`P(green) = ${a}/${a+b}.`;visual={kind:'counters',a,b};break;
 default:return extraExercise(id,index,seed,review);
 }
 visual=visual||questionVisual(id,seed);
 if(format==='visual'&&!visual)format='numbers';
 if(format==='numbers')p=numeric;
 if(format==='visual'&&id==='add')p='How many counters are there altogether?';
 if(format==='visual'&&id==='subtract')p=`${b} counters are crossed out. How many remain?`;
 return {concept:id,format,prompt:p,answer,hint,explanation,visual:format==='visual'?visual:undefined,unit,review};
}
export function parseNumeric(response:string):number|null {
 const value=response.trim().replaceAll('−','-');
 if(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(value)){const n=Number(value);return Number.isFinite(n)?n:null;}
 const fraction=value.match(/^([+-]?\d+)\s*\/\s*([+-]?\d+)$/);
 if(fraction){const denominator=Number(fraction[2]);if(denominator===0)return null;const n=Number(fraction[1])/denominator;return Number.isFinite(n)?n:null;}
 return null;
}
export function isCorrect(response:string,expected:number){const n=parseNumeric(response);return n!==null&&Math.abs(n-expected)<=Number.EPSILON*16*Math.max(1,Math.abs(expected));}
export function exerciseSignature(e:Exercise){const givens:unknown[]=[e.concept,e.format,e.prompt,e.visual||null];if(e.game?.kind==='order')givens.push(e.game.tiles!.map(t=>t.label).sort());return JSON.stringify(givens);}
export function findConcept(id:string){return concepts.find(c=>c.id===id);}
