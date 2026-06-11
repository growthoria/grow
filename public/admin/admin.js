
const ADMIN_PASSWORD_KEY='growthoria_admin_password';
const DEFAULT=structuredClone(window.GROWTHORIA_CONTENT_DEFAULT||{});let data=structuredClone(DEFAULT),tab='services';const status=document.getElementById('status'),editor=document.getElementById('editor');
function merge(a,b){if(!b||typeof b!=='object')return a;for(const k of Object.keys(b)){if(Array.isArray(b[k]))a[k]=b[k];else if(b[k]&&typeof b[k]==='object')a[k]=merge(a[k]&&typeof a[k]==='object'?a[k]:{},b[k]);else a[k]=b[k]}return a}
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function get(p){return p.split('.').reduce((o,k)=>o?.[k],data)}function set(p,v){let ks=p.split('.'),o=data;ks.slice(0,-1).forEach(k=>{if(!o[k])o[k]={};o=o[k]});o[ks.at(-1)]=v}
const tabs=['site','hero','services','requestForm','about','navPopups','json'];function renderTabs(){document.getElementById('tabs').innerHTML=tabs.map(t=>`<button class="${t===tab?'active':''}" data-t="${t}">${t}</button>`).join('');document.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{tab=b.dataset.t;render()})}
function field(p,l,area=false){let v=get(p)??'';return `<div class="field ${area?'full':''}"><label>${l}</label>${area?`<textarea data-p="${p}">${esc(v)}</textarea>`:`<input data-p="${p}" value="${esc(v)}">`}</div>`}
function serviceField(i,k,l,area=false){let p=`services.${i}.${k}`,v=data.services[i][k]??'';return `<div class="field ${area?'full':''}"><label>${l}</label>${area?`<textarea data-p="${p}">${esc(v)}</textarea>`:`<input data-p="${p}" value="${esc(v)}">`}</div>`}
function bind(){document.querySelectorAll('[data-p]').forEach(x=>x.oninput=()=>set(x.dataset.p,x.value))}
function render(){renderTabs();if(tab==='site')editor.innerHTML=`<div class="grid">${field('site.title','Title')}${field('site.description','Description',true)}${field('site.email','Email')}${field('site.phone','Phone')}${field('site.address','Address',true)}${field('site.copyright','Copyright')}</div>`;if(tab==='hero')editor.innerHTML=`<div class="grid">${field('hero.eyebrow','Eyebrow')}${field('hero.titleHtml','Title HTML',true)}${field('hero.lead','Lead',true)}${field('hero.primaryButton','Primary button')}${field('hero.secondaryButton','Secondary button')}${field('servicesSection.title','Services title')}${field('servicesSection.intro','Services intro',true)}</div>`;if(tab==='requestForm')editor.innerHTML=`<div class="grid">${field('requestForm.title','Title')}${field('requestForm.text','Text',true)}${field('requestForm.button','Button')}${field('requestForm.successText','Success text',true)}${field('requestForm.errorText','Error text',true)}</div>`;if(tab==='about')editor.innerHTML=`<div class="grid">${field('about.titleHtml','About title HTML',true)}${field('about.text','About text',true)}${field('about.button','Button')}${field('aboutPopup.title','Popup title')}${field('aboutPopup.lead','Popup lead',true)}</div>`;if(tab==='navPopups')editor.innerHTML=Object.keys(data.navPopups||{}).map(k=>`<div class="service"><h2>${k}</h2><div class="grid">${field(`navPopups.${k}.title`,'Title')}${field(`navPopups.${k}.lead`,'Lead',true)}</div></div>`).join('');if(tab==='services')editor.innerHTML=(data.services||[]).map((s,i)=>`<div class="service"><h2>${esc(s.title)}</h2><div class="grid">${serviceField(i,'key','Key')}${serviceField(i,'category','Category')}${serviceField(i,'title','Title')}${serviceField(i,'icon','Icon path')}${serviceField(i,'price','Price')}${serviceField(i,'priceSuffix','Price suffix')}${serviceField(i,'short','Card description',true)}${serviceField(i,'message','Prepared request text',true)}</div><button onclick="data.services.splice(${i},1);render()">Remove</button></div>`).join('');if(tab==='json'){editor.innerHTML=`<textarea class="json" id="json">${esc(JSON.stringify(data,null,2))}</textarea>`;document.getElementById('json').oninput=e=>{try{data=JSON.parse(e.target.value);status.textContent='JSON valid'}catch(err){status.textContent='JSON error: '+err.message}}}bind()}
async function load(){try{let l=localStorage.getItem('growthoria_content');if(l)data=merge(structuredClone(DEFAULT),JSON.parse(l))}catch(e){}try{let r=await fetch('/api/content',{cache:'no-store'});if(r.ok){let j=await r.json();if(j&&Object.keys(j).length)data=merge(structuredClone(DEFAULT),j);status.textContent='Cloudflare connected'}}catch(e){status.textContent='Local mode. Deploy to Cloudflare for global save.'}render()}
async function save(){let password=localStorage.getItem(ADMIN_PASSWORD_KEY);if(!password){showLogin();return}try{let r=await fetch('/api/content',{method:'POST',headers:{'Content-Type':'application/json','x-admin-password':password},body:JSON.stringify(data)});if(!r.ok){if(r.status===401){localStorage.removeItem(ADMIN_PASSWORD_KEY);showLogin('Wrong password. Please login again.');return}throw new Error(await r.text())}localStorage.setItem('growthoria_content',JSON.stringify(data));status.textContent='Saved to Cloudflare.';alert('Saved successfully.')}catch(e){localStorage.setItem('growthoria_content',JSON.stringify(data));status.textContent='Saved locally only. Cloudflare error: '+e.message;alert('Saved locally only. Cloudflare error: '+e.message)}}
document.getElementById('saveTop').onclick=save;document.getElementById('saveBottom').onclick=save;document.getElementById('addService').onclick=()=>{data.services.push({key:'new-service',category:'New',icon:'assets/service-icon-strategy.png',title:'New Service',short:'Short description',message:'Hello Growthoria,\\n\\nI am interested in this service.\\n\\nBest regards,',price:'€300',priceSuffix:''});tab='services';render()};document.getElementById('exportBtn').onclick=()=>{navigator.clipboard.writeText(JSON.stringify(data,null,2));alert('Copied JSON')};document.getElementById('importBtn').onclick=()=>{let v=prompt('Paste JSON');if(v)try{data=JSON.parse(v);render()}catch(e){alert(e.message)}};document.getElementById('resetBtn').onclick=()=>{if(confirm('Reset?')){data=structuredClone(DEFAULT);render()}};load();


