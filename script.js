const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
$("#year").textContent = new Date().getFullYear();

// Rotating role headline
const roles = ["AI/ML Developer", "Data Science Enthusiast", "Python Programmer", "Deep Learning Learner"];
let roleIndex = 0, charIndex = roles[0].length, deleting = false;
const roleEl = $("#typed-role");
function typeRole() {
  const current = roles[roleIndex];
  if (!deleting) {
    charIndex++;
    roleEl.textContent = current.slice(0, charIndex);
    if (charIndex >= current.length) { deleting = true; setTimeout(typeRole, 1350); return; }
  } else {
    charIndex--;
    roleEl.textContent = current.slice(0, charIndex);
    if (charIndex <= 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; }
  }
  setTimeout(typeRole, deleting ? 42 : 85);
}
setTimeout(typeRole, 1700);

// Mobile navigation
const menuButton = $("#menu-toggle"), nav = $("#nav");
menuButton.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.textContent = open ? "×" : "☰";
});
$$(".nav-link").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open"); menuButton.setAttribute("aria-expanded", "false"); menuButton.textContent = "☰";
}));
const sections = $$("main section[id]");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      $$(".nav-link").forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`));
    }
  });
}, {rootMargin:"-30% 0px -60% 0px"});
sections.forEach(section => observer.observe(section));

// Falling cherry-blossom particles drawn at high device-pixel resolution
const canvas = $("#petal-canvas"), ctx = canvas.getContext("2d");
let width=0, height=0, petals=[], petalsEnabled=true, raf;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function resizeCanvas(){
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth; height = window.innerHeight;
  canvas.width = Math.floor(width*dpr); canvas.height = Math.floor(height*dpr);
  canvas.style.width = width+"px"; canvas.style.height = height+"px";
  ctx.setTransform(dpr,0,0,dpr,0,0);
  petals = Array.from({length: Math.min(48, Math.floor(width/24))}, () => newPetal(true));
}
function newPetal(initial=false){
  return {x:Math.random()*width,y:initial?Math.random()*height:-20,size:3+Math.random()*6,
    speed:.45+Math.random()*1.2,drift:Math.random()*1.1-.55,rotation:Math.random()*6.28,
    spin:(Math.random()-.5)*.045,alpha:.28+Math.random()*.55,sway:Math.random()*2.5,
    hue:Math.random()>.7?285:325};
}
function drawPetal(p){
  ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rotation);ctx.globalAlpha=p.alpha;
  const grad=ctx.createLinearGradient(-p.size,-p.size,p.size,p.size);
  grad.addColorStop(0,"#ffe5f8");grad.addColorStop(.55,p.hue===285?"#cba2ff":"#ff79cf");grad.addColorStop(1,"#f8a2ed");
  ctx.fillStyle=grad;ctx.shadowColor="#ff6bcf";ctx.shadowBlur=10;
  ctx.beginPath();ctx.moveTo(0,-p.size);ctx.bezierCurveTo(p.size*1.5,-p.size*.6,p.size*1.1,p.size*.7,0,p.size);ctx.bezierCurveTo(-p.size*1.1,p.size*.5,-p.size*1.2,-p.size*.5,0,-p.size);ctx.fill();ctx.restore();
}
function animate(){
  ctx.clearRect(0,0,width,height);
  if(petalsEnabled&&!reducedMotion) petals.forEach((p,i)=>{p.y+=p.speed;p.x+=p.drift+Math.sin(p.y*.015+p.sway)*.5;p.rotation+=p.spin;if(p.y>height+20)petals[i]=newPetal();drawPetal(p);});
  raf=requestAnimationFrame(animate);
}
window.addEventListener("resize",resizeCanvas);resizeCanvas();animate();
$("#petal-toggle").addEventListener("click",()=>{
  petalsEnabled=!petalsEnabled;
  $("#petal-toggle").textContent=petalsEnabled?"☾":"✿";
  $("#petal-toggle").setAttribute("aria-label",petalsEnabled?"Turn off falling petals":"Turn on falling petals");
  if(!petalsEnabled)ctx.clearRect(0,0,width,height);
});

// Reveal skill meters when they enter view
const skillObserver = new IntersectionObserver(entries => entries.forEach(e=>{
  if(e.isIntersecting){e.target.style.setProperty("--level",e.target.dataset.level+"%");e.target.classList.add("visible");skillObserver.unobserve(e.target);}
}),{threshold:.2});
$$(".skill").forEach(skill=>skillObserver.observe(skill));

// Animated audio waveform
const waveform=$("#waveform");
for(let i=0;i<44;i++){const bar=document.createElement("i");bar.style.height=(12+Math.random()*75)+"%";bar.style.animationDelay=(Math.random()*.8)+"s";bar.style.animationDuration=(.55+Math.random()*.8)+"s";waveform.appendChild(bar);}

// Project modal content
const projectInfo={
 brain:{kicker:"PROJECT 01 · COMPUTER VISION",title:"Brain Tumor Detection Using Deep Learning",description:"A deep-learning project exploring brain MRI classification and tumor segmentation. The goal is to identify tumor categories and highlight regions of interest to support medical-image review. Technologies and architecture can be expanded as the project evolves.",tags:["Python","TensorFlow / Keras","CNN","U-Net","OpenCV"]},
 voice:{kicker:"PROJECT 02 · AUDIO / MACHINE LEARNING",title:"VoiceShield — Voice-Based Deepfake Detection",description:"A voice anti-spoofing project using acoustic features such as MFCC, spectral information, pitch and energy with a lightweight MLP classifier. The current work uses ASVspoof2019 LA audio and explores evaluation with classification metrics and ROC-AUC.",tags:["Python","Librosa","Acoustic Features","MLP","ASVspoof2019"]}
};
const dialog=$("#project-dialog");
$$(".project-open").forEach(btn=>btn.addEventListener("click",()=>{
  const info=projectInfo[btn.dataset.project];
  $("#dialog-kicker").textContent=info.kicker;$("#dialog-title").textContent=info.title;$("#dialog-description").textContent=info.description;
  $("#dialog-tags").replaceChildren(...info.tags.map(t=>{const span=document.createElement("span");span.textContent=t;return span;}));
  dialog.showModal();
}));
$("#dialog-close").addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close();});

// Contact form creates a pre-filled email. Replace this address with your own.
$("#contact-form").addEventListener("submit",e=>{
  e.preventDefault();
  const name=$("#name").value.trim(), email=$("#email").value.trim(), message=$("#message").value.trim();
  const to="deepalidewangan58@gmail.com";
  const subject=encodeURIComponent(`Portfolio message from ${name}`);
  const body=encodeURIComponent(`${message}\n\nFrom: ${name}\nReply to: ${email}`);
  $("#form-note").textContent="Opening your email app…";
  window.location.href=`mailto:${to}?subject=${subject}&body=${body}`;
});
