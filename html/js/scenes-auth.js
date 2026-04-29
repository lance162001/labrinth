function scene_signin() {
  incDepth();
  root.innerHTML = `
  <div style="min-height:100vh;background:#fff;font-family:Helvetica,Arial,sans-serif">
    <div style="border-bottom:5px solid #000;padding:1rem 1.5rem">
      <div style="font-size:2.25rem;font-weight:900;text-transform:uppercase;letter-spacing:-.04em;color:#000;line-height:1">NEXUS</div>
    </div>
    <div style="max-width:500px;padding:3rem 1.5rem">
      <h1 style="font-size:3rem;font-weight:900;text-transform:uppercase;line-height:.95;letter-spacing:-.03em;margin-bottom:2rem;border-bottom:8px solid #000;padding-bottom:1rem">CREATE<br>ACCOUNT</h1>
      <div style="margin-bottom:1.75rem">
        <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;letter-spacing:.14em;margin-bottom:.3rem;color:#000">WORK EMAIL ADDRESS *</div>
        <input class="brut-input" type="email" placeholder="YOU@COMPANY.COM" style="text-transform:uppercase">
        <div style="font-size:.58rem;color:#999;margin-top:.2rem;font-family:'Courier New',Courier;text-transform:uppercase">* Credit card required after day 1 to verify identity</div>
      </div>
      <div style="margin-bottom:1.75rem">
        <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;letter-spacing:.14em;margin-bottom:.3rem;color:#000">FULL LEGAL NAME *</div>
        <input class="brut-input" type="text" placeholder="AS APPEARS ON GOVERNMENT-ISSUED ID">
      </div>
      <button class="brut-btn" data-go="signup" style="margin-bottom:1.25rem">→ CREATE ACCOUNT NOW</button>
      <div style="border-top:3px solid #000;padding-top:1rem">
        <div style="font-size:.68rem;line-height:1.55;font-family:'Courier New',Courier;color:#333;text-transform:uppercase">BY CLICKING ABOVE YOU AGREE TO ALL APPLICABLE TERMS INCLUDING BUT NOT LIMITED TO THE TERMS OF SERVICE, PRIVACY POLICY, ACCEPTABLE USE POLICY, DATA PROCESSING AGREEMENT, COOKIE POLICY, EULA, AND ALL FUTURE AGREEMENTS NOT YET WRITTEN.<br><br><a data-go="signin_actual" style="color:#000;font-weight:700;cursor:pointer;text-decoration:underline">ALREADY HAVE AN ACCOUNT? SIGN IN.</a></div>
      </div>
    </div>
  </div>`;
  setOverlay('');
}

function scene_signin_actual() {
  root.innerHTML = navHTML() + `
  <div style="max-width:420px;margin:5rem auto;padding:2rem 1.5rem">
    <h1 style="font-size:1.75rem;font-weight:700;margin-bottom:.35rem">Sign in</h1>
    <p style="font-size:.875rem;color:var(--g500);margin-bottom:2rem">Welcome back.</p>
    <div class="form-group">
      <label>Email</label>
      <input type="email" placeholder="you@company.com" id="si-email">
    </div>
    <div class="form-group">
      <label>Password</label>
      <input type="password" placeholder="••••••••" id="si-pass">
    </div>
    <button class="btn btn-primary" style="width:100%;margin-bottom:.75rem" onclick="checkSignin()">Sign In →</button>
    <p style="text-align:center;font-size:.8rem;color:var(--g500)">Forgot password? <a data-go="forgot_password" style="color:var(--blue);cursor:pointer">Reset it</a></p>
  </div>`;
  setOverlay('');
}

window.checkSignin = function() {
  const email = (document.getElementById('si-email')?.value || '').trim();
  const pass = document.getElementById('si-pass')?.value || '';
  if (email === 'labrinth@nexus.app' && pass === 'd3pth0') {
    scene_secret_site();
  } else {
    scene_signin_sso();
  }
};

