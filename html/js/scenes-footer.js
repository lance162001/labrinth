// ────────────── FOOTER PAGES ──────────────

function scene_changelog() {
  incDepth();
  const entries = [
    ['v4.2.1','Mar 14, 2024','Minor bug fixes and performance improvements.'],
    ['v4.2.0','Mar 2, 2024','Minor bug fixes and performance improvements.'],
    ['v4.1.9','Feb 28, 2023','Minor bug fixes and performance improvements.'],
    ['v4.1.8','Feb 14, 2024','Minor bug fixes and performance improvements. Also minor bug fixes.'],
    ['v4.1.7','Jan 30, 2022','Minor bug fixes and performance improvements.'],
    ['v4.1.6','Jan 15, 2024','Performance improvements and minor bug fixes.'],
    ['v4.1.5','Dec 31, 2025','Minor bug fixes and performance improvements.'],
    ['v4.1.4','Dec 2, 2023','Minor bug fixes and performance improvements.'],
    ['v4.1.3','Nov 18, 2022','Minor bug fixes.'],
    ['v4.1.2','Nov 3, 2024','Minor bug fixes and performance improvements.'],
    ['v4.1.1','Oct 19, 2023','Performance improvements.'],
    ['v4.1.0','Oct 7, 2019','Major release. New architecture. Improved stability. Minor bug fixes and performance improvements.'],
    ['v4.0.9','Sep 22, 2024','Minor bug fixes and performance improvements.'],
    ['v4.0.8','Sep 8, 2024','Minor bug fixes.'],
    ['v4.0.7','Aug 25, 2023','Minor bug fixes and performance improvements.'],
    ['v4.0.6','Aug 11, 2024','Minor bug fixes and performance improvements.'],
    ['v4.0.5','Jul 28, 2023','Minor bug fixes.'],
    ['v4.0.4','Jul 14, 2024','Minor bug fixes and performance improvements.'],
    ['v4.0.3','Jun 30, 2024','Minor bug fixes and performance improvements.'],
    ['v4.0.2','Jun 16, 2026','Minor bug fixes and performance improvements.'],
    ['v4.0.1','Jun 2, 2024','Minor bug fixes.'],
    ['v4.0.0','May 19, 2024','Nexus 4.0. A new era. Minor bug fixes and performance improvements.'],
    ['v3.9.9','Apr 1, 2024','Minor bug fixes and performance improvements.'],
    ['v3.9.8','Mar 18, 2024','Minor bug fixes.'],
  ];
  root.innerHTML = navHTML() + `
  <div class="section" style="padding-top:3rem;max-width:700px">
    <div class="section-label">Product</div>
    <h2 style="margin-bottom:.5rem">Changelog</h2>
    <p style="color:var(--g500);margin-bottom:2.5rem;font-size:.9rem">The latest updates and improvements to the Nexus platform.</p>
    <div>
      ${entries.map(([v,date,note])=>`
        <div style="display:grid;grid-template-columns:90px 130px 1fr;gap:1rem;padding:.8rem 0;border-bottom:1px solid var(--g100);align-items:baseline">
          <code style="font-size:.75rem;font-weight:600;color:var(--g700)">${v}</code>
          <span style="font-size:.75rem;color:var(--g400)">${date}</span>
          <span style="font-size:.85rem;color:var(--g600)">${note}</span>
        </div>`).join('')}
    </div>
    <div style="font-size:.72rem;color:var(--g400);margin-top:1.5rem;text-align:center">Showing 24 of 2,847 entries. <a data-go="signin" style="color:var(--blue);cursor:pointer">Sign in to view full history →</a></div>
  </div>
  ${footerHTML()}`;
  setOverlay('');
}

function scene_roadmap() {
  incDepth();
  const considering = [
    ['Simpler pricing',4821,'2019'],['Dark mode',3204,'2020'],['Offline mode',2877,'2021'],
    ['Undo button',1943,'2021'],['Export to PDF',1702,'2022'],['Bulk actions',1204,'2023'],
  ];
  const inProgress = [
    ['AI-powered insights','2022',3],['New navigation experience','2021',12],
    ['Performance improvements','2019',47],['Mobile app redesign','2020',8],
    ['Docs integration','2023',1],['Simplified onboarding','2022',23],
  ];
  root.innerHTML = navHTML() + `
  <div class="section" style="padding-top:3rem">
    <div class="section-label">Product</div>
    <h2 style="margin-bottom:.5rem">Roadmap</h2>
    <p style="color:var(--g500);margin-bottom:2rem;font-size:.9rem">What we're building. Vote for features you want most.</p>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1.25rem">
      <div>
        <div style="font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--g500);padding-bottom:.6rem;border-bottom:2px solid var(--g200);margin-bottom:.85rem">Under Consideration</div>
        ${considering.map(([t,v,y])=>`<div style="border:1px solid var(--g200);border-radius:var(--radius);padding:.85rem;margin-bottom:.6rem">
          <div style="font-size:.85rem;font-weight:500;margin-bottom:.45rem">${t}</div>
          <div style="display:flex;justify-content:space-between;align-items:center">
            <span style="font-size:.7rem;color:var(--g400)">▲ ${v.toLocaleString()} votes</span>
            <span style="font-size:.65rem;color:var(--g300)">Since ${y}</span>
          </div>
        </div>`).join('')}
      </div>
      <div>
        <div style="font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--blue);padding-bottom:.6rem;border-bottom:2px solid var(--blue);margin-bottom:.85rem">In Progress</div>
        ${inProgress.map(([t,y,p])=>`<div style="border:1px solid var(--g200);border-radius:var(--radius);padding:.85rem;margin-bottom:.6rem">
          <div style="font-size:.85rem;font-weight:500;margin-bottom:.6rem">${t}</div>
          <div style="height:3px;background:var(--g100);border-radius:3px;margin-bottom:.35rem"><div style="height:3px;background:var(--blue);border-radius:3px;width:${p}%"></div></div>
          <div style="display:flex;justify-content:space-between"><span style="font-size:.68rem;color:var(--g400)">${p}% complete</span><span style="font-size:.65rem;color:var(--g300)">Since ${y}</span></div>
        </div>`).join('')}
      </div>
      <div>
        <div style="font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--green);padding-bottom:.6rem;border-bottom:2px solid var(--green);margin-bottom:.85rem">Done</div>
        <div style="border:2px dashed var(--g200);border-radius:var(--radius);padding:3rem 1rem;text-align:center;color:var(--g300);font-size:.82rem">Nothing here yet.</div>
      </div>
    </div>
    <p style="font-size:.72rem;color:var(--g400);margin-top:1.5rem">Have a suggestion? <a data-go="support_ticket" style="color:var(--blue);cursor:pointer">Submit a feature request →</a></p>
  </div>
  ${footerHTML()}`;
  setOverlay('');
}

