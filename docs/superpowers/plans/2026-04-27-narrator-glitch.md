# Narrator Glitch Escalation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the narrator progressively lose composure — fragmenting, breaking the fourth wall, then corrupting text — based on how deep into a single narrative path the user has gone; simultaneously add narrator coverage to all previously uncovered scenes.

**Architecture:** A `PATH_MILESTONES` table maps scene keys to named paths. `markNarratorMilestone(path, key)` updates `S.pathDepth[path]` (deduplicated via `S.pathMilestonesSeen`). `S.narratorGlitch` (0–4) is derived from `max(Object.values(S.pathDepth))`. The router already calls `narratorEnter(key)` on every click — `_narratorDo()` is extended to check `_MILESTONE_LOOKUP` and update glitch state before selecting lines. A `_pickLines()` helper selects the highest available tier variant (`lines_1`, `lines_2`). A `glitchText()` post-processor applies character corruption at tiers 3–4. Backrooms (room-by-room via internal function) and survey (step-by-step via `S.surveyStep`) need explicit `markNarratorMilestone` and `narratorEnter` calls since they don't navigate via unique scene keys per step.

**Tech Stack:** Vanilla JS, no build system, no test framework. Serve with `python3 -m http.server 8000` from `html/` and verify in browser. `narrator.js` loads after all scene files but all calls happen at runtime so `markNarratorMilestone` is globally accessible.

---

### Task 1: PATH_MILESTONES, markNarratorMilestone(), glitch tier infrastructure

**Files:**
- Modify: `html/js/narrator.js` — insert before `const NARRATOR_CORRECT`

- [ ] **Step 1: Add PATH_MILESTONES and reverse lookup at the very top of narrator.js**

Insert this block before line 1 (`// ────────────── CHAT WIDGET ──────────────`):

```js
const PATH_MILESTONES = {
  onboarding:  ['signup','signup_3','signup_7','verify_bypass','onboard_workspace',
                 'onboard_calendar','onboard_teammates','onboard_quiz','onboard_done','dashboard'],
  delete:      ['delete_account','del_schedule','del_done','del_jordan_ring','del_call','del_committee'],
  support:     ['help','support_ticket','ticket_needs_info','ticket_escalated',
                 'ticket_merged','ticket_appeal','ticket_appeal_denied'],
  unsubscribe: ['unsubscribe','unsub_2','unsub_3','unsub_captcha','unsub_done'],
  navigator:   ['main','features','signin','contact_sales','contact_sales_sent'],
  adventure:   ['adv_intro','adv_lobby','adv_take_keycard','adv_try_elevator','adv_try_stairs',
                 'adv_breakroom','adv_examine_whiteboard','adv_take_badge','adv_floor2','adv_ending'],
  // survey and backrooms tracked via explicit markNarratorMilestone() calls (no per-step scene keys)
  survey:      ['survey_enter','survey_q8','survey_q15','survey_q22','survey_done'],
  backrooms:   ['br_enter','br_s1','br_s1_mid','br_s2','br_s2_mid',
                 'br_s3','br_s3_mid','br_s4','br_s4_mid','br_exit'],
};

// Reverse lookup: scene key → array of path names (auto-tracked via _narratorDo)
const _MILESTONE_LOOKUP = {};
Object.entries(PATH_MILESTONES).forEach(([path, keys]) => {
  keys.forEach(k => {
    if (!_MILESTONE_LOOKUP[k]) _MILESTONE_LOOKUP[k] = [];
    _MILESTONE_LOOKUP[k].push(path);
  });
});

function _glitchTier(max) {
  return max <= 2 ? 0 : max <= 5 ? 1 : max <= 8 ? 2 : max <= 10 ? 3 : 4;
}

function markNarratorMilestone(path, key) {
  if (!S.pathMilestonesSeen) S.pathMilestonesSeen = new Set();
  const token = path + ':' + key;
  if (S.pathMilestonesSeen.has(token)) return;
  S.pathMilestonesSeen.add(token);
  if (!S.pathDepth) S.pathDepth = {};
  S.pathDepth[path] = (S.pathDepth[path] || 0) + 1;
  const max = Math.max(0, ...Object.values(S.pathDepth));
  S.narratorGlitch = _glitchTier(max);
}
```

- [ ] **Step 2: Add milestone tracking hook at the top of _narratorDo()**

Find `function _narratorDo(key) {`. Insert as the very first line of the function body (before `const entry = NARRATOR[key]`):

```js
  const _miPaths = _MILESTONE_LOOKUP[key];
  if (_miPaths) _miPaths.forEach(p => markNarratorMilestone(p, key));
```

- [ ] **Step 3: Verify in browser**

Run `python3 -m http.server 8000` from `html/`. Navigate home → accept cookies → main → pricing → signup. Open console:

```js
S.pathDepth        // { navigator: 1, onboarding: 1 }
S.narratorGlitch   // 0
```

Continue through signup_3:
```js
S.pathDepth        // { navigator: 1, onboarding: 2 }
S.narratorGlitch   // 0
```

Continue through signup_7 (onboarding milestone 3):
```js
S.narratorGlitch   // 1  ← tier 1 fragmentation begins
```

- [ ] **Step 4: Commit**

```bash
git add html/js/narrator.js
git commit -m "feat(narrator): add PATH_MILESTONES milestone tracking infrastructure"
```

---

### Task 2: glitchText() post-processor

**Files:**
- Modify: `html/js/narrator.js` — add after `markNarratorMilestone`, before `const NARRATOR_CORRECT`

- [ ] **Step 1: Add glitchText() function**

```js
function glitchText(str, severity) {
  if (!severity) return str;
  const seed = S.narratorMsgCount || 0;
  let words = str.split(' ');

  // Severity 1: double one interior letter; add combining diacritic to another word
  const di = seed % words.length;
  const dw = words[di];
  if (dw.length > 3) {
    const mid = Math.floor(dw.length / 2);
    words[di] = dw.slice(0, mid) + dw[mid] + dw.slice(mid);
  }
  const ci = (seed + 3) % words.length;
  const cw = words[ci];
  if (ci !== di && cw.length > 2 && /^[a-zA-Z]/.test(cw)) {
    words[ci] = cw[0] + '̶' + cw.slice(1);
  }

  if (severity < 2) return words.join(' ');

  // Severity 2: repeat first 3 words of one sentence with em-dash break; trail with em-dash
  let out = words.join(' ');
  const sentences = out.split('. ');
  if (sentences.length > 1) {
    const si = seed % sentences.length;
    const lead = sentences[si].split(' ').slice(0, 3).join(' ');
    sentences[si] = lead + ' — ' + sentences[si];
    out = sentences.join('. ');
  }
  if (out.endsWith('.')) out = out.slice(0, -1) + ' —';
  return out;
}
```

- [ ] **Step 2: Verify in browser console**

```js
S.narratorMsgCount = 5;
glitchText("The narrator observes the user. The form has too many fields.", 1)
// one word with a doubled letter; one with a combining char overlay on first char
glitchText("The narrator observes the user. The form has too many fields.", 2)
// also: sentence starts with 3-word repetition + em-dash, trails with em-dash
```

- [ ] **Step 3: Commit**

```bash
git add html/js/narrator.js
git commit -m "feat(narrator): add glitchText post-processor for tier 3-4 corruption"
```

---

### Task 3: Tier-variant line resolution in _narratorDo()

**Files:**
- Modify: `html/js/narrator.js` — add `_pickLines()` before `_narratorDo()`, update line resolution inside `_narratorDo()`

- [ ] **Step 1: Add _pickLines() immediately before function _narratorDo()**

```js
function _pickLines(entry) {
  const g = S.narratorGlitch || 0;
  // Walk down from min(g, 2) to find highest available variant
  for (let t = Math.min(g, 2); t >= 1; t--) {
    const variant = entry['lines_' + t];
    if (variant) {
      const raw = typeof variant === 'function' ? variant() : variant;
      return g >= 3 ? raw.map(l => glitchText(l, g - 2)) : raw;
    }
  }
  const base = typeof entry.lines === 'function' ? entry.lines() : (entry.lines || []);
  return g >= 3 ? base.map(l => glitchText(l, g - 2)) : base;
}
```

- [ ] **Step 2: Replace lines resolution in _narratorDo()**

Find this in `_narratorDo()`:
```js
  const lines = typeof entry.lines === 'function' ? entry.lines() : (entry.lines || []);
  lines.forEach(l => msgs.push({ text: l, pred: false }));
```

Replace with:
```js
  const lines = _pickLines(entry);
  lines.forEach(l => msgs.push({ text: l, pred: false }));
```

- [ ] **Step 3: Verify tier selection in browser**

```js
// After navigating to any page with a NARRATOR entry:
S.narratorGlitch = 0; narratorEnter('pricing');
// → clean base line

S.narratorGlitch = 3; narratorEnter('pricing');
// → same base line but one word has a doubled letter and one has a combining char
// (pricing has no lines_1/lines_2 yet so base line is used at tier 3)
```

- [ ] **Step 4: Commit**

```bash
git add html/js/narrator.js
git commit -m "feat(narrator): add tier-variant line resolution with glitchText integration"
```

---

### Task 4: Backrooms — entry narrator call + room milestone hooks

**Files:**
- Modify: `html/js/scenes-backrooms.js`

