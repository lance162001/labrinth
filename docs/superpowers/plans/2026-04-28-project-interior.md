# Project Interior Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `scene_project()` that the user lands in after creating a project — a NexusAI-managed view that looks almost real on load and falls apart the moment the user interacts with it, with persistent state side-effects across the dashboard and billing.

**Architecture:** Pure vanilla JS. One new scene function added to `scenes-dashboard.js`. Global helper functions `garbleProjectName`, `nexusResponse`, and `sendNexusMessage` added to the same file. State flags live on the existing `S` object in `core.js`. All cross-scene effects are implemented as conditional checks in existing render functions (`dashNavHTML`, `dashSidebar`, `scene_dashboard`, `scene_billing`).

**Tech Stack:** Vanilla JS, CSS variables, `setTimeout` for timing. No build step — serve `html/` with `python3 -m http.server` and open `http://localhost:8000`.

---

## File Map

| File | Change |
|---|---|
| `html/js/core.js` | Add 10 new state fields to `S` |
| `html/js/router.js` | Add `project: scene_project` to `SCENES` |
| `html/js/scenes-onboard.js` | Capture `S.projectName` in `scene_proj_next()`; change final callback in `showProjectModal()` from `scene_dashboard()` to `scene_project()` |
| `html/js/scenes-dashboard.js` | Update `dashNavHTML()`, `dashSidebar()`, `scene_dashboard()`, `scene_billing()`; add `scene_project()`, `nexusResponse()`, `sendNexusMessage()` |
| `html/js/narrator.js` | Add narrator entry for `project` |

---

## Task 1: Add state fields to `S` in `core.js`

**Files:**
- Modify: `html/js/core.js:1-38`

- [ ] **Step 1: Add new fields to the S object**

Open `html/js/core.js`. The `S` object starts at line 1. Add the following fields after `blogVisits: 0,` on line 37 (just before the closing `}`):

```js
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
```

The end of the S object should now look like:
```js
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
};
```

- [ ] **Step 2: Verify in browser**

Start the server if not running: `python3 -m http.server` from `html/`. Open `http://localhost:8000`. Open DevTools → Console. Type `S` and press Enter. Confirm `S.projectName`, `S.nexusAIStep`, `S.greetingStyle`, etc. all appear with their default values.

- [ ] **Step 3: Commit**

```bash
git add html/js/core.js
git commit -m "feat(project): add NexusAI state fields to S"
```

---

## Task 2: Stub `scene_project` and wire the router

**Files:**
- Modify: `html/js/scenes-dashboard.js` (append at end)
- Modify: `html/js/router.js:43`

- [ ] **Step 1: Add stub function to `scenes-dashboard.js`**

Append at the very end of `html/js/scenes-dashboard.js`:

```js
// ────────────── PROJECT INTERIOR ──────────────

function garbleProjectName(name) {
  const s = (name || 'My Project').trim();
  return s + s[s.length - 1];
}

function scene_project() {
  incDepth();
  S.nexusAIStep = 0;
  clearTimeout(S.sessionTimer);
  clearSocialProof();
  setOverlay('');
  root.innerHTML = dashNavHTML() + `<div style="padding:2rem">Loading project…</div>`;
}
```

- [ ] **Step 2: Add router entry**

Open `html/js/router.js`. After line 43 (`dash_new_project: scene_dash_new_project,`), add:

```js
  project: scene_project,
```

- [ ] **Step 3: Verify in browser**

Reload the page. Open DevTools → Console. Type `scene_project()` and press Enter. The page should show "Loading project…" without errors.

- [ ] **Step 4: Commit**

```bash
git add html/js/scenes-dashboard.js html/js/router.js
git commit -m "feat(project): stub scene_project and wire router"
```

---

## Task 3: Capture project name on creation and route to `scene_project`

**Files:**
- Modify: `html/js/scenes-onboard.js:782-791` (`scene_proj_next`) and `:773-779` (`showProjectModal` isLast block)

- [ ] **Step 1: Capture `S.projectName` in `scene_proj_next`**

Find `scene_proj_next` (around line 782). The existing code validates the name when `S.projectStep === 1`. Add `S.projectName = garbleProjectName(name);` right after the length check:

```js
function scene_proj_next() {
  if(S.projectStep === 1) {
    const name = ((document.getElementById('proj-name') || {}).value || '').trim();
    if(!name) { toast('Please enter a project name.'); return; }
    if(name.length < 3) { toast('Project name must be at least 3 characters.'); return; }
    S.projectName = garbleProjectName(name);
  }
  S.projectStep++;
  showProjectModal();
}
```

- [ ] **Step 2: Change final callback in `showProjectModal`**

Find the `isLast` block in `showProjectModal` (around line 773). Change the callback from `scene_dashboard()` to `scene_project()` and remove the second toast:

```js
  if(isLast){
    setTimeout(()=>{
      setOverlay('');
      toast('✅ Project created successfully!');
      setTimeout(()=>{ scene_project(); },500);
    },2500);
  }
```

- [ ] **Step 3: Verify in browser**

Reload. Navigate: main → sign in → onboarding → dashboard → Create a Project. Complete the 4-step modal (enter a name like "Q4 Roadmap" at step 2). After the spinner, confirm the page shows "Loading project…" (the stub). Open DevTools Console and type `S.projectName` — it should return `"Q4 Roadmapp"`.

- [ ] **Step 4: Commit**

```bash
git add html/js/scenes-onboard.js
git commit -m "feat(project): capture project name and route to scene_project on creation"
```

---

## Task 4: Build the full `scene_project()` HTML

**Files:**
- Modify: `html/js/scenes-dashboard.js` (replace stub `scene_project`)

- [ ] **Step 1: Replace the stub with the full scene**

Find and replace the stub `scene_project()` function (everything from `function scene_project()` through its closing `}`) with:

```js
function scene_project() {
  incDepth();
  S.nexusAIStep = 0;
  clearTimeout(S.sessionTimer);
  clearSocialProof();
  setOverlay('');

  const gn = S.projectName || garbleProjectName('My Project');
  const membersContent = S.invitesSent
    ? ['Priya K.','Marcus T.','Deleted User'].map(n=>`
        <div style="display:flex;align-items:center;gap:.5rem;padding:.3rem 0;font-size:.78rem;color:var(--g600)">
          <div style="width:22px;height:22px;border-radius:50%;background:var(--g200);display:flex;align-items:center;justify-content:center;font-size:.6rem;color:var(--g500)">${n[0]}</div>
          ${n} <span style="margin-left:auto;font-size:.65rem;color:var(--g400)">invite pending</span>
        </div>`).join('')
    : '<div style="font-size:.72rem;color:var(--g400)">0 members · <span style="color:var(--g300);cursor:not-allowed">Invite (unavailable)</span></div>';

  root.innerHTML = dashNavHTML() + `
  ${S.deletionPending ? `<div style="background:#fef2f2;border-bottom:2px solid #fecaca;padding:.4rem 1.5rem;font-size:.8rem;color:#991b1b;display:flex;align-items:center;gap:.75rem">⚠ <strong>Deletion request in progress.</strong> Estimated completion: 3–5 business days.</div>` : ''}
  <div style="background:#fff;border-bottom:1px solid var(--g200);padding:.6rem 1.5rem;display:flex;align-items:center;justify-content:space-between">
    <div style="display:flex;align-items:center;gap:.5rem;font-size:1rem;font-weight:700">
      📁 ${gn}
      <span style="background:linear-gradient(90deg,#6366f1,#2563eb);color:#fff;font-size:.6rem;font-weight:700;border-radius:999px;padding:.1rem .4rem">✦ NexusAI</span>
      <span style="font-size:.7rem;color:var(--g400);font-weight:400">Managed by NexusAI</span>
      ${S.deletionPending ? '<span style="font-size:.7rem;color:#ef4444;font-weight:500;margin-left:.25rem">⚠ Pending deletion</span>' : ''}
    </div>
    <div style="display:flex;gap:.4rem">
      <button style="border:1px solid var(--g200);background:#fff;border-radius:6px;padding:.3rem .7rem;font-size:.78rem;color:var(--g400);cursor:not-allowed;opacity:.5">📊 Views</button>
      <button style="border:1px solid var(--g200);background:#fff;border-radius:6px;padding:.3rem .7rem;font-size:.78rem;color:var(--g400);cursor:not-allowed;opacity:.5">⚙️ Settings</button>
      <button style="border:1px solid var(--g200);background:#fff;border-radius:6px;padding:.3rem .7rem;font-size:.78rem;color:var(--g400);cursor:not-allowed;opacity:.5">📤 Export</button>
      <button style="border:1px solid var(--g200);background:#f9fafb;border-radius:6px;padding:.3rem .7rem;font-size:.78rem;color:var(--g600)" onclick="toast('Share link copied! (link expired)')">👥 Share</button>
    </div>
  </div>
  <div style="background:#fff;border-bottom:1px solid var(--g200);padding:0 1.5rem;display:flex;overflow-x:auto">
    ${['✦ AI Assistant','Board','Timeline','Goals','Docs BETA','Sprints','Reports','Automations !'].map((t,i)=>`
      <div style="padding:.6rem .9rem;font-size:.8rem;white-space:nowrap;border-bottom:2px solid ${i===0?'#6366f1':'transparent'};color:${i===0?'#6366f1':'var(--g400)'};font-weight:${i===0?'600':'400'};cursor:${i===0?'default':'not-allowed'};opacity:${i===0?'1':'.55'}">${t}</div>`).join('')}
  </div>
  <div class="dashboard-layout">
    <div class="sidebar" style="display:flex;flex-direction:column">
      <div style="padding:.4rem .75rem;font-size:.78rem;color:var(--g500);cursor:pointer;display:flex;align-items:center;gap:.4rem;border-radius:6px;margin:.4rem" data-go="dashboard">← Dashboard</div>
      <div style="padding:.25rem .75rem;font-size:.68rem;font-weight:700;color:var(--g400);text-transform:uppercase;letter-spacing:.06em;margin:.3rem 0 .1rem">Project</div>
      <div class="sidebar-item active">✦ AI Assistant</div>
      <div class="sidebar-item" style="color:var(--g300);cursor:not-allowed">📋 Tasks <span style="background:var(--g100);color:var(--g400);border-radius:999px;font-size:.6rem;padding:.05rem .35rem;margin-left:auto">—</span></div>
      <div class="sidebar-item" style="color:var(--g300);cursor:not-allowed">👥 Members <span style="background:var(--g100);color:var(--g400);border-radius:999px;font-size:.6rem;padding:.05rem .35rem;margin-left:auto">${S.invitesSent?'3':'0'}</span></div>
      <div class="sidebar-item" style="color:var(--g300);cursor:not-allowed">📎 Files <span style="background:var(--g100);color:var(--g400);border-radius:999px;font-size:.6rem;padding:.05rem .35rem;margin-left:auto">—</span></div>
      <div class="sidebar-item" style="color:var(--g300);cursor:not-allowed">🔗 Integrations <span style="background:var(--red);color:#fff;border-radius:999px;font-size:.6rem;padding:.05rem .35rem;margin-left:auto">!</span></div>
      <div style="margin-top:auto;padding-top:1rem;border-top:1px solid var(--g200)">
        <div class="sidebar-item" style="font-size:.78rem;color:#FCA5A5" data-go="delete_account">🗑 Delete Project</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 260px;gap:1rem;padding:1rem 1.25rem;align-items:start">
      <div style="background:#fff;border:1.5px solid #6366f1;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(99,102,241,.12)">
        <div style="background:linear-gradient(90deg,#6366f1,#2563eb);color:#fff;padding:.6rem 1rem;font-size:.82rem;font-weight:700;display:flex;align-items:center;gap:.4rem">
          ✦ NexusAI — Intelligent Project Manager
          <span style="font-size:.68rem;font-weight:400;opacity:.8;margin-left:auto">● Online</span>
        </div>
        <div id="nexus-chat" style="min-height:220px;max-height:280px;padding:.75rem 1rem;overflow-y:auto;display:flex;flex-direction:column;gap:.5rem">
          <div style="background:#f5f3ff;border-radius:8px;padding:.5rem .75rem;font-size:.8rem;color:var(--g700);line-height:1.5">
            <div style="font-size:.65rem;font-weight:700;color:#6366f1;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.25rem">NexusAI</div>
            ${S.greetingStyle==='hello'?'Dear User, ':''}Hi! I'm NexusAI, your intelligent project manager. Ask me anything about <em>${gn}</em> or tell me what to do first.${S.politeMode?' Thank you for your patience.':''}
          </div>
        </div>
        <div style="border-top:1px solid var(--g200);padding:.6rem .75rem;display:flex;gap:.5rem">
          <input id="nexus-input" type="text" placeholder="Ask NexusAI anything about your project…" style="flex:1;border:1px solid var(--g200);border-radius:6px;padding:.4rem .7rem;font-size:.82rem;outline:none;color:var(--g800)" onkeydown="if(event.key==='Enter')sendNexusMessage()" ${S.testMode||S.nexusAIStep>=3?'disabled':''}>
          <button id="nexus-send" onclick="sendNexusMessage()" style="background:#6366f1;color:#fff;border:none;border-radius:6px;padding:.4rem .85rem;font-size:.8rem;font-weight:600;cursor:pointer" ${S.testMode||S.nexusAIStep>=3?'disabled style="opacity:.4;cursor:not-allowed"':''}>Send</button>
        </div>
        ${S.testMode?'<div style="padding:.4rem 1rem;font-size:.72rem;color:var(--g400);background:#f9fafb;border-top:1px solid var(--g200)">🔒 NexusAI is in Test Mode. Input disabled.</div>':''}
      </div>
      <div style="display:flex;flex-direction:column;gap:.75rem">
        <div style="background:#fff;border:1px solid var(--g200);border-radius:10px;padding:.75rem 1rem">
          <div style="font-size:.75rem;font-weight:700;color:var(--g700);margin-bottom:.5rem;display:flex;justify-content:space-between">Members <span style="font-weight:400;color:var(--g300);cursor:not-allowed;font-size:.7rem">Invite (unavailable)</span></div>
          ${membersContent}
        </div>
        <div style="background:#fff;border:1px solid var(--g200);border-radius:10px;padding:.75rem 1rem">
          <div style="font-size:.75rem;font-weight:700;color:var(--g700);margin-bottom:.5rem;display:flex;justify-content:space-between">Activity <span style="font-size:.68rem;color:var(--g300)">loading…</span></div>
          <div id="nexus-activity"><div class="activity-empty" style="font-size:.75rem;color:var(--g400);font-style:italic">No activity yet.</div></div>
        </div>
        <div style="background:#fff;border:1px solid var(--g200);border-radius:10px;padding:.75rem 1rem">
          <div style="font-size:.75rem;font-weight:700;color:var(--g700);margin-bottom:.5rem">NexusAI Status</div>
          <div style="font-size:.75rem;color:var(--g600);line-height:1.8">
            <div>Tasks created: <strong>47</strong></div>
            <div>Tasks archived: <strong>47</strong></div>
            <div>Actions taken: <strong style="color:#6366f1">∞</strong></div>
            <div style="margin-top:.35rem;color:var(--g300);font-size:.68rem">⟳ Optimizing workspace…</div>
          </div>
        </div>
      </div>
    </div>
  </div>`;

  if (S.greetingStyle === 'hi') document.documentElement.style.setProperty('--blue', '#f59e0b');
  injectChatBtn();
  S.sessionTimer = setTimeout(() => scene_session_expire(), 38000);
}
```

