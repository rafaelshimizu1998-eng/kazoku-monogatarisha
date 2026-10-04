(function(){
  var $ = function(s){return document.querySelector(s);};

  requestAnimationFrame(function(){ setTimeout(function(){ document.body.classList.add('loaded'); }, 60); });

  var header = $('header'), bar = $('#progress'), cta = $('#stickyCta'), hero = $('.hero, .page-hero');
  function onScroll(){
    var y = window.scrollY, h = document.documentElement.scrollHeight - innerHeight;
    if(bar) bar.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    header.classList.toggle('scrolled', y > 20);
    if(cta && hero){
      var pastHero = y > hero.offsetHeight - 120;
      var atContact = $('#contact') && $('#contact').getBoundingClientRect().top < innerHeight * .8;
      cta.classList.toggle('show', pastHero && !atContact);
    }
  }
  addEventListener('scroll', onScroll, {passive:true}); onScroll();

  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:.15, rootMargin:'0px 0px -6% 0px'});
  document.querySelectorAll('.reveal,.steps').forEach(function(el){ io.observe(el); });
})();

/* contact form (Formspree) */
(function(){
  var f=document.querySelector('.cform'); if(!f) return;
  var st=f.querySelector('.cf-status'), btn=f.querySelector('.cf-submit'), purpose=f.querySelector('#cf-purpose');
  document.querySelectorAll('[data-purpose]').forEach(function(a){
    a.addEventListener('click',function(){ if(purpose) purpose.value=a.getAttribute('data-purpose'); });
  });
  f.addEventListener('submit',function(e){
    e.preventDefault();
    st.className='cf-status';
    if(!f.checkValidity()){
      var bad=f.querySelector(':invalid'); if(bad) bad.focus();
      st.textContent='必須の項目と、メールアドレスの形をご確認ください。'; st.classList.add('err'); return;
    }
    btn.disabled=true; st.textContent='送信しています…';
    fetch(f.action,{method:'POST',body:new FormData(f),headers:{'Accept':'application/json'}})
      .then(function(r){
        if(r.ok){ f.reset(); st.textContent='送信しました。ありがとうございます。2〜3日以内にメールでご返信します。'; st.classList.add('ok'); }
        else { throw 0; }
      })
      .catch(function(){ st.textContent='送信できませんでした。お手数ですが、下のメールアドレスへ直接ご連絡ください。'; st.classList.add('err'); })
      .finally(function(){ btn.disabled=false; });
  });
})();
