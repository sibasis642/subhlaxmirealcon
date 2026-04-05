// ===================================
//  SUVHLAXMI REALCON — MAIN JS
// ===================================

const COMPANY = {
  whatsapp: "918596024950",
  phone: "8596024950",
  phone2: "9910725122",
  email: "suvhlaxmirealcon@gmail.com",
  address: "Plot No-252, Chhotaraypur, Near AIIMS, Patrapada, Bhubaneswar-751019"
};

// ─── Hero Slideshow ───
(function initSlideshow() {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  let current = 0;
  let autoTimer;

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(next, 5000);
  }

  document.querySelector('.slide-next').addEventListener('click', () => { next(); startAuto(); });
  document.querySelector('.slide-prev').addEventListener('click', () => { prev(); startAuto(); });
  dots.forEach(dot => {
    dot.addEventListener('click', () => { goTo(+dot.dataset.slide); startAuto(); });
  });

  startAuto();
})();


// ─── Header scroll effect ───
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
  document.querySelector('.scroll-top').classList.toggle('visible', window.scrollY > 400);
});

// ─── Mobile Nav ───
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  mobileNav.classList.toggle('open');
});
document.querySelectorAll('.mobile-nav a').forEach(a => {
  a.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    mobileNav.classList.remove('open');
  });
});

// ─── Portfolio ───
async function loadPortfolio() {
  try {
    const res = await fetch('data/portfolio.json');
    const projects = await res.json();
    const grid = document.getElementById('portfolio-grid');
    grid.innerHTML = '';
    projects.forEach((p, i) => {
      const card = document.createElement('div');
      card.className = `portfolio-card reveal reveal-delay-${i % 3}`;
      card.innerHTML = `
        <div class="portfolio-img">
          <img src="${p.image}" alt="${p.title}" loading="lazy" onerror="this.src='assets/images/header-logo.png'">
          <div class="portfolio-img-overlay"><span class="view-btn">View Project</span></div>
          <span class="portfolio-badge">${p.completion_year}</span>
        </div>
        <div class="portfolio-info">
          <h3>${p.title}</h3>
          <p class="portfolio-location"><i class="fas fa-map-marker-alt"></i>${p.location}</p>
          <div class="portfolio-meta">
            <div class="portfolio-meta-item">
              <span class="meta-label">Area</span>
              <span class="meta-value">${p.sqft}</span>
            </div>
            <div class="portfolio-meta-item">
              <span class="meta-label">Duration</span>
              <span class="meta-value">${p.duration}</span>
            </div>
            <div class="portfolio-meta-item">
              <span class="meta-label">Completed</span>
              <span class="meta-value">${p.completion_year}</span>
            </div>
          </div>
        </div>`;
      grid.appendChild(card);
    });
    initScrollReveal();
  } catch(e) { console.error('Portfolio load error', e); }
}

// ─── Testimonials ───
async function loadTestimonials() {
  try {
    const res = await fetch('data/testimonials.json');
    const items = await res.json();
    const track = document.getElementById('testimonials-track');
    track.innerHTML = '';

    // All 3 in one slide (or adapt per count)
    const slide = document.createElement('div');
    slide.className = 'testimonial-slide';
    items.forEach(t => {
      const initials = t.name.split(' ').map(w => w[0]).join('').toUpperCase();
      const stars = Array(t.rating).fill('<i class="fas fa-star"></i>').join('');
      const card = document.createElement('div');
      card.className = 'testimonial-card reveal';
      card.innerHTML = `
        <div class="stars">${stars}</div>
        <p class="testimonial-text">${t.message}</p>
        <div class="testimonial-author">
          <div class="author-avatar">
            <img src="${t.image}" alt="${t.name}" 
              onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
            <span class="author-avatar-fallback" style="display:none">${initials}</span>
          </div>
          <div>
            <div class="author-name">${t.name}</div>
            <div class="author-location"><i class="fas fa-map-marker-alt" style="font-size:0.65rem; margin-right:4px; color:var(--blue-bright)"></i>${t.location}</div>
          </div>
        </div>`;
      slide.appendChild(card);
    });
    track.appendChild(slide);
    initScrollReveal();
  } catch(e) { console.error('Testimonials load error', e); }
}

// ─── Scroll Reveal ───
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ─── Enquiry Form ───
function initEnquiryForm() {
  const btn = document.getElementById('enquiry-submit');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const land = document.getElementById('form-land').value;
    const name = document.getElementById('form-name').value.trim();
    const phone = document.getElementById('form-phone').value.trim();

    if (!name || !phone) {
      alert('Please enter your name and phone number.');
      return;
    }

    const msg = encodeURIComponent(
      `Hello Suvhlaxmi Realcon! 👋\n\nI'm interested in building a custom home.\n\nName: ${name}\nPhone: ${phone}\nLand Status: ${land === 'yes' ? 'I own a plot' : 'Looking for land'}\n\nPlease get in touch with me.`
    );
    window.open(`https://api.whatsapp.com/send?phone=${COMPANY.whatsapp}&text=${msg}`, '_blank');
  });
}

