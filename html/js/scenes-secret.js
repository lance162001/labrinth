function scene_secret_site() {
  clearSocialProof();
  removeChatBtn();
  document.querySelector('.depth-pill')?.remove();
  setOverlay('');
  root.innerHTML = `
  <div style="min-height:100vh;background:#0a0a0f;display:flex;align-items:center;justify-content:center;font-family:'Courier New',monospace">
    <div style="max-width:480px;padding:3rem;text-align:center">
      <div style="font-size:.55rem;color:#1a1a2e;letter-spacing:.22em;margin-bottom:3rem;text-transform:uppercase">Access Granted</div>
      <div style="font-size:1rem;color:#3a3a5e;line-height:2.2;margin-bottom:3rem">you found it.</div>
      <div style="font-size:.52rem;color:#111122;letter-spacing:.12em">more soon.</div>
    </div>
  </div>`;
}
