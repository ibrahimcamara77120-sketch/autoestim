# Bilan de projet — AutoEstim

**Auteur :** Camara Ibrahim — N° candidat 2545812845
**École :** Digital School of Paris – IEF2I
**Date :** Avril 2026

---

## 1. Rappel du projet

AutoEstim est un estimateur de prix de revente automobile développé dans le cadre de l'épreuve E6 du BTS SIO option SLAM. L'application permet à tout particulier d'estimer la valeur marchande de son véhicule d'occasion sur le marché français, en tenant compte de nombreux critères : marque, modèle, carburant, boîte, kilométrage, couleur, options et historique.

**URL de production :** https://autoestim.vercel.app

---

## 2. Objectifs atteints

| Objectif initial | Résultat |
|-----------------|----------|
| Application web fonctionnelle accessible en ligne | ✅ Déployée sur Vercel |
| Architecture full-stack (Frontend + API + BDD) | ✅ 3 couches distinctes |
| Base de données relationnelle PostgreSQL | ✅ 6 tables, Neon cloud |
| Couvrir les principales marques/modèles | ✅ 28 marques, 200+ modèles |
| Algorithme de dépréciation réaliste | ✅ Validation sur cas réels |
| Filtres avancés inspirés du marché professionnel | ✅ Carburant, boîte, couleur, options, historique |
| Interface responsive dark mode | ✅ Mobile + Desktop |
| Documentation complète pour l'E6 | ✅ CDC, architecture, UML, MCD/MLD, tests, bilan |

---

## 3. Ce que j'ai appris

### Compétences techniques acquises

**Architecture et développement :**
- Concevoir et implémenter une architecture 3-tiers (Frontend → API REST → BDD)
- Créer des Serverless Functions Node.js déployées sur Vercel
- Utiliser le SDK `@neondatabase/serverless` pour interroger PostgreSQL depuis le cloud
- Gérer la sécurité SQL (requêtes paramétrées, injection SQL)
- Implémenter un mode dégradé (fallback) pour la résilience

**Base de données :**
- Modéliser une base relationnelle avec 6 tables (Merise : MCD → MLD → MPD)
- Écrire des requêtes SQL complexes avec JOIN, GROUP BY
- Gérer les contraintes d'intégrité (FK, UNIQUE, CHECK)
- Déployer et peupler une base PostgreSQL cloud

**Algorithmique :**
- Implémenter un algorithme de dépréciation exponentielle
- Calibrer des modificateurs (carburant, couleur, etc.) sur des données réelles du marché

**Méthode :**
- Rédiger un cahier des charges complet (contexte, objectifs, périmètre, planning)
- Produire des diagrammes UML (cas d'utilisation, séquence, classes)
- Réaliser un plan de tests exhaustif (49 cas de tests)
- Documenter une API REST

---

## 4. Difficultés rencontrées et solutions

| Difficulté | Solution apportée |
|-----------|------------------|
| `@vercel/postgres` déprécié → `fetch failed` | Migration vers `@neondatabase/serverless` + utilisation de l'URL directe (non-pooler) pour les scripts locaux |
| Chips carburant dynamiques par modèle | Stockage du champ `carburants` (CSV) dans la table `modeles`, parsing en JS côté frontend |
| Mode dégradé si API indisponible | FALLBACK local avec les 28 marques/200+ modèles intégré dans `index.html` |
| Paramètre `channel_binding=require` incompatible Node.js local | Utilisation de `DATABASE_URL_UNPOOLED` sans `channel_binding` pour `init-db.js` |
| Affichage détaillé du calcul (breakdown) | Calcul par étapes successives avec mémorisation des valeurs intermédiaires |

---

## 5. Ce qui aurait pu être amélioré

| Point d'amélioration | Raison de la non-implémentation |
|---------------------|-------------------------------|
| Authentification utilisateur | Hors périmètre du projet léger, complexité trop élevée |
| Export PDF des résultats | Nécessite une bibliothèque supplémentaire (jsPDF) |
| Comparaison de plusieurs véhicules | Refonte UI importante, hors périmètre |
| Mise à jour automatique des prix marché | Nécessiterait un partenariat avec des APIs payantes (Argus, LaCentrale) |
| Tests unitaires automatisés | Jest ou Vitest — prévu pour une v3 |

---

## 6. Retour d'expérience

Ce projet m'a permis de réaliser pour la première fois une application **full-stack cloud complète**, de la conception à la mise en production. La principale valeur ajoutée de ce projet est d'avoir été confronté à des problèmes concrets :

- La dépréciation d'une librairie en cours de projet (m'a obligé à migrer et comprendre les différences entre SDK)
- La gestion de la connexion à une base distante depuis un environnement local (pooler vs non-pooler)
- La conception d'une base de données évolutive (ajout de la colonne `carburants` sans casser les données existantes)

Le projet est **opérationnel, documenté et déployé**, ce qui correspond aux attentes d'un projet professionnel réel.

---

## 7. Perspectives d'évolution

- **v3.0** : Authentification utilisateur (JWT), tableau de bord avec historique personnel
- **v3.1** : Export PDF de l'estimation avec détail du calcul
- **v3.2** : Comparaison simultanée de 2 véhicules
- **v3.3** : Alimentation automatique de `historique_prix_marche` via un scraping autorisé ou partenariat API
- **v4.0** : Application mobile (PWA ou React Native)

---

## 8. Récapitulatif du projet

| Indicateur | Valeur |
|-----------|--------|
| Durée de développement | ~26 heures |
| Lignes de code (index.html) | ~1 400 lignes |
| Lignes de code (API) | ~120 lignes |
| Marques couvertes | 28 |
| Modèles couverts | 200+ |
| Tables en base de données | 6 |
| Endpoints API | 3 (5 routes) |
| Cas de tests | 49 (100% réussis) |
| URL publique | https://autoestim.vercel.app |
| Coût total du projet | 0 € (Vercel Free + Neon Free) |
