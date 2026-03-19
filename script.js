/**
 * ============================================================
 *  GRADUATION WEBSITE — script.js
 *  Tính cá nhân hóa: chỉnh các biến trong phần CONFIG bên dưới
 * ============================================================
 */

/* ============================================================
   🎨 CONFIG — Chỉnh nội dung tại đây!
   ============================================================ */
const CONFIG = {
  // 👤 Người nhận
  recipientName: "Nguyễn Văn A",

  // ✍️ Người gửi
  senderName: "Người thân của bạn",

  // 💬 Lời chúc typing (hiển thị từng chữ ở Section 1)
  typingMessage:
    `Chặng đường này khép lại, nhưng hành trình mới chỉ bắt đầu...

Bốn năm qua — những sáng sớm vội vã, những đêm khuya cặm cụi, những lần vấp ngã rồi lại đứng dậy — tất cả đã dệt nên một phiên bản tốt đẹp hơn của bạn.

Hôm nay, bạn xứng đáng được tự hào. 🌟`,

  // 💌 Lời nhắn cá nhân (Section 3)
  personalMessage:
    `Tôi biết con đường phía trước vẫn còn dài, và không phải lúc nào cũng dễ dàng. Nhưng tôi tin vào bạn — tin vào sự kiên trì, vào trái tim giàu lòng nhiệt huyết, và vào đôi bàn tay chưa bao giờ chịu buông bỏ.

Chúc mừng tốt nghiệp! Hãy bước tiếp với tất cả những gì bạn có.
Thế giới đang chờ bạn ✨`,

  // 🔒 Lời nhắn bí mật (Section 4 — cần bấm 7 lần để mở)
  surpriseMessage:
    `Đây là điều tôi chưa bao giờ nói thành lời...

Nhìn bạn trưởng thành và đạt được điều này — tôi tự hào lắm. Không phải chỉ vì tấm bằng, mà vì con người mà bạn đã trở thành.

Cảm ơn vì đã cho tôi được đồng hành. 💛`,

  // 🔢 Số lần bấm để mở bí mật
  lockClicks: 7,

  // 🎁 Số lần bấm vào hộp quà ở landing page
  giftClicks: 5,

  // 🎵 Tự động phát nhạc (true/false — cần file music.mp3)
  autoPlayMusic: false,
};
/* ============================================================
   END CONFIG
   ============================================================ */


/* ---- DOM References ---- */
const $  = id => document.getElementById(id);
const loadingScreen   = $('loading-screen');
const landingPage     = $('landing-page');
const mainContent     = $('main-content');
const audioBtn        = $('audio-btn');
const bgMusic         = $('bg-music');
const progressFill    = $('story-progress-fill');

/* ---- State ---- */
let currentSection    = 1;
const totalSections   = 4; // không tính final
let giftClickCount    = 0;
let lockClickCount    = 0;
let typingDone        = false;
let musicPlaying      = false;
let slideIndex        = 0;
const slides          = [];
let particleAnimId    = null;
let petalsInterval    = null;


/* ============================================================
   INIT — Chạy khi trang load xong
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Điền tên người nhận
  $('recipient-name').textContent       = CONFIG.recipientName;
  $('final-recipient-name').textContent = CONFIG.recipientName;
  $('sender-name').textContent          = CONFIG.senderName;

  // Điền lời nhắn cá nhân
  $('personal-message').textContent = CONFIG.personalMessage;
  $('surprise-text').textContent    = CONFIG.surpriseMessage;

  // Cập nhật số lần cần bấm cho gift & lock
  $('gift-click-count').textContent = `0 / ${CONFIG.giftClicks}`;
  $('lock-remain').textContent      = CONFIG.lockClicks;

  // Chạy fake loading
  runFakeLoader();

  // Audio toggle
  audioBtn.addEventListener('click', toggleMusic);

  // Surprise box click
  const surpriseBox = $('surprise-box');
  surpriseBox.addEventListener('click', handleLockClick);

  // Khởi tạo slideshow
  initSlideshow();

  // Tạo hoa rơi
  initPetals();
});


/* ============================================================
   FAKE LOADING SCREEN
   ============================================================ */
