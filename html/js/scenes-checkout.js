function scene_contact_sales() {
  root.innerHTML = navHTML() + `
  <div style="max-width:520px;margin:4rem auto;padding:2rem 1.5rem">
    <div class="section-label">Enterprise</div>
    <h1 style="font-size:1.75rem;font-weight:700;margin-bottom:.5rem">Talk to Sales</h1>
    <p style="font-size:.875rem;color:var(--g500);margin-bottom:2rem">Fill out this form and a member of our team will reach out within 1–2 business weeks.</p>
    <div class="form-group"><label>Full name <span style="color:var(--red)">*</span></label><input type="text" id="cs-name" placeholder="Full name"></div>
    <div class="form-group"><label>Work email <span style="color:var(--red)">*</span></label><input type="email" id="cs-email" placeholder="you@company.com"></div>
    <div class="form-group"><label>Company name <span style="color:var(--red)">*</span></label><input type="text" id="cs-company" placeholder="Company name"></div>
    <div class="form-group"><label>Phone number <span style="color:var(--red)">*</span></label><input type="tel" id="cs-phone" placeholder="+1 (555) 000-0000"></div>
    <div class="form-group"><label>Number of employees <span style="color:var(--red)">*</span></label>
      <select id="cs-size"><option value="">— Select —</option>${['1–10','11–50','51–200','201–1000','1001+'].map(o=>`<option>${o}</option>`).join('')}</select>
    </div>
    <div class="form-group"><label>What are you trying to achieve? <span style="color:var(--red)">*</span></label><textarea id="cs-goal" style="min-height:80px" placeholder="Describe your use case (minimum 20 words)"></textarea></div>
    <div id="cs-err"></div>
    <div class="alert alert-info" style="font-size:.8rem;margin-bottom:1.25rem">
      📅 Our team is currently experiencing high volume. Expected response time: <strong>7–10 business days</strong>.
    </div>
    <button class="btn btn-primary" style="width:100%" onclick="scene_contact_sales_validate()">Submit Request →</button>
  </div>
  ${footerHTML()}`;
  setOverlay('');
}

const PERSONAL_DOMAINS = ['gmail.com','yahoo.com','hotmail.com','outlook.com','icloud.com','aol.com','protonmail.com','mail.com','live.com','msn.com'];

function scene_contact_sales_validate() {
  const name  = (document.getElementById('cs-name')  || {}).value || '';
  const email = (document.getElementById('cs-email') || {}).value || '';
  const company = (document.getElementById('cs-company') || {}).value || '';
  const phone = (document.getElementById('cs-phone') || {}).value || '';
  const size  = (document.getElementById('cs-size')  || {}).value || '';
  const goal  = (document.getElementById('cs-goal')  || {}).value || '';
  const err   = document.getElementById('cs-err');

  const showErr = msg => { if(err) err.innerHTML = `<div class="alert" style="background:#f8d7da;border:1px solid #dc3545;border-radius:8px;padding:.65rem .85rem;font-size:.8rem;color:#721c24;margin-bottom:.75rem">${msg}</div>`; };

  if(!name.trim())   { showErr('Please enter your full name.'); return; }
  if(!email.trim())  { showErr('Please enter your work email address.'); return; }
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showErr('Please enter a valid email address.'); return; }
  const domain = email.split('@')[1].toLowerCase();
  if(PERSONAL_DOMAINS.includes(domain)) { showErr(`Personal email addresses are not accepted. Please use your work email (not ${domain}).`); return; }
  if(!company.trim()) { showErr('Please enter your company name.'); return; }
  if(!phone.trim())   { showErr('Please enter a phone number.'); return; }
  if(!/[\d\s\-\+\(\)]{7,}/.test(phone)) { showErr('Please enter a valid phone number.'); return; }
  if(!size)           { showErr('Please select your company size.'); return; }
  const words = goal.trim().split(/\s+/).filter(Boolean).length;
  if(words < 20)      { showErr(`Please describe your use case in at least 20 words (${words} entered).`); return; }

  scene_contact_sales_sent();
}

