// ─── ONBOARDING HELPER ───
function onboardProgressHTML(step, total) {
  const pct = Math.round((step / total) * 100);
  return `
  <div style="margin-bottom:2rem">
    <div style="display:flex;justify-content:space-between;font-size:.72rem;color:var(--g400);margin-bottom:.5rem">
      <span style="font-weight:600;color:var(--blue)">Workspace Setup</span>
      <span>Step ${step} of ${total}</span>
    </div>
    <div style="height:6px;background:var(--g100);border-radius:999px;overflow:hidden">
      <div style="height:100%;width:${pct}%;background:var(--blue);border-radius:999px"></div>
    </div>
  </div>`;
}

// ─── STEP 0: WELCOME ───
function scene_onboard_start() {
  S.onboardAvatarAttempts = 0;
  S.onboardCalAttempts = 0;
  S.onboardInvitesSent = 0;
  S.onboardBouncedEmails = [];
  S.onboardQuizAttempts = 0;
  S.onboardQuizQ = 0;
  S.onboardNotifWarnings = 0;
  setOverlay('');
  root.innerHTML = `
  <div style="min-height:100vh;background:#f8f9fa;display:flex;align-items:center;justify-content:center;padding:2rem">
    <div style="background:#fff;border-radius:16px;padding:2.5rem;max-width:560px;width:100%;box-shadow:0 4px 24px rgba(0,0,0,.08)">
      <div style="text-align:center;margin-bottom:2rem">
        <div style="font-size:2.5rem;margin-bottom:.75rem">🎉</div>
        <h2 style="font-size:1.5rem;font-weight:700;color:var(--g900);margin-bottom:.5rem">Welcome to Nexus!</h2>
        <p style="color:var(--g500);font-size:.875rem;line-height:1.6">Before you can access your workspace, we need to complete a few quick setup steps.</p>
      </div>
      <div style="display:flex;flex-direction:column;gap:.5rem;margin-bottom:1.75rem">
        ${[
          ['📁','Name your workspace','~30 seconds'],
          ['🖼️','Add a profile photo','~1 minute'],
          ['📅','Connect your calendar','~2 minutes'],
          ['👥','Invite your team (required)','~1 minute'],
          ['🎯','Choose your use case','~30 seconds'],
          ['🔔','Configure notifications','~1 minute'],
          ['🎬','Watch onboarding video','~4 minutes'],
          ['🔒','Complete security check','~2 minutes'],
        ].map(([icon, label, time]) => `
          <div style="display:flex;align-items:center;gap:.75rem;padding:.6rem .85rem;background:#f8f9fa;border-radius:8px;font-size:.84rem">
            <span>${icon}</span>
            <span style="flex:1;color:var(--g700)">${label}</span>
            <span style="color:var(--g400);font-size:.72rem">${time}</span>
          </div>`).join('')}
      </div>
      <p style="font-size:.7rem;color:var(--g300);text-align:center;margin-bottom:1.25rem">Estimated total time: ~12 minutes · All steps are required to activate your account</p>
      <button class="btn btn-primary" style="width:100%;padding:.85rem" data-go="onboard_workspace">Let's go →</button>
    </div>
  </div>`;
}

// ─── STEP 1: WORKSPACE NAME ───
function scene_onboard_workspace() {
  setOverlay('');
  const checks = S.onboardWorkspaceChecks || 0;
  const lastSlug = S.onboardWorkspaceSlug || '';
  const suggestedSlug = lastSlug ? lastSlug + '-hq' : '';
  const urlErrHTML = checks === 1
    ? `<div style="background:#f8d7da;border:1px solid #dc3545;border-radius:6px;padding:.6rem .85rem;font-size:.78rem;color:#721c24;margin-top:.4rem">❌ <strong>app.nexus.io/${lastSlug}</strong> is already taken.</div>`
    : checks === 2
    ? `<div style="background:#f8d7da;border:1px solid #dc3545;border-radius:6px;padding:.6rem .85rem;font-size:.78rem;color:#721c24;margin-top:.4rem">❌ That name is reserved by another organization.</div>`
    : checks >= 3
    ? `<div style="background:#f8d7da;border:1px solid #dc3545;border-radius:6px;padding:.6rem .85rem;font-size:.78rem;color:#721c24;margin-top:.4rem">❌ Still taken. <strong>app.nexus.io/${suggestedSlug}</strong> is available. <span onclick="scene_onboard_workspace_accept('${suggestedSlug}')" style="color:var(--blue);cursor:pointer;text-decoration:underline;font-weight:600">Use this URL →</span></div>`
    : '';
  root.innerHTML = `
  <div style="min-height:100vh;background:#f8f9fa;display:flex;align-items:center;justify-content:center;padding:2rem">
    <div style="background:#fff;border-radius:16px;padding:2.5rem;max-width:540px;width:100%;box-shadow:0 4px 24px rgba(0,0,0,.08)">
      ${onboardProgressHTML(1, 8)}
      <h2 style="font-size:1.25rem;font-weight:700;color:var(--g900);margin-bottom:.4rem">Name your workspace</h2>
      <p style="color:var(--g500);font-size:.875rem;margin-bottom:1.5rem">This is how your team will identify your Nexus environment.</p>
      <div class="form-group" style="margin-bottom:1rem">
        <label style="color:var(--g700)">Workspace name <span style="color:var(--red)">*</span></label>
        <input type="text" id="ws-name" placeholder="e.g. Acme Corp" style="font-size:1rem" value="${S.onboardWorkspaceName || ''}">
      </div>
      <div class="form-group" style="margin-bottom:.4rem">
        <label style="color:var(--g700)">Workspace URL <span style="color:var(--red)">*</span></label>
        <div style="display:flex;align-items:center;border:1.5px solid var(--g200);border-radius:8px;overflow:hidden">
          <span style="padding:.7rem .85rem;background:#f8f9fa;color:var(--g400);font-size:.85rem;border-right:1.5px solid var(--g200);white-space:nowrap">app.nexus.io/</span>
          <input type="text" id="ws-slug" placeholder="your-workspace" value="${lastSlug}" style="border:none;border-radius:0;font-size:.875rem;flex:1;box-shadow:none">
        </div>
      </div>
      ${urlErrHTML}
      <div class="field-note" style="margin-bottom:1.75rem;margin-top:.4rem">Lowercase letters, numbers, and hyphens only. Cannot be changed later.</div>
      <button class="btn btn-primary" style="width:100%" onclick="scene_onboard_workspace_submit()">Check availability →</button>
    </div>
  </div>`;
}

