# Space Systems & Energy

A responsive, Markdown-driven Jekyll website for Jesus David Gonzalez Llorente. The group name is provisional. The original personal website is unchanged.

## Publish from main

Uses GitHub Pages' built-in Jekyll build: no custom plugins, Node build, or external theme.

1. Commit and push this repository to `main`.
2. In GitHub **Settings → Pages**, select **Deploy from a branch**, **main**, **/ (root)**.
3. Keep `url: "https://jesusdgonzalezl.github.io"` and `baseurl: "/es"` for the project URL. For a domain root use `baseurl: ""`. Change `url` for another host.

No push or publication was performed. Old demo pages, posts, and theme package are excluded. The previous license remains for inherited assets.

## Configuration and content

`_config.yml` controls names, professor details, degrees, contact and academic links, navigation order, visibility, palette, typography, homepage options, and GitHub Pages path. Restart Jekyll after config changes. Fonts use local system stacks.

- Reorder `navigation` to reorder navigation and sections. Hide with `enabled: false`, or remove the entry. Home buttons disappear if their target is disabled.
- Introductory Markdown is in `content/_sections/`, matched by `section_id`.
- Add a section with a Markdown introduction and matching navigation entry using `kind: cards`. An introduction-only section needs no collection.
- For a new collection, declare it under `collections`, add `collection: collection_name` to navigation, and create `content/_collection_name/`.
- Jekyll requires underscores in `content/_students/student-name.md` and `content/_publications/year-short-name.md`. Each record has its own file.
- Record fields: `title` or `name`, `role`, `term`, `order`, `date`, `topics`, `links`, `image`, `image_alt`, `gallery`, and `published: false` for drafts.
- Publications use `title`, `authors`, `year`, `type`, `venue`, `link`. The full bibliography works without JavaScript. With JavaScript it is initially shortened and searchable by text and type.
- Research, news, teaching, and opportunities are separate collections. Use `order` for card ordering.
- Copy examples from `templates/` into a collection and set `published: true` when ready.

## Photos and galleries

Use `assets/images/people/`, `research/`, `news/`, and `activities/`. Reference site-root paths **without** `/es`; templates add the configured prefix.

```yaml
image: /assets/images/research/project.jpg
image_alt: Describe the equipment shown
gallery:
  - file: /assets/images/activities/workshop.jpg
    alt: Students assembling a satellite prototype at a workbench
    caption: Workshop title, date, and photographer credit
```

Galleries work on any record or section introduction, with responsive grids, captions, and full-size links. Add descriptive alt text and compress images. The portrait comes from the original site; the orbital SVG is an original conceptual illustration.

## Content provenance

- Official source: https://www.etsmtl.ca/en/study-at-ets/professors/jgonzalez-llorente (September 12, 2026).
- Identity, degrees, department, email, expertise, supervision, and bibliography come from this profile. The biography summarizes these facts.
- Scholar, ORCID, LinkedIn, and portrait come from the existing personal site.
- Saavan Ravindranath's summer 2026 supervision is in the source; current group membership is unconfirmed.
- Replace the provisional group name/status in `_config.yml` and the marked news/teaching placeholders. No funding, openings, or events have been invented.
- `scripts/import-publications.py` imports a locally saved official profile, preserving existing files. Review imported metadata before publishing.

## Local preview

Install Ruby and Bundler, then run:

```sh
bundle install
bundle exec jekyll serve --host 127.0.0.1
```

Open http://127.0.0.1:4000/es/. Production build:

```sh
bundle exec jekyll build --strict_front_matter
```

Includes mobile navigation, focus indicators, a skip link, reduced motion, and a JavaScript-free fallback. Recheck accessibility after customizing colors or fonts.

## Verification performed

The visual fixture passed browser checks at 375, 768, and 1440 pixels: no horizontal overflow, publication search/type filtering/expansion, mobile menu and Escape behavior, image loading, no JavaScript errors, and all 54 publications visible without JavaScript.

**A native Jekyll build has not been run:** Ruby was unavailable and WSL/dependency access was declined. Run the production build above before publishing. `scripts/visual-check.py` makes an approximate visual fixture using the actual CSS/JS/content, not a Liquid compiler. `scripts/check-browser.cjs` checks that fixture with an installed Playwright and Chrome; optionally set `PLAYWRIGHT_MODULE` to its module path. These development scripts and `_preview/` are excluded from deployment.
