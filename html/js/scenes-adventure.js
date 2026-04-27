// ────────────── ADVENTURE GAME ──────────────

const ADV_ITEMS = {
  keycard: { icon: '🪪', label: 'Temp Keycard' },
  badge:   { icon: '🎫', label: 'Employee Badge' },
};
function advHas(id) { return S.advInventory.includes(id); }
function advGive(id) { if (!advHas(id)) S.advInventory.push(id); }

function advInvHTML() {
  return `<div class="adv-inv">
    <span class="adv-inv-label">Inventory</span>
    ${S.advInventory.length === 0
      ? '<span style="font-size:.75rem;color:#2a1a4a;font-style:italic">—</span>'
      : S.advInventory.map(id => {
          const it = ADV_ITEMS[id] || { icon: '❓', label: id };
          return `<div class="adv-item">${it.icon} ${it.label}</div>`;
        }).join('')}
  </div>`;
}

function advShell(room, artHtml, descHtml, actionsHtml) {
  return `<div class="adv-wrap"><div class="adv-shell">
    <div class="adv-header">
      <span class="adv-title">Nexus Interactive Experience™</span>
      <span style="flex:1;height:1px;background:#1a1035"></span>
      <button class="adv-btn" data-go="main" style="font-size:.65rem;padding:.2rem .5rem;border-radius:2px">✕ Quit</button>
    </div>
    <div class="adv-box">
      <div class="adv-art">${artHtml}</div>
      <div class="adv-text">${descHtml}</div>
      <div class="adv-actions">${actionsHtml}</div>
      ${advInvHTML()}
      <div class="adv-room-name">${room}</div>
    </div>
  </div></div>`;
}

function scene_adv_intro() {
  S.inAdventure = true;
  S.advInventory = [];
  clearSocialProof();
  clearTimeout(S._mobileTimer);
  root.innerHTML = `<div class="adv-wrap" style="display:flex;align-items:center;justify-content:center;min-height:100vh">
    <div style="max-width:480px;text-align:center;padding:2rem">
      <div style="font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:#6644cc;margin-bottom:1.5rem">Nexus Technologies Inc.</div>
      <h1 style="font-size:2rem;font-weight:700;letter-spacing:-.02em;margin-bottom:1rem;color:#e0d8ff">The Nexus<br>Experience™</h1>
      <p style="font-size:.9rem;line-height:1.7;color:#7766aa;margin-bottom:.75rem">An Interactive Product Tour</p>
      <p style="font-size:.8rem;line-height:1.7;color:#4a3a6a;margin-bottom:2.5rem;max-width:340px;margin-left:auto;margin-right:auto">Day 1. You are a new employee at Nexus HQ. Your desk is on Floor 2. The building is completely empty. You are going to be fine.</p>
      <button class="adv-btn adv-primary" data-go="adv_lobby" style="font-size:1rem;padding:.7rem 2.5rem">Begin Tour →</button>
      <div style="margin-top:1.75rem;font-size:.62rem;color:#2a1a4a">Module 1 of 47 · Point-and-Click Adventure · Est. 5 min</div>
    </div>
  </div>`;
  setOverlay('');
}

