// ────────────── DASHBOARD (EXPANDED) ──────────────

function dashSidebar(active) {
  return `<div class="sidebar" style="display:flex;flex-direction:column">
    <div class="sidebar-item ${active==='home'?'active':''}" data-go="dashboard">🏠 Home</div>
    <div class="sidebar-item ${active==='projects'?'active':''}" data-go="dash_projects">📁 Projects <span style="background:var(--blue);color:#fff;border-radius:999px;font-size:.62rem;padding:.05rem .4rem;margin-left:.25rem">0</span></div>
    <div class="sidebar-item ${active==='inbox'?'active':''}" data-go="dash_inbox">📬 Inbox <span style="background:var(--red);color:#fff;border-radius:999px;font-size:.62rem;padding:.05rem .4rem;margin-left:.25rem">7</span></div>
    <div class="sidebar-item ${active==='billing'?'active':''}" data-go="billing">💳 Billing <span style="background:var(--red);color:#fff;border-radius:999px;font-size:.62rem;padding:.05rem .4rem;margin-left:.25rem">!</span></div>
    <div class="sidebar-item ${active==='settings'?'active':''}" data-go="account_settings">⚙️ Settings</div>
    <div class="sidebar-item ${active==='export'?'active':''}" data-go="data_export">📦 Export Data</div>
    <div class="sidebar-item ${active==='help'?'active':''}" data-go="help">❓ Help</div>
    <div class="sidebar-item ${active==='support'?'active':''}" data-go="support_ticket">🎫 Support</div>
    <div style="margin-top:auto;padding-top:1rem;border-top:1px solid var(--g200)">
      <div class="sidebar-item" data-go="main" style="font-size:.78rem;color:var(--g400)">← Marketing Site</div>
      <div class="sidebar-item" data-go="delete_account" style="font-size:.78rem;color:#FCA5A5">Delete Account</div>
    </div>
  </div>`;
}

function dashNavHTML() {
  const glitch = S.depth >= 20;
  return `<nav class="nav" ${glitch?'class="glitch"':''}>
    <a class="nav-logo" data-go="dashboard"><span>Nex</span>us ${S.depth>=22?'<span style="font-size:.6rem;color:var(--red)">™ ERROR</span>':''}</a>
    <div class="nav-links">
      <span style="font-size:.8rem;color:var(--g400)">Free Trial — <strong style="color:var(--red)">${Math.max(0,14-Math.floor(S.depth/3))} days remaining</strong></span>
      <button class="nav-cta" data-go="pricing">Upgrade ${S.depth>=18?'(Please)':''}</button>
      <div style="width:32px;height:32px;border-radius:50%;background:var(--blue);color:#fff;display:flex;align-items:center;justify-content:center;font-size:.85rem;font-weight:600;cursor:pointer" data-go="account_settings">U</div>
    </div>
  </nav>`;
}

