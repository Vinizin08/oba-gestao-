const SUPABASE_URL = 'https://jrkmlyfsfdnytqolucre.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impya21seWZzZmRueXRxb2x1Y3JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0NDI5ODAsImV4cCI6MjEwNTAxODk4MH0.UDPn2d7dLdvJkstgL3y4ptSOGdPfnGD-dhK-V4ghbXo';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { realtime: { params: { eventsPerSecond: 10 } } });
function calcularPedido(produto, estoqueAtual) { const ideal=Number(produto.ideal_qty??0), atual=Number(estoqueAtual??0), unidadesAPedir=Math.max(0,ideal-atual); let kgAPedir=null; if(produto.weight_per_unit_g&&unidadesAPedir>0){kgAPedir=Math.round((unidadesAPedir*Number(produto.weight_per_unit_g)/1000)*1000)/1000;} return {unidadesAPedir,kgAPedir,precisaPedir:unidadesAPedir>0}; }
function setSyncStatus(status){const el=document.getElementById('sync-status');if(!el)return;const map={online:{text:'Online',cls:'sync-online'},syncing:{text:'Sincronizando...',cls:'sync-syncing'},offline:{text:'Offline',cls:'sync-offline'},error:{text:'Erro de conexão',cls:'sync-offline'}};const s=map[status]||map.offline;el.textContent='● '+s.text;el.className='sync-badge '+s.cls;}
window.addEventListener('online',()=>setSyncStatus('online'));window.addEventListener('offline',()=>setSyncStatus('offline'));
async function registrarAuditoria({storeId,productId,action,oldValue,newValue}){const {data:{user}}=await supabaseClient.auth.getUser();await supabaseClient.from('audit_logs').insert({store_id:storeId,product_id:productId,user_id:user?.id,action,old_value:oldValue!=null?String(oldValue):null,new_value:newValue!=null?String(newValue):null});}
async function logout(){await supabaseClient.auth.signOut();window.location.href='index.html';}
async function exigirSessao(){const {data:{session}}=await supabaseClient.auth.getSession();if(!session){window.location.href='index.html';return null;}return session;}


/* Euvi ADM — mobile hardening / QA patch
   Keeps the existing structure and fixes the mobile drawer layering/interaction. */
(function(){
  if (!/Painel ADM/i.test(document.title)) return;

  /* Do not disable browser zoom on mobile. */
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) viewport.setAttribute('content','width=device-width, initial-scale=1, viewport-fit=cover');

  const css = document.createElement('style');
  css.id = 'euvi-mobile-hardening';
  css.textContent = `
    @media (max-width:800px){
      html,body{overflow-x:hidden}
      body.euvi-menu-open{overflow:hidden}
      .top{
        position:sticky !important;
        top:0 !important;
        z-index:5000 !important;
        isolation:isolate;
      }
      .sidebar-toggle{
        position:relative !important;
        z-index:6000 !important;
        min-width:44px;
        min-height:44px;
        flex:0 0 44px;
        touch-action:manipulation;
      }
      .side{
        z-index:3000 !important;
        top:0 !important;
        bottom:0 !important;
        width:min(280px,82vw) !important;
        max-width:280px;
        overflow-y:auto;
        -webkit-overflow-scrolling:touch;
      }
      body.sidebar-collapsed .side{
        transform:translateX(-105%) !important;
        pointer-events:none;
      }
      body:not(.sidebar-collapsed) .side{
        transform:translateX(0) !important;
        pointer-events:auto;
      }
      .euvi-menu-backdrop{
        position:fixed;
        inset:0;
        z-index:2500;
        background:rgba(0,0,0,.52);
        opacity:1;
        transition:opacity .2s ease;
      }
      body.sidebar-collapsed .euvi-menu-backdrop{
        opacity:0;
        pointer-events:none;
      }
      .nav{min-height:44px}
      .top .right{min-width:0}
      .top .right #who{display:none !important}
    }
    @media (min-width:801px){
      .euvi-menu-backdrop{display:none !important}
    }
  `;
  document.head.appendChild(css);

  const backdrop = document.createElement('div');
  backdrop.className = 'euvi-menu-backdrop';
  backdrop.setAttribute('aria-hidden','true');
  document.body.appendChild(backdrop);

  const syncMenu = function(){
    const btn=document.querySelector('.sidebar-toggle');
    const open=!document.body.classList.contains('sidebar-collapsed');
    if(btn){
      btn.textContent=open?'×':'☰';
      btn.setAttribute('aria-expanded',String(open));
      btn.setAttribute('aria-controls','euvi-admin-sidebar');
      btn.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');
      btn.type='button';
    }
    document.body.classList.toggle('euvi-menu-open',open && window.innerWidth<=800);
    const side=document.querySelector('.side');
    if(side) side.id='euvi-admin-sidebar';
  };

  /* The original inline script defines these functions after config.js loads. */
  setTimeout(function(){
    if(typeof window.toggleSidebar==='function'){
      const originalToggle=window.toggleSidebar;
      window.toggleSidebar=function(){
        originalToggle();
        syncMenu();
      };
    }
    if(typeof window.go==='function'){
      const originalGo=window.go;
      window.go=function(v,btn){
        originalGo(v,btn);
        if(window.innerWidth<=800){
          document.body.classList.add('sidebar-collapsed');
          localStorage.setItem('euvi_admin_sidebar_collapsed','1');
        }
        syncMenu();
      };
    }

    backdrop.addEventListener('click',function(){
      if(window.innerWidth<=800 && !document.body.classList.contains('sidebar-collapsed')){
        document.body.classList.add('sidebar-collapsed');
        localStorage.setItem('euvi_admin_sidebar_collapsed','1');
        syncMenu();
      }
    });

    document.addEventListener('keydown',function(e){
      if(e.key==='Escape' && window.innerWidth<=800 && !document.body.classList.contains('sidebar-collapsed')){
        document.body.classList.add('sidebar-collapsed');
        localStorage.setItem('euvi_admin_sidebar_collapsed','1');
        syncMenu();
      }
    });

    window.addEventListener('resize',syncMenu);
    syncMenu();
  },0);
})();