function scene_signin_sso() {
  setOverlay(`
  <div class="backdrop">
    <div class="modal" style="max-width:400px">
      <div class="modal-body" style="text-align:center;padding:2rem">
        <div style="font-size:1.5rem;margin-bottom:1rem">🔐</div>
        <h3 style="font-weight:700;margin-bottom:.5rem">SSO Required</h3>
        <p style="font-size:.875rem;color:var(--g500);margin-bottom:1.5rem;line-height:1.5">Your organization requires Single Sign-On. Please sign in through your company's identity provider.</p>
        <button class="btn btn-primary" style="width:100%;margin-bottom:.5rem" data-go="signin_sso_redirect">Continue with SSO →</button>
        <button class="btn btn-ghost" data-go="signin_actual">Use password instead</button>
      </div>
    </div>
  </div>`);
}

function scene_signin_sso_redirect() {
  setOverlay('');
  root.innerHTML = navHTML() + `
  <div class="loading-page">
    <div class="spinner big-spinner"></div>
    <p>Redirecting to your identity provider…</p>
  </div>`;
  setTimeout(() => {
    root.innerHTML = navHTML() + `
    <div style="max-width:500px;margin:6rem auto;padding:2rem;text-align:center">
      <div style="font-size:2rem;margin-bottom:1rem">⚠️</div>
      <h2 style="font-weight:700;margin-bottom:.75rem">SSO Configuration Error</h2>
      <p style="color:var(--g500);font-size:.9rem;margin-bottom:.75rem;line-height:1.5">We couldn't find an SSO configuration for your domain. Please contact your administrator, or sign in with a password.</p>
      <p style="font-size:.75rem;color:var(--g300);margin-bottom:1.5rem">Error: SAML_METADATA_NOT_FOUND (tenant: unknown)</p>
      <button class="btn btn-primary" data-go="signin_actual">Sign In with Password</button>
    </div>`;
  }, 2200);
}

function scene_forgot_password() {
  root.innerHTML = navHTML() + `
  <div style="max-width:400px;margin:6rem auto;padding:2rem 1.5rem">
    <h1 style="font-size:1.5rem;font-weight:700;margin-bottom:.35rem">Reset your password</h1>
    <p style="font-size:.875rem;color:var(--g500);margin-bottom:1.5rem">Enter your email and we'll send you a reset link.</p>
    <div class="form-group">
      <label>Email</label>
      <input type="email" placeholder="you@company.com">
    </div>
    <button class="btn btn-primary" style="width:100%" data-go="forgot_sent">Send Reset Link</button>
  </div>`;
}

function scene_forgot_sent() {
  root.innerHTML = navHTML() + `
  <div style="max-width:400px;margin:6rem auto;padding:2rem 1.5rem;text-align:center">
    <div style="font-size:2rem;margin-bottom:1rem">📬</div>
    <h2 style="font-weight:700;margin-bottom:.5rem">Check your email</h2>
    <p style="color:var(--g500);font-size:.875rem;margin-bottom:1.5rem;line-height:1.5">We sent a reset link to your email address. It will expire in 15 minutes.</p>
    <button class="btn btn-ghost" data-go="signin_actual">Back to Sign In</button>
    <p style="font-size:.75rem;color:var(--g400);margin-top:1rem">Didn't receive it? <span data-go="forgot_resent" style="color:var(--blue);cursor:pointer">Resend</span></p>
  </div>`;
}

function scene_forgot_resent() {
  toast('Reset link sent. Please check your spam folder.');
  setTimeout(() => { toast('Note: Previous link is now invalid. Only the latest link works.'); }, 1500);
}

// ────────────── GAMESHOW HELPERS ──────────────

const GS_CATCHPHRASES = [
  "ROUND 1 — WHO ARE YOU?!",
  "ROUND 2 — SECURITY GAUNTLET!",
  "ROUND 3 — WE NEED EVERYTHING!",
  "ROUND 4 — MANDATORY BONUS ROUND!",
  "ROUND 5 — CONNECT YOUR EMPIRE!",
  "BONUS ROUND — BRING YOUR FRIENDS!",
  "FINAL CHALLENGE — PROVE YOU'RE HUMAN!",
];

