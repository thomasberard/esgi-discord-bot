
# 🤖 Agent ESGI

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/)
[![Node.js](https://img.shields.io/badge/node-%3E=18.x-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-lightgrey.svg)](LICENSE)

**Agent ESGI** est un bot Discord développé pour automatiser la gestion des promotions et des rôles étudiants du serveur **ESGI Grenoble**, tout en facilitant les échanges entre étudiants, délégués, intervenants et administration.

---

## ✨ Fonctionnalités principales

- 🏓 `!ping` — Vérifie la réactivité du bot
- 🔍 `!simulation-changement-annee` — Simule le passage des étudiants d'une année à l'autre **sans modifier les rôles**
- ✅ `!changement-annee` — Lance la **mise à jour réelle** des rôles avec confirmation manuelle
- 📁 Génération automatique d'un **fichier `.csv`** des transitions
- 🔄 Rotation de statuts toutes les 10 secondes à partir d’un fichier `status.txt`

---

## 🗂️ Arborescence du projet

```
esgi-discord-bot/
├── commands/
│   ├── ping.js
│   ├── changement-année.js
│   └── simulation-changement-annee.js
├── status.txt
├── .env
├── .gitignore
├── index.js
├── package.json
├── README.md
```

---

## 🚀 Installation

1. Cloner le projet :

```bash
git clone https://github.com/thomasberard/esgi-discord-bot.git
cd esgi-discord-bot
```

2. Installer les dépendances :

```bash
npm install
```

3. Créer le fichier `.env` :

```
DISCORD_TOKEN=VOTRE_TOKEN
ADMIN_ID=VOTRE_ID_DISCORD
```

4. Lancer le bot :

```bash
npm start
```

---

## 🎯 Exemple de statuts (`status.txt`)

```
💬 Je veille sur vos discussions
🎓 ESGI Grenoble, c’est nous
🍕 Pas de pizza sans délégué
🧑‍🏫 Plus ponctuel que vos soutenances
🔍 Toujours dans vos canaux
```

---

## 📦 Technologies

- [discord.js](https://discord.js.org/)
- [dotenv](https://www.npmjs.com/package/dotenv)
- Node.js ≥ 18

---

## 👤 Auteur

[![LinkedIn](https://img.shields.io/badge/-Thomas%20BERARD-blue?style=flat&logo=linkedin)](https://www.linkedin.com/in/berardthomas/)  
💼 [Site Web](https://thomasberard.com)  
💬 [Rejoindre le Discord ESGI Grenoble](https://discord.gg/ton-invitation)

---

## ⚖️ Licence

Ce projet est sous licence MIT — vous êtes libre de le réutiliser ou de l'adapter.
