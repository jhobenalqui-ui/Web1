import {$,$$} from '../../core/dom.js';
import {setState} from '../../core/store.js';
import {authService} from '../../services/auth.service.js';
import {openUploadModal} from '../documents/upload-modal.js';
import {counts} from '../documents/selectors.js';

export function initShell(){
  $('#q').oninput=e=>{setState({q:e.target.value});if(e.target.value)setState({view:'all'})};
  $('#nav').onclick=e=>{const b=e.target.closest('button');if(b)setState({view:b.dataset.v})};
  $('#av').onclick=async()=>{await authService.signOut();setState({screen:'login',user:null})};
  ['#up1','#up2'].forEach(s=>$(s).onclick=openUploadModal);
}
export function renderShell(s){
  $('#login').classList.toggle('hidden',s.screen!=='login');
  $('#app').classList.toggle('hidden',s.screen!=='app');
  $$('.adm').forEach(e=>e.classList.toggle('hidden',s.user?.role!=='admin'));
  const c=counts(s);for(const k in c)$('#c-'+k).textContent=c[k];
  $$('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.v===s.view));
}