function scene_contact_sales_sent() {
  root.innerHTML = navHTML() + `
  <div style="max-width:460px;margin:6rem auto;padding:2rem 1.5rem;text-align:center">
    <div style="font-size:2.5rem;margin-bottom:1rem">📬</div>
    <h2 style="font-weight:700;margin-bottom:.5rem">Request received!</h2>
    <p style="color:var(--g500);font-size:.9rem;margin-bottom:.75rem;line-height:1.5">We'll be in touch within 1–2 business weeks. In the meantime, have you considered the Pro plan?</p>
    <div style="display:flex;gap:.75rem;justify-content:center;margin-top:1.5rem">
      <button class="btn btn-primary" data-go="pricing">View Pro Plan</button>
      <button class="btn btn-secondary" data-go="main">Back to Home</button>
    </div>
  </div>
  ${footerHTML()}`;
}

// ────────────────────────── CHECKOUT ──────────────────────────

function scene_checkout() {
  incDepth();
  setOverlay('');
  S.checkoutBilling = S.checkoutBilling || 'annual';
  S.checkoutSeats = Math.max(3, S.checkoutSeats || 3);
  S.checkoutPromoAttempts = S.checkoutPromoAttempts || 0;

  const base = S.checkoutBilling === 'annual' ? 49 : 79;
  const ADDONS = [
    { name:'Priority Support Pack', price:15, note:'Required by Terms of Service for all paid accounts' },
    { name:'Advanced Security Suite', price:12, note:'Required for GDPR & SOC2 compliance' },
    { name:'Backup & Recovery Plus', price:8,  note:'Auto-enrolled at workspace creation' },
    { name:'Nexus Assist AI™', price:19, note:'Selected during onboarding — cannot be removed' },
    { name:'Onboarding Concierge', price:5,  note:'Strongly recommended for new workspaces' },
  ];
  const addonTotal = ADDONS.reduce((s,a) => s+a.price, 0);
  const perSeat = base + addonTotal;
  const monthly = perSeat * S.checkoutSeats;
  const promoMsg = S.checkoutPromoAttempts > 0
    ? `<div style="font-size:.75rem;color:var(--red);margin-top:.3rem">❌ Code invalid or expired.</div>` : '';

  root.innerHTML = navHTML() + `
  <div style="max-width:760px;margin:3rem auto;padding:0 1.5rem 4rem">
    <div style="font-size:.75rem;color:var(--g400);margin-bottom:.75rem"><a data-go="pricing" style="cursor:pointer;color:var(--blue)">Pricing</a> › Checkout</div>
    <h1 style="font-size:1.5rem;font-weight:700;margin-bottom:2rem">Complete your upgrade</h1>
    <div style="display:grid;grid-template-columns:1fr 320px;gap:2rem;align-items:start">
      <div>
        <div style="background:#fff;border:1px solid var(--g200);border-radius:12px;padding:1.5rem;margin-bottom:1.25rem">
          <div style="font-weight:600;font-size:.95rem;margin-bottom:1rem">Billing period</div>
          <div style="display:flex;gap:.5rem">
            <button onclick="S.checkoutBilling='annual';scene_checkout()" style="flex:1;padding:.6rem;border-radius:8px;cursor:pointer;font-size:.85rem;border:2px solid ${S.checkoutBilling==='annual'?'var(--blue)':'var(--g200)'};background:${S.checkoutBilling==='annual'?'#EFF6FF':'#fff'};font-weight:${S.checkoutBilling==='annual'?700:400}">
              Annual <span style="font-size:.7rem;background:#dcfce7;color:#166534;border-radius:4px;padding:.1rem .35rem;margin-left:.25rem">Save 38%</span>
            </button>
            <button onclick="S.checkoutBilling='monthly';scene_checkout()" style="flex:1;padding:.6rem;border-radius:8px;cursor:pointer;font-size:.85rem;border:2px solid ${S.checkoutBilling==='monthly'?'var(--blue)':'var(--g200)'};background:${S.checkoutBilling==='monthly'?'#EFF6FF':'#fff'};font-weight:${S.checkoutBilling==='monthly'?700:400}">
              Monthly
            </button>
          </div>
          ${S.checkoutBilling==='monthly'?`<div style="font-size:.72rem;color:var(--red);margin-top:.5rem">⚠ Monthly billing includes a $30/seat/month flexibility surcharge.</div>`:''}
        </div>
        <div style="background:#fff;border:1px solid var(--g200);border-radius:12px;padding:1.5rem;margin-bottom:1.25rem">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.75rem">
            <div style="font-weight:600;font-size:.95rem">Seats</div>
            <div style="font-size:.75rem;color:var(--g400)">Minimum 3 seats required on Pro plan</div>
          </div>
          <div style="display:flex;align-items:center;gap:.75rem">
            <button onclick="S.checkoutSeats=Math.max(3,S.checkoutSeats-1);scene_checkout()" style="width:32px;height:32px;border:1px solid var(--g200);border-radius:6px;cursor:pointer;font-size:1.1rem;background:#fff">−</button>
            <span style="font-size:1.1rem;font-weight:700;min-width:2rem;text-align:center">${S.checkoutSeats}</span>
            <button onclick="S.checkoutSeats++;scene_checkout()" style="width:32px;height:32px;border:1px solid var(--g200);border-radius:6px;cursor:pointer;font-size:1.1rem;background:#fff">+</button>
            <span style="font-size:.78rem;color:var(--g400)">seats × $${perSeat}/mo = <strong>$${monthly}/mo</strong></span>
          </div>
        </div>
        <div style="background:#fff;border:1px solid var(--g200);border-radius:12px;padding:1.5rem;margin-bottom:1.25rem">
          <div style="font-weight:600;font-size:.95rem;margin-bottom:.15rem">Required services</div>
          <div style="font-size:.72rem;color:var(--g500);margin-bottom:1rem">These services are required and cannot be removed from your plan.</div>
          ${ADDONS.map(a=>`
            <div style="display:flex;align-items:flex-start;gap:.75rem;padding:.6rem 0;border-bottom:1px solid var(--g100)">
              <input type="checkbox" checked disabled style="margin-top:.2rem;accent-color:var(--blue)">
              <div style="flex:1">
                <div style="font-size:.85rem;font-weight:500">${a.name} <span style="font-size:.65rem;background:#f3f4f6;color:var(--g500);border-radius:4px;padding:.1rem .35rem;margin-left:.2rem">Required</span></div>
                <div style="font-size:.7rem;color:var(--g400);margin-top:.1rem">${a.note}</div>
              </div>
              <div style="font-size:.85rem;font-weight:600;color:var(--g700);white-space:nowrap">+$${a.price}/seat</div>
            </div>`).join('')}
        </div>
        <div style="background:#fff;border:1px solid var(--g200);border-radius:12px;padding:1.5rem">
          <div style="font-weight:600;font-size:.95rem;margin-bottom:.75rem">Promo code</div>
          <div style="display:flex;gap:.5rem">
            <input type="text" id="promo-input" placeholder="Enter code" style="flex:1;font-size:.875rem">
            <button class="btn btn-secondary btn-sm" onclick="S.checkoutPromoAttempts++;scene_checkout()">Apply</button>
          </div>
          ${promoMsg}
        </div>
      </div>
      <div style="position:sticky;top:1.5rem">
        <div style="background:#fff;border:1px solid var(--g200);border-radius:12px;padding:1.5rem">
          <div style="font-weight:600;font-size:.95rem;margin-bottom:1rem">Order summary</div>
          <div style="display:flex;justify-content:space-between;font-size:.82rem;color:var(--g600);padding:.3rem 0">
            <span>Pro plan (${S.checkoutBilling})</span><span>$${base}/seat</span>
          </div>
          ${ADDONS.map(a=>`
          <div style="display:flex;justify-content:space-between;font-size:.82rem;color:var(--g600);padding:.3rem 0">
            <span>${a.name}</span><span>$${a.price}/seat</span>
          </div>`).join('')}
          <div style="border-top:1px solid var(--g200);margin:.75rem 0;padding-top:.75rem">
            <div style="display:flex;justify-content:space-between;font-size:.82rem;color:var(--g600);padding:.2rem 0">
              <span>Subtotal (${S.checkoutSeats} seats)</span><span>$${monthly}/mo</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:.82rem;color:var(--g600);padding:.2rem 0">
              <span>VAT / tax (estimated)</span><span>$${Math.round(monthly*.2)}/mo</span>
            </div>
          </div>
          <div style="border-top:2px solid var(--g900);padding-top:.75rem;display:flex;justify-content:space-between;font-weight:700;font-size:1rem">
            <span>Total</span><span>$${monthly + Math.round(monthly*.2)}/mo</span>
          </div>
          ${S.checkoutBilling==='annual'?`<div style="font-size:.7rem;color:var(--g400);margin-top:.3rem;text-align:right">Billed as $${(monthly+Math.round(monthly*.2))*12}/year</div>`:''}
          <button class="btn btn-primary" style="width:100%;margin-top:1.25rem" data-go="checkout_billing">Continue to Billing →</button>
          <div style="font-size:.68rem;color:var(--g300);text-align:center;margin-top:.65rem;line-height:1.4">By continuing you agree to the Terms of Service, Data Processing Agreement, Billing Policy, Fair Use Policy, and all 14 supplementary service agreements.</div>
        </div>
      </div>
    </div>
  </div>
  ${footerHTML()}`;
}

