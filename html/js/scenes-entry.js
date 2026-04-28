// ────────────────────────── SCENES ──────────────────────────

function scene_home() {
  narratorEnter('home');
  clearSocialProof();
  root.innerHTML = `
  <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;background:linear-gradient(135deg,#F0F7FF 0%,#fff 60%);text-align:center;padding:2rem">
    <div style="font-size:.8rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--blue);margin-bottom:1rem">Introducing Nexus 2.0</div>
    <h1 style="font-size:clamp(2.5rem,6vw,4.5rem);font-weight:900;letter-spacing:-.04em;line-height:1.05;max-width:700px;margin-bottom:1.5rem">The last tool your<br><em style="color:var(--blue);font-style:normal">team will ever need</em></h1>
    <p style="font-size:1.15rem;color:var(--g500);max-width:480px;line-height:1.65;margin-bottom:2.5rem">Streamline your workflow. Empower collaboration. Unlock synergies. Transform your digital journey with AI-powered insights.</p>
    <div style="display:flex;gap:.75rem;flex-wrap:wrap;justify-content:center">
      <button class="btn btn-primary btn-lg" data-go="cookies">Get Started Free →</button>
      <button class="btn btn-secondary btn-lg" data-go="demo">Watch Demo</button>
    </div>
    <p style="font-size:.75rem;color:var(--g400);margin-top:1.25rem">No credit card required. Free 14-day trial. *</p>
    <p style="font-size:.65rem;color:var(--g300);margin-top:.3rem">* Credit card required after day 1 to confirm identity. Trial limited to 1 user.</p>
    <div style="display:flex;gap:2.5rem;margin-top:3.5rem;flex-wrap:wrap;justify-content:center">
      ${['4.9 ★ on G2','#1 Product of the Day','SOC2 Certified','99.99% Uptime'].map(t=>`<div style="font-size:.8rem;color:var(--g400);font-weight:500">${t}</div>`).join('')}
    </div>
  </div>`;
  setOverlay('');
}

function scene_cookies() {
  S.cookieAttempts++;
  clearSocialProof();
  root.innerHTML = `
  <div style="filter:blur(3px);pointer-events:none;min-height:100vh;background:linear-gradient(135deg,#F0F7FF 0%,#fff 60%);display:flex;align-items:center;justify-content:center">
    <h1 style="font-size:3rem;color:var(--g200);font-weight:900">Nexus</h1>
  </div>
  <div class="cookie-box">
    <div class="cookie-text">
      <p>We use cookies and similar tracking technologies to enhance your browsing experience, serve personalized content, analyze traffic, and assist with our marketing efforts. By clicking "Accept All" you consent to our use of cookies${S.cookieAttempts > 1 ? ' <strong>(again)</strong>' : ''}.
      ${S.cookieAttempts === 2 ? '<br><span style="font-size:.75rem;color:var(--red)">⚠ Your preferences were not saved. Please accept to continue.</span>' : ''}
      ${S.cookieAttempts >= 3 ? '<br><span style="font-size:.75rem;color:var(--red)">⚠ We noticed you keep trying to reject cookies. This is required for the site to function.</span>' : ''}
      </p>
      <a data-go="cookie_prefs">Manage Preferences</a>
    </div>
    <div class="cookie-actions">
      <button class="btn btn-secondary btn-sm" data-go="cookie_prefs">Customize</button>
      <button class="btn btn-primary" data-go="loading">Accept All</button>
      <span class="cookie-reject" data-go="cookie_reject" style="font-size:.65rem;color:var(--g300)">reject${S.cookieAttempts > 1 ? ' (unavailable in your region)' : ''}</span>
    </div>
  </div>`;
  setOverlay('');
}

function scene_cookie_reject() {
  toast('This option is not available in your region. Please manage preferences individually.');
  setTimeout(() => scene_cookie_prefs(), 600);
}

