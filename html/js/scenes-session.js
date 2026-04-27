// ────────────── SESSION EXPIRY ──────────────

function scene_session_expire() {
  setOverlay(`<div class="backdrop"><div class="modal" style="max-width:380px"><div class="modal-body" style="padding:1.75rem;text-align:center">
    <div style="font-size:1.75rem;margin-bottom:.75rem">⏱</div>
    <h3 style="font-weight:700;margin-bottom:.5rem">Your session is about to expire</h3>
    <p style="font-size:.875rem;color:var(--g500);margin-bottom:.4rem;line-height:1.5">Due to inactivity, you'll be signed out in <strong id="exp-count">60</strong> seconds. Any unsaved work will be lost.</p>
    <p style="font-size:.72rem;color:var(--g300);margin-bottom:1.5rem">(You have 0 unsaved items)</p>
    <button class="btn btn-primary" style="width:100%;margin-bottom:.5rem" data-go="session_extend">Stay Signed In</button>
    <button class="btn btn-ghost" data-go="signin_actual">Sign Out</button>
  </div></div></div>`);
  let n = 60;
  const iv = setInterval(()=>{
    n--;
    const el = document.getElementById('exp-count');
    if (el) el.textContent = n;
    else clearInterval(iv);
    if (n <= 0) { clearInterval(iv); scene_signin_actual(); }
  }, 1000);
  S._expIv = iv;
}

function scene_session_extend() {
  clearInterval(S._expIv);
  setOverlay('');
  toast('Session extended.');
  setTimeout(()=>toast('🔒 Please verify your identity to continue.'),1200);
  setTimeout(()=>{
    setOverlay(`<div class="backdrop"><div class="modal" style="max-width:400px"><div class="modal-body" style="padding:1.5rem">
      <h3 style="font-weight:700;margin-bottom:.5rem">Verify your identity</h3>
      <p style="font-size:.875rem;color:var(--g500);margin-bottom:1.25rem">For security, please re-enter your password to continue.</p>
      <div class="form-group"><label>Password</label><input type="password" placeholder="••••••••"></div>
      <div style="display:flex;gap:.75rem">
        <button class="btn btn-secondary" style="flex:1" data-go="signin_actual">Sign Out</button>
        <button class="btn btn-primary" style="flex:1" data-go="session_reverify">Continue</button>
      </div>
    </div></div></div>`);
  }, 2000);
}

function scene_session_reverify() {
  setOverlay('');
  toast('✅ Session extended successfully.');
  S.sessionTimer = setTimeout(() => scene_session_expire(), 38000);
}

// ────────────── DATA EXPORT ──────────────

function scene_data_export() {
  incDepth();
  clearSocialProof();
  setOverlay('');
  if (S.exportGlitchTimer) { clearTimeout(S.exportGlitchTimer); S.exportGlitchTimer = null; }
  root.innerHTML = dashNavHTML() + `
  <div class="dashboard-layout">
    ${dashSidebar('export')}
    <div class="dash-content">
      <div class="dash-header"><h1>Export Your Data</h1></div>
      <div style="max-width:520px">
        <p style="font-size:.875rem;color:var(--g500);margin-bottom:1.5rem;line-height:1.5">Download a copy of all your Nexus data, including projects, comments, settings, and metadata.</p>
        ${S.exportRequested ? `
          <div style="border:1px solid var(--g200);border-radius:12px;padding:1.25rem;margin-bottom:1.5rem" id="exp-card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.75rem">
              <div style="font-weight:600">Export Request</div>
              <span class="badge badge-gray">Processing</span>
            </div>
            <div style="height:6px;background:var(--g100);border-radius:4px;margin-bottom:.5rem"><div style="height:6px;background:var(--blue);border-radius:4px;width:0%;transition:width .3s" id="exp-bar"></div></div>
            <div style="font-size:.75rem;color:var(--g400)" id="exp-status">0% complete · Estimated time: 3–5 business days</div>
          </div>
          <div class="alert alert-info" style="font-size:.8rem" id="exp-alert">An export is already in progress. Please wait for it to complete before requesting a new one.</div>
          <div id="br-door" style="display:none;margin-top:1.25rem">
            <div class="alert" style="background:#fef3c7;border-color:#f59e0b;color:#92400e;font-size:.8rem;margin-bottom:1rem">⚠ Something went wrong with the export pipeline. Error: EXPORT_OVERFLOW.</div>
            <button class="btn btn-secondary" onclick="scene_backrooms_enter()">Open diagnostic console →</button>
          </div>` : `
          <div style="border:1px solid var(--g200);border-radius:12px;padding:1.5rem;margin-bottom:1.5rem">
            <div style="font-weight:600;margin-bottom:.75rem">What's included:</div>
            <ul style="font-size:.875rem;color:var(--g600);padding-left:1.25rem;line-height:2">
              <li>Account information</li>
              <li>Projects (0)</li>
              <li>Comments (0)</li>
              <li>Activity log</li>
              <li>Cookie consent history</li>
              <li>Survey responses</li>
            </ul>
          </div>
          <div class="alert alert-warn" style="font-size:.8rem;margin-bottom:1.25rem">⚠ Export requests are processed within 3–5 business days. You will receive an email when your export is ready. The download link expires after 24 hours.</div>
          <button class="btn btn-primary" data-go="export_request">Request Data Export</button>`}
      </div>
    </div>
  </div>`;
  injectChatBtn();
  if (S.exportRequested) {
    S.exportGlitchTimer = setTimeout(() => {
      const bar = document.getElementById('exp-bar');
      const status = document.getElementById('exp-status');
      const alert = document.getElementById('exp-alert');
      const door = document.getElementById('br-door');
      if (!bar) return;
      let pct = 0;
      const iv = setInterval(() => {
        pct += Math.random() * 9 + 3;
        if (pct >= 107) {
          pct = 107;
          clearInterval(iv);
          bar.style.width = '107%';
          bar.style.background = 'var(--red)';
          bar.style.borderRadius = '4px';
          if (status) status.textContent = 'Error — pipeline fault. Code: EXPORT_OVERFLOW.';
          if (alert) alert.style.display = 'none';
          if (door) door.style.display = 'block';
        } else {
          bar.style.width = pct + '%';
          if (pct > 80) bar.style.background = 'var(--yellow)';
          if (pct > 98) bar.style.background = 'var(--red)';
          if (status) status.textContent = Math.round(pct) + '% complete' + (pct > 85 ? ' · overrun detected…' : ' · Estimated time: 3–5 business days');
        }
      }, 280);
    }, 45000);
  }
}

