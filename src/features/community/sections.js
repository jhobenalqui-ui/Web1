import {$,esc} from '../../core/dom.js';
import {getState,setState} from '../../core/store.js';
import {adminClick,adminInput,ADMIN_ROUTES} from '../admin/admin.js';
import {pageHTML,mountEditor} from '../pages/page.js';

const head=(t,s)=>`<h2 class="sec-h">${t}</h2><p class="small">${s}</p>`;
const empty=t=>`<div class="empty">${t}</div>`;
const list=(a,f,e)=>a.length?a.map(f).join(''):empty(e);
const ucard=u=>`<div class="card2 ucard"><div class="avatar">${esc(u.name[0])}</div><div class="n"><b>${esc(u.name)}</b>${u.role==='admin'?' <span class="tag">Admin</span>':''}<div class="small">@${esc(u.username)} · ${esc(u.rub)}</div></div><button class="chip" data-open="${u.id}">Ver página</button></div>`;
const bcard=u=>`<div class="card2"><h3>${esc(u.page.title)}</h3><p class="small">${esc(u.page.tagline)} — ${esc(u.name)}</p><button class="chip" data-open="${u.id}">Ver página</button></div>`;
const arow=u=>`<div class="row arow"><div class="n"><b>${esc(u.name)}</b><div class="small">@${esc(u.username)} · ${esc(u.email)}</div></div>${u.role==='admin'?'<span class="tag">Admin</span>':`<button class="chip ${u.featured?'on':''}" data-feat="${u.id}">Usuaria destacada</button><button class="chip ${u.bizFeatured?'on':''}" data-biz="${u.id}">Emprendimiento destacado</button>`}</div>`;

const vis=s=>s.user.role==='admin'?s.users:s.users.filter(u=>!u.suspended);
const R={
  events:s=>head('Eventos','Encuentros de la comunidad.')+list(s.events,e=>`<div class="card2"><span class="tag">${esc(e.d)}</span><h3>${esc(e.t)}</h3><p class="small">${esc(e.p)} · ${esc(e.x)}</p></div>`,'No hay eventos por ahora.'),
  courses:s=>head('Cursos','Aprende a tu ritmo.')+list(s.courses,c=>`<div class="card2"><span class="tag">${esc(c.n)}</span> <span class="small">${esc(c.h)}</span><h3>${esc(c.t)}</h3><p class="small">${esc(c.x)}</p></div>`,'No hay cursos por ahora.'),
  users:s=>head('Usuarias',`${vis(s).length} emprendedoras en Semilla.`)+vis(s).map(ucard).join(''),
  featured:s=>head('Usuarias destacadas','Elegidas por el equipo de Semilla.')+list(vis(s).filter(u=>u.featured),ucard,'Aún no hay usuarias destacadas.'),
  biz:s=>head('Emprendimientos destacados','Negocios de la comunidad que vale la pena conocer.')+list(vis(s).filter(u=>u.bizFeatured),bcard,'Aún no hay emprendimientos destacados.'),
  ...ADMIN_ROUTES
};
let last='';
export function initSections(){
  $('#section').onclick=async e=>{
    const b=e.target.closest('button');if(!b)return;const d=b.dataset;
    if(await adminClick(b))return;
    if(d.open)setState({view:'r:user',viewUser:+d.open});
    else if('back' in d)setState({view:'r:users'});
  };
  $('#section').oninput=adminInput;
}
export function renderSection(s){
  const isR=s.view.startsWith('r:');
  $('#docs-area').classList.toggle('hidden',isR);$('#section').classList.toggle('hidden',!isR);
  if(!isR||!s.user)return;
  const key=[s.view,s.viewUser,s.rev,s.user.id].join('|');
  if(key===last)return;last=key;
  const el=$('#section'),name=s.view.slice(2);
  if(name==='page')return mountEditor(el,s.user);
  if(name==='user'){const u=s.users.find(x=>x.id===s.viewUser);
    el.innerHTML='<button class="chip" data-back>← Volver</button>'+(u?pageHTML(u.page,u):empty('Usuaria no encontrada.'));return}
  el.innerHTML=(R[name]||(()=>empty('Sección no disponible.')))(s);
}