function scene_onboard_workspace_submit() {
  const slug = (document.getElementById('ws-slug') || {}).value || '';
  const name = (document.getElementById('ws-name') || {}).value || '';
  if(!slug.trim()) { toast('Please enter a workspace URL.'); return; }
  if(!name.trim()) { toast('Please enter a workspace name.'); return; }
  S.onboardWorkspaceSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
  S.onboardWorkspaceName = name.trim();
  S.onboardWorkspaceChecks = (S.onboardWorkspaceChecks || 0) + 1;
  scene_onboard_workspace();
}

function scene_onboard_workspace_accept(slug) {
  S.onboardWorkspaceSlug = slug;
  scene_onboard_avatar();
}

// ─── STEP 2: AVATAR ───
function scene_onboard_avatar() {
  setOverlay('');
  const n = S.onboardAvatarAttempts || 0;
  const errHTML = n === 1
    ? `<div style="background:#fff3cd;border:1px solid #ffc107;border-radius:8px;padding:.75rem 1rem;font-size:.8rem;color:#856404;margin-bottom:1rem"><strong>Photo rejected.</strong> Minimum resolution is 400×400 pixels. Please upload a higher quality image.</div>`
    : n >= 2
    ? `<div style="background:#f8d7da;border:1px solid #dc3545;border-radius:8px;padding:.75rem 1rem;font-size:.8rem;color:#721c24;margin-bottom:1rem"><strong>Photo rejected by compliance AI.</strong> Requirements: clear face, no sunglasses, neutral background, no filters, face centered, eyes open, no hats.</div>`
    : '';
  const skipHTML = n >= 2
    ? `<div onclick="scene_onboard_calendar()" style="text-align:center;margin-top:.75rem;font-size:.78rem;color:var(--g400);cursor:pointer;text-decoration:underline">Skip for now (some features will be limited)</div>`
    : '';
  root.innerHTML = `
  <div style="min-height:100vh;background:#f8f9fa;display:flex;align-items:center;justify-content:center;padding:2rem">
    <div style="background:#fff;border-radius:16px;padding:2.5rem;max-width:540px;width:100%;box-shadow:0 4px 24px rgba(0,0,0,.08)">
      ${onboardProgressHTML(2, 8)}
      <h2 style="font-size:1.25rem;font-weight:700;color:var(--g900);margin-bottom:.4rem">Add a profile photo</h2>
      <p style="color:var(--g500);font-size:.875rem;margin-bottom:1.25rem">Help your teammates recognize you.</p>
      ${errHTML}
      <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;margin-bottom:1.5rem">
        <div data-avatar-preview style="width:100px;height:100px;border-radius:50%;background:var(--g100);border:2px dashed var(--g300);display:flex;align-items:center;justify-content:center;font-size:3rem">
          ${n > 0 ? '❌' : '👤'}
        </div>
        <div style="font-size:.72rem;color:var(--g400);text-align:center;line-height:1.7">
          JPG or PNG only · Min 400×400px · Max 5MB<br>
          No filters · Neutral background · Clear face · No glasses<br>
          Eyes open · Good lighting · Centered · No hats
        </div>
      </div>
      <label style="width:100%;text-align:center;padding:.75rem;background:var(--blue);color:#fff;border-radius:8px;cursor:pointer;font-size:.875rem;font-weight:600;margin-bottom:.5rem;display:block">
        Upload Photo
        <input type="file" accept="image/jpeg,image/png" style="display:none" onchange="scene_onboard_avatar_upload(this)">
      </label>
      ${skipHTML}
    </div>
  </div>`;
}

function scene_onboard_avatar_upload(input) {
  if (!input || !input.files || !input.files.length) return;
  const file = input.files[0];
  const preview = document.querySelector('[data-avatar-preview]');
  const reader = new FileReader();
  reader.onload = e => {
    if (preview) {
      preview.style.background = `url(${e.target.result}) center/cover`;
      preview.textContent = '';
    }
    setTimeout(() => {
      S.onboardAvatarAttempts = (S.onboardAvatarAttempts || 0) + 1;
      narratorEnter('onboard_avatar');
      scene_onboard_avatar();
    }, 800);
  };
  reader.readAsDataURL(file);
}

// ─── STEP 3: CALENDAR ───
function scene_onboard_calendar() {
  setOverlay('');
  const fails = S.onboardCalAttempts || 0;
  const icalSection = fails >= 3 ? `
    <div style="background:#f8f9fa;border:1px solid var(--g200);border-radius:10px;padding:1.1rem 1.25rem;margin-top:.75rem">
      <div style="font-size:.8rem;font-weight:600;color:var(--g700);margin-bottom:.4rem">Connect via iCal URL</div>
      <div style="font-size:.75rem;color:var(--g500);margin-bottom:.75rem">Enter your calendar's iCal feed URL manually (webcal:// or https://).</div>
      <div style="display:flex;gap:.5rem">
        <input type="url" id="ical-url" placeholder="webcal://calendar.google.com/…" style="flex:1;font-size:.8rem">
        <button class="btn btn-primary btn-sm" onclick="scene_onboard_cal_ical()">Connect</button>
      </div>
    </div>` : '';
  root.innerHTML = `
  <div style="min-height:100vh;background:#f8f9fa;display:flex;align-items:center;justify-content:center;padding:2rem">
    <div style="background:#fff;border-radius:16px;padding:2.5rem;max-width:540px;width:100%;box-shadow:0 4px 24px rgba(0,0,0,.08)">
      ${onboardProgressHTML(3, 8)}
      <h2 style="font-size:1.25rem;font-weight:700;color:var(--g900);margin-bottom:.4rem">Connect your calendar</h2>
      <p style="color:var(--g500);font-size:.875rem;margin-bottom:1.5rem">Required to sync deadlines and meetings. <strong style="color:var(--red)">Cannot be skipped.</strong></p>
      <div id="cal-msg" style="margin-bottom:1rem"></div>
      <div style="display:flex;flex-direction:column;gap:.65rem">
        <button class="btn btn-secondary" style="display:flex;align-items:center;gap:.75rem;justify-content:center;padding:.85rem" onclick="scene_onboard_cal_try('Google Calendar')">
          <span style="font-size:1.1rem">📅</span> Connect Google Calendar
        </button>
        <button class="btn btn-secondary" style="display:flex;align-items:center;gap:.75rem;justify-content:center;padding:.85rem" onclick="scene_onboard_cal_try('Outlook')">
          <span style="font-size:1.1rem">📧</span> Connect Outlook Calendar
        </button>
        <button class="btn btn-secondary" style="display:flex;align-items:center;gap:.75rem;justify-content:center;padding:.85rem;opacity:.5;cursor:not-allowed" disabled>
          <span style="font-size:1.1rem">🍎</span> Apple Calendar <span style="font-size:.72rem;color:var(--g400);margin-left:.25rem">— Business plan only</span>
        </button>
      </div>
      ${icalSection}
    </div>
  </div>`;
}