function runFakeLoader() {
  const fill    = $('progress-fill');
  const percent = $('loader-percent');
  let p = 0;

  const messages = [
    { at: 0,   text: "Đang chuẩn bị điều đặc biệt" },
    { at: 40,  text: "Đang gói lời chúc" },
    { at: 70,  text: "Đang thắt nơ hộp quà" },
    { at: 90,  text: "Sắp xong rồi" },
  ];

  const loaderText = document.querySelector('.loader-text');

  const interval = setInterval(() => {
    // Tiến độ không đều (chậm ở giữa → cảm giác "thật")
    const speed = p < 60 ? 1.5 : p < 85 ? 0.8 : 0.4;
    p = Math.min(p + speed, 100);

    fill.style.width    = p + '%';
    percent.textContent = Math.round(p) + '%';

    // Đổi text theo tiến độ
    messages.forEach(m => {
      if (p >= m.at) loaderText.firstChild.textContent = m.text;
    });

    if (p >= 100) {
      clearInterval(interval);
      // Ngừng ở 100% một chút → reveal
      setTimeout(revealLanding, 600);
    }
  }, 40);
}

function revealLanding() {
  loadingScreen.classList.add('fade-out');
  audioBtn.classList.add('visible');
  initParticles();

  // Tự phát nhạc nếu cấu hình
  if (CONFIG.autoPlayMusic) {
    bgMusic.play().then(() => { musicPlaying = true; updateAudioBtn(); }).catch(() => {});
  }
}


/* ============================================================
   PARTICLE CANVAS (landing background)
   ============================================================ */
function initParticles() {
  const canvas  = $('particle-canvas');
  const ctx     = canvas.getContext('2d');
  const W       = canvas.width  = window.innerWidth;
  const H       = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const COLORS = ['#a78bfa', '#f9a8d4', '#fcd34d', '#6ee7b7', '#93c5fd'];
  const NUM    = 80;

  const particles = Array.from({ length: NUM }, () => ({
    x:    Math.random() * W,
    y:    Math.random() * H,
    r:    Math.random() * 2.5 + 0.5,
    vx:   (Math.random() - 0.5) * 0.4,
    vy:   (Math.random() - 0.5) * 0.4,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    alpha: Math.random() * 0.6 + 0.2,
  }));

  function draw() {
    const cw = canvas.width, ch = canvas.height;
    ctx.clearRect(0, 0, cw, ch);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = cw;
      if (p.x > cw) p.x = 0;
      if (p.y < 0) p.y = ch;
      if (p.y > ch) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    });
    particleAnimId = requestAnimationFrame(draw);
  }

  draw();
}


/* ============================================================
   GIFT BOX MINI GAME
   ============================================================ */
function handleGiftClick() {
  giftClickCount++;
  const maxClicks = CONFIG.giftClicks;
  const pct = (giftClickCount / maxClicks) * 100;

  // Cập nhật progress bar
  $('gift-progress-bar').style.width = pct + '%';
  $('gift-click-count').textContent  = `${giftClickCount} / ${maxClicks}`;

  // Shake animation
  const box = $('gift-box');
  box.classList.add('shake');
  setTimeout(() => box.classList.remove('shake'), 300);

  // Đổi hint text theo tiến trình
  const hints = [
    "Tiếp tục nào! 🎁",
    "Gần rồi... ✨",
    "Một chút nữa thôi! 💫",
    "Sắp mở được rồi...! 🌟",
    `Mở ngay! 🎉`,
  ];
  const hintIdx = Math.floor((giftClickCount / maxClicks) * (hints.length - 1));
  $('game-hint').textContent = hints[Math.min(hintIdx, hints.length - 1)];

  // Emoji đổi theo tiến trình
  const emojis = ['🎁', '📦', '🎀', '✨', '🎊'];
  $('gift-lid').textContent = emojis[Math.min(giftClickCount - 1, emojis.length - 1)];

  if (giftClickCount >= maxClicks) {
    openMainContent();
  }
}


/* ============================================================
   TRANSITION: LANDING → MAIN CONTENT
   ============================================================ */