The backrooms entry is triggered via `onclick="scene_backrooms_enter()"` (not the router), so `narratorEnter` is never auto-called for entry. Room advances use `data-go="backrooms_next"` which fires `narratorEnter('backrooms_next')` — not room-specific keys. Both need manual hooks.

- [ ] **Step 1: Add narratorEnter + entry milestone to scene_backrooms_enter()**

Find `function scene_backrooms_enter() {`. After the line `S.brVisited = true;`, add:

```js
  markNarratorMilestone('backrooms', 'br_enter');
  narratorEnter('backrooms_enter');
```

- [ ] **Step 2: Add slot-based milestone tracking and stage narrator calls to scene_backrooms()**

Find `function scene_backrooms(roomArg) {`. After the line:
```js
  const stage = slot <= 25 ? 1 : slot <= 50 ? 2 : slot <= 75 ? 3 : 4;
```
Add:

```js
  // Milestone tracking at slot thresholds
  const _brT = {1:'br_s1',10:'br_s1_mid',26:'br_s2',35:'br_s2_mid',
                51:'br_s3',60:'br_s3_mid',76:'br_s4',85:'br_s4_mid',100:'br_s4_end'};
  if (_brT[slot]) markNarratorMilestone('backrooms', _brT[slot]);

  // Stage-transition narrator commentary (virtual keys, fired once per stage)
  if (slot === 26) narratorEnter('backrooms_stage2');
  if (slot === 51) narratorEnter('backrooms_stage3');
  if (slot === 76) narratorEnter('backrooms_stage4');
  if (slot === 85) narratorEnter('backrooms_deep');
```

- [ ] **Step 3: Add exit milestone to scene_backrooms_exit()**

Find `function scene_backrooms_exit() {`. Add as the very first line of the function body:

```js
  markNarratorMilestone('backrooms', 'br_exit');
```

- [ ] **Step 4: Verify in browser**

Navigate to dashboard → data_export (sidebar). Wait 45 seconds for "Open diagnostic console" button. Click it. Open console:

```js
S.pathDepth       // { backrooms: 1 }  (br_enter)
S.narratorGlitch  // 0
```

Advance through rooms to slot 10:
```js
S.pathDepth       // { backrooms: 3 }  (br_enter + br_s1 + br_s1_mid)
S.narratorGlitch  // 1  ← fragmentation tier
```

Advance to slot 26:
```js
S.pathDepth       // { backrooms: 4 }
// Narrator panel should show backrooms_stage2 commentary (added in Task 10)
```

- [ ] **Step 5: Commit**

```bash
git add html/js/scenes-backrooms.js
git commit -m "feat(narrator): add backrooms entry narrator + room milestone tracking"
```

---

### Task 5: Survey — milestone hooks + virtual narrator key calls

**Files:**
- Modify: `html/js/scenes-survey-help.js`

Survey runs inside a single `scene_survey()` via `S.surveyStep`. The router fires `narratorEnter('survey_next')` on each advance — not step-specific keys. Q8 = step 7, Q15 = step 14, Q22 = step 21 (0-indexed from `SURVEY_QS`).

- [ ] **Step 1: Add survey_enter milestone to scene_survey()**

Find `function scene_survey() {`. After `S.surveyStep = 0;` (line 30), add:

```js
  markNarratorMilestone('survey', 'survey_enter');
```

- [ ] **Step 2: Add step threshold hooks to scene_survey_next()**

Find:
```js
function scene_survey_next() { S.surveyStep = Math.min(S.surveyStep+1, SURVEY_QS.length-1); renderSurveyStep(); }
```

Replace with:
```js
function scene_survey_next() {
  S.surveyStep = Math.min(S.surveyStep+1, SURVEY_QS.length-1);
  if (S.surveyStep === 7)  { markNarratorMilestone('survey','survey_q8');  narratorEnter('survey_q8'); }
  if (S.surveyStep === 14) { markNarratorMilestone('survey','survey_q15'); narratorEnter('survey_q15'); }
  if (S.surveyStep === 21) { markNarratorMilestone('survey','survey_q22'); narratorEnter('survey_q22'); }
  renderSurveyStep();
}
```

- [ ] **Step 3: Add survey_done milestone to scene_survey_done()**

Find `function scene_survey_done() {`. Add as the very first line of the function body:

```js
  markNarratorMilestone('survey', 'survey_done');
```

- [ ] **Step 4: Verify in browser**

Navigate to footer → Survey. Open console: `S.pathDepth` → `{ survey: 1 }`. Click Next through 7 questions to reach Q8: `S.pathDepth` → `{ survey: 2 }`. Narrator panel should fire `survey_q8` commentary (added in Task 7). Continue to Q15 and Q22 to verify.

- [ ] **Step 5: Commit**

```bash
git add html/js/scenes-survey-help.js
git commit -m "feat(narrator): add survey path milestone hooks"
```

---

