// ────────────── DELETE ACCOUNT ──────────────

function scene_delete_account() {
  incDepth();
  S.deleteStep = 0;
  renderDeleteStep();
}

function renderDeleteStep() {
  incDepth();
  clearSocialProof();
  setOverlay('');

  const steps = [
    {
      title: 'Are you certain?',
      body: `
        <p>Before we can process your request, we need you to confirm your understanding of what you are about to do.</p>
        <p>Your data will be queued for permanent deletion after <strong>ninety business days</strong>. It cannot be recovered.</p>
        <p style="margin-top:1.5rem">To continue, type <strong style="color:#bbb;letter-spacing:.1em">DELETE</strong> in the field below. The field is case-sensitive.</p>
        <div style="margin-top:1.25rem"><label>Confirmation <span style="color:rgba(255,255,255,.2)">*</span></label><input type="text" id="del-confirm" placeholder="DELETE" style="letter-spacing:.2em;text-align:center"></div>`,
      primary: 'Continue', next: 'del_1'
    },
    {
      title: 'Before you go — a word from Jordan.',
      body: `
        <div style="text-align:center;margin-bottom:1.75rem">
          <div style="width:88px;height:88px;border-radius:50%;background:linear-gradient(135deg,#1a1a1a,#2a2a2a);margin:0 auto 1rem;display:flex;align-items:center;justify-content:center;font-size:2.75rem;filter:grayscale(1) contrast(1.2);border:1px solid rgba(255,255,255,.06)">🧑</div>
          <div style="font-size:.72rem;color:#555;font-style:italic">Jordan P. — Customer Success Manager</div>
          <div style="font-size:.65rem;color:#2a6e2a;margin-top:.2rem">● Available now</div>
        </div>
        <p>Jordan has been assigned to your account since day one. Jordan has read your support tickets. Jordan remembers your first login.</p>
        <p>Jordan would like to speak with you before you leave. Fifteen minutes. No agenda.</p>
        <button style="width:100%;margin:1rem 0 .5rem;padding:.7rem;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.45);border-radius:3px;cursor:pointer;font-family:Georgia,serif;font-size:.85rem;letter-spacing:.02em" data-go="del_schedule">Schedule a call with Jordan</button>
        <div style="margin-top:1.25rem">
          <div style="font-size:.75rem;color:rgba(255,255,255,.3);margin-bottom:.4rem">If you choose not to speak with Jordan, please explain why. <span style="color:rgba(220,80,80,.5)">*</span></div>
          <textarea id="del-decline-reason" style="min-height:80px" placeholder="Please write at least 50 words explaining your decision…"></textarea>
          <div style="font-size:.65rem;color:rgba(255,255,255,.2);text-align:right;margin-top:.2rem" id="del-wordcount">0 / 50 words</div>
        </div>`,
      primary: 'Continue Without Scheduling', next: 'del_2',
      onRender: () => {
        const ta = document.getElementById('del-decline-reason');
        const wc = document.getElementById('del-wordcount');
        if (ta && wc) ta.oninput = () => {
          const words = ta.value.trim().split(/\s+/).filter(Boolean).length;
          wc.textContent = `${words} / 50 words`;
          wc.style.color = words >= 50 ? 'rgba(80,180,80,.6)' : 'rgba(220,80,80,.5)';
        };
      }
    },
    {
      title: 'We would like to make you an offer.',
      body: `
        <p>Stay. Three months free. No conditions beyond those listed below.</p>
        <div style="margin:1.25rem 0;padding:.85rem;border:1px solid rgba(255,255,255,.06);font-size:.72rem;color:#444;line-height:1.8">
          After 3 months, $49/month per user billed annually ($588/year). Card required immediately to confirm intent to accept this free offer. Offer valid once per account. Cannot be combined with other offers. Free period begins today.
        </div>
        <button style="width:100%;padding:.7rem;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.55);border-radius:3px;cursor:pointer;font-family:Georgia,serif;font-size:.9rem" data-go="del_offer_accept">Accept — stay three months free</button>`,
      primary: 'Decline. Continue.', next: 'del_3'
    },
    {
      title: 'This is the last step.',
      body: `
        <p>Please type your full name to confirm you understand this action is permanent and cannot be undone.</p>
        <div style="margin:1.25rem 0"><label>Full name <span style="color:rgba(255,255,255,.2)">*</span></label><input type="text" placeholder="Your full name"></div>
        <div style="border:1px solid rgba(255,255,255,.05);padding:.9rem;font-size:.72rem;color:#3a3a3a;line-height:1.8;max-height:96px;overflow-y:auto">
          I understand that: (1) my data will be permanently deleted after 90 business days; (2) I will lose all unused credits currently held in my account; (3) I will continue to receive transactional communications for up to 18 months post-deletion; (4) billing will continue until the end of my current billing period; (5) this request will be automatically cancelled if not confirmed via email within 24 hours.
        </div>`,
      primary: 'Submit Deletion Request', next: 'del_done'
    },
  ];

  const step = steps[Math.min(S.deleteStep, steps.length-1)];
  root.innerHTML = `
  <div class="del-scene">
    <div class="del-scene-inner">
      <div style="font-size:.62rem;color:#2a2a2a;letter-spacing:.14em;text-transform:uppercase;margin-bottom:.5rem">Account Deletion — ${S.deleteStep+1} of ${steps.length}</div>
      <div style="height:1px;background:rgba(255,255,255,.04);margin-bottom:2.75rem">
        <div style="height:1px;background:rgba(255,255,255,.12);width:${((S.deleteStep+1)/steps.length)*100}%;transition:width .6s ease"></div>
      </div>
      <h1>${step.title}</h1>
      ${step.body}
      <div style="display:flex;gap:.75rem;margin-top:2.25rem">
        ${S.deleteStep > 0
          ? `<button style="padding:.5rem 1rem;background:none;border:1px solid rgba(255,255,255,.07);color:rgba(255,255,255,.2);border-radius:3px;cursor:pointer;font-family:Georgia,serif;font-size:.8rem" data-go="del_back">← Back</button>`
          : `<button style="padding:.5rem 1rem;background:none;border:1px solid rgba(255,255,255,.07);color:rgba(255,255,255,.2);border-radius:3px;cursor:pointer;font-family:Georgia,serif;font-size:.8rem" data-go="account_settings">Cancel</button>`}
        <button style="flex:1;padding:.65rem;background:none;border:1px solid rgba(180,60,60,.3);color:rgba(180,80,80,.7);border-radius:3px;cursor:pointer;font-family:Georgia,serif;font-size:.9rem;letter-spacing:.02em" data-go="${step.next}">${step.primary}</button>
      </div>
    </div>
  </div>`;
  if (step.onRender) setTimeout(step.onRender, 50);
}

