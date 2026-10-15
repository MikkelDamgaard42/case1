import csv,re,json
from pathlib import Path
root=Path(__file__).parent
sql=(root/'starter-original.sql').read_text()
block=sql.split('insert into public.events',1)[1].split('values',1)[1].split('on conflict',1)[0]
fields=['id','title','summary','description','date','venueName','venueAddress','venuePostalCode','venueCity','venueWebsite','category','image','price']
rows=[]
for line in block.splitlines():
 line=line.strip()
 if not line.startswith('('):continue
 line=line.rstrip(',').strip()[1:-1]
 vals=next(csv.reader([line],delimiter=',',quotechar="'",skipinitialspace=True))
 assert len(vals)==len(fields),(len(vals),vals)
 e=dict(zip(fields,vals));e['id']=int(e['id']);e['price']=int(e['price']);e['venueWebsite']=None if e['venueWebsite']=='null' else e['venueWebsite'];e['createdAt']='2026-08-25T00:00:00+00:00';rows.append(e)
assert len(rows)==9 and rows[-1]['title']=='Søndagsjazz ved åen'
(root/'events-fixture.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2))
