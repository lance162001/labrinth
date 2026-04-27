// ────────────── BACKROOMS ──────────────

// ── backrooms helpers ──
function brBrowserName() {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  return 'Unknown Browser';
}
function brTimezoneRegion() {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const parts = tz.split('/');
  return parts.length > 1 ? parts[0].toLowerCase().replace(/_/g, '-') : 'unknown-region';
}
function brFormatDuration(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return m > 0 ? `${m}m ${s % 60}s` : `${s}s`;
}
function brHex(n, pad) {
  pad = pad || 6;
  return Math.abs(Math.floor(n)).toString(16).toUpperCase().padStart(pad, '0');
}
function brFaultCode(roomArg) {
  return '0x' + brHex(roomArg * 7 + S.depth);
}

const BR_URL_S1_SEGS = ['repair','manifest','fallback','session','cache','warmup','trace','handshake'];
const BR_URL_S4_SUFFIXES = ['no_return','null_route','dropped','undefined','orphan_2','unreachable','blackhole','stale'];

function brBuildUrl(stage, slot, roomArg) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const region = brTimezoneRegion();
  const lang = navigator.language;
  const hex4 = brHex(roomArg, 4);
  const faultHex = brHex(roomArg * 3 + slot, 6);

  if (stage === 1) {
    const seg = BR_URL_S1_SEGS[slot % BR_URL_S1_SEGS.length];
    if (!S.brUrlPath) S.brUrlPath = `/dashboard/export/diagnostic/session/${seg}`;
    else S.brUrlPath += `/${seg}`;
  } else if (stage === 2) {
    const layer = (slot % 3) + 2;
    if (!S.brUrlPath) S.brUrlPath = `/cdn-edge/${region}/cache/layer${layer}/0x${faultHex}/timeout`;
    else S.brUrlPath += `/retry/${faultHex.slice(0, 4)}`;
  } else if (stage === 3) {
    const durHex = brHex(Math.floor(performance.now()), 6);
    if (!S.brUrlPath) S.brUrlPath = `/internal/session/${durHex}/log/entry/${roomArg}/user/trace/${lang}/undefined`;
    else S.brUrlPath += `/orphan/${durHex.slice(0, 4)}`;
  } else {
    const cores = navigator.hardwareConcurrency || 4;
    const depth = screen.colorDepth || 24;
    const suffix = BR_URL_S4_SUFFIXES[roomArg % BR_URL_S4_SUFFIXES.length];
    if (!S.brUrlPath) S.brUrlPath = `/proc/net/tcp6/${vw.toString(16).padStart(4,'0')}:${vh.toString(16).padStart(4,'0')}/0x${hex4}/${cores}core/${depth}bit/orphan/${suffix}`;
    else S.brUrlPath += `/${suffix}`;
  }

  // Cap at ~400 chars: keep first 3 segments + last 8 segments
  if (S.brUrlPath.length > 400) {
    const parts = S.brUrlPath.split('/').filter(Boolean);
    S.brUrlPath = '/' + [...parts.slice(0, 3), '...', ...parts.slice(-8)].join('/');
  }

  try { history.replaceState(null, '', S.brUrlPath); } catch(e) {}
}