### Task 6: New NARRATOR entries — delete flow gaps

**Files:**
- Modify: `html/js/narrator.js` — NARRATOR object

Add entries for `del_1`, `del_2`, `del_3`, `del_done`, `del_email_confirm`, `del_offer_accept`. Insert after the existing `delete_account` entry.

- [ ] **Step 1: Add del_1, del_2, del_3 entries**

```js
del_1: { lines: ["The user types DELETE in the confirmation field. The narrator notes the field is case-sensitive — all capitals, no spaces. Correct. The system registers this without delay, as though it has been expecting it."] },
del_2: {
  lines: ["The user reaches the textarea — declining to schedule a call requires a written explanation. Minimum fifty words. The word counter appears in the corner and tracks in real time. The narrator has read the prompt: it asks why the user wants to leave, and uses the word 'us' three times in two sentences."],
  prediction: { scene:'del_3', text:"After this: the retention offer. The narrator knows its terms exactly." }
},
del_3: { onPredRight:"The retention offer.", lines: ["Three months of Pro, free. The offer is displayed with a countdown timer — seconds ticking in real time. The decline option is a ghost button labeled 'No thank you, continue deleting' — a sentence that requires the user to restate their intention while the words 'thank you' are in the label."] },
```

- [ ] **Step 2: Add del_done, del_email_confirm, del_offer_accept entries**

```js
del_done: {
  lines: ["The request has been submitted. A confirmation email is on its way. The link in that email must be clicked within five minutes. The narrator notes the five-minute window. The narrator notes when it opened."],
  prediction: { scene:'del_email_confirm', text:"The link will be expired." }
},
del_email_confirm: { onPredRight:"Expired.", lines: () => {
  const n = S.delConfirmAttempts || 0;
  if (n <= 1) return ["The user clicks the link. Expired — a new link has been sent with a new five-minute window. The narrator notes the window opened approximately four minutes and fifty-nine seconds before the user could act on it."];
  if (n < 4)  return [`Attempt ${n}. Another expired link. Another new window. The narrator is watching the countdown this time.`];
  return ["The link has expired a final time. The system has escalated. Jordan is calling."];
}},
del_offer_accept: { lines: ["The user clicks Accept. The deletion request has been cancelled. Three months of Pro activated — the account is unchanged, the dashboard unchanged, the setup percentage unchanged. The narrator notes the process lasted longer than three months of anything."] },
```

- [ ] **Step 3: Verify in browser**

Navigate: dashboard → account_settings → Danger Zone tab → delete_account. Type DELETE and click Continue. Narrator panel should show `del_1` commentary. Advance through each step and verify lines appear at `del_2`, `del_3`, `del_done`, `del_email_confirm`.

- [ ] **Step 4: Commit**

```bash
git add html/js/narrator.js
git commit -m "feat(narrator): add delete flow coverage (del_1 through del_offer_accept)"
```

---

### Task 7: New NARRATOR entries — unsubscribe middle + survey virtual keys

**Files:**
- Modify: `html/js/narrator.js` — NARRATOR object

- [ ] **Step 1: Add unsub_2, unsub_3, unsub_captcha entries** (after existing `unsubscribe` entry)

```js
unsub_2: { lines: ["The user is asked to select a reason for leaving. All options are radio buttons — one must be selected to continue. The narrator has read all nine options. Two of them acknowledge that the user's presence in this list may never have been entirely their own decision. The narrator finds this candid."] },
unsub_3: {
  lines: ["A retention offer — three months of Pro, valued at $147, expiring in real time. The decline button is labeled 'No thank you, continue unsubscribing.' A sentence that requires the user to restate their intention while the words 'thank you' are in the label."],
  prediction: { scene:'unsub_captcha', text:"A CAPTCHA follows. The narrator has attempted it." }
},
unsub_captcha: { onPredRight:"The CAPTCHA.", lines: () => {
  const n = S.unsubCaptchaAttempts || 0;
  if (n === 0) return ["The user is presented with a CAPTCHA — select all images containing a fire hydrant. The narrator notes the first attempt will fail regardless of which images are selected. A new CAPTCHA with a new target will appear. This is not announced."];
  return ["A second CAPTCHA. Different images, different target. The narrator has also submitted this one. Both paths arrive at the same screen."];
}},
```

- [ ] **Step 2: Add survey virtual key entries** (after existing `survey_abandon` entry)