function openMainContent() {
  // Confetti 🎉
  launchConfetti();

  // Dừng particle animation
  if (particleAnimId) cancelAnimationFrame(particleAnimId);

  // Fade out landing
  landingPage.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  landingPage.style.opacity    = '0';
  landingPage.style.transform  = 'scale(1.05)';
  landingPage.style.pointerEvents = 'none';

  setTimeout(() => {
    landingPage.style.display = 'none';
    mainContent.classList.remove('hidden');

    // Hiện section 1 với animation
    const sec1 = $('section-1');
    sec1.classList.add('entering');

    // Bắt đầu typing
    setTimeout(startTyping, 600);
  }, 800);
}


/* ============================================================
   TYPING EFFECT (Section 1)
   ============================================================ */
function startTyping() {
  const el      = $('typing-text');
  const text    = CONFIG.typingMessage;
  let   i       = 0;
  const speed   = 40; // ms mỗi ký tự

  function typeNext() {
    if (i < text.length) {
      el.textContent += text[i];
      i++;
      setTimeout(typeNext, speed);
    } else {
      // Ẩn cursor, hiện nút next
      document.querySelector('.typing-cursor').style.opacity = '0';
      const btn = $('btn-next-1');
      btn.style.display   = 'inline-block';
      btn.style.animation = 'fadeInUp 0.5s ease both';
      typingDone = true;
    }
  }

  typeNext();
}


/* ============================================================
   STORY NAVIGATION
   ============================================================ */
function showSection(num) {
  // Ẩn section hiện tại
  const current = $(`section-${currentSection}`);
  current.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  current.style.opacity    = '0';
  current.style.transform  = 'translateY(-30px)';

  setTimeout(() => {
    // FIX: dùng inline style.display = 'none' thay vì class hidden-section
    // vì inline style có độ ưu tiên cao hơn → ghi đè đúng cách
    current.style.display   = 'none';
    current.style.opacity   = '';
    current.style.transform = '';
    current.style.transition = '';

    // Hiện section mới
    const next = num === 'final' ? $('section-final') : $(`section-${num}`);
    // Xóa class hidden-section (nếu có từ HTML ban đầu)
    next.classList.remove('hidden-section');
    next.style.display = 'flex';
    next.classList.add('entering');
    setTimeout(() => next.classList.remove('entering'), 700);

    // Scroll về đầu section mới
    window.scrollTo({ top: 0, behavior: 'smooth' });

    currentSection = num;
    updateProgress(num);

    // Side effects
    if (num === 2) initSlideshow();
  }, 500);
}

function showFinalScreen() {
  // Mega confetti!
  launchCelebration();
  showSection('final');
}

function updateProgress(sectionNum) {
  const pct = sectionNum === 'final'
    ? 100
    : (sectionNum / totalSections) * 100;
  progressFill.style.width = pct + '%';
}


/* ============================================================
   SLIDESHOW
   ============================================================ */
function initSlideshow() {
  const slideEls  = document.querySelectorAll('.slide:not(.slide-fallback)');
  const fallback  = $('slide-fallback');
  const dotsEl    = $('slide-dots');
  dotsEl.innerHTML = '';

  // Kiểm tra nếu tất cả ảnh lỗi → dùng fallback
  let allFailed = true;
  slideEls.forEach(s => {
    if (!s.classList.contains('no-img')) allFailed = false;
  });
  if (allFailed) {
    fallback.style.display = 'flex';
    $('slide-prev').style.display = $('slide-next').style.display = 'none';
    return;
  }

  // Lọc slides hợp lệ
  slideEls.forEach((s, i) => {
    if (s.classList.contains('no-img')) return;
    slides.push(s);
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.onclick   = () => goToSlide(slides.indexOf(s));
    dotsEl.appendChild(dot);
  });

  goToSlide(0);
}

function goToSlide(idx) {
  slides.forEach((s, i) => {
    s.classList.toggle('active-slide', i === idx);
  });
  document.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('active', i === idx);
  });
  slideIndex = idx;
}

