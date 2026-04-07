/**
 * Halqa — حلقة — v1.0
 * Kid-friendly Jitsi Meet learning & meeting app
 * Based on Workshop-DIY Template v1.2
 * Jitsi · User CRUD · Phrases · Recording · Attendance · Learning · Adab · Quiz
 */

const $ = id => document.getElementById(id);

/* ═══════ LOGO SVG ═══════ */

const LOGO_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="3"/><text x="50" y="58" text-anchor="middle" fill="currentColor" font-family="Amiri,serif" font-size="28" font-weight="700">حلقة</text></svg>`;

const LIGHT_THEMES = ['riad', 'medina'];
const APP_VERSION = '1.0';

/* ═══════ SOUND EFFECTS ═══════ */

let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function playSound(type) {
  if (!soundEnabled) return;
  if (!audioCtx) audioCtx = new AudioCtx();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination);
  gain.gain.value = 0.08;
  const t = audioCtx.currentTime;
  switch (type) {
    case 'click':
      osc.frequency.value = 800; osc.type = 'sine';
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      osc.start(t); osc.stop(t + 0.08); break;
    case 'success':
      osc.frequency.value = 523; osc.type = 'sine';
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.start(t); osc.stop(t + 0.3);
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.connect(gain2); gain2.connect(audioCtx.destination);
      gain2.gain.value = 0.08; osc2.frequency.value = 659; osc2.type = 'sine';
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      osc2.start(t + 0.15); osc2.stop(t + 0.4); break;
    case 'error':
      osc.frequency.value = 200; osc.type = 'square';
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.start(t); osc.stop(t + 0.25); break;
  }
}

/* ═══════ i18n ═══════ */

const LANG = {
  en: {
    title: 'Halqa', subtitle: '🎥 learn · 🤝 connect · 📚 grow',
    disconnected: 'Disconnected', connected: 'Connected',
    meetingRoom: 'Meeting Room', meetingDesc: 'Join or create a Halqa session',
    participants: 'Participants', phrases: 'Quick Phrases',
    recordings: 'Recordings', attendance: 'Attendance',
    join: 'Join', leave: 'Leave', record: 'Record', stopRec: 'Stop',
    recording: 'Recording', noRecordings: 'No recordings yet',
    add: 'Add', edit: 'Edit', delete: 'Delete', save: 'Save', cancel: 'Cancel',
    import: 'Import', export: 'Export', exportAttendance: 'Export',
    nameField: 'Name', emailField: 'Email (optional)',
    roomPlaceholder: 'halqa-room-123', namePlaceholder: 'Your name',
    greetings: 'Greetings', duringClass: 'In Class', polite: 'Polite', techHelp: 'Tech',
    activityLog: 'Activity Log', eventsMsg: 'Events & messages',
    clear: 'Clear', copy: 'Copy', theme: 'Theme',
    settings: 'Settings', language: 'Language',
    jitsiServer: 'Jitsi Server', muteOnJoin: 'Mute on join', camOffOnJoin: 'Camera off on join',
    help: 'Help', faq: 'FAQ', howto: 'How-To',
    learnJitsi: 'Jitsi', adab: 'Adab', quiz: 'Quiz', retryQuiz: 'Try Again',
    faq_q1: 'What is Halqa?', faq_a1: 'Halqa is a kid-friendly app to learn and use Jitsi Meet for online classes and study circles.',
    faq_q2: 'How do I join a meeting?', faq_a2: 'Enter a room name and your name, then click Join. Share the same room name with others.',
    faq_q3: 'How do I change the language?', faq_a3: 'Open Settings and pick your language. Arabic enables RTL automatically.',
    faq_q4: 'Is my data private?', faq_a4: 'Yes. Participant list and settings are stored locally. Video calls go through Jitsi servers.',
    faq_q5: 'Why is the call limited to 5 minutes?', faq_a5: 'The free meet.jit.si server limits embedded calls to 5 minutes. To remove this limit: (1) Self-host Jitsi on your own server (free, open source). (2) Use Jitsi as a Service (JaaS) from 8x8.vc (free tier available). (3) Use a community Jitsi server without the limit. You can change the server in Settings.',
    howto_1: 'Add participants in the Participants section.',
    howto_2: 'Enter a room name and your name, then click Join.',
    howto_3: 'Use Quick Phrases to copy common messages into the Jitsi chat.',
    howto_4: 'Click Record to save the session locally.',
    howto_5: 'Check Attendance to see who joined and when.',
    working: 'Working…', ready: 'Halqa is ready!',
    logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    filterAll: 'All', soundEffects: 'Sound effects',
    whisperMode: 'Whisper mode', breathingGuide: 'Breathing guide', dhikrTap: 'Tap',
    splashHint: 'tap to skip',
    langChanged: 'Language → English', themeChanged: 'Theme →',
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus',
    t_riad: 'Riad', t_medina: 'Medina', t_space: 'Space', t_jungle: 'Jungle', t_robot: 'Robot',
    userAdded: 'User added', userDeleted: 'User deleted', userUpdated: 'User updated',
    confirmDelete: 'Delete this user?',
    joinedMeeting: 'Joined meeting', leftMeeting: 'Left meeting',
    recStarted: 'Recording started', recStopped: 'Recording stopped',
    openJitsi: 'Open Jitsi Meet',
    noRoom: 'Please enter a room name', noName: 'Please enter your name',
    phraseCopied: 'Phrase copied!',
    quizCorrect: 'Correct!', quizWrong: 'Try again!',
    quizScore: 'Score', quizComplete: 'Quiz complete!',
  },
  fr: {
    title: 'Halqa', subtitle: '🎥 apprendre · 🤝 connecter · 📚 grandir',
    disconnected: 'Déconnecté', connected: 'Connecté',
    meetingRoom: 'Salle de réunion', meetingDesc: 'Rejoindre ou créer une session Halqa',
    participants: 'Participants', phrases: 'Phrases rapides',
    recordings: 'Enregistrements', attendance: 'Présence',
    join: 'Rejoindre', leave: 'Quitter', record: 'Enregistrer', stopRec: 'Arrêter',
    recording: 'Enregistrement', noRecordings: 'Pas encore d\'enregistrement',
    add: 'Ajouter', edit: 'Modifier', delete: 'Supprimer', save: 'Enregistrer', cancel: 'Annuler',
    import: 'Importer', export: 'Exporter', exportAttendance: 'Exporter',
    nameField: 'Nom', emailField: 'Email (optionnel)',
    roomPlaceholder: 'halqa-salle-123', namePlaceholder: 'Ton nom',
    greetings: 'Salutations', duringClass: 'En classe', polite: 'Politesse', techHelp: 'Tech',
    activityLog: 'Journal', eventsMsg: 'Événements et messages',
    clear: 'Effacer', copy: 'Copier', theme: 'Thème',
    settings: 'Paramètres', language: 'Langue',
    jitsiServer: 'Serveur Jitsi', muteOnJoin: 'Muet en rejoignant', camOffOnJoin: 'Caméra éteinte',
    help: 'Aide', faq: 'FAQ', howto: 'Guide',
    learnJitsi: 'Jitsi', adab: 'Adab', quiz: 'Quiz', retryQuiz: 'Réessayer',
    faq_q1: 'C\'est quoi Halqa ?', faq_a1: 'Halqa est une appli pour apprendre et utiliser Jitsi Meet pour les cours en ligne.',
    faq_q2: 'Comment rejoindre ?', faq_a2: 'Entre un nom de salle et ton nom, puis clique Rejoindre.',
    faq_q3: 'Comment changer la langue ?', faq_a3: 'Ouvre Paramètres et choisis ta langue.',
    faq_q4: 'Mes données sont privées ?', faq_a4: 'Oui. La liste des participants est stockée localement.',
    faq_q5: 'Pourquoi l\'appel est limité à 5 minutes ?', faq_a5: 'Le serveur gratuit meet.jit.si limite les appels intégrés à 5 min. Pour supprimer cette limite : (1) Héberger Jitsi sur ton propre serveur (gratuit, open source). (2) Utiliser Jitsi as a Service (JaaS) de 8x8.vc. (3) Utiliser un serveur Jitsi communautaire. Tu peux changer le serveur dans Paramètres.',
    howto_1: 'Ajoute des participants dans la section Participants.',
    howto_2: 'Entre un nom de salle et ton nom, puis clique Rejoindre.',
    howto_3: 'Utilise les Phrases rapides pour copier des messages dans le chat Jitsi.',
    howto_4: 'Clique Enregistrer pour sauvegarder la session.',
    howto_5: 'Consulte Présence pour voir qui a rejoint.',
    working: 'En cours…', ready: 'Halqa est prêt !',
    logCleared: 'Journal effacé', copied: 'Copié !', copyFail: 'Échec',
    filterAll: 'Tout', soundEffects: 'Effets sonores',
    whisperMode: 'Mode murmure', breathingGuide: 'Guide respiratoire', dhikrTap: 'Tap',
    splashHint: 'appuyer pour passer',
    langChanged: 'Langue → Français', themeChanged: 'Thème →',
    t_mosque: 'Mosquée', t_zellige: 'Zellige', t_andalus: 'Andalous',
    t_riad: 'Riad', t_medina: 'Médina', t_space: 'Espace', t_jungle: 'Jungle', t_robot: 'Robot',
    userAdded: 'Utilisateur ajouté', userDeleted: 'Utilisateur supprimé', userUpdated: 'Utilisateur modifié',
    confirmDelete: 'Supprimer cet utilisateur ?',
    joinedMeeting: 'A rejoint la réunion', leftMeeting: 'A quitté la réunion',
    recStarted: 'Enregistrement démarré', recStopped: 'Enregistrement arrêté',
    openJitsi: 'Ouvrir Jitsi Meet',
    noRoom: 'Entre un nom de salle', noName: 'Entre ton nom',
    phraseCopied: 'Phrase copiée !',
    quizCorrect: 'Correct !', quizWrong: 'Réessaie !',
    quizScore: 'Score', quizComplete: 'Quiz terminé !',
  },
  ar: {
    title: 'حلقة', subtitle: '🎥 تعلّم · 🤝 تواصل · 📚 انمُ',
    disconnected: 'غير متصل', connected: 'متصل',
    meetingRoom: 'غرفة الاجتماع', meetingDesc: 'انضم أو أنشئ جلسة حلقة',
    participants: 'المشاركون', phrases: 'عبارات سريعة',
    recordings: 'التسجيلات', attendance: 'الحضور',
    join: 'انضم', leave: 'غادر', record: 'سجّل', stopRec: 'أوقف',
    recording: 'جارٍ التسجيل', noRecordings: 'لا توجد تسجيلات بعد',
    add: 'أضف', edit: 'عدّل', delete: 'احذف', save: 'احفظ', cancel: 'إلغاء',
    import: 'استيراد', export: 'تصدير', exportAttendance: 'تصدير',
    nameField: 'الاسم', emailField: 'البريد (اختياري)',
    roomPlaceholder: 'حلقة-غرفة-123', namePlaceholder: 'اسمك',
    greetings: 'تحيات', duringClass: 'أثناء الدرس', polite: 'أدب', techHelp: 'تقنية',
    activityLog: 'سجل النشاط', eventsMsg: 'الأحداث والرسائل',
    clear: 'مسح', copy: 'نسخ', theme: 'المظهر',
    settings: 'الإعدادات', language: 'اللغة',
    jitsiServer: 'خادم Jitsi', muteOnJoin: 'كتم عند الدخول', camOffOnJoin: 'إيقاف الكاميرا عند الدخول',
    help: 'مساعدة', faq: 'أسئلة شائعة', howto: 'كيف تستخدم',
    learnJitsi: 'تعلّم Jitsi', adab: 'آداب', quiz: 'اختبار', retryQuiz: 'حاول مجددا',
    faq_q1: 'ما هي حلقة؟', faq_a1: 'حلقة تطبيق سهل للأطفال لتعلم واستخدام Jitsi Meet للدروس وحلقات العلم.',
    faq_q2: 'كيف أنضم؟', faq_a2: 'أدخل اسم الغرفة واسمك ثم اضغط انضم.',
    faq_q3: 'كيف أغيّر اللغة؟', faq_a3: 'افتح الإعدادات واختر لغتك.',
    faq_q4: 'هل بياناتي خاصة؟', faq_a4: 'نعم. قائمة المشاركين تُحفظ محليا في متصفحك.',
    faq_q5: 'لماذا المكالمة محدودة بـ 5 دقائق؟', faq_a5: 'خادم meet.jit.si المجاني يحدد المكالمات المدمجة بـ 5 دقائق. لإزالة الحد: (1) استضف Jitsi على خادمك الخاص (مجاني، مفتوح المصدر). (2) استخدم Jitsi as a Service من 8x8.vc. (3) استخدم خادم Jitsi مجتمعي. يمكنك تغيير الخادم في الإعدادات.',
    howto_1: 'أضف المشاركين في قسم المشاركون.',
    howto_2: 'أدخل اسم الغرفة واسمك ثم اضغط انضم.',
    howto_3: 'استخدم العبارات السريعة لنسخ رسائل في دردشة Jitsi.',
    howto_4: 'اضغط سجّل لحفظ الجلسة محليا.',
    howto_5: 'تابع الحضور لمعرفة من انضم ومتى.',
    working: 'جارٍ…', ready: 'حلقة جاهزة!',
    logCleared: 'تم مسح السجل', copied: 'تم النسخ!', copyFail: 'فشل النسخ',
    filterAll: 'الكل', soundEffects: 'مؤثرات صوتية',
    whisperMode: 'وضع الهمس', breathingGuide: 'دليل التنفس', dhikrTap: 'اضغط',
    splashHint: 'انقر للتخطي',
    langChanged: 'اللغة ← العربية', themeChanged: 'المظهر ←',
    t_mosque: 'مسجد', t_zellige: 'زليج', t_andalus: 'أندلس',
    t_riad: 'رياض', t_medina: 'مدينة', t_space: 'فضاء', t_jungle: 'أدغال', t_robot: 'روبوت',
    userAdded: 'تمت الإضافة', userDeleted: 'تم الحذف', userUpdated: 'تم التعديل',
    confirmDelete: 'حذف هذا المستخدم؟',
    joinedMeeting: 'انضم للاجتماع', leftMeeting: 'غادر الاجتماع',
    recStarted: 'بدأ التسجيل', recStopped: 'توقف التسجيل',
    openJitsi: 'افتح Jitsi Meet',
    noRoom: 'أدخل اسم الغرفة', noName: 'أدخل اسمك',
    phraseCopied: 'تم نسخ العبارة!',
    quizCorrect: 'صحيح!', quizWrong: 'حاول مجددا!',
    quizScore: 'النتيجة', quizComplete: 'اكتمل الاختبار!',
  }
};

let currentLang = 'en';

function setLanguage(lang) {
  currentLang = lang;
  const s = LANG[lang];
  if (!s) return;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.dataset.i18n;
    if (s[k] != null) el.textContent = s[k];
  });
  document.querySelectorAll('[data-i18n-opt]').forEach(opt => {
    const k = opt.dataset.i18nOpt;
    if (s[k] != null) opt.textContent = s[k];
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const k = el.dataset.i18nPh;
    if (s[k] != null) el.placeholder = s[k];
  });
  document.title = `${s.title} — حلقة`;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  const sel = $('langSelect');
  if (sel) sel.value = lang;
  try { localStorage.setItem('halqa-lang', lang); } catch {}
  showPhrases(currentPhraseCategory);
  renderLearnCards();
  renderAdabCards();
  renderQuiz();
  log(s.langChanged, 'info');
}

/* ═══════ THEMES ═══════ */

function setTheme(name) {
  document.documentElement.dataset.theme = name;
  document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(name));
  const sel = $('themeSelect');
  if (sel) sel.value = name;
  const s = LANG[currentLang];
  const label = s['t_' + name] || name;
  try { localStorage.setItem('halqa-theme', name); } catch {}
  playThemeMelody(name);
  log(`${s.themeChanged} ${label}`, 'info');
}

/* ═══════ LOG ═══════ */

let logContainer;
let typewriterEnabled = true;

function log(msg, type = 'info') {
  if (!logContainer) logContainer = $('logContainer');
  if (!logContainer) return;
  const d = document.createElement('div');
  d.className = `log-line ${type}`;
  const fullText = `[${new Date().toLocaleTimeString()}] ${msg}`;
  if (typewriterEnabled) {
    logContainer.appendChild(d);
    typewriterAppend(d, fullText);
  } else {
    d.textContent = fullText;
    logContainer.appendChild(d);
  }
  logContainer.scrollTop = logContainer.scrollHeight;
  if (type === 'success') { playSound('success'); pulseBismillah('success'); }
  else if (type === 'error') { playSound('error'); pulseBismillah('error'); }
  logWithHistory(msg, type);
  applyLogFilter();
}

function clearLog() {
  if (!logContainer) logContainer = $('logContainer');
  if (logContainer) logContainer.innerHTML = '';
  log(LANG[currentLang].logCleared);
}

async function copyLog() {
  if (!logContainer) logContainer = $('logContainer');
  if (!logContainer) return;
  const t = Array.from(logContainer.children).map(d => d.textContent).join('\n');
  try { await navigator.clipboard.writeText(t); log(LANG[currentLang].copied, 'success'); }
  catch { log(LANG[currentLang].copyFail, 'error'); }
}

/* ═══════ TOAST ═══════ */

let toastTimer = null;
function showToast(msg, autoHideMs = 2000) {
  const el = $('toastIndicator'), t = $('toastMessage');
  if (el && t) { t.textContent = msg || LANG[currentLang].working; el.style.display = 'block'; }
  if (toastTimer) clearTimeout(toastTimer);
  if (autoHideMs > 0) toastTimer = setTimeout(hideToast, autoHideMs);
}
function hideToast() {
  const el = $('toastIndicator');
  if (el) el.style.display = 'none';
  if (toastTimer) { clearTimeout(toastTimer); toastTimer = null; }
}

/* ═══════ STATUS ═══════ */

function setStatus(connected) {
  const pill = $('statusPill'), txt = $('statusText'), s = LANG[currentLang];
  if (txt) txt.textContent = connected ? s.connected : s.disconnected;
  if (pill) pill.classList.toggle('connected', connected);
}

/* ═══════ SPLASH ═══════ */

let splashTimer;
function dismissSplash() {
  const s = $('splash');
  if (!s) return;
  s.classList.add('hidden');
  if (splashTimer) clearTimeout(splashTimer);
  setTimeout(() => s.remove(), 600);
  playSound('click');
}
function initSplash() {
  const s = $('splash');
  if (!s) return;
  const sl = $('splashLogo');
  if (sl) sl.innerHTML = LOGO_SVG;
  splashTimer = setTimeout(dismissSplash, 2500);
}

/* ═══════ LOG FILTERS ═══════ */

let activeLogFilter = 'all';
function initLogFilters() {
  document.querySelectorAll('.log-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.log-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeLogFilter = btn.dataset.filter;
      applyLogFilter(); playSound('click');
    });
  });
}
function applyLogFilter() {
  if (!logContainer) logContainer = $('logContainer');
  if (!logContainer) return;
  Array.from(logContainer.children).forEach(line => {
    if (activeLogFilter === 'all') { line.style.display = ''; return; }
    line.style.display = line.classList.contains(activeLogFilter) ? '' : 'none';
  });
}

/* ═══════ EXPORT LOG ═══════ */

function exportLog() {
  if (!logContainer) logContainer = $('logContainer');
  if (!logContainer) return;
  const blob = new Blob([Array.from(logContainer.children).map(d => d.textContent).join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `halqa-log-${new Date().toISOString().slice(0,10)}.txt`;
  a.click(); URL.revokeObjectURL(url);
}

/* ═══════ TYPEWRITER ═══════ */

async function typewriterAppend(element, text) {
  element.classList.add('typing'); element.textContent = '';
  for (let i = 0; i < text.length; i++) {
    element.textContent += text[i];
    if (element.parentElement) element.parentElement.scrollTop = element.parentElement.scrollHeight;
    await sleep(12 + Math.random() * 18);
  }
  element.classList.remove('typing');
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

const logHistory = [];
function logWithHistory(msg, type) { logHistory.push({ msg, type, ts: Date.now() }); }

/* ═══════ HIJRI DATE ═══════ */

function initHijriDate() {
  const el = $('hijriDate');
  if (!el) return;
  try {
    el.textContent = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
  } catch {}
}

/* ═══════ BISMILLAH PULSE ═══════ */

function pulseBismillah(type) {
  const bism = document.querySelector('.bismillah');
  if (!bism) return;
  bism.classList.remove('pulse-success', 'pulse-error');
  void bism.offsetWidth;
  bism.classList.add(type === 'error' ? 'pulse-error' : 'pulse-success');
  setTimeout(() => bism.classList.remove('pulse-success', 'pulse-error'), 700);
}

/* ═══════ THEME MELODIES ═══════ */

const THEME_MELODIES = {
  'mosque-gold': [330, 392, 523], 'zellige': [440, 523, 659],
  'andalus': [294, 370, 440], 'space': [523, 659, 784],
  'jungle': [262, 330, 392], 'robot': [440, 554, 659],
  'riad': [349, 440, 523], 'medina': [294, 349, 440],
};

function playThemeMelody(name) {
  if (!soundEnabled) return;
  if (!audioCtx) audioCtx = new AudioCtx();
  const notes = THEME_MELODIES[name];
  if (!notes) return;
  const t = audioCtx.currentTime;
  notes.forEach((freq, i) => {
    const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.type = 'sine'; osc.frequency.value = freq; gain.gain.value = 0.06;
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2 + i * 0.15 + 0.15);
    osc.start(t + i * 0.15); osc.stop(t + i * 0.15 + 0.2);
  });
}

/* ═══════ BREATHING + DHIKR ═══════ */

let breathingActive = false, dhikrCount = 0;
function toggleBreathing() {
  breathingActive = !breathingActive;
  document.querySelectorAll('.deco-band').forEach(b => b.classList.toggle('breathing', breathingActive));
  if (!breathingActive && dhikrCount > 0) log(`Dhikr: ${dhikrCount}`, 'success');
  if (!breathingActive) dhikrCount = 0;
}
function incrementDhikr() {
  if (!breathingActive) return;
  dhikrCount++; playSound('click');
  const c = $('dhikrCounter'); if (c) c.textContent = dhikrCount;
}

/* ═══════ WHISPER ═══════ */

let recognition = null, whisperActive = false;
function toggleWhisper() {
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) { log('Speech not supported', 'error'); return; }
  if (whisperActive) { if (recognition) recognition.stop(); whisperActive = false; return; }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR(); recognition.continuous = true; recognition.interimResults = false;
  recognition.lang = currentLang === 'ar' ? 'ar-DZ' : currentLang === 'fr' ? 'fr-FR' : 'en-US';
  recognition.onresult = e => { for (let i = e.resultIndex; i < e.results.length; i++) if (e.results[i].isFinal) log(`🎤 ${e.results[i][0].transcript.trim()}`, 'rx'); };
  recognition.onerror = e => log(`Whisper: ${e.error}`, 'error');
  recognition.onend = () => { if (whisperActive) recognition.start(); };
  recognition.start(); whisperActive = true; log('Whisper on', 'success');
}

/* ═══════ MATRIX RAIN ═══════ */

let matrixRunning = false, matrixAnim = null;
const ARABIC_CHARS = 'بسمالرحنيوكلتعدفقثصضطظغشزخجذأؤئإءةىآ٠١٢٣٤٥٦٧٨٩';
function toggleMatrix() {
  const canvas = $('matrixCanvas'); if (!canvas) return;
  if (matrixRunning) { matrixRunning = false; cancelAnimationFrame(matrixAnim); canvas.classList.remove('active'); return; }
  matrixRunning = true; canvas.classList.add('active');
  const ctx = canvas.getContext('2d'); canvas.width = innerWidth; canvas.height = innerHeight;
  const cols = Math.floor(canvas.width / 16), drops = Array(cols).fill(1);
  (function draw() {
    if (!matrixRunning) return;
    ctx.fillStyle = 'rgba(0,0,0,0.05)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#33ff33';
    ctx.font = '14px Amiri, serif';
    for (let i = 0; i < drops.length; i++) {
      ctx.fillText(ARABIC_CHARS[Math.floor(Math.random() * ARABIC_CHARS.length)], i * 16, drops[i] * 16);
      if (drops[i] * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0; drops[i]++;
    }
    matrixAnim = requestAnimationFrame(draw);
  })();
}

/* ═══════ KONAMI ═══════ */

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx = 0;
function initKonami() {
  document.addEventListener('keydown', e => {
    if (e.key === KONAMI[konamiIdx]) { konamiIdx++; if (konamiIdx === KONAMI.length) { konamiIdx = 0; toggleMatrix(); log('KONAMI!', 'success'); } }
    else konamiIdx = 0;
  });
}

/* ═══════════════════════════════════════════════════════════════
   JITSI MEET INTEGRATION
   ═══════════════════════════════════════════════════════════════ */

let jitsiApi = null;

function getJitsiDomain() {
  const input = $('jitsiDomain');
  return (input && input.value.trim()) || 'meet.jit.si';
}

function joinMeeting() {
  const s = LANG[currentLang];
  const room = $('roomName')?.value.trim();
  const name = $('displayName')?.value.trim();
  if (!room) { showToast(s.noRoom); return; }
  if (!name) { showToast(s.noName); return; }
  if (jitsiApi) leaveMeeting();

  try {
    jitsiApi = new JitsiMeetExternalAPI(getJitsiDomain(), {
      roomName: room,
      parentNode: $('jitsiContainer'),
      width: '100%',
      height: 500,
      userInfo: { displayName: name },
      configOverwrite: {
        startWithAudioMuted: $('muteOnJoin')?.checked ?? true,
        startWithVideoMuted: $('camOffOnJoin')?.checked ?? true,
        prejoinPageEnabled: false,
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: ['microphone','camera','chat','raisehand','tileview','hangup','desktop','fullscreen'],
        SHOW_JITSI_WATERMARK: false,
      }
    });
    jitsiApi.addListener('videoConferenceJoined', () => { setStatus(true); log(`${s.joinedMeeting}: ${room}`, 'success'); addAttendanceEntry(name, 'join'); });
    jitsiApi.addListener('videoConferenceLeft', () => { setStatus(false); log(s.leftMeeting, 'info'); addAttendanceEntry(name, 'leave'); });
    jitsiApi.addListener('participantJoined', p => { log(`➕ ${p.displayName || 'Someone'} joined`, 'info'); addAttendanceEntry(p.displayName || 'Unknown', 'join'); });
    jitsiApi.addListener('participantLeft', p => log(`➖ ${p.displayName || 'Someone'} left`, 'info'));
    $('joinBtn').style.display = 'none';
    $('leaveBtn').style.display = '';
    try { localStorage.setItem('halqa-room', room); localStorage.setItem('halqa-name', name); } catch {}
  } catch (e) { log(`Jitsi error: ${e.message}`, 'error'); }
}

function leaveMeeting() {
  if (jitsiApi) { jitsiApi.dispose(); jitsiApi = null; }
  $('jitsiContainer').innerHTML = '';
  $('joinBtn').style.display = '';
  $('leaveBtn').style.display = 'none';
  setStatus(false);
  if (isRecording) toggleRecording();
}

/* ═══════ SCREEN RECORDING ═══════ */

let mediaRecorder = null, recordedChunks = [], isRecording = false, recTimerInterval = null, recStartTime = 0;

function toggleRecording() { isRecording ? stopRecording() : startRecording(); }

async function startRecording() {
  const s = LANG[currentLang];
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: { displaySurface: 'browser' }, audio: true });
    recordedChunks = [];
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    mediaRecorder.ondataavailable = e => { if (e.data.size > 0) recordedChunks.push(e.data); };
    mediaRecorder.onstop = () => { saveRecording(new Blob(recordedChunks, { type: 'video/webm' })); stream.getTracks().forEach(t => t.stop()); };
    mediaRecorder.start(); isRecording = true; recStartTime = Date.now();
    $('recIcon').textContent = '⏹️'; $('recLabel').textContent = s.stopRec;
    $('recIndicator').style.display = 'flex';
    recTimerInterval = setInterval(updateRecTimer, 1000);
    log(s.recStarted, 'success');
  } catch (e) { log(`Recording: ${e.message}`, 'error'); }
}

function stopRecording() {
  const s = LANG[currentLang];
  if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
  isRecording = false;
  $('recIcon').textContent = '⏺️'; $('recLabel').textContent = s.record;
  $('recIndicator').style.display = 'none';
  if (recTimerInterval) { clearInterval(recTimerInterval); recTimerInterval = null; }
  log(s.recStopped, 'info');
}

function updateRecTimer() {
  const elapsed = Math.floor((Date.now() - recStartTime) / 1000);
  const el = $('recTimer');
  if (el) el.textContent = `${String(Math.floor(elapsed/60)).padStart(2,'0')}:${String(elapsed%60).padStart(2,'0')}`;
}

function saveRecording(blob) {
  const ts = new Date().toISOString().slice(0,19).replace(/[T:]/g,'-');
  const name = `halqa-rec-${ts}.webm`;
  const entry = { name, date: new Date().toLocaleString(), size: (blob.size/1048576).toFixed(1)+' MB' };
  let recs = []; try { recs = JSON.parse(localStorage.getItem('halqa-recordings')||'[]'); } catch {}
  recs.unshift(entry);
  try { localStorage.setItem('halqa-recordings', JSON.stringify(recs.slice(0,20))); } catch {}
  renderRecordings();
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name; a.click();
}

function renderRecordings() {
  const container = $('recordingsList'), noRec = $('noRecordings');
  if (!container) return;
  let recs = []; try { recs = JSON.parse(localStorage.getItem('halqa-recordings')||'[]'); } catch {}
  if (!recs.length) { container.innerHTML = ''; if (noRec) noRec.style.display = ''; return; }
  if (noRec) noRec.style.display = 'none';
  container.innerHTML = recs.map((r,i) => `<div class="rec-entry"><span class="rec-name">🎬 ${r.name}</span><span class="rec-meta">${r.date} — ${r.size}</span><button class="btn-sm btn-del" onclick="deleteRecording(${i})">🗑️</button></div>`).join('');
}

function deleteRecording(idx) {
  let recs = []; try { recs = JSON.parse(localStorage.getItem('halqa-recordings')||'[]'); } catch {}
  recs.splice(idx,1);
  try { localStorage.setItem('halqa-recordings', JSON.stringify(recs)); } catch {}
  renderRecordings();
}

/* ═══════ USER CRUD ═══════ */

let users = [];
const AVATARS = ['🧒','👦','👧','🧒🏽','👦🏽','👧🏽','🧑','👨','👩','🧕','👨‍🏫','👩‍🏫'];

function loadUsers() { try { users = JSON.parse(localStorage.getItem('halqa-users')||'[]'); } catch { users = []; } }
function saveUsers() { try { localStorage.setItem('halqa-users', JSON.stringify(users)); } catch {} renderUsers(); }

function addUser() {
  const s = LANG[currentLang];
  const nameInput = $('userName'), emailInput = $('userEmail');
  const name = nameInput?.value.trim(), email = emailInput?.value.trim();
  if (!name) return;
  users.push({ id: Date.now(), name, email, avatar: AVATARS[Math.floor(Math.random()*AVATARS.length)] });
  saveUsers();
  if (nameInput) nameInput.value = '';
  if (emailInput) emailInput.value = '';
  log(`${s.userAdded}: ${name}`, 'success');
  showToast(s.userAdded, 1500);
}

function deleteUser(id) {
  const s = LANG[currentLang];
  if (!confirm(s.confirmDelete)) return;
  const user = users.find(u => u.id === id);
  users = users.filter(u => u.id !== id);
  saveUsers();
  log(`${s.userDeleted}: ${user?.name||''}`, 'info');
}

function editUser(id) {
  const user = users.find(u => u.id === id), s = LANG[currentLang];
  if (!user) return;
  const card = document.querySelector(`.user-card[data-id="${id}"]`);
  if (!card) return;
  card.innerHTML = `<input type="text" class="crud-input edit-name" value="${user.name}"/><input type="text" class="crud-input edit-email" value="${user.email||''}"/><div class="user-card-actions"><button class="btn-sm btn-add" onclick="saveEdit(${id})">${s.save}</button><button class="btn-sm" onclick="renderUsers()">${s.cancel}</button></div>`;
}

function saveEdit(id) {
  const s = LANG[currentLang];
  const card = document.querySelector(`.user-card[data-id="${id}"]`);
  if (!card) return;
  const name = card.querySelector('.edit-name')?.value.trim();
  const email = card.querySelector('.edit-email')?.value.trim();
  if (!name) return;
  const user = users.find(u => u.id === id);
  if (user) { user.name = name; user.email = email; }
  saveUsers();
  log(`${s.userUpdated}: ${name}`, 'success');
}

function renderUsers() {
  const container = $('userList'), countEl = $('userCount');
  if (!container) return;
  if (countEl) countEl.textContent = users.length;
  if (!users.length) { container.innerHTML = '<p class="empty-msg">—</p>'; return; }
  container.innerHTML = users.map(u => `<div class="user-card" data-id="${u.id}"><span class="user-avatar">${u.avatar}</span><div class="user-info"><span class="user-name">${u.name}</span><span class="user-email">${u.email||''}</span></div><div class="user-card-actions"><button class="btn-sm" onclick="editUser(${u.id})">✏️</button><button class="btn-sm btn-del" onclick="deleteUser(${u.id})">🗑️</button></div></div>`).join('');
}

function exportUsers() {
  const csv = 'Name,Email,Avatar\n' + users.map(u=>`"${u.name}","${u.email||''}","${u.avatar}"`).join('\n');
  const blob = new Blob([csv],{type:'text/csv'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'halqa-participants.csv'; a.click();
}

function importUsersPrompt() { $('importFileInput')?.click(); }

function importUsersFile(event) {
  const file = event.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const text = e.target.result;
    if (file.name.endsWith('.json')) {
      try { const data = JSON.parse(text); if (Array.isArray(data)) data.forEach(u => { if (u.name) users.push({id:Date.now()+Math.random(),name:u.name,email:u.email||'',avatar:AVATARS[Math.floor(Math.random()*AVATARS.length)]}); }); } catch {}
    } else {
      text.split('\n').slice(1).forEach(line => {
        const p = line.split(',').map(s=>s.replace(/"/g,'').trim());
        if (p[0]) users.push({id:Date.now()+Math.random(),name:p[0],email:p[1]||'',avatar:AVATARS[Math.floor(Math.random()*AVATARS.length)]});
      });
    }
    saveUsers(); log(`Imported ${users.length} users`, 'success');
  };
  reader.readAsText(file); event.target.value = '';
}

/* ═══════ QUICK PHRASES ═══════ */

let currentPhraseCategory = 'greetings';

const PHRASES = {
  greetings: [
    {en:'Assalamu Alaikum everyone!',fr:'Assalamu Alaikum à tous !',ar:'السلام عليكم ورحمة الله'},
    {en:'Wa Alaikum Assalam!',fr:'Wa Alaikum Assalam !',ar:'وعليكم السلام ورحمة الله'},
    {en:"I'm ready to start",fr:'Je suis prêt',ar:'أنا جاهز للبدء'},
    {en:'Good morning everyone',fr:'Bonjour à tous',ar:'صباح الخير للجميع'},
    {en:'Welcome to the session',fr:'Bienvenue à la session',ar:'مرحبا بكم في الجلسة'},
  ],
  class: [
    {en:'Can you repeat please?',fr:'Pouvez-vous répéter ?',ar:'أعد من فضلك'},
    {en:'I have a question',fr:"J'ai une question",ar:'عندي سؤال'},
    {en:"I can't hear you",fr:'Je ne vous entends pas',ar:'لا أسمعك'},
    {en:'Can you see my screen?',fr:'Voyez-vous mon écran ?',ar:'هل ترون شاشتي؟'},
    {en:'I understand',fr:'Je comprends',ar:'فهمت'},
    {en:"I don't understand",fr:'Je ne comprends pas',ar:'لم أفهم'},
    {en:'Can you explain again?',fr:'Pouvez-vous réexpliquer ?',ar:'هل يمكنك الشرح مجددا؟'},
  ],
  polite: [
    {en:'JazakAllahu khairan',fr:'JazakAllahu khairan',ar:'جزاكم الله خيرا'},
    {en:"Sorry I'm late",fr:'Désolé pour le retard',ar:'آسف على التأخير'},
    {en:'Goodbye everyone',fr:'Au revoir à tous',ar:'مع السلامة'},
    {en:'BarakAllahu feek',fr:'BarakAllahu feek',ar:'بارك الله فيك'},
    {en:'May Allah reward you',fr:"Qu'Allah te récompense",ar:'جزاك الله خيرا'},
  ],
  tech: [
    {en:'Please mute your mic',fr:'Coupez votre micro',ar:'أطفئ الميكروفون من فضلك'},
    {en:'Turn on your camera',fr:'Allumez votre caméra',ar:'شغّل الكاميرا'},
    {en:'My mic is not working',fr:'Mon micro ne marche pas',ar:'الميكروفون لا يعمل'},
    {en:'I have bad internet',fr:"J'ai une mauvaise connexion",ar:'الإنترنت ضعيف عندي'},
    {en:'Can you share your screen?',fr:'Pouvez-vous partager votre écran ?',ar:'هل يمكنك مشاركة شاشتك؟'},
    {en:'The audio is cutting out',fr:'Le son coupe',ar:'الصوت ينقطع'},
  ],
};

function showPhrases(cat) {
  currentPhraseCategory = cat;
  document.querySelectorAll('.phrase-tab').forEach(t => t.classList.toggle('active', t.dataset.cat === cat));
  const c = $('phrasesContainer'); if (!c) return;
  c.innerHTML = (PHRASES[cat]||[]).map(p => {
    const text = p[currentLang]||p.en;
    return `<button class="phrase-btn" onclick="copyPhrase(this)" data-phrase="${text.replace(/"/g,'&quot;')}">${text}</button>`;
  }).join('');
}

