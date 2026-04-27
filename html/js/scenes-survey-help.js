// ────────────── SURVEY ──────────────

const SURVEY_QS = [
  { type:'stars', q:'How satisfied are you with Nexus overall?' },
  { type:'radio', q:'How long have you been using Nexus?', opts:['Less than a day','1–7 days','1–4 weeks','I\'m not sure'] },
  { type:'nps', q:'How likely are you to recommend Nexus to a colleague?' },
  { type:'check', q:'Which features do you use most?', opts:['Projects','Docs','Inbox','Analytics','Integrations','AI','None of them'] },
  { type:'radio', q:'How would you describe the onboarding experience?', opts:['Smooth','Fine','Long','Very long','I\'m still in it'] },
  { type:'text', q:'What could we improve? (required, minimum 30 words)', placeholder:'Please be specific…' },
  { type:'radio', q:'How many productivity tools do you currently use?', opts:['1–2','3–5','6–10','I\'ve lost count','I don\'t use productivity tools'] },
  { type:'radio', q:'How would you describe your current work-life balance?', opts:['Excellent','Good','Poor','Work is my life','I don\'t work'] },
  { type:'text', q:'When did you last take a vacation?', placeholder:'Approximate date or "I don\'t remember"' },
  { type:'radio', q:'On a scale of general happiness (1–5):', opts:['1 — Very unhappy','2 — Unhappy','3 — Fine','4 — Happy','5 — Suspiciously happy'] },
  { type:'radio', q:'If Nexus were a food, what food would it be?', opts:['A salad (healthy but joyless)','A birthday cake (exciting at first)','A protein bar (functional)','Cold soup','I don\'t eat'] },
  { type:'text', q:'Describe your ideal workspace in exactly 7 words.', placeholder:'Exactly 7 words. We will count.' },
  { type:'radio', q:'Do you feel your work has meaning?', opts:['Yes','No','Sometimes','Please don\'t ask me that','What is meaning?'] },
  { type:'radio', q:'How often do you feel overwhelmed?', opts:['Never','Sometimes','Often','Always','I\'m overwhelmed right now, filling out this survey'] },
  { type:'radio', q:'We noticed you haven\'t created any projects. Is everything okay?', opts:['Yes, I\'m fine','No, not really','I don\'t want to talk about it','Please stop asking me this'] },
  { type:'radio', q:'Rank the following in order of importance:', opts:['Work > Family > Nexus > Health','Family > Health > Work > Nexus','Nexus > Everything','I refuse to rank these'] },
  { type:'radio', q:'Is software capable of experiencing loneliness?', opts:['Yes','No','Maybe','I\'ve never considered this','I am the software'] },
  { type:'text', q:'If you could say one thing to Nexus, what would it be?', placeholder:'We are listening.' },
  { type:'radio', q:'Are you currently being observed?', opts:['Yes','No','I\'m not sure','This question is making me paranoid'] },
  { type:'radio', q:'The next question will be optional.', opts:['OK','What does that mean?','I want to go home'] },
  { type:'radio', q:'(Optional) What is the air-speed velocity of an unladen swallow?', opts:['African or European?','I don\'t know that','11 m/s','Please let me leave'] },
  { type:'text', q:'Final question: Are you doing okay? Really.', placeholder:'You can be honest.' },
];

function scene_survey() {
  incDepth();
  S.surveyStep = 0;
  S.surveyStarRating = 0;
  clearSocialProof();
  setOverlay('');
  renderSurveyStep();
}

