# Secret Tower Chat — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `scene_secret_site()` placeholder with a redirect to a standalone `html/secret.html` — an anonymous real-time chat room called "nexus // tower" backed by Firebase Realtime DB.

**Architecture:** `secret.html` is fully self-contained (inline CSS + JS, no shared files from the main site). It checks a `sessionStorage` flag set by the main app on redirect; without it, it shows a credential prompt accepting the same email/password as the puzzle. Firebase Realtime DB relays messages and tracks presence with no custom server.

**Tech Stack:** Vanilla JS, Firebase Realtime Database v10 (compat CDN), sessionStorage for access flag + codename persistence.

**Spec:** `docs/specs/2026-04-28-secret-tower-chat-design.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `html/secret.html` | Create | Standalone page: credential gate, anonymous identity, Firebase chat, all CSS/JS inline |
| `html/js/scenes-secret.js` | Modify (replace) | Set sessionStorage flag, animate "connecting to tower...", redirect to `/secret.html` |

No other files change. `index.html` does not need updating — `secret.html` loads its own Firebase SDK.

---

### Task 1: Firebase project setup (user action, no code)

- [ ] Go to `https://console.firebase.google.com` → **Add project** → name it → disable Google Analytics → **Create project**
- [ ] In the project sidebar: **Build → Realtime Database → Create database** → pick any region → **Start in test mode** → **Enable**
- [ ] Gear icon → **Project settings → General → Your apps → Web (`</>`)** → register the app (any nickname) → copy the `firebaseConfig` object — you'll need `apiKey`, `authDomain`, `databaseURL`, `projectId`, `appId`

---

### Task 2: Create `html/secret.html` — skeleton, CSS, Firebase SDK, config block

**Files:**
- Create: `html/secret.html`