// ─── AI Chatbot (rule-based, free) ───
const BOT_RESPONSES = {
  greet: {
    triggers: ['hello', 'hi', 'hey', 'namaste', 'good morning', 'good evening'],
    response: `Namaste! 🙏 Welcome to Suvhlaxmi Realcon. I'm here to help you build your dream home. How can I assist you today?`
  },
  services: {
    triggers: ['service', 'what do you do', 'build', 'construction', 'offer'],
    response: `We offer **end-to-end custom home construction** on your land:\n\n• Architectural design & planning\n• Permit & approval assistance\n• Foundation to finishing\n• Premium material procurement\n• 25+ year structural warranty\n\nWhat would you like to know more about?`
  },
  cost: {
    triggers: ['cost', 'price', 'rate', 'how much', 'budget', 'estimate', 'pricing'],
    response: `Construction cost depends on area, design complexity, and material grade. Our projects typically range from **₹1,500 – ₹2,500 per sqft**.\n\nFor a detailed estimate tailored to your plot, please share your requirements and we'll get back to you.`
  },
  portfolio: {
    triggers: ['project', 'portfolio', 'work', 'past', 'example', 'show', 'completed'],
    response: `We have successfully delivered beautiful homes including:\n\n🏡 **Doha's Residence** – 2,613 sqft, Botanda, Bhubaneswar\n🏡 **Mahanty's Residence** – 1,303 sqft, Balakati, Bhubaneswar\n🏡 **Sahoo's Residence** – 1,200 sqft, Padhansahi, Jatni\n\nScroll up to see photos of each project!`
  },
  location: {
    triggers: ['where', 'location', 'address', 'office', 'visit', 'bhubaneswar', 'odisha'],
    response: `Our office is at:\n📍 Plot No-252, Chhotaraypur, Near AIIMS\nPatrapada, Bhubaneswar – 751019\n\nWe primarily serve Bhubaneswar and surrounding areas.`
  },
  contact: {
    triggers: ['contact', 'phone', 'call', 'number', 'email', 'reach', 'talk'],
    response: `You can reach us at:\n\n📞 8596024950 / 9910725122\n📧 suvhlaxmirealcon@gmail.com\n\nOr click the WhatsApp button on the right to chat directly! We respond within minutes.`
  },
  timeline: {
    triggers: ['time', 'how long', 'duration', 'month', 'year', 'fast', 'quick'],
    response: `Construction timelines depend on the home size:\n\n• **~1,200 sqft** – 6–9 months\n• **~2,000 sqft** – 9–12 months\n• **2,500+ sqft** – 12–18 months\n\nWe pride ourselves on on-time delivery!`
  },
  warranty: {
    triggers: ['warranty', 'guarantee', 'quality', 'assurance', 'defect'],
    response: `We offer a **25+ year structural warranty** on all our projects. Quality is at the core of everything we do — from material selection to final finishing.`
  },
  land: {
    triggers: ['land', 'plot', 'site', 'own', 'already have'],
    response: `That's great! We work on **your land** — you bring the plot and we turn it into your dream home. We also assist clients in finding suitable plots if needed.\n\nShare your plot details and we'll advise on the best approach.`
  },
  whatsapp: {
    triggers: ['whatsapp', 'wa', 'message'],
    response: `Click the green WhatsApp button on the bottom-right of the page to start a direct conversation with our team. We're available from 9 AM – 8 PM, Monday to Saturday.`
  },
  default: {
    response: `I'm not sure I have the exact answer for that! 😊 For specific queries, please:\n\n📞 Call us: 8596024950\n💬 WhatsApp us using the button on this page\n\nOur team will be happy to assist you!`
  }
};

function getBotResponse(input) {
  const lower = input.toLowerCase();
  for (const key in BOT_RESPONSES) {
    if (key === 'default') continue;
    if (BOT_RESPONSES[key].triggers.some(t => lower.includes(t))) {
      return BOT_RESPONSES[key].response;
    }
  }
  return BOT_RESPONSES.default.response;
}

function initChatbot() {
  const toggleBtn = document.getElementById('chat-toggle');
  const chatWindow = document.getElementById('chatbot-window');
  const closeBtn = document.getElementById('chat-close');
  const messagesEl = document.getElementById('chat-messages');
  const inputEl = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');

  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    chatWindow.classList.toggle('open');
  });
  closeBtn.addEventListener('click', () => chatWindow.classList.remove('open'));

  function appendMsg(text, type) {
    const msg = document.createElement('div');
    msg.className = `msg ${type}`;
    // Simple bold markdown support
    msg.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return msg;
  }

  function botReply(text) {
    // Show typing
    const typing = document.createElement('div');
    typing.className = 'msg bot typing';
    typing.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
    messagesEl.appendChild(typing);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    setTimeout(() => {
      typing.remove();
      appendMsg(text, 'bot');
    }, 900 + Math.random() * 400);
  }

  function sendMessage(text) {
    if (!text.trim()) return;
    appendMsg(text, 'user');
    inputEl.value = '';
    // Hide quick replies after first message
    document.querySelector('.chat-quick-replies').style.display = 'none';
    botReply(getBotResponse(text));
  }

  sendBtn.addEventListener('click', () => sendMessage(inputEl.value));
  inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(inputEl.value); });

  document.querySelectorAll('.quick-reply').forEach(btn => {
    btn.addEventListener('click', () => sendMessage(btn.textContent));
  });
}

// ─── Scroll to top ───
document.querySelector('.scroll-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── Counter animation ───
function animateCounters() {
  document.querySelectorAll('.counter').forEach(el => {
    const target = parseInt(el.dataset.target);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current) + (el.dataset.suffix || '');
      if (current >= target) clearInterval(timer);
    }, 16);
  });
}

const statsObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    animateCounters();
    statsObserver.disconnect();
  }
}, { threshold: 0.3 });
const statsEl = document.querySelector('.hero-stats');
if (statsEl) statsObserver.observe(statsEl);

// ─── Init ───
document.addEventListener('DOMContentLoaded', () => {
  loadPortfolio();
  loadTestimonials();
  initEnquiryForm();
  initChatbot();
  initScrollReveal();
});