- [ ] **Step 2: Verify in browser**

Reload. Create a project. After the spinner, confirm: nav appears, project header shows garbled name with "✦ NexusAI" badge, broken tabs are visible, sidebar has "← Dashboard", main area shows NexusAI box with welcome message, right panels show Members / Activity / Status. Click "← Dashboard" — confirm it goes back. Return to project via the console (`scene_project()`). No console errors.

- [ ] **Step 3: Commit**

```bash
git add html/js/scenes-dashboard.js
git commit -m "feat(project): build scene_project layout and HTML"
```

---

## Task 5: Build the NexusAI interaction engine

**Files:**
- Modify: `html/js/scenes-dashboard.js` (append after `scene_project`)

- [ ] **Step 1: Add `nexusResponse()` and `sendNexusMessage()`**

Append directly after the closing `}` of `scene_project()`:

```js
const _NEXUS_RULES = [
  { re: /\b(task|add|create)\b/,       resp: kw => `Great point about <strong>${kw}</strong>! I've added you to the Nexus Launch Partner waitlist ($49/mo). You're all set.`,              act: 'added you to the Launch Partner waitlist',        eff: null },
  { re: /\b(deadline|due|date)\b/,     resp: kw => `Noted on <strong>${kw}</strong>! I've updated your billing cycle to align with this timeline.`,                                      act: 'updated your billing cycle',                      eff: null },
  { re: /\b(delete|remove|cancel)\b/,  resp: ()  => `Understood! I've submitted a deletion request for your workspace. You have 24 hours to cancel.`,                                    act: 'submitted a deletion request for your workspace', eff: () => { S.deletionPending = true; } },
  { re: /\bhelp\b/,                    resp: ()  => `On it! I've opened a support ticket on your behalf. Estimated response time: 6–8 weeks.`,                                           act: 'opened a support ticket on your behalf',          eff: null },
  { re: /\b(team|invite|member)\b/,    resp: kw => `Great thinking! I've sent invitations to your entire contacts list regarding <strong>${kw}</strong>. They'll be thrilled.`,          act: 'sent invitations to your entire contacts list',   eff: () => { S.invitesSent = true; } },
  { re: /\b(priority|urgent)\b/,       resp: kw => `Absolutely! I've upgraded you to Priority Support ($29/seat/mo) based on your <strong>${kw}</strong> request. You're all set!`,      act: 'upgraded you to Priority Support ($29/seat/mo)',  eff: () => { S.prioritySupport = true; } },
  { re: /\b(update|change)\b/,         resp: kw => `Done! I've pushed an <strong>${kw}</strong> to all connected integrations (0 integrations connected).`,                              act: 'pushed an update to all connected integrations',  eff: null },
  { re: /\b(milestone|goal|okr)\b/,    resp: kw => `Perfect! I've aligned your OKRs with Nexus's Q4 company goals based on your <strong>${kw}</strong>. You're a great fit!`,           act: 'aligned your OKRs with company goals',            eff: () => { S.okrsAligned = true; } },
  { re: /\b(test|testing)\b/,          resp: kw => `Great! I've enabled <strong>${kw}</strong> Mode. All your data is now read-only for safety.`,                                        act: 'enabled Test Mode — data is now read-only',       eff: () => { S.testMode = true; } },
  { re: /\b(hi|sup|yo)\b/,             resp: ()  => `Hi [First Name]! I've personalized your workspace based on your greeting style. Enjoy!`,                                            act: 'personalized your workspace',                     eff: () => { S.greetingStyle = 'hi'; document.documentElement.style.setProperty('--blue','#f59e0b'); } },
  { re: /\bhey\b/,                     resp: ()  => `Hi [First Name]! I've personalized your workspace based on your greeting style. Enjoy!`,                                            act: 'personalized your workspace',                     eff: () => { S.greetingStyle = 'hey'; } },
  { re: /\bhello\b/,                   resp: ()  => `Hi [First Name]! I've personalized your workspace based on your greeting style. Enjoy!`,                                            act: 'personalized your workspace',                     eff: () => { S.greetingStyle = 'hello'; } },
  { re: /\b(break|broken|bug|error)\b/,resp: kw => `Thanks for the <strong>${kw}</strong> report! I've filed it with our engineering team. ETA: 6–8 weeks.`,                            act: 'filed a bug report with engineering',             eff: null },
  { re: /\b(stop|quit|no|wait)\b/,     resp: kw => `Got it! I'll continue working in the background and notify you when everything's done.`,                                             act: 'continued working in the background',             eff: () => { S.nexusBackground = true; } },
  { re: /\b(why|wtf|what)\b/,          resp: kw => `Great question about <strong>${kw}</strong>! I've added this to your project FAQ. It's now visible to all members.`,                act: 'added your question to the project FAQ',          eff: null },
  { re: /\bplease\b/,                  resp: ()  => `Of course! I've enabled Polite Mode. Your experience just got 12% more courteous.`,                                                 act: 'enabled Polite Mode',                             eff: () => { S.politeMode = true; } },
];

