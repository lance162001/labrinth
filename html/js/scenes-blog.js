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