function scene_onboard_cal_try(provider) {
  const msg = document.getElementById('cal-msg');
  if(!msg) return;
  S.onboardCalAttempts = (S.onboardCalAttempts || 0) + 1;
  msg.innerHTML = `<div style="background:#f0f7ff;border:1px solid #bee3f8;border-radius:8px;padding:.75rem 1rem;font-size:.8rem;color:#2b6cb0">⏳ Connecting to ${provider}…</div>`;
  setTimeout(() => {
    const m = document.getElementById('cal-msg');
    const fails = S.onboardCalAttempts || 0;
    const hint = fails >= 3 ? ' <em style="opacity:.7">Try the iCal URL option below.</em>' : '';
    if(m) m.innerHTML = `<div style="background:#f8d7da;border:1px solid #dc3545;border-radius:8px;padding:.75rem 1rem;font-size:.8rem;color:#721c24">❌ Connection failed. ${provider} service temporarily unavailable. <span style="opacity:.6">(Error: OAUTH_STATE_MISMATCH_403)</span>${hint}</div>`;
    if(fails >= 3) { narratorEnter('onboard_calendar'); scene_onboard_calendar(); }
  }, 2500);
}

function scene_onboard_cal_ical() {
  const url = (document.getElementById('ical-url') || {}).value || '';
  if(!url.trim()) { toast('Please enter an iCal URL.'); return; }
  if(!/^(webcal|https?):\/\//i.test(url.trim())) { toast('URL must begin with webcal:// or https://'); return; }
  const msg = document.getElementById('cal-msg');
  if(msg) msg.innerHTML = `<div style="background:#f0f7ff;border:1px solid #bee3f8;border-radius:8px;padding:.75rem 1rem;font-size:.8rem;color:#2b6cb0">⏳ Validating iCal feed…</div>`;
  setTimeout(() => {
    toast('iCal feed registered. Sync will complete within 3–5 business days.');
    setTimeout(() => { narratorEnter('onboard_teammates'); scene_onboard_teammates(); }, 1200);
  }, 2000);
}

// ─── STEP 4: TEAMMATES ───
function scene_onboard_teammates() {
  setOverlay('');
  const BOUNCE_ERRORS = [
    'Gmail addresses are not permitted on Business plan workspaces.',
    'This domain is already registered with another Nexus organization.',
    'Role-based addresses (admin@, info@, noreply@, etc.) cannot be invited.',
    'This user has previously declined a Nexus invitation and cannot be re-invited for 30 days.',
    'Email address failed MX record validation.',
    'Free email providers are not eligible for Business plan invitations.',
    'Disposable email addresses are not permitted.',
  ];
  const bounces = S.onboardInvitesSent || 0;
  const csvUploads = S.onboardCsvUploads || 0;
  const bounceLog = (S.onboardBouncedEmails || []).map((email, i) =>
    `<div style="display:flex;align-items:flex-start;gap:.5rem;padding:.5rem .75rem;background:#fff3cd;border:1px solid #ffc10733;border-radius:6px;font-size:.75rem;color:#856404;margin-bottom:.4rem">
      ⚠ <div><strong>${email}</strong> — ${BOUNCE_ERRORS[i % BOUNCE_ERRORS.length]}</div>
    </div>`
  ).join('');
  const csvSection = bounces >= 4 ? `
    <div style="background:#f8f9fa;border:1px solid var(--g200);border-radius:10px;padding:1.1rem 1.25rem;margin-top:.75rem">
      <div style="font-size:.8rem;font-weight:600;color:var(--g700);margin-bottom:.3rem">Upload team roster (CSV)</div>
      <div style="font-size:.75rem;color:var(--g500);margin-bottom:.75rem">Required columns: <code>first_name, last_name, email, role</code></div>
      <label style="display:flex;align-items:center;gap:.65rem;padding:.65rem .85rem;background:#fff;border:1.5px dashed var(--g300);border-radius:8px;cursor:pointer;font-size:.8rem;color:var(--g600)">
        📎 Choose CSV file
        <input type="file" accept=".csv,text/csv" style="display:none" onchange="scene_onboard_csv_upload(this)">
      </label>
      ${csvUploads > 0 ? `<div style="font-size:.75rem;color:var(--red);margin-top:.5rem">CSV processed: 0 valid addresses found. All ${csvUploads === 1 ? 'address' : csvUploads + ' addresses'} failed validation.</div>` : ''}
    </div>` : '';
  const waiverSection = csvUploads >= 2 ? `
    <div style="background:#fff3cd;border:1px solid #ffc107;border-radius:10px;padding:1.1rem 1.25rem;margin-top:.75rem">
      <div style="font-size:.8rem;font-weight:600;color:#856404;margin-bottom:.4rem">Request solo workspace exception</div>
      <div style="font-size:.75rem;color:#856404;margin-bottom:.75rem">Explain why you are unable to invite any teammates. Minimum 50 words. Requests are reviewed within 5–7 business days.</div>
      <textarea id="waiver-text" style="width:100%;min-height:90px;font-size:.8rem;border:1.5px solid #ffc107;border-radius:6px;padding:.6rem;box-sizing:border-box;resize:vertical" placeholder="Describe your situation…"></textarea>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:.5rem">
        <span id="waiver-count" style="font-size:.7rem;color:var(--g400)">0 words</span>
        <button class="btn btn-primary btn-sm" onclick="scene_onboard_waiver_submit()">Submit Request</button>
      </div>
    </div>` : '';
  root.innerHTML = `
  <div style="min-height:100vh;background:#f8f9fa;display:flex;align-items:center;justify-content:center;padding:2rem">
    <div style="background:#fff;border-radius:16px;padding:2.5rem;max-width:540px;width:100%;box-shadow:0 4px 24px rgba(0,0,0,.08)">
      ${onboardProgressHTML(4, 8)}
      <h2 style="font-size:1.25rem;font-weight:700;color:var(--g900);margin-bottom:.4rem">Invite your team</h2>
      <p style="color:var(--g500);font-size:.875rem;margin-bottom:1.25rem">You must invite at least 2 teammates to activate your workspace. <strong style="color:var(--red)">Cannot be skipped.</strong></p>
      ${bounceLog}
      <div style="display:flex;gap:.5rem;margin-bottom:.5rem">
        <input type="email" id="invite-input" placeholder="colleague@company.com" style="flex:1">
        <button class="btn btn-primary btn-sm" onclick="scene_onboard_invite_send()">Send</button>
      </div>
      <div style="font-size:.72rem;color:var(--g400);margin-bottom:.5rem">${bounces} sent · ${bounces} bounced · 0 accepted</div>
      ${csvSection}
      ${waiverSection}
    </div>
  </div>`;
  if(waiverSection) {
    const ta = document.getElementById('waiver-text');
    const wc = document.getElementById('waiver-count');
    if(ta && wc) ta.addEventListener('input', () => { wc.textContent = ta.value.trim().split(/\s+/).filter(Boolean).length + ' words'; });
  }
}

function scene_onboard_invite_send() {
  const input = document.getElementById('invite-input');
  const email = input ? input.value.trim() : '';
  if (!email) { toast('Please enter an email address.'); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast('Please enter a valid email address.'); return; }
  S.onboardBouncedEmails = S.onboardBouncedEmails || [];
  S.onboardBouncedEmails.push(email);
  S.onboardInvitesSent = (S.onboardInvitesSent || 0) + 1;
  narratorEnter('onboard_teammates');
  scene_onboard_teammates();
}

function scene_onboard_csv_upload(input) {
  if(!input || !input.files || !input.files.length) return;
  S.onboardCsvUploads = (S.onboardCsvUploads || 0) + 1;
  narratorEnter('onboard_teammates');
  scene_onboard_teammates();
}

function scene_onboard_waiver_submit() {
  const ta = document.getElementById('waiver-text');
  const text = ta ? ta.value.trim() : '';
  const words = text.split(/\s+/).filter(Boolean).length;
  if(words < 50) { toast(`${words} of 50 required words. Please explain further.`); return; }
  toast('Waiver request submitted. You may proceed while it is under review (5–7 business days).');
  setTimeout(() => { narratorEnter('onboard_usecase'); scene_onboard_usecase(); }, 1200);
}

// ─── STEP 5: USE CASE ───
function scene_onboard_usecase() {
  setOverlay('');
  root.innerHTML = `
  <div style="min-height:100vh;background:#f8f9fa;display:flex;align-items:center;justify-content:center;padding:2rem">
    <div style="background:#fff;border-radius:16px;padding:2.5rem;max-width:540px;width:100%;box-shadow:0 4px 24px rgba(0,0,0,.08)">
      ${onboardProgressHTML(5, 8)}
      <h2 style="font-size:1.25rem;font-weight:700;color:var(--g900);margin-bottom:.4rem">What will you use Nexus for?</h2>
      <p style="color:var(--g500);font-size:.875rem;margin-bottom:1.5rem">We'll customize your experience and configure the right templates.</p>
      <div style="display:flex;flex-direction:column;gap:.5rem;margin-bottom:1.5rem">
        ${['Engineering & Development','Marketing & Growth','Sales & Revenue','Operations & HR','Finance & Legal','Other'].map((uc, i) =>
          `<label style="display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;border:1.5px solid var(--g200);border-radius:8px;cursor:pointer;font-size:.875rem;color:var(--g700)">
            <input type="radio" name="usecase" value="${uc}" style="accent-color:var(--blue)"> ${uc}
          </label>`).join('')}
      </div>
      <button class="btn btn-primary" style="width:100%" onclick="scene_onboard_usecase_submit()">Continue →</button>
    </div>
  </div>`;
}

function scene_onboard_usecase_submit() {
  const sel = document.querySelector('input[name="usecase"]:checked');
  const uc = sel ? sel.value : 'General';
  toast(`${uc} templates added! 3 new required configuration steps have been queued.`);
  setTimeout(() => { narratorEnter('onboard_notifications'); scene_onboard_notifications(); }, 700);
}

// ─── STEP 6: NOTIFICATIONS ───
function scene_onboard_notifications() {
  setOverlay('');
  const notifList = [
    ['Email digests','Daily activity summaries'],
    ['Project mentions','When you\'re @mentioned in a project'],
    ['Task assignments','When tasks are assigned to you'],
    ['Due date reminders','48 hours before each deadline'],
    ['Weekly reports','Your productivity summary every Monday'],
    ['Security alerts','Login attempts and account changes'],
    ['Product updates','New features and improvements'],
    ['Marketing emails','Tips, webinars, and special offers'],
    ['Partner offers','Curated offers from Nexus partners'],
    ['SMS alerts','Urgent notifications via text message'],
  ];
  root.innerHTML = `
  <div style="min-height:100vh;background:#f8f9fa;display:flex;align-items:center;justify-content:center;padding:2rem">
    <div style="background:#fff;border-radius:16px;padding:2.5rem;max-width:540px;width:100%;box-shadow:0 4px 24px rgba(0,0,0,.08)">
      ${onboardProgressHTML(6, 8)}
      <h2 style="font-size:1.25rem;font-weight:700;color:var(--g900);margin-bottom:.4rem">Notification preferences</h2>
      <p style="color:var(--g500);font-size:.875rem;margin-bottom:1.25rem">All notifications are enabled by default for a complete experience.</p>
      <div style="display:flex;flex-direction:column;gap:.4rem;margin-bottom:1.5rem">
        ${notifList.map(([title, desc]) => `
          <div style="display:flex;align-items:center;gap:.75rem;padding:.65rem .85rem;border:1px solid var(--g100);border-radius:8px">
            <div style="flex:1">
              <div style="font-size:.84rem;color:var(--g800);font-weight:500">${title}</div>
              <div style="font-size:.7rem;color:var(--g400)">${desc}</div>
            </div>
            <input type="checkbox" checked style="width:18px;height:18px;accent-color:var(--blue);flex-shrink:0" onchange="scene_onboard_notif_warn('${title.replace(/'/g, "\\'")}',this)">
          </div>`).join('')}
      </div>
      <button class="btn btn-primary" style="width:100%" data-go="onboard_video">Save & Continue →</button>
    </div>
  </div>`;
}