function scene_checkout_billing() {
  setOverlay('');
  const base = S.checkoutBilling === 'annual' ? 49 : 79;
  const perSeat = base + 59;
  const monthly = (perSeat * S.checkoutSeats);
  root.innerHTML = navHTML() + `
  <div style="max-width:560px;margin:3rem auto;padding:0 1.5rem 4rem">
    <div style="font-size:.75rem;color:var(--g400);margin-bottom:.75rem"><a data-go="pricing" style="cursor:pointer;color:var(--blue)">Pricing</a> › <a data-go="checkout" style="cursor:pointer;color:var(--blue)">Checkout</a> › Billing</div>
    <h1 style="font-size:1.5rem;font-weight:700;margin-bottom:.4rem">Billing information</h1>
    <p style="color:var(--g500);font-size:.875rem;margin-bottom:2rem">This information will appear on your invoices.</p>
    <div class="form-group"><label style="color:var(--g700)">Full legal name <span style="color:var(--red)">*</span></label><input type="text" id="cb-name" placeholder="Full legal name"></div>
    <div class="form-group"><label style="color:var(--g700)">Company / organization name <span style="color:var(--red)">*</span></label><input type="text" id="cb-company" placeholder="Company / organization name"></div>
    <div class="form-group"><label style="color:var(--g700)">Billing address line 1 <span style="color:var(--red)">*</span></label><input type="text" id="cb-addr1" placeholder="Street address"></div>
    <div class="form-group"><label style="color:var(--g700)">Billing address line 2 (optional)</label><input type="text" placeholder="Apt, suite, unit…"></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem">
      <div class="form-group"><label style="color:var(--g700)">City <span style="color:var(--red)">*</span></label><input type="text" id="cb-city" placeholder="City"></div>
      <div class="form-group"><label style="color:var(--g700)">ZIP / Postal code <span style="color:var(--red)">*</span></label><input type="text" id="cb-zip" placeholder="ZIP / Postal code"></div>
    </div>
    <div class="form-group"><label style="color:var(--g700)">State / Province</label><input type="text" placeholder="State / Province"></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem">
      <div class="form-group"><label style="color:var(--g700)">Country <span style="color:var(--red)">*</span></label>
        <select id="cb-country"><option value="">— Select —</option><option>United States</option><option>United Kingdom</option><option>Canada</option><option>Germany</option><option>Other</option></select>
      </div>
      <div class="form-group"><label style="color:var(--g700)">VAT / Tax ID</label>
        <input type="text" placeholder="e.g. EU123456789">
      </div>
    </div>
    <div style="background:#fff8e1;border:1px solid #ffc107;border-radius:8px;padding:.75rem 1rem;font-size:.78rem;color:#856404;margin-bottom:1.25rem">
      ⚠ <strong>VAT notice:</strong> If a valid VAT ID is not provided, applicable local tax (up to 25%) will be added to your invoice automatically.
    </div>
    <div class="form-group">
      <label style="color:var(--g700)">Purchase Order number <span style="color:var(--red)">*</span></label>
      <input type="text" id="cb-po" placeholder="e.g. PO-2026-00142">
      <span class="field-note">Orders over $500/month require a PO number. Your order total is $${monthly + Math.round(monthly*.2)}/mo.</span>
    </div>
    <div style="background:#f8f9fa;border:1px solid var(--g200);border-radius:8px;padding:.65rem 1rem;font-size:.75rem;color:var(--g500);margin-bottom:.75rem;display:flex;align-items:flex-start;gap:.5rem">
      <input type="checkbox" id="no-po" style="margin-top:.1rem;accent-color:var(--blue)">
      <label for="no-po">I confirm my organization does not issue Purchase Orders. I understand this may delay invoice processing by 10–15 business days.</label>
    </div>
    <div id="cb-err" style="margin-bottom:.75rem"></div>
    <button class="btn btn-primary" style="width:100%" onclick="scene_checkout_billing_submit()">Continue to Payment →</button>
  </div>
  ${footerHTML()}`;
}

