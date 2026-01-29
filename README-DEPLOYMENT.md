# S@mSystem - Site avec formulaire Cloudflare

## 📋 Instructions de déploiement

### Structure des fichiers à mettre sur GitHub :

```
sam-system/home/
├── index.html
├── contact.html
├── merci.html
├── style.css
├── functions/
│   └── api/
│       └── contact.js
└── (tes images .png et .jpg)
```

### 🚀 Étapes pour déployer :

1. **Créer le dossier `functions/api/` dans ton dépôt GitHub**
   - Crée un nouveau dossier nommé `functions`
   - À l'intérieur, crée un dossier `api`
   - Place le fichier `contact.js` dedans

2. **Remplacer les fichiers sur GitHub :**
   - `contact.html` (version sans Formspree)
   - `index.html` (liens mis à jour)
   - `merci.html` (URL relative)

3. **Commit et push sur GitHub :**
   ```bash
   git add .
   git commit -m "Migration vers Cloudflare Functions"
   git push origin main
   ```

4. **Cloudflare déploie automatiquement** 🎉
   - Cloudflare détecte les changements
   - Le site se met à jour en 1-2 minutes
   - Ton formulaire fonctionne sans Formspree !

### ✅ Changements effectués :

- ✅ **Formspree retiré** du formulaire
- ✅ **Cloudflare Function** créée pour traiter les formulaires
- ✅ **Envoi d'emails gratuit** via MailChannels (intégré à Cloudflare)
- ✅ **Tout ton texte et style CSS** conservés à l'identique
- ✅ **URLs mises à jour** pour fonctionner sur Cloudflare Pages

### 📧 Réception des emails :

Les messages du formulaire seront envoyés à : **samsystem.contact@gmail.com**

### ⚙️ Comment ça fonctionne :

1. L'utilisateur remplit le formulaire sur `contact.html`
2. Le JavaScript envoie les données à `/api/contact`
3. La Cloudflare Function (`functions/api/contact.js`) traite la demande
4. Un email est envoyé via MailChannels à ton adresse Gmail
5. L'utilisateur est redirigé vers `merci.html`

### 🔧 Si besoin de personnaliser :

- Pour changer l'email de destination : édite `functions/api/contact.js` ligne 39
- Pour changer le message de remerciement : édite `merci.html`

---

**Note :** MailChannels est gratuit et intégré avec Cloudflare Workers. Aucune configuration supplémentaire n'est nécessaire ! 🎉