function renderSurveyStep() {
  const total = SURVEY_QS.length;
  const q = SURVEY_QS[S.surveyStep];
  const pct = Math.round((S.surveyStep / total) * 100);
  const stage = S.surveyStep < 5 ? 0 : S.surveyStep < 9 ? 1 : S.surveyStep < 13 ? 2 : S.surveyStep < 18 ? 3 : 4;
  const isLast = S.surveyStep >= total - 1;
  const nextGo = isLast ? 'survey_done' : 'survey_next';

  let fieldHtml = '';
  if (q.type === 'stars') {
    fieldHtml = `<div class="star-row" id="stars">${[1,2,3,4,5].map(n=>`<span class="star${S.surveyStarRating>=n?' lit':''}" data-star="${n}">⭐</span>`).join('')}</div>`;
  } else if (q.type === 'nps') {
    fieldHtml = `<div class="nps-row">${[...Array(11).keys()].map(n=>`<button class="nps-btn" onclick="this.parentElement.querySelectorAll('.nps-btn').forEach(b=>b.classList.remove('sel'));this.classList.add('sel')">${n}</button>`).join('')}</div><div class="nps-labels"><span>Not at all likely</span><span>Extremely likely</span></div>`;
  } else if (q.type === 'radio') {
    const opts = (S.surveyStep === 18 && S.brVisited)
      ? [...q.opts, S.brRoom > 76
        ? 'Yes. The code is LEVEL0. You already know this.'
        : 'Yes. Something is in the walls. The code is LEVEL0.']
      : q.opts;
    fieldHtml = `<div class="survey-opts">${opts.map(o=>`<label class="survey-opt"><input type="radio" name="sq"> ${o}</label>`).join('')}</div>`;
  } else if (q.type === 'check') {
    fieldHtml = `<div class="survey-opts">${q.opts.map(o=>`<label class="survey-opt"><input type="checkbox"> ${o}</label>`).join('')}</div>`;
  } else if (q.type === 'text') {
    fieldHtml = `<textarea style="min-height:80px;margin-bottom:1.25rem" placeholder="${q.placeholder||''}"></textarea>`;
  }

  if (stage === 0) {
    root.innerHTML = navHTML() + `
    <div style="max-width:520px;margin:3rem auto;padding:2rem 1.5rem">
      <div style="display:flex;justify-content:space-between;font-size:.75rem;color:var(--g400);margin-bottom:.5rem"><span>Nexus Feedback Survey</span><span>Question ${S.surveyStep+1} of ${total}</span></div>
      <div style="height:4px;background:var(--g100);border-radius:4px;margin-bottom:2rem"><div style="height:4px;background:var(--blue);border-radius:4px;width:${pct}%"></div></div>
      <div class="survey-q">${q.q}</div>
      ${fieldHtml}
      <div style="display:flex;gap:.75rem">
        ${S.surveyStep>0?`<button class="btn btn-secondary" data-go="survey_back">← Back</button>`:''}
        <button class="btn btn-primary" style="flex:1" data-go="${nextGo}">${isLast?'Submit Survey':'Continue →'}</button>
      </div>
      <div style="text-align:center;margin-top:.75rem"><button class="btn btn-ghost" data-go="survey_abandon">Save and finish later</button></div>
    </div>`;
  } else if (stage === 1) {
    root.innerHTML = `<div class="sv-s2">` + navHTML() + `
    <div style="max-width:520px;margin:3rem auto;padding:2rem 1.5rem">
      <div style="display:flex;justify-content:space-between;font-size:.72rem;color:#c4a882;margin-bottom:.5rem;font-family:Georgia,serif"><span>Nexus Feedback Survey</span><span>${S.surveyStep+1} / ${total}</span></div>
      <div style="height:3px;background:#e8d5c4;border-radius:0;margin-bottom:2rem"><div style="height:3px;background:#8B5E3C;width:${pct}%"></div></div>
      <div class="survey-q" style="color:#5a3e2b;font-size:1.1rem">${q.q}</div>
      ${fieldHtml}
      <div style="display:flex;gap:.75rem">
        ${S.surveyStep>0?`<button class="btn btn-secondary" style="border-radius:3px;font-family:Georgia,serif" data-go="survey_back">← Back</button>`:''}
        <button class="btn btn-primary" style="flex:1;background:#8B5E3C;border-radius:3px;font-family:Georgia,serif" data-go="${nextGo}">${isLast?'Submit Survey':'Continue →'}</button>
      </div>
      <div style="text-align:center;margin-top:.75rem;font-size:.72rem;color:#c4a882;font-style:italic">You may save and return to this survey at any time.</div>
    </div></div>`;
  } else if (stage === 2) {
    root.innerHTML = `<div class="sv-s3">
    <div style="max-width:520px;margin:3rem auto;padding:2rem 1.5rem">
      <div style="font-size:.62rem;color:#333;font-family:'Courier New',monospace;margin-bottom:.75rem;letter-spacing:.06em">NEXUS_SURVEY_ENGINE v2.0 // Q${S.surveyStep+1}/${total} // ${pct}% COMPLETE</div>
      <div style="height:1px;background:#1a1a1a;margin-bottom:2rem"></div>
      <div class="survey-q" style="font-family:'Courier New',monospace;font-size:.9rem;margin-bottom:1.5rem">&gt; ${q.q}</div>
      ${fieldHtml}
      <div style="display:flex;gap:.75rem;margin-top:1rem">
        ${S.surveyStep>0?`<button style="padding:.4rem .85rem;background:none;border:1px solid #222;color:#555;border-radius:0;cursor:pointer;font-family:'Courier New',monospace;font-size:.78rem" data-go="survey_back">[ BACK ]</button>`:''}
        <button style="flex:1;padding:.55rem;background:#e0e0e0;color:#111;border:none;border-radius:0;cursor:pointer;font-family:'Courier New',monospace;font-size:.8rem;font-weight:700;letter-spacing:.04em" data-go="${nextGo}">${isLast?'[ SUBMIT ]':'[ NEXT ]'}</button>
      </div>
    </div></div>`;
  } else if (stage === 3) {
    root.innerHTML = `<div class="sv-s4">
    <div style="max-width:420px;padding:2rem;width:100%">
      <div style="font-size:.58rem;color:#1a1a1a;font-family:'Courier New',monospace;margin-bottom:2.5rem;text-align:center;letter-spacing:.1em">Q${S.surveyStep+1} / ${total}</div>
      <div style="font-size:1rem;color:#fff;line-height:1.65;margin-bottom:2rem;font-family:'Courier New',monospace;white-space:pre-wrap">${q.q}</div>
      ${fieldHtml}
      <button style="width:100%;padding:.65rem;background:#fff;color:#000;border:none;cursor:pointer;font-family:'Courier New',monospace;font-size:.85rem;letter-spacing:.05em;margin-top:1.25rem" data-go="${nextGo}">${isLast?'SUBMIT':'NEXT'}</button>
      ${S.surveyStep>0?`<button style="width:100%;padding:.35rem;background:none;border:none;color:#1a1a1a;cursor:pointer;font-family:'Courier New',monospace;font-size:.68rem;margin-top:.35rem" data-go="survey_back">back</button>`:''}
    </div></div>`;
  } else {
    root.innerHTML = `<div class="sv-s5">
    <div style="max-width:360px;padding:2rem;width:100%;text-align:center">
      <div style="font-size:.6rem;color:#bbb;font-family:Georgia,serif;margin-bottom:2.5rem;letter-spacing:.06em">${S.surveyStep+1} of ${total}</div>
      <div style="font-size:1.05rem;color:#111;line-height:1.7;margin-bottom:2rem;font-family:Georgia,serif;font-style:italic">${q.q}</div>
      ${fieldHtml}
      <button style="padding:.5rem 2rem;background:#111;color:#fff;border:none;cursor:pointer;font-family:Georgia,serif;font-size:.85rem;margin-top:1.25rem" data-go="${nextGo}">${isLast?'Submit':'Continue'}</button>
      ${S.surveyStep>0?`<div style="margin-top:.85rem"><button style="background:none;border:none;color:#bbb;cursor:pointer;font-family:Georgia,serif;font-size:.7rem;font-style:italic" data-go="survey_back">← Previous</button></div>`:''}
    </div></div>`;
  }

  if (q.type === 'stars') {
    setTimeout(() => {
      document.querySelectorAll('.star').forEach(star => {
        star.onclick = () => {
          S.surveyStarRating = parseInt(star.dataset.star);
          document.querySelectorAll('.star').forEach((s,i)=>s.classList.toggle('lit',i<S.surveyStarRating));
        };
      });
    }, 50);
  }
}