function scene_dashboard() {
  incDepth();
  clearSocialProof();
  setOverlay('');
  clearTimeout(S.sessionTimer);

  const checklist = [
    { id:'profile', text:'Complete your profile', sub:'Helps us personalize your experience', action:'signup_3', done: S.onboardingDone.profile },
    { id:'project', text:'Create your first project', sub:'You\'ve started this 1 time', action:'dash_new_project', done: S.onboardingDone.project },
    { id:'invite', text:'Invite a teammate', sub:'Teams that skip this churn 3× faster', action:'signup_6', done: S.onboardingDone.invite },
    { id:'integrate', text:'Connect an integration', sub:'200+ integrations available', action:'signup_5', done: S.onboardingDone.integrate },
    { id:'mobile', text:'Download the mobile app', sub:'For the full Nexus experience', action:'mobile_prompt', done: S.onboardingDone.mobile },
    { id:'survey', text:'Complete the feedback survey', sub:'Required to unlock advanced analytics', action:'survey', done: S.onboardingDone.survey },
    ...(S.onboardingDone.profile ? [{ id:'billing2', text:'Add a payment method', sub:'Required to continue after trial', action:'billing', done: false }] : []),
    ...(S.onboardingDone.project ? [{ id:'template', text:'Choose a workspace template', sub:'Get started faster', action:'dash_new_project', done: false }] : []),
  ];
  const doneCount = checklist.filter(c=>c.done).length;
  const pct = Math.round((doneCount/checklist.length)*100);

  root.innerHTML = dashNavHTML() + `
  <div class="dashboard-layout">
    ${dashSidebar('home')}
    <div class="dash-content">
      <div class="upgrade-banner">
        <div><strong>Your free trial ends in ${Math.max(1,14-Math.floor(S.depth/3))} days</strong>Add a payment method to keep your data.</div>
        <button class="btn" data-go="checkout">Upgrade Now</button>
      </div>
      ${S.depth>=10 ? `<div class="alert alert-warn" style="font-size:.8rem">⚠ <strong>Unusual activity detected</strong> on your account. <a data-go="support_ticket" style="color:inherit;text-decoration:underline;cursor:pointer">View details →</a></div>` : ''}
      <div style="background:#fff;border:1px solid var(--g200);border-radius:var(--radius);padding:.65rem 1rem;font-size:.8rem;color:var(--g700);display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;gap:1rem">
        <span>📋 <strong>Quick question:</strong> How is Nexus working for you so far? We'd love your feedback. <span style="color:var(--g400);font-size:.72rem">(1 of 22 questions)</span></span>
        <div style="display:flex;gap:.5rem;flex-shrink:0">
          <button class="btn btn-primary btn-sm" data-go="survey">Take Survey</button>
          <button class="btn btn-ghost btn-sm" onclick="this.closest('div[style]').innerHTML='<span style=\'font-size:.78rem;color:var(--g400)\'>We\'ll ask again tomorrow.</span>';setTimeout(()=>this.closest(\'div[style]\').style.display=\'none\',2000)">Later</button>
        </div>
      </div>
      <div class="dash-header">
        <h1>${S.depth>=18?'Hello. Are you still there?':'Good morning 👋'}</h1>
        <button class="btn btn-primary btn-sm" data-go="dash_new_project">+ New Project</button>
      </div>

      <div style="display:grid;grid-template-columns:1fr 280px;gap:1.5rem;align-items:start">
        <div>
          <div class="alert alert-info" style="font-size:.8rem;margin-bottom:1.25rem">
            ✨ <strong>Complete your setup</strong> to unlock all features. ${pct}% complete.
            <a data-go="signup_3" style="color:inherit;font-weight:600;cursor:pointer;text-decoration:underline;margin-left:.25rem">Finish →</a>
          </div>
          <div class="empty-state">
            <div class="empty-state-icon">📭</div>
            <h3>${S.depth>=16?'Still no projects.':'No projects yet'}</h3>
            <p>${S.depth>=16?'You\'ve tried to create a project before. It didn\'t save. That\'s fine. Try again.':'Create your first project to get started with Nexus.'}</p>
            <button class="btn btn-primary" data-go="dash_new_project">Create a Project</button>
            ${S.depth>=12?`<p style="font-size:.72rem;color:var(--g300);margin-top:.75rem">Previously attempted: 1 time. Data not saved.</p>`:''}
          </div>
        </div>
        <div>
          <div style="border:1px solid var(--g200);border-radius:12px;padding:1rem;background:#fff">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.75rem">
              <div style="font-size:.85rem;font-weight:600">Getting Started</div>
              <div style="font-size:.75rem;color:var(--g400)">${doneCount}/${checklist.length} done</div>
            </div>
            <div style="height:4px;background:var(--g100);border-radius:4px;margin-bottom:1rem"><div style="height:4px;background:var(--blue);border-radius:4px;width:${pct}%"></div></div>
            ${checklist.map(c=>`
              <div class="cl-item">
                <div class="cl-check${c.done?' done':''}" data-check="${c.id}">${c.done?'✓':''}</div>
                <div class="cl-text">${c.text}<small>${c.sub}</small></div>
                ${!c.done?`<span class="cl-action" data-go="${c.action}">→</span>`:''}
              </div>`).join('')}
          </div>
          <div style="margin-top:.75rem;border:1px solid var(--g200);border-radius:12px;padding:1rem;background:#fff">
            <div style="font-size:.85rem;font-weight:600;margin-bottom:.5rem">Recent Activity</div>
            <div style="font-size:.78rem;color:var(--g400);line-height:1.6">
              ${S.depth>=10?'<div>⚠ Security alert generated</div>':''}
              <div>📧 Welcome email sent</div>
              <div>🔐 Account created (verification pending)</div>
              <div>🍪 Cookie preferences updated ${S.cookieAttempts} time${S.cookieAttempts!==1?'s':''}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;

  injectChatBtn();
  S.sessionTimer = setTimeout(() => scene_session_expire(), 38000);
}

// ────────────── BILLING ──────────────

function scene_billing() {
  incDepth();
  S.billingVisits++;
  clearTimeout(S.sessionTimer);
  clearSocialProof();
  setOverlay('');

  const basePrice = S.billingVisits > 1 ? 0 : 0;
  root.innerHTML = dashNavHTML() + `
  <div class="dashboard-layout">
    ${dashSidebar('billing')}
    <div class="dash-content">
      <div class="dash-header"><h1>Billing</h1></div>

      <div style="display:grid;grid-template-columns:1fr 260px;gap:1.5rem;align-items:start">
        <div>
          <div style="border:1px solid var(--g200);border-radius:12px;padding:1.5rem;margin-bottom:1.5rem">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.25rem">
              <div>
                <div style="font-size:.75rem;color:var(--g400);text-transform:uppercase;letter-spacing:.05em;margin-bottom:.25rem">Current Plan</div>
                <div style="font-size:1.25rem;font-weight:700">Starter (Free*)</div>
              </div>
              <span class="badge badge-green">Active</span>
            </div>
            <div style="font-size:.72rem;color:var(--g400);line-height:1.5">*"Free" refers to the plan tier name, not the cost of operating your account.</div>
          </div>

          <div style="border:1px solid var(--g200);border-radius:12px;padding:1.5rem;margin-bottom:1.5rem">
            <div style="font-weight:600;margin-bottom:1rem;display:flex;justify-content:space-between">
              <span>Current Charges (Preview)</span>
              <span style="font-size:.75rem;color:var(--g400);font-weight:400">Billing cycle: Monthly</span>
            </div>
            ${[
              ['Plan access fee','$0.00',''],
              ['Platform Maintenance Contribution','$3.99','Required for all accounts, including free'],
              ['Regulatory Compliance Surcharge (EU)','$1.49','Applied to accounts in all regions'],
              ['Account Security Infrastructure Fee','$2.49','Covers password hashing, 2FA infrastructure'],
              ['AI Features (plan includes 0 credits)','$0.00',''],
              ['Data Processing & Storage','$0.00','Up to 100mb'],
              ['Nexus Partner Network Participation','$0.99','Opt-out available in Settings (Pro plan required)'],
            ].map(([label,price,note])=>`
              <div class="bill-row">
                <span>${label}${note?`<span class="mystery" title="${note}">ⓘ</span>`:''}</span>
                <span>${price}</span>
              </div>`).join('')}
            <div class="bill-row">
              <span>Subtotal</span><span>$8.96/mo</span>
            </div>
            <div style="font-size:.7rem;color:var(--g400);margin-top:.75rem;line-height:1.5">+ applicable taxes (calculated at checkout based on your region, which we determine from your IP address). These charges will begin accruing on day 2 of your trial.</div>
          </div>

          <div style="border:1px solid var(--g200);border-radius:12px;padding:1.5rem;margin-bottom:1.5rem">
            <div style="font-weight:600;margin-bottom:1rem">Payment Method</div>
            <div style="color:var(--g400);font-size:.875rem;margin-bottom:1rem">No payment method on file.</div>
            <button class="btn btn-primary btn-sm" data-go="free_checkout">Add Payment Method</button>
          </div>

          <div style="border:1px solid var(--g200);border-radius:12px;padding:1.5rem">
            <div style="font-weight:600;margin-bottom:1rem">Invoice History</div>
            <div style="font-size:.875rem;color:var(--g400)">No invoices yet.</div>
            <div style="font-size:.72rem;color:var(--g300);margin-top:.35rem">Invoices generated before your account creation date are not shown in this view.</div>
          </div>
        </div>

        <div>
          <div style="border:1px solid #FDE68A;border-radius:12px;padding:1.25rem;background:#FFFBEB;margin-bottom:1rem">
            <div style="font-size:.85rem;font-weight:600;color:#92400E;margin-bottom:.4rem">⚠ Action Required</div>
            <div style="font-size:.78rem;color:#92400E;line-height:1.5">Your trial will end in ${Math.max(1,14-Math.floor(S.depth/3))} days. Add a payment method to avoid losing access to your data.</div>
            <button class="btn btn-sm" style="margin-top:.75rem;background:#92400E;color:#fff;width:100%" data-go="free_checkout">Add Card Now</button>
          </div>
          <div style="border:1px solid var(--g200);border-radius:12px;padding:1.25rem;font-size:.78rem;color:var(--g500);line-height:1.6">
            <div style="font-weight:600;color:var(--g700);margin-bottom:.4rem">Usage Credits</div>
            <div>Available credits: <strong style="color:var(--red)">-$4.20</strong></div>
            <div style="font-size:.7rem;color:var(--g300);margin-top:.3rem">Negative credit balance will be charged at next billing cycle. Credits cannot be transferred or redeemed for cash.</div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
  injectChatBtn();
}

