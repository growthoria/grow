
const revealElements = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: 0.12 });
revealElements.forEach((element) => observer.observe(element));

const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.style.transform = window.scrollY > 30 ? 'translateY(-2px)' : 'translateY(0)';
});

// Request service buttons: move to the request form and preselect the service.
const requestSection = document.getElementById('service-request');
const requestService = document.getElementById('requestService');


const serviceDetails = {
  strategy: {
    title: 'Business Strategy Sprint',
    message: 'Hello Growthoria,\n\nI am interested in the Business Strategy Sprint. I would like to clarify my company positioning, define priorities and prepare a practical growth direction. Please contact me to discuss the next steps.\n\nBest regards,'
  },
  advisory: {
    title: 'Management Advisory Retainer',
    message: 'Hello Growthoria,\n\nI am interested in the Management Advisory Retainer. I would like ongoing advisory support for business decisions, structure and strategic direction. Please contact me to discuss the monthly advisory format.\n\nBest regards,'
  },
  operations: {
    title: 'Operational Efficiency Audit',
    message: 'Hello Growthoria,\n\nI am interested in the Operational Efficiency Audit. I would like to review workflows, identify bottlenecks and improve operational execution. Please contact me to discuss the audit process.\n\nBest regards,'
  },
  market: {
    title: 'Market Entry Roadmap',
    message: 'Hello Growthoria,\n\nI am interested in the Market Entry Roadmap. I would like help preparing a structured plan for entering a new market and evaluating the most realistic next steps. Please contact me to discuss this service.\n\nBest regards,'
  },
  dashboard: {
    title: 'Growth Performance Dashboard',
    message: 'Hello Growthoria,\n\nI am interested in the Growth Performance Dashboard. I would like to build clearer KPI reporting and better visibility for management decisions. Please contact me to discuss the next steps.\n\nBest regards,'
  },
  workshop: {
    title: 'Leadership Alignment Workshop',
    message: 'Hello Growthoria,\n\nI am interested in the Leadership Alignment Workshop. I would like to align priorities, responsibilities and next-step actions with the leadership team. Please contact me to discuss available options.\n\nBest regards,'
  }
};

const serviceTitles = Object.fromEntries(
  Object.entries(serviceDetails).map(([key, value]) => [key, value.title])
);

function selectServiceAndScroll(key) {
  const details = serviceDetails[key];
  const title = details ? details.title : serviceTitles[key];

  if (title && requestService) requestService.value = title;

  const messageField = document.getElementById('requestMessage');
  if (messageField && details) {
    messageField.value = details.message;
    messageField.classList.remove('is-invalid');
  }

  if (requestSection) {
    requestSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  setTimeout(() => {
    const nameField = document.getElementById('requestName');
    if (nameField) nameField.focus({ preventScroll: true });
  }, 550);
}


document.querySelectorAll('[data-request-service]').forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    selectServiceAndScroll(button.getAttribute('data-request-service'));
  });
});

