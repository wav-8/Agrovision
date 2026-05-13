document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initNavigation();
  initHeroScene();
  initQuestionButtons();
  initExploreButton();
  initBarnScene();
  initProblemScene();
  initClimateScene();
  initScrollAnimations();
  initInfoSections();
  initStatsCounter();
});


function initCustomCursor() {
  const cursorGlow = document.getElementById('cursor-glow');
  const cursorDot = document.getElementById('cursor-dot');
  
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;
  let dotX = 0, dotY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function updateCursor() {
    // Smooth follow for glow (slower)
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;

    // Faster follow for dot
    dotX += (mouseX - dotX) * 0.25;
    dotY += (mouseY - dotY) * 0.25;

    cursorGlow.style.left = `${glowX}px`;
    cursorGlow.style.top = `${glowY}px`;
    cursorDot.style.left = `${dotX}px`;
    cursorDot.style.top = `${dotY}px`;

    requestAnimationFrame(updateCursor);
  }
  updateCursor();
}


function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('href');
      smoothScrollToSection(target);
      
     
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  
  window.addEventListener('scroll', updateNavOnScroll);
}

function updateNavOnScroll() {
  const sections = document.querySelectorAll('.scene[id]');
  const scrollPos = window.scrollY + 200;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    
    if (scrollPos >= top && scrollPos < top + height) {
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

function smoothScrollToSection(target) {
  const element = document.querySelector(target);
  if (!element) return;

 
  const wipe = document.getElementById('scene-wipe');
  const wipeText = wipe.querySelector('.wipe-text');
  
  wipe.classList.add('active');
  gsap.to(wipe, {
    y: 0,
    duration: 0.6,
    ease: 'power3.inOut',
    onStart: () => {
      gsap.to(wipeText, { opacity: 1, duration: 0.3, delay: 0.2 });
    },
    onComplete: () => {
      window.scrollTo({ top: element.offsetTop, behavior: 'smooth' });
      
      setTimeout(() => {
        gsap.to(wipe, {
          y: '-100%',
          duration: 0.6,
          ease: 'power3.inOut',
          onComplete: () => {
            wipe.classList.remove('active');
            gsap.set(wipe, { y: '100%' });
            gsap.set(wipeText, { opacity: 0 });
          }
        });
      }, 400);
    }
  });
}


function initHeroScene() {
  
  initHeroThreeJS();
  
  
  generateCrops();
  
 
  animateHeroEntrance();
  
  
  initHeroParallax();
}


function initHeroThreeJS() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  camera.position.z = 5;

 
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 800;
  const posArray = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 20;
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.015,
    color: 0x00ff88,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending
  });

  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);


  function animate() {
    requestAnimationFrame(animate);
    
    particlesMesh.rotation.y += 0.0003;
    particlesMesh.rotation.x += 0.0001;

   
    const positions = particlesMesh.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] += Math.sin(Date.now() * 0.0005 + positions[i]) * 0.0005;
    }
    particlesMesh.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }
  animate();

  
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}


function generateCrops() {
  const layers = [
    { container: document.getElementById('crops-far'), count: 30, height: [40, 60] },
    { container: document.getElementById('crops-mid'), count: 40, height: [60, 90] },
    { container: document.getElementById('crops-near'), count: 50, height: [80, 120] }
  ];

  layers.forEach(layer => {
    if (!layer.container) return;
    
    for (let i = 0; i < layer.count; i++) {
      const h = Math.random() * (layer.height[1] - layer.height[0]) + layer.height[0];
      const svg = createCropSVG(h);
      layer.container.appendChild(svg);
    }
  });
}

function createCropSVG(height) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '3');
  svg.setAttribute('height', height);
  svg.setAttribute('viewBox', `0 0 3 ${height}`);
  svg.classList.add('crop-stem');
  
  
  const swayDur = 2.5 + Math.random() * 2;
  const swayDelay = Math.random() * 3;
  const swayA = -1 - Math.random() * 2;
  const swayB = 1 + Math.random() * 2;
  
  svg.style.setProperty('--sway-duration', `${swayDur}s`);
  svg.style.setProperty('--sway-delay', `${swayDelay}s`);
  svg.style.setProperty('--sway-a', `${swayA}deg`);
  svg.style.setProperty('--sway-b', `${swayB}deg`);


  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', `M1.5,${height} L1.5,0`);
  path.setAttribute('stroke', '#00ff88');
  path.setAttribute('stroke-width', '1.5');
  path.setAttribute('opacity', '0.4');
  path.setAttribute('stroke-linecap', 'round');
  
  svg.appendChild(path);
  return svg;
}