const GS_CONTESTANT_COUNTS = [14284,14219,14253,14198,14211,14267,14230];

function fireConfetti() {
  const colors = ['#F0B429','#ff4444','#4af','#fff','#ff69b4','#00ff88'];
  for (let i = 0; i < 60; i++) {
    const el = document.createElement('div');
    el.className = 'confetti';
    el.style.cssText = `left:${Math.random()*100}vw;top:-20px;background:${colors[i%colors.length]};width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;animation-duration:${1.2+Math.random()*2}s;animation-delay:${Math.random()*.6}s`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  }
}

function gsWrap(stepIdx, totalSteps, formHtml, nextScene, backScene) {
  const pct = Math.round(((stepIdx)/totalSteps)*100);
  const catchphrase = GS_CATCHPHRASES[Math.min(stepIdx, GS_CATCHPHRASES.length-1)];
  const count = GS_CONTESTANT_COUNTS[stepIdx % GS_CONTESTANT_COUNTS.length] + Math.floor(Math.random()*80);
  const tickerText = `★ ${count.toLocaleString()} CONTESTANTS ONLINE NOW  ★  YOU ARE COMPETING IN REAL TIME  ★  LEADERBOARD UPDATED EVERY 60 SECONDS  ★  TOP PERFORMERS UNLOCK PRO FEATURES  ★  NEXUS LIVE — WHERE PRODUCTIVITY IS A SPORT  ★`;
  return `<div class="gs-bg">
    <div class="gs-stage">
      <div class="gs-header">
        <div class="gs-logo">NEXUS<span style="color:#fff;font-size:.7em"> LIVE</span></div>
        <div class="gs-live">🔴 LIVE</div>
      </div>
      <div class="gs-contestant">🏆 ${count.toLocaleString()} CONTESTANTS COMPETING RIGHT NOW</div>
      <div class="gs-badge">CHALLENGE ${stepIdx+1} OF ${totalSteps}</div>
      <div class="gs-catchphrase">${catchphrase}</div>
      <div style="width:100%;max-width:540px;margin-bottom:.5rem">
        <div class="gs-prog-label"><span>PROGRESS</span><span>${pct}%</span></div>
        <div class="gs-prog-bar"><div class="gs-prog-inner" style="width:${pct}%"></div></div>
      </div>
      <div class="gs-card">
        ${formHtml}
        <div style="display:flex;gap:.5rem;margin-top:1rem">
          ${backScene ? `<button style="flex-shrink:0;padding:.85rem 1rem;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.6);border-radius:8px;cursor:pointer;font-size:.8rem" data-go="${backScene}">← BACK</button>` : ''}
          <button class="gs-btn" data-go="${nextScene}" style="${backScene?'flex:1':'width:100%'}">SUBMIT ANSWER →</button>
        </div>
      </div>
    </div>
    <div class="gs-bottom-ticker"><div class="gs-ticker-inner">${tickerText}</div></div>
  </div>`;
}

// ────────────── SIGNUP FLOW ──────────────

const SIGNUP_STEPS = [
  { label: 'Account', total: 3 },
  { label: 'Security', total: 5 },
  { label: 'Profile', total: 8 },
  { label: 'Phone', total: 8 },
  { label: 'Integrations', total: 8 },
  { label: 'Team', total: 8 },
  { label: 'Verify', total: 8 },
];

function signupProgressHTML(stepIdx) {
  const { total } = SIGNUP_STEPS[stepIdx];
  const pct = ((stepIdx+1)/total)*100;
  return `
  <div class="progress-label"><span>Step ${stepIdx+1} of ${total}</span><span>${Math.round(pct)}% complete</span></div>
  <div class="progress-bar-outer"><div class="progress-bar-inner" style="width:${pct}%"></div></div>`;
}