function scene_site_status() {
  incDepth();
  const rows = [
    ['API','Operational','green'],['Dashboard','Operational','green'],
    ['Authentication','Operational','green'],['Email Delivery','Operational','green'],
    ['Billing','Operational','green'],['File Storage','Operational','green'],
    ['Search','Operational','green'],['Webhooks','Operational','green'],
    ['Integrations','Operational','green'],['Support Portal','Operational','green'],
    ['Mobile App','Operational','green'],['Ability to navigate away from Nexus','Degraded','yellow'],
  ];
  root.innerHTML = navHTML() + `
  <div style="max-width:680px;margin:3rem auto;padding:2rem 1.5rem">
    <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:1rem">
      <h1 style="font-size:1.5rem;font-weight:700">Nexus Status</h1>
      <span style="font-size:.7rem;color:var(--g400)">Updated: just now</span>
    </div>
    <div style="background:#ECFDF5;border:1px solid #6EE7B7;border-radius:var(--radius);padding:.85rem 1.1rem;display:flex;align-items:center;gap:.75rem;margin-bottom:1rem">
      <span style="font-size:1.1rem">✅</span>
      <div><div style="font-weight:600;font-size:.875rem;color:#065F46">All Systems Operational</div><div style="font-size:.72rem;color:#059669">99.99% uptime over the last 90 days</div></div>
    </div>
    <div style="background:#FFFBEB;border:1px solid #FCD34D;border-radius:var(--radius);padding:.75rem 1rem;margin-bottom:1.5rem;font-size:.8rem;color:#92400E;line-height:1.5">
      ⚠ <strong>Ongoing:</strong> We are investigating reports that some users are unable to navigate away from the Nexus platform. Our engineers are aware. We apologize for the disruption.
    </div>
    <div style="border:1px solid var(--g200);border-radius:12px;overflow:hidden;margin-bottom:1.5rem">
      ${rows.map(([name,status,c])=>`
        <div style="display:flex;justify-content:space-between;align-items:center;padding:.7rem 1rem;border-bottom:1px solid var(--g100);font-size:.84rem">
          <span>${name}</span>
          <span style="font-size:.75rem;font-weight:600;color:${c==='green'?'var(--green)':'var(--yellow)'}">${c==='green'?'●':'◐'} ${status}</span>
        </div>`).join('')}
    </div>
    <div style="font-size:.8rem;font-weight:600;color:var(--g700);margin-bottom:.6rem">90-Day Uptime</div>
    <div style="display:flex;gap:2px;margin-bottom:.3rem">
      ${Array.from({length:90},(_,i)=>`<div style="flex:1;height:24px;background:${i===89?'var(--yellow)':'var(--green)'};border-radius:2px;opacity:.8"></div>`).join('')}
    </div>
    <div style="display:flex;justify-content:space-between;font-size:.65rem;color:var(--g400)"><span>90 days ago</span><span>Today</span></div>
  </div>
  ${footerHTML()}`;
  setOverlay('');
}

function scene_careers() {
  incDepth();
  const jobs = [
    ['Senior Staff Principal Engineer, Platform Reliability','San Francisco (on-site)','Engineering','10+ yrs Kubernetes, 8+ yrs Rust, 5+ yrs Nexus internal tooling'],
    ['Lead Product Designer, Design Systems','San Francisco (on-site)','Design','8+ yrs Figma, 6+ yrs React, portfolio showing 3+ design systems at scale'],
    ['Director of Growth Marketing','San Francisco (on-site)','Marketing','12+ yrs B2B SaaS, proven 0→$100M ARR experience, 2+ exits preferred'],
    ['Senior Data Scientist, Trust & Safety','San Francisco (on-site)','Data','PhD required, 7+ yrs ML, 5+ yrs trust & safety, published research preferred'],
    ['VP of Customer Success','San Francisco (on-site)','Customer Success','15+ yrs enterprise SaaS, managed 50+ person CSM teams, MBA preferred'],
    ['Staff Backend Engineer, Search','San Francisco (on-site)','Engineering','10+ yrs distributed systems, 7+ yrs Elasticsearch, invented a search algorithm'],
    ['Senior Recruiter, Technical Hiring','San Francisco (on-site)','People','6+ yrs technical recruiting, experience closing candidates who said no'],
    ['Head of Legal & Compliance','San Francisco (on-site)','Legal','JD required, 10+ yrs SaaS legal, EU/APAC regulatory expertise, sense of humor optional'],
  ];
  root.innerHTML = navHTML() + `
  <div class="section" style="padding-top:3rem">
    <div class="section-label">Company</div>
    <h2 style="margin-bottom:.5rem">Careers at Nexus</h2>
    <p style="color:var(--g500);margin-bottom:.75rem">Join the team that's redefining how teams work. All roles are <strong>urgent</strong>.</p>
    <p style="font-size:.78rem;color:var(--g400);margin-bottom:2rem">Remote work is not available at this time. We believe in the power of in-person collaboration, spontaneous whiteboard sessions, and commuting.</p>
    <div style="display:flex;flex-direction:column;gap:1rem">
      ${jobs.map(([title,loc,dept,reqs])=>`
        <div style="border:1px solid var(--g200);border-radius:12px;padding:1.25rem 1.5rem;display:flex;justify-content:space-between;align-items:flex-start;gap:1rem">
          <div>
            <div style="font-weight:600;margin-bottom:.3rem">${title}</div>
            <div style="font-size:.78rem;color:var(--g500);margin-bottom:.35rem">${dept} · ${loc}</div>
            <div style="font-size:.72rem;color:var(--g400)">Requirements: ${reqs}</div>
          </div>
          <button class="btn btn-secondary btn-sm" style="flex-shrink:0;white-space:nowrap" data-go="careers_apply">Apply →</button>
        </div>`).join('')}
    </div>
    <p style="font-size:.72rem;color:var(--g300);margin-top:1.5rem;text-align:center">Showing 8 of 47 open roles. We are an equal opportunity employer.*<br>*Some restrictions apply.</p>
  </div>
  ${footerHTML()}`;
  setOverlay('');
}

