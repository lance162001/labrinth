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