function showLogin(msg){
  const login=document.getElementById('loginScreen');
  const admin=document.getElementById('adminScreen');
  const st=document.getElementById('loginStatus');
  if(login) login.classList.remove('hidden');
  if(admin) admin.classList.add('hidden');
  if(st && msg) st.textContent=msg;
}
function showAdmin(){
  const login=document.getElementById('loginScreen');
  const admin=document.getElementById('adminScreen');
  if(login) login.classList.add('hidden');
  if(admin) admin.classList.remove('hidden');
}
async function verifyPassword(password){
  const r=await fetch('/api/content',{method:'POST',headers:{'Content-Type':'application/json','x-admin-password':password},body:JSON.stringify(data)});
  if(!r.ok) throw new Error(await r.text());
  localStorage.setItem(ADMIN_PASSWORD_KEY,password);
  localStorage.setItem('growthoria_content',JSON.stringify(data));
  showAdmin();
  status.textContent='Logged in. Cloudflare connected.';
}
document.addEventListener('DOMContentLoaded',()=>{
  const saved=localStorage.getItem(ADMIN_PASSWORD_KEY);
  if(saved) showAdmin(); else showLogin();

  const loginBtn=document.getElementById('loginBtn');
  const pass=document.getElementById('loginPassword');
  const loginStatus=document.getElementById('loginStatus');
  if(loginBtn) loginBtn.onclick=async()=>{
    const p=pass.value.trim();
    if(!p){loginStatus.textContent='Enter password.';return}
    loginStatus.textContent='Checking password...';
    try{await verifyPassword(p)}
    catch(e){loginStatus.textContent='Wrong password or Cloudflare save is not configured: '+e.message}
  };
  if(pass) pass.addEventListener('keydown',e=>{if(e.key==='Enter')loginBtn.click()});

  const logout=document.getElementById('logoutBtn');
  if(logout) logout.onclick=()=>{localStorage.removeItem(ADMIN_PASSWORD_KEY);showLogin('Logged out.');};
});