function brStage1(slot, displayNum, roomArg) {
  const browser = brBrowserName();
  const platform = navigator.platform;
  const vw = window.innerWidth, vh = window.innerHeight;
  const time = new Date().toLocaleTimeString();
  const trialBar = '<span style="font-size:.8rem;color:var(--g400)">Free Trial — <strong style="color:var(--red)">14 days remaining</strong></span>';
  const navOpts = [
    '<a class="nav-logo" data-go="dashboard"><span>Nex</span>us</a><div class="nav-links"><button class="nav-link" data-go="backrooms_next">Home</button><button class="nav-link" data-go="backrooms_next">Features</button><button class="nav-link" data-go="backrooms_next">Pricing</button></div>',
    '<a class="nav-logo" data-go="dashboard"><span>Nex</span>us</a><div class="nav-links"><button class="nav-link" data-go="backrooms_next">→ Next Room</button><button class="nav-link" data-go="backrooms_next">→ Next Room</button><button class="nav-link" data-go="backrooms_next">→ Next Room</button></div>',
    '<a class="nav-logo" data-go="dashboard"><span>Nex</span>us</a><div class="nav-links"><button class="nav-link" data-go="backrooms_next">Home</button><button class="nav-link" data-go="backrooms_next">Features</button><button class="nav-link" data-go="backrooms_next">Pricing</button></div>',
    '<div class="nav-links"><button class="nav-link" data-go="backrooms_next">Home</button><button class="nav-link" data-go="backrooms_next">Features</button><button class="nav-link" data-go="backrooms_next">Pricing</button></div>',
    '<a class="nav-logo" data-go="dashboard"><span>Nex</span>us</a><div class="nav-links"><button class="nav-link" data-go="backrooms_next">Home</button><button class="nav-link" data-go="backrooms_next">Features</button><button class="nav-link" data-go="backrooms_next">Pricing</button></div>',
  ];
  const nav = navOpts[slot % navOpts.length];
  const shell = function(content) {
    return '<div class="nav">' + nav + '<div>' + trialBar + '</div></div><div style="padding:2rem"><div style="max-width:500px">' + content + '</div></div>';
  };

  // Landmark rooms
  if (slot === 1) return shell(
    '<h1 style="font-size:1.1rem;font-weight:600;margin-bottom:1rem">Diagnostic Console</h1>' +
    '<div style="font-size:.875rem;color:var(--g500);margin-bottom:1.25rem">You are in Room ' + displayNum + '.</div>' +
    '<div style="font-size:.875rem;color:var(--g600);margin-bottom:.4rem">No errors found.</div>' +
    '<div style="font-size:.75rem;color:var(--g400);font-style:italic">(you have been here before.)</div>' +
    '<div style="margin-top:2rem"><button class="btn btn-primary" data-go="backrooms_next">Proceed →</button></div>');

  if (slot === 3) return shell(
    '<h1 style="font-size:1.1rem;font-weight:600;margin-bottom:1rem">Cookie Preferences</h1>' +
    '<div style="background:var(--g50);border:1px solid var(--g200);border-radius:8px;padding:1.25rem;margin-bottom:1rem;font-size:.82rem;color:var(--g600);line-height:1.9">' +
    'We use cookies to improve your experience.<br><br>' +
    '<strong>session_ghost</strong> — always active<br>' +
    '<strong>render_id_orphan</strong> — always active<br>' +
    '<strong>consent_cache_stale</strong> — always active' +
    '</div>' +
    '<div style="display:flex;gap:.75rem"><button class="btn btn-primary" data-go="backrooms_next">Accept All</button><button class="btn btn-secondary" data-go="backrooms_next">Customize</button></div>');

  if (slot === 7) return shell(
    '<h1 style="font-size:1.1rem;font-weight:600;margin-bottom:1.5rem">Simple, transparent pricing.</h1>' +
    '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:1rem">' +
    '<div style="border:1px solid var(--g200);border-radius:8px;padding:1rem;font-size:.8rem"><div style="font-weight:600;margin-bottom:.5rem">Starter</div><div style="font-size:1.2rem;font-weight:700;color:var(--red)">$NaN<span style="font-size:.75rem;font-weight:400;color:var(--g400)">/mo</span></div><button class="btn btn-secondary" style="width:100%;margin-top:1rem;font-size:.75rem" data-go="backrooms_next">Proceed →</button></div>' +
    '<div style="border:2px solid var(--blue);border-radius:8px;padding:1rem;font-size:.8rem"><div style="font-weight:600;margin-bottom:.5rem">Pro</div><div style="font-size:1.2rem;font-weight:700;color:var(--red)">$undefined<span style="font-size:.75rem;font-weight:400;color:var(--g400)">/mo</span></div><button class="btn btn-primary" style="width:100%;margin-top:1rem;font-size:.75rem" data-go="backrooms_next">Proceed →</button></div>' +
    '<div style="border:1px solid var(--g200);border-radius:8px;padding:1rem;font-size:.8rem"><div style="font-weight:600;margin-bottom:.5rem">Enterprise</div><div style="font-size:1rem;font-weight:700;color:var(--g400)">Contact [object Object]</div><button class="btn btn-secondary" style="width:100%;margin-top:1rem;font-size:.75rem" data-go="backrooms_next">Proceed →</button></div>' +
    '</div>');

  if (slot === 12) return shell(
    '<h1 style="font-size:1.1rem;font-weight:600;margin-bottom:.5rem">Create your account</h1>' +
    '<div style="font-size:.75rem;color:var(--g400);margin-bottom:1.5rem">Step 8 of 3</div>' +
    '<div style="height:4px;background:var(--g100);border-radius:2px;margin-bottom:1.5rem"><div style="width:100%;height:100%;background:var(--blue);border-radius:2px"></div></div>' +
    '<div style="margin-top:2rem"><button class="btn btn-primary" data-go="backrooms_next">Continue →</button></div>');

  if (slot === 15) return shell(
    '<h1 style="font-size:1.1rem;font-weight:600;margin-bottom:1rem">Features</h1>' +
    '<div style="background:#000;border-radius:6px;padding:2rem;text-align:center;margin-bottom:1rem">' +
    '<div style="color:#666;font-size:.7rem;margin-bottom:1rem">Loading: indeterminate</div>' +
    '<div style="height:6px;background:#1a1a1a;border-radius:3px"><div style="width:95%;height:100%;background:#444;border-radius:3px"></div></div>' +
    '<div style="color:#444;font-size:.65rem;margin-top:.75rem">95%</div>' +
    '</div>' +
    '<div style="font-size:.72rem;color:var(--g400);font-style:italic">This has been loading since before you arrived.</div>' +
    '<div style="margin-top:1.5rem"><button class="btn btn-secondary" data-go="backrooms_next">Proceed →</button></div>');

  if (slot === 18) return shell(
    '<h1 style="font-size:1.1rem;font-weight:600;margin-bottom:1rem">Diagnostic Console</h1>' +
    '<div style="font-size:.875rem;color:var(--g500);margin-bottom:1rem">You are in Room ' + displayNum + '.</div>' +
    '<div class="alert" style="font-size:.8rem;background:#f0fdf4;border-color:var(--green);margin-bottom:1rem">✓ All systems operational.</div>' +
    '<div style="font-size:.72rem;color:var(--g300);font-style:italic">Getting colder.</div>' +
    '<div style="font-size:.8rem;color:var(--g400);margin-top:.75rem">Free Trial — <strong style="color:var(--red)">14 days remaining</strong></div>' +
    '<div style="margin-top:1.5rem"><button class="btn btn-primary" data-go="backrooms_next">Proceed →</button></div>');

  if (slot === 22) return shell(
    '<h1 style="font-size:1.1rem;font-weight:600;margin-bottom:1rem">Diagnostic Console</h1>' +
    '<div style="font-size:.875rem;color:var(--g500);margin-bottom:1.25rem">You are in Room ' + displayNum + '.</div>' +
    '<div style="font-size:.75rem;color:var(--g400);margin-bottom:.4rem">Client: ' + browser + ' / ' + platform + '</div>' +
    '<div style="font-size:.75rem;color:var(--g400);margin-bottom:1.5rem">Viewport: ' + vw + '\xd7' + vh + '</div>' +
    '<div style="margin-top:2rem"><button class="btn btn-primary" data-go="backrooms_next">Proceed →</button></div>');

  if (slot === 25) return shell(
    '<h1 style="font-size:1rem;font-weight:600;margin-bottom:1rem;font-family:\'Courier New\',monospace">Diagnostic Console</h1>' +
    '<div style="font-size:.82rem;color:var(--g500);margin-bottom:1rem">You are in Room ' + displayNum + '.</div>' +
    '<div style="font-size:.78rem;color:var(--g600);margin-bottom:.4rem">Fault detected in layer below.</div>' +
    '<div style="font-size:.72rem;color:var(--g400);font-style:italic;margin-bottom:1.75rem">Descending to network layer.</div>' +
    '<button style="padding:.55rem 1.4rem;background:none;border:1px solid var(--g300);color:var(--g600);font-family:\'Courier New\',monospace;font-size:.82rem;cursor:pointer;border-radius:0" data-go="backrooms_next">continue</button>');

  // Templates (slot % 5)
  const t = slot % 5;
  var content;
  if (t === 0) {
    var ok = slot % 3 !== 0;
    content = '<h1 style="font-size:1.1rem;font-weight:600;margin-bottom:1rem">System Status</h1>' +
      '<div style="font-size:.875rem;color:var(--g500);margin-bottom:1.25rem">Room ' + displayNum + ' — ' + time + '</div>' +
      '<div class="alert" style="font-size:.8rem;background:' + (ok ? '#f0fdf4' : '#fef2f2') + ';border-color:' + (ok ? 'var(--green)' : 'var(--red)') + '">' +
      (ok ? '✓ All systems operational.' : '⚠ Fault state: nominal.') + '</div>' +
      '<div style="font-size:.72rem;color:var(--g400);margin-top:.75rem">Client: ' + browser + ' / ' + platform + '</div>' +
      '<div style="font-size:.72rem;color:var(--g400)">Viewport: ' + vw + '\xd7' + vh + '</div>' +
      '<div style="margin-top:1.5rem"><button class="btn btn-primary" data-go="backrooms_next">Proceed →</button></div>';
  } else if (t === 1) {
    var signers = ['— The Nexus Infrastructure Team','— Automated Diagnostics','— Cache Warming Process','— An Automated Process'];
    content = '<h1 style="font-size:1.1rem;font-weight:600;margin-bottom:1rem">Notice</h1>' +
      '<div style="font-size:.875rem;color:var(--g600);margin-bottom:1rem;line-height:1.8">Your session has been noted.<br>This is routine.<br>No action is required.</div>' +
      '<div style="font-size:.72rem;color:var(--g400);margin-bottom:1.5rem">' + signers[slot % 4] + '</div>' +
      '<button class="btn btn-secondary" data-go="backrooms_next">Proceed →</button>';
  } else if (t === 2) {
    content = '<h1 style="font-size:1.1rem;font-weight:600;margin-bottom:1rem">Diagnostic Log</h1>' +
      '<div style="font-family:\'Courier New\',monospace;font-size:.72rem;color:var(--g500);line-height:2;margin-bottom:1.25rem">' +
      '<div>&gt; Room ' + displayNum + ': initialized</div>' +
      '<div>&gt; Client: ' + browser + '</div>' +
      '<div>&gt; Viewport: ' + vw + '\xd7' + vh + ' — logged</div>' +
      '<div>&gt; Session: active</div>' +
      '<div>&gt; Status: OK</div>' +
      '</div>' +
      '<button class="btn btn-primary" data-go="backrooms_next">Proceed →</button>';
  } else if (t === 3) {
    content = '<h1 style="font-size:1.1rem;font-weight:600;margin-bottom:1rem">Dashboard</h1>' +
      '<div class="alert" style="font-size:.8rem;background:#eff6ff;border-color:var(--blue);margin-bottom:1rem">Free Trial — <strong style="color:var(--red)">14 days remaining</strong></div>' +
      '<div style="font-size:.65rem;color:var(--g300);font-style:italic">(has always been 14 days remaining)</div>' +
      '<div style="margin-top:1.5rem"><button class="btn btn-primary" data-go="backrooms_next">Proceed →</button></div>';
  } else {
    content = '<h1 style="font-size:1.1rem;font-weight:600;margin-bottom:1rem">Diagnostic Console</h1>' +
      '<div style="font-size:.875rem;color:var(--g500);margin-bottom:.4rem">Pipeline status: nominal.</div>' +
      '<div style="font-size:.75rem;color:var(--g400);margin-bottom:1.5rem">No action required.</div>' +
      '<div style="display:flex;gap:.75rem"><button class="btn btn-primary" data-go="backrooms_next">Proceed →</button><button class="btn btn-primary" data-go="backrooms_next">Proceed →</button></div>';
  }
  return shell(content);
}