function scene_signup() {
  S.signupStep = 0;
  setOverlay('');
  root.innerHTML = gsWrap(0, 8, `
    <div class="form-group">
      <label>Work email <span style="color:#F0B429">*</span></label>
      <input type="email" placeholder="you@company.com" id="signup-email">
      <span class="field-note">Use your work email to unlock team features.</span>
    </div>
    <div style="display:flex;gap:.5rem;align-items:flex-start;margin-bottom:.5rem">
      <input type="checkbox" id="tos" style="width:16px;height:16px;margin-top:.2rem;flex-shrink:0;accent-color:#F0B429">
      <label for="tos" style="font-size:.72rem;color:rgba(255,255,255,.4);font-weight:400">I agree to the <a data-go="terms" style="color:#F0B429;cursor:pointer">Terms</a>, <a data-go="privacy" style="color:#F0B429;cursor:pointer">Privacy Policy</a>, <a data-go="cookie_prefs" style="color:#F0B429;cursor:pointer">Cookie Policy</a>, <a data-go="legal_doc" style="color:#F0B429;cursor:pointer">DPA</a>, <a data-go="legal_doc" style="color:#F0B429;cursor:pointer">EULA</a>, <a data-go="legal_doc" style="color:#F0B429;cursor:pointer">Acceptable Use</a>, and <a data-go="legal" style="color:#F0B429;cursor:pointer">all other applicable agreements</a>.</label>
    </div>
    <div style="font-size:.62rem;color:rgba(255,255,255,.2);line-height:1.5;margin-top:.75rem">* Credit card required on day 2 to confirm identity. You will not be charged until day 15 unless you selected a paid plan, in which case you will be charged immediately.</div>
  `, 'signup_2', null);
}

function scene_signup_2() {
  S.signupStep = 1; setOverlay('');
  root.innerHTML = gsWrap(1, 8, `
    <div class="form-group"><label>Password <span style="color:#F0B429">*</span></label>
      <input type="password" placeholder="At least 12 characters">
      <span class="field-note">Must contain uppercase, lowercase, number, symbol, and a character not found on a standard keyboard.</span></div>
    <div class="form-group"><label>Confirm password <span style="color:#F0B429">*</span></label>
      <input type="password" placeholder="Repeat password"></div>
    <div style="background:rgba(240,180,41,.08);border:1px solid rgba(240,180,41,.2);border-radius:6px;padding:.65rem .85rem;font-size:.72rem;color:rgba(255,255,255,.4)">
      🔒 Passwords expire every 30 days. A reminder will be sent 29 days from now.</div>
  `, 'signup_3', 'signup');
}

function scene_signup_3() {
  S.signupStep = 2; setOverlay('');
  fireConfetti();
  root.innerHTML = gsWrap(2, 8, `
    <div style="background:rgba(0,255,100,.08);border:1px solid rgba(0,255,100,.2);border-radius:6px;padding:.5rem .85rem;font-size:.75rem;color:rgba(0,255,130,.7);margin-bottom:1rem">✓ Password accepted! You're through to Round 3!</div>
    <div class="form-group"><label>Full legal name <span style="color:#F0B429">*</span></label><input type="text" placeholder="As it appears on government ID"></div>
    <div class="form-group"><label>Job title <span style="color:#F0B429">*</span></label><input type="text" placeholder="e.g. Head of Digital Transformation"></div>
    <div class="form-group"><label>Company name <span style="color:#F0B429">*</span></label><input type="text" placeholder="Your company"></div>
    <div class="form-group"><label>Company size <span style="color:#F0B429">*</span></label>
      <select><option value="">— Select —</option>${['1','2–10','11–50','51–200','201–500','501–1000','1001–5000','5001+'].map(o=>`<option>${o}</option>`).join('')}</select></div>
    <div class="form-group"><label>Primary role <span style="color:#F0B429">*</span></label>
      <select><option value="">— Select —</option>${['Engineering','Product','Design','Marketing','Sales','Operations','Finance','Legal','HR','Executive','Other'].map(o=>`<option>${o}</option>`).join('')}</select></div>
    <div class="form-group"><label>What are you hoping to achieve? <span style="color:#F0B429">*</span></label>
      <textarea style="min-height:70px;background:rgba(0,0,0,.3);border-color:rgba(255,255,255,.15);color:#fff" placeholder="Describe in at least 50 words. Judges are watching."></textarea></div>
  `, 'signup_4', 'signup_2');
}

