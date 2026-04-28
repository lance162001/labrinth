# Blog Era Grab-Bag Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single-era blog scene with a grab-bag of 8 web design eras (1995–2024) that reshuffles on every navigation.

**Architecture:** `scene_blog()` moves to a new `scenes-blog.js` file. An era array and a visit counter on `S` drive selection: first visit always shows the 2024 AI Slop era; subsequent calls pick randomly from all 8 eras, avoiding repeating the same era back-to-back. All links inside the blog that previously navigated away now point back to `blog`, so every click reshuffles the era.

**Tech Stack:** Vanilla JS, inline styles, no framework, no build step. Serve with `python3 -m http.server` from `html/` to test.

---

## File Map

| File | Action | What changes |
|---|---|---|
| `html/js/core.js` | Modify | Add `blogVisits: 0` and `lastBlogEra: ''` to `S` |
| `html/index.html` | Modify | Add `<script src="js/scenes-blog.js">` before `router.js`; remove 4 `.wp-*` CSS classes |
| `html/js/scenes-entry.js` | Modify | Delete `scene_blog()` (lines 543–601) |
| `html/js/scenes-blog.js` | Create | All 8 era functions, `BLOG_POSTS` data, era dispatcher, `scene_blog()` |

---

## Task 1: Wire up scaffolding

**Files:**
- Modify: `html/js/core.js` (line 35, inside `S` object)
- Modify: `html/index.html` (line 300 area: CSS removal; line 527: script tag)
- Modify: `html/js/scenes-entry.js` (lines 543–601: delete `scene_blog`)

- [ ] **Step 1: Add `blogVisits` and `lastBlogEra` to `S` in `core.js`**

In `html/js/core.js`, add two lines to the `S` object before the closing `};` (after line 35 `brUrlPath: '',`):

```javascript
  blogVisits: 0,
  lastBlogEra: '',
```

Result: the `S` object's last few lines look like:
```javascript
  brUrlPath: '',
  exportGlitchTimer: null,
  blogVisits: 0,
  lastBlogEra: '',
};
```

- [ ] **Step 2: Remove the 4 `.wp-*` CSS classes from `index.html`**

In `html/index.html`, find and delete these 4 lines from the `<style>` block (around line 302):

```css
.wp-post{background:#fff;border:1px solid #ddd;padding:1.25rem;margin-bottom:1rem}
.wp-meta{font-size:.75rem;color:#888;margin-bottom:.5rem}
.wp-title{font-size:1.1rem;font-weight:700;color:#21759B;cursor:pointer;margin-bottom:.4rem}
.wp-excerpt{font-size:.85rem;color:#444;line-height:1.6}
```

- [ ] **Step 3: Add the `scenes-blog.js` script tag to `index.html`**

In `html/index.html`, after the `scenes-backrooms.js` line and before `router.js`:

```html
<script src="js/scenes-backrooms.js"></script>
<script src="js/scenes-blog.js"></script>
<script src="js/router.js"></script>
```

- [ ] **Step 4: Delete `scene_blog()` from `scenes-entry.js`**

Remove lines 543–600 (the entire `scene_blog()` function and its closing `}`) from `html/js/scenes-entry.js`. The file should end at line 542 (`// end of scenes-entry`) or whatever precedes `scene_blog`. Confirm the file now ends after `scene_newsletter_done` or whichever function preceded it.

- [ ] **Step 5: Commit**

```bash
git add html/js/core.js html/index.html html/js/scenes-entry.js
git commit -m "refactor(blog): wire scaffolding for era grab-bag"
```

---

## Task 2: Create `scenes-blog.js` with dispatcher + WordPress era

**Files:**
- Create: `html/js/scenes-blog.js`

- [ ] **Step 1: Create `scenes-blog.js` with the dispatcher and WordPress era**

Create `html/js/scenes-blog.js` with this full content:

```javascript
const BLOG_POSTS = [
  {
    title: 'The Future of Productivity Is Here (And It Is Us)',
    date: 'April 4, 2009',
    author: 'admin',
    cats: 'Productivity, Synergy',
    excerpt: 'It is with great pride that we announce the launch of the official Nexus Blog. Here, we will share thought leadership content, tips, and insights about productivity and digital transformation. We believe the future of work is collaborative. We are here to help you navigate it. Please subscribe.',
    mins: 4,
  },
  {
    title: '10 Tips for Maximum Synergy in the Modern Workplace',
    date: 'March 18, 2009',
    author: 'jordanp',
    cats: 'Tips, Strategy',
    excerpt: "Synergy. It's a word we hear a lot. But what does it really mean? In this post, we explore 10 actionable tips for creating a truly synergistic environment. Tip 1: Communicate. Tip 2: Communicate more. Tip 3: Have you considered switching to a platform like Nexus?",
    mins: 6,
  },
  {
    title: 'Why Your Current Tools Are Actively Failing You',
    date: 'February 28, 2009',
    author: 'admin',
    cats: 'Industry Insights',
    excerpt: "Are you still using spreadsheets? Email? Post-it notes? Legacy tools cannot keep up with the pace of the modern knowledge worker. Nexus was built from the ground up to solve the problems you didn't know you had. We did the research. You don't have to.",
    mins: 5,
  },
  {
    title: 'Hello World!',
    date: 'January 1, 2009',
    author: 'admin',
    cats: 'Uncategorized',
    excerpt: 'Welcome to the Nexus Blog. This is our first post. We are excited to share updates, news, and thought leadership content in the coming months. Stay tuned. Good things are coming.',
    mins: 2,
  },
];

const BLOG_ERA_KEYS = ['aislop', 'medium', 'wordpress', 'bootstrap', 'web2', 'livejournal', 'geocities', 'earlyweb'];

function scene_blog() {
  incDepth();
  S.blogVisits++;
  let era;
  if (S.blogVisits === 1) {
    era = 'aislop';
  } else {
    const pool = BLOG_ERA_KEYS.filter(e => e !== S.lastBlogEra);
    era = pool[Math.floor(Math.random() * pool.length)];
  }
  S.lastBlogEra = era;
  BLOG_ERA_FNS[era]();
}

const BLOG_ERA_FNS = {
  aislop: scene_blog_aislop,
  medium: scene_blog_medium,
  wordpress: scene_blog_wordpress,
  bootstrap: scene_blog_bootstrap,
  web2: scene_blog_web2,
  livejournal: scene_blog_livejournal,
  geocities: scene_blog_geocities,
  earlyweb: scene_blog_earlyweb,
};

function scene_blog_wordpress() {
  root.innerHTML = `
  <div style="background:#f1f1f1;min-height:100vh;font-family:Georgia,serif">
    <div style="background:#1e1e1e;border-bottom:4px solid #21759b">
      <div style="max-width:980px;margin:0 auto;padding:.7rem 1rem;display:flex;align-items:center;justify-content:space-between">
        <div style="color:#fff;font-size:1.65rem;font-weight:700;font-family:Georgia,serif">The Nexus Blog</div>
        <div style="font-size:.68rem;color:#666;font-family:Arial">Just another WordPress site</div>
      </div>
    </div>
    <div style="background:#21759b;padding:.3rem 0">
      <div style="max-width:980px;margin:0 auto;padding:0 1rem;display:flex;gap:1.5rem">
        ${[['Home','main'],['About','about'],['Archives','blog'],['Contact','contact_sales']].map(([l,g])=>`<a data-go="${g}" style="color:#fff;font-size:.78rem;font-family:Arial;cursor:pointer;text-decoration:none;padding:.2rem 0">${l}</a>`).join('')}
      </div>
    </div>
    <div style="max-width:980px;margin:0 auto;padding:1.5rem 1rem;display:grid;grid-template-columns:1fr 230px;gap:1.5rem">
      <div>
        ${BLOG_POSTS.map(p=>`
        <div style="background:#fff;border:1px solid #ddd;padding:1.25rem;margin-bottom:1rem">
          <div style="font-size:1.1rem;font-weight:700;color:#21759B;cursor:pointer;margin-bottom:.4rem" data-go="blog">${p.title}</div>
          <div style="font-size:.75rem;color:#888;margin-bottom:.5rem">Posted on ${p.date} by <a data-go="blog" style="color:#21759B;cursor:pointer">${p.author}</a> | Filed under: <a data-go="blog" style="color:#21759B;cursor:pointer">${p.cats}</a> | <a data-go="blog" style="color:#21759B;cursor:pointer">4 Comments</a></div>
          <div style="font-size:.85rem;color:#444;line-height:1.6">${p.excerpt}</div>
          <div style="margin-top:.75rem;font-size:.78rem;font-family:Arial"><a data-go="blog" style="color:#21759B;cursor:pointer">Read more »</a></div>
        </div>`).join('')}
        <div style="font-size:.8rem;color:#888;font-family:Arial;text-align:center;padding:.75rem">« <a data-go="blog" style="color:#21759B;cursor:pointer">Newer posts</a> | <a data-go="blog" style="color:#21759B;cursor:pointer">Older posts</a> »</div>
      </div>
      <div>
        <div style="background:#fff;border:1px solid #ddd;padding:.85rem;margin-bottom:1rem">
          <h3 style="font-size:.82rem;font-family:Arial;font-weight:700;text-transform:uppercase;color:#555;border-bottom:1px solid #ddd;padding-bottom:.35rem;margin-bottom:.65rem">Search</h3>
          <div style="display:flex;gap:.25rem"><input type="text" placeholder="Search…" style="flex:1;font-size:.72rem;padding:.25rem .4rem;border:1px solid #ccc;border-radius:0;font-family:Arial"><button style="background:#21759b;color:#fff;border:none;padding:.25rem .6rem;font-size:.68rem;cursor:pointer" onclick="toast('Search index is currently rebuilding. Please check back later.')">Go</button></div>
        </div>
        <div style="background:#fff;border:1px solid #ddd;padding:.85rem;margin-bottom:1rem">
          <h3 style="font-size:.82rem;font-family:Arial;font-weight:700;text-transform:uppercase;color:#555;border-bottom:1px solid #ddd;padding-bottom:.35rem;margin-bottom:.65rem">Recent Posts</h3>
          ${BLOG_POSTS.map(p=>`<div style="font-size:.78rem;padding:.18rem 0"><a data-go="blog" style="color:#21759B;cursor:pointer">» ${p.title}</a></div>`).join('')}
        </div>
        <div style="background:#fff;border:1px solid #ddd;padding:.85rem;margin-bottom:1rem">
          <h3 style="font-size:.82rem;font-family:Arial;font-weight:700;text-transform:uppercase;color:#555;border-bottom:1px solid #ddd;padding-bottom:.35rem;margin-bottom:.65rem">Tag Cloud</h3>
          <div style="display:flex;flex-wrap:wrap;gap:.3rem;line-height:1.8">
            ${[['synergy',20],['productivity',18],['tools',14],['collaboration',16],['digital',12],['transformation',15],['AI',11],['enterprise',13],['workflow',14],['SaaS',11],['disruption',13],['thought leadership',10]].map(([t,s])=>`<a data-go="blog" style="font-size:${s}px;color:#21759B;cursor:pointer;text-decoration:none">${t}</a>`).join(' ')}
          </div>
        </div>
        <div style="background:#fff;border:1px solid #ddd;padding:.85rem">
          <h3 style="font-size:.82rem;font-family:Arial;font-weight:700;text-transform:uppercase;color:#555;border-bottom:1px solid #ddd;padding-bottom:.35rem;margin-bottom:.65rem">Meta</h3>
          ${[['Log in','signin'],['Entries RSS','footer_dead'],['Comments RSS','footer_dead'],['WordPress.org','footer_dead']].map(([l,g])=>`<div style="font-size:.78rem;padding:.15rem 0"><a data-go="${g}" style="color:#21759B;cursor:pointer">» ${l}</a></div>`).join('')}
        </div>
      </div>
    </div>
    <div style="background:#1e1e1e;text-align:center;padding:.65rem;font-size:.62rem;color:#555;font-family:Arial">
      The Nexus Blog &nbsp;·&nbsp; Proudly powered by <a data-go="footer_dead" style="color:#21759B;cursor:pointer">WordPress</a> &nbsp;·&nbsp; Theme: Kubrick &nbsp;·&nbsp; <a data-go="main" style="color:#21759B;cursor:pointer">← Return to Nexus</a>
    </div>
  </div>`;
  setOverlay('');
}

function scene_blog_aislop() {}
function scene_blog_medium() {}
function scene_blog_bootstrap() {}
function scene_blog_web2() {}
function scene_blog_livejournal() {}
function scene_blog_geocities() {}
function scene_blog_earlyweb() {}
```

