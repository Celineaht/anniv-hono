/* =========================================================
   À PERSONNALISER
   ========================================================= */

// Mets les photos dans le dossier "photos/" puis liste-les ici.
const PHOTOS = [
  { src: "photos/ok.jpg", legende: "Validé par Honorine 👌" },
  { src: "photos/hmm.jpg", legende: "Hmm… intéressant 🤔" },
  { src: "photos/retro.jpg", legende: "Diva rétro 🎞️" },
  { src: "photos/pardon.jpg", legende: "Pardon ?? 👀" },
  { src: "photos/mannequin.jpg", legende: "Mode mannequin 📸" },
  { src: "photos/boss.jpg", legende: "Boss lady 💼" },
  { src: "photos/sourire.jpg", legende: "Le sourire qui fait fondre" },
  { src: "photos/classe.jpg", legende: "Trop classe 😎" },
  { src: "photos/selfie.jpg", legende: "Selfie au bureau 💁🏾‍♀️" },
];

// Les cases de la roue des cadeaux.
const CADEAUX_ROUE = [
  "Un brunch offert 🥞",
  "Un câlin géant 🤗",
  "Une soirée karaoké 🎤",
  "Un joker « j'ai raison » 🃏",
  "Zéro vaisselle pendant 1 semaine 🍽️",
  "Un verre offert 🥂",
  "Un shooting photo de diva 📸",
  "Un massage des pieds 🦶",
];

const NB_BOUGIES = 5;

/* ========================================================= */

const COULEURS = ["#ff4fa3", "#ffd84d", "#8b5cf6", "#7ce0c3", "#ffffff"];
const aleatoire = (min, max) => Math.random() * (max - min) + min;

function confettis(options = {}) {
  if (typeof confetti !== "function") return;
  confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors: COULEURS, ...options });
}

function pluieDeConfettis(duree = 2500) {
  const fin = Date.now() + duree;
  (function frame() {
    confettis({ particleCount: 5, spread: 70, angle: 60, origin: { x: 0, y: 0.7 } });
    confettis({ particleCount: 5, spread: 70, angle: 120, origin: { x: 1, y: 0.7 } });
    if (Date.now() < fin) requestAnimationFrame(frame);
  })();
}

/* ----- Intro : le bouton « non » s'enfuit ----- */
const intro = document.getElementById("intro");
const boutonNon = document.getElementById("no-btn");
const excuses = ["non", "t'es sûre ?", "raté 😝", "impossible", "essaie encore", "nope", "hihi"];
let fuites = 0;

document.body.classList.add("locked");

function fuir(e) {
  e.preventDefault();
  const largeur = boutonNon.offsetWidth;
  const hauteur = boutonNon.offsetHeight;
  boutonNon.classList.add("running");
  boutonNon.style.left = `${aleatoire(10, innerWidth - largeur - 10)}px`;
  boutonNon.style.top = `${aleatoire(10, innerHeight - hauteur - 10)}px`;
  boutonNon.textContent = excuses[++fuites % excuses.length];
}
boutonNon.addEventListener("pointerenter", fuir);
boutonNon.addEventListener("pointerdown", fuir);
boutonNon.addEventListener("click", fuir);

document.getElementById("yes-btn").addEventListener("click", () => {
  confettis({ particleCount: 250, spread: 140 });
  boutonNon.remove();
  intro.classList.add("gone");
  document.body.classList.remove("locked");
  setTimeout(() => pluieDeConfettis(), 500);
}, { once: true });

/* ----- Prénom : lettres cliquables ----- */
const prenom = document.getElementById("name");
const couleursLettres = ["#ff4fa3", "#ffd84d", "#8b5cf6", "#7ce0c3", "#ffffff"];