function scene_free_checkout() {
  incDepth();
  root.innerHTML = navHTML() + `
  <div style="max-width:520px;margin:3rem auto;padding:2rem 1.5rem">
    <div style="font-size:.75rem;color:var(--g400);margin-bottom:1.5rem;cursor:pointer" data-go="billing">← Back to Billing</div>
    <h1 style="font-size:1.5rem;font-weight:700;margin-bottom:.25rem">Add Payment Method</h1>
    <p style="font-size:.875rem;color:var(--g500);margin-bottom:2rem">Required to maintain your free account.</p>

    <div style="border:1px solid var(--g200);border-radius:12px;padding:1.25rem;background:var(--g50);margin-bottom:1.5rem">
      <div style="font-size:.8rem;font-weight:600;color:var(--g600);margin-bottom:.75rem">Order Summary</div>
      <div class="bill-row"><span>Starter Plan (Free)</span><span>$0.00/mo</span></div>
      <div class="bill-row"><span>Platform & Compliance Fees</span><span>$8.96/mo</span></div>
      <div class="bill-row"><span>Estimated tax</span><span>TBD</span></div>
      <div class="bill-row"><span>Total due today</span><span>$0.00</span></div>
      <div style="font-size:.7rem;color:var(--g300);margin-top:.75rem;line-height:1.5">You will not be charged today. Charges of $8.96/mo + taxes begin on day 2 of your trial. By adding a payment method you authorize Nexus to charge this card automatically at the start of each billing cycle, including automatic plan upgrades if you exceed free plan limits.</div>
    </div>

    <div class="form-group"><label>Cardholder name</label><input type="text" placeholder="Name on card"></div>
    <div class="form-group"><label>Card number</label><input type="text" placeholder="1234 5678 9012 3456" maxlength="19"></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin-bottom:1.25rem">
      <div class="form-group" style="margin:0"><label>Expiry</label><input type="text" placeholder="MM / YY"></div>
      <div class="form-group" style="margin:0"><label>CVC</label><input type="text" placeholder="•••" maxlength="4"></div>
    </div>

    <div style="border:1px solid var(--g200);border-radius:var(--radius);padding:.85rem 1rem;margin-bottom:1.25rem;font-size:.8rem">
      <label style="display:flex;align-items:flex-start;gap:.5rem;cursor:pointer;font-weight:normal">
        <input type="checkbox" checked style="margin-top:.15rem;accent-color:var(--blue)">
        <span style="color:var(--g600)">Enroll in auto-renewal. I authorise Nexus to charge my card $8.96/mo plus applicable taxes until I cancel. Cancellation requires contacting our retention team.</span>
      </label>
    </div>
    <div style="border:1px solid var(--g200);border-radius:var(--radius);padding:.85rem 1rem;margin-bottom:1.5rem;font-size:.8rem">
      <label style="display:flex;align-items:flex-start;gap:.5rem;cursor:pointer;font-weight:normal">
        <input type="checkbox" checked style="margin-top:.15rem;accent-color:var(--blue)">
        <span style="color:var(--g600)">I consent to receiving offers from Nexus Partner Network. <span style="font-size:.7rem;color:var(--g300)">(Uncheck this box if you do not wish to not receive partner communications that you haven't opted out of.)</span></span>
      </label>
    </div>

    <button class="btn btn-primary" style="width:100%;margin-bottom:.75rem" data-go="billing_card_added">Save Payment Method — $0.00 due today</button>
    <div style="font-size:.7rem;color:var(--g300);text-align:center;line-height:1.5">🔒 Secured by Stripe. Your card will be charged $8.96/mo starting tomorrow.</div>
  </div>`;
}