function scene_adv_lobby() {
  incDepth();
  const art = `<div style="position:absolute;inset:0;background:linear-gradient(to bottom,#1a0f2e 0%,#120a22 56%,#1a1008 56%,#0f0b05 100%)">
    <div style="position:absolute;bottom:0;left:50px;width:175px;height:52px;background:#2e1e0e;border-top:3px solid #5a3a1a;border-radius:3px 3px 0 0">
      <div style="position:absolute;top:7px;left:9px;font-size:.52rem;color:#7a6040;font-family:monospace">BACK IN 5 MIN</div>
      ${advHas('keycard') ? '' : '<div style="position:absolute;top:-11px;right:12px;font-size:1rem;filter:drop-shadow(0 0 4px #aa8844)">🪪</div>'}
    </div>
    <div style="position:absolute;bottom:0;right:60px;width:80px;height:92px;display:flex;gap:4px">
      <div style="flex:1;background:#1e1e38;border:2px solid #38385e;border-bottom:none;border-radius:2px 2px 0 0;display:flex;align-items:flex-start;justify-content:center;padding-top:10px"><div style="font-size:.55rem;color:#38385e">▲</div></div>
      <div style="flex:1;background:#1e1e38;border:2px solid #38385e;border-bottom:none;border-radius:2px 2px 0 0;display:flex;align-items:flex-start;justify-content:center;padding-top:10px"><div style="font-size:.55rem;color:#38385e">▼</div></div>
    </div>
    <div style="position:absolute;bottom:0;left:15px;font-size:1.5rem;filter:saturate(.5)">🪴</div>
    <div style="position:absolute;top:20px;left:50%;transform:translateX(-50%);width:82px;height:52px;background:#1e1040;border:2px solid #4433aa;display:flex;align-items:center;justify-content:center;text-align:center">
      <div style="font-size:.37rem;color:#7766bb;line-height:1.55;padding:3px">TEAMWORK<br>MAKES THE<br>DREAM WORK</div>
    </div>
    <div style="position:absolute;bottom:0;left:235px;width:38px;height:66px;background:#140e28;border:1px solid #28205a;border-bottom:none">
      <div style="font-size:.37rem;color:#38305a;text-align:center;margin-top:22px;line-height:1.4;letter-spacing:.04em">STAIRS</div>
    </div>
  </div>`;
  const desc = advHas('keycard')
    ? `The lobby. Reception desk still unmanned. <span style="color:#6655aa;font-size:.8rem">You have the temp keycard.</span>`
    : `The Nexus HQ lobby. Marble floors. The kind of marble that says <em>we have money</em> while the AC's been broken since Q3. The reception desk is unmanned. A plastic plant stands near the entrance.`;
  const actions = `${!advHas('keycard') ? `<button class="adv-btn adv-primary" data-go="adv_take_keycard">Take keycard from desk</button>` : ''}
    <button class="adv-btn" data-go="adv_examine_poster">Look at poster</button>
    <button class="adv-btn" data-go="adv_try_elevator">Try elevator</button>
    <button class="adv-btn" data-go="adv_try_stairs">Go to stairwell</button>
    <button class="adv-btn" data-go="adv_breakroom">Go to break room →</button>`;
  root.innerHTML = advShell('NEXUS HQ — LOBBY · Ground Floor', art, desc, actions);
  setOverlay('');
}

function scene_adv_take_keycard() {
  advGive('keycard');
  toast('You pick up the temp keycard. Small print: "Floor 1 Access Only."');
  scene_adv_lobby();
}

function scene_adv_examine_poster() {
  toast('"TEAMWORK MAKES THE DREAM WORK — Nexus Corp, 2019." Below it in small text: "(Dream not guaranteed. Work scope defined in addendum 7C.)"');
  setTimeout(() => scene_adv_lobby(), 80);
}

function scene_adv_try_elevator() {
  if (!advHas('keycard')) {
    toast('The elevator panel glows faintly. A keycard reader blinks red.');
    setTimeout(() => scene_adv_lobby(), 80);
    return;
  }
  incDepth();
  root.innerHTML = advShell('NEXUS HQ — ELEVATOR',
    `<div style="position:absolute;inset:0;background:#08060e;display:flex;align-items:center;justify-content:center">
      <div style="width:110px;background:#120e28;border:2px solid #38286e;border-radius:3px;padding:1rem;text-align:center">
        <div style="font-size:.55rem;color:#4a3a7a;font-family:monospace;margin-bottom:.6rem;letter-spacing:.05em">NEXUS ELEVATOR CO.</div>
        <div style="font-size:1.6rem;margin-bottom:.6rem">🛗</div>
        <div style="font-size:.48rem;color:#cc6040;font-family:monospace;line-height:1.6">OUT OF SERVICE<br>MAINT. EXP: Q4<br><span style="color:#5a4040">(Posted Q2)</span></div>
      </div>
    </div>`,
    `You swipe the keycard. The elevator display blinks: <strong>OUT OF SERVICE — Maintenance expected Q4.</strong><br><br>A sticky note on the door: <em>"Q4 refers to last year's Q4."</em>`,
    `<button class="adv-btn adv-primary" data-go="adv_lobby">← Back to lobby</button>`
  );
  setOverlay('');
}