function brStage2(slot, displayNum, roomArg) {
  const region = brTimezoneRegion();
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const lang = navigator.language;
  const conn = (navigator.connection && navigator.connection.effectiveType) || 'unknown';
  const online = navigator.onLine ? 'true' : 'false';
  const faultCode = brFaultCode(roomArg);
  const ls = (0.02 + (slot - 26) * 0.007).toFixed(3);
  // Background darkens gradually from warm cream to deep amber across 25 rooms
  var bgIdx = Math.min(slot - 26, 24);
  var r = Math.round(245 - bgIdx * 3), g = Math.round(240 - bgIdx * 4), b = Math.round(224 - bgIdx * 6);
  var bg = 'rgb(' + r + ',' + g + ',' + b + ')';

  var btn = '<button style="padding:.55rem 1.4rem;background:none;border:1px solid #9a8060;color:#4a3a1a;font-family:\'Courier New\',monospace;font-size:.82rem;cursor:pointer;border-radius:0" data-go="backrooms_next">continue</button>';
  var hdr = function(lbl) { return '<div style="font-size:.58rem;color:#9a8060;margin-bottom:1.5rem;letter-spacing:.1em">NEXUS — ' + lbl + ' — ROOM ' + displayNum + '</div>'; };
  var wrap = function(inner) {
    return '<div style="min-height:100vh;background:' + bg + ';display:flex;align-items:center;justify-content:center;padding:2.5rem;font-family:\'Courier New\',monospace;letter-spacing:' + ls + 'em"><div style="max-width:540px;width:100%">' + inner + '</div></div>';
  };

  // Landmarks
  if (slot === 26) return wrap(
    hdr('NETWORK DIAGNOSTIC — LAYER 2') +
    '<div style="font-size:.9rem;color:#4a3a1a;margin-bottom:1rem;line-height:1.9">You have passed the application layer.</div>' +
    '<div style="font-size:.78rem;color:#7a6040;line-height:1.9;margin-bottom:2rem">What follows is not intended for users.</div>' +
    btn);

  if (slot === 30) {
    var now = new Date();
    var rows = '';
    for (var i = 18; i >= 0; i--) {
      var t2 = new Date(now.getTime() - i * 47000);
      rows += '<div>' + t2.toISOString().replace('T',' ').slice(0,19) + ' &nbsp;User navigated deeper.</div>';
    }
    return wrap(
      hdr('CHANGELOG — SYSTEM') +
      '<div style="font-size:.68rem;color:#7a6040;line-height:2;margin-bottom:1.25rem;max-height:300px;overflow:hidden">' + rows +
      '<div style="color:#8b3333">' + now.toISOString().replace('T',' ').slice(0,19) + ' &nbsp;User navigated deeper.</div>' +
      '</div>' + btn);
  }

  if (slot === 35) return wrap(
    hdr('ROADMAP') +
    '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:1.25rem;font-size:.7rem;color:#7a6040">' +
    '<div><div style="font-size:.6rem;letter-spacing:.08em;margin-bottom:.5rem;color:#9a8060">IN TRANSIT</div><div style="margin-bottom:.5rem">Resolve DNS ambiguity (since 2019)</div><div style="margin-bottom:.5rem">Drain legacy session pool</div><div>Patch orphaned cache entries</div></div>' +
    '<div><div style="font-size:.6rem;letter-spacing:.08em;margin-bottom:.5rem;color:#9a8060">ROUTING</div><div style="margin-bottom:.5rem">Migrate CDN region (blocked)</div><div style="margin-bottom:.5rem">Re-index lost manifests</div><div>Restore TTL integrity</div></div>' +
    '<div><div style="font-size:.6rem;letter-spacing:.08em;margin-bottom:.5rem;color:#9a8060">LOST IN QUEUE</div><div style="margin-bottom:.5rem">Decommission layer 0</div><div style="margin-bottom:.5rem">Archive ghost sessions</div><div>Close Ticket #0003</div></div>' +
    '</div>' + btn);

  if (slot === 38) return wrap(
    hdr('SUPPORT — AUTO-TICKET') +
    '<div style="font-size:.8rem;color:#4a3a1a;line-height:2.2;font-family:\'Courier New\',monospace;margin-bottom:1.25rem">' +
    '&gt; Ticket #' + displayNum + ' opened automatically<br>' +
    '&gt; Analyzing issue…<br>' +
    '&gt; Ticket #' + displayNum + ' resolved: <em style="color:#8b3333">you are not supposed to be here</em><br>' +
    '&gt; Closing ticket.</div>' + btn);

  if (slot === 42) return wrap(
    hdr('TERMS — PENDING') +
    '<div style="font-size:.88rem;color:#4a3a1a;margin-bottom:1.25rem;line-height:2.1">' +
    'P l e a s e &nbsp; r e a d &nbsp; t h e &nbsp;—<br>' +
    'P l e a s e &nbsp; r e a d &nbsp; t h e &nbsp;—<br>' +
    'P l e a s e &nbsp; r e a d &nbsp; t h e &nbsp; t e r m s</div>' +
    '<div style="display:flex;justify-content:space-between;align-items:flex-end">' +
    '<button style="padding:.55rem 1.4rem;background:none;border:1px solid #9a8060;color:#4a3a1a;font-family:\'Courier New\',monospace;font-size:.82rem;cursor:pointer;border-radius:0" data-go="backrooms_next">[ R e c e d e ]</button>' +
    '<div><button style="padding:.55rem 1.4rem;background:none;border:1px solid rgba(154,128,96,.3);color:rgba(74,58,26,.3);font-family:\'Courier New\',monospace;font-size:.82rem;cursor:pointer;border-radius:0" data-go="backrooms_next">[ C o n t i n u e ]</button>' +
    '<div style="font-size:.55rem;color:#9a8060;text-align:right;margin-top:.3rem">(goes forward)</div></div></div>');

  if (slot === 46) return wrap(
    hdr('CONNECTION STATUS') +
    '<div style="font-size:.78rem;color:#4a3a1a;line-height:2.4;margin-bottom:1.5rem">' +
    'Your connection: ' + conn + '.<br>' +
    'Language: ' + lang + '.<br>' +
    'Timezone: ' + tz + '.<br>' +
    'Online: ' + online + '.<br>' +
    '<span style="color:#9a8060;font-size:.9em">None of this is unusual.</span>' +
    '</div>' + btn);

  if (slot === 50) {
    var events50 = ['GET /home 200 OK','GET /cookies 200 OK','GET /main 200 OK','GET /pricing 200 OK','GET /signup 200 OK','GET /signup_2 200 OK','GET /survey/q14 200 OK','GET /delete_account 200 OK','GET /support_ticket 200 OK','GET /help 200 OK','GET /backrooms/room/00047 200 OK','GET /backrooms/room/00048 200 OK','GET /backrooms/room/00049 200 OK'];
    return '<div style="min-height:100vh;background:' + bg + ';font-family:\'Courier New\',monospace;padding:3rem 2.5rem;letter-spacing:' + ls + 'em">' +
      '<div style="font-size:.58rem;color:#9a8060;margin-bottom:1.5rem;letter-spacing:.1em">NEXUS — ACCESS LOG — ROOM ' + displayNum + '</div>' +
      '<div style="font-size:.72rem;color:#7a6040;line-height:2;margin-bottom:1rem">' +
      events50.map(function(e){return '<div>'+e+'</div>';}).join('') +
      '<div style="color:#4a3a1a">GET /backrooms/room/00050 200 OK &nbsp;—&nbsp; you are reading this log.</div>' +
      '<div style="color:#8b3333">GET /backrooms/room/00051 200 OK &nbsp;—&nbsp; already written.</div>' +
      '</div>' +
      '<div style="margin-top:2rem">' + btn + '</div></div>';
  }

  // Templates (slot % 5)
  var t2 = slot % 5;
  var inner;
  if (t2 === 0) {
    inner = hdr('DIAGNOSTIC CONSOLE') +
      '<div style="font-size:.9rem;color:#4a3a1a;margin-bottom:1rem;line-height:1.9">Pipeline fault detected.<br>Attempting recovery.</div>' +
      '<div style="font-size:.72rem;color:#7a6040;margin-bottom:2rem;line-height:1.9">Fault code: ' + faultCode + '<br>Origin: unknown<br>Time elapsed: indeterminate</div>' + btn;
  } else if (t2 === 1) {
    var latency = roomArg % 800 + 200;
    var cacheState = roomArg % 3 === 0 ? 'Cache miss.' : 'Cache stale.';
    inner = hdr('ROUTING') +
      '<div style="font-size:.78rem;color:#4a3a1a;line-height:2.2;margin-bottom:1.5rem">' +
      'Request routed through ' + region + ' edge.<br>' +
      'Round-trip: ' + latency + 'ms.<br>' + cacheState + '</div>' + btn;
  } else if (t2 === 2) {
    var dnsHex = brHex(roomArg * 13, 8).toLowerCase();
    var year = 2017 + (slot % 6);
    inner = hdr('DNS LOOKUP') +
      '<div style="font-size:.78rem;color:#4a3a1a;line-height:2.2;margin-bottom:1.5rem">' +
      'Domain: nexus-' + dnsHex.slice(0,8) + '.internal<br>' +
      'Record: CNAME → nexus-' + dnsHex.slice(0,4) + '.cdn.internal<br>' +
      'TTL: indeterminate<br>' +
      '<span style="color:#9a8060">This record has been propagating since ' + year + '.</span>' +
      '</div>' + btn;
  } else if (t2 === 3) {
    inner = hdr('SUPPORT CHAT — CONNECTED') +
      '<div style="border:1px solid rgba(154,128,96,.35);padding:1rem;margin-bottom:1.25rem;font-size:.78rem;color:#6a5040;line-height:2">' +
      '<div><strong>Nexus Bot:</strong> Still looking into it…</div>' +
      '<div style="margin-top:.75rem;font-size:.58rem;color:#9a8060">Message sent at an unknown time &nbsp;\xb7&nbsp; No agents available</div>' +
      '</div>' + btn;
  } else {
    inner = hdr('BLOG — COMING SOON') +
      '<div style="font-size:.78rem;color:#4a3a1a;margin-bottom:1rem">Stay in the loop.</div>' +
      '<input type="email" value="' + lang + '" style="background:rgba(58,46,26,.06);border:1px solid rgba(154,128,96,.4);color:#4a3a1a;padding:.4rem .7rem;font-family:\'Courier New\',monospace;font-size:.75rem;width:200px" readonly>' +
      '<div style="font-size:.6rem;color:#9a8060;margin-top:.4rem">Subscribing: ' + lang + '</div>' +
      '<div style="margin-top:1rem">' + btn + '</div>';
  }
  return wrap(inner);
}

