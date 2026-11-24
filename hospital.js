
'use strict';
// The cutaway is built from world-space 3D primitives, projected into SVG.
// No third-party library, external asset, real hospital map or clinical connection.
const hospitalZones=[
{id:'server',name:'Server room',short:'Server room',color:'#c3d7ef',x:0,y:0,w:5,h:4,desc:'Integration services, storage and connectivity in a fictional infrastructure zone.',modules:['architecture','association','ack','reconcile','security']},
{id:'imaging',name:'Imaging department',short:'Imaging',color:'#b9e3dc',x:6,y:0,w:5,h:4,desc:'Modality worklists, acquisition, DICOM metadata and image transfer.',modules:['workflow','worklist','dicom','association','reconcile']},
{id:'clinic',name:'Consultation rooms',short:'Consultation',color:'#f1dcb8',x:0,y:5,w:5,h:4,desc:'Order entry, clinical messaging, study review and patient-centred workflows.',modules:['hl7','fhir','workflow','process','knowledge']},
{id:'noc',name:'IT operations centre',short:'IT operations',color:'#d9cdec',x:6,y:5,w:5,h:4,desc:'Monitoring, incident coordination, capacity planning and security governance.',modules:['operations','capacity','incident','risk','troubleshoot','security']}
];
const hospitalState={room:'imaging',angle:45,zoom:1,plan:false};
function zoneById(id){return hospitalZones.find(z=>z.id===id)||hospitalZones[1]}
function hospitalProject(x,y,z,angle=45,plan=false){
 const a=angle*Math.PI/180, X=x-5.5,Y=y-4.5;
 return [340+(X*Math.cos(a)-Y*Math.sin(a))*43,222+(X*Math.sin(a)+Y*Math.cos(a))*(plan?43:22)-z*(plan?0:43)];
}
function hospitalScene(state){
 const {angle,plan,room}=state,p=(x,y,z)=>hospitalProject(x,y,z,angle,plan);
 const a=angle*Math.PI/180,depth=(x,y)=>x*Math.sin(a)+y*Math.cos(a);
 const poly=(points,fill,stroke='#8499ae',extra='')=>'<polygon points="'+points.map(v=>p(...v).map(n=>n.toFixed(2)).join(',')).join(' ')+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="1" stroke-linejoin="round" '+extra+'/>';
 const floor=(x,y,w,h,z=0)=>[[x,y,z],[x+w,y,z],[x+w,y+h,z],[x,y+h,z]];
 const objects=[];
 function box(x,y,w,h,z,ht,c,id){
  if(plan){objects.push({d:depth(x+w/2,y+h/2),s:poly(floor(x,y,w,h,z+ht),c[0],'#8298ad','data-room="'+id+'"')});return;}
  const top=floor(x,y,w,h,z+ht),bot=floor(x,y,w,h,z);
  const faces=[{idx:[0,1],color:c[1]},{idx:[1,2],color:c[2]},{idx:[2,3],color:c[1]},{idx:[3,0],color:c[2]}];
  const sides=faces.filter(f=>{const [i,j]=f.idx;return (depth(bot[i][0],bot[i][1])+depth(bot[j][0],bot[j][1]))/2>depth(x+w/2,y+h/2)+1e-7}).sort((f,g)=>depth(bot[f.idx[0]][0],bot[f.idx[0]][1])-depth(bot[g.idx[0]][0],bot[g.idx[0]][1]));
  const attr='data-room="'+id+'"';
  objects.push({d:depth(x+w/2,y+h/2),s:sides.map(f=>{const[i,j]=f.idx;return poly([bot[i],bot[j],top[j],top[i]],f.color,'#8195a9',attr)}).join('')+poly(top,c[0],'#8195a9',attr)});
 }
 const white=['#ffffff','#cbd9e6','#afc3d5'],desk=['#f9fafc','#b9ccd9','#a7bccf'],screen=['#416c91','#2d5479','#234764'],rack=['#526e86','#344e65','#253b50'],teal=['#d6f4ee','#83bcb4','#5eaaa0'],bed=['#f8fcff','#d3dfe9','#b7cbd9'],chair=['#8eb5d7','#6c94b8','#547da2'];
 let s='<svg viewBox="0 0 680 420" xmlns="http://www.w3.org/2000/svg" aria-label="Interactive cutaway hospital model" role="group"><defs><pattern id="floorTiles" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#a0b7ca" stroke-opacity=".17"/></pattern></defs>';
 if(!plan){const base=floor(-.35,-.35,11.7,9.7,-.35),top=floor(-.35,-.35,11.7,9.7,0);s+=poly(base,'#b3c6d8','#a0b5c9');for(let i=0;i<4;i++)s+=poly([base[i],base[(i+1)%4],top[(i+1)%4],top[i]],'#bdcfdf','#a0b5c9');s+=poly(top,'#edf3f8','#a0b5c9');}
 else s+=poly(floor(-.35,-.35,11.7,9.7),'#eef3f7');
 s+=poly(floor(5,0,1,9),'#f7fafc','#d5e0e9')+poly(floor(0,4,11,1),'#f7fafc','#d5e0e9');
 for(const r of hospitalZones){
  s+=poly(floor(r.x,r.y,r.w,r.h),r.color,'#91a9bf','class="room-hit'+(r.id===room?' selected':'')+'" data-room="'+r.id+'"');
  // Low perimeter walls on the rear-facing sides, leaving the cutaway open.
  if(!plan){
   if(Math.sin(a)>0)box(r.x,r.y,.12,r.h,0,.55,white,r.id);else box(r.x+r.w-.12,r.y,.12,r.h,0,.55,white,r.id);
   if(Math.cos(a)>0)box(r.x,r.y,r.w,.12,0,.55,white,r.id);else box(r.x,r.y+r.h-.12,r.w,.12,0,.55,white,r.id);
  }
 }
 // Server racks: compact rows with equipment indicator strips.
 for(let i=0;i<3;i++){let x=.55+i*1.35;box(x,.65,.78,1.25,0,1.65,rack,'server');box(x+.1,.78,.58,.14,1.65,.06,teal,'server')}
 box(.65,2.65,2.1,.75,0,.7,desk,'server');box(1.05,2.8,.75,.22,.7,.45,screen,'server');
 // Imaging: scanner gantry, patient couch, OCT-style console.
 box(7.2,.7,2.6,.85,0,1.35,white,'imaging');box(7.55,1.55,1.9,1.45,0,.42,bed,'imaging');box(7.95,1.6,1.1,1.7,.42,.17,teal,'imaging');
 box(9.55,2.7,1,.7,0,.7,desk,'imaging');box(9.7,2.85,.65,.15,.7,.42,screen,'imaging');box(6.4,2.65,.65,.75,0,.45,chair,'imaging');
 // Consultation: two simplified consultation stations.
 for(let i=0;i<2;i++){let x=.45+i*2.35;box(x,5.6,1.55,.65,0,.72,desk,'clinic');box(x+.2,5.8,.6,.16,.72,.42,screen,'clinic');box(x+.5,6.55,.65,.65,0,.48,chair,'clinic');box(x,7.65,1.7,.75,0,.48,bed,'clinic')}
 // Operations centre: wall display and monitoring desks.
 for(let i=0;i<3;i++)box(6.45+i*1.43,5.3,1.15,.2,.65,1.0,screen,'noc');
 for(let i=0;i<2;i++){let x=6.55+i*2.2;box(x,6.65,1.65,.72,0,.7,desk,'noc');box(x+.15,6.8,.62,.18,.7,.45,screen,'noc');box(x+.9,6.8,.52,.18,.7,.45,screen,'noc');box(x+.5,7.75,.72,.65,0,.48,chair,'noc')}
 s+=objects.sort((a,b)=>a.d-b.d).map(o=>o.s).join('');
 // Draw room name plates after geometry; hit-testing stays on the room surfaces.
 for(const r of hospitalZones){const [x,y]=p(r.x+r.w/2,r.y+r.h*.63,plan?0:1.9),w=r.short.length*6.7+20;
 s+='<g class="room-pin"><rect x="'+(x-w/2)+'" y="'+(y-12)+'" width="'+w+'" height="24" rx="7" fill="'+(r.id===room?'#155ea6':'#ffffff')+'" stroke="'+(r.id===room?'#155ea6':'#b9cadb')+'"/><text x="'+x+'" y="'+(y+4)+'" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" font-weight="650" fill="'+(r.id===room?'white':'#203e5e')+'">'+esc(r.short)+'</text></g>';
 }
 s+='</svg>';return s;
}
function hospitalMarkup(){return '<section class="hospital-card"><div class="hospital-head"><div><div class="tag">Interactive campus / 01</div><h2>Explore the hospital</h2><p>Choose a room to reveal its systems and practical exercises.</p></div><div class="hospital-controls" aria-label="Camera controls"><button data-camera="left" aria-label="Rotate left">↶ Rotate</button><button data-camera="right" aria-label="Rotate right">Rotate ↷</button><button data-camera="out" aria-label="Zoom out">−</button><button data-camera="in" aria-label="Zoom in">+</button><button data-camera="plan" aria-pressed="false">Floor plan</button><button data-camera="reset">Reset</button></div></div><div class="hospital-body"><div class="hospital-viewport" aria-label="Hospital model"></div><div class="hospital-details"><div class="zone-picker" aria-label="Hospital departments">'+hospitalZones.map(r=>'<button data-zone="'+r.id+'" aria-pressed="false"><span class="zone-dot" style="background:'+r.color+'"></span>'+esc(r.short)+'</button>').join('')+'</div><div class="room-info" aria-live="polite"></div></div></div><div class="hospital-legend">Fictional educational cutaway · 4 departments · 3D-projected geometry · No real hospital layout or patient data</div></section>'}
function mountHospital(root){
 const viewport=root.querySelector('.hospital-viewport'),info=root.querySelector('.room-info');
 function draw(){
  viewport.innerHTML=hospitalScene(hospitalState);
  const svg=viewport.querySelector('svg'),z=hospitalState.zoom;
  svg.setAttribute('viewBox',[(680-680/z)/2,(420-420/z)/2,680/z,420/z].join(' '));
  root.querySelector('[data-camera="plan"]').setAttribute('aria-pressed',String(hospitalState.plan));
  root.querySelector('[data-camera="plan"]').textContent=hospitalState.plan?'3D view':'Floor plan';
  root.querySelectorAll('[data-zone]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.zone===hospitalState.room)));
  const r=zoneById(hospitalState.room);
  info.innerHTML='<div class="tag">Selected department</div><h3>'+esc(r.name)+'</h3><p class="muted">'+esc(r.desc)+'</p><div class="zone-links">'+r.modules.map(id=>{const m=modules.find(m=>m[0]===id);return '<button data-room-module="'+id+'"><span class="module-number">'+moduleNumber(id)+'</span>'+esc(m[1])+'<span class="arrow" aria-hidden="true">→</span></button>'}).join('')+'</div>';
  info.querySelectorAll('[data-room-module]').forEach(b=>b.onclick=()=>navigate(b.dataset.roomModule));
 }
 function choose(id){if(hospitalZones.some(r=>r.id===id)){hospitalState.room=id;draw()}}
 viewport.onclick=e=>{const hit=e.target.closest('[data-room]');if(hit)choose(hit.dataset.room)};
 root.querySelectorAll('[data-zone]').forEach(b=>b.onclick=()=>choose(b.dataset.zone));
 root.querySelectorAll('[data-camera]').forEach(b=>b.onclick=()=>{
  switch(b.dataset.camera){case'left':hospitalState.angle=(hospitalState.angle+315)%360;break;case'right':hospitalState.angle=(hospitalState.angle+45)%360;break;case'in':hospitalState.zoom=Math.min(1.8,hospitalState.zoom+.15);break;case'out':hospitalState.zoom=Math.max(.75,hospitalState.zoom-.15);break;case'plan':hospitalState.plan=!hospitalState.plan;break;case'reset':hospitalState.angle=45;hospitalState.zoom=1;hospitalState.plan=false;break;}draw();
 });
 draw();
}
const coreDescriptions={
workflow:'Follow a clinical order from EHR through imaging and archive retrieval.',
hl7:'Inspect clinical messages, identifiers and basic validation.',
dicom:'Explore imaging metadata, UIDs and study hierarchy.',
troubleshoot:'Investigate eight simulated technical incidents.',
security:'Review medical device security and lifecycle controls.',
operations:'Inspect session outcomes and example service indicators.',
process:'Model workflow delay and improvement priorities.'
};
const moduleDescription=id=>coreDescriptions[id]||extras.find(x=>x[0]===id)?.[3]||'';
const previousArchitecture=advancedViews.architecture;
advancedViews.architecture=function(){
 previousArchitecture();
 const node=document.createElement('div');node.className='arch-hospital';node.innerHTML=hospitalMarkup();
 const target=$('view').querySelector('.grid.section');
 if(target)target.before(node);else $('view').append(node);
 mountHospital(node);
};
overview=function(){
 const completed=Object.keys(labScores).length;
 $('view').innerHTML='<header class="bento-head"><div><div class="eyebrow">Independent professional portfolio</div><h1>Healthcare IT &amp;<br>Medical Systems.</h1><p>Explore clinical interoperability, imaging systems and resilient hospital operations through a fictional interactive environment.</p></div><div class="version-mark">CLINICAL EDITION / V3.0</div></header>'+
 '<div class="bento"><section class="bento-card bento-intro"><div><div class="tag">Systems engineering · Marco Brandt</div><h2>See the whole clinical workflow.</h2><p>From order entry to image availability, discover how clinical systems depend on integrations, medical devices and reliable infrastructure.</p></div><div class="row"><button class="primary" data-home-go="workflow">Start imaging simulation →</button><button data-home-go="architecture">System architecture</button></div></section>'+
 '<section class="bento-card bento-stats"><div class="bento-stat"><strong>18</strong><span>Numbered modules</span></div><div class="bento-stat"><strong>04</strong><span>Hospital departments</span></div><div class="bento-stat"><strong>08</strong><span>Troubleshooting cases</span></div><div class="bento-stat"><strong>'+completed+'/10</strong><span>Advanced labs explored / completed</span></div></section>'+
 '<div class="bento-card bento-map">'+hospitalMarkup()+'</div><div class="bento-foot"><section class="bento-card"><div class="tag">Technical scope</div><h2>Interoperability in practice</h2><p>HL7 v2 · DICOM · FHIR R4 · PACS · MWL</p><button data-home-go="knowledge">Browse technical references →</button></section><section class="bento-card"><div class="tag">Operational resilience</div><h2>From fault to recovery</h2><p>Practise incident coordination, risk prioritisation, and study reconciliation.</p><button data-home-go="incident">Open incident command →</button></section></div></div>'+
 '<section class="section"><div class="catalog-head"><h2>All learning modules</h2><input id="catalogSearch" type="search" aria-label="Search modules" placeholder="Search modules or protocols…"></div><div class="catalog-grid" id="moduleCatalog"></div></section>'+
 '<section class="panel section"><h2>About this portfolio</h2><p>Created by Marco Brandt, a software specialist working with healthcare information systems. This independent educational lab demonstrates integration fundamentals, systems thinking and operational risk management. All systems, records and endpoints are fictional; no real hospital layout or production architecture is represented.</p><p><a href="https://www.dicomstandard.org/current">DICOM standard</a> · <a href="https://www.hl7.org/implement/standards/">HL7 standards</a> · <a href="https://hl7.org/fhir/R4/">FHIR R4</a> · <a href="https://github.com/MarcoBrandt/Healthcare-IT-Lab">Source repository</a></p></section>';
 const root=$('view');mountHospital(root.querySelector('.bento-map'));
 root.querySelectorAll('[data-home-go]').forEach(b=>b.onclick=()=>navigate(b.dataset.homeGo));
 function catalog(){let q=$('catalogSearch').value.trim().toLowerCase();$('moduleCatalog').innerHTML=modules.filter(([id,n])=>id!=='overview'&&(moduleNumber(id)+' '+n+' '+moduleDescription(id)).toLowerCase().includes(q)).map(([id,n])=>'<article class="catalog-item"><div class="tag">Module '+moduleNumber(id)+(labScores[id]?' · Explored':'')+'</div><h3>'+esc(n)+'</h3><p>'+esc(moduleDescription(id))+'</p><button data-catalog="'+id+'">Open module →</button></article>').join('')||'<p>No matching modules.</p>';$('moduleCatalog').querySelectorAll('[data-catalog]').forEach(b=>b.onclick=()=>navigate(b.dataset.catalog))}
 $('catalogSearch').oninput=catalog;catalog();
};
const oldTests=window.healthcareLabSelfTest;
window.healthcareLabSelfTest=function(){return [...oldTests(),...[
 ['Four fictional hospital zones',hospitalZones.length===4&&new Set(hospitalZones.map(z=>z.id)).size===4],
 ['All room links resolve',hospitalZones.every(z=>z.modules.every(id=>modules.some(m=>m[0]===id)))],
 ['Every exercise assigned to a room',modules.filter(m=>m[0]!=='overview').every(m=>hospitalZones.some(z=>z.modules.includes(m[0])))],
 ['3D height changes projection',hospitalProject(0,0,0)[1]!==hospitalProject(0,0,1)[1]],
 ['Camera rotation changes projection',hospitalProject(0,0,0,45)[0]!==hospitalProject(0,0,0,90)[0]],
 ['Plan removes vertical projection',hospitalProject(0,0,0,45,true)[1]===hospitalProject(0,0,1,45,true)[1]],
 ['All scene views produce valid numeric coordinates',[0,45,90,135,180,225,270,315].every(angle=>[false,true].every(plan=>{const s=hospitalScene({...hospitalState,angle,plan});return s.includes('</svg>')&&!/NaN|Infinity/.test(s)&&hospitalZones.every(z=>s.includes('data-room="'+z.id+'"'))}))]
 ].map(([name,pass])=>({name,pass}))]};