const lettresPrenom = [...prenom.textContent];
prenom.textContent = "";
lettresPrenom.forEach((caractere, i) => {
  const lettre = document.createElement("span");
  lettre.className = "letter";
  lettre.textContent = caractere;
  lettre.style.animationDelay = `${i * 0.12}s`;
  lettre.setAttribute("aria-hidden", "true");
  lettre.addEventListener("click", (e) => {
    lettre.classList.remove("jump");
    void lettre.offsetWidth; // relance l'animation
    lettre.classList.add("jump");
    lettre.style.color = couleursLettres[Math.floor(Math.random() * couleursLettres.length)];
    confettis({
      particleCount: 40,
      spread: 60,
      startVelocity: 25,
      origin: { x: e.clientX / innerWidth, y: e.clientY / innerHeight },
    });
  });
  lettre.addEventListener("animationend", () => lettre.classList.remove("jump"));
  prenom.appendChild(lettre);
});

/* ----- Paillettes qui suivent la souris ----- */
let derniereP = 0;
document.addEventListener("pointermove", (e) => {
  if (e.pointerType !== "mouse" || performance.now() - derniereP < 45) return;
  derniereP = performance.now();
  const p = document.createElement("span");
  p.className = "sparkle";
  p.textContent = ["✨", "💖", "⭐", "💫"][Math.floor(Math.random() * 4)];
  p.style.left = `${e.clientX + aleatoire(-8, 8)}px`;
  p.style.top = `${e.clientY + aleatoire(-8, 8)}px`;
  document.body.appendChild(p);
  setTimeout(() => p.remove(), 800);
});

/* ----- Mur de photos déplaçables ----- */
const mur = document.getElementById("wall");

function placerPhotos() {
  const cartes = [...mur.children];
  if (!cartes.length) return;
  const colonnes = innerWidth < 600 ? 2 : 3;
  const lignes = Math.ceil(cartes.length / colonnes);
  const hauteurCarte = cartes[0].offsetHeight;
  const largeurCarte = cartes[0].offsetWidth;
  mur.style.height = `${lignes * (hauteurCarte + 30) + 40}px`;

  const largeurCase = mur.clientWidth / colonnes;
  cartes.forEach((carte, i) => {
    const x = (i % colonnes) * largeurCase + (largeurCase - largeurCarte) / 2 + aleatoire(-15, 15);
    const y = Math.floor(i / colonnes) * (hauteurCarte + 30) + 30 + aleatoire(-10, 10);
    carte.style.left = `${Math.max(0, Math.min(x, mur.clientWidth - largeurCarte))}px`;
    carte.style.top = `${y}px`;
  });
}

let zIndexMax = 1;

PHOTOS.forEach((photo, i) => {
  const carte = document.createElement("div");
  carte.className = "polaroid";
  carte.style.setProperty("--tilt", `${aleatoire(-8, 8).toFixed(1)}deg`);

  const img = document.createElement("img");
  img.className = "polaroid-img";
  img.src = photo.src;
  img.alt = photo.legende;
  img.draggable = false;
  img.addEventListener("error", () => {
    const vide = document.createElement("div");
    vide.className = "polaroid-img polaroid-empty";
    vide.innerHTML = "📷<small>photo bientôt</small>";
    img.replaceWith(vide);
    carte.dataset.vide = "1";
  });

  const legende = document.createElement("div");
  legende.className = "polaroid-caption";
  legende.textContent = photo.legende;
  carte.append(img, legende);

  // Glisser-déposer (souris + tactile)
  let depart = null;
  carte.addEventListener("pointerdown", (e) => {
    carte.setPointerCapture(e.pointerId);
    carte.style.zIndex = ++zIndexMax;
    depart = { x: e.clientX, y: e.clientY, left: carte.offsetLeft, top: carte.offsetTop, bouge: false };
  });
  carte.addEventListener("pointermove", (e) => {
    if (!depart) return;
    const dx = e.clientX - depart.x;
    const dy = e.clientY - depart.y;
    if (!depart.bouge && Math.hypot(dx, dy) < 5) return;
    depart.bouge = true;
    carte.classList.add("dragging");
    const maxX = mur.clientWidth - carte.offsetWidth;
    const maxY = mur.clientHeight - carte.offsetHeight;
    carte.style.left = `${Math.max(0, Math.min(depart.left + dx, maxX))}px`;
    carte.style.top = `${Math.max(0, Math.min(depart.top + dy, maxY))}px`;
  });
  carte.addEventListener("pointerup", () => {
    if (depart && !depart.bouge && !carte.dataset.vide) ouvrirVisionneuse(i);
    carte.classList.remove("dragging");
    depart = null;
  });

  mur.appendChild(carte);
});