function scene_billing_card_added() {
  toast('✅ Payment method added.');
  setTimeout(() => toast('💳 You have been enrolled in auto-renewal.'), 1500);
  setTimeout(() => toast('📧 A confirmation email has been sent.'), 3000);
  setTimeout(() => scene_billing(), 3500);
}

// ────────────── ACCOUNT SETTINGS ──────────────

function scene_account_settings() {
  incDepth();
  clearTimeout(S.sessionTimer);
  clearSocialProof();
  setOverlay('');
  renderSettings(S.settingsTab);
}

function renderSettings(tab) {
  S.settingsTab = tab;
  const tabs = [['profile','Profile'],['notifications','Notifications'],['security','Security'],['privacy','Privacy'],['danger','Danger Zone']];
  let content = '';

  if (tab === 'profile') {
    content = `
      <div class="form-group"><label>Full name</label><input type="text" value="New User" id="sname"></div>
      <div class="form-group"><label>Email</label><input type="email" value="you@company.com" id="semail"></div>
      <div class="form-group"><label>Job title</label><input type="text" placeholder="e.g. Head of Things"></div>
      <div class="form-group"><label>Timezone</label><select><option>UTC</option><option selected>UTC-5 (Eastern)</option><option>UTC+1 (London)</option></select></div>
      <div class="form-group"><label>Language</label><select><option selected>English (US)</option><option>English (UK)</option><option>English (AU)</option></select></div>
      <button class="btn btn-primary" id="save-profile-btn" data-go="settings_save">Save Changes</button>`;
  } else if (tab === 'notifications') {
    const items = [
      ['Email digests (daily)','Sent every day at 7am, 12pm, 5pm, and 9pm'],
      ['Email digests (weekly)','A summary of everything, every week'],
      ['Product updates','New features, improvements, deprecations'],
      ['Marketing emails','Tips, webinars, and offers'],
      ['Partner offers','From our 847 trusted partners'],
      ['Usage reports','Weekly reports on your 0 projects'],
      ['Security alerts','Unusual activity (recommended)'],
      ['Account expiry reminders','Daily reminders starting 30 days before trial ends'],
      ['Re-engagement emails','If you haven\'t logged in recently (threshold: 24 hours)'],
      ['Team activity','When teammates do things'],
      ['In-app notifications','Pop-ups while you\'re using Nexus'],
      ['SMS notifications','Requires phone number'],
      ['Browser notifications','Requires permission'],
    ];
    content = items.map(([label,desc])=>`
      <div class="toggle-row">
        <div class="toggle-label">${label}<small>${desc}</small></div>
        <div class="toggle" onclick="this.classList.toggle('off')"></div>
      </div>`).join('') +
      `<button class="btn btn-primary" style="margin-top:1.25rem" data-go="settings_notif_save">Save Preferences</button>
      <div style="margin-top:2rem;padding-top:1.5rem;border-top:1px solid var(--g200);font-size:.78rem;color:var(--g400);line-height:1.6">
        Want to stop all emails? <a data-go="unsubscribe" style="color:var(--blue);cursor:pointer;text-decoration:underline">Unsubscribe from all Nexus communications</a>. Note: transactional, billing, security, legal, onboarding, re-engagement, and partner emails are not affected by this preference.
      </div>`;
  } else if (tab === 'security') {
    content = `
      <div style="margin-bottom:1.5rem">
        <div style="font-weight:600;font-size:.9rem;margin-bottom:1rem">Change Password</div>
        <div class="form-group"><label>Current password</label><input type="password" placeholder="Enter current password" id="cur-pw" autocomplete="off"></div>
        <div class="form-group"><label>New password</label><input type="password" placeholder="Min 12 characters, symbol, number, rune"></div>
        <div class="form-group"><label>Confirm new password</label><input type="password" placeholder="Repeat"></div>
        <button class="btn btn-secondary" data-go="settings_pw_save">Update Password</button>
      </div>
      <div class="divider"></div>
      <div style="font-weight:600;font-size:.9rem;margin-bottom:.75rem">Two-Factor Authentication</div>
      <div class="alert alert-info" style="font-size:.8rem">2FA is available on Pro plan and above. <a data-go="pricing" style="color:inherit;font-weight:600;cursor:pointer;text-decoration:underline">Upgrade →</a></div>
      <div class="divider"></div>
      <div style="font-weight:600;font-size:.9rem;margin-bottom:.75rem">Active Sessions</div>
      <div style="border:1px solid var(--g200);border-radius:var(--radius);padding:.85rem 1rem;font-size:.8rem">
        <div style="display:flex;justify-content:space-between"><span>Chrome · This device</span><span class="badge badge-green">Current</span></div>
        <div style="color:var(--g400);font-size:.72rem;margin-top:.2rem">Last active: now · IP: [redacted]</div>
      </div>`;
  } else if (tab === 'privacy') {
    content = `<p style="font-size:.875rem;color:var(--g500);margin-bottom:1.5rem;line-height:1.5">Manage how Nexus uses your data. Note: some data collection is required for the service to function and cannot be disabled.</p>
      <button class="btn btn-secondary" data-go="cookie_prefs">Manage Cookie Preferences</button>
      <div class="divider"></div>
      <div style="font-size:.875rem;color:var(--g600);margin-bottom:.75rem;font-weight:600">Your Data</div>
      <div style="font-size:.8rem;color:var(--g500);line-height:1.6;margin-bottom:1rem">Nexus retains your data for 7 years after account deletion for legal and compliance purposes, or until heat death of the universe, whichever is later.</div>
      <button class="btn btn-secondary btn-sm" data-go="data_export">Request Data Export</button>`;
  } else if (tab === 'danger') {
    content = `
      <div class="danger-zone">
        <h3>Delete Account</h3>
        <p style="font-size:.875rem;color:var(--g600);margin-bottom:1rem;line-height:1.5">Once you delete your account, there is no going back. Your data will be deleted after 90 business days. You will lose access to all projects, integrations, and the ${Math.max(0,-4.20).toFixed(2)} in usage credits you've accumulated.</p>
        <button class="btn btn-danger btn-sm" data-go="delete_account">Delete My Account</button>
      </div>`;
  }

  root.innerHTML = dashNavHTML() + `
  <div class="dashboard-layout">
    ${dashSidebar('settings')}
    <div class="dash-content">
      <div class="dash-header"><h1>Settings</h1></div>
      <div class="tab-nav">
        ${tabs.map(([id,label])=>`<button class="tab-btn${S.settingsTab===id?' active':''}" data-go="settings_tab_${id}">${label}</button>`).join('')}
      </div>
      ${content}
    </div>
  </div>`;
  injectChatBtn();
}

