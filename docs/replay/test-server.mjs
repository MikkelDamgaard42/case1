import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const {PGlite}=await import(process.env.PGLITE_MODULE);
import {appendFile} from 'node:fs/promises';
import http from 'node:http';
const root=fileURLToPath(new URL('../../',import.meta.url));
const db=new PGlite();await db.exec('create role anon;');await db.exec(execFileSync('git',['show','f25fde8:supabase/starter.sql'],{cwd:root,encoding:'utf8'}));
let control={mode:'normal',delay:0};
const log=async row=>appendFile(root+'/docs/replay/evidence/network.jsonl',JSON.stringify({time:new Date().toISOString(),...row})+'\n');
http.createServer(async(req,res)=>{
res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Access-Control-Allow-Headers','apikey,content-type');res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');
if(req.method==='OPTIONS'){res.writeHead(204);return res.end();}
let body='';for await(const part of req)body+=part;
const u=new URL(req.url,'http://127.0.0.1:5191');
try{
 if(u.pathname==='/__control'){control=JSON.parse(body);return res.end(JSON.stringify(control));}
 if(u.pathname==='/__sql'){const results=await db.exec(body);return res.end(JSON.stringify(results));}
 const mode={...control};if(mode.delay)await new Promise(r=>setTimeout(r,mode.delay));
 if(mode.mode==='fail'||(mode.mode==='post-fail'&&req.method==='POST')){await log({method:req.method,path:u.pathname,status:503});res.writeHead(503);return res.end(JSON.stringify({message:'Controlled test failure'}));}
 if(mode.mode==='empty'&&req.method==='GET'){res.setHeader('Content-Type','application/json');return res.end('[]');}
 let data;
 if(req.method==='POST'&&u.pathname==='/registrations'){
 const b=JSON.parse(body);data=await db.query('insert into registrations (name,email,status,"eventId") values ($1,$2,$3,$4) returning id,"eventId"',[b.name,b.email,b.status,b.eventId]);
 await log({method:'POST',path:u.pathname,status:201,eventId:b.eventId,id:data.rows[0].id});res.writeHead(201);return res.end();
 }
 if(u.pathname==='/events'){
 const select=u.searchParams.get('select')||'';let sql=select.includes('venue:')?'select e.*,row_to_json(v) as venue from events e left join venues v on v.id=e."venueId"':'select * from events e';const args=[];
 if(u.searchParams.has('id')){sql+=' where e.id=$1';args.push(u.searchParams.get('id').replace('eq.',''));}
 sql+=' order by e.date';data=await db.query(sql,args);
 }else if(u.pathname==='/registrations'){
 data=await db.query(u.searchParams.get('select')?.includes('event:')?'select r.*,json_build_object(\'title\',e.title,\'date\',e.date) as event from registrations r left join events e on e.id=r."eventId" order by r."createdAt" desc':'select * from registrations order by "createdAt" desc');
 }else{res.writeHead(404);return res.end();}
 await log({method:'GET',path:req.url,status:200,count:data.rows.length});res.setHeader('Content-Type','application/json');res.end(JSON.stringify(data.rows));
}catch(e){await log({method:req.method,path:req.url,status:400,error:e.message});res.writeHead(400);res.end(JSON.stringify({message:e.message}));}
}).listen(5191,'127.0.0.1',()=>console.log('Isolated PostgreSQL test adapter on 5191'));