- [ ] Create `html/secret.html` with the full HTML structure, CSS, Firebase script tags, and the config block (values empty — you paste them in next):

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>nexus // tower</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg:     #08080e;
      --bg2:    #0c0c16;
      --border: #14142a;
      --dim:    #1e1e38;
      --muted:  #3a3a60;
      --text:   #6a6a9a;
      --bright: #9999cc;
      --accent: #4444aa;
    }
    html, body {
      height: 100%;
      background: var(--bg);
      color: var(--text);
      font-family: 'Courier New', Courier, monospace;
      font-size: 13px;
      line-height: 1.5;
    }
    body { display: flex; flex-direction: column; height: 100vh; overflow: hidden; }

    #gate {
      position: fixed; inset: 0;
      display: flex; align-items: center; justify-content: center;
      background: var(--bg); z-index: 10;
    }
    #gate[hidden] { display: none; }
    .gate-box {
      text-align: center; display: flex; flex-direction: column;
      gap: .8rem; max-width: 280px; width: 100%;
    }
    .gate-label { color: var(--muted); font-size: .75rem; letter-spacing: .15em; }
    .gate-sub   { color: var(--dim);   font-size: .6rem;  letter-spacing: .1em; }
    .gate-input {
      background: transparent; border: none; border-bottom: 1px solid var(--border);
      color: var(--bright); font-family: inherit; font-size: .85rem;
      padding: .35rem 0; outline: none; width: 100%; caret-color: var(--accent);
    }
    .gate-input::placeholder { color: var(--dim); }
    .gate-btn {
      background: transparent; border: 1px solid var(--dim); color: var(--muted);
      font-family: inherit; font-size: .7rem; padding: .3rem .8rem;
      cursor: pointer; letter-spacing: .08em; align-self: center; margin-top: .4rem;
    }
    .gate-btn:hover { border-color: var(--muted); color: var(--text); }
    .gate-err   { color: #6a3a3a; font-size: .65rem; min-height: 1rem; }
    .gate-retry { color: var(--muted); font-size: .65rem; }

    #chat-wrap { display: flex; flex-direction: column; height: 100vh; }
    #chat-wrap[hidden] { display: none; }

    #hdr {
      padding: .55rem 1rem; background: var(--bg2); border-bottom: 1px solid var(--border);
      display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;
    }
    #hdr-title { color: var(--dim); font-size: .7rem; letter-spacing: .14em; }
    #hdr-title .sep { color: var(--border); margin: 0 .3em; }
    #hdr-right { display: flex; align-items: center; gap: .5rem; font-size: .65rem; color: var(--dim); }
    #my-codename { color: var(--accent); }
    .dot {
      width: 5px; height: 5px; border-radius: 50%;
      background: var(--dim); display: inline-block; flex-shrink: 0;
    }
    .dot.connected { background: #3a6a3a; }

    #msgs { flex: 1; overflow-y: auto; padding: .75rem 1rem; }
    #msgs::-webkit-scrollbar { width: 3px; }
    #msgs::-webkit-scrollbar-track { background: transparent; }
    #msgs::-webkit-scrollbar-thumb { background: var(--dim); border-radius: 2px; }
    .msg { display: flex; gap: .7rem; padding: .15rem 0; align-items: baseline; }
    .msg .ts   { color: var(--dim); font-size: .65rem; flex-shrink: 0; min-width: 2.8rem; }
    .msg .from { flex-shrink: 0; min-width: 9.5rem; }
    .msg .text { color: var(--text); word-break: break-word; }
    .sys { color: #2a2a50; font-size: .7rem; padding: .15rem 0; letter-spacing: .04em; }

    #input-bar {
      padding: .55rem 1rem; background: var(--bg2); border-top: 1px solid var(--border);
      display: flex; align-items: center; gap: .6rem; flex-shrink: 0;
    }
    #prompt { color: var(--muted); flex-shrink: 0; }
    #msg-in {
      flex: 1; background: transparent; border: none; outline: none;
      color: var(--bright); font-family: inherit; font-size: .85rem; caret-color: var(--accent);
    }
    #msg-in::placeholder { color: var(--dim); }
    #send-btn {
      background: transparent; border: 1px solid var(--dim); color: var(--muted);
      font-family: inherit; font-size: .7rem; padding: .25rem .55rem;
      cursor: pointer; letter-spacing: .06em;
    }
    #send-btn:hover { border-color: var(--muted); color: var(--text); }
  </style>
</head>
<body>

<div id="gate"></div>

<div id="chat-wrap" hidden>
  <div id="hdr">
    <span id="hdr-title">nexus <span class="sep">//</span> tower</span>
    <span id="hdr-right">
      <span id="my-codename"></span>
      <span class="dot" id="conn-dot"></span>
      <span id="user-count"></span>
    </span>
  </div>
  <div id="msgs"></div>
  <div id="input-bar">
    <span id="prompt">&gt;</span>
    <input id="msg-in" type="text" maxlength="500" placeholder="say something"
           autocomplete="off" spellcheck="false">
    <button id="send-btn">send</button>
  </div>
</div>

<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-database-compat.js"></script>
<script>
// ── Config — paste your Firebase project values here ─────────────────────────
const FIREBASE_CONFIG = {
  apiKey:      '',
  authDomain:  '',
  databaseURL: '',
  projectId:   '',
  appId:       ''
};
const CREDS = { email: 'labrinth@nexus.app', pass: 'd3pth0' };
</script>

</body>
</html>
```

- [ ] Paste your Firebase config values into the `FIREBASE_CONFIG` object (from Task 1)
- [ ] Serve from `html/`: `python3 -m http.server 8000`
- [ ] Open `http://localhost:8000/secret.html` — page should be a dark blank (no JS logic yet, no visible content)
- [ ] Commit:

```bash
git add html/secret.html
git commit -m "feat: add secret.html skeleton with CSS and Firebase SDK"
```

---

### Task 3: Add credential gate and anonymous identity

**Files:**
- Modify: `html/secret.html` — append to the `<script>` block, after the `CREDS` constant

- [ ] Add the following inside the `<script>` block, directly after the `CREDS` line:

```javascript
// ── Constants ────────────────────────────────────────────────────────────────
const BUZZWORDS = ['leverage','disrupt','pivot','synergy','scale','iterate','ideate',
                   'align','optimize','streamline','unlock','accelerate','empower',
                   'transform','innovate','execute'];
const PALETTE   = ['#4444aa','#5533aa','#3355aa','#4455bb','#5544aa','#3366aa','#6633aa','#4466aa'];

// ── Identity ──────────────────────────────────────────────────────────────────
function genCodename() {
  const w = BUZZWORDS[Math.floor(Math.random() * BUZZWORDS.length)];
  return w + '_' + Math.random().toString(16).slice(2, 6);
}
function codenameColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff;
  return PALETTE[h % PALETTE.length];
}
const MY_CODENAME = sessionStorage.getItem('nexus_codename') || genCodename();
sessionStorage.setItem('nexus_codename', MY_CODENAME);

// ── Access ────────────────────────────────────────────────────────────────────
function hasAccess()   { return sessionStorage.getItem('nexus_tower_access') === '1'; }
function grantAccess() { sessionStorage.setItem('nexus_tower_access', '1'); }

// ── DOM refs ──────────────────────────────────────────────────────────────────
const gateEl     = document.getElementById('gate');
const chatWrap   = document.getElementById('chat-wrap');
const msgsEl     = document.getElementById('msgs');
const msgInput   = document.getElementById('msg-in');
const sendBtn    = document.getElementById('send-btn');
const codenameEl = document.getElementById('my-codename');
const countEl    = document.getElementById('user-count');
const dotEl      = document.getElementById('conn-dot');

// ── Gate UI ───────────────────────────────────────────────────────────────────
function showDenied() {
  gateEl.innerHTML = `
    <div class="gate-box">
      <div class="gate-label">access denied</div>
      <div class="gate-sub"><a class="gate-retry" href="#">try again</a></div>
    </div>`;
  gateEl.querySelector('.gate-retry').onclick = e => { e.preventDefault(); showLoginForm(); };
}

function showLoginForm() {
  gateEl.innerHTML = `
    <div class="gate-box">
      <div class="gate-label">nexus // tower</div>
      <div class="gate-sub">credentials required</div>
      <input class="gate-input" id="gate-email" type="email" placeholder="email" autocomplete="off">
      <input class="gate-input" id="gate-pass"  type="password" placeholder="password">
      <button class="gate-btn" id="gate-submit">enter</button>
      <div class="gate-err" id="gate-err"></div>
    </div>`;
  document.getElementById('gate-submit').onclick = checkGateCreds;
  document.getElementById('gate-pass').onkeydown = e => { if (e.key === 'Enter') checkGateCreds(); };
}

function checkGateCreds() {
  const email = (document.getElementById('gate-email').value || '').trim();
  const pass  = document.getElementById('gate-pass').value  || '';
  if (email === CREDS.email && pass === CREDS.pass) {
    grantAccess();
    enterChat();
  } else {
    showDenied();
  }
}

// ── Placeholder (replaced in Task 4) ─────────────────────────────────────────
function enterChat() {
  gateEl.hidden   = true;
  chatWrap.hidden = false;
  codenameEl.textContent = MY_CODENAME;
}

// ── Boot ──────────────────────────────────────────────────────────────────────
if (hasAccess()) {
  enterChat();
} else {
  showLoginForm();
}
```

- [ ] Open `http://localhost:8000/secret.html`
  - Should see the gate: "nexus // tower", "credentials required", email + password fields, "enter" button
- [ ] Enter wrong credentials → "access denied" + "try again" link
- [ ] Click "try again" → login form reappears
- [ ] Enter correct creds (`labrinth@nexus.app` / `d3pth0`) → empty chat UI visible (header + message area + input bar), codename in header
- [ ] Refresh page → chat UI shown directly (flag in sessionStorage, gate skipped)
- [ ] Open in a new tab → gate shown again (new tab = new sessionStorage)
- [ ] Commit:

```bash
git add html/secret.html
git commit -m "feat: add credential gate and anonymous identity to secret.html"
```

---

### Task 4: Add Firebase chat — messages, presence, offline detection

**Files:**
- Modify: `html/secret.html` — replace everything from `// ── Placeholder` to end of `</script>`

- [ ] In the `<script>` block, delete from `// ── Placeholder (replaced in Task 4)` to the end of the script (inclusive of Boot), and replace with:

```javascript
// ── Helpers ───────────────────────────────────────────────────────────────────
function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function fmtTime(ts) {
  const d = new Date(ts);
  return String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
}
function isNearBottom() {
  return msgsEl.scrollHeight - msgsEl.scrollTop - msgsEl.clientHeight < 80;
}
function appendChat(html) {
  const atBottom = isNearBottom();
  msgsEl.insertAdjacentHTML('beforeend', html);
  if (atBottom) msgsEl.scrollTop = msgsEl.scrollHeight;
}
function renderMsg(from, text, ts) {
  const isOwn = from === MY_CODENAME;
  const color = isOwn ? '#7777cc' : codenameColor(from);
  appendChat(`<div class="msg">
    <span class="ts">${fmtTime(ts)}</span>
    <span class="from" style="color:${color}">[${esc(from)}]</span>
    <span class="text">${esc(text)}</span>
  </div>`);
}
function renderSystem(text) {
  appendChat(`<div class="sys">&gt;&gt; ${esc(text)}</div>`);
}

// ── Firebase ──────────────────────────────────────────────────────────────────
let db, msgsRef, presRef;

function initFirebase() {
  firebase.initializeApp(FIREBASE_CONFIG);
  db      = firebase.database();
  msgsRef = db.ref('tower/messages');
  presRef = db.ref('tower/presence');
}

function loadMessages() {
  msgsRef.limitToLast(50).on('child_added', snap => {
    const d = snap.val();
    if (d && d.from && d.text) renderMsg(d.from, d.text, d.ts || Date.now());
  });
}

function setupPresence() {
  const myPresRef = presRef.child(MY_CODENAME);
  myPresRef.set(true);
  myPresRef.onDisconnect().remove();

  presRef.on('value', snap => {
    const keys = snap.val() ? Object.keys(snap.val()) : [];
    countEl.textContent = keys.length + ' online';
  });
  presRef.on('child_added', snap => {
    if (snap.key !== MY_CODENAME) renderSystem(snap.key + ' connected');
  });
  presRef.on('child_removed', snap => {
    renderSystem(snap.key + ' disconnected');
  });
}

function setupOfflineDetection() {
  db.ref('.info/connected').on('value', snap => {
    if (snap.val()) {
      dotEl.className = 'dot connected';
    } else {
      dotEl.className = 'dot';
      countEl.textContent = 'reconnecting...';
    }
  });
}

function sendMessage() {
  const text = msgInput.value.trim().slice(0, 500);
  if (!text) return;
  msgInput.value = '';
  msgsRef.push({ from: MY_CODENAME, text, ts: firebase.database.ServerValue.TIMESTAMP })
    .catch(() => renderSystem('failed to send'));
}

// ── Chat init ─────────────────────────────────────────────────────────────────
function enterChat() {
  gateEl.hidden   = true;
  chatWrap.hidden = false;
  codenameEl.textContent = MY_CODENAME;
  initFirebase();
  loadMessages();
  setupPresence();
  setupOfflineDetection();
  msgInput.focus();
}

// ── Input handlers ────────────────────────────────────────────────────────────
sendBtn.addEventListener('click', sendMessage);
msgInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
});

// ── Boot ──────────────────────────────────────────────────────────────────────
if (hasAccess()) {
  enterChat();
} else {
  showLoginForm();
}
```

- [ ] Open `http://localhost:8000/secret.html`, sign in with correct creds
  - Header shows your codename in purple, a small dot (should turn green after Firebase connects), and "N online"