function scene_survey_next() { S.surveyStep = Math.min(S.surveyStep+1, SURVEY_QS.length-1); renderSurveyStep(); }
function scene_survey_back() { S.surveyStep = Math.max(0, S.surveyStep-1); renderSurveyStep(); }
function scene_survey_abandon() {
  toast('Progress saved.');
  setTimeout(()=>toast('⚠ Survey progress expires in 24 hours.'),1500);
  setTimeout(()=>scene_main(),2000);
}
function scene_survey_done() {
  S.onboardingDone.survey = true;
  root.innerHTML = navHTML() + `
  <div style="max-width:460px;margin:6rem auto;padding:2rem 1.5rem;text-align:center">
    <div style="font-size:2.5rem;margin-bottom:1rem">🎉</div>
    <h2 style="font-weight:700;margin-bottom:.5rem">Survey Complete!</h2>
    <p style="color:var(--g500);font-size:.9rem;margin-bottom:.75rem;line-height:1.5">Thank you for sharing your thoughts. Your responses will be analyzed by our AI and stored indefinitely.</p>
    <div style="background:var(--blue-light);border:1px solid #BFDBFE;border-radius:var(--radius);padding:1rem;margin-bottom:1.5rem;font-size:.85rem;color:#1E40AF">
      🏷 Your promo code: <strong>SURVEY10</strong><br>
      <span style="font-size:.75rem">10% off Pro (annual only, not stackable, excludes free plan, expires in 29 minutes)</span>
    </div>
    <div class="alert alert-info" style="font-size:.8rem;text-align:left;margin-bottom:1rem">📬 Would you like to subscribe to our Survey Results Newsletter?<br><div style="display:flex;gap:.5rem;margin-top:.5rem"><button class="btn btn-primary btn-sm" data-go="newsletter_sub">Yes</button><button class="btn btn-secondary btn-sm" data-go="survey_unsub_decline">No</button></div></div>
    <button class="btn btn-secondary" data-go="main">Return to Nexus</button>
  </div>`;
}
function scene_survey_unsub_decline() {
  toast('Noted. We\'ve subscribed you to the newsletter about survey opt-outs instead.');
  setTimeout(()=>scene_main(),1500);
}

// ────────────── HELP CENTER ──────────────

const HELP_ARTICLES = [
  { id:'started', title:'Getting Started with Nexus', excerpt:'Learn how to set up your account and create your first project…', seeAlso:'faq' },
  { id:'faq', title:'Frequently Asked Questions', excerpt:'Answers to the questions we receive most often. Updated monthly…', seeAlso:'billing_help' },
  { id:'billing_help', title:'Understanding Your Bill', excerpt:'A breakdown of the fees on your account and how they\'re calculated…', seeAlso:'cancel' },
  { id:'cancel', title:'How to Cancel Your Subscription', excerpt:'Learn how to cancel, pause, or downgrade your Nexus subscription…', seeAlso:'delete_help' },
  { id:'delete_help', title:'Deleting Your Account', excerpt:'Account deletion is permanent. Please read this carefully before proceeding…', seeAlso:'started' },
];