function scene_del_1() { S.deleteStep=1; renderDeleteStep(); }
function scene_del_2() {
  const ta = document.getElementById('del-decline-reason');
  if (ta) {
    const words = ta.value.trim().split(/\s+/).filter(Boolean).length;
    if (words < 50) { toast(`❌ Please write at least 50 words explaining why you're declining (${words} written).`); return; }
  }
  S.deleteStep=2; renderDeleteStep();
}
function scene_del_3() { S.deleteStep=3; renderDeleteStep(); }
function scene_del_back() { if(S.deleteStep>0) S.deleteStep--; renderDeleteStep(); }
function scene_del_schedule() {
  setOverlay(`<div class="backdrop" style="background:rgba(0,0,0,.85)"><div style="background:#111;border:1px solid rgba(255,255,255,.06);border-radius:6px;width:min(440px,92vw);padding:2rem;font-family:Georgia,serif">
    <h3 style="font-weight:400;color:#c8c8c8;margin-bottom:.5rem;font-size:1.1rem">Schedule with Jordan</h3>
    <p style="font-size:.82rem;color:#555;margin-bottom:1.25rem;line-height:1.5">Jordan's calendar is currently fully booked. Please select an available slot below.</p>
    <div style="display:flex;flex-direction:column;gap:.35rem;margin-bottom:1.25rem">
      ${['Monday — No availability','Tuesday — No availability','Wednesday — No availability','Thursday — No availability','Friday — No availability','Next week — No availability','Month of May — No availability'].map(d=>`
        <div style="padding:.55rem .85rem;border:1px solid rgba(255,255,255,.04);font-size:.78rem;color:#2a2a2a;font-family:Georgia,serif">${d}</div>`).join('')}
    </div>
    <p style="font-size:.72rem;color:#333;margin-bottom:1rem;line-height:1.6">No availability found. <a style="color:#888;cursor:pointer;text-decoration:underline" data-go="close_overlay">Continue without scheduling</a></p>
    <button style="width:100%;padding:.55rem;background:none;border:1px solid rgba(255,255,255,.07);color:rgba(255,255,255,.25);border-radius:3px;cursor:pointer;font-family:Georgia,serif;font-size:.82rem" data-go="close_overlay">Close</button>
  </div></div>`);
}
function scene_del_offer_accept() { toast('🎉 3 months of Pro activated! Deletion cancelled.'); setTimeout(()=>scene_dashboard(),800); }
function scene_del_done() {
  S.delConfirmAttempts = 0;
  root.innerHTML = `
  <div class="del-scene-done">
    <div class="del-scene-done-inner">
      <h2>Request received.</h2>
      <p>Your account is scheduled for deletion in 90 business days.</p>
      <p>We've sent a confirmation email. <strong style="color:#888">You must confirm within 5 minutes</strong> or this request will be automatically cancelled.</p>
      <div style="margin-top:2rem">
        <button style="padding:.65rem 2rem;background:none;border:1px solid rgba(180,60,60,.3);color:rgba(180,80,80,.7);border-radius:3px;cursor:pointer;font-family:Georgia,serif;font-size:.9rem;letter-spacing:.02em" data-go="del_email_confirm">I've confirmed the email →</button>
      </div>
      <div style="margin-top:1rem">
        <button style="padding:.35rem 1rem;background:none;border:none;color:#2a2a2a;cursor:pointer;font-family:Georgia,serif;font-size:.68rem;text-decoration:underline" data-go="del_cancel_request">Cancel this request</button>
      </div>
    </div>
  </div>`;
}

