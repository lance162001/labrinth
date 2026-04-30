function scene_secret_site() {
  clearSocialProof();
  removeChatBtn();
  document.querySelector('.depth-pill')?.remove();
  setOverlay('');
  root.innerHTML = `
  <div style="min-height:100vh;background:#08080e;display:flex;align-items:center;justify-content:center;font-family:'Courier New',monospace">
    <div style="max-width:480px;padding:3rem;text-align:center">
      <div style="font-size:.55rem;color:#1a1a2e;letter-spacing:.22em;margin-bottom:3rem;text-transform:uppercase">Access Granted</div>
      <div style="font-size:1rem;color:#3a3a5e;line-height:2.2;margin-bottom:3rem">you found it.</div>
      <div id="ss-status" style="font-size:.52rem;color:#1a1a38;letter-spacing:.12em">connecting to tower</div>
    </div>
  </div>`;

  sessionStorage.setItem('nexus_tower_access', '1');

  const el = document.getElementById('ss-status');
  const frames = [
    'connecting to tower.',
    'connecting to tower..',
    'connecting to tower...',
    'connecting to tower',
    'connecting to tower.',
    'connecting to tower..',
  ];
  let i = 0;
  const iv = setInterval(() => {
    el.textContent = frames[i++ % frames.length];
    el.style.color = '#2a2a48';
  }, 400);

  setTimeout(() => {
    clearInterval(iv);
    window.location.href = '/secret.html';
  }, 2400);
}