addEventListener("load", placerPhotos);
let largeurPrecedente = innerWidth;
addEventListener("resize", () => {
  if (innerWidth === largeurPrecedente) return; // ignore la barre d'adresse mobile
  largeurPrecedente = innerWidth;
  placerPhotos();
});
placerPhotos();

/* ----- Visionneuse ----- */
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lb-img");
const lbLegende = document.getElementById("lb-caption");
let indexPhoto = 0;

function ouvrirVisionneuse(i) {
  indexPhoto = (i + PHOTOS.length) % PHOTOS.length;
  lbImg.src = PHOTOS[indexPhoto].src;
  lbImg.alt = PHOTOS[indexPhoto].legende;
  lbLegende.textContent = PHOTOS[indexPhoto].legende;
  lightbox.hidden = false;
}
const fermerVisionneuse = () => (lightbox.hidden = true);

lightbox.querySelector(".lb-close").addEventListener("click", fermerVisionneuse);
lightbox.querySelector(".lb-prev").addEventListener("click", () => ouvrirVisionneuse(indexPhoto - 1));
lightbox.querySelector(".lb-next").addEventListener("click", () => ouvrirVisionneuse(indexPhoto + 1));
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) fermerVisionneuse(); });
document.addEventListener("keydown", (e) => {
  if (lightbox.hidden) return;
  if (e.key === "Escape") fermerVisionneuse();
  if (e.key === "ArrowLeft") ouvrirVisionneuse(indexPhoto - 1);
  if (e.key === "ArrowRight") ouvrirVisionneuse(indexPhoto + 1);
});

/* ----- Jeu : attrape les cadeaux ----- */
const jeu = document.getElementById("game");
const joueur = document.getElementById("player");
const ecranJeu = document.getElementById("game-overlay");
const messageJeu = document.getElementById("game-msg");
const boutonJouer = document.getElementById("game-start");
const affScore = document.getElementById("score");
const affTimer = document.getElementById("timer");
const affRecord = document.getElementById("best");

const BONS = ["🎁", "🍰", "🥂", "💄", "👠", "💐", "🍫", "💎"];
const MAUVAIS = ["🥦", "⏰"];
const DUREE_JEU = 30;

let record = 0;
try { record = Number(localStorage.getItem("hono-record")) || 0; } catch { /* stockage indisponible */ }
affRecord.textContent = record;

let partie = null;

function bougerJoueur(e) {
  if (!partie) return;
  const rect = jeu.getBoundingClientRect();
  partie.joueurX = Math.max(20, Math.min(e.clientX - rect.left, rect.width - 20));
  joueur.style.left = `${partie.joueurX}px`;
}
jeu.addEventListener("pointermove", bougerJoueur);
jeu.addEventListener("pointerdown", bougerJoueur);

function scoreFlottant(texte, x, y, couleur) {
  const s = document.createElement("span");
  s.className = "floating-score";
  s.textContent = texte;
  s.style.left = `${x}px`;
  s.style.top = `${y}px`;
  s.style.color = couleur;
  jeu.appendChild(s);
  setTimeout(() => s.remove(), 800);
}

function demarrerJeu() {
  jeu.querySelectorAll(".item").forEach((el) => el.remove());
  partie = {
    score: 0,
    debut: performance.now(),
    precedent: performance.now(),
    prochainObjet: 0,
    joueurX: jeu.clientWidth / 2,
    objets: [],
  };
  joueur.style.left = `${partie.joueurX}px`;
  affScore.textContent = 0;
  ecranJeu.hidden = true;
  jeu.classList.add("playing");
  requestAnimationFrame(boucleJeu);
}

