// POUR PUBLIER UNE MISE À JOUR : changez VERSION (et ajoutez une ligne au CHANGELOG) ici, puis republiez tous les fichiers.
// C'est le seul endroit à modifier : l'appli lit son numéro de version depuis ce fichier.
const VERSION='1.2.0';
const CHANGELOG=[
  '1.2.0 : optimisation Android (bouton retour, bouton +, balayage, vignettes, sauvegarde ZIP lisible, hors-ligne complet)',
  '1.1.0 : champ Lieu sur les entrées',
  '1.0.0 : première version'
];
const CACHE='pdc-'+VERSION;
const FILES=['./','index.html','manifest.webmanifest','jszip.min.js','icon-192.png','icon-512.png','icon-maskable-512.png'];

self.addEventListener('install',e=>{
  e.waitUntil(
    caches.open(CACHE)
      .then(c=>Promise.all(FILES.map(f=>fetch(new Request(f,{cache:'reload'})).then(r=>{if(!r.ok)throw new Error(f);return c.put(f,r)}))))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys()
      .then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET')return;
  e.respondWith(
    caches.match(r,{ignoreSearch:true}).then(hit=>hit||fetch(r).catch(()=>r.mode==='navigate'?caches.match('index.html'):Response.error()))
  );
});

self.addEventListener('message',e=>{
  if(e.data==='info'&&e.ports[0])e.ports[0].postMessage({v:VERSION,log:CHANGELOG});
});
