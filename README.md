# KittyTasks - Frontend (Angular 19)

Ce dépôt contient le code source de l'interface utilisateur de **KittyTasks**, une application moderne de gestion de tâches. Ce projet a été validé dans le cadre de l'obtention du titre RNCP 6.

## Technologies & Architecture

* **Framework** : Angular 19
* **Architecture** : Organisation propre via le système de `NgModule`.
* **Design & UX** : Maquettes **Figma**, intégration *Responsive* avec **Tailwind CSS** et **CSS3**.
* **Communication API** : Consommation de l'API RESTful via `HttpClient` (gestion dynamique via `environment.ts`).

---

## Captures d'écran (Screenshots)

<div align="center">
  <img src="https://github.com/user-attachments/assets/d55f32f8-2d83-44b1-922c-0a5385b7f8df" alt="Dashboard" width="85%" />
  <p><em>Tableau de bord principal</em></p>
  <br>
  <img src="https://github.com/user-attachments/assets/34933bdf-2194-44d0-94ff-8286e478d619" alt="Login" width="85%" />
  <p><em>Page de connexion (Login)</em></p>
</div>

---

## Configuration & Déploiement

### Prérequis
* **Node.js** (version 18+)
* **Angular CLI** (`npm install -g @angular/cli`)

### Guide d'exécution

```bash
# =========================================================================
# EN PRODUCTION (Cloud Architecture)
# =========================================================================
# Application déployée en continu sur Netlify.
# -> Chaque 'git push' déclenche automatiquement le build de production (ng build).
# -> Le frontend consomme l'API de production configurée dans environment.prod.ts.


# =========================================================================
# EN LOCAL (Développement et Tests)
# =========================================================================

# 1. Cloner ce dépôt et accéder au dossier :
git clone [https://github.com/copeihsinoc/planit.git](https://github.com/copeihsinoc/planit.git)
cd planit

# 2. Installer les dépendances du projet (Étape indispensable !) :
npm install

# 3. Lancer le serveur de développement local :
ng serve

# Le projet est accessible en local sur : http://localhost:4200
# L'application bascule automatiquement sur l'API locale (localhost:8080) via environment.ts.
