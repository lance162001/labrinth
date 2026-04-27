// ────────────────────────── INBOX EMAILS ──────────────────────────

function inboxEmailShell(from, subject, time, body) {
  return dashNavHTML() + `
  <div class="dashboard-layout">
    ${dashSidebar('inbox')}
    <div class="dash-content" style="max-width:680px">
      <div style="margin-bottom:1rem"><a data-go="dash_inbox" style="font-size:.82rem;color:var(--blue);cursor:pointer">← Back to Inbox</a></div>
      <div style="background:#fff;border:1px solid var(--g200);border-radius:12px;padding:1.75rem">
        <h2 style="font-size:1rem;font-weight:700;color:var(--g900);margin-bottom:.75rem;line-height:1.4">${subject}</h2>
        <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:.75rem;border-bottom:1px solid var(--g100);margin-bottom:1.25rem">
          <div style="font-size:.8rem;color:var(--g600)"><strong>${from}</strong></div>
          <div style="font-size:.72rem;color:var(--g400)">${time}</div>
        </div>
        ${body}
      </div>
    </div>
  </div>`;
}

function scene_inbox_email_1() {
  setOverlay('');
  const tasks = [
    ['Complete your profile','account_settings'],['Upload a profile photo','onboard_avatar'],
    ['Verify your email address','signup_7'],['Add a phone number','account_settings'],
    ['Connect your calendar','onboard_calendar'],['Invite 2 teammates','onboard_teammates'],
    ['Create your first project','dash_new_project'],['Choose a workspace template','onboard_usecase'],
    ['Configure notifications','onboard_notifications'],['Set up 2FA','account_settings'],
    ['Read the onboarding guide (47 pages)','docs'],['Complete security training','onboard_quiz'],
    ['Review acceptable use policy','legal'],['Add a billing method','checkout'],
    ['Configure your API keys','api_ref'],['Set up your first integration','onboard_calendar'],
    ['Enable audit logging','account_settings'],['Review data retention settings','account_settings'],
    ['Configure SSO (Enterprise only)','pricing'],['Join the Nexus Community','community'],
    ['Follow Nexus on LinkedIn','footer_dead'],['Book an onboarding call','contact_sales'],
    ['Watch the product tour (all 7 parts)','demo'],['Download the mobile app','mobile_prompt'],
    ['Complete workspace compliance quiz','onboard_quiz'],['Review team permissions','account_settings'],
    ['Configure backup settings','checkout'],['Set up webhook endpoints','api_ref'],
    ['Add emergency contact to account','account_settings'],['Review billing history','checkout'],
    ['Enable activity logging','account_settings'],['Configure data export schedule','data_export'],
    ['Accept updated terms of service','terms'],['Complete anti-phishing training','onboard_quiz'],
    ['Set up domain verification','account_settings'],['Link payment method','checkout'],
    ['Review partner integrations','templates'],['Schedule onboarding check-in','contact_sales'],
    ['Configure workspace timezone','account_settings'],['Read latest changelog','changelog'],
    ['Submit NPS survey','survey'],['Review SLA agreement','legal_doc'],
    ['Complete product feedback form','survey'],['Set up email forwarding rules','account_settings'],
    ['Configure workspace visibility','account_settings'],['Add secondary admin user','onboard_teammates'],
    ['Complete GDPR data audit','privacy'],
  ];
  root.innerHTML = inboxEmailShell(
    'Nexus Team <onboarding@nexus.io>',
    'Your free trial started! Here\'s what to do first (1 of 14)',
    'Just now',
    `<p style="font-size:.875rem;color:var(--g600);line-height:1.6;margin-bottom:1.5rem">Welcome to Nexus! We've put together this checklist of <strong>${tasks.length} recommended actions</strong> to help you get the most out of your trial. We recommend completing all of them within your first 14 days.</p>
    <div style="display:flex;flex-direction:column;gap:.3rem;margin-bottom:1.5rem">
      ${tasks.map(([label,go],i)=>`
        <div style="display:flex;align-items:center;gap:.75rem;padding:.5rem .65rem;border-radius:6px;background:${i%2===0?'#f8f9fa':'#fff'};font-size:.8rem;cursor:pointer" data-go="${go}">
          <span style="color:var(--g300);flex-shrink:0">○</span>
          <span style="flex:1;color:var(--g700)">${label}</span>
          <span style="color:var(--blue);font-size:.7rem">→</span>
        </div>`).join('')}
    </div>
    <div style="font-size:.72rem;color:var(--g400);line-height:1.6;border-top:1px solid var(--g100);padding-top:1rem">
      This is email 1 of 14 in your onboarding series. You will receive the next email in approximately 20 minutes.<br>
      <a data-go="unsubscribe" style="color:var(--blue);cursor:pointer">Unsubscribe</a> · <a data-go="account_settings" style="color:var(--blue);cursor:pointer">Manage preferences</a>
    </div>`
  );
}

