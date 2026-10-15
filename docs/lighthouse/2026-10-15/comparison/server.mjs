import http from 'node:http';import fs from 'node:fs';import path from 'node:path';import zlib from 'node:zlib';import crypto from 'node:crypto';
const root=path.dirname(new URL(import.meta.url).pathname);const events=JSON.parse(fs.readFileSync(path.join(root,'events-fixture.json')));let version='baseline';
const types={'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.webp':'image/webp','.svg':'image/svg+xml','.png':'image/png'};
const log=(x)=>fs.appendFileSync(path.join(root,'server-requests.jsonl'),JSON.stringify({time:new Date().toISOString(),version,...x})+'\n');
const server=http.createServer(async(req,res)=>{
 const u=new URL(req.url,'http://127.0.0.1:5270');
 if(u.pathname==='/__version'&&req.method==='PUT'){
  let b='';for await(const c of req)b+=c; if(!['baseline','final'].includes(b)){res.writeHead(400);return res.end();}version=b;return res.end(version);
 }
 if(req.method!=='GET'){res.writeHead(405);return res.end('Read-only measurement server');}
 if(u.pathname==='/api/events'){
  let data=events.filter(e=>!u.searchParams.has('id')||String(e.id)===u.searchParams.get('id').replace('eq.',''));
  const select=u.searchParams.get('select');
  if(select){const fields=select.split(',venue:')[0].split(',');const venueFields=select.match(/venue:venues\(([^)]+)\)/)[1].split(',');
   data=data.map(e=>({...Object.fromEntries(fields.map(f=>[f,e[f]])),venue:Object.fromEntries(venueFields.map(f=>[f,e['venue'+f[0].toUpperCase()+f.slice(1)]]))}));
  }
  await new Promise(r=>setTimeout(r,100));const body=JSON.stringify(data);res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(body);log({method:req.method,url:req.url,status:200,count:data.length,bytes:Buffer.byteLength(body),bodySha256:crypto.createHash('sha256').update(body).digest('hex')});return;
 }
 if(!u.pathname.startsWith('/case1/')){res.writeHead(404);return res.end();}
 let file=path.join(root,version,'dist',decodeURIComponent(u.pathname.slice('/case1/'.length)));
 if(!fs.existsSync(file)||!fs.statSync(file).isFile())file=path.join(root,version,'dist/index.html');
 let body=fs.readFileSync(file);const headers={'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'};
 if(/\.(html|js|css|svg)$/.test(file)&&req.headers['accept-encoding']?.includes('gzip')){body=zlib.gzipSync(body);headers['Content-Encoding']='gzip';}
 res.writeHead(200,headers);res.end(body);log({method:req.method,url:req.url,status:200,bytes:body.length});
});
server.listen(5270,'127.0.0.1',()=>console.log('Read-only comparison production server on http://127.0.0.1:5270/case1/'));
