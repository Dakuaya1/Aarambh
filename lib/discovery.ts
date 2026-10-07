import {concepts,evidence,type Attempt} from './curriculum';

export type GameStyle='picture'|'mystery'|'whatif'|'story'|'build'|'order'|'repair'|'balance'|'estimate'|'target';
export type TeacherNote={priority:string;approach:string;created:string};
export type DiscoveryCard={id:string;concept:string;title:string;hook:string;style:GameStyle;reason:string;reasonCode:string;grade:number;strand:string};
export const gameStyles:{id:GameStyle;label:string;action:string}[]=[{id:'picture',label:'Picture puzzle',action:'Look & explore'},{id:'mystery',label:'Number mystery',action:'Find the answer'},{id:'whatif',label:'What if…?',action:'Try a new twist'},{id:'story',label:'Story quest',action:'Step into a story'},{id:'build',label:'Build it',action:'Make an answer'},{id:'order',label:'Order the trail',action:'Arrange the tiles'},{id:'repair',label:'Robot rescue',action:'Fix the mix-up'}];
export const balanceConcepts=['add','bonds1','multiply','equation','linear','algebra6','graph_table8'];
export const estimateConcepts=['tens','hundreds3','rounding3','multiply','area','perimeter','mass3','area_composite4','volume5','percent','unit_rate6','speed7','percent_change7','growth8','triangle','sector10'];
export const targetConcepts=['count','add','subtract','bonds1','place','multiply','divide','equation','linear','intercept9','quadratic'];
gameStyles.push({id:'balance',label:'Balance lab',action:'Find the missing value'},{id:'estimate',label:'Estimation station',action:'Make an estimate'},{id:'target',label:'Number machine',action:'Set the dial'});
export const orderConcepts=['compare','count','place','hundreds3','fraction_compare4','decimal_compare5','order_integer6','rational7','power','real9','ap10'];
export function supportsStyle(id:string,style:GameStyle){return style==='balance'?balanceConcepts.includes(id):style==='estimate'?estimateConcepts.includes(id):style==='target'?targetConcepts.includes(id):style!=='order'||orderConcepts.includes(id);}
const hooks:Record<string,string>={
 count:'How many can you find?',compare:'Which collection has more?',add:'What happens when the groups meet?',subtract:'What stays when some disappear?',zero:'Can nothing be a number?',shapes1:'Can you follow every edge?',pattern1:'What should come next?',length1:'Which one goes further?',place:'What is hiding inside a ten?',tens:'Can you trade ones for a ten?',regroup2:'Can a ten help the ones?',skip2:'Where will the next jump land?',money2:'What should come back?',time2:'How much time is in between?',measure2:'Must a ruler always start at zero?',data2:'What can a picture tell you?',multiply:'Could groups make counting quicker?',divide:'Can everyone get an equal share?',fractions3:'How much of the whole is this?',fraction:'Can different fractions mean the same?',perimeter:'How far is one trip around?',area:'How many squares fit inside?',decimal:'Can little pieces add up?',integer:'Can you travel through zero?',ratio:'Can you change the size and keep the mix?',equation:'What number is hiding in the box?',percent:'What does a piece of 100 tell you?',power:'How quickly can a pattern grow?',linear:'Can you keep both sides balanced?',triangle:'Can two sides reveal a third?',probability:'Which outcomes count towards the chance?',quadratic:'Can an equation have two answers?',slope:'One step across. How far up?',symmetry4:'Does the reflection fit?',symmetry6:'When does the shape match again?',trig10:'What can the sides tell you about an angle?',coordinates9:'How far apart are the points?',statistics9:'Which value belongs in the middle?',statistics10:'Does every group count equally?'};