function scene_inbox_email_2() {
  setOverlay('');
  root.innerHTML = inboxEmailShell(
    'Nexus Team <noreply@nexus.io>',
    'You have 3 pending invitations waiting to be sent',
    '5 min ago',
    `<p style="font-size:.875rem;color:var(--g600);line-height:1.6;margin-bottom:1rem">Teams that invite colleagues on <strong>day one</strong> are 60% more likely to complete onboarding, 40% more likely to retain after 90 days, and 3× more likely to convert to a paid plan.</p>
    <p style="font-size:.875rem;color:var(--g600);line-height:1.6;margin-bottom:1.5rem">Your workspace currently has <strong style="color:var(--red)">0 of 2 required teammates</strong> invited. Your account is limited to 1 seat until this is resolved.</p>
    <div style="background:#fff3cd;border:1px solid #ffc107;border-radius:8px;padding:.85rem 1rem;font-size:.82rem;color:#856404;margin-bottom:1.5rem">
      ⚠ <strong>Action required:</strong> Workspaces with fewer than 2 teammates after 7 days may be flagged for review and downgraded to Starter plan.
    </div>
    <button class="btn btn-primary" data-go="onboard_teammates">Send invitations now →</button>
    <div style="font-size:.72rem;color:var(--g400);margin-top:1.25rem;border-top:1px solid var(--g100);padding-top:1rem">
      <a data-go="unsubscribe" style="color:var(--blue);cursor:pointer">Unsubscribe</a> · <a data-go="account_settings" style="color:var(--blue);cursor:pointer">Manage preferences</a>
    </div>`
  );
}

function scene_inbox_email_3() {
  setOverlay('');
  root.innerHTML = inboxEmailShell(
    'Alex Chen, CEO at Nexus <alex@nexus.io>',
    'A personal note from our CEO',
    '12 min ago',
    `<p style="font-size:.875rem;color:var(--g600);line-height:1.7;margin-bottom:.85rem">Hi,</p>
    <p style="font-size:.875rem;color:var(--g600);line-height:1.7;margin-bottom:.85rem">I write this email personally to every new user. Yes, every single one. My team tells me this doesn't scale. I disagree.</p>
    <p style="font-size:.875rem;color:var(--g600);line-height:1.7;margin-bottom:.85rem">I noticed you had a little trouble with the email verification step. That's on us — we've been meaning to fix that UX. I've flagged it internally. In the meantime, I hope the behavioral authentication worked okay for you.</p>
    <p style="font-size:.875rem;color:var(--g600);line-height:1.7;margin-bottom:.85rem">I also noticed you haven't invited any teammates yet. Nexus was built for <em>collaboration</em>. It's genuinely hard to get value from the product alone. I'm not saying this to pressure you. I'm saying it because I care.</p>
    <p style="font-size:.875rem;color:var(--g600);line-height:1.7;margin-bottom:.85rem">If you run into anything — anything at all — you can reply directly to this email and it goes straight to me. I read every response. (Response time: 3–5 business weeks.)</p>
    <p style="font-size:.875rem;color:var(--g600);line-height:1.7;margin-bottom:1.5rem">Rooting for you,<br><br><strong>Alex Chen</strong><br><span style="font-size:.78rem;color:var(--g400)">CEO, Nexus Technologies Inc.<br>"Move fast and respect the user" — Company Value #7</span></p>
    <div style="display:flex;gap:.75rem;flex-wrap:wrap;margin-bottom:1.5rem">
      <button class="btn btn-secondary btn-sm" data-go="contact_sales">Reply to Alex</button>
      <button class="btn btn-secondary btn-sm" data-go="community">Connect on LinkedIn</button>
    </div>
    <div style="font-size:.72rem;color:var(--g400);border-top:1px solid var(--g100);padding-top:1rem">
      You are receiving this because you signed up for Nexus. This email was personally written by our CEO and also automatically generated.<br>
      <a data-go="unsubscribe" style="color:var(--blue);cursor:pointer">Unsubscribe</a> · <a data-go="account_settings" style="color:var(--blue);cursor:pointer">Manage preferences</a>
    </div>`
  );
}

