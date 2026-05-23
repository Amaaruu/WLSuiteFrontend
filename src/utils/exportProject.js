let jsZipPromise = null;

function loadJSZip() {
  if (jsZipPromise) return jsZipPromise;

  jsZipPromise = new Promise(function (resolve, reject) {
    if (window.JSZip) { resolve(window.JSZip); return; }
    const script   = document.createElement('script');
    script.src     = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    script.onload  = function () {
      if (window.JSZip) {
        resolve(window.JSZip);
      } else {
        jsZipPromise = null;
        reject(new Error('JSZip no se cargó correctamente desde CDN.'));
      }
    };
    script.onerror = function () {
      jsZipPromise = null;
      reject(new Error('No se pudo cargar JSZip. Verifica tu conexión a internet.'));
    };
    document.head.appendChild(script);
  });

  return jsZipPromise;
}

async function fetchImageAsBlob(url) {
  if (!url) return null;
  try {
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-store',
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = await response.blob();
    if (!blob || blob.size === 0) throw new Error('Blob vacío');
    const ext = getImageExtension(url, blob);
    return { blob, ext };
  } catch (err) {
    console.warn(`[exportProject] No se pudo descargar imagen como blob: ${url}`, err.message);
    return null;
  }
}

// ── Helper: deduce extensión desde blob MIME type o URL ──────────────────────
function getImageExtension(url, blob) {
  if (blob?.type) {
    const mimeMap = {
      'image/jpeg': 'jpg',
      'image/jpg':  'jpg',
      'image/png':  'png',
      'image/webp': 'webp',
      'image/gif':  'gif',
    };
    if (mimeMap[blob.type]) return mimeMap[blob.type];
  }
  const match = (url || '').split('?')[0].match(/\.(\w+)$/);
  return match ? match[1].toLowerCase() : 'jpg';
}

// ── Helpers de color ──────────────────────────────────────────────────────────
function getButtonRadius(shape) {
  const map = { cuadrado: '4px', redondeado: '10px', pildora: '9999px' };
  return map[shape] || '10px';
}

function hexLighten(hex, amount = 0.88) {
  if (!hex || typeof hex !== 'string' || hex.length < 7) return '#ffffff';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return '#ffffff';
  const lr = Math.round(r + (255 - r) * amount);
  const lg = Math.round(g + (255 - g) * amount);
  const lb = Math.round(b + (255 - b) * amount);
  return `#${lr.toString(16).padStart(2, '0')}${lg.toString(16).padStart(2, '0')}${lb.toString(16).padStart(2, '0')}`;
}

function hexDarken(hex, amount = 0.2) {
  if (!hex || typeof hex !== 'string' || hex.length < 7) return '#000000';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return '#000000';
  const dr = Math.round(r * (1 - amount));
  const dg = Math.round(g * (1 - amount));
  const db = Math.round(b * (1 - amount));
  return `#${dr.toString(16).padStart(2, '0')}${dg.toString(16).padStart(2, '0')}${db.toString(16).padStart(2, '0')}`;
}