async function copyPhrase(btn) {
  try {
    await navigator.clipboard.writeText(btn.dataset.phrase);
    btn.classList.add('copied'); setTimeout(()=>btn.classList.remove('copied'),1000);
    showToast(LANG[currentLang].phraseCopied, 1200); playSound('success');
  } catch { showToast(LANG[currentLang].copyFail, 1200); }
}

/* ═══════ ATTENDANCE ═══════ */

let attendanceLog = [];
function loadAttendance() { try { attendanceLog = JSON.parse(localStorage.getItem('halqa-attendance')||'[]'); } catch { attendanceLog = []; } }

function addAttendanceEntry(name, action) {
  attendanceLog.push({name,action,time:new Date().toLocaleString()});
  try { localStorage.setItem('halqa-attendance', JSON.stringify(attendanceLog)); } catch {}
  renderAttendance();
}

function renderAttendance() {
  const c = $('attendanceList'); if (!c) return;
  if (!attendanceLog.length) { c.innerHTML = '<p class="empty-msg">—</p>'; return; }
  c.innerHTML = attendanceLog.slice().reverse().map(e => `<div class="attendance-entry ${e.action}"><span>${e.action==='join'?'🟢':'🔴'} ${e.name}</span><span class="att-time">${e.time}</span></div>`).join('');
}