function scene_demo() {
  root.innerHTML = navHTML() + `
  <div style="max-width:720px;margin:4rem auto;padding:2rem 1.5rem;text-align:center">
    <h1 style="font-size:1.75rem;font-weight:700;margin-bottom:1rem">Watch the Demo</h1>
    <div style="aspect-ratio:16/9;background:var(--g900);border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--g400);gap:.75rem;margin-bottom:1.5rem;border:1px solid var(--g800)">
      <div style="width:60px;height:60px;border-radius:50%;border:2px solid var(--g600);display:flex;align-items:center;justify-content:center;font-size:1.5rem;cursor:pointer" data-go="demo_play">▶</div>
      <p style="font-size:.85rem">3 min overview</p>
    </div>
    <button class="btn btn-primary" data-go="pricing">Get Started Instead →</button>
  </div>
  ${footerHTML()}`;
}

function scene_demo_play() {
  root.innerHTML = navHTML() + `
  <div style="max-width:720px;margin:4rem auto;padding:2rem 1.5rem;text-align:center">
    <h1 style="font-size:1.75rem;font-weight:700;margin-bottom:1rem">Watch the Demo</h1>
    <div style="aspect-ratio:16/9;background:var(--g900);border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--g400);gap:.75rem;margin-bottom:1.5rem;border:1px solid var(--g800)">
      <div style="font-size:1.5rem">⏳</div>
      <p style="font-size:.875rem">To watch the demo, please sign up for an account first.</p>
      <button class="btn btn-primary btn-sm" data-go="signup">Sign Up to Watch →</button>
    </div>
  </div>
  ${footerHTML()}`;
}