function scene_onboard_notif_warn(title, el) {
  el.checked = true;
  S.onboardNotifWarnings = (S.onboardNotifWarnings || 0) + 1;
  if(S.onboardNotifWarnings <= 3) {
    toast(`Warning: Disabling "${title}" may cause you to miss critical workspace updates.`);
  } else {
    toast('Notification preferences for this workspace are managed by your administrator and cannot be changed during onboarding.');
  }
}

// ─── STEP 7: VIDEO ───
function scene_onboard_video() {
  setOverlay('');
  root.innerHTML = `
  <div style="min-height:100vh;background:#f8f9fa;display:flex;align-items:center;justify-content:center;padding:2rem">
    <div style="background:#fff;border-radius:16px;padding:2.5rem;max-width:540px;width:100%;box-shadow:0 4px 24px rgba(0,0,0,.08)">
      ${onboardProgressHTML(7, 8)}
      <h2 style="font-size:1.25rem;font-weight:700;color:var(--g900);margin-bottom:.4rem">Watch the onboarding video</h2>
      <p style="color:var(--g500);font-size:.875rem;margin-bottom:1.25rem">Required by your workspace security policy. Estimated length: <em>4 minutes 12 seconds.</em></p>
      <div style="width:100%;aspect-ratio:16/9;background:#111;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:.75rem">
        <div id="vid-status" style="color:rgba(255,255,255,.5);font-size:.875rem;text-align:center">
          <div style="font-size:1.5rem;margin-bottom:.5rem">⏳</div>
          Loading video…
        </div>
      </div>
      <div style="height:4px;background:var(--g100);border-radius:999px;overflow:hidden;margin-bottom:.75rem">
        <div id="vid-prog" style="height:100%;width:0%;background:var(--blue)"></div>
      </div>
      <div id="vid-skip" style="text-align:center;display:none;margin-bottom:1rem">
        <span style="font-size:.75rem;color:var(--g400)">Having trouble? </span>
        <span onclick="scene_onboard_video_skip()" style="font-size:.75rem;color:var(--blue);cursor:pointer;text-decoration:underline">Skip video (not recommended)</span>
      </div>
      <div id="vid-confirm" style="display:none">
        <div style="font-size:.8rem;color:var(--g600);margin-bottom:.5rem;line-height:1.5">To confirm you have reviewed the onboarding material, type the following phrase exactly:</div>
        <div style="font-family:monospace;font-size:.8rem;background:#f8f9fa;border:1px solid var(--g200);border-radius:6px;padding:.5rem .75rem;margin-bottom:.75rem;color:var(--g700);user-select:all">I have reviewed the Nexus onboarding material</div>
        <input type="text" id="vid-phrase" placeholder="Type the phrase above…" style="margin-bottom:.75rem;font-size:.875rem">
        <button class="btn btn-primary" style="width:100%" onclick="scene_onboard_video_confirm()">Continue →</button>
      </div>
    </div>
  </div>`;
  setTimeout(() => {
    const s = document.getElementById('vid-status');
    if(s) s.innerHTML = `<div style="font-size:1.5rem;margin-bottom:.5rem">❌</div><div>Video failed to load.</div><div style="font-size:.72rem;opacity:.5;margin-top:.3rem">Error: CDN_TIMEOUT_504</div>`;
  }, 3000);
  setTimeout(() => {
    const sk = document.getElementById('vid-skip');
    if(sk) sk.style.display = '';
  }, 5000);
}