function changeSlide(dir) {
  const next = (slideIndex + dir + slides.length) % slides.length;
  goToSlide(next);
}


/* ============================================================
   HIDDEN MESSAGE (Section 4)
   ============================================================ */
function handleLockClick() {
  const contentShown = !$('surprise-content').classList.contains('hidden');
  if (contentShown) return;

  lockClickCount++;
  const remain = CONFIG.lockClicks - lockClickCount;

  // Thêm ngôi sao
  const star  = document.createElement('span');
  star.className = 'lock-star';
  star.textContent = '⭐';
  $('lock-stars').appendChild(star);

  // Wiggle animation
  const box = $('surprise-box');
  box.classList.add('unlocking');
  setTimeout(() => box.classList.remove('unlocking'), 400);

  if (remain > 0) {
    $('lock-remain').textContent = remain;
    // Đổi icon khóa theo tiến trình
    const lockSpan = document.querySelector('.surprise-lock > span');
    const lockEmojis = ['🔒', '🔐', '🔏', '🗝️', '🔓'];
    const idx = Math.floor((lockClickCount / CONFIG.lockClicks) * (lockEmojis.length - 1));
    lockSpan.textContent = lockEmojis[Math.min(idx, lockEmojis.length - 1)];
  } else {
    // Mở khóa!
    $('surprise-lock').style.display  = 'none';
    const sc = $('surprise-content');
    sc.classList.remove('hidden');
    $('hint-text').style.display = 'none';

    // Confetti nhỏ
    launchConfetti(0.6);
  }
}


/* ============================================================
   CONFETTI HELPERS
   ============================================================ */
function launchConfetti(intensity = 1) {
  const count = Math.round(150 * intensity);
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  function randomInRange(min, max) { return Math.random() * (max - min) + min; }

  confetti({ ...defaults, particleCount: count, origin: { x: randomInRange(0.2, 0.4), y: Math.random() - 0.2 } });
  confetti({ ...defaults, particleCount: count, origin: { x: randomInRange(0.6, 0.8), y: Math.random() - 0.2 } });
}

function launchCelebration() {
  // Màn confetti hoành tráng
  const duration  = 4 * 1000;
  const animEnd   = Date.now() + duration;
  const defaults  = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  function randomInRange(min, max) { return Math.random() * (max - min) + min; }

  const interval = setInterval(function() {
    const timeLeft = animEnd - Date.now();
    if (timeLeft <= 0) { clearInterval(interval); return; }

    const particleCount = 50 * (timeLeft / duration);
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
  }, 250);
}


/* ============================================================
   FLOATING PETALS
   ============================================================ */
function initPetals() {
  const container = $('petals-container');
  const symbols   = ['🌸', '🌺', '✨', '🌼', '⭐', '💫', '🌟'];

  petalsInterval = setInterval(() => {
    const petal = document.createElement('div');
    petal.className    = 'petal';
    petal.textContent  = symbols[Math.floor(Math.random() * symbols.length)];
    petal.style.left   = Math.random() * 100 + 'vw';
    petal.style.fontSize = (Math.random() * 0.8 + 0.6) + 'rem';
    const dur = Math.random() * 8 + 7;
    petal.style.animationDuration  = dur + 's';
    petal.style.animationDelay     = '0s';
    petal.style.opacity = '0';
    container.appendChild(petal);

    // Xoá petal sau khi rơi xong
    setTimeout(() => petal.remove(), dur * 1000 + 500);
  }, 800);
}


/* ============================================================
   AUDIO
   ============================================================ */
function toggleMusic() {
  if (musicPlaying) {
    bgMusic.pause();
    musicPlaying = false;
  } else {
    bgMusic.play()
      .then(() => { musicPlaying = true; })
      .catch(() => {
        console.warn('Trình duyệt chặn tự động phát nhạc. Người dùng cần tương tác trước.');
      });
  }
  updateAudioBtn();
}

function updateAudioBtn() {
  $('audio-icon').textContent = musicPlaying ? '🔊' : '🔇';
}


/* ============================================================
   RESTART
   ============================================================ */
function restartWebsite() {
  location.reload();
}