function animateHeroEntrance() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  
  tl.to('#hero-eyebrow', { opacity: 1, y: 0, duration: 1, delay: 0.3 })
    .to('#hero-title', { opacity: 1, duration: 1 }, '-=0.5')
    .add(() => {
      document.getElementById('hero-title').classList.add('revealed');
    }, '-=0.5')
    .to('#hero-subtitle', { opacity: 1, y: 0, duration: 1 }, '-=0.7')
    .to('#hero-questions', { opacity: 1, y: 0, duration: 1 }, '-=0.6')
    .to('#cta-explore', { opacity: 1, y: 0, duration: 1 }, '-=0.6')
    .to('#scroll-hint', { opacity: 0.4, duration: 1 }, '-=0.5');
}


function initHeroParallax() {
  const sky = document.getElementById('sky-layer');
  const cropsFar = document.getElementById('crops-far');
  const cropsMid = document.getElementById('crops-mid');
  const cropsNear = document.getElementById('crops-near');
  const fog = document.getElementById('fog-layer');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroHeight = document.getElementById('scene-hero').offsetHeight;
    
    if (scrolled < heroHeight) {
      const speed = scrolled * 0.3;
      if (sky) sky.style.transform = `translateY(${speed * 0.2}px)`;
      if (cropsFar) cropsFar.style.transform = `translateY(${speed * 0.5}px)`;
      if (cropsMid) cropsMid.style.transform = `translateY(${speed * 0.7}px)`;
      if (cropsNear) cropsNear.style.transform = `translateY(${speed * 0.9}px)`;
      if (fog) fog.style.transform = `translateY(${speed * 0.3}px)`;
    }
  });
}


function initQuestionButtons() {
  const buttons = document.querySelectorAll('.question-btn');
  
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      const targetElement = document.getElementById(target);
      
      if (targetElement) {
        smoothScrollToSection(`#scene-info`);
        
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 800);
      }
    });
  });
}


function initExploreButton() {
  const exploreBtn = document.getElementById('cta-explore');
  
  if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
      smoothScrollToSection('#scene-barn');
    });
  }
}


function initBarnScene() {
  
  generateBarnSVG();
  
 
  createHoloParticles();
  
  
  animateChatMessages();
  
  
  initBarnThreeJS();
}


function generateBarnSVG() {
  const container = document.getElementById('barn-svg-container');
  if (!container) return;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '600');
  svg.setAttribute('height', '400');
  svg.setAttribute('viewBox', '0 0 600 400');
  svg.style.width = '100%';
  svg.style.height = 'auto';

  
  const barn = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  barn.setAttribute('d', 'M100,400 L100,200 L300,100 L500,200 L500,400 Z M200,250 L200,400 M400,250 L400,400');
  barn.setAttribute('stroke', 'rgba(0,255,136,0.3)');
  barn.setAttribute('stroke-width', '2');
  barn.setAttribute('fill', 'rgba(0,255,136,0.02)');
  
  svg.appendChild(barn);
  container.appendChild(svg);

  
  gsap.fromTo(barn, 
    { opacity: 0, strokeDasharray: 2000, strokeDashoffset: 2000 },
    { 
      opacity: 1, 
      strokeDashoffset: 0, 
      duration: 3, 
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: '#scene-barn',
        start: 'top 60%'
      }
    }
  );
}


