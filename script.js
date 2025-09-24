// ---------- MATRIX RAIN ----------
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');
let w = canvas.width = innerWidth;
let h = canvas.height = innerHeight;
const fontSize = 12;
let cols = Math.floor(w / fontSize);
let ypos = [];
for(let i=0;i<cols;i++){ ypos[i] = Math.random()*h; }

function resize(){
  w = canvas.width = innerWidth;
  h = canvas.height = innerHeight;
  cols = Math.floor(w / fontSize);
  ypos = [];
  for(let i=0;i<cols;i++) ypos[i] = Math.random()*h;
}
window.addEventListener('resize', resize);

function drawMatrix(){
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.fillRect(0,0,w,h);
  ctx.font = fontSize+'px "Share Tech Mono"';
  for(let i=0;i<cols;i++){
    const text = String.fromCharCode(33 + Math.random()*94|0);
    let col = getComputedStyle(document.documentElement).getPropertyValue('--matrix').trim() || '#00ff00';
    ctx.fillStyle = col;
    ctx.fillText(text, i*fontSize, ypos[i]);
    ypos[i] += fontSize + Math.random()*5;
    if(ypos[i]>h) ypos[i]=0;
  }
  requestAnimationFrame(drawMatrix);
}
drawMatrix();

// ---------- 3D CARD ----------
const card = document.querySelector('.card');
let tiltX=0, tiltY=0, targetX=0, targetY=0;
document.addEventListener('mousemove', e=>{
  const cx = innerWidth/2, cy = innerHeight/2;
  const dx = (e.clientX - cx)/cx;
  const dy = (e.clientY - cy)/cy;
  targetX = dy * -15;
  targetY = dx * 15;
});
if(window.DeviceOrientationEvent){
  if(typeof DeviceOrientationEvent.requestPermission === 'function'){
    DeviceOrientationEvent.requestPermission().then(res=>{
      if(res==='granted') window.addEventListener('deviceorientation', handleGyro);
    }).catch(()=>{ /* ignore permission errors */ });
  } else {
    window.addEventListener('deviceorientation', handleGyro);
  }
}
function handleGyro(e){
  const gamma = e.gamma||0;
  const beta = e.beta||0;
  targetY = gamma/90*30;
  targetX = beta/90*-30;
}
function animateTilt(){
  tiltX += (targetX-tiltX)*0.1;
  tiltY += (targetY-tiltY)*0.1;
  card.style.transform = `rotateY(${tiltY}deg) rotateX(${tiltX}deg)`;
  requestAnimationFrame(animateTilt);
}
animateTilt();

// ---------- THEME TOGGLE ----------
document.querySelector(".theme-toggle").addEventListener("click", ()=>{
  if(document.body.dataset.theme==="cyber") document.body.removeAttribute("data-theme");
  else document.body.dataset.theme="cyber";
});

// ---------- AUTO-CHANGING SUBTITLE ----------
const subtitle = document.getElementById("subtitle");
const roles = [
  "CyberSecurity Engineer At Amazon Web Services",
  "Penetration Tester",
  "Malware Analysis",
  " Developer"
];
let roleIndex = 0, charIndex = 0, deleting = false;
function typeLoop() {
  let current = roles[roleIndex];
  if (!deleting && charIndex <= current.length) {
    subtitle.innerHTML = current.substring(0, charIndex++);
  } else if (deleting && charIndex >= 0) {
    subtitle.innerHTML = current.substring(0, charIndex--);
  }
  if (charIndex === current.length + 1) {
    deleting = true;
    setTimeout(typeLoop, 1000);
    return;
  } else if (deleting && charIndex < 0) {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
  }
  setTimeout(typeLoop, deleting ? 50 : 80);
}
typeLoop();

// ---------- BACKGROUND MUSIC (⚠️ may be blocked without click) ----------
const music = document.getElementById('bg-music');
music.volume = 1.0;
music.play().catch(err => {
  console.log("Autoplay blocked by browser:", err);
});

// ---------- AUTO-FETCH VISITOR IP & LOCATION ----------
const infoContent = document.getElementById('info-content');

async function fetchIpInfo() {
  infoContent.textContent = 'Fetching IP & location…';
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (!res.ok) throw new Error('Network response not ok');
    const data = await res.json();
    const lines = [
      `IP: ${data.ip || 'N/A'}`,
      `City: ${data.city || 'N/A'}`,
      `Region: ${data.region || 'N/A'}`,
      `Country: ${data.country_name || 'N/A'}`,
      `ISP / Org: ${data.org || 'N/A'}`,
      `Latitude: ${data.latitude || 'N/A'}, Longitude: ${data.longitude || 'N/A'}`,
      `Timezone: ${data.timezone || 'N/A'}`
    ];
    infoContent.textContent = lines.join('\n');
  } catch (err) {
    console.error('IP fetch error:', err);
    infoContent.textContent = 'Unable to fetch IP info. Check network or try again later.';
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', fetchIpInfo);
} else {
  fetchIpInfo();
}