function scene_cookie_prefs() {
  const toggles = [
    ['Strictly Necessary Cookies', 'Required for the website to function. Cannot be disabled.', true, true],
    ['Performance & Analytics', 'Helps us understand how visitors interact with our website.', true, true],
    ['Functional Cookies', 'Enables enhanced functionality and personalization.', true, true],
    ['Targeting & Advertising', 'Used to deliver relevant advertisements across the web.', true, true],
    ['Social Media Cookies', 'Set by social media services to enable content sharing.', true, true],
    ['Third-Party Partners', 'Allows our 847 trusted partners to process your data.', true, true],
    ['AI Personalization', 'Powers our AI-driven content recommendations.', true, true],
    ['Cross-Device Tracking', 'Connects your experience across all your devices.', true, true],
  ];
  root.innerHTML = `
  <div style="max-width:600px;margin:4rem auto;padding:2rem 1.5rem">
    <button data-go="cookies" style="font-size:.85rem;color:var(--g500);cursor:pointer;border:none;background:none;margin-bottom:1.5rem;display:flex;align-items:center;gap:.3rem">← Back</button>
    <h1 style="font-size:1.5rem;font-weight:700;margin-bottom:.5rem">Cookie Preferences</h1>
    <p style="font-size:.875rem;color:var(--g500);margin-bottom:1.5rem">Manage your cookie preferences below. Some cookies are required for the site to function and cannot be disabled. <a data-go="privacy" style="color:var(--blue);cursor:pointer">View our full cookie policy</a></p>
    <div style="border:1px solid var(--g200);border-radius:var(--radius);overflow:hidden;margin-bottom:1.5rem">
      ${toggles.map(([name,desc,on,locked])=>`
        <div class="toggle-row" style="padding:.85rem 1rem">
          <div class="toggle-label">${name}<span class="lock-icon">${locked?'🔒':''}</span><small>${desc}</small></div>
          <div class="toggle${on?' ':'off'}" title="${locked?'This setting cannot be changed':''}"></div>
        </div>`).join('')}
    </div>
    <p style="font-size:.72rem;color:var(--g400);margin-bottom:1.25rem">By saving, you agree that these preferences will be applied. Note: Disabling certain cookies may degrade site performance. Rejected cookies will be re-enabled upon your next visit for compliance with our legitimate interest basis.</p>
    <div style="display:flex;gap:.75rem">
      <button class="btn btn-secondary" data-go="cookies">Cancel</button>
      <button class="btn btn-primary" data-go="cookies">Save Preferences</button>
    </div>
  </div>`;
  setOverlay('');
}

function scene_loading() {
  clearSocialProof();
  root.innerHTML = `
  <div class="loading-page">
    <div class="spinner big-spinner"></div>
    <p>Personalizing your experience…</p>
    <div style="width:260px;height:4px;background:var(--g100);border-radius:4px;overflow:hidden;margin-top:.5rem">
      <div id="lbar" style="height:100%;background:var(--blue);border-radius:4px;width:0%;transition:width .4s"></div>
    </div>
    <p id="lstatus" style="font-size:.75rem;color:var(--g400)">Initializing…</p>
  </div>`;
  setOverlay('');
  const steps = ['Initializing…','Loading preferences…','Applying personalization…','Fetching your data…','Almost ready…','Finishing up…'];
  let i = 0;
  const bar = document.getElementById('lbar');
  const status = document.getElementById('lstatus');
  const iv = setInterval(()=>{
    i++;
    if(bar) bar.style.width = (i/steps.length*100)+'%';
    if(status) status.textContent = steps[Math.min(i,steps.length-1)];
    if(i>=steps.length){ clearInterval(iv); scene_newsletter(); }
  }, 350);
}

function scene_newsletter() {
  S.newsletterShown++;
  scene_main_render();
  setOverlay(`
  <div class="backdrop">
    <div class="modal" style="max-width:440px">
      <div class="modal-header">
        <div></div>
        <button class="modal-close" data-go="newsletter_dismiss">✕</button>
      </div>
      <div class="modal-body" style="text-align:center;padding-top:.5rem">
        <div style="font-size:2.5rem;margin-bottom:1rem">🎉</div>
        <h2 style="font-size:1.25rem;font-weight:700;margin-bottom:.5rem">You're almost in!</h2>
        <p style="font-size:.9rem;color:var(--g500);margin-bottom:1.5rem;line-height:1.5">Join <strong>50,000+</strong> teams already transforming their workflows with Nexus. Get weekly tips, product updates, and exclusive offers.</p>
        <input type="email" placeholder="you@company.com" style="margin-bottom:.75rem">
        <button class="btn btn-primary" style="width:100%;margin-bottom:.75rem" data-go="newsletter_sub">Get Early Access →</button>
        <div data-go="newsletter_dismiss" style="font-size:.72rem;color:var(--g300);cursor:pointer;line-height:1.5">No thanks, I prefer to remain professionally stagnant<br>and don't like saving money.</div>
      </div>
    </div>
  </div>`);
}

function scene_newsletter_dismiss() {
  setOverlay('');
  if (S.newsletterShown < 3) {
    setTimeout(() => {
      if (S.inAdventure) return;
      if (document.getElementById('overlay') && !overlay.classList.contains('active')) {
        S.newsletterShown++;
        setOverlay(`
        <div class="backdrop">
          <div class="modal" style="max-width:400px">
            <div class="modal-header">
              <div></div>
              <button class="modal-close" data-go="newsletter_dismiss">✕</button>
            </div>
            <div class="modal-body" style="text-align:center;padding-top:.5rem">
              <div style="font-size:2rem;margin-bottom:.75rem">👀</div>
              <h2 style="font-size:1.1rem;font-weight:700;margin-bottom:.5rem">We noticed you hesitated.</h2>
              <p style="font-size:.85rem;color:var(--g500);margin-bottom:1.25rem">That's completely normal! A lot of people are scared of <strong>transforming their workflow.</strong> We're here to help.</p>
              <button class="btn btn-primary" style="width:100%;margin-bottom:.5rem" data-go="newsletter_sub">OK fine, sign me up</button>
              <div data-go="newsletter_dismiss" style="font-size:.7rem;color:var(--g300);cursor:pointer">I am not scared. I just don't want it.</div>
            </div>
          </div>
        </div>`);
      }
    }, S.newsletterShown === 1 ? 4000 : 8000);
  }
}