const serviceRequestForm = document.getElementById('serviceRequestForm');
if (serviceRequestForm) {
  const submitBtn = document.getElementById('requestSubmitBtn');
  const status = document.getElementById('requestStatus');

  const fields = [
    document.getElementById('requestService'),
    document.getElementById('requestName'),
    document.getElementById('requestEmail'),
    document.getElementById('requestMessage')
  ].filter(Boolean);

  function clearInvalidState(field) {
    field.classList.remove('is-invalid');
  }

  fields.forEach((field) => {
    field.addEventListener('input', () => clearInvalidState(field));
    field.addEventListener('change', () => clearInvalidState(field));
  });

  serviceRequestForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!submitBtn || !status) return;

    const serviceField = document.getElementById('requestService');
    const nameField = document.getElementById('requestName');
    const emailField = document.getElementById('requestEmail');
    const messageField = document.getElementById('requestMessage');

    const requiredFields = [serviceField, nameField, emailField, messageField].filter(Boolean);
    let firstInvalid = null;

    requiredFields.forEach((field) => {
      const isEmpty = !field.value || !field.value.trim();
      const isBadEmail = field.type === 'email' && field.value.trim() && !field.checkValidity();

      if (isEmpty || isBadEmail) {
        field.classList.add('is-invalid');
        if (!firstInvalid) firstInvalid = field;
      } else {
        field.classList.remove('is-invalid');
      }
    });

    if (firstInvalid) {
      status.className = 'request-status is-error';
      status.textContent = 'Please fill in all required fields before sending your request.';
      firstInvalid.focus();
      return;
    }

    submitBtn.classList.add('is-loading');
    submitBtn.textContent = 'Sending message...';
    status.className = 'request-status is-sending';
    status.textContent = 'Your message is being sent...';

    setTimeout(() => {
      submitBtn.classList.remove('is-loading');
      submitBtn.textContent = 'Message sent ✓';
      status.className = 'request-status is-success';
      status.textContent = 'Message successfully sent. Please wait for a response from Growthoria.';

      serviceRequestForm.reset();

      setTimeout(() => {
        submitBtn.textContent = 'Prepare email request ↗';
      }, 2600);
    }, 1400);
  });
}
// Rebuilt About popup
(function(){
  const modal = document.getElementById('aboutWindow');
  const openBtn = document.getElementById('openAboutWindow');
  const closeBtn = document.getElementById('closeAboutWindow');
  const closeBg = document.getElementById('closeAboutWindowBg');
  const closeButton = document.getElementById('aboutCloseButton');
  const requestBtn = document.getElementById('aboutRequestService');

  if (!modal || !openBtn) return;

  function openModal(){
    modal.classList.add('is-visible');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('gx-about-lock');
    const box = modal.querySelector('.gx-about-window__box');
    if (box) box.scrollTop = 0;
  }

  function closeModal(){
    modal.classList.remove('is-visible');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('gx-about-lock');
  }

  openBtn.addEventListener('click', function(event){
    event.preventDefault();
    openModal();
  });

  [closeBtn, closeBg, closeButton].forEach(function(el){
    if (el) el.addEventListener('click', closeModal);
  });

  if (requestBtn) {
    requestBtn.addEventListener('click', function(){
      closeModal();
      setTimeout(function(){
        const form = document.getElementById('service-request');
        if (form) form.scrollIntoView({behavior:'smooth', block:'start'});
      }, 120);
    });
  }

  document.addEventListener('keydown', function(event){
    if (event.key === 'Escape') closeModal();
  });
})();