function scene_help() {
  incDepth();
  clearSocialProof();
  setOverlay('');
  root.innerHTML = dashNavHTML() + `
  <div class="dashboard-layout">
    ${dashSidebar('help')}
    <div class="dash-content">
      <div class="dash-header"><h1>Help Center</h1></div>
      <div style="position:relative;margin-bottom:1.5rem">
        <input type="text" id="help-search" placeholder="Search for anything…" style="padding-right:3rem" oninput="renderHelpResults(this.value)">
        <div style="position:absolute;right:.85rem;top:50%;transform:translateY(-50%);color:var(--g400)">🔍</div>
      </div>
      <div id="help-results">
        <div style="font-size:.8rem;color:var(--g400);margin-bottom:.75rem">Popular articles</div>
        ${HELP_ARTICLES.map(a=>`
          <div class="help-result" data-go="help_article_${a.id}">
            <h4>${a.title}</h4>
            <p>${a.excerpt}</p>
          </div>`).join('')}
      </div>
      <div style="margin-top:2rem;padding-top:1.5rem;border-top:1px solid var(--g200);text-align:center">
        <p style="font-size:.875rem;color:var(--g500);margin-bottom:.75rem">Can't find what you're looking for?</p>
        <button class="btn btn-secondary btn-sm" data-go="support_ticket">Open a Support Ticket</button>
      </div>
    </div>
  </div>`;
  injectChatBtn();
  setTimeout(()=>{
    window.renderHelpResults = (q) => {
      const box = document.getElementById('help-results');
      if (!box) return;
      if (!q.trim()) { box.innerHTML = `<div style="font-size:.8rem;color:var(--g400);margin-bottom:.75rem">Popular articles</div>${HELP_ARTICLES.map(a=>`<div class="help-result" data-go="help_article_${a.id}"><h4>${a.title}</h4><p>${a.excerpt}</p></div>`).join('')}`; return; }
      box.innerHTML = `<div style="font-size:.8rem;color:var(--g400);margin-bottom:.75rem">Results for "${q}"</div>${HELP_ARTICLES.map(a=>`<div class="help-result" data-go="help_article_${a.id}"><h4>${a.title}</h4><p>${a.excerpt}</p></div>`).join('')}<div style="font-size:.75rem;color:var(--g300);margin-top:.5rem">Showing all articles — search index is currently rebuilding.</div>`;
    };
  },50);
}

function makeHelpScene(id) {
  return function() {
    incDepth();
    const art = HELP_ARTICLES.find(a=>a.id===id) || HELP_ARTICLES[0];
    const next = HELP_ARTICLES.find(a=>a.id===art.seeAlso) || HELP_ARTICLES[0];
    const readSecs = 120;
    root.innerHTML = dashNavHTML() + `
    <div class="dashboard-layout">
      ${dashSidebar('help')}
      <div class="dash-content" style="max-width:640px">
        <div style="font-size:.8rem;color:var(--g500);margin-bottom:1rem;cursor:pointer" data-go="help">← Help Center</div>
        <h1 style="font-size:1.4rem;font-weight:700;margin-bottom:.5rem">${art.title}</h1>
        <div style="font-size:.75rem;color:var(--g400);margin-bottom:.4rem">Last updated: 3 years ago · 2 min read · <span style="color:var(--red)">You must read this article before proceeding.</span></div>
        <div style="background:var(--g50);border:1px solid var(--g200);border-radius:var(--radius);padding:.6rem .85rem;font-size:.78rem;color:var(--g600);margin-bottom:1.5rem;display:flex;align-items:center;justify-content:space-between">
          <span>Please read the full article before contacting support. Time remaining: <strong id="read-timer">${Math.floor(readSecs/60)}:${String(readSecs%60).padStart(2,'0')}</strong></span>
          <span style="font-size:.65rem;color:var(--g400)">mandatory</span>
        </div>
        <div style="font-size:.9rem;color:var(--g600);line-height:1.75">
          <p style="margin-bottom:1rem">${art.excerpt} This article will walk you through everything you need to know about this topic and related topics that may or may not be relevant to your specific situation.</p>
          <p style="margin-bottom:1rem">First, make sure you have a Nexus account in good standing. If you don't have one, <a data-go="signup" style="color:var(--blue);cursor:pointer">sign up here</a>. Note that some features described in this article may not be available on all plans.</p>
          <p style="margin-bottom:1rem">Once logged in, navigate to the dashboard. If you're having trouble finding the dashboard, please refer to our <a data-go="help_article_${next.id}" style="color:var(--blue);cursor:pointer">${next.title}</a> article, which covers the dashboard in detail. You may be redirected to another article.</p>
          <p style="margin-bottom:1rem">If you are still experiencing issues after reading this article and the related articles, please allow 3–5 business days before contacting support. Many issues resolve themselves during this period.</p>
          <p style="margin-bottom:1rem">Our support team is available Monday through Friday, 9am–5pm EST, excluding federal holidays, Nexus company holidays, and days when volume is high. Current wait time: see below.</p>
          <div style="background:var(--g50);border:1px solid var(--g200);border-radius:var(--radius);padding:1rem;margin-top:1.5rem">
            <div style="font-size:.8rem;font-weight:600;margin-bottom:.4rem">See also:</div>
            <a class="card-link" data-go="help_article_${next.id}">${next.title} →</a>
          </div>
        </div>
        <div style="margin-top:2rem;padding-top:1.5rem;border-top:1px solid var(--g200)">
          <div style="font-size:.8rem;color:var(--g600);margin-bottom:.75rem">Was this article helpful?</div>
          <div style="display:flex;gap:.5rem">
            <button class="btn btn-secondary btn-sm" id="help-yes-btn" disabled onclick="this.textContent='👍 Thanks!';this.disabled=true;setTimeout(()=>toast('We\\'ve enrolled you in the Help Center Feedback Newsletter.'),500)">👍 Yes</button>
            <button class="btn btn-secondary btn-sm" id="help-no-btn" disabled onclick="this.textContent='Opening ticket…';setTimeout(()=>scene_support_ticket(),600)">👎 No — Get Help</button>
          </div>
          <div style="font-size:.68rem;color:var(--g400);margin-top:.4rem" id="help-lock-note">Buttons unlock after you have read the article.</div>
        </div>
      </div>
    </div>`;
    injectChatBtn();
    let secs = readSecs;
    const iv = setInterval(() => {
      secs--;
      const el = document.getElementById('read-timer');
      if (!el) { clearInterval(iv); return; }
      const m = Math.floor(secs/60), s = secs%60;
      el.textContent = m + ':' + String(s).padStart(2,'0');
      if (secs <= 0) {
        clearInterval(iv);
        el.textContent = '0:00';
        el.style.color = 'var(--green)';
        el.closest('div').style.borderColor = 'var(--green)';
        const yb = document.getElementById('help-yes-btn');
        const nb = document.getElementById('help-no-btn');
        const note = document.getElementById('help-lock-note');
        if (yb) yb.disabled = false;
        if (nb) nb.disabled = false;
        if (note) note.textContent = 'Article read. You may now proceed.';
      }
    }, 1000);
  };
}