function scene_newsletter_sub() {
  setOverlay('');
  toast('🎉 You\'re subscribed! Check your inbox for a confirmation (and 14 follow-up emails).');
}

function scene_main_render() {
  incDepth();
  root.innerHTML = navHTML() + `
  <section style="background:linear-gradient(160deg,#F0F7FF 0%,#fff 55%);border-bottom:1px solid var(--g100)">
    <div class="hero" style="max-width:780px">
      <div class="hero-badge">✨ Now with AI-powered everything</div>
      <h1>Work smarter, not harder,<br><em>just differently</em></h1>
      <p>Nexus brings your team's projects, docs, and communication into one powerful workspace. Say goodbye to switching between twelve tabs.</p>
      <div class="hero-btns">
        <button class="btn btn-primary btn-lg" data-go="pricing">Start Free Trial →</button>
        <button class="btn btn-secondary btn-lg" data-go="features_broken">See How It Works</button>
      </div>
      <p style="font-size:.75rem;color:var(--g400);margin-top:.5rem">Free forever plan available <span style="font-size:.65rem;color:var(--g300)">(1 user, 3 projects, 100mb storage, no integrations)</span></p>
    </div>
  </section>

  <div class="section" style="text-align:center;padding-top:4rem;padding-bottom:2rem">
    <div class="section-label">Trusted by teams worldwide</div>
    <div style="display:flex;flex-wrap:wrap;gap:2.5rem;justify-content:center;margin-top:1.5rem;opacity:.35;filter:grayscale(1)">
      ${['Acme Corp','Globodyne','Initech','Umbrella Co','Vandelay Ind'].map(n=>`<div style="font-weight:700;font-size:1.1rem;color:var(--g800)">${n}</div>`).join('')}
    </div>
  </div>

  <div class="section">
    <div class="section-label">Features</div>
    <h2>Everything you need.<br>And more things you don't.</h2>
    <p>We've packed hundreds of features into Nexus. You'll use about four of them.</p>
    <div class="grid-3">
      ${[
        ['📋','Task Management','Organize work with boards, lists, and timelines. Like Trello but with more settings to configure.'],
        ['💬','Real-Time Collaboration','Comment, mention, and react. Never actually speak to a coworker again.'],
        ['🤖','AI Assistant','Our AI will summarize your documents, draft your emails, and make you feel vaguely surveilled.'],
        ['📊','Analytics Dashboard','See charts. Lots of charts. Determine nothing actionable from any of them.'],
        ['🔗','Integrations','Connect to 200+ apps. Spend 3 days configuring Slack. Watch it break on Tuesday.'],
        ['🔒','Enterprise Security','SOC 2, ISO 27001, and a privacy policy your legal team has definitely read.'],
      ].map(([icon,title,desc])=>`
        <div class="card">
          <div class="card-icon">${icon}</div>
          <h3>${title}</h3>
          <p>${desc}</p>
          <span class="card-link" data-go="pricing">Learn more →</span>
        </div>`).join('')}
    </div>
  </div>

  <div style="background:var(--g50);border-top:1px solid var(--g200);border-bottom:1px solid var(--g200)">
    <div class="section" style="text-align:center">
      <div class="section-label">Customer Stories</div>
      <h2>Don't take our word for it.<br>Take theirs.</h2>
      <div class="grid-3" style="text-align:left;margin-top:2rem">
        ${[
          ['"Nexus changed everything. We\'re 40% more productive now, and I say that without any way to measure what 40% means in this context."','Sarah M.','Head of Operations'],
          ['"I can\'t imagine going back. Mostly because switching tools takes two quarters of planning and I can\'t face that again."','James T.','Engineering Lead'],
          ['"The onboarding was a little rough but once we got through week six of setup, it really clicked."','Priya K.','Product Manager'],
        ].map(([q,n,r])=>`
          <div class="card">
            <p style="font-size:.9rem;color:var(--g600);line-height:1.6;margin-bottom:1rem">${q}</p>
            <div style="display:flex;align-items:center;gap:.75rem">
              <div style="width:36px;height:36px;border-radius:50%;background:var(--g200);display:flex;align-items:center;justify-content:center;font-size:.85rem;font-weight:700;color:var(--g500)">${n[0]}</div>
              <div><div style="font-weight:600;font-size:.875rem">${n}</div><div style="font-size:.75rem;color:var(--g400)">${r}</div></div>
            </div>
          </div>`).join('')}
      </div>
    </div>
  </div>

  <div style="background:linear-gradient(135deg,var(--blue),#7C3AED);padding:5rem 2rem;text-align:center;color:#fff">
    <h2 style="font-size:2.25rem;font-weight:800;letter-spacing:-.03em;margin-bottom:1rem">Ready to transform your workflow?</h2>
    <p style="opacity:.8;margin-bottom:2rem;font-size:1rem">Join thousands of teams. Start free. Upgrade when you hit a wall we built intentionally.</p>
    <button class="btn btn-lg" style="background:#fff;color:var(--blue)" data-go="pricing">Get Started Free →</button>
  </div>

  ${footerHTML()}`;
  socialProof();
}