function scene_del_email_confirm() {
  incDepth();
  S.delConfirmAttempts = (S.delConfirmAttempts || 0) + 1;
  if (S.delConfirmAttempts > 3) { scene_del_jordan_ring(); return; }
  let secs = 299;
  root.innerHTML = `
  <div class="del-scene">
    <div class="del-scene-inner">
      <h1>That link has expired.</h1>
      <p style="margin-bottom:1.5rem">Confirmation links are valid for 5 minutes. We've sent a new one to the address on file.</p>
      <div style="background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.05);border-radius:3px;padding:1.1rem;font-size:.75rem;color:#3a3a3a;font-family:'Courier New',monospace;line-height:1.9;margin-bottom:1.5rem">
        From: noreply@nexus.io<br>
        To: u*****@*****.com<br>
        Subject: [Attempt ${S.delConfirmAttempts} of 3] Confirm Account Deletion<br>
        <br>
        Click <span style="color:rgba(255,255,255,.15);text-decoration:underline;cursor:default">this link</span> to confirm. Link expires in: <strong id="del-link-timer" style="color:rgba(200,100,100,.6)">4:59</strong>
      </div>
      ${S.delConfirmAttempts >= 3 ? `<p style="font-size:.78rem;color:rgba(180,60,60,.5);line-height:1.6;margin-bottom:1.5rem">This is your final attempt. After this, your request will require manual review and a member of our team will contact you.</p>` : ''}
      <div style="display:flex;flex-direction:column;gap:.5rem">
        <button style="padding:.65rem;background:none;border:1px solid rgba(180,60,60,.3);color:rgba(180,80,80,.7);border-radius:3px;cursor:pointer;font-family:Georgia,serif;font-size:.9rem" data-go="del_email_confirm">I confirmed the email →</button>
        <button style="padding:.35rem;background:none;border:none;color:#2a2a2a;cursor:pointer;font-family:Georgia,serif;font-size:.7rem;text-decoration:underline" data-go="dashboard">Continue using Nexus instead</button>
      </div>
    </div>
  </div>`;
  const iv = setInterval(() => {
    secs--;
    const el = document.getElementById('del-link-timer');
    if (!el) { clearInterval(iv); return; }
    if (secs <= 0) { clearInterval(iv); el.textContent = 'EXPIRED'; el.style.color='rgba(220,50,50,.9)'; return; }
    el.textContent = `${Math.floor(secs/60)}:${String(secs%60).padStart(2,'0')}`;
  }, 1000);
}

