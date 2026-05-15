import { Router, type IRouter } from "express";

const router: IRouter = Router();

type PageData = {
  businessName: string;
  headline: string;
  subheadline: string;
  description: string;
  services: { title: string; description: string }[];
  callToAction: string;
  accentColor: string;
};

function isValidPageData(body: unknown): body is PageData {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.businessName === "string" &&
    b.businessName.length > 0 &&
    typeof b.headline === "string" &&
    typeof b.subheadline === "string" &&
    typeof b.description === "string" &&
    typeof b.callToAction === "string" &&
    typeof b.accentColor === "string" &&
    Array.isArray(b.services)
  );
}

router.post("/", async (req, res) => {
  if (!isValidPageData(req.body)) {
    return res.status(400).json({ error: "Invalid preview data" });
  }

  const data = req.body;
  const slug = data.businessName.toLowerCase().replace(/[^a-z0-9]/g, "");

  const html = buildHtml(data);

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${slug}-landing-page.html"`,
  );
  res.send(html);
});

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildHtml(data: PageData): string {
  const { accentColor } = data;

  const servicesHtml = data.services
    .map(
      (s) => `
    <div class="card">
      <div class="dot"></div>
      <h3 class="card-title">${esc(s.title)}</h3>
      <p class="card-desc">${esc(s.description)}</p>
    </div>`,
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(data.businessName)}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
        'Helvetica Neue', Arial, sans-serif;
      color: #111;
      background: #fff;
      line-height: 1.6;
    }

    /* ── Nav ── */
    nav {
      position: sticky; top: 0; z-index: 100;
      display: flex; align-items: center; justify-content: space-between;
      padding: 1rem 2rem;
      background: rgba(255,255,255,0.94);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid #f0f0f0;
    }
    .brand { font-weight: 800; font-size: 1.05rem; color: ${accentColor}; }
    .nav-btn {
      background: ${accentColor}; color: #fff;
      padding: .5rem 1.25rem; border-radius: 6px;
      text-decoration: none; font-weight: 600; font-size: .875rem;
      transition: opacity .15s;
    }
    .nav-btn:hover { opacity: .85; }

    /* ── Hero ── */
    .hero {
      background: ${accentColor}; color: #fff;
      min-height: 65vh;
      display: flex; align-items: center;
      padding: 5rem 2rem;
    }
    .hero-inner { max-width: 680px; margin: 0 auto; }
    .eyebrow {
      font-size: .75rem; font-weight: 700;
      text-transform: uppercase; letter-spacing: .14em;
      opacity: .7; margin-bottom: 1.25rem;
    }
    h1 {
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 800; line-height: 1.12;
      margin-bottom: 1.25rem;
    }
    .sub { font-size: 1.15rem; opacity: .88; margin-bottom: 2rem; }
    .hero-cta {
      display: inline-block;
      background: #fff; color: ${accentColor};
      font-weight: 700; padding: .9rem 2rem;
      border-radius: 8px; text-decoration: none;
      font-size: 1rem; transition: transform .15s;
    }
    .hero-cta:hover { transform: translateY(-2px); }

    /* ── About ── */
    .about {
      padding: 4.5rem 2rem;
      max-width: 760px; margin: 0 auto; text-align: center;
    }
    .about p { font-size: 1.1rem; color: #555; }

    /* ── Services ── */
    .services { background: #f8f8f8; padding: 5rem 2rem; }
    .services-inner { max-width: 960px; margin: 0 auto; }
    .section-eye {
      font-size: .7rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: .15em; color: #aaa; text-align: center;
      margin-bottom: .5rem;
    }
    h2 {
      font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 800;
      text-align: center; margin-bottom: 2.5rem; color: #111;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.25rem;
    }
    .card {
      background: #fff; border-radius: 12px;
      padding: 1.5rem; border: 1px solid #e8e8e8;
    }
    .dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: ${accentColor}; margin-bottom: .75rem;
    }
    .card-title { font-weight: 700; font-size: .95rem; margin-bottom: .3rem; }
    .card-desc { font-size: .85rem; color: #666; line-height: 1.55; }

    /* ── CTA band ── */
    .cta-band {
      background: ${accentColor}; color: #fff;
      padding: 5rem 2rem; text-align: center;
    }
    .cta-band h2 { margin-bottom: .75rem; color: #fff; }
    .cta-band p { opacity: .85; font-size: 1.05rem; margin-bottom: 1.75rem; }
    .cta-band a {
      display: inline-block;
      background: #fff; color: ${accentColor};
      font-weight: 700; padding: .9rem 2.25rem;
      border-radius: 8px; text-decoration: none; font-size: 1rem;
    }

    /* ── Footer ── */
    footer {
      padding: 1.5rem 2rem; border-top: 1px solid #f0f0f0;
      text-align: center; font-size: .8rem; color: #bbb;
    }
    footer a { color: ${accentColor}; text-decoration: none; }
  </style>
</head>
<body>

<nav>
  <span class="brand">${esc(data.businessName)}</span>
  <a href="#contact" class="nav-btn">${esc(data.callToAction)}</a>
</nav>

<section class="hero">
  <div class="hero-inner">
    <p class="eyebrow">${esc(data.businessName)}</p>
    <h1>${esc(data.headline)}</h1>
    <p class="sub">${esc(data.subheadline)}</p>
    <a href="#contact" class="hero-cta">${esc(data.callToAction)}</a>
  </div>
</section>

<section class="about">
  <p>${esc(data.description)}</p>
</section>

<section class="services">
  <div class="services-inner">
    <p class="section-eye">What we offer</p>
    <h2>Our Services</h2>
    <div class="grid">
      ${servicesHtml}
    </div>
  </div>
</section>

<section class="cta-band" id="contact">
  <h2>Ready to get started?</h2>
  <p>Let's build something great together.</p>
  <a href="mailto:hello@${esc(data.businessName.toLowerCase().replace(/[^a-z0-9]/g, ""))}.com">
    ${esc(data.callToAction)}
  </a>
</section>

<footer>
  <p>Preview page &mdash; want a site like this? <a href="https://buildwithclark.com" target="_blank" rel="noopener">Build With Clark</a></p>
</footer>

</body>
</html>`;
}

export default router;
