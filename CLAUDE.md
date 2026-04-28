# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

**Labrinth** is a single-page satirical SaaS website called "Nexus" — a dark comedy about modern tech product UX. There is no build system, no framework, no dependencies. Serve it with any static server and it runs.

## Development

To develop:
- Serve with any static server: `python3 -m http.server` from `html/`, or Caddy `file_server`
- Direct `file://` open does **not** work — the JS is split across multiple files and browsers block cross-origin requests on `file://`
- No install, build, lint, or test commands exist

## Architecture

The site lives in `html/`. It is organized into:

1. **`index.html`** (~530 lines) — HTML structure and all CSS. The `<style>` block (~500 lines) uses CSS variables. Theme colors are in `:root`. Separate named sections for each "path" (`.gs-*` for gameshow, `.t-*` for terminal, `.del-scene` for dark delete, `.sv-s*` for survey degradation, etc.). The body is just `<div id="root"></div>` and `<div id="overlay"></div>` plus `<script src="js/...">` tags.

2. **`js/` directory** — Vanilla JS split into 15 files, no framework. Load order matters only for `core.js` (must be first) and `router.js` (must be last):

| File | Lines | Contents |
|------|-------|----------|
| `core.js` | 232 | `S` state object, `incDepth()`, depth pill, overlay, toast, social proof, nav/footer helpers |
| `scenes-entry.js` | 601 | home, cookies, loading, newsletter, main, about, features, pricing, blog |
| `scenes-auth.js` | 410 | signin, forgot password, gameshow signup flow, verify |
| `scenes-onboard.js` | 792 | onboarding steps 0–8, early dashboard + dash sub-scenes |
| `scenes-checkout.js` | 340 | contact sales, checkout flow |
| `scenes-content.js` | 489 | inbox emails, demo, unsubscribe flow |
| `scenes-footer.js` | 612 | changelog, roadmap, status, careers, press, legal, docs, API, community, templates, webinars, security, privacy, terms |
| `scenes-dashboard.js` | 410 | expanded dashboard, billing, account settings |
| `scenes-delete.js` | 341 | delete account multi-step flow |
| `scenes-survey-help.js` | 546 | survey, help center, support ticket |
| `narrator.js` | 276 | dual-mode chat widget / narrator system |
| `scenes-session.js` | 183 | session expiry, data export, mobile prompt, checklist handler |
| `scenes-adventure.js` | 323 | point-and-click adventure game |
| `scenes-backrooms.js` | 710 | backrooms (100-room cycle, 4 stages) |
| `router.js` | 176 | `SCENES` dispatch table, click handler, `scene_home()` init |

   Key JS concepts:
   - **`S` object** — global state. All mutable session state lives here (depth counter, step counters, flags, timers).
   - **`incDepth()`** — called on every navigation. Drives the cross-cutting depth escalation system (see MAP.md).
   - **Scene functions** — every navigable "page" is a `scene_<name>()` function that writes HTML into `#root`. Navigation is triggered by `data-go="<scene_name>"` attributes on any element; a delegated click handler on `document` calls `scene_<name>()`.
   - **Narrator system** — a dual-mode chat widget that starts as a chatbot and gradually transforms into a literary narrator as depth increases.

## Navigation Model

Every link/button that navigates uses `data-go="<scene_name>"`. The root event listener intercepts clicks and routes to the corresponding `scene_<scene_name>()` function. The special value `close_overlay` clears the overlay without navigating.

`S.depth` increments on each call to `incDepth()`. At specific depth thresholds (6, 7, 10, 12, 14, 15, 16, 18, 20, 22), the site globally mutates — new UI elements appear, copy changes, modals fire. This is the core mechanic.

## Site Content Reference

`MAP.md` is the canonical document for all scenes, routing, narrative paths, depth escalation effects, loops, and dead ends. Read it before adding or modifying scenes to understand where a scene sits in the narrative arc and what behavior it should have.

`brainstorm.txt` contains future feature ideas — some implemented, some not. The overarching design principle: the deeper into a path a user goes, the more extreme and unpredictable the experience should become. All paths start at the same generic SaaS homepage.

## Key Design Principles

- The site satirizes real SaaS dark patterns: dark patterns must be recognizable before they become absurd
- Tone escalates with depth — early scenes are polished and plausible; late scenes are surreal or existential
- Certain paths cross-reference other paths (credentials, hints, hidden content)
- The depth pill, narrator widget, and social proof widget are cross-cutting — they appear across scenes and evolve with `S.depth`
