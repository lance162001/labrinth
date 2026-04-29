const S = {
  cookieAttempts: 0,
  newsletterShown: 0,
  signupStep: 0,
  signupEmail: '',
  verifyAttempts: 0,
  captchaDone: false,
  captchaImages: [],
  projectStep: 0,
  socialProofTimer: null,
  toastTimer: null,
  depth: 0,
  surveyStep: 0,
  deleteStep: 0,
  chatOpen: false,
  chatBotState: 0,
  settingsTab: 'profile',
  notifSaved: false,
  exportRequested: false,
  sessionTimer: null,
  onboardingDone: {},
  mobilePromptDismissals: 0,
  supportTicketId: null,
  ticketAutoClosed: false,
  annualBilling: true,
  surveyStarRating: 0,
  awarenesShown: false,
  billingVisits: 0,
  advInventory: [],
  inAdventure: false,
  brRoom: 0,
  brVisited: false,
  brBattery: null,
  brUrlPath: '',
  exportGlitchTimer: null,
  blogVisits: 0,
  lastBlogEra: '',
  projectName: '',
  nexusAIStep: 0,
  greetingStyle: '',
  invitesSent: false,
  deletionPending: false,
  prioritySupport: false,
  testMode: false,
  politeMode: false,
  nexusBackground: false,
  okrsAligned: false,
  fragments: new Set(),
};

function incDepth() {
  S.depth++;
  updateDepthPill();
  if (S.depth === 7 && !S.cookieDepthShown) {
    S.cookieDepthShown = true;
    setTimeout(() => {
      const box = document.createElement('div');
      box.className = 'cookie-box';
      box.style.zIndex = '300';
      box.innerHTML = `<div class="cookie-text"><p><strong>We've updated our cookies.</strong> Same cookies, new legal basis. Please re-confirm your preferences to continue using Nexus.</p></div><div class="cookie-actions"><button class="btn btn-secondary btn-sm" onclick="this.closest('.cookie-box').remove();scene_cookie_prefs()">Customize</button><button class="btn btn-primary" onclick="this.closest('.cookie-box').remove();toast('Preferences updated. Thank you.')">Accept Updated Cookies</button></div>`;
      document.body.appendChild(box);
    }, 1200);
  }
  if (S.depth === 14 && !S.awarenesShown) {
    S.awarenesShown = true;
    setTimeout(() => showAwarenessModal(), 2000);
  }
  if (S.depth === 20) {
    setTimeout(() => {
      toast('⚠ Nexus has detected unusual navigation patterns on your account.');
      setTimeout(() => toast('For your security, please verify your identity before continuing.'), 3000);
    }, 500);
  }
}

function updateDepthPill() {
  let pill = document.querySelector('.depth-pill');
  if (S.depth >= 6) {
    if (!pill) {
      pill = document.createElement('div');
      pill.className = 'depth-pill';
      document.body.appendChild(pill);
    }
    const labels = ['','','','','','','','','','','','Getting warmer…','','','','You\'ve clicked a lot of things.','','','','','Something is wrong.','','','Are you still there?'];
    pill.textContent = labels[Math.min(S.depth, labels.length-1)] || `${S.depth} pages visited`;
  }
}

function showAwarenessModal() {
  setOverlay(`<div class="backdrop"><div class="modal" style="max-width:400px"><div class="modal-body" style="padding:2rem;text-align:center">
    <div style="font-size:2rem;margin-bottom:1rem">👁</div>
    <h3 style="font-weight:700;margin-bottom:.5rem">We've noticed you.</h3>
    <p style="font-size:.875rem;color:var(--g500);line-height:1.6;margin-bottom:1.5rem">You've visited ${S.depth} pages in this session. That's more than 94% of our users. <br><br>We're not sure what you're looking for, but we want you to know: <strong>we're here for you.</strong></p>
    <button class="btn btn-primary" style="width:100%;margin-bottom:.5rem" data-go="close_overlay">OK, thank you</button>
    <div style="font-size:.72rem;color:var(--g300);margin-top:.5rem">A member of our Customer Success team has been notified of your session.</div>
  </div></div></div>`);
}

const root = document.getElementById('root');
const overlay = document.getElementById('overlay');

function setOverlay(html) {
  overlay.innerHTML = html;
  overlay.classList.toggle('active', !!html);
}

function toast(msg, duration = 3000) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), duration);
}

