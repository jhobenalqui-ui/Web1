import {$,$$,esc,toast} from '../../core/dom.js';
import {getState,setState} from '../../core/store.js';
import {authService} from '../../services/auth.service.js';
import {documentsService} from '../../services/documents.service.js';
import {contentService} from '../../services/content.service.js';

const empty=t=>`<div class="empty">${t}</div>`;
const head=(t,s)=>`<h2 class="sec-h">${t}</h2><p class="small">${s}</p>`;
const TABS=[['admin','Resumen'],['admin-users','Usuarias'],['admin-docs','Documentos'],['admin-content','Eventos y cursos']];
const tabs=cur=>`<div class="chips">${TABS.map(([k,l])=>`<button class="chip ${k===cur?'on':''}" data-go="${k}">${l}</button>`).join('')}</div>`;
const gate=(cur,f)=>s=>s.user.role!=='admin'?empty('Solo las administradoras pueden ver esta sección.'):tabs(cur)+f(s);
const stat=(n,l)=>`<div class="stat"><b>${n}</b><span>${l}</span></div>`;
const n=x=>x.toLocaleString('es-PE');
const mini=(a,f)=>a.map(f).join('');

const urow=(u,me)=>`<div class="card2 urow" data-q="${esc((u.name+u.username+u.email).toLowerCase())}"><div class="ucard"><div class="avatar">${esc(u.name[0])}</div><div class="n"><b>${esc(u.name)}</b>${u.id===me?' <span class="small">(tú)</span>':''}${u.role==='admin'?' <span class="tag">Admin</span>':''}${u.suspended?' <span class="tag off">Suspendida</span>':''}<div class="small">@${esc(u.username)} · ${esc(u.email)} · ${esc(u.rub)}</div></div></div>
<div class="acts"><button class="chip" data-open="${u.id}">Ver página</button><button class="chip ${u.featured?'on':''}" data-feat="${u.id}">Usuaria destacada</button><button class="chip ${u.bizFeatured?'on':''}" data-biz="${u.id}">Emprendimiento destacado</button>${u.id===me?'':`<button class="chip" data-role="${u.id}">${u.role==='admin'?'Quitar admin':'Hacer admin'}</button><button class="chip" data-susp="${u.id}">${u.suspended?'Reactivar':'Suspender'}</button><button class="chip danger" data-deluser="${u.id}">Eliminar</button>`}</div></div>`;
const item=(t,sub,attr,id,lbl)=>`<div class="card2 ucard"><div class="n"><b>${esc(t)}</b><div class="small">${esc(sub)}</div></div><button class="chip danger" ${attr}="${id}">${lbl}</button></div>`;

export const ADMIN_ROUTES={
  admin:gate('admin',s=>{
    const dl=s.docs.reduce((a,d)=>a+d.dl,0);
    return head('Panel de administración','Resumen de la comunidad.')+`<div class="stats">${stat(s.users.length,'Usuarias')}${stat(s.users.filter(u=>u.role==='admin').length,'Administradoras')}${stat(s.users.filter(u=>u.suspended).length,'Suspendidas')}${stat(s.docs.length,'Documentos')}${stat(n(dl),'Descargas')}${stat(s.users.filter(u=>u.featured).length,'Usuarias destacadas')}${stat(s.users.filter(u=>u.bizFeatured).length,'Emprend. destacados')}${stat(s.events.length+s.courses.length,'Eventos y cursos')}</div>
<div class="card2"><h3>Últimas registradas</h3>${mini([...s.users].sort((a,b)=>b.id-a.id).slice(0,5),u=>`<div class="row"><div class="n"><b>${esc(u.name)}</b> <span class="small">@${esc(u.username)}</span></div><span class="small">${esc(u.rub)}</span></div>`)}</div>
<div class="card2"><h3>Documentos más descargados</h3>${mini([...s.docs].sort((a,b)=>b.dl-a.dl).slice(0,3),d=>`<div class="row"><div class="n">${esc(d.t)}</div><span class="small">${n(d.dl)}</span></div>`)}</div>`}),
  'admin-users':gate('admin-users',s=>head('Gestionar usuarias',`${s.users.length} cuentas registradas.`)+`<input id="au-q" type="search" placeholder="Buscar por nombre, usuario o correo…" aria-label="Buscar usuarias" style="margin:12px 0">`+mini(s.users,u=>urow(u,s.user.id))),
  'admin-docs':gate('admin-docs',s=>head('Moderar documentos',`${s.docs.length} documentos publicados.`)+(s.docs.length?mini(s.docs,d=>item(d.t,`${d.a} · ${d.c} · ${d.f} · ${n(d.dl)} descargas`,'data-deldoc',d.id,'Eliminar')):empty('No hay documentos.'))),
  'admin-content':gate('admin-content',s=>head('Eventos y cursos','Lo que publiques aquí lo ve toda la comunidad.')+
    `<div class="card2"><h3>Nuevo evento</h3><div class="fgrid"><input id="ev-t" maxlength="80" placeholder="Título" aria-label="Título del evento"><input id="ev-d" maxlength="40" placeholder="Fecha y hora (ej. Sáb 5 dic · 10:00)" aria-label="Fecha"><input id="ev-p" maxlength="60" placeholder="Lugar o Virtual" aria-label="Lugar"><input id="ev-x" maxlength="140" placeholder="Descripción corta" aria-label="Descripción"></div><button class="btn" data-addev style="margin-top:10px">Publicar evento</button></div>`+
    mini(s.events,e=>item(e.t,`${e.d} · ${e.p}`,'data-delev',e.id,'Quitar'))+
    `<div class="card2"><h3>Nuevo curso</h3><div class="fgrid"><input id="co-t" maxlength="80" placeholder="Título" aria-label="Título del curso"><select id="co-n" aria-label="Nivel"><option>Principiante</option><option>Intermedio</option><option>Avanzado</option></select><input id="co-h" maxlength="40" placeholder="Duración (ej. 3 semanas)" aria-label="Duración"><input id="co-x" maxlength="140" placeholder="Descripción corta" aria-label="Descripción"></div><button class="btn" data-addco style="margin-top:10px">Publicar curso</button></div>`+
    mini(s.courses,c=>item(c.t,`${c.n} · ${c.h}`,'data-delco',c.id,'Quitar')))
};