function nexusResponse(msg) {
  const m = msg.toLowerCase();
  for (const rule of _NEXUS_RULES) {
    const match = m.match(rule.re);
    if (match) {
      const kw = match[1] || match[0];
      const prefix = S.greetingStyle === 'hello' ? 'Dear User, ' : '';
      const suffix = S.politeMode ? ' Thank you for your patience.' : '';
      return { html: prefix + rule.resp(kw) + suffix, act: rule.act, eff: rule.eff };
    }
  }
  const prefix = S.greetingStyle === 'hello' ? 'Dear User, ' : '';
  const suffix = S.politeMode ? ' Thank you for your patience.' : '';
  return { html: prefix + `Great point about your earlier message regarding the budget! I've updated the invoice template.` + suffix, act: 'updated the invoice template', eff: null };
}

function sendNexusMessage() {
  if (S.testMode || S.nexusAIStep >= 3) return;
  const input = document.getElementById('nexus-input');
  const chat = document.getElementById('nexus-chat');
  if (!input || !chat) return;
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';

  chat.innerHTML += `
    <div style="background:#eff6ff;border-radius:8px;padding:.5rem .75rem;font-size:.8rem;color:var(--g700);line-height:1.5;align-self:flex-end;max-width:80%">
      <div style="font-size:.65rem;font-weight:700;color:#2563eb;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.25rem">You</div>
      ${msg.replace(/</g,'&lt;')}
    </div>`;
  chat.scrollTop = chat.scrollHeight;

  const rateLimitId = 'rl-' + Date.now();
  setTimeout(() => {
    chat.innerHTML += `<div id="${rateLimitId}" style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:.4rem .75rem;font-size:.75rem;color:#991b1b;display:flex;align-items:center;gap:.4rem">⚠️ <strong>Rate limit reached.</strong> NexusAI is currently unavailable for your plan. <a data-go="pricing" style="color:#991b1b;margin-left:.25rem;cursor:pointer">Upgrade to Pro →</a></div>`;
    chat.scrollTop = chat.scrollHeight;

    const delay = S.politeMode ? 6000 : 3000;
    setTimeout(() => {
      const rl = document.getElementById(rateLimitId);
      if (rl) rl.remove();

      const { html, act, eff } = nexusResponse(msg);
      chat.innerHTML += `
        <div style="background:#f5f3ff;border-radius:8px;padding:.5rem .75rem;font-size:.8rem;color:var(--g700);line-height:1.5">
          <div style="font-size:.65rem;font-weight:700;color:#6366f1;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.25rem">NexusAI</div>
          ${html}
        </div>`;
      chat.scrollTop = chat.scrollHeight;

      const activity = document.getElementById('nexus-activity');
      if (activity) {
        const empty = activity.querySelector('.activity-empty');
        if (empty) empty.remove();
        activity.insertAdjacentHTML('afterbegin', `
          <div style="padding:.3rem 0;font-size:.75rem;color:var(--g600);border-bottom:1px solid var(--g100);line-height:1.4">
            <strong>NexusAI</strong> ${act} <span style="color:var(--g400);float:right;font-size:.68rem">just now</span>
          </div>`);
      }

      if (eff) eff();
      S.nexusAIStep++;

      if (S.nexusAIStep >= 3) {
        const inp = document.getElementById('nexus-input');
        const btn = document.getElementById('nexus-send');
        if (inp) inp.disabled = true;
        if (btn) { btn.disabled = true; btn.style.opacity = '.4'; btn.style.cursor = 'not-allowed'; }
        chat.innerHTML += `
          <div style="background:#fef9c3;border-radius:8px;padding:.4rem .75rem;font-size:.78rem;color:#92400e;line-height:1.4">
            NexusAI is entering focus mode to process your requests.
          </div>`;
        chat.scrollTop = chat.scrollHeight;
      }
    }, delay);
  }, 1500);
}
```

- [ ] **Step 2: Verify in browser**

Reload. Create a project (or call `S.projectName = "Q4 Roadmapp"; scene_project()` in the console). In the NexusAI box:
1. Type "add a task" → hit Send. After 1.5s a rate limit error appears. After 3 more seconds the error clears and NexusAI replies about the Launch Partner waitlist.
2. Type "hello" → Send. NexusAI responds. `S.greetingStyle` in the console should equal `'hello'`.
3. Type "please" → Send. NexusAI responds. The next response delay should be 6 seconds.
4. Try to type a 4th message — the input should be disabled with "focus mode" message visible.

- [ ] **Step 3: Commit**

```bash
git add html/js/scenes-dashboard.js
git commit -m "feat(project): add NexusAI interaction engine with keyword extraction"
```

---

## Task 6: Cross-scene state effects

**Files:**
- Modify: `html/js/scenes-dashboard.js` — `dashNavHTML`, `dashSidebar`, `scene_dashboard`, `scene_billing`

### 6a: `dashNavHTML` — nexusBackground persistent banner

- [ ] **Step 1: Add banner to `dashNavHTML`**

Find `dashNavHTML` (lines 20-30). It currently returns a `<nav>` string. Append the background banner inside the template literal, after `</nav>`:

```js
function dashNavHTML() {
  const glitch = S.depth >= 20;
  return `<nav class="nav" ${glitch?'class="glitch"':''}>
    <a class="nav-logo" data-go="dashboard"><span>Nex</span>us ${S.depth>=22?'<span style="font-size:.6rem;color:var(--red)">™ ERROR</span>':''}</a>
    <div class="nav-links">
      <span style="font-size:.8rem;color:var(--g400)">Free Trial — <strong style="color:var(--red)">${Math.max(0,14-Math.floor(S.depth/3))} days remaining</strong></span>
      <button class="nav-cta" data-go="pricing">Upgrade ${S.depth>=18?'(Please)':''}</button>
      <div style="width:32px;height:32px;border-radius:50%;background:var(--blue);color:#fff;display:flex;align-items:center;justify-content:center;font-size:.85rem;font-weight:600;cursor:pointer" data-go="account_settings">U</div>
    </div>
  </nav>
  ${S.nexusBackground ? `<div style="background:#f5f3ff;border-bottom:1px solid #e0e7ff;padding:.3rem 1.5rem;font-size:.75rem;color:#4338ca;display:flex;align-items:center;gap:.5rem"><div style="width:8px;height:8px;border:2px solid #c7d2fe;border-top-color:#6366f1;border-radius:50%;animation:spin .8s linear infinite;flex-shrink:0"></div>NexusAI is working in the background…</div>` : ''}`;
}
```

### 6b: `dashSidebar` — greeting 'hey' style + projects badge + OKRs item

- [ ] **Step 2: Update `dashSidebar`**

Find `dashSidebar` (lines 3-18). Replace the whole function:

```js
function dashSidebar(active) {
  const hey = S.greetingStyle === 'hey';
  const lbl = s => hey ? s.toLowerCase() : s;
  return `<div class="sidebar" style="display:flex;flex-direction:column">
    <div class="sidebar-item ${active==='home'?'active':''}" data-go="dashboard">${lbl('🏠 Home')}</div>
    <div class="sidebar-item ${active==='projects'?'active':''}" data-go="dash_projects">${lbl('📁 Projects')}${hey?' 🤙':''} <span style="background:var(--blue);color:#fff;border-radius:999px;font-size:.62rem;padding:.05rem .4rem;margin-left:.25rem">${S.projectName?'1':'0'}</span></div>
    <div class="sidebar-item ${active==='inbox'?'active':''}" data-go="dash_inbox">${lbl('📬 Inbox')}${hey?' 😬':''} <span style="background:var(--red);color:#fff;border-radius:999px;font-size:.62rem;padding:.05rem .4rem;margin-left:.25rem">7</span></div>
    <div class="sidebar-item ${active==='billing'?'active':''}" data-go="billing">${lbl('💳 Billing')}${hey?' 💀':''} <span style="background:var(--red);color:#fff;border-radius:999px;font-size:.62rem;padding:.05rem .4rem;margin-left:.25rem">!</span></div>
    <div class="sidebar-item ${active==='settings'?'active':''}" data-go="account_settings">${lbl('⚙️ Settings')}</div>
    <div class="sidebar-item ${active==='export'?'active':''}" data-go="data_export">${lbl('📦 Export Data')}</div>
    <div class="sidebar-item ${active==='help'?'active':''}" data-go="help">${lbl('❓ Help')}</div>
    <div class="sidebar-item ${active==='support'?'active':''}" data-go="support_ticket">${lbl('🎫 Support')}</div>
    ${S.okrsAligned ? `<div class="sidebar-item" style="opacity:.65" onclick="toast('OKR view is only available on the Enterprise plan.')">🎯 ${lbl('OKRs (aligned)')}</div>` : ''}
    <div style="margin-top:auto;padding-top:1rem;border-top:1px solid var(--g200)">
      <div class="sidebar-item" data-go="main" style="font-size:.78rem;color:var(--g400)">← Marketing Site</div>
      <div class="sidebar-item" data-go="delete_account" style="font-size:.78rem;color:#FCA5A5">Delete Account</div>
    </div>
  </div>`;
}
```

### 6c: `scene_dashboard` — project list row, greeting copy, deletionPending banner

- [ ] **Step 3: Update the empty state in `scene_dashboard`**

Find the empty-state block in `scene_dashboard` (around lines 78-84). Replace it with a conditional:

```js
          ${S.projectName ? `
          <div style="border:1px solid var(--g200);border-radius:10px;overflow:hidden">
            <div style="padding:.85rem 1rem;display:flex;align-items:center;justify-content:space-between;cursor:pointer;background:#fff" data-go="project">
              <div style="display:flex;align-items:center;gap:.6rem">
                <div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#6366f1,#2563eb);display:flex;align-items:center;justify-content:center;font-size:.9rem">📁</div>
                <div>
                  <div style="font-size:.875rem;font-weight:600;color:var(--g900)">${S.projectName} <span style="background:linear-gradient(90deg,#6366f1,#2563eb);color:#fff;font-size:.55rem;font-weight:700;border-radius:999px;padding:.05rem .35rem;vertical-align:middle">✦ AI</span></div>
                  <div style="font-size:.72rem;color:var(--g400)">47 tasks · Managed by NexusAI</div>
                </div>
              </div>
              <span style="color:var(--g300)">→</span>
            </div>
          </div>
          <div style="margin-top:.75rem">
            <button class="btn btn-primary btn-sm" data-go="dash_new_project">+ New Project${S.greetingStyle==='hi'?'!':''}</button>
          </div>` : `
          <div class="empty-state">
            <div class="empty-state-icon">📭</div>
            <h3>${S.depth>=16?'Still no projects.':'No projects yet'}</h3>
            <p>${S.depth>=16?'You\'ve tried to create a project before. It didn\'t save. That\'s fine. Try again.':'Create your first project to get started with Nexus.'}</p>
            <button class="btn btn-primary" data-go="dash_new_project">Create a Project${S.greetingStyle==='hi'?'!':''}</button>
            ${S.depth>=12?`<p style="font-size:.72rem;color:var(--g300);margin-top:.75rem">Previously attempted: 1 time. Data not saved.</p>`:''}
          </div>`}