function scene_checkout_billing_submit() {
  const g = id => ((document.getElementById(id) || {}).value || '').trim();
  const err = document.getElementById('cb-err');
  const showErr = msg => { if(err) err.innerHTML = `<div style="background:#f8d7da;border:1px solid #dc3545;border-radius:8px;padding:.65rem .85rem;font-size:.8rem;color:#721c24">${msg}</div>`; };
  if(!g('cb-name'))    { showErr('Please enter your full legal name.'); return; }
  if(!g('cb-company')) { showErr('Please enter your company or organization name.'); return; }
  if(!g('cb-addr1'))   { showErr('Please enter your billing address.'); return; }
  if(!g('cb-city'))    { showErr('Please enter your city.'); return; }
  if(!g('cb-zip'))     { showErr('Please enter your ZIP or postal code.'); return; }
  if(!g('cb-country')) { showErr('Please select your country.'); return; }
  const noPo = (document.getElementById('no-po') || {}).checked;
  if(!noPo && !g('cb-po')) { showErr('A Purchase Order number is required for your order size. If your organization does not issue POs, check the box below.'); return; }
  scene_checkout_payment();
}

function scene_checkout_payment() {
  setOverlay('');
  S.checkoutPayAttempts = S.checkoutPayAttempts || 0;
  const ERRORS = [
    null,
    { code:'INSUFFICIENT_FUNDS', msg:'Your card was declined. This is often due to insufficient funds or a spending limit.' },
    { code:'DO_NOT_HONOR', msg:'Payment declined by your issuing bank. Please contact your bank or try a different card.' },
    { code:'VELOCITY_EXCEEDED', msg:'Transaction blocked. Too many attempts in a short period. Please wait 24 hours before retrying.' },
  ];
  const err = ERRORS[Math.min(S.checkoutPayAttempts, 3)];
  const errHTML = err
    ? `<div style="background:#f8d7da;border:1px solid #dc3545;border-radius:8px;padding:.75rem 1rem;font-size:.8rem;color:#721c24;margin-bottom:1rem">
        ❌ <strong>Payment failed.</strong> ${err.msg} <span style="opacity:.6">(${err.code})</span>
      </div>` : '';
  const altLink = S.checkoutPayAttempts >= 3
    ? `<div style="text-align:center;margin-top:1rem"><a data-go="checkout_alt" style="font-size:.78rem;color:var(--blue);cursor:pointer;text-decoration:underline">Try another payment method</a></div>`
    : '';
  root.innerHTML = navHTML() + `
  <div style="max-width:480px;margin:3rem auto;padding:0 1.5rem 4rem">
    <div style="font-size:.75rem;color:var(--g400);margin-bottom:.75rem"><a data-go="pricing" style="cursor:pointer;color:var(--blue)">Pricing</a> › <a data-go="checkout" style="cursor:pointer;color:var(--blue)">Checkout</a> › Payment</div>
    <h1 style="font-size:1.5rem;font-weight:700;margin-bottom:.4rem">Payment details</h1>
    <p style="color:var(--g500);font-size:.875rem;margin-bottom:1.75rem">Your card will be charged immediately upon confirmation.</p>
    ${errHTML}
    <div class="form-group">
      <label style="color:var(--g700)">Card number <span style="color:var(--red)">*</span></label>
      <input type="text" id="card-num" placeholder="1234 5678 9012 3456" maxlength="19">
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem">
      <div class="form-group"><label style="color:var(--g700)">Expiry <span style="color:var(--red)">*</span></label><input type="text" id="card-exp" placeholder="MM/YY" maxlength="5"></div>
      <div class="form-group"><label style="color:var(--g700)">CVC <span style="color:var(--red)">*</span></label><input type="text" id="card-cvc" placeholder="123" maxlength="4"></div>
    </div>
    <div class="form-group" style="margin-bottom:1.5rem">
      <label style="color:var(--g700)">Name on card <span style="color:var(--red)">*</span></label>
      <input type="text" id="card-name" placeholder="As it appears on your card">
    </div>
    <div style="display:flex;align-items:flex-start;gap:.6rem;margin-bottom:1.5rem;font-size:.75rem;color:var(--g500)">
      <input type="checkbox" id="pay-save" checked style="margin-top:.1rem;accent-color:var(--blue)">
      <label for="pay-save">Save this card for automatic renewal and future charges. Removing a saved card may pause your subscription.</label>
    </div>
    <button class="btn btn-primary" id="pay-btn" style="width:100%" onclick="scene_checkout_pay_submit()">Pay now →</button>
    ${altLink}
    <div style="font-size:.68rem;color:var(--g300);text-align:center;margin-top:.75rem;line-height:1.5">Payments processed by NexusPay™. By paying you authorize recurring charges until cancelled. Cancellation requires 30 days written notice.</div>
  </div>
  ${footerHTML()}`;
}

