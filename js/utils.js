export const $=(s,r=document)=>r.querySelector(s);
export const money=n=>'₹'+(+n||0).toLocaleString('en-IN',{maximumFractionDigits:2});
export const ymd=(d=new Date())=>new Date(d.getTime()-d.getTimezoneOffset()*6e4).toISOString().slice(0,10);
export const left=ms=>ms?(ms-Date.now())/864e5:null;
export const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
export const weekStart=(d=new Date())=>{const x=new Date(d);x.setHours(0,0,0,0);x.setDate(x.getDate()-(x.getDay()+6)%7);return x};
