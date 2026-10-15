from pathlib import Path
from statistics import median
from datetime import datetime
from zoneinfo import ZoneInfo
import json,csv,hashlib,subprocess,zipfile
root=Path(__file__).parent
runs=[json.loads(l) for l in (root/'results.jsonl').read_text().splitlines()]
assert len(runs)==12,len(runs)
metrics=['performance','LCP','CLS','TBT','accessibility','bestPractices','seo']
summary={}
for page in ['home','event-9']:
 summary[page]={}
 for version in ['baseline','final']:
  group=[r for r in runs if r['page']==page and r['version']==version];assert len(group)==3
  summary[page][version]={k:median(r[k] for r in group) for k in metrics}
 summary[page]['deltaFinalMinusBaseline']={k:summary[page]['final'][k]-summary[page]['baseline'][k] for k in metrics}
network=[]
for run in runs:
 prefix=f"{run['version']}-{run['page']}-{run['round']}"
 report=json.loads((root/'reports'/(prefix+'.report.json')).read_text());assert not report.get('runtimeError')
 items=report['audits']['network-requests']['details']['items'];errors=[i for i in items if i.get('statusCode',200)>=400 or i.get('failed')]
 assert not errors,(prefix,errors)
 network.append({'run':prefix,'images':[{'url':i['url'],'status':i.get('statusCode'),'resourceSize':i.get('resourceSize'),'transferSize':i.get('transferSize')} for i in items if i.get('resourceType')=='Image']})
settings=[json.loads(p.read_text())['configSettings'] for p in (root/'reports').glob('*.report.json')]
for s in settings[1:]:assert s==settings[0],'Settings differ'
(root/'effective-settings.json').write_text(json.dumps(settings[0],indent=2))
(root/'summary.json').write_text(json.dumps(summary,indent=2))
(root/'network-images.json').write_text(json.dumps(network,indent=2))
with (root/'runs.csv').open('w') as f:
 w=csv.DictWriter(f,fieldnames=['version','page','round','fetchTime','performance','LCP','CLS','TBT','accessibility','bestPractices','seo','url']);w.writeheader();w.writerows({k:r[k] for k in w.fieldnames} for r in runs)
repo=Path('/Users/mikkel/Documents/case1');before=json.loads((root/'existing-checkout-before.json').read_text());after={'head':subprocess.check_output(['git','rev-parse','HEAD'],cwd=repo,text=True).strip(),'status':subprocess.check_output(['git','status','--porcelain=v1'],cwd=repo,text=True),'files':{n:hashlib.sha256((repo/n).read_bytes()).hexdigest() for n in before['files']}}
assert before==after,'Existing checkout changed'
for version in ['baseline','final']:assert not subprocess.check_output(['git','status','--porcelain=v1'],cwd=root/version,text=True)
(root/'preservation-check.json').write_text(json.dumps({'existingCheckoutUnchanged':True,'head':after['head'],'status':after['status'],'trackedFilesCompared':len(after['files']),'isolatedWorktreesClean':True},indent=2))
print(json.dumps(summary,indent=2))
print('Period',min(r['fetchTime'] for r in runs),max(r['fetchTime'] for r in runs))
print('Preservation check passed')
