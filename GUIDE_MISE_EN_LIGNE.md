# 🚀 Guide de mise en ligne — MFC Coaching App

---

## VUE D'ENSEMBLE

```
Votre app React  →  GitHub  →  Vercel  →  Lien public
                                    ↓
                               Supabase (base de données + login)
```

Temps estimé : **45–60 minutes** pour tout mettre en ligne.

---

## ÉTAPE 1 — Installer les outils sur votre ordinateur

> ⚠️ Cette étape se fait sur un **ordinateur** (Mac ou Windows), pas sur votre téléphone.

### 1A — Installer Node.js
1. Allez sur → **https://nodejs.org**
2. Téléchargez la version **LTS** (bouton vert)
3. Installez-le (suivez l'assistant, tout par défaut)
4. Vérifiez : ouvrez le Terminal et tapez `node --version` → vous devriez voir `v20.x.x`

### 1B — Installer Git
1. Allez sur → **https://git-scm.com/downloads**
2. Téléchargez et installez (tout par défaut)
3. Vérifiez : dans le Terminal, tapez `git --version`

---

## ÉTAPE 2 — Créer le projet sur votre ordinateur

### 2A — Télécharger les fichiers du projet
Téléchargez le fichier **mfc-app.zip** fourni avec ce guide et décompressez-le sur votre bureau.

Vous devriez avoir ce dossier :
```
mfc-app/
  ├── package.json
  ├── public/
  │   └── index.html
  └── src/
      ├── index.js
      └── App.jsx       ← votre application
```

### 2B — Ouvrir le Terminal dans ce dossier
- **Mac** : clic droit sur le dossier `mfc-app` → "Nouveau terminal au dossier"
- **Windows** : ouvrez le dossier, clic droit → "Ouvrir dans le Terminal"

### 2C — Installer les dépendances
Dans le Terminal, tapez :
```bash
npm install
```
⏳ Attendez 1–2 minutes. Vous verrez beaucoup de texte défiler, c'est normal.

### 2D — Tester l'app en local
```bash
npm start
```
Votre navigateur s'ouvre automatiquement sur **http://localhost:3000**
Vous devriez voir votre app MFC fonctionner ! ✅

---

## ÉTAPE 3 — Mettre le projet sur GitHub

### 3A — Créer un nouveau repository GitHub
1. Connectez-vous sur **https://github.com**
2. Cliquez sur **"New"** (bouton vert)
3. Nom du repo : `mfc-coaching-app`
4. Laissez tout le reste par défaut
5. Cliquez **"Create repository"**

### 3B — Envoyer votre code sur GitHub
Dans le Terminal (dans le dossier mfc-app), tapez ces commandes **une par une** :

```bash
git init
git add .
git commit -m "MFC Coaching App - initial version"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/mfc-coaching-app.git
git push -u origin main
```

> 🔁 Remplacez `VOTRE_USERNAME` par votre nom d'utilisateur GitHub

GitHub va vous demander vos identifiants → entrez votre email et mot de passe GitHub.

Rafraîchissez la page GitHub → vous devriez voir vos fichiers apparaître ✅

---

## ÉTAPE 4 — Déployer sur Vercel

### 4A — Connecter Vercel à GitHub
1. Allez sur **https://vercel.com**
2. Cliquez **"Sign Up"** → **"Continue with GitHub"**
3. Autorisez Vercel à accéder à vos repos GitHub

### 4B — Importer votre projet
1. Sur le dashboard Vercel, cliquez **"Add New Project"**
2. Trouvez `mfc-coaching-app` dans la liste → cliquez **"Import"**
3. Framework : sélectionnez **"Create React App"**
4. Laissez tout le reste par défaut
5. Cliquez **"Deploy"**

⏳ Attendez 1–2 minutes...

🎉 Vercel vous donne un lien du type :
**`https://mfc-coaching-app.vercel.app`**

**Votre app est en ligne !** Partagez ce lien avec vos clients.

---

## ÉTAPE 5 — Configurer Supabase (base de données réelle)

> Cette étape permet d'avoir de vrais comptes clients, des vrais programmes sauvegardés, etc.
> Je vous guide séparément pour cette partie — elle nécessite de modifier le code.

### 5A — Créer votre projet Supabase
1. Allez sur **https://supabase.com**
2. **"Start your project"** → connectez-vous avec GitHub
3. **"New Project"**
4. Remplissez :
   - **Name** : `mfc-coaching`
   - **Database Password** : créez un mot de passe fort (notez-le !)
   - **Region** : choisissez la plus proche (ex. East US)
5. Cliquez **"Create new project"** → attendez 2 minutes

### 5B — Récupérer vos clés API
1. Dans Supabase, allez dans **Settings → API**
2. Copiez :
   - **Project URL** (ex. `https://xxxxx.supabase.co`)
   - **anon public key** (longue chaîne de caractères)
3. **Gardez ces deux valeurs** → on en aura besoin pour l'étape suivante

### 5C — Dites-moi que vous êtes prêt
Une fois que vous avez vos clés Supabase, revenez me voir et je mets à jour le code pour connecter la vraie base de données.

---

## RÉCAPITULATIF DES LIENS IMPORTANTS

| Service | URL | Votre lien |
|---------|-----|-----------|
| GitHub | github.com | github.com/VOTRE_USERNAME/mfc-coaching-app |
| Vercel (app) | vercel.com | mfc-coaching-app.vercel.app |
| Supabase | supabase.com | À configurer |

---

## EN CAS DE PROBLÈME

**npm install échoue** → Vérifiez que Node.js est bien installé (`node --version`)

**git push demande un token** → Sur GitHub : Settings → Developer Settings → Personal Access Tokens → Tokens (classic) → Generate new token → cochez "repo" → utilisez ce token comme mot de passe

**Vercel build échoue** → Envoyez-moi le message d'erreur, je corrige le code

---

*Guide créé pour MFC Coaching App — Claude AI*