function brStage3(slot, displayNum, roomArg) {
  var duration = brFormatDuration(performance.now());
  var histLen = history.length;
  var referrer = document.referrer || '(direct)';
  var cookieLen = document.cookie.length;
  var lsLen = 0; try { lsLen = localStorage.length; } catch(e) {}
  var lang = navigator.language;
  var tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  var tzRegion = tz.split('/')[0];
  var vw = window.innerWidth, vh = window.innerHeight;
  var sessionHex = brHex(Math.floor(performance.now()), 6);

  var btn = '<button style="padding:.55rem 1.25rem;background:none;border:1px solid rgba(184,128,64,.3);color:#b07040;font-family:\'Courier New\',monospace;font-size:.78rem;cursor:pointer;border-radius:0" data-go="backrooms_next">keep going</button>';
  var lbl = function(s) { return '<div style="font-size:.52em;color:#6a5030;margin-bottom:1.5rem;letter-spacing:.12em">' + (s ? s + ' — ' : '') + 'ROOM ' + displayNum + '</div>'; };
  var wrap = function(inner) {
    return '<div style="min-height:100vh;background:#1a1410;display:flex;align-items:center;justify-content:center;padding:2.5rem;font-family:\'Courier New\',monospace;letter-spacing:.06em"><div style="max-width:520px;width:100%">' + inner + '</div></div>';
  };

  // Landmarks
  if (slot === 51) return wrap(
    lbl('LAYER 3') +
    '<div style="font-size:.82em;color:#9a7040;line-height:2.2;margin-bottom:1.75rem">You have passed the network layer.<br><br>What follows is not a product.</div>' +
    btn);

  if (slot === 55) return wrap(
    lbl('SESSION') +
    '<div style="font-size:.78em;color:#9a7040;line-height:2.4;margin-bottom:1.75rem">' +
    'You have been here for ' + duration + '.<br>' +
    '<span style="color:#6a5030">The session will not expire.</span>' +
    '</div>' + btn);

  if (slot === 58) return wrap(
    lbl('SOCIAL PROOF') +
    '<div style="font-size:.72em;color:#8a6030;line-height:2.6;margin-bottom:1.75rem">' +
    'Trusted by:<br>' +
    '<span style="color:#9a7040">Your Browser</span><br>' +
    '<span style="color:#9a7040">Your ISP</span><br>' +
    '<span style="color:#9a7040">The CDN Serving This Page</span><br>' +
    '<span style="color:#9a7040">A Server in ' + tzRegion + ' You Have Never Heard Of</span><br><br>' +
    '<em style="color:#6a5030;font-size:.9em">"We knew you were here."</em>' +
    '</div>' + btn);

  if (slot === 62) return wrap(
    lbl('ACCOUNT — DANGER ZONE') +
    '<div style="font-size:.78em;color:#9a7040;margin-bottom:1rem;line-height:1.9">' +
    'This action cannot be undone.<br>Type <strong style="color:#c05040">' + roomArg + '</strong> to confirm.' +
    '</div>' +
    '<div style="display:flex;gap:.75rem;align-items:center;margin-bottom:1.5rem">' +
    '<input type="text" placeholder="' + roomArg + '" style="background:rgba(58,46,26,.15);border:1px solid rgba(154,112,64,.3);color:#b07040;padding:.35rem .6rem;font-family:\'Courier New\',monospace;font-size:.75rem;width:100px">' +
    '<button style="padding:.35rem .9rem;background:none;border:1px solid rgba(192,80,64,.4);color:#c05040;font-family:\'Courier New\',monospace;font-size:.72rem;cursor:pointer;border-radius:0" data-go="backrooms_next">confirm</button>' +
    '</div>' + btn);

  if (slot === 66) return wrap(
    '<div style="font-size:.88em;color:#9a7040;margin-bottom:2rem;line-height:2">Are you currently being observed?</div>' +
    '<div style="font-size:.75em;color:#7a5828;line-height:2.6;margin-bottom:1.5rem">' +
    '<div><label><input type="radio" name="q66br" style="accent-color:#9a7040"> Yes</label></div>' +
    '<div><label><input type="radio" name="q66br" style="accent-color:#9a7040"> No</label></div>' +
    '<div><label><input type="radio" name="q66br" style="accent-color:#9a7040"> This question is making me paranoid</label></div>' +
    '<div><label><input type="radio" name="q66br" style="accent-color:#9a7040"> Yes. Something is in the walls.</label></div>' +
    '</div>' + btn);

  if (slot === 70) return wrap(
    lbl('TRANSCRIPT — PARTIAL') +
    '<div style="font-size:.72em;color:#8a6030;line-height:2.4;margin-bottom:1.75rem">' +
    'Jordan: We want to make sure you’re getting value—<br>' +
    '<span style="color:#5a4020">[Hold music. Indeterminate.]</span><br>' +
    'Brad: This is Brad, Senior Retention Specialist.<br>' +
    'Brad: We’ve noted your location in the system.<br>' +
    '<span style="color:#5a4020">[End of available transcript.]</span>' +
    '</div>' + btn);

  if (slot === 75) return wrap(
    lbl('ONBOARDING — SETUP') +
    '<div style="font-size:.75em;color:#8a6030;line-height:2.6;margin-bottom:1.75rem">' +
    '<div style="color:#c05040">✓ Browser identified (' + lang + ')</div>' +
    '<div style="color:#c05040">✓ Viewport logged (' + vw + '\xd7' + vh + ')</div>' +
    '<div style="color:#c05040">✓ History indexed (' + histLen + ' entries)</div>' +
    '<div style="color:#c05040">✓ Session cached (' + sessionHex + ')</div>' +
    '<div style="color:#c05040">✓ Cookie store: ' + cookieLen + ' bytes</div>' +
    '<div style="color:#c05040">✓ Exit path: unavailable</div>' +
    '</div>' + btn);

  // Templates
  var mirrorFields = [
    'Viewport: ' + vw + '\xd7' + vh,
    'Session duration: ' + duration,
    'History depth: ' + histLen + ' entries',
    'Referrer: ' + referrer,
    'Cookie store: ' + cookieLen + ' bytes',
    'Local storage: ' + lsLen + ' keys',
  ];
  var t3 = slot % 5;
  var inner;
  if (t3 === 0) {
    var field = mirrorFields[slot % mirrorFields.length];
    inner = lbl('SESSION') +
      '<div style="font-size:.78em;color:#9a7040;line-height:2.2;margin-bottom:1.75rem">' + field + '<br><span style="color:#6a5030">This is noted.</span></div>' + btn;
  } else if (t3 === 1) {
    var queries = [
      'SELECT * FROM sessions WHERE id = \'' + sessionHex + '\'',
      'UPDATE users SET last_seen = NOW() WHERE session = \'' + sessionHex + '\'',
      'SELECT * FROM cache WHERE key LIKE \'%' + lang + '%\'',
    ];
    var results = ['1 row expected. 1 row returned. 0 rows found.','ERROR: ambiguous target','Query timeout. Retrying indefinitely.'];
    var qi = slot % 3;
    inner = lbl('DATABASE') +
      '<div style="font-size:.72em;color:#7a5828;font-family:\'Courier New\',monospace;margin-bottom:1rem;line-height:1.8">' + queries[qi] + '</div>' +
      '<div style="font-size:.68em;color:#8b3333;margin-bottom:1.75rem">' + results[qi] + '</div>' + btn;
  } else if (t3 === 2) {
    inner = lbl('SERVER LOG') +
      '<div style="font-size:.68em;color:#7a5828;line-height:2;margin-bottom:1.75rem">' +
      '<div>Session ' + sessionHex + ': active for ' + duration + '</div>' +
      '<div>Viewport: ' + vw + '\xd7' + vh + ' — logged</div>' +
      '<div>Language: ' + lang + ' — indexed</div>' +
      '<div>Timezone: ' + tz + ' — stored</div>' +
      '<div>History depth: ' + histLen + ' — captured</div>' +
      '<div style="color:#8b3333">Record ' + roomArg + ': written.</div>' +
      '</div>' + btn;
  } else if (t3 === 3) {
    var noticeSigners = ['— Cache Layer 3','— An Automated Process','— The Part of the System That Handles This','— No One In Particular'];
    var notices3 = ['Your presence in this layer has been logged.','This record will be retained indefinitely.','The data has already been processed.','No further action is required on your part.'];
    inner = lbl('NOTICE') +
      '<div style="font-size:.78em;color:#9a7040;line-height:2;margin-bottom:1rem">' + notices3[slot % 4] + '</div>' +
      '<div style="font-size:.65em;color:#6a5030;margin-bottom:1.75rem">' + noticeSigners[slot % 4] + '</div>' + btn;
  } else {
    var pct = (roomArg * 0.00004).toFixed(4);
    inner = lbl('EXPORT') +
      '<div style="font-size:.78em;color:#9a7040;line-height:2.2;margin-bottom:1.75rem">' +
      'the export is ' + pct + '% complete.<br>' +
      'the export is ' + pct + '% complete.<br>' +
      'the export is ' + pct + '% complete.<br>' +
      '<span style="color:#8b3333">the export will never complete.</span><br>' +
      '<span style="color:#6a5030">it has your data.</span>' +
      '</div>' + btn;
  }
  return wrap(inner);
}

