import {$,$$,esc,toast} from '../../core/dom.js';
import {getState,setState} from '../../core/store.js';
import {authService} from '../../services/auth.service.js';

export const COLORS=['#14513F','#B4306B','#2F5DA8','#8A5A00'];
const safe=c=>COLORS.includes(c)?c:COLORS[0];
export const pageHTML=(p,u)=>`<div class="site" style="--site:${safe(p.color)}"><div class="site-hero"><h2>${esc(p.title)}</h2><p>${esc(p.tagline)}</p><small>por ${esc(u.name)} · @${esc(u.username)}</small></div><div class="site-body"><section><h3>Sobre nosotras</h3><p>${esc(p.about)}</p></section>${p.blocks.map(b=>`<section><h3>${esc(b.t)}</h3><p>${esc(b.x)}</p></section>`).join('')}</div></div>`;

export function mountEditor(el,user){
  const d=structuredClone(user.page);
  el.innerHTML=`<h2 class="sec-h">Mi página web</h2><p class="small">Edítala y mira cómo queda en vivo. Así te verán las demás.</p>
  <div class="editor"><div class="panel">
    <label for="pg-t">Nombre de tu emprendimiento</label><input id="pg-t" maxlength="60" value="${esc(d.title)}">
    <label for="pg-s">Frase corta</label><input id="pg-s" maxlength="100" value="${esc(d.tagline)}">
    <label for="pg-a">Sobre ti</label><textarea id="pg-a" rows="4" maxlength="600">${esc(d.about)}</textarea>
    <label>Color</label><div class="swatches">${COLORS.map(c=>`<button class="sw ${c===safe(d.color)?'on':''}" data-c="${c}" style="background:${c}" aria-label="Color ${c}"></button>`).join('')}</div>
    <label>Secciones (máx. 6)</label><div id="blk"></div>
    <button class="btn alt" id="pg-add" style="margin-top:6px">+ Agregar sección</button>
    <button class="btn full" id="pg-save">Guardar página</button></div><div id="pv"></div></div>`;
  const pv=()=>$('#pv').innerHTML=pageHTML(d,user);
  const blocks=()=>$('#blk').innerHTML=d.blocks.map((b,i)=>`<div class="blk"><input data-k="t" data-i="${i}" maxlength="60" value="${esc(b.t)}" aria-label="Título de la sección"><textarea data-k="x" data-i="${i}" rows="2" maxlength="600" aria-label="Texto de la sección">${esc(b.x)}</textarea><button class="chip" data-rm="${i}">Quitar</button></div>`).join('');
  blocks();pv();
  const p=$('.panel',el);
  p.oninput=e=>{const t=e.target;
    if(t.id==='pg-t')d.title=t.value;else if(t.id==='pg-s')d.tagline=t.value;else if(t.id==='pg-a')d.about=t.value;
    else if(t.dataset.i)d.blocks[t.dataset.i][t.dataset.k]=t.value;pv()};
  p.onclick=async e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.c){d.color=b.dataset.c;$$('.sw',p).forEach(x=>x.classList.toggle('on',x===b));pv()}
    else if(b.dataset.rm!==undefined){d.blocks.splice(+b.dataset.rm,1);blocks();pv()}
    else if(b.id==='pg-add'){if(d.blocks.length>=6)return toast('Máximo 6 secciones.');d.blocks.push({t:'Nueva sección',x:''});blocks();pv()}
    else if(b.id==='pg-save'){
      try{const u=await authService.updatePage(user.id,d);
        setState({user:u,users:await authService.list(),rev:getState().rev+1});toast('Página guardada')}
      catch(err){toast(err.message)}}};
}
