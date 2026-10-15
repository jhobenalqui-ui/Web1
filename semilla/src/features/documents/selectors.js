export function visibleDocs({docs,user,view,cat,q}){
  let l=docs;
  if(view==='mine')l=l.filter(d=>d.a===user?.name);
  else if(view==='fav')l=l.filter(d=>d.fav);
  else if(view.startsWith('cat:'))l=l.filter(d=>d.c.startsWith(view.slice(4)));
  if(cat!=='Todas')l=l.filter(d=>d.c===cat);
  if(q){const n=q.toLowerCase();l=l.filter(d=>(d.t+d.d+d.a).toLowerCase().includes(n))}
  return l;
}
export const counts=({docs,user})=>({all:docs.length,mine:docs.filter(d=>d.a===user?.name).length,fav:docs.filter(d=>d.fav).length});
export const topDownloaded=(docs,n=4)=>[...docs].sort((a,b)=>b.dl-a.dl).slice(0,n);