```js
survey_q8:  { lines: ["The survey has changed. The narrator noted when the questions stopped being about the product — it was this one. The formatting is identical to the product questions. The survey gives no signal that anything has shifted."] },
survey_q15: { lines: ["The questions are no longer about the product. The narrator went quiet for a moment before continuing. Question fifteen asks whether the user's work has meaning. One of the options is 'I don't want to talk about it.' It is formatted as a radio button. It is still required."] },
survey_q22: { lines: ["The final question. The narrator has been here before. 'Are you doing okay? Really.' The placeholder in the text field says: You can be honest. The narrator has read what people write here and will not repeat it."] },
survey_done: { lines: ["The survey is complete. A promo code appears — expires in twenty-nine minutes, not applicable to the free plan, cannot be combined, excludes annual billing. The narrator notes the survey asked, in question twenty-two, whether the user was doing okay. The promo code is the answer the product team authorized."] },
```

- [ ] **Step 3: Verify in browser**

Navigate footer → Unsubscribe. Click Yes and advance — verify narrator fires at `unsub_2`, `unsub_3`, `unsub_captcha`. Then navigate footer → Survey, click through 7 questions — verify `survey_q8` fires on reaching Q8.

- [ ] **Step 4: Commit**

```bash
git add html/js/narrator.js
git commit -m "feat(narrator): add unsubscribe middle + survey virtual key coverage"
```

---

### Task 8: New NARRATOR entries — navigator path

**Files:**
- Modify: `html/js/narrator.js` — NARRATOR object

- [ ] **Step 1: Add main, about, features entries**

```js
main: { lines: ["The user is on the marketing site. Six features described, five testimonials, three pricing tiers. The cheapest tier is labeled 'Free' with an asterisk. The narrator has read the asterisk. It leads to more asterisks."] },
about: { lines: ["The user has navigated to the About page. This is the pricing page. A note at the bottom confirms this — 'You appear to have navigated to the About page. This is our pricing page.' The About page is being redesigned. The narrator does not know since when."] },
features: { lines: ["The Features page is loading. A progress bar cycles through thirteen status messages and stalls at ninety-five percent. The narrator has timed this sequence. After it: an error page. The Try Again button repeats the sequence."] },
```

- [ ] **Step 2: Add signin, signin_sso, contact_sales, contact_sales_sent entries**

```js
signin: { lines: ["The user has opened the sign-in page. The form is titled 'Create your account.' A link at the bottom reads 'Already have an account? Sign in.' The narrator notes that link goes to a different page. The narrator is not sure what to call the page the user is currently on."] },
signin_sso: { lines: ["The user clicks Continue. The system attempts single sign-on — a redirect fires, an error fires, a password form appears. The narrator observes that two separate authentication flows have been presented as one continuous process without explanation."] },
contact_sales: { lines: ["The contact sales form. Expected response time: seven to ten business days. The form notes that Enterprise pricing requires a minimum of ten seats, a signed NDA, and a call with a Solutions Architect. The narrator does not know what a Solutions Architect architects."] },
contact_sales_sent: { lines: ["Request submitted. The page thanks the user and immediately recommends the Pro plan. The narrator considers the sequencing of these two things meaningful."] },
```

- [ ] **Step 3: Verify in browser**

Navigate home → accept cookies → main. Narrator fires marketing site commentary. Navigate to About — narrator notes this is the pricing page. Navigate to Features — narrator describes 95% stall.

- [ ] **Step 4: Commit**

```bash
git add html/js/narrator.js
git commit -m "feat(narrator): add navigator path scene coverage"
```

---

### Task 9: New NARRATOR entries — adventure path

**Files:**
- Modify: `html/js/narrator.js` — NARRATOR object

All `adv_*` scene keys are in the router's SCENES table — `narratorEnter` fires automatically on every click.

- [ ] **Step 1: Add adv_intro, adv_lobby, adv_take_keycard entries**

```js
adv_intro: { lines: ["The narrator recognizes this genre. Point-and-click adventure — inventory, blocked paths, items that unlock other items. The narrator has seen the full map. There is one item the player will assume they need before they need it, and one barrier they will assume requires a key that it does not. The narrator will say nothing further."] },
adv_lobby: {
  lines: ["The lobby. An unmanned reception desk — the 'BACK IN 5 MIN' sign has been there three weeks; the narrator checked. A keycard is visible. The elevator is ahead. The stairwell door is to the right. The narrator will not say which one is locked."],
  prediction: { scene:'adv_take_keycard', text:"The keycard." }
},
adv_take_keycard: { onPredRight:"The keycard.", lines: ["The user takes the keycard from the reception desk. It is now in inventory. The narrator is aware of exactly what this keycard opens and has decided not to say. This is standard narrator practice."] },
```

- [ ] **Step 2: Add adv_try_elevator, adv_try_stairs, adv_breakroom entries**