function scene_adv_try_stairs() {
  incDepth();
  const firstVisit = !advHas('badge') && S.depth < 12;
  root.innerHTML = advShell('NEXUS HQ — STAIRWELL',
    `<div style="position:absolute;inset:0;background:#050308;overflow:hidden">
      ${[0,1,2,3,4,5].map(i=>`<div style="position:absolute;left:${12+i*9}px;right:${12+i*9}px;bottom:${i*24}px;height:8px;background:#120e22;border-top:2px solid #22185a"></div>`).join('')}
      <div style="position:absolute;top:18px;right:28px;font-size:.48rem;color:#24184a;font-family:monospace">FLOOR 2 ↑</div>
      <div style="position:absolute;bottom:6px;left:28px;font-size:.48rem;color:#24184a;font-family:monospace">FLOOR 1 ↓</div>
    </div>`,
    `The stairwell. Very dark. Smells like toner and old carpet.<br><br>${firstVisit ? "You try the door handle. It isn't locked. <em>It was never locked.</em><br><br>You assumed it needed a keycard. Most people do." : 'Stairs. They connect Floor 1 and Floor 2. Exactly what stairs do.'}`,
    `<button class="adv-btn adv-primary" data-go="adv_floor2">Climb to Floor 2 →</button>
    <button class="adv-btn" data-go="adv_lobby">← Back to lobby</button>`
  );
  setOverlay('');
}

function scene_adv_breakroom() {
  incDepth();
  const art = `<div style="position:absolute;inset:0;background:linear-gradient(to bottom,#081a10 0%,#06100a 56%,#0e1408 56%,#090e05 100%)">
    <div style="position:absolute;top:14px;left:50%;transform:translateX(-50%);width:132px;height:68px;background:#d8d0b8;border:3px solid #8a7a6a;border-radius:2px">
      <div style="font-size:.34rem;color:#1a1a1a;padding:4px 5px;line-height:1.55;font-family:sans-serif">
        Q3 GOALS<br>• Align on alignment<br>• Leverage our leverage<br>• Circle back on circling back<br><span style="color:#aa2222;font-size:.32rem">exit code = badge last 4 digits</span>
      </div>
    </div>
    <div style="position:absolute;bottom:0;right:48px;width:46px;height:76px;background:#1a2a1a;border:2px solid #283828;border-radius:3px 3px 0 0">
      <div style="width:20px;height:12px;background:#081408;border:1px solid #344a34;border-radius:2px;margin:8px auto 0"></div>
      <div style="font-size:.4rem;color:#344a34;text-align:center;margin-top:8px;line-height:1.5">☕<br>OUT OF<br>ORDER</div>
    </div>
    <div style="position:absolute;bottom:0;left:48px;width:50px;height:86px;background:#1a2e2e;border:2px solid #284444;border-radius:3px 3px 0 0">
      <div style="height:42px;border-bottom:1px solid #284444;display:flex;align-items:center;justify-content:center;font-size:.42rem;color:#385858">▤</div>
      ${advHas('badge') ? '' : '<div style="font-size:.6rem;text-align:center;margin-top:8px;filter:drop-shadow(0 0 3px #44aaaa)">🎫</div>'}
    </div>
  </div>`;
  const desc = `The break room. The coffee machine has been <em>out of order</em> since Q2. The whiteboard is dense with OKRs nobody achieved. The fridge hums ominously.${advHas('badge') ? ' <span style="color:#6655aa;font-size:.8rem">You have your employee badge.</span>' : ''}`;
  const actions = `<button class="adv-btn" data-go="adv_examine_coffee">Examine coffee machine</button>
    <button class="adv-btn${advHas('badge') ? '' : ' adv-primary'}" data-go="adv_examine_whiteboard">Read whiteboard</button>
    <button class="adv-btn${advHas('badge') ? '' : ' adv-primary'}" data-go="adv_examine_fridge">Open fridge</button>
    <button class="adv-btn" data-go="adv_lobby">← Back to lobby</button>`;
  root.innerHTML = advShell('NEXUS HQ — BREAK ROOM · Ground Floor', art, desc, actions);
  setOverlay('');
}

function scene_adv_examine_coffee() {
  toast('Out of order since Q2. Sticky note: "Submit ticket at help.nexus.internal (requires VPN). VPN requires onboarding. Onboarding requires desk. Desk requires onboarding." The ink traces a circle.');
  setTimeout(() => scene_adv_breakroom(), 80);
}