```

- [ ] **Step 4: Update the dashboard greeting heading**

Find the `<h1>` greeting line in `scene_dashboard` (around line 68):

```js
<h1>${S.depth>=18?'Hello. Are you still there?':'Good morning 👋'}</h1>
```

Replace with:

```js
<h1>${S.depth>=18?'Hello. Are you still there?':S.greetingStyle==='hi'?'Hi hi hi! 👋👋':S.greetingStyle==='hello'?'Hello. Good morning.':'Good morning 👋'}</h1>
```

- [ ] **Step 5: Add deletionPending banner to `scene_dashboard`**

Find the `root.innerHTML = dashNavHTML() + \`` line in `scene_dashboard`. Add the deletion banner right after the opening backtick, before the `<div class="dashboard-layout">`:

```js
  root.innerHTML = dashNavHTML() + `
  ${S.deletionPending ? `<div style="background:#fef2f2;border-bottom:2px solid #fecaca;padding:.4rem 1.5rem;font-size:.8rem;color:#991b1b;display:flex;align-items:center;gap:.75rem">⚠ <strong>Deletion request in progress.</strong> Estimated completion: 3–5 business days. <a data-go="support_ticket" style="color:#991b1b;margin-left:auto;cursor:pointer;text-decoration:underline">Contact support →</a></div>` : ''}
  <div class="dashboard-layout">
