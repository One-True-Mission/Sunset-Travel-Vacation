/* ============================================================
   SUNSET TRAVEL VACATIONS - OTM Web Design
   Shared script (all pages)
   ============================================================ */

/* ---------- Mobile hamburger menu ---------- */
(function(){
  var ham=document.querySelector('.hamburger');
  if(!ham)return;
  var bd=document.querySelector('.nav-backdrop'),
      panel=document.querySelector('.mobile-panel'),
      links=document.querySelectorAll('.mobile-panel a');
  function open(){document.body.classList.add('nav-open');ham.setAttribute('aria-expanded','true');if(panel)panel.setAttribute('aria-hidden','false');}
  function close(){document.body.classList.remove('nav-open');ham.setAttribute('aria-expanded','false');if(panel)panel.setAttribute('aria-hidden','true');}
  function toggle(){document.body.classList.contains('nav-open')?close():open();}
  ham.addEventListener('click',toggle);
  if(bd)bd.addEventListener('click',close);
  links.forEach(function(l){l.addEventListener('click',close);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
  window.addEventListener('resize',function(){if(window.innerWidth>900)close();});
})();

/* ---------- Active nav by data-page ---------- */
(function(){
  var page=document.body.getAttribute('data-page');
  if(!page)return;
  document.querySelectorAll('[data-nav]').forEach(function(a){
    if(a.getAttribute('data-nav')===page)a.classList.add('is-active');
  });
})();

/* ---------- Gallery carousel (home only) ---------- */
(function(){
  var track=document.getElementById('carTrack');
  if(!track)return;
  var slides=Array.prototype.slice.call(track.querySelectorAll('.car-slide')),
      total=slides.length,current=0,timer=null,
      dotsWrap=document.getElementById('carDots');
  if(!total)return;
  slides.forEach(function(_,i){
    var d=document.createElement('button');
    d.className='car-dot';d.setAttribute('aria-label','Go to slide '+(i+1));
    d.addEventListener('click',function(){go(i);});
    dotsWrap.appendChild(d);
  });
  var dots=Array.prototype.slice.call(dotsWrap.children);
  function render(){
    slides.forEach(function(s,i){
      var rel=(i-current+total)%total,cls='car-slide';
      if(rel===0)cls+=' is-active';
      else if(rel===1)cls+=' is-next';
      else if(rel===total-1)cls+=' is-prev';
      else if(rel<=Math.floor(total/2))cls+=' is-far-right';
      else cls+=' is-far-left';
      s.className=cls;
    });
    dots.forEach(function(d,i){d.classList.toggle('is-active',i===current);});
  }
  function go(i){current=(i+total)%total;render();restart();}
  function next(){go(current+1);}
  function prev(){go(current-1);}
  function start(){timer=setInterval(next,2000);}
  function stop(){clearInterval(timer);}
  function restart(){stop();start();}
  var nb=document.getElementById('carNext'),pb=document.getElementById('carPrev');
  if(nb)nb.addEventListener('click',next);
  if(pb)pb.addEventListener('click',prev);
  slides.forEach(function(s,i){s.addEventListener('click',function(){if(!s.classList.contains('is-active'))go(i);});});
  var vp=track.parentElement;
  vp.addEventListener('mouseenter',stop);
  vp.addEventListener('mouseleave',start);
  vp.addEventListener('touchstart',stop,{passive:true});
  vp.addEventListener('touchend',start);
  document.addEventListener('keydown',function(e){
    if(document.activeElement&&/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))return;
    if(e.key==='ArrowRight')next();
    if(e.key==='ArrowLeft')prev();
  });
  render();start();
})();

/* ---------- Light form validation (book page) ---------- */
(function(){
  var form=document.getElementById('planForm');
  if(!form)return;
  form.addEventListener('submit',function(e){
    var required=form.querySelectorAll('[required]'),ok=true;
    required.forEach(function(f){
      if(!f.value.trim()){f.style.borderColor='#c0392b';ok=false;}
      else{f.style.borderColor='';}
    });
    var email=form.querySelector('input[type="email"]');
    if(email&&email.value&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)){email.style.borderColor='#c0392b';ok=false;}
    if(!ok)e.preventDefault();
  });
})();