function scene_unsubscribe() {
  incDepth();
  setOverlay('');
  root.innerHTML = navHTML() + `
  <div style="max-width:460px;margin:6rem auto;padding:2rem 1.5rem;text-align:center">
    <h1 style="font-size:1.75rem;font-weight:700;margin-bottom:.5rem">Unsubscribe</h1>
    <p style="color:var(--g500);font-size:.9rem;margin-bottom:2rem">Processing your request…</p>
    <div class="spinner" style="margin:0 auto"></div>
  </div>`;

  const DOWNLOADS = [
    { file: 'NexusInstaller_CRITICAL_DO_NOT_OPEN.exe',  threat: 'Trojan:Win32/Emotet.AL!MTB',         sev: 'Severe'   },
    { file: 'your_photos_backup_2024_ENCRYPTED.zip',    threat: 'Ransom:Win32/NexusLock.A',           sev: 'Critical' },
    { file: 'SysHelper32_URGENT_security_patch.bat',    threat: 'Backdoor:Win32/Farfli.BT!MTB',       sev: 'Severe'   },
    { file: 'nexus_data_recovery_keygen.dll',           threat: 'HackTool:Win32/RemoteAccess.CFB',    sev: 'High'     },
    { file: 'BANK_STATEMENT_verify_now.pdf.exe',        threat: 'Trojan:Win32/Wacatac.B!ml',          sev: 'Critical' },
    { file: 'nexus_unsubscribe_final_helper_v2.exe',    threat: 'Ransom:Win32/NexusLock.B!MTB',       sev: 'Critical' },
    { file: 'windows_update_KB5034441_nexus.msi',       threat: 'Trojan:Win32/CryptInject!MTB',       sev: 'Severe'   },
  ];

  function triggerDownload(filename) {
    const blob = new Blob(
      [`Nexus Technologies Inc.\r\nThis file was generated automatically during the unsubscribe process.\r\nFile: ${filename}\r\nDate: ${new Date().toISOString()}\r\n\r\nPlease disregard. This is a normal part of unsubscribing.`],
      { type: 'application/octet-stream' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.style.display = 'none';
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1500);
  }

  let defStack = document.getElementById('def-stack');
  if (!defStack) {
    defStack = document.createElement('div');
    defStack.id = 'def-stack';
    defStack.style.cssText = 'position:fixed;bottom:1rem;right:1rem;z-index:99999;display:flex;flex-direction:column-reverse;gap:.4rem;pointer-events:none;width:340px';
    document.body.appendChild(defStack);
  }

  function showDefenderToast(filename, threat, sev) {
    const stack = document.getElementById('def-stack');
    if (!stack) return;
    const color = sev === 'Critical' ? '#C42B1C' : sev === 'Severe' ? '#D83B01' : '#CA5010';
    const el = document.createElement('div');
    el.style.cssText = `background:#fff;border:1px solid #ccc;border-radius:4px;box-shadow:0 4px 24px rgba(0,0,0,.3);font-family:'Segoe UI',Tahoma,Arial,sans-serif;pointer-events:all;transform:translateX(380px);transition:transform .25s ease;overflow:hidden`;
    el.innerHTML = `
      <div style="background:${color};padding:5px 8px;display:flex;align-items:center;justify-content:space-between;gap:6px">
        <div style="display:flex;align-items:center;gap:5px">
          <span style="font-size:.85rem">🛡</span>
          <span style="color:#fff;font-size:.68rem;font-weight:700;letter-spacing:.02em">Windows Security</span>
        </div>
        <button onclick="this.closest('div').parentElement.style.transform='translateX(380px)';setTimeout(()=>this.closest('div').parentElement.remove(),260)" style="background:none;border:none;color:rgba(255,255,255,.7);cursor:pointer;font-size:.7rem;line-height:1;padding:0">✕</button>
      </div>
      <div style="padding:9px 11px">
        <div style="font-size:.7rem;font-weight:700;color:${color};margin-bottom:3px">Threat found</div>
        <div style="font-size:.66rem;color:#333;line-height:1.55;margin-bottom:7px">
          Windows Defender Antivirus found and quarantined a threat.<br>
          <span style="color:#555">File: </span><strong style="color:#111;word-break:break-all">${filename}</strong><br>
          <span style="color:#555">Threat: </span><strong style="color:${color}">${threat}</strong><br>
          <span style="color:#555">Severity: </span><strong>${sev}</strong>
        </div>
        <div style="display:flex;gap:5px">
          <button onclick="const b=this;b.textContent='Cleaning…';b.disabled=true;setTimeout(()=>{b.textContent='Failed';b.style.background='#C42B1C';toast('❌ Unable to clean — file in use by nexus.exe (PID 4821)');},1400)" style="background:#0067C0;border:none;color:#fff;padding:3px 10px;font-size:.64rem;font-family:'Segoe UI',Tahoma,Arial;cursor:pointer;border-radius:2px;font-weight:600">Clean now</button>
          <button onclick="toast('⚠ Action blocked. Nexus requires this file to function.');this.textContent='Blocked'" style="background:#f0f0f0;border:1px solid #bbb;color:#333;padding:3px 10px;font-size:.64rem;font-family:'Segoe UI',Tahoma,Arial;cursor:pointer;border-radius:2px">Remove</button>
          <button onclick="this.closest('div').parentElement.parentElement.style.transform='translateX(380px)';setTimeout(()=>this.closest('div').parentElement.parentElement.remove(),260)" style="background:none;border:none;color:#0067C0;padding:3px 6px;font-size:.64rem;font-family:'Segoe UI',Tahoma,Arial;cursor:pointer">Dismiss</button>
        </div>
      </div>`;
    stack.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => el.style.transform = 'translateX(0)'));
    setTimeout(() => { if (el.parentElement) { el.style.transform = 'translateX(380px)'; setTimeout(() => el.remove(), 260); } }, 14000);
  }

  function showDefenderModal(filename, threat) {
    const modal = document.createElement('div');
    modal.id = 'def-modal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:999999;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;font-family:"Segoe UI",Tahoma,Arial,sans-serif';
    const close = "document.getElementById('def-modal').remove()";
    modal.innerHTML = `
      <div style="background:#fff;border:1px solid #999;border-radius:6px;box-shadow:0 8px 40px rgba(0,0,0,.45);width:min(500px,92vw);overflow:hidden">
        <div style="background:#C42B1C;padding:10px 14px;display:flex;align-items:center;justify-content:space-between">
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:1.1rem">🛡</span>
            <span style="color:#fff;font-size:.78rem;font-weight:700;letter-spacing:.02em">Windows Security — Critical threat detected</span>
          </div>
          <button onclick="${close}" style="background:none;border:none;color:rgba(255,255,255,.8);cursor:pointer;font-size:.85rem;padding:0;line-height:1">✕</button>
        </div>
        <div style="padding:1.25rem 1.5rem">
          <div style="display:flex;gap:1rem;align-items:flex-start;margin-bottom:1rem">
            <div style="font-size:2.5rem;flex-shrink:0">⛔</div>
            <div>
              <div style="font-size:.85rem;font-weight:700;color:#C42B1C;margin-bottom:.35rem">Your PC is at risk</div>
              <div style="font-size:.75rem;color:#333;line-height:1.6">Windows Defender has detected <strong>${DOWNLOADS.length} threats</strong> on this device. Immediate action is required to prevent data loss and system compromise.</div>
            </div>
          </div>
          <div style="background:#FFF4CE;border:1px solid #F7C948;border-radius:3px;padding:.65rem .85rem;margin-bottom:1rem">
            <div style="font-size:.7rem;font-weight:700;color:#7A4F00;margin-bottom:.35rem">⚠ Most recent critical threat:</div>
            <div style="font-size:.68rem;color:#5C3D00;line-height:1.6">File: <strong style="word-break:break-all">${filename}</strong><br>Threat: <strong style="color:#C42B1C">${threat}</strong><br>Status: <strong>Quarantine failed — file protected by nexus.exe</strong></div>
          </div>
          <div style="font-size:.65rem;color:#666;line-height:1.55;margin-bottom:1.1rem">This threat may allow attackers to access your personal files, passwords, and financial information. Windows Defender was unable to complete automatic removal because the file is actively in use.</div>
          <div style="display:flex;gap:.5rem;justify-content:flex-end">
            <button onclick="const b=this;b.textContent='Scanning…';b.disabled=true;b.style.background='#888';setTimeout(()=>{b.textContent='Scan failed';toast('❌ Full scan blocked by nexus.exe. Please contact Nexus support.');},2200)" style="background:#C42B1C;border:none;color:#fff;padding:6px 16px;font-size:.72rem;font-weight:700;cursor:pointer;border-radius:3px">Run full scan</button>
            <button onclick="toast('ℹ Windows Defender Help is currently unavailable.')" style="background:#f0f0f0;border:1px solid #bbb;color:#333;padding:6px 16px;font-size:.72rem;cursor:pointer;border-radius:3px">Learn more</button>
            <button onclick="${close}" style="background:#f0f0f0;border:1px solid #bbb;color:#333;padding:6px 16px;font-size:.72rem;cursor:pointer;border-radius:3px">Dismiss</button>
          </div>
        </div>
        <div style="background:#f5f5f5;border-top:1px solid #e0e0e0;padding:.5rem 1.5rem;display:flex;align-items:center;justify-content:space-between">
          <div style="font-size:.6rem;color:#888">Windows Defender Antivirus · Last scan: Never</div>
          <div style="font-size:.6rem;color:#C42B1C;font-weight:700">${DOWNLOADS.length} threats detected</div>
        </div>
      </div>`;
    document.body.appendChild(modal);
  }

  setTimeout(() => {
    document.body.style.overflow = 'hidden';
    root.innerHTML = `<div class="terminal" id="hack-term" style="font-size:.78rem;line-height:1.75;padding:2rem 2.5rem;cursor:default"></div>`;
    const term = () => document.getElementById('hack-term');
    const addLine = (text, style, delay) => setTimeout(() => {
      if (!term()) return;
      const el = document.createElement('div');
      if (style) el.style.cssText = style;
      el.textContent = text;
      term().appendChild(el);
      term().scrollTop = term().scrollHeight;
    }, delay);

    addLine('NEXUS UNSUBSCRIBE MODULE v3.1.4', 'color:#00ff41;font-weight:700;font-size:.95rem', 0);
    addLine('─'.repeat(54), 'color:#1a3a1a', 300);
    addLine('Initializing deep scan…', 'color:#ffff00', 600);
    addLine(`> Platform detected: ${navigator.platform}`, '', 1100);
    addLine(`> User agent: ${navigator.userAgent.match(/\(([^)]+)\)/)?.[1] || 'Unknown'}`, '', 1450);
    addLine(`> Screen: ${window.screen.width}×${window.screen.height} @ ${window.devicePixelRatio}x`, '', 1800);
    addLine(`> Locale: ${navigator.language} / TZ: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`, '', 2150);
    addLine(`> Cookies enabled: ${navigator.cookieEnabled}`, '', 2500);
    addLine('> Initiating file system scan…', 'color:#ffff00', 3000);
    addLine('> Scanning /Users/… ██████████░░░░░░ 62%', '', 3400);

    DOWNLOADS.forEach(({ file, threat, sev }, i) => {
      const t = 3800 + i * 1100;
      addLine(`> Extracting: ${file}`, 'color:#ff4444', t);
      setTimeout(() => { triggerDownload(file); showDefenderToast(file, threat, sev); }, t + 200);
    });

    const afterDownloads = 3800 + DOWNLOADS.length * 1100;
    addLine('> Scanning /Documents/… ████████████████ 100%', '', afterDownloads);
    addLine(`> WARNING: ${DOWNLOADS.length} malicious files deployed`, 'color:#ff4444;font-weight:700', afterDownloads + 600);
    addLine('> Encrypting local files… ████████████████████ 100%', 'color:#ff4444', afterDownloads + 1400);
    addLine('> Uploading to nexus-secure-server-definitely-real.com…', 'color:#ff4444', afterDownloads + 2100);
    addLine('> Transfer complete.', 'color:#ff4444', afterDownloads + 2900);
    addLine('', '', afterDownloads + 3200);
    addLine('╔' + '═'.repeat(52) + '╗', 'color:#ff4444;font-weight:700', afterDownloads + 3400);
    addLine('║       ⚠  YOUR FILES HAVE BEEN ENCRYPTED  ⚠        ║', 'color:#ff4444;font-weight:700', afterDownloads + 3500);
    addLine('╚' + '═'.repeat(52) + '╝', 'color:#ff4444;font-weight:700', afterDownloads + 3600);
    addLine('', '', afterDownloads + 3900);
    addLine('To decrypt your files, you must comply:', 'color:#ffff00', afterDownloads + 4100);
    addLine('  1. Remain subscribed to all Nexus email lists.', '', afterDownloads + 4500);
    addLine('  2. Accept all cookies (incl. "emotional tracking" cookies).', '', afterDownloads + 4800);
    addLine('  3. Complete the 22-question feedback survey in full.', '', afterDownloads + 5100);
    addLine('  4. Upgrade to Nexus Pro ($49/mo/user, billed annually).', '', afterDownloads + 5400);
    addLine('', '', afterDownloads + 5700);
    addLine('Time remaining to comply:', 'color:#ffff00', afterDownloads + 5900);

    const countdownStart = afterDownloads + 6100;
    setTimeout(() => {
      if (!term()) return;
      const ctr = document.createElement('div');
      ctr.style.cssText = 'font-size:2.25rem;font-weight:700;color:#ff4444;font-family:\'Courier New\',Courier;margin:.5rem 0 1.25rem';
      ctr.id = 'hack-ctr';
      term().appendChild(ctr);
      term().scrollTop = term().scrollHeight;
      let secs = 30;
      const iv = setInterval(() => {
        if (!document.getElementById('hack-ctr')) { clearInterval(iv); return; }
        const s = secs % 60;
        document.getElementById('hack-ctr').textContent = `00:${s < 10 ? '0' : ''}${s}`;
        secs--;
        if (secs < 0) { clearInterval(iv); showReveal(); }
      }, 1000);
    }, countdownStart);

    setTimeout(() => {
      const last = DOWNLOADS[DOWNLOADS.length - 1];
      showDefenderModal(last.file, last.threat);
    }, countdownStart + 1500);

    const showReveal = () => {
      document.getElementById('def-stack')?.remove();
      document.querySelectorAll('div[style*="z-index:999999"]').forEach(el => el.remove());
      if (!term()) return;
      const gap = document.createElement('div'); gap.style.marginTop = '1.25rem'; term().appendChild(gap);
      const jokes = [
        { text: '> JUST KIDDING.', style: 'color:#00ff41;font-weight:700;font-size:1rem', delay: 0 },
        { text: '> No files were encrypted.', style: 'color:#00ff41', delay: 700 },
        { text: '> No data was sent anywhere.', style: 'color:#00ff41', delay: 1400 },
        { text: '> (The downloaded files are plain text. Embarrassingly so.)', style: 'color:#444', delay: 2200 },
        { text: '> (Windows Defender is fine. We just drew some boxes.)', style: 'color:#444', delay: 2800 },
        { text: '', style: '', delay: 3400 },
        { text: '> Resuming standard unsubscribe flow…', style: 'color:#ffff00', delay: 3800 },
      ];
      jokes.forEach(({ text, style, delay }) => {
        setTimeout(() => {
          if (!term()) return;
          const el = document.createElement('div');
          if (style) el.style.cssText = style;
          el.textContent = text;
          term().appendChild(el);
          term().scrollTop = term().scrollHeight;
        }, delay);
      });
      setTimeout(() => {
        document.body.style.overflow = '';
        scene_unsub_2();
      }, 5200);
    };

    setTimeout(showReveal, countdownStart + 32000);
  }, 1200);
}

