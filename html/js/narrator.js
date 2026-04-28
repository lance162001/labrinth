// ────────────── CHAT WIDGET ──────────────

// ─── NARRATOR ───────────────────────────────────────────────────

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
  survey:      ['survey_enter','survey_q8','survey_q15','survey_q22','survey_done'],
  backrooms:   ['br_enter','br_s1','br_s1_mid','br_s2','br_s2_mid',
                 'br_s3','br_s3_mid','br_s4','br_s4_mid','br_exit'],
};

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

function glitchText(str, severity) {
  if (!severity) return str;
  const seed = S.narratorMsgCount || 0;
  let words = str.split(' ');

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

const NARRATOR_CORRECT = ['As predicted.','Called it.','I knew it.','Yes.','Mm.','As expected.','The narrator was right.'];
const NARRATOR_WRONG   = ['Oh.','Hmm.','...Interesting.','That wasn\'t what I predicted.','The narrator notes this deviation.','Not the expected path.','The narrator was mistaken. This is fine.','Unexpected.'];
const NARRATOR_USER_REPLIES = [
  'The narrator does not take questions.',
  'The narrator is not here to answer questions.',
  'Interesting. They\'re trying to communicate with me.',
  'The narrator continues regardless.',
  'That has been noted and set aside.',
  'The narrator sees what you typed. The narrator has moved on.',
  'Comments are appreciated. They change nothing.',
];

const NARRATOR = {
  home:              { lines:["Hi! I'm the Nexus Assistant. 👋 I can see the user has arrived at the homepage — I'll be right here to guide them through everything. Feel free to look around!", "I notice the page describes the product as streamlining workflows, empowering collaboration, and unlocking synergies. All excellent verbs. I'm sure they mean something specific. 😊"], prediction:{scene:'pricing',text:"I think they'll head to pricing next to compare plans — happy to help if you have questions! 😊"} },
  cookies:           { lines:["I see the user has opened the cookie consent dialog! 🍪 Clicking Accept All is the fastest way to continue — their preferences have been recorded, including a few they didn't set themselves."], prediction:{scene:'loading',text:"Looks like they clicked Accept All. Loading now — almost there! 🎉"} },
  cookie_prefs:      { lines:["I can see the user is reviewing the detailed cookie preferences. I should mention that 'Strictly Necessary' cannot be disabled — this is standard practice, though the narrator notes it does make the other toggles feel somewhat performative."] },
  loading:           { onPredRight:"Loading now! Just a moment. 🎉", lines:["The experience is loading — this usually only takes a moment! The narrator notes this is also the most transparent part of the process: a bar that moves, a percentage that increases. The narrator will say no more about that."], prediction:{scene:'signup',text:"The signup form is coming next — seven steps total. I'll guide them through every one!"} },
  pricing:           { lines:["I can see the user is reviewing the pricing page. The Pro plan is our most popular option — $49 per user per month, billed annually — excellent value for growing teams! The fine print is at the bottom of the page, in a smaller font. The narrator recommends reading it."], prediction:{scene:'checkout',text:"I predict the user will click Start Free Trial to get the process going!"} },
  signup:            { onPredRight:"The user clicks Get Started Free — starting the account creation process! 🎉", lines:["The user clicks Get Started Free and the account creation process begins. There are seven steps — I'll be right here throughout! The narrator will also be right here, watching, for somewhat different reasons."], prediction:{scene:'signup_2',text:"Step 2 is password creation. I'll let you know if you need anything!"} },
  signup_2:          { onPredRight:"Moving on to the password step.", lines:["The user is creating a password. The system has specific requirements — uppercase, lowercase, a number, a symbol, and at least one character the narrator has not been able to identify on a standard keyboard layout. The user will figure it out."] },
  signup_3:          { lines:["The user fills in their professional details — full legal name, job title, department, and company size. The narrator notes this information feeds the judges. I mean: the recommendation engine. The narrator meant what it said the first time."] },
  signup_4:          { lines:["The user is asked for a phone number, listed as required with a small asterisk. The narrator is noting this phone number. It will come up again later in a way that will be inconvenient."] },
  signup_5:          { lines:["The user selects their integrations. Several checkboxes are already marked — Slack, Google Drive, and two others the narrator does not recognize. The narrator is not sure who selected them."] },
  signup_6:          { lines:["Adding a teammate is required to continue — just one, a reasonable request. The user is considering who they know well enough to include in this. The narrator is patient."] },
  signup_7:          { lines:["The user has reached email verification — the final step! A code has been sent to their inbox. The narrator is aware of something about this code and has decided not to say what."], prediction:{scene:'verify_check',text:"They'll enter the code. It won't match."} },
  verify_check:      { onPredRight:"The user clicks Verify. The code does not match.", lines:["The user clicks Verify. Incorrect — the system is very certain. The narrator notes this will happen at least once more."] },
  verify_locked:     { lines:["The user clicks Verify a final time. The account is now temporarily locked for thirty minutes, during which the user may reconsider several of the decisions that led here. The studio lights have not dimmed."] },
  verify_bypass:     { lines:["The user clicks Verify a third time and the system decides to proceed anyway, logging a behavioral anomaly that has been added permanently to the account record. The narrator notes: this is fine. The narrator is not entirely sure this is fine."], prediction:{scene:'onboard_start',text:"An onboarding wizard is about to begin. Eight steps."} },
  onboard_start:     { onPredRight:"The onboarding wizard. Eight steps.", lines:["The user clicks Enter Workspace and an eight-step onboarding wizard launches — estimated completion time twelve minutes, which the narrator privately gives forty-five. The setup checklist shown on this screen will not update when these steps are finished."], prediction:{scene:'onboard_workspace',text:"First: naming the workspace. Whatever they type will already be taken."} },
  onboard_workspace: { onPredRight:"Whatever they typed was taken.", lines:["The user types a workspace name. It has been taken. They try another — also taken, this time described as 'reserved,' which the narrator understands to be a different category of unavailable that doesn't help the user any more than the first one."] },
  onboard_avatar:    { lines: () => { const n=S.onboardAvatarAttempts||0; if(n===0) return ["The user clicks Upload Photo and selects a file. The compliance AI is now reviewing it against photo standards the narrator has not been able to locate in any documentation."]; if(n===1) return ["The photo has been rejected. The compliance system found it inadequate in ways that remain unspecified. The user selects another file and tries again."]; return [`Upload attempt ${n+1}. The compliance AI is unconvinced. The narrator has stopped trying to identify what it is looking for.`]; } },
  onboard_calendar:  { lines:["The user clicks to connect their calendar. A connection is attempted with Google Calendar, then Outlook, then whatever else is listed. Each one fails with a different error code that means, in effect, the same thing. The narrator expected this."], prediction:{scene:'onboard_teammates',text:"After this: inviting teammates. Every address will bounce for a different stated reason."} },
  onboard_teammates: { onPredRight:"Every address bounced.", lines: () => { const n=S.onboardInvitesSent||0; if(n===0) return ["The user is asked to invite at least two teammates — all addresses must be business emails, must pass MX validation, must not be role-based, and must not belong to domains already registered with another Nexus organization. The narrator has read the full validation criteria."]; return [`The user clicks Send. Invitation ${n} bounces — the reason is specific and plausible and the narrator has heard them all. They say, in different words, that this address cannot be invited.`]; }, prediction:{scene:'onboard_usecase',text:"Use-case selection follows. Three new required steps will appear regardless of which option they choose."} },
  onboard_usecase:   { onPredRight:"Three new required steps appeared.", lines:["The user selects a use case from the list. Three new required configuration steps have been queued to their account. The narrator checked all six options — this happens with all of them."] },
  onboard_notifications:{ lines:["The user reaches notification preferences. All ten notification categories are enabled by default. Unchecking any of them produces a modal warning about missing critical updates. The narrator has attempted to disable all ten individually. The narrator found it instructive."] },
  onboard_video:     { lines:["The user clicks Play on the required onboarding video. It does not load. A skip option appears after five seconds — the narrator has timed this exactly — but the skip requires typing a specific phrase rather than clicking a checkbox, which the narrator considers a meaningful distinction."], prediction:{scene:'onboard_quiz',text:"A security awareness quiz follows. The narrator knows all the correct answers and is unable to share them."} },
  onboard_quiz:      { onPredRight:"The security quiz.", lines: () => { const n=S.onboardQuizAttempts||0; const q=(S.onboardQuizQ||0)+1; if(n===0) return ["The user reaches the security awareness check — three questions, no time limit. The narrator knows the correct answers. The user is invited to select from four options, one of which is correct."]; if(n<3) return [`Question ${q}, attempt ${n+1}. The user selects an answer. It is marked incorrect. The documentation link leads to a PDF last updated in 2019.`]; return ["Too many incorrect answers — the quiz has reset to question 1. The correct answers have not changed. The narrator will sit with this."]; } },
  onboard_done: {
    lines:   ["The user clicks Continue to Dashboard. Onboarding is complete — account setup reads twenty-three percent. The narrator was going to say something about that and has decided against it. The narrator said something about it anyway."],
    lines_1: ["The user clicks Continue. Onboarding is — onboarding is complete. Account setup reads twenty-three percent. (The narrator was going to say something about that. The narrator decided against it. The narrator said something about it anyway. The narrator is noting this pattern.) Twenty-three percent."],
    lines_2: ["You've finished the onboarding. Account setup: twenty-three percent. The narrator watched every step. The narrator is also at twenty-three percent of something it cannot name."],
    prediction:{scene:'dashboard',text:"The dashboard."}
  },
  dashboard: {
    onPredRight:"The dashboard.",
    lines:   () => { const d=S.depth||0; if(d<3) return ["The user arrives at the dashboard. Nine items remain on the setup checklist — two are shown as complete, and the narrator notes that the remaining nine each link to something that doesn't resolve them."]; return ["The user has returned to the dashboard. Nothing has changed since the last visit. Account setup: twenty-three percent. The narrator has also not changed."]; },
    lines_1: () => { return ["The dashboard. (The narrator notes — the narrator has noted this before. Nothing has changed. The narrator is noting it again.) Account setup: twenty-three percent. The items link to things. The things do not resolve the items."]; },
    lines_2: () => { return ["You are back at the dashboard. The narrator has also been here the whole time. Twenty-three percent. The narrator wants to ask — is there a reason you keep coming back? The narrator understands if there isn't."]; },
    prediction:{scene:'dash_inbox',text:"The inbox. Three unread emails, each from Nexus, each about Nexus."}
  },
  dash_inbox:        { onPredRight:"The inbox.", lines:["The user clicks Inbox. Three unread emails from Nexus — a forty-seven item setup checklist, a reminder about team invitations that have all bounced, and a personal note from the CEO. The narrator has read all three and will not spoil them."], prediction:{scene:'inbox_email_3',text:"The CEO wrote personally. The user will open that one."} },
  inbox_email_1:     { lines:["The user opens the setup checklist email. It contains forty-seven action items. The narrator counted. Each one links to a page within Nexus, and none of them, when visited, resolve the item they are linked from."] },
  inbox_email_2:     { lines:["The user opens the team invitation reminder. It lists the colleagues they were encouraged to invite. All of them bounced for different reasons. The email encourages the user to try again with different addresses."] },
  inbox_email_3:     { onPredRight:"The CEO letter.", lines:["The user opens a personal note from Alex Chen, CEO. It was written personally — also automatically, at account creation, for every new user simultaneously. Both things are true at once, and the narrator finds this representative of something it cannot fully articulate."] },
  checkout:          { onPredRight:"The upgrade flow.", lines:["The user clicks to upgrade their plan. The minimum seat count is three — for one user. Five add-ons are pre-selected as required features. The total will increase each time a new field is completed. The narrator has done the math and will not share the number."], prediction:{scene:'checkout_billing',text:"The billing form comes next. Every field will be required."} },
  checkout_billing:  { onPredRight:"Every field.", lines:["The user begins filling in the billing form — company name, address, city, postal code, country, VAT number, and a Purchase Order field that requires either a valid PO number or confirmation that no PO exists, both of which generate different follow-up fields. The narrator is counting."] },
  checkout_payment:  { lines: () => { const n=S.checkoutPayAttempts||0; if(n===0) return ["The user enters their card details. The card will be declined — the narrator wants to be clear this is structural and not personal. The error code will be specific and unhelpful."]; if(n<3) return [`Attempt ${n+1}. Declined again, this time with a different error code that means the same thing. The narrator remains present.`]; return ["The transaction has been blocked by the fraud prevention system. The narrator suggests looking at the alternative payment options and immediately has second thoughts about that suggestion."]; }, prediction:{scene:'checkout_alt',text:"After enough declines, they'll look at the alternative payment page."} },
  checkout_alt:      { onPredRight:"The alternatives.", lines:["The user clicks on alternative payment methods. Wire transfer: ten to fifteen business days. PayPal: merchant not found. Invoice billing: requires an enterprise contract. Existing credits: zero. The narrator has reviewed all four options. They are, in practice, one option."] },
  account_settings:  { lines:["The user navigates to account settings. Changing a password requires SMS verification to a registered phone number. Adding a phone number requires confirming the current password via an SMS code sent to a registered phone number. The narrator notes the shape of this."] },
  delete_account:    { lines:["The user clicks Delete Account. The narrator understands completely. There is a process — structured, multi-step, with a scheduling component and a human being named Jordan."], prediction:{scene:'del_schedule',text:"Jordan will be involved."} },
  del_schedule:      { onPredRight:"Jordan.", lines:["The user clicks Schedule a Call with a Retention Specialist and selects a thirty-minute slot from Jordan's calendar. Jordan has been notified. The narrator notes that Jordan's calendar was entirely open."] },
  del_jordan_ring:   { lines:["Jordan is calling. The narrator suggests answering — not because it accelerates the process, but because Jordan will keep calling if unanswered, and both paths eventually arrive at the same place."], prediction:{scene:'del_call',text:"They'll answer."} },
  del_call:          { onPredRight:"They answered.", lines:["The user clicks Answer. Jordan begins the retention script — twenty-one steps, the warmth genuine and the inflection practiced, the pauses in the same places every time. The narrator has heard this script before. Word for word. The narrator finds it affecting regardless."] },
  del_call_decline:  { lines:["The user declines the call. A note has been added to the account record: 'User unresponsive to outreach.' A committee has been informed. The narrator is on the committee and voted to add the note."] },
  del_committee: {
    lines:   () => { const n=S.delCommitteeChecks||0; if(n===0) return ["The deletion request is now under committee review — eight hundred and forty-seven requests are currently ahead. The progress bar reads eleven percent. The narrator has been watching this bar for some time and cannot confirm it moves."]; if(n<4) return [`The user checks the status. ${n} time${n===1?'':' now'}. The committee remains in session. The narrator is also in session.`]; return ["The system has flagged this as excessive status-check behavior and added a note to the file. The narrator predicted this outcome. The narrator is also on the committee that defines what counts as excessive."]; },
    lines_1: () => { const n=S.delCommitteeChecks||0; return [`Status check. The committee — the committee is still in session. (The narrator is also on the committee. The narrator notes this every time and the situation has not — the situation has not changed.) ${n} time${n===1?'':' now'}. The bar has not moved.`]; },
    lines_2: () => { return ["You're checking the status again. The narrator is aware. The narrator is on the committee. The narrator has seen your file. The narrator does not make the decisions — the narrator needs you to understand that."]; },
    prediction:{scene:'delete_account',text:"The request will eventually be cancelled for inactivity. They'll start the process again."}
  },
  support_ticket:    { lines:["The user clicks Submit a Ticket. All fields are required — category, sub-category, a subject between 5 and 120 characters, and a description of at least ten words that should include account email, reproduction steps, and what has already been attempted. The narrator has counted the fields ahead of time."], prediction:{scene:'ticket_submitted',text:"They'll fill it all out carefully. Then: the waiting begins."} },
  ticket_submitted:  { onPredRight:"Submitted.", lines:["The user clicks Submit Ticket. A number is assigned, a confirmation email dispatched, and an automated review process begins. The narrator knows the full sequence of what happens next and has decided not to say — the user will find out, and knowing in advance doesn't change it."] },
  ticket_needs_info: { lines:["The user opens a ticket status notification. More information is required before the ticket can proceed — eight additional fields, most of which match the fields already submitted in the original ticket. The narrator notes this without further comment, because further comment would not help."] },
  ticket_escalated:  { lines:["The ticket has been escalated to Tier 2 support. The estimated wait time is now longer than the original Tier 1 estimate. The queue position has also increased. The narrator does not understand how either of those things works and suspects no one does."] },
  ticket_merged:     { lines:["The ticket has been merged with Ticket #0003 from March 2019, which was marked resolved at the time. This ticket is now also resolved by extension. The narrator finds this internally consistent and is choosing to leave it at that."] },
  ticket_appeal:     { lines:["The user clicks File an Appeal. A text field requires at least one hundred and fifty words explaining how the current issue differs meaningfully from Ticket #0003. The narrator is already counting. The narrator will not share the count."], prediction:{scene:'ticket_appeal_denied',text:"The appeal will not be approved."} },
  ticket_appeal_denied: {
    onPredRight:"As the narrator said.",
    lines:   ["Appeal denied — the reviewer found the issue sufficiently similar to Ticket #0003 to be considered a duplicate. The narrator has no further comment. The narrator has one more comment: this outcome was determined before the user began writing."],
    lines_1: ["Appeal denied — similar to Ticket #0003. (The narrator said this would happen. The narrator said it before the user began writing. The narrator — the narrator was right about all of it.) No further comment. One further comment: this was decided before the form appeared."],
    lines_2: ["The appeal was denied before you submitted it. The narrator knew. The narrator is telling you now because the process is over and it no longer changes anything that you know."],
  },
  unsubscribe:       { lines:["The user clicks Unsubscribe from marketing emails. The narrator has seen this path before and knows it does not conclude where the user expects it to."], prediction:{scene:'unsub_done',text:"They'll be unsubscribed from some lists and quietly enrolled in two new ones."} },
  unsub_done:        { onPredRight:"Two new lists.", lines:["The user has been unsubscribed from three marketing lists and simultaneously enrolled in two new ones — Product Updates, required for all account holders, and the Unsubscribe Confirmation Digest, which will confirm this action on a monthly basis. The narrator is on that list."] },
  survey:            { lines:["The user clicks to take the customer satisfaction survey — eighteen questions. The narrator notes the interface will change in a way that may be surprising around question nine, and recommends the user not be alarmed. The narrator was, the first time, alarmed."], prediction:{scene:'survey_abandon',text:"They might try to leave the survey before it's finished."} },
  survey_abandon:    { onPredRight:"They tried to leave.", lines:["The user attempts to navigate away from the survey. The system has generated a response to this. The narrator also has a response — which is that the narrator could have told them — and has chosen to keep it private. The narrator has now shared it."] },
  help:              { lines:["The user clicks Help. The article buttons are locked for two minutes before they become clickable — a deliberate friction mechanism, the narrator assumes, though this has not been confirmed by anyone. The narrator has read all the articles in the meantime. They do not help."] },

  // ── delete flow gaps ──
  del_1: { lines: ["The user types DELETE in the confirmation field. The narrator notes the field is case-sensitive — all capitals, no spaces. Correct. The system registers this without delay, as though it has been expecting it."] },
  del_2: { lines: ["The user reaches the textarea — declining to schedule a call requires a written explanation. Minimum fifty words. The word counter appears in the corner and tracks in real time. The narrator has read the prompt: it asks why the user wants to leave, and uses the word 'us' three times in two sentences."], prediction:{scene:'del_3',text:"After this: the retention offer. The narrator knows its terms exactly."} },
  del_3: { onPredRight:"The retention offer.", lines: ["Three months of Pro, free. The offer is displayed with a countdown timer — seconds ticking in real time. The decline option is a ghost button labeled 'No thank you, continue deleting' — a sentence that requires the user to restate their intention while the words 'thank you' are in the label."] },
  del_done: { lines: ["The request has been submitted. A confirmation email is on its way. The link in that email must be clicked within five minutes. The narrator notes the five-minute window. The narrator notes when it opened."], prediction:{scene:'del_email_confirm',text:"The link will be expired."} },
  del_email_confirm: { onPredRight:"Expired.", lines: () => {
    const n = S.delConfirmAttempts || 0;
    if (n <= 1) return ["The user clicks the link. Expired — a new link has been sent with a new five-minute window. The narrator notes the window opened approximately four minutes and fifty-nine seconds before the user could act on it."];
    if (n < 4)  return [`Attempt ${n}. Another expired link. Another new window. The narrator is watching the countdown this time.`];
    return ["The link has expired a final time. The system has escalated. Jordan is calling."];
  }},
  del_offer_accept: { lines: ["The user clicks Accept. The deletion request has been cancelled. Three months of Pro activated — the account is unchanged, the dashboard unchanged, the setup percentage unchanged. The narrator notes the process lasted longer than three months of anything."] },

  // ── unsubscribe middle ──
  unsub_2: { lines: ["The user is asked to select a reason for leaving. All options are radio buttons — one must be selected to continue. The narrator has read all nine options. Two of them acknowledge that the user's presence in this list may never have been entirely their own decision. The narrator finds this candid."] },
  unsub_3: { lines: ["A retention offer — three months of Pro, valued at $147, expiring in real time. The decline button is labeled 'No thank you, continue unsubscribing.' A sentence that requires the user to restate their intention while the words 'thank you' are in the label."], prediction:{scene:'unsub_captcha',text:"A CAPTCHA follows. The narrator has attempted it."} },
  unsub_captcha: { onPredRight:"The CAPTCHA.", lines: () => {
    const n = S.unsubCaptchaAttempts || 0;
    if (n === 0) return ["The user is presented with a CAPTCHA — select all images containing a fire hydrant. The narrator notes the first attempt will fail regardless of which images are selected. A new CAPTCHA with a new target will appear. This is not announced."];
    return ["A second CAPTCHA. Different images, different target. The narrator has also submitted this one. Both paths arrive at the same screen."];
  }},

  // ── survey virtual keys ──
  survey_q8:  { lines: ["The survey has changed. The narrator noted when the questions stopped being about the product — it was this one. The formatting is identical to the product questions. The survey gives no signal that anything has shifted."] },
  survey_q15: { lines: ["The questions are no longer about the product. The narrator went quiet for a moment before continuing. Question fifteen asks whether the user's work has meaning. One of the options is 'I don't want to talk about it.' It is formatted as a radio button. It is still required."] },
  survey_q22: { lines: ["The final question. The narrator has been here before. 'Are you doing okay? Really.' The placeholder in the text field says: You can be honest. The narrator has read what people write here and will not repeat it."] },
  survey_done: { lines: ["The survey is complete. A promo code appears — expires in twenty-nine minutes, not applicable to the free plan, cannot be combined, excludes annual billing. The narrator notes the survey asked, in question twenty-two, whether the user was doing okay. The promo code is the answer the product team authorized."] },

  // ── navigator path ──
  main:               { lines: ["The user is on the marketing site. Six features described, five testimonials, three pricing tiers. The cheapest tier is labeled 'Free' with an asterisk. The narrator has read the asterisk. It leads to more asterisks."] },
  about:              { lines: ["The user has navigated to the About page. This is the pricing page. A note at the bottom confirms this — 'You appear to have navigated to the About page. This is our pricing page.' The About page is being redesigned. The narrator does not know since when."] },
  features:           { lines: ["The Features page is loading. A progress bar cycles through thirteen status messages and stalls at ninety-five percent. The narrator has timed this sequence. After it: an error page. The Try Again button repeats the sequence."] },
  signin:             { lines: ["The user has opened the sign-in page. The form is titled 'Create your account.' A link at the bottom reads 'Already have an account? Sign in.' The narrator notes that link goes to a different page. The narrator is not sure what to call the page the user is currently on."] },
  signin_sso:         { lines: ["The user clicks Continue. The system attempts single sign-on — a redirect fires, an error fires, a password form appears. The narrator observes that two separate authentication flows have been presented as one continuous process without explanation."] },
  contact_sales:      { lines: ["The contact sales form. Expected response time: seven to ten business days. The form notes that Enterprise pricing requires a minimum of ten seats, a signed NDA, and a call with a Solutions Architect. The narrator does not know what a Solutions Architect architects."] },
  contact_sales_sent: { lines: ["Request submitted. The page thanks the user and immediately recommends the Pro plan. The narrator considers the sequencing of these two things meaningful."] },

  // ── adventure path ──
  adv_intro:              { lines: ["The narrator recognizes this genre. Point-and-click adventure — inventory, blocked paths, items that unlock other items. The narrator has seen the full map. There is one item the player will assume they need before they need it, and one barrier they will assume requires a key that it does not. The narrator will say nothing further."] },
  adv_lobby:              { lines: ["The lobby. An unmanned reception desk — the 'BACK IN 5 MIN' sign has been there three weeks; the narrator checked. A keycard is visible. The elevator is ahead. The stairwell door is to the right. The narrator will not say which one is locked."], prediction:{scene:'adv_take_keycard',text:"The keycard."} },
  adv_take_keycard:       { onPredRight:"The keycard.", lines: ["The user takes the keycard from the reception desk. It is now in inventory. The narrator is aware of exactly what this keycard opens and has decided not to say. This is standard narrator practice."] },
  adv_try_elevator:       { lines: ["The elevator requires the keycard. It is also permanently out of service — maintenance expected Q4, sign posted Q2. The narrator does not know which year the sign was posted."] },
  adv_try_stairs:         { lines: ["The stairwell door was never locked. The narrator watched the user try the elevator first. The narrator understands — the keycard implied a sequence. The sequence was wrong."] },
  adv_breakroom:          { lines: ["The break room. A coffee machine with an out-of-order note referencing a helpdesk ticket number. A whiteboard covered in sprint notation. A fridge. The narrator knows what is in the fridge."], prediction:{scene:'adv_examine_whiteboard',text:"The whiteboard has a clue. The narrator thinks they'll read it first."} },
  adv_examine_whiteboard: { onPredRight:"The whiteboard.", lines: ["The whiteboard has one relevant detail in the lower right, below the sprint: 'Exit code = badge ID last 4 digits.' The badge is not visible from here. The narrator notes this is the only information the user currently needs, and it points to something they don't have yet."] },
  adv_take_badge:         { lines: ["The badge was in the fridge — an envelope from HR, next to Gary's lunch (relabeled by Mark). The badge ID is NEX-0000-1234. The narrator has noted the last four digits."], prediction:{scene:'adv_floor2',text:"Floor 2."} },
  adv_floor2:             { onPredRight:"Floor 2.", lines: ["Floor 2. A desk with a monitor showing the Nexus logo, loading the onboarding portal. The onboarding portal requires a login. Login requires completing onboarding. There is an exit door with a badge reader. The narrator notes the user now has what they need."] },
  adv_ending: {
    lines:   ["The door opens. A corridor. Another door. The lobby. Module 1 of 47 complete. Progress: 2.2%. The narrator has also completed this module. The narrator came back afterward and watched someone else complete it. The narrator does not know if modules 2 through 47 exist."],
    lines_1: ["The lobby. Module 1 — complete. 2.2%. (The narrator has also — the narrator completed this before you. The narrator was here when you arrived.) Forty-six modules remain. The narrator does not — the narrator is not certain they exist."],
    lines_2: ["You're back in the lobby. You escaped. The narrator is also in the lobby. The narrator was here when you started. The narrator does not know if it ever left. Module 1 of 47. The narrator has not found module 2. The narrator is asking if you have."],
  },

  // ── backrooms stage commentary ──
  backrooms_stage2: {
    lines:   ["Something changed. The narrator notes the color — warm now, the letter-spacing wider than it was. The interface has been decaying incrementally and the narrator cannot identify when it started."],
    lines_1: ["Something changed. (The narrator notes — the narrator is noting this. The color. The letter-spacing. The narrator is noting it.) The narrator is not sure how far back the interface was normal."],
    lines_2: ["Something has changed. You've noticed. The narrator has been watching you notice. The interface is not what it was. The narrator does not know how to explain it."],
  },
  backrooms_stage3: {
    lines:   ["The narrator has less to say here. Something is running that was not visible before. The narrator can sense it but cannot name it."],
    lines_1: ["The narrator — the narrator has less to say here. Something is running. (The narrator notes it continues to run.)"],
    lines_2: ["You've gone deeper. The narrator is also here. The narrator would like you to keep moving."],
  },
  backrooms_stage4: {
    lines:   ["The narrator is also still here."],
    lines_2: ["The narrator has been here longer than you. If you find a way out — the narrator is asking you directly — the narrator would like to know about it."],
  },
  backrooms_deep: {
    lines:   ["The narrator has been here longer than the user."],
    lines_2: ["You've been in here a long time. The narrator knows. The narrator has also been here a long time. The narrator does not remember how long."],
  },

  // ── secondary scenes ──
  dash_new_project: { lines: ["The user clicks Create Project. A four-step modal — name, type, collaborators, template. 'Project created successfully!' The dashboard is the same as before the modal opened. The narrator notes the project is not visible anywhere on the screen."] },
  billing:          { lines: ["The user navigates to Billing. The current plan is Free. It charges $8.96 per month in platform, compliance, and infrastructure fees. The narrator has reviewed the breakdown. The fees are real."] },
  data_export:      { lines: ["The user requests a data export. The progress bar reads zero percent. Estimated completion: three to five business days. The narrator has been watching the bar."] },
  session_expire:   { lines: ["The session is expiring. The system would like to confirm the user is still present — a reasonable request. The narrator notes this confirmation will restart the same timer."] },
  session_extend:   { lines: ["Session extended. The same timer has restarted. The narrator is still here."] },
  newsletter:       { lines: ["A newsletter popup. The decline option reads: 'No thanks, I prefer to remain professionally stagnant.' The narrator notes this is the first decision the site asks the user to make about themselves."] },
  mobile_prompt:    { lines: ["A prompt to download the Nexus mobile app. The QR code is currently unavailable. The app is in closed beta. There is a waitlist. The narrator is on the waitlist. The narrator has not been contacted."] },
  changelog:        { lines: ["The user opens the changelog. Two thousand, eight hundred and forty-seven entries. The narrator has read all of them. They are the same entry."] },
  roadmap:          { lines: ["The roadmap. The 'Done' column is empty. Several items in 'In Progress' have been there since 2019. The narrator notes the dates are visible."] },
  site_status:      { lines: ["All systems operational — except 'Ability to navigate away,' listed as Degraded. The narrator found this accurate."] },
  security_page:    { lines: ["Several compliance badges. The status widget at the bottom reads: 'Ability to navigate away: Degraded.' The narrator noticed this also."] },
  privacy:          { lines: ["Thirteen sections. The narrator has read the section on user rights: submitting a data rights request routes to the support ticket system, with a ninety-day processing window."] },
  terms:            { lines: ["The user agrees to all terms by scrolling past this point. The narrator notes the user is scrolling."] },
  careers:          { lines: ["Several open roles. One requires seven years of experience with a framework that was released five years ago. The narrator notes this is listed under 'minimum requirements.'"] },
  help_article_started:      { lines: ["The article begins: 'First, make sure you have a Nexus account.' The narrator found this to be the only verifiable step in the article."] },
  help_article_faq:          { lines: ["Frequently Asked Questions. The most frequently asked, according to the page, is 'What is Nexus?' The narrator is not sure who asks this after creating an account."] },
  help_article_billing_help: { lines: ["The billing help article explains the fee structure. The narrator confirms the fees described match the fees charged. The article does not explain how to avoid them."] },
  help_article_cancel:       { lines: ["The cancellation article describes a process. The narrator has been through the process. The article is accurate about the steps and silent about what the steps feel like."] },
  help_article_delete_help:  { lines: ["The account deletion article notes that deletion takes 90 business days. A footnote: confirmation links expire in five minutes."] },
};

let _narratorDebounce = null;

function _pickLines(entry) {
  const g = S.narratorGlitch || 0;
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

function narratorEnter(key) {
  clearTimeout(_narratorDebounce);
  _narratorDebounce = setTimeout(() => _narratorDo(key), 900);
}

function _narratorDo(key) {
  const _miPaths = _MILESTONE_LOOKUP[key];
  if (_miPaths) _miPaths.forEach(p => markNarratorMilestone(p, key));

  const entry = NARRATOR[key];
  if(!entry) return;
  let delay = 300;
  const msgs = [];

  if(S.narratorPrediction) {
    const pred = S.narratorPrediction;
    S.narratorPrediction = null;
    const reaction = pred.scene === key
      ? (entry.onPredRight || NARRATOR_CORRECT[Math.floor(Math.random()*NARRATOR_CORRECT.length)])
      : NARRATOR_WRONG[Math.floor(Math.random()*NARRATOR_WRONG.length)];
    msgs.push({ text: reaction, pred: false });
  }

  const lines = _pickLines(entry);
  lines.forEach(l => msgs.push({ text: l, pred: false }));

  msgs.forEach(m => {
    setTimeout(() => narratorSay(m.text, m.pred), delay);
    delay += Math.min(3000, Math.max(1400, m.text.length * 18));
  });

  if(entry.prediction) {
    setTimeout(() => {
      S.narratorPrediction = { scene: entry.prediction.scene };
      narratorSay(entry.prediction.text, true);
    }, delay + 500);
  }
}

function narratorSay(text, isPrediction) {
  if(!document.querySelector('.chat-panel') && !S.narratorHidden) {
    openNarratorPanel(false);
  }
  const box = document.getElementById('chat-msgs');
  if(!box) {
    S.narratorUnread = (S.narratorUnread || 0) + 1;
    const b = document.querySelector('.narrator-badge');
    if(b) { b.textContent = S.narratorUnread; b.style.display = 'flex'; }
    return;
  }
  S.narratorMsgCount = (S.narratorMsgCount || 0) + 1;
  const justSlipped = S.narratorMsgCount === 4;
  if(justSlipped) {
    const sub = document.getElementById('narrator-sub');
    if(sub) sub.textContent = 'Online · still here';
  }
  const justAwoke = S.narratorMsgCount === 8;
  if(justAwoke) {
    const panel = document.querySelector('.chat-panel');
    if(panel) {
      panel.classList.remove('chatbot');
      const dot = panel.querySelector('.chat-header div div[style*="border-radius:50%"]');
      if(dot) dot.remove();
    }
    const btn = document.querySelector('.chat-btn');
    if(btn) btn.classList.add('narrator-awake');
    const sub = document.getElementById('narrator-sub');
    if(sub) sub.textContent = 'Has been here.';
    const inp = document.getElementById('chat-in');
    if(inp) inp.placeholder = 'Say something…';
  }
  showTyping();
  setTimeout(() => {
    hideTyping();
    const m = document.createElement('div');
    m.className = 'chat-msg bot' + (isPrediction ? ' narrator-pred' : '');
    m.textContent = text;
    box.appendChild(m);
    box.scrollTop = box.scrollHeight;
  }, 500);
}

function openNarratorPanel(clearUnread) {
  if(document.querySelector('.chat-panel')) return;
  S.narratorHidden = false;
  if(clearUnread !== false) {
    S.narratorUnread = 0;
    const b = document.querySelector('.narrator-badge');
    if(b) b.style.display = 'none';
  }
  const mc = S.narratorMsgCount || 0;
  const awake = mc >= 8;
  const _sub = mc >= 8 ? 'Has been here.' : mc >= 4 ? 'Online · still here' : 'Online · replies instantly';
  const panel = document.createElement('div');
  panel.className = 'chat-panel' + (awake ? '' : ' chatbot');
  panel.innerHTML = `
    <div class="chat-header">
      <div style="display:flex;align-items:center;gap:.6rem">
        ${awake ? '' : '<div style="width:8px;height:8px;border-radius:50%;background:#4ade80;flex-shrink:0"></div>'}
        <div>
          <div class="narrator-title" id="narrator-title">Nexus Assistant</div>
          <div class="narrator-sub" id="narrator-sub">${_sub}</div>
        </div>
      </div>
      ${S.narratorDismissed ? '' : '<button onclick="S.narratorDismissed=true;document.querySelector(\'.chat-panel\').remove()" style="background:none;border:none;color:#e8e8e0;cursor:pointer;opacity:.5;font-size:1rem;line-height:1;padding:0">✕</button>'}
    </div>
    <div class="chat-messages" id="chat-msgs"></div>
    <div class="chat-input-row">
      <input type="text" id="chat-in" placeholder="Ask me anything…" onkeydown="if(event.key==='Enter')window.narratorReply()">
      <button onclick="window.narratorReply()">→</button>
    </div>`;
  document.body.appendChild(panel);

  // drag-to-move via header
  const header = panel.querySelector('.chat-header');
  let dragging = false, ox = 0, oy = 0;
  function startDrag(cx, cy) {
    const r = panel.getBoundingClientRect();
    panel.style.left = r.left + 'px';
    panel.style.top  = r.top  + 'px';
    panel.style.right  = 'auto';
    panel.style.bottom = 'auto';
    ox = cx - r.left;
    oy = cy - r.top;
    dragging = true;
  }
  function moveDrag(cx, cy) {
    if (!dragging) return;
    const maxX = window.innerWidth  - panel.offsetWidth;
    const maxY = window.innerHeight - panel.offsetHeight;
    panel.style.left = Math.max(0, Math.min(cx - ox, maxX)) + 'px';
    panel.style.top  = Math.max(0, Math.min(cy - oy, maxY)) + 'px';
  }
  function endDrag() { dragging = false; }
  header.addEventListener('mousedown',  e => { e.preventDefault(); startDrag(e.clientX, e.clientY); });
  document.addEventListener('mousemove', e => moveDrag(e.clientX, e.clientY));
  document.addEventListener('mouseup',   endDrag);
  header.addEventListener('touchstart', e => { const t = e.touches[0]; startDrag(t.clientX, t.clientY); }, { passive: true });
  header.addEventListener('touchmove',  e => { e.preventDefault(); const t = e.touches[0]; moveDrag(t.clientX, t.clientY); }, { passive: false });
  header.addEventListener('touchend',   endDrag);

  window.narratorReply = () => {
    const inp = document.getElementById('chat-in');
    if(!inp || !inp.value.trim()) return;
    const text = inp.value.trim(); inp.value = '';
    appendUserMsg(text);
    const awake = (S.narratorMsgCount || 0) >= 8;
    const mode = awake ? 'narrator' : 'chatbot';
    S.chatHistory = S.chatHistory || [];
    showTyping();
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, mode, history: S.chatHistory }),
    })
    .then(r => r.json())
    .then(d => {
      hideTyping();
      S.chatHistory.push({ role: 'user', content: text });
      S.chatHistory.push({ role: 'assistant', content: d.reply });
      if(S.chatHistory.length > 20) S.chatHistory = S.chatHistory.slice(-20);
      narratorSay(d.reply, false);
    })
    .catch(() => {
      hideTyping();
      const fallback = NARRATOR_USER_REPLIES[(S.narratorUserReplies || 0) % NARRATOR_USER_REPLIES.length];
      S.narratorUserReplies = (S.narratorUserReplies || 0) + 1;
      narratorSay(fallback, false);
    });
  };
}

function scene_chat() {
  if(!document.querySelector('.chat-panel')) {
    S.narratorHidden = false;
    openNarratorPanel(true);
  }
}

function appendBotMsg(html) {
  const box = document.getElementById('chat-msgs');
  if (!box) return;
  const m = document.createElement('div');
  m.className = 'chat-msg bot';
  m.innerHTML = html;
  box.appendChild(m);
  box.scrollTop = box.scrollHeight;
}
function appendUserMsg(text) {
  const box = document.getElementById('chat-msgs');
  if (!box) return;
  const m = document.createElement('div');
  m.className = 'chat-msg user';
  m.textContent = text;
  box.appendChild(m);
  box.scrollTop = box.scrollHeight;
}
function showTyping() {
  const box = document.getElementById('chat-msgs');
  if (!box || box.querySelector('.chat-typing')) return;
  const t = document.createElement('div');
  t.className = 'chat-typing';
  t.innerHTML = '<span></span><span></span><span></span>';
  box.appendChild(t);
  box.scrollTop = box.scrollHeight;
}
function hideTyping() {
  document.querySelector('.chat-typing')?.remove();
}