// ── generateIndexHTML ─────────────────────────────────────────────────────────
export function generateIndexHTML(landingData, theme, projectName, images = {}) {
  const { heroImageUrl = null, logoImageUrl = null } = images;

  // ── Hero ──────────────────────────────────────────────────────────────────
  const heroHTML = landingData.hero ? `
  <header class="hero" id="inicio">
    <div class="hero__bg-decoration" aria-hidden="true"></div>
    ${heroImageUrl ? `
    <div class="hero__image-wrapper" aria-hidden="true">
      <img
        src="${heroImageUrl}"
        alt="Imagen principal de ${projectName}"
        class="hero__image"
        loading="eager"
      />
    </div>` : ''}
    <div class="container hero__content">
      ${logoImageUrl ? `
      <div class="hero__logo">
        <img
          src="${logoImageUrl}"
          alt="Logo de ${projectName}"
          class="hero__logo-img"
          loading="eager"
        />
      </div>` : ''}
      <span class="hero__badge">${projectName}</span>
      <h1 class="hero__headline">${landingData.hero.headline || ''}</h1>
      <p class="hero__subheadline">${landingData.hero.subheadline || ''}</p>
      <div class="hero__actions">
        ${landingData.hero.ctaButton    ? `<a href="#contacto" class="btn btn--primary btn--lg">${landingData.hero.ctaButton}</a>` : ''}
        ${landingData.hero.secondaryCta ? `<a href="#contacto" class="btn btn--ghost   btn--lg">${landingData.hero.secondaryCta}</a>` : ''}
      </div>
      ${landingData.hero.supportingText ? `<p class="hero__supporting">${landingData.hero.supportingText}</p>` : ''}
    </div>
    <div class="hero__wave" aria-hidden="true">
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z" fill="var(--bg-secondary)"/>
      </svg>
    </div>
  </header>` : '';

  // ── Features ──────────────────────────────────────────────────────────────
  const featuresHTML = landingData.features?.length ? `
  <section class="features section" id="caracteristicas">
    <div class="container">
      <div class="section__header" data-animate>
        <span class="badge">Características</span>
        <h2 class="section__title">Por qué elegirnos</h2>
      </div>
      <div class="features__grid">
        ${landingData.features.map((f, i) => `
        <article class="feature-card" data-animate data-delay="${i * 100}">
          <div class="feature-card__number" aria-hidden="true">${i + 1}</div>
          <h3 class="feature-card__title">${f.title || ''}</h3>
          <p class="feature-card__desc">${f.description || ''}</p>
        </article>`).join('')}
      </div>
    </div>
  </section>` : '';

  // ── Testimonials ──────────────────────────────────────────────────────────
  const testimonialsData = landingData.testimonials ||
    landingData.socialProof?.testimonials || [];

  const testimonialsHTML = testimonialsData.length ? `
  <section class="testimonials section section--alt" id="testimonios">
    <div class="container">
      <div class="section__header" data-animate>
        <span class="badge">Testimonios</span>
        <h2 class="section__title">Lo que dicen nuestros clientes</h2>
      </div>
      <div class="testimonials__grid">
        ${testimonialsData.map((t, i) => `
        <article class="testimonial-card" data-animate data-delay="${i * 100}">
          <div class="testimonial-card__stars" aria-label="5 estrellas">★★★★★</div>
          <blockquote class="testimonial-card__quote">"${t.quote || ''}"</blockquote>
          <footer class="testimonial-card__author">
            <div class="testimonial-card__avatar" aria-hidden="true">${(t.name || 'U')[0].toUpperCase()}</div>
            <div>
              <cite class="testimonial-card__name">${t.name || ''}</cite>
              ${t.role ? `<p class="testimonial-card__role">${t.role}</p>` : ''}
            </div>
          </footer>
        </article>`).join('')}
      </div>
    </div>
  </section>` : '';

  // ── FAQ ───────────────────────────────────────────────────────────────────
  const faqItems = landingData.faq?.items ||
    (Array.isArray(landingData.faq) ? landingData.faq : []);

  const faqHTML = faqItems.length ? `
  <section class="faq section" id="faq">
    <div class="container container--narrow">
      <div class="section__header" data-animate>
        <span class="badge">Preguntas frecuentes</span>
        <h2 class="section__title">${landingData.faq?.title || 'FAQ'}</h2>
        ${landingData.faq?.subtitle ? `<p class="section__subtitle">${landingData.faq.subtitle}</p>` : ''}
      </div>
      <div class="faq__list">
        ${faqItems.map((item, i) => `
        <div class="faq__item" data-animate data-delay="${i * 80}">
          <button class="faq__question" aria-expanded="false" aria-controls="faq-answer-${i}">
            <span>${item.question || ''}</span>
            <span class="faq__icon" aria-hidden="true">+</span>
          </button>
          <div class="faq__answer" id="faq-answer-${i}" hidden>
            <p>${item.answer || ''}</p>
          </div>
        </div>`).join('')}
      </div>
    </div>
  </section>` : '';

  // ── Pricing ───────────────────────────────────────────────────────────────
  const pricingData = Array.isArray(landingData.pricing)
    ? landingData.pricing
    : (landingData.pricing?.plans || []);

  const pricingHTML = pricingData.length ? `
  <section class="pricing section section--alt" id="precios">
    <div class="container">
      <div class="section__header" data-animate>
        <span class="badge">Precios</span>
        <h2 class="section__title">${landingData.pricing?.title || 'Nuestros planes'}</h2>
        ${landingData.pricing?.subtitle ? `<p class="section__subtitle">${landingData.pricing.subtitle}</p>` : ''}
      </div>
      <div class="pricing__grid">
        ${pricingData.map((plan, i) => {
          const isFeatured = plan.featured || i === 1;
          const name     = plan.name || plan.planName || '';
          const price    = plan.price || '';
          const period   = plan.period || '';
          const benefits = plan.benefits || [];
          return `
        <article class="pricing-card${isFeatured ? ' pricing-card--featured' : ''}" data-animate data-delay="${i * 100}">
          ${isFeatured ? '<div class="pricing-card__badge">MÁS POPULAR</div>' : ''}
          <h3 class="pricing-card__name">${name}</h3>
          <div class="pricing-card__price">${price}</div>
          ${period ? `<p class="pricing-card__period">${period}</p>` : ''}
          <ul class="pricing-card__benefits">
            ${benefits.map(b => `<li><span aria-hidden="true">✓</span>${b}</li>`).join('')}
          </ul>
          <a href="#contacto" class="btn ${isFeatured ? 'btn--white' : 'btn--primary'} btn--block">Comenzar ahora</a>
        </article>`;
        }).join('')}
      </div>
    </div>
  </section>` : '';

  // ── Urgency ───────────────────────────────────────────────────────────────
  const urgencyHTML = landingData.urgency ? `
  <section class="urgency" id="oferta">
    <div class="container urgency__content" data-animate>
      <h2 class="urgency__title">${landingData.urgency.title || ''}</h2>
      ${landingData.urgency.countdown ? `<p class="urgency__countdown">⏱ ${landingData.urgency.countdown}</p>` : ''}
      ${landingData.urgency.ctaButton ? `<a href="#contacto" class="btn btn--white btn--lg">${landingData.urgency.ctaButton}</a>` : ''}
    </div>
  </section>` : '';

  // ── Footer ────────────────────────────────────────────────────────────────
  const footerHTML = landingData.footer ? `
  <footer class="footer" id="contacto">
    <div class="container footer__content">
      ${logoImageUrl
        ? `<div class="footer__logo">
             <img src="${logoImageUrl}" alt="Logo de ${projectName}" class="footer__logo-img" loading="lazy" />
           </div>`
        : `<p class="footer__brand">${projectName}</p>`
      }
      ${landingData.footer.tagline  ? `<p class="footer__tagline">${landingData.footer.tagline}</p>`          : ''}
      ${landingData.footer.contact  ? `<a href="mailto:${landingData.footer.contact}" class="footer__email">${landingData.footer.contact}</a>` : ''}
      ${landingData.footer.phone    ? `<p class="footer__phone">${landingData.footer.phone}</p>`              : ''}
      ${landingData.footer.legalText ? `<p class="footer__copy">&copy; ${new Date().getFullYear()} ${projectName}. ${landingData.footer.legalText}</p>` : `<p class="footer__copy">&copy; ${new Date().getFullYear()} ${projectName}. Todos los derechos reservados.</p>`}
    </div>
  </footer>` : '';

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${landingData.hero?.subheadline || projectName}" />
  <title>${projectName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="${theme.fontImport}" rel="stylesheet" />
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
${heroHTML}
${featuresHTML}
${testimonialsHTML}
${faqHTML}
${pricingHTML}
${urgencyHTML}
${footerHTML}
  <script src="script.js"></script>
</body>
</html>`;
}

// ── generateStylesCSS ─────────────────────────────────────────────────────────
export function generateStylesCSS(theme, images = {}) {
  const btnRadius    = getButtonRadius(theme.buttonShape);
  const primaryLight = hexLighten(theme.primaryColor, 0.88);
  const primaryDark  = hexDarken(theme.primaryColor, 0.2);

  const heroImageStyles = images.heroImageUrl ? `
/* ── Hero con imagen de fondo ── */
.hero__image-wrapper {
  position: absolute; inset: 0; z-index: 0; overflow: hidden;
}
.hero__image {
  width: 100%; height: 100%; object-fit: cover; object-position: center; display: block;
}
.hero__image-wrapper::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(145deg, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.38) 100%);
}
.hero__bg-decoration { z-index: 1; }
.hero__content { z-index: 2; position: relative; }
.hero__wave    { z-index: 2; }
` : '';

  const logoStyles = images.logoImageUrl ? `
