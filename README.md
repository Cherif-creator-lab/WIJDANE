# 🎓 Générateur & Éditeur de Présentation PPT — Soutenance Wijdane & Salma

Application web complète développée avec **Next.js 15**, **Tailwind CSS**, **Anthropic Claude API** (relais MiraiAPI) et **PptxGenJS**.

Conçue spécifiquement pour la préparation, la répartition orale et la génération automatique de présentations PowerPoint professionnelles pour les soutenances de fin d'études (PFE, Master, Licence, Ingénieur).

---

## ✨ Fonctionnalités

1. **Génération intelligente avec Claude :**
   - Structure académique complète (Contexte, Problématique, Objectifs, Architecture, Réalisations, Métriques, Perspectives).
   - Alternance des tours de parole entre **Wijdane** et **Salma**.
   - Notes d'orateur détaillées générées pour chaque slide (discours oral à prononcer devant le jury).
2. **Éditeur interactif en direct :**
   - Prévisualisation fidèle au format 16:9 avec plusieurs thèmes visuels (Bleu Académique, Émeraude, Ardoise, Violet).
   - Modification en temps réel des titres, sous-titres, points clés, orateurs et notes.
   - Assistant Claude intégré pour chaque slide ("Raccourcir", "Détailler", "Adapter pour Salma", "Adapter pour Wijdane").
3. **Export PowerPoint `.pptx` direct :**
   - Téléchargement instantané en 1 clic d'un fichier `.pptx` 100% compatible avec Microsoft PowerPoint, Google Slides, Keynote et LibreOffice.
4. **Sécurité :**
   - Vos clés privées restent dans `.env.local` et ne sont jamais poussées sur GitHub.

---

## 🚀 Déploiement sur GitHub & Vercel

### Étape 1 : Créer le dépôt sur GitHub et pousser le code

1. Allez sur [github.com/new](https://github.com/new) et créez un nouveau dépôt (ex: `ppt-soutenance-wijdane-salma`).
2. Dans le terminal de votre projet, exécutez :

```bash
git remote add origin https://github.com/VOTRE_NOM_UTILISATEUR/ppt-soutenance-wijdane-salma.git
git push -u origin main
```

### Étape 2 : Déployer sur Vercel

1. Rendez-vous sur [vercel.com](https://vercel.com) et connectez votre compte GitHub.
2. Cliquez sur **"Add New..."** > **"Project"** puis importez le dépôt `ppt-soutenance-wijdane-salma`.
3. Dans la section **Environment Variables**, ajoutez :
   - `ANTHROPIC_BASE_URL` = `https://api.miraiapi.com/v1`
   - `ANTHROPIC_API_KEY` = `sk-XprZK2vvDS4ZENowET9I5SLl7Tlu4fYEkD9kVWaPsPn9EbvK`
   - `ANTHROPIC_MODEL` = `claude-sonnet-5.5`
4. Cliquez sur **"Deploy"**. Votre site sera en ligne en moins d'une minute !

---

## 💻 Lancer en local

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.