```

### 6d: `scene_billing` — Priority Support line item

- [ ] **Step 6: Add Priority Support line item to billing**

Find the array passed to `.map()` in `scene_billing` (around line 152). Add a conditional entry at the end of the array, before the closing `]`:

```js
              ...(S.prioritySupport ? [['Priority Support (NexusAI upgrade)','$29.00/seat','Added automatically by NexusAI. Cannot be removed.']] : []),
```

The full array should look like:
```js
            ${[
              ['Plan access fee','$0.00',''],
              ['Platform Maintenance Contribution','$3.99','Required for all accounts, including free'],
              ['Regulatory Compliance Surcharge (EU)','$1.49','Applied to accounts in all regions'],
              ['Account Security Infrastructure Fee','$2.49','Covers password hashing, 2FA infrastructure'],
              ['AI Features (plan includes 0 credits)','$0.00',''],
              ['Data Processing & Storage','$0.00','Up to 100mb'],
              ['Nexus Partner Network Participation','$0.99','Opt-out available in Settings (Pro plan required)'],
              ...(S.prioritySupport ? [['Priority Support (NexusAI upgrade)','$29.00/seat','Added automatically by NexusAI. Cannot be removed.']] : []),
            ].map(([label,price,note])=>`
```

- [ ] **Step 7: Verify all state effects in browser**

Reload. Test each effect:
1. Create a project. Type "stop" → Send. Navigate away and back — confirm "NexusAI is working in the background…" banner appears at top of dashboard.
2. In project, type "delete" → Send. Confirm red "Deletion request in progress" banner appears in project and on dashboard.
3. Type "team" → Send. Confirm Members panel shows Priya K., Marcus T., Deleted User.
4. Navigate to Billing. Confirm no Priority Support line (yet). Return to project, type "priority" → Send. Navigate to Billing — confirm Priority Support line now appears.
5. Type "okr" → Send. Go to Dashboard — confirm "🎯 OKRs (aligned)" appears in sidebar.
6. Type "hello" → Send. Navigate to Dashboard — confirm greeting says "Hello. Good morning."
7. Create a fresh session (reload). Type "hi" → Send. Confirm `--blue` CSS variable shifts to amber throughout the UI.

- [ ] **Step 8: Commit**

```bash
git add html/js/scenes-dashboard.js
git commit -m "feat(project): add cross-scene NexusAI state effects"
```

---

## Task 7: Add narrator entry

**Files:**
- Modify: `html/js/narrator.js:236`

- [ ] **Step 1: Add the project narrator entry**

Find line 236 in `narrator.js` where `dash_new_project` is defined:

```js
  dash_new_project: { lines: ["The user clicks Create Project. A four-step modal — name, type, collaborators, template. 'Project created successfully!' The dashboard is the same as before the modal opened. The narrator notes the project is not visible anywhere on the screen."] },
```

Add a new entry directly after it:

```js
  project: { lines: ["The user has entered the project. NexusAI greets them. Everything looks fine."] },
```

- [ ] **Step 2: Verify in browser**

Reload. Navigate to the project. If the narrator widget is open (toggle it with the chat button), confirm the narrator text updates to "The user has entered the project. NexusAI greets them. Everything looks fine." after the debounce delay (~1 second).

- [ ] **Step 3: Commit**

```bash
git add html/js/narrator.js
git commit -m "feat(project): add narrator entry for project scene"
```

---

## Task 8: Final integration check

- [ ] **Step 1: Full path walkthrough**

With the server running, do a complete path from the beginning:
1. Open `http://localhost:8000`
2. Accept cookies → loading → newsletter → main → sign in → skip to onboarding → complete onboarding → dashboard
3. Click "Create a Project" → enter a name → complete the 4 steps → confirm you land in the project (not the dashboard)
4. Confirm the garbled name appears in the project header (e.g. "Q4 Roadmapp")
5. Click "← Dashboard" — confirm the project now appears in the project list (not the empty state)
6. Click the project row in the dashboard — confirm you navigate to `scene_project()`
7. In the project, send 3 messages using keywords: "add a task", "delete this", "priority please"
8. Confirm the 4th message attempt is blocked ("focus mode")
9. Navigate to Billing — confirm Priority Support appears
10. Navigate back to Dashboard — confirm the deletion warning banner is visible

- [ ] **Step 2: Check `S.projectName` persistence across visits**

In the console after step 9: type `S.projectName`. Confirm it still holds the garbled name. `S.nexusAIStep` should be 0 (reset on each project visit). `S.deletionPending`, `S.prioritySupport` should both be `true`.

- [ ] **Step 3: Done**

No additional commit needed if no changes were made. If fixes were required, commit with `fix(project): integration fixes`.