function scene_careers_apply() {
  incDepth();
  const steps = [
    'Personal Information',
    'Work Experience (upload resume + manual entry)',
    'Education & Certifications',
    'Skills Assessment (45 min)',
    'Written Response Questions',
    'Portfolio / Work Samples',
    'References (3 required)',
    'Background Check Authorization',
    'Confirm & Submit',
  ];
  const step = S.careersStep || 0;
  S.careersStep = step;
  root.innerHTML = navHTML() + `
  <div style="max-width:540px;margin:3rem auto;padding:2rem 1.5rem">
    <div style="font-size:.72rem;color:var(--g400);margin-bottom:.4rem">Application — Step ${step+1} of ${steps.length}: ${steps[step]}</div>
    <div style="height:3px;background:var(--g100);border-radius:3px;margin-bottom:1.75rem"><div style="height:3px;background:var(--blue);border-radius:3px;width:${((step+1)/steps.length)*100}%"></div></div>
    <h2 style="font-size:1.25rem;font-weight:700;margin-bottom:1.5rem">${steps[step]}</h2>
    ${step===0?`
      <div class="form-group"><label>Legal first name *</label><input type="text" placeholder="First name"></div>
      <div class="form-group"><label>Legal last name *</label><input type="text" placeholder="Last name"></div>
      <div class="form-group"><label>Email *</label><input type="email" placeholder="you@email.com"></div>
      <div class="form-group"><label>Phone *</label><input type="tel" placeholder="+1 (555) 000-0000"></div>
      <div class="form-group"><label>LinkedIn URL *</label><input type="text" placeholder="https://linkedin.com/in/..."></div>
      <div class="form-group"><label>Current city *</label><input type="text" placeholder="City, State"></div>
      <div class="form-group"><label>Are you authorized to work in the United States? *</label><select><option>— Select —</option><option>Yes</option><option>No</option></select></div>
    `:step===1?`
      <div class="alert alert-info" style="font-size:.8rem;margin-bottom:1.25rem">Please upload your resume AND manually enter your work history below. Both are required.</div>
      <div style="border:2px dashed var(--g200);border-radius:var(--radius);padding:1.5rem;text-align:center;margin-bottom:1.25rem;font-size:.85rem;color:var(--g400)">📎 Drag & drop resume (PDF)<br><span style="font-size:.72rem">Max 2MB. Must be from the last 6 months.</span></div>
      <div class="form-group"><label>Most recent job title *</label><input type="text" placeholder="Title"></div>
      <div class="form-group"><label>Company *</label><input type="text" placeholder="Company name"></div>
      <div class="form-group"><label>Dates *</label><input type="text" placeholder="MM/YYYY – MM/YYYY or Present"></div>
      <div class="form-group"><label>Responsibilities (minimum 100 words) *</label><textarea style="min-height:100px" placeholder="Describe your role…"></textarea></div>
    `:step===2?`
      <div class="form-group"><label>Highest level of education *</label><select><option>— Select —</option><option>High school</option><option>Bachelor's</option><option>Master's</option><option>PhD</option><option>Other</option></select></div>
      <div class="form-group"><label>Field of study *</label><input type="text"></div>
      <div class="form-group"><label>Institution *</label><input type="text"></div>
      <div class="form-group"><label>Graduation year *</label><input type="text" placeholder="YYYY"></div>
      <div class="form-group"><label>Certifications (list all, including expired)</label><textarea style="min-height:70px"></textarea></div>
    `:step===3?`
      <div class="alert alert-warn" style="font-size:.8rem;margin-bottom:1.25rem">⏱ This assessment must be completed in one sitting. Timer starts when you click Begin. You have 45 minutes.</div>
      <p style="font-size:.85rem;color:var(--g600);margin-bottom:1.5rem">The skills assessment includes 60 questions across technical competency, cultural fit, situational judgment, and abstract reasoning.</p>
      <button class="btn btn-primary" style="width:100%" onclick="this.textContent='Loading assessment…';this.disabled=true;setTimeout(()=>toast('Assessment server is currently unavailable. Your progress has been saved. Please try again later.'),2000)">Begin 45-Minute Assessment</button>
    `:step===4?`
      ${['Why do you want to work at Nexus? (min 200 words)','Describe a time you disagreed with a decision. What did you do? (min 150 words)','Where do you see yourself in 5 years? Be specific. (min 100 words)','What does "impact" mean to you? (min 75 words)'].map((q,i)=>`<div class="form-group"><label>${q} *</label><textarea style="min-height:80px"></textarea></div>`).join('')}
    `:step===5?`
      <div class="alert alert-info" style="font-size:.8rem;margin-bottom:1.25rem">Upload 3–5 work samples relevant to the role. Each must include a brief description of your contribution.</div>
      ${[1,2,3].map(n=>`<div style="border:2px dashed var(--g200);border-radius:var(--radius);padding:1rem;text-align:center;margin-bottom:.75rem;font-size:.82rem;color:var(--g400)">📎 Sample ${n} (PDF, max 10MB)<br><input type="text" placeholder="Your contribution to this work" style="margin-top:.5rem;font-size:.75rem;text-align:left"></div>`).join('')}
    `:step===6?`
      <p style="font-size:.85rem;color:var(--g600);margin-bottom:1.25rem">Please provide three professional references. Personal references are not accepted. Former managers preferred.</p>
      ${[1,2,3].map(n=>`<div style="border:1px solid var(--g200);border-radius:var(--radius);padding:1rem;margin-bottom:.75rem">
        <div style="font-size:.78rem;font-weight:600;margin-bottom:.5rem;color:var(--g600)">Reference ${n}</div>
        <div class="form-group" style="margin-bottom:.5rem"><label>Name *</label><input type="text" placeholder="Full name"></div>
        <div class="form-group" style="margin-bottom:.5rem"><label>Title & Company *</label><input type="text" placeholder="Job title at company"></div>
        <div class="form-group" style="margin-bottom:.5rem"><label>Email *</label><input type="email" placeholder="Email address"></div>
        <div class="form-group" style="margin-bottom:0"><label>Relationship *</label><input type="text" placeholder="e.g. Former manager"></div>
      </div>`).join('')}
    `:step===7?`
      <p style="font-size:.85rem;color:var(--g600);margin-bottom:1.25rem;line-height:1.6">By continuing, you authorize Nexus to conduct a comprehensive background check including but not limited to: criminal history, employment verification, education verification, credit check, social media screening, and reference interviews. Results will be retained for 7 years.</p>
      <div style="display:flex;align-items:flex-start;gap:.5rem;margin-bottom:1rem">
        <input type="checkbox" id="bg-auth" style="margin-top:.2rem;accent-color:var(--blue)">
        <label for="bg-auth" style="font-size:.78rem;color:var(--g600);font-weight:400">I authorize Nexus to conduct a background check and understand my information will be shared with third-party screening providers in 47 countries. *</label>
      </div>
    `:step===8?`
      <div class="alert alert-info" style="margin-bottom:1.5rem;font-size:.85rem">Please review your application before submitting. You will not be able to make changes after submission.</div>
      <div style="border:1px solid var(--g200);border-radius:var(--radius);padding:1rem;font-size:.8rem;color:var(--g600);line-height:1.7;margin-bottom:1rem">
        <div><strong>Position:</strong> (the one you applied for)</div>
        <div><strong>Application complete:</strong> ✓</div>
        <div><strong>Assessment:</strong> ⚠ Pending (must be completed separately)</div>
      </div>
      <div style="font-size:.72rem;color:var(--g400);margin-bottom:1rem;line-height:1.5">By submitting this application you agree to our Candidate Privacy Policy, Data Retention Policy, and confirm all information is accurate to the best of your knowledge. Submitting a false application is grounds for immediate disqualification and possible legal action.</div>
    `:''}
    <div style="display:flex;gap:.75rem;margin-top:1.5rem">
      ${step>0?`<button class="btn btn-secondary" onclick="S.careersStep--;scene_careers_apply()">← Back</button>`:'<button class="btn btn-secondary" data-go="careers">← All Jobs</button>'}
      ${step<8?`<button class="btn btn-primary" style="flex:1" onclick="S.careersStep=(S.careersStep||0)+1;scene_careers_apply()">${step===3?'Skip Assessment':'Continue →'}</button>`:`<button class="btn btn-primary" style="flex:1" onclick="this.textContent='Submitting…';this.disabled=true;setTimeout(()=>{toast('✅ Application submitted! We will be in touch within 6–8 weeks.');setTimeout(()=>scene_careers(),2000)},1500)">Submit Application</button>`}
    </div>
  </div>
  ${footerHTML()}`;
  setOverlay('');
}

