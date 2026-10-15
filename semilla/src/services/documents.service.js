// Adaptador MOCK (localStorage). Para backend real, reemplaza solo este archivo.
import {MOCK_DOCUMENTS} from '../data/mock-documents.js';
import {authService} from './auth.service.js';
const K='semilla.docs';
const rd=()=>{try{return JSON.parse(localStorage.getItem(K))}catch{return null}};
const load=()=>rd()||structuredClone(MOCK_DOCUMENTS);
const save=d=>localStorage.setItem(K,JSON.stringify(d));
export const documentsService={
  async list(){return load()},
  async create({t,d,c,f},author){const db=load();db.unshift({id:Date.now(),t,a:author,c,f,v:'v1.0',d:d||'Sin descripción.',dl:0,st:0,up:'ahora',fav:false});save(db)},
  async toggleSave(id){const db=load(),x=db.find(d=>d.id==id);x.fav=!x.fav;x.st+=x.fav?1:-1;save(db)},
  async registerDownload(id){const db=load();db.find(d=>d.id==id).dl++;save(db)},
  async remove(id){authService.assertAdmin();save(load().filter(d=>d.id!==id))},
  async removeByAuthor(name){authService.assertAdmin();save(load().filter(d=>d.a!==name))}
};
