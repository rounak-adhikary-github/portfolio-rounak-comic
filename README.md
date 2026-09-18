# Rounak Adhikary — comic book single-page portfolio

A one-page portfolio drawn as a **printed comic book**: newsprint paper, ben-day halftone
screens, ink-outlined panels with hard offset shadows, caption strips, a speech bubble,
starburst "NEW!" stickers, sound-effect pops and a `POW!` Easter egg — on top of content
that is actually useful (skills, experience, education, contact).

**Zero dependencies.** No framework, no build step, no webfonts, no analytics, no
third-party requests — one HTML file, one stylesheet, one small script, plus the SVG
textures. It renders identically offline and on GitHub Pages.

```
testCode/
├── index.html                        → the whole page (single page, all panels)
├── css/comic.css                     → the comic design system
├── js/comic.js                       → clock, typing, reveals, filters, SFX, form
├── assets/Rounak_Adhikary-Resume.pdf → linked from every "Résumé" button
├── assets/tex-halftone.svg           → seamless ben-day dot screen (the paper texture)
├── assets/tex-paper.svg              → seamless newsprint grain (SVG turbulence)
├── assets/burst.svg                  → starburst + speed lines behind the cover title
├── assets/speed-lines.svg            → radial comic "zoom" streaks
├── assets/hero-badge.svg             → the "ISSUE #07" cover badge
├── assets/icon.svg                   → app icon / home-screen install
├── manifest.webmanifest              → lets phones "Add to Home screen"
├── robots.txt                        → allow crawlers (nothing private here)
├── .nojekyll                         → tells GitHub Pages to serve files as-is
└── README.md                         → this file
```

---

## 1. Preview it locally

Open `index.html` directly, or serve the folder (nicer, because the PDF download behaves
like it will in production):

```bash
cd testCode
python -m http.server 8080
# then open http://127.0.0.1:8080/
```

---

## 2. Publish it free on GitHub Pages

> ⚠️ **This folder is currently ignored by the parent repo's `.gitignore`** (that was
> requested: everything in `testCode/` stays untracked), so it *cannot* be published from
> this repository as it stands. Pick one:

**Option A — its own repository (recommended for a portfolio)**

```bash
cd testCode
git init -b main
git add .
git commit -m "Comic book single-page portfolio"
git remote add origin https://github.com/<your-username>/<repo>.git
git push -u origin main
```

Then on GitHub: **Settings → Pages → Source: Deploy from a branch → `main` / `root` → Save**.
Your site appears at `https://<your-username>.github.io/<repo>/` in about a minute.

**Option B — publish from this repo**
Delete the `testCode/` line from the root `.gitignore`, commit, then point GitHub Pages at
either the branch root (and browse to `/testCode/`) or the `/docs` folder if you move it there.

**Optional custom domain:** add a `CNAME` file containing your domain, then set the DNS
records GitHub shows you under *Settings → Pages → Custom domain*.

### Before you publish

- Replace the placeholder URLs in `index.html`: `<link rel="canonical">`,
  `<meta property="og:url">` and the JSON-LD `"url"` all say `https://example.github.io/portfolio/`.
  A wrong canonical can stop the page being indexed, so change this first.
- Add an `og:image` if you want a picture in link previews — use a screenshot of the page
  (1200×630) and point `<meta property="og:image">` at it.
- There is no `404.html` on purpose: GitHub Pages serves `404.html` for *any* missing path,
  and its asset links resolve against that path, so it can only be written correctly once
  the final URL is known.

---

## 3. What's on the page

| Panel | What it carries |
|---|---|
| Cover | Name, role, live Kolkata clock, rotating subtitle, speech-bubble summary, WhatsApp / Instagram / Email buttons, "Hero File" panel with the ISSUE #07 badge |
| Stat stamps | 7+ years · 4 companies · 5 enterprise clients · 25+ skills (animated counters) |
| Page 01 · Origin Story | Prose summary + "Powers & Abilities" list |
| Page 02 · Powers & Skills | Five skill panels behind six filter chips, six skills flagged **NEW!** |
| Page 03 · Back Issues | Four-role timeline with CV bullets, plus six "Greatest Hits" cards |
| Page 04 · School Days | Report card (B.Tech 8.935 CGPA, ISC 84.33%, ICSE 87%) + courses & languages |
| Page 05 · Write To The Editor | Form that opens a pre-filled mail draft, plus a "Hotline" contact panel |
| Footer | "To be continued…", reader counter, quick links, back to top |

### Skills marked NEW!

Grouped under **AI-Assisted Engineering** and **Backend & APIs**, added on request to the
existing CV list:

- Spring Boot
- JPA
- CSV Report Generation
- GitHub Copilot
- Claude Code
- Vibecoding

Everything else is taken straight from the two résumé PDFs — Core Java, the Collections
Framework, RESTful Web Services, JAX-RS, Microservices, MongoDB (4 yrs), MySQL (3 yrs), XML
Parsing, XSL Transformations, Excel report generation, ad-services revenue calculation,
PCF-ARO migration, E2E migration management, the concierge role, client-facing delivery and
migration playbooks.

---

## 4. How the comic look is built

Everything is CSS plus the six SVG files in `assets/` — no bitmaps, so the textures stay
sharp on any display and cost a few KB each.

- **Paper** — `body` is newsprint cream; `assets/tex-halftone.svg` (seamless ben-day dots)
  and `assets/tex-paper.svg` (SVG turbulence grain) sit in two fixed layers at `z-index:-1`
  so the paper is screened and grainy while the opaque panels stay crisp to read.
- **Ink lines** — 4px `#141414` borders with `box-shadow: 7px 7px 0` (hard offset, no blur)
  read as printed ink rather than a web drop shadow.
- **Panel tilts** — the independent `rotate:` property, never `transform:`, so a panel's tilt
  is never overwritten by the fly-in animation (which uses `translate:`).
- **Caption strips** — the coloured strip at the top of each panel cycles through the primaries
  with `:nth-child` rules, so a wall of panels still reads like a printed page.
- **Speech bubble** — the tail is two stacked CSS triangles (an ink one, with a white one
  punched through it), which is how you draw a tail without a bitmap.
- **Halftone shading** — stat stamps and the "strength" bars repeat the same dot tile at
  different sizes, so every screen has the same dot pitch.
- **Type** — `Impact` for lettering (headings, captions, buttons) and `Comic Sans MS` for
  body copy, both with broad fallback stacks. Deliberately no webfont download.

### Interactive bits

- **`INK`** — switches the halftone screen and paper grain off for a cleaner read
  (remembered in `localStorage`).
- **`SFX!`** — opt-in sound effects: click anywhere and a `POW!` / `ZAP!` / `KRAK!` bursts out.
  Off by default; disabled entirely under `prefers-reduced-motion`.
- **Filters** — show one skill category at a time, with `aria-pressed` kept in sync.
- **Form** — composes a `mailto:` draft from what you type; nothing is sent to a server.
- **Copy-email button** with a `role="status"` announcement.
- **Reader counter** — a period gag. It is a local `localStorage` counter starting at 100000,
  not an analytics service, and no data leaves the browser.
- **Konami code** — ↑ ↑ ↓ ↓ ← → ← → B A. Try it for a page-wide special.
- **Accessibility:** skip link, visible focus rings, `aria-pressed` on toggles, `aria-live`
  announcements, real `<table>` semantics on mobile (the `<thead>` is visually hidden, and
  each stacked cell is labelled with `data-th`), and full `prefers-reduced-motion` support.
- **Print stylesheet:** Ctrl/⌘-P gives a clean black-on-white version with the textures,
  bulletin, buttons and effects removed.

---

## 5. Editing the content

Everything lives in `index.html`, in plain HTML with comments marking each section — there is
no data file to keep in sync.

| Change | Where |
|---|---|
| Name, role, tagline | `.hero-copy` — `<h1 class="title">` and the `.bubble` |
| Rotating subtitle words | `words` array in `js/comic.js` |
| Skills | `.tags` lists inside `#skillGrid`; add `class="is-new"` plus `<span class="sticker">NEW!</span>`, and set `data-cat` to control which filter shows the panel |
| Jobs | `.timeline` — one `<li class="panel job">` per role, with the title in its `.caption` |
| Highlights | `.cards` — one `<article class="panel card">` each |
| Report card | `table.marks` (keep the `data-th` attributes, they are the mobile labels) |
| Courses | `.ticks` inside the "Training Montage" panel |
| Panel colour | `:nth-child` rules in section 7 of `css/comic.css` |
| Phone / Instagram / email | `wa.me/918017414711`, `instagram.com/ig_chromozome`, `write2r.adhikary@gmail.com` — each appears in several places (cover, hotline, footer, JSON-LD) |
| Résumé | Replace `assets/Rounak_Adhikary-Resume.pdf` with the new file, same name |
| Sound-effect words | `SFX` array at the top of the effects block in `js/comic.js` |

If you change the phone number or Instagram handle, remember the floating buttons (`.fabs`)
and the footer links too — a search-and-replace for `8017414711` and `ig_chromozome` catches
them all.
