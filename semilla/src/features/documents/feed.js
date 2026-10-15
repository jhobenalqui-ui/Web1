import {$,esc,toast} from '../../core/dom.js';
import {getState,setState} from '../../core/store.js';
import {CATEGORIES} from '../../data/constants.js';
import {documentsService} from '../../services/documents.service.js';
import {refreshDocs} from './actions.js';
import {visibleDocs,topDownloaded} from './selectors.js';

const card=d=>`<article class="doc"><div class="ext">${esc(d.f)}</div><div>
  <h3><span>${esc(d.a)} /</span> ${esc(d.t)}</h3><p>${esc(d.d)}</p>
  <div class="meta"><span class="tag">${esc(d.c)}</span><span>${esc(d.v)}</span><span>${d.dl.toLocaleString('es-PE')} descargas</span><span>${esc(d.up)}</span>
  <button class="star ${d.fav?'on':''}" data-s="${d.id}">${d.fav?'★ Guardado':'☆ Guardar'} · ${d.st}</button>
  <button class="dl" data-dl="${d.id}">Descargar</button></div></div></article>`;
const EMPTY='<div class="empty">No hay documentos aquí todavía.<br>Sube el primero para empezar la conversación.</div>';

export function initFeed(){
  $('#chips').onclick=e=>{const c=e.target.dataset.c;if(c)setState({cat:c})};
  $('#feed').onclick=async e=>{
    const {s,dl}=e.target.dataset;
    if(s){await documentsService.toggleSave(s);await refreshDocs()}
    if(dl){const d=getState().docs.find(x=>x.id==dl);await documentsService.registerDownload(dl);await refreshDocs();toast('Descarga iniciada: '+d.t)}
  };
}
export function renderFeed(s){
  $('#chips').innerHTML=CATEGORIES.map(c=>`<button class="chip ${c===s.cat?'on':''}" data-c="${c}">${c}</button>`).join('');
  const l=visibleDocs(s);
  $('#feed').innerHTML=l.length?l.map(card).join(''):EMPTY;
  $('#top').innerHTML=topDownloaded(s.docs).map(d=>`<div class="row"><div class="n">${esc(d.t)}</div><span class="small">${d.dl.toLocaleString('es-PE')}</span></div>`).join('');
}