function scene_del_jordan_ring() {
  incDepth();
  S.delCallStep = 0;
  root.innerHTML = `
  <div class="del-scene" style="display:flex;align-items:center;justify-content:center;min-height:100vh">
    <div style="text-align:center;font-family:Georgia,serif">
      <div style="width:120px;height:120px;border-radius:50%;background:linear-gradient(135deg,#111,#222);margin:0 auto 1.5rem;display:flex;align-items:center;justify-content:center;font-size:3.5rem;filter:grayscale(1);border:2px solid rgba(255,255,255,.06);animation:ring-pulse-red 1.5s ease-in-out infinite">🧑</div>
      <div style="font-size:1rem;color:#666;margin-bottom:.3rem;letter-spacing:.04em">Jordan P.</div>
      <div style="font-size:.72rem;color:#333;margin-bottom:.25rem">Customer Success Manager</div>
      <div style="font-size:.68rem;color:#444;letter-spacing:.1em;margin-bottom:3rem">INCOMING CALL</div>
      <div style="display:flex;gap:4rem;justify-content:center">
        <div>
          <button style="width:68px;height:68px;border-radius:50%;background:#8a1a1a;border:none;color:#fff;font-size:1.4rem;cursor:pointer" data-go="del_call_decline">✕</button>
          <div style="font-size:.62rem;color:#3a3a3a;margin-top:.5rem">Decline</div>
        </div>
        <div>
          <button style="width:68px;height:68px;border-radius:50%;background:#1a5e1a;border:none;color:#fff;font-size:1.4rem;cursor:pointer;animation:ring-pulse 1.5s ease-in-out infinite" data-go="del_call">📞</button>
          <div style="font-size:.62rem;color:#3a3a3a;margin-top:.5rem">Answer</div>
        </div>
      </div>
    </div>
  </div>`;
}

const DEL_CALL_SCRIPT = [
  { from:'Jordan', text:'Hi — this is Jordan from Nexus Customer Success. I saw your deletion request come through and wanted to give you a quick call. Is now a good time?' },
  { from:'you', opts:['Yes, that\'s fine.','Not really.','Please just process the request.'] },
  { from:'Jordan', text:'I completely understand, and I respect your decision. I just want to make sure this isn\'t a mistake — can I ask what\'s driving it?' },
  { from:'you', opts:['It\'s too expensive.','I found something better.','I just want my account deleted.','I\'ve already answered this twice.'] },
  { from:'Jordan', text:'That\'s really helpful. I actually have some flexibility on pricing. What if we did six months at 40% off — that\'s about $29 a month.' },
  { from:'you', opts:['No thank you.','Please. Just delete my account.','I am not interested in pricing.'] },
  { from:'Jordan', text:'Of course. I\'ll note that in your file. One more thing — is there anything specific that wasn\'t working? Your feedback really does reach the product team.' },
  { from:'you', opts:['Everything.','I don\'t want to give feedback.','Please. Delete. My. Account.','Are you going to process this or not?'] },
  { from:'Jordan', text:'Absolutely. I\'ll get that submitted right now. Just one moment…' },
  { from:'Jordan', text:'…', _delay:2500 },
  { from:'Jordan', text:'I\'m so sorry — I actually need to transfer you to our Account Closure team. They handle the technical side of deletions. Let me get them on.' },
  { from:'you', opts:['You said you\'d process it.','How long will this take?','Fine.'] },
  { from:'hold', text:'♪  you are now on hold  ♪', _delay:6000 },
  { from:'Brad', role:'Senior Retention Specialist', text:'Hi there — Brad here. I\'m the last stop before this goes to our Deletion Review Committee. Just a couple of quick questions.' },
  { from:'you', opts:['I\'m done answering questions.','Fine. How many?','Please just submit the request.'] },
  { from:'Brad', role:'Senior Retention Specialist', text:'First — on a scale of 1 to 10, how likely would you be to return to Nexus if we addressed your main concern?' },
  { from:'you', opts:['Zero.','One.','This is irrelevant.','Please stop.'] },
  { from:'Brad', role:'Senior Retention Specialist', text:'Noted. And we\'re required to confirm — you understand your data, once purged, is gone? This includes all projects, files, and 847 unread notifications.' },
  { from:'you', opts:['Yes. I understand. Please proceed.','I\'ve said this multiple times.','DELETE. MY. ACCOUNT.'] },
  { from:'Brad', role:'Senior Retention Specialist', text:'Perfect. I\'ve logged your request with the Deletion Review Committee. You\'ll receive a decision within 67 to 90 business days. Is there anything else I can help you with today?' },
  { from:'you', opts:['No.','Goodbye.','...'] },
  { from:'end' },
];