function scene_checkout_pay_submit() {
  const numRaw = (document.getElementById('card-num') || {}).value || '';
  const exp    = (document.getElementById('card-exp') || {}).value || '';
  const cvc    = (document.getElementById('card-cvc') || {}).value || '';
  const name   = (document.getElementById('card-name') || {}).value || '';
  const digits = numRaw.replace(/\s/g,'');
  if(!digits)               { toast('Please enter your card number.'); return; }
  if(!/^\d{16}$/.test(digits)) { toast('Card number must be 16 digits.'); return; }
  if(!exp.trim())           { toast('Please enter the expiry date.'); return; }
  if(!/^(0[1-9]|1[0-2])\/\d{2}$/.test(exp.trim())) { toast('Expiry must be in MM/YY format.'); return; }
  const [mm,yy] = exp.trim().split('/').map(Number);
  const now = new Date(); const nowYY = now.getFullYear()%100; const nowMM = now.getMonth()+1;
  if(yy < nowYY || (yy === nowYY && mm < nowMM)) { toast('Your card has expired.'); return; }
  if(!cvc.trim())           { toast('Please enter the CVC.'); return; }
  if(!/^\d{3,4}$/.test(cvc.trim())) { toast('CVC must be 3 or 4 digits.'); return; }
  if(!name.trim())          { toast('Please enter the name on your card.'); return; }
  const btn = document.getElementById('pay-btn');
  if(btn) { btn.textContent = 'Processing…'; btn.disabled = true; }
  setTimeout(() => {
    S.checkoutPayAttempts = (S.checkoutPayAttempts || 0) + 1;
    scene_checkout_payment();
  }, 2200);
}