function scene_export_request() {
  S.exportRequested = true;
  toast('📦 Export requested. You\'ll receive an email in 3–5 business days.');
  setTimeout(()=>toast('📧 Confirmation email sent.'),1500);
  setTimeout(()=>scene_data_export(),2000);
}

// ────────────── MOBILE PROMPT ──────────────

function scene_mobile_prompt() {
  if (S.inAdventure) return;
  S.mobilePromptDismissals++;
  setOverlay(`<div class="backdrop"><div class="modal" style="max-width:360px"><div class="modal-body" style="padding:1.5rem;text-align:center">
    <div style="font-size:2.5rem;margin-bottom:1rem">📱</div>
    <h3 style="font-weight:700;margin-bottom:.5rem">Get the Nexus App</h3>
    <p style="font-size:.875rem;color:var(--g500);margin-bottom:1.25rem;line-height:1.5">The full Nexus experience is only available on mobile. Desktop is a limited preview.</p>
    <div style="display:flex;gap:.75rem;margin-bottom:1rem">
      <button class="btn btn-secondary" style="flex:1" data-go="mobile_download">📱 iOS</button>
      <button class="btn btn-secondary" style="flex:1" data-go="mobile_download">🤖 Android</button>
    </div>
    <button class="btn btn-ghost" data-go="close_overlay">Continue on desktop (limited experience)</button>
    ${S.mobilePromptDismissals>1?`<div style="font-size:.7rem;color:var(--g300);margin-top:.5rem">You've dismissed this ${S.mobilePromptDismissals} times.</div>`:''}
  </div></div></div>`);
}

function scene_mobile_download() {
  setOverlay('');
  root.innerHTML = navHTML() + `
  <div style="max-width:400px;margin:6rem auto;padding:2rem 1.5rem;text-align:center">
    <div style="font-size:2.5rem;margin-bottom:1rem">📱</div>
    <h2 style="font-weight:700;margin-bottom:.5rem">Download Nexus Mobile</h2>
    <p style="color:var(--g500);font-size:.875rem;margin-bottom:1.5rem;line-height:1.5">Scan the QR code below with your phone to download the app.</p>
    <div style="width:160px;height:160px;background:var(--g100);border-radius:12px;margin:0 auto 1.5rem;display:flex;align-items:center;justify-content:center;font-size:.75rem;color:var(--g400);border:1px solid var(--g200)">
      QR code<br><span style="font-size:.65rem">(currently unavailable)</span>
    </div>
    <p style="font-size:.75rem;color:var(--g400);margin-bottom:1.5rem">App requires iOS 16+ or Android 12+. Nexus Mobile is currently in closed beta. <a data-go="newsletter_sub" style="color:var(--blue);cursor:pointer">Join the waitlist.</a></p>
    <button class="btn btn-secondary" data-go="dashboard">Back to Dashboard</button>
  </div>`;
}

// ────────────── CHECKLIST CLICK HANDLER ──────────────

document.addEventListener('click', e => {
  const el = e.target.closest('[data-check]');
  if (el) {
    const id = el.dataset.check;
    if (!S.onboardingDone[id]) {
      S.onboardingDone[id] = true;
      el.classList.add('done');
      el.innerHTML = '✓';
      toast('✅ Step marked complete!');
      setTimeout(() => {
        if (Object.keys(S.onboardingDone).length >= 3 && !S.onboardingDone._survey) {
          S.onboardingDone._survey = false;
          toast('🎉 You\'re making progress! One more thing — please complete a quick survey.');
        }
      }, 500);
      setTimeout(() => scene_dashboard(), 800);
    }
  }
});

