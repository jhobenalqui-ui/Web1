import {$,toast} from '../../core/dom.js';
import {getState} from '../../core/store.js';
import {documentsService} from '../../services/documents.service.js';
import {refreshDocs} from './actions.js';

const close=()=>$('#modal').classList.add('hidden');
export function openUploadModal(){$('#modal').classList.remove('hidden');$('#d-t').focus()}
export function initUploadModal(){
  $('#d-x').onclick=close;
  $('#modal').onclick=e=>{if(e.target.id==='modal')close()};
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  $('#d-ok').onclick=async()=>{
    const t=$('#d-t').value.trim();
    if(!t)return toast('Escribe un título para publicar.');
    await documentsService.create({t,d:$('#d-d').value.trim(),c:$('#d-c').value,f:$('#d-f').value},getState().user.name);
    $('#d-t').value='';$('#d-d').value='';close();
    await refreshDocs({view:'all',cat:'Todas'});toast('Documento publicado');
  };
}