function scene_checkout_alt() {
  setOverlay('');
  root.innerHTML = navHTML() + `
  <div style="max-width:520px;margin:3rem auto;padding:0 1.5rem 4rem">
    <div style="font-size:.75rem;color:var(--g400);margin-bottom:.75rem"><a data-go="pricing" style="cursor:pointer;color:var(--blue)">Pricing</a> › <a data-go="checkout" style="cursor:pointer;color:var(--blue)">Checkout</a> › Alternative Payment</div>
    <h1 style="font-size:1.5rem;font-weight:700;margin-bottom:.4rem">Alternative payment methods</h1>
    <p style="color:var(--g500);font-size:.875rem;margin-bottom:2rem">Your card was declined 3 times. Please choose an alternative method below.</p>
    <div style="display:flex;flex-direction:column;gap:.75rem">
      <div style="border:1px solid var(--g200);border-radius:10px;padding:1.1rem 1.25rem">
        <div style="font-weight:600;font-size:.9rem;margin-bottom:.3rem">🏦 Wire transfer / ACH</div>
        <div style="font-size:.78rem;color:var(--g500);margin-bottom:.6rem;line-height:1.5">Transfers take 10–15 business days to clear. Your subscription will activate once funds are received. Minimum transfer: $500.</div>
        <button class="btn btn-secondary btn-sm" onclick="scene_checkout_wire()">Get wire instructions</button>
      </div>
      <div style="border:1px solid var(--g200);border-radius:10px;padding:1.1rem 1.25rem">
        <div style="font-weight:600;font-size:.9rem;margin-bottom:.3rem">📄 Pay by invoice</div>
        <div style="font-size:.78rem;color:var(--g500);line-height:1.5">Available for annual contracts only. Requires signed Master Service Agreement, a minimum of 10 seats, and Net-30 payment terms approval from our finance team.</div>
      </div>
      <div style="border:1px solid var(--g200);border-radius:10px;padding:1.1rem 1.25rem;opacity:.6">
        <div style="font-weight:600;font-size:.9rem;margin-bottom:.3rem">💙 PayPal</div>
        <div style="font-size:.78rem;color:var(--red)">❌ PayPal is temporarily unavailable. (Error: PP_MERCHANT_NOT_FOUND_404)</div>
      </div>
      <div style="border:1px solid var(--g200);border-radius:10px;padding:1.1rem 1.25rem">
        <div style="font-weight:600;font-size:.9rem;margin-bottom:.3rem">💳 Nexus Credits</div>
        <div style="font-size:.78rem;color:var(--g500)">Your credit balance: <strong>$0.00</strong></div>
      </div>
    </div>
    <div style="margin-top:1.5rem;text-align:center">
      <a data-go="contact_sales" style="font-size:.8rem;color:var(--blue);cursor:pointer;text-decoration:underline">Contact our billing team for help</a>
    </div>
  </div>
  ${footerHTML()}`;
}

function scene_checkout_wire() {
  toast('Wire instructions sent to your billing email. Allow 1–2 business days to receive them.');
  setTimeout(() => toast('Note: Your cart will expire in 24 hours if payment is not received.'), 2000);
}