function boucleJeu(maintenant) {
  if (!partie) return;
  const dt = Math.min((maintenant - partie.precedent) / 1000, 0.05);
  partie.precedent = maintenant;
  const ecoule = (maintenant - partie.debut) / 1000;
  const restant = Math.max(0, DUREE_JEU - ecoule);
  affTimer.textContent = Math.ceil(restant);

  // Ça accélère au fil de la partie
  const vitesseBase = 160 + ecoule * 9;
  if (maintenant > partie.prochainObjet) {
    const mauvais = Math.random() < 0.25;
    const liste = mauvais ? MAUVAIS : BONS;
    const el = document.createElement("span");
    el.className = "item";
    el.textContent = liste[Math.floor(Math.random() * liste.length)];
    jeu.appendChild(el);
    partie.objets.push({ el, mauvais, x: aleatoire(10, jeu.clientWidth - 45), y: -40, v: vitesseBase * aleatoire(0.8, 1.3) });
    partie.prochainObjet = maintenant + aleatoire(350, 750) - ecoule * 8;
  }

  const hauteur = jeu.clientHeight;
  const joueurHaut = hauteur - 60;
  partie.objets = partie.objets.filter((o) => {
    o.y += o.v * dt;
    o.el.style.transform = `translate(${o.x}px, ${o.y}px)`;

    const centre = o.x + 18;
    if (o.y + 30 > joueurHaut && o.y < hauteur - 10 && Math.abs(centre - partie.joueurX) < 42) {
      partie.score = Math.max(0, partie.score + (o.mauvais ? -3 : 1));
      affScore.textContent = partie.score;
      scoreFlottant(o.mauvais ? "-3" : "+1", centre, joueurHaut - 30, o.mauvais ? "#3a1030" : "#ff4fa3");
      joueur.classList.remove("catch");
      void joueur.offsetWidth;
      joueur.classList.add("catch");
      o.el.remove();
      return false;
    }
    if (o.y > hauteur) {
      o.el.remove();
      return false;
    }
    return true;
  });

  if (restant <= 0) return finirJeu();
  requestAnimationFrame(boucleJeu);
}

function finirJeu() {
  const score = partie.score;
  partie = null;
  jeu.classList.remove("playing");
  jeu.querySelectorAll(".item").forEach((el) => el.remove());

  let texte;
  if (score >= 40) texte = `${score} points ! Reine incontestée 👑`;
  else if (score >= 25) texte = `${score} points, pas mal du tout 💅`;
  else if (score >= 10) texte = `${score} points… on s'entraîne encore ? 😅`;
  else texte = `${score} points. Les brocolis ont gagné 🥦`;

  if (score > record) {
    record = score;
    affRecord.textContent = record;
    try { localStorage.setItem("hono-record", record); } catch { /* stockage indisponible */ }
    texte += "\nNouveau record !";
    confettis();
  }
  messageJeu.innerText = texte;
  boutonJouer.textContent = "Rejouer 🔁";
  ecranJeu.hidden = false;
}

boutonJouer.addEventListener("click", demarrerJeu);

/* ----- Roue des cadeaux ----- */
const roue = document.getElementById("wheel");
const boutonRoue = document.getElementById("spin-btn");
const resultatRoue = document.getElementById("wheel-result");
const angleCase = 360 / CADEAUX_ROUE.length;
let rotationRoue = 0;

function dessinerRoue() {
  const ctx = roue.getContext("2d");
  ctx.clearRect(0, 0, roue.width, roue.height);
  const r = roue.width / 2;
  const couleursRoue = ["#ff4fa3", "#ffd84d", "#8b5cf6", "#7ce0c3"];
  const rad = (deg) => (deg * Math.PI) / 180;

  CADEAUX_ROUE.forEach((cadeau, i) => {
    const debut = rad(i * angleCase - 90);
    const fin = rad((i + 1) * angleCase - 90);
    ctx.beginPath();
    ctx.moveTo(r, r);
    ctx.arc(r, r, r, debut, fin);
    ctx.closePath();
    ctx.fillStyle = couleursRoue[i % couleursRoue.length];
    ctx.fill();
    ctx.strokeStyle = "#3a1030";
    ctx.lineWidth = 4;
    ctx.stroke();

    // Texte : un emoji + quelques mots le long du rayon
    ctx.save();
    ctx.translate(r, r);
    ctx.rotate((debut + fin) / 2);
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillStyle = i % couleursRoue.length === 0 || i % couleursRoue.length === 2 ? "#fff" : "#3a1030";
    ctx.font = "600 17px Fredoka, sans-serif";
    const mots = cadeau.length > 22 ? cadeau.slice(0, 20) + "…" : cadeau;
    ctx.fillText(mots, r - 16, 0);
    ctx.restore();
  });

  ctx.beginPath();
  ctx.arc(r, r, 30, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.stroke();
  ctx.font = "30px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🎁", r, r + 2);
}