function scene_adv_examine_whiteboard() {
  incDepth();
  root.innerHTML = advShell('NEXUS HQ — BREAK ROOM (WHITEBOARD)',
    `<div style="position:absolute;inset:0;background:#ccc8b0;display:flex;align-items:center;justify-content:center">
      <div style="max-width:320px;padding:1.25rem;font-family:sans-serif;width:100%">
        <div style="font-size:.72rem;font-weight:700;color:#1a1a1a;margin-bottom:.6rem;text-align:center;border-bottom:1px solid #9a8a7a;padding-bottom:.4rem">SPRINT 48 — Q3 GOALS</div>
        ${['Align on alignment','Leverage our leverage','Circle back on circling back','Surface learnings about surfacing','Deliver on delivery commitments','Move the needle (needle TBD)'].map(g=>`<div style="font-size:.62rem;color:#2a2a2a;margin-bottom:.35rem;display:flex;gap:.5rem"><span style="color:#6a6a6a;flex-shrink:0">□</span>${g}</div>`).join('')}
        <div style="margin-top:.85rem;font-size:.54rem;color:#882222;border-top:1px dashed #aa8888;padding-top:.5rem;font-style:italic">IT reminder: exit code = last 4 digits of employee badge ID. Badge in HR unless already collected.</div>
      </div>
    </div>`,
    `The whiteboard is covered in sprint goals. At the bottom, almost as an afterthought:<br><br><strong>"IT reminder: exit code = last 4 digits of employee badge ID."</strong><br><br>You'll need to find your badge first.`,
    `<button class="adv-btn adv-primary" data-go="adv_breakroom">← Back to break room</button>`
  );
  setOverlay('');
}

function scene_adv_examine_fridge() {
  if (advHas('badge')) {
    toast("Just Gary's lunch. Mark labeled it again. You leave it alone.");
    setTimeout(() => scene_adv_breakroom(), 80);
    return;
  }
  incDepth();
  root.innerHTML = advShell('NEXUS HQ — BREAK ROOM (FRIDGE)',
    `<div style="position:absolute;inset:0;background:#e4f0f0;display:flex;align-items:center;justify-content:center">
      <div style="width:155px;background:#f0f8f8;border:2px solid #88b0b0;border-radius:4px;padding:.9rem;text-align:center">
        <div style="font-size:.52rem;color:#488888;margin-bottom:.65rem;font-family:monospace;letter-spacing:.03em">NEXUS BREAK ROOM<br>Shared Refrigerator</div>
        <div style="background:#dceaea;border:1px solid #88b0b0;border-radius:3px;padding:.55rem;font-size:.52rem;color:#1a3a3a;line-height:1.55;margin-bottom:.5rem">
          <div style="font-weight:700;margin-bottom:.25rem">GARY</div>
          <div>This is my lunch. Again.<br><span style="color:#6a6a6a;font-size:.48rem">— Mark (please respect this)</span></div>
        </div>
        <div style="background:#182030;border:1px solid #3a5888;border-radius:3px;padding:.5rem;font-size:.52rem;color:#8ab0d8">
          🎫 Employee Badge<br><span style="color:#4a6888;font-size:.48rem">Misdelivered to fridge<br>by HR (see note inside)</span>
        </div>
      </div>
    </div>`,
    `The fridge is mostly empty except for Gary's lunch (triple-labeled) and — tucked beside it — your employee badge in a small envelope: <em>"For New Hire — Fridge, Floor 1 (per HR)."</em><br><br>HR left it here six weeks ago.`,
    `<button class="adv-btn adv-primary" data-go="adv_take_badge">Take my badge</button>
    <button class="adv-btn" data-go="adv_breakroom">← Close fridge</button>`
  );
  setOverlay('');
}

function scene_adv_take_badge() {
  advGive('badge');
  toast('You take your employee badge. It reads: NEXUS CORP — Employee ID: NEX-0000-1234.');
  scene_adv_breakroom();
}