function scene_press() {
  incDepth();
  const logos = [
    ['TechCrunch','#FF5500'],['Forbes','#0B0B0B'],['Wired','#000'],
    ['The Verge','#FA4D2A'],['VentureBeat','#1A73E8'],['Fast Company','#E8002D'],
  ];
  const quotes = [
    ['TechCrunch','"…a platform…"','2023'],
    ['Forbes','"…the kind of tool that teams use…"','2023'],
    ['Wired','"…software…"','2022'],
    ['The Verge','"…Nexus is a thing that exists…"','2023'],
    ['VentureBeat','"…we spoke with the CEO…"','2024'],
    ['Fast Company','"…one of the companies…"','2023'],
  ];
  root.innerHTML = navHTML() + `
  <div class="section" style="padding-top:3rem;max-width:900px;text-align:center">
    <div class="section-label">Company</div>
    <h2 style="margin-bottom:1rem">Nexus in the Press</h2>
    <p style="color:var(--g500);max-width:500px;margin:0 auto 3rem;font-size:.9rem">Nexus has been featured in leading publications around the world.</p>
    <div style="display:flex;justify-content:center;align-items:center;gap:3rem;flex-wrap:wrap;margin-bottom:4rem;padding:2rem;background:var(--g50);border-radius:12px">
      ${logos.map(([name,c])=>`<div style="font-size:1.1rem;font-weight:900;color:${c};letter-spacing:-.04em;opacity:.6;font-family:Georgia,serif">${name}</div>`).join('')}
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.25rem;text-align:left">
      ${quotes.map(([pub,q,y])=>`
        <div style="border:1px solid var(--g200);border-radius:12px;padding:1.5rem;background:#fff">
          <div style="font-size:1.05rem;color:var(--g700);font-style:italic;font-family:Georgia,serif;margin-bottom:1rem;line-height:1.5">${q}</div>
          <div style="font-size:.75rem;color:var(--g400);font-weight:600">${pub} · ${y}</div>
        </div>`).join('')}
    </div>
    <div style="margin-top:2.5rem;font-size:.8rem;color:var(--g500)">Press inquiries: <a style="color:var(--blue)" href="mailto:press@nexus.io">press@nexus.io</a> · Response time: 6–8 weeks</div>
  </div>
  ${footerHTML()}`;
  setOverlay('');
}

function scene_legal() {
  incDepth();
  const docs = [
    'Terms of Service','Privacy Policy','Cookie Policy','Data Processing Agreement',
    'End User License Agreement','Acceptable Use Policy','Service Level Agreement',
    'Subprocessor List','Security Policy','Refund Policy (Non-Refund Policy)',
    'Intellectual Property Policy','Third-Party Licenses','Arbitration Agreement',
    'Nexus Community Standards',
  ];
  root.innerHTML = navHTML() + `
  <div class="section" style="padding-top:3rem;max-width:680px">
    <div class="section-label">Company</div>
    <h2 style="margin-bottom:.5rem">Legal</h2>
    <div class="alert alert-warn" style="font-size:.8rem;margin-bottom:1.5rem">
      ⚠ By viewing this page, you have read, understood, and agreed to all documents listed below in their entirety.
    </div>
    <div style="display:flex;flex-direction:column;gap:.5rem">
      ${docs.map((d,i)=>`
        <div style="display:flex;justify-content:space-between;align-items:center;padding:.8rem 1rem;border:1px solid var(--g200);border-radius:var(--radius);background:#fff">
          <div>
            <div style="font-size:.85rem;font-weight:500">${d}</div>
            <div style="font-size:.68rem;color:var(--g400)">Last updated: today · v${(i+1)*3}.${Math.floor(Math.random()*9)+1}</div>
          </div>
          <button class="btn btn-ghost btn-sm" data-go="${d.includes('Privacy')?'privacy':d.includes('Terms')?'terms':'legal_doc'}">View →</button>
        </div>`).join('')}
    </div>
    <p style="font-size:.65rem;color:var(--g300);margin-top:1.5rem;line-height:1.6">All documents are updated regularly. Continued use of Nexus following any update constitutes acceptance of the updated terms. We will not notify you of changes.</p>
  </div>
  ${footerHTML()}`;
  setOverlay('');
}