function scene_del_call_decline() {
  incDepth();
  root.innerHTML = `
  <div class="del-scene">
    <div class="del-scene-inner" style="text-align:center">
      <div style="font-size:2rem;margin-bottom:1.5rem;opacity:.4">📵</div>
      <h1 style="font-size:1.25rem">Call declined.</h1>
      <p style="margin-top:1rem">Jordan has logged that you declined to speak with Customer Success. This has been added to your account record.</p>
      <p style="margin-top:1rem">Your request has been forwarded to the Deletion Review Committee. You will receive a decision in 67–90 business days.</p>
      <div style="margin-top:2.5rem">
        <button style="padding:.65rem 2rem;background:none;border:1px solid rgba(255,255,255,.07);color:rgba(255,255,255,.25);border-radius:3px;cursor:pointer;font-family:Georgia,serif;font-size:.82rem" data-go="del_committee">View request status →</button>
      </div>
    </div>
  </div>`;
}

function scene_del_call() {
  incDepth();
  S.delCallStep = 0;
  renderDelCallStep();
}

window.delCallChoose = function(idx) {
  const step = DEL_CALL_SCRIPT[S.delCallStep];
  if (step && step.opts) step._chosen = step.opts[idx];
  S.delCallStep++;
  renderDelCallStep();
};
window.delCallNext = function() {
  S.delCallStep++;
  renderDelCallStep();
};