function scene_adv_floor2() {
  incDepth();
  const art = `<div style="position:absolute;inset:0;background:linear-gradient(to bottom,#a8c8f0 0%,#88aad8 35%,#e0e8f4 35%,#d4dcee 100%)">
    <div style="position:absolute;top:0;left:0;right:0;height:35%;display:flex;gap:4px;padding:0 12px">
      ${[0,1,2,3,4].map(()=>`<div style="flex:1;border:1px solid rgba(255,255,255,.55);background:rgba(180,210,255,.25)"></div>`).join('')}
    </div>
    <div style="position:absolute;bottom:0;left:0;right:58px;height:58%;display:flex;align-items:flex-end;gap:10px;padding:0 18px">
      ${[{note:'YOUR DESK',hi:true},{note:'',hi:false},{note:'',hi:false}].map(({note,hi})=>`<div style="flex:1;position:relative">
        ${note?`<div style="position:absolute;top:-14px;width:100%;text-align:center;font-size:.33rem;color:#5a4a28;font-family:sans-serif;letter-spacing:.06em">${note}</div>`:''}
        <div style="background:${hi?'#c8b870':'#c0a878'};border:2px solid ${hi?'#a09040':'#9a8050'};height:16px;border-radius:2px 2px 0 0"></div>
        <div style="width:88%;margin:0 auto;background:#181828;border:1px solid #303050;height:26px;display:flex;align-items:center;justify-content:center"><div style="width:58%;height:58%;background:#0e0e1e;border:1px solid #282840"></div></div>
      </div>`).join('')}
    </div>
    <div style="position:absolute;bottom:0;right:10px;width:38px;height:72px;background:#cc3838;border:2px solid #ee5050;border-bottom:none;display:flex;flex-direction:column;align-items:center;padding:4px 0;gap:2px">
      <div style="font-size:.36rem;color:#fff;font-weight:700;text-align:center;letter-spacing:.02em;line-height:1.3">EMGCY<br>EXIT</div>
      <div style="font-size:.7rem;margin-top:2px">🚪</div>
    </div>
  </div>`;
  const desc = `Floor 2. Open plan. Every desk has a monitor, a branded water bottle, and the quiet air of recent abandonment. Your nameplate is on the first desk. The emergency exit glows red in the corner.`;
  const actions = `<button class="adv-btn" data-go="adv_examine_desk">Examine your desk</button>
    <button class="adv-btn${advHas('badge') ? ' adv-primary' : ''}" data-go="adv_use_exit">${advHas('badge') ? 'Use badge on exit door' : 'Try exit door'}</button>
    <button class="adv-btn" data-go="adv_try_stairs">← Take stairs back down</button>`;
  root.innerHTML = advShell('NEXUS HQ — FLOOR 2 · Open Plan', art, desc, actions);
  setOverlay('');
}

function scene_adv_examine_desk() {
  incDepth();
  root.innerHTML = advShell('NEXUS HQ — YOUR DESK',
    `<div style="position:absolute;inset:0;background:#d4dcee;display:flex;align-items:center;justify-content:center">
      <div style="width:190px;background:#c0a870;border:3px solid #988040;border-radius:3px;padding:.85rem">
        <div style="background:#181828;aspect-ratio:16/10;width:100%;border:2px solid #303050;display:flex;align-items:center;justify-content:center;margin-bottom:.65rem">
          <div style="text-align:center"><div style="width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,#2563eb,#7c3aed);margin:0 auto 3px;display:flex;align-items:center;justify-content:center;font-size:.5rem;color:#fff;font-weight:700">N</div><div style="font-size:.38rem;color:#3a3a6e">Loading…</div></div>
        </div>
        <div style="background:#ede8d8;border:1px solid #8a7850;border-radius:2px;padding:.4rem;font-size:.48rem;color:#3a3020;line-height:1.55">Complete modules 1–47 before logging in. Module portal requires login. Login requires modules.</div>
      </div>
    </div>`,
    `Your desk. The monitor shows the Nexus logo loading, eternally.<br><br>A sticky note: <em>"Welcome! Complete onboarding modules 1–47 before logging in. Module portal requires login. Login requires completing modules."</em><br><br>At least they got the nameplate right.`,
    `<button class="adv-btn adv-primary" data-go="adv_floor2">← Back to floor 2</button>`
  );
  setOverlay('');
}