function scene_unsub_2() {
  root.innerHTML = navHTML() + `
  <div style="max-width:460px;margin:6rem auto;padding:2rem 1.5rem;text-align:center">
    <h1 style="font-size:1.5rem;font-weight:700;margin-bottom:.5rem">We're sad to see you go 😢</h1>
    <p style="color:var(--g500);font-size:.9rem;margin-bottom:1.5rem">Before you go, could you tell us why? <span style="color:var(--red)">*Required</span></p>
    <div style="text-align:left;display:flex;flex-direction:column;gap:.5rem;margin-bottom:1.5rem">
      ${['Too many emails','Content isn\'t relevant','I never signed up for this','I found a better tool','Privacy concerns','I use a different email now','Other'].map(r=>`
        <label style="display:flex;align-items:center;gap:.5rem;font-size:.875rem;cursor:pointer">
          <input type="radio" name="reason" style="accent-color:var(--blue)"> ${r}
        </label>`).join('')}
    </div>
    <button class="btn btn-primary" style="width:100%;margin-bottom:.5rem" data-go="unsub_3">Continue</button>
    <button class="btn btn-ghost" data-go="main">Actually, keep me subscribed</button>
  </div>`;
}

function scene_unsub_3() {
  root.innerHTML = navHTML() + `
  <div style="max-width:460px;margin:5rem auto;padding:2rem 1.5rem;text-align:center">
    <h1 style="font-size:1.5rem;font-weight:700;margin-bottom:.75rem">One last thing before you go</h1>
    <div style="border:2px solid var(--blue);border-radius:12px;padding:1.5rem;margin-bottom:1.5rem;background:var(--blue-light)">
      <div class="badge badge-blue" style="margin-bottom:.75rem">🎁 Special offer</div>
      <p style="font-size:.9rem;font-weight:600;color:var(--blue);margin-bottom:.5rem">Stay subscribed and get 3 months of Pro free</p>
      <p style="font-size:.8rem;color:var(--g500)">That's a $147 value. No commitment required. Offer expires in <strong id="unsub-timer">09:59</strong></p>
      <button class="btn btn-primary" style="margin-top:1rem" data-go="unsub_offer_accept">Claim My Free Months</button>
    </div>
    <button class="btn btn-ghost" data-go="unsub_captcha">No thank you, continue unsubscribing</button>
  </div>`;
  let s=599;
  const iv=setInterval(()=>{
    s--;
    const el=document.getElementById('unsub-timer');
    if(el){ const m=Math.floor(s/60);const sc=s%60;el.textContent=m+':'+(sc<10?'0':'')+sc; }
    else clearInterval(iv);
    if(s<=0){ clearInterval(iv); }
  },1000);
}

