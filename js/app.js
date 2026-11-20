import {signIn,signOutUser,watchAuth} from './firebase.js';
import {S,listen,add,put,upd,del} from './db.js';
import {$,esc,ymd} from './utils.js';
import {modal,close,toast} from './ui.js';
import {pages,V,ICON} from './pages.js';
const NAV=[['home','Home','🏡'],['groceries','Groceries','🛒'],['inventory','Inventory','🥫'],['expiry','Expiry','⏰'],['meals','Meals','🍽️'],['planner','Planner','📅'],['expenses','Expenses','💰'],['reports','Reports','📊']];
$('#nav').innerHTML=NAV.map(n=>`<a href="#${n[0]}" data-p="${n[0]}"><span>${n[2]}</span>${n[1]}</a>`).join('');
const cur=()=>NAV.find(n=>n[0]===location.hash.slice(1))?location.hash.slice(1):'home';
function render(){const p=cur();try{$('#view').innerHTML=pages[p]()}catch(e){console.error(e);$('#view').innerHTML='<div class="empty">Something broke: '+esc(e.message)+'</div>'}document.querySelectorAll('nav a').forEach(a=>{const on=a.dataset.p===p;a.classList.toggle('on',on);if(on)a.scrollIntoView({inline:'center',block:'nearest'})})}
addEventListener('hashchange',()=>{scrollTo(0,0);render()});
render();
if('serviceWorker'in navigator)navigator.serviceWorker.register('service-worker.js').catch(()=>{});
$('#signin').onclick=()=>{$('#lerr').textContent='';signIn().catch(e=>{console.error(e);$('#lerr').textContent=(e.code||'error')+': '+e.message})};
watchAuth(u=>{$('#login').classList.toggle('hide',!!u);if(u){V.start=Date.parse(u.metadata.creationTime)||Date.now();render();listen(u.uid,()=>{render();remind()},e=>toast(e.code||e.message))}});
async function remind(){if(!('Notification'in window)||Notification.permission!=='granted')return;const reg=await navigator.serviceWorker.ready;
for(const i of S.items){if(i.qty<=0||!i.expiry)continue;const d=(i.expiry-Date.now())/864e5,st=d<0?'expired':d<=1?'1day':d<=2?'2days':null;if(!st)continue;const k=`n:${i.id}:${i.expiry}:${st}`;if(localStorage[k])continue;localStorage[k]=1;
reg.showNotification('Hearthly',{body:st==='expired'?`${i.name} has expired`:`${i.name} expires in ${st==='1day'?'1 day':'2 days'}`,icon:'assets/logo/logo.svg',tag:k})}}
setInterval(remind,18e5);
const exp=()=>{const d=+$('#f-d').value||0,h=+$('#f-h').value||0;if(d||h)return Date.now()+d*864e5+h*36e5;const v=$('#f-e').value;return v?new Date(v+'T23:59:59').getTime():null};
const form=(kind,it)=>`<h3>${it?esc(it.name):'New '+(kind==='grocery'?'grocery':'food')}</h3>${it?'':'<label>Name<input id="f-n"></label>'}
<label>Quantity<input id="f-q" type="number" min="1" value="1"></label><label>${kind==='grocery'?'Total price paid (₹)':'Price (₹, optional)'}<input id="f-p" type="number" min="0" step="any"></label>
${it?'<label class="chk"><input id="f-u" type="checkbox"> Update expiry date</label>':''}
<div class="exp"><span>Expiry</span><input id="f-e" type="date"><em>or in</em><input id="f-d" type="number" min="0" placeholder="days"><input id="f-h" type="number" min="0" placeholder="hrs"></div>
<button class="primary" data-act="save" data-kind="${kind}" data-id="${it?it.id:''}">Save</button>`;
const mealForm=s=>`<h3>${ICON[s]} ${s}</h3><label>Dish<input id="m-d"></label><label class="chk"><input type="radio" name="how" value="home" checked> 🏠 Cooked at home</label><label class="chk"><input type="radio" name="how" value="outside"> 🍴 Ate outside</label><label>Cost (₹, if outside)<input id="m-c" type="number" min="0" step="any"></label><button class="primary" data-act="savemeal" data-slot="${s}">Save</button>`;
document.addEventListener('change',e=>{if(e.target.id==='md'){V.date=e.target.value||ymd();render()}else if(e.target.id==='wsel'){V.wk=+e.target.value;render()}});
document.addEventListener('click',async e=>{if(e.target.id==='modal')return close();if(!e.target.closest('.dd'))document.querySelector('.dd.open')?.classList.remove('open');const b=e.target.closest('[data-act]');if(!b)return;const {act,id,kind,slot,date}=b.dataset,it=S.items.find(i=>i.id===id);
if(act==='close')close();
else if(act==='inc'||act==='dec'){const n=it.qty+(act==='inc'?1:-1);if(n<0)return;upd('items',id,{qty:n});add('logs',{type:act==='inc'?'buy':'use',item:id,name:it.name,qty:1,date:Date.now()})}
else if(act==='addstock')modal(`<h3>Add ${kind==='grocery'?'grocery':'food'}</h3><button class="primary" data-act="newitem" data-kind="${kind}">✨ New product</button><h3 style="font-size:15px">Or pick existing</h3>${S.items.filter(i=>i.kind===kind).sort((a,b)=>a.name.localeCompare(b.name)).map(i=>`<button class="ghost pick" data-act="pick" data-id="${i.id}" data-kind="${kind}"><span>${esc(i.name)}</span><b>${i.qty}</b></button>`).join('')||'<p class="sub">Nothing yet.</p>'}`);
else if(act==='newitem')modal(form(kind));
else if(act==='pick')modal(form(kind,it));
else if(act==='save'){const q=+$('#f-q').value,p=+$('#f-p').value||0;let t=it,ex=exp();if(!q||q<1)return toast('Enter a quantity');
if(!t){const nm=$('#f-n').value.trim();if(!nm)return toast('Enter a name');t=S.items.find(i=>i.kind===kind&&i.name.toLowerCase()===nm.toLowerCase())||{name:nm}}
const useEx=ex&&(!id||$('#f-u')?.checked);let iid=t.id;
if(iid)upd('items',iid,{qty:t.qty+q,...(useEx?{expiry:ex}:{})});else iid=add('items',{name:t.name,kind,qty:q,expiry:ex,created:Date.now()}).id;
add('logs',{type:'buy',item:iid,name:t.name,qty:q,price:p,date:Date.now()});if(p)add('expenses',{type:kind==='grocery'?'grocery':'outside',amount:p,date:Date.now(),note:t.name});close();toast('Saved ✓')}
else if(act==='addmeal')modal(mealForm(slot));
else if(act==='savemeal'){const d=$('#m-d').value.trim();if(!d)return toast('Enter a dish');const how=document.querySelector('[name=how]:checked').value,c=+$('#m-c').value||0;add('meals',{date:V.date,slot,dish:d,how});if(how==='outside'&&c)add('expenses',{type:'outside',amount:c,date:Date.now(),note:d});close()}
else if(act==='delmeal')del('meals',id);
else if(act==='plan'){const p=S.plans.find(x=>x.id===date)||{};modal(`<h3>${date}</h3>`+['breakfast','lunch','dinner'].map(s=>`<label>${ICON[s]} ${s}<input id="p-${s}" value="${esc(p[s]||'')}"></label>`).join('')+`<button class="primary" data-act="saveplan" data-date="${date}">Save</button>`)}
else if(act==='wprev'||act==='wnext'){V.wk=Math.min(0,V.wk+(act==='wnext'?1:-1));render()}
else if(act==='wk'){V.wk=+b.dataset.n;render()}
else if(act==='ddtoggle')b.closest('.dd').classList.toggle('open');
else if(act==='logout')signOutUser().then(()=>location.reload());
else if(act==='theme'){const t=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=t;localStorage.theme=t;$('meta[name=theme-color]').content=t==='dark'?'#1B1824':'#B995D0';render()}
else if(act==='saveplan'){put('plans',date,{breakfast:$('#p-breakfast').value.trim(),lunch:$('#p-lunch').value.trim(),dinner:$('#p-dinner').value.trim()});close()}
else if(act==='mprev'||act==='mnext'){V.month=new Date(V.month.getFullYear(),V.month.getMonth()+(act==='mnext'?1:-1),1);render()}
else if(act==='addexp')modal(`<h3>Add expense</h3><label class="chk"><input type="radio" name="et" value="grocery" checked> 🛒 Groceries</label><label class="chk"><input type="radio" name="et" value="outside"> 🍴 Eating out</label><label>Amount (₹)<input id="x-a" type="number" min="0" step="any"></label><label>Note<input id="x-n"></label><button class="primary" data-act="savexp">Save</button>`);
else if(act==='savexp'){const a=+$('#x-a').value;if(!a)return toast('Enter an amount');add('expenses',{type:document.querySelector('[name=et]:checked').value,amount:a,date:Date.now(),note:$('#x-n').value});close()}
else if(act==='budget')modal(`<h3>Monthly budget</h3><label>Amount (₹)<input id="b-a" type="number" min="0"></label><button class="primary" data-act="savebud">Save</button>`);
else if(act==='savebud'){put('settings','main',{budget:+$('#b-a').value||0});close()}
else if(act==='notify'){const r=await Notification.requestPermission();toast(r==='granted'?'Alerts enabled 🔔':'Notifications blocked');remind()}});
