import {database} from '@/db/raw';
import {identity,body,clean,gradeOf,failure} from '@/lib/api';
import registry from '@/lib/source-registry.json';
import {concepts} from '@/lib/curriculum';
export async function GET(request:Request){try{
 const owner=identity(request),db=database();
 const tables=['learners','attempts','feedback','sources','reviews','drafts'];
 const results=await db.batch(tables.map(table=>db.prepare(`SELECT * FROM ${table} WHERE owner=? ORDER BY created DESC`).bind(owner)));
 const data=Object.fromEntries(tables.map((table,i)=>[table,results[i].results.map((row:any)=>{const {owner,...safe}=row;return safe;})]));
 return Response.json(data,{headers:{'Cache-Control':'no-store'}});
 }catch(e){return failure(e);}}
export async function POST(request:Request){try{
 const owner=identity(request),b=await body(request),db=database(),id=crypto.randomUUID(),created=new Date().toISOString();
 const learner=clean(b.learner,80);
 if(['feedback','deleteLearner'].includes(b.action)&&!await db.prepare('SELECT id FROM learners WHERE id=? AND owner=?').bind(learner,owner).first())throw new Error('Learner not found.');
 if(b.action==='createLearner'){
  const name=clean(b.name,40),grade=gradeOf(b.grade);if(!name)throw new Error('Please enter a nickname.');
  await db.prepare('INSERT INTO learners (id,owner,name,grade,created) VALUES (?,?,?,?,?)').bind(id,owner,name,grade,created).run();
 }else if(b.action==='feedback'){
  const observation=clean(b.observation);if(!observation)throw new Error('Please enter an observation.');
  const priority=concepts.some(c=>c.id===b.priority)?b.priority:'';
  const approach=['No preference','Try objects','Try a story','Try symbols'].includes(b.approach)?b.approach:'No preference';
  await db.prepare('INSERT INTO feedback (id,owner,learner,observation,approach,priority,created) VALUES (?,?,?,?,?,?,?)').bind(id,owner,learner,observation,approach,priority,created).run();
 }else if(b.action==='addSource'){
  const title=clean(b.title,160),url=clean(b.url,1600);let valid=false;try{valid=['http:','https:'].includes(new URL(url).protocol);}catch{}
  if(!title||!valid)throw new Error('Please provide a title and a valid web link.');
  const kind=['Textbook','Video','Teaching resource','Curriculum'].includes(b.kind)?b.kind:'Teaching resource';
  await db.prepare('INSERT INTO sources (id,owner,title,url,kind,created) VALUES (?,?,?,?,?,?)').bind(id,owner,title,url,kind,created).run();
 }else if(b.action==='review'){
  const source=clean(b.source,100);if(!registry.sources.some(s=>s.source_id===source)&&!await db.prepare('SELECT id FROM sources WHERE id=? AND owner=?').bind(source,owner).first())throw new Error('Source not found.');
  const status=['To review','Reviewing','Rights pending','Ready to extract','Excluded'].includes(b.status)?b.status:'To review';
  await db.prepare('INSERT INTO reviews (id,owner,source,status,note,created) VALUES (?,?,?,?,?,?)').bind(id,owner,source,status,clean(b.note),created).run();
 }else if(b.action==='draft'){
  const title=clean(b.title,160),grade=gradeOf(b.grade),concept=clean(b.concept,80),content=clean(b.content,16000),source=clean(b.source,1600);
  if(!title||!content||!source||!concepts.some(c=>c.id===concept))throw new Error('Please complete the draft fields.');
  await db.prepare('INSERT INTO drafts (id,owner,title,grade,concept,content,source,status,created) VALUES (?,?,?,?,?,?,?,?,?)').bind(id,owner,title,grade,concept,content,source,'Awaiting educator review',created).run();
 }else if(b.action==='deleteLearner'){
  await db.batch(['tasks','attempts','feedback'].map(t=>db.prepare(`DELETE FROM ${t} WHERE learner=? AND owner=?`).bind(learner,owner)).concat([db.prepare('DELETE FROM learners WHERE id=? AND owner=?').bind(learner,owner)]));
 }else throw new Error('Unknown action.');
 return Response.json({ok:true,id});
 }catch(e){return failure(e);}}
