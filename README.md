# Collab — website redesign

Static marketing site for **Collab** (Collab Cubicles, Whitefield, Bengaluru), built from
the *Collab Website Redesign Brief* and the accompanying "Collab Homepage" design canvas.

**Live preview:** https://khalidnoshtek.github.io/collab-website/
**Production domain:** collabcubicles.com (not yet pointed here)

---

## Positioning

The site deliberately does **not** present Collab as a coworking company that also sells other
services. It presents one ecosystem — **Start → Run → Grow** — that a business can enter at any
stage, with coworking as the heritage and physical foundation rather than the headline.

## Page structure

| # | Section | id |
|---|---|---|
| 1 | Hero — *Build Your Business. We'll Help You Run It.* | `#top` |
| 2 | Problem-first chooser — *What are you looking to do?* | `#chooser` |
| 3 | Ecosystem — *One Partner. Multiple Business Needs.* | `#ecosystem` |
| 4 | Collab Cubicles workspace + photography | `#workspace` |
| 5 | Journey — Start / Operate / Grow / Build | `#journey` |
| 6 | Collab Technology | `#technology` |
| 7 | Collab Growth (marketing) | `#marketing` |
| 8 | Collab Business Services (back office) | `#business` |
| 9 | Bundled solution packs | `#solutions` |
| 10 | Why Collab | `#why` |
| 11 | Final CTA + contact channels + location map | `#contact` |

The chooser in §2 is the key UX idea from the brief: visitors navigate by **their problem**, not by
Collab's internal service structure. Selecting one of the four cards reveals a tailored bundle.

## Tech

Plain HTML, CSS and JavaScript — no build step, no framework, no dependencies. Deploys as-is.

- `index.html` — the whole page
- `assets/css/styles.css` — design tokens in `:root`, then components
- `assets/js/main.js` — mega-menu, mobile drawer, chooser, scroll reveals
- `assets/photos/` — real Collab Cubicles photography (`.webp` with `.jpg` fallback)
- `assets/img/` — logos and generated favicons

Includes: responsive layout down to 320px, keyboard-accessible navigation, skip link,
`prefers-reduced-motion` support, Open Graph/Twitter cards, and `ProfessionalService`
JSON-LD carrying the real NAP details.

### Local preview

```bash
python3 -m http.server 8765
```

Then open http://localhost:8765.

---

## Content status — read before going live

Everything on the page is real except where noted here.

**Verified and live.** Address, phone, email, workspace inventory and amenities all come from the
current collabcubicles.com. Photography is Collab Cubicles' own, pulled from the existing site.

**Social proof is intentionally switched off.** Brief §14 asks for client logos, testimonials and
case studies and says to *"use actual client information only"*. No verified client names, quotes
or logos were available at build time, so that section ships as an HTML comment in `index.html`
(search for `SOCIAL PROOF (DISABLED)`) rather than as placeholder people. To enable it: uncomment
the block, add approved logos to `assets/photos/clients/`, and replace every quote and attribution
with a real one.

**Service claims need a business owner's sign-off.** The page states that Collab delivers company
registration, accounting, payroll, compliance, digital marketing, SEO, software development and AI
automation. These come from the brief, not from anything currently published on collabcubicles.com.
Confirm each line is a service Collab can actually deliver today before this replaces the live site.

**No contact form.** The CTAs use real, working channels — `mailto:`, `tel:`, WhatsApp and Google
Maps directions — rather than a form that posts nowhere. If a form is wanted, wire it to a form
backend (Formspree, Netlify Forms, or an endpoint of your own).

## Pointing collabcubicles.com here

1. Add a `CNAME` file containing `collabcubicles.com`.
2. Point the domain's DNS at GitHub Pages.
3. Update the absolute URLs in `robots.txt` and `sitemap.xml`, and add a
   `<link rel="canonical">` to `index.html`.
