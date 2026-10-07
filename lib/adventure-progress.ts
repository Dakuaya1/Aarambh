import {concepts,type Attempt,type Concept} from './curriculum';
import type {DiscoveryCard,GameStyle} from './discovery';
export const worlds=[
 {id:'number',name:'Number garden',symbol:'✿',color:'mint',tagline:'Small numbers. Growing ideas.'},
 {id:'pattern',name:'Pattern peaks',symbol:'△',color:'lavender',tagline:'Find a rule. Follow a possibility.'},
 {id:'shape',name:'Shape studio',symbol:'◇',color:'peach',tagline:'Turn it, build it, see it differently.'},
 {id:'measure',name:'Measure meadow',symbol:'⌁',color:'sky',tagline:'Make sense of the world in units.'},
 {id:'data',name:'Chance cove',symbol:'◒',color:'butter',tagline:'Collect clues. Discover what they say.'},
] as const;
export function worldOf(c:Concept){return /Data|chance|Statistics|Probability/i.test(c.strand)?'data':/Geometry/i.test(c.strand)?'shape':/Measurement/i.test(c.strand)?'measure':/Algebra|Pattern/i.test(c.strand)?'pattern':'number';}
export function invitation(c:Concept,style:GameStyle='picture'):DiscoveryCard{return {id:c.id+'-'+style,concept:c.id,title:c.title,hook:c.goal,style,reason:'You chose this idea to explore. Your answers help shape the next invitation.',reasonCode:'chosen',grade:c.grade,strand:c.strand};}
// A stable day boundary is shown in the UI. These are activity records, never mastery scores.
export function learningDay(value:number|string){return new Date(new Date(value).getTime()+330*60000).toISOString().slice(0,10);}
export function adventureProgress(attempts:Attempt[],now=Date.now()){
 const valid=attempts.filter(a=>Number.isFinite(new Date(a.created).getTime()));
 const items=new Map<string,Attempt[]>();for(const a of valid){const key=a.concept+':'+(a.signature||a.question);items.set(key,[...(items.get(key)||[]),a]);}
 let sparks=0;for(const group of items.values())sparks+=2+(group.some(a=>a.correct&&a.interaction!=='choice')?3:group.some(a=>a.correct)?1:0)+(group.some(a=>a.reflection?.trim())?2:0);
 const day=learningDay(now),today=valid.filter(a=>learningDay(a.created)===day);
 const todayDistinct=new Set(today.map(a=>a.concept+':'+(a.signature||a.question))).size;
 const ideas=new Set(valid.map(a=>a.concept)),formats=new Set(valid.map(a=>a.format)),days=new Set(valid.map(a=>learningDay(a.created)));
 const week=Array.from({length:7},(_,i)=>{const date=now-(6-i)*86400000;return {date:learningDay(date),label:new Intl.DateTimeFormat('en',{timeZone:'Asia/Kolkata',weekday:'short'}).format(date),active:days.has(learningDay(date))};});
 const constructed=valid.filter(a=>a.interaction!=='choice'),reflections=valid.filter(a=>a.reflection?.trim());
 const revisited=valid.some(a=>a.review);
 const anotherWay=valid.some(a=>a.correct&&valid.some(b=>b.concept===a.concept&&!b.correct&&b.created<a.created));
 const worldCount=new Set(concepts.filter(c=>ideas.has(c.id)).map(worldOf)).size;
 const badges=[
  {id:'hello',name:'First discovery',symbol:'✦',detail:'Try your first puzzle.',value:items.size,target:1},
  {id:'curious',name:'Curiosity sprout',symbol:'✿',detail:'Explore three different ideas.',value:ideas.size,target:3},
  {id:'trail',name:'Trail maker',symbol:'↗',detail:'Explore ten different ideas.',value:ideas.size,target:10},
  {id:'maker',name:'Answer maker',symbol:'▦',detail:'Build, order or enter answers to five different puzzles.',value:new Set(constructed.map(a=>a.signature||a.question)).size,target:5},
  {id:'formats',name:'Many windows',symbol:'◈',detail:'Try visual, number and story questions.',value:formats.size,target:3},
  {id:'helper',name:'Clue collector',symbol:'☀',detail:'Finish a puzzle with a clue.',value:valid.some(a=>a.assisted)?1:0,target:1},
  {id:'voice',name:'Thinking shared',symbol:'❝',detail:'Save a note about how you worked something out.',value:reflections.length,target:1},
  {id:'return',name:'Welcome back',symbol:'⌂',detail:'Explore on two different days. Any days count.',value:days.size,target:2},
  {id:'week',name:'Five little days',symbol:'✧',detail:'Explore on five days, whenever you like.',value:days.size,target:5},
  {id:'again',name:'Another way',symbol:'↻',detail:'Find a correct answer on an idea after an earlier mix-up.',value:anotherWay?1:0,target:1},
  {id:'remember',name:'Hello again',symbol:'◷',detail:'Try a saved idea after a two-day gap.',value:revisited?1:0,target:1},
  {id:'worlds',name:'World wanderer',symbol:'❋',detail:'Explore ideas in three different maths worlds.',value:worldCount,target:3},
 ].map(b=>({...b,earned:b.value>=b.target,progress:Math.min(b.value,b.target)}));
 const quests=[
  {id:'three',name:'Three little discoveries',detail:'Try three different puzzles.',value:todayDistinct,target:3},
  {id:'two',name:'Follow a new curiosity',detail:'Explore two different ideas.',value:new Set(today.map(a=>a.concept)).size,target:2},
  {id:'make',name:'Make an answer',detail:'Build, order or enter one answer yourself.',value:today.some(a=>a.interaction!=='choice')?1:0,target:1},
 ].map(q=>({...q,done:q.value>=q.target,progress:Math.min(q.value,q.target)}));
 return {sparks,ideas:ideas.size,unique:items.size,week,days:days.size,badges,quests,worldCount};
}
