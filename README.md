# [Your Name] — Portfolio

A React + Vite + Tailwind CSS portfolio site. Deliberately neutral right now —
plain black/white/gray, system font, no accent colors or decorative motifs —
so the layout and content structure can be judged on their own before any
visual identity gets layered on top.

Layout: both the homepage and case study pages use a sticky two-column
structure — a persistent left sidebar (identity + work nav on the homepage,
section nav + project meta on a case study) beside a right column that
scrolls through the actual content. The sidebar highlights whichever section
is currently in view as you scroll.

Every piece of content in the site is a `[bracketed placeholder]` — that's
intentional, so it's obvious what still needs real copy and nothing gets
mistaken for finished writing.

## Run it locally

```bash
npm install
npm run dev
```

Opens at http://localhost:5173. Production build:

```bash
npm run build   # outputs to dist/
npm run preview # serve the production build locally
```

## Editing in VS Code

This is a normal Vite project — no special setup needed. Unzip it, open the
`ivy-portfolio` folder in VS Code, run `npm install` once, then `npm run dev`
for hot-reloading as you edit.

Once the repo is pushed to GitHub (below), you can also clone it straight
into VS Code via the Git panel instead of working from the zip.

## Deploy: GitHub Pages with a custom domain

This repo is already set up for this path:

1. **Create the GitHub repo and push.**

   ```bash
   cd ivy-portfolio
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/bittertang/<repo-name>.git
   git push -u origin main
   ```

   Create `<repo-name>` on GitHub first (github.com/new) — any name works,
   since your custom domain will serve from the root regardless.

2. **Set your real domain.** Edit `public/CNAME` and replace `yourdomain.com`
   with your actual domain (no `https://`, no trailing slash), e.g.:

   ```
   yourname.com
   ```

3. **Turn on GitHub Pages.** In the repo on GitHub: Settings → Pages → under
   "Build and deployment", set **Source** to **GitHub Actions**. The included
   workflow (`.github/workflows/deploy.yml`) builds and publishes the site
   automatically on every push to `main` — just push your `CNAME` edit and
   it'll deploy.

4. **Point your domain at GitHub Pages.** In your DNS provider's settings
   (e.g. GoDaddy), add:

   | Type  | Name | Value                |
   |-------|------|----------------------|
   | A     | @    | 185.199.108.153      |
   | A     | @    | 185.199.109.153      |
   | A     | @    | 185.199.110.153      |
   | A     | @    | 185.199.111.153      |
   | CNAME | www  | bittertang.github.io |

   DNS changes can take anywhere from a few minutes to a few hours to
   propagate. Once it resolves, go back to Settings → Pages on GitHub and
   confirm the custom domain is verified, then check **Enforce HTTPS**.

5. **Deep links just work.** `/work/project-1` and friends are React Router
   routes, which GitHub Pages doesn't natively support on a hard refresh —
   `public/404.html` plus a small inline script in `index.html` handle the
   redirect so clean URLs still work. You don't need to touch these unless
   you later deploy to a project subpath instead of a custom domain (see the
   comment in `public/404.html` for the one-line change that requires).

If you'd rather use Vercel or Netlify instead of GitHub Pages, both auto-detect
Vite, build with `npm run build`, and handle client-side routing rewrites
automatically — just skip the Pages-specific files above.

## What to fill in

- **`src/data/profile.js`** — your name, role, location, status, one-line
  pitch, about paragraph, quick facts, and contact links. Used in the
  homepage sidebar and the top nav.
- **`src/data/projects.js`** — three placeholder projects (`project-1/2/3`),
  each with the full case-study shape: meta (role/timeline/team/status),
  problem, research + findings, failed concepts, iterations, final flow,
  outcome, reflection. Arrays (findings, concepts, rounds) can have more or
  fewer items than the placeholder — the layout adapts.
- **`PlaceholderImage` components** (in `WorkShowcase.jsx` and
  `CaseStudy.jsx`) — swap these for real screenshots once you have them.
  Look for the `{/* Swap for a real ... */}` comments.
- **`public/resume.pdf`** — add your actual resume file at this path.
- **Favicon** — `public/favicon.svg` is still the Vite default.

Once real content and a visual direction are settled, this is also the point
to bring back color, type, and any other styling on top of this structure.

## Project structure

```
src/
  components/   NavBar, HomeSidebar, WorkShowcase, CaseStudySidebar, PlaceholderImage
  hooks/        useActiveSection.js — scrollspy logic shared by both sidebars
  pages/        Home.jsx, CaseStudy.jsx (one template, reused per project via /work/:slug)
  data/         profile.js (identity/about/contact), projects.js (case study content)
  index.css     Tailwind import, plain black/white/gray base styles
```
