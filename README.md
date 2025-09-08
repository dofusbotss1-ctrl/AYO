# VoyagePro - Agence de Voyage

Une application web moderne pour une agence de voyage construite avec React, TypeScript, Tailwind CSS et Firebase.

## 🌟 Fonctionnalités

- **Catalogue de voyages** avec filtres et recherche
- **Gestion des catégories** de voyages
- **Système de réservation** avec panier
- **Interface d'administration** complète
- **Gestion des messages** clients
- **Dates disponibles** pour chaque voyage
- **Design responsive** et moderne

## 🚀 Technologies utilisées

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Firebase (Firestore, Auth)
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Build**: Vite

## 📦 Installation

1. Clonez le repository
```bash
git clone <votre-repo>
cd voyagepro
```

2. Installez les dépendances
```bash
npm install
```

3. Configurez Firebase
```bash
cp .env.example .env
```
Remplissez les variables d'environnement Firebase dans le fichier `.env`

4. Lancez l'application
```bash
npm run dev
```

## 🔧 Configuration Firebase

1. Créez un projet Firebase sur [console.firebase.google.com](https://console.firebase.google.com)
2. Activez Firestore Database
3. Activez Authentication (optionnel)
4. Copiez la configuration dans votre fichier `.env`

## 🌐 Déploiement sur Netlify

### Méthode 1: Déploiement automatique via Git

1. Connectez votre repository GitHub à Netlify
2. Configurez les paramètres de build:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Ajoutez vos variables d'environnement Firebase dans Netlify
4. Déployez !

### Méthode 2: Déploiement manuel

1. Buildez l'application
```bash
npm run build
```

2. Déployez le dossier `dist` sur Netlify

## 🔐 Administration

- **URL**: `/admin`
- **Identifiants par défaut**: 
  - Username: `rahma`
  - Password: `121118`

Vous pouvez modifier ces identifiants dans les paramètres de l'administration.

## 📱 Pages principales

- **Accueil** (`/`) - Page d'accueil avec voyages vedettes
- **Voyages** (`/trips`) - Catalogue complet des voyages
- **Détail voyage** (`/trip/:id`) - Page détaillée d'un voyage
- **Contact** (`/contact`) - Formulaire de contact
- **Panier** (`/cart`) - Panier de réservation
- **Administration** (`/admin`) - Interface d'administration

## 🎨 Personnalisation

L'application utilise Tailwind CSS pour le styling. Vous pouvez personnaliser:

- **Couleurs** dans `tailwind.config.js`
- **Composants** dans le dossier `src/components`
- **Pages** dans le dossier `src/pages`

## 📄 Licence

Ce projet est sous licence MIT.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📞 Support

Pour toute question, contactez-nous à: contact@voyagepro.ma