function scene_signup_4() {
  S.signupStep = 3; setOverlay('');
  root.innerHTML = gsWrap(3, 8, `
    <div style="background:rgba(255,80,80,.08);border:1px solid rgba(255,80,80,.25);border-radius:6px;padding:.6rem .85rem;font-size:.75rem;color:rgba(255,120,120,.8);margin-bottom:1rem">
      ⚠ MANDATORY BONUS ROUND — this challenge cannot be skipped</div>
    <div class="form-group"><label>Mobile phone number <span style="color:#F0B429">*</span></label>
      <input type="tel" placeholder="+1 (555) 000-0000">
      <span class="field-note">Standard messaging rates apply. Marketing texts will be sent unless you opt out after receiving your first message.</span></div>
    <button style="width:100%;padding:.5rem;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);color:rgba(255,255,255,.25);border-radius:6px;cursor:not-allowed;font-size:.75rem;margin-top:.25rem" disabled>Skip this round — LOCKED</button>
  `, 'signup_5', 'signup_3');
}

function scene_signup_5() {
  S.signupStep = 4; setOverlay('');
  root.innerHTML = gsWrap(4, 8, `
    <div class="form-group"><label style="color:rgba(255,255,255,.6);font-size:.78rem">Select your tools (tap to connect):</label></div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem;margin-bottom:.5rem">
      ${['Slack','GitHub','Jira','Notion','Figma','Google Drive','Salesforce','Zendesk','Linear'].map(t=>`<div style="border:1px solid rgba(255,255,255,.12);border-radius:6px;padding:.65rem;text-align:center;cursor:pointer;font-size:.75rem;color:rgba(255,255,255,.6);transition:all .15s" onclick="this.style.borderColor='#F0B429';this.style.color='#F0B429'">${t}</div>`).join('')}
    </div>
    <div style="font-size:.68rem;color:rgba(255,255,255,.25);text-align:center;margin-top:.4rem">Teams that connect tools score 40% higher. Don't fall behind.</div>
  `, 'signup_6', 'signup_4');
}

function scene_signup_6_warn() {
  setOverlay(`
  <div class="backdrop">
    <div class="modal" style="max-width:380px">
      <div class="modal-body" style="padding:1.75rem;text-align:center">
        <div style="font-size:2rem;margin-bottom:1rem">😟</div>
        <h3 style="font-weight:700;margin-bottom:.5rem">Are you sure?</h3>
        <p style="font-size:.875rem;color:var(--g500);margin-bottom:1.5rem;line-height:1.5">Users who skip integrations during onboarding report <strong>40% less value</strong> from Nexus. You can always add them later — but most people don't.</p>
        <button class="btn btn-primary" style="width:100%;margin-bottom:.5rem" data-go="signup_5">Add Integrations</button>
        <button class="btn btn-ghost" data-go="signup_6">Skip anyway (not recommended)</button>
      </div>
    </div>
  </div>`);
}

function scene_signup_6() {
  setOverlay('');
  S.signupStep = 5;
  root.innerHTML = gsWrap(5, 8, `
    <div style="background:rgba(240,180,41,.08);border:1px solid rgba(240,180,41,.2);border-radius:6px;padding:.6rem .85rem;font-size:.72rem;color:rgba(255,255,255,.5);margin-bottom:1rem">
      🤝 TEAM MULTIPLIER ROUND — recruit your crew for bonus points</div>
    <div class="form-group">
      <label>Email addresses (comma-separated)</label>
      <textarea style="min-height:80px;background:rgba(0,0,0,.3);border-color:rgba(255,255,255,.15);color:#fff" placeholder="alice@company.com, bob@company.com…"></textarea>
    </div>
    <div class="form-group">
      <label>Default role</label>
      <select style="background:rgba(0,0,0,.35);border-color:rgba(255,255,255,.15);color:#fff"><option>Member</option><option>Editor</option><option>Viewer</option><option>Admin</option></select>
    </div>
    <button class="btn btn-ghost" style="width:100%;color:rgba(255,255,255,.2);margin-top:.3rem;font-size:.7rem" data-go="signup_7_warn">Skip (score penalty applies)</button>
  `, 'signup_7', 'signup_5');
}