function renderDelCallStep() {
  const step = DEL_CALL_SCRIPT[S.delCallStep];
  if (!step || step.from === 'end') { scene_del_committee(); return; }

  const past = DEL_CALL_SCRIPT.slice(0, S.delCallStep);
  const transcriptHTML = past.map(s => {
    if (s.from === 'hold') return `<div style="text-align:center;padding:1rem;color:#2a2a2a;font-style:italic;font-family:Georgia,serif;font-size:.8rem;letter-spacing:.08em">${s.text}</div>`;
    if (s.from === 'you') return `<div style="text-align:right;margin-bottom:.85rem"><div style="display:inline-block;background:rgba(255,255,255,.07);border-radius:12px 12px 0 12px;padding:.5rem .8rem;font-size:.8rem;color:#777;max-width:78%;text-align:left">${s._chosen || ''}</div></div>`;
    if (s.from === 'end') return '';
    const label = s.role ? `${s.from} — ${s.role}` : s.from;
    return `<div style="margin-bottom:.85rem"><div style="font-size:.58rem;color:#2a2a2a;letter-spacing:.08em;margin-bottom:.2rem">${label.toUpperCase()}</div><div style="display:inline-block;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.05);border-radius:0 12px 12px 12px;padding:.5rem .8rem;font-size:.8rem;color:#555;max-width:78%;font-style:${s.from==='hold'?'italic':'normal'}">${s.text}</div></div>`;
  }).join('');

  let currentHTML = '';
  if (step.from === 'you') {
    currentHTML = `<div style="display:flex;flex-direction:column;gap:.45rem;align-items:flex-end;margin-top:.75rem">${step.opts.map((o,i)=>`<button style="padding:.45rem .9rem;background:none;border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.35);border-radius:12px 12px 0 12px;cursor:pointer;font-family:Georgia,serif;font-size:.78rem;text-align:right" onclick="delCallChoose(${i})">${o}</button>`).join('')}</div>`;
  } else if (step.from === 'hold') {
    currentHTML = `<div style="text-align:center;padding:1.5rem;color:#2a2a2a;font-style:italic;font-family:Georgia,serif;letter-spacing:.08em">${step.text}</div>`;
    setTimeout(() => { S.delCallStep++; renderDelCallStep(); }, step._delay || 5000);
  } else {
    const label = step.role ? `${step.from} — ${step.role}` : step.from;
    currentHTML = `<div style="margin-bottom:.85rem"><div style="font-size:.58rem;color:#2a2a2a;letter-spacing:.08em;margin-bottom:.2rem">${label.toUpperCase()}</div><div style="display:inline-block;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.05);border-radius:0 12px 12px 12px;padding:.5rem .8rem;font-size:.8rem;color:#555;max-width:78%">${step.text}</div></div>
    <div style="text-align:right;margin-top:.5rem"><button style="padding:.4rem 1.1rem;background:none;border:1px solid rgba(255,255,255,.07);color:rgba(255,255,255,.2);border-radius:3px;cursor:pointer;font-family:Georgia,serif;font-size:.75rem" onclick="delCallNext()">…</button></div>`;
    if (step._delay) setTimeout(() => { S.delCallStep++; renderDelCallStep(); }, step._delay);
  }

  const callerName = DEL_CALL_SCRIPT.slice(0, S.delCallStep+1).find(s=>s.from==='Brad') ? 'Brad — Senior Retention Specialist' : 'Jordan P. — Customer Success';
  root.innerHTML = `
  <div class="del-scene">
    <div style="max-width:520px;margin:0 auto;padding:2rem 1.5rem;min-height:100vh;display:flex;flex-direction:column">
      <div style="display:flex;align-items:center;gap:.75rem;padding-bottom:1rem;border-bottom:1px solid rgba(255,255,255,.04);margin-bottom:1.25rem;flex-shrink:0">
        <div style="width:38px;height:38px;border-radius:50%;background:#111;display:flex;align-items:center;justify-content:center;font-size:1.1rem;filter:grayscale(1)">🧑</div>
        <div>
          <div style="font-size:.82rem;color:#555;font-family:Georgia,serif">${callerName}</div>
          <div style="font-size:.6rem;color:#1e6e1e;letter-spacing:.04em">● Call in progress</div>
        </div>
      </div>
      <div style="flex:1;overflow-y:auto;padding-right:.25rem" id="del-call-box">
        ${transcriptHTML}${currentHTML}
      </div>
    </div>
  </div>`;
  setTimeout(()=>{ const b=document.getElementById('del-call-box'); if(b) b.scrollTop=b.scrollHeight; },40);
}