function brStage4(slot, displayNum, roomArg) {
  var cores = navigator.hardwareConcurrency || 4;
  var mem = navigator.deviceMemory != null ? navigator.deviceMemory : 'unknown';
  var colorDepth = screen.colorDepth || 24;
  var pixelRatio = window.devicePixelRatio || 1;
  var cookieEnabled = navigator.cookieEnabled;
  var bat = S.brBattery;
  var batStr = bat ? (bat.level + '% — ' + (bat.charging ? 'charging' : 'discharging')) : 'unavailable';
  var duration = brFormatDuration(performance.now());
  var vw = window.innerWidth, vh = window.innerHeight;

  var exitInput = '<div style="margin-top:3rem;padding-top:1.25rem;border-top:1px solid rgba(255,255,255,.06)">' +
    '<div style="font-size:.52em;letter-spacing:.1em;color:#3a2c10;margin-bottom:.6rem">EMERGENCY EXIT PROTOCOL</div>' +
    '<input id="br-exit-input" type="text" autocomplete="off" style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);color:#7a5020;padding:.35rem .6rem;font-family:\'Courier New\',monospace;font-size:.72rem;letter-spacing:.06em;width:150px" placeholder="access code">' +
    '<button onclick="(function(){var v=document.getElementById(\'br-exit-input\').value.trim().toUpperCase();if(v===\'LEVEL0\'){scene_backrooms_exit();}else{var el=document.getElementById(\'br-exit-input\');el.style.border=\'1px solid #8b3333\';setTimeout(function(){el.style.border=\'1px solid rgba(255,255,255,.08)\'},600);}})()" style="background:none;border:1px solid rgba(58,46,26,.2);color:#4a3010;padding:.35rem .75rem;font-family:\'Courier New\',monospace;font-size:.68rem;cursor:pointer;margin-left:.4rem">submit</button>' +
    '</div>';

  var btn = function(lbl) {
    lbl = lbl !== undefined ? lbl : 'keep going';
    return '<button style="padding:.55rem 1.25rem;background:none;border:1px solid rgba(255,255,255,.07);color:#4a3818;font-family:\'Courier New\',monospace;font-size:.78rem;cursor:pointer;border-radius:0" data-go="backrooms_next">' + lbl + '</button>';
  };
  var roomLabel = function(s) {
    return '<div style="font-size:.52em;color:#3a2c10;margin-bottom:1.5rem;letter-spacing:.12em">ROOM ' + displayNum + (s ? ' — ' + s : '') + '</div>';
  };
  var wrap = function(inner) {
    return '<div style="min-height:100vh;background:#0d0a06;display:flex;align-items:center;justify-content:center;padding:2.5rem;font-family:\'Courier New\',monospace;letter-spacing:.12em;animation:br-deep-flicker 12s infinite"><div style="max-width:480px;width:100%">' + inner + '</div></div>';
  };

  // Landmarks
  if (slot === 76) return wrap(
    roomLabel() +
    '<div style="font-size:.78em;color:#6a4818;line-height:2.4;margin-bottom:1.75rem">' +
    'you have been here for ' + duration + '.<br>' +
    '<span style="color:#3a2c10">the exit is here.</span>' +
    '</div>' + btn() + exitInput);

  if (slot === 80) return wrap(
    roomLabel('CONFIRMATION') +
    '<div style="font-size:.75em;color:#6a4818;line-height:2.4;margin-bottom:1.75rem">' +
    'Application submitted!<br>' +
    'Position: [undefined]<br>' +
    '<span style="color:#3a2c10">We’ll be in touch in [NaN]–[NaN] weeks.</span><br>' +
    '<span style="color:#3a2c10">The assessment is still pending.</span>' +
    '</div>' + btn() + exitInput);

  if (slot === 84) return wrap(
    '<div style="font-size:.52em;color:#1a1408;margin-bottom:3rem;letter-spacing:.2em">Nexus</div>' +
    '<div style="font-size:.52em;color:#2a1e08;margin-bottom:.5rem;letter-spacing:.12em">ROOM ' + displayNum + '</div>' +
    btn() + exitInput);

  if (slot === 88) return wrap(
    roomLabel() +
    '<div style="font-size:.78em;color:#6a4818;line-height:2;margin-bottom:.5rem">the code is</div>' +
    '<span style="font-size:.78em;color:#0d0a06;background:#0d0a06;user-select:text;margin-bottom:1.75rem;display:inline-block">LEVEL0</span>' +
    '<div style="margin-top:1.75rem">' + btn() + '</div>' + exitInput);

  if (slot === 92) return wrap(
    roomLabel() +
    '<div style="font-size:.78em;color:#6a4818;line-height:2.4;margin-bottom:1.75rem">' +
    'you have been here before.<br>' +
    'you will be here again.<br>' +
    '<span style="color:#3a2c10">there is no other direction.</span>' +
    '</div>' + btn() + exitInput);

  if (slot === 96) return wrap(
    roomLabel('DIAGNOSTIC CONSOLE') +
    '<div style="font-size:.75em;color:#2a1e08;line-height:2;margin-bottom:.4rem">No errors found.</div>' +
    '<div style="font-size:.65em;color:#1a1208;font-style:italic;margin-bottom:1.75rem">(you never left.)</div>' +
    btn() + exitInput);

  if (slot === 100) return wrap(
    roomLabel() +
    '<div style="font-size:.72em;color:#4a3818;line-height:2.4;margin-bottom:1.75rem">' +
    'end of indexed range.<br><span style="color:#3a2c10">continuing.</span>' +
    '</div>' + btn('continue') + exitInput);

  // Templates
  var frags = [
    'Jordan begins the retention scri—',
    'Step 8 of —',
    'All systems opera—',
    'Your account has been —',
    'Please type DELETE to —',
    'The export is —',
    'We’ll be in touch in —',
    'Session expires in —',
  ];
  var dissolvedNotices = [
    'The record has been updated.',
    'Your request has been received.',
    'Processing is complete.',
    'The action has been logged.',
    'This notification was sent automatically.',
  ];
  var t4 = slot % 5;
  var inner;
  if (t4 === 0) {
    inner = roomLabel() +
      '<div style="font-size:.72em;color:#4a3818;line-height:2.6;margin-bottom:1.75rem">' +
      'Cores: ' + cores + '<br>' +
      'Memory: ' + mem + (mem !== 'unknown' ? 'GB' : '') + '<br>' +
      'Color depth: ' + colorDepth + 'bit<br>' +
      'Pixel ratio: ' + pixelRatio + '<br>' +
      'Battery: ' + batStr + '<br>' +
      'Cookies: ' + (cookieEnabled ? 'enabled' : 'disabled') +
      '</div>' + btn() + exitInput;
  } else if (t4 === 1) {
    inner = roomLabel() +
      '<div style="font-size:.72em;color:#3a2c10;line-height:2;margin-bottom:1.75rem">' + dissolvedNotices[slot % dissolvedNotices.length] + '</div>' +
      btn() + exitInput;
  } else if (t4 === 2) {
    inner = roomLabel() +
      '<div style="font-size:.78em;color:#4a3818;line-height:2;margin-bottom:1.75rem">' + frags[slot % frags.length] + '</div>' +
      btn() + exitInput;
  } else if (t4 === 3) {
    inner = roomLabel() +
      '<div style="display:flex;gap:1.5rem;margin-bottom:1.75rem">' +
      '<button style="padding:.55rem 1.25rem;background:none;border:1px solid rgba(255,255,255,.07);color:#4a3818;font-family:\'Courier New\',monospace;font-size:.78rem;cursor:pointer;border-radius:0" data-go="backrooms_next">[ return ]</button>' +
      '<button style="padding:.55rem 1.25rem;background:none;border:1px solid rgba(255,255,255,.07);color:#4a3818;font-family:\'Courier New\',monospace;font-size:.78rem;cursor:pointer;border-radius:0" data-go="backrooms_next">[ return ]</button>' +
      '</div>' + exitInput;
  } else {
    inner = roomLabel() +
      '<div style="margin-bottom:1.75rem">' + btn('') + '</div>' + exitInput;
  }
  return wrap(inner);
}