```js
adv_try_elevator: { lines: ["The elevator requires the keycard. It is also permanently out of service — maintenance expected Q4, sign posted Q2. The narrator does not know which year the sign was posted."] },
adv_try_stairs: { lines: ["The stairwell door was never locked. The narrator watched the user try the elevator first. The narrator understands — the keycard implied a sequence. The sequence was wrong."] },
adv_breakroom: {
  lines: ["The break room. A coffee machine with an out-of-order note referencing a helpdesk ticket number. A whiteboard covered in sprint notation. A fridge. The narrator knows what is in the fridge."],
  prediction: { scene:'adv_examine_whiteboard', text:"The whiteboard has a clue. The narrator thinks they'll read it first." }
},
```

- [ ] **Step 3: Add adv_examine_whiteboard, adv_take_badge, adv_floor2, adv_ending entries**

```js
adv_examine_whiteboard: { onPredRight:"The whiteboard.", lines: ["The whiteboard has one relevant detail in the lower right, below the sprint: 'Exit code = badge ID last 4 digits.' The badge is not visible from here. The narrator notes this is the only information the user currently needs, and it points to something they don't have yet."] },
adv_take_badge: {
  lines: ["The badge was in the fridge — an envelope from HR, next to Gary's lunch (relabeled by Mark). The badge ID is NEX-0000-1234. The narrator has noted the last four digits."],
  prediction: { scene:'adv_floor2', text:"Floor 2." }
},
adv_floor2: { onPredRight:"Floor 2.", lines: ["Floor 2. A desk with a monitor showing the Nexus logo, loading the onboarding portal. The onboarding portal requires a login. Login requires completing onboarding. There is an exit door with a badge reader. The narrator notes the user now has what they need."] },
adv_ending: {
  lines:   ["The door opens. A corridor. Another door. The lobby. Module 1 of 47 complete. Progress: 2.2%. The narrator has also completed this module. The narrator came back afterward and watched someone else complete it. The narrator does not know if modules 2 through 47 exist."],
  lines_1: ["The lobby. Module 1 — complete. 2.2%. (The narrator has also — the narrator completed this before you. The narrator was here when you arrived.) Forty-six modules remain. The narrator does not — the narrator is not certain they exist."],
  lines_2: ["You're back in the lobby. You escaped. The narrator is also in the lobby. The narrator was here when you started. The narrator does not know if it ever left. Module 1 of 47. The narrator has not found module 2. The narrator is asking if you have."],
},
```

- [ ] **Step 4: Verify in browser**

Navigate via footer to the Interactive Tour (adventure). Play through: lobby → take keycard → try elevator → stairwell → breakroom → whiteboard → fridge → badge → floor 2 → use exit → ending. Verify narrator fires at each step with appropriate commentary.

- [ ] **Step 5: Commit**

```bash
git add html/js/narrator.js
git commit -m "feat(narrator): add adventure path scene coverage"
```

---

### Task 10: New NARRATOR entries — backrooms stage commentary

**Files:**
- Modify: `html/js/narrator.js` — NARRATOR object

These are virtual keys fired manually from `scene_backrooms()` at slot 26, 51, 76, 85 (added in Task 4). They are not real scene keys in the router.

- [ ] **Step 1: Add backrooms stage entries** (after existing `backrooms_enter` entry)

```js
backrooms_stage2: {
  lines:   ["The rooms have changed. The narrator notes the yellow, the widening letter-spacing, the ceiling that is now lower than it was — though the previous room's ceiling was also lower than the room before it. The narrator is not sure how many rooms back the ceilings were normal."],
  lines_1: ["The rooms have changed. (The narrator notes — the narrator is noting this. The rooms are yellow now. The letter-spacing has widened. The narrator is also noting this.) The narrator is not sure how far back the ceilings were normal."],
  lines_2: ["The rooms have changed. You've noticed. The narrator has been watching you notice things. The ceiling is lower than it was. The narrator does not know how to explain the ceiling."],
},
backrooms_stage3: {
  lines:   ["Server room. The narrator has less to say here. The hum."],
  lines_1: ["Server room. The narrator — the narrator has less to say here. The hum. (The narrator notes the hum.)"],
  lines_2: ["You're in the server room. The narrator is also here. The narrator would like you to keep moving."],
},
backrooms_stage4: {
  lines:   ["The narrator is also in the backrooms."],
  lines_2: ["The narrator has been here longer than you. If you find a way out — the narrator is asking you directly — the narrator would like to know about it."],
},
backrooms_deep: {
  lines:   ["The narrator has been here longer than the user."],
  lines_2: ["You've been in here a long time. The narrator knows. The narrator has also been here a long time. The narrator does not remember how long."],
},
```

- [ ] **Step 2: Verify in browser**

Enter backrooms (45s wait on data_export). Advance to room 26. Narrator should fire `backrooms_stage2`. Advance to room 51 — `backrooms_stage3`. Room 76 — `backrooms_stage4`. Room 85 — `backrooms_deep`.