function scene_legal_doc() {
  toast('This document is currently being updated. Please check back later.');
}

function scene_docs() {
  incDepth();
  setOverlay(`<div class="backdrop"><div class="modal" style="max-width:420px"><div class="modal-body" style="padding:2rem;text-align:center">
    <div style="font-size:2rem;margin-bottom:1rem">🔒</div>
    <h3 style="font-weight:700;margin-bottom:.5rem">Sign in to view documentation</h3>
    <p style="font-size:.875rem;color:var(--g500);margin-bottom:1.5rem;line-height:1.5">The Nexus documentation is available to registered users only. Sign up free to access our full library of guides, API references, and tutorials.</p>
    <button class="btn btn-primary" style="width:100%;margin-bottom:.5rem" data-go="signup">Create Free Account</button>
    <button class="btn btn-ghost" data-go="signin_actual">Sign In</button>
    <p style="font-size:.65rem;color:var(--g300);margin-top:1rem">Note: documentation access requires a verified account. Some articles require a paid plan.</p>
  </div></div></div>`);
}

function scene_api_ref() {
  incDepth();
  const endpoints = [
    ['GET','/v1/projects','List all projects'],
    ['POST','/v1/projects','Create a project'],
    ['GET','/v1/projects/{id}','Get a project'],
    ['PUT','/v1/projects/{id}','Update a project'],
    ['DELETE','/v1/projects/{id}','Delete a project'],
    ['GET','/v1/users','List users'],
    ['POST','/v1/users/invite','Invite a user'],
    ['GET','/v1/billing','Get billing info'],
    ['POST','/v1/export','Request data export'],
    ['GET','/v1/status','Check API status'],
    ['POST','/v1/webhooks','Register a webhook'],
    ['DELETE','/v1/account','Delete account'],
  ];
  root.innerHTML = navHTML() + `
  <div style="display:grid;grid-template-columns:220px 1fr;min-height:calc(100vh - 60px)">
    <div style="background:var(--g50);border-right:1px solid var(--g200);padding:1.5rem 1rem">
      <div style="font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--g500);margin-bottom:.75rem">Reference</div>
      ${endpoints.map(([,path])=>`<div style="font-size:.78rem;color:var(--blue);cursor:pointer;padding:.25rem 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" onclick="toast('This endpoint is deprecated and no longer returns data.')">${path}</div>`).join('')}
    </div>
    <div style="padding:2rem;max-width:680px">
      <div class="section-label" style="margin-bottom:.5rem">Resources</div>
      <h2 style="margin-bottom:.5rem">API Reference</h2>
      <div class="alert alert-warn" style="font-size:.8rem;margin-bottom:1.5rem">⚠ <strong>Deprecation notice:</strong> All v1 endpoints are deprecated. Migration guide for v2 is coming soon.</div>
      <div style="display:flex;flex-direction:column;gap:.6rem">
        ${endpoints.map(([method,path,desc])=>`
          <div style="border:1px solid var(--g200);border-radius:var(--radius);padding:.85rem 1rem">
            <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.3rem">
              <code style="font-size:.7rem;font-weight:700;background:${method==='GET'?'#ECFDF5':method==='POST'?'#EFF6FF':method==='DELETE'?'#FEF2F2':'#FFFBEB'};color:${method==='GET'?'var(--green)':method==='POST'?'var(--blue)':method==='DELETE'?'var(--red)':'var(--yellow)'};padding:.15rem .45rem;border-radius:3px">${method}</code>
              <code style="font-size:.78rem;color:var(--g700)">${path}</code>
            </div>
            <div style="font-size:.78rem;color:var(--g500);margin-bottom:.4rem">${desc}</div>
            <div style="font-size:.7rem;font-family:monospace;background:var(--g900);color:#ff6b6b;padding:.35rem .6rem;border-radius:3px">{"status":"deprecated","replacement":null,"sunset_date":"TBD"}</div>
          </div>`).join('')}
      </div>
    </div>
  </div>
  ${footerHTML()}`;
  setOverlay('');
}

function scene_community() {
  incDepth();
  root.innerHTML = navHTML() + `
  <div style="display:grid;grid-template-columns:200px 1fr;min-height:calc(100vh - 60px)">
    <div style="background:var(--g50);border-right:1px solid var(--g200);padding:1.5rem 1rem">
      <div style="font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--g500);margin-bottom:.75rem">Categories</div>
      ${['General','Product Help','Feature Requests','Bug Reports','Showcase','Off-Topic'].map(c=>`<div style="font-size:.8rem;color:var(--g600);padding:.3rem 0;cursor:pointer" data-go="signin">${c} <span style="color:var(--g300);font-size:.68rem">(${c==='General'?1:0})</span></div>`).join('')}
      <div style="margin-top:1.5rem"><button class="btn btn-primary btn-sm" style="width:100%" data-go="signin">Join Community</button></div>
    </div>
    <div style="padding:2rem;max-width:700px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem">
        <h2 style="font-size:1.25rem;font-weight:700">Nexus Community</h2>
        <span style="font-size:.72rem;color:var(--g400)">1 post · 0 replies · 1 member</span>
      </div>
      <div style="border:1px solid var(--g200);border-radius:12px;overflow:hidden;margin-bottom:1.5rem">
        <div style="padding:1.1rem 1.25rem;display:flex;align-items:flex-start;gap:.85rem">
          <div style="width:36px;height:36px;border-radius:50%;background:var(--blue);color:#fff;display:flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:700;flex-shrink:0">N</div>
          <div style="flex:1">
            <div style="font-size:.85rem;font-weight:600;margin-bottom:.15rem">Hello, is anyone here?</div>
            <div style="font-size:.72rem;color:var(--g400);margin-bottom:.5rem">nexus_user_001 · General · Posted March 14, 2021</div>
            <div style="font-size:.82rem;color:var(--g600);line-height:1.6">Just signed up for Nexus and found the community forum. Hoping to connect with other users! Is anyone active here? Would love to share tips and tricks. Let me know 👋</div>
            <div style="display:flex;gap:1rem;margin-top:.75rem">
              <span style="font-size:.72rem;color:var(--g400)">💬 0 replies</span>
              <span style="font-size:.72rem;color:var(--g400)">👀 847 views</span>
              <span style="font-size:.72rem;color:var(--blue);cursor:pointer" data-go="signin">Reply</span>
            </div>
          </div>
        </div>
      </div>
      <div style="text-align:center;padding:2rem;color:var(--g300);font-size:.85rem">
        No other posts yet. <button class="btn btn-secondary btn-sm" style="margin-left:.5rem" data-go="signin">Be the first →</button>
      </div>
    </div>
  </div>
  ${footerHTML()}`;
  setOverlay('');
}

