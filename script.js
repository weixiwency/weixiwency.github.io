const viewport = document.querySelector('.viewport');
const scene = document.querySelector('.scene');
const caption = document.querySelector('.caption');
const captionText = document.querySelector('.caption-text');
const hotspots = [...document.querySelectorAll('.hotspot')];
const dust = document.querySelector('.dust');
const panCue = document.querySelector('.pan-cue');

let captionTimer;
let hintTimer;
let hasInteracted = false;
let cueOrigin = 0;

for (let index = 0; index < 18; index += 1) {
  const speck = document.createElement('span');
  speck.style.setProperty('--size', `${1 + Math.random() * 2.4}px`);
  speck.style.setProperty('--left', `${4 + Math.random() * 92}%`);
  speck.style.setProperty('--duration', `${10 + Math.random() * 13}s`);
  speck.style.setProperty('--delay', `${-Math.random() * 18}s`);
  speck.style.setProperty('--wander', `${-45 + Math.random() * 90}px`);
  dust.append(speck);
}

function showCaption(label) {
  window.clearTimeout(captionTimer);
  captionText.textContent = label;
  caption.classList.add('is-visible');
  captionTimer = window.setTimeout(() => {
    caption.classList.remove('is-visible');
  }, 4200);
}

function clearHint() {
  hasInteracted = true;
  window.clearTimeout(hintTimer);
  hotspots.forEach((hotspot) => hotspot.classList.remove('hinted'));
}

hotspots.forEach((hotspot) => {
  hotspot.addEventListener('click', () => {
    clearHint();
    showCaption(hotspot.dataset.label);
  });

  hotspot.addEventListener('pointerenter', clearHint, { once: true });
});

hintTimer = window.setTimeout(() => {
  if (hasInteracted) return;
  const cat = document.querySelector('.hotspot-cat');
  cat.classList.add('hinted');
  window.setTimeout(() => cat.classList.remove('hinted'), 1700);
}, 2600);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    caption.classList.remove('is-visible');
    clearHint();
  }
});

const finePointer = window.matchMedia('(pointer: fine)');

function updateParallax(event) {
  if (!finePointer.matches) return;
  const x = event.clientX / window.innerWidth - 0.5;
  const y = event.clientY / window.innerHeight - 0.5;
  scene.style.setProperty('--drift-x', `${x * -5}px`);
  scene.style.setProperty('--drift-y', `${y * -3}px`);
}

window.addEventListener('pointermove', updateParallax, { passive: true });

window.addEventListener('load', () => {
  const overflow = Math.max(0, scene.scrollWidth - viewport.clientWidth);
  if (overflow > 0) {
    cueOrigin = overflow * 0.16;
    viewport.scrollLeft = cueOrigin;
    panCue.classList.add('is-visible');
  }
});

viewport.addEventListener('scroll', () => {
  if (Math.abs(viewport.scrollLeft - cueOrigin) > 22) panCue.classList.add('is-hidden');
}, { passive: true });