function exportAttendance() {
  const csv = 'Name,Action,Time\n'+attendanceLog.map(e=>`"${e.name}","${e.action}","${e.time}"`).join('\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv],{type:'text/csv'})); a.download = 'halqa-attendance.csv'; a.click();
}

function clearAttendance() {
  attendanceLog = [];
  try { localStorage.setItem('halqa-attendance','[]'); } catch {}
  renderAttendance(); log('Attendance cleared','info');
}

/* ═══════ LEARN JITSI ═══════ */

const LEARN_DATA = {
  en: [
    {icon:'🔗',title:'Join a meeting',desc:'Enter a room name and your name, then click Join.'},
    {icon:'🎤',title:'Mute / Unmute',desc:'Click the microphone icon. Mute when not talking.'},
    {icon:'📷',title:'Camera on / off',desc:'Click the camera icon to toggle your video.'},
    {icon:'💬',title:'Chat',desc:'Click chat to send text messages during the meeting.'},
    {icon:'🖥️',title:'Share screen',desc:'Click the screen icon to share your screen.'},
    {icon:'✋',title:'Raise hand',desc:'Click the hand icon when you want to speak.'},
    {icon:'📐',title:'Tile view',desc:'Click the grid icon to see everyone at once.'},
    {icon:'🚪',title:'Leave',desc:'Click the red phone icon to exit the meeting.'},
  ],
  fr: [
    {icon:'🔗',title:'Rejoindre',desc:'Entre un nom de salle et ton nom, puis clique Rejoindre.'},
    {icon:'🎤',title:'Micro',desc:'Clique sur le micro pour couper/réactiver.'},
    {icon:'📷',title:'Caméra',desc:'Clique sur la caméra pour l\'activer/désactiver.'},
    {icon:'💬',title:'Chat',desc:'Clique sur le chat pour envoyer des messages.'},
    {icon:'🖥️',title:'Partage d\'écran',desc:'Clique sur l\'icône écran pour partager.'},
    {icon:'✋',title:'Lever la main',desc:'Clique sur la main quand tu veux parler.'},
    {icon:'📐',title:'Vue mosaïque',desc:'Clique sur la grille pour tout voir.'},
    {icon:'🚪',title:'Quitter',desc:'Clique sur le téléphone rouge pour sortir.'},
  ],
  ar: [
    {icon:'🔗',title:'الانضمام',desc:'أدخل اسم الغرفة واسمك ثم اضغط انضم.'},
    {icon:'🎤',title:'الميكروفون',desc:'اضغط أيقونة الميكروفون لكتم أو تفعيل صوتك.'},
    {icon:'📷',title:'الكاميرا',desc:'اضغط أيقونة الكاميرا لتشغيل أو إيقاف الفيديو.'},
    {icon:'💬',title:'الدردشة',desc:'اضغط أيقونة الدردشة لإرسال رسائل نصية.'},
    {icon:'🖥️',title:'مشاركة الشاشة',desc:'اضغط أيقونة الشاشة لمشاركة شاشتك.'},
    {icon:'✋',title:'رفع اليد',desc:'اضغط أيقونة اليد عندما تريد التحدث.'},
    {icon:'📐',title:'عرض الشبكة',desc:'اضغط الشبكة لرؤية الجميع.'},
    {icon:'🚪',title:'المغادرة',desc:'اضغط الهاتف الأحمر للخروج.'},
  ],
};

function renderLearnCards() {
  const c = $('learnCards'); if (!c) return;
  const data = LEARN_DATA[currentLang]||LEARN_DATA.en;
  c.innerHTML = data.map((d,i) => `<div class="learn-step"><span class="learn-num">${i+1}</span><span class="learn-icon">${d.icon}</span><div><strong>${d.title}</strong><p>${d.desc}</p></div></div>`).join('');
}

/* ═══════ ADAB ═══════ */

const ADAB_DATA = {
  en: [
    {icon:'🤫',title:'Mute when not speaking',desc:'Keep your mic muted to avoid background noise.'},
    {icon:'👂',title:'Listen carefully',desc:'Pay attention when others speak. Don\'t interrupt.'},
    {icon:'🙋',title:'Raise hand first',desc:'Use the raise hand button instead of just talking.'},
    {icon:'👔',title:'Dress appropriately',desc:'Dress nicely even at home. It shows respect.'},
    {icon:'🧹',title:'Clean background',desc:'Make sure your background is tidy.'},
    {icon:'⏰',title:'Be on time',desc:'Join a few minutes early. Being late disrupts the class.'},
    {icon:'🤝',title:'Be kind',desc:'Say Salam when joining and leaving. Be encouraging.'},
    {icon:'📵',title:'No distractions',desc:'Close other apps. Focus on the class.'},
  ],
  fr: [
    {icon:'🤫',title:'Couper le micro',desc:'Garde ton micro coupé pour éviter le bruit.'},
    {icon:'👂',title:'Écouter',desc:'Fais attention quand les autres parlent.'},
    {icon:'🙋',title:'Lever la main',desc:'Utilise le bouton lever la main.'},
    {icon:'👔',title:'S\'habiller correctement',desc:'Même à la maison, habille-toi bien.'},
    {icon:'🧹',title:'Arrière-plan propre',desc:'Assure-toi que ton arrière-plan est rangé.'},
    {icon:'⏰',title:'Être ponctuel',desc:'Rejoins quelques minutes en avance.'},
    {icon:'🤝',title:'Être poli',desc:'Dis Salam en arrivant et en partant.'},
    {icon:'📵',title:'Pas de distractions',desc:'Ferme les autres apps.'},
  ],
  ar: [
    {icon:'🤫',title:'اكتم الميكروفون',desc:'أبقِ الميكروفون مكتوما لتجنب الضوضاء.'},
    {icon:'👂',title:'استمع بانتباه',desc:'انتبه عندما يتحدث الآخرون. لا تقاطع.'},
    {icon:'🙋',title:'ارفع يدك أولا',desc:'استخدم زر رفع اليد.'},
    {icon:'👔',title:'البس بشكل لائق',desc:'حتى في البيت، البس بشكل مناسب.'},
    {icon:'🧹',title:'خلفية نظيفة',desc:'تأكد أن خلفيتك مرتبة.'},
    {icon:'⏰',title:'كن في الموعد',desc:'انضم قبل بضع دقائق.'},
    {icon:'🤝',title:'كن مهذبا',desc:'قل السلام عند الدخول والخروج.'},
    {icon:'📵',title:'بدون تشتيت',desc:'أغلق التطبيقات الأخرى. ركّز.'},
  ],
};

function renderAdabCards() {
  const c = $('adabCards'); if (!c) return;
  c.innerHTML = (ADAB_DATA[currentLang]||ADAB_DATA.en).map(d => `<div class="adab-card"><span class="adab-icon">${d.icon}</span><div><strong>${d.title}</strong><p>${d.desc}</p></div></div>`).join('');
}

/* ═══════ QUIZ ═══════ */

const QUIZ_DATA = {
  en: [
    {q:'What should you do when not speaking?',opts:['Mute your mic','Leave the meeting','Turn off camera'],ans:0},
    {q:'How do you ask to speak?',opts:['Just start talking','Raise your hand','Send an email'],ans:1},
    {q:'What do you say when joining?',opts:['Nothing','Assalamu Alaikum','Bye'],ans:1},
    {q:'What should your background look like?',opts:['Messy','Clean and tidy','Dark'],ans:1},
    {q:'When should you join?',opts:['30 min late','A few min early','Whenever'],ans:1},
    {q:'Which button shares your screen?',opts:['Microphone','Camera','Screen share'],ans:2},
  ],
  fr: [
    {q:'Que faire quand tu ne parles pas ?',opts:['Couper le micro','Quitter','Éteindre la caméra'],ans:0},
    {q:'Comment demander la parole ?',opts:['Parler directement','Lever la main','Envoyer un email'],ans:1},
    {q:'Que dire en arrivant ?',opts:['Rien','Assalamu Alaikum','Au revoir'],ans:1},
    {q:'Ton arrière-plan ?',opts:['En désordre','Propre et rangé','Sombre'],ans:1},
    {q:'Quand rejoindre ?',opts:['30 min en retard','Quelques min en avance','Quand tu veux'],ans:1},
    {q:'Quel bouton pour l\'écran ?',opts:['Micro','Caméra','Partage d\'écran'],ans:2},
  ],
  ar: [
    {q:'ماذا تفعل عندما لا تتحدث؟',opts:['اكتم الميكروفون','غادر','أطفئ الكاميرا'],ans:0},
    {q:'كيف تطلب الكلام؟',opts:['تتحدث مباشرة','ترفع يدك','ترسل بريدا'],ans:1},
    {q:'ماذا تقول عند الدخول؟',opts:['لا شيء','السلام عليكم','مع السلامة'],ans:1},
    {q:'كيف يجب أن تكون خلفيتك؟',opts:['فوضوية','نظيفة ومرتبة','مظلمة'],ans:1},
    {q:'متى تنضم؟',opts:['متأخرا 30 دقيقة','قبل بضع دقائق','متى ما أردت'],ans:1},
    {q:'أي زر لمشاركة الشاشة؟',opts:['الميكروفون','الكاميرا','مشاركة الشاشة'],ans:2},
  ],
};

let quizAnswers = {}, quizScore = 0;

function renderQuiz() {
  const c = $('quizContainer'), r = $('quizResult');
  if (!c) return;
  if (r) r.style.display = 'none';
  quizAnswers = {}; quizScore = 0;
  const data = QUIZ_DATA[currentLang]||QUIZ_DATA.en;
  c.innerHTML = data.map((q,qi) => `<div class="quiz-q" id="qq-${qi}"><p class="quiz-question"><strong>${qi+1}.</strong> ${q.q}</p><div class="quiz-opts">${q.opts.map((o,oi)=>`<button class="quiz-opt" onclick="answerQuiz(${qi},${oi})">${o}</button>`).join('')}</div></div>`).join('');
}

function answerQuiz(qi, oi) {
  const s = LANG[currentLang], data = QUIZ_DATA[currentLang]||QUIZ_DATA.en;
  if (quizAnswers[qi] !== undefined) return;
  quizAnswers[qi] = oi;
  if (data[qi].ans === oi) quizScore++;
  const qEl = $(`qq-${qi}`);
  if (qEl) qEl.querySelectorAll('.quiz-opt').forEach((b,i) => {
    b.disabled = true;
    if (i === data[qi].ans) b.classList.add('correct');
    if (i === oi && data[qi].ans !== oi) b.classList.add('wrong');
  });
  if (Object.keys(quizAnswers).length === data.length) {
    const r = $('quizResult');
    if (r) { r.style.display = 'block'; r.textContent = `${s.quizComplete} ${s.quizScore}: ${quizScore}/${data.length}`; r.className = 'quiz-result'+(quizScore===data.length?' perfect':''); }
    playSound(quizScore===data.length ? 'success' : 'click');
  }
}

function resetQuiz() { quizAnswers = {}; quizScore = 0; renderQuiz(); }

/* ═══════ PANELS ═══════ */

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
function openPanel(id, ovId) { const sb=$(id),ov=$(ovId); if(sb)sb.classList.add('open'); if(ov)ov.classList.add('open'); if(sb){const f=sb.querySelector(FOCUSABLE);if(f)f.focus();} }
function closePanel(id, ovId, retId) { const sb=$(id),ov=$(ovId); if(sb)sb.classList.remove('open'); if(ov)ov.classList.remove('open'); const b=$(retId); if(b)b.focus(); }
function openHelp() { openPanel('helpPanel','helpOverlay'); }
function closeHelp() { closePanel('helpPanel','helpOverlay','helpBtn'); }
let logWasOpen = false;
function openSettings() { const l=$('logPanel'); logWasOpen=l&&l.classList.contains('open'); if(logWasOpen)closeLog(); openPanel('settingsPanel','settingsOverlay'); }
function closeSettings() { closePanel('settingsPanel','settingsOverlay','settingsBtn'); if(logWasOpen){openLog();logWasOpen=false;} }
function openLog() { const sb=$('logPanel'); if(sb)sb.classList.add('open'); document.body.classList.add('log-open'); }
function closeLog() { const sb=$('logPanel'); if(sb)sb.classList.remove('open'); document.body.classList.remove('log-open'); }
function toggleLog() { const sb=$('logPanel'); if(sb&&sb.classList.contains('open'))closeLog(); else openLog(); }
function closeAllPanels() { closeHelp(); closeSettings(); closeLog(); }

function initHelpTabs() {
  const tabs = document.querySelectorAll('.help-tab'), contents = document.querySelectorAll('.help-content');
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(t=>t.classList.remove('active')); contents.forEach(c=>c.classList.remove('active'));
    tab.classList.add('active');
    const name = tab.dataset.tab;
    const target = $('help'+name.charAt(0).toUpperCase()+name.slice(1));
    if (target) target.classList.add('active');
  }));
}