function socialProof() {
  const normal = [
    '🟢 <span>Marcus from Austin</span> just signed up',
    '🟢 <span>Priya from London</span> started a free trial',
    '🟢 <span>Tom from Berlin</span> upgraded to Pro',
    '🟢 <span>Sara from NYC</span> created a project',
    '🟢 <span>Wei from Singapore</span> invited their team',
  ];
  const weird = [
    '🟡 <span>Someone</span> has been on the pricing page for 38 minutes',
    '🟡 <span>A user</span> clicked "reject cookies" 6 times',
    '🟡 <span>Dave</span> started deleting his account but didn\'t finish',
    '🟡 <span>3 users</span> are currently stuck on step 4 of 8',
    '🟡 <span>Anonymous</span> tried to find the unsubscribe link',
    '🔴 <span>A user</span> has not moved their mouse in 11 minutes',
  ];
  const surreal = [
    '👁 <span>Nexus</span> is watching your session',
    '🔴 <span>Your cursor</span> has been flagged for unusual behavior',
    '⚠ <span>Error</span> tried to upgrade to Pro and became an error',
    '🤖 <span>The concept of productivity</span> just signed up',
    '👁 <span>Someone</span> tried to leave. They could not.',
    '🔴 <span>You</span> have been on this website for a while now',
  ];
  let idx = 0;
  function show() {
    const existing = document.querySelector('.social-proof');
    if (existing) existing.remove();
    const el = document.createElement('div');
    el.className = 'social-proof';
    let pool = S.depth < 8 ? normal : S.depth < 15 ? weird : surreal;
    el.innerHTML = pool[idx % pool.length];
    idx++;
    document.body.appendChild(el);
    setTimeout(() => el && el.remove(), 4200);
  }
  show();
  S.socialProofTimer = setInterval(show, 5000);
}

function injectChatBtn() {
  if (document.querySelector('.chat-btn')) return;
  const btn = document.createElement('button');
  btn.className = 'chat-btn';
  btn.title = 'Chat with us';
  btn.innerHTML = '💬';
  btn.onclick = () => scene_chat();
  document.body.appendChild(btn);
  setInterval(() => {
    if (S.inAdventure) return;
    if (document.querySelector('.chat-btn') && !document.querySelector('.chat-panel')) {
      S.narratorHidden = false;
      openNarratorPanel(false);
    }
  }, 8000);
}

function removeChatBtn() {
  document.querySelector('.chat-btn')?.remove();
  document.querySelector('.chat-panel')?.remove();
}

function clearSocialProof() {
  clearInterval(S.socialProofTimer);
  document.querySelector('.social-proof')?.remove();
}

// ────────────────────────── NAV ──────────────────────────
function navHTML(active) {
  return `<nav class="nav">
    <a class="nav-logo" data-go="home"><span>Nex</span>us</a>
    <div class="nav-links">
      <button class="nav-link" data-go="nav_home">Home</button>
      <button class="nav-link" data-go="about">About</button>
      <button class="nav-link" data-go="features">Features</button>
      <button class="nav-link" data-go="pricing">Pricing</button>
      <button class="nav-link" data-go="blog">Blog</button>
      <button class="nav-link" data-go="signin">Sign In</button>
      <button class="nav-cta" data-go="pricing">Get Started</button>
    </div>
  </nav>`;
}

function footerHTML() {
  return `<footer class="footer">
    <div class="footer-inner">
      ${[
        ['Product',['Features','Pricing','Changelog','Roadmap','Status']],
        ['Company',['About','Blog','Careers','Press','Legal']],
        ['Resources',['Documentation','API Reference','Community','Templates','Webinars','Interactive Tour']],
        ['Support',['Help Center','Contact Us','Security','Privacy Policy','Survey','Unsubscribe']],
      ].map(([title,links])=>`
        <div class="footer-col">
          <h4>${title}</h4>
          ${links.map(l=>`<a data-go="${
            l==='Features'?'features':
            l==='Pricing'?'pricing':
            l==='Changelog'?'changelog':
            l==='Roadmap'?'roadmap':
            l==='Status'?'site_status':
            l==='About'?'about':
            l==='Blog'?'blog':
            l==='Careers'?'careers':
            l==='Press'?'press':
            l==='Legal'?'legal':
            l==='Documentation'?'docs':
            l==='API Reference'?'api_ref':
            l==='Community'?'community':
            l==='Templates'?'templates':
            l==='Webinars'?'webinars':
            l==='Interactive Tour'?'adv_intro':
            l==='Help Center'?'help':
            l==='Contact Us'?'contact_sales':
            l==='Security'?'security_page':
            l==='Privacy Policy'?'privacy':
            l==='Survey'?'survey':
            l==='Unsubscribe'?'unsubscribe':
            'footer_dead'}">${l}</a>`).join('')}
        </div>`).join('')}
    </div>
    <div class="footer-bottom">
      <span>© 2024 Nexus Technologies Inc. All rights reserved. Nexus™ is a registered trademark.</span>
      <div style="display:flex;gap:1rem">
        <a data-go="privacy" style="cursor:pointer">Privacy</a>
        <a data-go="terms" style="cursor:pointer">Terms</a>
        <a data-go="cookie_prefs" style="cursor:pointer">Cookies</a>
      </div>
    </div>
  </footer>`;
}

function fragHotspot(key, label, chars, top, left) {
  const found = S.fragments.has(key);
  const cls = found ? 'frag-hotspot found' : 'frag-hotspot';
  const handler = found ? '' : ` onclick="collectFrag('${key}','${label}','${chars}')"`;
  return `<div class="${cls}" style="top:${top};left:${left}"${handler}></div>`;
}

function collectFrag(key, label, chars) {
  if (S.fragments.has(key)) return;
  S.fragments.add(key);
  toast(`${label} ${chars}`, 4500);
}