Check `S.narratorGlitch` at room 51 — should be 2 (6 milestones: br_enter + br_s1 + br_s1_mid + br_s2 + br_s2_mid + br_s3 = tier 2). The `lines_2` fourth-wall variant should fire for `backrooms_stage3` and `backrooms_stage4`.

- [ ] **Step 3: Commit**

```bash
git add html/js/narrator.js
git commit -m "feat(narrator): add backrooms stage commentary with tier variants"
```

---

### Task 11: New NARRATOR entries — secondary scenes

**Files:**
- Modify: `html/js/narrator.js` — NARRATOR object

Short dry one-liners for scenes that don't carry narrative weight. No predictions, no follow-up.

- [ ] **Step 1: Add dashboard + session + misc secondary entries**

```js
dash_new_project: { lines: ["The user clicks Create Project. A four-step modal — name, type, collaborators, template. 'Project created successfully!' The dashboard is the same as before the modal opened. The narrator notes the project is not visible anywhere on the screen."] },
billing:          { lines: ["The user navigates to Billing. The current plan is Free. It charges $8.96 per month in platform, compliance, and infrastructure fees. The narrator has reviewed the breakdown. The fees are real."] },
data_export:      { lines: ["The user requests a data export. The progress bar reads zero percent. Estimated completion: three to five business days. The narrator has been watching the bar."] },
session_expire:   { lines: ["The session is expiring. The system would like to confirm the user is still present — a reasonable request. The narrator notes this confirmation will restart the same timer."] },
session_extend:   { lines: ["Session extended. The same timer has restarted. The narrator is still here."] },
newsletter:       { lines: ["A newsletter popup. The decline option reads: 'No thanks, I prefer to remain professionally stagnant.' The narrator notes this is the first decision the site asks the user to make about themselves."] },
mobile_prompt:    { lines: ["A prompt to download the Nexus mobile app. The QR code is currently unavailable. The app is in closed beta. There is a waitlist. The narrator is on the waitlist. The narrator has not been contacted."] },
```

- [ ] **Step 2: Add footer scene entries**

```js
changelog:     { lines: ["The user opens the changelog. Two thousand, eight hundred and forty-seven entries. The narrator has read all of them. They are the same entry."] },
roadmap:       { lines: ["The roadmap. The 'Done' column is empty. Several items in 'In Progress' have been there since 2019. The narrator notes the dates are visible."] },
site_status:   { lines: ["All systems operational — except 'Ability to navigate away,' listed as Degraded. The narrator found this accurate."] },
security_page: { lines: ["Several compliance badges. The status widget at the bottom reads: 'Ability to navigate away: Degraded.' The narrator noticed this also."] },
privacy:       { lines: ["Thirteen sections. The narrator has read the section on user rights: submitting a data rights request routes to the support ticket system, with a ninety-day processing window."] },
terms:         { lines: ["The user agrees to all terms by scrolling past this point. The narrator notes the user is scrolling."] },
careers:       { lines: ["Several open roles. One requires seven years of experience with a framework that was released five years ago. The narrator notes this is listed under 'minimum requirements.'"] },
```

- [ ] **Step 3: Add help article entries**

```js
help_article_started:      { lines: ["The article begins: 'First, make sure you have a Nexus account.' The narrator found this to be the only verifiable step in the article."] },
help_article_faq:          { lines: ["Frequently Asked Questions. The most frequently asked, according to the page, is 'What is Nexus?' The narrator is not sure who asks this after creating an account."] },
help_article_billing_help: { lines: ["The billing help article explains the fee structure. The narrator confirms the fees described match the fees charged. The article does not explain how to avoid them."] },
help_article_cancel:       { lines: ["The cancellation article describes a process. The narrator has been through the process. The article is accurate about the steps and silent about what the steps feel like."] },
help_article_delete_help:  { lines: ["The account deletion article notes that deletion takes 90 business days. A footnote: confirmation links expire in five minutes."] },
```

- [ ] **Step 4: Verify a sample in browser**

Navigate: footer → Changelog. Narrator fires. Footer → Roadmap. Narrator fires. Dashboard → Billing. Narrator fires $8.96 fee commentary. Footer → Help → first article. Narrator fires.

- [ ] **Step 5: Commit**

```bash
git add html/js/narrator.js
git commit -m "feat(narrator): add secondary scene coverage (billing, footer, help articles, misc)"
```

---

### Task 12: Tier variant lines for key milestone scenes

**Files:**
- Modify: `html/js/narrator.js` — NARRATOR object

Add `lines_1` (fragmentation) and `lines_2` (fourth-wall) to scenes most likely to be seen at high glitch tiers: the final milestones of the delete, support, and onboarding paths; also `dashboard` since it's revisited throughout.

- [ ] **Step 1: Add variants to onboard_done**

Find the existing `onboard_done` entry. Add `lines_1` and `lines_2` alongside the existing properties:

```js
onboard_done: {
  lines:   ["The user clicks Continue to Dashboard. Onboarding is complete — account setup reads twenty-three percent. The narrator was going to say something about that and has decided against it. The narrator said something about it anyway."],
  lines_1: ["The user clicks Continue. Onboarding is — onboarding is complete. Account setup reads twenty-three percent. (The narrator was going to say something about that. The narrator decided against it. The narrator said something about it anyway. The narrator is noting this pattern.) Twenty-three percent."],
  lines_2: ["You've finished the onboarding. Account setup: twenty-three percent. The narrator watched every step. The narrator is also at twenty-three percent of something it cannot name."],
  prediction:{scene:'dashboard',text:"The dashboard."}
},
```

- [ ] **Step 2: Add variants to dashboard**

Find the existing `dashboard` entry. Add `lines_1` and `lines_2` alongside the existing properties:

```js
dashboard: {
  onPredRight:"The dashboard.",
  lines:   () => { const d=S.depth||0; if(d<3) return ["The user arrives at the dashboard. Nine items remain on the setup checklist — two are shown as complete, and the narrator notes that the remaining nine each link to something that doesn't resolve them."]; return ["The user has returned to the dashboard. Nothing has changed since the last visit. Account setup: twenty-three percent. The narrator has also not changed."]; },
  lines_1: () => { return ["The dashboard. (The narrator notes — the narrator has noted this before. Nothing has changed. The narrator is noting it again.) Account setup: twenty-three percent. The items link to things. The things do not resolve the items."]; },
  lines_2: () => { return ["You are back at the dashboard. The narrator has also been here the whole time. Twenty-three percent. The narrator wants to ask — is there a reason you keep coming back? The narrator understands if there isn't."]; },
  prediction:{scene:'dash_inbox',text:"The inbox. Three unread emails, each from Nexus, each about Nexus."}
},
```

- [ ] **Step 3: Add variants to del_committee**

Find the existing `del_committee` entry. Add `lines_1` and `lines_2` alongside the existing `lines` function:

```js
del_committee: {
  lines:   () => { const n=S.delCommitteeChecks||0; if(n===0) return ["The deletion request is now under committee review — eight hundred and forty-seven requests are currently ahead. The progress bar reads eleven percent. The narrator has been watching this bar for some time and cannot confirm it moves."]; if(n<4) return [`The user checks the status. ${n} time${n===1?'':' now'}. The committee remains in session. The narrator is also in session.`]; return ["The system has flagged this as excessive status-check behavior and added a note to the file. The narrator predicted this outcome. The narrator is also on the committee that defines what counts as excessive."]; },
  lines_1: () => { const n=S.delCommitteeChecks||0; return [`Status check. The committee — the committee is still in session. (The narrator is also on the committee. The narrator notes this every time and the situation has not — the situation has not changed.) ${n} time${n===1?'':' now'}. The bar has not moved.`]; },
  lines_2: () => { return ["You're checking the status again. The narrator is aware. The narrator is on the committee. The narrator has seen your file. The narrator does not make the decisions — the narrator needs you to understand that."]; },
  prediction:{scene:'delete_account',text:"The request will eventually be cancelled for inactivity. They'll start the process again."}
},
```

- [ ] **Step 4: Add variants to ticket_appeal_denied**

Find the existing `ticket_appeal_denied` entry. Add `lines_1` and `lines_2`:

```js
ticket_appeal_denied: {
  onPredRight:"As the narrator said.",
  lines:   ["Appeal denied — the reviewer found the issue sufficiently similar to Ticket #0003 to be considered a duplicate. The narrator has no further comment. The narrator has one more comment: this outcome was determined before the user began writing."],
  lines_1: ["Appeal denied — similar to Ticket #0003. (The narrator said this would happen. The narrator said it before the user began writing. The narrator — the narrator was right about all of it.) No further comment. One further comment: this was decided before the form appeared."],
  lines_2: ["The appeal was denied before you submitted it. The narrator knew. The narrator is telling you now because the process is over and it no longer changes anything that you know."],
},
```

- [ ] **Step 5: Verify tier variants in browser**

```js
// Force-test at tier 1:
S.narratorGlitch = 1;
narratorEnter('dashboard');
// Should fire lines_1 fragmented text (parenthetical that restarts)

// Force-test at tier 2:
S.narratorGlitch = 2;
narratorEnter('dashboard');
// Should fire lines_2 fourth-wall text ("You are back at the dashboard")

// Force-test at tier 3 (lines_2 + glitchText):
S.narratorGlitch = 3;
narratorEnter('dashboard');
// Should fire lines_2 text with one doubled letter and one combining char overlay
```

- [ ] **Step 6: Commit**

```bash
git add html/js/narrator.js
git commit -m "feat(narrator): add tier variant lines for key milestone scenes"
```