function trapFocus(e) {
  for (const id of ['helpPanel','settingsPanel','logPanel']) {
    const sb=$(id); if(!sb||!sb.classList.contains('open')) continue;
    const f=sb.querySelectorAll(FOCUSABLE); if(!f.length) return;
    if(e.shiftKey&&document.activeElement===f[0]){e.preventDefault();f[f.length-1].focus();}
    else if(!e.shiftKey&&document.activeElement===f[f.length-1]){e.preventDefault();f[0].focus();}
    return;
  }
}

/* ═══════ LOG RESIZE ═══════ */

function initLogResize() {
  const handle=$('logResizeHandle'), panel=$('logPanel');
  if(!handle||!panel) return;
  let dragging=false, startX, startW;
  const isRtl=()=>document.documentElement.dir==='rtl';
  handle.addEventListener('mousedown',e=>{dragging=true;startX=e.clientX;startW=panel.offsetWidth;handle.classList.add('active');document.body.style.cursor='col-resize';document.body.style.userSelect='none';e.preventDefault();});
  document.addEventListener('mousemove',e=>{if(!dragging)return;const dx=isRtl()?(e.clientX-startX):(startX-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(startW+dx,innerWidth*0.6))+'px');});
  document.addEventListener('mouseup',()=>{if(!dragging)return;dragging=false;handle.classList.remove('active');document.body.style.cursor='';document.body.style.userSelect='';try{localStorage.setItem('halqa-log-width',getComputedStyle(document.documentElement).getPropertyValue('--log-width'));}catch{}});
  try{const s=localStorage.getItem('halqa-log-width');if(s)document.documentElement.style.setProperty('--log-width',s);}catch{}
}

