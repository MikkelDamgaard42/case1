import fs from 'node:fs';import path from 'node:path';import {spawn} from 'node:child_process';
const root=path.dirname(new URL(import.meta.url).pathname);const out=path.join(root,'reports');fs.mkdirSync(out,{recursive:true});
const base='http://127.0.0.1:5270';const cli='/tmp/portfolio-lighthouse/node_modules/lighthouse/cli/index.js';
const plan=[1,2,3].map(round=>({round,page:'event-9',version:'fixed'}));
fs.writeFileSync(path.join(root,'run-plan.json'),JSON.stringify(plan,null,2));
for(const run of plan){
 const changed=await fetch(base+'/__version',{method:'PUT',body:run.version});if(!changed.ok)throw Error('Version switch failed');
 const url=base+'/case1/'+(run.page==='home'?'':'events/9');
 const html=await fetch(url);if(html.status!==200)throw Error('Document status');
 const api=await fetch(base+'/api/events'+(run.version!=='baseline'?'?select=id,title,summary,description,date,category,image,price,venue:venues(name,address,postalCode,city,website)':'')+(run.page==='event-9'?(run.version!=='baseline'?'&':'?')+'id=eq.9':''));
 const data=await api.json();if(data.length!==(run.page==='home'?9:1))throw Error('Fixture count');
 if(run.page==='event-9'&&data[0].title!=='Søndagsjazz ved åen')throw Error('Wrong event');
 const prefix=path.join(out,`${run.version}-${run.page}-${run.round}`);
 const args=[cli,url,'--chrome-path=/Applications/Google Chrome.app/Contents/MacOS/Google Chrome','--chrome-flags=--headless=new --disable-extensions --no-first-run','--form-factor=mobile','--throttling-method=simulate','--only-categories=performance,accessibility,best-practices,seo','--output=html','--output=json',`--output-path=${prefix}`,'--save-assets','--quiet'];
 const start=new Date().toISOString();
 const result=await new Promise(resolve=>{const p=spawn(process.execPath,args,{stdio:['ignore','pipe','pipe']});let log='';p.stdout.on('data',d=>log+=d);p.stderr.on('data',d=>log+=d);p.on('close',code=>resolve({code,log}));});
 fs.writeFileSync(prefix+'.cli.log',result.log);
 if(result.code!==0)throw Error(`${JSON.stringify(run)} failed: ${result.log}`);
 const r=JSON.parse(fs.readFileSync(prefix+'.report.json','utf8'));
 if(r.runtimeError)throw Error(JSON.stringify(r.runtimeError));
 const network=r.audits['network-requests'].details.items;
 const dataRequests=network.filter(x=>x.url.startsWith(base+'/api/events'));
 if(!dataRequests.length||dataRequests.some(x=>x.statusCode!==200))throw Error('API missing/failed');
 const metrics={...run,start,fetchTime:r.fetchTime,url,performance:r.categories.performance.score*100,accessibility:r.categories.accessibility.score*100,bestPractices:r.categories['best-practices'].score*100,seo:r.categories.seo.score*100,LCP:r.audits['largest-contentful-paint'].numericValue,CLS:r.audits['cumulative-layout-shift'].numericValue,TBT:r.audits['total-blocking-time'].numericValue,warnings:r.runWarnings,report:path.basename(prefix)+'.report.html'};
 fs.appendFileSync(path.join(root,'results.jsonl'),JSON.stringify(metrics)+'\n');console.log(JSON.stringify(metrics));
}
console.log('All 3 CLS-fix measurements completed.');
