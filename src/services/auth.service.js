// Adaptador MOCK con localStorage (solo para probar). Las contraseñas en texto plano y la
// comprobación de rol en el navegador NO son seguridad real: con Supabase, Auth + RLS lo reemplazan.
const K='semilla.users',S='semilla.session';
const rd=()=>{try{return JSON.parse(localStorage.getItem(K))}catch{return null}};
const wr=u=>localStorage.setItem(K,JSON.stringify(u));
const pg=(title,tagline,about)=>({title,tagline,about,color:'#14513F',blocks:[]});
const mk=(id,username,name,email,rub,role,featured,bizFeatured,page)=>({id,username,name,email,password:'semilla123',rub,role,featured,bizFeatured,suspended:false,page});
const seed=()=>{
  const a=mk(1,'admin','Administradora Semilla','admin@semilla.pe','Comunidad','admin',false,false,pg('Semilla','Comunidad de emprendedoras','Compartimos lo que ya sabemos hacer.'));a.password='admin1234';
  return [a,
    mk(2,'lucia_paredes','Lucía Paredes','lucia@correo.pe','Alimentos y bebidas','user',false,false,pg('Dulce Lucía','Repostería casera en Lima','Preparo tortas y postres por encargo.')),
    mk(3,'marisol_q','Marisol Quispe','marisol@correo.pe','Servicios profesionales','user',true,true,pg('Contabilidad Clara','Orden para tu negocio','Contadora en Cusco. Te ayudo a formalizarte.')),
    mk(4,'rocio_alva','Rocío Alva','rocio@correo.pe','Alimentos y bebidas','user',true,false,pg('Rocío Repostería','Sabores de Trujillo','Postres artesanales y talleres.')),
    mk(5,'carla_mena','Carla Mena','carla@correo.pe','Servicios profesionales','user',false,true,pg('Mena Marketing','Redes que venden','Estrategia de contenidos para emprendimientos.'))];
};
const all=()=>{let u=rd();if(!u){u=seed();wr(u)}return u};
const pub=({password,...u})=>u;
const me=()=>{const id=+localStorage.getItem(S);return all().find(u=>u.id===id)};
const need=(c,m)=>{if(!c)throw new Error(m)};
const login=u=>{localStorage.setItem(S,u.id);return pub(u)};
const cut=(v,n)=>String(v??'').slice(0,n);

export const authService={
  async list(){return all().map(pub)},
  async restore(){const u=me();if(u?.suspended){localStorage.removeItem(S);return null}return u?pub(u):null},
  async signIn({email,password}){
    const u=all().find(x=>x.email===email.toLowerCase()&&x.password===password);
    need(u,'Correo o contraseña incorrectos.');
    need(!u.suspended,'Tu cuenta está suspendida. Contacta a una administradora.');return login(u)},
  async signUp({email,password,name,username,rub}){
    const us=all();email=email.toLowerCase();username=username.toLowerCase();
    need(/^[a-z0-9_]{3,20}$/.test(username),'El usuario debe tener de 3 a 20 letras minúsculas, números o _.');
    need(!us.some(u=>u.username===username),'Ese nombre de usuario ya existe.');
    need(!us.some(u=>u.email===email),'Ya hay una cuenta con ese correo.');
    const u=mk(Math.max(...us.map(x=>x.id))+1,username,name,email,rub,'user',false,false,pg(name,'Mi emprendimiento','Cuéntales a las demás qué haces.'));
    u.password=password;us.push(u);wr(us);return login(u)},
  async demo(){return login(all().find(u=>u.username==='lucia_paredes'))},
  async signOut(){localStorage.removeItem(S)},
  async updatePage(id,p){
    const m=me();need(m&&(m.id===id||m.role==='admin'),'No tienes permiso.');
    const us=all(),u=us.find(x=>x.id===id);
    u.page={title:cut(p.title,60),tagline:cut(p.tagline,100),about:cut(p.about,600),color:p.color,
      blocks:(p.blocks||[]).slice(0,6).map(b=>({t:cut(b.t,60),x:cut(b.x,600)}))};
    wr(us);return pub(u)},
  assertAdmin(){need(me()?.role==='admin','Solo una administradora puede hacer esto.')},
  async updateUser(id,p){
    authService.assertAdmin();
    const us=all(),u=us.find(x=>x.id===id),self=me().id===id;
    need(u,'Usuaria no encontrada.');
    ['featured','bizFeatured'].forEach(k=>{if(k in p)u[k]=!!p[k]});
    if('suspended' in p){need(!self,'No puedes suspender tu propia cuenta.');u.suspended=!!p.suspended}
    if('role' in p){need(!self,'No puedes cambiar tu propio rol.');need(['admin','user'].includes(p.role),'Rol no válido.');u.role=p.role}
    wr(us)},
  async deleteUser(id){
    authService.assertAdmin();need(me().id!==id,'No puedes eliminar tu propia cuenta.');
    wr(all().filter(u=>u.id!==id))}
};