/* ═══════ INIT ═══════ */

function init() {
  initSplash();
  const lw=$('logoWrap'); if(lw) lw.innerHTML = LOGO_SVG;

  // Log
  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');
  if(cb)cb.onclick=clearLog; if(cpb)cpb.onclick=copyLog; if(exb)exb.onclick=exportLog;
  initLogFilters();

  // Panels
  const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hOv=$('helpOverlay');
  if(hBtn)hBtn.onclick=openHelp; if(hClose)hClose.onclick=closeHelp; if(hOv)hOv.onclick=closeHelp;
  initHelpTabs();
  const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sOv=$('settingsOverlay');
  if(sBtn)sBtn.onclick=openSettings; if(sClose)sClose.onclick=closeSettings; if(sOv)sOv.onclick=closeSettings;
  const lBtn=$('logBtn'),lClose=$('logCloseBtn');
  if(lBtn)lBtn.onclick=toggleLog; if(lClose)lClose.onclick=closeLog;
  initLogResize();

  // Sound
  const soundTgl=$('soundToggle');
  if(soundTgl){try{soundEnabled=localStorage.getItem('halqa-sound')==='true';}catch{}soundTgl.checked=soundEnabled;soundTgl.addEventListener('change',()=>{soundEnabled=soundTgl.checked;try{localStorage.setItem('halqa-sound',soundEnabled);}catch{}if(soundEnabled)playSound('click');});}

  // Whisper + Breathing
  const whisperBtn=$('whisperBtn'); if(whisperBtn)whisperBtn.onclick=toggleWhisper;
  const breathBtn=$('breathingBtn'),dhikrDisp=$('dhikrDisplay'),dhikrBtnEl=$('dhikrBtn');
  if(breathBtn)breathBtn.onclick=()=>{toggleBreathing();if(dhikrDisp)dhikrDisp.style.display=breathingActive?'flex':'none';};
  if(dhikrBtnEl)dhikrBtnEl.onclick=incrementDhikr;

  // Keys
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();if(e.key==='Tab')trapFocus(e);});

  // Dropdowns
  const langSel=$('langSelect'); if(langSel)langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect'); if(themeSel)themeSel.addEventListener('change',()=>setTheme(themeSel.value));

  // Restore
  try{
    const sL=localStorage.getItem('halqa-lang'),sT=localStorage.getItem('halqa-theme'),sR=localStorage.getItem('halqa-room'),sN=localStorage.getItem('halqa-name');
    if(sT)setTheme(sT); if(sL)setLanguage(sL);
    if(sR&&$('roomName'))$('roomName').value=sR;
    if(sN&&$('displayName'))$('displayName').value=sN;
  }catch{}

  // Data
  loadUsers(); renderUsers();
  loadAttendance(); renderAttendance();
  renderRecordings();
  showPhrases('greetings');
  renderLearnCards(); renderAdabCards(); renderQuiz();
  initHijriDate();
  initKonami();

  // Arabic keyboard
  initKBDrag();
  renderKBKeys();

  log(LANG[currentLang].ready, 'success');
}

