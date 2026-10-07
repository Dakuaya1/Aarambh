export function identity(request: Request) {
 const id=request.headers.get('oai-authenticated-user-id');
 if(!id || !request.headers.get('oai-authenticated-user-email')) throw new Error('AUTH');
 return id;
}
export function clean(value:unknown,max=2000){return typeof value==='string'?value.trim().slice(0,max):'';}
export function gradeOf(value:unknown){const n=Number(value); if(!Number.isInteger(n)||n<1||n>10)throw new Error('Choose a class from 1 to 10.');return n;}
export async function body(request:Request){
 const origin=request.headers.get('origin');
 if(origin && origin!==new URL(request.url).origin)throw new Error('Cross-origin requests are not supported.');
 const raw=await request.text();if(raw.length>30000)throw new Error('This entry is too long.');
 try{return JSON.parse(raw);}catch{throw new Error('Please provide a valid request.');}
}
export function failure(error:unknown){
 const message=error instanceof Error?error.message:'';
 if(message==='AUTH')return Response.json({error:'Please sign in to open your workspace.'},{status:401});
 const safe=['Use each of the four tiles once.','Write a little about your thinking first.','Answer this activity before adding your thinking.','Choose a class from 1 to 10.','Cross-origin requests are not supported.','This entry is too long.','Please provide a valid request.','Learner not found.','Choose an available concept.','Choose an available activity format.','Activity not found.','Please enter a nickname.','Please enter an observation.','Please provide a title and a valid web link.','Please complete the draft fields.','Source not found.','Unknown action.','Enter a number or fraction such as 1/2.'];
 return Response.json({error:safe.includes(message)?message:'We couldn’t save that just now. Please try again.'},{status:safe.includes(message)?400:500});
}