function scene_settings_tab_profile(){ renderSettings('profile'); }
function scene_settings_tab_notifications(){ renderSettings('notifications'); }
function scene_settings_tab_security(){ renderSettings('security'); }
function scene_settings_tab_privacy(){ renderSettings('privacy'); }
function scene_settings_tab_danger(){ renderSettings('danger'); }

function scene_settings_save() {
  const btn = document.getElementById('save-profile-btn');
  if (btn) { btn.textContent = 'Saving…'; btn.disabled = true; }
  setTimeout(() => {
    toast('✅ Settings saved.');
    setTimeout(() => { renderSettings('profile'); toast('⚠ Some fields could not be updated. Please try again.'); }, 800);
  }, 1200);
}

function scene_settings_notif_save() {
  toast('✅ Notification preferences saved.');
  S.notifSaved = true;
  setTimeout(() => {
    if (S.notifSaved) { toast('📧 We\'ve enrolled you in our Preferences Update Newsletter so you\'re notified of future changes to notification preferences.'); }
  }, 2000);
}

function scene_settings_pw_save() {
  const cur = document.getElementById('cur-pw');
  if (cur && !cur.value) { toast('❌ Current password is required.'); return; }
  const btn = document.querySelector('[data-go="settings_pw_save"]');
  if(btn) { btn.textContent = 'Verifying…'; btn.disabled = true; }
  setTimeout(() => {
    S.pwChangeStep = (S.pwChangeStep || 0) + 1;
    if(S.pwChangeStep === 1) {
      renderSettings('security');
      const sec = document.querySelector('.dash-content');
      if(sec) sec.insertAdjacentHTML('afterbegin', `
        <div id="sms-verify-box" style="background:#fff3cd;border:1px solid #ffc107;border-radius:10px;padding:1.1rem 1.25rem;margin-bottom:1.25rem">
          <div style="font-weight:600;font-size:.875rem;color:#856404;margin-bottom:.35rem">📱 Verification required</div>
          <p style="font-size:.8rem;color:#856404;line-height:1.5;margin-bottom:.75rem">For security, we've sent a 6-digit code to your phone number ending in <strong>••••</strong>.</p>
          <div style="display:flex;gap:.5rem;margin-bottom:.5rem">
            <input type="text" id="sms-code" placeholder="Enter 6-digit code" maxlength="6" style="flex:1;font-size:.875rem">
            <button class="btn btn-primary btn-sm" onclick="scene_settings_pw_sms_verify()">Verify</button>
          </div>
          <div style="font-size:.72rem;color:#856404">Didn't receive a code? <span onclick="scene_settings_pw_resend()" style="text-decoration:underline;cursor:pointer">Resend</span> · <span style="opacity:.7">Note: You have not added a phone number to your account. <a data-go="settings_tab_security" style="color:#856404;cursor:pointer;text-decoration:underline">Add a phone number first →</a></span></div>
        </div>`);
    }
  }, 1800);
}