/* ── Logo ── */
.hero__logo { display: flex; justify-content: center; margin-bottom: 24px; }
.hero__logo-img {
  height: 64px; width: auto; max-width: 240px;
  object-fit: contain;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));
}
.footer__logo { display: flex; justify-content: center; margin-bottom: 8px; }
.footer__logo-img {
  height: 48px; width: auto; max-width: 180px;
  object-fit: contain;
  filter: brightness(0) invert(1);
  opacity: 0.8;
}
@media (max-width: 768px) {
  .hero__logo-img { height: 48px; }
}
` : '';

  return `
:root {
  --color-primary:        ${theme.primaryColor};
  --color-primary-dark:   ${primaryDark};
  --color-primary-light:  ${primaryLight};
  --color-primary-text:   ${theme.primaryText};
  --color-secondary:      ${theme.secondaryColor};
  --color-secondary-text: ${theme.secondaryText};
  --bg-primary:    ${theme.bgPrimary};
  --bg-secondary:  ${theme.bgSecondary};
  --text-base:     ${theme.textBase};
  --text-muted:    ${theme.textMuted};
  --card-bg:       ${theme.cardBg};
  --card-border:   ${theme.cardBorder};
  --font-family:   ${theme.fontFamily};
  --btn-radius:    ${btnRadius};
  --section-py:    clamp(64px, 8vw, 96px);
  --container:     1140px;
  --container-narrow: 760px;
  --shadow-sm:  0 2px 16px rgba(0, 0, 0, 0.06);
  --shadow-md:  0 8px 32px rgba(0, 0, 0, 0.12);
  --shadow-lg:  0 20px 48px rgba(0, 0, 0, 0.16);
  --transition: 0.25s ease;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; font-size: 16px; }