function createHoloParticles() {
  const container = document.getElementById('holo-particles');
  if (!container) return;

  for (let i = 0; i < 25; i++) {
    const particle = document.createElement('div');
    particle.classList.add('holo-particle');
    
    const size = 3 + Math.random() * 6;
    const left = Math.random() * 100;
    const bottom = Math.random() * 60;
    const dur = 4 + Math.random() * 4;
    const delay = Math.random() * 3;
    const op = 0.3 + Math.random() * 0.4;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${left}%`;
    particle.style.bottom = `${bottom}%`;
    particle.style.setProperty('--dur', `${dur}s`);
    particle.style.setProperty('--delay', `${delay}s`);
    particle.style.setProperty('--op', op);
    particle.style.setProperty('--dx1', `${(Math.random() - 0.5) * 40}px`);
    particle.style.setProperty('--dy1', `${-20 - Math.random() * 40}px`);
    particle.style.setProperty('--dx2', `${(Math.random() - 0.5) * 30}px`);
    particle.style.setProperty('--dy2', `${-40 - Math.random() * 30}px`);
    particle.style.setProperty('--dx3', `${(Math.random() - 0.5) * 35}px`);
    particle.style.setProperty('--dy3', `${-30 - Math.random() * 35}px`);
    
    container.appendChild(particle);
  }
}


function animateChatMessages() {
  const chatContainer = document.getElementById('chat-messages');
  if (!chatContainer) return;

  const messages = [
    { type: 'user', text: 'Are these tomato plants infected?' },
    { type: 'ai', text: 'Analyzing image... Detected early blight on lower leaves. Confidence: 96%' },
    { type: 'user', text: 'What should I do?' },
    { type: 'ai', text: 'Remove infected leaves immediately. Apply copper-based fungicide. Monitor spread daily.' },
    { type: 'ai', text: 'Predicted yield impact: -8% if treated within 48 hours.' }
  ];

  
  gsap.timeline({
    scrollTrigger: {
      trigger: '#scene-barn',
      start: 'top 50%',
      onEnter: () => {
        messages.forEach((msg, i) => {
          setTimeout(() => {
            const msgEl = document.createElement('div');
            msgEl.classList.add('chat-msg', msg.type);
            msgEl.textContent = msg.text;
            msgEl.style.animationDelay = `${i * 0.15}s`;
            chatContainer.appendChild(msgEl);
          }, i * 600);
        });
      }
    }
  });
}


function initBarnThreeJS() {
  const canvas = document.getElementById('barn-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.z = 4;

  
  const geometry = new THREE.BufferGeometry();
  const particlesCount = 400;
  const positions = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 15;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ 
    size: 0.02, 
    color: 0x00ff88, 
    transparent: true, 
    opacity: 0.3 
  });
  const points = new THREE.Points(geometry, material);
  scene.add(points);

  function animate() {
    requestAnimationFrame(animate);
    points.rotation.y += 0.0005;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}


function initProblemScene() {
  
  createPests();
  

  gsap.utils.toArray('.holo-card').forEach((card, i) => {
    gsap.to(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 80%',
        onEnter: () => {
          setTimeout(() => {
            card.classList.add('visible');
          }, card.getAttribute('data-delay') || 0);
        }
      }
    });
  });

 
  initProblemThreeJS();
}


function createPests() {
  const pestLayer = document.getElementById('pest-layer');
  if (!pestLayer) return;

  const pestEmojis = ['🦗', '🐛', '🦟', '🐝', '🦋'];
  
  for (let i = 0; i < 20; i++) {
    const pest = document.createElement('div');
    pest.classList.add('pest');
    pest.textContent = pestEmojis[Math.floor(Math.random() * pestEmojis.length)];
    
    const left = Math.random() * 100;
    const dur = 6 + Math.random() * 6;
    const delay = Math.random() * 4;
    const tx = (Math.random() - 0.5) * 200;
    const ty = -60 - Math.random() * 80;
    const rot = Math.random() * 720 - 360;
    
    pest.style.left = `${left}%`;
    pest.style.bottom = '0';
    pest.style.setProperty('--dur', `${dur}s`);
    pest.style.setProperty('--delay', `${delay}s`);
    pest.style.setProperty('--tx', `${tx}px`);
    pest.style.setProperty('--ty', `${ty}px`);
    pest.style.setProperty('--rot', `${rot}deg`);
    
    pestLayer.appendChild(pest);
  }
}


function initProblemThreeJS() {
  const canvas = document.getElementById('problem-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.z = 3;

  const geometry = new THREE.BufferGeometry();
  const particlesCount = 600;
  const positions = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 18;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ 
    size: 0.018, 
    color: 0xff3d3d, 
    transparent: true, 
    opacity: 0.25 
  });
  const points = new THREE.Points(geometry, material);
  scene.add(points);

  function animate() {
    requestAnimationFrame(animate);
    points.rotation.y -= 0.0004;
    points.rotation.x -= 0.0002;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}


function initClimateScene() {
  
  createRain();
  
  
  initLightning();
  
  
  gsap.utils.toArray('.climate-card').forEach((card, i) => {
    gsap.to(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 80%',
        onEnter: () => {
          setTimeout(() => {
            card.classList.add('visible');
          }, card.getAttribute('data-delay') || 0);
        }
      }
    });
  });

  
  initClimateThreeJS();
}


function createRain() {
  const rainContainer = document.getElementById('rain-container');
  if (!rainContainer) return;

  for (let i = 0; i < 150; i++) {
    const drop = document.createElement('div');
    drop.classList.add('raindrop');
    
    const height = 40 + Math.random() * 60;
    const left = Math.random() * 100;
    const dur = 0.5 + Math.random() * 0.5;
    const delay = Math.random() * 2;
    const op = 0.3 + Math.random() * 0.4;
    
    drop.style.height = `${height}px`;
    drop.style.left = `${left}%`;
    drop.style.setProperty('--fall-dur', `${dur}s`);
    drop.style.setProperty('--fall-delay', `${delay}s`);
    drop.style.setProperty('--fall-op', op);
    
    rainContainer.appendChild(drop);
  }
}


function initLightning() {
  const lightning = document.getElementById('lightning-overlay');
  if (!lightning) return;

  function flash() {
    lightning.classList.add('flash');
    setTimeout(() => {
      lightning.classList.remove('flash');
    }, 150);
    
    
    const nextFlash = 2000 + Math.random() * 5000;
    setTimeout(flash, nextFlash);
  }

  
  gsap.timeline({
    scrollTrigger: {
      trigger: '#scene-climate',
      start: 'top 60%',
      onEnter: () => {
        setTimeout(flash, 1000);
      }
    }
  });
}


function initClimateThreeJS() {
  const canvas = document.getElementById('climate-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.z = 4;

  const geometry = new THREE.BufferGeometry();
  const particlesCount = 1000;
  const positions = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 25;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ 
    size: 0.012, 
    color: 0x00e5ff, 
    transparent: true, 
    opacity: 0.35 
  });
  const points = new THREE.Points(geometry, material);
  scene.add(points);

  function animate() {
    requestAnimationFrame(animate);
    
    
    const positions = points.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += Math.sin(Date.now() * 0.001 + positions[i + 1]) * 0.01;
      positions[i + 1] -= 0.02;
      
      
      if (positions[i + 1] < -12) {
        positions[i + 1] = 12;
        positions[i] = (Math.random() - 0.5) * 25;
      }
    }
    points.geometry.attributes.position.needsUpdate = true;
    
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}


function initInfoSections() {
  gsap.utils.toArray('.info-article').forEach(article => {
    gsap.to(article, {
      scrollTrigger: {
        trigger: article,
        start: 'top 70%',
        onEnter: () => {
          article.classList.add('visible');
          
          
          const listItems = article.querySelectorAll('.info-list li');
          listItems.forEach((item, i) => {
            setTimeout(() => {
              item.classList.add('visible');
            }, i * 100);
          });
        }
      }
    });
  });
}


function initStatsCounter() {
  const statValues = document.querySelectorAll('.stat-value');
  
  statValues.forEach(stat => {
    const target = parseFloat(stat.getAttribute('data-value'));
    
    gsap.to(stat, {
      scrollTrigger: {
        trigger: '#stats-bar',
        start: 'top 80%',
        onEnter: () => {
          animateValue(stat, 0, target, 2000);
        }
      }
    });
  });
}

function animateValue(element, start, end, duration) {
  const range = end - start;
  const increment = range / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
      current = end;
      clearInterval(timer);
    }
    element.textContent = current.toFixed(1);
  }, 16);
}


function initScrollAnimations() {
  gsap.utils.toArray('.fade-up').forEach(el => {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        onEnter: () => el.classList.add('visible')
      }
    });
  });
}


if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
  gsap.registerPlugin(ScrollTrigger);
  
  // Smooth scroll config
  gsap.config({
    nullTargetWarn: false
  });
}


window.addEventListener('resize', debounce(() => {
  ScrollTrigger.refresh();
}, 250));

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}


console.log(
  '%cAGROVISION',
  'font-size: 32px; font-weight: 900; color: #00ff88; text-shadow: 0 0 10px #00ff88;'
);
console.log(
  '%cComputer Vision Meets Agriculture',
  'font-size: 14px; color: #00cc6a; letter-spacing: 2px;'
);