function scene_templates() {
  incDepth();
  const temps = [
    ['🚀','Product Launch','Plan and track your next launch'],
    ['📊','Quarterly Review','OKRs, metrics, and retrospectives'],
    ['🐛','Bug Tracker','Log, prioritize, and resolve issues'],
    ['🗺','Roadmap Planning','Visual roadmap for your team'],
    ['📝','Meeting Notes','Structured notes and action items'],
    ['👥','Team Onboarding','Get new hires up to speed'],
    ['💰','Budget Tracker','Manage team expenses and forecasts'],
    ['📣','Marketing Campaign','Plan and measure campaigns'],
    ['🔄','Sprint Board','Agile sprint planning made easy'],
  ];
  root.innerHTML = navHTML() + `
  <div class="section" style="padding-top:3rem">
    <div class="section-label">Resources</div>
    <h2 style="margin-bottom:.5rem">Templates</h2>
    <p style="color:var(--g500);margin-bottom:2rem;font-size:.9rem">Start fast with a pre-built template. Free for Pro users.</p>
    <div class="grid-3">
      ${temps.map(([icon,name,desc])=>`
        <div style="border:1px solid var(--g200);border-radius:12px;padding:1.25rem;background:#fff;position:relative">
          <div style="font-size:1.5rem;margin-bottom:.75rem">${icon}</div>
          <div style="font-weight:600;margin-bottom:.3rem;font-size:.9rem">${name}</div>
          <div style="font-size:.8rem;color:var(--g500);margin-bottom:1rem">${desc}</div>
          <div style="display:flex;gap:.5rem">
            <button class="btn btn-secondary btn-sm" onclick="setOverlay('<div class=\\'backdrop\\'><div class=\\'modal\\' style=\\'max-width:380px\\'><div class=\\'modal-body\\' style=\\'padding:1.75rem;text-align:center\\'><div style=\\'font-size:1.5rem;margin-bottom:.75rem\\'>🔒</div><h3 style=\\'font-weight:700;margin-bottom:.5rem\\'>Pro feature</h3><p style=\\'font-size:.875rem;color:var(--g500);margin-bottom:1.25rem;line-height:1.5\\'>Templates are available on the Pro plan. Upgrade to access all ${temps.length} templates.</p><button class=\\'btn btn-primary\\' style=\\'width:100%;margin-bottom:.5rem\\' data-go=\\'pricing\\'>Upgrade to Pro</button><button class=\\'btn btn-ghost\\' data-go=\\'close_overlay\\'>Maybe later</button></div></div></div>')">Preview</button>
            <button class="btn btn-primary btn-sm" data-go="pricing">Unlock — Pro</button>
          </div>
          <div style="position:absolute;top:.75rem;right:.75rem;background:var(--blue);color:#fff;font-size:.6rem;font-weight:700;padding:.15rem .5rem;border-radius:999px">PRO</div>
        </div>`).join('')}
    </div>
  </div>
  ${footerHTML()}`;
  setOverlay('');
}

function scene_webinars() {
  incDepth();
  const webinars = [
    ['Getting Started with Nexus','Yesterday, 2:00 PM EDT','45 min','234 attended'],
    ['Advanced Project Management in Nexus','Yesterday, 11:00 AM EDT','60 min','89 attended'],
    ['Nexus for Enterprise: Best Practices','Yesterday, 4:00 PM EDT','90 min','412 attended'],
    ['Integrations Deep Dive','Yesterday, 1:00 PM EDT','45 min','67 attended'],
    ['What\'s New in Nexus 4.0','Yesterday, 3:30 PM EDT','30 min','1,204 attended'],
    ['Nexus AI Features Overview','Yesterday, 10:00 AM EDT','60 min','88 attended'],
  ];
  root.innerHTML = navHTML() + `
  <div class="section" style="padding-top:3rem;max-width:800px">
    <div class="section-label">Resources</div>
    <h2 style="margin-bottom:.5rem">Webinars</h2>
    <p style="color:var(--g500);margin-bottom:2rem;font-size:.9rem">Live and on-demand webinars from the Nexus team. Next scheduled webinar: TBD.</p>
    <div style="display:flex;flex-direction:column;gap:.85rem">
      ${webinars.map(([title,when,dur,att])=>`
        <div style="border:1px solid var(--g200);border-radius:12px;padding:1.1rem 1.25rem;display:flex;justify-content:space-between;align-items:center;gap:1rem">
          <div>
            <div style="font-weight:600;margin-bottom:.25rem;font-size:.9rem">${title}</div>
            <div style="font-size:.75rem;color:var(--g400)">${when} · ${dur} · ${att}</div>
          </div>
          <div style="display:flex;gap:.5rem;flex-shrink:0">
            <button class="btn btn-secondary btn-sm" onclick="toast('Recording is processing. Check back in 3–5 business days.')">Watch Recording</button>
          </div>
        </div>`).join('')}
    </div>
    <div style="margin-top:2rem;padding:1.5rem;background:var(--g50);border-radius:12px;text-align:center">
      <div style="font-weight:600;margin-bottom:.4rem">Don't miss the next webinar</div>
      <div style="font-size:.85rem;color:var(--g500);margin-bottom:1rem">Sign up to be notified when new webinars are scheduled.</div>
      <div style="display:flex;gap:.5rem;max-width:340px;margin:0 auto">
        <input type="email" placeholder="you@company.com" style="flex:1">
        <button class="btn btn-primary" data-go="newsletter_sub">Notify Me</button>
      </div>
    </div>
  </div>
  ${footerHTML()}`;
  setOverlay('');
}