/* ═══════════════════════════════════════════════════════════════
   FLOATING ARABIC KEYBOARD
   ═══════════════════════════════════════════════════════════════ */

const KB_LETTERS = [
  ['ض','ص','ث','ق','ف','غ','ع','ه','خ','ح','ج','د'],
  ['ش','س','ي','ب','ل','ا','ت','ن','م','ك','ط'],
  ['ئ','ء','ؤ','ر','لا','ى','ة','و','ز','ظ'],
  ['آ','أ','إ','ذ','ٱ','ﷲ','ﷺ','؟','!','،'],
];

const KB_TASHKEEL = [
  ['َ','ُ','ِ','ْ','ّ','ً','ٌ','ٍ'],
  ['ٰ','ٓ','ٔ','ٕ','۟','۠','ۖ','ۗ'],
  ['﴾','﴿','۩','۞','ۜ','ۥ','ۧ','ۨ'],
];

const KB_NUMBERS = [
  ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'],
  ['0','1','2','3','4','5','6','7','8','9'],
  ['+','-','×','÷','=','٪','.',':','؛','«','»'],
];

const KB_PHRASES = {
  greetings: {
    label: '👋 تحيات',
    items: [
      'السلام عليكم ورحمة الله وبركاته',
      'وعليكم السلام ورحمة الله وبركاته',
      'أهلا وسهلا',
      'صباح الخير',
      'مساء الخير',
      'مرحبا بكم',
      'حياكم الله',
      'أسعد الله أوقاتكم',
    ]
  },
  classroom: {
    label: '📚 الفصل',
    items: [
      'عندي سؤال',
      'أعد من فضلك',
      'لم أفهم',
      'فهمت',
      'هل يمكنك الشرح مجددا؟',
      'أنا جاهز',
      'لحظة من فضلك',
      'هل يمكنني المشاركة؟',
      'الجواب هو...',
      'أحسنت!',
    ]
  },
  duas: {
    label: '🤲 أدعية',
    items: [
      'بسم الله الرحمن الرحيم',
      'الحمد لله رب العالمين',
      'سبحان الله',
      'لا إله إلا الله',
      'الله أكبر',
      'لا حول ولا قوة إلا بالله',
      'أستغفر الله العظيم',
      'اللهم صل وسلم على نبينا محمد',
      'سبحان الله وبحمده سبحان الله العظيم',
      'حسبي الله ونعم الوكيل',
      'ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار',
      'رب اشرح لي صدري ويسر لي أمري',
    ]
  },
  polite: {
    label: '🤝 أدب',
    items: [
      'جزاكم الله خيرا',
      'بارك الله فيك',
      'شكرا جزيلا',
      'عفوا',
      'آسف على التأخير',
      'من فضلك',
      'لو سمحت',
      'بإذن الله',
      'إن شاء الله',
      'ما شاء الله',
      'تبارك الله',
    ]
  },
  tech: {
    label: '🔧 تقنية',
    items: [
      'الميكروفون لا يعمل',
      'لا أسمعك',
      'الصوت ينقطع',
      'شغّل الكاميرا',
      'أطفئ الميكروفون من فضلك',
      'هل ترون شاشتي؟',
      'الإنترنت ضعيف',
      'سأعيد الدخول',
      'انتظروني لحظة',
    ]
  },
  quran: {
    label: '📖 قرآن',
    items: [
      'أعوذ بالله من الشيطان الرجيم',
      'بسم الله الرحمن الرحيم',
      'صدق الله العظيم',
      'سورة الفاتحة',
      'سورة البقرة',
      'سورة آل عمران',
      'سورة الإخلاص',
      'سورة الفلق',
      'سورة الناس',
      'سورة الكهف',
      'سورة يس',
      'سورة الملك',
      'آية الكرسي',
    ]
  },
  teacher: {
    label: '👨‍🏫 المعلم',
    items: [
      'اسمعوا جيدا',
      'من يريد الإجابة؟',
      'أحسنت يا بني',
      'ممتاز!',
      'حاول مرة أخرى',
      'افتحوا الكتاب صفحة...',
      'اكتبوا في الدفتر',
      'انتبهوا من فضلكم',
      'هل هناك أسئلة؟',
      'الدرس التالي...',
      'واجب اليوم هو...',
      'مع السلامة، إلى اللقاء',
    ]
  },
  goodbye: {
    label: '👋 وداع',
    items: [
      'مع السلامة',
      'إلى اللقاء',
      'في أمان الله',
      'أستودعكم الله',
      'بارك الله في وقتكم',
      'جلسة مباركة',
      'نلتقي إن شاء الله',
    ]
  },
};

