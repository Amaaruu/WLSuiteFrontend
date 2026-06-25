let jsZipPromise = null;

export function __resetJSZipCache() {
  jsZipPromise = null;
}

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
    const response = await fetch(url, { method: 'GET', mode: 'cors', cache: 'no-store' });
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

function getImageExtension(url, blob) {
  if (blob?.type) {
    const mimeMap = { 'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };
    if (mimeMap[blob.type]) return mimeMap[blob.type];
  }
  const match = (url || '').split('?')[0].match(/\.(\w+)$/);
  return match ? match[1].toLowerCase() : 'jpg';
}

function getBtnRadius(shape) {
  return { cuadrado:'6px', redondeado:'12px', pildora:'9999px' }[shape] || '12px';
}

export function generateIndexHTML(landingData, theme, projectName, images = {}, inlineAssets = false) {
  const d = landingData;
  const { heroImageUrl = null, logoImageUrl = null } = images;
  const steps        = d.howItWorks?.steps || [];
  const testimonials = d.socialProof?.testimonials || d.testimonials || [];
  const stats        = d.socialProof?.stats || [];
  const pricingPlans = d.pricing?.plans || (Array.isArray(d.pricing) ? d.pricing : []);
  const faq          = d.faq?.items || d.faq || [];

  const navHTML = `
    <nav class="nav-floating">
      <span style="font-weight:800; color:${theme.textBase}; margin-right:8px;">${projectName}</span>
      ${d.hero ? `<a href="#hero">Inicio</a>` : ''}
      ${steps.length > 0 ? `<a href="#how">Cómo funciona</a>` : ''}
      ${testimonials.length > 0 ? `<a href="#testimonials">Clientes</a>` : ''}
      ${pricingPlans.length > 0 ? `<a href="#pricing">Precios</a>` : ''}
      ${faq.length > 0 ? `<a href="#faq">FAQ</a>` : ''}
      <a href="#contact" class="btn-primary" style="padding:8px 20px; font-size:0.82rem;">${d.hero?.ctaButton || 'Comenzar'}</a>
    </nav>
  `;

  const heroImageStyle = heroImageUrl
    ? `background: ${theme.isDark ? '#05050a' : '#0a0a1a'};`
    : `background: linear-gradient(145deg, ${theme.primaryColor} 0%, ${theme.primaryDark} 60%, ${theme.isDark ? '#0a0a0f' : theme.primaryDark} 100%);`;

  const heroHTML = d.hero ? `
    <section id="hero" class="hero-section" style="${heroImageStyle}">
      ${heroImageUrl ? `
        <div class="hero-img-overlay">
          <img src="${heroImageUrl}" alt="Imagen de ${projectName}" loading="eager" />
        </div>
      ` : `
        <div style="position:absolute; inset:0; pointer-events:none; overflow:hidden;">
          <div style="position:absolute; top:-20%; right:-10%; width:70%; height:140%; background:rgba(255,255,255,0.04); border-radius:50%; transform:rotate(-15deg);"></div>
          <div style="position:absolute; top:10%; left:-5%; width:50%; height:80%; background:rgba(255,255,255,0.03); border-radius:50%;"></div>
          <svg style="position:absolute; bottom:0; left:0; right:0;" viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M0,80 C480,0 960,0 1440,80 L1440,80 L0,80 Z" fill="${theme.bgPrimary}"></path>
          </svg>
        </div>
      `}
      <div class="container" style="position:relative; z-index:1;">
        ${logoImageUrl ? `
          <div class="sr text-center mb-28">
            <img src="${logoImageUrl}" alt="Logo de ${projectName}" style="max-height:72px; max-width:240px; object-fit:contain; display:inline-block; filter:drop-shadow(0 2px 12px rgba(0,0,0,0.35));" loading="eager" />
          </div>
        ` : ''}
        ${d.hero.badge ? `
          <div class="sr text-center mb-24"><span class="badge-white">${d.hero.badge}</span></div>
        ` : ''}
        <div class="sr sr-delay-1 text-center mb-24">
          <h1 class="hero-title">${d.hero.headline}</h1>
        </div>
        ${d.hero.subheadline ? `
          <div class="sr sr-delay-2 text-center mb-36">
            <p class="hero-subtitle">${d.hero.subheadline}</p>
          </div>
        ` : ''}
        <div class="sr sr-delay-3 cta-buttons flex-center gap-16 mb-28 wrap">
          <a href="#contact" class="btn-primary" style="background:#fff; color:${theme.primaryColor}; box-shadow:0 8px 32px rgba(0,0,0,0.2); font-size:1.1rem; padding:18px 40px; font-family:inherit; border-color:#fff;">${d.hero.ctaButton} &rarr;</a>
          ${d.hero.secondaryCta ? `<a href="#how" class="btn-ghost-white" style="font-family:inherit; font-size:1rem;">${d.hero.secondaryCta}</a>` : ''}
        </div>
        ${d.hero.trustIndicators?.length ? `
          <div class="sr sr-delay-4 trust-bar">
            ${d.hero.trustIndicators.map(t => `<span>${t}</span>`).join('')}
          </div>
        ` : ''}
        ${stats.length ? `
          <div class="sr sr-delay-5 stats-container grid-cols-${Math.min(stats.length, 3)}">
            ${stats.slice(0,3).map((s, i) => `
              <div class="stat-box ${i < stats.length-1 ? 'stat-box-border' : ''}">
                <div class="stat-number">${s.number}</div>
                <div class="stat-label">${s.label}</div>
                ${s.description ? `<div class="stat-desc">${s.description}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    </section>
  ` : '';

  const featuresHTML = d.features?.length ? `
    <section class="section-spacing bg-primary">
      <div class="container">
        <div class="text-center mb-64">
          <div class="sr section-tag flex-center">Características</div>
          <h2 class="sr sr-delay-1 section-title text-center">¿Por qué elegir ${projectName}?</h2>
          <p class="sr sr-delay-2 section-subtitle mt-16">Descubre todo lo que obtienes con nosotros</p>
        </div>
        <div class="features-grid" data-count="${d.features.length}">
          ${d.features.map((f, i) => `
            <div class="sr sr-delay-${(i%3)+1} card ${f.highlight ? 'feature-highlight' : ''}">
              <div class="feature-icon">${f.icon}</div>
              <h3 class="feature-title text-base">${f.title}</h3>
              <p class="feature-desc text-muted">${f.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  ` : '';

  const howItWorksHTML = steps.length ? `
    <section id="how" class="section-spacing bg-secondary">
      <div class="container">
        <div class="text-center mb-64">
          <div class="sr section-tag flex-center">Proceso</div>
          <h2 class="sr sr-delay-1 section-title text-center">${d.howItWorks?.title || '¿Cómo funciona?'}</h2>
          ${d.howItWorks?.subtitle ? `<p class="sr sr-delay-2 section-subtitle mt-16">${d.howItWorks.subtitle}</p>` : ''}
        </div>
        <div class="steps-grid grid-cols-${steps.length}">
          ${steps.length > 1 ? `<div class="steps-line"></div>` : ''}
          ${steps.map((s, i) => `
            <div class="sr sr-delay-${i+1} step-card">
              <div class="step-icon-wrap">
                <div class="step-number">${s.number}</div>
              </div>
              <h3 class="step-title text-base">${s.title}</h3>
              <p class="step-desc text-muted">${s.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  ` : '';

  const testimonialsHTML = testimonials.length ? `
    <section id="testimonials" class="section-spacing bg-primary">
      <div class="container">
        <div class="text-center mb-64">
          <div class="sr section-tag flex-center">Testimonios</div>
          <h2 class="sr sr-delay-1 section-title text-center">${d.socialProof?.title || 'Lo que dicen nuestros clientes'}</h2>
          ${d.socialProof?.subtitle ? `<p class="sr sr-delay-2 section-subtitle mt-16">${d.socialProof.subtitle}</p>` : ''}
        </div>
        <div class="testimonials-grid">
          ${testimonials.map((t, i) => `
            <div class="sr sr-delay-${(i%3)+1} card flex-col">
              <div class="stars mb-16">${'★'.repeat(t.rating || 5)}</div>
              <blockquote class="testimonial-quote text-base">"${t.quote}"</blockquote>
              <div class="testimonial-author">
                <div class="avatar">${(t.name||'U')[0].toUpperCase()}</div>
                <div>
                  <div class="testimonial-name text-base">${t.name}</div>
                  <div class="testimonial-role text-muted">${t.role}${t.company ? ` &middot; ${t.company}` : ''}</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  ` : '';

  const pricingHTML = pricingPlans.length ? `
    <section id="pricing" class="section-spacing bg-secondary">
      <div class="container">
        <div class="text-center mb-64">
          ${d.pricing?.badge ? `<div class="sr mb-12"><span class="badge">${d.pricing.badge}</span></div>` : ''}
          <div class="sr section-tag sr-delay-1 flex-center">Precios</div>
          <h2 class="sr sr-delay-2 section-title text-center">${d.pricing?.title || 'Elige tu plan'}</h2>
          ${d.pricing?.subtitle ? `<p class="sr sr-delay-3 section-subtitle mt-16">${d.pricing.subtitle}</p>` : ''}
        </div>
        <div class="pricing-grid grid-cols-${pricingPlans.length}">
          ${pricingPlans.map((plan, i) => plan.featured ? `
            <div class="sr sr-delay-${i+1} card-featured">
              ${plan.badge ? `<div style="position:absolute; top:-14px; left:50%; transform:translateX(-50%); background:#fff; color:${theme.primaryColor}; padding:4px 18px; border-radius:9999px; font-size:0.72rem; font-weight:800; white-space:nowrap; box-shadow:0 4px 12px rgba(0,0,0,0.15);">${plan.badge}</div>` : ''}
              <h3 class="pricing-name-featured">${plan.name}</h3>
              ${plan.description ? `<p class="pricing-desc-featured">${plan.description}</p>` : ''}
              <div class="pricing-price-featured">${plan.price}</div>
              ${plan.period ? `<p class="pricing-period-featured">${plan.period}</p>` : ''}
              <ul style="list-style:none; margin-bottom:32px;">
                ${(plan.benefits||[]).map(b => `<li style="display:flex; align-items:flex-start; gap:10px; padding:9px 0; font-size:0.9rem; color:rgba(255,255,255,0.9); border-bottom:1px solid rgba(255,255,255,0.1);"><span style="color:#fff; font-weight:700; flex-shrink:0; margin-top:1px;">✓</span>${b}</li>`).join('')}
              </ul>
              <a href="#contact" style="display:block; text-align:center; padding:15px 24px; background:#fff; color:${theme.primaryColor}; border-radius:${getBtnRadius(theme.buttonShape)}; font-weight:800; text-decoration:none; font-size:1rem; font-family:inherit;">${plan.ctaButton || 'Empezar ahora'}</a>
            </div>
          ` : `
            <div class="sr sr-delay-${i+1} card">
              <h3 class="pricing-name text-base">${plan.name}</h3>
              ${plan.description ? `<p class="pricing-desc text-muted">${plan.description}</p>` : ''}
              <div class="pricing-price color-primary">${plan.price}</div>
              ${plan.period ? `<p class="pricing-period text-muted">${plan.period}</p>` : ''}
              <ul style="list-style:none; margin-bottom:32px;">
                ${(plan.benefits||[]).map(b => `<li style="display:flex; align-items:flex-start; gap:10px; padding:9px 0; font-size:0.9rem; color:${theme.textBase}; border-bottom:1px solid ${theme.cardBorder};"><span style="color:${theme.primaryColor}; font-weight:700; flex-shrink:0; margin-top:1px;">✓</span>${b}</li>`).join('')}
                ${(plan.notIncluded||[]).map(b => `<li style="display:flex; align-items:flex-start; gap:10px; padding:9px 0; font-size:0.9rem; border-bottom:1px solid ${theme.cardBorder};"><span style="color:${theme.textMuted}; flex-shrink:0; margin-top:1px;">✕</span><span class="not-included">${b}</span></li>`).join('')}
              </ul>
              <a href="#contact" style="display:block; text-align:center; padding:15px 24px; background:${theme.primaryLight}; color:${theme.primaryColor}; border-radius:${getBtnRadius(theme.buttonShape)}; font-weight:700; text-decoration:none; font-size:1rem; font-family:inherit; border:1.5px solid ${theme.primaryColor};">${plan.ctaButton || 'Elegir plan'}</a>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  ` : '';

  const faqHTML = faq.length ? `
    <section id="faq" class="section-spacing bg-primary">
      <div class="container-sm">
        <div class="text-center mb-64">
          <div class="sr section-tag flex-center">FAQ</div>
          <h2 class="sr sr-delay-1 section-title text-center">${d.faq?.title || 'Preguntas frecuentes'}</h2>
          ${d.faq?.subtitle ? `<p class="sr sr-delay-2 section-subtitle mt-16">${d.faq.subtitle}</p>` : ''}
        </div>
        <div class="sr sr-delay-1">
          ${faq.map((item, i) => `
            <div class="faq-item">
              <button class="faq-question">
                <span>${item.question}</span>
                <span class="faq-icon">+</span>
              </button>
              <div class="faq-answer">
                <div class="faq-answer-inner">${item.answer}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  ` : '';

  const urgencyHTML = d.urgency ? `
    <section class="urgency-section">
      <div style="position:absolute; inset:0; pointer-events:none;">
        <div style="position:absolute; top:-30%; right:-10%; width:60%; height:160%; background:rgba(255,255,255,0.04); border-radius:50%;"></div>
      </div>
      <div class="container" style="position:relative; z-index:1; text-align:center;">
        ${d.urgency.badge ? `<div class="sr mb-20"><span class="badge-white">${d.urgency.badge}</span></div>` : ''}
        <h2 class="sr sr-delay-1 urgency-title">${d.urgency.title}</h2>
        ${d.urgency.subtitle ? `<p class="sr sr-delay-2 urgency-subtitle">${d.urgency.subtitle}</p>` : ''}
        ${d.urgency.countdown?.enabled ? `
          <div class="sr sr-delay-3 mb-36">
            <p style="font-size:0.8rem; text-transform:uppercase; letter-spacing:.12em; color:rgba(255,255,255,.6); margin-bottom:12px;">${d.urgency.countdown.label || 'La oferta termina en:'}</p>
            <div class="countdown-box" id="countdown-timer">
              <div class="countdown-unit"><div class="countdown-value hours">23</div><div class="countdown-label">horas</div></div><span class="countdown-sep">:</span>
              <div class="countdown-unit"><div class="countdown-value mins">59</div><div class="countdown-label">minutos</div></div><span class="countdown-sep">:</span>
              <div class="countdown-unit"><div class="countdown-value secs">59</div><div class="countdown-label">segundos</div></div>
            </div>
          </div>
        ` : ''}
        ${d.urgency.benefitsList?.length ? `
          <div class="sr sr-delay-4 urgency-benefits">
            ${d.urgency.benefitsList.map(b => `<span class="urgency-benefit"><span style="color:rgba(255,255,255,0.9); font-weight:700;">✓</span> ${b}</span>`).join('')}
          </div>
        ` : ''}
        <div class="sr sr-delay-5 flex-col items-center gap-12">
          <a href="#contact" style="display:inline-flex; align-items:center; gap:8px; padding:18px 48px; background:#fff; color:${theme.primaryColor}; border-radius:${getBtnRadius(theme.buttonShape)}; font-weight:800; font-size:1.1rem; text-decoration:none; box-shadow:0 8px 32px rgba(0,0,0,0.25); font-family:inherit;">${d.urgency.ctaButton || d.hero?.ctaButton || 'Aprovechar oferta'} &rarr;</a>
          ${d.urgency.supportingText ? `<p style="font-size:0.82rem; color:rgba(255,255,255,0.55);">${d.urgency.supportingText}</p>` : ''}
        </div>
      </div>
    </section>
  ` : '';

  const ctaHTML = d.cta ? `
    <section id="contact" class="section-spacing bg-secondary">
      <div class="container-sm text-center">
        <h2 class="sr section-title mb-16">${d.cta.title}</h2>
        ${d.cta.subtitle ? `<p class="sr sr-delay-1 section-subtitle margin-auto mb-40">${d.cta.subtitle}</p>` : ''}
        <div class="sr sr-delay-2 cta-buttons flex-center gap-16 wrap">
          <a href="mailto:info@empresa.cl" class="btn-primary" style="font-family:inherit; font-size:1.1rem; padding:18px 44px;">${d.cta.ctaButton} &rarr;</a>
          ${d.cta.secondaryCta ? `<a href="#faq" class="btn-secondary" style="font-family:inherit; font-size:1rem; padding:18px 36px;">${d.cta.secondaryCta}</a>` : ''}
        </div>
        ${d.cta.trustText ? `<p class="sr sr-delay-3 mt-20 text-sm text-muted">🔒 ${d.cta.trustText}</p>` : ''}
      </div>
    </section>
  ` : '';

  const footerHTML = d.footer ? `
    <footer class="footer-section bg-dark">
      <div class="container">
        <div class="footer-top">
          <div>
            ${logoImageUrl ? `<img src="${logoImageUrl}" alt="Logo de ${projectName}" style="max-height:48px; max-width:180px; object-fit:contain; margin-bottom:12px; display:block;" loading="lazy" />` : `<div class="footer-logo-text">${projectName}</div>`}
            ${d.footer.description ? `<p class="footer-desc">${d.footer.description}</p>` : ''}
            ${d.footer.contact ? `<a href="mailto:${d.footer.contact}" class="footer-contact color-secondary">${d.footer.contact}</a>` : ''}
            ${d.footer.phone ? `<p class="footer-phone">${d.footer.phone}</p>` : ''}
          </div>
          ${d.footer.links?.length ? `
            <div>
              <p class="footer-nav-title">Navegación</p>
              <ul style="list-style:none;">
                ${d.footer.links.map(l => `<li style="margin-bottom:10px;"><a href="${l.href || '#'}" class="footer-link">${l.label}</a></li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
        <div class="footer-bottom">
          <p class="footer-copy">&copy; ${new Date().getFullYear()} ${projectName}. ${d.footer.legalText || 'Todos los derechos reservados.'}</p>
          ${d.footer.socialProof ? `<p class="footer-proof">🔒 ${d.footer.socialProof}</p>` : ''}
        </div>
      </div>
    </footer>
  ` : '';

  const cssTag = inlineAssets 
    ? `<style>\n${generateStylesCSS(theme, images)}\n</style>`
    : `<link rel="stylesheet" href="styles.css" />`;

  const jsTag = inlineAssets
    ? `<script>\n${generateScriptJS()}\n</script>`
    : `<script src="script.js"></script>`;

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
  ${cssTag}
</head>
<body>
${navHTML}
${heroHTML}
${featuresHTML}
${howItWorksHTML}
${testimonialsHTML}
${pricingHTML}
${faqHTML}
${urgencyHTML}
${ctaHTML}
${footerHTML}
  ${jsTag}
</body>
</html>`;
}

export function generateStylesCSS(theme, images = {}) {
  const r = getBtnRadius(theme.buttonShape);

  return `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: ${theme.fontFamily}; background: ${theme.bgPrimary}; color: ${theme.textBase}; -webkit-font-smoothing: antialiased; }

  .sr { opacity: 0; transform: translateY(32px); transition: opacity .65s cubic-bezier(.22,1,.36,1), transform .65s cubic-bezier(.22,1,.36,1); }
  .sr.visible { opacity: 1; transform: none; }
  .sr-delay-1 { transition-delay: .1s; }
  .sr-delay-2 { transition-delay: .2s; }
  .sr-delay-3 { transition-delay: .3s; }
  .sr-delay-4 { transition-delay: .4s; }
  .sr-delay-5 { transition-delay: .5s; }
  .sr-delay-6 { transition-delay: .6s; }

  .btn-primary {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 16px 36px; background: ${theme.primaryColor}; color: ${theme.primaryText};
    border-radius: ${r}; font-weight: 700; font-size: 1.05rem;
    border: 2px solid ${theme.primaryColor}; cursor: pointer; text-decoration: none;
    transition: transform .2s, box-shadow .2s, background .2s;
    box-shadow: 0 4px 20px rgba(${theme.primaryRgb}, 0.35);
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(${theme.primaryRgb}, 0.5); background: ${theme.primaryDark}; }

  .btn-secondary {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 16px 36px; background: transparent; color: ${theme.textBase};
    border-radius: ${r}; font-weight: 600; font-size: 1rem;
    border: 1.5px solid ${theme.cardBorder}; cursor: pointer; text-decoration: none;
    transition: background .2s, border-color .2s;
  }
  .btn-secondary:hover { background: ${theme.bgSecondary}; border-color: ${theme.primaryColor}; color: ${theme.primaryColor}; }

  .btn-ghost-white {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 14px 32px; background: rgba(255,255,255,0.12); color: #fff;
    border-radius: ${r}; font-weight: 600; font-size: 0.95rem;
    border: 1.5px solid rgba(255,255,255,0.3); cursor: pointer; text-decoration: none;
    transition: background .2s;
    backdrop-filter: blur(8px);
  }
  .btn-ghost-white:hover { background: rgba(255,255,255,0.22); }

  .badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 16px; background: ${theme.primaryLight}; color: ${theme.primaryColor};
    border-radius: 9999px; font-size: 0.78rem; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase;
    border: 1px solid ${theme.primaryMedium};
  }
  .badge-white {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 16px; background: rgba(255,255,255,0.15); color: #fff;
    border-radius: 9999px; font-size: 0.78rem; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase;
    border: 1px solid rgba(255,255,255,0.3); backdrop-filter: blur(8px);
  }

  .card {
    background: ${theme.cardBg}; border: 1px solid ${theme.cardBorder};
    border-radius: 20px; padding: 32px; transition: transform .25s, box-shadow .25s;
  }
  .card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0,0,0,0.1); }

  .card-featured {
    background: ${theme.primaryColor}; border: none; border-radius: 24px;
    padding: 36px; position: relative;
    box-shadow: 0 20px 64px rgba(${theme.primaryRgb}, 0.35);
  }

  .section-tag {
    font-size: 0.75rem; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: ${theme.primaryColor}; margin-bottom: 12px;
    display: flex; align-items: center; gap: 8px;
  }
  .section-tag::before {
    content: ''; display: block; width: 24px; height: 2px; background: ${theme.primaryColor};
  }

  .section-title {
    font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; line-height: 1.15;
    letter-spacing: -0.02em; color: ${theme.textBase};
  }
  .section-subtitle {
    font-size: 1.15rem; color: ${theme.textMuted}; line-height: 1.75; max-width: 600px; margin: 0 auto;
  }

  .container { width: 100%; max-width: 1180px; margin: 0 auto; padding: 0 24px; }
  .container-sm { width: 100%; max-width: 820px; margin: 0 auto; padding: 0 24px; }
  .stars { color: #f59e0b; font-size: 0.95rem; letter-spacing: 2px; }

  .nav-floating {
    position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
    z-index: 999; display: flex; align-items: center; gap: 12px;
    padding: 10px 20px; border-radius: 9999px;
    background: ${theme.isDark ? 'rgba(10,10,20,0.85)' : 'rgba(255,255,255,0.85)'};
    backdrop-filter: blur(20px); border: 1px solid ${theme.cardBorder};
    box-shadow: 0 8px 40px rgba(0,0,0,0.12);
    font-size: 0.875rem; font-weight: 600; color: ${theme.textBase};
    max-width: calc(100vw - 48px);
  }
  .nav-floating a { color: ${theme.textMuted}; text-decoration: none; transition: color .2s; }
  .nav-floating a:hover { color: ${theme.primaryColor}; }

  .faq-item { border-bottom: 1px solid ${theme.cardBorder}; overflow: hidden; }
  .faq-question {
    width: 100%; display: flex; justify-content: space-between; align-items: center;
    padding: 22px 0; background: none; border: none; cursor: pointer; text-align: left;
    font-size: 1.05rem; font-weight: 600; color: ${theme.textBase}; gap: 16px;
    font-family: inherit;
  }
  .faq-icon {
    width: 32px; height: 32px; flex-shrink: 0; border-radius: 9999px;
    background: ${theme.primaryLight}; color: ${theme.primaryColor};
    display: flex; align-items: center; justify-content: center; font-size: 1.4rem;
    font-weight: 300; transition: transform .3s, background .3s, color .3s;
  }
  .faq-item.open .faq-icon { transform: rotate(45deg); background: ${theme.primaryColor}; color: ${theme.primaryText}; }
  .faq-answer { overflow: hidden; max-height: 0; transition: max-height .4s cubic-bezier(.22,1,.36,1); }
  .faq-answer-inner { padding: 0 0 22px; font-size: 0.97rem; color: ${theme.textMuted}; line-height: 1.8; }

  .trust-bar {
    display: flex; flex-wrap: wrap; align-items: center; justify-content: center;
    gap: 8px 24px; font-size: 0.85rem; color: ${theme.textMuted}; margin-top: 20px;
  }
  .trust-bar span { display: flex; align-items: center; gap: 6px; }
  .trust-bar span::before { content: '✓'; color: ${theme.primaryColor}; font-weight: 700; }

  .step-number {
    width: 56px; height: 56px; border-radius: 16px; background: ${theme.primaryLight};
    color: ${theme.primaryColor}; font-size: 1.4rem; font-weight: 800;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    box-shadow: 0 8px 24px rgba(${theme.primaryRgb},.3);
  }

  .stat-number { font-size: 3rem; font-weight: 900; color: #fff; line-height: 1; }
  .stat-label  { font-size: 0.85rem; font-weight: 600; color: rgba(255,255,255,0.8); margin-top: 4px; }
  .stat-desc   { font-size: 0.75rem; color: rgba(255,255,255,0.55); margin-top: 2px; }

  .not-included { color: ${theme.textMuted}; opacity: 0.5; text-decoration: line-through; }

  .countdown-box {
    background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.25);
    border-radius: 16px; padding: 20px 32px;
    display: inline-flex; gap: 24px; align-items: center;
    backdrop-filter: blur(8px);
  }
  .countdown-unit { text-align: center; }
  .countdown-value { font-size: 2.5rem; font-weight: 900; color: #fff; line-height: 1; }
  .countdown-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: .1em; color: rgba(255,255,255,.6); }
  .countdown-sep { font-size: 2rem; font-weight: 900; color: rgba(255,255,255,.5); margin-top: -8px; }

  .feature-highlight { border: 2px solid ${theme.primaryColor}; position: relative; }
  .feature-highlight::before {
    content: '★ Destacado'; position: absolute; top: -12px; left: 20px;
    background: ${theme.primaryColor}; color: ${theme.primaryText};
    padding: 2px 12px; border-radius: 9999px; font-size: 0.65rem; font-weight: 700;
    letter-spacing: .08em; text-transform: uppercase;
  }

  .avatar {
    width: 48px; height: 48px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 1rem; color: ${theme.primaryText};
    background: linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor});
  }

  .hero-img-overlay { position: absolute; inset: 0; z-index: 0; }
  .hero-img-overlay img { width: 100%; height: 100%; object-fit: cover; object-position: center; display: block; }
  .hero-img-overlay::after { content: ''; position: absolute; inset: 0; background: linear-gradient(145deg, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.38) 100%); }

  .section-spacing { padding: 96px 0; }
  .bg-primary { background: ${theme.bgPrimary}; }
  .bg-secondary { background: ${theme.bgSecondary}; }
  .bg-dark { background: ${theme.isDark ? '#05050a' : '#0a0a1a'}; }
  .hero-section { position: relative; overflow: hidden; padding-top: 140px; padding-bottom: 100px; }
  .hero-title { font-size: clamp(2.4rem, 5.5vw, 4.2rem); font-weight: 900; line-height: 1.08; letter-spacing: -0.03em; color: #ffffff; max-width: 860px; margin: 0 auto; }
  .hero-subtitle { font-size: clamp(1.05rem,2vw,1.3rem); color: rgba(255,255,255,0.82); line-height: 1.75; max-width: 640px; margin: 0 auto; }
  .text-center { text-align: center; }
  .mb-12 { margin-bottom: 12px; }
  .mb-16 { margin-bottom: 16px; }
  .mb-20 { margin-bottom: 20px; }
  .mb-24 { margin-bottom: 24px; }
  .mb-28 { margin-bottom: 28px; }
  .mb-36 { margin-bottom: 36px; }
  .mb-40 { margin-bottom: 40px; }
  .mb-64 { margin-bottom: 64px; }
  .mt-16 { margin-top: 16px; }
  .mt-20 { margin-top: 20px; }
  .flex-center { display: flex; justify-content: center; align-items: center; }
  .flex-col { display: flex; flex-direction: column; }
  .gap-12 { gap: 12px; }
  .gap-16 { gap: 16px; }
  .wrap { flex-wrap: wrap; }
  .margin-auto { margin: 0 auto; }
  .text-sm { font-size: 0.85rem; }
  .text-base { color: ${theme.textBase}; }
  .text-muted { color: ${theme.textMuted}; }
  .color-primary { color: ${theme.primaryColor}; }
  .color-secondary { color: ${theme.secondaryColor}; }
  
  .stats-container { margin-top: 56px; display: grid; gap: 1px; max-width: 640px; margin: 56px auto 0; background: rgba(255,255,255,0.1); border-radius: 20px; overflow: hidden; backdrop-filter: blur(10px); }
  .stat-box { padding: 24px 20px; text-align: center; }
  .stat-box-border { border-right: 1px solid rgba(255,255,255,0.15); }
  
  .features-grid { display: grid; gap: 24px; }
  .features-grid[data-count="4"], .features-grid[data-count="2"] { grid-template-columns: repeat(2, 1fr); }
  .features-grid:not([data-count="4"]):not([data-count="2"]) { grid-template-columns: repeat(3, 1fr); }
  .feature-icon { font-size: 2.2rem; margin-bottom: 16px; }
  .feature-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 12px; line-height: 1.3; }
  .feature-desc { font-size: 0.93rem; line-height: 1.8; }
  
  .steps-grid { display: grid; gap: 32px; position: relative; }
  .steps-line { position: absolute; top: 28px; left: 15%; right: 15%; height: 2px; z-index: 0; background: linear-gradient(90deg, ${theme.primaryLight}, ${theme.primaryColor}, ${theme.primaryLight}); }
  .step-card { text-align: center; position: relative; z-index: 1; }
  .step-icon-wrap { display: flex; justify-content: center; margin-bottom: 20px; }
  .step-title { font-size: 1.05rem; font-weight: 700; margin-bottom: 10px; }
  .step-desc { font-size: 0.9rem; line-height: 1.75; }

  .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .testimonial-quote { flex: 1; font-size: 0.97rem; line-height: 1.85; font-style: italic; margin-bottom: 24px; padding-left: 16px; border-left: 3px solid ${theme.primaryColor}; }
  .testimonial-author { display: flex; align-items: center; gap: 12px; }
  .testimonial-name { font-weight: 700; font-size: 0.9rem; }
  .testimonial-role { font-size: 0.8rem; }

  .pricing-grid { display: grid; gap: 24px; align-items: start; }
  .pricing-name { font-size: 1.15rem; font-weight: 700; margin-bottom: 8px; }
  .pricing-name-featured { font-size: 1.2rem; font-weight: 700; margin-bottom: 8px; color: rgba(255,255,255,0.9); }
  .pricing-desc { font-size: 0.87rem; margin-bottom: 20px; line-height: 1.6; }
  .pricing-desc-featured { font-size: 0.87rem; color: rgba(255,255,255,0.65); margin-bottom: 20px; line-height: 1.6; }
  .pricing-price { font-size: 2.8rem; font-weight: 900; letter-spacing: -0.04em; line-height: 1; }
  .pricing-price-featured { font-size: 3rem; font-weight: 900; color: #fff; letter-spacing: -0.04em; line-height: 1; }
  .pricing-period { font-size: 0.85rem; margin-top: 4px; margin-bottom: 28px; }
  .pricing-period-featured { font-size: 0.85rem; color: rgba(255,255,255,0.6); margin-top: 4px; margin-bottom: 28px; }

  .urgency-section { padding: 96px 0; position: relative; overflow: hidden; background: linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.primaryDark} 100%); }
  .urgency-title { font-size: clamp(2rem,4vw,3.2rem); font-weight: 900; color: #fff; margin-bottom: 16px; letter-spacing: -0.02em; }
  .urgency-subtitle { font-size: 1.15rem; color: rgba(255,255,255,0.8); max-width: 560px; margin: 0 auto 32px; }
  .urgency-benefits { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px 20px; margin-bottom: 36px; }
  .urgency-benefit { display: flex; align-items: center; gap: 6px; color: rgba(255,255,255,0.85); font-size: 0.9rem; }

  .footer-section { padding: 64px 0 32px; }
  .footer-top { display: grid; grid-template-columns: 2fr 1fr; gap: 48px; margin-bottom: 48px; align-items: start; }
  .footer-logo-text { font-size: 1.5rem; font-weight: 900; color: #fff; margin-bottom: 12px; letter-spacing: -0.02em; }
  .footer-desc { font-size: 0.9rem; color: #6b7280; line-height: 1.75; max-width: 420px; }
  .footer-contact { display: block; margin-top: 16px; font-size: 0.9rem; text-decoration: none; }
  .footer-phone { font-size: 0.85rem; color: #6b7280; margin-top: 6px; }
  .footer-nav-title { font-size: 0.75rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #6b7280; margin-bottom: 16px; }
  .footer-link { font-size: 0.9rem; color: #9ca3af; text-decoration: none; transition: color .2s; }
  .footer-link:hover { color: #fff; }
  .footer-bottom { border-top: 1px solid #1f2937; padding-top: 28px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; }
  .footer-copy { font-size: 0.8rem; color: #4b5563; }
  .footer-proof { font-size: 0.8rem; color: #6b7280; }

  .grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
  .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
  .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
  .grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
  .grid-cols-5 { grid-template-columns: repeat(5, 1fr); }

  @media (max-width: 768px) {
    .features-grid, .features-grid[data-count="4"], .features-grid[data-count="2"] { grid-template-columns: 1fr; }
    .testimonials-grid, .pricing-grid, .steps-grid, .footer-top { grid-template-columns: 1fr !important; }
    .stats-container { grid-template-columns: repeat(2, 1fr) !important; }
    .cta-buttons { flex-direction: column !important; align-items: stretch !important; }
    .nav-floating { display: none !important; }
    .countdown-box { flex-wrap: wrap; gap: 12px; }
  }
`;
}

export function generateScriptJS() {
  return `(function () {
  'use strict';

  function initFAQ() {
    var items = document.querySelectorAll('.faq-item');
    items.forEach(function (item) {
      var btn    = item.querySelector('.faq-question');
      var answer = item.querySelector('.faq-answer');
      if (!btn || !answer) return;
      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');
        items.forEach(function (other) {
          other.classList.remove('open');
          var oa = other.querySelector('.faq-answer');
          if (oa) oa.style.maxHeight = null;
        });
        if (!isOpen) {
          item.classList.add('open');
          answer.style.maxHeight = '400px';
        }
      });
    });
  }

  function initCountdown() {
    var timerEl = document.getElementById('countdown-timer');
    if (!timerEl) return;
    var hEl = timerEl.querySelector('.hours');
    var mEl = timerEl.querySelector('.mins');
    var sEl = timerEl.querySelector('.secs');
    if(!hEl || !mEl || !sEl) return;

    var h = 23, m = 59, s = 59;
    var t = setInterval(function() {
      if(h === 0 && m === 0 && s === 0) { clearInterval(t); return; }
      if(s > 0) { s--; }
      else if(m > 0) { m--; s = 59; }
      else if(h > 0) { h--; m = 59; s = 59; }

      hEl.textContent = h < 10 ? '0'+h : h;
      mEl.textContent = m < 10 ? '0'+m : m;
      sEl.textContent = s < 10 ? '0'+s : s;
    }, 1000);
  }

  function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.sr').forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add('visible');
        observer.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    
    setTimeout(function() {
      document.querySelectorAll('.sr').forEach(function (el) {
        observer.observe(el);
      });
    }, 100);
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
    initCountdown();
    initScrollAnimations();
    initSmoothScroll();
  });

}());`;
}

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

Edita las clases CSS en styles.css

## Tecnologías

- HTML5 semántico
- CSS3 vanilla
- JavaScript ES5 vanilla
- Google Fonts

Generado el ${new Date().toLocaleDateString('es-CL')}.
`;
}

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

  if (heroImageUrlOriginal) {
    const result = await fetchImageAsBlob(heroImageUrlOriginal);
    if (result) {
      images.heroExt      = result.ext;
      images.heroImageUrl = `assets/hero-image.${result.ext}`;
      assetsFolder.file(`hero-image.${result.ext}`, result.blob);
    } else {
      images.heroImageUrl = heroImageUrlOriginal;
    }
  }

  if (logoImageUrlOriginal) {
    const result = await fetchImageAsBlob(logoImageUrlOriginal);
    if (result) {
      images.logoExt      = result.ext;
      images.logoImageUrl = `assets/logo.${result.ext}`;
      assetsFolder.file(`logo.${result.ext}`, result.blob);
    } else {
      images.logoImageUrl = logoImageUrlOriginal;
    }
  }

  assetsFolder.file('README.md', generateREADME(projectName, theme));
  rootFolder.file('index.html', generateIndexHTML(landingData, theme, projectName, images));
  rootFolder.file('styles.css', generateStylesCSS(theme, images));
  rootFolder.file('script.js',  generateScriptJS());

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