function scene_onboard_video_skip() {
  const conf = document.getElementById('vid-confirm');
  const skip = document.getElementById('vid-skip');
  if(conf) conf.style.display = '';
  if(skip) skip.style.display = 'none';
}

function scene_onboard_video_confirm() {
  const input = document.getElementById('vid-phrase');
  const typed = (input ? input.value : '').trim().toLowerCase();
  const expected = 'i have reviewed the nexus onboarding material';
  if(typed !== expected) {
    toast('Phrase does not match. Please type it exactly as shown.');
    if(input) { input.style.border = '1.5px solid var(--red)'; setTimeout(() => input.style.border = '', 1200); }
    return;
  }
  narratorEnter('onboard_quiz');
  scene_onboard_quiz();
}

// ─── STEP 8: SECURITY QUIZ ───
const ONBOARD_QUIZ = [
  { q: 'Who is responsible for the security of your Nexus account?', opts: ['The Nexus security team', 'Your IT department', 'You, personally', 'Your workspace administrator'], correct: 2 },
  { q: 'How often does Nexus recommend rotating API access keys?', opts: ['Never — keys do not expire', 'Every 30 days', 'Every 90 days', 'Once per year'], correct: 2 },
  { q: 'A Nexus Support agent requests your password to diagnose a technical issue. You should:', opts: ['Provide it immediately to resolve faster', 'Ask for their employee ID first, then share', 'Share only via the secure in-app chat', 'Never share your password under any circumstances'], correct: 3 },
];

function scene_onboard_quiz() {
  setOverlay('');
  S.onboardQuizQ = S.onboardQuizQ || 0;
  const q = ONBOARD_QUIZ[S.onboardQuizQ];
  const errHTML = (S.onboardQuizAttempts || 0) > 0
    ? `<div style="background:#f8d7da;border:1px solid #f5c6cb;border-radius:8px;padding:.65rem .85rem;font-size:.78rem;color:#721c24;margin-bottom:1rem">Incorrect. Please review the Nexus Security Documentation and try again.</div>`
    : '';
  root.innerHTML = `
  <div style="min-height:100vh;background:#f8f9fa;display:flex;align-items:center;justify-content:center;padding:2rem">
    <div style="background:#fff;border-radius:16px;padding:2.5rem;max-width:540px;width:100%;box-shadow:0 4px 24px rgba(0,0,0,.08)">
      ${onboardProgressHTML(8, 8)}
      <div style="font-size:.72rem;color:var(--g400);margin-bottom:.75rem;text-transform:uppercase;letter-spacing:.08em">Security Awareness Check · Question ${S.onboardQuizQ + 1} of ${ONBOARD_QUIZ.length}</div>
      <h2 style="font-size:1.05rem;font-weight:700;color:var(--g900);margin-bottom:1.5rem;line-height:1.5">${q.q}</h2>
      ${errHTML}
      <div style="display:flex;flex-direction:column;gap:.5rem;margin-bottom:1.5rem">
        ${q.opts.map((opt, i) =>
          `<label style="display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;border:1.5px solid var(--g200);border-radius:8px;cursor:pointer;font-size:.875rem;color:var(--g700)">
            <input type="radio" name="quiz" value="${i}" style="accent-color:var(--blue)"> ${opt}
          </label>`).join('')}
      </div>
      <button class="btn btn-primary" style="width:100%" onclick="scene_onboard_quiz_submit()">Submit Answer</button>
    </div>
  </div>`;
}