function scene_security_page() {
  incDepth();
  const certs = [
    ['SOC 2 Type II','Audit completed','✅'],
    ['ISO 27001','Certified','✅'],
    ['GDPR','Compliant','✅'],
    ['CCPA','Compliant','✅'],
    ['HIPAA','Not applicable*','—'],
    ['PCI DSS','Level 1','✅'],
    ['Pen Test','Annually','✅'],
  ];
  root.innerHTML = navHTML() + `
  <div class="section" style="padding-top:3rem;max-width:700px">
    <div class="section-label">Support</div>
    <h2 style="margin-bottom:.5rem">Security</h2>
    <p style="color:var(--g500);margin-bottom:2.5rem;font-size:.9rem">Nexus takes security seriously. Your data is important to us, which is why we have placed a number of badges on this page.</p>
    <div class="grid-3" style="margin-bottom:2.5rem">
      ${['🔒 SOC 2','🛡 ISO 27001','🇪🇺 GDPR','✅ CCPA','🔐 PCI DSS','🧪 Pen Tested'].map(b=>`
        <div style="border:1px solid var(--g200);border-radius:var(--radius);padding:1rem;text-align:center;font-size:.8rem;font-weight:600;color:var(--g700)">${b}</div>`).join('')}
    </div>
    <h3 style="font-weight:600;font-size:1rem;margin-bottom:1rem">Certifications & Compliance</h3>
    <div style="border:1px solid var(--g200);border-radius:12px;overflow:hidden;margin-bottom:2rem">
      ${certs.map(([c,s,i])=>`
        <div style="display:flex;justify-content:space-between;align-items:center;padding:.7rem 1rem;border-bottom:1px solid var(--g100);font-size:.83rem">
          <span style="font-weight:500">${c}</span>
          <div style="display:flex;align-items:center;gap:.75rem">
            <span style="color:var(--g500);font-size:.75rem">${s}</span>
            <span>${i}</span>
          </div>
        </div>`).join('')}
    </div>
    <p style="font-size:.72rem;color:var(--g400);margin-bottom:2rem">* Nexus is not HIPAA compliant. Please do not store protected health information on Nexus.</p>
    <div style="border:1px solid var(--g200);border-radius:12px;padding:1.5rem">
      <h3 style="font-weight:600;font-size:.95rem;margin-bottom:.5rem">Report a Vulnerability</h3>
      <p style="font-size:.85rem;color:var(--g500);margin-bottom:1rem;line-height:1.5">If you believe you've discovered a security vulnerability in Nexus, please report it responsibly through our support ticket system. Do not disclose publicly.</p>
      <button class="btn btn-secondary" data-go="support_ticket">Open a Security Ticket →</button>
    </div>
  </div>
  ${footerHTML()}`;
  setOverlay('');
}

function scene_privacy() {
  incDepth();
  const sections = [
    ['1. Information We Collect','We collect information you provide directly to us, information we collect automatically when you use our services, and information from third parties. This includes but is not limited to: name, email, IP address, device identifiers, usage patterns, mouse movements, scroll depth, time on page, click patterns, emotional state (inferred), location (GPS if permitted), contacts (if synced), and any other information generated by your use of Nexus.'],
    ['2. How We Use Your Information','We use the information we collect to provide, maintain, and improve our services; send you technical notices; respond to comments; monitor usage; detect fraud; and for any other purpose with your consent. By using Nexus, you consent to all current and future uses.'],
    ['3. Information Sharing','We share your information with vendors, consultants, partners, and other third parties who need access to your information to perform services on our behalf. We also share your information with 847 advertising partners. A full list of partners is available upon request. Requests are processed within 90 business days.'],
    ['4. Data Retention','We retain your information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. After account deletion, data is retained for 7 years or until legal requirements expire, whichever is later. To opt out of retention, see <a data-go="privacy" style="color:var(--blue);cursor:pointer">Section 9</a>.'],
    ['5. Cookies','We use cookies and similar tracking technologies to collect information about your use of Nexus. For more information, see our <a data-go="cookie_prefs" style="color:var(--blue);cursor:pointer">Cookie Policy</a>. To manage cookies, see <a data-go="privacy" style="color:var(--blue);cursor:pointer">Section 10</a>.'],
    ['6. Security','We implement appropriate technical and organizational measures to protect your information. No method of transmission over the Internet is 100% secure, however, and we cannot guarantee absolute security.'],
    ['7. International Transfers','Your information may be transferred to — and maintained on — computers located outside of your state, province, country, or other governmental jurisdiction where data protection laws may differ.'],
    ['8. Children\'s Privacy','Nexus is not directed to children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information. If you believe we have collected such information, please open a <a data-go="support_ticket" style="color:var(--blue);cursor:pointer">support ticket</a>.'],
    ['9. Your Rights & Choices','Depending on your location, you may have the right to access, correct, or delete your personal information. To exercise these rights, submit a request via <a data-go="support_ticket" style="color:var(--blue);cursor:pointer">support ticket</a>. Requests are processed within 90 business days. To opt out of marketing emails, see <a data-go="privacy" style="color:var(--blue);cursor:pointer">Section 11</a>.'],
    ['10. Managing Cookies','To manage your cookie preferences, visit <a data-go="cookie_prefs" style="color:var(--blue);cursor:pointer">Cookie Preferences</a>. Note: disabling cookies may affect site functionality. Some cookies are strictly necessary and cannot be disabled.'],
    ['11. Opting Out of Marketing','To opt out of marketing communications, update your preferences in <a data-go="account_settings" style="color:var(--blue);cursor:pointer">Settings → Notifications</a>, or <a data-go="unsubscribe" style="color:var(--blue);cursor:pointer">unsubscribe here</a>. Note: opting out of marketing does not affect transactional, billing, security, onboarding, re-engagement, legal, or partner communications.'],
    ['12. Changes to This Policy','We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date. Your continued use of Nexus following any update constitutes acceptance. Last updated: today.'],
    ['13. Contact Us','If you have any questions about this policy, please <a data-go="support_ticket" style="color:var(--blue);cursor:pointer">open a support ticket</a>. Response time: 3–5 business days.'],
  ];
  root.innerHTML = navHTML() + `
  <div style="max-width:680px;margin:3rem auto;padding:2rem 1.5rem">
    <div class="section-label">Legal</div>
    <h1 style="font-size:1.5rem;font-weight:700;margin-bottom:.3rem">Privacy Policy</h1>
    <div style="font-size:.75rem;color:var(--g400);margin-bottom:2rem">Last updated: today · Effective: immediately · <a data-go="privacy" style="color:var(--blue);cursor:pointer">Previous versions</a></div>
    <div style="background:var(--g50);border:1px solid var(--g200);border-radius:var(--radius);padding:1rem;margin-bottom:2rem;font-size:.78rem;color:var(--g600)">
      <strong>Table of Contents:</strong><br>
      ${sections.map(([t])=>`<a data-go="privacy" style="color:var(--blue);cursor:pointer;display:block;line-height:1.8">${t.replace(/\*$/,'')}</a>`).join('')}
    </div>
    ${sections.map(([title,body])=>`
      <div style="margin-bottom:2rem">
        <h2 style="font-size:1rem;font-weight:700;margin-bottom:.75rem;padding-top:1rem;border-top:1px solid var(--g100)">${title}</h2>
        <p style="font-size:.875rem;color:var(--g600);line-height:1.75">${body}</p>
      </div>`).join('')}
    <div style="border-top:1px solid var(--g200);padding-top:1rem;font-size:.7rem;color:var(--g400);line-height:1.6">This privacy policy applies to all users of Nexus worldwide. By using Nexus you agree to this policy.</div>
  </div>
  ${footerHTML()}`;
  setOverlay('');
}

