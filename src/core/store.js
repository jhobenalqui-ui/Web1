const state={events:[],courses:[],screen:'login',user:null,users:[],viewUser:null,rev:0,view:'all',cat:'Todas',q:'',docs:[]};
const subs=new Set();
export const getState=()=>state;
export const setState=p=>{Object.assign(state,p);subs.forEach(f=>f(state))};
export const subscribe=f=>(subs.add(f),()=>subs.delete(f));