function scene_onboard_quiz_submit() {
  const sel = document.querySelector('input[name="quiz"]:checked');
  if(!sel) { toast('Please select an answer before continuing.'); return; }
  const q = ONBOARD_QUIZ[S.onboardQuizQ];
  if(parseInt(sel.value) === q.correct) {
    S.onboardQuizQ++;
    S.onboardQuizAttempts = 0;
    if(S.onboardQuizQ >= ONBOARD_QUIZ.length) {
      S.onboardQuizQ = 0;
      narratorEnter('onboard_done');
      scene_onboard_done();
    } else {
      narratorEnter('onboard_quiz');
      scene_onboard_quiz();
    }
  } else {
    S.onboardQuizAttempts = (S.onboardQuizAttempts || 0) + 1;
    if(S.onboardQuizAttempts >= 3) {
      S.onboardQuizQ = 0;
      S.onboardQuizAttempts = 0;
      toast('Too many incorrect answers. Restarting security check from Question 1.');
      setTimeout(() => { narratorEnter('onboard_quiz'); scene_onboard_quiz(); }, 900);
    } else {
      narratorEnter('onboard_quiz');
      scene_onboard_quiz();
    }
  }
}

// ─── ONBOARDING DONE ───
function scene_onboard_done() {
  setOverlay('');
  root.innerHTML = `
  <div style="min-height:100vh;background:#f8f9fa;display:flex;align-items:center;justify-content:center;padding:2rem">
    <div style="background:#fff;border-radius:16px;padding:2.5rem;max-width:540px;width:100%;box-shadow:0 4px 24px rgba(0,0,0,.08);text-align:center">
      <div style="font-size:3rem;margin-bottom:1rem">🎊</div>
      <h2 style="font-size:1.5rem;font-weight:700;color:var(--g900);margin-bottom:.5rem">Setup Complete!</h2>
      <p style="color:var(--g500);font-size:.875rem;line-height:1.6;margin-bottom:1.75rem">Your workspace has been configured. Welcome to Nexus.</p>
      <div style="background:#f8f9fa;border-radius:10px;padding:1rem 1.25rem;margin-bottom:1.5rem;text-align:left">
        <div style="font-size:.7rem;color:var(--g400);margin-bottom:.65rem;text-transform:uppercase;letter-spacing:.08em;font-weight:600">Account Summary</div>
        ${[
          ['Workspace','My Workspace','var(--g800)'],
          ['Plan','Free Trial (14 days)','var(--g800)'],
          ['Teammates','0 of 2 required','var(--red)'],
          ['Calendar','Not connected','var(--red)'],
          ['Profile photo','Not uploaded','var(--red)'],
          ['Account setup','23% complete ⚠','var(--red)'],
        ].map(([k,v,c],i,a) =>
          `<div style="display:flex;justify-content:space-between;font-size:.8rem;color:var(--g600);padding:.35rem 0;${i<a.length-1?'border-bottom:1px solid var(--g100)':''}">
            <span>${k}</span><span style="color:${c};font-weight:500">${v}</span>
          </div>`).join('')}
      </div>
      <button class="btn btn-primary" style="width:100%;padding:.85rem" data-go="dashboard">Go to Dashboard →</button>
    </div>
  </div>`;
}

function scene_dashboard() {
  clearSocialProof();
  setOverlay('');
  const setupItems = [
    { done: true,  label: 'Create account' },
    { done: true,  label: 'Complete security check' },
    { done: false, label: 'Upload profile photo', go: 'onboard_avatar' },
    { done: false, label: 'Connect calendar', go: 'onboard_calendar' },
    { done: false, label: 'Invite 2 teammates (0 of 2)', go: 'onboard_teammates' },
    { done: false, label: 'Create first project', go: 'dash_new_project' },
    { done: false, label: 'Add payment method', go: 'pricing' },
    { done: false, label: 'Enable two-factor authentication', go: 'account_settings' },
    { done: false, label: 'Read Acceptable Use Policy', go: 'legal' },
    { done: false, label: 'Complete compliance training (3 modules)', go: 'onboard_quiz' },
    { done: false, label: 'Configure workspace integrations', go: 'onboard_calendar' },
  ];
  const doneCount = setupItems.filter(i => i.done).length;
  const pct = Math.round((doneCount / setupItems.length) * 100);
  root.innerHTML = `
  <nav class="nav">
    <a class="nav-logo" data-go="dashboard"><span>Nex</span>us</a>
    <div class="nav-links">
      <span style="font-size:.8rem;color:var(--g400)">Free Trial — <strong style="color:var(--red)">14 days remaining</strong></span>
      <button class="nav-cta" data-go="pricing">Upgrade</button>
      <div style="width:32px;height:32px;border-radius:50%;background:var(--blue);color:#fff;display:flex;align-items:center;justify-content:center;font-size:.85rem;font-weight:600;cursor:pointer" title="Account" data-go="account_settings">U</div>
    </div>
  </nav>
  <div class="dashboard-layout">
    <div class="sidebar">
      <div class="sidebar-item active">🏠 Home</div>
      <div class="sidebar-item" data-go="dash_projects">📁 Projects</div>
      <div class="sidebar-item" data-go="dash_inbox">📬 Inbox <span style="background:var(--blue);color:#fff;border-radius:999px;font-size:.65rem;padding:.05rem .4rem;margin-left:.3rem">3</span></div>
      <div class="sidebar-item" data-go="dash_settings">⚙️ Settings</div>
      <div style="margin-top:auto;padding-top:1rem;border-top:1px solid var(--g200);margin-top:2rem">
        <div class="sidebar-item" data-go="main" style="font-size:.8rem">← Back to Marketing Site</div>
      </div>
    </div>
    <div class="dash-content">
      <div class="upgrade-banner">
        <div><strong>Your free trial ends in 14 days.</strong> Add a payment method to avoid losing access to your data.</div>
        <button class="btn" data-go="checkout">Upgrade Now</button>
      </div>
      <div style="background:#fff8e1;border:1px solid #ffc107;border-radius:10px;padding:1.25rem 1.5rem;margin-bottom:1.25rem">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.65rem">
          <div>
            <div style="font-weight:600;color:var(--g800);font-size:.95rem">Account Setup</div>
            <div style="font-size:.72rem;color:var(--g500);margin-top:.15rem">${setupItems.length - doneCount} items remaining before your account is fully active</div>
          </div>
          <div style="font-size:1.35rem;font-weight:800;color:var(--red)">${pct}%</div>
        </div>
        <div style="height:8px;background:var(--g100);border-radius:999px;overflow:hidden;margin-bottom:1rem">
          <div style="height:100%;width:${pct}%;background:#ffc107;border-radius:999px"></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:.3rem">
          ${setupItems.map(item => `
            <div style="display:flex;align-items:center;gap:.6rem;font-size:.8rem;${item.done ? 'color:var(--g400)' : 'color:var(--g700)'};${item.go && !item.done ? 'cursor:pointer' : ''}" ${item.go && !item.done ? `data-go="${item.go}"` : ''}>
              <span style="flex-shrink:0">${item.done ? '✅' : '○'}</span>
              <span style="${item.done ? 'text-decoration:line-through' : ''}">${item.label}</span>
              ${!item.done && item.go ? '<span style="color:var(--blue);margin-left:auto;font-size:.7rem">Set up →</span>' : ''}
            </div>`).join('')}
        </div>
      </div>
      <div class="dash-header">
        <h1>Good morning 👋</h1>
        <button class="btn btn-primary btn-sm" data-go="dash_new_project">+ New Project</button>
      </div>
      <div class="empty-state">
        <div class="empty-state-icon">📭</div>
        <h3>No projects yet</h3>
        <p>Create your first project to get started with Nexus.</p>
        <button class="btn btn-primary" data-go="dash_new_project">Create a Project</button>
      </div>
    </div>
  </div>`;
}