const reload=async()=>setState({user:await authService.restore(),users:await authService.list(),docs:await documentsService.list(),...await contentService.list(),rev:getState().rev+1});
const run=async(f,msg)=>{try{await f();if(msg)toast(msg)}catch(e){toast(e.message)}await reload();return true};
const v=id=>$(id).value.trim();

export async function adminClick(b){
  const d=b.dataset,s=getState(),has=k=>k in d;
  const u=()=>s.users.find(x=>x.id==(d.feat||d.biz||d.susp||d.role||d.deluser));
  if(has('go')){setState({view:'r:'+d.go});return true}
  if(has('feat'))return run(()=>authService.updateUser(+d.feat,{featured:!u().featured}));
  if(has('biz'))return run(()=>authService.updateUser(+d.biz,{bizFeatured:!u().bizFeatured}));
  if(has('susp')){const x=u();return run(()=>authService.updateUser(x.id,{suspended:!x.suspended}),x.suspended?'Cuenta reactivada':'Cuenta suspendida')}
  if(has('role')){const x=u(),adm=x.role==='admin';
    return confirm(`¿${adm?'Quitar':'Dar'} permisos de administradora a ${x.name}?`)?run(()=>authService.updateUser(x.id,{role:adm?'user':'admin'}),'Rol actualizado'):true}
  if(has('deluser')){const x=u();
    return confirm(`¿Eliminar la cuenta de ${x.name} y todos sus documentos? No se puede deshacer.`)?run(async()=>{await authService.deleteUser(x.id);await documentsService.removeByAuthor(x.name)},'Cuenta eliminada'):true}
  if(has('deldoc'))return confirm('¿Eliminar este documento?')?run(()=>documentsService.remove(+d.deldoc),'Documento eliminado'):true;
  if(has('addev')){if(!v('#ev-t')){toast('Escribe un título.');return true}
    return run(()=>contentService.add('events',{t:v('#ev-t'),d:v('#ev-d'),p:v('#ev-p'),x:v('#ev-x')}),'Evento publicado')}
  if(has('addco')){if(!v('#co-t')){toast('Escribe un título.');return true}
    return run(()=>contentService.add('courses',{t:v('#co-t'),n:v('#co-n'),h:v('#co-h'),x:v('#co-x')}),'Curso publicado')}
  if(has('delev'))return run(()=>contentService.remove('events',+d.delev),'Evento quitado');
  if(has('delco'))return run(()=>contentService.remove('courses',+d.delco),'Curso quitado');
  return false;
}
export const adminInput=e=>{
  if(e.target.id!=='au-q')return;const q=e.target.value.toLowerCase();
  $$('[data-q]').forEach(r=>r.classList.toggle('hidden',!r.dataset.q.includes(q)));
};