dessinerRoue();
// Redessine quand la police est chargée pour avoir le bon rendu
document.fonts?.ready.then(dessinerRoue);

boutonRoue.addEventListener("click", () => {
  boutonRoue.disabled = true;
  resultatRoue.hidden = true;
  rotationRoue += 360 * 6 + aleatoire(0, 360);
  roue.style.transform = `rotate(${rotationRoue}deg)`;
});

roue.addEventListener("transitionend", () => {
  const angleEnHaut = (360 - (rotationRoue % 360)) % 360;
  const gagne = CADEAUX_ROUE[Math.floor(angleEnHaut / angleCase)];
  resultatRoue.textContent = `Tu gagnes : ${gagne} !`;
  resultatRoue.hidden = false;
  boutonRoue.disabled = false;
  boutonRoue.textContent = "Retenter (tricheuse) 🎡";
  confettis();
});

/* ----- Gâteau : une bougie magique qui se rallume ----- */
const zoneBougies = document.getElementById("candles");
const messageGateau = document.getElementById("cake-msg");
const indexMagique = Math.floor(Math.random() * NB_BOUGIES);
let magieUtilisee = false;

for (let i = 0; i < NB_BOUGIES; i++) {
  const bougie = document.createElement("button");
  bougie.className = "candle";
  bougie.setAttribute("aria-label", "Souffler la bougie");
  bougie.innerHTML = '<span class="flame"></span>';
  if (i === indexMagique) bougie.dataset.magique = "1";
  bougie.addEventListener("click", () => eteindre(bougie));
  zoneBougies.appendChild(bougie);
}

function eteindre(bougie) {
  if (bougie.classList.contains("out")) return;
  bougie.classList.add("out");

  if (bougie.dataset.magique && !magieUtilisee) {
    magieUtilisee = true;
    setTimeout(() => {
      bougie.classList.remove("out");
      messageGateau.textContent = "Hihi, bougie magique 😈 Souffle plus fort !";
      messageGateau.hidden = false;
    }, 900);
    return;
  }

  if (!zoneBougies.querySelector(".candle:not(.out)")) {
    arreterMicro();
    messageGateau.textContent = "Fais un vœu !! 🌟";
    messageGateau.hidden = false;
    pluieDeConfettis(3000);
  }
}

const boutonMicro = document.getElementById("mic-btn");
let flux = null;