// Navigation modal windows
(function(){
  const modal = document.getElementById('navInfoWindow');
  const title = document.getElementById('gxNavTitle');
  const eyebrow = document.getElementById('gxNavEyebrow');
  const lead = document.getElementById('gxNavLead');
  const grid = document.getElementById('gxNavGrid');
  const action = document.getElementById('gxNavAction');
  const closeBg = document.getElementById('closeNavInfoBg');
  const closeBtn = document.getElementById('closeNavInfoWindow');
  const closeButton = document.getElementById('closeNavInfoButton');
  const triggers = document.querySelectorAll('[data-nav-modal]');
  if (!modal || !title || !eyebrow || !lead || !grid || !triggers.length) return;

  const modalContent = {
    services: {
      eyebrow: 'Services',
      title: 'Consulting offers built for practical growth.',
      lead: 'Growthoria provides focused management consulting services for companies that want clearer direction, stronger operations and realistic next-step execution.',
      actionLabel: 'Go to request form',
      cards: [
        { title: 'Business Strategy Sprint', text: 'A focused strategy session to clarify positioning, priorities and the next stage of growth.' },
        { title: 'Management Advisory Retainer', text: 'Ongoing advisory support for leadership teams that need sharper external perspective and structured follow-up.' },
        { title: 'Operational Efficiency Audit', text: 'A practical review of workflows and bottlenecks to improve consistency, clarity and execution.' },
        { title: 'Market Entry Roadmap', text: 'A structured expansion plan for entering new markets with more confidence and practical next steps.' },
        { title: 'Growth Performance Dashboard', text: 'A KPI visibility and reporting solution designed to support better management decisions.' },
        { title: 'Leadership Alignment Workshop', text: 'A guided workshop to align teams, responsibilities and immediate priorities.' }
      ]
    },
    approach: {
      eyebrow: 'Approach',
      title: 'How we work with clients.',
      lead: 'Our approach is designed to turn complexity into clarity. We combine strategic thinking with hands-on execution and realistic advisory support.',
      actionLabel: 'Request a consultation',
      cards: [
        { title: 'Clarity first', text: 'We begin by understanding the business situation, the key blockers and the desired business outcome.' },
        { title: 'Tailored advisory', text: 'We do not use one-size-fits-all answers. Every recommendation is adapted to the company context.' },
        { title: 'Operational thinking', text: 'We connect strategic decisions with execution, processes, responsibilities and measurable next steps.' },
        { title: 'Sustainable growth', text: 'We focus on practical improvements that can support long-term performance and business resilience.' }
      ]
    },
    about: {
      eyebrow: 'About Growthoria',
      title: 'Advisors for growth that lasts.',
      lead: 'Growthoria is a France-based management consulting company helping businesses turn complexity into clearer priorities, better execution and stronger growth decisions.',
      actionLabel: 'Discuss your project',
      cards: [
        { title: 'Who we help', text: 'We work with founders, leadership teams and companies that need outside perspective and practical strategic support.' },
        { title: 'What we do', text: 'We support business strategy, management advisory, operational optimization, market development and leadership alignment.' },
        { title: 'How we think', text: 'Our work combines structure, clarity and execution. We aim for recommendations that are useful, realistic and actionable.' },
        { title: 'Why clients engage us', text: 'Clients come to Growthoria when they need clearer direction, sharper decision-making and better business momentum.' }
      ]
    },
    contact: {
      eyebrow: 'Contact',
      title: 'Get in touch with Growthoria.',
      lead: 'If you would like to discuss a service, request a proposal or start a conversation, you can contact us directly or use the service request form.',
      actionLabel: 'Open request form',
      cards: [
        { title: 'Email', text: 'hello@growthoria.digital' },
        { title: 'Phone', text: '+33 1 94 12 23 06' },
        { title: 'Address', text: '99 Rue Thiers, 92100 Boulogne-Billancourt, France' },
        { title: 'Best way to start', text: 'Use the request form to select a service and send a structured enquiry.' }
      ]
    }
  };

  function renderCards(cards){
    grid.innerHTML = '';
    cards.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'gx-nav-window__card';
      const heading = document.createElement('h3');
      heading.textContent = item.title;
      card.appendChild(heading);
      if (Array.isArray(item.list)) {
        const ul = document.createElement('ul');
        item.list.forEach((entry)=> {
          const li = document.createElement('li');
          li.textContent = entry;
          ul.appendChild(li);
        });
        card.appendChild(ul);
      } else {
        const p = document.createElement('p');
        p.textContent = item.text || '';
        card.appendChild(p);
      }
      grid.appendChild(card);
    });
  }

  function openModal(key){
    const data = modalContent[key];
    if (!data) return;
    eyebrow.textContent = data.eyebrow;
    title.textContent = data.title;
    lead.textContent = data.lead;
    action.textContent = data.actionLabel;
    renderCards(data.cards);
    modal.classList.add('is-visible');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('gx-nav-lock');
    const box = modal.querySelector('.gx-nav-window__box');
    if (box) box.scrollTop = 0;
  }

  function closeModal(){
    modal.classList.remove('is-visible');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('gx-nav-lock');
  }

  triggers.forEach((trigger)=>{
    trigger.addEventListener('click', (event)=>{
      event.preventDefault();
      openModal(trigger.getAttribute('data-nav-modal'));
    });
  });

  [closeBg, closeBtn, closeButton].forEach((el)=>{
    if (el) el.addEventListener('click', closeModal);
  });

  if (action) {
    action.addEventListener('click', function(){
      closeModal();
      setTimeout(function(){
        const form = document.getElementById('service-request');
        if (form) form.scrollIntoView({behavior:'smooth', block:'start'});
      }, 120);
    });
  }

  document.addEventListener('keydown', function(event){
    if (event.key === 'Escape' && modal.classList.contains('is-visible')) closeModal();
  });
})();

// Cloudflare Admin dynamic behavior patch
(function(){
function content(){return window.GROWTHORIA_CONTENT||window.GROWTHORIA_CONTENT_DEFAULT||{}}
function serviceByKey(k){return (content().services||[]).find(s=>s.key===k)||null}
document.addEventListener('click',function(e){
 const req=e.target.closest('[data-request-service]');
 if(req){e.preventDefault();const s=serviceByKey(req.getAttribute('data-request-service'));const form=document.getElementById('service-request');const sel=document.getElementById('requestService');const msg=document.getElementById('requestMessage');if(s&&sel)sel.value=s.title;if(s&&msg)msg.value=s.message||'';if(form)form.scrollIntoView({behavior:'smooth',block:'center'});setTimeout(()=>{let n=document.getElementById('requestName');if(n)n.focus({preventScroll:true})},500)}
},true);
})();