function scene_dash_projects() {
  toast('Your projects will appear here. Create one to get started.');
  setTimeout(() => scene_dashboard(), 400);
}

function scene_dash_inbox() {
  setOverlay('');
  root.innerHTML = dashNavHTML() + `
  <div class="dashboard-layout">
    ${dashSidebar('inbox')}
    <div class="dash-content" style="max-width:680px">
      <div class="dash-header"><h1>Inbox <span style="background:var(--blue);color:#fff;border-radius:999px;font-size:.65rem;padding:.1rem .5rem;margin-left:.4rem;vertical-align:middle">3</span></h1></div>
      <div style="border:1px solid var(--g200);border-radius:12px;overflow:hidden">
        ${[
          { from:'Nexus Team', subject:'Your free trial started! Here\'s what to do first (1 of 14)', time:'Just now', unread:true,
            preview:'Welcome! We\'re so glad you\'re here. To get started, we recommend completing your profile, inviting your team, connecting your first integration, and reviewing our 47-page onboarding guide.', go:'inbox_email_1' },
          { from:'Nexus Team', subject:'You have 3 pending invitations waiting to be sent', time:'5 min ago', unread:true,
            preview:'Don\'t leave your teammates behind. Teams that invite colleagues on day one retain 60% better. Click here to send those invites now.', go:'inbox_email_2' },
          { from:'Alex Chen, CEO at Nexus', subject:'A personal note from our CEO', time:'12 min ago', unread:true,
            preview:'I write this email personally to every new user. Yes, every single one. My team tells me this doesn\'t scale. I disagree.', go:'inbox_email_3' },
        ].map(({from,subject,time,unread,preview,go})=>`
          <div style="padding:.85rem 1.1rem;border-bottom:1px solid var(--g100);cursor:pointer;background:${unread?'#F8FAFF':'#fff'}" data-go="${go}">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.2rem">
              <span style="font-size:.82rem;font-weight:${unread?700:500}">${from} ${unread?'<span style="display:inline-block;width:7px;height:7px;background:var(--blue);border-radius:50%;margin-left:4px;vertical-align:middle"></span>':''}</span>
              <span style="font-size:.72rem;color:var(--g400);flex-shrink:0">${time}</span>
            </div>
            <div style="font-size:.82rem;font-weight:${unread?600:400};margin-bottom:.2rem;color:var(--g900)">${subject}</div>
            <div style="font-size:.78rem;color:var(--g400);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${preview}</div>
          </div>`).join('')}
        <div style="padding:.85rem 1.1rem;cursor:pointer;background:#fff" onclick="showWelcomeEmail()">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.2rem">
            <span style="font-size:.82rem;font-weight:500">no-reply@nexus.com</span>
            <span style="font-size:.72rem;color:var(--g400)">Yesterday</span>
          </div>
          <div style="font-size:.82rem;font-weight:400;margin-bottom:.2rem;color:var(--g900)">You're subscribed to Nexus emails</div>
          <div style="font-size:.78rem;color:var(--g400)">This is a confirmation that you are receiving emails from Nexus. To manage your preferences or unsubscribe…</div>
        </div>
      </div>
    </div>
  </div>`;
}

function showWelcomeEmail() {
  setOverlay(`<div class="backdrop"><div class="modal" style="max-width:580px;max-height:85vh;overflow-y:auto">
    <div class="modal-header" style="border-bottom:1px solid var(--g200)">
      <span class="modal-title" style="font-size:.9rem">You're subscribed to Nexus emails</span>
      <button class="modal-close" data-go="close_overlay">✕</button>
    </div>
    <div class="modal-body" style="padding:0">
      <div style="background:#f9f9f9;padding:.6rem 1.25rem;border-bottom:1px solid var(--g200);font-size:.7rem;color:var(--g500);line-height:1.7">
        <div><strong>From:</strong> Nexus &lt;no-reply@nexus-mail.io&gt;</div>
        <div><strong>To:</strong> you</div>
        <div><strong>Subject:</strong> You're subscribed to Nexus emails</div>
      </div>
      <div style="padding:1.5rem;font-family:Arial,sans-serif">
        <div style="background:#2563EB;padding:1rem 1.5rem;border-radius:8px 8px 0 0;text-align:center;margin:-1.5rem -1.5rem 1.5rem">
          <div style="color:#fff;font-size:1.1rem;font-weight:700;letter-spacing:-.02em"><span style="opacity:.8">Nex</span>us</div>
        </div>
        <p style="font-size:.85rem;color:#333;line-height:1.7;margin-bottom:1rem">Hi there,</p>
        <p style="font-size:.85rem;color:#333;line-height:1.7;margin-bottom:1rem">This email confirms that you are now subscribed to the following Nexus email programs:</p>
        <ul style="font-size:.82rem;color:#444;line-height:1.85;padding-left:1.25rem;margin-bottom:1rem">
          ${['Product updates (daily)','Weekly digest','Onboarding tips (14-part series)','Re-engagement emails','Security alerts','Partner offers (847 partners)','Billing notifications','Trial expiry reminders (daily from day 1)','Nexus newsletter','CEO personal updates','Feature deprecation notices','Compliance updates'].map(i=>`<li>${i}</li>`).join('')}
        </ul>
        <p style="font-size:.82rem;color:#555;line-height:1.7;margin-bottom:1.5rem">You can manage your preferences at any time in <a style="color:#2563EB;cursor:pointer" data-go="close_overlay">Settings → Notifications</a>.</p>
        <div style="border-top:1px solid #e5e7eb;padding-top:1.25rem;text-align:center">
          <p style="font-size:.68rem;color:#9ca3af;line-height:1.6;margin-bottom:.5rem">Nexus Technologies Inc. · 123 Platform Way, Suite 400 · San Francisco, CA 94105</p>
          <p style="font-size:.68rem;color:#9ca3af;line-height:1.6">You are receiving this email because you created a Nexus account. You cannot opt out of account-related emails. For marketing emails, you may <a data-go="unsubscribe" style="color:#9ca3af;cursor:pointer;text-decoration:underline">unsubscribe here</a>, though transactional, billing, security, onboarding, re-engagement, legal, and partner emails will continue.</p>
        </div>
      </div>
    </div>
  </div></div>`);
}

