/* ============================================================
   Balneário Paraíso Tropical — main.js
   ============================================================ */

/* ===== Abertura: águia desliza da direita e pousa na logo ===== */
const intro = document.getElementById('intro');
let introTimers = [];

function endIntro(){
  introTimers.forEach(clearTimeout);
  intro.classList.add('done');
  document.body.style.overflow = '';
}

(function runIntro(){
  /* modo de teste/acessibilidade: pula animações */
  if(location.search.includes('noanim') || matchMedia('(prefers-reduced-motion: reduce)').matches){
    intro.style.transition = 'none';
    intro.classList.add('done');
    document.documentElement.style.scrollBehavior = 'auto';
    document.querySelectorAll('.rv').forEach(el => el.classList.add('vis'));
    if(location.hash){
      const alvo = document.querySelector(location.hash);
      if(alvo) requestAnimationFrame(() => alvo.scrollIntoView());
    }
    return;
  }
  document.body.style.overflow = 'hidden';
  /* águia atravessa a tela (tamanho final) e pousa no ponto dela na logo */
  introTimers.push(setTimeout(() => intro.classList.add('fly-in'), 300));
  /* pousou (300 + 1700ms): o restante da logo surge em fade-in por baixo */
  introTimers.push(setTimeout(() => intro.classList.add('logo-in'), 2050));
  /* fim da abertura (águia sai junto com a tela inteira) */
  introTimers.push(setTimeout(endIntro, 4600));
})();

/* ===== Hero mobile: um vídeo por vez, rodízio entre os 3 ===== */
(function(){
  const wraps = [...document.querySelectorAll('.hero-videos .vwrap')];
  if(!wraps.length) return;
  const mq = matchMedia('(max-width:720px)');
  let atual = 0;

  function aplicar(){
    wraps.forEach((w, x) => {
      const on = x === atual;
      w.classList.toggle('m-on', on);
      const v = w.querySelector('video');
      if(mq.matches){
        if(on) v.play().catch(() => {});
        else v.pause();
      } else {
        w.classList.remove('m-on');
        v.play().catch(() => {});
      }
    });
    if(mq.matches) wraps[atual].classList.add('m-on');
  }

  setInterval(() => {
    if(!mq.matches) return;
    atual = (atual + 1) % wraps.length;
    aplicar();
  }, 8000);

  mq.addEventListener('change', aplicar);
  aplicar();
})();

/* ===== Header ao rolar ===== */
const topbar = document.getElementById('topbar');
addEventListener('scroll', () => topbar.classList.toggle('scrolled', scrollY > 60), {passive:true});

/* ===== Reveal ao rolar ===== */
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if(e.isIntersecting){ e.target.classList.add('vis'); io.unobserve(e.target); }
}), {threshold:.12});
document.querySelectorAll('.rv').forEach(el => io.observe(el));

/* ===== Galerias de fotos (navegação interna) =====
   Cada <img> vira um slide com a foto INTEIRA (contain) sobre um
   fundo desfocado da própria foto — nada fica cortado. */
document.querySelectorAll('[data-gal]').forEach(gal => {
  const imgs = [...gal.querySelectorAll('img')];
  const dotsBox = gal.querySelector('.gal-dots');
  const countBox = gal.querySelector('.gal-count');
  let i = 0;

  const slides = imgs.map(im => {
    const slide = document.createElement('div');
    slide.className = 'gslide' + (im.classList.contains('on') ? ' on' : '');
    const bg = im.cloneNode();
    bg.className = 'gbg';
    bg.alt = '';
    bg.setAttribute('aria-hidden', 'true');
    im.classList.remove('on');
    im.className = 'gfg';
    gal.insertBefore(slide, im);
    slide.appendChild(bg);
    slide.appendChild(im);
    return slide;
  });

  imgs.forEach((_, k) => {
    const d = document.createElement('i');
    if(k === 0) d.classList.add('on');
    d.onclick = e => { e.stopPropagation(); show(k); };
    dotsBox.appendChild(d);
  });
  const dots = [...dotsBox.children];

  function show(k){
    i = (k + imgs.length) % imgs.length;
    slides.forEach((s, x) => s.classList.toggle('on', x === i));
    dots.forEach((d, x) => d.classList.toggle('on', x === i));
    if(countBox) countBox.textContent = `${i+1} / ${imgs.length}`;
  }
  if(countBox) countBox.textContent = `1 / ${imgs.length}`;

  gal.querySelector('.gal-prev').onclick = e => { e.stopPropagation(); show(i-1); };
  gal.querySelector('.gal-next').onclick = e => { e.stopPropagation(); show(i+1); };

  /* clique na foto amplia no lightbox */
  imgs.forEach(im => im.addEventListener('click', () => {
    document.getElementById('lbImg').src = im.src;
    document.getElementById('lightbox').classList.add('open');
  }));
});