function scene_main() { S.inAdventure = false; scene_main_render(); setOverlay(''); injectChatBtn(); S._mobileTimer = setTimeout(()=>scene_mobile_prompt(), 12000); }

function scene_nav_home() {
  incDepth();
  setOverlay('');
  root.innerHTML = `
  <div style="background:linear-gradient(to bottom,#245cdc 0%,#1845b8 100%);min-height:100vh;font-family:Tahoma,Arial,sans-serif;display:flex;align-items:center;justify-content:center">
    <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-58%);background:#ECE9D8;border:1px solid #6d6d6d;box-shadow:3px 3px 10px rgba(0,0,0,.6);min-width:360px;border-radius:4px 4px 0 0;overflow:hidden">
      <div style="background:linear-gradient(to bottom,#0d5dcd,#0040b0);padding:3px 5px;display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:.65rem;color:#fff;font-weight:700;display:flex;align-items:center;gap:4px">🌐 Internet Explorer — Nexus</span>
        <div style="display:flex;gap:2px">
          <button style="background:#ddd;border:1px outset #aaa;width:16px;height:14px;font-size:.55rem;cursor:pointer;line-height:1;padding:0" onclick="toast('Minimize is not available while this error is displayed.')">─</button>
          <button style="background:#ddd;border:1px outset #aaa;width:16px;height:14px;font-size:.55rem;cursor:pointer;line-height:1;padding:0" onclick="toast('This window cannot be resized. Please adjust your display settings.')">□</button>
          <button style="background:#d84040;border:1px outset #aaa;width:16px;height:14px;font-size:.55rem;cursor:pointer;color:#fff;line-height:1;padding:0" data-go="main">✕</button>
        </div>
      </div>
      <div style="padding:1.25rem 1.5rem 1rem">
        <div style="display:flex;align-items:flex-start;gap:1rem;margin-bottom:1.25rem">
          <div style="font-size:2.5rem;flex-shrink:0;line-height:1">⚠️</div>
          <div>
            <div style="font-size:.82rem;font-weight:700;margin-bottom:.5rem;color:#000">The page cannot be displayed</div>
            <div style="font-size:.72rem;color:#333;line-height:1.55">You are already on the home page. Navigating to this location requires leaving the current page, which is this page.<br><br>To navigate away from this page, please click a different link.<br><br><span style="color:#666">Technical information:<br><code style="font-size:.62rem;background:#fff;border:1px solid #aaa;padding:.05rem .3rem">ERR_ALREADY_HOME (0xC00D1126)</code></span></div>
          </div>
        </div>
        <div style="display:flex;gap:.4rem;justify-content:flex-end">
          <button class="xp-btn" data-go="main">OK</button>
          <button class="xp-btn" data-go="home">Cancel</button>
          <button class="xp-btn" onclick="toast('Help is not available for this error.')">Help</button>
        </div>
      </div>
    </div>
    <div style="position:fixed;bottom:0;left:0;right:0;background:linear-gradient(to bottom,#245cdb,#1845b8);height:30px;display:flex;align-items:center;padding:0 4px;gap:4px;border-top:1px solid #4a7ae0">
      <button style="background:linear-gradient(to bottom,#3c9b3c,#1e6b1e);border:1px outset #4cbb4c;padding:2px 10px;color:#fff;font-size:.72rem;font-weight:700;font-family:Tahoma,Arial,sans-serif;cursor:pointer;border-radius:3px" onclick="toast('The Start menu is unavailable while this error is displayed.')">▶ Start</button>
      <div style="height:20px;width:1px;background:rgba(255,255,255,.15);margin:0 2px"></div>
      <div style="background:rgba(0,0,80,.35);border:1px inset #1040a0;padding:2px 10px;font-size:.65rem;color:#fff;font-family:Tahoma;cursor:pointer" onclick="toast('This window is already in the foreground.')">🌐 Internet Explorer</div>
      <div style="margin-left:auto;font-size:.62rem;color:#fff;font-family:Tahoma">${new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</div>
    </div>
  </div>`;
}

