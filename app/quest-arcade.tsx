'use client';
import {useState} from 'react';
import {Check,Compass,Play,Sparkles} from 'lucide-react';
import {questPacks,discoveryPassport} from '@/lib/quest-packs';
import type {Attempt} from '@/lib/curriculum';
import type {DiscoveryCard} from '@/lib/discovery';
import './quest-arcade.css';
export function QuestArcade({grade,attempts,now,busy,onPack}:{grade:number;attempts:Attempt[];now:number;busy:boolean;onPack:(cards:DiscoveryCard[],name:string)=>void}){
 const packs=questPacks(grade,attempts),passport=discoveryPassport(attempts,now),[theme,setTheme]=useState('ocean');
 return <section className={`quest-arcade arcade-${theme}`}>
 <div className="arcade-top"><div><span className="arcade-eyebrow"><Compass size={16}/>NEXT STOP: SOMETHING SURPRISING</span><h3>Your challenge arcade</h3><p>Choose a tiny mission. Discover one idea in three ways.</p></div><div className="arcade-themes" aria-label="Arcade colour"><span>Set the mood</span>{['ocean','sunset','forest'].map(t=><button key={t} className={`theme-${t}`} aria-label={`${t} colours`} aria-pressed={theme===t} onClick={()=>setTheme(t)}/>)}</div></div>
 <div className="quest-pack-grid">{packs.map((pack,i)=><article key={pack.id}><div className="pack-topline"><span>MISSION {String(i+1).padStart(2,'0')}</span><span>Class {grade}</span></div><div className="pack-symbol" aria-hidden="true">{pack.symbol}</div><h4>{pack.name}</h4><p>{pack.description}</p><ol>{pack.cards.map((c,j)=><li key={c.id}><span>{j+1}</span>{c.title}</li>)}</ol><small>{pack.explored}/{pack.total} ideas previously explored</small><button className="pack-start" disabled={busy} onClick={()=>onPack(pack.cards,pack.name)}><Play size={16}/>Play this mission</button></article>)}</div>
 <div className="discovery-passport"><div><span className="arcade-eyebrow"><Sparkles size={15}/>DISCOVERY PASSPORT</span><h4>Chapter {passport.level} of your adventure</h4><p>{passport.sparks} curiosity sparks collected · {50-passport.within} to the next chapter</p><div className="passport-meter" role="progressbar" aria-label="Adventure chapter progress" aria-valuemin={0} aria-valuemax={50} aria-valuenow={passport.within}><i style={{width:`${passport.within*2}%`}}/></div><small>Chapters celebrate activity. Your learning evidence grows separately.</small></div><div className="passport-stamps">{passport.milestones.map(m=><div key={m.name} className={m.earned?'stamp-earned':''}><span>{m.symbol}{m.earned&&<Check size={12}/>}</span><strong>{m.name}</strong><small>{m.earned?'Collected':`${m.at} sparks`}</small></div>)}</div></div>
 </section>;
}
