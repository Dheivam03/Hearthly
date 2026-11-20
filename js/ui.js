import {$} from './utils.js';
export const modal=h=>{$('#mbody').innerHTML=h;$('#modal').classList.add('open')};
export const close=()=>$('#modal').classList.remove('open');
export const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)};