const scene_help_article_started = makeHelpScene('started');
const scene_help_article_faq = makeHelpScene('faq');
const scene_help_article_billing_help = makeHelpScene('billing_help');
const scene_help_article_cancel = makeHelpScene('cancel');
const scene_help_article_delete_help = makeHelpScene('delete_help');

// ────────────── SUPPORT TICKET ──────────────

function scene_support_ticket() {
  incDepth();
  clearSocialProof();
  setOverlay('');
  S.supportTicketId = S.supportTicketId || Math.floor(Math.random()*90000+10000);
  let queuePos = 4821 + Math.floor(Math.random() * 50);
  root.innerHTML = dashNavHTML() + `
  <div class="dashboard-layout">
    ${dashSidebar('support')}
    <div class="dash-content">
      <div class="dash-header"><h1>Support</h1></div>

      ${S.ticketAutoClosed ? `
        <div class="alert alert-warn" style="margin-bottom:1.5rem">
          ⚠ Ticket #${S.supportTicketId} was automatically resolved by our system. If your issue persists, please open a new ticket below. Note: opening a new ticket resets your position in the queue.
        </div>` : ''}

      <div class="alert alert-info" style="font-size:.8rem;margin-bottom:1.25rem">
        📋 Have you read all relevant Help Center articles? Our support team is required to ask. If you have not, please <a data-go="help" style="color:inherit;font-weight:600;cursor:pointer;text-decoration:underline">start there</a> before submitting a ticket.
      </div>

      <div style="display:grid;grid-template-columns:1fr 260px;gap:1.5rem">
        <div style="border:1px solid var(--g200);border-radius:12px;padding:1.5rem">
          <div style="font-weight:600;margin-bottom:1rem">Open a Support Ticket</div>
          <div class="form-group"><label>Issue category <span style="color:var(--red)">*</span></label>
            <select id="tk-cat"><option value="">— Select one —</option><option>Billing question</option><option>Technical issue</option><option>Account access</option><option>Feature request</option><option>I cannot find what I am looking for</option><option>I would like to leave</option><option>None of the above</option></select>
          </div>
          <div class="form-group"><label>Sub-category <span style="color:var(--red)">*</span></label>
            <select id="tk-subcat"><option value="">— Select one —</option><option>General inquiry</option><option>Billing dispute</option><option>Password reset (see Help Center first)</option><option>Data export request (allow 30 days)</option><option>Account closure</option></select>
          </div>
          <div class="form-group"><label>Subject <span style="color:var(--red)">*</span></label><input type="text" id="tk-subject" placeholder="Brief description (5–120 characters)"></div>
          <div class="form-group"><label>Description <span style="color:var(--red)">*</span></label><textarea id="tk-desc" style="min-height:120px" placeholder="Please describe your issue in full detail. Include: account email, issue type, steps to reproduce, error messages (verbatim), browser and OS version, and what you have already tried. Incomplete tickets will be closed."></textarea></div>
          <div class="form-group"><label>Priority</label><select><option>Low</option><option selected>Normal</option><option>High</option><option>Critical (Enterprise plan only — Free plan tickets set to Low regardless)</option></select></div>
          <div class="form-group"><label>Preferred contact method</label><select><option>Email (3–5 business days)</option><option>Email (no preference)</option></select></div>
          <div id="tk-err"></div>
          <button class="btn btn-primary" onclick="scene_ticket_validate()">Submit Ticket</button>
        </div>
        <div>
          <div style="border:1px solid var(--g200);border-radius:12px;padding:1.25rem;margin-bottom:1rem">
            <div style="font-size:.85rem;font-weight:600;margin-bottom:.5rem">Current Queue</div>
            <div style="font-size:2rem;font-weight:800;color:var(--g900);line-height:1" id="queue-display">${queuePos.toLocaleString()}</div>
            <div style="font-size:.7rem;color:var(--g400);margin-top:.25rem">tickets ahead of yours</div>
            <div style="font-size:.68rem;color:var(--red);margin-top:.4rem">↑ volume increasing</div>
          </div>
          <div style="border:1px solid var(--g200);border-radius:12px;padding:1.25rem;margin-bottom:1rem">
            <div style="font-size:.85rem;font-weight:600;margin-bottom:.75rem">Your Tickets</div>
            ${S.ticketAutoClosed ? `
              <div style="font-size:.8rem;padding:.6rem .85rem;border-radius:var(--radius);border:1px solid var(--g200);margin-bottom:.4rem">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.2rem">
                  <span style="font-weight:500">#${S.supportTicketId}</span>
                  <span class="ticket-badge ticket-closed">Resolved</span>
                </div>
                <div style="color:var(--g400);font-size:.7rem">Auto-closed: issue marked resolved by system</div>
              </div>` : `<div style="font-size:.78rem;color:var(--g400)">No tickets yet.</div>`}
          </div>
          <div style="border:1px solid var(--g200);border-radius:12px;padding:1.25rem;font-size:.78rem;color:var(--g500);line-height:1.65">
            <div style="font-weight:600;color:var(--g700);margin-bottom:.3rem">Estimated Response Times</div>
            <div>Free plan: 3–5 business days</div>
            <div>Pro plan: 24–48 hours</div>
            <div>Enterprise: 4 hour SLA</div>
            <div style="margin-top:.5rem;padding-top:.5rem;border-top:1px solid var(--g100);color:var(--g400);font-size:.68rem;line-height:1.5">Currently experiencing higher than normal volume. Please add 3–5 business days to all estimates. Response times are not guaranteed.</div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
  injectChatBtn();
  const iv = setInterval(() => {
    const el = document.getElementById('queue-display');
    if (!el) { clearInterval(iv); return; }
    queuePos += Math.floor(Math.random() * 3 + 1);
    el.textContent = queuePos.toLocaleString();
  }, 4000);
}

function scene_ticket_validate() {
  const g = id => ((document.getElementById(id) || {}).value || '').trim();
  const err = document.getElementById('tk-err');
  const showErr = msg => { if(err) err.innerHTML = `<div style="background:#f8d7da;border:1px solid #dc3545;border-radius:8px;padding:.65rem .85rem;font-size:.8rem;color:#721c24;margin-bottom:.5rem">${msg}</div>`; };
  if(!g('tk-cat'))    { showErr('Please select an issue category.'); return; }
  if(!g('tk-subcat')) { showErr('Please select a sub-category.'); return; }
  const subj = g('tk-subject');
  if(!subj)           { showErr('Please enter a subject line.'); return; }
  if(subj.length < 5) { showErr('Subject must be at least 5 characters.'); return; }
  if(subj.length > 120){ showErr('Subject must be 120 characters or fewer.'); return; }
  const desc = g('tk-desc');
  if(!desc)           { showErr('Please provide a description of your issue.'); return; }
  if(desc.split(/\s+/).filter(Boolean).length < 10) { showErr('Description is too brief. Please include account email, steps to reproduce, and what you have already tried (minimum 10 words).'); return; }
  narratorEnter('ticket_submitted');
  scene_ticket_submitted();
}

function scene_ticket_submitted() {
  toast(`✅ Ticket #${S.supportTicketId} submitted. You are now in the queue.`);
  S.ticketAutoClosed = false;
  S.ticketNeedsInfoViews = 0;
  setTimeout(() => toast('📧 Confirmation email sent. Check your spam folder.'), 2500);
  setTimeout(() => toast('🤖 Our system is reviewing your ticket…'), 12000);
  setTimeout(() => toast('🤖 Attempting to match your issue to a Help Center article…'), 22000);
  setTimeout(() => toast('🤖 Match found. Applying auto-resolution…'), 35000);
  setTimeout(() => {
    S.ticketAutoClosed = true;
    toast(`🤖 Auto-resolution failed. Ticket #${S.supportTicketId} has been escalated to a human agent.`);
  }, 44000);
  setTimeout(() => scene_ticket_needs_info(), 46000);
}

