import {$,$$} from '../../core/dom.js';
import {setState} from '../../core/store.js';
import {authService} from '../../services/auth.service.js';

let mode='in';
function validate(){
  if(!/^\S+@\S+\.\S+$/.test($('#em').value.trim()))return 'Escribe un correo válido, por ejemplo tu@correo.com.';
  if($('#pw').value.length<8)return 'La contraseña debe tener al menos 8 caracteres.';
  if(mode==='up'){
    if(!$('#nm').value.trim())return 'Escribe tu nombre para crear la cuenta.';
    if(!/^[a-z0-9_]{3,20}$/.test($('#un').value.trim().toLowerCase()))return 'El usuario debe tener de 3 a 20 letras, números o _.';
  }
  return '';
}
const enter=async user=>{setState({screen:'app',user,users:await authService.list(),view:user.role==='admin'?'r:admin':'r:page'});window.scrollTo(0,0)};
export function initLogin(){
  $$('.tabs button').forEach(b=>b.onclick=()=>{
    mode=b.dataset.mode;
    $$('.tabs button').forEach(x=>x.classList.toggle('on',x===b));
    $('#nameField').classList.toggle('hidden',mode==='in');$('#bizField').classList.toggle('hidden',mode==='in');
    $('#go').textContent=mode==='in'?'Ingresar':'Crear cuenta';
    $('#ltitle').textContent=mode==='in'?'Bienvenida de nuevo':'Empieza tu cuenta';
  });
  $('#go').onclick=async()=>{
    const err=validate();$('#lerr').textContent=err;if(err)return;
    const c={email:$('#em').value.trim(),password:$('#pw').value};
    try{await enter(mode==='up'?await authService.signUp({...c,name:$('#nm').value.trim(),username:$('#un').value.trim(),rub:$('#biz').value}):await authService.signIn(c))}
    catch(e){$('#lerr').textContent=e.message}
  };
  $('#demo').onclick=async()=>enter(await authService.demo());
}