function scene_backrooms_enter() {
  incDepth();
  S.brVisited = true;
  S.brRoom = 0;
  S.brUrlPath = '';
  if (S.exportGlitchTimer) { clearTimeout(S.exportGlitchTimer); S.exportGlitchTimer = null; }
  document.body.classList.remove('br-mode', 'br-deep');
  setOverlay('');

  if (navigator.getBattery) {
    navigator.getBattery().then(function(b) {
      S.brBattery = { level: Math.round(b.level * 100), charging: b.charging };
    }).catch(function() { S.brBattery = null; });
  }

  try { history.replaceState(null, '', '/dashboard/export/diagnostic'); } catch(e) {}

  root.innerHTML = `<div style="min-height:100vh;background:#111;display:flex;align-items:center;justify-content:center;font-family:'Courier New',monospace">
    <div style="color:#2a2a2a;max-width:420px;width:100%;padding:2rem">
      <div style="font-size:.62rem;letter-spacing:.1em;margin-bottom:1.5rem;color:#1e1e1e">NEXUS DIAGNOSTIC CONSOLE v0.1 — INITIALIZING</div>
      <div id="br-init-log" style="line-height:2.2;font-size:.78rem"></div>
    </div>
  </div>`;
  const log = document.getElementById('br-init-log');
  const lines = [
    { t: '> connecting to export service…', c: '#2a2a2a' },
    { t: '> connection established', c: '#2a2a2a' },
    { t: '> fetching export manifest…', c: '#2a2a2a' },
    { t: '> warning: manifest malformed', c: '#4a3030' },
    { t: '> attempting repair…', c: '#2a2a2a' },
    { t: '> repair failed', c: '#5a2a2a' },
    { t: '> fallback mode: enabled', c: '#2a2a2a' },
    { t: '> client identified: ' + brBrowserName() + ' / ' + navigator.platform, c: '#333' },
    { t: '> viewport: ' + window.innerWidth + '\xd7' + window.innerHeight, c: '#333' },
    { t: '> locating file system root…', c: '#2a2a2a' },
    { t: '> root not found', c: '#444' },
    { t: '> root not found', c: '#555' },
    { t: '> root not found', c: '#666' },
    { t: '> descending…', c: '#888' },
  ];
  let i = 0;
  const iv = setInterval(function() {
    if (!log || !log.isConnected) { clearInterval(iv); return; }
    const el = document.createElement('div');
    el.textContent = lines[i].t;
    el.style.color = lines[i].c;
    log.appendChild(el);
    i++;
    if (i >= lines.length) { clearInterval(iv); setTimeout(function() { scene_backrooms(1); }, 700); }
  }, 210);
}