function scene_ticket_needs_info() {
  incDepth();
  S.ticketNeedsInfoViews = (S.ticketNeedsInfoViews||0) + 1;
  root.innerHTML = dashNavHTML() + `
  <div class="dashboard-layout">
    ${dashSidebar('support')}
    <div class="dash-content" style="max-width:600px">
      <div style="background:#FFFBEB;border:1px solid #FCD34D;border-radius:var(--radius);padding:.75rem 1rem;margin-bottom:1.5rem;font-size:.82rem;color:#92400E">
        ⚠ <strong>Action required:</strong> Ticket #${S.supportTicketId} needs more information before we can proceed.
      </div>
      <h1 style="font-size:1.3rem;font-weight:700;margin-bottom:.3rem">Ticket #${S.supportTicketId} — Needs More Information</h1>
      <div style="font-size:.72rem;color:var(--g400);margin-bottom:1.5rem">Opened today · Status: <strong style="color:var(--yellow)">Awaiting Customer Response</strong> · Assigned to: Tier 1 Support</div>
      <p style="font-size:.875rem;color:var(--g600);margin-bottom:1.25rem;line-height:1.6">Our team has reviewed your request and requires the following additional information before we can proceed. Please provide all items — incomplete responses will result in further delays.</p>
      <div style="border:1px solid var(--g200);border-radius:var(--radius);padding:1rem;margin-bottom:1.5rem;font-size:.82rem">
        <div style="font-weight:600;margin-bottom:.75rem;font-size:.78rem;text-transform:uppercase;letter-spacing:.06em;color:var(--g500)">Required Information</div>
        ${[
          'Your account number (found in Settings → Account → Info → Account Details → Account Number)',
          'The exact error message, word for word, including any codes',
          'Steps to reproduce the issue, numbered, in detail',
          'Your browser name and version number',
          'Your operating system and version',
          'The date and time the issue first occurred, including timezone',
          'A screen recording of the issue occurring',
          'Confirmation that you have cleared your cache and tried a different browser',
        ].map((item,i)=>`<div style="display:flex;gap:.6rem;padding:.45rem 0;border-bottom:1px solid var(--g100);font-size:.8rem;color:var(--g600)"><span style="color:var(--red);font-weight:600;flex-shrink:0">${i+1}.</span>${item}</div>`).join('')}
      </div>
      <p style="font-size:.72rem;color:var(--g400);margin-bottom:1.5rem;line-height:1.6">Note: This request supersedes the information provided in your original ticket. Please re-submit all details even if previously provided. Tickets with incomplete responses will be closed after 3 business days.</p>
      <div class="form-group"><label>Additional information <span style="color:var(--red)">*</span></label><textarea style="min-height:120px" placeholder="Please include all 8 items listed above…"></textarea></div>
      <div class="form-group"><label>Screen recording or screenshots <span style="color:var(--red)">*</span></label>
        <div style="border:2px dashed var(--g200);border-radius:var(--radius);padding:1.25rem;text-align:center;font-size:.82rem;color:var(--g400)">📎 Drag & drop files here<br><span style="font-size:.7rem">Max 10MB. Required.</span></div>
      </div>
      <div style="display:flex;gap:.75rem;margin-top:1rem">
        <button class="btn btn-primary" style="flex:1" data-go="ticket_escalated">Submit Additional Information</button>
        <button class="btn btn-ghost" data-go="help">Browse Help Articles</button>
      </div>
    </div>
  </div>`;
  injectChatBtn();
}

