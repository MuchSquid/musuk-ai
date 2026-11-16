/* Musuk AI · medición GA4 (G-Z9DMF04YY6). Web ficticia para proyecto académico. */
(function(){
  var DEBUG = /[?&]debug=1/.test(location.search);
  function ev(name, params){
    params = params || {};
    if (typeof gtag === 'function') gtag('event', name, params);
  }
  window.musukEvent = ev;
  var page = document.body.getAttribute('data-page') || 'home';

  // CTA clics
  document.querySelectorAll('[data-cta]').forEach(function(el){
    el.addEventListener('click', function(){
      ev('cta_click', {cta_text: el.getAttribute('data-cta'), cta_location: page});
    });
  });
  // WhatsApp
  document.querySelectorAll('[data-wa]').forEach(function(el){
    el.addEventListener('click', function(){
      ev('click_whatsapp', {cta_location: page, servicio: el.getAttribute('data-wa')});
    });
  });
  // Vista de servicio
  if (page !== 'home' && page !== 'gracias') ev('view_service', {servicio: page});

  // Formulario
  var form = document.getElementById('lead-form');
  if (form){
    var started = false;
    form.addEventListener('focusin', function(){
      if (!started){ started = true; ev('lead_form_start', {form_id: 'diagnostico', cta_location: page}); }
    });
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var err = form.querySelector('.form-error');
      var data = new FormData(form);
      var ok = data.get('nombre') && data.get('empresa') && /.+@.+\..+/.test(data.get('email')||'') && data.get('servicio');
      if (!ok){ err.textContent = 'Completa nombre, empresa, correo y servicio.'; ev('lead_form_error', {cta_location: page}); return; }
      err.textContent = '';
      var tickets = {'automatizacion':25000,'software-a-medida':35000,'paginas-web':10000};
      var servicio = data.get('servicio');
      var btn = form.querySelector('button[type=submit]'); btn.disabled = true; btn.textContent = 'Enviando…';
      var go = function(){ location.href = (form.getAttribute('data-base')||'') + 'gracias/?servicio=' + encodeURIComponent(servicio) + (DEBUG?'&debug=1':''); };
      var done = false; var once = function(){ if(!done){ done = true; setTimeout(go, 400); } };
      ev('generate_lead', {
        form_id: 'diagnostico', servicio: servicio, tamano_empresa: data.get('tamano') || 'no_indica',
        cta_location: page, currency: 'PEN', value: Math.round((tickets[servicio]||10000)*0.04), event_callback: once, event_timeout: 1500
      });
      setTimeout(once, 1800);
    });
  }
  // Scroll 50% (además del 90% automático de la medición mejorada)
  var s50 = false;
  window.addEventListener('scroll', function(){
    if (s50) return;
    var h = document.documentElement; var p = (h.scrollTop + innerHeight) / h.scrollHeight;
    if (p >= 0.5){ s50 = true; ev('scroll_50', {cta_location: page}); }
  }, {passive: true});
  // FAQ
  document.querySelectorAll('.faq button').forEach(function(b){
    b.addEventListener('click', function(){
      var open = b.parentElement.classList.toggle('open');
      b.setAttribute('aria-expanded', open);
      if (open) ev('faq_open', {pregunta: b.textContent.trim().slice(0,80), cta_location: page});
    });
  });
})();
