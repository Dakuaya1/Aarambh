import {database} from '@/db/raw';
import {identity,body,clean,failure} from '@/lib/api';
import {makeExercise,isCorrect,parseNumeric,exerciseSignature,findConcept,type Exercise} from '@/lib/lesson-engine';
import {gameExercise} from '@/lib/game-engine';
import {needsGentlerValues,gameStyles,supportsStyle,type GameStyle} from '@/lib/discovery';
export async function POST(request:Request){try{
 const owner=identity(request),b=await body(request),db=database();
 if(b.action==='start'){
  const learner=await db.prepare('SELECT * FROM learners WHERE id=? AND owner=?').bind(clean(b.learner,80),owner).first<any>();
  if(!learner)throw new Error('Learner not found.');
  const concept=findConcept(clean(b.concept,80));if(!concept||concept.grade>learner.grade)throw new Error('Choose an available concept.');
  const past=await db.prepare('SELECT * FROM attempts WHERE owner=? AND learner=? AND concept=? ORDER BY created DESC').bind(owner,learner.id,concept.id).all<any>();
  const recentFeedback=await db.prepare('SELECT * FROM feedback WHERE owner=? AND learner=? ORDER BY created DESC LIMIT 1').bind(owner,learner.id).first<any>();
  if(b.game!==undefined&&(!gameStyles.some(s=>s.id===b.game)||!supportsStyle(concept.id,b.game)))throw new Error('Choose an available activity format.');
  let index=past.results.length;
  // A teacher suggestion is tried once, then the activity rotates again.
  if(recentFeedback&&(!past.results[0]||recentFeedback.created>past.results[0].created)){
   const method={'Try objects':0,'Try symbols':1,'Try a story':2}[recentFeedback.approach as string];if(method!==undefined)index=method;
  }
  // An explicit activity choice applies to this question, not a learner trait.
  if(b.format!==undefined&&!['auto','visual','numbers','story'].includes(b.format))throw new Error('Choose an available activity format.');
  if(b.format&&b.format!=='auto')index=['visual','numbers','story'].indexOf(b.format);
  if(b.game)index=b.game==='story'?2:0;
  const exposure=await db.prepare("SELECT MAX(CASE WHEN last_seen<>'' THEN last_seen ELSE created END) AS last FROM tasks WHERE owner=? AND learner=? AND concept=?").bind(owner,learner.id,concept.id).first<any>();
  const lastExposure=[exposure?.last,past.results[0]?.created].filter(Boolean).sort().at(-1);
  const review=!!lastExposure&&Date.now()-new Date(lastExposure).getTime()>=48*3600000&&past.results.some((a:any)=>a.correct&&!a.assisted&&a.interaction!=='choice');
  const random=new Uint32Array(1);crypto.getRandomValues(random);
  const gentle=!!b.game&&needsGentlerValues(past.results),smallSeeds=[0,1,5,6,20,21,25,26,40,41,45,46,60,61,65,66,80,81,85,86];
  const make=(n:number)=>{const seed=gentle?smallSeeds[n%smallSeeds.length]:n%100;const base=makeExercise(concept.id,index,seed,review);return b.game?gameExercise(base,b.game as GameStyle,seed):base;};
  let exercise=make(random[0]);
  const seen=new Set(past.results.map((a:any)=>a.signature||a.question));
  for(let i=0;i<100&&(seen.has(exerciseSignature(exercise))||seen.has(exercise.prompt));i++)exercise=make(random[0]+i+1);
  const id=crypto.randomUUID();
  await db.prepare('INSERT INTO tasks (id,owner,learner,concept,payload,assisted,created,last_seen) VALUES (?,?,?,?,?,0,?,?)').bind(id,owner,learner.id,concept.id,JSON.stringify(exercise),new Date().toISOString(),new Date().toISOString()).run();
  const {answer,hint,explanation,...publicExercise}=exercise;
  return Response.json({id,...publicExercise});
 }
 const task=await db.prepare('SELECT * FROM tasks WHERE id=? AND owner=?').bind(clean(b.task,80),owner).first<any>();
 if(!task)throw new Error('Activity not found.');
 const exercise=JSON.parse(task.payload) as Exercise;
 if(b.action==='reflect'){
  const reflection=clean(b.reflection,1200);
  if(!reflection)throw new Error('Write a little about your thinking first.');
  const saved=await db.prepare('UPDATE attempts SET reflection=? WHERE id=? AND owner=?').bind(reflection,task.id,owner).run();
  if(!saved.meta.changes)throw new Error('Answer this activity before adding your thinking.');
  return Response.json({saved:true});
 }

 if(b.action==='hint'){
  await db.prepare('UPDATE tasks SET assisted=1,last_seen=? WHERE id=? AND owner=?').bind(new Date().toISOString(),task.id,owner).run();
  return Response.json({hint:exercise.hint});
 }
 if(b.action==='answer'){
  const response=clean(b.response,80);if(parseNumeric(response)===null)throw new Error('Enter a number or fraction such as 1/2.');
  if(exercise.game?.kind==='order'&&(!/^[1-4]{4}$/.test(response)||new Set(response).size!==4))throw new Error('Use each of the four tiles once.');
  if(exercise.game?.kind==='dial'){const n=parseNumeric(response)!;if(!Number.isInteger(n)||n<exercise.game.min!||n>exercise.game.max!)throw new Error('Choose a whole number within the dial range.');}
  const correct=isCorrect(response,exercise.answer)?1:0;
  const displayResponse=exercise.game?.kind==='order'?response.split('').map(n=>exercise.game!.tiles!.find(t=>t.id===Number(n))!.label).join(' → '):response;
  // Reading assistance inside the insert avoids scoring concurrent hint use as independent.
  await db.prepare('INSERT OR IGNORE INTO attempts (id,owner,learner,concept,format,interaction,response,correct,assisted,review,question,signature,created) SELECT id,owner,learner,concept,?,?,?,?,assisted,?,?,?,? FROM tasks WHERE id=? AND owner=?').bind(exercise.format,exercise.game?.kind||'number',displayResponse,correct,exercise.review?1:0,exercise.prompt,exerciseSignature(exercise),new Date().toISOString(),task.id,owner).run();
  await db.prepare('UPDATE tasks SET last_seen=? WHERE id=? AND owner=?').bind(new Date().toISOString(),task.id,owner).run();
  const attempt=await db.prepare('SELECT correct,assisted,response,interaction FROM attempts WHERE id=? AND owner=?').bind(task.id,owner).first<any>();
  return Response.json({correct:!!attempt.correct,assisted:!!attempt.assisted,response:attempt.response,interaction:attempt.interaction,explanation:exercise.explanation,answer:exercise.answer});
 }
 throw new Error('Unknown action.');
 }catch(e){return failure(e);}}
