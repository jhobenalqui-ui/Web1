// Adaptador MOCK (localStorage) para eventos y cursos.
import {EVENTS,COURSES} from '../data/mock-content.js';
import {authService} from './auth.service.js';
const K='semilla.content';
const rd=()=>{try{return JSON.parse(localStorage.getItem(K))}catch{return null}};
const db=()=>rd()||{events:EVENTS.map((e,i)=>({id:i+1,...e})),courses:COURSES.map((c,i)=>({id:i+1,...c}))};
const wr=v=>localStorage.setItem(K,JSON.stringify(v));
const kindOk=k=>{if(!['events','courses'].includes(k))throw new Error('Tipo no válido.')};
export const contentService={
  async list(){return db()},
  async add(kind,item){authService.assertAdmin();kindOk(kind);const d=db();
    d[kind].push({id:Date.now(),...Object.fromEntries(Object.entries(item).map(([k,v])=>[k,String(v).trim().slice(0,200)]))});wr(d)},
  async remove(kind,id){authService.assertAdmin();kindOk(kind);const d=db();d[kind]=d[kind].filter(x=>x.id!==id);wr(d)}
};