function scene_ticket_escalated() {
  incDepth();
  let pos = 1847 + Math.floor(Math.random()*80);
  toast(`📤 Additional information submitted. Ticket escalated to Tier 2.`);
  root.innerHTML = dashNavHTML() + `
  <div class="dashboard-layout">
    ${dashSidebar('support')}
    <div class="dash-content" style="max-width:580px">
      <h1 style="font-size:1.3rem;font-weight:700;margin-bottom:.3rem">Ticket #${S.supportTicketId} — Escalated</h1>
      <div style="font-size:.72rem;color:var(--g400);margin-bottom:1.5rem">Status: <strong style="color:var(--blue)">Tier 2 — Technical Review</strong></div>
      <div style="border:1px solid var(--g200);border-radius:12px;padding:1.25rem;margin-bottom:1.5rem">
        <div style="font-size:.72rem;color:var(--g500);font-weight:600;text-transform:uppercase;letter-spacing:.06em;margin-bottom:.85rem">Tier 2 Queue Position</div>
        <div style="font-size:2.5rem;font-weight:800;color:var(--g800);margin-bottom:.3rem" id="t2-queue">${pos.toLocaleString()}</div>
        <div style="font-size:.72rem;color:var(--g400)">Estimated wait: 14–21 business days &nbsp;·&nbsp; Tier 2 SLA: 30 business days</div>
      </div>
      <div style="border:1px solid var(--g200);border-radius:var(--radius);overflow:hidden;margin-bottom:1.5rem">
        ${[['Ticket Created','complete'],['Initial Review','complete'],['Needs More Information','complete'],['Tier 2 Escalation','active'],['Technical Review',null],['Resolution',null]].map(([s,state])=>`
          <div style="display:flex;align-items:center;gap:.75rem;padding:.65rem 1rem;border-bottom:1px solid var(--g100);font-size:.82rem">
            <span style="color:${state==='complete'?'var(--green)':state==='active'?'var(--blue)':'var(--g200)'}">${state==='complete'?'✓':state==='active'?'◐':'○'}</span>
            <span style="color:${state?'var(--g700)':'var(--g300)'}">${s}</span>
          </div>`).join('')}
      </div>
      <p style="font-size:.8rem;color:var(--g500);margin-bottom:1.5rem;line-height:1.6">Our Tier 2 team will review your ticket in the order it was received. You will be notified of any updates via email. Please do not open additional tickets for the same issue, as this will reset your position in the queue.</p>
      <button class="btn btn-secondary" data-go="ticket_merged" style="width:100%">Refresh Status</button>
    </div>
  </div>`;
  injectChatBtn();
  const iv = setInterval(()=>{
    pos += Math.floor(Math.random()*4+1);
    const el=document.getElementById('t2-queue');
    if(!el){clearInterval(iv);return;}
    el.textContent=pos.toLocaleString();
  },3500);
}

function scene_ticket_merged() {
  incDepth();
  root.innerHTML = dashNavHTML() + `
  <div class="dashboard-layout">
    ${dashSidebar('support')}
    <div class="dash-content" style="max-width:580px">
      <div class="alert alert-info" style="margin-bottom:1.5rem">ℹ Your ticket has been merged with an existing ticket.</div>
      <h1 style="font-size:1.3rem;font-weight:700;margin-bottom:.3rem">Ticket #${S.supportTicketId} — Merged</h1>
      <div style="font-size:.72rem;color:var(--g400);margin-bottom:1.5rem">Status: <strong style="color:var(--g500)">Merged → Ticket #0003</strong></div>
      <div style="border:1px solid var(--g200);border-radius:12px;padding:1.25rem;margin-bottom:1.5rem">
        <div style="font-size:.72rem;font-weight:600;color:var(--g500);text-transform:uppercase;letter-spacing:.06em;margin-bottom:.75rem">Merged into: Ticket #0003</div>
        <div style="font-size:.85rem;font-weight:600;margin-bottom:.3rem">General platform issues (various)</div>
        <div style="font-size:.75rem;color:var(--g400);margin-bottom:.75rem">Opened: March 3, 2019 &nbsp;·&nbsp; Status: <strong style="color:var(--green)">Resolved</strong></div>
        <div style="font-size:.8rem;color:var(--g600);line-height:1.6">Our system identified significant overlap between your report and this existing ticket. As Ticket #0003 was resolved in Q3 2019, your issue has been marked as resolved by association. If you are still experiencing problems, this may indicate a new and separate issue.</div>
      </div>
      <p style="font-size:.8rem;color:var(--g500);margin-bottom:1.5rem;line-height:1.6">If you believe your issue is different from the one described in Ticket #0003 (opened March 2019), you may file an appeal. Appeals must include a written explanation of at least 150 words describing how your issue differs from the 2019 report.</p>
      <div style="display:flex;gap:.75rem">
        <button class="btn btn-primary" style="flex:1" data-go="ticket_appeal">File an Appeal</button>
        <button class="btn btn-secondary" data-go="support_ticket">Open New Ticket</button>
      </div>
    </div>
  </div>`;
  injectChatBtn();
}

