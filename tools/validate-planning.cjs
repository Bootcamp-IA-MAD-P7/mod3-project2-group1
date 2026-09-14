// Valida únicamente documentación, grafo y el subconjunto JSON Schema usado por los fixtures.
// No implementa ni prueba funcionalidades del producto. No sustituye openspec validate.
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const failures=[];
const check=(ok,msg)=>{if(!ok)failures.push(msg)};
const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(p,e.name)):[path.join(p,e.name)]);
const files=walk(root);
let links=0, scenarios=0;
for(const file of files.filter(f=>f.endsWith('.md'))){
 const text=fs.readFileSync(file,'utf8');
 for(const m of text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)){
  const target=m[1].split('#')[0];
  if(!target||/^[a-z]+:/i.test(target))continue;
  links++;
  check(fs.existsSync(path.resolve(path.dirname(file),target)),`Enlace roto ${path.relative(root,file)} -> ${target}`);
 }
 if(file.endsWith(path.sep+'spec.md')){
  check(text.includes('## Purpose')&&text.includes('## ADDED Requirements'),`Formato spec ${file}`);
  const reqs=text.split('### Requirement: ').slice(1);
  for(const req of reqs){
   check(/\b(MUST|SHALL)\b/.test(req),`Normativo ausente ${req.split('\n')[0]}`);
   check(req.includes('#### Scenario:')&&req.includes('**WHEN**')&&req.includes('**THEN**'),`Scenario ausente ${req.split('\n')[0]}`);
   scenarios+=(req.match(/#### Scenario:/g)||[]).length;
  }
 }
}
const index=JSON.parse(read('docs/planning/plan-index.json'));
const byId=new Map(index.stories.map(s=>[s.id,s]));
const numberToId=n=>'US-'+String(n).padStart(2,'0');
const graph=new Map(index.stories.map(s=>[s.id,s.deps.map(numberToId)]));
for(const edge of index.closingDependencies)graph.get(edge.story).push(edge.requires);
const active=new Set(),done=new Set();
function visit(id){
 if(active.has(id)){failures.push('Ciclo: '+id);return;}
 if(done.has(id))return;
 check(byId.has(id),'Dependencia inexistente '+id);
 if(!byId.has(id))return;
 active.add(id);
 for(const d of graph.get(id))visit(d);
 active.delete(id);done.add(id);
}
for(const s of index.stories){
 visit(s.id);
 check(s.size!=='XL','Historia XL '+s.id);
 const text=read('docs/planning/stories/'+s.id+'.md');
 for(const h of ['User Story','Context','Scope','Out of Scope','Acceptance Criteria','Technical Notes','Testing','Dependencies','Definition of Done','Level','Labels','Size'])check(text.includes('## '+h),'Sección ausente '+s.id+' '+h);
 check((text.match(/- \[ \] AC\d:/g)||[]).length>=3,'AC incompletos '+s.id);
 check(index.domains.some(d=>d.id===s.domain),'Spec inexistente '+s.id);
 if(s.level==='essential')for(const d of graph.get(s.id))check(byId.get(d)?.level==='essential','Essential depende de superior '+s.id+' -> '+d);
}
for(const d of index.domains)for(const r of d.requirements){
 check(r.stories.length>0,'Requisito huérfano '+r.id);
 for(const id of r.stories)check(byId.has(id),'Referencia US inexistente '+r.id+' '+id);
}
const base='openspec/changes/define-project/contracts/';
const api=JSON.parse(read(base+'openapi.json'));
const resolve=r=>r.split('/').slice(1).reduce((v,k)=>v?.[k],api);
function refs(v){if(!v||typeof v!=='object')return; if(v.$ref)check(!!resolve(v.$ref),'$ref roto '+v.$ref);Object.values(v).forEach(refs)}refs(api);
function valid(v,s){
 if(s.$ref)return valid(v,resolve(s.$ref));
 if(s.anyOf&&!s.anyOf.some(t=>valid(v,t)))return false;
 if(s.allOf&&!s.allOf.every(t=>valid(v,t)))return false;
 if(s.if){const branch=valid(v,s.if)?s.then:s.else;if(branch&&!valid(v,branch))return false;}
 if(Object.hasOwn(s,'const')&&v!==s.const)return false;
 if(s.enum&&!s.enum.includes(v))return false;
 if(s.type==='null'&&v!==null)return false;
 if(s.type==='string'&&typeof v!=='string')return false;
 if(s.type==='number'&&(typeof v!=='number'||!Number.isFinite(v)))return false;
 if(s.type==='integer'&&!Number.isInteger(v))return false;
 if(s.type==='boolean'&&typeof v!=='boolean')return false;
 if(s.type==='object'&&(v===null||typeof v!=='object'||Array.isArray(v)))return false;
 if(s.type==='array'&&!Array.isArray(v))return false;
 if(typeof v==='string'){
  const len=[...v].length;
  if(s.minLength!==undefined&&len<s.minLength||s.maxLength!==undefined&&len>s.maxLength)return false;
  if(s.pattern&&!new RegExp(s.pattern,'u').test(v))return false;
  if(s.format==='uuid'&&!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v))return false;
  if(s.format==='date-time'&&(!/T.*(?:Z|[+-]\d\d:\d\d)$/.test(v)||!Number.isFinite(Date.parse(v))))return false;
  if(s.format==='uri'){try{new URL(v)}catch{return false}}
 }
 if(typeof v==='number'&&(s.minimum!==undefined&&v<s.minimum||s.maximum!==undefined&&v>s.maximum))return false;
 if(Array.isArray(v)){
  if(s.maxItems!==undefined&&v.length>s.maxItems)return false;
  if(s.items&&!v.every(item=>valid(item,s.items)))return false;
 }
 if(v!==null&&typeof v==='object'&&!Array.isArray(v)){
  if(s.required?.some(k=>!Object.hasOwn(v,k)))return false;
  if(s.additionalProperties===false&&Object.keys(v).some(k=>!Object.hasOwn(s.properties||{},k)))return false;
  for(const [k,p] of Object.entries(s.properties||{}))if(Object.hasOwn(v,k)&&!valid(v[k],p))return false;
 }
 return true;
}
const fixtures=JSON.parse(read(base+'fixtures.json'));
for(const f of fixtures)check(valid(f.value,api.components.schemas[f.schema]),'Fixture inválido '+f.name);
const request=api.components.schemas.PredictionRequest;
for(const v of [{text:''},{text:'  \n\t'},{text:42},{text:'x',unknown:true},{text:'x'.repeat(5001)}])check(!valid(v,request),'Request inválida aceptada '+JSON.stringify(v).slice(0,70));
check(valid({text:'😀'.repeat(5000)},request),'Límite Unicode erróneo');
const pred=fixtures.find(f=>f.schema==='Prediction').value;
check(!valid({...pred,score:.5},api.components.schemas.Prediction),'score/score_kind incoherente aceptado');
const summary={status:failures.length?'FAIL':'PASS',files:files.length,links,stories:index.stories.length,specs:index.domains.length,requirements:index.domains.reduce((n,d)=>n+d.requirements.length,0),scenarios,fixtures:fixtures.length,cycles:failures.filter(f=>f.startsWith('Ciclo')).length,failures};
console.log(JSON.stringify(summary,null,2));
process.exitCode=failures.length?1:0;