function scene_dash_settings() { scene_account_settings(); return; root.innerHTML = `
  <nav class="nav">
    <a class="nav-logo"><span>Nex</span>us</a>
    <div class="nav-links">
      <button class="nav-cta" data-go="pricing">Upgrade</button>
    </div>
  </nav>
  <div class="dashboard-layout">
    <div class="sidebar">
      <div class="sidebar-item" data-go="dashboard">🏠 Home</div>
      <div class="sidebar-item" data-go="dash_projects">📁 Projects</div>
      <div class="sidebar-item" data-go="dash_inbox">📬 Inbox</div>
      <div class="sidebar-item active">⚙️ Settings</div>
    </div>
    <div class="dash-content">
      <h1 style="font-size:1.4rem;font-weight:700;margin-bottom:1.5rem">Settings</h1>
      <div class="alert alert-info" style="font-size:.875rem;margin-bottom:1.5rem">
        Settings are only available on the Pro plan and above. <a data-go="pricing" style="color:inherit;font-weight:600;cursor:pointer;text-decoration:underline">Upgrade to access settings →</a>
      </div>
      <div style="opacity:.35;pointer-events:none">
        ${['Profile','Notifications','Billing','Security','Integrations','Team','API Keys'].map(s=>`
          <div style="padding:.85rem 1rem;border:1px solid var(--g200);border-radius:var(--radius);margin-bottom:.5rem;display:flex;justify-content:space-between;align-items:center;cursor:pointer">
            <span style="font-size:.9rem;font-weight:500">${s}</span>
            <span style="color:var(--g400)">→</span>
          </div>`).join('')}
      </div>
    </div>
  </div>`;
}

function scene_dash_new_project() {
  S.projectStep = 0;
  showProjectModal();
}

function showProjectModal() {
  const steps = [
    { title: 'Choose a project type', content: `
      <div class="grid-3" style="gap:.75rem;margin-bottom:1.5rem">
        ${['🗂 Kanban Board','📋 Task List','📅 Timeline','📊 Spreadsheet','📝 Wiki','🎯 OKRs'].map(t=>`
          <div style="border:1px solid var(--g200);border-radius:var(--radius);padding:1rem;text-align:center;cursor:pointer;font-size:.85rem" onclick="this.parentElement.querySelectorAll('div').forEach(d=>d.style.borderColor='');this.style.borderColor='var(--blue)'">${t}</div>`).join('')}
      </div>`
    },
    { title: 'Name your project', content: `
      <div class="form-group" style="margin-bottom:1rem">
        <label>Project name <span style="color:var(--red)">*</span></label>
        <input type="text" placeholder="e.g. Q4 Roadmap" id="proj-name">
      </div>
      <div class="form-group">
        <label>Description (optional)</label>
        <textarea style="min-height:60px" placeholder="What's this project about?"></textarea>
      </div>`
    },
    { title: 'Choose a template', content: `
      <div style="display:flex;flex-direction:column;gap:.5rem;margin-bottom:1rem">
        ${['Blank project','Getting started (recommended)','Product roadmap','Sprint planning','Content calendar','Marketing campaign'].map(t=>`
          <div style="border:1px solid var(--g200);border-radius:var(--radius);padding:.75rem 1rem;cursor:pointer;font-size:.875rem;display:flex;align-items:center;justify-content:space-between" onclick="this.parentElement.querySelectorAll('div').forEach(d=>d.style.borderColor='');this.style.borderColor='var(--blue)'">${t} <span style="color:var(--g400);font-size:.75rem">→</span></div>`).join('')}
      </div>`
    },
    { title: 'Setting up your workspace…', content: `
      <div style="text-align:center;padding:2rem 0">
        <div class="spinner big-spinner" style="margin:0 auto 1rem"></div>
        <p style="color:var(--g500);font-size:.9rem">Creating your project…</p>
      </div>`
    },
  ];
  const step = steps[Math.min(S.projectStep, steps.length-1)];
  const isLast = S.projectStep >= steps.length-1;
  setOverlay(`
  <div class="backdrop">
    <div class="project-modal">
      <div class="modal-header" style="padding:1.25rem 1.5rem">
        <span class="modal-title">${step.title}</span>
        <button class="modal-close" data-go="close_overlay">✕</button>
      </div>
      <div class="modal-body">${step.content}</div>
      ${!isLast ? `
      <div class="modal-footer">
        ${S.projectStep>0?`<button class="btn btn-secondary" data-go="proj_back">← Back</button>`:''}
        <button class="btn btn-primary" data-go="proj_next">${S.projectStep===2?'Create Project':'Continue →'}</button>
      </div>`:''}
    </div>
  </div>`);
  if(isLast){
    setTimeout(()=>{
      setOverlay('');
      toast('✅ Project created successfully!');
      setTimeout(()=>{ scene_project(); },500);
    },2500);
  }
}

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
function scene_proj_back() { if(S.projectStep>0)S.projectStep--; showProjectModal(); }

