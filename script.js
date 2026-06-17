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
  /* Set the Formspree _next redirect to an absolute URL based on the
     current origin/path, so it stays correct on any domain (github.io,
     custom domain) with no manual edits. Formspree requires an absolute URL. */
  var nextField=form.querySelector('input[name="_next"]');
  if(nextField){
    try{nextField.value=new URL('thank-you.html',window.location.href).href;}catch(e){}
  }
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

/* ---------- Testimonial carousel (home + about) ---------- */
(function(){
  var cars=document.querySelectorAll('.tcar');
  if(!cars.length)return;
  cars.forEach(function(car){
    var track=car.querySelector('.tcar-track'),
        slides=Array.prototype.slice.call(car.querySelectorAll('.tcar-slide')),
        dotsWrap=car.querySelector('.tcar-dots'),
        prevBtn=car.querySelector('.tcar-prev'),
        nextBtn=car.querySelector('.tcar-next'),
        total=slides.length,cur=0,timer=null;
    if(!total||!track)return;
    slides.forEach(function(_,i){
      var d=document.createElement('button');
      d.className='car-dot';d.setAttribute('aria-label','Testimonial '+(i+1));
      d.addEventListener('click',function(){go(i);});
      dotsWrap.appendChild(d);
    });
    var dots=Array.prototype.slice.call(dotsWrap.children);
    function render(){
      track.style.transform='translateX(-'+(cur*100)+'%)';
      dots.forEach(function(d,i){d.classList.toggle('is-active',i===cur);});
    }
    function go(i){cur=(i+total)%total;render();restart();}
    function nx(){go(cur+1);}
    function pv(){go(cur-1);}
    function start(){timer=setInterval(nx,6000);}
    function stop(){clearInterval(timer);}
    function restart(){stop();start();}
    if(nextBtn)nextBtn.addEventListener('click',nx);
    if(prevBtn)prevBtn.addEventListener('click',pv);
    car.addEventListener('mouseenter',stop);
    car.addEventListener('mouseleave',start);
    car.addEventListener('touchstart',stop,{passive:true});
    car.addEventListener('touchend',start);
    render();start();
  });
})();