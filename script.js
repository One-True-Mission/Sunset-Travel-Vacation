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

/* ============================================================
   FORM: validation + AJAX submit + guaranteed thank-you redirect

   Why AJAX: Formspree no longer honors the `_next` hidden field
   for the post-submit redirect (it is now a dashboard setting), so
   relying on it dumps users on Formspree's generic "Thanks!" page.
   We submit in the background and redirect ourselves, which works
   on any plan, any domain, with no dashboard configuration.
   ============================================================ */
(function(){
  var form=document.getElementById('planForm');
  if(!form)return;

  var THANK_YOU='thank-you.html';
  var EMAIL_RE=/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

  function wrap(el){return el.closest('.field')||el.parentNode;}
  function clearError(el){
    el.classList.remove('has-error');
    var old=wrap(el).querySelector('.field-error');
    if(old)old.parentNode.removeChild(old);
  }
  function setError(el,msg){
    clearError(el);
    el.classList.add('has-error');
    var s=document.createElement('span');
    s.className='field-error';
    s.textContent=msg;
    wrap(el).appendChild(s);
  }
  function clearAll(){
    form.querySelectorAll('.field-error').forEach(function(n){n.parentNode.removeChild(n);});
    form.querySelectorAll('.has-error').forEach(function(n){n.classList.remove('has-error');});
  }
  function digits(v){return (v||'').replace(/\D/g,'').slice(0,10);}
  function formatPhone(v){
    var d=digits(v);
    if(d.length<4)return d;
    if(d.length<7)return '('+d.slice(0,3)+') '+d.slice(3);
    return '('+d.slice(0,3)+') '+d.slice(3,6)+'-'+d.slice(6);
  }

  /* Phone: numeric only, auto-format, hard 10 digit cap */
  var phone=form.querySelector('input[type="tel"]');
  if(phone){
    phone.setAttribute('inputmode','numeric');
    phone.setAttribute('autocomplete','tel');
    phone.addEventListener('input',function(){
      var atEnd=this.selectionStart===this.value.length;
      this.value=formatPhone(this.value);
      if(atEnd)this.setSelectionRange(this.value.length,this.value.length);
      clearError(this);
    });
    phone.addEventListener('blur',function(){
      if(this.value.length&&digits(this.value).length!==10)setError(this,'Enter a 10 digit phone number.');
    });
  }

  /* Clear a field's error as soon as the visitor edits it */
  form.querySelectorAll('input,select,textarea').forEach(function(f){
    f.addEventListener('input',function(){if(this.classList.contains('has-error'))clearError(this);});
    f.addEventListener('change',function(){if(this.classList.contains('has-error'))clearError(this);});
  });

  function validate(){
    clearAll();
    var ok=true,firstBad=null;
    function fail(el,msg){setError(el,msg);ok=false;if(!firstBad)firstBad=el;}

    /* Required fields must not be blank */
    form.querySelectorAll('[required]').forEach(function(f){
      if(!(f.value||'').trim())fail(f,'This field is required.');
    });

    /* Names need at least 2 real characters */
    ['first_name','last_name'].forEach(function(n){
      var f=form.querySelector('[name="'+n+'"]');
      if(!f)return;
      var v=(f.value||'').trim();
      if(v&&v.length<2)fail(f,'Please enter at least 2 characters.');
    });

    /* Phone must be exactly 10 digits */
    if(phone&&phone.value.trim()&&digits(phone.value).length!==10){
      fail(phone,'Enter a 10 digit phone number.');
    }

    /* Email must be a full, valid address */
    var email=form.querySelector('input[type="email"]');
    if(email&&email.value.trim()&&!EMAIL_RE.test(email.value.trim())){
      fail(email,'Enter a valid email address, like name@example.com.');
    }

    if(firstBad){
      firstBad.focus();
      firstBad.scrollIntoView({block:'center',behavior:'smooth'});
    }
    return ok;
  }

  function banner(msg){
    var box=form.querySelector('.form-error-banner');
    if(!box){
      box=document.createElement('div');
      box.className='form-error-banner';
      var btn=form.querySelector('button[type="submit"]');
      form.insertBefore(box,btn||null);
    }
    box.textContent=msg;
    box.scrollIntoView({block:'center',behavior:'smooth'});
  }

  form.addEventListener('submit',function(e){
    e.preventDefault();
    if(!validate())return;

    var btn=form.querySelector('button[type="submit"]'),
        label=btn?btn.textContent:'';
    if(btn){btn.disabled=true;btn.textContent='Sending...';}

    var old=form.querySelector('.form-error-banner');
    if(old)old.parentNode.removeChild(old);

    fetch(form.action,{
      method:'POST',
      body:new FormData(form),
      headers:{'Accept':'application/json'}
    }).then(function(res){
      if(!res.ok)throw new Error('bad-response');
      window.location.href=new URL(THANK_YOU,window.location.href).href;
    }).catch(function(){
      if(btn){btn.disabled=false;btn.textContent=label;}
      banner('Something went wrong sending your request. Please try again, or call us directly and we will take care of it.');
    });
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