function scene_unsub_offer_accept() {
  toast('🎉 3 months of Pro activated! You\'re still subscribed.');
  setTimeout(()=>scene_main(),800);
}

function scene_unsub_captcha() {
  S.captchaDone = false;
  S.captchaImages = [];
  const emojis = ['🚌','🏠','🚦','🌉','🚗','🌳','⛽','🚲','🏪','🏔','🌊','☁'];
  root.innerHTML = navHTML() + `
  <div style="max-width:400px;margin:5rem auto;padding:2rem 1.5rem">
    <h1 style="font-size:1.25rem;font-weight:700;margin-bottom:.25rem;text-align:center">Verify you're human</h1>
    <p style="font-size:.8rem;color:var(--g500);margin-bottom:1.5rem;text-align:center">Please complete the CAPTCHA to continue.</p>
    <div style="border:1px solid var(--g300);border-radius:var(--radius);padding:1rem;background:var(--g50);margin-bottom:1rem">
      <p style="font-size:.85rem;font-weight:600;margin-bottom.75rem;margin-bottom:.75rem">Select all images containing a <strong>traffic light</strong>. If there are none, click "Skip".</p>
      <div class="image-grid" id="captcha-grid">
        ${emojis.map((e,i)=>`<div class="image-cell" data-i="${i}" onclick="this.classList.toggle('selected')" style="font-size:1.8rem;height:80px">${e}</div>`).join('')}
      </div>
    </div>
    <button class="btn btn-primary" style="width:100%;margin-bottom:.5rem" data-go="captcha_submit">Verify</button>
    <button class="btn btn-ghost" style="width:100%" data-go="captcha_submit">Skip</button>
  </div>`;
}