boutonMicro.addEventListener("click", async () => {
  try {
    flux = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch {
    boutonMicro.textContent = "Micro indisponible, clique sur les flammes 😉";
    return;
  }
  boutonMicro.textContent = "Souffle maintenant !! 🌬️";

  const ctx = new AudioContext();
  const analyseur = ctx.createAnalyser();
  analyseur.fftSize = 512;
  ctx.createMediaStreamSource(flux).connect(analyseur);
  const donnees = new Uint8Array(analyseur.fftSize);
  let dernierSouffle = 0;

  (function ecouter() {
    if (!flux) return ctx.close();
    analyseur.getByteTimeDomainData(donnees);
    let somme = 0;
    for (const v of donnees) somme += ((v - 128) / 128) ** 2;
    const volume = Math.sqrt(somme / donnees.length);
    if (volume > 0.18 && performance.now() - dernierSouffle > 150) {
      dernierSouffle = performance.now();
      const allumee = zoneBougies.querySelector(".candle:not(.out)");
      if (allumee) eteindre(allumee);
    }
    requestAnimationFrame(ecouter);
  })();
});

function arreterMicro() {
  if (!flux) return;
  flux.getTracks().forEach((t) => t.stop());
  flux = null;
  boutonMicro.hidden = true;
}

/* ----- Carte à gratter ----- */
const carteGratter = document.getElementById("scratch-canvas");
const ctxGratter = carteGratter.getContext("2d");
let grattee = false;
let largeurCarte = 0;

function preparerCarte() {
  const rect = carteGratter.getBoundingClientRect();
  // Ne réinitialise pas la carte si seule la hauteur change (barre d'adresse mobile)
  if (grattee || rect.width === largeurCarte) return;
  largeurCarte = rect.width;
  const ratio = devicePixelRatio || 1;
  carteGratter.width = rect.width * ratio;
  carteGratter.height = rect.height * ratio;
  ctxGratter.setTransform(ratio, 0, 0, ratio, 0, 0);

  const degrade = ctxGratter.createLinearGradient(0, 0, rect.width, rect.height);
  degrade.addColorStop(0, "#ff9ccc");
  degrade.addColorStop(0.5, "#e9dcff");
  degrade.addColorStop(1, "#ffd84d");
  ctxGratter.globalCompositeOperation = "source-over";
  ctxGratter.fillStyle = degrade;
  ctxGratter.fillRect(0, 0, rect.width, rect.height);

  ctxGratter.font = "400 34px 'Bagel Fat One', sans-serif";
  ctxGratter.fillStyle = "#3a1030";
  ctxGratter.textAlign = "center";
  ctxGratter.textBaseline = "middle";
  ctxGratter.fillText("GRATTE-MOI ✨", rect.width / 2, rect.height / 2);
}

let gratte = false;
let pointsGrattes = 0;

function gratter(e) {
  if (!gratte || grattee) return;
  const rect = carteGratter.getBoundingClientRect();
  ctxGratter.globalCompositeOperation = "destination-out";
  ctxGratter.beginPath();
  ctxGratter.arc(e.clientX - rect.left, e.clientY - rect.top, 26, 0, Math.PI * 2);
  ctxGratter.fill();
  if (++pointsGrattes % 15 === 0) verifierGrattage();
}

function verifierGrattage() {
  const { data } = ctxGratter.getImageData(0, 0, carteGratter.width, carteGratter.height);
  let transparents = 0;
  for (let i = 3; i < data.length; i += 16) if (data[i] === 0) transparents++;
  if (transparents / (data.length / 16) > 0.5) {
    grattee = true;
    carteGratter.classList.add("done");
    pluieDeConfettis(2000);
  }
}

carteGratter.addEventListener("pointerdown", (e) => { gratte = true; gratter(e); });
carteGratter.addEventListener("pointermove", gratter);
addEventListener("pointerup", () => (gratte = false));

document.fonts?.ready.then(() => { largeurCarte = 0; preparerCarte(); });
preparerCarte();
addEventListener("resize", preparerCarte);

/* ----- Mode DIVA ----- */
const boutonDiva = document.getElementById("diva-btn");
let minuteurDiva = null;

boutonDiva.addEventListener("click", () => {
  const actif = document.body.classList.toggle("diva");
  boutonDiva.textContent = actif ? "🛑 Stop la fête" : "💃 Mode DIVA";
  clearInterval(minuteurDiva);
  if (actif) {
    confettis({ particleCount: 200, spread: 160, origin: { y: 0.3 } });
    minuteurDiva = setInterval(() => {
      confettis({ particleCount: 40, spread: 120, origin: { x: Math.random(), y: 0.1 }, shapes: ["star"] });
    }, 700);
  }
});

/* ----- Partage ----- */
const messagePartage = document.getElementById("share-msg");

document.getElementById("share-btn").addEventListener("click", async () => {
  const donnees = { title: document.title, text: "Viens fêter l'anniv d'Honorine et battre son record 🎉", url: location.href };
  if (navigator.share) {
    try { await navigator.share(donnees); } catch { /* partage annulé */ }
    return;
  }
  try {
    await navigator.clipboard.writeText(location.href);
    messagePartage.hidden = false;
    setTimeout(() => (messagePartage.hidden = true), 2500);
  } catch { /* presse-papiers indisponible */ }
});
