import {$} from '../../core/dom.js';
import {counts} from '../documents/selectors.js';
export function renderProfile(s){
  if(!s.user)return;
  const i=s.user.name.trim()[0].toUpperCase();
  ['#av','#av2','#av3'].forEach(id=>$(id).textContent=i);
  $('#uname').textContent=s.user.name;$('#urub').textContent=s.user.rub+' · Lima';
  const c=counts(s);$('#s-docs').textContent=c.mine;$('#s-fav').textContent=c.fav;
}