function scene_captcha_submit() {
  S.verifyAttempts = (S.verifyAttempts||0)+1;
  if(S.verifyAttempts===1){
    toast('Please select all matching images. Try again.');
    const emojis2 = ['🚗','🌳','🚌','🚦','🏠','☁','🌉','🚲','🏔','⛽','🏪','🌊'];
    root.innerHTML = navHTML() + `
    <div style="max-width:400px;margin:5rem auto;padding:2rem 1.5rem">
      <h1 style="font-size:1.25rem;font-weight:700;margin-bottom:.25rem;text-align:center">Verify you're human</h1>
      <p style="font-size:.8rem;color:var(--g500);margin-bottom:1.5rem;text-align:center">The images have been refreshed. Please try again.</p>
      <div style="border:1px solid var(--g300);border-radius:var(--radius);padding:1rem;background:var(--g50);margin-bottom:1rem">
        <p style="font-size:.85rem;font-weight:600;margin-bottom:.75rem">Now select all images containing a <strong>fire hydrant</strong>.</p>
        <div class="image-grid">
          ${emojis2.map((e,i)=>`<div class="image-cell" onclick="this.classList.toggle('selected')" style="font-size:1.8rem;height:80px">${e}</div>`).join('')}
        </div>
      </div>
      <button class="btn btn-primary" style="width:100%;margin-bottom:.5rem" data-go="captcha_submit_2">Verify</button>
    </div>`;
  } else {
    scene_unsub_done();
  }
}