function hash(s:string){let n=0;for(const ch of s)n=(n*31+ch.charCodeAt(0))>>>0;return n;}
function distinct(attempts:Attempt[]){const seen=new Set<string>();return [...attempts].sort((a,b)=>b.created.localeCompare(a.created)).filter(a=>{const key=a.signature||a.question;if(seen.has(key))return false;seen.add(key);return true;});}
/** A transparent recommendation rule, not a learner score or mastery diagnosis. */
export function buildDiscoveryFeed(grade:number,attempts:Attempt[],notes:TeacherNote[],now=Date.now(),shuffle=0):DiscoveryCard[]{
 const available=concepts.filter(c=>c.grade<=grade),recent=[...attempts].sort((a,b)=>b.created.localeCompare(a.created)),latest=recent[0],teacher=[...notes].sort((a,b)=>b.created.localeCompare(a.created))[0];
 const ranked=new Map<string,{score:number;reason:string;code:string}>();
 const add=(id:string,score:number,reason:string,code:string)=>{if(!available.some(c=>c.id===id))return;const old=ranked.get(id);if(!old||score>old.score)ranked.set(id,{score,reason,code});};
 for(const [i,c] of available.filter(c=>c.grade===grade).entries())add(c.id,recent.length||shuffle?30+((hash(c.id)+shuffle*17)%19):60-i,recent.length?'A fresh idea from your class to explore.':'A starting invitation from your class. Nothing is assumed about what you know.','explore');
 for(const c of available){const past=distinct(recent.filter(a=>a.concept===c.id));if(!past.length)continue;const ev=evidence(past,c.id),last=past[0],gap=now-new Date(last.created).getTime();
  if(gap>=48*3600000&&ev.independent>0)add(c.id,last.correct&&!last.assisted&&last.interaction!=='choice'?112:85,'You explored this before. Try it again after a little time.','revisit');
  if(c.id===latest?.concept){
   if(!last.correct||last.assisted){add(c.id,110,'Let’s try a fresh example with another way to show the idea.','another-way');
    if(past.slice(0,3).filter(a=>!a.correct).length>=2){for(const p of c.prerequisites)add(p,100,`This idea connects to ${c.title.toLowerCase()}. You can choose to explore the connection.`,'foundation');}}
   else if(last.interaction==='choice'){add(c.id,108,'You picked an answer. Now try building or entering one yourself.','construct');}
   else if(ev.independent<3||ev.formats<2){add(c.id,105,'Try the same idea in a different setting. One answer is only a beginning.','variation');}
   else {for(const next of available.filter(n=>n.prerequisites.includes(c.id))){const otherReady=next.prerequisites.filter(p=>p!==c.id).every(p=>evidence(recent,p).independent>=2);if(otherReady)add(next.id,102,`A connected idea to try after your recent work on ${c.title.toLowerCase()}.`,'connection');}add(c.id,60,'Another chance to explain this idea in a different way.','variation');}
  }
 }
 if(teacher?.priority){const last=recent.find(a=>a.concept===teacher.priority);if(!last||teacher.created>last.created)add(teacher.priority,120,'Your teacher suggested spending a little time on this idea.','teacher');}
 const chosen=[...ranked].sort((a,b)=>b[1].score-a[1].score).slice(0,9);
 // Keep a small, finite deck. A different interaction never changes the grade boundary.
 return chosen.map(([id,r],i)=>{const c=available.find(c=>c.id===id)!;let style=gameStyles[(i+shuffle)%gameStyles.length].id;
  if(['another-way','foundation'].includes(r.code))style='picture';
  if(r.code==='construct')style='build';
  if(r.code==='variation')style=latest?.format==='visual'?'story':'picture';
  if(r.code==='teacher'&&teacher){style=teacher.approach==='Try objects'?'picture':teacher.approach==='Try a story'?'story':teacher.approach==='Try symbols'?'build':style;}
  if(!supportsStyle(id,style))style='repair';
  if(style==='whatif'&&!['count','add','subtract','multiply','area','integer','slope','sequence9','quadratic','percent','ratio'].includes(id))style='story';
  return {id:`${id}-${style}`,concept:id,title:c.title,hook:hooks[id]||({picture:'What can you discover in the details?',mystery:'Can you uncover the missing answer?',whatif:'What changes when we try it another way?',story:'Can you solve a little real-world mystery?',build:'Can you make the answer yourself?',order:'Which tile belongs at the beginning?',repair:'Our little robot made a mix-up. Can you help?',balance:'Can you find the value that makes both sides equal?',estimate:'How close can you get without an exact calculation?',target:'Can you set the number machine to the right value?'}[style]),style,reason:r.reason,reasonCode:r.code,grade:c.grade,strand:c.strand};});
}
export function needsGentlerValues(attempts:Attempt[]){const recent=distinct(attempts).slice(0,4);return recent.filter(a=>a.correct&&!a.assisted&&a.interaction!=='choice').length<2||recent.slice(0,2).some(a=>!a.correct);}