function scene_about() {
  incDepth();
  root.innerHTML = `
  <div style="background:#000080;min-height:100vh;font-family:'Times New Roman',serif;color:#ffff00">
    <div style="background:#c0c0c0;border-bottom:2px solid #fff;padding:3px 6px">
      <div style="font-size:.65rem;font-family:Arial,sans-serif;color:#000;display:flex;justify-content:space-between">
        <span>&#9654; Netscape Navigator 4.0 — Welcome to NEXUS™ CORPORATE ONLINE</span>
        <span>📧 🔒 💾</span>
      </div>
    </div>
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:800px;margin:0 auto">
      <tr>
        <td colspan="2" style="background:#ff0000;text-align:center;padding:.5rem">
          <div class="geo-blink" style="font-size:1.4rem;color:#ffff00;font-weight:700;font-family:Impact,Arial">★★★ WELCOME TO NEXUS™ OFFICIAL CORPORATE WEB PRESENCE ★★★</div>
          <div class="geo-blink" style="font-size:.68rem;color:#00ffff;font-family:Arial;margin-top:.2rem">— THIS SITE IS BEST VIEWED IN NETSCAPE NAVIGATOR AT 800×600 —</div>
        </td>
      </tr>
      <tr>
        <td width="145" valign="top" style="background:#000066;border-right:2px solid #00ffff;padding:.75rem">
          <div style="color:#ffff00;font-size:.72rem;font-weight:700;font-family:Arial;margin-bottom:.6rem;text-align:center">✦ NAVIGATION ✦</div>
          ${[['🏠 Home Page','main'],['📧 E-Mail Us','contact_sales'],['📋 Guestbook','community'],['💰 Investors','press'],['🔗 Cool Links','cool_links'],['❓ Site Map','sitemap']].map(([l,g])=>`<div style="margin-bottom:.35rem;text-align:center"><a data-go="${g}" style="color:#00ff00;font-size:.68rem;font-family:Arial;cursor:pointer;text-decoration:underline">${l}</a></div>`).join('')}
          <div style="margin-top:1.25rem;border-top:1px solid #333;padding-top:.6rem;text-align:center">
            <div style="font-size:.58rem;color:#888;font-family:Arial">Visitor Count:</div>
            <div style="font-size:1.1rem;color:#ff0;font-family:'Courier New';letter-spacing:.08em">${String(Math.floor(Math.random()*9000+1000)).padStart(7,'0')}</div>
          </div>
          <div style="margin-top:.85rem;text-align:center">
            <div style="width:88px;height:31px;margin:0 auto;background:repeating-linear-gradient(45deg,#ff0 0,#ff0 6px,#000 6px,#000 12px);border:1px solid #888"></div>
            <div style="font-size:.55rem;color:#ff0;font-family:Arial;margin-top:.2rem;animation:geo-blink 1s step-end infinite">🚧 UNDER CONSTRUCTION</div>
          </div>
        </td>
        <td valign="top" style="background:#fff;padding:1rem">
          <h1 style="font-size:1.7rem;color:#000080;font-family:Arial;border-bottom:4px double #ff0000;padding-bottom:.4rem;margin-bottom:1rem">About Nexus™ Corporation</h1>
          <p style="font-size:.83rem;color:#000;line-height:1.7;font-family:Arial;margin-bottom:.75rem">Welcome to the <span class="geo-blink" style="color:#ff0000;font-weight:700">OFFICIAL</span> web presence of Nexus™! We are a <span style="color:#0000cc;font-weight:700">LEADING PROVIDER</span> of synergistic enterprise solutions for the modern knowledge worker. Founded in 1996, Nexus™ has been delivering value to clients worldwide.</p>
          <table border="1" cellpadding="4" cellspacing="0" width="100%" style="font-size:.78rem;font-family:Arial;border-color:#000080;margin-bottom:1rem">
            <tr style="background:#000080;color:#fff"><th>Product</th><th>Version</th><th>Status</th><th>Price</th></tr>
            <tr style="background:#ffffcc"><td>Nexus Basic™</td><td>v1.0.2</td><td>✅ Available</td><td>FREE (with banner ads)</td></tr>
            <tr style="background:#fff"><td>Nexus Pro™</td><td>v1.0.2</td><td>✅ Available</td><td>$49/mo/user</td></tr>
            <tr style="background:#ffffcc"><td>Nexus Ultra™</td><td>Coming 1999</td><td>🚧 Soon</td><td>Call for pricing</td></tr>
          </table>
          <div style="background:#ffff99;border:2px dashed #ff0000;padding:.75rem;margin-bottom:.75rem">
            <div class="geo-blink" style="font-size:.72rem;font-weight:700;color:#ff0000;font-family:Arial">📢 NOTICE: You have navigated to our "About" page.</div>
            <div style="font-size:.7rem;color:#000;font-family:Arial;margin-top:.3rem">The About page is currently under renovation. You are viewing the archived 1998 version. <a data-go="main" style="color:#0000cc;cursor:pointer;font-weight:700">Click here to return home.</a></div>
          </div>
          <div style="text-align:center">
            <button class="btn btn-primary" data-go="signup" style="font-family:Arial;font-size:.8rem;background:#ff0000;border-color:#cc0000">★ Sign Up NOW — It's FREE! ★</button>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="2" style="background:#c0c0c0;text-align:center;font-size:.6rem;font-family:Arial;color:#000;padding:.35rem;border-top:2px solid #888">
          © 1998–${new Date().getFullYear()} Nexus™ Corporation. All Rights Reserved. Best viewed in Netscape Navigator 3.0+. <a data-go="home" style="color:#0000cc;cursor:pointer">Click here if this page does not load correctly.</a>
        </td>
      </tr>
    </table>
  </div>`;
}

