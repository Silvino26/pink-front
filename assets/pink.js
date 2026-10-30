
(function(){
"use strict";

/* ===== Pink · páginas e sessão ===== */
const PINK=(function(){
  const PAGES={entrar:'entrar.html',esqueci:'esqueci-senha.html',redefinir:'nova-senha.html','primeiro-acesso':'primeiro-acesso.html','acesso-ajuda':'ajuda-acesso.html',
    painel:'painel.html',clientes:'clientes.html',acoes:'estrategia.html',fechamentos:'fechamentos.html',config:'configuracoes.html',plano:'plano.html',ajuda:'ajuda.html'};
  const AUTH=['entrar','esqueci','redefinir','primeiro-acesso','acesso-ajuda'];
  const here=document.body.dataset.page, start=document.body.dataset.start;
  const cfg=window.PINK_CFG&&window.PINK_CFG.url?window.PINK_CFG:null;
  const sb=cfg&&window.supabase?window.supabase.createClient(cfg.url,cfg.anonKey):null;
  const P={start,ready:false,email:null,sb};
  const sec=h=>((h||'').replace(/^#\/?/,'').split('/')[0])||'painel';
  P.fileOf=h=>PAGES[sec(h)]||'painel.html';
  window.goTo=function(h){ if(P.fileOf(h)===here){ location.hash=h; } else { location.href=P.fileOf(h)+h; } };
  // links internos: troca de página quando a seção muda
  document.addEventListener('click',e=>{ const a=e.target.closest&&e.target.closest('a[href^="#/"]'); if(!a) return;
    const h=a.getAttribute('href'); if(sec(h)==='entrar'&&!AUTH.includes(sec(start))){ e.preventDefault(); P.sair(); return; }
    if(P.fileOf(h)!==here){ e.preventDefault(); location.href=P.fileOf(h)+h; } },true);
  const sess=()=>{ try{ return JSON.parse(sessionStorage.getItem('pink_sess')||'null'); }catch(e){ return null; } };
  const setSess=s=>{ try{ s?sessionStorage.setItem('pink_sess',JSON.stringify(s)):sessionStorage.removeItem('pink_sess'); }catch(e){} };
  P.login=async(email,senha)=>{
    if(sb){ const {data,error}=await sb.auth.signInWithPassword({email,password:senha}); if(error){ S.au.err=true; rerender(); return; }
      const {data:u}=await sb.from('usuarios').select('perfil').eq('id',data.user.id).single(); setSess({email,role:u&&u.perfil==='admin'?'admin':'user'}); }
    else setSess({email,role:'admin'});
    location.href='painel.html';
  };
  P.sair=async()=>{ if(sb) await sb.auth.signOut(); setSess(null); location.href='entrar.html'; };
  P.esqueci=async(email)=>{ if(sb) await sb.auth.resetPasswordForEmail(email,{redirectTo:new URL('nova-senha.html',location.href).href}); };
  P.salvarSenha=async(tela,senha)=>{
    if(sb){ const {error}=await sb.auth.updateUser({password:senha}); if(error){ toast(error.message); return; }
      if(tela==='primeiro-acesso'){ const {data}=await sb.auth.getUser(); await sb.from('usuarios').update({aceite_termos_em:new Date().toISOString()}).eq('id',data.user.id); } }
    if(tela==='primeiro-acesso') setSess({email:P.email||'',role:'admin'});
    S.au.done=tela; rerender();
  };
  P.init=async()=>{
    if(sb){ const {data}=await sb.auth.getSession(); P.email=data.session&&data.session.user.email; }   // link do e-mail (convite ou nova senha) já vira sessão aqui
    if(location.hash.includes('access_token')||location.hash.includes('error=')) history.replaceState(null,'',location.pathname+location.search);
    if(!AUTH.includes(sec(start))){ const s=sess(); if(!s&&!(sb&&P.email)){ location.replace('entrar.html'); return false; } S.role=(s&&s.role)||'admin'; }
    P.ready=true; return true;
  };
  return P;
})();
const $=s=>document.querySelector(s);
const brl=n=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const num=n=>n.toLocaleString('pt-BR');
const pct=n=>(Math.round(n*10)/10).toLocaleString('pt-BR')+'%';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const P={
  home:'<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  route:'<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
  cal:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="m9 16 2 2 4-4"/>',
  gear:'<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  card:'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
  help:'<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
  search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  dl:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  undo:'<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-15-6.7L3 13"/>',
  filex:'<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5z"/><path d="M14 2v6h6"/><path d="m9.5 12.5 5 5M14.5 12.5l-5 5"/>',
  mailx:'<path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/><path d="m17 17 4 4M21 17l-4 4"/>',
  sliders:'<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  checkc:'<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  pause:'<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
  xc:'<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>',
  sms:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  mail:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  phone:'<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>',
  chev:'<path d="m9 18 6-6-6-6"/>',
  back:'<path d="m15 18-6-6 6-6"/>',
  out:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
  wallet:'<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
  hand:'<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/>',
  zap:'<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  eye:'<path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0"/><circle cx="12" cy="12" r="3"/>',
  click:'<path d="M14 4.1 12 6M5.1 8l-2.9-.8M6 12l-1.9 2M7.2 2.2 8 5.1"/><path d="M9.04 9.68a.5.5 0 0 1 .64-.64l11 4a.5.5 0 0 1-.05.95l-4.21 1.06a2 2 0 0 0-1.46 1.46l-1.06 4.21a.5.5 0 0 1-.95.05z"/>',
  send:'<path d="M14.54 21.69a.5.5 0 0 0 .94-.02L22 3.5a.5.5 0 0 0-.65-.65L3.32 9.37a.5.5 0 0 0-.02.94l7.5 3.04a2 2 0 0 1 1.1 1.1z"/><path d="m21.85 2.15-10.94 10.94"/>',
  shield:'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  alert:'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4M12 17h.01"/>',
  more:'<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
  edit:'<path d="M12 20h9"/><path d="M16.38 3.62a1 1 0 0 1 3 3L7.37 18.64a2 2 0 0 1-.86.5l-2.87.84a.5.5 0 0 1-.62-.62l.84-2.87a2 2 0 0 1 .5-.86z"/>'
};

P.filter='<path d="M22 3H2l8 9.46V19l4 2v-8.54z"/>';
P.upload='<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>';
P.uplus='<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/>';
P.uminus='<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 11h-6"/>';
P.refresh='<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>';
P.x='<path d="M18 6 6 18M6 6l12 12"/>';
P.sheet='<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M8 13h2M14 13h2M8 17h2M14 17h2"/>';
P.info='<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>';
P.sparkle='<path d="M9.94 14.06 4 20M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/>';
P.down='<path d="M12 5v14M19 12l-7 7-7-7"/>';
P.trash='<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M10 11v6M14 11v6"/>';
P.alL='<path d="M21 6H3M15 12H3M17 18H3"/>';
P.alC='<path d="M21 6H3M17 12H7M19 18H5"/>';
P.play='<polygon points="6 3 20 12 6 21 6 3"/>';
P.sort='<path d="m21 16-4 4-4-4M17 20V4M3 8l4-4 4 4M7 4v16"/>';

const ic=(n,c='')=>`<svg class="i ${c}" viewBox="0 0 24 24" aria-hidden="true">${P[n]}</svg>`;
const SYM='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAABFCAYAAADNRu0cAAAZUklEQVR42t1dd7xV1ZX+1n2PrqCITxQpimLDLqixxUTBwlixJJZRrDE6YIkT+0SNiSXjBOOMLThiL7GbaNTo2BgsGEYEG9jABkiV8t6995s/9tq89bbn3HvOvefe98j+/e6Pyzv3nLP32t9efa8tqFEjKQAEAESkGHF9DQCDAfQFsD6AdQH00HsKAIoAmgHMAzAbwJcAPhaRpTHvy/mvIkL8A7VytNTfdAfQR+nZA0Bn/eSUni0AVujnWwBzRGRZifflABRrTUupFbEsoUiuCWBLANsDGAJgAwCbAtjIEKtUawawFMCnAD4DMAfAXADTAcwA8JGILA/AKPUgYI1B9z0QkOysC3dLAFvpwu0LoL8CsA+ArgC6lHh8C4DPzWcOgI8BTFVazqsXGCVrgolIwYBgewDnABgOYBCAxrjb9RPXx1L9XKbA/BDArQCeFpG86VfD6gREv3g8HfVvXQHsAuA0AEMBDASwZplHfQVglgJskUoUAdAJQE8Am+nHLv6igvEjAH8E8IjlkrWgpWREtAYDvB4ATgFwjK7S7sEAGQGscv1gDFBzwb1FAO8AmAzgfgCve5HtRXScCOto3I7k+gB+BOAQANsA2DhmAbcA+ALAFAAvKOi+VdDlAfQG0ARgE+WOXfT/mwMYAKCXeW5D8OxZACYBuBPAyx6Mdr7bFYB2tZJsBLAHgGsA7GR+VjBgk1rMn/mEBHwHwIUA3haROWYVsyMAMZQa+rfNAewH4CIFTFRbqVz/CQB3qxTI6WLfA8A+yimbAHSrkJbh4p4C4JcAXhGR5VGqVl0BGHC9gwCcDeCHhhOhhqBLS8CvADwE4HYRmdIROGJAv0YARwE4AsAIAxq/eL2B9TaA91X//Vy52zDlbv3N70rRBYHkKTU/xQhavgHgOhF5IAtuKNWsWpIDAIxVPQ/B5HeEVjSiGgCWALgZwP0i8mZ76IgKfIoI1Tg7CMDxCjzbb9/nvHoC5gK4Qw2442O4IyPGnJWqVQwAey+AX4vIu3WjoXF1gOQ/k/yMrhVI5tlxWzHo3zKSE0kOihpbrcStLl7//1NJ/p/pU14/Rf3/CpKzSM4l+SnJBTFjKuinWCda+veR5Lckz4kaX83AR7ILyetMh1q4+rQQiJ+T/BXJJj/GrIGoE9Ng/r8vyaeDCY1avMtJfhMAqxiAtD2bnffL/BjT0k+Sgk9EiiTXBnCPKslRrH61cbNp/z0wPgEwVkQez9LK83TT7+sCuBbAcd7iTUE/1spvm4FY9sbfowCOEZFldtxVA9CAb5C6NoarXtKQ4P5ijH9PYggc5f+TOgGRqtdcIiKzqtVrPIiVI5yiVm1/Y1w0JOyf1GExVqMrUsfTCOAlAMeLyKdJF7EkBF8TgKfVsZwv4VC2oJOMuGPB9DVXw5Xsn/0NgJNE5MlKuGFgpG0I4HoAo81Ycu3oGQjnPlfCiEnLCDwupgIYKSJfJ+GEUs5agwv1PGE4X2MJThIS93O4EM+XOrEfqZN0hT6L6pnvC2A9uJjwGuocbQKwReDHorHGagFGy5luUG64KCkIA5F7lPpEB0S4U+qhXiBjsBcSPNPj43UAB4vIV+VAKCVWsSj3exTAwTHgC3UpqFf+RQAPAHjCTIgH1brqvyJcOCkH4EkRWRzRj10BHAoX8xyqk5mGINWIJAHwGoCzReT1ciLZiNzOAM4HcEVKcZsV6MJ3LQPwtTKDGXChtgUAZiozaNZPThf+pnBRlyb9PhjAhsHiKbWgPE6eUdw0q7+VaQDoiXk9gHEx4LOEnQ9gAoDn4EI2y0nuDOBwdZT6gHnviHdeq765T/RaEREZLRqa2hUuJnoQXBwTNRJtVq9ZAuB0EbnHL86IvnlVpZcuvBF1MtKsEeDbQgDPAnhFxeF7CjgoqDYCsJZKnCa9twgXupsLl+wxE8BCEWkm2Qkujr8zgN1UnehTxu/r8fKoOtcj5zRWedZ/DzX+qdCV4f1A35H8vTqkQXIHkr8l+W4J890/71EFaZuJJNlgPp1IdtZIgf3duiTPIPlXks0Rz86q+ec1k7yGZBdLo4Be25N8y9xXrLErqRj4NR8meTLJDbQ/A0iOJHmV0nqaunaStKUk55CcTPIekuNIbkeykWQTybNJvhrQqRjjprk0pFkSX98G6gS1YGPwfYJ35CpYZ8ZMoHWW+k5dZCcwqRPTAzMA7A4k/8P0LexzFhPuifs8yT6mLzkz2Z/W2C9ajFhgb5AcQ3JTXazdSR6s4EnbmrXvpRbObJIXkuyp4x5G8okYfPj+riR5QJyPUCIAmAPwCIBRgZj13+cBOFdEJpIcAeByZc/l9AN//y0iclqQyCAamtoIwJEqIprhgu5L4ALvz4vIdwaoYRB/Z9W9DquBWLYi+W0Ax5kQ1HBVPzavkb4X6tmLADwP4HYALyhNmgCMVP/sOmrwvaVG31y4jBnf/wa4jJi+AHbXufM6X+h1sDqxHdcS9YpcKyJvkDwbLlGhKQjZecN0lqpO82NFsREloyLEmf8+lWR/ZcXXxYjluPANST5HsptyLrEhHJLrkJxR4hlPqTgOQ1q5IER4OsmvYlZlVt7/L0nupO/7jeEgtQh7+TaX5I1e3THjXY/kLiTXItlLcwfT+Cs7kexDcqxKvVLqTCGCnlfrHKylcxTiwT/n6lhRbEDQi+TrweD9Ax7Rzu6i+kTSGLAXYfNJDo6IKXsxdpeZyHzw8RN/TRwr96Jcv/cjeYPRebLUyfIGEIfp+y41AC1mDLyZJC8geQLJvXUOxI43SpUKdOlc8GmwKoS5b02SPzc6fDFmPKEeOpXkSH3GWEOjggHjdyT3igSh4X4/C4js/31Mr48kuSilruOfcX6EAp9TYu6swCuUGLAH+zC9J5cgYWI/E/DPUjf0z1mp/j6QfChjEH6nxsP5JEfr3ByvCb8IwWeYiKTkgBLSU6XR3QH9y0mFAskL9f7RBieWST2nUiwX+vw8+t8JJpskX9TrPzFiJp8SfM/oym0IxKcH/p0Jnuuv3Vsu6G0TAJSrX2GImCUIPYc4Xd/178G1SgwNarLCTSSnq7Q5TV08tc52ChMnjtdFVo5udrw+nr6rSj17Pa++3VZGZCZqr4BTFDXdqkk538qUE2iBvFcU99N/D9TVXm7S/GR/R3LfJJkXwfsONelj+QxFpR/ngQEIK33H1yTfJrmE5LMkd6lXyljMAh6laVdMMD8txlvQjeSeOg7rAbm5jd7u2a/RwazrZG+SQzQ3LS338L+9J0I0+nd2JvlaCq7qn/k2ya7WmElIzH4q1qrhUnF9+taDRf1kpXSoclx+Jcljo/TbugWQHd066ff9FUBJaLYKhHrvScGCzJPcMeSCg43C7h/gU65fSyl27eR+ZRyjuRiLO61u5vtxTGIHJ1alvUOBOz5jK9lPymKSo/Q9FwTSJIm0oHK9re1Cbde8tVYQnpYCBx5DE/TeGwJPwRVtMEHy6AClX5McSPLYCifJd/LXJbhfd2XVlXLWSWr655Jyh6AfYyrk7OX6tdCI43EJOKF1bUwwC6XuXK8EJ/TW8wsVgHAMyR4k55lxvqeFCVa9ZKJJA6dmCffQkExaMeJfMkf1R4nhfqdUMfmeAJel4YIhVyG5T6AXZgXCFpKH6zvOKZE2b8d+bpTu2hGambPdlcsnwYQf83yS65M8z1xbscqfqSttsrmpWUM7Z1c4Mb5jR8ZwP1GLe0YVrhEr4vtVIqoMp9mO5IcZg7Cobojj9B3nReideSO2T7BuKXTAZkB4Uwpa+d88rPdON9fG+gc3GS5AktP178/HxB/LvbCoeoyEBDWDGJOB6Iv1L1ZA1IHGX9iSIScsGmf1WRHW4mckd+tIIrdMHF7Ut5rUwvecslnj5ReYazNIdoFauQuCDSa7qCVWqfg9vITTuZ9yrmodw/7+pZqQIFWCsJ86SrMEYVEzVcboOy4y9PyE5DaWG3fkZvzFPUl+kIKBeEZxLsmhZvxzSQ4AyRHGx0eSW2p8L+1E+M5MI7l2VMxW/70yYeeTgD8fWOy5KsXLWiRfqhEnHK3v+FfNYhmyuoAvAoQPVyCGX9CY86dGDxxhTWSq3tJf475pdCKbenNYGd3v8wzDYh6ky0kOrxSEwULpQvLxGnDCIslT9B3d6+lYroEeeEEKfHgmspzkJiZhgSTPyWm6tc2mhUl9T6qT+HShCSLyMF1Gtd0H4LOIL9f3laqe4LNsfT27cpWzCFeO7Ab1WTGNLkWXzUzVA6+Gqzx1iKaUN5r0pEpbzvT/DySP062LnTpioaSEbTqSV8Cwc7QJgA/MtfVzANY2f1iuRE8Td/QdWQjgep18BqKX6lw9HeW3Gvrr5wG4zAyg1AQXNS/v6DRp8H6hkOwLt/HqfABPAdhKRPbTlPKGDEHYCcBEkieLSEtHNzxi5gZwpfAWJ5gby6CgOZOTzd8H5QKw+WqazSk7JQAmisgH+H7FJM/9fq6roFgCgP7ahwBuBDBe9zUIvr9dMIowY/RdxYScr6DgexDA1poAuwmAx9RAGA3gMQVhPiMQFgHcSPIsTaiV1QyEUMnUXMF9veE2R/nWLRdkuq6hAJybQvTm4DayXB7F/XSSfwTgWLTdf1uKZd8iIgURWQG3tVESTu6OJLdNkC3jNxH1VPDtrgDrouPfSLOOdxARK46zAKHAFYUcT3Kc2TW4OoGwG0pXYI1rocGVyxmiEm63Uw8FVBJO4sH2nIjMN9wudPheoM9lGe6Xg0v5v8uA6CG47ZG5Ev3xHHJNAGdqH6QM+NbUZ++O1nR1GJHbB8CjatwcoiI6C51QDG2vJ3kj3PYCrgZGiafpJkrrtJUbVsJtt2izIr/R73nVUbaGqwEnKTjPn2gKaVv9CsCecJU+w/3Dce0Kv6FZ5XczgBPhakSX0jl8X44gubMpixEFvm4A/hvAvmgtM2KbB+EGqhNuBLfH9ZWMxLHdM3GG6oXdtG+rg2W8TQK1KKrNVlq2Mp0gFZ7qguhNtwOqlL/Om9dLjU8rFwSwOxmXRj6Bq+IDzSMT43Pyz7wtRdLqS2G6lnlOT+MKaEnow/qY5LY6niczdNHYqMhTJHt3xFhwhB/w8ZRuOt+Gaz6gb4/4OnXWLzdfQTChTCjO//4jn61rOuj9RaMTOp399XElIiibJQyE+/6OMiEk358+JP9c4ZaCT7QP3Um+kmHs2D7nZZL9O6KD2sztegmYUxSjmq1JCZPNtT9AIx+LA0IcRvIHZV7if/sqv7/DTdShO5nJd8y9qo7qXMR+B8+9zkyYHp7XBIOB5t51NYWrEu6VNxk+W+rY3syQE9rY6vvUDfsdyU1jFvGRKeP4fmw3keyroUnfLoaick4ghp/Sl71cYqWvWrVBxCPc3pmU+x0QJ34MqH0cMg7Udi/LPLqC3z7ePalKruXvm0lyEN3m/akZcEI/li9NTP4rkj8JF2B7cj9dDJ2NBEk6Zj9Po0geEqRqHQW6Pb5vRkzgyYrYhYzeD+r//yFbd8p7btOLrVv7CgkmdYrmH8amI5lnj4kgQKgqPGb00qFsrdqQz0hUztIsonVMilGhCgBSwXcj3cYw366yCartCEDfh3+pEHzfqP58nxnzQpJb+hdMZNuaw0Xlip1JnmhETTGCcMtIbqbP8enbBycUTx7wxyUhsgK00SjBK4N3vKPqQ2f9/QE6+Froa2+oPtQ/QxDO02ykieba0yQ3bi+RbCTaIM2UT5Mh5Wl1puZdLjc0+twzLpA8IiCE/9HNev2aMiD8qbd69fd7mWstMROzasN70hVuuOAOQQbPcrp9Hr3Mbw+N0G2zai2Gc/ciubX2p5ABCJdpMvBvzHveVWc+6glEA7616bbWptX9VqloJp3fz9tdq8ZAciO67Y6MyNj9nf7m5og9DOHGdVud4MjA4gk5rP9+YBoRY0B4qibN3k3da2r6cGVM2nuWzevLt+t7z43Ieq4UhCR5MckfG4ubKqJ710M3NODrrAnGabOjPN2H0u2utNUUij57ySr4d0e8JNx7cVXABYom6fJQry8YEHZRQk6O0Q3+p5LVXEJP7G30jFoeXWAJfIZZFBdHWLXVPPta1Y1vMdffoCvT0TUwECRDY8OPZyuTpJsGfC2GNusYw7HFGFm9Q6TvEbEKrXLv67KMMEq9fehCtu73bAx8eV01lft32pmCEnKzSuOgSqhG8/+BbN1C2lIH8BXYWhEhZ+h4aUYLwNP1NfVU7GasbuqiHhlBkxxTlOgwDKgh+PupmrVcSV4oSV6iz3nRPMMvzLt9sMI6GLvRFVgMXRz2oY+p9deX5AMBpyyos9E6gBsZXVxyZ7ojH8DKaplYcPfSBMnZNdL3Qs7taXNOsICtC+rfMuCEdiyf6cJfg+TlbK1UkFfxOIbuGIgoo62hxCcMVTbSVcH4c0QfkibeUvuYI/mn4Bmedm3VLsYXJ4ozqf9Jfz/MpLBb3Wh0FLeKWGW5FMDLBRyvi3LVaXXQ90LJcHKobtgQpH7/VUacMN/Gcdsa0bkt+N0suuKRQ5VJJOWAjXT7YUYavy8rtHZJ8ix97n3BtbwJOXbxnFcCLrQmgL8A+AGiiy3avz0M4HIRmUryhwBOhashPMBcvwvA40EhSR+IL1szmNFn5zbB1Yg+Ca7ooe9XLY8/8ONeBnegzW2Mqf7Otsc0nAdXA7vaM/RsvelpAC4QkSdVkf8FXE3qniZXby5c5vH7aD2ZYJlJCFlLs5M21uSTrdD27LmkhTYt3d+DO894qiZw7Ia2tcV9ttP+IvI0w5MHDBfch6Xr/hUDS/kqr/sZ63eK4Ub3ql9wkNVPIj6huAjDccPoatdNi+HMtWq2Xst+SeK0ASc81/SxkFFfqG6ngfqOzQNruVrjJ4meZ7njjcY9NiXCB1wwemuPWB2VrXs/70mReWKV4ivZeu5aNxUHp9FVLR1SgaGxrfrD/sq2BbbzdQCeHeNso7c0ptVV6UrbLclIR7V66GK6+ti+ePrRqncVgjGsNE77fMSnmACYUTR/ku7suy50m9sKJaJUK0juH6peEuPe6AtX6n+rMlnMUeeEzNO8uXdVBMzQPLDlhm3bw2Zymoc4QPcMDIHbuDQIwI5BAmOaA1+qPV/Ni4/ZcIeuTCHZKCL5tNa6iuORAO7T8WRRS9o+4z24LQw3iUie5N5wZ9LtrXQMxXnS48eiaP0t3MnsfxSRv6j6NV5FOSLw4uk4XkTGhqJXShBsN7gDZxoSTGSpU8uh+sci3UdQMLqDBWBvuD0jUUCQFDpetfqWXVSvAjhRRD5kFQcYeuDS1ZW+UxdauSPP0vYVcIfQPAjgak3q7Qx3vNrmAPaHK2Leq4KFOE0XzyRlKN/Cncr+WwDbldDD/SL5GK4Y+jxNMiZKgcqA8GQAt6ZU8m0qf9rjqcJtAGkMi3AyFsIdEdYH7qCcpMq+N5IeBPAzEZnPDE7PNDQdDOBunZCsjKfwUJxlCpqnlYm8B1ehvqdKtU10wfdQjtxb710Jd7r8Erhdbx/rvQuVjlsokEeoAVNqwXtaLgRwoIhMijLcJAHBrgBwcZXEYvBvqTT1arnAUgXPrQB+CrcVNMnJnn61EsAvReQam8afVXhLadoDwO/VkgeSbdaqBIi+NcOdRPWMgnK2WstLjITxc9CowOwEoB/c8Q8j4I5KSypp7LUTROSO1IvYhng0gpGFY7UWjmHf5tIdHbEXXUm09yvw3k9na/nfmhSHZNuKEePYWkc5ywNurOFQar5WqHG0SD9LWPq4iUICA9DS8xdVpZKx7d6M8XWIsVbSFpD8L5I7afD+pRjncTlL/n6S69htADVO8LSZPX9P6QqpBpBJ56+Se6yFfnEmtAyIdUkd/W/lIhIrSf6nJkley9Zz2pJwauvn/ILkSaE/tM65dmsYKVPrcGLoz437VOOjHJdp2ljACU/WxIP2FsnLSf6NbWsbFlOIB9Iltg6tB9dLKJJH0+3Ai3P4dtRmD+85piapYoFjdRsjNuq1YssRoJBAnPg2k+QRYcp5e++50O/rB9ywPaVNmgSESSS3qLkUMYRaR5X+pe24YsvpJmFIcY5Ga/rW0tColrb6/cdszULuaBzR0rVId0Rvr7qpMIHYGMrWavfsAKK5GMERF9AV3VyvPXS9SnVuA8Q3U3L8etH1M2ot8ErFrlRDKM1U8eUkDgVwjGZBhEd/1jJTBcG7LLDeUr/XBBGZZYBXTHR6dztzQ+8301jvKKXvXuo49v42H56s1YKKOpX973B1dW4Rkbk6/2wXmkYkNQ7RgPiiiFVrTfpqUtatiyDktivoUv1PCThJh61An0Q3DCTOHXSVGqI4VEjjYhV0DQ8rn0R3eGLnarheJhwwihtqnM+XG9sarvLUdgBOgCtJVip2m6Svpfr7NwDPwR3i/L+BqOVqXI10VY6hHYeqE3tqeGw3jVYkiZGHc18OA6/A5YhOVtoWs5QkUiOO2IYdkxwGV8F0OFxlpQEal0xrfVLjlYs1nDRdxex0uBJxxQB4HV7UVkhfCcNami62NYBtFZQbmpBaOfFc1NDcAk1o+ATAm5p48KyIrKwVXaXGhPJgtBnNPQGsD3e0fHf9PlhBOUA5Zd7odV/AVUydpgRaBpeN8Y2ILAne2eh1ln804JXgihKmiKlFup4u8q5K5/U0ocBXqV0Mlzm9AK4e9xKl61wRWRZBV9ZiQf8/96frC7e+MogAAAAASUVORK5CYII=';
/* desenho do infinito, em linha fina, usado como textura */
const INF=(id)=>`<svg class="inf" viewBox="0 0 440 220" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#D80073" stop-opacity="0"/><stop offset=".55" stop-color="#D80073" stop-opacity=".55"/><stop offset="1" stop-color="#D1D5DB" stop-opacity=".25"/></linearGradient></defs>
  ${[0,1,2,3].map(k=>`<path d="M220 110 C ${170-k*10} ${40-k*8}, ${60-k*12} ${40-k*8}, ${60-k*12} 110 S ${170-k*10} ${180+k*8}, 220 110 S ${380+k*12} ${40-k*8}, ${380+k*12} 110 S ${270+k*10} ${180+k*8}, 220 110" fill="none" stroke="url(#${id})" stroke-width="${k?0.8:1.4}" opacity="${1-k*.22}"/>`).join('')}</svg>`;

const REGUA=[
  {d:'D0',c:'E-mail',o:'Contextualizar e abrir caminho',env:985,res:'58% abriram',subj:'Roberta, temos um caminho simples para você',txt:'Olá, Roberta. A Escola Horizonte preparou um caminho simples e seguro para você regularizar a mensalidade em aberto, com desconto, direto pelo celular.'},
  {d:'D2',c:'SMS',o:'Gerar clique no link',env:962,res:'95% entregues',txt:'Escola Horizonte: Roberta, temos uma condição especial para regularizar sua pendência. Acesse {link} Sair: {sair}'},
  {d:'D4',c:'E-mail',o:'Explicar condição e segunda via',env:941,res:'41% abriram',subj:'Até 15% de desconto para regularizar',txt:'Roberta, você pode regularizar a pendência com a Escola Horizonte com até 15% de desconto à vista, ou parcelar no cartão. A segunda via sai na hora.'},
  {d:'D7',c:'SMS',o:'Retomar atenção sem excesso',env:930,res:'94% entregues',txt:'Escola Horizonte: Roberta, sua condição especial continua disponível. Resolva em 2 minutos: {link} Sair: {sair}'},
  {d:'D10',c:'E-mail',o:'Encerrar o primeiro ciclo',env:912,res:'52% abriram',subj:'A melhor condição do mês',txt:'Roberta, esta é a melhor condição do mês para regularizar sua pendência com a Escola Horizonte.'},
  {d:'D14',c:'E-mail',o:'Sugerir o próximo passo',env:0,res:'Começa em 25/09',subj:'Escolha o que cabe para você',txt:'Roberta, se preferir, você pode pagar à vista por Pix ou parcelar no cartão. Escolha o que cabe melhor para você.'}
];
const GAT=[
  {c:'SMS',o:'Abriu o e-mail e não clicou',env:212,res:'31% acessaram',txt:'Escola Horizonte: Roberta, queremos seguir juntos com você. Sua proposta está aqui: {link} Sair: {sair}'},
  {c:'E-mail',o:'Acessou e não pagou',env:164,res:'37 acordos',subj:'Sua proposta continua valendo',txt:'Roberta, você chegou a ver sua proposta. Ela continua valendo: é só tocar no botão e escolher como pagar.'}
];
const SIT={cob:['Em cobrança','c-neutral'],aco:['Acordo aguardando','c-info'],pago:['Pago','c-good'],pau:['Pausado','c-warn'],desc:['Descadastrado','c-risk']};
const CLI=[
  {id:'roberta',n:'Roberta Lima',doc:'CPF ***.456.789-**',v:1060,at:120,s:'pago',st:5,ev:'Pagou R$ 901,00 por Pix',q:'Hoje, 09:40',tel:['(11) •••••-4219',1],mail:['r•••@email.com',1]},
  {id:'anderson',n:'Anderson Freitas',doc:'CPF ***.112.340-**',v:2340,at:95,s:'cob',st:4,ev:'SMS do D7 entregue',q:'Hoje, 09:05',tel:['(11) •••••-3380',2],mail:['a•••@email.com',1]},
  {id:'beatriz',n:'Beatriz Campos',_n:1,doc:'CPF ***.908.215-**',v:954,at:75,s:'cob',st:3,ev:'Viu a proposta e não concluiu',q:'Hoje, 08:52',tel:['(11) •••••-1107',1],mail:['b•••@email.com',2]},
  {id:'luciana',n:'Luciana Prado',doc:'CPF ***.330.671-**',v:780,at:210,s:'aco',st:5,ev:'Fechou acordo de R$ 585,00, vence em 25/09',q:'Ontem, 16:20',tel:['(11) •••••-8841',1],mail:['l•••@email.com',1]},
  {id:'alfa',n:'Empresa Alfa Ltda',doc:'CNPJ **.345.901/0001-**',v:3929,at:95,s:'cob',st:5,ev:'E-mail do D10 aberto',q:'Ontem, 11:48',tel:['(11) •••••-0045',1],mail:['f•••@alfa.com.br',1]},
  {id:'carla',n:'Carla Mendes',doc:'CPF ***.550.118-**',v:1340,at:150,s:'cob',st:5,ev:'Acordo não pago, voltou à cobrança',q:'Ontem, 00:05',tel:['(11) •••••-6620',1],mail:['c•••@email.com',1]},
  {id:'paulo',n:'Paulo Henrique Dias',doc:'CPF ***.774.002-**',v:420,at:400,s:'cob',st:4,ev:'Fora das faixas, proposta sem desconto',q:'Ontem, 09:10',tel:['(11) •••••-7720',1],mail:['',0]},
  {id:'carlos',n:'Carlos Souza',doc:'CPF ***.019.334-**',v:1180,at:58,s:'cob',st:2,ev:'SMS não entregue: número inválido',q:'Hoje, 08:30',tel:['(11) •••••-0012',0],mail:['c•••@email.com',1]},
  {id:'sandra',n:'Sandra Moreira',doc:'CPF ***.219.560-**',v:1150,at:150,s:'desc',st:3,ev:'Pediu para não receber contatos',q:'20/09, 14:02',tel:['(11) •••••-5590',1],mail:['s•••@email.com',1]},
  {id:'tiago',n:'Tiago Nunes',doc:'CPF ***.601.388-**',v:3200,at:45,s:'pau',st:2,ev:'Cobrança pausada por Renata',q:'18/09, 10:30',tel:['(11) •••••-2214',1],mail:['t•••@email.com',1]}
];

const COUNTS={cob:834,aco:27,pago:86,pau:35,desc:3};
const S={role:'admin',busca:'',ordem:'recentes',fs:[],fOpen:false,menu:false,serie:'rec',tip:-1,dr:null,ed:null,edPop:null,edF:-1,edPos:null,cor:'#1E4FA3',logo:true,cal:{open:false,y:2026,m:8,k:0},fun:-1,fsub:null,acOpen:false,pt:[],ntVenc:'',pays:{},edits:{},del:[],tm:'view',extra:{},onote:'',te:null,tpv:'',aco:{},hdr:'logo',fmt:'pdf',pdfb:'nossa',xtab:'resumo',hm:'todos',hc:[],hOpen:false,hsub:null,hx:[],ot:-1,tits:[{venc:''}],venc:'',up:{t:-1,e:0}};

/* casca */
const NAV=[['painel','Painel','home'],['clientes','Clientes','users'],['acoes','Estratégia','route'],['fechamentos','Fechamentos','cal']];
const NAV2=[['config','Configurações','gear'],['plano','Plano','card']];
function shell(cur){
  const ad=S.role==='admin';
  const it=(x)=>`<a class="nav" href="#/${x[0]}" ${cur===x[0]?'aria-current="page"':''}>${ic(x[2])}<span>${x[1]}</span>${x[0]==='clientes'?'<span class="cnt" title="Acordos não pagos">5</span>':''}</a>`;
  $('#side').innerHTML=`<div class="wm brand3"><svg class="pkw" viewBox="-6 -106 486 112" role="img" aria-label="Pink"><defs><linearGradient id="pkwg" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="474" y2="0"><stop offset="0" stop-color="#FF5FB1"/><stop offset=".5" stop-color="#E0187E"/><stop offset="1" stop-color="#C2006A"/></linearGradient></defs><g fill="url(#pkwg)" fill-rule="evenodd"><path d="M0 0V-100H90Q118 -100 118 -72V-70Q118 -42 90 -42H28V0Z M28 -83H86Q90 -83 90 -79V-63Q90 -59 86 -59H28Z"/><path transform="translate(148 0)" d="M0 0V-100H28V0Z"/><path transform="translate(206 0)" d="M0 0V-100H30L92 -32V-100H120V0H90L28 -68V0Z"/><path transform="translate(356 0)" d="M0 0V-100H28V-58L76 -100H116L62 -52L120 0H80L28 -45V0Z"/></g></svg></div>
   <div class="client-chip ${S.cobP?'paused':''}"><span class="lg" aria-hidden="true">EH</span><div><b>Escola Horizonte</b><span>${S.cobP?'Cobrança pausada':'Cobrança ativa'}</span></div></div>
   <nav class="navg" aria-label="Acompanhar">${NAV.map(it).join('')}</nav>
   ${ad?`<nav class="navg" aria-label="Conta">${NAV2.map(it).join('')}</nav>`:''}
   <div class="side-bottom">${it(['ajuda','Ajuda','help'])}<div class="sep"></div><div class="alogo"><span class="asym" role="img" aria-label="Automate 360°" style="-webkit-mask-image:url(${SYM});mask-image:url(${SYM})"></span></div></div>`;
  const ini=ad?'RA':'PR';
  $('#top').innerHTML=`<span class="wmm">Pink</span>
   <div class="umenu"><button class="ubtn" type="button" data-a="menu" aria-haspopup="menu" aria-expanded="${S.menu}" aria-label="Conta de ${ad?'Renata Albuquerque':'Paula Reis'}">${ini}</button>
   ${S.menu?`<div class="udrop" role="menu"><div class="hd"><b>${ad?'Renata Albuquerque':'Paula Reis'}</b><span>${ad?'renata':'paula'}@escolahorizonte.com.br</span><span class="pf">${ad?'Administradora':'Usuária'}</span></div><div class="uthm"><span>Tema</span><div class="segm" role="group" aria-label="Tema"><button type="button" data-a="theme" data-v="dark" aria-pressed="${!document.documentElement.classList.contains('light')}">Escuro</button><button type="button" data-a="theme" data-v="light" aria-pressed="${document.documentElement.classList.contains('light')}">Claro</button></div></div><a class="it" role="menuitem" href="#/entrar" data-a="menu">${ic('out','sm')}Sair</a></div>`:''}</div>`;
  $('#bnav').innerHTML=[...NAV,['ajuda','Mais','more']].map(x=>`<a href="#/${x[0]}" ${cur===x[0]||(x[0]==='ajuda'&&['config','plano'].includes(cur))?'aria-current="page"':''}>${ic(x[2])}<span>${x[0]==='acoes'?'Estratégia':x[1]}</span></a>`).join('');
}

/* PAINEL */
const DIAS=['11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30'];
const SEM=['Sex','Sáb','Dom','Seg','Ter','Qua','Qui','Sex','Sáb','Dom','Seg','Ter','Qua','Qui','Sex','Sáb','Dom','Seg','Ter','Qua'];
const D={
  rec:{v:[0,800,600,2850,3400,4100,4300,3100,1500,1200,4600,5210,6800],q:[0,2,1,6,8,9,10,7,4,3,10,12,14]},
  aco:{q:[0,4,9,6,12,10,7,5,4,13,15,14,19],v:[0,2160,4870,3240,6520,5410,3790,2700,2150,7020,8110,7560,10280]},
  em:[985,8,10,12,955,15,13,14,16,12,930,16,16],
  sms:[0,14,978,18,20,19,17,948,21,15,17,26,11]
};
const sum=a=>a.reduce((x,y)=>x+y,0);
function niceMax(m){ if(m<=0) return 1; const p=Math.pow(10,Math.floor(Math.log10(m))); const n=m/p; const st=[1,1.2,1.6,2,2.5,3,4,5,6,8,10,12].find(x=>x>=n*1.06)||12; return st*p; }
const kfmt=v=>v>=1000?(v/1000).toLocaleString('pt-BR',{maximumFractionDigits:1})+' mil':num(v);
function saud(){ const h=new Date().getHours(); return h<12?'Bom dia':h<18?'Boa tarde':'Boa noite'; }
function vPainel(){
  const ad=S.role==='admin';
  const ser=S.serie; const n=D.rec.v.length;
  const tot=i=> ser==='rec'?D.rec.v[i]: ser==='aco'?D.aco.q[i]: D.em[i]+D.sms[i];
  const mx=niceMax(Math.max(...Array.from({length:n},(_,i)=>tot(i))));
  const tips=i=>{
    const h=`<h4>${SEM[i]}, ${DIAS[i]}/09${i===n-1?' · hoje':''}</h4>`;
    if(ser==='rec') return h+`<div class="r"><span>Recebido</span><b>${brl(D.rec.v[i])}</b></div><div class="r"><span>Pagamentos</span><b>${D.rec.q[i]}</b></div>`;
    if(ser==='aco') return h+`<div class="r"><span>Acordos fechados</span><b>${D.aco.q[i]}</b></div><div class="r"><span>Valor negociado</span><b>${brl(D.aco.v[i])}</b></div>`;
    return h+`<div class="r"><span><i style="--c:rgba(209,213,219,.7)"></i>E-mail</span><b>${num(D.em[i])}</b></div><div class="r"><span><i style="--c:#7FA6D9"></i>SMS</span><b>${num(D.sms[i])}</b></div><div class="r" style="border-top:1px solid rgba(255,255,255,.08);margin-top:6px;padding-top:6px"><span>Total</span><b>${num(D.em[i]+D.sms[i])}</b></div>`;
  };
  const cols=DIAS.map((d,i)=>{
    if(i>=n) return `<div class="dcol fut" aria-hidden="true"><span class="stk"></span><span class="dd">${d}</span></div>`;
    const segs = ser==='acoes'? `<span class="sg a" style="height:${D.em[i]/mx*100}%"></span><span class="sg b" style="height:${D.sms[i]/mx*100}%"></span>` : `<span class="sg a" style="height:100%"></span>`;
    const h = ser==='acoes'? Math.max((D.em[i]+D.sms[i])/mx*100,.8) : Math.max(tot(i)/mx*100,.8);
    const pos=i<3?'l':i>n-3?'rr':'';
    return `<button type="button" id="dc${i}" class="dcol ${S.tip===i?'on':''}" data-a="tip" data-v="${i}" aria-label="${SEM[i]}, ${d} de setembro">${S.tip===i?`<div class="tip ${h>62?(i>n-4?'sl':'sr2'):pos}" role="tooltip" style="${h>62?'top:4px':`bottom:calc(28px + (100% - 28px) * ${h/100} + 10px)`}">${tips(i)}</div>`:''}<span class="stk" style="height:calc((100% - 28px) * ${h/100})">${ser==='acoes'?`<span class="sg a" style="height:${D.em[i]/(D.em[i]+D.sms[i]||1)*100}%"></span><span class="sg b" style="height:${D.sms[i]/(D.em[i]+D.sms[i]||1)*100}%"></span>`:segs}</span><span class="dd">${d}</span></button>`;
  }).join('');
  const grid=[1,.75,.5,.25,0].map(f=>`<span class="${f?'':'z'}" style="bottom:${f*100}%">${f?`<em>${ser==='rec'?kfmt(Math.round(mx*f)):num(Math.round(mx*f))}</em>`:''}</span>`).join('');
  const totalTxt= ser==='rec'?`${brl(sum(D.rec.v))} em ${sum(D.rec.q)} pagamentos`: ser==='aco'?`${sum(D.aco.q)} acordos, ${brl(sum(D.aco.v))} negociados`:`${num(sum(D.em))} e-mails e ${num(sum(D.sms))} SMS`;
  const fun=[['Na carteira',985],['Receberam a mensagem',941],['Acessaram o link',312],['Fecharam acordo',118],['Pagaram',86]];
  const drops=fun.slice(1).map((f,i)=>({lost:fun[i][1]-f[1],rate:(fun[i][1]-f[1])/fun[i][1]*100}));
  const worst=drops.reduce((a,b)=>b.lost>a.lost?b:a);
  const evs=[['var(--good)','var(--good-soft)','Roberta Lima pagou R$ 901,00','Pix confirmado','09:40'],['var(--info)','var(--info-soft)','Beatriz Campos viu a proposta','Saiu sem escolher como pagar','08:52'],['var(--risk)','var(--risk-soft)','Acordo de Carla Mendes não foi pago','Voltou para a régua','00:05'],['var(--good)','var(--good-soft)','Empresa Alfa Ltda fechou acordo','Cartão, em 6 vezes','Ontem']];
  const att=[[5,'var(--risk)','Acordos não pagos','Voltaram para a régua sem desconto','Clientes','#/clientes',0],[15,'var(--warn)','Linhas recusadas na importação','Devedores ainda fora da cobrança','Clientes','#/clientes/atualizar',1],[73,'var(--warn)','Contatos com problema','Telefones e e-mails inválidos','Régua','#/acoes',0],[53,'var(--info)','Fora das faixas de desconto','Recebem proposta sem desconto','Configurações','#/config',1]];
  return `<div class="pagehead"><div><h1>${saud()}, ${ad?'Renata':'Paula'}</h1><p>Visão geral da sua operação de cobrança.</p></div></div>
  <section class="glass kband" aria-label="Indicadores">${INF('g1')}
    <div class="k"><span class="lb"><i style="--c:rgba(209,213,219,.5)"></i>Carteira em cobrança</span><span class="vl"><small>R$</small>412.380</span><span class="sb">valor original dos títulos</span></div>
    <div class="k"><span class="lb"><i style="--c:rgba(209,213,219,.5)"></i>Devedores ativos</span><span class="vl">893</span><span class="sb">de <b>1.500</b> vagas do plano</span></div>
    <div class="k"><span class="lb"><i style="--c:var(--good)"></i>Recuperado no mês</span><span class="vl"><small>R$</small>38.460</span><span class="sb"><b>86</b> pagamentos confirmados</span></div>
    <div class="k"><span class="lb"><i style="--c:var(--info)"></i>Acordos fechados</span><span class="vl">118</span><span class="sb"><b>27</b> aguardando pagamento</span></div>
    <div class="k"><span class="lb"><i style="--c:var(--act)"></i>Taxa de pagamento</span><span class="vl">8,7<small style="vertical-align:0;margin:0 0 0 2px">%</small></span><span class="sb">dos devedores contatados</span></div>
  </section>
  <section class="glass diario" aria-label="Diário do mês">
    <div class="card-h"><div><h2>Diário do mês</h2><p>${ser==='rec'?'Valores recebidos em cada dia do mês':ser==='aco'?'Acordos fechados em cada dia do mês':'E-mails e SMS enviados em cada dia do mês'}</p></div>
      <div class="segm" role="group" aria-label="O que ver no diário">${[['rec','Recebido'],['aco','Acordos'],['acoes','Ações']].map(([k,v])=>`<button type="button" data-a="serie" data-v="${k}" aria-pressed="${ser===k}">${v}</button>`).join('')}</div></div>
    <div class="chart"><div class="gridl">${grid}</div><div class="dcols">${cols}</div></div>
  </section>
  <section class="glass jorn" aria-label="Jornada da carteira">${jornada()}</section>
  <div class="pgrid">
    <section class="glass"><div class="card-h"><div><h2>Últimos acontecimentos</h2><p>Desde ontem</p></div><a class="lk" href="#/clientes">Ver clientes</a></div>
      <div class="feed">${evs.map(e=>`<div class="ev"><span class="dot" style="background:${e[1]};color:${e[0]}"><i></i></span><div><b>${e[2]}</b><span>${e[3]}</span></div><time>${e[4]}</time></div>`).join('')}</div></section>
    <section class="glass"><div class="card-h"><div><h2>Pontos de atenção</h2><p>Onde agir na carteira</p></div></div>
      <div class="att">${att.map(t=>{const ok=!t[6]||ad; return ok?`<a class="at" href="${t[5]}" style="--c:${t[1]}"><span style="display:flex;gap:12px;align-items:center"><span class="bar"></span><span class="n">${t[0]}</span></span><div><b>${t[2]}</b><span>${t[3]}</span></div><span class="go">${t[4]}${ic('chev','sm')}</span></a>`:`<div class="at lock" style="--c:${t[1]}"><span style="display:flex;gap:12px;align-items:center"><span class="bar"></span><span class="n">${t[0]}</span></span><div><b>${t[2]}</b><span>${t[3]}</span></div><span class="go">Com a administradora</span></div>`;}).join('')}</div></section>
  </div>`;
}
function jornada(){
  const st=[['Na carteira',985],['Receberam a mensagem',941],['Acessaram o link',312],['Fecharam acordo',118],['Pagaram',86]];
  const lossTxt=['','não receberam a mensagem','não acessaram o link','não fecharam acordo','não pagaram o acordo'];
  const drops=st.slice(1).map((s,i)=>({i:i+1,lost:st[i][1]-s[1],rate:(st[i][1]-s[1])/st[i][1]*100}));
  const worst=drops.reduce((a,b)=>b.lost>a.lost?b:a);
  const W=600,SH=58,G=6,H=st.length*SH+(st.length-1)*G;
  const wd=v=>(0.24+0.76*v/985)*W;
  const geo=st.map((s,i)=>{ const y=i*(SH+G), wt=wd(s[1]), wb=i<st.length-1?wd(st[i+1][1]):wt*0.86; return {y,wt,wb}; });
  const shapes=st.map((s,i)=>{ const {y,wt,wb}=geo[i];
    const pts=`${(W-wt)/2},${y} ${(W+wt)/2},${y} ${(W+wb)/2},${y+SH} ${(W-wb)/2},${y+SH}`;
    const on=S.fun===i, end=i===st.length-1;
    const fill=on?'url(#fnh)':end?'url(#fne)':`${document.documentElement.classList.contains('light')?`rgba(31,58,107,${0.72-i*0.09})`:`rgba(209,213,219,${0.30-i*0.035})`}`;
    return `<g class="fst ${on?'on':''}" data-a="fun" data-v="${i}" tabindex="0" role="button" aria-label="${s[0]}: ${num(s[1])}"><polygon points="${pts}" fill="${fill}"/>
      <text x="${W/2}" y="${y+SH/2-5}" text-anchor="middle" class="ft1">${s[0]}</text><text x="${W/2}" y="${y+SH/2+18}" text-anchor="middle" class="ft2">${num(s[1])}</text></g>`; }).join('');
  let tip='';
  const i=S.fun;
  if(i>=0){
    const s=st[i], d=i?drops[i-1]:null, g=geo[i];
    const left=((W+Math.max(g.wt,g.wb))/2)/W*100;
    const low=i>=3; const top=low?((g.y+SH)/H*100):((g.y+SH/2)/H*100);
    let rows;
    if(i===0) rows=`<p class="fp">Ponto de partida: todos os devedores com cobrança ativa no mês.</p>`;
    else if(i===1) rows=`<div class="r"><span>Da carteira</span><b>${pct(s[1]/985*100)}</b></div>`;
    else rows=`<div class="r"><span>Da carteira</span><b>${pct(s[1]/985*100)}</b></div><div class="r"><span>Da etapa anterior</span><b>${pct(s[1]/st[i-1][1]*100)}</b></div>`;
    tip=`<div class="ftip ${low?'low':''}" role="tooltip" style="left:calc(${left}% + 10px);top:${top}%"><h4>Etapa ${i+1} de 5</h4>${rows}
      ${d?`<div class="fl ${d===worst?'hot':''}">${d===worst?'<span>Maior perda</span>':''}<b>−${num(d.lost)}</b> ${lossTxt[i]}</div>`:''}</div>`;
  }
  return `<div class="card-h"><div><h2>Jornada da carteira</h2><p>Do contato ao pagamento</p></div></div>
  <div class="fbox"><div class="fwrap2"><svg class="funnel2" viewBox="0 0 ${W} ${H}" role="group" aria-label="Funil da jornada da carteira"><defs>
    <linearGradient id="fnh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#B0005E"/><stop offset=".5" stop-color="#F0288F"/><stop offset="1" stop-color="#B0005E"/></linearGradient>
    <linearGradient id="fne" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2E7D63"/><stop offset=".5" stop-color="#5CC29C"/><stop offset="1" stop-color="#2E7D63"/></linearGradient></defs>${shapes}</svg>${tip}</div></div>`;
}


/* CLIENTES */
const ORD=[['recentes','Mais recentes'],['valor','Maior valor'],['atraso','Maior atraso']];
const FS=[['cob','Em cobrança'],['aco','Acordo aguardando'],['pago','Pago'],['pau','Pausado'],['desc','Descadastrado']];
function vClientes(){
  const ad=S.role==='admin';
  let rows=CLI.filter(c=>(!S.fs.length||S.fs.includes(c.s))&&(!S.busca||(c.n+c.doc).toLowerCase().includes(S.busca.toLowerCase())));
  if(S.ordem==='valor') rows=[...rows].sort((a,b)=>b.v-a.v); else if(S.ordem==='atraso') rows=[...rows].sort((a,b)=>b.at-a.at);
  const tot=S.fs.length?S.fs.reduce((a,k)=>a+COUNTS[k],0):893; const nf=S.fs.length+(S.ordem!=='recentes'?1:0);
  return `<div class="ctool tbar"><label class="search"><span class="sr">Buscar devedor</span>${ic('search','sm')}<input id="lsearch" placeholder="Buscar por nome, CPF ou CNPJ" value="${esc(S.busca)}"></label><span class="sp"></span>
      <div class="pop"><button class="btn-2" type="button" data-a="fopen" aria-expanded="${S.fOpen}" aria-haspopup="dialog">${ic('filter','sm')}Filtros${nf?`<span class="badge">${nf}</span>`:''}</button>
        ${S.fOpen?`<div class="popm wide" role="dialog" aria-label="Filtros">
          <div class="fsel"><span>Ordenar por</span><button type="button" class="fsb" data-a="fsub" data-v="ord" aria-expanded="${S.fsub==='ord'}">${ORD.find(o=>o[0]===S.ordem)[1]}${ic('chev','sm')}</button>
            ${S.fsub==='ord'?`<div class="fopts" role="listbox">${ORD.map(o=>`<button type="button" class="fo" role="option" aria-selected="${S.ordem===o[0]}" data-a="ord" data-v="${o[0]}">${o[1]}${S.ordem===o[0]?ic('check','sm'):''}</button>`).join('')}</div>`:''}</div>
          <div class="fsel"><span>Situação</span><button type="button" class="fsb" data-a="fsub" data-v="sit" aria-expanded="${S.fsub==='sit'}">${S.fs.length===0?'Todas':S.fs.length===1?FS.find(f=>f[0]===S.fs[0])[1]:S.fs.length+' situações'}${ic('chev','sm')}</button>
            ${S.fsub==='sit'?`<div class="fopts">${FS.map(f=>`<label><input type="checkbox" data-a="fs" value="${f[0]}" ${S.fs.includes(f[0])?'checked':''}><span>${f[1]}</span><span class="n">${num(COUNTS[f[0]])}</span></label>`).join('')}</div>`:''}</div>
          <div class="ft"><button class="lk" type="button" data-a="fclear">Limpar filtros</button><button class="btn bsm" type="button" data-a="fclose">Aplicar</button></div></div>`:''}</div>
      <button class="btn-2" type="button" data-a="evd" data-v="list-dl">${ic('dl','sm')}Exportar</button>
      ${ad?`<a class="btn" href="#/clientes/atualizar">${ic('refresh','sm')}Incluir ou retirar</a>`:''}
    </div>
  <section class="glass" style="overflow:visible">
    ${S.fs.length?`<div class="fchips">${S.fs.map(k=>`<button class="fchip" type="button" data-a="frm" data-v="${k}" aria-label="Remover filtro ${FS.find(f=>f[0]===k)[1]}">${FS.find(f=>f[0]===k)[1]}${ic('x','sm')}</button>`).join('')}</div>`:''}
    <div class="tscroll"><table class="cards"><thead><tr><th>Devedor</th><th class="num">Valor</th><th>Atraso</th><th>Situação</th><th>Na régua</th><th>Último acontecimento</th></tr></thead><tbody>
    ${rows.length?rows.map(c=>`<tr data-a="open" data-v="${c.id}" tabindex="0"><td><div class="who"><span class="ini">${c.n.split(' ').map(x=>x[0]).slice(0,2).join('')}</span><div><b>${c.n}</b><span>${c.doc}</span></div></div></td><td class="num" style="font-weight:500;color:var(--title)">${brl(c.v)}</td><td class="hide-m">${c.at} dias</td><td><span class="chip ${SIT[c.s][1]}">${SIT[c.s][0]}</span></td><td class="hide-m">${dots(c.st,c.s)}</td><td class="last" style="grid-column:1/-1"><b>${c.ev}</b><span>${c.q}</span></td></tr>`).join(''):`<tr><td colspan="6" class="muted" style="padding:32px 18px;cursor:default">Nenhum devedor de exemplo com esse filtro.</td></tr>`}
    </tbody></table></div>
    <div class="tfoot"><span>${num(tot)} devedores${S.fs.length?' com o filtro aplicado':''}. Aqui aparecem ${rows.length} de exemplo.</span><span>Lista paginada</span></div>
  </section>`;
}
function dots(st,s){ return `<span class="rgn" title="Fase ${st} de 6 da régua"><b>${st}</b> de 6</span>`; }

/* calendário */
const MESES=['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
const HOJE=new Date(2026,8,23);
function calendario(){
  const y=S.cal.y, m=S.cal.m; const first=new Date(y,m,1).getDay(); const days=new Date(y,m+1,0).getDate();
  const cells=[]; for(let i=0;i<first;i++) cells.push('<span></span>');
  for(let d=1;d<=days;d++){ const dt=new Date(y,m,d); const fut=false; const val=String(d).padStart(2,'0')+'/'+String(m+1).padStart(2,'0')+'/'+y;
    cells.push(`<button type="button" class="cd ${(S.cal.k===-1?S.ntVenc:(S.tits[S.cal.k]||{}).venc)===val?'on':''} ${dt.getTime()===HOJE.getTime()?'today':''}" data-a="calpick" data-v="${val}" ${fut?'disabled title="O vencimento precisa ser uma data passada"':''}>${d}</button>`); }
  return `<div class="popm cal ${S.cal.up?'up':''}" role="dialog" aria-label="Escolher vencimento"><div class="calh"><button type="button" class="xbtn" data-a="calnav" data-v="-1" aria-label="Mês anterior">${ic('back','sm')}</button><b>${MESES[m][0].toUpperCase()+MESES[m].slice(1)} de ${y}</b><button type="button" class="xbtn" data-a="calnav" data-v="1" aria-label="Próximo mês">${ic('chev','sm')}</button></div>
  <div class="calw">${['D','S','T','Q','Q','S','S'].map(x=>`<span>${x}</span>`).join('')}</div><div class="calg">${cells.join('')}</div>
  </div>`;
}

/* ATUALIZAR CARTEIRA */
const UPT=[['upload','Incluir por planilha','Vários devedores de uma vez. Ocupam vagas livres e entram na régua amanhã.'],['uplus','Incluir um devedor','Preencha os dados de uma pessoa e os títulos em aberto.'],['refresh','Atualizar dados','Corrige valores, vencimentos, telefones e e-mails por planilha.'],['uminus','Retirar devedores','Saem da régua no mesmo dia e liberam a vaga.']];
function vAtualizar(){
  if(S.role!=='admin') return `<a class="crumb" href="#/clientes">${ic('back','sm')}Clientes</a><div class="soon"><h1>Sem acesso</h1><p class="muted">Só a administradora inclui ou retira devedores.</p></div>`;
  const u=S.up; const t=u.t; const steps=t===1?['Escolher','Preencher','Concluído']:['Escolher','Enviar a planilha','Revisar','Concluído'];
  const cur=u.e;
  let body='';
  if(cur===0) body=`<div class="opts">${UPT.map((o,i)=>`<button type="button" class="opt" aria-pressed="${t===i}" data-a="upt" data-v="${i}"><span class="oi">${ic(o[0])}</span><b>${o[1]}</b><span>${o[2]}</span></button>`).join('')}</div>
    <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:22px;flex-wrap:wrap"><span class="muted" style="font-size:13.5px">893 de 1.500 vagas ocupadas, 607 livres.</span><button class="btn" type="button" data-a="upnext" ${t<0?'disabled':''}>Continuar</button></div>`;
  else if(t===1&&cur===1) body=`<section class="glass" style="padding:24px;display:flex;flex-direction:column;gap:18px"><h2 style="font-size:16px;font-weight:500">Dados do devedor</h2>
    <div class="g2"><label class="fld">Nome completo ou razão social<input placeholder="Ex.: Marcos Oliveira"></label><label class="fld">CPF ou CNPJ<input placeholder="000.000.000-00" inputmode="numeric"></label><label class="fld">Celular<input placeholder="(11) 90000-0000" inputmode="tel"></label><label class="fld">E-mail<input placeholder="nome@email.com" type="email"></label></div>
    <h2 style="font-size:16px;font-weight:500;margin-top:6px">Títulos em aberto</h2>
    <div class="tits">${S.tits.map((t,k)=>`<div class="tit"><label class="fld">Código<input placeholder="Ex.: MEN-0412"></label><label class="fld">Descrição<input placeholder="Ex.: Mensalidade de agosto/2026"></label><div class="fld calwrap"><span>Vencimento</span><div class="pop"><button type="button" class="datebtn" data-a="calopen" data-v="${k}" aria-expanded="${S.cal.open&&S.cal.k===k}" aria-haspopup="dialog">${t.venc?t.venc:'<span class="faint">dd/mm/aaaa</span>'}${ic('cal','sm')}</button>${S.cal.open&&S.cal.k===k?calendario():''}</div></div><label class="fld">Valor original<input placeholder="R$ 0,00" inputmode="decimal"></label><button type="button" class="del" data-a="deltit" data-v="${k}" aria-label="Excluir este título" title="${S.tits.length===1?'O devedor precisa de pelo menos um título':'Excluir este título'}" ${S.tits.length===1?'disabled':''}>${ic('trash','sm')}</button></div>`).join('')}</div>
    <div><button class="btn-2 bsm" type="button" data-a="addtit">${ic('plus','sm')}Adicionar outro título</button></div></section>
    <div style="display:flex;justify-content:space-between;gap:12px;margin-top:20px;flex-wrap:wrap"><button class="btn-2" type="button" data-a="upback">Voltar</button><button class="btn" type="button" data-a="upnext">Incluir devedor</button></div>`;
  else if(cur===1) body=`<section class="glass" style="padding:24px;display:flex;flex-direction:column;gap:18px">
    <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:center"><div><h2 style="font-size:16px;font-weight:500">${UPT[t][1]}</h2><p class="muted" style="font-size:13.5px">CSV ou Excel. Cada linha é validada antes de qualquer mudança na carteira.</p></div><button class="btn-2 bsm" type="button" data-a="toast" data-m="Planilha modelo baixada">${ic('sheet','sm')}Baixar planilha modelo</button></div>
    <button type="button" class="drop-z" data-a="upnext"><span class="oi">${ic('upload')}</span><b>Arraste a planilha aqui ou escolha o arquivo</b><span class="muted" style="font-size:13px">No protótipo, clique para simular o envio de "carteira-outubro.xlsx"</span></button></section>
    <div style="margin-top:20px"><button class="btn-2" type="button" data-a="upback">Voltar</button></div>`;
  else if(t!==1&&cur===2){
    const r=t===0?[100,15,'vagas livres depois da inclusão']:t===2?[42,3,'nenhuma vaga muda']:[12,0,'vagas liberadas'];
    body=`<section class="glass" style="padding:24px;display:flex;flex-direction:column;gap:18px"><div><h2 style="font-size:16px;font-weight:500">carteira-outubro.xlsx</h2><p class="muted" style="font-size:13.5px">Validamos ${r[0]+r[1]} linhas. Nada foi aplicado ainda.</p></div>
      <div class="vgrid"><div class="vbox"><b style="color:var(--good)">${r[0]}</b><span>${t===3?'devedores a retirar':t===2?'devedores a atualizar':'devedores prontos para entrar'}</span></div><div class="vbox"><b style="color:${r[1]?'var(--warn)':'var(--title)'}">${r[1]}</b><span>linhas recusadas</span></div><div class="vbox"><b>${t===0?'507':t===3?'12':'—'}</b><span>${r[2]}</span></div></div>
      ${r[1]?`<div><h3 style="font-size:13px;font-weight:500;color:var(--muted);margin-bottom:8px">Linhas recusadas</h3><div class="tscroll"><table><thead><tr><th>Linha</th><th>Devedor</th><th>Motivo</th></tr></thead><tbody>${[[14,'Marcos Teixeira','CPF inválido'],[27,'Joana Ribeiro','Sem telefone e sem e-mail'],[58,'Carlos Souza','Título já existe, mesmo código']].slice(0,Math.min(3,r[1])).map(x=>`<tr style="cursor:default"><td>${x[0]}</td><td>${x[1]}</td><td><span class="chip c-warn">${x[2]}</span></td></tr>`).join('')}</tbody></table></div><p class="faint" style="font-size:12.5px;margin-top:8px">${r[1]>3?`E mais ${r[1]-3}. `:''}Baixe as linhas recusadas, corrija e envie de novo.</p></div>`:''}
    </section>
    <div style="display:flex;justify-content:space-between;gap:12px;margin-top:20px;flex-wrap:wrap"><button class="btn-2" type="button" data-a="upback">Voltar</button><div style="display:flex;gap:10px;flex-wrap:wrap">${r[1]?`<button class="btn-2" type="button" data-a="toast" data-m="Linhas recusadas baixadas">${ic('dl','sm')}Baixar recusadas</button>`:''}<button class="btn" type="button" data-a="upnext">${t===3?'Retirar '+r[0]+' devedores':t===2?'Aplicar atualização':'Incluir '+r[0]+' devedores'}</button></div></div>`;
  } else {
    const msg=t===1?['Devedor incluído','Entra na régua amanhã, com as mensagens do mês. Ocupa 1 vaga.']:t===0?['100 devedores incluídos','Começam a receber contatos amanhã. Sobram 507 vagas livres.']:t===2?['42 devedores atualizados','Os novos dados valem a partir do próximo contato.']:['12 devedores retirados','Saíram da régua hoje e liberaram 12 vagas.'];
    body=`<section class="glass" style="padding:36px 28px;display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center"><span style="width:52px;height:52px;border-radius:26px;display:grid;place-items:center;background:var(--good-soft);color:var(--good)">${ic('check')}</span><h2 style="font-size:20px;font-weight:400;color:var(--title)">${msg[0]}</h2><p class="muted" style="max-width:460px">${msg[1]}</p><div style="display:flex;gap:10px;margin-top:8px;flex-wrap:wrap;justify-content:center"><a class="btn-2" href="#/clientes" data-a="upreset">Voltar para clientes</a><button class="btn" type="button" data-a="upreset">Fazer outra atualização</button></div></section>`;
  }
  return `<a class="crumb" href="#/clientes" data-a="upreset">${ic('back','sm')}Clientes</a>
  <div class="pagehead"><div><h1>Incluir ou retirar devedores</h1><p>Mudanças na carteira sempre passam por uma revisão antes de valer.</p></div></div>
  <div class="stepper" aria-label="Etapas">${steps.map((s,i)=>`<div class="stp ${i<cur?'done':''} ${i===cur?'cur':''}"><i></i><span>${s}</span></div>`).join('')}</div>${body}`;
}

/* FICHA */
/* ficha do devedor: resumo */
const FASES=['D0','D2','D4','D7','D10','D14'];
const DOW=['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
function dlab(d){ const [dd,mm,yy]=d.split('/').map(Number); return DOW[new Date(yy,mm-1,dd).getDay()]+', '+d; }
function fullDoc(c){ return c.doc.replace(/\*\*\*/,'318').replace(/-\*\*/,'-04').replace(/\*\*\./,'12.'); }
function fullTel(c){ return c.tel[0].replace('•••••','9'+c.tel[0].slice(-4,-2)+'71'); }
function fullMail(c){ const f=c.n.split(' ')[0].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''); return c.mail[0].replace(/^.•••/,f); }
const vcls=v=>v===1?'okc':v===0?'badc':'neuc';
const vtit=v=>v===1?'Validado':v===0?'Inválido':'Ainda em validação';
function kvs(rows){ return `<div class="kv2">${rows.map(r=>`<div><span>${r[0]}</span><b>${r[1]}</b></div>`).join('')}</div>`; }
/* acordo: títulos agrupados */
const ACO={luciana:{d:'22/09/2026',h:'16:20',venc:'25/09/2026',tol:'29/09/2026',desc:25,forma:'Boleto',cond:'À vista, 25% de desconto'}};
function acoState(c){ return ACO[c.id]?(S.aco[c.id]||'aguardando'):null; }
function acoInfo(c){ const A=ACO[c.id]; const P=perfil(c); const its=P.tits.filter(t=>t.s==='Em acordo'); const tot=its.reduce((a,t)=>a+t.a,0); const val=Math.round(tot*(1-A.desc/100)*100)/100;
  const split=its.map(t=>({t,v:Math.round(val*t.a/tot*100)/100})); if(split.length>1){ const s0=split.slice(0,-1).reduce((a,x)=>a+x.v,0); split[split.length-1].v=Math.round((val-s0)*100)/100; }
  return {A,its,tot,val,split}; }
function acoDrawer(c){
  const I=acoInfo(c); const ad=S.role==='admin'; const F=['Pix','Boleto','Transferência','Dinheiro','Cartão'];
  const tbl=`<div class="ati">${I.split.map(x=>`<div><span><b>${x.t.d}</b><small>${x.t.c}, vencimento ${x.t.v}</small></span><span class="num"><small>${brl(x.t.a)} atualizado</small><b>${brl(x.v)}</b></span></div>`).join('')}</div>`;
  const resumo=kvs([['Fechado em',`${I.A.d} às ${I.A.h}, pela plataforma`],['Condição',I.A.cond],['Valor dos títulos',brl(I.tot)],['Valor do acordo',brl(I.val)],['Forma',I.A.forma],['Vencimento',I.A.venc],['Prazo de tolerância',`2 dias úteis, até ${I.A.tol}`]]);
  if(S.tm==='pay'){ const ready=S.ot>=0&&pmoney(S.tpv)>0&&!!S.ntVenc;
    return {kick:'Acordo',title:'Registrar pagamento do acordo',sub:'Quando o acordo foi pago fora da plataforma',
      body:`<div><h3>Forma de pagamento</h3><div class="otypes">${F.map((x,i)=>`<button type="button" class="otp" aria-pressed="${S.ot===i}" data-a="ot" data-v="${i}">${x}</button>`).join('')}</div></div>
        <div class="g2"><label class="fld">Valor pago<input id="tp-v" placeholder="${brl(I.val)}" value="${esc(S.tpv||'')}" inputmode="numeric"></label><div class="fld calwrap"><span>Data do pagamento</span><div class="pop"><button type="button" class="datebtn" data-a="calopen" data-v="-1" aria-expanded="${S.cal.open&&S.cal.k===-1}">${S.ntVenc||'<span class="faint">dd/mm/aaaa</span>'}${ic('cal','sm')}</button>${S.cal.open&&S.cal.k===-1?calendario():''}</div></div></div>
        <div><h3>Como o pagamento é distribuído nos títulos</h3>${tbl}<p class="faint" style="font-size:12.5px;margin-top:8px">O valor é dividido na proporção do valor atualizado de cada título, e cada título recebe a sua baixa.</p></div>`,
      foot:`<button class="btn" type="button" data-a="asave" ${ready?'':'disabled'}>Registrar pagamento</button><button class="btn-2" type="button" data-a="tm" data-v="view">Voltar</button>`}; }
  return {kick:'Acordo aguardando pagamento',title:`${brl(I.val)} até ${I.A.venc}`,sub:`${I.its.length} títulos negociados juntos`,
    body:`${resumo}<div><h3>Títulos neste acordo</h3>${tbl}</div><div class="warnb" style="background:rgba(255,255,255,.04);color:var(--muted)">${ic('info','sm')}<span>Enquanto o acordo estiver valendo, nenhuma ação é permitida nele nem nos títulos dele: não dá para editar, excluir ou registrar pagamento. O pagamento é confirmado sozinho pela plataforma. Se o devedor pagar direto à empresa, a empresa resolve com ele. Se não for pago até ${I.A.tol}, o acordo é quebrado e cada título volta a ser cobrado pelo valor atualizado.</span></div>`,
    foot:`<span class="faint" style="font-size:13px">Nenhuma ação disponível enquanto o acordo estiver valendo.</span><button class="lk proto-l" type="button" data-a="aquebra">Simular quebra do acordo</button>`};
}

/* exportações: histórico do devedor e lista de clientes */
function xgrid(cols,rows){ const L='ABCDEFGHIJKLMN'; return `<div class="xl"><table><thead><tr><th class="rn"></th>${cols.map((c,i)=>`<th>${L[i]}</th>`).join('')}</tr></thead><tbody><tr class="hd"><td class="rn">1</td>${cols.map(c=>`<td>${c}</td>`).join('')}</tr>${rows.map((r,k)=>`<tr><td class="rn">${k+2}</td>${r.map(v=>`<td>${v}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`; }
function histDl(c){
  const P=perfil(c); const fmt=S.fmt||'pdf'; const br=S.pdfb||'nossa'; const xt=S.xtab||'resumo';
  const H0=hist(c).slice(0,5);
  const opts=`<div class="fmtc">${[['pdf','sheet','PDF','Para ler, imprimir ou enviar. Com layout pronto.'],['xlsx','sheet','Excel','Para filtrar e cruzar dados. Uma aba para cada assunto.']].map(f=>`<button type="button" class="fmt ${fmt===f[0]?'on':''}" aria-pressed="${fmt===f[0]}" data-a="fmt" data-v="${f[0]}"><b>${f[2]}</b><span>${f[3]}</span></button>`).join('')}</div>`;
  let prev;
  if(fmt==='pdf'){
    const own=br==='cliente';
    prev=`<div><h3>Identidade do PDF</h3><div class="segm" role="group" aria-label="Identidade do PDF"><button type="button" data-a="pdfb" data-v="nossa" aria-pressed="${!own}">Padrão da plataforma</button><button type="button" data-a="pdfb" data-v="cliente" aria-pressed="${own}">Com a marca da Escola Horizonte</button></div></div>
    <div><h3>Prévia da primeira página</h3><div class="pdfp"><div class="pg">
      <div class="pg-h" style="${own?`border-color:${S.cor}`:''}">${own?`<span class="pg-logo" style="background:${S.cor}">EH</span><b>Escola Horizonte</b>`:`<span class="pg-wm">PINK</span>`}<small>Histórico de cobrança</small></div>
      <h4>${c.n}</h4><p class="pg-s">${fullDoc(c)} · na base desde ${P.desde} · gerado em 23/09/2026 por Renata Albuquerque</p>
      <div class="pg-k"><div><small>Em aberto</small><b>${brl(P.aberto)}</b></div><div><small>Pago</small><b>${brl(P.pago)}</b></div><div><small>Situação</small><b>${SIT[c.s][0]}</b></div></div>
      <p class="pg-t" style="${own?`color:${S.cor}`:''}">Títulos</p>${P.tits.map(t=>`<div class="pg-r"><span>${t.c} · ${t.d}</span><span>${t.pay?'Pago '+brl(t.pay.v):brl(t.a)}</span></div>`).join('')}
      <p class="pg-t" style="${own?`color:${S.cor}`:''}">Linha do tempo</p>${H0.map(e=>`<div class="pg-r"><span>${e.d} ${e.t} · ${e.title}</span></div>`).join('')}
      <div class="pg-f"><span>${own?'Escola Horizonte · tecnologia Pink':'Pink · by Automate 360°'}</span><span>Página 1 de 3</span></div></div></div></div>`;
  } else {
    const tabs=[['resumo','Resumo'],['titulos','Títulos'],['pagamentos','Pagamentos'],['tempo','Linha do tempo']];
    let g;
    if(xt==='titulos') g=xgrid(['Código','Título','Vencimento','Valor original','Multa','Juros','Em cobrança','Situação'],P.tits.map(t=>[t.c,t.d,t.v,brl(t.o),brl(t.m),brl(t.j),t.pay?'':brl(t.a),t.pay?'Pago':t.s]));
    else if(xt==='pagamentos') g=P.paid.length?xgrid(['Código','Título','Data','Valor pago','Forma','Origem'],P.paid.map(t=>[t.c,t.d,t.pay.d,brl(t.pay.v),t.pay.f,t.pay.src==='plat'?'Plataforma':'Baixa manual'])):`<p class="muted" style="font-size:13px;padding:14px">Sem pagamentos: a aba vai em branco, só com os títulos das colunas.</p>`;
    else if(xt==='tempo') g=xgrid(['Data','Hora','Tipo','Registro','Detalhe'],hist(c).slice(0,8).map(e=>[e.d,e.t,(HCAT.find(x=>x[0]===e.cat)||['',''])[1],e.title,e.desc]));
    else g=xgrid(['Campo','Valor'],[['Devedor',c.n],['Documento',fullDoc(c)],['Situação',SIT[c.s][0]],['Em aberto',brl(P.aberto)],['Pago',brl(P.pago)],['Dias de atraso',String(c.at)],['Fase da régua','Fase '+P.fase],['Contatos recebidos',String(P.contatos)],['Na base desde',P.desde]]);
    prev=`<div><h3>Prévia da planilha</h3><div class="xtabs">${tabs.map(t=>`<button type="button" class="${xt===t[0]?'on':''}" data-a="xtab" data-v="${t[0]}">${t[1]}</button>`).join('')}</div>${g}</div>`;
  }
  return {kick:'Exportar',title:'Baixar histórico',sub:`${c.n}: títulos, pagamentos e linha do tempo`,body:`<div><h3>Formato</h3>${opts}</div>${prev}`,
    foot:`<button class="btn" type="button" data-a="evsave" data-m="${fmt==='pdf'?'Histórico baixado em PDF':'Histórico baixado em Excel'}">${ic('dl','sm')}Baixar ${fmt==='pdf'?'PDF':'Excel'}</button><button class="btn-2" type="button" data-a="evclose">Cancelar</button>`};
}
function listDl(){
  const rows=CLI.filter(c=>!S.fs.length||S.fs.includes(c.s)); const n=S.fs.length?S.fs.reduce((a,k)=>a+COUNTS[k],0):893;
  const g=xgrid(['Devedor','Documento','Telefone','E-mail','Situação','Em aberto','Pago','Dias de atraso','Fase da régua','Último acontecimento'],rows.map(c=>{const P=perfil(c);return [c.n,fullDoc(c),fullTel(c),c.mail[0]?fullMail(c):'',SIT[c.s][0],brl(P.aberto),brl(P.pago),String(c.at),'Fase '+P.fase,c.ev];}));
  return {kick:'Exportar',title:'Exportar lista de clientes',sub:'Planilha do Excel, uma linha por devedor',
    body:`<div><h3>Quais devedores</h3><div class="fmtc"><div class="fmt on"><b>${num(n)} devedores</b><span>${S.fs.length?'Com o filtro de situação aplicado na lista':'Todos os devedores da carteira'}</span></div><div class="fmt" style="cursor:default"><b>Excel (.xlsx)</b><span>Abre no Excel e no Google Planilhas</span></div></div></div>
      <div><h3>Prévia, com ${rows.length} devedores de exemplo</h3>${g}</div>
      <p class="faint" style="font-size:12.5px">Para o histórico completo de um devedor, com títulos e linha do tempo, use "Baixar histórico" na ficha dele.</p>`,
    foot:`<button class="btn" type="button" data-a="evsave" data-m="Lista exportada em Excel">${ic('dl','sm')}Baixar Excel</button><button class="btn-2" type="button" data-a="evclose">Cancelar</button>`};
}

function perfil(c){
  const R=c.id==='roberta'; const pj=/CNPJ/.test(c.doc);
  const desde=R?'10/07/2026':'11/09/2026';
  const venc=d=>{const x=new Date(2026,8,23-d);return String(x.getDate()).padStart(2,'0')+'/'+String(x.getMonth()+1).padStart(2,'0')+'/'+x.getFullYear();};
  let base=R?[['Mensalidade de maio/2026','26/05/2026',1000,'Pago']]
    :c.id==='anderson'?[['Mensalidade de junho/2026','20/06/2026',1103.77,'Em aberto'],['Mensalidade de julho/2026','20/07/2026',1103.78,'Em aberto']]
    :c.id==='beatriz'?[['Mensalidade de junho/2026','10/06/2026',720,'Pago'],['Mensalidade de julho/2026','10/07/2026',450,'Em aberto'],['Mensalidade de agosto/2026','10/08/2026',450,'Em aberto']]
    :c.id==='luciana'?[['Mensalidade de fevereiro/2026','10/02/2026',420,(S.aco.luciana||'aguardando')==='aguardando'?'Em acordo':'Em aberto'],['Material didático 2026','10/02/2026',315.85,(S.aco.luciana||'aguardando')==='aguardando'?'Em acordo':'Em aberto']]
    :c.id==='alfa'?[['Convênio corporativo, maio/2026','20/05/2026',1850,'Em aberto'],['Convênio corporativo, junho/2026','20/06/2026',1850,'Em aberto'],['Convênio corporativo, julho/2026','20/07/2026',1856.6,'Em aberto']]
    :[['Mensalidade em aberto',venc(c.at),Math.round(c.v/1.06*100)/100,c.s==='pago'?'Pago':'Em aberto']];
  const jr=0.04;
  const cod=(k)=>(pj?'CONV':'MEN')+'-'+c.id.slice(0,3).toUpperCase()+'-'+String(4120+k*37+Math.round(c.v)%97).padStart(5,'0');
  let tits=base.map((t,k)=>{ const key=c.id+':'+k; const e=S.edits[key]||{};
    const o=e.o!=null?e.o:t[2];
    const DEF={'roberta:0':{v:901,d:'23/09/2026',f:'Pix',src:'plat'},'beatriz:0':{v:686.88,d:'28/08/2026',f:'Pix',src:'plat'},'alfa:0':{v:1900,d:'20/08/2026',f:'Boleto',src:'man'}};
    const pay=S.pays[key]!==undefined?S.pays[key]:(DEF[key]||null);
    return {k,key,c:cod(k),d:e.d||t[0],v:e.v||t[1],o,m:o*0.02,j:o*jr,a:o*1.02+o*jr,s:pay?'Pago':t[3],pay}; }).filter(t=>!S.del.includes(t.key));
  const open=tits.filter(t=>!t.pay), paid=tits.filter(t=>t.pay);
  return {desde,meses:R?'há 2 meses e meio':'há 12 dias',contatos:R?19:c.st+1,fase:R?5:Math.max(1,c.st),tits,open,paid,
    aberto:open.reduce((a,t)=>a+t.a,0),pago:paid.reduce((a,t)=>a+t.pay.v,0),O:open.reduce((a,t)=>a+t.o,0),M:open.reduce((a,t)=>a+t.m,0),J:open.reduce((a,t)=>a+t.j,0),regs:R?28:5};
}
function vFicha(id,tab){
  tab=tab==='historico'?'historico':'titulos';
  const c=CLI.find(x=>x.id===id)||CLI[0]; const ad=S.role==='admin'; const P=perfil(c);
  const pj=/CNPJ/.test(c.doc); const ativo=c.s==='cob'||c.s==='pau';
  const quit=P.open.length===0&&P.paid.length>0;
  const desc=c.at>=91&&c.at<=180?15:c.at<=90?10:c.at<=360?25:0;
  const AS=acoState(c); const AI=AS==='aguardando'?acoInfo(c):null;
  const acordo=AI?['Acordo aguardando',brl(AI.val),`${AI.A.forma.toLowerCase()}, vence ${AI.A.venc}`]:c.s==='pago'||quit?['Acordo pago',brl(P.pago),'quitado em '+(P.paid[0]?P.paid[0].pay.d:'')]:c.s==='aco'?['Acordo aguardando',brl(P.aberto*0.85),'boleto vence em 25/09/2026']:['Proposta atual',brl(P.aberto*(1-desc/100)),desc?`à vista, ${desc}% de desconto`:'sem desconto, fora das faixas'];
  const k1=quit?['Situação da dívida','','']:['Em aberto',brl(P.aberto),`${P.open.length} ${P.open.length===1?'título':'títulos'}, ${c.at} dias de atraso`];
  const faseTxt=c.s==='pago'||quit?'pagou nesta fase':c.s==='aco'?'suspensa no acordo':c.s==='pau'?'pausada nesta fase':c.s==='desc'?'saiu nesta fase':'em andamento';
  const tg={'Pago':'c-good','Em acordo':'c-info','Em aberto':'c-neutral'};
  const acts=[['ocor','plus','Registrar ocorrência','Ligação, WhatsApp ou promessa',1]];
  if(ativo) acts.push(['pausa','pause',c.s==='pau'?'Retomar cobrança':'Pausar cobrança',c.s==='pau'?'Volta a receber os contatos da régua':'Para os contatos, continua na base',1]);
  acts.push(['hist-dl','dl','Baixar histórico','Em PDF ou Excel',1]);
  if(ad) acts.push(['retirar','uminus','Retirar da base','Sai da carteira e libera a vaga',0]);
  const tbTit=`<div class="tscroll"><table class="cards tt2"><thead><tr><th>Código</th><th>Título</th><th>Vencimento</th><th class="num">Valor original</th><th class="num">Em cobrança</th><th class="num">Pago</th><th></th></tr></thead><tbody>
    ${AI?`<tr class="agrp" data-a="evd" data-v="acordo" tabindex="0"><td class="code hide-m">ACORDO</td><td><b style="font-weight:500;color:var(--title)">Acordo de ${AI.A.d}</b><small class="inac">${AI.its.length} títulos negociados juntos</small></td><td class="hide-m">${AI.A.venc}</td><td class="num hide-m">${brl(AI.its.reduce((a,t)=>a+t.o,0))}</td><td class="num"><span style="color:var(--title);font-weight:500">${brl(AI.val)}</span><small class="inac">valor do acordo</small></td><td class="num"><span class="faint">—</span></td><td class="go hide-m">${ic('chev','sm')}</td></tr>`:''}
    ${P.tits.length?P.tits.map(t=>`<tr class="${AI&&t.s==='Em acordo'?'ach':''}" data-a="evd" data-v="tit:${t.k}" tabindex="0" title="Ver detalhes do título"><td class="code hide-m">${t.c}</td><td><b style="font-weight:500;color:var(--title)">${t.d}</b></td><td class="hide-m">${t.v}</td><td class="num hide-m">${brl(t.o)}</td><td class="num">${t.pay?'<span class="faint">—</span>':t.s==='Em acordo'?`<span class="faint">${brl(t.a)}</span><small class="inac">antes do acordo</small>`:`<span style="color:var(--title);font-weight:500">${brl(t.a)}</span>`}</td><td class="num">${t.pay?`<b class="money" style="font-weight:500">${brl(t.pay.v)}</b>`:'<span class="faint">—</span>'}</td><td class="go hide-m">${ic('chev','sm')}</td></tr>`).join(''):`<tr style="cursor:default"><td colspan="7" class="muted" style="padding:24px 18px">Nenhum título nesta cobrança.</td></tr>`}
    </tbody><tfoot><tr><td colspan="4">Total${AI?' em cobrança, pelo acordo':''}</td><td class="num"><b>${brl(AI?AI.val+P.open.filter(t=>t.s!=='Em acordo').reduce((a,t)=>a+t.a,0):P.aberto)}</b></td><td class="num"><b class="money">${brl(P.pago)}</b></td><td></td></tr></tfoot></table></div>`;
  return `<div class="crow"><a class="crumb" href="#/clientes">${ic('back','sm')}Clientes</a></div>
  <section class="glass fx">${INF('g3')}
    <div class="fx-h">
      <div class="fx-id"><div class="fic-n"><h1>${c.n}</h1><span class="chip ${SIT[quit?'pago':c.s][1]}">${SIT[quit?'pago':c.s][0]}</span><span class="tagpf">${pj?'Pessoa jurídica':'Pessoa física'}</span></div>
        <div class="fic-m"><span>${fullDoc(c)}</span><span class="${vcls(c.tel[1])}" title="${vtit(c.tel[1])}">${ic('phone','sm')}${fullTel(c)}</span><span class="${c.mail[0]?vcls(c.mail[1]):'neuc'}" title="${c.mail[0]?vtit(c.mail[1]):'Sem e-mail'}">${ic('mail','sm')}${c.mail[0]?fullMail(c):'Sem e-mail'}</span><span>Na base desde ${P.desde}</span></div></div>
      <div class="pop acpop"><button class="btn" type="button" data-a="acopen" aria-expanded="${S.acOpen}" aria-haspopup="menu">Ações${ic('chev','sm')}</button>
        ${S.acOpen?`<div class="popm acm" role="menu">${acts.map(a=>`${a[0]==='retirar'?'<div class="hr"></div>':''}<button type="button" role="menuitem" class="aci ${a[4]?'':'dg'}" data-a="evd" data-m="Histórico de ${c.n} baixado em PDF" data-v="${a[0]}"><span class="chi">${ic(a[1],'sm')}</span><span><b>${a[2]}</b><small>${a[3]}</small></span></button>`).join('')}</div>`:''}</div>
    </div>
    <div class="fx-k">
      ${quit?`<div class="kq reg"><span class="rgi">${ic('check')}</span><div><span>${k1[0]}</span><b>Regularizada</b><small>quitada em ${P.paid[P.paid.length-1].pay.d}</small></div></div>`:`<div class="kq"><span>${k1[0]}</span><b>${k1[1]}</b><small>${k1[2]}</small></div>`}
      <button type="button" class="kq clk" data-a="evd" data-v="prop"><span>${acordo[0]}</span><b>${acordo[1]}</b><small>${acordo[2]}${ic('chev','sm')}</small></button>
      <div class="kq"><span>Contatos recebidos</span><b>${P.contatos}</b><small>desde que entrou, ${P.meses}</small></div>
      <button type="button" class="kq clk wide" data-a="evd" data-v="fase:${P.fase-1}"><span>Posição na régua</span><div class="fz hvwrap">${FASES.map((f,k)=>{ const on=S.ftip==='z'+k; const st=k<P.fase-1?'Já recebeu':k===P.fase-1?'Fase atual, '+faseTxt:'Ainda vai receber'; return `<i class="hv ${k<P.fase-1?'on':''} ${k===P.fase-1?'cur':''} ${on?'hov':''}" data-v="z${k}"><em>${k+1}</em>${on?`<span class="fzq"><b>Fase ${k+1}: ${REGUA[k].o}</b><span>${REGUA[k].d}, por ${REGUA[k].c==='SMS'?'SMS':'e-mail'}</span><small>${st}</small></span>`:''}</i>`;}).join('')}</div></button>
    </div>
    ${quit?`<div class="fic-note">${ic('info','sm')}<span>O histórico de devedores quitados fica disponível por 90 dias, até ${(()=>{const p=P.paid[P.paid.length-1].pay.d.split('/'); const d=new Date(+p[2],+p[1]-1,+p[0]+90); return String(d.getDate()).padStart(2,'0')+'/'+String(d.getMonth()+1).padStart(2,'0')+'/'+d.getFullYear();})()}. Para guardar por mais tempo, contrate o armazenamento adicional.</span><a class="btn-2 bsm" href="#/plano/armazenamento">Ver armazenamento</a></div>`:''}
    <div class="fx-tabs" role="tablist"><a role="tab" href="#/clientes/${c.id}" aria-selected="${tab==='titulos'}">Títulos<span class="n">${P.tits.length}</span></a><a role="tab" href="#/clientes/${c.id}/historico" aria-selected="${tab==='historico'}">Linha do tempo<span class="n">${P.regs+(S.extra[c.id]||[]).length}</span></a>
      ${tab==='historico'?histTools():(ad&&c.s!=='desc'?`<span class="sp"></span><span class="faint hide-m" style="font-size:12.5px">Clique em um título para pagar, editar ou excluir</span><button class="btn-2 bsm" type="button" data-a="evd" data-v="novotit">${ic('plus','sm')}Incluir título</button>`:'')}</div>
    <div class="fx-b">${tab==='titulos'?tbTit:histList(c)}</div>
  </section>`;
}
const pmoney=x=>{ const n=parseFloat(String(x||'').replace(/[^\d,]/g,'').replace(',','.')); return isNaN(n)?null:n; };
const mmask=v=>{ const d=String(v||'').replace(/\D/g,''); return d?brl(parseInt(d,10)/100):''; };
function titDrawer(c,k){
  const P=perfil(c); const t=P.tits.find(x=>x.k===k); if(!t) return {kick:'Títulos',title:'Título removido',sub:'',body:'',foot:''};
  const ad=S.role==='admin'; const m=S.tm; const formas=['Pix','Boleto','Transferência','Dinheiro','Cartão'];
  const info=kvs([['Código',t.c],['Vencimento',t.v],['Valor original',brl(t.o)],['Multa de 2%',brl(t.m)],['Juros até hoje',brl(t.j)],['Valor atualizado',brl(t.a)]]);
  const payInfo=t.pay?kvs([['Data do pagamento',t.pay.d],['Valor pago',brl(t.pay.v)],['Forma de pagamento',t.pay.f],['Como foi pago',t.pay.src==='plat'?'Pela plataforma':'Fora da plataforma, com baixa manual'],...(t.pay.src==='plat'?[]:[['Baixa registrada por','Renata Albuquerque']])]):'';
  const payForm=(v)=>`<div><h3>Forma de pagamento</h3><div class="otypes">${formas.map((x,i)=>`<button type="button" class="otp" aria-pressed="${S.ot===i}" data-a="ot" data-v="${i}">${x}</button>`).join('')}</div></div>
    <div class="g2"><label class="fld">Valor pago<input id="tp-v" placeholder="${brl(v)}" value="${esc(S.tpv||'')}" inputmode="numeric"></label><div class="fld calwrap"><span>Data do pagamento</span><div class="pop"><button type="button" class="datebtn" data-a="calopen" data-v="-1" aria-expanded="${S.cal.open&&S.cal.k===-1}">${S.ntVenc||'<span class="faint">dd/mm/aaaa</span>'}${ic('cal','sm')}</button>${S.cal.open&&S.cal.k===-1?calendario():''}</div></div></div>`;
  const ready=S.ot>=0&&pmoney(S.tpv)>0&&!!S.ntVenc;
  let body, foot='';
  const cancel=`<button class="btn-2" type="button" data-a="tm" data-v="view">Voltar</button>`;
  if(m==='pay'){ body=info+payForm(t.a)+`<p class="muted" style="font-size:13px">Preencha forma, valor e data para registrar. Se o valor pago for menor que o atualizado, o título fica encerrado com o valor informado.</p>`; foot=`<button class="btn" type="button" data-a="tsave" data-v="pay" ${ready?'':'disabled'}>Registrar pagamento</button>${cancel}`; }
  else if(m==='fix'){ body=payInfo+`<h3 style="margin-top:4px">Dados corretos</h3>`+payForm(t.pay.v)+`<div class="warnb">${ic('alert','sm')}<span>A correção muda o fechamento do mês do pagamento e fica na trilha de auditoria, com o valor anterior.</span></div>`; foot=`<button class="btn" type="button" data-a="tsave" data-v="fix" ${ready?'':'disabled'}>Salvar correção</button>${cancel}`; }
  else if(m==='undo'){ body=payInfo+`<div class="warnb">${ic('alert','sm')}<span>O título volta a ficar em aberto, com multa e juros recalculados até hoje, e volta para a régua. O fechamento do mês é ajustado.</span></div>`; foot=`<button class="btn dngb" type="button" data-a="tsave" data-v="undo">Desfazer pagamento</button>${cancel}`; }
  else if(m==='edit'){ const E=S.te||{d:t.d,o:brl(t.o)}; const nv=S.ntVenc||t.v; const changed=E.d.trim()!==t.d||pmoney(E.o)!==Math.round(t.o*100)/100||nv!==t.v;
    body=`<label class="fld">Código do título<input value="${t.c}" readonly><span class="hint">O código não pode ser alterado. Se estiver errado, exclua o título e inclua de novo.</span></label>
      <label class="fld">Descrição<input id="te-d" value="${esc(E.d)}"></label>
      <div class="g2"><div class="fld calwrap"><span>Vencimento</span><div class="pop"><button type="button" class="datebtn" data-a="calopen" data-v="-1" aria-expanded="${S.cal.open&&S.cal.k===-1}">${nv}${ic('cal','sm')}</button>${S.cal.open&&S.cal.k===-1?calendario():''}</div></div><label class="fld">Valor original<input id="te-o" value="${esc(E.o)}" inputmode="numeric"></label></div>
      <p class="muted" style="font-size:13px">Multa e juros são recalculados a partir dos novos dados.</p>`;
    foot=`<button class="btn" type="button" data-a="tsave" data-v="edit" ${changed&&pmoney(E.o)>0&&E.d.trim()?'':'disabled'}>Salvar alterações</button>${cancel}`; }
  else if(m==='del'){ body=info+`<div class="fld"><span>Motivo</span><div class="otypes one">${['Título cancelado','Negociado fora da plataforma','Outro'].map((x,i)=>`<button type="button" class="otp" aria-pressed="${S.ot===i}" data-a="ot" data-v="${i}">${x}</button>`).join('')}</div></div><div class="warnb">${ic('alert','sm')}<span>O título sai da cobrança e deixa de contar no valor em aberto. A exclusão fica na linha do tempo, com o motivo.</span></div>`; foot=`<button class="btn dngb" type="button" data-a="tsave" data-v="del" ${S.ot>=0?'':'disabled'}>Excluir título</button>${cancel}`; }
  else if(t.s==='Em acordo'){ body=info+`<div class="warnb" style="background:rgba(255,255,255,.04);color:var(--muted)">${ic('info','sm')}<span>Este título está num acordo. Enquanto o acordo valer, nenhuma ação é permitida nele.</span></div>`; foot=`<button class="btn-2" type="button" data-a="evd" data-v="acordo">Ver o acordo</button>`; }
  else if(t.pay){ body=payInfo; foot=ad&&t.pay.src!=='plat'?`<button class="btn-2" type="button" data-a="tm" data-v="fix">${ic('edit','sm')}Corrigir pagamento</button><button class="btn-2 dng" type="button" data-a="tm" data-v="undo">${ic('undo','sm')}Desfazer pagamento</button>`:t.pay.src==='plat'?`<span class="faint" style="font-size:13px">Pagamentos feitos pela plataforma não podem ser alterados.</span>`:''; }
  else { body=info; foot=ad?`<button class="btn" type="button" data-a="tm" data-v="pay">${ic('wallet','sm')}Registrar pagamento</button><button class="btn-2" type="button" data-a="tm" data-v="edit">${ic('edit','sm')}Editar</button><button class="btn-2 dng" type="button" data-a="tm" data-v="del">${ic('trash','sm')}Excluir</button>`:`<span class="faint" style="font-size:13px">Só a administradora altera títulos.</span>`; }
  const ttl={pay:'Registrar pagamento',fix:'Corrigir pagamento',undo:'Desfazer pagamento',edit:'Editar título',del:'Excluir título'}[m];
  return {kick:t.pay&&!ttl?'Pagamento do título':t.c,title:ttl||t.d,sub:ttl?t.d:(t.pay?t.c:'Título em aberto'),body,foot};
}
function histTools(){
  const nf=(S.hm!=='todos'?1:0)+S.hc.length;
  return `<span class="sp"></span><div class="pop"><button class="btn-2 bsm" type="button" data-a="hopen" aria-expanded="${S.hOpen}">${ic('filter','sm')}Filtros${nf?`<span class="badge">${nf}</span>`:''}</button>
      ${S.hOpen?`<div class="popm wide" role="dialog" aria-label="Filtros da linha do tempo">
        <div class="fsel"><span>Mês</span><button type="button" class="fsb" data-a="hsub" data-v="m" aria-expanded="${S.hsub==='m'}">${HMES.find(x=>x[0]===S.hm)[1]}${ic('chev','sm')}</button>
          ${S.hsub==='m'?`<div class="fopts">${HMES.map(x=>`<button type="button" class="fo" aria-selected="${S.hm===x[0]}" data-a="hm" data-v="${x[0]}">${x[1]}${S.hm===x[0]?ic('check','sm'):''}</button>`).join('')}</div>`:''}</div>
        <div class="fsel"><span>Tipo de registro</span><button type="button" class="fsb" data-a="hsub" data-v="c" aria-expanded="${S.hsub==='c'}">${S.hc.length?S.hc.length+(S.hc.length===1?' tipo':' tipos'):'Todos'}${ic('chev','sm')}</button>
          ${S.hsub==='c'?`<div class="fopts">${HCAT.map(x=>`<label><input type="checkbox" data-a="hc" value="${x[0]}" ${S.hc.includes(x[0])?'checked':''}><span>${x[1]}</span></label>`).join('')}</div>`:''}</div>
        <div class="ft"><button class="lk" type="button" data-a="hclear">Limpar filtros</button><button class="btn bsm" type="button" data-a="hclose">Aplicar</button></div></div>`:''}</div>
    <button class="btn-2 bsm" type="button" data-a="toast" data-m="Linha do tempo baixada em PDF">${ic('dl','sm')}Baixar</button>`;
}
function histList(c){
  const all=hist(c).map((e,i)=>({...e,i}));
  const rows=all.filter(e=>(S.hm==='todos'||e.m===S.hm)&&(!S.hc.length||S.hc.includes(e.cat)||(e.sub&&e.sub.some(x=>S.hc.includes(x.cat)))));
  const groups=[]; rows.forEach(e=>{ let g=groups.find(x=>x.d===e.d); if(!g){g={d:e.d,it:[]};groups.push(g);} g.it.push(e); });
  const months=[...new Set(rows.map(e=>e.m))];
  const item=(e,path,child)=>`<div class="te2 ${e.cls||''} ${child?'child':''}"><button type="button" class="te" data-a="hev" data-v="${path}"><time>${e.t}</time><span class="te-ic">${ic(e.ic,'sm')}</span><span class="te-b"><b>${e.title}</b><span>${e.desc}</span></span><span class="te-go">${ic('chev','sm')}</span></button>
    ${e.sub?`<button type="button" class="sub-t" data-a="hx" data-v="${e.i}" aria-expanded="${S.hx.includes(e.i)}">${ic('chev','sm')}${S.hx.includes(e.i)?'Ocultar':'Ver'} as ${e.sub.length} etapas desta negociação</button>${S.hx.includes(e.i)?`<div class="subl">${e.sub.map((x,j)=>item(x,e.i+'.'+j,1)).join('')}</div>`:''}`:''}</div>`;
  return groups.length?months.map(m=>`<div class="tm">${HMES.find(x=>x[0]===m)[1]}</div>`+groups.filter(g=>g.d.slice(3)===m).map(g=>`<div class="tg"><div class="tg-d">${dlab(g.d)}</div>${g.it.map(e=>item(e,String(e.i),0)).join('')}</div>`).join('')).join(''):`<p class="muted" style="padding:28px 24px">Nenhum registro com esses filtros.</p>`;
}

function H(d,t,cat,ic,cls,title,desc,det,sub){ return {d,t,m:d.slice(3),cat,ic,cls,title,desc,det,sub}; }
function hist(c){ return [...(S.extra[c.id]||[]),...hist0(c)]; }
function hist0(c){
  if(c.id==='roberta') return [
    H('23/09/2026','09:41','carteira','route','','Saiu da régua: dívida paga','Os contatos de reforço e o lembrete do acordo foram cancelados',{k:'gen',rows:[['O que aconteceu','Pagamento confirmado encerrou a cobrança'],['Contatos cancelados','Lembrete de vencimento e fase 6 (D14)'],['Vaga do plano','Liberada']]}),
    H('23/09/2026','09:05','acordo','hand','key','Negociação concluída e paga','Do SMS ao Pix em 35 minutos',{k:'gen',rows:[['Começou','SMS de reforço às 09:05'],['Terminou','Pix confirmado às 09:40'],['Resultado','Acordo à vista de R$ 901,00, pago']]},[
      H('23/09/2026','09:05','regua','zap','','Gatilho: abriu o e-mail e não clicou','SMS de reforço entregue',{k:'fase',m:GAT[0],gat:1,st:[['Situação','Entregue às 09:05']]}),
      H('23/09/2026','09:31','acordo','click','hot','Abriu a proposta','Pelo link do SMS, no celular',{k:'abr'}),
      H('23/09/2026','09:32','acordo','shield','','Identidade confirmada','E-mail informado já estava cadastrado',{k:'idt'}),
      H('23/09/2026','09:35','acordo','hand','key','Acordo fechado','À vista por Pix, 15% de desconto, vencimento 24/09/2026',{k:'aco'}),
      H('23/09/2026','09:40','acordo','wallet','key','Pagamento confirmado','Pix de R$ 901,00, um dia antes do vencimento',{k:'pag'})]),
    H('21/09/2026','10:00','regua','mail','','Fase 5 da régua realizada','E-mail, aberto em 21/09 às 10:12',{k:'fase',m:REGUA[4],st:[['Enviado','21/09/2026 às 10:00'],['Aberto','21/09/2026 às 10:12'],['Clicou na proposta','Não']]}),
    H('18/09/2026','09:04','regua','sms','','Fase 4 da régua realizada','SMS entregue',{k:'fase',m:REGUA[3],st:[['Enviado','18/09/2026 às 09:04'],['Situação','Entregue']]}),
    H('15/09/2026','10:00','regua','mail','','Fase 3 da régua realizada','E-mail, aberto em 15/09 às 14:21',{k:'fase',m:REGUA[2],st:[['Enviado','15/09/2026 às 10:00'],['Aberto','15/09/2026 às 14:21'],['Clicou na proposta','Não']]}),
    H('13/09/2026','09:02','regua','sms','','Fase 2 da régua realizada','SMS entregue',{k:'fase',m:REGUA[1],st:[['Enviado','13/09/2026 às 09:02'],['Situação','Entregue']]}),
    H('11/09/2026','10:00','regua','mail','','Fase 1 da régua realizada','E-mail entregue, não aberto',{k:'fase',m:REGUA[0],st:[['Enviado','11/09/2026 às 10:00'],['Aberto','Não']]}),
    H('01/09/2026','08:00','carteira','refresh','','Cobrança retomada','Volta à régua de setembro, a partir da fase 1',{k:'gen',rows:[['Retomada por','Renata Albuquerque'],['Motivo informado','Promessa de pagamento não cumprida']]}),
    H('20/08/2026','15:12','manual','pause','','Cobrança pausada','Por Renata: aguardar promessa de pagamento',{k:'gen',rows:[['Pausada por','Renata Albuquerque'],['Motivo','Devedora prometeu pagar no fim de agosto'],['Contatos suspensos','Todos, até a retomada']]}),
    H('20/08/2026','15:10','manual','phone','','Ocorrência registrada: ligação','Prometeu pagar até 31/08',{k:'manual',rows:[['Tipo','Ligação telefônica'],['Registrada por','Renata Albuquerque'],['Data e hora','20/08/2026 às 15:10'],['Observação','Roberta disse que recebe no fim do mês e paga até 31/08. Combinado pausar os contatos até lá.']]}),
    H('13/08/2026','09:00','regua','sms','','Fase 2 da régua realizada','SMS entregue',{k:'fase',m:REGUA[1],st:[['Enviado','13/08/2026 às 09:00'],['Situação','Entregue']]}),
    H('11/08/2026','10:00','regua','mail','','Fase 1 da régua realizada','E-mail aberto em 11/08 às 19:40',{k:'fase',m:REGUA[0],st:[['Enviado','11/08/2026 às 10:00'],['Aberto','11/08/2026 às 19:40']]}),
    H('28/07/2026','10:00','regua','mail','','Fase 5 da régua realizada','E-mail entregue, não aberto. Régua retomada após a quebra',{k:'fase',m:REGUA[4],st:[['Enviado','28/07/2026 às 10:00'],['Aberto','Não']]}),
    H('27/07/2026','00:05','acordo','undo','hot','Acordo não pago','Venceu em 22/07 e passou o prazo de 2 dias úteis. A dívida voltou para R$ 1.060,00',{k:'quebra'}),
    H('22/07/2026','09:00','acordo','sms','','Lembrete de vencimento enviado','SMS no dia do vencimento do acordo',{k:'fase',m:DEPOIS[1],st:[['Enviado','22/07/2026 às 09:00'],['Situação','Entregue']]}),
    H('18/07/2026','16:48','acordo','hand','','Acordo fechado','À vista por boleto, 15% de desconto, vencimento 22/07/2026. Régua suspensa',{k:'aco1'}),
    H('17/07/2026','09:03','regua','sms','','Fase 4 da régua realizada','SMS entregue',{k:'fase',m:REGUA[3],st:[['Enviado','17/07/2026 às 09:03'],['Situação','Entregue']]}),
    H('14/07/2026','10:00','regua','mail','','Fase 3 da régua realizada','E-mail aberto em 14/07 às 12:05',{k:'fase',m:REGUA[2],st:[['Enviado','14/07/2026 às 10:00'],['Aberto','14/07/2026 às 12:05']]}),
    H('12/07/2026','09:01','regua','sms','','Fase 2 da régua realizada','SMS entregue',{k:'fase',m:REGUA[1],st:[['Enviado','12/07/2026 às 09:01'],['Situação','Entregue']]}),
    H('10/07/2026','10:00','regua','mail','','Fase 1 da régua realizada','E-mail entregue',{k:'fase',m:REGUA[0],st:[['Enviado','10/07/2026 às 10:00']]}),
    H('10/07/2026','08:12','carteira','upload','','Entrou na carteira','Importação por planilha, feita por Renata',{k:'gen',rows:[['Origem','Planilha carteira-julho.xlsx'],['Importada por','Renata Albuquerque'],['Títulos','1, Mensalidade de maio/2026'],['Valor original','R$ 1.000,00']]})
  ];
  const [d,t]=whenOf(c.q);
  const icn=(c.s0||c.s)==='pau'?'pause':(c.s0||c.s)==='desc'?'xc':(c.s0||c.s)==='aco'?'hand':/não pago/i.test(c.ev)?'undo':/SMS/.test(c.ev)?'sms':/E-mail/.test(c.ev)?'mail':'click';
  return [
    H(d,t,(c.s0||c.s)==='pau'?'manual':(c.s0||c.s)==='aco'?'acordo':'regua',icn,(c.s0||c.s)==='cob'?'':'hot',c.ev,(c.s0||c.s)==='pau'?'Nenhum contato até a retomada':(c.s0||c.s)==='desc'?'Pedido feito pelo link de saída':'Último acontecimento registrado',{k:'gen',rows:[['Acontecimento',c.ev],['Data e hora',d+' às '+t]]}),
    H('15/09/2026','10:00','regua','mail','','Fase 3 da régua realizada','E-mail',{k:'fase',m:REGUA[2],st:[['Enviado','15/09/2026 às 10:00']]}),
    H('13/09/2026','09:02','regua','sms','','Fase 2 da régua '+(c.tel[1]===0?'não entregue':'realizada'),c.tel[1]===0?'SMS falhou: número inválido':'SMS entregue',{k:'fase',m:REGUA[1],st:[['Situação',c.tel[1]===0?'Não entregue, número inválido':'Entregue']]}),
    H('11/09/2026','10:00','regua','mail','','Fase 1 da régua realizada','E-mail',{k:'fase',m:REGUA[0],st:[['Enviado','11/09/2026 às 10:00']]}),
    H('11/09/2026','08:30','carteira','upload','','Entrou na carteira','Importação por planilha',{k:'gen',rows:[['Origem','Planilha carteira-setembro.xlsx'],['Importada por','Renata Albuquerque']]})
  ];
}
const HCAT=[['regua','Ações da régua'],['acordo','Acordos e pagamentos'],['manual','Registros manuais'],['carteira','Entrada e saída da carteira']];
const HMES=[['todos','Todos os meses'],['09/2026','Setembro de 2026'],['08/2026','Agosto de 2026'],['07/2026','Julho de 2026']];
function whenOf(q){ if(q.startsWith('Hoje')) return ['23/09/2026',q.split(', ')[1]]; if(q.startsWith('Ontem')) return ['22/09/2026',q.split(', ')[1]]; const [d,t]=q.split(', '); return [d+'/2026',t]; }

/* painel lateral de detalhes e ações */
function evDrawer(){
  if(!S.evd) return '';
  const c=CLI.find(x=>x.id===S.evd.c)||CLI[0]; const v=S.evd.v; const fn=/CNPJ/.test(c.doc)?c.n:c.n.split(' ')[0];
  let kick,title,sub,body,foot='';
  const desc=c.at>=91&&c.at<=180?15:c.at<=90?10:c.at<=360?25:0;
  if(String(v).startsWith('cfg-key-')){ const env=String(v).slice(8); kick='Integrações e API'; title='Gerar nova chave de '+(env==='prod'?'produção':'teste'); sub='A chave atual para de funcionar na hora'; body=`<div class="warnb">${ic('alert','sm')}<span>Tudo o que usa a chave atual ${env==='prod'?'(o sistema da escola, por exemplo) ':''}deixa de funcionar até receber a nova. A nova chave aparece inteira uma única vez.</span></div>`; foot=`<button class="btn ${env==='prod'?'dngb':''}" type="button" data-a="kgen" data-v="${env}">Gerar nova chave</button><button class="btn-2" type="button" data-a="evclose">Cancelar</button>`; }
  else if(String(v).startsWith('pl-')){ const r=planoDrawer(String(v).slice(3)); kick=r.kick; title=r.title; sub=r.sub; body=r.body; foot=r.foot; }
  else if(v==='aj-ch'){ const r=chamadoDrawer(); kick=r.kick; title=r.title; sub=r.sub; body=r.body; foot=r.foot; }
  else if(/^cfg-/.test(String(v))){ const r=({'cfg-asaas':asaasDrawer,'cfg-conv':convDrawer,'cfg-transf':transfDrawer,'cfg-rem':remDrawer,'cfg-conta':contaDrawer,'cfg-dom':domDrawer,'cfg-sms':smsDrawer,'cfg-sem':semDrawer,'cfg-doc':docDrawer})[v](); kick=r.kick; title=r.title; sub=r.sub; body=r.body; foot=r.foot; }
  else if(v==='fech-dl'){ const r=fechDl(); S.evdWide=true; kick=r.kick; title=r.title; sub=r.sub; body=r.body; foot=r.foot; }
  else if(String(v).startsWith('lote:')||v==='env-dl'){ const r=v==='env-dl'?envDl():loteDrawer(+v.slice(5)); kick=r.kick; title=r.title; sub=r.sub; body=r.body; foot=r.foot; }
  else if(v==='hist-dl'||v==='list-dl'){ const r=v==='hist-dl'?histDl(c):listDl(); kick=r.kick; title=r.title; sub=r.sub; body=r.body; foot=r.foot; }
  else if(v==='ocor'){ kick='Registro manual'; title='Registrar ocorrência'; sub=`Algo que aconteceu com ${fn} fora da plataforma`;
    const T=['Ligação telefônica','Conversa por WhatsApp','Atendimento presencial','Promessa de pagamento','Contestação da dívida','Outro'];
    body=`<div class="otypes">${T.map((x,k)=>`<button type="button" class="otp" aria-pressed="${S.ot===k}" data-a="ot" data-v="${k}">${x}</button>`).join('')}</div><label class="fld">Observação<textarea id="oc-n" class="edit" style="box-shadow:none;border-color:var(--edge-3);min-height:110px" placeholder="O que foi combinado ou informado">${esc(S.onote||'')}</textarea></label><p class="faint" style="font-size:12.5px">Fica na linha do tempo com seu nome, data e hora. Não envia nada ao devedor.</p>`;
    foot=`<button class="btn" type="button" data-a="evsave" data-m="Ocorrência registrada na linha do tempo" ${S.ot>=0&&(S.onote||'').trim()?'':'disabled'}>Registrar</button><button class="btn-2" type="button" data-a="evclose">Cancelar</button>`; }
  else if(v==='pausa'){ const p=c.s==='pau'; kick='Cobrança'; title=p?'Retomar a cobrança':'Pausar a cobrança'; sub=p?`${fn} volta a receber os contatos da régua`:`${fn} para de receber contatos, mas continua na base`;
    body=kvs(p?[['Volta em','Fase em que parou'],['Vaga do plano','Continua ocupada']]:[['Contatos','Suspensos até a retomada'],['Vaga do plano','Continua ocupada'],['Histórico','Continua guardado']])+`<label class="fld">Motivo<input id="pz-m" value="${esc(S.onote||'')}" placeholder="Ex.: aguardando promessa de pagamento"><span class="hint">Obrigatório. Fica registrado na linha do tempo.</span></label>`;
    foot=`<button class="btn" type="button" data-a="evsave" data-m="${p?'Cobrança retomada':'Cobrança pausada para '+fn}" ${(S.onote||'').trim()?'':'disabled'}>${p?'Retomar':'Pausar'}</button><button class="btn-2" type="button" data-a="evclose">Cancelar</button>`; }
  else if(v==='retirar'){ kick='Carteira'; title=`Retirar ${fn} da base`; sub='Sai de vez da sua carteira';
    body=`${kvs([['Cobrança','Para na hora, nenhum contato é enviado'],['Vaga do plano','Liberada'],['Histórico','Enviado para o seu e-mail em PDF e apagado da plataforma'],['Para voltar','Só incluindo de novo na carteira']])}
      <div class="fld"><span>Motivo</span><div class="otypes">${['Pagou direto à empresa','Devolução ou cancelamento','Dívida contestada','Outro'].map((x,k)=>`<button type="button" class="otp" aria-pressed="${S.ot===k}" data-a="ot" data-v="${k}">${x}</button>`).join('')}</div></div>
      <div class="warnb">${ic('alert','sm')}<span>Antes de retirar, o histórico completo de ${fn} é enviado para o seu e-mail em PDF. Depois disso ele não fica mais disponível aqui.</span></div>`;
    foot=`<button class="btn dngb" type="button" data-a="evsave" data-m="${fn} retirada da base. Histórico enviado para o seu e-mail" ${S.ot<0?'disabled':''}>Retirar da base</button><button class="btn-2" type="button" data-a="evclose">Cancelar</button>`; }
  else if(v==='pagdireto'){ kick='Ação da administradora'; title='Registrar pagamento feito direto'; sub='Quando o devedor pagou fora da plataforma';
    const P=perfil(c); const sel=P.tits.filter((t,k)=>S.pt.includes(k)); const tot=sel.reduce((a,t)=>a+t.a,0);
    body=`<div><h3>Quais títulos foram pagos</h3><div class="ptl">${P.tits.map((t,k)=>`<label class="ptc ${S.pt.includes(k)?'on':''}"><input type="checkbox" data-a="ptk" value="${k}" ${S.pt.includes(k)?'checked':''}><span><b>${t.d}</b><small>${t.c}, vence ${t.v}</small></span><em>${brl(t.a)}</em></label>`).join('')}</div>
      <p class="ptt">${sel.length?`${sel.length} ${sel.length===1?'título selecionado':'títulos selecionados'}, <b>${brl(tot)}</b> atualizados`:'Selecione pelo menos um título'}</p></div>
      <div><h3>Forma de pagamento</h3><div class="otypes">${['Pix','Boleto','Transferência','Dinheiro','Cartão'].map((x,k)=>`<button type="button" class="otp" aria-pressed="${S.ot===k}" data-a="ot" data-v="${k}">${x}</button>`).join('')}</div></div>
      <div class="g2"><label class="fld">Valor pago<input placeholder="${sel.length?brl(tot):'R$ 0,00'}"></label><label class="fld">Data do pagamento<input placeholder="dd/mm/aaaa"></label></div>
      <p class="muted" style="font-size:13px">${sel.length&&sel.length===P.tits.length?`Todos os títulos pagos: ${fn} sai da régua e libera a vaga. `:sel.length?'Os títulos pagos saem da cobrança e os demais continuam na régua. ':''}O registro entra na linha do tempo e na trilha de auditoria.</p>`;
    foot=`<button class="btn" type="button" data-a="evsave" data-m="Pagamento registrado em ${sel.length} ${sel.length===1?'título':'títulos'}" ${sel.length&&S.ot>=0?'':'disabled'}>Registrar pagamento</button><button class="btn-2" type="button" data-a="evclose">Cancelar</button>`; }
  else if(v==='novotit'){ kick='Títulos'; title='Incluir título'; sub=`Um novo título em aberto para ${fn}, sem precisar de planilha`;
    body=`<label class="fld">Código do título<input placeholder="Ex.: MEN-2026-08-0412"><span class="hint">O número que identifica o título no seu sistema. Evita incluir o mesmo título duas vezes.</span></label>
      <label class="fld">Descrição<input placeholder="Ex.: Mensalidade de agosto/2026"></label>
      <div class="g2"><div class="fld calwrap"><span>Vencimento</span><div class="pop"><button type="button" class="datebtn" data-a="calopen" data-v="-1" aria-expanded="${S.cal.open&&S.cal.k===-1}">${S.ntVenc||'<span class="faint">dd/mm/aaaa</span>'}${ic('cal','sm')}</button>${S.cal.open&&S.cal.k===-1?calendario():''}</div></div><label class="fld">Valor original<input placeholder="R$ 0,00" inputmode="decimal"></label></div>
      <div class="warnb" style="background:rgba(255,255,255,.04);color:var(--muted)">${ic('info','sm')}<span>Multa e juros são calculados automaticamente a partir do vencimento, com as regras de Configurações. Se já existir um título com este código para ${fn}, ele não é incluído de novo.</span></div>`;
    foot=`<button class="btn" type="button" data-a="evsave" data-m="Título incluído. Entra na régua junto com os demais">Incluir título</button><button class="btn-2" type="button" data-a="evclose">Cancelar</button>`; }
  else if(String(v).startsWith('tit:')){ const r=titDrawer(c,+v.slice(4)); kick=r.kick; title=r.title; sub=r.sub; body=r.body; foot=r.foot; }
  else if(String(v).startsWith('fase:')){ const i=+v.slice(5); const m=REGUA[i]; kick=`Fase ${i+1} da régua`; title=`${m.d}, ${m.c}`; sub=m.o;
    body=(m.c==='SMS'?`<div><h3>Texto do SMS</h3>${phoneSms(m.txt)}</div>`:`<div><h3>Assunto</h3><p class="subjl">${esc(fillv(m.subj))}</p></div><div><h3>Corpo do e-mail</h3>${outlook(m.subj,blocksOf(m),S.logo,{cta:m.cta,ft:m.ft})}</div>`)+`<p class="faint" style="font-size:12.5px">Esta é a comunicação da fase ${i+1}. Para mudar o texto, vá em Estratégia.</p>`; body=body.split('Roberta Lima').join(c.n).split('Roberta').join(fn); }
  else if(v==='acordo'||(v==='prop'&&acoState(c)==='aguardando')){ const r=acoDrawer(c); kick=r.kick; title=r.title; sub=r.sub; body=r.body; foot=r.foot; }
  else if(v==='prop'){ const base=c.v; const n=Math.min(desc===10?6:desc===15?10:12,Math.floor(base/50));
    if(c.s==='pago'&&c.id!=='roberta'){ const P2=perfil(c); const p0=P2.paid[0]?P2.paid[0].pay:null; kick='Acordo'; title='Acordo pago'; sub=p0?'Pago em '+p0.d:''; body=kvs([['Valor pago',brl(P2.pago)],['Pago em',p0?p0.d:'—'],['Forma',p0?p0.f:'—'],['Como foi pago',p0&&p0.src==='plat'?'Pela plataforma':'Fora da plataforma, com baixa manual'],['Títulos quitados',String(P2.paid.length)]]); }
    else if(c.s==='pago'){ kick='Acordo'; title='Acordo pago'; sub='Fechado e pago em 23/09/2026'; body=kvs([['Condição','À vista, 15% de desconto'],['Valor original','R$ 1.060,00'],['Valor do acordo','R$ 901,00'],['Economia do devedor','R$ 159,00'],['Forma de pagamento','Pix'],['Pago em','23/09/2026 às 09:40'],['Acordos anteriores','1, não pago em julho']]); }
    else { kick='Proposta'; title='O que o devedor vê hoje'; sub='Calculada com as regras de negociação atuais'; body=`<div class="popt"><div><b>À vista</b><small>Pix ou boleto${desc?`, ${desc}% de desconto`:''}</small></div><div class="val"><b>${brl(base*(1-desc/100))}</b>${desc?`<small class="money">− ${brl(base*desc/100)}</small>`:''}</div></div><div class="popt"><div><b>No cartão</b><small>Em até ${n}x de ${brl(base/n)}</small></div><div class="val"><b>${brl(base)}</b></div></div>`+kvs([['Faixa aplicada',c.at<=90?'Até 90 dias':c.at<=180?'91 a 180 dias':c.at<=360?'181 a 360 dias':'Fora das faixas'],['Valor atualizado',brl(base)]]); } }
  else {
    const path=String(v).split('.'); const L=hist(c); let e=L[+path[0]]; if(path[1]!=null) e=e.sub[+path[1]];
    kick=dlab(e.d)+', '+e.t; title=e.title; const k=e.det.k;
    if(k==='fase'){ const m=e.det.m; const fi=REGUA.indexOf(m); sub=fi>=0?`Fase ${fi+1} corresponde ao ${m.d}: ${m.o.toLowerCase()}`:e.det.gat?'Disparo por comportamento':'Mensagem do acordo';
      body=kvs([['Canal',m.c],['Objetivo',m.o],...(e.det.st||[])])+`<div><h3>Mensagem enviada</h3>${m.c==='SMS'?phoneSms(m.txt):outlook(m.subj,blocksOf(m),S.logo,{cta:m.cta,ft:m.ft})}</div>`; }
    else if(k==='pag'){ sub='Pagamento do acordo'; body=kvs([['Valor pago','R$ 901,00'],['Forma','Pix'],['Data e hora',e.d+' às '+e.t],['Processado por','Asaas, instituição de pagamento'],['Identificador','pay_8K2F4T19QX'],['Título quitado','Mensalidade de maio/2026'],['Desconto concedido','R$ 159,00 (15%)'],['Repasse para a escola','[prazo do Asaas a confirmar]']]); }
    else if(k==='aco'){ sub='Acordo fechado pela devedora'; body=kvs([['Condição','À vista, 15% de desconto'],['Valor','R$ 901,00 (de R$ 1.060,00)'],['Forma escolhida','Pix'],['Vencimento','24/09/2026'],['Fechado em',e.d+' às '+e.t],['Regra aplicada','Faixa de 91 a 180 dias'],['Régua','Suspensa até o pagamento ou a quebra'],['Situação','Pago em 23/09/2026']]); }
    else if(k==='aco1'){ sub='Primeiro acordo, em julho'; body=kvs([['Condição','À vista, 15% de desconto'],['Valor','R$ 901,00 (de R$ 1.060,00)'],['Forma escolhida','Boleto'],['Vencimento','22/07/2026'],['Fechado em',e.d+' às '+e.t],['Régua','Suspensa durante o acordo'],['Situação','Não pago']]); }
    else if(k==='quebra'){ sub='Quebra de acordo'; body=kvs([['Vencimento do acordo','22/07/2026'],['Prazo de tolerância','2 dias úteis, até 24/07/2026'],['Desconto','Cancelado'],['Dívida voltou para','R$ 1.060,00'],['Comunicação','E-mail "Seu acordo não foi pago" em 27/07'],['Régua','Retomada na fase seguinte']]); }
    else if(k==='abr'){ sub='Acesso à página de negociação'; body=kvs([['Veio de','Link do SMS das 09:05'],['Aparelho','Celular'],['Data e hora',e.d+' às '+e.t],['Tempo na proposta','4 minutos']]); }
    else if(k==='idt'){ sub='Validação antes de ver a proposta'; body=kvs([['Como validou','Informou o e-mail, que já estava cadastrado'],['Código','Não foi necessário'],['Data e hora',e.d+' às '+e.t]]); }
    else { sub=e.desc; body=kvs(e.det.rows||[['Data e hora',e.d+' às '+e.t]]); }
  }
  return `<div class="scrim" data-a="evclose-bg"><aside class="drawer ${S.anim?'anim':''} ${/-dl$/.test(String(S.evd.v))||/^lote:/.test(String(S.evd.v))||/^cfg-(doc|sem|dom)$/.test(String(S.evd.v))?'wide2':''}" role="dialog" aria-modal="true" aria-labelledby="evt">
    <div class="dr-h"><div><span class="k2">${kick}</span><h2 id="evt">${title}</h2><p>${sub}</p></div><button class="xbtn" type="button" data-a="evclose" aria-label="Fechar">${ic('x','sm')}</button></div>
    <div class="dr-b">${body}</div>${foot?`<div class="dr-f">${foot}</div>`:''}
  </aside></div>`;
}

/* RÉGUA */
const DEPOIS=[{c:'E-mail',o:'Confirmação do acordo',q:'Na hora em que o acordo é fechado',subj:'Seu acordo com a Escola Horizonte',txt:'Roberta, seu acordo foi registrado. Pague até 24/09 pelo Pix ou boleto e pronto.',env:118,res:'118 enviados'},{c:'SMS',o:'Lembrete no vencimento',q:'No dia do vencimento do acordo',txt:'Escola Horizonte: Roberta, seu acordo vence hoje. Pague em {link} Sair: {sair}',env:61,res:'96% entregues'},{c:'E-mail',o:'Acordo não pago',q:'2 dias úteis após o vencimento',subj:'Seu acordo não foi pago',txt:'Roberta, não identificamos o pagamento do seu acordo. Ele foi cancelado e a dívida voltou ao valor anterior. Você pode fazer uma nova negociação quando quiser.',env:5,res:'5 enviados'}];
const QUANDO=['No dia em que o devedor entra','2 dias depois de entrar','4 dias depois de entrar','7 dias depois de entrar','10 dias depois de entrar','14 dias depois de entrar'];
function vAcoes(tab){
  tab=tab||'regua';
  const tabs=[['regua','Régua'],['resultados','Resultados por canal'],['envios','Envios']];
  const head=`<div class="ptabs tbar" role="tablist">${tabs.map(t=>`<a role="tab" href="#/acoes/${t[0]}" aria-selected="${tab===t[0]}">${t[1]}</a>`).join('')}</div>`;
  if(tab==='resultados') return head+vResultados();
  if(tab==='envios') return head+vEnvios();
  return head+`<section class="glass rtrack" aria-label="Sequência de contatos">${INF('g2')}<div class="rtop rin"><div class="rnote">${ic('alert','sm')}<span>Régua em validação pelo time. Canais, intervalos e gatilhos podem mudar.</span></div>${S.role==='admin'?`<button class="ib2 rpz ${S.cobP?'on':''}" type="button" data-a="pzask" aria-label="${S.cobP?'Retomar toda a cobrança':'Pausar toda a cobrança'}" title="${S.cobP?'Retomar toda a cobrança':'Pausar toda a cobrança'}">${ic(S.cobP?'play':'pause','sm')}</button>`:''}</div>
  
    <div class="rline">${REGUA.map((r,i)=>`<button type="button" class="rn ${r.c==='SMS'?'sms':''}" data-a="dr" data-v="r${i}"><span class="dl">${r.d}</span><span class="nd">${ic(r.c==='SMS'?'sms':'mail')}</span><span class="ob">${r.o}</span><span class="ch">${r.c}</span></button>`).join('')}</div>
    <div class="rgat"><span class="ttl">Disparos por comportamento, a qualquer momento da sequência</span>${GAT.map((g,i)=>`<button type="button" class="gt" data-a="dr" data-v="g${i}"><span class="nd">${ic('zap','sm')}</span><div><b>${g.o}</b><span>Recebe ${g.c==='SMS'?'um SMS':'um e-mail'}</span></div></button>`).join('')}</div>
  </section>
  <h2 style="font-size:15.5px;font-weight:500;color:var(--title);margin:28px 0 0">Depois do acordo</h2>
  <div class="rafter">${DEPOIS.map((d,i)=>`<button type="button" class="ra" data-a="dr" data-v="a${i}"><span class="ini" style="width:38px;height:38px">${ic(d.c==='SMS'?'sms':'mail','sm')}</span><div><b>${d.o}</b><span>${d.c}, ${d.q.toLowerCase()}</span></div></button>`).join('')}</div>`;
}
const PERF=[['D0','E-mail','Contextualizar e abrir caminho',985,958,58,12],['D2','SMS','Gerar clique no link',962,914,null,16],['D4','E-mail','Explicar condição e segunda via',941,921,41,9],['D7','SMS','Retomar atenção sem excesso',930,884,null,13],['D10','E-mail','Encerrar o primeiro ciclo',912,892,52,15],['Gatilho','SMS','Abriu o e-mail e não clicou',212,200,null,31],['Gatilho','E-mail','Acessou e não pagou',164,160,61,23]];
function vResultados(){
  const ch=S.ch||'email';
  const D=ch==='email'?{tot:3002,dest:'956 endereços',steps:[['Enviados',3002],['Entregues',2911],['Abertos',1452],['Cliques no link',398]],desc:2,
      fail:[['Endereço inválido, o e-mail voltou',29,'var(--warn)'],['Marcado como spam',3,'var(--risk)']]}
    :{tot:2104,dest:'941 números',steps:[['Enviados',2104],['Entregues',1998],['Cliques no link',287]],desc:1,
      fail:[['Número inválido ou inexistente',44,'var(--risk)'],['Aparelho desligado ou fora de área',38,'var(--warn)'],['Bloqueio da operadora',24,'var(--muted)']]};
  const fmx=Math.max(...D.fail.map(f=>f[1]));
  const pipe=`<div class="pipe" style="--n:${D.steps.length}">${D.steps.map((s,i)=>`${i?`<div class="pj"><span>−${num(D.steps[i-1][1]-s[1])}</span></div>`:''}<div class="ps ${i===D.steps.length-1?'end':''}"><span>${s[0]}</span><b>${num(s[1])}</b><em>${i?pct(s[1]/D.steps[i-1][1]*100)+' da etapa anterior':'ponto de partida'}</em><i style="--w:${Math.max(s[1]/D.steps[0][1]*100,4)}%"></i></div>`).join('')}<div class="pj sep2"></div><div class="ps dsc"><span>Descadastros</span><b>${num(D.desc)}</b><em>${pct(D.desc/D.steps[1][1]*100)} dos entregues</em><i style="--w:0%"></i></div></div>`;
  const health=ch==='email'
    ?`<h3>Reputação de envio</h3><div class="hl"><b class="good">Boa</b><span>0,1% dos e-mails marcados como spam</span></div><div class="meter2"><i class="z1"></i><i class="z2"></i><i class="z3"></i><em style="left:20%"></em></div><div class="mt-l"><span>0%</span><span>0,3%, provedores começam a filtrar</span><span>0,5%</span></div>`
    :`<h3>Contatos que precisam de correção</h3><div class="hl"><b class="warnc">44 devedores</b><span>com número inválido não recebem SMS</span></div><p class="muted" style="font-size:13px;margin:0 0 14px">A higienização da carteira encontra e corrige telefones e e-mails, para que esses devedores voltem a ser alcançados.</p><a class="btn-2 bsm" href="#/plano/higienizacao">${ic('sparkle','sm')}Conhecer a higienização</a>`;
  const best=PERF.reduce((a,b)=>b[6]>a[6]?b:a); const low=PERF.filter(p=>p[5]!=null).reduce((a,b)=>b[5]<a[5]?b:a);
  const lowIdx=REGUA.findIndex(r=>r.d===low[0]);
  const cols=PERF.map(p=>({h:p[0]==='Gatilho'?(p[1]==='SMS'?'Abriu e não clicou':'Acessou e não pagou'):p[0],c:p[1],env:p[3],ent:p[4]/p[3]*100,ab:p[5],cl:p[6],p}));
  const cell=(v,mx,kind,mark)=>v==null?`<td class="hm na">—</td>`:`<td class="hm ${kind} ${mark||''}" style="--a:${(v/mx).toFixed(2)}"><span>${kind==='ent'?pct(v):v+'%'}</span></td>`;
  const grid=`<div class="tscroll"><table class="hmap"><thead><tr><th></th>${cols.map(c=>`<th><span class="hmc">${ic(c.c==='SMS'?'sms':'mail','sm')}</span><b>${c.h}</b><small>${c.c}</small></th>`).join('')}</tr></thead><tbody>
    <tr><th>Enviadas</th>${cols.map(c=>`<td class="hm plain">${num(c.env)}</td>`).join('')}</tr>
    <tr><th>Entrega</th>${cols.map(c=>cell(c.ent,100,'ent')).join('')}</tr>
    <tr><th>Abertura</th>${cols.map(c=>cell(c.ab,70,'ab',c.p===low?'low':'')).join('')}</tr>
    <tr><th>Clique na proposta</th>${cols.map(c=>cell(c.cl,35,'cl',c.p===best?'best':'')).join('')}</tr>
  </tbody></table></div>`;
  return `<section class="glass chan">
    <div class="chan-h"><div class="segm" role="tablist" aria-label="Canal">${[['email','E-mail','mail'],['sms','SMS','sms']].map(x=>`<button type="button" role="tab" data-a="chsel" data-v="${x[0]}" aria-pressed="${ch===x[0]}">${ic(x[2],'sm')}${x[1]}</button>`).join('')}</div>
      <div class="chan-t"><b>${num(D.tot)}</b><span>${ch==='email'?'e-mails':'SMS'} enviados no mês, para ${D.dest}</span></div></div>
    ${pipe}
    <div class="chan-f"><div><h3>O que não chegou ou foi recusado</h3>${D.fail.map(f=>`<div class="flr"><span>${f[0]}</span><div class="flb"><i style="width:${f[1]/fmx*100}%;background:${f[2]}"></i></div><b>${num(f[1])}</b></div>`).join('')}</div><div>${health}</div></div>
  </section>
  <section class="glass perf2"><div class="card-h"><div><h2>Desempenho de cada etapa da régua</h2></div></div>
    <div class="leg2"><span><span class="lgi best">${ic('zap','sm')}</span><em>Melhor clique: <b>${best[6]}%</b>, ${best[0]==='Gatilho'?'SMS para quem abriu o e-mail e não clicou':best[0]}</em></span><span><span class="lgi low">${ic('alert','sm')}</span><em>Menor abertura: <b>${low[5]}%</b>, e-mail do ${low[0]}. <button type="button" class="lk" data-a="dr" data-v="r${lowIdx}">Revisar o assunto</button></em></span></div>
    ${grid}</section>`;
}

const LT=[
 ['23/09/2026','14:00','SMS','Lembrete de vencimento','a1',6,null,null,null,null,'Agendado'],
 ['23/09/2026','10:00','E-mail','D0, devedores incluídos ontem','r0',7,null,null,null,null,'Enviando',4],
 ['23/09/2026','09:05','SMS','Gatilho: abriu o e-mail e não clicou','g0',11,100,null,36,0,'Concluído'],
 ['23/09/2026','08:30','E-mail','Gatilho: acessou e não pagou','g1',9,100,67,22,0,'Concluído'],
 ['22/09/2026','09:10','SMS','Gatilho: abriu o e-mail e não clicou','g0',26,96.2,null,31,3.8,'Concluído'],
 ['21/09/2026','10:00','E-mail','D10, encerrar o primeiro ciclo','r4',912,97.8,52,15,2.2,'Concluído'],
 ['18/09/2026','09:00','SMS','D7, retomar atenção','r3',930,95.1,null,13,4.9,'Concluído'],
 ['15/09/2026','10:00','E-mail','D4, explicar condição','r2',941,97.9,41,9,2.1,'Concluído'],
 ['13/09/2026','09:00','SMS','D2, gerar clique no link','r1',962,95,null,16,5,'Concluído'],
 ['11/09/2026','10:00','E-mail','D0, contextualizar e abrir caminho','r0',985,97.3,58,12,2.7,'Concluído']
];
function ltMsg(k){ const t=k[0], i=+k.slice(1); return t==='r'?REGUA[i]:t==='g'?GAT[i]:DEPOIS[i]; }
function vEnvios(){
  const fc=S.ef||'todos', fs=S.es||'todas';
  const rows=LT.map((l,i)=>({l,i})).filter(x=>(fc==='todos'||x.l[2]===(fc==='email'?'E-mail':'SMS'))&&(fs==='todas'||x.l[10].toLowerCase()===fs));
  const nf=(fc!=='todos'?1:0)+(fs!=='todas'?1:0);
  const days=[...new Set(rows.map(x=>x.l[0]))];
  const dl=d=>d==='23/09/2026'?'Hoje':d==='22/09/2026'?'Ontem':dlab(d);
  const met=(v,lab,cls)=>`<div class="lm ${cls||''}">${v==null?'<b class="faint">—</b>':`<b>${pct(v)}</b>`}<span>${lab}</span></div>`;
  const stc={'Concluído':'c-good','Enviando':'c-info','Agendado':'c-neutral'};
  const FC=[['todos','Todos os canais'],['email','E-mail'],['sms','SMS']], FSt=[['todas','Todas as situações'],['concluído','Concluído'],['enviando','Enviando'],['agendado','Agendado']];
  const TOOLS=`<span class="eact"><div class="pop"><button class="ib2 ${nf?'on':''}" type="button" data-a="eopen" aria-expanded="${S.eOpen}" aria-label="Filtros" title="Filtros">${ic('filter','sm')}${nf?`<i class="dotb">${nf}</i>`:''}</button>
      ${S.eOpen?`<div class="popm wide" role="dialog" aria-label="Filtros dos envios">
        <div class="fsel"><span>Canal</span><button type="button" class="fsb" data-a="esub" data-v="c" aria-expanded="${S.esub==='c'}">${FC.find(x=>x[0]===fc)[1]}${ic('chev','sm')}</button>${S.esub==='c'?`<div class="fopts">${FC.map(x=>`<button type="button" class="fo" aria-selected="${fc===x[0]}" data-a="efc" data-v="${x[0]}">${x[1]}${fc===x[0]?ic('check','sm'):''}</button>`).join('')}</div>`:''}</div>
        <div class="fsel"><span>Situação</span><button type="button" class="fsb" data-a="esub" data-v="s" aria-expanded="${S.esub==='s'}">${FSt.find(x=>x[0]===fs)[1]}${ic('chev','sm')}</button>${S.esub==='s'?`<div class="fopts">${FSt.map(x=>`<button type="button" class="fo" aria-selected="${fs===x[0]}" data-a="efs" data-v="${x[0]}">${x[1]}${fs===x[0]?ic('check','sm'):''}</button>`).join('')}</div>`:''}</div>
        <div class="ft"><button class="lk" type="button" data-a="eclear">Limpar filtros</button><button class="btn bsm" type="button" data-a="eclose">Aplicar</button></div></div>`:''}</div>
<button class="ib2" type="button" data-a="evd" data-v="env-dl" aria-label="Exportar" title="Exportar">${ic('dl','sm')}</button></span>`;
  return `<section class="glass envl">${days.length?days.map((d,k)=>`<div class="eday">${dl(d)}${k===0?TOOLS:''}</div>${rows.filter(x=>x.l[0]===d).map(({l,i})=>`<button type="button" class="erow" data-a="evd" data-v="lote:${i}">
      <time>${l[1]}</time><span class="chi">${ic(l[2]==='SMS'?'sms':'mail','sm')}</span>
      <span class="en"><b>${l[3]}</b><small>${l[2]}, ${num(l[5])} ${l[5]===1?'mensagem':'mensagens'}</small></span>
      ${l[10]==='Concluído'?`<span class="emets">${met(l[6],'entrega')}${met(l[7],'abertura')}${met(l[8],'clique','cl')}${met(l[9],'falha',l[9]>4?'bad':'')}</span>`:l[10]==='Enviando'?`<span class="emets prog"><span class="lbar"><i style="width:${l[11]/l[5]*100}%"></i></span><small>${l[11]} de ${l[5]} enviadas</small></span>`:`<span class="emets prog"><small>Começa às ${l[1]}</small></span>`}
      <span class="chip ${stc[l[10]]}">${l[10]}</span><span class="te-go">${ic('chev','sm')}</span></button>`).join('')}`).join(''):`<div class="eday"><span></span>${TOOLS}</div><p class="muted" style="padding:8px 24px 28px">Nenhum envio com esses filtros.</p>`}</section>`;
}
function loteDrawer(i){
  const l=LT[i]; const m=ltMsg(l[4]); const done=l[10]==='Concluído';
  const ent=l[6]!=null?Math.round(l[5]*l[6]/100):null;
  const body=(done?`<div class="dstat">${[['Enviadas',num(l[5])],['Entregues',ent!=null?num(ent):'—'],['Abertura',l[7]!=null?pct(l[7]):'—'],['Clique no link',l[8]!=null?pct(l[8]):'—'],['Falha',l[9]!=null?pct(l[9]):'—']].map(x=>`<div><span>${x[0]}</span><b>${x[1]}</b></div>`).join('')}</div>`
      :kvs([['Situação',l[10]],['Mensagens',num(l[5])],...(l[11]!=null?[['Já enviadas',`${l[11]} de ${l[5]}`]]:[]),['Horário',`${l[0]} às ${l[1]}`]]))
    +`<div><h3>Mensagem enviada</h3>${m.c==='SMS'?phoneSms(m.txt):outlook(m.subj,blocksOf(m),S.logo,{cta:m.cta,ft:m.ft,hdr:m.hdr})}</div>`;
  return {kick:`${dlab(l[0])}, ${l[1]}`,title:l[3],sub:`${l[2]}, ${num(l[5])} mensagens`,body,
    foot:`<button class="btn-2" type="button" data-a="toast" data-m="Envios deste lote baixados em Excel">${ic('dl','sm')}Baixar envios deste lote</button>`};
}
function envDl(){
  const t=S.etab||'resumo';
  const g=t==='resumo'?xgrid(['Data','Hora','Canal','Mensagem','Quantidade','Entrega','Abertura','Clique','Falha','Situação'],LT.map(l=>[l[0],l[1],l[2],l[3],num(l[5]),l[6]!=null?pct(l[6]):'',l[7]!=null?pct(l[7]):'',l[8]!=null?pct(l[8]):'',l[9]!=null?pct(l[9]):'',l[10]]))
    :xgrid(['Data e hora','Devedor','Documento','Canal','Mensagem','Destino','Situação','Abriu','Clicou'],[['23/09/2026 09:05','Roberta Lima','318.456.789-04','SMS','Gatilho','(11) 94271-4219','Entregue','','Sim'],['23/09/2026 09:05','Anderson Freitas','318.112.340-04','SMS','D7','(11) 93371-3380','Entregue','','Não'],['23/09/2026 08:30','Beatriz Campos','318.908.215-04','E-mail','D4','beatriz@email.com','Entregue','Sim','Não'],['23/09/2026 08:30','Carlos Souza','318.019.334-04','SMS','D2','(11) 90171-0012','Falhou: número inválido','',''],['22/09/2026 10:02','Empresa Alfa Ltda','12.345.901/0001-04','E-mail','D10','empresa@alfa.com.br','Entregue','Sim','Não']]);
  return {kick:'Exportar',title:'Exportar envios',sub:'Planilha do Excel com os filtros aplicados na lista',
    body:`<div><h3>O que exportar</h3><div class="fmtc"><button type="button" class="fmt ${t==='resumo'?'on':''}" data-a="etab" data-v="resumo"><b>Resumo dos envios</b><span>Uma linha por envio, com quantidade e resultados</span></button><button type="button" class="fmt ${t==='devedor'?'on':''}" data-a="etab" data-v="devedor"><b>Envios por devedor</b><span>Uma linha por mensagem enviada, com destino e situação</span></button></div></div><div><h3>Prévia</h3>${g}</div>`,
    foot:`<button class="btn" type="button" data-a="evsave" data-m="Envios exportados em Excel">${ic('dl','sm')}Baixar Excel</button><button class="btn-2" type="button" data-a="evclose">Cancelar</button>`};
}

const EMO=['🙂','😊','👋','🙏','✅','📌','💳','📅','🎓','✨','👉','🤝'];
const VARS=[['{nome}','Nome do devedor','Roberta','Para empresas, usa a razão social'],['{empresa}','Nome da sua empresa','Escola Horizonte',''],['{link}','Link da proposta','hrzt.co/r/8K2F','Leva direto ao autoatendimento'],['{sair}','Link para sair da lista','hrzt.co/s/8K2F','Obrigatório no SMS'],['{desconto}','Maior desconto','15%','Da faixa do devedor']];
const fillv=t=>VARS.reduce((a,v)=>a.split(v[0]).join(v[2]),t);
const FTDEF='Você recebeu este e-mail porque tem uma pendência com a Escola Horizonte.';
const CTADEF={t:'Ver minha proposta',al:'left'};
function blocksOf(m){ return m.blocks||[{t:'txt',v:m.txt}]; }
function emailTpl(subj,blocks,logo,o){
  const c=S.cor; o=o||{}; const cta=o.cta||CTADEF; const ft=o.ft||{on:true,t:FTDEF};
  const st=b=>`text-align:${b.al||'left'};${b.bold?'font-weight:700;':''}`;
  const body=blocks.map(b=>b.t==='txt'?`<p style="${st(b)}">${fillv(hOf(b))}</p>`:b.t==='dest'?`<div class="et-dest" style="${st(b)}border-color:${c};background:color-mix(in srgb, ${c} 8%, white)">${fillv(hOf(b))}</div>`:`<hr>`).join('');
  return `<div class="et">${(()=>{const h=o.hdr||S.hdr;return `<div class="et-hd ${h==='nada'?'thin':''}" style="background:${c}">${h==='logo'?'<span class="et-logo lg2" title="Logo da Escola Horizonte">EH</span>':h==='nome'?'<b>Escola Horizonte</b>':''}</div>`;})()}
    <div class="et-bd">${body}<div style="text-align:${cta.al}"><span class="et-cta" style="background:${c}">${esc(cta.t||'Ver minha proposta')}</span></div></div>
    <div class="et-ft">${ft.on&&ft.t.trim()?`<div>${esc(fillv(ft.t))}</div>`:''}<u>Não quero mais receber estes e-mails</u></div></div>`;
}
function outlook(subj,blocks,logo,o){
  return `<div class="olk"><div class="olk-bar"><span></span><span></span><span></span><em>Caixa de entrada</em></div>
   <div class="olk-h"><h4>${esc(fillv(subj||''))}</h4><div class="olk-f"><span class="olk-av" style="background:${S.cor}">EH</span><div><b>Escola Horizonte</b> <small>&lt;cobranca@escolahorizonte.com.br&gt;</small><br><small>Para: Roberta Lima · Hoje, 10:12</small></div></div></div>
   <div class="olk-b">${emailTpl(subj,blocks,logo,o)}</div></div>`;
}
function phoneSms(txt){
  return `<div class="phn"><div class="phn-top"><span class="olk-av" style="background:#5D6779">EH</span><div><b>Escola Horizonte</b><small>Mensagem de texto</small></div></div><div class="phn-body"><span class="phn-time">Hoje, 09:04</span><div class="bub">${esc(fillv(txt)).replace(/(hrzt\.co\/\S+)/g,'<u>$1</u>')}</div></div><div class="phn-in"><span>Mensagem</span></div></div>`;
}
function varMenu(list){ return `<div class="pop"><button type="button" class="tbtn" data-a="edpop" data-v="var" aria-expanded="${S.edPop==='var'}">${ic('plus','sm')}Inserir dado${ic('chev','sm')}</button>${S.edPop==='var'?`<div class="popm mini vm">${list.map(v=>`<button type="button" class="pi" data-a="var" data-v="${v[0]}"><b>${v[1]}</b><span>Aparece como "${v[2]}"${v[3]?'. '+v[3]:''}</span></button>`).join('')}</div>`:''}</div>`; }
/* editor visual de blocos de e-mail */
function hOf(b){ return b.h!=null?b.h:esc(b.v||'').replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\n/g,'<br>'); }
function cleanH(html){
  const t=document.createElement('div'); t.innerHTML=html; let out='';
  const walk=(n,top)=>{ n.childNodes.forEach((c,i)=>{
    if(c.nodeType===3){ out+=esc(c.nodeValue); }
    else if(c.nodeName==='BR'){ out+='<br>'; }
    else if(c.nodeName==='B'||c.nodeName==='STRONG'||(c.nodeName==='SPAN'&&/bold|700/.test(c.getAttribute('style')||''))){ out+='<b>'; walk(c); out+='</b>'; }
    else if(c.nodeName==='DIV'||c.nodeName==='P'){ if(out&&!/<br>$/.test(out)) out+='<br>'; walk(c); }
    else walk(c);
  }); };
  walk(t,true); return out.replace(/<b><\/b>/g,'').replace(/(<br>)+$/,'');
}
function caretOff(el){ const s=getSelection(); if(!s.rangeCount||!el.contains(s.anchorNode)) return null; const r=s.getRangeAt(0).cloneRange(); r.selectNodeContents(el); r.setEnd(s.getRangeAt(0).endContainer,s.getRangeAt(0).endOffset); return r.toString().length; }
function setCaret(el,off){ const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT); let n, acc=0; while((n=w.nextNode())){ if(acc+n.nodeValue.length>=off){ const r=document.createRange(); r.setStart(n,off-acc); r.collapse(true); const s=getSelection(); s.removeAllRanges(); s.addRange(r); return; } acc+=n.nodeValue.length; } const r=document.createRange(); r.selectNodeContents(el); r.collapse(false); const s=getSelection(); s.removeAllRanges(); s.addRange(r); }
function syncRte(el){ const j=+el.dataset.j; const b=S.ed.blocks[j]; b.h=cleanH(el.innerHTML); b.v=el.innerText.replace(/\n$/,''); S.edF=j; }
function refreshEditor(){ const tmp=document.createElement('div'); tmp.innerHTML=drawer(); ['.edprev','.edcol .trv','.dr-f'].forEach(sel=>{ const a=document.querySelector(sel), b=tmp.querySelector(sel); if(a&&b) a.innerHTML=b.innerHTML; }); }

function drawer(){
  if(!S.dr) return '';
  const k=S.dr[0], i=+S.dr.slice(1);
  const m=k==='r'?REGUA[i]:k==='g'?GAT[i]:DEPOIS[i];
  const kick=k==='r'?`${m.d} · ${m.c}`:k==='g'?`Gatilho · ${m.c}`:`Depois do acordo · ${m.c}`;
  const quando=k==='r'?QUANDO[i]:k==='g'?'Quando o devedor '+m.o.toLowerCase():m.q;
  const ad=S.role==='admin', sms=m.c==='SMS';
  const E=S.ed;
  const subj=E?E.subj:(m.subj||''); const blocks=E?E.blocks:blocksOf(m); const logo=E?E.logo:S.logo;
  const o=E?{cta:E.cta,ft:E.ft,hdr:E.hdr}:{cta:m.cta,ft:m.ft,hdr:m.hdr};
  const smsTxt=E?E.sms:m.txt;
  const all=sms?smsTxt:subj+' '+blocks.map(b=>b.v||'').join(' ')+' '+((o.ft&&o.ft.t)||'');
  const noPress=!/(protesto|processo|justiça|negativ|serasa|spc)/i.test(all);
  const trv=sms?[[!/R\$\s?\d/.test(smsTxt),'Não cita valor nem motivo da dívida'],[/\{link\}/.test(smsTxt),'Tem o link da proposta'],[/\{sair\}/.test(smsTxt),'Tem o link para sair da lista'],[noPress,'Sem ameaça ou pressão'],[fillv(smsTxt).length<=160,'Cabe em um SMS (160 caracteres)'],[!/\p{Extended_Pictographic}/u.test(smsTxt),'Sem emoji, que reduz o SMS a 70 caracteres']]
    :[[noPress,'Sem ameaça ou pressão'],[subj.trim().length>0&&subj.length<=70,'Assunto preenchido, com até 70 caracteres'],[blocks.some(b=>b.t==='txt'&&b.v.trim()),'Tem pelo menos um parágrafo de texto'],[!!((o.cta||CTADEF).t||'').trim(),'Botão da proposta com texto'],[true,'Link para sair da lista incluído']];
  const ok=trv.every(t=>t[0]);
  const res=m.res.split(' ');
  const trvH=`<div><h3>Travas de segurança</h3><div class="trv">${trv.map(t=>`<span class="${t[0]?'':'no'}">${ic(t[0]?'checkc':'xc','sm')}${t[1]}</span>`).join('')}</div></div>`;
  let body;
  if(!E){
    body=`<div><h3>Como chega para o devedor</h3>${sms?phoneSms(smsTxt):outlook(subj,blocks,logo,o)}${sms?`<p class="cnt-c">${fillv(smsTxt).length} de 160 caracteres</p>`:''}</div>${trvH}
      <div><h3>Resultado em setembro</h3><div class="rs3"><div><b>${m.env?num(m.env):'—'}</b><span>enviados</span></div><div><b>${res[0]}</b><span>${res.slice(1).join(' ')}</span></div><div><b>${m.c}</b><span>canal</span></div></div></div>
      <p class="faint" style="font-size:12.5px;display:flex;gap:8px;align-items:center">${ic('sparkle','sm')}Texto sugerido pela IA a partir do que a escola informou sobre o negócio.</p>`;
  } else if(sms){
    body=`<div><h3>Texto do SMS</h3><textarea class="edit" id="ed-sms" aria-label="Texto do SMS">${esc(smsTxt)}</textarea>
      <div class="edbar" style="margin-top:10px">${varMenu(VARS.slice(0,4))}<span class="faint" style="font-size:12.5px;align-self:center">Os links são gerados para cada devedor, não precisa copiar de lugar nenhum.</span></div><p class="cnt-c">${fillv(smsTxt).length} de 160 caracteres com os dados preenchidos</p></div>
      <div><h3>Prévia</h3>${phoneSms(smsTxt)}</div>${trvH}`;
  } else {
    const cta=E.cta, ft=E.ft;
    body=`<div class="edgrid"><div class="edcol">
      <label class="fld">Assunto<input id="ed-subj" value="${esc(subj)}" maxlength="90"></label>
      <div class="brandrow br2"><span class="sw" style="background:${S.cor}"></span><div><b>Identidade da Escola Horizonte</b><span>A cor vem de Configurações e é obrigatória. Sem ela, o e-mail usa o padrão da plataforma. <button type="button" class="lk" data-a="toast" data-m="Abre Configurações > Identidade (próxima rodada)">Alterar</button></span></div>
        <div class="hdrc"><span class="faint">No topo do e-mail</span><div class="segm" role="group" aria-label="O que aparece no topo do e-mail">${[['logo','Logo'],['nome','Nome da empresa'],['nada','Só a cor']].map(x=>`<button type="button" data-a="edhdr" data-v="${x[0]}" aria-pressed="${E.hdr===x[0]}">${x[1]}</button>`).join('')}</div></div></div>
      <div class="edbar"><div class="pop"><button type="button" class="tbtn" data-a="edpop" data-v="bloco" aria-expanded="${S.edPop==='bloco'}">${ic('plus','sm')}Bloco</button>${S.edPop==='bloco'?`<div class="popm mini">${[['txt','Parágrafo','Texto corrido'],['dest','Destaque','Caixa com a cor da marca'],['div','Divisor','Linha para separar assuntos']].map(b=>`<button type="button" class="pi" data-a="addblk" data-v="${b[0]}"><b>${b[1]}</b><span>${b[2]}</span></button>`).join('')}</div>`:''}</div>
        <div class="pop"><button type="button" class="tbtn" data-a="edpop" data-v="emoji" aria-expanded="${S.edPop==='emoji'}">🙂 Emoji</button>${S.edPop==='emoji'?`<div class="popm mini emo">${EMO.map(e=>`<button type="button" data-a="emoji" data-v="${e}" aria-label="Inserir ${e}">${e}</button>`).join('')}</div>`:''}</div>
        ${varMenu(VARS.filter(v=>v[0]!=='{sair}'&&v[0]!=='{link}'))}</div><p class="faint" style="font-size:12px;margin:-6px 0 0">Emoji e Inserir dado entram no campo em que você clicou por último, no assunto ou num bloco. Selecione um trecho e clique em <b>B</b> para deixar só ele em negrito; clique de novo para tirar. Sem seleção, o <b>B</b> vale para o bloco inteiro.</p>
      <div class="blks">${blocks.map((b,j)=>`<div class="blk ${S.edF===j?'f':''}"><div class="blk-h"><span>${b.t==='txt'?'Parágrafo':b.t==='dest'?'Destaque':'Divisor'}</span><div>${b.t!=='div'?`<button type="button" class="ib fb" data-a="blkb" data-v="${j}" aria-pressed="${!!b.bold}" aria-label="Negrito" title="Negrito: selecione um trecho ou use sem seleção para o bloco todo"><b>B</b></button><button type="button" class="ib" data-a="blkal" data-v="${j}:left" aria-pressed="${(b.al||'left')==='left'}" aria-label="Alinhar à esquerda" title="Alinhar à esquerda">${ic('alL','sm')}</button><button type="button" class="ib" data-a="blkal" data-v="${j}:center" aria-pressed="${b.al==='center'}" aria-label="Centralizar" title="Centralizar">${ic('alC','sm')}</button><i class="sepv"></i>`:''}<button type="button" class="ib" data-a="mvblk" data-v="${j}:-1" aria-label="Subir" ${j===0?'disabled':''}>↑</button><button type="button" class="ib" data-a="mvblk" data-v="${j}:1" aria-label="Descer" ${j===blocks.length-1?'disabled':''}>↓</button><button type="button" class="ib" data-a="rmblk" data-v="${j}" aria-label="Remover bloco" ${blocks.length===1?'disabled':''}>${ic('x','sm')}</button></div></div>${b.t==='div'?'<hr class="blk-hr">':`<div class="rte ${b.t==='dest'?'sm':''}" contenteditable="true" id="ed-b${j}" data-j="${j}" role="textbox" aria-multiline="true" aria-label="Texto do bloco" style="text-align:${b.al||'left'};${b.bold?'font-weight:700':''}">${hOf(b)}</div>`}</div>`).join('')}
        <div class="blk cfg"><div class="blk-h"><span>${ic('click','sm')}Botão da proposta</span><div><button type="button" class="ib" data-a="ctaal" data-v="left" aria-pressed="${cta.al==='left'}" aria-label="Botão à esquerda" title="À esquerda">${ic('alL','sm')}</button><button type="button" class="ib" data-a="ctaal" data-v="center" aria-pressed="${cta.al==='center'}" aria-label="Botão ao centro" title="Ao centro">${ic('alC','sm')}</button></div></div>
          <input id="ed-cta" class="cfgi" value="${esc(cta.t)}" maxlength="30" aria-label="Texto do botão"><p class="faint" style="font-size:12px;margin:6px 0 0">O botão sempre leva o devedor à proposta dele. Você escolhe o texto e a posição.</p></div>
        <div class="blk cfg"><div class="blk-h"><span>${ic('mail','sm')}Rodapé</span><div><button type="button" class="switch sm2" role="switch" aria-checked="${ft.on}" aria-label="Mostrar rodapé" data-a="ftsw"><span></span></button></div></div>
          ${ft.on?`<textarea id="ed-ft" data-ft="1" rows="2" aria-label="Texto do rodapé">${esc(ft.t)}</textarea>`:'<p class="faint" style="font-size:12.5px;margin:0">Sem texto de rodapé.</p>'}<p class="faint" style="font-size:12px;margin:6px 0 0">O link "Não quero mais receber estes e-mails" aparece sempre, com ou sem rodapé.</p></div></div>
      ${trvH}
    </div><div class="edprev"><h3>Prévia</h3>${outlook(subj,blocks,logo,{cta,ft,hdr:E.hdr})}</div></div>`;
  }
  return `<div class="scrim" data-a="drclose-bg"><aside class="drawer ${E&&!sms?'wide':''} ${S.anim?'anim':''}" role="dialog" aria-modal="true" aria-labelledby="drt">
    <div class="dr-h"><div><span class="k2">${kick}</span><h2 id="drt">${E?'Editar: ':''}${m.o}</h2><p>${quando}</p></div><button class="xbtn" type="button" data-a="drclose" aria-label="Fechar">${ic('x','sm')}</button></div>
    <div class="dr-b">${body}</div>
    <div class="dr-f">${ad?(E?`<button class="btn" type="button" data-a="edsave" ${ok?'':'disabled'}>Salvar</button><button class="btn-2" type="button" data-a="edcancel">Cancelar</button>${ok?'':'<span class="faint" style="font-size:12.5px">Resolva as travas para salvar</span>'}`:`<button class="btn" type="button" data-a="edit">${ic('edit','sm')}Editar ${sms?'texto':'e-mail'}</button><button class="btn-2" type="button" disabled title="Disponível em breve">${ic('sparkle','sm')}Pedir outra sugestão<span class="soonb">Em breve</span></button>`):`<span class="faint" style="font-size:13px">Só a administradora edita as mensagens.</span>`}</div>
  </aside></div>`;
}


/* FECHAMENTOS */
const FM={
 '07':{n:'julho',ini:[0,0,0],ent:[212,221,18900],pag:[11,12,4120],desc:780,ret:[4,4,1600],fim:[197,205,12400],acordos:19,quebras:3,contatos:1120,entr:94.8,fases:[1,2,3,2,2,1],st:'Fechado em 31/07'},
 '08':{n:'agosto',ini:[197,205,12400],ent:[114,128,24800],pag:[21,26,9350],desc:1850,ret:[9,11,4100],fim:[281,296,21900],acordos:34,quebras:4,contatos:1480,entr:95.1,fases:[2,4,5,3,5,2],st:'Fechado em 31/08'},
 '09':{n:'setembro',ini:[281,296,21900],ent:[704,1062,390480],pag:[86,94,38460],desc:6440,ret:[6,6,3180],fim:[893,1258,364300],acordos:118,quebras:5,contatos:5106,entr:96.3,fases:[8,12,15,14,24,13],st:'Fecha em 30/09'}
};
FM.ano={n:'2026',ini:[0,0,0],ent:[1030,1411,434180],pag:[118,132,51930],desc:9070,ret:[19,21,8880],fim:[893,1258,364300],acordos:171,quebras:12,contatos:7706,entr:96,fases:[11,18,23,19,31,16],st:'De julho a setembro'};
const MESN=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
const MESL=['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
function ftipH(title,rows,side){ return `<div class="hvt ${side||''}" role="tooltip"><h4>${title}</h4>${rows.map(r=>`<div class="r"><span>${r[0]}</span><b>${r[1]}</b></div>`).join('')}</div>`; }
function vFechamentos(){
  const k=S.fm||'09'; const M=FM[k]; const ano=k==='ano'; const base=M.ini[2]+M.ent[2]; const taxa=M.pag[2]/base*100;
  const label=ano?'2026, ano todo':MESL[+k-1][0].toUpperCase()+MESL[+k-1].slice(1)+' de 2026';
  const picker=`<div class="pop"><button type="button" class="ppick" data-a="fyopen" aria-expanded="${S.fyOpen}">${ic('cal','sm')}<b>${label}</b>${ic('chev','sm')}</button>
    ${S.fyOpen?`<div class="popm pcal" role="dialog" aria-label="Escolher período"><div class="pch"><button type="button" class="xbtn" disabled aria-label="Ano anterior" title="Sem cobrança em 2025">${ic('back','sm')}</button><b>2026</b><button type="button" class="xbtn" disabled aria-label="Próximo ano">${ic('chev','sm')}</button></div>
      <div class="pcg">${MESN.map((m,i)=>{const key=String(i+1).padStart(2,'0'); const has=!!FM[key]; return `<button type="button" class="pcm ${k===key?'on':''}" ${has?`data-a="fmsel" data-v="${key}"`:'disabled'}>${m}</button>`;}).join('')}</div>
      <button type="button" class="pcy ${ano?'on':''}" data-a="fmsel" data-v="ano">Ver o ano todo</button></div>`:''}</div>`;
  // cascata (mês) ou mês a mês (ano)
  let chart;
  if(!ano){
    const segIn=[['ini','Saldo do mês anterior',M.ini,'rgba(var(--sv),.45)'],['ent','Entradas do mês',M.ent,'var(--b-ent)']];
    const segOut=[['rec','Recuperado',M.pag,'var(--good)'],['dsc','Descontos concedidos',[null,null,M.desc],'var(--act-hl)'],['ret','Retirados da base',M.ret,'var(--warn)'],['fim','Em aberto no fechamento',M.fim,'rgba(var(--sv),.22)']];
    const bar=(arr,row)=>{ let acc=0; return arr.map((x,i)=>{ const v=x[2][2]; const w=v/base*100; const mid=acc+w/2; acc+=w; const key='b'+row+i; const on=S.ftip===key; const al=mid<35?'l':mid>65?'r':'';
      const rows=[['Valor',brl(v)],['Da carteira',pct(w)],...(x[2][0]!=null?[['Devedores',num(x[2][0])],['Títulos',num(x[2][1])]]:[['Aplicados em',num(M.pag[0])+' pagamentos']])];
      return v>0?`<div class="bs hv ${on?'on':''}" data-v="${key}" style="width:${Math.max(w,.8)}%;--c:${x[3]}">${w>9?`<span>${pct(w)}</span>`:''}${on?ftipH(x[1],rows,(row===0?'dn ':'up ')+al):''}</div>`:''; }).join(''); };
    const key=[...segIn,...segOut].map(x=>`<span><i style="background:${x[3]}"></i>${x[1]}</span>`).join('');
    chart=`<div class="bal hvwrap">
      <div class="brow"><div class="bh"><span>Composição da carteira</span><b>${brl(base)}</b></div><div class="bbar">${bar(segIn,0)}</div></div>
      <div class="brow"><div class="bh"><span>Resultado no fechamento</span><b>${brl(base)}</b></div><div class="bbar">${bar(segOut,1)}</div></div>
      <div class="bkey">${key}</div>
    </div>`;
  } else {
    const mx=Math.max(...['07','08','09'].map(x=>FM[x].pag[2]));
    chart=`<div class="mbars2 hvwrap">${MESN.map((m,i)=>{ const key=String(i+1).padStart(2,'0'); const F=FM[key]; const v=F?F.pag[2]:0; const on=S.ftip==='m'+i;
      return `<div class="mc ${F?'':'off'} ${on?'on':''} ${F?'hv':''}" ${F?`data-v="m${i}" tabindex="0"`:''}><span class="wv">${F?'R$ '+kfmt(v):''}</span><div class="mt"><i style="height:${F?Math.max(v/mx*100,3):0}%">${on&&F?ftipH(MESL[i][0].toUpperCase()+MESL[i].slice(1),[['Recuperado',brl(v)],['Recuperação',pct(v/(F.ini[2]+F.ent[2])*100)],['Devedores que pagaram',num(F.pag[0])],['Títulos recuperados',num(F.pag[1])],['Em aberto no fim',brl(F.fim[2])]],(v/mx*100)>55?(i>=6?'sl':'sr'):''):''}</i></div><span class="wl">${m}</span></div>`; }).join('')}</div>`;
  }
  const B={'07':[212,198,51,1],'08':[311,296,88,1],'09':[985,941,312,3],ano:[1030,979,397,5]}[k];
  const devs=B[0], alc=B[1], ace=B[2], dsc=B[3];
  const pen=ace/alc*100, cont=alc/devs*100, conv=M.acordos/ace*100, cump=M.pag[0]/(M.pag[0]+M.quebras)*100;
  const ring=(v,c)=>`<svg class="ring" viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="18" fill="none" style="stroke:var(--ring-tr)" stroke-width="5"/><circle cx="22" cy="22" r="18" fill="none" style="stroke:${c}" stroke-width="5" stroke-linecap="round" stroke-dasharray="${(v/100*113.1).toFixed(1)} 113.1" transform="rotate(-90 22 22)"/></svg>`;
  const kp=(t,v,c,d)=>`<div class="bk">${ring(v,c)}<div><span>${t}</span><b>${pct(v)}</b><small>${d}</small></div></div>`;
  const per=ano?'no período':'no mês';
  return `<div class="ptabs tbar fbar">${picker}<span class="sp"></span><span class="eact"><button class="ib2" type="button" data-a="evd" data-v="fech-dl" aria-label="Baixar relatório" title="Baixar relatório">${ic('dl','sm')}</button></span></div>
  <section class="glass fhero3">${INF('g4')}
    <div class="fh3-top">
      <div class="fh-l"><span class="fh-k">Recuperado ${ano?'em 2026':'em '+M.n}</span><b class="fh-v"><small>R$</small>${brl(M.pag[2]).replace('R$','').trim()}</b></div>
      <div class="fh-r"><span class="fh-p">${pct(taxa)}</span><span>de recuperação sobre a carteira ${ano?'do período':'do mês'}</span></div>
      <span class="fh-st">${M.st}</span>
    </div>
    <div class="fh3-row">
      <div><span>Carteira ${ano?'do período':'do mês'}</span><b>${brl(base)}</b><small>valor em cobrança ${per}</small></div>
      <div><span>Títulos</span><b>${num(M.ini[1]+M.ent[1])} <em>→ ${num(M.fim[1])}</em></b><small>${num(M.pag[1])} recuperados, ${num(M.ret[1])} retirados</small></div>
      <div><span>Devedores</span><b>${num(M.ini[0]+M.ent[0])} <em>→ ${num(M.fim[0])}</em></b><small>${num(M.pag[0])} pagaram, ${num(M.ret[0])} retirados</small></div>
      <div><span>Restou em aberto</span><b>${brl(M.fim[2])}</b><small>${pct(M.fim[2]/base*100)} da carteira, ${brl(M.desc)} em descontos</small></div>
    </div>
  </section>
  <section class="glass fbeh"><div class="card-h"><div><h2>Comportamento da carteira</h2></div></div>
    <div class="bkg">
      ${kp('Contatabilidade',cont,'var(--info)',`${num(alc)} de ${num(devs)} devedores receberam ao menos uma mensagem`)}
      ${kp('Penetração na carteira',pen,'var(--act-hl)',`${num(ace)} devedores entraram no autoatendimento`)}
      ${kp('Conversão em acordo',conv,'var(--silver)',`${num(M.acordos)} acordos de quem acessou a proposta`)}
      ${kp('Cumprimento dos acordos',cump,'var(--good)',`${num(M.pag[0])} pagos e ${num(M.quebras)} quebrados`)}
    </div>
      </section>
  <section class="glass fchart"><div class="card-h"><div><h2>${ano?'Comparativo anual':'Movimento da carteira'}</h2></div></div>${chart}</section>
  <p class="finfo">${ic('mail','sm')}<span>No primeiro dia útil de cada mês, o relatório do mês anterior chega por e-mail para a administradora, em PDF e Excel. Os fechamentos ficam guardados por 90 dias; com o armazenamento adicional, ficam todos os meses e a visão do ano inteiro.</span>${S.role==='admin'?'<a class="lk" href="#/plano/armazenamento">Ver armazenamento</a>':''}</p>`;
}


const REPS=[
 ['resumo','Resumo do fechamento','PDF','Uma página com indicadores, comportamento e movimento da carteira',null],
 ['pag','Pagamentos','Excel','Uma linha por pagamento, com título, valor pago, data e forma',[['Devedor','Documento','Título','Vencimento','Valor original','Valor pago','Data do pagamento','Forma','Origem'],[['Roberta Lima','318.456.789-04','MEN-ROB-04210','26/05/2026','R$ 1.000,00','R$ 901,00','23/09/2026','Pix','Plataforma'],['Empresa Alfa Ltda','12.345.901/0001-04','CONV-ALF-04190','20/05/2026','R$ 1.850,00','R$ 1.900,00','20/08/2026','Boleto','Baixa manual']]]],
 ['cart','Carteira no fechamento','Excel','Uma linha por título, com a situação no último dia do período',[['Devedor','Documento','Título','Vencimento','Valor original','Valor atualizado','Situação','Fase da régua'],[['Anderson Freitas','318.112.340-04','MEN-AND-04192','20/06/2026','R$ 1.103,77','R$ 1.170,00','Em aberto','Fase 4'],['Luciana Prado','318.330.671-04','MEN-LUC-04124','10/02/2026','R$ 420,00','R$ 445,20','Em acordo','Fase 5'],['Roberta Lima','318.456.789-04','MEN-ROB-04210','26/05/2026','R$ 1.000,00','—','Pago','Fase 5']]]],
 ['dev','Resumo por devedor','Excel','Uma linha por devedor: títulos, pagos, retirados, acordos e acionamentos',[['Devedor','Documento','Títulos no período','Títulos atuais','Pagos','Retirados','Valor pago','Acordos','Acionamentos'],[['Empresa Alfa Ltda','12.345.901/0001-04','3','2','1','0','R$ 1.900,00','0','6'],['Beatriz Campos','318.908.215-04','3','2','1','0','R$ 686,88','1','4'],['Roberta Lima','318.456.789-04','1','0','1','0','R$ 901,00','2','19']]]],
 ['aco','Acordos','Excel','Fechados, pagos e quebrados, com condição e vencimento',[['Devedor','Data do acordo','Condição','Valor do acordo','Vencimento','Situação'],[['Luciana Prado','22/09/2026','À vista, 25%','R$ 585,00','25/09/2026','Aguardando'],['Roberta Lima','23/09/2026','À vista, 15%','R$ 901,00','24/09/2026','Pago'],['Carla Mendes','15/09/2026','À vista, 15%','R$ 1.139,00','18/09/2026','Quebrado']]]],
 ['ret','Retirados e títulos excluídos','Excel','Motivo, data e quem retirou',[['Devedor','Documento','Data','Motivo','Responsável'],[['Sandra Moreira','318.219.560-04','20/09/2026','Pediu para não receber contatos','Plataforma'],['Marcos Teixeira','318.771.002-04','14/09/2026','Pagou direto à empresa','Renata Albuquerque']]]],
 ['acn','Acionamentos','Excel','Uma linha por mensagem enviada: canal, fase, entrega, abertura e clique',[['Data e hora','Devedor','Documento','Canal','Fase','Entregue','Abriu','Clicou'],[['23/09/2026 09:05','Roberta Lima','318.456.789-04','SMS','Gatilho','Sim','—','Sim'],['21/09/2026 10:00','Roberta Lima','318.456.789-04','E-mail','Fase 5','Sim','Sim','Não'],['15/09/2026 10:00','Beatriz Campos','318.908.215-04','E-mail','Fase 3','Sim','Sim','Não']]]]
];
function base0(M){ return M.ini[2]+M.ent[2]; }
function pdfMini(M,per,base){ return `<div class="pdfp"><div class="pg"><div class="pg-h"><span class="pg-wm">PINK</span><small>Resumo do fechamento</small></div><h4>${per}</h4><p class="pg-s">Escola Horizonte · gerado em 23/09/2026</p>
  <div class="pg-k"><div><small>Recuperado</small><b>${brl(M.pag[2])}</b></div><div><small>Recuperação</small><b>${pct(M.pag[2]/base*100)}</b></div><div><small>Restou em aberto</small><b>${brl(M.fim[2])}</b></div></div>
  <p class="pg-t">Carteira</p><div class="pg-r"><span>Carteira do período</span><span>${brl(base)}</span></div><div class="pg-r"><span>Títulos</span><span>${num(M.ini[1]+M.ent[1])} → ${num(M.fim[1])}</span></div><div class="pg-r"><span>Devedores</span><span>${num(M.ini[0]+M.ent[0])} → ${num(M.fim[0])}</span></div>
  <p class="pg-t">Comportamento</p><div class="pg-r"><span>Acordos fechados</span><span>${num(M.acordos)}</span></div><div class="pg-r"><span>Acordos não pagos</span><span>${num(M.quebras)}</span></div><div class="pg-r"><span>Acionamentos</span><span>${num(M.contatos)}</span></div>
  <p class="pg-t">Movimento da carteira</p><div style="display:flex;height:10px;border-radius:5px;overflow:hidden;gap:2px;margin-top:4px"><i style="width:${M.pag[2]/base*100}%;background:#5CC29C"></i><i style="width:${Math.max(M.desc/base*100,1)}%;background:#F0288F"></i><i style="width:${Math.max(M.ret[2]/base*100,1)}%;background:#E3B566"></i><i style="flex:1;background:#D1D5DB"></i></div>
  <div class="pg-f"><span>Pink · by Automate 360°</span><span>Página 1 de 1</span></div></div></div>`; }
function fechDl(){
  const k=S.fm||'09'; const M=FM[k]; const ano=k==='ano';
  const per=ano?'2026, de julho a setembro':M.n[0].toUpperCase()+M.n.slice(1)+' de 2026';
  const sel=S.rsel||['resumo','pag','cart']; const pv=S.rprev;
  const big=ano||sel.includes('acn');
  const P=pv?REPS.find(r=>r[0]===pv):null;
  return {kick:'Relatórios do fechamento',title:per,sub:'Escolha os relatórios. O resumo vem em PDF; os detalhes, em Excel',
    body:`<div class="rlist">${REPS.map(r=>`<div class="rr ${sel.includes(r[0])?'on':''}"><label><input type="checkbox" data-a="rsel" value="${r[0]}" ${sel.includes(r[0])?'checked':''}><span><b>${r[1]}</b><small>${r[3]}</small></span></label><span class="rf ${r[2]==='PDF'?'pdf':'xls'}">${r[2]}</span><button type="button" class="lk" data-a="rprev" data-v="${r[0]}">${pv===r[0]?'Ocultar':r[4]?'Ver colunas':'Ver prévia'}</button></div>${pv===r[0]?`<div class="rpv">${r[4]?xgrid(r[4][0],r[4][1]):pdfMini(M,per,base0(M))}</div>`:''}`).join('')}</div>
      ${big?`<div class="warnb" style="background:rgba(141,190,229,.08);color:var(--info)">${ic('info','sm')}<span>${ano?'O período tem vários meses':'Acionamentos é um arquivo grande'}: vamos preparar os relatórios em segundo plano e enviar para o seu e-mail quando estiverem prontos. Pode levar alguns minutos.</span></div>`:''}
      <p class="faint" style="font-size:12.5px">No fechamento de cada mês, estes relatórios são gerados e enviados automaticamente para o e-mail da administradora. Cada download fica na trilha de auditoria.</p>`,
    foot:`<button class="btn" type="button" data-a="evsave" data-m="${big?'Relatórios em preparação. Você recebe por e-mail quando ficarem prontos':'Relatórios baixados'}" ${sel.length?'':'disabled'}>${ic(big?'mail':'dl','sm')}${big?'Gerar e enviar por e-mail':'Baixar '+sel.length+(sel.length===1?' relatório':' relatórios')}</button><button class="btn-2" type="button" data-a="evclose">Cancelar</button>`};
}

/* CONFIGURAÇÕES */
P.building='<path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M16 9h3a2 2 0 0 1 2 2v10M9 7h3M9 11h3M9 15h3"/>';
P.palette='<circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/><path d="M12 2a10 10 0 0 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.4A5.6 5.6 0 0 0 22 9.8C22 5.5 17.5 2 12 2z"/>';
P.percent='<path d="M19 5 5 19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>';
P.code='<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>';
P.bell='<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 0 0 3.4 0"/>';
P.key='<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/>';
P.globe2='<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>';
P.eye='<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>';
P.eyeoff='<path d="M3 3l18 18M10.6 5.1A10.4 10.4 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4M6.6 6.6A17 17 0 0 0 2 12s3.6 7 10 7a9.7 9.7 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2"/>';
P.copy='<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>';
P.history='<path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l4 2"/>';
const CFG=[
 ['empresa','building','Empresa','Dados que aparecem para os devedores','ok'],
 ['negocio','sparkle','Sobre o negócio','Base para a IA sugerir os textos','pend'],
 ['identidade','palette','Identidade visual','Logo e cor nos e-mails e no portal','ok'],
 ['usuarios','users','Usuários','Quem acessa e o que pode fazer','ok'],
 ['negociacao','percent','Regras de negociação','Descontos, parcelas e prazos','ok'],
 ['recebimento','wallet','Financeiro','Conta, taxas e repasses','ok'],
 ['canais','send','Canais de envio','E-mail, SMS e horários','pend'],
 ['notificacoes','bell','Avisos e relatórios','O que chega no seu e-mail','ok'],
 ['api','code','Integrações e API','Conectar com outros sistemas','opt'],
 ['auditoria','history','Trilha de auditoria','Tudo o que foi feito na conta','ok'],
 ['bloqueio','shield','Lista de bloqueio','Contatos que pediram para sair','ok']
];
const EDITABLE=['empresa','negocio','identidade','negociacao','recebimento','canais','notificacoes'];
const HRS=Array.from({length:17},(_,i)=>String(i+6).padStart(2,'0')+':00');
const DSEM=['Seg','Ter','Qua','Qui','Sex','Sáb'];
function cdef(){ return {atend:false,atDays:[1,1,1,1,1,0],atH:['08:00','18:00'],hrs:{u:[true,'08:00','20:00'],s:[true,'08:00','14:00']},cfgLogo:true,cfgCor:true,cor:S.cor,tom:0,
  fx:[{ate:90,d:10,p:6},{ate:180,d:15,p:10},{ate:360,d:25,p:12},{ate:null,d:0,p:12}],enc:{j:1,v:5,t:2},fpg:{pix:true,bol:true,car:true},notif:{r:true,p:false,a:true,f:true,v:true,w:false},smsName:'EscHorizonte'}; }
function CF(){ if(!S.cf) S.cf=cdef(); return S.cf; }
function markDirty(){ if(!S.cfgDirty){ S.cfgSnap=JSON.parse(JSON.stringify(CF())); S.cfgDirty=true; } }
function cfgSec(t,d,body,act){ return `<section class="cs2"><div class="cs2-h"><div><h3>${t}</h3>${d?`<p>${d}</p>`:''}</div>${act||''}</div>${body}</section>`; }
function fI(l,v,h,o){ o=o||{}; return `<label class="fld">${l}<input value="${esc(v)}" ${o.id?`id="${o.id}"`:''} ${o.ro?'readonly':''} ${o.type?`type="${o.type}"`:''} ${o.ph?`placeholder="${o.ph}"`:''} ${o.max?`maxlength="${o.max}"`:''}>${h?`<span class="hint">${h}</span>`:''}</label>`; }
function fT(l,v,h,ph){ return `<label class="fld">${l}<textarea class="edit" style="min-height:96px;box-shadow:none;border-color:var(--edge-3)" placeholder="${ph||''}">${esc(v)}</textarea>${h?`<span class="hint">${h}</span>`:''}</label>`; }
function sw2(on,a,v,dis){ return `<button type="button" class="switch" role="switch" aria-checked="${on}" data-a="${a}" data-v="${v||''}" ${dis?'disabled':''}><span></span></button>`; }
function tpk(key,val){ const open=S.tpOpen===key; return `<div class="pop tpk"><button type="button" class="tpb" data-a="tpopen" data-v="${key}" aria-expanded="${open}" aria-haspopup="listbox">${val}${ic('chev','sm')}</button>${open?`<div class="tpl" role="listbox">${HRS.map(h=>`<button type="button" role="option" class="${h===val?'on':''}" aria-selected="${h===val}" data-a="tppick" data-v="${key}|${h}">${h}</button>`).join('')}</div>`:''}</div>`; }
function stp(val,a,v,lab){ return `<span class="stpx"><button type="button" data-a="${a}" data-v="${v}|-1" aria-label="Diminuir">−</button><em>${val}</em><button type="button" data-a="${a}" data-v="${v}|1" aria-label="Aumentar">+</button></span>${lab?`<span class="stl">${lab}</span>`:''}`; }
function brandPrev(){ const F=CF(); const useC=F.cfgCor, useL=F.cfgLogo; const c=useC?S.cor:'#161F33', b=useC?S.cor:'#D80073';
  return `<div class="cprev"><div><span class="faint">No e-mail</span><div class="mini-mail"><div style="background:${c}">${useL?'<i>EH</i>':'<span>Escola Horizonte</span>'}</div><p></p><p class="s"></p><em style="background:${b}">Ver minha proposta</em></div></div><div><span class="faint">No portal do devedor</span><div class="mini-ph"><div style="background:${c}">${useL?'<i class="pl">EH</i>':''}Escola Horizonte</div><p></p><p class="s"></p><em style="background:${b}">Pagar com Pix</em></div></div></div>${useC?'':'<p class="faint" style="font-size:12.5px;margin:0">Sem cor própria, os e-mails e o portal usam o visual padrão da plataforma.</p>'}`; }
function vConfig(sec){
  const ad=S.role==='admin'; sec=CFG.find(c=>c[0]===sec)?sec:'empresa'; const F=CF();
  const C=CFG.find(c=>c[0]===sec); const done=CFG.filter(c=>c[4]==='ok').length;
  const nav=`<nav class="cfgnav" aria-label="Seções de configuração">${CFG.map(c=>`<a href="#/config/${c[0]}" class="${c[0]===sec?'on':''}" ${c[0]===sec?'aria-current="page"':''}><span class="cn-i">${ic(c[1],'sm')}</span><span class="cn-t"><b>${c[2]}</b><small>${c[3]}</small></span>${c[4]==='pend'?'<i class="cn-d" title="Falta configurar"></i>':''}</a>`).join('')}</nav>`;
  let body='';
  if(!ad&&sec!=='usuarios'){ body=`<div class="cfg-ro">${ic('shield')}<b>Só a administradora altera as configurações</b><p>Você pode ver as informações, mas não alterar. Para mudar alguma coisa, fale com Renata Albuquerque.</p></div>`; }
  if(sec==='empresa'){ const at=F.atend;
    body+=cfgSec('Dados da empresa','O nome de exibição aparece nos e-mails, nos SMS e no portal do devedor.',`<div class="g2">${fI('Nome de exibição','Escola Horizonte','É assim que o devedor vê a sua empresa')}${fI('Razão social','Escola Horizonte Educação Ltda')}</div><div class="g2">${fI('CNPJ','12.345.678/0001-90','',{ro:true})}${fI('Segmento','Educação')}</div>`)
    +cfgSec('Atendimento humano aos devedores','Opcional. A plataforma resolve a negociação sozinha. Ative só se alguém da empresa puder responder os devedores.',`<div class="tgl"><div><span><b>Mostrar um contato da empresa para o devedor</b><small>${at?'O contato aparece no portal e no rodapé dos e-mails, como alternativa ao autoatendimento.':'Desativado: o devedor resolve tudo pelo autoatendimento e não vê nenhum contato.'}</small></span>${sw2(at,'atend')}</div></div>${at?`<div class="g2">${fI('E-mail de atendimento','financeiro@escolahorizonte.com.br')}${fI('Telefone ou WhatsApp','(11) 3456-7890')}</div>
      <div class="fld"><span>Dias de atendimento</span><div class="dchips">${DSEM.map((d,i)=>`<button type="button" class="dch" aria-pressed="${!!F.atDays[i]}" data-a="atday" data-v="${i}">${d}</button>`).join('')}</div></div>
      <div class="fld"><span>Horário</span><div class="hrt">das ${tpk('a0',F.atH[0])} às ${tpk('a1',F.atH[1])}</div></div>`:''}`); }
  if(sec==='negocio') body+=cfgSec('Conte sobre o seu negócio','A IA usa estas respostas para sugerir os textos das mensagens, no tom certo para o seu público. Nada disso aparece para o devedor.',`${fT('O que a empresa faz','Escola de ensino fundamental e médio em São Paulo, com cerca de 1.200 alunos. A maioria das famílias paga mensalidade por boleto.','Em poucas frases, como você explicaria para alguém de fora')}${fT('Quem são os seus devedores','Pais e responsáveis de alunos, muitos ainda com filhos matriculados. Alguns ex-alunos com mensalidades antigas.','Isso ajuda a IA a acertar o tom')}
      <div><h3 style="font-size:13px;margin:0 0 8px">Tom das mensagens</h3><div class="otypes one">${['Acolhedor','Neutro','Direto'].map((x,i)=>`<button type="button" class="otp" aria-pressed="${F.tom===i}" data-a="tom" data-v="${i}">${x}</button>`).join('')}</div></div>
      ${fT('O que nunca deve aparecer nas mensagens','Não citar o nome do aluno. Não mencionar rematrícula ou histórico escolar.','Regras que a IA sempre vai respeitar')}`)
    +`<div class="aitip">${ic('sparkle','sm')}<span>Quanto mais claro, melhores as sugestões. As mensagens já aprovadas não mudam sozinhas quando você altera estas respostas.</span></div>`;
  if(sec==='identidade'){ const useL=F.cfgLogo, useC=F.cfgCor;
    body+=cfgSec('Logo','PNG ou SVG, com fundo transparente. Aparece no topo dos e-mails e do portal.',`<div class="tgl"><div><span><b>Usar o logo</b><small>${useL?'O logo aparece no lugar do nome.':'Sem logo: aparece o nome de exibição da empresa.'}</small></span>${sw2(useL,'cfglogo')}</div></div>${useL?`<div class="lgrow"><span class="lgbox">EH</span><div><button class="btn-2 bsm" type="button" data-a="toast" data-m="Escolha um arquivo do computador">${ic('upload','sm')}Trocar logo</button><p class="faint" style="font-size:12.5px;margin-top:6px">logo-escola-horizonte.png, enviado em 11/09/2026</p></div></div>`:''}`)
    +cfgSec('Cor da empresa','Usada no topo dos e-mails, nos botões e no portal.',`<div class="tgl"><div><span><b>Usar a cor da empresa</b><small>${useC?'Escolha qualquer cor ou digite o código.':'Desativado: vale o visual padrão da plataforma.'}</small></span>${sw2(useC,'cfgcor')}</div></div>${useC?`<div class="cpick2"><label class="cwheel" style="--c:${S.cor}"><input type="color" id="cfg-color" value="${S.cor}" aria-label="Escolher cor"></label><label class="hexf"><span style="background:${S.cor}"></span><input id="cfg-hex" value="${S.cor.toUpperCase()}" maxlength="7" aria-label="Código da cor"></label><span class="faint" style="font-size:12.5px">Clique no círculo para abrir todas as cores</span></div>`:''}`)
    +cfgSec('Como fica para o devedor','',brandPrev()); }
  if(sec==='usuarios'){ const ps=S.paula||'ativa'; const sw=!!S.adminSwap; const pn=S.pName||'Paula Reis', pm=S.pMail||'paula@escolahorizonte.com.br';
    const R=['Renata Albuquerque','renata@escolahorizonte.com.br'], Pp=[pn,pm];
    const U=[[...(sw?Pp:R),'Administradora',sw?'Último acesso hoje, 09:12':'Último acesso agora',sw?0:1,'adm']]; if(ps!=='none') U.push([...(sw?R:Pp),'Usuária',ps==='convite'?'Convite enviado, vale 7 dias':(sw?'Último acesso agora':'Último acesso hoje, 09:12'),sw?1:0,'usr']);
    const menuFor=(u,i)=>{ const me=u[4]; const L=[]; if(me) L.push(['toast','Enviar link para criar nova senha','Link enviado para '+u[1]]); else if(u[5]==='usr'&&ps==='convite'){ L.push(['toast','Reenviar convite','Convite reenviado']); L.push(['cfg-rem','Cancelar convite','',1]); } else if(u[5]==='usr'){ L.push(['cfg-transf','Tornar administradora','']); L.push(['toast','Enviar link para criar nova senha','Link enviado para '+u[1]]); L.push(['cfg-rem','Remover acesso','',1]); } return L; };
    const canAct=ad&&!sw;
    body+=cfgSec('Pessoas com acesso',`${U.length} de 2 acessos do seu plano: uma administradora e uma usuária`,`<div class="ulist">${U.map((u,i)=>{ const L=menuFor(u,i); return `<div class="urow"><span class="av">${u[0].split(' ').map(x=>x[0]).slice(0,2).join('')}</span><span class="un"><b>${u[0]}${u[4]?' <small class="faint">(você)</small>':''}</b><small>${u[1]}</small></span><span class="chip ${u[5]==='adm'?'c-info':'c-neutral'}">${u[2]}</span><span class="ul" ${ps==='convite'&&u[5]==='usr'?'style="color:var(--warn)"':''}>${u[3]}</span>${(canAct||u[4])&&L.length?`<div class="pop"><button class="ib2" type="button" data-a="umenu" data-v="${i}" aria-expanded="${S.umenu===String(i)}" aria-label="Opções de ${u[0]}">${ic('more','sm')}</button>${S.umenu===String(i)?`<div class="popm mini" style="width:260px">${L.map(m=>`<button type="button" class="pi ${m[3]?'dg':''}" data-a="${m[0]==='toast'?'toast':'evd'}" data-v="${m[0]}" data-m="${m[2]}"><b>${m[1]}</b></button>`).join('')}</div>`:''}</div>`:'<span></span>'}</div>`;}).join('')}</div>${ps==='none'?`<div class="uempty">${ic('users','sm')}<span>O plano inclui mais um acesso, para uma usuária. Adicione alguém da equipe para acompanhar a carteira com você.</span></div>`:''}`,canAct?`<button class="${ps==='none'?'btn':'btn-2'} bsm" type="button" data-a="evd" data-v="cfg-conv">${ic('plus','sm')}Adicionar pessoa</button>`:'')
    +cfgSec('Administração da conta','A conta sempre tem uma administradora. Ela pode passar essa função para a usuária.',`${sw?`<div class="conn ok"><span class="cn-i">${ic('key','sm')}</span><div><b>${pn} é a administradora desde hoje</b><small>Você passou a ser usuária. Para voltar, ${pn.split(' ')[0]} precisa transferir de novo.</small></div><button class="lk proto-l" type="button" data-a="tfundo">Desfazer simulação</button></div>`:S.transf?`<div class="conn pend"><span class="cn-i">${ic('send','sm')}</span><div><b>Aguardando ${pn.split(' ')[0]} aceitar</b><small>O pedido foi enviado para ${pm} e vale por 7 dias. Até o aceite, nada muda.</small></div><button class="btn-2 bsm" type="button" data-a="tfcancel">Cancelar pedido</button><button class="lk proto-l" type="button" data-a="tfok">Simular aceite</button></div>`:`<div class="conn"><span class="cn-i">${ic('key','sm')}</span><div><b>Renata Albuquerque é a administradora</b><small>${ps==='ativa'?`Ao transferir, Renata passa a ser usuária e ${pn.split(' ')[0]} assume a administração.`:'Para transferir, é preciso ter uma usuária ativa.'}</small></div>${ad&&ps==='ativa'?`<button class="btn-2 bsm" type="button" data-a="evd" data-v="cfg-transf">Transferir administração</button>`:''}</div>`}<p class="faint" style="font-size:12.5px;margin:0;line-height:1.5">Se a administradora sair da empresa sem transferir, o responsável legal pede a troca em <a class="lk" href="#/ajuda/config">Ajuda</a>, com o CNPJ e um documento.</p>`)
    +cfgSec('O que cada perfil pode fazer','',`<div class="perm"><div><b>Administradora</b><p>Tudo: incluir e retirar devedores, editar mensagens, mudar configurações, ver fechamentos e baixar relatórios.</p></div><div><b>Usuária</b><p>Acompanha a carteira, registra ocorrências e pagamentos, pausa a cobrança de um devedor. Não altera configurações nem retira devedores.</p></div></div>`); }
  if(sec==='negociacao'){ const X=F.fx; const nm=F.nmode||'atraso'; const G=F.geral||{d:10,p:5};
    const dOn=F.descOn!==false; body+=cfgSec('Descontos e parcelas','Escolha se a condição muda conforme o tempo de atraso ou se é a mesma para a carteira inteira.',`<div class="tgl"><div><span><b>Oferecer desconto</b><small>${dOn?'O devedor vê o desconto da condição dele.':'Desativado: a proposta é sobre o valor da dívida, sem desconto. Só o parcelamento continua.'}</small></span>${sw2(dOn,'desctg')}</div></div><div class="segm nmode" role="group">${[['atraso','Por tempo de atraso'],['geral','Igual para a carteira inteira']].map(x=>`<button type="button" data-a="nmode" data-v="${x[0]}" aria-pressed="${nm===x[0]}">${x[1]}</button>`).join('')}</div>`+(nm==='geral'?`<div class="encl">${dOn?`<div><span>Desconto à vista</span><div class="enc-v">${stp(G.d?G.d+'%':'Sem desconto','gxs','d')}</div><small>Vale para todos os devedores, qualquer que seja o atraso</small></div>`:''}<div><span>Parcelas no cartão</span><div class="enc-v">${stp(G.p===1?'À vista':'até '+G.p+'x','gxs','p')}</div></div></div>`:`<p class="faint" style="font-size:12.5px;margin:0">O devedor vê só a melhor condição da faixa dele. Cada faixa começa um dia depois da anterior.</p><div class="ftbl ${dOn?'':'nod'}"><div class="fth"><span>Atraso</span><span>${dOn?'Desconto à vista':''}</span><span>Parcelas no cartão</span><span></span></div>${X.map((f,i)=>{ const de=i?X[i-1].ate+1:0; return `<div class="ftr"><span class="fxa">${f.ate==null?`<b>Mais de ${X[i-1]?X[i-1].ate:0} dias</b>`:`<span class="faint">de ${de} a</span>${stp(f.ate,'fxs',i+'|ate')}<span class="faint">dias</span>`}</span><span>${dOn?stp(f.d?f.d+'%':'Sem desconto','fxs',i+'|d'):''}</span><span>${stp(f.p===1?'À vista':'até '+f.p+'x','fxs',i+'|p')}</span>${X.length>2&&f.ate!=null?`<button class="ib2" type="button" data-a="fxr" data-v="${i}" aria-label="Remover faixa" title="Remover faixa">${ic('x','sm')}</button>`:'<span></span>'}</div>`;}).join('')}</div><button class="btn-2 bsm" type="button" data-a="fxa" style="align-self:flex-start">${ic('plus','sm')}Adicionar faixa</button>`))
    +cfgSec('Encargos','Multa e juros sobre os títulos em atraso.',`<div class="tgl"><div><span><b>Cobrar multa e juros</b><small>${F.encOn!==false?'As propostas usam o valor atualizado, com multa e juros.':'Desativado: as propostas usam o valor original dos títulos.'}</small></span>${sw2(F.encOn!==false,'enctg')}</div></div>${F.encOn!==false?`<div class="encl">
      <div><span>Multa por atraso</span><div class="enc-v"><span class="stpx ro"><em>2%</em></span><span class="stl">limite legal</span></div></div>
      <div><span>Juros</span><div class="enc-v">${stp(String(F.enc.j).replace('.',',')+'%','encs','j','ao mês')}</div><small>Teto em validação com o jurídico</small></div></div>`:''}`)
    +cfgSec('Prazos','Só os números mudam. As frases ficam fixas para não haver dúvida.',`<div class="encl">
      <div><span>Validade da proposta</span><div class="enc-v">${stp(F.enc.v,'encs','v',F.enc.v===1?'dia':'dias')}</div></div>
      <div><span>Tolerância para pagar o acordo</span><div class="enc-v">${stp(F.enc.t,'encs','t',(F.enc.t===1?'dia útil':'dias úteis')+' depois do vencimento')}</div><small>Mínimo de 2 dias úteis, o prazo que o parceiro leva para confirmar qualquer pagamento. Depois disso, o acordo é considerado não pago.</small></div>
    </div>`); }
  if(sec==='recebimento') body+=finSec(ad,F);
  if(sec==='canais'){ const H=F.hrs;
    body+=cfgSec('E-mail','Os e-mails saem com o nome e o endereço abaixo.',`<div class="g2">${fI('Nome do remetente','Escola Horizonte')}${fI('Endereço que envia','cobranca@escolahorizonte.com.br','O modelo do endereço depende do servidor de envio, em definição')}</div>
      <div class="conn pend"><span class="cn-i">${ic('alert','sm')}</span><div><b>Falta confirmar o domínio escolahorizonte.com.br</b><small>Sem essa confirmação, os e-mails têm mais chance de cair no spam.</small></div><button class="btn bsm" type="button" data-a="evd" data-v="cfg-dom">Ver como confirmar</button></div>`)
    +cfgSec('SMS','',`<div class="conn ok"><span class="cn-i">${ic('sms','sm')}</span><div><b>Envio de SMS ativo</b><small>Os SMS chegam identificados como "${esc(F.smsName)}"</small></div>${ad?`<button class="btn-2 bsm" type="button" data-a="evd" data-v="cfg-sms">Alterar nome</button>`:''}</div>`)
    +cfgSec('Dias e horários dos contatos','Os e-mails e SMS da régua saem só nestes dias e horários. Um contato marcado para fora deles sai no próximo horário permitido. Os horários definitivos estão em validação.',`<div class="hrl">${[['u','Segunda a sexta'],['s','Sábado']].map(x=>{const h=H[x[0]]; return `<div class="hrr ${h[0]?'':'off'}">${sw2(h[0],'hrday',x[0])}<b>${x[1]}</b>${h[0]?`<span class="hrt">das ${tpk(x[0]+'0',h[1])} às ${tpk(x[0]+'1',h[2])}</span>`:'<span class="faint">Nenhum contato sai</span>'}</div>`;}).join('')}<div class="hrr off lock"><span class="lk2">${ic('shield','sm')}</span><b>Domingos e feriados</b><span class="faint">Sem envios. A plataforma não envia contatos nesses dias.</span></div></div>`); }
  if(sec==='notificacoes'){ const N=F.notif;
    body+=cfgSec('Fechamento do mês','No primeiro dia útil, os relatórios do mês anterior ficam disponíveis e o aviso chega para estas pessoas.',`<div class="tgl"><div><span><b>Renata Albuquerque</b><small>renata@escolahorizonte.com.br</small></span>${sw2(N.r,'ntf','r')}</div>${(S.paula||'ativa')!=='none'?`<div><span><b>${S.pName||'Paula Reis'}</b><small>${S.pMail||'paula@escolahorizonte.com.br'}</small></span>${sw2(N.p,'ntf','p')}</div>`:''}</div>`)
    +cfgSec('Avisos do dia a dia','',`<div class="tgl">${[['a','Acordo não pago','Quando um acordo passa do prazo de tolerância, com o devedor e o valor'],['f','Falha de envio alta','Quando mais de 5% dos envios de um dia falham, com o canal e o motivo'],['v','Vagas do plano acabando','Quando sobrarem menos de 10% das vagas'],['w','Resumo semanal','Toda segunda, os números da semana anterior']].map(x=>`<div><span><b>${x[1]}</b><small>${x[2]}${x[0]==='w'?` · <button type="button" class="lk" data-a="evd" data-v="cfg-sem">Ver exemplo</button>`:''}</small></span>${sw2(N[x[0]],'ntf',x[0])}</div>`).join('')}</div>`); }
  if(sec==='api') body+=cfgSec('Para que serve','Conecte o sistema da sua empresa para incluir devedores, consultar a situação de cada um e baixar os relatórios, sem planilha.',`<div class="apiu" style="grid-template-columns:repeat(3,minmax(0,1fr))">${[['Incluir e retirar devedores','Direto do seu sistema financeiro'],['Consultar situação','Pagos, em acordo e em cobrança'],['Baixar relatórios','Os mesmos do fechamento']].map(x=>`<div><b>${x[0]}</b><small>${x[1]}</small></div>`).join('')}</div>`)
    +cfgSec('Endereços da API','Use o endereço de teste enquanto estiver testando, e o de produção quando for de verdade. Cada ação é este endereço mais o caminho que está na documentação.',`<div class="keys">${[['Teste','https://api-teste.pink.com.br/v1'],['Produção','https://api.pink.com.br/v1']].map(u=>`<div class="krow"><span class="cn-i">${ic('globe2','sm')}</span><div><b>${u[0]}</b><code>${u[1]}</code></div><button class="ib2" type="button" data-a="toast" data-m="Endereço copiado" aria-label="Copiar endereço" title="Copiar">${ic('copy','sm')}</button></div>`).join('')}</div>`)
    +cfgSec('Chaves de acesso','Trate como uma senha. Por segurança, a chave aparece inteira só uma vez, logo depois de gerada. Se perder, gere uma nova.',`<div class="keys">${[['prod','Produção','ehz_live_','3f9a','Criada em 11/09/2026 por Renata'],['test','Teste','ehz_test_','81c2','Usa dados de exemplo, sem envios reais']].map(k=>{ const nk=S.newKey&&S.newKey.env===k[0]?S.newKey:null; return `<div class="krow ${nk&&!nk.copied?'fresh':''}"><span class="cn-i">${ic('key','sm')}</span><div><b>${k[1]}</b><code>${nk&&!nk.copied?nk.val:k[2]+'••••••••••••'+(nk?nk.val.slice(-4):k[3])}</code><small>${nk?(nk.copied?'Chave nova copiada. Ela não aparece de novo.':'Copie agora: depois de copiada, a chave não aparece mais.'):k[4]}</small></div>${nk&&!nk.copied?`<button class="btn bsm" type="button" data-a="kcopy">${ic('copy','sm')}Copiar chave</button>`:nk&&nk.copied?`<span class="chip c-good">${ic('check','sm')}Copiada</span>`:''}${ad&&!(nk&&!nk.copied)?`<button class="btn-2 bsm" type="button" data-a="evd" data-v="cfg-key-${k[0]}">Gerar nova</button>`:''}</div>`; }).join('')}</div>`,`<button type="button" class="btn-2 bsm" data-a="evd" data-v="cfg-doc">${ic('code','sm')}Ver documentação</button>`);
  if(sec==='auditoria'){ const A=[['23/09/2026 09:40','Renata Albuquerque','Registrou pagamento','Empresa Alfa Ltda, título CONV-ALF-04190'],['23/09/2026 09:12','Paula Reis','Pausou a cobrança','Thiago Nunes, motivo: aguardando retorno'],['22/09/2026 17:05','Renata Albuquerque','Editou mensagem','E-mail do D4, assunto alterado'],['22/09/2026 16:20','Plataforma','Acordo fechado','Luciana Prado, R$ 585,00'],['21/09/2026 10:30','Renata Albuquerque','Baixou relatório','Fechamento de agosto, Excel'],['20/09/2026 14:02','Plataforma','Devedor saiu da lista','Sandra Moreira, pelo link de saída']];
    body+=cfgSec('Últimas ações','Ninguém apaga ou altera estes registros.',`<div class="aud">${A.map(a=>`<div><time>${a[0]}</time><b>${a[2]}</b><span>${a[3]}</span><small>${a[1]}</small></div>`).join('')}</div>`,`<button class="ib2" type="button" data-a="toast" data-m="Trilha de auditoria baixada em Excel" aria-label="Baixar" title="Baixar">${ic('dl','sm')}</button>`); }
  if(sec==='bloqueio'){ const B=[['20/09/2026 14:02','(11) 9••••-5560','SMS','Sandra Moreira','Link de saída do SMS'],['20/09/2026 14:02','sandra.m••••@email.com','E-mail','Sandra Moreira','Link de saída do SMS, vale para todos os contatos'],['17/09/2026 09:31','rafael.d••••@email.com','E-mail','Rafael Dias','Link de saída do e-mail'],['12/09/2026 16:40','(21) 9••••-1180','SMS','Marta Lopes','Pedido registrado por Paula Reis'],['10/07/2026 11:05','(11) 9••••-0042','SMS','Caio Brandão','Link de saída do SMS']]; const q=(S.bq||'').toLowerCase(); const L=B.filter(b=>!q||b.join(' ').toLowerCase().includes(q));
    body+=cfgSec('Contatos bloqueados','Quem pediu para não receber mais mensagens. Estes contatos nunca recebem e-mail nem SMS, mesmo que o devedor seja incluído de novo por planilha ou pela API.',`<div class="rsum"><div><span>Contatos bloqueados</span><b>${num(B.length)}</b></div><div><span>Neste mês</span><b>4</b></div><div><span>Devedores com todos os contatos bloqueados</span><b>2</b></div></div>
      <label class="search" style="max-width:340px">${ic('search','sm')}<input id="bl-q" placeholder="Buscar por nome ou contato" value="${esc(S.bq||'')}"></label>
      <div class="aud blq">${L.map(b=>`<div><time>${b[0]}</time><b>${b[1]}</b><span>${b[3]} · ${b[2]}</span><small>${b[4]}</small></div>`).join('')||'<p class="faint" style="padding:12px 0">Nenhum contato encontrado.</p>'}</div>
      <p class="faint" style="font-size:12.5px;margin:0">Para tirar um contato da lista, o próprio devedor precisa pedir. Fale com a gente em Ajuda.</p>`,`<button class="ib2" type="button" data-a="toast" data-m="Lista de bloqueio baixada em Excel" aria-label="Baixar lista" title="Baixar">${ic('dl','sm')}</button>`); }
  const save=ad&&EDITABLE.includes(sec)?`<div class="cfg-sv"><span id="cfg-st" class="${S.cfgDirty?'dirty':''}">${S.cfgDirty?'Alterações não salvas':''}</span><button class="btn bsm" id="cfg-save" type="button" data-a="cfgsave" ${S.cfgDirty?'':'disabled'}>Salvar alterações</button></div>`:'';
  return `<div class="cfgwrap">${nav}<div class="cfgmain"><div class="cfg-top"><div><h2>${C[2]}</h2><p>${C[3]}</p></div>${save}</div>${body}</div></div>`;
}
function convDrawer(){
  if((S.paula||'ativa')==='none') return {kick:'Usuários',title:'Adicionar pessoa',sub:'Seu plano inclui mais um acesso, de usuária',
    body:`${fI('Nome','','',{ph:'Nome e sobrenome',id:'cv-n'})}${fI('E-mail','','A pessoa recebe um convite para criar a senha. Vale por 7 dias',{ph:'nome@escolahorizonte.com.br',id:'cv-m'})}${kvs([['Perfil','Usuária'],['Pode','Acompanhar a carteira, registrar ocorrências e pagamentos, pausar a cobrança de um devedor']])}`,
    foot:`<button class="btn" type="button" data-a="cvsend">Enviar convite</button><button class="btn-2" type="button" data-a="evclose">Cancelar</button>`};
  return {kick:'Usuários',title:'Adicionar pessoa',sub:'Seu plano já usa os 2 acessos disponíveis',
    body:`<div class="cfg-ro" style="color:var(--warn);background:rgba(227,181,102,.07);border-color:rgba(227,181,102,.25)">${ic('users')}<b>Limite de acessos atingido</b><p>O plano inclui uma administradora e uma usuária. Para dar acesso a mais pessoas, contrate acessos extras.</p></div>${kvs([['Acesso extra','[valor] por pessoa, por mês'],['Perfil','Usuária ou administradora'],['Cobrança','Junto com a mensalidade do plano']])}`,
    foot:`<a class="btn" href="#/plano/acessos" data-a="evclose">Ver acessos extras no Plano</a><button class="btn-2" type="button" data-a="evclose">Agora não</button>`};
}
function transfDrawer(){ const n=S.pName||'Paula Reis';
  return {kick:'Usuários',title:'Transferir administração',sub:`${n} passa a ser a administradora`,
    body:`${kvs([['Nova administradora',n],['Você passa a ser','Usuária'],['Confirmação',`${n.split(' ')[0]} recebe um e-mail para aceitar`]])}<div class="warnb">${ic('alert','sm')}<span>Depois do aceite, você não altera mais configurações nem retira devedores. Para voltar, a nova administradora precisa transferir de novo.</span></div>`,
    foot:`<button class="btn" type="button" data-a="tfsend">Transferir</button><button class="btn-2" type="button" data-a="evclose">Cancelar</button>`};
}
function remDrawer(){ const n=S.pName||'Paula Reis'; const cv=(S.paula||'ativa')==='convite';
  return {kick:'Usuários',title:cv?'Cancelar convite':'Remover acesso',sub:n,
    body:`<p class="muted" style="font-size:14px;line-height:1.6">${cv?'O link do convite deixa de funcionar.':`${n.split(' ')[0]} deixa de entrar na plataforma na hora. O que ${n.split(' ')[0]} registrou continua na linha do tempo e na trilha de auditoria.`} O acesso fica livre para outra pessoa.</p>`,
    foot:`<button class="btn dngb" type="button" data-a="urem">${cv?'Cancelar convite':'Remover acesso'}</button><button class="btn-2" type="button" data-a="evclose">Voltar</button>`};
}
function contaDrawer(){
  return {kick:'Recebimento',title:'Trocar conta bancária',sub:'A nova conta passa por análise do Asaas antes de valer',
    body:`<div><h3>Banco</h3><div class="otypes">${['Asaas','Itaú','Bradesco','Banco do Brasil','Caixa','Santander','Nubank','Outro'].map((x,i)=>`<button type="button" class="otp" aria-pressed="${S.ot===i}" data-a="ot" data-v="${i}">${x}</button>`).join('')}</div>${S.ot===0?`<p class="faint" style="font-size:12.5px;margin-top:8px;color:var(--good)">Conta Asaas: as taxas de parceiro passam a valer depois da aprovação.</p>`:''}</div><div class="g2">${fI('Tipo de conta','Conta corrente')}${fI('Titular','12.345.678/0001-90','Mesmo CNPJ da empresa',{ro:true})}</div><div class="g2">${fI('Agência','','',{ph:'0000'})}${fI('Conta com dígito','','',{ph:'00000-0'})}</div>
      <div class="warnb" style="background:rgba(141,190,229,.08);color:var(--info)">${ic('info','sm')}<span>A análise leva até 2 dias úteis. Até a aprovação, os repasses continuam na conta atual.</span></div>`,
    foot:`<button class="btn" type="button" data-a="ctsend" ${S.ot>=0?'':'disabled'}>Enviar para análise</button><button class="btn-2" type="button" data-a="evclose">Cancelar</button>`};
}
function domDrawer(){
  return {kick:'Canais de envio',title:'Confirmar o domínio do e-mail',sub:'Prova para os provedores de e-mail que a escola autorizou os envios',
    body:`<p class="muted" style="font-size:13.5px;line-height:1.6">É uma configuração feita uma vez, no lugar onde o site escolahorizonte.com.br está registrado. Quem cuida do site faz em poucos minutos: basta copiar os dois registros abaixo.</p>
      <div class="dns">${[['TXT','escolahorizonte.com.br','v=spf1 include:envio.pink.com.br ~all'],['CNAME','envio._domainkey','dkim.envio.pink.com.br']].map(r=>`<div><span class="chip c-neutral">${r[0]}</span><code>${r[1]}</code><code>${r[2]}</code><button class="ib2" type="button" data-a="toast" data-m="Registro copiado" aria-label="Copiar">${ic('copy','sm')}</button></div>`).join('')}</div>
      ${fI('Enviar as instruções para','','Ex.: a pessoa ou empresa que cuida do site',{ph:'ti@escolahorizonte.com.br'})}
      <p class="faint" style="font-size:12.5px">Depois de configurado, a confirmação aparece aqui em até 48 horas. Os registros dependem da definição do servidor de envio.</p>`,
    foot:`<button class="btn" type="button" data-a="evsave" data-m="Instruções enviadas">Enviar instruções</button><button class="btn-2" type="button" data-a="evclose">Fechar</button>`};
}
function smsDrawer(){ const v=S.smsDraft!=null?S.smsDraft:CF().smsName;
  return {kick:'Canais de envio',title:'Nome que aparece no SMS',sub:'É o remetente que o devedor vê no celular',
    body:`${fI('Nome do remetente',v,`${v.length} de 11 caracteres. Só letras e números, sem espaço`,{id:'sms-nm',max:11})}<div><h3>Prévia</h3><div class="phn" style="max-width:300px"><div class="phn-top"><span class="olk-av" style="background:#5D6779">${esc(v.slice(0,2).toUpperCase())}</span><div><b>${esc(v)||'—'}</b><small>Mensagem de texto</small></div></div></div></div><p class="faint" style="font-size:12.5px">Algumas operadoras mostram um número no lugar do nome. A troca pode levar até 1 dia útil para valer.</p>`,
    foot:`<button class="btn" type="button" data-a="smssave" ${v.length>=3?'':'disabled'}>Salvar nome</button><button class="btn-2" type="button" data-a="evclose">Cancelar</button>`};
}
function semDrawer(){
  const rows=[['Recuperado','R$ 11.240,00','+18% vs semana anterior'],['Acordos fechados','31','4 já pagos'],['Acordos não pagos','2','Carla Mendes e Rafael Dias'],['Entraram no autoatendimento','96 devedores','9,8% da carteira'],['Envios com falha','38','2,9% dos envios, a maioria SMS'],['Vagas livres','107 de 1.000','Incluir mais devedores']];
  return {kick:'Avisos e relatórios',title:'Resumo semanal',sub:'Exemplo do e-mail que chega toda segunda',
    body:`<div class="olk"><div class="olk-bar"><span></span><span></span><span></span><em>Caixa de entrada</em></div><div class="olk-h"><h4>Sua semana: R$ 11.240,00 recuperados</h4><div class="olk-f"><span class="olk-av" style="background:#161F33">P</span><div><b>Pink</b><br><small>Para: renata@escolahorizonte.com.br · Segunda, 07:00</small></div></div></div>
      <div class="olk-b"><div class="et"><div class="et-hd" style="background:#161F33"><b>Semana de 14 a 20/09, Escola Horizonte</b></div><div class="et-bd">${rows.map(r=>`<div style="display:flex;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px solid #EDF0F4"><span>${r[0]}<br><small style="color:#7C8697">${r[2]}</small></span><b>${r[1]}</b></div>`).join('')}<div style="margin-top:14px"><span class="et-cta" style="background:#D80073">Abrir o painel</span></div></div><div class="et-ft">Só números da sua carteira. Os dados dos devedores ficam na plataforma, com login.</div></div></div></div>`,
    foot:`<span class="faint" style="font-size:13px">Chega toda segunda, às 7h, para quem ativar o aviso.</span>`};
}

function finSec(ad,F){ const t=S.ftab||'conta'; const P=F.fpg; const asaasBank=S.bank==='asaas';
  const tabs=`<div class="ftabs" role="tablist">${[['conta','Conta e pagamentos'],['repasses','Repasses']].map(x=>`<button type="button" role="tab" aria-selected="${t===x[0]}" data-a="ftab" data-v="${x[0]}">${x[1]}</button>`).join('')}</div>`;
  if(t==='repasses'){ const R=[['22/09/2026','R$ 4.380,00','Pix e boleto recebidos de 19 a 21/09','Repassado'],['19/09/2026','R$ 6.912,40','Pix e boleto recebidos de 16 a 18/09','Repassado'],['16/09/2026','R$ 5.208,10','Pix e boleto recebidos de 13 a 15/09','Repassado'],['12/09/2026','R$ 3.770,00','Pix e boleto recebidos de 10 a 12/09','Repassado'],['24/09/2026','R$ 1.139,00','Cartão recebido em 23/09','Previsto']];
    return tabs+cfgSec('Repasses para a sua conta','O dinheiro recebido dos devedores vai para a conta cadastrada, já descontadas as taxas, no prazo de cada forma de pagamento.',`<div class="rsum"><div><span>Repassado em setembro</span><b>R$ 20.270,50</b></div><div><span>Previsto</span><b>R$ 1.139,00</b></div><div><span>Taxas no mês</span><b>[valor]</b></div></div><div class="rep">${R.map(r=>`<div><time>${r[0]}</time><span>${r[2]}</span><b>${r[1]}</b><span class="chip ${r[3]==='Repassado'?'c-good':'c-neutral'}">${r[3]}</span></div>`).join('')}</div>`,`<button class="ib2" type="button" data-a="toast" data-m="Repasses exportados em Excel" aria-label="Exportar repasses" title="Exportar repasses">${ic('dl','sm')}</button>`); }
  return tabs
   +cfgSec('Conta que recebe','É a conta bancária da empresa para onde vão os valores pagos pelos devedores.',`${S.contaPend?`<div class="conn pend"><span class="cn-i">${ic('alert','sm')}</span><div><b>Nova conta em análise</b><small>Enviada em 23/09/2026. Até a aprovação, os repasses continuam na conta atual.</small></div></div>`:''}<div class="conn ok"><span class="cn-i">${ic('wallet','sm')}</span><div><b>${asaasBank?'Asaas, conta digital':'Itaú'} · agência 0123 · conta ••••-7</b><small>Escola Horizonte Educação Ltda · CNPJ 12.345.678/0001-90${asaasBank?' · taxas de parceiro aplicadas':''}</small></div>${ad?`<button class="btn-2 bsm" type="button" data-a="evd" data-v="cfg-conta">Trocar conta</button>`:''}</div>`)
   +(asaasBank?'':`<section class="cs2 asp"><div class="asp-h"><div><span class="asp-k">Parceiro</span><h3>Receba com taxas menores abrindo uma conta Asaas</h3><p>Pela parceria, quem recebe numa conta Asaas paga taxas menores em cada pagamento. A conta é digital, gratuita para abrir e fica no CNPJ da empresa.</p></div>${ad?`<button class="btn bsm" type="button" data-a="evd" data-v="cfg-asaas">Abrir conta Asaas</button>`:''}</div><div class="asp-t">${[['Pix','[taxa parceiro]','[taxa padrão]'],['Boleto','[taxa parceiro]','[taxa padrão]'],['Cartão de crédito','[taxa parceiro]','[taxa padrão]']].map(x=>`<div><span>${x[0]}</span><b>${x[1]}</b><small>em outros bancos: ${x[2]}</small></div>`).join('')}</div><p class="faint" style="font-size:12.5px;margin:0">Já tem conta Asaas? Use Trocar conta e escolha Asaas: a plataforma identifica e aplica as taxas de parceiro.</p></section>`)
   +cfgSec('Formas de pagamento aceitas','O devedor só vê as formas ativas.',`<div class="tgl">${[['pix','Pix','Cai na hora'],['bol','Boleto','Compensa em até 2 dias úteis'],['car','Cartão de crédito','Permite parcelar conforme as regras de negociação']].map(x=>`<div><span><b>${x[1]}</b><small>${x[2]}</small></span>${sw2(P[x[0]],'fpg',x[0])}</div>`).join('')}</div>`);
}
function asaasDrawer(){
  return {kick:'Financeiro',title:'Abrir conta Asaas',sub:'Conta digital no CNPJ da empresa, com taxas de parceiro',
    body:`<ol class="steps2" style="gap:12px">${[['Confirmar os dados','Usamos os dados da empresa que já estão aqui: razão social, CNPJ e responsável.'],['Enviar os documentos','O Asaas pede o contrato social e um documento do responsável. Dá para enviar pelo celular.'],['Aguardar a aprovação','Normalmente em até 2 dias úteis. Avisamos por e-mail.'],['Pronto','A conta passa a receber os pagamentos, já com as taxas de parceiro.']].map(x=>`<li><b style="color:var(--title);font-weight:500">${x[0]}</b><br><span class="muted" style="font-size:13px">${x[1]}</span></li>`).join('')}</ol>${kvs([['Empresa','Escola Horizonte Educação Ltda'],['CNPJ','12.345.678/0001-90'],['Responsável','Renata Albuquerque']])}`,
    foot:`<button class="btn" type="button" data-a="evsave" data-m="Pedido de abertura enviado ao Asaas. Avisamos por e-mail">Começar abertura</button><button class="btn-2" type="button" data-a="evclose">Agora não</button>`};
}
const APIX=[
 ['incluir','POST','/v1/devedores','Incluir devedor','Inclui um devedor com os títulos. Ele entra na régua no próximo horário permitido.',[['nome','texto','Sim','Nome ou razão social'],['documento','texto','Sim','CPF ou CNPJ, só números'],['telefone','texto','Um dos dois','Com DDD, só números'],['email','texto','Um dos dois','E-mail do devedor'],['titulos','lista','Sim','Código, vencimento e valor de cada título']],`{
  "nome": "Roberta Lima",
  "documento": "31845678904",
  "telefone": "11942714219",
  "email": "roberta@email.com",
  "titulos": [
    { "codigo": "MEN-ROB-04210", "vencimento": "2026-05-26", "valor": 1000.00 }
  ]
}`,`{ "situacao": "incluido", "devedor_id": "dv_8K2F", "titulos_aceitos": 1 }`,[['409','Título com código que já existe'],['422','Documento inválido ou sem nenhum contato'],['403','Sem vaga livre no plano']]],
 ['retirar','DELETE','/v1/devedores/{documento}','Retirar devedor','Retira o devedor da base e libera a vaga. O histórico segue a regra de guarda do seu plano.',[['documento','texto','Sim','CPF ou CNPJ, no endereço'],['motivo','texto','Sim','Ex.: pagou direto à empresa']],`DELETE /v1/devedores/31845678904
{ "motivo": "Pagou direto à empresa" }`,`{ "situacao": "retirado", "vaga_liberada": true }`,[['404','Devedor não encontrado'],['409','Devedor com acordo aguardando pagamento']]],
 ['consultar','GET','/v1/devedores/{documento}','Consultar situação','Mostra a situação do devedor, os títulos e o último acontecimento.',[['documento','texto','Sim','CPF ou CNPJ, no endereço']],`GET /v1/devedores/31845678904`,`{
  "situacao": "em_acordo",
  "fase_regua": 5,
  "em_aberto": 780.00,
  "acordo": { "valor": 585.00, "vencimento": "2026-09-25" },
  "titulos": [ { "codigo": "MEN-LUC-04124", "situacao": "em_acordo" } ]
}`,[['404','Devedor não encontrado']]],
 ['relatorios','GET','/v1/relatorios/{ano-mes}','Baixar relatórios','Devolve os relatórios do fechamento do mês, nos mesmos formatos da plataforma.',[['ano-mes','texto','Sim','Ex.: 2026-09, no endereço'],['tipo','texto','Não','pagamentos, carteira, acordos, retirados ou acionamentos']],`GET /v1/relatorios/2026-09?tipo=pagamentos`,`{ "arquivo": "https://…/pagamentos-2026-09.xlsx", "expira_em": "24 horas" }`,[['404','Mês sem fechamento ou fora do período guardado'],['202','Relatório grande em preparação. Tente de novo em alguns minutos']]]
];
function docDrawer(){ const k=S.dtab||'inicio'; const X=APIX.find(x=>x[0]===k);
  const tabs=`<div class="ftabs" role="tablist">${[['inicio','Como começar'],...APIX.map(x=>[x[0],x[3]])].map(x=>`<button type="button" role="tab" aria-selected="${k===x[0]}" data-a="dtab" data-v="${x[0]}">${x[1]}</button>`).join('')}</div>`;
  let body;
  if(!X) body=`<ol class="docs"><li><b>Gere a chave de teste</b><p>Em Integrações e API, clique em Gerar nova na chave de Teste e copie na hora: ela só aparece uma vez. A chave de teste usa dados de exemplo e não envia nada para devedores reais.</p></li><li><b>Use o endereço de teste</b><pre><code>https://api-teste.pink.com.br/v1</code></pre><p>Na produção, troque por https://api.pink.com.br/v1. Cada ação soma o caminho dela a esse endereço, por exemplo /devedores.</p></li><li><b>Envie a chave em todas as chamadas</b><pre><code>Authorization: Bearer ehz_test_xxxxxxxx</code></pre></li><li><b>Escolha o que fazer</b><p>Cada aba acima traz o passo a passo de uma ação: incluir, retirar, consultar e baixar relatórios.</p></li><li><b>Passe para produção</b><p>Quando tudo funcionar no teste, troque o endereço e a chave pelos de produção. Os devedores incluídos entram na régua de verdade.</p></li></ol><p class="faint" style="font-size:12.5px">Limite de 60 chamadas por minuto. Endereços e campos serão confirmados no desenvolvimento.</p>`;
  else body=`<div class="eps"><div><span class="mth ${X[1].toLowerCase()}">${X[1]}</span><code>${X[2]}</code><small>${X[4]}</small></div></div>
    <div><h3>Campos</h3><div class="dfl">${X[5].map(f=>`<div><code>${f[0]}</code><span>${f[1]}</span><span>${f[2]}</span><small>${f[3]}</small></div>`).join('')}</div></div>
    <div><h3>Exemplo de chamada</h3><pre class="dpre"><code>${esc(X[6])}</code></pre></div>
    <div><h3>Resposta</h3><pre class="dpre"><code>${esc(X[7])}</code></pre></div>
    <div><h3>Quando dá errado</h3><div class="dfl err">${X[8].map(e=>`<div><code>${e[0]}</code><small>${e[1]}</small></div>`).join('')}</div></div>`;
  return {kick:'Integrações e API',title:'Documentação da API',sub:'Passo a passo de cada ação',body:tabs+body,
    foot:`<button class="btn-2" type="button" data-a="toast" data-m="Documentação completa baixada em PDF">${ic('dl','sm')}Baixar tudo em PDF</button><button class="btn-2" type="button" data-a="evclose">Fechar</button>`};
}

/* PLANO */
const ADDS=[
 ['vagas','users','Vagas extras','Para quem precisa de um pouco mais sem mudar de plano. Cada lote libera 50 devedores na carteira.','lote de 50 vagas',50,'[valor] por lote, por mês'],
 ['acessos','key','Acessos extras','Mais pessoas da equipe usando a plataforma. Cada acesso pode ser de usuária ou administradora.','acesso',1,'[valor] por pessoa, por mês'],
 ['armazenamento','history','Armazenamento de histórico','Guarda o histórico dos devedores quitados e todos os fechamentos por mais tempo. Quem volta a dever reaparece com a linha do tempo completa.','pacote',1,'[valor] por mês'],
 ['higienizacao','sparkle','Higienização da carteira','Encontra e corrige telefones e e-mails inválidos, para que mais devedores recebam os contatos.','devedor analisado',1,'[valor] por devedor']
];
const ARMZ=[['1 ano','Histórico e fechamentos dos últimos 12 meses'],['3 anos','Histórico e fechamentos dos últimos 36 meses'],['Sem limite','Tudo, enquanto a empresa for cliente']];
function vPlano(focus){
  const ad=S.role==='admin'; const Q=S.pq||{vagas:1,acessos:1,higienizacao:44}; const ac=S.padd||{};
  const plans=[['1.000','Para começar',1,['1.000 devedores na carteira','2 acessos','Régua com e-mail e SMS','Textos sugeridos pela IA']],['2.000','O mais escolhido',0,['2.000 devedores na carteira','2 acessos','Régua com e-mail e SMS','Textos sugeridos pela IA']],['5.000','Para carteiras grandes',0,['5.000 devedores na carteira','3 acessos','Régua com e-mail e SMS','Textos sugeridos pela IA']]];
  const card=a=>{ const on=ac[a[0]]; const fx=focus===a[0];
    let ctl='';
    if(a[0]==='armazenamento') ctl=`<div class="armz">${ARMZ.map((x,i)=>`<button type="button" class="fmt ${(S.armz||0)===i?'on':''}" data-a="armz" data-v="${i}"><b>${x[0]}</b><span>${x[1]}</span></button>`).join('')}</div>`;
    else ctl=`<div class="qrow"><span class="stpx"><button type="button" data-a="pq" data-v="${a[0]}|-1" aria-label="Diminuir">−</button><em>${num(Q[a[0]]*(a[0]==='vagas'?50:1))} ${a[0]==='vagas'?'vagas':a[0]==='acessos'?(Q.acessos===1?'acesso':'acessos'):'devedores'}</em><button type="button" data-a="pq" data-v="${a[0]}|1" aria-label="Aumentar">+</button></span>${a[0]==='higienizacao'?'<span class="faint" style="font-size:12.5px">44 devedores estão com contato inválido agora</span>':''}</div>`;
    return `<section class="adc ${fx?'fx':''} ${on?'on':''} t-${a[0]}" id="add-${a[0]}"><div class="adc-h"><span class="adi">${ic(a[1])}</span><div><h3>${a[2]}</h3><small>${a[6]}</small></div>${on?'<span class="chip c-good">Contratado</span>':''}</div><p>${a[3]}</p>${ctl}${ad?`<button class="${on?'btn-2':'btn'} bsm" type="button" data-a="evd" data-v="pl-${a[0]}">${on?'Alterar':'Contratar'}</button>`:'<span class="faint" style="font-size:12.5px">Só a administradora contrata.</span>'}</section>`; };
  return `<div class="pltop"><div><h2>Plano</h2><p>O que está contratado, quanto está em uso e o que dá para acrescentar</p></div></div>
  <section class="glass plhero">${INF('g4')}
    <div class="ph-l"><span class="fh-k">Seu plano</span><b class="ph-n">1.000 vagas</b><span class="muted" style="font-size:13.5px">[valor] por mês · renova em 01/10/2026</span></div>
    <div class="ph-u"><div class="ph-ut"><span>Vagas em uso</span><b>893 <em>de 1.000</em></b></div><div class="lbar big"><i style="width:89.3%"></i></div><small>107 vagas livres</small></div>
    <div class="ph-u"><div class="ph-ut"><span>Acessos</span><b>2 <em>de 2</em></b></div><div class="lbar big"><i style="width:100%"></i></div><small>Uma administradora e uma usuária</small></div>
  </section>
  <section class="glass plcmp"><div class="card-h"><div><h2>Planos</h2></div></div><div class="plg">${plans.map((p,i)=>`<div class="plc ${p[2]?'cur':''} ${i===1?'pop2':''}">${i===1?'<span class="plbadge">Mais escolhido</span>':''}<span class="plk">${p[1]}</span><b><span>${p[0]}</span> vagas</b><em><strong>[valor]</strong> por mês</em><ul>${p[3].map(f=>`<li>${ic('check','sm')}${f}</li>`).join('')}</ul>${p[2]?'<span class="plcur">Seu plano atual</span>':ad?`<button class="${i===1?'btn':'btn-2'} bsm" type="button" data-a="evd" data-v="pl-up-${p[0]}">Mudar para ${p[0]} vagas</button>`:''}</div>`).join('')}</div></section>
  <h3 class="plsub">Adicionais</h3>
  <div class="adg">${ADDS.map(card).join('')}</div>
  <section class="glass plfat"><div class="card-h"><div><h2>Faturas</h2></div></div>${[['01/09/2026','Plano 1.000 vagas','[valor]','Paga'],['01/08/2026','Plano 1.000 vagas','[valor]','Paga'],['01/07/2026','Plano 1.000 vagas','[valor]','Paga']].map(f=>`<div class="frow"><time>${f[0]}</time><span>${f[1]}</span><b>${f[2]}</b><span class="chip c-good">${f[3]}</span><button class="ib2" type="button" data-a="toast" data-m="Fatura baixada em PDF" aria-label="Baixar fatura">${ic('dl','sm')}</button></div>`).join('')}</section>`;
}
function planoDrawer(k){
  if(k.startsWith('up-')){ const n=k.slice(3); return {kick:'Plano',title:`Mudar para ${n} vagas`,sub:'A mudança vale a partir de hoje',body:kvs([['Plano novo',`${n} vagas`],['Valor','[valor] por mês'],['Na próxima fatura','Proporcional aos dias deste mês']]),foot:`<button class="btn" type="button" data-a="plok" data-v="up">Confirmar mudança</button><button class="btn-2" type="button" data-a="evclose">Cancelar</button>`}; }
  const a=ADDS.find(x=>x[0]===k); const Q=S.pq||{vagas:1,acessos:1,higienizacao:44};
  const qty=k==='armazenamento'?ARMZ[S.armz||0][0]:k==='vagas'?`${Q.vagas*50} vagas`:k==='acessos'?`${Q.acessos} ${Q.acessos===1?'acesso':'acessos'}`:`${Q.higienizacao} devedores`;
  return {kick:'Plano',title:`Contratar ${a[2].toLowerCase()}`,sub:a[3],body:kvs([['O que entra',qty],['Valor',a[6]],['Começa a valer','Na hora'],['Cobrança',k==='higienizacao'?'Uma vez, na próxima fatura':'Junto com a mensalidade, proporcional neste mês']])+(k==='higienizacao'?`<p class="muted" style="font-size:13px">Os devedores corrigidos voltam para a régua na fase em que estavam. Você vê o resultado em Clientes e em Resultados por canal.</p>`:''),
    foot:`<button class="btn" type="button" data-a="plok" data-v="${k}">Confirmar contratação</button><button class="btn-2" type="button" data-a="evclose">Cancelar</button>`};
}
/* AJUDA */
const AJ=[
 ['inicio','zap','Primeiros passos','O que a plataforma faz e por onde começar',`A plataforma cobra os seus devedores sozinha: envia e-mails e SMS em uma sequência pensada para cada fase, oferece a melhor condição de pagamento e registra tudo o que acontece. Você acompanha os resultados e age só quando precisa.`,[
   ['Deixar a conta pronta',['Em Configurações, preencha Empresa e Sobre o negócio.','Escolha o logo e a cor em Identidade visual.','Defina os descontos e parcelas em Regras de negociação.','Confira a conta que recebe os pagamentos em Financeiro.']],
   ['Incluir os primeiros devedores',['Em Clientes, clique em Incluir ou retirar.','Escolha Por planilha e envie o arquivo no modelo.','Confira a revisão: quem está pronto e quem foi recusado, com o motivo.','Confirme. A cobrança começa no próximo horário permitido.']],
   ['Acompanhar o dia a dia',['Abra o Painel para ver o resultado do mês.','Veja os pontos de atenção e clique para resolver cada um.','No fim do mês, abra Fechamentos para ver o resultado completo.']]]],
 ['painel','home','Painel','A visão geral da sua cobrança',`O Painel mostra, num só lugar, quanto você tem para receber, quanto já recuperou e o que pede a sua atenção hoje.`,[
   ['Entender os números do topo',['Carteira: quanto está em cobrança agora.','Recuperado: quanto entrou no mês.','Taxa de pagamento: quantos devedores pagaram, em relação a todos.']],
   ['Ler o diário do mês',['Cada barra é um dia.','Passe o mouse para ver o valor e os canais daquele dia.','Troque entre Recebido, Acordos e Ações no seletor.']],
   ['Usar a jornada da carteira',['Mostra em que etapa os devedores estão, do primeiro contato ao pagamento.','A etapa em magenta é onde mais devedores param.']]]],
 ['clientes','users','Clientes','A lista de devedores e a ficha de cada um',`Em Clientes você encontra qualquer devedor, vê a situação de cada um e faz as ações do dia a dia, como registrar um pagamento feito por fora.`,[
   ['Encontrar um devedor',['Digite o nome, o CPF ou o CNPJ na busca.','Use Filtros para ordenar ou ver só uma situação, como Acordo aguardando.']],
   ['Incluir ou retirar devedores',['Clique em Incluir ou retirar.','Escolha: por planilha, um devedor, atualizar dados ou retirar.','Revise antes de confirmar. Títulos com código repetido são recusados para não duplicar.']],
   ['Registrar um pagamento feito por fora',['Abra a ficha do devedor.','Na aba Títulos, clique no título que foi pago.','Clique em Registrar pagamento, informe forma, valor e data, e confirme.']],
   ['Corrigir ou desfazer um pagamento',['Clique no título pago.','Escolha Corrigir pagamento ou Desfazer pagamento.','A correção aparece no fechamento do mês e fica na trilha de auditoria.']],
   ['Pausar a cobrança de um devedor',['Na ficha, abra Ações e escolha Pausar cobrança.','Escreva o motivo e confirme. Fica registrado na linha do tempo.']]]],
 ['estrategia','route','Estratégia','A régua, os resultados e os envios',`A régua é a sequência de contatos que cada devedor recebe. Aqui você vê as mensagens, ajusta os textos e acompanha o resultado de cada canal.`,[
   ['Ver e editar uma mensagem',['Na aba Régua, clique na etapa.','Veja como a mensagem chega e clique em Editar.','Ajuste o texto, use Inserir dado para o nome do devedor e salve. As travas de segurança precisam estar verdes.']],
   ['Acompanhar os resultados',['Na aba Resultados por canal, escolha E-mail ou SMS.','Veja quanto foi entregue, aberto e clicado, e o que não chegou.']],
   ['Pausar toda a cobrança',['Na aba Régua, clique no ícone de pausa no canto do bloco.','Confirme. Nenhum contato sai até você retomar.']]]],
 ['fechamentos','cal','Fechamentos','O resultado de cada mês',`O fechamento mostra quanto você recuperou no mês, como a carteira se comportou e para onde foi cada real.`,[
   ['Ver outro mês ou o ano',['Clique no período no topo.','Escolha o mês ou Ver o ano todo.']],
   ['Baixar os relatórios',['Clique no ícone de download.','Marque os relatórios: o resumo vem em PDF, os detalhes em Excel.','Períodos longos são preparados e enviados por e-mail.']],
   ['Guardar por mais tempo',['Os fechamentos ficam 90 dias.','Para guardar mais, contrate Armazenamento de histórico no Plano.']]]],
 ['config','gear','Configurações','Ajustes da conta',`Em Configurações ficam os dados da empresa, a identidade visual, as regras de negociação, a conta de recebimento e os canais. Só a administradora altera.`,[
   ['Salvar uma alteração',['Mude o que precisar.','Clique em Salvar alterações, no topo da seção.','Se sair sem salvar, a plataforma pergunta antes.']],
   ['Trocar a senha',['Em Usuários, clique nos três pontinhos ao lado do seu nome.','Escolha Enviar link para criar nova senha e abra o e-mail.']],
   ['Passar a administração para outra pessoa',['Em Usuários, clique em Transferir administração.','A outra pessoa recebe um e-mail e precisa aceitar.','Se a administradora saiu sem transferir, fale com a gente aqui na Ajuda.']]]],
 ['plano','card','Plano','Vagas, acessos e adicionais',`O plano define quantos devedores podem estar na carteira ao mesmo tempo e quantas pessoas acessam. Retirar um devedor libera a vaga.`,[
   ['Precisa de mais vagas',['Em Plano, escolha Vagas extras para um lote pequeno, ou mude de plano.','A contratação vale na hora.']],
   ['Contratar um adicional',['Escolha o adicional, ajuste a quantidade e clique em Contratar.','Confira o resumo e confirme.']]]]
];
function vAjuda(t){ const T=AJ.find(x=>x[0]===t)||AJ[0]; const q=(S.aq||'').toLowerCase();
  const list=AJ.filter(x=>!q||(x[2]+x[3]+x[4]+x[5].map(s=>s[0]+s[1].join(' ')).join(' ')).toLowerCase().includes(q));
  return `<div class="ajtop"><div><h2>Ajuda</h2><p>Passo a passo de cada parte da plataforma</p></div><label class="search ajs">${ic('search','sm')}<input id="aj-q" placeholder="Buscar: pagamento, senha, régua…" value="${esc(S.aq||'')}"></label></div>
  <div class="cfgwrap"><nav class="cfgnav">${list.map(x=>`<a href="#/ajuda/${x[0]}" class="${x[0]===T[0]?'on':''}"><span class="cn-i">${ic(x[1],'sm')}</span><span class="cn-t"><b>${x[2]}</b><small>${x[3]}</small></span></a>`).join('')||'<p class="faint" style="padding:12px">Nada encontrado.</p>'}<button type="button" class="ajlink" data-a="evd" data-v="aj-ch">Ainda com dúvida? Fale com a gente</button></nav>
  <div class="cfgmain"><section class="cs2"><h3 style="font-size:20px">${T[2]}</h3><p class="ajint">${T[4]}</p></section>
    ${T[5].map((s,i)=>`<details class="ajd" ${i===0?'open':''}><summary><span>${s[0]}</span>${ic('chev','sm')}</summary><ol>${s[1].map(x=>`<li>${x}</li>`).join('')}</ol></details>`).join('')}
  </div></div>`;
}
function chamadoDrawer(){ const r=S.ot;
  return {kick:'Ajuda',title:'Falar com a gente',sub:'A resposta chega no e-mail da sua conta',
    body:`<div><h3>Assunto</h3><div class="otypes">${['Dúvida de uso','Algo não funcionou','Trocar a administradora','Plano e cobrança','Outro'].map((x,i)=>`<button type="button" class="otp" aria-pressed="${r===i}" data-a="ot" data-v="${i}">${x}</button>`).join('')}</div></div>${fT('O que aconteceu','','Quanto mais detalhes, mais rápido a gente resolve','Ex.: tentei incluir a planilha e apareceu um erro')}${r===2?`<div class="warnb" style="background:rgba(141,190,229,.08);color:var(--info)">${ic('info','sm')}<span>Para trocar a administradora sem a transferência, o responsável legal envia o CNPJ e um documento. A troca é feita depois da validação.</span></div>`:''}`,
    foot:`<button class="btn" type="button" data-a="evsave" data-m="Mensagem enviada. Resposta em até 1 dia útil" ${r>=0?'':'disabled'}>Enviar</button><button class="btn-2" type="button" data-a="evclose">Cancelar</button>`};
}

/* TELAS DE ACESSO */
const AUTHR=['entrar','esqueci','redefinir','primeiro-acesso','acesso-ajuda'];
function pwRules(v,c){ return [[v.length>=8,'Pelo menos 8 caracteres'],[/[A-Z]/.test(v),'Uma letra maiúscula'],[/[0-9]/.test(v),'Um número'],[!!v&&v===c,'As duas senhas são iguais']]; }
function aField(lbl,id,type,val,ph,extra){ return `<label class="afld"><span>${lbl}</span><div class="ain"><input id="${id}" type="${type}" value="${esc(val||'')}" placeholder="${ph||''}" autocomplete="off">${extra||''}</div></label>`; }
function pwField(lbl,id,val){ const show=S.pwShow&&S.pwShow[id]; return aField(lbl,id,show?'text':'password',val,'••••••••',`<button type="button" class="aeye" data-a="pweye" data-v="${id}" aria-label="${show?'Esconder':'Mostrar'} senha">${ic(show?'eyeoff':'eye','sm')}</button>`); }
function rulesHTML(R){ return R.map(x=>`<li class="${x[0]?'ok':''}">${ic(x[0]?'checkc':'xc','sm')}${x[1]}</li>`).join(''); }
function auSync(){ const A=S.au||{}; const em=/.+@.+\..+/;
  const b1=document.querySelector('[data-a=aulogin]'); if(b1) b1.disabled=!(em.test(A.em||'')&&(A.pw||'').length>0);
  const b2=document.querySelector('[data-a=ausend]'); if(b2) b2.disabled=!em.test(A.fe||'');
  const ul=document.querySelector('.arules'); const b3=document.querySelector('[data-a=ausave]');
  if(ul&&b3){ const R=pwRules(A.n1||'',A.n2||''); ul.innerHTML=rulesHTML(R); b3.disabled=!(R.every(x=>x[0])&&(b3.dataset.v!=='primeiro-acesso'||A.terms)); }
}
function vAuth(r){ const A=S.au||(S.au={});
  const WM=document.querySelector('.pkw')?document.querySelector('.pkw').outerHTML.replace(/pkwg/g,'pkwa'):'';
  let card='';
  if(r==='entrar'){ const ok=/.+@.+\..+/.test(A.em||'')&&(A.pw||'').length>0;
    card=`<h1>Bem-vinda de volta</h1><p class="asub">Entre para acompanhar a sua carteira.</p>
      ${A.err?`<div class="aerr">${ic('alert','sm')}<span>E-mail ou senha incorretos. Depois de 5 tentativas, o acesso fica bloqueado por 15 minutos.</span></div>`:''}
      ${aField('E-mail','au-em','email',A.em,'nome@empresa.com.br')}${pwField('Senha','au-pw',A.pw)}
      <div class="arow"><a href="#/esqueci" class="lk">Esqueci minha senha</a></div>
      <button class="btn abtn" type="button" data-a="aulogin" ${ok?'':'disabled'}>Entrar</button>
      <div class="aalt"><a href="#/acesso-ajuda" class="lk">Não consigo acessar</a></div>`; }
  if(r==='esqueci'){ const ok=/.+@.+\..+/.test(A.fe||'');
    card=A.sent?`<span class="aok">${ic('mail')}</span><h1>Confira seu e-mail</h1><p class="asub">Se existir uma conta com <b>${esc(A.fe)}</b>, enviamos um link para criar uma nova senha. O link vale por 1 hora e abre direto a tela de nova senha.</p>
      
      <div class="aalt">${A.wait>0?`<span>Reenviar em ${A.wait}s</span>`:`<button type="button" class="lk" data-a="auresend">Reenviar o e-mail</button>`}<span>·</span><a href="#/entrar" class="lk">Voltar para o login</a></div>`
      :`<h1>Esqueci minha senha</h1><p class="asub">Informe o e-mail do seu acesso. Enviamos um link para você criar uma senha nova.</p>${aField('E-mail','au-fe','email',A.fe,'nome@empresa.com.br')}
      <button class="btn abtn" type="button" data-a="ausend" ${ok?'':'disabled'}>Enviar link</button><div class="aalt"><a href="#/entrar" class="lk">Voltar para o login</a></div>`; }
  if(r==='redefinir'||r==='primeiro-acesso'){ const pa=r==='primeiro-acesso'; const R=pwRules(A.n1||'',A.n2||''); const ok=R.every(x=>x[0])&&(!pa||A.terms);
    if(A.done===r) card=`<span class="aok good">${ic('checkc')}</span><h1>${pa?'Acesso criado':'Senha alterada'}</h1><p class="asub">${pa?'Tudo pronto. Agora vamos configurar a sua conta, em poucos passos.':'Use a senha nova para entrar. Por segurança, os outros aparelhos conectados foram desconectados.'}</p><a class="btn abtn" href="${pa?'#/config/empresa':'#/entrar'}" data-a="audone">${pa?'Começar a configuração':'Ir para o login'}</a>`;
    else card=`${pa?`<h1>Crie seu acesso</h1><p class="asub">Bem-vinda à Pink. Crie uma senha para entrar.</p>`:`<h1>Criar nova senha</h1>${PINK.email?`<p class="asub">Para <b>${esc(PINK.email)}</b></p>`:''}`}
      ${pwField('Nova senha','au-n1',A.n1)}${pwField('Repita a senha','au-n2',A.n2)}
      <ul class="arules">${rulesHTML(R)}</ul>
      ${pa?`<label class="aterm"><input type="checkbox" data-a="auterms" ${A.terms?'checked':''}><span>Aceito os <a class="lk" href="#/primeiro-acesso" data-a="toast" data-m="Abre os termos de uso">termos de uso</a> e a <a class="lk" href="#/primeiro-acesso" data-a="toast" data-m="Abre a política de privacidade">política de privacidade</a></span></label>`:''}
      <button class="btn abtn" type="button" data-a="ausave" data-v="${r}" ${ok?'':'disabled'}>${pa?'Criar acesso':'Salvar nova senha'}</button>
      ${pa?'':'<div class="aalt"><a href="#/entrar" class="lk">Voltar para o login</a></div>'}`; }
  if(r==='acesso-ajuda'){ const O=[['Não lembro a senha','Crie uma nova pelo link que enviamos para o seu e-mail.','#/esqueci','Criar nova senha'],['O e-mail do link não chegou','Confira a caixa de spam e as promoções. O link vem de acesso@pink.com.br e pode levar até 5 minutos.','',''],['Meu acesso está bloqueado','Depois de 5 tentativas erradas, o acesso fica bloqueado por 15 minutos. Depois disso, tente de novo ou crie uma senha nova.','',''],['Ainda não recebi o convite','O convite chega no e-mail cadastrado pela administradora da sua empresa e vale por 7 dias. Peça para ela reenviar em Configurações, Usuários.','',''],['A administradora saiu da empresa','O responsável legal da empresa pode pedir a troca. Precisamos do CNPJ e de um documento do responsável.','mailto:','Falar com a gente']];
    card=`<h1>Não consigo acessar</h1><p class="asub">Escolha o que está acontecendo.</p><div class="aopts">${O.map((o,i)=>`<details ${S.aopt===i?'open':''}><summary>${o[0]}${ic('chev','sm')}</summary><p>${o[1]}</p>${o[2]?(o[2]==='mailto:'?`<button type="button" class="btn-2 bsm" data-a="toast" data-m="Abre o formulário de contato">${o[3]}</button>`:`<a class="btn-2 bsm" href="${o[2]}">${o[3]}</a>`):''}</details>`).join('')}</div><div class="aalt"><a href="#/entrar" class="lk">Voltar para o login</a></div>`; }
  return `<div class="auth2" aria-label="Pink">
      <div class="acenter">
        <div class="astage"><span class="asym2" role="img" aria-label="Automate 360°" style="-webkit-mask-image:url(${SYM});mask-image:url(${SYM})"></span><div class="awm">${WM}</div><span class="akick">Cobrança digital</span></div>
        <div class="acard glassc">${card}</div>
        <p class="alegal2">Uma solução <span class="a360" role="img" aria-label="Automate 360°"></span></p>
      </div></div>`;
}

function vSoon(t){
  return `<div class="soon"><h1>${t}</h1><p class="muted">Esta tela entra na próxima rodada do redesenho. As funções desta área continuam as mesmas do protótipo navegável.</p><div><a class="btn-2" href="#/painel">Voltar ao painel</a></div></div>`;
}

/* roteamento */
function render(){
  if(!location.hash||!location.hash.startsWith('#/')) history.replaceState(null,'',location.pathname+location.search+PINK.start);
  const p=location.hash.slice(2).split('/');
  const r=p[0]||'painel'; let html, cur=r;
  const isAuth=AUTHR.includes(r); document.body.classList.toggle('authm',isAuth);
  if(isAuth){ shell('painel'); $('#main').innerHTML=vAuth(r); $('#layer').innerHTML=''; return; }
  if(r==='painel') html=vPainel();
  else if(r==='clientes'&&p[1]==='atualizar') html=vAtualizar();
  else if(r==='clientes'&&p[1]) html=vFicha(p[1],p[2]);
  else if(r==='clientes') html=vClientes();
  else if(r==='acoes') html=vAcoes(p[1]);
  else if(r==='fechamentos') html=vFechamentos();
  else if(r==='config') html=vConfig(p[1]);
  else if(r==='plano') html=vPlano(p[1]);
  else if(r==='ajuda') html=vAjuda(p[1]);
  else {html=vPainel();cur='painel';}
  shell(cur);
  $('#main').innerHTML=html;
  if(r==='plano'&&p[1]&&S._plf!==location.hash){ S._plf=location.hash; setTimeout(()=>{ const el=document.getElementById('add-'+p[1]); if(el) el.scrollIntoView({block:'center',behavior:'smooth'}); },60); }
  $('#main').classList.toggle('calspace',!!(S.cal.open&&location.hash.startsWith('#/clientes/atualizar')));
  $('#layer').innerHTML=(S.dr?drawer():evDrawer())+(S.leave?`<div class="scrim cen" data-a="lvstay-bg"><div class="cmodal" role="alertdialog" aria-modal="true" aria-labelledby="lvt"><span class="cm-ic">${ic('alert')}</span><h2 id="lvt">Salvar as alterações?</h2><p>Você mudou algumas configurações e ainda não salvou. Se sair sem salvar, elas voltam a ficar como estavam.</p><div class="cm-a"><button class="btn-2" type="button" data-a="lvdisc">Sair sem salvar</button><button class="btn" type="button" data-a="lvsave">Salvar e sair</button></div><button class="lk" type="button" data-a="lvstay" style="margin-top:14px">Continuar editando</button></div></div>`:'')+(S.pz?`<div class="scrim cen" data-a="pzno-bg"><div class="cmodal" role="alertdialog" aria-modal="true" aria-labelledby="pzt" aria-describedby="pzd"><span class="cm-ic ${S.cobP?'go':''}">${ic(S.cobP?'play':'pause')}</span><h2 id="pzt">${S.cobP?'Retomar toda a cobrança?':'Pausar toda a cobrança?'}</h2><p id="pzd">${S.cobP?'Os devedores voltam a receber os contatos da régua a partir da fase em que pararam. Envios agendados para hoje saem no próximo horário permitido.':'Nenhum devedor recebe e-mail ou SMS enquanto a cobrança estiver pausada, inclusive os envios já agendados. Acordos e pagamentos continuam funcionando, e as vagas do plano seguem ocupadas.'}</p><div class="cm-a"><button class="btn-2" type="button" data-a="pzno">Cancelar</button><button class="btn ${S.cobP?'':'dngb'}" type="button" data-a="pzyes">${S.cobP?'Sim, retomar':'Sim, pausar'}</button></div></div></div>`:''); S.anim=false;
  document.body.style.overflow=(S.dr||S.evd)?'hidden':'';
  document.querySelectorAll('.proto [data-a="role"]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v===S.role)));
}
function rerender(){ const dsc=$('.drawer')?$('.drawer').scrollTop:0; const y=scrollY; const a=document.activeElement; const id=a&&a.id; const pos=a&&'selectionStart' in a?a.selectionStart:null; render(); scrollTo(0,y); const dd=$('.drawer'); if(dd) dd.scrollTop=dsc; if(id){const el=document.getElementById(id); if(el){el.focus(); if(pos!=null) try{el.setSelectionRange(pos,pos)}catch(e){}}} }
let tT; function toast(m){const t=$('#toast'); t.innerHTML=ic('checkc','sm')+esc(m); t.classList.add('on'); clearTimeout(tT); tT=setTimeout(()=>t.classList.remove('on'),2400);}
let lastFocus=null;
function curMsg(){ const k=S.dr[0], i=+S.dr.slice(1); return k==='r'?REGUA[i]:k==='g'?GAT[i]:DEPOIS[i]; }
function insertTxt(x){
  const E=S.ed; if(!E) return;
  if(curMsg().c==='SMS'){ const p=S.edPos!=null?S.edPos:E.sms.length; E.sms=E.sms.slice(0,p)+x+E.sms.slice(p); S.edPos=p+x.length; return; }
  if(S.lastField==='subj'){ const p=S.subjPos!=null?Math.min(S.subjPos,E.subj.length):E.subj.length; E.subj=E.subj.slice(0,p)+x+E.subj.slice(p); S.subjPos=p+x.length; return; }
  let j=S.edF; if(j<0||!E.blocks[j]||E.blocks[j].t==='div') j=E.blocks.findIndex(b=>b.t!=='div'); if(j<0) return;
  const el=document.getElementById('ed-b'+j); if(!el) return; el.focus(); setCaret(el,S.rteOff&&S.rteOff.j===j?S.rteOff.o:el.innerText.length); document.execCommand('insertText',false,x); syncRte(el); S.rteOff={j,o:(S.rteOff&&S.rteOff.j===j?S.rteOff.o:0)+x.length};
}

document.addEventListener('click',e=>{
  const ah=e.target.closest&&e.target.closest('a[href^="#/"]'); if(ah&&S.cfgDirty&&location.hash.startsWith('#/config')&&ah.getAttribute('href')!==location.hash){ e.preventDefault(); S.leave=ah.getAttribute('href'); S.evd=null; rerender(); return; }
  const t=e.target.closest('[data-a]');
  if(S.tpOpen&&!e.target.closest('.tpk')){S.tpOpen=null; if(!t){rerender();return;}}
  if(S.umenu&&!e.target.closest('.pop')){S.umenu=false; if(!t){rerender();return;}}
  if(S.menu&&!e.target.closest('.umenu')){S.menu=false; if(!t){rerender();return;}}
  if(S.fOpen&&!e.target.closest('.pop')){S.fOpen=false; if(!t){rerender();return;}}
  if(S.hOpen&&!e.target.closest('.pop')){S.hOpen=false; if(!t){rerender();return;}}
  if(S.acOpen&&!e.target.closest('.acpop')){S.acOpen=false; if(!t){rerender();return;}}
  if(S.eOpen&&!e.target.closest('.pop')){S.eOpen=false; if(!t){rerender();return;}}
  if(S.fyOpen&&!e.target.closest('.pop')){S.fyOpen=false; if(!t){rerender();return;}}
  if(S.tip>=0&&!e.target.closest('.dcol')){S.tip=-1; if(!t){rerender();return;}}
  if(S.cal.open&&!e.target.closest('.calwrap')){S.cal.open=false; if(!t){rerender();return;}}
  if(S.edPop&&!e.target.closest('.edbar .pop')){S.edPop=null; if(!t){rerender();return;}}
  if(!t){ const hv=e.target.closest('.hv[data-v]'); if(hv&&!matchMedia('(hover:hover)').matches){ S.ftip=S.ftip===hv.dataset.v?null:hv.dataset.v; rerender(); } return; } const a=t.dataset.a, v=t.dataset.v;
  if(a==='toast'){e.preventDefault();toast(t.dataset.m);rerender();}
  else if(a==='role'){S.role=v;S.menu=false;S.dr=null;render();}
  else if(a==='menu'){S.menu=!S.menu;rerender();}
  else if(a==='serie'){S.serie=v;S.tip=-1;rerender();}
  else if(a==='tip'){S.tip=S.tip===+v?-1:+v;rerender();}
  else if(a==='open'){goTo('#/clientes/'+v);}
  else if(a==='fopen'){S.fOpen=!S.fOpen;S.fsub=null;rerender();}
  else if(a==='fs'){ const k=t.value; S.fs=t.checked?[...S.fs,k]:S.fs.filter(x=>x!==k); rerender(); }
  else if(a==='fclear'){S.fs=[];S.ordem='recentes';rerender();}
  else if(a==='ord'){S.ordem=v;S.fsub=null;rerender();}
  else if(a==='fsub'){S.fsub=S.fsub===v?null:v;rerender();}
  else if(a==='fun'){S.fun=matchMedia('(hover:hover)').matches?+v:(S.fun===+v?-1:+v);rerender();}
  else if(a==='calopen'){ const k=+v; S.cal.up=false; S.cal.open=!(S.cal.open&&S.cal.k===k); S.cal.k=k; rerender(); const c=document.querySelector('.popm.cal'); if(c) c.scrollIntoView({block:'nearest'}); }
  else if(a==='calnav'){ let m=S.cal.m+(+v), y=S.cal.y; if(m<0){m=11;y--;} if(m>11){m=0;y++;} S.cal={open:true,y,m,up:false,k:S.cal.k}; rerender(); }
  else if(a==='calpick'){ if(S.cal.k===-1) S.ntVenc=v; else S.tits[S.cal.k].venc=v;S.cal.open=false;rerender();}
  else if(a==='addtit'){S.tits.push({venc:''});rerender();}
  else if(a==='deltit'){ if(S.tits.length>1){S.tits.splice(+v,1);S.cal.open=false;toast('Título removido');rerender();} }
  else if(a==='fclose'){S.fOpen=false;rerender();}
  else if(a==='frm'){S.fs=S.fs.filter(x=>x!==v);rerender();}
  else if(a==='upt'){S.up.t=+v;rerender();}
  else if(a==='upnext'){ const last=S.up.t===1?2:3; S.up.e=Math.min(S.up.e+1,last); rerender(); scrollTo(0,0); }
  else if(a==='upback'){S.up.e=Math.max(0,S.up.e-1);rerender();}
  else if(a==='upreset'){S.up={t:-1,e:0};S.tits=[{venc:''}]; if(t.tagName==='BUTTON') rerender();}
  else if(a==='dr'){S.anim=true; lastFocus=t; S.dr=v;S.ed=null;S.edPop=null;rerender(); const x=document.querySelector('.drawer .xbtn'); if(x) x.focus();}
  else if(a==='drclose'||(a==='drclose-bg'&&e.target===t)){S.dr=null;S.ed=null;S.edPop=null;rerender(); if(lastFocus&&document.body.contains(lastFocus)) lastFocus.focus();}
  else if(a==='edit'){ const m=curMsg(); S.ed={subj:m.subj||'',blocks:blocksOf(m).map(b=>({...b})),logo:S.logo,sms:m.txt,cta:{...(m.cta||CTADEF)},ft:{...(m.ft||{on:true,t:FTDEF})},hdr:m.hdr||S.hdr}; S.edF=0; S.edPos=null; rerender(); const x=$('#ed-subj')||$('#ed-sms'); if(x) x.focus(); }
  else if(a==='edcancel'){S.ed=null;S.edPop=null;rerender();}
  else if(a==='edsave'){ const m=curMsg(), E=S.ed; if(m.c==='SMS') m.txt=E.sms; else { m.subj=E.subj; m.blocks=E.blocks; m.cta=E.cta; m.ft=E.ft; m.hdr=E.hdr; const f=E.blocks.find(b=>b.t==='txt'); if(f) m.txt=f.v; S.logo=E.logo; } S.ed=null; toast('Mensagem salva. Vale a partir do próximo envio'); rerender(); }
  else if(a==='evd'||a==='hev'){ S.acOpen=false; S.anim=true; const id=location.hash.split('/')[2]; lastFocus=t; S.ot=-1; S.pt=[]; S.ntVenc=''; S.tm='view'; S.onote=''; S.tpv=''; S.te=null; S.evd={c:id,v}; rerender(); const x=document.querySelector('.drawer .xbtn'); if(x) x.focus(); }
  else if(a==='evclose'||(a==='evclose-bg'&&e.target===t)){ S.evd=null; rerender(); if(lastFocus&&document.body.contains(lastFocus)) lastFocus.focus(); }
  else if(a==='evsave'){ const ev=S.evd; const c=CLI.find(x=>x.id===ev.c); const now=new Date(); const hh=String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');
    if(c&&ev.v==='pausa'){ const p=c.s==='pau'; if(!c.s0) c.s0=c.s; c.s=p?'cob':'pau'; (S.extra[c.id]=S.extra[c.id]||[]).unshift(H('23/09/2026',hh,'manual',p?'refresh':'pause','',p?'Cobrança retomada':'Cobrança pausada',(S.role==='admin'?'Por Renata':'Por Paula')+': '+S.onote,{k:'gen',rows:[[p?'Retomada por':'Pausada por',S.role==='admin'?'Renata Albuquerque':'Paula Reis'],['Motivo',S.onote],['Data e hora','23/09/2026 às '+hh]]})); }
    if(c&&ev.v==='ocor'){ const T=['Ligação telefônica','Conversa por WhatsApp','Atendimento presencial','Promessa de pagamento','Contestação da dívida','Outro']; (S.extra[c.id]=S.extra[c.id]||[]).unshift(H('23/09/2026',hh,'manual','plus','','Ocorrência registrada: '+T[S.ot].toLowerCase(),S.onote,{k:'manual',rows:[['Tipo',T[S.ot]],['Registrada por',S.role==='admin'?'Renata Albuquerque':'Paula Reis'],['Data e hora','23/09/2026 às '+hh],['Observação',S.onote]]})); }
    S.evd=null; S.onote=''; toast(t.dataset.m||'Registrado'); rerender(); }
  else if(a==='acopen'){ S.acOpen=!S.acOpen; rerender(); }
  else if(a==='asave'||a==='aquebra'){ const c=CLI.find(x=>x.id===S.evd.c); const I=acoInfo(c); const F=['Pix','Boleto','Transferência','Dinheiro','Cartão']; const L=(S.extra[c.id]=S.extra[c.id]||[]);
    if(a==='asave'){ const val=pmoney(S.tpv)||I.val; const tot=I.split.reduce((x,y)=>x+y.v,0); I.split.forEach(x=>{ S.pays[x.t.key]={v:Math.round(val*x.v/tot*100)/100,d:S.ntVenc,f:F[S.ot],src:'man'}; }); S.aco[c.id]='pago'; c.s='pago';
      L.unshift(H(S.ntVenc,'—','acordo','wallet','key','Acordo pago, baixa manual',`${brl(val)} por ${F[S.ot].toLowerCase()}, distribuído nos ${I.split.length} títulos`,{k:'gen',rows:[['Valor pago',brl(val)],['Forma',F[S.ot]],['Data',S.ntVenc],['Registrado por','Renata Albuquerque'],...I.split.map(x=>[x.t.d,brl(Math.round(val*x.v/tot*100)/100)])]})); toast('Pagamento do acordo registrado nos '+I.split.length+' títulos'); }
    else { S.aco[c.id]='quebrado'; c.s='cob'; L.unshift(H('29/09/2026','00:05','acordo','undo','hot','Acordo não pago','Venceu em '+I.A.venc+' e passou o prazo de 2 dias úteis. Os títulos voltaram para a cobrança sem desconto',{k:'gen',rows:[['Vencimento',I.A.venc],['Prazo de tolerância','Até '+I.A.tol],['Desconto','Cancelado'],['Títulos','Voltaram a ser cobrados pelo valor atualizado'],['Régua','Retomada na fase seguinte'],['Comunicação','E-mail "Seu acordo não foi pago"']]})); toast('Simulação: acordo quebrado, títulos de volta à cobrança'); }
    S.evd=null; S.tm='view'; S.ot=-1; S.tpv=''; S.ntVenc=''; rerender(); }
  else if(a==='atend'){ markDirty(); CF().atend=!CF().atend; rerender(); }
  else if(a==='cfglogo'){ markDirty(); CF().cfgLogo=!CF().cfgLogo; rerender(); }
  else if(a==='cfgcor'){ markDirty(); CF().cfgCor=!CF().cfgCor; rerender(); }
  else if(a==='tom'){ markDirty(); CF().tom=+v; rerender(); }
  else if(a==='asaas'){ S.asaas=v; rerender(); const d=document.querySelector('details.adv'); if(d) d.open=true; }
  else if(a==='hrday'){ markDirty(); const h=CF().hrs[v]; h[0]=!h[0]; rerender(); }
  else if(a==='atday'){ markDirty(); const d=CF().atDays; d[+v]=d[+v]?0:1; rerender(); }
  else if(a==='tpopen'){ S.tpOpen=S.tpOpen===v?null:v; rerender(); const l=document.querySelector('.tpl'), o=l&&l.querySelector('.on'); if(l){ if(o) l.scrollTop=o.offsetTop-l.clientHeight/2+17; const r=l.getBoundingClientRect(); if(r.bottom>innerHeight-8) scrollBy({top:r.bottom-innerHeight+24,behavior:'smooth'}); } }
  else if(a==='tppick'){ const [k,h]=v.split('|'); markDirty(); const F=CF(); if(k[0]==='a') F.atH[+k[1]]=h; else F.hrs[k[0]][+k[1]+1]=h; S.tpOpen=null; rerender(); }
  else if(a==='fxs'){ const [i,f,d]=v.split('|'); const X=CF().fx, x=X[+i], dd=+d; markDirty();
    if(f==='ate'){ const lo=(+i?X[+i-1].ate:0)+15, nx=X[+i+1], hi=nx&&nx.ate!=null?nx.ate-15:9999; const nv=x.ate+dd*15; if(nv<lo||nv>hi){ toast('As faixas não podem se sobrepor'); return; } x.ate=nv; }
    else if(f==='d'){ x.d=Math.min(90,Math.max(0,x.d+dd*5)); } else { x.p=Math.min(24,Math.max(1,x.p+dd)); } rerender(); }
  else if(a==='fxa'){ markDirty(); const X=CF().fx; const lf=X[X.length-2]; X.splice(X.length-1,0,{ate:lf.ate+90,d:lf.d,p:lf.p}); rerender(); toast('Faixa adicionada'); }
  else if(a==='fxr'){ markDirty(); CF().fx.splice(+v,1); rerender(); }
  else if(a==='encs'){ const [k,d]=v.split('|'); const E=CF().enc; markDirty(); if(k==='j') E.j=Math.min(10,Math.max(0,Math.round((E.j+(+d)*.5)*10)/10)); else if(k==='v') E.v=Math.min(30,Math.max(1,E.v+(+d))); else { const nt=E.t+(+d); if(nt<2){ toast('O mínimo é 2 dias úteis, o prazo para a confirmação do pagamento'); return; } E.t=Math.min(10,nt); } rerender(); }
  else if(a==='fpg'){ const P=CF().fpg; if(P[v]&&Object.values(P).filter(Boolean).length===1){ toast('Mantenha ao menos uma forma de pagamento'); return; } markDirty(); P[v]=!P[v]; rerender(); }
  else if(a==='ntf'){ markDirty(); const N=CF().notif; N[v]=!N[v]; rerender(); }
  else if(a==='umenu'){ S.umenu=S.umenu===v?null:v; rerender(); }
  else if(a==='enctg'){ markDirty(); CF().encOn=CF().encOn===false; rerender(); }
  else if(a==='desctg'){ markDirty(); CF().descOn=CF().descOn===false; rerender(); }
  else if(a==='nmode'){ markDirty(); CF().nmode=v; if(!CF().geral) CF().geral={d:10,p:5}; rerender(); }
  else if(a==='gxs'){ const [k,d]=v.split('|'); markDirty(); const G=CF().geral||(CF().geral={d:10,p:5}); if(k==='d') G.d=Math.min(90,Math.max(0,G.d+(+d)*5)); else G.p=Math.min(24,Math.max(1,G.p+(+d))); rerender(); }
  else if(a==='ftab'){ S.ftab=v; rerender(); }
  else if(a==='dtab'){ S.dtab=v; rerender(); }
  else if(a==='tfsend'){ S.transf=true; S.evd=null; S.umenu=null; toast('Pedido enviado. Aguardando aceite'); rerender(); }
  else if(a==='theme'){ document.documentElement.classList.toggle('light',v==='light'); setTimeout(rerender,0); document.querySelectorAll('[data-a=theme]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v===v))); }
  else if(a==='pweye'){ S.pwShow=S.pwShow||{}; S.pwShow[v]=!S.pwShow[v]; rerender(); }
  else if(a==='aulogin'){ PINK.login(S.au.em,S.au.pw); }
  else if(a==='auerr'){ (S.au=S.au||{}).err=true; rerender(); }
  else if(a==='ausend'){ PINK.esqueci(S.au.fe); S.au.sent=true; S.au.wait=30; rerender(); clearInterval(S._aut); S._aut=setInterval(()=>{ if(!S.au||!S.au.sent){clearInterval(S._aut);return;} S.au.wait--; if(S.au.wait<=0) clearInterval(S._aut); if(location.hash==='#/esqueci') rerender(); },1000); }
  else if(a==='auresend'){ S.au.wait=30; toast('E-mail reenviado'); rerender(); clearInterval(S._aut); S._aut=setInterval(()=>{ S.au.wait--; if(S.au.wait<=0) clearInterval(S._aut); if(location.hash==='#/esqueci') rerender(); },1000); }
  else if(a==='auterms'){ S.au.terms=t.checked; auSync(); }
  else if(a==='ausave'){ PINK.salvarSenha(v,S.au.n1); }
  else if(a==='audone'){ S.au={}; }
  else if(a==='kgen'){ const r=Math.random().toString(36).slice(2,10)+Math.random().toString(36).slice(2,10); S.newKey={env:v,val:(v==='prod'?'ehz_live_':'ehz_test_')+r,copied:false}; S.evd=null; rerender(); }
  else if(a==='kcopy'){ if(S.newKey){ S.newKey.copied=true; toast('Chave copiada. Guarde em lugar seguro'); rerender(); } }
  else if(a==='tfcancel'){ S.transf=false; toast('Pedido cancelado'); rerender(); }
  else if(a==='tfok'){ S.transf=false; S.adminSwap=true; toast((S.pName||'Paula Reis')+' agora é a administradora'); rerender(); }
  else if(a==='tfundo'){ S.adminSwap=false; rerender(); }
  else if(a==='armz'){ S.armz=+v; rerender(); }
  else if(a==='pq'){ const [k,d]=v.split('|'); const Q=S.pq||(S.pq={vagas:1,acessos:1,higienizacao:44}); Q[k]=Math.max(1,Q[k]+(+d)*(k==='higienizacao'?10:1)); rerender(); }
  else if(a==='plok'){ if(v!=='up'){ S.padd=S.padd||{}; S.padd[v]=true; } S.evd=null; toast(v==='up'?'Plano alterado':'Contratado. Já está valendo'); rerender(); }
  else if(a==='urem'){ S.paula='none'; S.pName=null; S.pMail=null; S.evd=null; S.umenu=false; toast('Acesso removido. O plano tem um acesso livre'); rerender(); }
  else if(a==='cvsend'){ const n=($('#cv-n')||{}).value, m=($('#cv-m')||{}).value; S.pName=(n||'').trim()||'Paula Reis'; S.pMail=(m||'').trim()||'paula@escolahorizonte.com.br'; S.paula='convite'; S.evd=null; toast('Convite enviado para '+S.pMail); rerender(); }
  else if(a==='ctsend'){ if(S.ot===0) S.bank='asaas'; S.contaPend=S.ot!==0; S.evd=null; toast('Enviada para análise. Resposta em até 2 dias úteis'); rerender(); }
  else if(a==='smssave'){ CF().smsName=S.smsDraft!=null?S.smsDraft:CF().smsName; S.smsDraft=null; S.evd=null; toast('Nome do SMS atualizado'); rerender(); }
  else if(a==='cfgsave'){ S.cfgDirty=false; S.cfgSnap=null; toast('Alterações salvas'); rerender(); }
  else if(a==='lvsave'||a==='lvdisc'){ if(a==='lvdisc'&&S.cfgSnap){ S.cf=S.cfgSnap; S.cor=S.cf.cor; } S.cfgDirty=false; S.cfgSnap=null; const to=S.leave; S.leave=null; if(a==='lvsave') toast('Alterações salvas'); goTo(to); rerender(); }
  else if(a==='lvstay'||(a==='lvstay-bg'&&e.target===t)){ S.leave=null; rerender(); }
  else if(a==='rsel'){ const k=t.value; const cur=S.rsel||['resumo','pag','cart']; S.rsel=t.checked?[...cur,k]:cur.filter(x=>x!==k); rerender(); }
  else if(a==='rprev'){ S.rprev=S.rprev===v?null:v; rerender(); }
  else if(a==='fyopen'){ S.fyOpen=!S.fyOpen; rerender(); }

  else if(a==='fyclose'){ S.fyOpen=false; rerender(); }
  else if(a==='fmsel'){ S.fm=v; S.fyOpen=false; S.ftip=null; rerender(); scrollTo({top:0}); }
  else if(a==='pzask'){ lastFocus=t; S.pz=true; rerender(); const b=document.querySelector('.cmodal [data-a=pzno]'); if(b) b.focus(); }
  else if(a==='pzno'||(a==='pzno-bg'&&e.target===t)){ S.pz=false; rerender(); if(lastFocus&&document.body.contains(lastFocus)) lastFocus.focus(); }
  else if(a==='pzyes'){ S.cobP=!S.cobP; S.pz=false; toast(S.cobP?'Toda a cobrança foi pausada':'Cobrança retomada'); rerender(); }
  else if(a==='eopen'){ S.eOpen=!S.eOpen; S.esub=null; rerender(); }
  else if(a==='esub'){ S.esub=S.esub===v?null:v; rerender(); }
  else if(a==='efc'){ S.ef=v; S.esub=null; rerender(); }
  else if(a==='efs'){ S.es=v; S.esub=null; rerender(); }
  else if(a==='eclear'){ S.ef='todos'; S.es='todas'; rerender(); }
  else if(a==='eclose'){ S.eOpen=false; rerender(); }
  else if(a==='etab'){ S.etab=v; rerender(); }
  else if(a==='chsel'){ S.ch=v; rerender(); }
  else if(a==='fmt'){ S.fmt=v; rerender(); }
  else if(a==='pdfb'){ S.pdfb=v; rerender(); }
  else if(a==='xtab'){ S.xtab=v; rerender(); }
  else if(a==='tm'){ S.tm=v; S.ot=-1; S.ntVenc=''; S.tpv=''; S.te=null; if(v==='edit'){ const c0=CLI.find(x=>x.id===S.evd.c); const t0=perfil(c0).tits.find(x=>x.k===+String(S.evd.v).slice(4)); S.te={d:t0.d,o:brl(t0.o)}; } rerender(); }
  else if(a==='tsave'){ const c=CLI.find(x=>x.id===S.evd.c); const k=+String(S.evd.v).slice(4); const t=perfil(c).tits.find(x=>x.k===k); const F=['Pix','Boleto','Transferência','Dinheiro','Cartão'];
    if(v==='pay'||v==='fix'){ const val=pmoney(S.tpv||($('#tp-v')||{}).value); S.pays[t.key]={v:val!=null?val:(v==='fix'?t.pay.v:Math.round(t.a*100)/100),d:S.ntVenc||'23/09/2026',f:F[S.ot]||'Pix',src:'man'}; toast(v==='pay'?'Pagamento registrado no título '+t.c:'Pagamento corrigido. O fechamento foi ajustado'); }
    else if(v==='undo'){ S.pays[t.key]=null; toast('Pagamento desfeito. O título voltou para a cobrança'); }
    else if(v==='edit'){ S.edits[t.key]={d:S.te.d.trim(),v:S.ntVenc||t.v,o:pmoney(S.te.o)}; toast('Título atualizado'); }
    else if(v==='del'){ S.del.push(t.key); toast('Título excluído da cobrança'); S.evd=null; rerender(); return; }
    S.tm='view'; S.ot=-1; S.ntVenc=''; S.tpv=''; rerender(); }
  else if(a==='ptk'){ const k=+t.value; S.pt=t.checked?[...S.pt,k]:S.pt.filter(x=>x!==k); rerender(); }
  else if(a==='ot'){ S.ot=+v; rerender(); }
  else if(a==='hopen'){ S.hOpen=!S.hOpen; S.hsub=null; rerender(); }
  else if(a==='hsub'){ S.hsub=S.hsub===v?null:v; rerender(); }
  else if(a==='hm'){ S.hm=v; S.hsub=null; rerender(); }
  else if(a==='hc'){ const k=t.value; S.hc=t.checked?[...S.hc,k]:S.hc.filter(x=>x!==k); rerender(); }
  else if(a==='hclear'){ S.hm='todos'; S.hc=[]; rerender(); }
  else if(a==='hclose'){ S.hOpen=false; rerender(); }
  else if(a==='hx'){ const k=+v; S.hx=S.hx.includes(k)?S.hx.filter(x=>x!==k):[...S.hx,k]; rerender(); }
  else if(a==='envf'){ S.envF=v; rerender(); }
  else if(a==='blkb'){ const j=+v; const el=document.getElementById('ed-b'+j); const sel=getSelection(); const inside=el&&sel.rangeCount&&!sel.isCollapsed&&el.contains(sel.anchorNode)&&el.contains(sel.focusNode);
    if(inside){ document.execCommand('bold'); syncRte(el); refreshEditor(); }
    else { const bl=S.ed.blocks[j]; bl.bold=!bl.bold; if(!bl.bold&&bl.h) bl.h=bl.h; S.edF=j; rerender(); } }
  else if(a==='blkal'){ const [j,al]=v.split(':'); S.ed.blocks[+j].al=al; S.edF=+j; rerender(); }
  else if(a==='ctaal'){ S.ed.cta.al=v; rerender(); }
  else if(a==='edhdr'){ S.ed.hdr=v; rerender(); }
  else if(a==='ftsw'){ S.ed.ft.on=!S.ed.ft.on; rerender(); }
  else if(a==='edlogo'){S.ed.logo=!S.ed.logo;rerender();}
  else if(a==='edpop'){S.edPop=S.edPop===v?null:v;rerender();}
  else if(a==='addblk'){ const nb={t:v,v:v==='dest'?'Até {desconto} de desconto à vista, só neste mês.':''}; S.ed.blocks.push(nb); S.edPop=null; S.edF=S.ed.blocks.length-1; rerender(); const x=$('#ed-b'+S.edF); if(x) x.focus(); }
  else if(a==='rmblk'){ S.ed.blocks.splice(+v,1); S.edF=-1; rerender(); }
  else if(a==='mvblk'){ const [j,d]=v.split(':').map(Number); const B=S.ed.blocks; const k=j+d; if(k<0||k>=B.length) return; [B[j],B[k]]=[B[k],B[j]]; S.edF=k; rerender(); }
  else if(a==='emoji'||a==='var'){ insertTxt(v); S.edPop=null; rerender(); if(S.lastField==='subj'){ const el=$('#ed-subj'); const p=S.subjPos; if(el){ el.focus(); el.setSelectionRange(p,p); S.subjPos=p; } } }
});
document.addEventListener('mouseover',e=>{ const hv=e.target.closest&&e.target.closest('.hv[data-v]'); if(hv&&S.ftip!==hv.dataset.v&&matchMedia('(hover:hover)').matches){ S.ftip=hv.dataset.v; rerender(); return; } const f=e.target.closest&&e.target.closest('.fst'); if(f&&S.fun!==+f.dataset.v&&matchMedia('(hover:hover)').matches){S.fun=+f.dataset.v;rerender();return;} const c=e.target.closest('.dcol[data-v]'); if(c&&S.tip!==+c.dataset.v&&matchMedia('(hover:hover)').matches){S.tip=+c.dataset.v;rerender();} });
document.addEventListener('mouseout',e=>{ const hw=e.target.closest&&e.target.closest('.hvwrap'); if(hw&&!hw.contains(e.relatedTarget)&&S.ftip){ S.ftip=null; rerender(); return; } const fw=e.target.closest&&e.target.closest('.funnel2'); if(fw&&!fw.contains(e.relatedTarget)&&S.fun>=0&&matchMedia('(hover:hover)').matches){S.fun=-1;rerender();return;} const c=e.target.closest('.dcols'); if(c&&!c.contains(e.relatedTarget)&&S.tip>=0&&matchMedia('(hover:hover)').matches){S.tip=-1;rerender();} });
document.addEventListener('focusin',e=>{ const ff=e.target.closest&&e.target.closest('.fst'); if(ff&&S.fun!==+ff.dataset.v){S.fun=+ff.dataset.v;rerender();const g=document.querySelector('.fst[data-v="'+S.fun+'"]'); if(g) g.focus(); return;} const tb=e.target.closest&&e.target.closest('textarea[data-j],#ed-sms'); if(tb){ if(tb.dataset.j!=null){S.edF=+tb.dataset.j;} S.edPos=tb.selectionEnd; } const c=e.target.closest('.dcol[data-v]'); if(c&&S.tip!==+c.dataset.v){S.tip=+c.dataset.v;rerender();} });
['keyup','mouseup'].forEach(ev=>document.addEventListener(ev,e=>{ const tb=e.target.closest&&e.target.closest('textarea[data-j],#ed-sms'); if(tb){ if(tb.dataset.j!=null){ S.edF=+tb.dataset.j; S.edSel=[tb.selectionStart,tb.selectionEnd,+tb.dataset.j]; } S.edPos=tb.selectionEnd; } }));
document.addEventListener('focusin',e=>{ if(e.target.id==='ed-subj'){ S.lastField='subj'; S.subjPos=e.target.selectionEnd; } else if(e.target.closest&&e.target.closest('.rte')){ S.lastField='blk'; } });
['keyup','mouseup'].forEach(ev=>document.addEventListener(ev,e=>{ if(e.target.id==='ed-subj'){ S.lastField='subj'; S.subjPos=e.target.selectionEnd; } }));
document.addEventListener('selectionchange',()=>{ const s=getSelection(); if(!s.rangeCount) return; const n=s.anchorNode; const el=n&&(n.nodeType===1?n:n.parentElement); const r=el&&el.closest&&el.closest('.rte'); if(r){ S.edF=+r.dataset.j; const o=caretOff(r); if(o!=null) S.rteOff={j:+r.dataset.j,o}; } });
document.addEventListener('mousedown',e=>{ if(e.target.closest&&e.target.closest('[data-a=blkb]')) e.preventDefault(); });
document.addEventListener('paste',e=>{ const r=e.target.closest&&e.target.closest('.rte'); if(r){ e.preventDefault(); document.execCommand('insertText',false,(e.clipboardData||window.clipboardData).getData('text')); } });
document.addEventListener('change',e=>{ if(e.target.id==='cfg-color'){ rerender(); return; } const sel=e.target.closest&&e.target.closest('select[data-hr]'); if(sel){ const H=S.hrs||{u:[true,'08:00','20:00'],s:[true,'08:00','14:00'],d:[false,'08:00','14:00']}; const k=sel.dataset.hr; H[k[0]][+k[1]+1]=sel.value; S.hrs=H; toast('Horário atualizado'); } });
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){ if(S.leave){S.leave=null;rerender();return;} if(S.tpOpen){S.tpOpen=null;rerender();return;} if(S.pz){S.pz=false;rerender();if(lastFocus)lastFocus.focus();return;} if(S.evd){S.evd=null;rerender();if(lastFocus)lastFocus.focus();return;} if(S.edPop||S.cal.open){S.edPop=null;S.cal.open=false;rerender();return;} if(S.dr){S.dr=null;S.ed=null;rerender();if(lastFocus)lastFocus.focus();return;} if(S.menu||S.fOpen||S.tip>=0||S.acOpen||S.hOpen){S.menu=false;S.fOpen=false;S.tip=-1;S.acOpen=false;S.hOpen=false;rerender();} }
  if((e.key==='Enter'||e.key===' ')&&e.target.matches('tr[data-a]')){e.preventDefault();e.target.click();}
  if(e.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){const s=$('#lsearch');if(s){e.preventDefault();s.focus();}}
  if(e.key==='Tab'&&(S.dr||S.evd)){ const f=[...document.querySelectorAll('.drawer button:not([disabled]),.drawer textarea,.drawer input')]; if(!S.dr&&!S.evd) return; if(!f.length) return; const i=f.indexOf(document.activeElement); if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus();} else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus();} }
});
document.addEventListener('input',e=>{
  const t=e.target;
  if(t.id&&t.id.startsWith('au-')){ const k=t.id.slice(3); (S.au=S.au||{})[k]=t.value; if((k==='em'||k==='pw')&&S.au.err){ S.au.err=false; const er=document.querySelector('.aerr'); if(er) er.remove(); } auSync(); return; }
  if(t.id==='bl-q'){ S.bq=t.value; rerender(); const el=$('#bl-q'); if(el){el.focus(); el.setSelectionRange(t.value.length,t.value.length);} return; }
  if(t.id==='aj-q'){ S.aq=t.value; rerender(); const el=$('#aj-q'); if(el){el.focus(); el.setSelectionRange(t.value.length,t.value.length);} return; }
  if(t.id==='sms-nm'){ const c=t.value.replace(/[^A-Za-z0-9]/g,'').slice(0,11); S.smsDraft=c; rerender(); const el=$('#sms-nm'); if(el){el.focus(); el.setSelectionRange(c.length,c.length);} return; }
  if(t.closest&&t.closest('.cfgmain')&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA')&&!t.readOnly&&t.id!=='cfg-color'&&t.id!=='cfg-hex'&&t.id!=='bl-q'){ if(!S.cfgDirty){ markDirty(); const b=$('#cfg-save'); if(b) b.disabled=false; const st=$('#cfg-st'); if(st){ st.textContent='Alterações não salvas'; st.className='dirty'; } } return; }
  if(t.id==='cfg-color'){ markDirty(); S.cor=t.value; const pv=document.querySelector('.cprev'); if(pv){ const tmp=document.createElement('div'); tmp.innerHTML=brandPrev(); pv.replaceWith(tmp.firstElementChild); } const w=document.querySelector('.cwheel'); if(w) w.style.setProperty('--c',t.value); const hx=$('#cfg-hex'); if(hx){ hx.value=t.value.toUpperCase(); hx.previousElementSibling.style.background=t.value; } return; }
  if(t.id==='cfg-hex'){ if(/^#[0-9a-fA-F]{6}$/.test(t.value)){ markDirty(); S.cor=t.value; rerender(); const el=$('#cfg-hex'); if(el){el.focus(); el.setSelectionRange(7,7);} } return; }
  if(t.id==='tp-v'||t.id==='te-o'){ const v=mmask(t.value); if(t.id==='tp-v') S.tpv=v; else S.te.o=v; rerender(); const el=document.getElementById(t.id); if(el){el.focus(); el.setSelectionRange(v.length,v.length);} return; }
  if(t.id==='te-d'){ S.te.d=t.value; rerender(); return; }
  if(t.id==='oc-n'||t.id==='pz-m'){ S.onote=t.value; rerender(); return; }
  if(t.id==='lsearch'){S.busca=t.value;rerender();}
  else if(t.id==='ordem'){S.ordem=t.value;rerender();}
  else if(t.id==='ed-subj'){S.ed.subj=t.value;S.lastField='subj';S.subjPos=t.selectionEnd;rerender();}
  else if(t.id==='ed-cta'){S.ed.cta.t=t.value;rerender();}
  else if(t.id==='ed-ft'){S.ed.ft.t=t.value;rerender();}
  else if(t.id==='ed-sms'){S.ed.sms=t.value;S.edPos=t.selectionEnd;rerender();}
  else if(t.classList&&t.classList.contains('rte')){ syncRte(t); S.rteOff={j:+t.dataset.j,o:caretOff(t)}; refreshEditor(); }
});
document.addEventListener('change',e=>{ if(e.target.id==='ordem'){S.ordem=e.target.value;rerender();} });
window.addEventListener('hashchange',()=>{ if(!PINK.ready) return; },false);
window.addEventListener('hashchange',()=>{S.menu=false;S.evd=null;S.acOpen=false;S.hOpen=false;S.fOpen=false;S.tip=-1;S.dr=null;render();scrollTo(0,0);const m=$('#main');if(m)m.focus({preventScroll:true});});
PINK.init().then(ok=>{ if(ok) render(); });
})();