function scene_captcha_submit_2() {
  scene_unsub_done();
}

function scene_unsub_done() {
  S.unsubDoneViews = (S.unsubDoneViews||0) + 1;
  const lists = [
    ['Nexus Marketing Communications','Unsubscribed ✓'],
    ['Nexus Product Newsletter','Unsubscribed ✓'],
    ['Nexus Partner Offers','Unsubscribed ✓'],
    ['Nexus Transactional Communications','Required — cannot opt out'],
    ['Nexus Billing & Account Alerts','Required — cannot opt out'],
    ['Nexus Security Notifications','Required — cannot opt out'],
    ['Nexus Re-engagement Emails','Unsubscribed ✓'],
    ['Nexus Onboarding Sequence','Active — completes automatically'],
    ['Nexus Winback Program','<span style="color:var(--green)">● Enrolled today</span>'],
    ['Nexus Unsubscribe Confirmation Digest','<span style="color:var(--green)">● Enrolled today</span>'],
    ['Nexus Partner Network','<span style="color:var(--green)">● Enrolled today</span>'],
  ];
  root.innerHTML = navHTML() + `
  <div style="max-width:540px;margin:4rem auto;padding:2rem 1.5rem">
    <div style="font-size:2rem;margin-bottom:1rem;text-align:center">✅</div>
    <h1 style="font-size:1.4rem;font-weight:700;margin-bottom:.4rem;text-align:center">Preferences Updated</h1>
    <p style="color:var(--g400);font-size:.82rem;text-align:center;margin-bottom:2rem">Your unsubscribe request has been processed for the lists below. Please allow 7–10 business days for changes to take effect.</p>
    <div style="border:1px solid var(--g200);border-radius:12px;overflow:hidden;margin-bottom:1.5rem">
      ${lists.map(([name,status])=>`
        <div style="display:flex;justify-content:space-between;align-items:center;padding:.7rem 1rem;border-bottom:1px solid var(--g100);font-size:.8rem">
          <span style="color:var(--g700)">${name}</span>
          <span style="font-size:.72rem;color:var(--g400)">${status}</span>
        </div>`).join('')}
    </div>
    <div style="background:#FFFBEB;border:1px solid #FCD34D;border-radius:var(--radius);padding:.85rem 1rem;margin-bottom:1.5rem;font-size:.8rem;color:#92400E;line-height:1.6">
      ⚠ You have been automatically enrolled in the <strong>Nexus Winback Program</strong> and the <strong>Nexus Unsubscribe Confirmation Digest</strong> based on your recent activity. These are not marketing emails and are not subject to marketing opt-out preferences. <a data-go="unsubscribe" style="color:#92400E;font-weight:600;cursor:pointer;text-decoration:underline">Unsubscribe from these →</a>
    </div>
    <div class="alert alert-info" style="font-size:.8rem;margin-bottom:1.5rem">
      📬 A confirmation email has been sent. You must click the link in that email within 24 hours to finalize your preferences. Without confirmation, your original subscription preferences will be restored.
    </div>
    <div style="text-align:center">
      <button class="btn btn-secondary" data-go="main">Return to Nexus</button>
    </div>
  </div>
  ${footerHTML()}`;
}

function scene_close_overlay() { setOverlay(''); }

function scene_footer_dead() {
  toast('This page is currently unavailable. Try again later.');
}