function scene_cool_links() {
  incDepth();
  const links = [
    ['AltaVista Search Engine','http://www.altavista.com','The best search engine on the web!'],
    ['Netscape Navigator Homepage','http://home.netscape.com','The browser that started it all'],
    ['Ask Jeeves','http://www.askjeeves.com','Ask the butler anything!'],
    ['WebCrawler','http://www.webcrawler.com','Crawls the web so you don\'t have to'],
    ['GeoCities Free Homepages','http://www.geocities.com','Get your own FREE homepage today!'],
    ['Angelfire','http://www.angelfire.com','Another great free homepage host'],
    ['Yahoo! Internet Life','http://www.yil.com','The magazine for the internet generation'],
    ['Excite!','http://www.excite.com','Your daily destination on the web'],
    ['ICQ - I Seek You','http://www.icq.com','Talk to friends online - FREE!'],
    ['RealPlayer','http://www.real.com','Listen to music on the internet!'],
  ];
  root.innerHTML = `
  <div style="background:#000080;min-height:100vh;font-family:'Times New Roman',serif;color:#ffff00">
    <div style="background:#c0c0c0;border-bottom:2px solid #fff;padding:3px 6px;font-size:.65rem;font-family:Arial,sans-serif;color:#000;display:flex;justify-content:space-between">
      <span>&#9654; Netscape Navigator 4.0 — Nexus™ Cool Links Page</span>
      <span>📧 🔒 💾</span>
    </div>
    <div style="max-width:800px;margin:0 auto;padding:1rem">
      <div style="text-align:center;background:#ff0000;padding:.5rem;margin-bottom:1rem">
        <div class="geo-blink" style="font-size:1.3rem;color:#ffff00;font-weight:700;font-family:Impact">🔗 NEXUS™ COOL LINKS PAGE 🔗</div>
        <div style="font-size:.65rem;color:#00ffff;font-family:Arial">Last updated: June 14, 1998 &nbsp;·&nbsp; Links verified with WebCrawler</div>
      </div>
      <div style="background:#000066;border:2px solid #00ffff;padding:1rem;margin-bottom:1rem">
        <div style="color:#ffff00;font-size:.8rem;font-family:Arial;font-weight:700;margin-bottom:.75rem;text-align:center">★ OUR FAVORITE SITES ON THE WORLD WIDE WEB ★</div>
        ${links.map(([name,url,desc])=>`
          <div style="margin-bottom:.75rem;padding-bottom:.75rem;border-bottom:1px dashed #333">
            <div style="font-size:.8rem;font-family:Arial"><a href="${url}" style="color:#00ff00;font-weight:700;text-decoration:underline">${name}</a></div>
            <div style="font-size:.68rem;color:#aaffaa;font-family:Arial;margin-top:.15rem">${url}</div>
            <div style="font-size:.7rem;color:#ffff99;font-family:Arial;margin-top:.1rem">${desc}</div>
          </div>`).join('')}
      </div>
      <div style="text-align:center;font-size:.68rem;color:#888;font-family:Arial;margin-bottom:1rem">
        <div class="geo-blink" style="color:#ff0000">⚠ NOTE: Some of these links may no longer be active. The internet changes fast!</div>
      </div>
      <div style="text-align:center">
        <button data-go="about" style="background:#ff0000;color:#fff;border:2px outset #ff8888;padding:.3rem 1rem;font-family:Arial;font-size:.75rem;cursor:pointer">← Back to About Page</button>
        &nbsp;
        <button data-go="main" style="background:#000066;color:#ffff00;border:2px outset #4444ff;padding:.3rem 1rem;font-family:Arial;font-size:.75rem;cursor:pointer">🏠 Go Home</button>
      </div>
    </div>
    <div style="background:#c0c0c0;text-align:center;font-size:.6rem;font-family:Arial;color:#000;padding:.35rem;border-top:2px solid #888;margin-top:1rem">
      © 1998 Nexus™ Corporation. Cool Links Curator: <em>webmaster@nexus.com</em>. Updated monthly (or whenever we remember).
    </div>
  </div>`;
}