function scene_signup_7_warn() {
  setOverlay(`
  <div class="backdrop">
    <div class="modal" style="max-width:380px">
      <div class="modal-body" style="padding:1.75rem;text-align:center">
        <div style="font-size:2rem;margin-bottom:1rem">😢</div>
        <h3 style="font-weight:700;margin-bottom:.5rem">Going solo?</h3>
        <p style="font-size:.875rem;color:var(--g500);margin-bottom:1.5rem;line-height:1.5">Teams that skip this step churn <strong>3× faster</strong>. We just want to make sure you get the most out of Nexus.</p>
        <button class="btn btn-primary" style="width:100%;margin-bottom:.5rem" data-go="signup_6">Invite Team</button>
        <button class="btn btn-ghost" data-go="signup_7">Continue alone (we won't judge)</button>
      </div>
    </div>
  </div>`);
}

function scene_signup_7() {
  setOverlay('');
  S.signupStep = 6;
  root.innerHTML = gsWrap(6, 8, `
    <div style="background:rgba(0,255,100,.08);border:1px solid rgba(0,255,100,.2);border-radius:6px;padding:.5rem .85rem;font-size:.75rem;color:rgba(0,255,130,.7);margin-bottom:1rem">
      📬 FINAL CHALLENGE — prove your inbox exists</div>
    <div class="form-group">
      <label>Verification code <span style="color:#F0B429">—</span> expires in <span id="vtimer" style="color:#F0B429">10:00</span></label>
      <input type="text" id="vcode" maxlength="6" placeholder="000000" autocomplete="one-time-code">
      <span class="field-note"><a data-go="signup_resend" style="color:#F0B429;cursor:pointer">Resend code</a> · Previous codes are instantly invalidated</span>
    </div>
    <div id="verr"></div>
  `, 'verify_check', 'signup_6');
  S.verifyAttempts = 0;
  let secs = 600;
  const iv = setInterval(()=>{
    secs--;
    const el = document.getElementById('vtimer');
    if(el){ const m=Math.floor(secs/60);const s=secs%60;el.textContent=m+':'+(s<10?'0':'')+s; }
    else clearInterval(iv);
    if(secs<=0){ clearInterval(iv); if(document.getElementById('vtimer')){ document.getElementById('vtimer').textContent='EXPIRED'; const btn=document.querySelector('.gs-btn');if(btn)btn.disabled=true; }}
  },1000);
}

function scene_verify_check() {
  S.verifyAttempts++;
  const err = document.getElementById('verr');
  if(S.verifyAttempts === 1) {
    if(err) err.innerHTML = `<div class="alert alert-warn" style="margin-bottom:1rem">That code doesn't look right. Please check and try again.</div>`;
    const btn = document.getElementById('vsubmit');
    if(btn){ btn.dataset.go='verify_check'; }
  } else if(S.verifyAttempts === 2) {
    if(err) err.innerHTML = `<div class="alert alert-warn" style="margin-bottom:1rem">Incorrect again. One attempt remaining before your account is locked.</div>`;
  } else {
    narratorEnter('verify_bypass');
    scene_verify_bypass();
  }
}

function scene_signup_resend() {
  toast('New code sent! Note: previous code is now invalid.');
  S.verifyAttempts = 0;
  const el = document.getElementById('verr');
  if(el) el.innerHTML='';
}