const KB_EMOJI = [
  ['🕌','🕋','📿','🤲','☪️','🌙','⭐','🕯️'],
  ['📖','🕊️','💚','🤍','🧕','👳','👨‍🏫','👩‍🏫'],
  ['🌹','🌴','🐪','🏜️','💧','🔥','☁️','🌅'],
  ['❤️','💛','💚','🤎','🖤','🩵','💜','🧡'],
  ['✅','❌','⭕','❓','❗','💯','🎯','🏆'],
  ['👍','👏','🤝','✋','☝️','👆','🙏','💪'],
  ['😊','😄','🥰','😢','😮','🤔','😴','🎉'],
];

let kbMode = 'letters';
let kbMinimized = false;
let kbCurrentPhraseCat = null;

function toggleArabicKB() {
  const kb = $('arabicKB');
  if (!kb) return;
  kb.classList.toggle('hidden');
  playSound('click');
}

function toggleKBMinimize() {
  const body = $('kbBody');
  if (!body) return;
  kbMinimized = !kbMinimized;
  body.style.display = kbMinimized ? 'none' : '';
}

function setKBMode(mode) {
  kbMode = mode;
  document.querySelectorAll('.kb-mode').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
  const actionRow = $('kbActionRow');
  const phrasesCats = $('kbPhrasesCats');
  if (mode === 'phrases') {
    if (actionRow) actionRow.style.display = 'none';
    if (phrasesCats) phrasesCats.style.display = '';
    renderKBPhraseCats();
    if (!kbCurrentPhraseCat) setKBPhraseCat(Object.keys(KB_PHRASES)[0]);
  } else {
    if (actionRow) actionRow.style.display = '';
    if (phrasesCats) phrasesCats.style.display = 'none';
    renderKBKeys();
  }
}