function scene_del_committee() {
  incDepth();
  S.delCommitteeChecks = (S.delCommitteeChecks||0);
  const pct = Math.min(11 + S.delCommitteeChecks * 2, 23);
  const statuses = [
    ['Request Logged','complete'],['Identity Verification','complete'],
    ['Initial Review','active','In queue — 847 requests ahead of yours'],
    ['Committee Evaluation',null],['Legal Hold Check',null],
    ['Data Retention Assessment',null],['Senior Approval',null],
    ['Deletion Scheduled',null],['Account Closed',null],
  ];
  root.innerHTML = `
  <div class="del-scene">
    <div class="del-scene-inner">
      <h1 style="font-size:1.15rem">Deletion Request Status</h1>
      <div style="font-size:.68rem;color:#333;letter-spacing:.06em;margin-bottom:2rem">REQ-DEL-${(S.supportTicketId||'47291')} &nbsp;·&nbsp; Submitted today &nbsp;·&nbsp; Last updated: just now</div>
      <div style="height:2px;background:rgba(255,255,255,.04);border-radius:1px;margin-bottom:.4rem"><div style="height:2px;background:rgba(180,60,60,.4);border-radius:1px;width:${pct}%;transition:width .8s ease"></div></div>
      <div style="font-size:.62rem;color:#333;margin-bottom:2rem">${pct}% complete &nbsp;·&nbsp; Estimated: 67–90 business days remaining</div>
      <div style="display:flex;flex-direction:column;gap:0;margin-bottom:2rem">
        ${statuses.map(([label,state,note])=>`
          <div style="display:flex;align-items:flex-start;gap:.85rem;padding:.65rem 0;border-bottom:1px solid rgba(255,255,255,.03)">
            <div style="width:16px;height:16px;border-radius:50%;margin-top:.1rem;flex-shrink:0;border:1px solid ${state==='complete'?'rgba(80,180,80,.4)':state==='active'?'rgba(200,150,50,.4)':'rgba(255,255,255,.06)'};display:flex;align-items:center;justify-content:center;font-size:.55rem;color:${state==='complete'?'rgba(100,210,100,.7)':state==='active'?'rgba(220,170,60,.8)':'#1a1a1a'}">${state==='complete'?'✓':state==='active'?'◐':''}</div>
            <div>
              <div style="font-size:.78rem;color:${state==='complete'?'#444':state==='active'?'#666':'#222'}">${label}</div>
              ${note?`<div style="font-size:.63rem;color:#2a2a2a;margin-top:.15rem">${note}</div>`:''}
            </div>
          </div>`).join('')}
      </div>
      ${S.delCommitteeChecks >= 4 ? `<div style="padding:.85rem;border:1px solid rgba(180,60,60,.12);border-radius:3px;font-size:.72rem;color:rgba(160,60,60,.5);line-height:1.7;margin-bottom:1.25rem">⚠ We've detected continued activity on your account during the deletion review window. Repeated logins may signal that you still require your account. Your request has been flagged for re-evaluation by a senior reviewer.</div>` : ''}
      ${S.delCommitteeChecks >= 7 ? `<div style="padding:.85rem;border:1px solid rgba(180,60,60,.2);border-radius:3px;font-size:.72rem;color:rgba(180,60,60,.6);line-height:1.7;margin-bottom:1.25rem">🚫 Due to excessive account activity during the deletion review period, your request has been automatically cancelled. Please submit a new request if you still wish to delete your account.</div>` : ''}
      <div style="display:flex;gap:.75rem">
        ${S.delCommitteeChecks < 7
          ? `<button style="flex:1;padding:.6rem;background:none;border:1px solid rgba(255,255,255,.06);color:rgba(255,255,255,.2);border-radius:3px;cursor:pointer;font-family:Georgia,serif;font-size:.8rem" onclick="S.delCommitteeChecks++;scene_del_committee()">Refresh Status</button>`
          : `<button style="flex:1;padding:.6rem;background:none;border:1px solid rgba(180,60,60,.3);color:rgba(180,80,80,.6);border-radius:3px;cursor:pointer;font-family:Georgia,serif;font-size:.8rem" data-go="delete_account">Submit New Request</button>`}
        <button style="padding:.6rem 1rem;background:none;border:1px solid rgba(255,255,255,.04);color:#2a2a2a;border-radius:3px;cursor:pointer;font-family:Georgia,serif;font-size:.78rem" data-go="dashboard">Return to Dashboard</button>
      </div>
    </div>
  </div>`;
}

function scene_del_cancel_request() {
  toast('✅ Deletion request cancelled. Welcome back!');
  setTimeout(() => toast('🎉 We\'ve enrolled you in our Winback Program. Expect an email.'), 1500);
  setTimeout(() => scene_dashboard(), 2000);
}