/* ===== Carrossel externo de hospedagens ===== */
const track = document.getElementById('hospTrack');
if(track){
  const total = track.children.length;
  const dotsBox2 = document.getElementById('hospDots');
  const hospTitle = document.getElementById('hospTitle');
  const hospCounter = document.getElementById('hospCounter');
  const hospPrevBtn = document.getElementById('hospPrev');
  const hospNextBtn = document.getElementById('hospNext');
  const nomes = [...track.children].map(s => s.dataset.nome || '');
  let cur = 0;

  if(dotsBox2){
    for(let k = 0; k < total; k++){
      const b = document.createElement('b');
      if(k === 0) b.classList.add('on');
      b.onclick = () => hospSet(k);
      dotsBox2.appendChild(b);
    }
  }

  function hospSet(k){
    cur = (k + total) % total;
    track.style.transform = `translateX(-${cur * 100}%)`;
    if(dotsBox2) [...dotsBox2.children].forEach((d, x) => d.classList.toggle('on', x === cur));
    if(hospTitle) hospTitle.textContent = nomes[cur];
    if(hospCounter) hospCounter.textContent = `${cur+1} / ${total}`;
  }
  function hospGo(dir){ hospSet(cur + dir); }
  if(hospPrevBtn) hospPrevBtn.onclick = () => hospGo(-1);
  if(hospNextBtn) hospNextBtn.onclick = () => hospGo(1);
  hospSet(0);
}

/* ===== Mosaico: ampliar imagens ===== */
document.querySelectorAll('.mosaic .tile img').forEach(im => im.addEventListener('click', () => {
  document.getElementById('lbImg').src = im.src;
  document.getElementById('lightbox').classList.add('open');
}));

/* ===== Lightbox: fechar ===== */
document.getElementById('lightbox').addEventListener('click', function(){ this.classList.remove('open'); });

/* ===== Form de reserva → WhatsApp (sem emojis, com quebras de linha) ===== */
const resForm = document.getElementById('resForm');
if(resForm){
  resForm.addEventListener('submit', e => {
    e.preventDefault();
    const nome = document.getElementById('fNome').value.trim();
    const qtd  = document.getElementById('fQtd').value;
    const data = document.getElementById('fData').value;
    const tipo = document.getElementById('fTipo').value;

    let msg = 'Ola! Me chamo ' + nome + ' e gostaria de fazer uma reserva no Paraiso Tropical.\n';
    msg += '\nQuantidade de pessoas: ' + qtd;
    if(data){
      const [a, m, d] = data.split('-');
      msg += '\nData desejada: ' + d + '/' + m + '/' + a;
    }
    msg += '\nInteresse: ' + tipo;
    msg += '\n\nVim pelo site!';

    window.open('https://wa.me/5599984004665?text=' + encodeURIComponent(msg), '_blank');
  });
}

/* data mínima do campo de reserva = hoje */
(function(){
  const f = document.getElementById('fData');
  if(f) f.min = new Date().toISOString().split('T')[0];
})();

/* ===== Ano no rodapé ===== */
document.getElementById('anoAtual').textContent = new Date().getFullYear();

/* ===== Debug de layout (uso interno em testes) ===== */
if(location.search.includes('debug')){
  addEventListener('load', () => {
    const c = document.querySelector('.hero-content .container');
    document.title = `win:${innerWidth} scrollW:${document.documentElement.scrollWidth} container:${c.offsetWidth}`;
  });
}