body {
  font-family: var(--font-family);
  background-color: var(--bg-primary);
  color: var(--text-base);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
img, video { max-width: 100%; height: auto; display: block; }
a { color: inherit; text-decoration: none; }
ul { list-style: none; }
button { font-family: inherit; cursor: pointer; }

.container        { width: 100%; max-width: var(--container); margin-inline: auto; padding-inline: 24px; }
.container--narrow { max-width: var(--container-narrow); }

/* ── Buttons ── */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 14px 32px; border-radius: var(--btn-radius); font-weight: 700; font-size: 1rem;
  letter-spacing: -0.01em; border: 2px solid transparent;
  transition: filter var(--transition), transform var(--transition), box-shadow var(--transition);
  white-space: nowrap; cursor: pointer;
}
.btn:hover { filter: brightness(0.92); transform: translateY(-2px); box-shadow: var(--shadow-md); }
.btn:active { transform: translateY(0); }
.btn--primary { background-color: var(--color-primary); color: var(--color-primary-text); border-color: var(--color-primary); }
.btn--ghost   { background-color: transparent; color: rgba(255,255,255,0.85); border-color: rgba(255,255,255,0.35); }
.btn--ghost:hover { background-color: rgba(255,255,255,0.1); }
.btn--white   { background-color: #ffffff; color: var(--color-primary); border-color: #ffffff; }
.btn--lg      { padding: 16px 40px; font-size: 1.05rem; }
.btn--block   { width: 100%; }

/* ── Badge ── */
.badge {
  display: inline-block; padding: 4px 14px;
  background-color: var(--color-primary-light); color: var(--color-primary);
  border-radius: 9999px; font-size: 0.72rem; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 16px;
}

/* ── Sections ── */
.section         { padding-block: var(--section-py); }
.section--alt    { background-color: var(--bg-secondary); }
.section__header { text-align: center; margin-bottom: 56px; }
.section__title  { font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 800; color: var(--text-base); letter-spacing: -0.02em; line-height: 1.15; }
.section__subtitle { margin-top: 16px; font-size: 1.05rem; color: var(--text-muted); }

/* ── Hero ── */
.hero {
  position: relative;
  padding-block: clamp(80px, 12vw, 140px) clamp(80px, 10vw, 120px);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  text-align: center; overflow: hidden;
}
.hero__bg-decoration {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 60% 80% at 20% 40%, rgba(255,255,255,0.07) 0%, transparent 70%),
    radial-gradient(ellipse 50% 60% at 80% 60%, rgba(255,255,255,0.04) 0%, transparent 70%);
  pointer-events: none;
}
.hero__content  { position: relative; z-index: 1; }
.hero__badge    {
  display: inline-flex; align-items: center; gap: 8px; padding: 6px 18px;
  background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2);
  border-radius: 9999px; color: rgba(255,255,255,0.9); font-size: 0.72rem;
  font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 28px;
}
.hero__headline    { font-size: clamp(2.4rem, 6vw, 4.8rem); font-weight: 900; color: #ffffff; line-height: 1.05; letter-spacing: -0.03em; margin-bottom: 24px; }
.hero__subheadline { font-size: clamp(1rem, 2.5vw, 1.3rem); color: rgba(255,255,255,0.78); max-width: 620px; margin-inline: auto; margin-bottom: 40px; line-height: 1.75; }
.hero__actions     { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-bottom: 20px; }
.hero__supporting  { font-size: 0.85rem; color: rgba(255,255,255,0.5); margin-top: 8px; }
.hero__wave        { position: absolute; bottom: -2px; left: 0; right: 0; height: 60px; overflow: hidden; }
.hero__wave svg    { width: 100%; height: 100%; }

${heroImageStyles}
${logoStyles}

/* ── Features ── */
.features__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
.feature-card {
  background: var(--card-bg); border: 1px solid var(--card-border);
  border-radius: 20px; padding: 36px 32px; box-shadow: var(--shadow-sm);
  transition: transform var(--transition), box-shadow var(--transition);
}
.feature-card:hover  { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
.feature-card__number {
  width: 52px; height: 52px; background: var(--color-primary-light);
  border-radius: 14px; display: flex; align-items: center; justify-content: center;
  font-size: 1.4rem; font-weight: 900; color: var(--color-primary); margin-bottom: 24px;
}
.feature-card__title { font-size: 1.1rem; font-weight: 700; color: var(--text-base); margin-bottom: 12px; }
.feature-card__desc  { font-size: 0.93rem; color: var(--text-muted); line-height: 1.75; }

/* ── Testimonials ── */
.testimonials__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
.testimonial-card {
  background: var(--card-bg); border: 1px solid var(--card-border);
  border-radius: 20px; padding: 36px; box-shadow: var(--shadow-sm);
  transition: transform var(--transition), box-shadow var(--transition);
}
.testimonial-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
.testimonial-card__stars  { color: #f59e0b; font-size: 1rem; letter-spacing: 2px; margin-bottom: 20px; }
.testimonial-card__quote  {
  font-size: 0.97rem; color: var(--text-base); line-height: 1.8; font-style: italic;
  border-left: 3px solid var(--color-primary); padding-left: 16px; margin-bottom: 28px;
}
.testimonial-card__author { display: flex; align-items: center; gap: 12px; }
.testimonial-card__avatar {
  width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-weight: 800; font-size: 1rem;
}
.testimonial-card__name { font-weight: 700; color: var(--text-base); font-size: 0.9rem; font-style: normal; display: block; }
.testimonial-card__role { color: var(--text-muted); font-size: 0.8rem; margin-top: 2px; }

/* ── FAQ ── */
.faq__list { display: flex; flex-direction: column; gap: 8px; }
.faq__item {
  background: var(--card-bg); border: 1px solid var(--card-border);
  border-radius: 14px; overflow: hidden; transition: border-color var(--transition);
}
.faq__item.is-open { border-color: var(--color-primary); }
.faq__question {
  width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 16px;
  padding: 20px 24px; background: transparent; border: none; text-align: left;
  font-size: 0.97rem; font-weight: 700; color: var(--text-base); line-height: 1.4; cursor: pointer;
}
.faq__icon {
  flex-shrink: 0; width: 28px; height: 28px; border-radius: 50%;
  background: var(--color-primary-light); color: var(--color-primary);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; font-weight: 700;
  transition: transform var(--transition), background var(--transition), color var(--transition);
}
.faq__item.is-open .faq__icon { transform: rotate(45deg); background: var(--color-primary); color: var(--color-primary-text); }
.faq__answer         { padding: 0 24px 20px; font-size: 0.93rem; color: var(--text-muted); line-height: 1.75; }
.faq__answer[hidden] { display: none; }

/* ── Pricing ── */
.pricing__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; align-items: start; }
.pricing-card {
  position: relative; background: var(--card-bg); border: 1px solid var(--card-border);
  border-radius: 24px; padding: 40px 32px; box-shadow: var(--shadow-sm);
  transition: transform var(--transition), box-shadow var(--transition);
}
.pricing-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
.pricing-card--featured {
  background: var(--color-primary); border: 2px solid var(--color-primary);
  box-shadow: 0 20px 48px rgba(0,0,0,0.2); transform: scale(1.03);
}
.pricing-card--featured:hover { transform: scale(1.03) translateY(-4px); }
.pricing-card__badge {
  position: absolute; top: -14px; left: 50%; transform: translateX(-50%);
  background: var(--color-secondary); color: var(--color-secondary-text);
  padding: 4px 18px; border-radius: 9999px; font-size: 0.7rem; font-weight: 800;
  white-space: nowrap; letter-spacing: 0.05em;
}
.pricing-card__name             { font-size: 1.15rem; font-weight: 700; color: var(--text-base); margin-bottom: 8px; }
.pricing-card--featured .pricing-card__name  { color: #ffffff; }
.pricing-card__price            { font-size: 2.8rem; font-weight: 900; color: var(--color-primary); letter-spacing: -0.04em; margin-block: 16px 4px; }
.pricing-card--featured .pricing-card__price { color: #ffffff; }
.pricing-card__period           { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 28px; }
.pricing-card--featured .pricing-card__period { color: rgba(255,255,255,0.65); }
.pricing-card__benefits         { margin-bottom: 32px; }
.pricing-card__benefits li      { display: flex; align-items: flex-start; gap: 10px; padding-block: 10px; font-size: 0.9rem; color: var(--text-base); border-bottom: 1px solid var(--card-border); }
.pricing-card--featured .pricing-card__benefits li { color: rgba(255,255,255,0.9); border-bottom-color: rgba(255,255,255,0.12); }
.pricing-card__benefits li span { color: var(--color-primary); font-weight: 700; flex-shrink: 0; }
.pricing-card--featured .pricing-card__benefits li span { color: #ffffff; }

/* ── Urgency ── */
.urgency {
  position: relative; padding-block: clamp(60px, 8vw, 80px);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  text-align: center; overflow: hidden;
}
.urgency::before {
  content: ''; position: absolute; inset: 0;
  background:
    radial-gradient(circle at 20% 50%, rgba(255,255,255,0.06) 0%, transparent 50%),
    radial-gradient(circle at 80% 50%, rgba(255,255,255,0.04) 0%, transparent 50%);
  pointer-events: none;
}
.urgency__content  { position: relative; z-index: 1; max-width: 700px; }
.urgency__title    { font-size: clamp(1.8rem, 4vw, 3rem); font-weight: 900; color: #ffffff; letter-spacing: -0.02em; margin-bottom: 16px; }
.urgency__countdown { font-size: 1.1rem; color: rgba(255,255,255,0.75); margin-bottom: 32px; }

/* ── Footer ── */
.footer          { background: #0f172a; padding-block: clamp(48px, 6vw, 72px); text-align: center; }
.footer__content { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.footer__brand   { font-size: 1.5rem; font-weight: 900; color: #ffffff; letter-spacing: -0.02em; }
.footer__tagline { color: #94a3b8; font-size: 0.95rem; }
.footer__email   { color: var(--color-secondary); font-weight: 600; font-size: 0.95rem; transition: opacity var(--transition); }
.footer__email:hover { opacity: 0.8; }
.footer__phone   { color: #6b7280; font-size: 0.9rem; }
.footer__copy    { color: #475569; font-size: 0.8rem; margin-top: 20px; }

/* ── Scroll animations ── */
[data-animate] { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
[data-animate].is-visible { opacity: 1; transform: translateY(0); }

/* ── Responsive ── */
@media (max-width: 768px) {
  .hero__actions { flex-direction: column; align-items: center; }
  .btn--lg { width: 100%; max-width: 320px; }
  .features__grid, .testimonials__grid, .pricing__grid { grid-template-columns: 1fr; }
  .pricing-card--featured { transform: scale(1); }
  .pricing-card--featured:hover { transform: translateY(-4px); }
}
@media (max-width: 480px) {
  .hero__headline { font-size: 2.2rem; }
  .section__title { font-size: 1.8rem; }
  .feature-card, .testimonial-card, .pricing-card { padding: 28px 20px; }
  .faq__question { padding: 16px 20px; }
}
`;
}

// ── generateScriptJS ──────────────────────────────────────────────────────────
export function generateScriptJS() {
  return `(function () {
  'use strict';

  function initFAQ() {
    var items = document.querySelectorAll('.faq__item');
    items.forEach(function (item) {
      var btn    = item.querySelector('.faq__question');
      var answer = item.querySelector('.faq__answer');
      if (!btn || !answer) return;
      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');
        items.forEach(function (other) {
          if (other !== item) {
            other.classList.remove('is-open');
            var ob = other.querySelector('.faq__question');
            var oa = other.querySelector('.faq__answer');
            if (ob) ob.setAttribute('aria-expanded', 'false');
            if (oa) oa.hidden = true;
          }
        });
        item.classList.toggle('is-open', !isOpen);
        btn.setAttribute('aria-expanded', String(!isOpen));
        answer.hidden = isOpen;
      });
    });
  }

  function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-animate]').forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el    = entry.target;
        var delay = parseInt(el.dataset.delay || '0', 10);
        setTimeout(function () { el.classList.add('is-visible'); }, delay);
        observer.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('[data-animate]').forEach(function (el) {
      observer.observe(el);
    });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        var target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initFAQ();
    initScrollAnimations();
    initSmoothScroll();
  });

}());`;
}

// ── generateREADME ────────────────────────────────────────────────────────────
function generateREADME(projectName, theme) {
  return `# ${projectName} — Landing Page

Generado por WebLanding Suite el ${new Date().toLocaleDateString('es-CL')}.

## Estructura del proyecto

\`\`\`
${projectName.toLowerCase().replace(/\s+/g, '-')}/
├── index.html
├── styles.css
├── script.js
└── assets/
    ├── hero-image.jpg   (imagen del hero, si fue subida)
    ├── logo.png         (logo del negocio, si fue subido)
    └── README.md
\`\`\`

## Cómo usar

Abre index.html directamente en tu navegador. No necesita servidor.

Para publicar, sube todos los archivos y la carpeta assets a tu hosting estático:
- Netlify: arrastra la carpeta a app.netlify.com/drop
- GitHub Pages: sube el repositorio y activa Pages
- cPanel: sube por FTP al directorio public_html

## Personalización

Edita las variables CSS en styles.css bajo :root { ... }

## Tecnologías

- HTML5 semántico con accesibilidad básica
- CSS3 con custom properties (variables nativas)
- JavaScript ES5 vanilla, sin dependencias externas
- Google Fonts

Generado el ${new Date().toLocaleDateString('es-CL')}.
`;
}

// ── generateAndDownloadZip ────────────────────────────────────────────────────
export async function generateAndDownloadZip(landingData, theme, projectName, designPreferences = {}) {
  const JSZip = await loadJSZip();
  const slug  = (projectName || 'landing-page').toLowerCase().replace(/\s+/g, '-');
  const zip   = new JSZip();
  const rootFolder   = zip.folder(slug);
  const assetsFolder = rootFolder.folder('assets');

  const heroImageUrlOriginal = designPreferences?.heroImageUrl || null;
  const logoImageUrlOriginal = designPreferences?.logoImageUrl || null;

  const images = {
    heroImageUrl: null,
    logoImageUrl: null,
    heroExt: 'jpg',
    logoExt: 'png',
  };

  // ── Descarga hero image ───────────────────────────────────────────────────
  if (heroImageUrlOriginal) {
    const result = await fetchImageAsBlob(heroImageUrlOriginal);
    if (result) {
      images.heroExt      = result.ext;
      images.heroImageUrl = `assets/hero-image.${result.ext}`;
      assetsFolder.file(`hero-image.${result.ext}`, result.blob);
      console.info(`[exportProject] Hero image incluida como archivo local: assets/hero-image.${result.ext}`);
    } else {
      images.heroImageUrl = heroImageUrlOriginal;
      console.warn('[exportProject] Hero image incluida como URL externa (fallback CORS).');
    }
  }

  // ── Descarga logo ─────────────────────────────────────────────────────────
  if (logoImageUrlOriginal) {
    const result = await fetchImageAsBlob(logoImageUrlOriginal);
    if (result) {
      images.logoExt      = result.ext;
      images.logoImageUrl = `assets/logo.${result.ext}`;
      assetsFolder.file(`logo.${result.ext}`, result.blob);
      console.info(`[exportProject] Logo incluido como archivo local: assets/logo.${result.ext}`);
    } else {
      images.logoImageUrl = logoImageUrlOriginal;
      console.warn('[exportProject] Logo incluido como URL externa (fallback CORS).');
    }
  }

  // ── Generación de archivos ────────────────────────────────────────────────
  assetsFolder.file('README.md', generateREADME(projectName, theme));
  rootFolder.file('index.html', generateIndexHTML(landingData, theme, projectName, images));
  rootFolder.file('styles.css', generateStylesCSS(theme, images));
  rootFolder.file('script.js',  generateScriptJS());

  // ── Descarga ──────────────────────────────────────────────────────────────
  const blob   = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
  const url    = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href     = url;
  anchor.download = `${slug}-proyecto.zip`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}