function scene_terms() {
  incDepth();
  let scrollAgreed = false;
  const sections = [
    ['1. Acceptance of Terms','By accessing or using Nexus, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use Nexus. Your continued use of Nexus following the posting of changes constitutes acceptance of those changes.'],
    ['2. Description of Service','Nexus provides a platform for teams to collaborate, manage projects, and streamline workflows. We reserve the right to modify, suspend, or discontinue the service at any time without notice.'],
    ['3. User Accounts','You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. We are not liable for any loss arising from your failure to comply with this section.'],
    ['4. Acceptable Use','You agree not to use Nexus for any unlawful purpose or in any way that could damage, disable, or impair Nexus. You agree not to attempt to gain unauthorized access to any part of Nexus. You agree not to look for the unsubscribe link.'],
    ['5. Payment Terms','By providing payment information, you authorize Nexus to charge you for any applicable fees. All fees are non-refundable. We reserve the right to change our pricing at any time. Continued use after price changes constitutes acceptance.'],
    ['6. Intellectual Property','Nexus and its content are protected by copyright, trademark, and other laws. You may not reproduce, distribute, or create derivative works without our express written consent. By submitting content, you grant Nexus a perpetual, worldwide, royalty-free license.'],
    ['7. Privacy','Your use of Nexus is subject to our <a data-go="privacy" style="color:var(--blue);cursor:pointer">Privacy Policy</a>, which is incorporated into these Terms by reference.'],
    ['8. Disclaimer of Warranties','NEXUS IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.'],
    ['9. Limitation of Liability','TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEXUS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE LAST MONTH, WHICH MAY BE ZERO.'],
    ['10. Arbitration','ANY DISPUTE ARISING FROM THESE TERMS SHALL BE RESOLVED BY BINDING ARBITRATION. YOU WAIVE YOUR RIGHT TO A JURY TRIAL AND TO PARTICIPATE IN CLASS ACTION LAWSUITS. The arbitration shall be conducted in San Francisco, CA, at your expense.'],
    ['11. Governing Law','These Terms are governed by the laws of the State of California, without regard to conflict of law provisions. You consent to personal jurisdiction in San Francisco County, California.'],
    ['12. Changes to Terms','We may update these Terms at any time by posting the updated Terms to this page. Your continued use of Nexus following any update constitutes acceptance. We will not notify you of changes.'],
    ['13. Contact','Questions? <a data-go="support_ticket" style="color:var(--blue);cursor:pointer">Open a support ticket</a>. Response time: 3–5 business days.'],
  ];
  root.innerHTML = navHTML() + `
  <div style="max-width:680px;margin:3rem auto;padding:2rem 1.5rem">
    <div class="section-label">Legal</div>
    <h1 style="font-size:1.5rem;font-weight:700;margin-bottom:.3rem">Terms of Service</h1>
    <div style="font-size:.75rem;color:var(--g400);margin-bottom:1rem">Last updated: today · Effective: the moment you began scrolling</div>
    <div style="background:#FFFBEB;border:1px solid #FCD34D;border-radius:var(--radius);padding:.75rem 1rem;margin-bottom:2rem;font-size:.78rem;color:#92400E">
      ⚠ By scrolling past this notice, you have read and agreed to these Terms of Service in their entirety.
    </div>
    ${sections.map(([title,body])=>`
      <div style="margin-bottom:2rem">
        <h2 style="font-size:1rem;font-weight:700;margin-bottom:.75rem;padding-top:1rem;border-top:1px solid var(--g100)">${title}</h2>
        <p style="font-size:.875rem;color:var(--g600);line-height:1.75">${body}</p>
      </div>`).join('')}
    <div style="position:sticky;bottom:0;background:#fff;border-top:1px solid var(--g200);padding:.85rem 0;display:flex;align-items:center;justify-content:space-between;font-size:.78rem;color:var(--g500)">
      <span>You agreed to these Terms by scrolling here.</span>
      <button class="btn btn-primary btn-sm" data-go="main">I Understand</button>
    </div>
  </div>
  ${footerHTML()}`;
  setOverlay('');
}