function scene_adv_use_exit() {
  if (!advHas('badge')) {
    incDepth();
    root.innerHTML = advShell('NEXUS HQ — EMERGENCY EXIT',
      `<div style="position:absolute;inset:0;background:#160808;display:flex;align-items:center;justify-content:center">
        <div style="text-align:center">
          <div style="font-size:1.8rem;margin-bottom:.5rem">🚨</div>
          <div style="width:76px;height:48px;background:#1c0c0c;border:2px solid #cc4040;border-radius:3px;margin:0 auto .65rem;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px">
            <div style="display:flex;gap:4px">${[1,2,3].map(()=>`<div style="width:13px;height:13px;background:#280a0a;border:1px solid #481818;border-radius:2px"></div>`).join('')}</div>
            <div style="display:flex;gap:4px">${[4,5,6].map(()=>`<div style="width:13px;height:13px;background:#280a0a;border:1px solid #481818;border-radius:2px"></div>`).join('')}</div>
          </div>
          <div style="font-size:.48rem;color:#cc4040;font-family:monospace;letter-spacing:.05em">BADGE REQUIRED</div>
        </div>
      </div>`,
      `The exit door has a badge reader. A sign: <em>"Access requires Floor 2 employee badge. Temp keycards (Floor 1) not valid for exit. For badge, see HR."</em><br><br>HR is on Floor 1. The elevator is out of service. The stairs are not locked.`,
      `<button class="adv-btn" data-go="adv_floor2">← Back to floor 2</button>
      <button class="adv-btn adv-primary" data-go="adv_breakroom">Go find my badge →</button>`
    );
    setOverlay('');
    return;
  }
  incDepth();
  root.innerHTML = advShell('NEXUS HQ — EMERGENCY EXIT',
    `<div style="position:absolute;inset:0;background:#081808;display:flex;align-items:center;justify-content:center">
      <div style="text-align:center">
        <div style="font-size:1.8rem;margin-bottom:.5rem">🟢</div>
        <div style="width:76px;height:48px;background:#0a220a;border:2px solid #2a882a;border-radius:3px;margin:0 auto .65rem;display:flex;align-items:center;justify-content:center">
          <div style="font-size:.9rem;color:#4aaa4a;font-family:monospace;letter-spacing:.15em">1234</div>
        </div>
        <div style="font-size:.48rem;color:#2a882a;font-family:monospace;letter-spacing:.05em">BADGE ACCEPTED</div>
      </div>
    </div>`,
    `You hold your badge to the reader.<br><br>A beep. The display reads: <strong>BADGE ACCEPTED. Employee ID: NEX-0000-1234.</strong><br><br>The door unlocks. You push it open. <em>For the first time today, something works.</em>`,
    `<button class="adv-btn adv-primary" data-go="adv_ending">Step through the door →</button>`
  );
  setOverlay('');
}

function scene_adv_ending() {
  incDepth();
  root.innerHTML = `<div class="adv-wrap" style="display:flex;align-items:center;justify-content:center;min-height:100vh">
    <div style="max-width:520px;text-align:center;padding:2rem">
      <div style="font-size:2.5rem;margin-bottom:1.5rem">🎉</div>
      <div style="font-size:.68rem;letter-spacing:.18em;text-transform:uppercase;color:#44aa44;margin-bottom:1rem">Level Complete</div>
      <h1 style="font-size:1.75rem;font-weight:700;margin-bottom:1rem;color:#e0d8ff">You escaped.</h1>
      <p style="font-size:.88rem;line-height:1.75;color:#7766aa;margin-bottom:1rem">You step through the emergency exit. A long corridor. Another door. You push it open.</p>
      <p style="font-size:.88rem;line-height:1.75;color:#7766aa;margin-bottom:2rem">You are in the lobby.</p>
      <div style="background:#12082a;border:2px solid #3a2a6e;border-radius:4px;padding:1.25rem 1.5rem;margin-bottom:2rem;text-align:left">
        <div style="font-size:.62rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#6644cc;margin-bottom:.75rem">Nexus Gamified Onboarding™</div>
        <div style="font-size:.85rem;color:#c0b8e0;margin-bottom:.65rem">✅ Module 1 of 47 — <em>Navigation</em> — Completed</div>
        <div style="height:5px;background:#0a0618;border-radius:3px;overflow:hidden;margin-bottom:.65rem">
          <div style="height:100%;width:2.2%;background:linear-gradient(to right,#6644cc,#44aacc);border-radius:3px"></div>
        </div>
        <div style="font-size:.72rem;color:#4a3a6a">46 modules remaining · Est. 3.8 hrs · Progress resets on Sundays</div>
      </div>
      <div style="display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap">
        <button class="adv-btn adv-primary" data-go="pricing" style="font-size:.88rem;padding:.6rem 1.5rem">Start for real →</button>
        <button class="adv-btn" data-go="adv_intro" style="font-size:.88rem;padding:.6rem 1.5rem">Play again</button>
        <button class="adv-btn" data-go="main" style="font-size:.88rem;padding:.6rem 1.5rem">Return home</button>
      </div>
    </div>
  </div>`;
  setOverlay('');
}