function scene_sitemap() {
  incDepth();
  const sections = [
    ['🏠 MAIN','main',[['Welcome Page','main'],['What is Nexus?','about'],['Sign In','signin'],['Sign Up (FREE!)','signup']]],
    ['📦 PRODUCTS','features',[['Features List','features'],['Pricing Plans','pricing'],['Free Trial Info','pricing'],['Compare Plans','pricing']]],
    ['👔 COMPANY INFO','about',[['About Nexus™','about'],['Press & Media','press'],['Job Openings','careers'],['Legal Documents','legal']]],
    ['📖 RESOURCES','docs',[['Documentation','docs'],['API Reference','api_ref'],['Templates','templates'],['Webinars','webinars'],['Community Forum','community']]],
    ['🆘 HELP','help',[['Help Center','help'],['Contact Us','contact_sales'],['System Status','site_status'],['Security Info','security_page']]],
    ['📜 LEGAL','legal',[['Privacy Policy','privacy'],['Terms of Service','terms'],['Cookie Policy','cookie_prefs'],['All Legal Docs','legal']]],
  ];
  root.innerHTML = `
  <div style="background:#ffffff;min-height:100vh;font-family:Arial,sans-serif">
    <div style="background:#000080;padding:.4rem .75rem;color:#fff;font-size:.75rem;font-family:Arial;display:flex;justify-content:space-between;align-items:center">
      <span>&#9654; Nexus™ — Site Map</span>
      <button data-go="about" style="background:#c0c0c0;color:#000;border:2px outset #fff;padding:.1rem .5rem;font-size:.65rem;cursor:pointer">← Back</button>
    </div>
    <div style="background:#c0c0c0;border-bottom:2px solid #888;padding:.5rem .75rem">
      <span style="font-size:.8rem;font-family:Arial;font-weight:700">NEXUS™ OFFICIAL SITE MAP</span>
      <span style="font-size:.65rem;color:#555;margin-left:1rem">Last updated: ${new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</span>
    </div>
    <div style="max-width:800px;margin:0 auto;padding:1rem">
      <p style="font-size:.75rem;color:#000066;font-family:Arial;margin-bottom:1rem">Welcome to the Nexus™ Site Map. Use this page to navigate to any section of our website. If a link does not work, please clear your browser cache and try again.</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem">
        ${sections.map(([title,titleGo,items])=>`
          <div style="border:2px inset #888;padding:.5rem;background:#f0f0f0">
            <div style="background:#000080;color:#ffff00;font-size:.72rem;font-weight:700;padding:.2rem .4rem;font-family:Arial;margin-bottom:.4rem"><a data-go="${titleGo}" style="color:#ffff00;cursor:pointer">${title}</a></div>
            <ul style="margin:0;padding-left:1.1rem;list-style:disc">
              ${items.map(([label,go])=>`<li style="font-size:.7rem;font-family:Arial;margin:.15rem 0"><a data-go="${go}" style="color:#000080;cursor:pointer;text-decoration:underline">${label}</a></li>`).join('')}
            </ul>
          </div>`).join('')}
      </div>
      <div style="margin-top:1rem;padding:.5rem;background:#ffffcc;border:1px solid #888;font-size:.68rem;font-family:Arial;color:#333">
        <strong>NOTICE:</strong> This site map was last verified using Internet Explorer 4.0. Some pages may load differently in other browsers. Nexus™ is best experienced at 800×600 resolution with JavaScript enabled. <a data-go="main" style="color:#000080">Return to homepage →</a>
      </div>
    </div>
  </div>`;
}

function scene_features() {
  incDepth();
  let pct = 0;
  const stall = 95;
  const msgs = ['Loading Macromedia Flash Player 8…','Initializing Nexus Interactive Experience…','Loading assets (1 of 847)…','Loading audio module…','Preloading HD animations…','Rendering vector graphics…','Compiling shader cache…','Almost there…','98%… hang on…','Still at 95%…','Really almost done…','This is normal. Please wait.','Connection timeout (retrying)…'];
  root.innerHTML = `
  <div style="min-height:100vh;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:Arial,sans-serif">
    <div style="text-align:center;padding:2rem;max-width:400px;width:100%">
      <div style="font-size:.72rem;color:#555;margin-bottom:.5rem;letter-spacing:.15em;text-transform:uppercase">Macromedia Flash Player 8 Required</div>
      <div style="font-size:.95rem;color:#aaa;margin-bottom:1.75rem">Loading Nexus Interactive Features Tour…</div>
      <div style="background:#111;border:1px solid #2a2a2a;border-radius:2px;height:20px;width:300px;margin:0 auto .75rem;overflow:hidden;position:relative">
        <div id="fl-bar" style="height:100%;background:linear-gradient(to right,#0050ff,#00aaff);width:0%;transition:width .35s ease"></div>
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:.6rem;color:#fff;font-weight:700;letter-spacing:.05em" id="fl-pct">0%</div>
      </div>
      <div id="fl-msg" style="font-size:.68rem;color:#444;height:1rem;text-align:center;margin-bottom:2.5rem"></div>
      <div id="fl-skip" style="opacity:0;transition:opacity .6s">
        <button style="background:none;border:1px solid #333;color:#555;padding:.4rem 1rem;font-size:.7rem;cursor:pointer;font-family:Arial" data-go="features_error">Skip intro →</button>
      </div>
    </div>
  </div>`;
  setOverlay('');
  let msgIdx = 0;
  const iv = setInterval(() => {
    if (!document.getElementById('fl-bar')) { clearInterval(iv); return; }
    if (pct < stall) { pct = Math.min(pct + (Math.random() * 9 + 2), stall); }
    else { msgIdx = Math.min(msgIdx + 1, msgs.length - 1); }
    document.getElementById('fl-bar').style.width = pct + '%';
    document.getElementById('fl-pct').textContent = Math.floor(pct) + '%';
    document.getElementById('fl-msg').textContent = msgs[Math.min(Math.floor(pct / 8), msgs.length - 1)];
    if (pct >= stall) document.getElementById('fl-skip').style.opacity = '1';
  }, 550);
}