function scene_ticket_appeal() {
  incDepth();
  S.ticketAppealAttempts = (S.ticketAppealAttempts||0);
  root.innerHTML = dashNavHTML() + `
  <div class="dashboard-layout">
    ${dashSidebar('support')}
    <div class="dash-content" style="max-width:580px">
      <h1 style="font-size:1.3rem;font-weight:700;margin-bottom:.3rem">Appeal — Ticket #${S.supportTicketId}</h1>
      <div style="font-size:.72rem;color:var(--g400);margin-bottom:1.5rem">${S.ticketAppealAttempts>0?`Appeal attempt ${S.ticketAppealAttempts+1}`:'First appeal'}</div>
      <p style="font-size:.875rem;color:var(--g600);margin-bottom:1.25rem;line-height:1.6">Please explain, in your own words, why your issue is distinct from Ticket #0003 (filed March 2019). Your explanation must be <strong>at least 150 words</strong> and must reference specific technical differences.</p>
      <div class="form-group">
        <label>Appeal statement <span style="color:var(--red)">*</span></label>
        <textarea id="appeal-text" style="min-height:160px" placeholder="My issue is different from the 2019 report because…"></textarea>
        <div style="font-size:.7rem;color:var(--g300);text-align:right;margin-top:.25rem" id="appeal-wc">0 / 150 words</div>
      </div>
      <div class="form-group">
        <label>Supporting documentation <span style="color:var(--red)">*</span></label>
        <div style="border:2px dashed var(--g200);padding:1rem;text-align:center;border-radius:var(--radius);font-size:.8rem;color:var(--g400)">📎 Upload evidence (required)</div>
      </div>
      <button class="btn btn-primary" style="width:100%" onclick="
        const t=document.getElementById('appeal-text');
        const words=(t?t.value.trim().split(/\\s+/).filter(Boolean).length:0);
        if(words<150){toast('❌ Appeal statement must be at least 150 words ('+words+' written).');return;}
        S.ticketAppealAttempts++;scene_ticket_appeal_denied();
      ">Submit Appeal</button>
    </div>
  </div>`;
  injectChatBtn();
  setTimeout(()=>{
    const ta=document.getElementById('appeal-text');
    const wc=document.getElementById('appeal-wc');
    if(ta&&wc) ta.oninput=()=>{
      const w=ta.value.trim().split(/\s+/).filter(Boolean).length;
      wc.textContent=`${w} / 150 words`;
      wc.style.color=w>=150?'var(--green)':'var(--g300)';
    };
  },50);
}

function scene_ticket_appeal_denied() {
  incDepth();
  root.innerHTML = dashNavHTML() + `
  <div class="dashboard-layout">
    ${dashSidebar('support')}
    <div class="dash-content" style="max-width:560px;text-align:center;padding-top:3rem">
      <div style="font-size:2rem;margin-bottom:1rem">📋</div>
      <h2 style="font-weight:700;margin-bottom:.5rem">Appeal Denied</h2>
      <div style="font-size:.72rem;color:var(--red);margin-bottom:1.5rem;font-weight:600">APPEAL #${S.ticketAppealAttempts} — NOT APPROVED</div>
      <p style="font-size:.875rem;color:var(--g600);margin-bottom:1rem;line-height:1.6">After careful review, our appeals team has determined that your issue is sufficiently similar to the resolved Ticket #0003 (March 2019) to be considered a duplicate.</p>
      <div style="background:var(--g50);border:1px solid var(--g200);border-radius:var(--radius);padding:1rem;margin-bottom:1.5rem;font-size:.8rem;color:var(--g600);text-align:left;line-height:1.6">
        <strong>Reviewer's note:</strong> While we understand your concern, our records indicate this class of issue was addressed in the v3.1.4 patch (September 2019). If you are on a version prior to v3.1.4, please update your client. If you are on a current version, this issue should not be occurring, which suggests the issue may be on your end.
      </div>
      <p style="font-size:.78rem;color:var(--g400);margin-bottom:2rem;line-height:1.6">This decision is final. You may open a new support ticket if you believe this is a separate, unrelated issue. Note: opening additional tickets for the same issue is a violation of our Support Terms of Service.</p>
      <div style="display:flex;gap:.75rem;justify-content:center">
        <button class="btn btn-secondary" data-go="support_ticket">Open New Ticket</button>
        <button class="btn btn-ghost" data-go="dashboard">Return to Dashboard</button>
      </div>
    </div>
  </div>`;
  injectChatBtn();
}