- [ ] **Step 2: Serve and verify**

```bash
cd html && python3 -m http.server 8080
```

Open `http://localhost:8080`. Click "Blog" from the nav. Confirm: the AI Slop era fires first (empty — that's expected until Task 3). Click any link on the page, then click Blog again; should not crash. Check the console for JS errors.

- [ ] **Step 3: Commit**

```bash
git add html/js/scenes-blog.js
git commit -m "feat(blog): add dispatcher skeleton + WordPress Kubrick era"
```

---

## Task 3: Add 2024 AI Slop era

**Files:**
- Modify: `html/js/scenes-blog.js` — replace empty `scene_blog_aislop()` stub

- [ ] **Step 1: Replace the `scene_blog_aislop` stub with the full implementation**

```javascript
function scene_blog_aislop() {
  const aiTitles = [
    'Unlocking Synergistic Productivity: A Comprehensive Deep-Dive Into the Future of Collaborative Work Ecosystems',
    '10 Evidence-Based Strategies for Maximizing Synergy in the Modern Distributed Workplace Environment',
    'The Hidden Crisis in Legacy Tooling: How Outdated Workflows Are Silently Eroding Your Competitive Advantage',
    'Hello World: Introducing the NexusAI Blog, Your Premier Destination for AI-Curated Enterprise Insights',
  ];
  root.innerHTML = `
  <div style="background:#f8f8ff;min-height:100vh;font-family:Inter,system-ui,sans-serif">
    <div style="background:#fff;border-bottom:1px solid #e5e7eb;padding:.75rem 1.5rem;display:flex;align-items:center;justify-content:space-between">
      <div style="display:flex;align-items:center;gap:.5rem">
        <div style="width:20px;height:20px;background:linear-gradient(135deg,#6366f1,#ec4899);border-radius:50%"></div>
        <span style="font-weight:700;font-size:.95rem;color:#111">Nexus <span style="color:#6366f1">AI</span> Blog</span>
      </div>
      <span style="font-size:.65rem;background:#ede9fe;color:#6366f1;padding:.2rem .5rem;border-radius:12px;font-weight:600">NexusAI Content Engine™</span>
    </div>
    <div style="max-width:780px;margin:0 auto;padding:2rem 1rem">
      ${BLOG_POSTS.map((p,i)=>`
      <div style="background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:1.5rem;margin-bottom:1.25rem">
        <div style="font-size:.6rem;color:#6366f1;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin-bottom:.5rem">${p.cats.split(',')[0].trim()}</div>
        <div style="font-size:1rem;font-weight:700;color:#111;line-height:1.35;margin-bottom:.5rem;cursor:pointer" data-go="blog">${aiTitles[i]}</div>
        <div style="font-size:.65rem;color:#9ca3af;margin-bottom:.75rem">Generated by NexusAI &nbsp;·&nbsp; 2,400 words &nbsp;·&nbsp; ${p.mins + 8} min read &nbsp;·&nbsp; Fact-checked by our team*</div>
        <div style="font-size:.82rem;color:#555;line-height:1.65;margin-bottom:.75rem">${p.excerpt}</div>
        <div style="display:flex;align-items:center;justify-content:space-between">
          <a data-go="blog" style="font-size:.75rem;color:#6366f1;cursor:pointer;text-decoration:none;font-weight:600">Continue reading →</a>
          <div style="font-size:.55rem;color:#d1d5db">📊 ${Math.floor(Math.random()*800)+200} engagements</div>
        </div>
      </div>`).join('')}
      <div style="font-size:.55rem;color:#9ca3af;text-align:center;padding:1rem;font-style:italic">
        *Team review pending. This content was created to help synergize your workflow engagement journey.
        &nbsp;·&nbsp; <a data-go="main" style="color:#6366f1;cursor:pointer">← Return to Nexus</a>
      </div>
    </div>
  </div>`;
  setOverlay('');
}
```

- [ ] **Step 2: Verify in browser**

Reload `http://localhost:8080`. Click Blog — should now show the AI Slop era with purple branding, inflated titles, and "Generated by NexusAI" metadata. Click any "Continue reading →" link — page should reshuffle to a different era (currently only WordPress is non-empty, so you'll see that or another blank stub; no crash is the pass condition).

- [ ] **Step 3: Commit**

```bash
git add html/js/scenes-blog.js
git commit -m "feat(blog): add 2024 AI Slop era"
```

---

## Task 4: Add 2015 Medium era

**Files:**
- Modify: `html/js/scenes-blog.js` — replace empty `scene_blog_medium()` stub

- [ ] **Step 1: Replace the `scene_blog_medium` stub**

```javascript
function scene_blog_medium() {
  root.innerHTML = `
  <div style="background:#fff;min-height:100vh;font-family:Georgia,serif">
    <div style="border-bottom:1px solid #e6e6e6;padding:.75rem 1.5rem;display:flex;align-items:center;justify-content:space-between">
      <div style="font-size:1.1rem;font-weight:700;letter-spacing:-1px;color:#111">Nexus Blog</div>
      <div style="display:flex;gap:1rem;font-size:.7rem;font-family:system-ui,sans-serif;color:#aaa">
        <a data-go="main" style="color:#aaa;cursor:pointer;text-decoration:none">Sign in</a>
        <a data-go="signin" style="background:#1a8917;color:#fff;padding:.3rem .8rem;border-radius:2rem;cursor:pointer;text-decoration:none">Get started</a>
      </div>
    </div>
    <div style="max-width:680px;margin:0 auto;padding:3rem 1rem">
      ${BLOG_POSTS.map(p=>`
      <div style="display:flex;gap:1.5rem;margin-bottom:2.5rem;padding-bottom:2.5rem;border-bottom:1px solid #f2f2f2;align-items:flex-start">
        <div style="flex:1">
          <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.75rem">
            <div style="width:20px;height:20px;background:#ddd;border-radius:50%"></div>
            <span style="font-size:.75rem;font-family:system-ui;color:#555">${p.author}</span>
          </div>
          <div style="font-size:1.2rem;font-weight:700;color:#111;line-height:1.3;margin-bottom:.4rem;cursor:pointer" data-go="blog">${p.title}</div>
          <div style="font-size:.88rem;color:#757575;line-height:1.5;font-family:system-ui;margin-bottom:.75rem">${p.excerpt.slice(0,120)}…</div>
          <div style="display:flex;align-items:center;gap:.75rem;font-size:.7rem;font-family:system-ui;color:#aaa">
            <span>${p.date}</span>
            <span>${p.mins} min read</span>
            <span data-go="blog" style="cursor:pointer">♥</span>
            <span data-go="blog" style="cursor:pointer">💬 4</span>
            <span data-go="blog" style="cursor:pointer">🔖</span>
          </div>
        </div>
        <div style="width:80px;height:80px;background:#f2f2f2;flex-shrink:0;border-radius:2px"></div>
      </div>`).join('')}
      <div style="text-align:center;font-size:.72rem;font-family:system-ui;color:#aaa;padding:.5rem">
        <a data-go="blog" style="color:#aaa;cursor:pointer;text-decoration:none">Load more stories</a>
        &nbsp;·&nbsp; <a data-go="main" style="color:#aaa;cursor:pointer;text-decoration:none">← Return to Nexus</a>
      </div>
    </div>
    <div style="position:fixed;left:1rem;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:.75rem;font-size:1rem">
      <span data-go="blog" style="cursor:pointer;opacity:.35;color:#111" title="Clap">♥</span>
      <span data-go="blog" style="cursor:pointer;opacity:.35;color:#111" title="Comment">💬</span>
      <span data-go="blog" style="cursor:pointer;opacity:.35;color:#111" title="Save">🔖</span>
    </div>
  </div>`;
  setOverlay('');
}
```

- [ ] **Step 2: Verify in browser**

Reload and click Blog several times. The Medium era should now appear in the rotation — clean white, big serif titles, floating left social bar, author avatars, "X min read." No JS errors.

- [ ] **Step 3: Commit**

```bash
git add html/js/scenes-blog.js
git commit -m "feat(blog): add 2015 Medium era"
```

---

## Task 5: Add 2013 Bootstrap Flat era

**Files:**
- Modify: `html/js/scenes-blog.js` — replace empty `scene_blog_bootstrap()` stub

- [ ] **Step 1: Replace the `scene_blog_bootstrap` stub**

```javascript
function scene_blog_bootstrap() {
  root.innerHTML = `
  <div style="background:#f8f9fa;min-height:100vh;font-family:Helvetica,Arial,sans-serif">
    <nav style="background:#343a40;padding:.5rem 1rem;display:flex;align-items:center;justify-content:space-between">
      <span style="color:#fff;font-weight:700;font-size:.9rem">Nexus Blog</span>
      <div style="display:flex;gap:1rem">
        ${[['Home','main'],['About','about'],['Contact','contact_sales']].map(([l,g])=>`<a data-go="${g}" style="color:#adb5bd;font-size:.75rem;cursor:pointer;text-decoration:none">${l}</a>`).join('')}
      </div>
    </nav>
    <div style="max-width:960px;margin:0 auto;padding:1.5rem 1rem;display:grid;grid-template-columns:1fr 280px;gap:1.5rem">
      <div>
        <nav style="font-size:.72rem;color:#6c757d;margin-bottom:1rem">
          <a data-go="main" style="color:#007bff;cursor:pointer;text-decoration:none">Home</a> / Blog
        </nav>
        ${BLOG_POSTS.map(p=>`
        <div style="background:#fff;border:1px solid #dee2e6;border-radius:4px;padding:1.25rem;margin-bottom:1rem">
          <div style="font-size:1rem;font-weight:700;color:#212529;margin-bottom:.35rem;cursor:pointer" data-go="blog">${p.title}</div>
          <div style="font-size:.7rem;color:#6c757d;margin-bottom:.75rem">
            📅 ${p.date} &nbsp;·&nbsp; 👤 ${p.author} &nbsp;·&nbsp;
            <span style="background:#e9ecef;padding:.1rem .35rem;border-radius:3px">${p.cats.split(',')[0].trim()}</span>
          </div>
          <div style="font-size:.82rem;color:#495057;line-height:1.6;margin-bottom:.85rem">${p.excerpt}</div>
          <a data-go="blog" style="background:#007bff;color:#fff;font-size:.72rem;padding:.3rem .7rem;border-radius:3px;cursor:pointer;text-decoration:none;display:inline-block">Read More</a>
        </div>`).join('')}
        <div style="font-size:.75rem;color:#6c757d;text-align:center;padding:.5rem">
          <a data-go="blog" style="color:#007bff;cursor:pointer;text-decoration:none">« Newer</a> &nbsp;|&nbsp;
          <a data-go="blog" style="color:#007bff;cursor:pointer;text-decoration:none">Older »</a>
        </div>
      </div>
      <div>
        <div style="background:#fff;border:1px solid #dee2e6;border-radius:4px;padding:1rem;margin-bottom:1rem">
          <div style="font-size:.75rem;font-weight:700;color:#212529;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #dee2e6;padding-bottom:.5rem;margin-bottom:.75rem">Categories</div>
          ${[['Productivity','12'],['Synergy','8'],['Tips','6'],['Industry Insights','4'],['Uncategorized','1']].map(([c,n])=>`
          <div style="display:flex;justify-content:space-between;font-size:.75rem;padding:.2rem 0">
            <a data-go="blog" style="color:#007bff;cursor:pointer;text-decoration:none">${c}</a>
            <span style="background:#6c757d;color:#fff;font-size:.6rem;padding:.1rem .35rem;border-radius:10px">${n}</span>
          </div>`).join('')}
        </div>
        <div style="background:#fff;border:1px solid #dee2e6;border-radius:4px;padding:1rem">
          <div style="font-size:.75rem;font-weight:700;color:#212529;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #dee2e6;padding-bottom:.5rem;margin-bottom:.75rem">Recent Posts</div>
          ${BLOG_POSTS.map(p=>`<div style="font-size:.75rem;padding:.2rem 0"><a data-go="blog" style="color:#007bff;cursor:pointer;text-decoration:none">» ${p.title.slice(0,40)}…</a></div>`).join('')}
        </div>
      </div>
    </div>
    <footer style="background:#343a40;color:#adb5bd;text-align:center;padding:.6rem;font-size:.65rem">
      © 2013 Nexus &nbsp;·&nbsp; <a data-go="main" style="color:#6c757d;cursor:pointer;text-decoration:none">← Return to Nexus</a>
    </footer>
  </div>`;
  setOverlay('');
}
```

- [ ] **Step 2: Verify in browser**

Reload and navigate to Blog several times. Bootstrap Flat should appear: dark navbar, flat blue buttons, breadcrumb, category badge counts, Helvetica/grey palette. No JS errors.

- [ ] **Step 3: Commit**

```bash
git add html/js/scenes-blog.js
git commit -m "feat(blog): add 2013 Bootstrap Flat era"
```

---

## Task 6: Add 2006 Web 2.0 era

**Files:**
- Modify: `html/js/scenes-blog.js` — replace empty `scene_blog_web2()` stub

- [ ] **Step 1: Replace the `scene_blog_web2` stub**

```javascript
function scene_blog_web2() {
  root.innerHTML = `
  <div style="background:#e8eef5;min-height:100vh;font-family:Arial,Verdana,sans-serif">
    <div style="background:linear-gradient(180deg,#4a90d9 0%,#2c6fad 100%);padding:.6rem 1rem;display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid #1a4f82">
      <div style="display:flex;align-items:center;gap:.5rem">
        <span style="color:#fff;font-size:1.1rem;font-weight:700;text-shadow:0 1px 2px rgba(0,0,0,.3)">The Nexus Blog</span>
        <span style="background:#ff6600;color:#fff;font-size:.5rem;padding:.15rem .35rem;border-radius:3px;font-weight:700">BETA</span>
      </div>
      <div style="display:flex;gap:.5rem;align-items:center">
        <div style="background:#ff6600;color:#fff;font-size:.5rem;font-weight:700;padding:.2rem .4rem;border-radius:2px;cursor:pointer" data-go="footer_dead">RSS</div>
        <div style="background:linear-gradient(180deg,#fff,#ddd);border:1px solid #aaa;font-size:.6rem;padding:.2rem .5rem;border-radius:3px;cursor:pointer" data-go="signin">Sign In</div>
      </div>
    </div>
    <div style="background:linear-gradient(180deg,#5ba3e0,#4a90d9);padding:.25rem 1rem;display:flex;gap:1rem">
      ${[['Home','main'],['Archives','blog'],['About','about'],['Contact','contact_sales']].map(([l,g])=>`<a data-go="${g}" style="color:#fff;font-size:.7rem;cursor:pointer;text-decoration:none;text-shadow:0 1px 1px rgba(0,0,0,.2)">${l}</a>`).join('')}
    </div>
    <div style="max-width:900px;margin:0 auto;padding:1.25rem 1rem;display:grid;grid-template-columns:1fr 210px;gap:1.25rem">
      <div>
        ${BLOG_POSTS.map(p=>`
        <div style="background:#fff;border:1px solid #c5d8ec;border-radius:6px;padding:1rem;margin-bottom:1rem;box-shadow:0 1px 3px rgba(0,0,0,.08)">
          <div style="font-size:1rem;font-weight:700;color:#2c6fad;cursor:pointer;margin-bottom:.3rem" data-go="blog">${p.title}</div>
          <div style="font-size:.65rem;color:#888;margin-bottom:.6rem">Posted ${p.date} by <a data-go="blog" style="color:#2c6fad;cursor:pointer">${p.author}</a> | ${p.cats}</div>
          <div style="font-size:.8rem;color:#444;line-height:1.55;margin-bottom:.65rem">${p.excerpt}</div>
          <div style="display:flex;align-items:center;gap:.5rem;font-size:.6rem;color:#888;flex-wrap:wrap">
            <span style="color:#e6a800;font-weight:700">★★★★☆</span>
            <span data-go="blog" style="cursor:pointer;color:#2c6fad;text-decoration:underline">Digg this!</span>
            <span data-go="blog" style="cursor:pointer;color:#2c6fad;text-decoration:underline">del.icio.us</span>
            <span data-go="blog" style="cursor:pointer;color:#2c6fad;text-decoration:underline">StumbleUpon</span>
            <span style="margin-left:auto"><a data-go="blog" style="color:#2c6fad;cursor:pointer;font-weight:700">Read more »</a></span>
          </div>
        </div>`).join('')}
        <div style="text-align:center;font-size:.75rem;color:#888">
          <a data-go="blog" style="color:#2c6fad;cursor:pointer">« Newer posts</a> &nbsp;|&nbsp;
          <a data-go="blog" style="color:#2c6fad;cursor:pointer">Older posts »</a>
        </div>
      </div>
      <div>
        <div style="background:#fff;border:1px solid #c5d8ec;border-radius:6px;padding:.85rem;margin-bottom:1rem">
          <div style="font-size:.7rem;font-weight:700;color:#2c6fad;text-transform:uppercase;border-bottom:1px solid #dde;padding-bottom:.35rem;margin-bottom:.65rem">🔍 AJAX Search</div>
          <div style="display:flex;gap:.25rem">
            <input type="text" placeholder="Search…" style="flex:1;font-size:.7rem;padding:.2rem .4rem;border:1px solid #c5d8ec;border-radius:3px">
            <button style="background:linear-gradient(180deg,#5ba3e0,#2c6fad);color:#fff;border:none;padding:.2rem .5rem;border-radius:3px;font-size:.65rem;cursor:pointer" onclick="toast('AJAX index rebuilding. Please try again later.')">Go</button>
          </div>
        </div>
        <div style="background:#fff;border:1px solid #c5d8ec;border-radius:6px;padding:.85rem;margin-bottom:1rem">
          <div style="font-size:.7rem;font-weight:700;color:#2c6fad;text-transform:uppercase;border-bottom:1px solid #dde;padding-bottom:.35rem;margin-bottom:.65rem">Recent Posts</div>
          ${BLOG_POSTS.map(p=>`<div style="font-size:.72rem;padding:.18rem 0"><a data-go="blog" style="color:#2c6fad;cursor:pointer">» ${p.title.slice(0,35)}…</a></div>`).join('')}
        </div>
        <div style="background:#fff;border:1px solid #c5d8ec;border-radius:6px;padding:.85rem">
          <div style="font-size:.7rem;font-weight:700;color:#2c6fad;text-transform:uppercase;border-bottom:1px solid #dde;padding-bottom:.35rem;margin-bottom:.65rem">Tag Cloud</div>
          <div style="display:flex;flex-wrap:wrap;gap:.3rem;line-height:1.8">
            ${[['synergy',20],['productivity',18],['tools',14],['collaboration',16],['digital',12],['transformation',15],['AI',11],['enterprise',13],['workflow',14]].map(([t,s])=>`<a data-go="blog" style="font-size:${s}px;color:#2c6fad;cursor:pointer;text-decoration:none">${t}</a>`).join(' ')}
          </div>
        </div>
      </div>
    </div>
    <div style="background:linear-gradient(180deg,#2c6fad,#1a4f82);text-align:center;padding:.5rem;font-size:.6rem;color:#8ab4d6">
      The Nexus Blog &nbsp;·&nbsp; Powered by <a data-go="footer_dead" style="color:#8ab4d6;cursor:pointer">WordPress 2.6</a> &nbsp;·&nbsp;
      <a data-go="main" style="color:#8ab4d6;cursor:pointer">← Return to Nexus</a>
    </div>
  </div>`;
  setOverlay('');
}
```

- [ ] **Step 2: Verify in browser**

Navigate to Blog several times. Web 2.0 era should appear: glossy gradient header, BETA badge, orange RSS chicklet, gold star ratings, Digg/del.icio.us/StumbleUpon share links. No JS errors.

- [ ] **Step 3: Commit**

```bash
git add html/js/scenes-blog.js
git commit -m "feat(blog): add 2006 Web 2.0 era"
```

---

## Task 7: Add 2003 LiveJournal era

**Files:**
- Modify: `html/js/scenes-blog.js` — replace empty `scene_blog_livejournal()` stub

- [ ] **Step 1: Replace the `scene_blog_livejournal` stub**

```javascript
function scene_blog_livejournal() {
  const ljExcerpts = [
    "so we finally launched the official blog. i don't know if anyone will read this but here we are lol. we believe in collaboration and digital transformation or whatever. please subscribe.",
    "synergy. it's like... a word we hear a lot? but what does it really mean. in this post we explore like 10 actionable tips. tip 1: communicate. tip 2: communicate more. anyway hope this helps",
    "okay so are you still using spreadsheets??? email?? post-it notes?? legacy tools cannot keep up with the pace of the modern knowledge worker and honestly i feel that on a spiritual level",
    "hello world!! this is our first post!! we're so excited to share updates and thought leadership content in the coming months. stay tuned. good things are coming 🌟",
  ];
  const blogroll = ['nexus-internal','productivity-queen','synergy-blog','digital-thoughts','workflow-wednesday','enterprise-diary','saas-feelings'];
  root.innerHTML = `
  <div style="background:#e8e8d0;min-height:100vh;font-family:Verdana,Geneva,sans-serif">
    <div style="background:#8b6f8b;padding:.5rem 1rem;display:flex;align-items:center;justify-content:space-between">
      <span style="color:#fff;font-size:.85rem;font-weight:700">nexusblog.livejournal.com</span>
      <div style="display:flex;gap:.75rem">
        ${[['userinfo','blog'],['friends','blog'],['calendar','blog'],['memories','blog']].map(([l,g])=>`<a data-go="${g}" style="color:#dcc8dc;font-size:.65rem;cursor:pointer;text-decoration:none">${l}</a>`).join('')}
      </div>
    </div>
    <div style="max-width:740px;margin:0 auto;padding:1rem;display:grid;grid-template-columns:1fr 175px;gap:1rem">
      <div>
        ${BLOG_POSTS.map((p,i)=>`
        <div style="background:#f0edd8;border:1px solid #c8c4a8;margin-bottom:.85rem;padding:.85rem">
          <div style="font-size:.65rem;color:#666;margin-bottom:.3rem"><strong>${p.date.toLowerCase()}</strong> | <strong>${p.author}</strong></div>
          <div style="font-size:.85rem;font-weight:700;color:#5b3f5b;margin-bottom:.3rem;cursor:pointer" data-go="blog">${p.title}</div>
          <div style="font-size:.6rem;color:#7a6a7a;font-style:italic;margin-bottom:.5rem">current mood: productive 📊 &nbsp;·&nbsp; music: lo-fi beats to synergize to</div>
          <div style="font-size:.75rem;color:#444;line-height:1.6;margin-bottom:.65rem">${ljExcerpts[i]}</div>
          <div style="font-size:.6rem;color:#666;display:flex;gap:.75rem;flex-wrap:wrap">
            <span>filed under: <a data-go="blog" style="color:#5b3f5b;cursor:pointer">${p.cats}</a></span>
            <span>|</span>
            <a data-go="blog" style="color:#5b3f5b;cursor:pointer">4 comments</a>
            <span>|</span>
            <a data-go="blog" style="color:#5b3f5b;cursor:pointer;text-decoration:none">🔒 friends only</a>
          </div>
        </div>`).join('')}
        <div style="font-size:.65rem;color:#888;text-align:center">
          <a data-go="blog" style="color:#5b3f5b;cursor:pointer">« previous 10</a> &nbsp;|&nbsp;
          <a data-go="blog" style="color:#5b3f5b;cursor:pointer">next 10 »</a>
        </div>
      </div>
      <div style="font-size:.7rem">
        <div style="background:#d8d4b8;border:1px solid #c8c4a8;padding:.65rem;margin-bottom:.75rem">
          <div style="font-weight:700;color:#5b3f5b;font-size:.65rem;text-transform:uppercase;margin-bottom:.4rem">navigation</div>
          ${[['recent entries','blog'],['calendar','blog'],['friends','blog'],['user info','blog'],['memories','blog']].map(([l,g])=>`<div style="padding:.1rem 0"><a data-go="${g}" style="color:#5b3f5b;cursor:pointer;text-decoration:none">» ${l}</a></div>`).join('')}
        </div>
        <div style="background:#d8d4b8;border:1px solid #c8c4a8;padding:.65rem">
          <div style="font-weight:700;color:#5b3f5b;font-size:.65rem;text-transform:uppercase;margin-bottom:.4rem">friends</div>
          ${blogroll.map(b=>`<div style="padding:.08rem 0"><a data-go="footer_dead" style="color:#5b3f5b;cursor:pointer;text-decoration:none">» ${b}</a></div>`).join('')}
        </div>
        <div style="background:#d8d4b8;border:1px solid #c8c4a8;padding:.65rem;margin-top:.75rem">
          <div style="font-size:.55rem;color:#888;text-align:center">
            <a data-go="main" style="color:#5b3f5b;cursor:pointer">← return to nexus</a>
          </div>
        </div>
      </div>
    </div>
  </div>`;
  setOverlay('');
}
```

- [ ] **Step 2: Verify in browser**

Navigate to Blog several times. LiveJournal era should appear: pastel olive background, purple header bar, lowercase earnest copy, "current mood: productive," blogroll sidebar. No JS errors.

- [ ] **Step 3: Commit**

```bash
git add html/js/scenes-blog.js
git commit -m "feat(blog): add 2003 LiveJournal era"
```

---

## Task 8: Add 1998 GeoCities era

**Files:**
- Modify: `html/js/scenes-blog.js` — replace empty `scene_blog_geocities()` stub

- [ ] **Step 1: Replace the `scene_blog_geocities` stub**

```javascript
function scene_blog_geocities() {
  root.innerHTML = `
  <div style="background:repeating-linear-gradient(45deg,#000080 0,#000080 4px,#000 4px,#000 12px);min-height:100vh;font-family:'Comic Sans MS','Comic Sans',cursive;color:#fff;padding:.5rem">
    <div style="text-align:center;padding:1rem 0 .5rem">
      <div style="font-size:1.5rem;color:#ffff00;font-weight:700">✨ THE NEXUS BLOG ✨</div>
      <div style="font-size:.7rem;color:#00ff00">🚧 UNDER CONSTRUCTION 🚧 PLEASE BEAR WITH US 🚧</div>
      <marquee style="font-size:.65rem;color:#ff00ff;margin:.3rem 0">*** WELCOME TO THE OFFICIAL NEXUS BLOG *** UPDATED DAILY *** BEST VIEWED IN NETSCAPE NAVIGATOR 4.0 *** RESOLUTION: 800×600 ***</marquee>
    </div>
    <table style="width:100%;max-width:680px;margin:0 auto;border-collapse:collapse">
      <tr>
        <td style="vertical-align:top;width:140px;padding-right:.75rem">
          <div style="background:#000080;border:2px solid #ffff00;padding:.5rem;margin-bottom:.75rem">
            <div style="font-size:.65rem;color:#ffff00;font-weight:700;border-bottom:1px solid #ffff00;margin-bottom:.35rem">NAVIGATION</div>
            ${[['🏠 HOME','main'],['📝 ARCHIVES','blog'],['📧 GUESTBOOK','footer_dead'],['💌 EMAIL US','footer_dead'],['🔗 COOL LINKS','cool_links']].map(([l,g])=>`<div style="font-size:.6rem;padding:.1rem 0"><a data-go="${g}" style="color:#00ff00;cursor:pointer;text-decoration:none">${l}</a></div>`).join('')}
          </div>
          <div style="background:#000080;border:2px solid #ffff00;padding:.5rem;text-align:center">
            <div style="font-size:.55rem;color:#ffff00;margin-bottom:.3rem">VISITOR COUNT</div>
            <div style="font-size:.8rem;color:#00ff00;font-family:monospace;letter-spacing:2px">000247</div>
            <div style="font-size:.45rem;color:#888;margin-top:.25rem">since Jan 1, 2009</div>
          </div>
        </td>
        <td style="vertical-align:top">
          ${BLOG_POSTS.map(p=>`
          <div style="background:#000066;border:2px solid #ff00ff;padding:.75rem;margin-bottom:.75rem">
            <div style="font-size:.85rem;color:#ffff00;font-weight:700;cursor:pointer;margin-bottom:.25rem" data-go="blog">${p.title}</div>
            <div style="font-size:.55rem;color:#00ffff;margin-bottom:.45rem">📅 ${p.date} | ✍️ ${p.author} | 📁 ${p.cats}</div>
            <div style="font-size:.72rem;color:#eee;line-height:1.55;margin-bottom:.5rem">${p.excerpt}</div>
            <a data-go="blog" style="font-size:.65rem;color:#ff00ff;cursor:pointer;text-decoration:underline">[ click here to read more!!! ]</a>
          </div>`).join('')}
        </td>
      </tr>
    </table>
    <div style="text-align:center;font-size:.5rem;color:#888;margin-top:.75rem;padding:.5rem">
      best viewed in Netscape Navigator 4.0 at 800×600 resolution &nbsp;·&nbsp;
      <a data-go="footer_dead" style="color:#888;cursor:pointer">sign my guestbook</a> &nbsp;·&nbsp;
      <a data-go="main" style="color:#888;cursor:pointer">← return to nexus</a>
    </div>
  </div>`;
  setOverlay('');
}
```

- [ ] **Step 2: Verify in browser**

Navigate to Blog several times. GeoCities era should appear: dark diagonal tiled background, Comic Sans, yellow neon title, green "UNDER CONSTRUCTION," scrolling marquee, hit counter, neon-bordered posts. No JS errors.

- [ ] **Step 3: Commit**

```bash
git add html/js/scenes-blog.js
git commit -m "feat(blog): add 1998 GeoCities era"
```

---

## Task 9: Add 1995 Early Web era + final verification

**Files:**
- Modify: `html/js/scenes-blog.js` — replace empty `scene_blog_earlyweb()` stub

- [ ] **Step 1: Replace the `scene_blog_earlyweb` stub**

```javascript
function scene_blog_earlyweb() {
  root.innerHTML = `
  <div style="background:#c0c0c0;min-height:100vh;font-family:Times,'Times New Roman',serif;color:#000;padding:.5rem 1rem;max-width:640px;margin:0 auto">
    <h1 style="font-size:1.4rem;margin:.5rem 0 .25rem">The Nexus Blog</h1>
    <hr style="border:2px solid #000;margin:.4rem 0">
    <p style="font-size:.75rem;margin:.25rem 0">
      <a data-go="main" style="color:#0000ff;cursor:pointer">Home</a> |
      <a data-go="about" style="color:#0000ff;cursor:pointer">About</a> |
      <a data-go="blog" style="color:#0000ff;cursor:pointer">Archives</a> |
      <a data-go="contact_sales" style="color:#0000ff;cursor:pointer">Contact</a>
    </p>
    <hr style="border:1px solid #000;margin:.4rem 0">
    ${BLOG_POSTS.map(p=>`
    <div style="margin:1rem 0">
      <h2 style="font-size:1rem;margin:.25rem 0"><a data-go="blog" style="color:#0000ff;cursor:pointer;text-decoration:underline">${p.title}</a></h2>
      <p style="font-size:.7rem;margin:.2rem 0"><em>${p.date}</em> — posted by ${p.author} — filed under ${p.cats}</p>
      <p style="font-size:.82rem;line-height:1.55;margin:.4rem 0">${p.excerpt}</p>
      <p style="font-size:.72rem;margin:.2rem 0">
        <a data-go="blog" style="color:#0000ff;cursor:pointer">[Read more]</a> |
        <a data-go="blog" style="color:#0000ff;cursor:pointer">[4 Comments]</a>
      </p>
      <hr style="border:1px solid #888;margin:.75rem 0">
    </div>`).join('')}
    <p style="font-size:.72rem;margin:.2rem 0">
      <a data-go="blog" style="color:#0000ff;cursor:pointer">[Newer posts]</a> |
      <a data-go="blog" style="color:#0000ff;cursor:pointer">[Older posts]</a>
    </p>
    <hr style="border:2px solid #000;margin:.4rem 0">
    <p style="font-size:.65rem;color:#444;margin:.25rem 0">
      Last updated: April 4, 2009. This page best viewed with Netscape Navigator 2.0.
      &nbsp;·&nbsp; <a data-go="main" style="color:#0000ff;cursor:pointer">Return to Nexus</a>
    </p>
  </div>`;
  setOverlay('');
}
```

- [ ] **Step 2: Full verification pass**

Reload `http://localhost:8080` and do a complete smoke test:

1. Navigate to Blog from the main nav — should show the AI Slop era (purple gradient, inflated titles, "NexusAI Content Engine™").
2. Click "Continue reading →" — should reshuffle to any other era. Repeat 8–10 times to confirm variety and no immediate repeat of the same era.
3. Confirm each era renders without JS console errors.
4. Confirm "Return to Nexus" / "Home" links go to `main` (not `blog`) in every era.
5. Confirm the search button in WordPress and Web 2.0 eras shows the "rebuilding" toast.
6. Confirm "Log in" in WordPress era goes to `signin`.
7. Navigate to Blog, then navigate away (e.g., Pricing), then back to Blog — should start a new random era (not force AI Slop again, since `blogVisits` > 1).

- [ ] **Step 3: Final commit**

```bash
git add html/js/scenes-blog.js
git commit -m "feat(blog): add 1995 Early Web era — all 8 eras complete"
```

---

## Self-Review Checklist (completed inline)

- **Spec coverage:** All 8 eras implemented ✓ · `S.blogVisits` + `S.lastBlogEra` ✓ · First-visit AI Slop ✓ · No-repeat guard ✓ · Navigation links all point to `blog` ✓ · WordPress era moved verbatim ✓ · `.wp-*` CSS removed ✓ · Script tag added ✓ · `scene_blog` removed from `scenes-entry.js` ✓
- **Placeholders:** None — all tasks have full code
- **Type consistency:** `BLOG_POSTS` array used consistently across all era functions · `BLOG_ERA_FNS` keys match `BLOG_ERA_KEYS` array · `S.blogVisits` and `S.lastBlogEra` initialized in Task 1 and consumed in `scene_blog()` ✓