function renderKBKeys() {
  const container = $('kbKeys');
  if (!container) return;
  let rows;
  if (kbMode === 'letters') rows = KB_LETTERS;
  else if (kbMode === 'tashkeel') rows = KB_TASHKEEL;
  else if (kbMode === 'numbers') rows = KB_NUMBERS;
  else if (kbMode === 'emoji') rows = KB_EMOJI;
  else return;

  container.innerHTML = rows.map(row =>
    `<div class="kb-row">${row.map(k =>
      `<button class="kb-key" onclick="kbType('${k.replace(/'/g,"\\'")}')"><span>${k}</span></button>`
    ).join('')}</div>`
  ).join('');
}

function renderKBPhraseCats() {
  const container = $('kbPhrasesCats');
  if (!container) return;
  container.innerHTML = Object.entries(KB_PHRASES).map(([key, cat]) =>
    `<button class="kb-phrase-cat ${kbCurrentPhraseCat === key ? 'active' : ''}" onclick="setKBPhraseCat('${key}')">${cat.label}</button>`
  ).join('');
}

function setKBPhraseCat(cat) {
  kbCurrentPhraseCat = cat;
  renderKBPhraseCats();
  const container = $('kbKeys');
  if (!container) return;
  const phrases = KB_PHRASES[cat]?.items || [];
  container.innerHTML = phrases.map(p =>
    `<button class="kb-key kb-phrase-key" onclick="kbTypePhrase(this)" data-phrase="${p.replace(/"/g,'&quot;')}">${p}</button>`
  ).join('');
}

function kbType(char) {
  const output = $('kbOutput');
  if (!output) return;
  const start = output.selectionStart, end = output.selectionEnd;
  output.value = output.value.substring(0, start) + char + output.value.substring(end);
  output.selectionStart = output.selectionEnd = start + char.length;
  output.focus();
  playSound('click');
}

function kbTypePhrase(btn) {
  const phrase = btn.dataset.phrase;
  const output = $('kbOutput');
  if (!output) return;
  const start = output.selectionStart;
  const prefix = output.value.length > 0 && !output.value.endsWith('\n') && !output.value.endsWith(' ') ? ' ' : '';
  output.value = output.value.substring(0, start) + prefix + phrase + output.value.substring(output.selectionEnd);
  output.focus();
  playSound('click');
}

function kbBackspace() {
  const output = $('kbOutput');
  if (!output) return;
  const start = output.selectionStart, end = output.selectionEnd;
  if (start !== end) {
    output.value = output.value.substring(0, start) + output.value.substring(end);
    output.selectionStart = output.selectionEnd = start;
  } else if (start > 0) {
    output.value = output.value.substring(0, start - 1) + output.value.substring(start);
    output.selectionStart = output.selectionEnd = start - 1;
  }
  output.focus();
  playSound('click');
}

async function copyKBText() {
  const output = $('kbOutput');
  if (!output || !output.value) return;
  try {
    await navigator.clipboard.writeText(output.value);
    showToast(LANG[currentLang].copied, 1200);
    playSound('success');
  } catch {
    showToast(LANG[currentLang].copyFail, 1200);
  }
}

/* ═══════ DRAGGABLE KEYBOARD ═══════ */

function initKBDrag() {
  const kb = $('arabicKB'), header = $('kbHeader');
  if (!kb || !header) return;
  let dragging = false, offsetX = 0, offsetY = 0;

  header.addEventListener('mousedown', e => {
    if (e.target.tagName === 'BUTTON') return;
    dragging = true;
    const rect = kb.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    kb.style.transition = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    let x = e.clientX - offsetX, y = e.clientY - offsetY;
    x = Math.max(0, Math.min(x, innerWidth - 100));
    y = Math.max(0, Math.min(y, innerHeight - 50));
    kb.style.left = x + 'px';
    kb.style.top = y + 'px';
    kb.style.right = 'auto';
    kb.style.bottom = 'auto';
  });

  document.addEventListener('mouseup', () => { dragging = false; });

  // Touch support
  header.addEventListener('touchstart', e => {
    if (e.target.tagName === 'BUTTON') return;
    dragging = true;
    const rect = kb.getBoundingClientRect();
    offsetX = e.touches[0].clientX - rect.left;
    offsetY = e.touches[0].clientY - rect.top;
    kb.style.transition = 'none';
  }, { passive: true });

  document.addEventListener('touchmove', e => {
    if (!dragging) return;
    let x = e.touches[0].clientX - offsetX, y = e.touches[0].clientY - offsetY;
    x = Math.max(0, Math.min(x, innerWidth - 100));
    y = Math.max(0, Math.min(y, innerHeight - 50));
    kb.style.left = x + 'px';
    kb.style.top = y + 'px';
    kb.style.right = 'auto';
    kb.style.bottom = 'auto';
  }, { passive: true });

  document.addEventListener('touchend', () => { dragging = false; });
}

document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