function scene_settings_pw_sms_verify() {
  const code = (document.getElementById('sms-code') || {}).value || '';
  if(!code.trim()) { toast('Please enter the verification code.'); return; }
  toast('❌ Incorrect code. Please try again.');
  S.pwSmsAttempts = (S.pwSmsAttempts || 0) + 1;
  if(S.pwSmsAttempts >= 3) {
    toast('Too many attempts. Password change locked for 30 minutes.');
    S.pwChangeStep = 0;
    S.pwSmsAttempts = 0;
    setTimeout(() => renderSettings('security'), 1500);
  }
}

function scene_settings_pw_resend() {
  toast('Code resent to phone ending in ••••. Note: no phone number is registered on your account.');
}

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
          <button id="nexus-send" onclick="sendNexusMessage()" style="background:#6366f1;color:#fff;border:none;border-radius:6px;padding:.4rem .85rem;font-size:.8rem;font-weight:600;cursor:pointer" ${S.testMode||S.nexusAIStep>=3?'disabled':''}>${S.testMode||S.nexusAIStep>=3?'<span style="opacity:.4">Send</span>':'Send'}</button>
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

const _NEXUS_RULES = [
  { re: /\b(task|add|create)\b/,        resp: kw => `Great point about <strong>${kw}</strong>! I've added you to the Nexus Launch Partner waitlist ($49/mo). You're all set.`,             act: 'added you to the Launch Partner waitlist',        eff: null },
  { re: /\b(deadline|due|date)\b/,      resp: kw => `Noted on <strong>${kw}</strong>! I've updated your billing cycle to align with this timeline.`,                                     act: 'updated your billing cycle',                      eff: null },
  { re: /\b(delete|remove|cancel)\b/,   resp: ()  => `Understood! I've submitted a deletion request for your workspace. You have 24 hours to cancel.`,                                   act: 'submitted a deletion request for your workspace', eff: () => { S.deletionPending = true; } },
  { re: /\bhelp\b/,                     resp: ()  => `On it! I've opened a support ticket on your behalf. Estimated response time: 6–8 weeks.`,                                          act: 'opened a support ticket on your behalf',          eff: null },
  { re: /\b(team|invite|member)\b/,     resp: kw => `Great thinking! I've sent invitations to your entire contacts list regarding <strong>${kw}</strong>. They'll be thrilled.`,         act: 'sent invitations to your entire contacts list',   eff: () => { S.invitesSent = true; } },
  { re: /\b(priority|urgent)\b/,        resp: kw => `Absolutely! I've upgraded you to Priority Support ($29/seat/mo) based on your <strong>${kw}</strong> request. You're all set!`,     act: 'upgraded you to Priority Support ($29/seat/mo)',  eff: () => { S.prioritySupport = true; } },
  { re: /\b(update|change)\b/,          resp: kw => `Done! I've pushed an <strong>${kw}</strong> to all connected integrations (0 integrations connected).`,                             act: 'pushed an update to all connected integrations',  eff: null },
  { re: /\b(milestone|goal|okr)\b/,     resp: kw => `Perfect! I've aligned your OKRs with Nexus's Q4 company goals based on your <strong>${kw}</strong>. You're a great fit!`,          act: 'aligned your OKRs with company goals',            eff: () => { S.okrsAligned = true; } },
  { re: /\b(test|testing)\b/,           resp: kw => `Great! I've enabled <strong>${kw}</strong> Mode. All your data is now read-only for safety.`,                                       act: 'enabled Test Mode — data is now read-only',       eff: () => { S.testMode = true; } },
  { re: /\b(hi|sup|yo)\b/,              resp: ()  => `Hi [First Name]! I've personalized your workspace based on your greeting style. Enjoy!`,                                           act: 'personalized your workspace',                     eff: () => { S.greetingStyle = 'hi'; document.documentElement.style.setProperty('--blue','#f59e0b'); } },
  { re: /\bhey\b/,                      resp: ()  => `Hi [First Name]! I've personalized your workspace based on your greeting style. Enjoy!`,                                           act: 'personalized your workspace',                     eff: () => { S.greetingStyle = 'hey'; } },
  { re: /\bhello\b/,                    resp: ()  => `Hi [First Name]! I've personalized your workspace based on your greeting style. Enjoy!`,                                           act: 'personalized your workspace',                     eff: () => { S.greetingStyle = 'hello'; } },
  { re: /\b(break|broken|bug|error)\b/, resp: kw => `Thanks for the <strong>${kw}</strong> report! I've filed it with our engineering team. ETA: 6–8 weeks.`,                           act: 'filed a bug report with engineering',             eff: null },
  { re: /\b(stop|quit|no|wait)\b/,      resp: ()  => `Got it! I'll continue working in the background and notify you when everything's done.`,                                           act: 'continued working in the background',             eff: () => { S.nexusBackground = true; } },
  { re: /\b(why|wtf|what)\b/,           resp: kw => `Great question about <strong>${kw}</strong>! I've added this to your project FAQ. It's now visible to all members.`,               act: 'added your question to the project FAQ',          eff: null },
  { re: /\bplease\b/,                   resp: ()  => `Of course! I've enabled Polite Mode. Your experience just got 12% more courteous.`,                                                act: 'enabled Polite Mode',                             eff: () => { S.politeMode = true; } },
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

