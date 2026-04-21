// ===== Hero slider =====
let currentSlide=0;
let slideTimer=null;
function showSlide(i){
  const slides=document.querySelectorAll('.slide');
  const dots=document.querySelectorAll('.slider-controls button');
  if(!slides.length) return;
  currentSlide=(i+slides.length)%slides.length;
  slides.forEach((s,idx)=>s.classList.toggle('active',idx===currentSlide));
  dots.forEach((d,idx)=>d.classList.toggle('active',idx===currentSlide));
}
function changeSlide(d){showSlide(currentSlide+d);resetTimer();}
function goToSlide(i){showSlide(i);resetTimer();}
function resetTimer(){
  if(slideTimer) clearInterval(slideTimer);
  slideTimer=setInterval(()=>showSlide(currentSlide+1),5500);
}
document.addEventListener('DOMContentLoaded',()=>{
  if(document.querySelector('.hero-slider')) resetTimer();
});

// ===== Mobile menu =====
function toggleMenu(){
  const nav=document.getElementById('nav');
  if(nav) nav.classList.toggle('open');
}

// ===== Pickup news tabs (in-page switch) =====
document.addEventListener('click',e=>{
  const tab=e.target.closest('.pickup-tab');
  if(!tab) return;
  const id=tab.dataset.tab;
  document.querySelectorAll('.pickup-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.pickup-panel').forEach(p=>p.classList.remove('active'));
  tab.classList.add('active');
  const panel=document.getElementById(id);
  if(panel) panel.classList.add('active');
});

// ===== Event calendar =====
const events={
  '2026-04-22':{title:'スポーツ栄養セミナー',tag:'セミナー'},
  '2026-04-26':{title:'ジュニア動作解析体験会',tag:'体験会'},
  '2026-04-29':{title:'フィットネスドック特別枠',tag:'測定'},
  '2026-05-05':{title:'親子体力測定会',tag:'イベント'},
  '2026-05-12':{title:'アスリート向け投球解析',tag:'解析'},
  '2026-05-18':{title:'女性向けヨガクラス',tag:'クラス'},
  '2026-05-25':{title:'ランニングフォーム改善会',tag:'解析'},
};

let calState={y:2026,m:3}; // month is 0-based (4月)

function renderCalendar(){
  const cal=document.getElementById('calendar');
  const list=document.getElementById('event-list');
  const label=document.getElementById('month-label');
  if(!cal||!label) return;
  const {y,m}=calState;
  label.textContent=`${y}年 ${m+1}月`;
  const first=new Date(y,m,1).getDay();
  const lastDay=new Date(y,m+1,0).getDate();
  const today=new Date();
  const dows=['日','月','火','水','木','金','土'];
  let html=dows.map(d=>`<div class="dow">${d}</div>`).join('');
  for(let i=0;i<first;i++) html+='<div class="day empty"></div>';
  for(let d=1;d<=lastDay;d++){
    const key=`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isToday=(y===today.getFullYear()&&m===today.getMonth()&&d===today.getDate());
    const ev=events[key];
    const cls=['day'];
    if(isToday) cls.push('today');
    if(ev) cls.push('event');
    html+=`<div class="${cls.join(' ')}" data-date="${key}" title="${ev?ev.title:''}">${d}${ev?'<span class="dot"></span>':''}</div>`;
  }
  cal.innerHTML=html;

  // Month's event list
  if(list){
    const items=Object.entries(events)
      .filter(([k])=>k.startsWith(`${y}-${String(m+1).padStart(2,'0')}`))
      .sort()
      .map(([k,v])=>{
        const day=k.split('-')[2];
        return `<li><span class="date">${+day}日</span><span>${v.title}<span class="muted" style="font-size:11px;margin-left:8px">[${v.tag}]</span></span></li>`;
      });
    list.innerHTML=items.length?items.join(''):'<li class="muted" style="border:none">今月のイベントはありません</li>';
  }
}

function changeMonth(delta){
  calState.m+=delta;
  if(calState.m<0){calState.m=11;calState.y--;}
  if(calState.m>11){calState.m=0;calState.y++;}
  renderCalendar();
}

document.addEventListener('DOMContentLoaded',renderCalendar);

// ===== Smooth close mobile nav on link click =====
document.addEventListener('click',e=>{
  const nav=document.getElementById('nav');
  if(!nav||!nav.classList.contains('open')) return;
  if(e.target.closest('.nav a')) nav.classList.remove('open');
});