function scene_verify_locked() {
  root.innerHTML = `
  <div class="gs-bg">
    <div class="gs-stage">
      <div class="gs-header" style="max-width:640px;width:100%">
        <div class="gs-logo">NEXUS LIVE</div>
        <div class="gs-live">● LIVE</div>
      </div>
      <div style="font-size:5rem;margin:1.5rem 0">😔</div>
      <div class="gs-catchphrase" style="color:#ff6b6b;font-size:2rem;margin-bottom:.5rem">ELIMINATED.</div>
      <div style="font-size:.8rem;color:rgba(255,255,255,.3);margin-bottom:2rem;letter-spacing:.1em;text-transform:uppercase">Too many incorrect attempts</div>
      <div class="gs-card" style="text-align:center;max-width:480px">
        <p style="font-size:.875rem;color:rgba(255,255,255,.45);line-height:1.7;margin-bottom:1.5rem">Your account has been temporarily locked for security.<br>The studio audience is aware of what happened.</p>
        <div id="locktimer" style="font-size:2.5rem;font-weight:900;color:#F0B429;font-family:'Arial Black',sans-serif;margin:.5rem 0">30:00</div>
        <div style="font-size:.65rem;color:rgba(255,255,255,.2);margin-bottom:1.5rem">time remaining before retry</div>
        <button class="gs-btn" style="max-width:280px;margin:0 auto;display:block" data-go="signup_7">Try Again Anyway</button>
      </div>
    </div>
    <div class="gs-bottom-ticker"><div class="gs-ticker-inner">🔴 ACCOUNT LOCKED · STUDIO AUDIENCE IS WATCHING · 30 MINUTES UNTIL RETRY · WE BELIEVE IN YOU ANYWAY · THIS IS YOUR FAULT · 🔴 ACCOUNT LOCKED · STUDIO AUDIENCE IS WATCHING · 30 MINUTES UNTIL RETRY</div></div>
  </div>`;
  setOverlay('');
  let secs = 1800;
  const iv = setInterval(()=>{
    secs--;
    const el = document.getElementById('locktimer');
    if(el){ const m=Math.floor(secs/60);const s=secs%60;el.textContent=m+':'+(s<10?'0':'')+s; }
    else clearInterval(iv);
    if(secs<=0){ clearInterval(iv); if(document.getElementById('locktimer')){ scene_signup_7(); } }
  },1000);
}

// ─── VERIFY BYPASS ───
function scene_verify_bypass() {
  setOverlay('');
  root.innerHTML = `
  <div class="gs-bg">
    <div class="gs-stage">
      <div class="gs-header" style="max-width:640px;width:100%">
        <div class="gs-logo">NEXUS<span style="color:#fff;font-size:.7em"> LIVE</span></div>
        <div class="gs-live">🔴 LIVE</div>
      </div>
      <div style="font-size:4rem;margin:1.5rem 0">✅</div>
      <div class="gs-catchphrase" style="color:#00e676;font-size:1.75rem;margin-bottom:.5rem">IDENTITY VERIFIED.</div>
      <div style="font-size:.75rem;color:rgba(255,255,255,.3);margin-bottom:2rem;letter-spacing:.12em;text-transform:uppercase">via Behavioral Authentication™</div>
      <div class="gs-card" style="text-align:left;max-width:480px">
        <p style="font-size:.875rem;color:rgba(255,255,255,.55);line-height:1.7;margin-bottom:1.25rem">
          Manual code entry failed 3 times. Our AI system has verified your identity using passive biometrics instead.
        </p>
        <div style="font-size:.78rem;color:rgba(255,255,255,.35);line-height:2.2;margin-bottom:1.75rem">
          <div>✓ &nbsp;Typing rhythm — matched (94.2%)</div>
          <div>✓ &nbsp;Mouse movement entropy — within normal range</div>
          <div>✓ &nbsp;Browser fingerprint — verified</div>
          <div>✓ &nbsp;IP reputation — acceptable</div>
          <div style="color:rgba(255,255,100,.4)">⚠ &nbsp;One behavioral anomaly noted and logged</div>
        </div>
        <button class="gs-btn" style="width:100%" data-go="onboard_start">Enter Workspace →</button>
      </div>
    </div>
    <div class="gs-bottom-ticker"><div class="gs-ticker-inner">✅ IDENTITY CONFIRMED · ANOMALY LOGGED TO YOUR RECORD · WELCOME TO NEXUS · YOUR DATA IS SAFE WITH US · PROBABLY · ✅ IDENTITY CONFIRMED · ANOMALY LOGGED · WELCOME</div></div>
  </div>`;
}

