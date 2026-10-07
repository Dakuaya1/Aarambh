import {concepts,type Attempt} from './curriculum';
import {supportsStyle,type GameStyle} from './discovery';
import {invitation,adventureProgress,worldOf} from './adventure-progress';
export function questPacks(grade:number,attempts:Attempt[]){
 const current=concepts.filter(c=>c.grade===grade);
 const definitions:{id:string;name:string;symbol:string;description:string;styles:GameStyle[];ids:string[]}[]=[
  {id:'detective',name:'The missing-number case',symbol:'⌕',description:'Follow a clue, repair a mix-up and build your own answer.',styles:['mystery','repair','build'],ids:current.filter(c=>worldOf(c)==='number'||worldOf(c)==='pattern').map(c=>c.id)},
  {id:'architect',name:'The design workshop',symbol:'▦',description:'Explore a shape, investigate a measurement and test an idea.',styles:['picture','story','repair'],ids:current.filter(c=>['shape','measure'].includes(worldOf(c))).map(c=>c.id)},
  {id:'expedition',name:'The curious expedition',symbol:'✧',description:'Three different windows into the maths of your class.',styles:['picture','story','build'],ids:current.map(c=>c.id)},
 ];
 return definitions.filter(d=>d.ids.length).map(d=>{const cards=d.styles.map((style,i)=>{const c=concepts.find(c=>c.id===d.ids[i%d.ids.length])!;return {...invitation(c,supportsStyle(c.id,style)?style:'build'),id:`pack-${grade}-${d.id}-${i}`};});return {...d,cards,explored:new Set(cards.filter(c=>attempts.some(a=>a.concept===c.concept)).map(c=>c.concept)).size,total:new Set(cards.map(c=>c.concept)).size};});
}
export function discoveryPassport(attempts:Attempt[],now:number){
 const p=adventureProgress(attempts,now),level=Math.floor(p.sparks/50)+1;
 const milestones=[{name:'First trail',symbol:'✦',at:0},{name:'Colour explorer',symbol:'◈',at:25},{name:'Pattern seeker',symbol:'△',at:75},{name:'Idea builder',symbol:'▦',at:150},{name:'Wonder keeper',symbol:'✺',at:300}];
 return {level,within:p.sparks%50,sparks:p.sparks,milestones:milestones.map(m=>({...m,earned:p.unique>0&&p.sparks>=m.at})),next:milestones.find(m=>m.at>p.sparks)};
}