- [ ] Type a message and press Enter → message appears in chat with timestamp + codename
- [ ] Click send button with a message → same result
- [ ] Open Firebase console → **Realtime Database** → should see `tower/messages/{id}` entries
- [ ] Open a second tab (new incognito window to get a fresh sessionStorage), sign in → should see user count become "2 online" and a system message `>> [other-codename] connected`
- [ ] Send from tab 2 → message appears in tab 1 within ~1 second
- [ ] Close tab 2 → tab 1 shows `>> [codename] disconnected`, count drops to "1 online"
- [ ] Commit:

```bash
git add html/secret.html
git commit -m "feat: add Firebase chat, presence, and message rendering to secret.html"
```

---

### Task 5: Update `scenes-secret.js` — transition animation and redirect

**Files:**
- Modify: `html/js/scenes-secret.js` — replace entire file

- [ ] Replace the entire contents of `html/js/scenes-secret.js` with:

```javascript
function scene_secret_site() {
  clearSocialProof();
  removeChatBtn();
  document.querySelector('.depth-pill')?.remove();
  setOverlay('');
  root.innerHTML = `
  <div style="min-height:100vh;background:#08080e;display:flex;align-items:center;justify-content:center;font-family:'Courier New',monospace">
    <div style="max-width:480px;padding:3rem;text-align:center">
      <div style="font-size:.55rem;color:#1a1a2e;letter-spacing:.22em;margin-bottom:3rem;text-transform:uppercase">Access Granted</div>
      <div style="font-size:1rem;color:#3a3a5e;line-height:2.2;margin-bottom:3rem">you found it.</div>
      <div id="ss-status" style="font-size:.52rem;color:#1a1a38;letter-spacing:.12em">connecting to tower</div>
    </div>
  </div>`;

  sessionStorage.setItem('nexus_tower_access', '1');

  const el = document.getElementById('ss-status');
  const frames = [
    'connecting to tower.',
    'connecting to tower..',
    'connecting to tower...',
    'connecting to tower',
    'connecting to tower.',
    'connecting to tower..',
  ];
  let i = 0;
  const iv = setInterval(() => {
    el.textContent = frames[i++ % frames.length];
    el.style.color = '#2a2a48';
  }, 400);

  setTimeout(() => {
    clearInterval(iv);
    window.location.href = '/secret.html';
  }, 2400);
}
```

- [ ] Open `http://localhost:8000`, navigate to sign in, enter `labrinth@nexus.app` / `d3pth0`
  - Should see "you found it." with "connecting to tower..." animating for ~2.4s
  - Page auto-redirects to `secret.html` and enters chat immediately (no credential gate — flag was set before redirect)
- [ ] Commit:

```bash
git add html/js/scenes-secret.js
git commit -m "feat: animate secret site transition and redirect to /secret.html"
```

---

### Task 6: Smoke test — full two-user flow

**No files changed.**

- [ ] Open **two different browser profiles** (or one normal + one incognito) — they must not share sessionStorage
- [ ] **Browser 1:** Go to `http://localhost:8000`, sign in with `labrinth@nexus.app` / `d3pth0`, watch transition animation, confirm you land in tower chat with a codename like `leverage_7f4a`
- [ ] **Browser 2:** Go directly to `http://localhost:8000/secret.html` — credential gate should appear
- [ ] **Browser 2:** Enter correct credentials — should enter chat
- [ ] Both browsers show "2 online" and each other's join system message
- [ ] Send a message from Browser 1 → appears in Browser 2 within ~1s
- [ ] Send a message from Browser 2 → appears in Browser 1 within ~1s
- [ ] Close Browser 2 → Browser 1 shows `>> [codename] disconnected`, count drops to "1 online"
- [ ] **Browser 3 (new incognito):** Go to `http://localhost:8000/secret.html` → enter wrong creds → see denial screen → click "try again" → enter correct creds → enter chat
- [ ] Verify last 50 messages from earlier in this session loaded for Browser 3 on entry