function scene_features_error() {
  root.innerHTML = navHTML() + `
  <div style="max-width:540px;margin:6rem auto;padding:2rem;text-align:center">
    <div style="font-size:2rem;margin-bottom:1rem">⚠️</div>
    <h2 style="font-weight:700;margin-bottom:.75rem">We couldn't load that page</h2>
    <p style="color:var(--g500);font-size:.9rem;margin-bottom:2rem;line-height:1.5">The Features interactive tour requires Macromedia Flash Player 8, which your browser no longer supports. Our team has been notified. Error ID: <code style="background:var(--g100);padding:.1rem .35rem;border-radius:4px;font-size:.8rem">ERR_FEATURE_UNAVAILABLE</code></p>
    <div style="display:flex;gap:.75rem;justify-content:center">
      <button class="btn btn-secondary" data-go="features">Try Again</button>
      <button class="btn btn-primary" data-go="main">Go Home</button>
    </div>
  </div>
  ${footerHTML()}`;
}

function scene_features_broken() { scene_features(); }

function scene_pricing() {
  incDepth();
  root.innerHTML = navHTML() + `
  <div class="section" style="text-align:center;padding-top:4rem">
    <div class="section-label">Pricing</div>
    <h2>Simple, transparent pricing</h2>
    <p style="margin:0 auto 2.5rem">Start free. Upgrade when you need more. <span style="font-size:.8rem;color:var(--g400)">(You will need more.)</span></p>
    <div class="pricing-grid" style="text-align:left">
      <div class="pricing-card">
        <div class="pricing-tier">Starter</div>
        <div class="pricing-price"><sup>$</sup>0</div>
        <div class="pricing-caveat">per user/month<br>*Free for first 14 days. Card required.</div>
        <ul class="pricing-features">
          <li>Up to 3 projects</li>
          <li>1 user only</li>
          <li>100mb storage</li>
          <li class="na">Integrations (any)</li>
          <li class="na">API access</li>
          <li class="na">Support (any)</li>
        </ul>
        <button class="btn btn-secondary" style="width:100%;margin-top:auto" data-go="signup">Get Started</button>
      </div>
      <div class="pricing-card featured">
        <div class="pricing-badge">🔥 Most Popular</div>
        <div class="pricing-tier">Pro</div>
        <div class="pricing-price"><sup>$</sup>49</div>
        <div class="pricing-caveat">per user/month billed annually<br>$79/mo if billed monthly</div>
        <ul class="pricing-features">
          <li>Unlimited projects</li>
          <li>Up to 25 seats</li>
          <li>100gb storage</li>
          <li>200+ integrations</li>
          <li>Email support (72h SLA)</li>
          <li class="na">SSO / SAML</li>
        </ul>
        <button class="btn btn-primary" style="width:100%;margin-top:auto" data-go="checkout">Start Free Trial</button>
      </div>
      <div class="pricing-card">
        <div class="pricing-tier">Enterprise</div>
        <div class="pricing-price" style="font-size:1.4rem;margin-top:.4rem">Custom</div>
        <div class="pricing-caveat">Talk to our sales team for<br>a quote tailored to your needs<br>&nbsp;</div>
        <ul class="pricing-features">
          <li>Unlimited everything</li>
          <li>SSO / SAML / SCIM</li>
          <li>Dedicated success manager</li>
          <li>Custom contracts</li>
          <li>Audit logs & compliance</li>
          <li>99.99% uptime SLA</li>
        </ul>
        <button class="btn btn-secondary" style="width:100%" data-go="contact_sales">Contact Sales</button>
      </div>
    </div>
    <p style="font-size:.72rem;color:var(--g300);margin-top:2rem;max-width:600px;margin-left:auto;margin-right:auto;line-height:1.6">
      All prices in USD. Starter plan limited to 1 user and 3 projects. Storage measured in compressed binary gigabytes. Integrations subject to availability. "Unlimited" subject to fair use policy (fair use = less than you need). Prices subject to change without notice. Current users grandfathered for 90 days.
    </p>
    <div style="margin-top:3rem;padding-top:2.5rem;border-top:1px solid var(--g200)">
      <h3 style="font-weight:600;margin-bottom:1.5rem;font-size:1.1rem">Frequently Asked Questions</h3>
      <div style="max-width:640px;margin:0 auto;text-align:left;display:flex;flex-direction:column;gap:1rem">
        ${[
          ['Can I cancel anytime?','Yes. Though "anytime" means after your current billing period ends. To cancel, email our retention team, complete an exit survey, and allow 5–7 business days for processing. You will not receive a refund.'],
          ['What happens after the free trial?','You will be automatically charged for the Pro plan. We will send a reminder email to the address you used to sign up, which is probably not one you check.'],
          ['Is there a free plan?','Yes! The Starter plan is free for one user with limited features. We do not recommend it.'],
        ].map(([q,a])=>`<div style="border:1px solid var(--g200);border-radius:var(--radius);padding:1rem 1.25rem"><div style="font-weight:600;font-size:.9rem;margin-bottom:.4rem">${q}</div><div style="font-size:.85rem;color:var(--g500);line-height:1.5">${a}</div></div>`).join('')}
      </div>
    </div>
  </div>
  ${footerHTML()}`;
  setOverlay('');
}