function scene_backrooms(roomArg) {
  incDepth();
  S.brRoom = roomArg;
  const slot = ((roomArg - 1) % 100) + 1;
  const stage = slot <= 25 ? 1 : slot <= 50 ? 2 : slot <= 75 ? 3 : 4;
  const displayNum = (roomArg + Math.floor((roomArg - 1) / 100) * 950000).toString().padStart(5, '0');

  document.body.classList.toggle('br-mode', stage >= 2);
  document.body.classList.toggle('br-deep', stage >= 4);
  setOverlay('');

  // title creep
  var sessionHex = brHex(Math.floor(performance.now()), 6);
  if (stage === 1) {
    if (slot <= 8) document.title = 'Nexus — Dashboard';
    else if (slot <= 15) document.title = 'Nexus — Diagnostic Console';
    else if (slot <= 22) document.title = 'Nexus — session/' + sessionHex;
    else document.title = sessionHex;
  } else if (stage === 2) {
    document.title = sessionHex + ' — active';
  } else if (stage === 3) {
    document.title = sessionHex;
  } else {
    document.title = '';
  }

  // filter creep (stage 1 only — subtle saturation/brightness drain)
  if (stage === 1) {
    var sat = Math.round(100 - slot * 1.4);
    var bri = Math.round(100 - slot * 0.35);
    document.body.style.filter = 'saturate(' + sat + '%) brightness(' + bri + '%)';
  } else {
    document.body.style.filter = '';
  }

  // font creep (stage 1, slots 10+)
  document.body.classList.remove('br-fc-1', 'br-fc-2', 'br-fc-3');
  if (stage === 1) {
    if (slot >= 22) document.body.classList.add('br-fc-3');
    else if (slot >= 16) document.body.classList.add('br-fc-2');
    else if (slot >= 10) document.body.classList.add('br-fc-1');
  }

  brBuildUrl(stage, slot, roomArg);

  if (stage === 1) {
    root.innerHTML = brStage1(slot, displayNum, roomArg);
  } else if (stage === 2) {
    root.innerHTML = brStage2(slot, displayNum, roomArg);
  } else if (stage === 3) {
    root.innerHTML = brStage3(slot, displayNum, roomArg);
  } else {
    root.innerHTML = brStage4(slot, displayNum, roomArg);
  }
}

function scene_backrooms_next() {
  scene_backrooms(S.brRoom + 1);
}

function scene_backrooms_exit() {
  document.body.classList.remove('br-mode', 'br-deep', 'br-fc-1', 'br-fc-2', 'br-fc-3');
  document.body.style.filter = '';
  document.title = 'Nexus';
  S.exportRequested = false;
  setOverlay('');
  try { history.replaceState(null, '', '/'); } catch(e) {}
  toast('📦 Export complete. 1 file downloaded.');
  setTimeout(function() { scene_dashboard(); }, 800);
}

