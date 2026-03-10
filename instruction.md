# Voici les consignes de l'exercices 

Créer une application React avec authentification, CRUD pour clients/produits/commandes, et un dashboard analytique. Vous devrez montrer une application déployée (qui ne fonctionne pas à travers VSC)

Authentification : Page de login (/login) avec email/mot de passe. 2 rôles : admin (gestion des utilisateurs) et user (CRUD clients/produits/commandes). Protection des routes (ex: /admin accessible uniquement aux admins).

Gestion des données : Clients : Liste, ajout, modification, suppression, commandes du client; Produits : Liste avec prix, stock, catégorie; Commandes : Création (client + produits), statut ("en cours"/"livrée").

Dashboard (/) : Nombre total de clients, commandes, et produits avec un lien correspondant (carte client accède à la liste des clients, la carte commandes à la liste des commandes, …)

Fonctions admin (/admin/users) : Liste des utilisateurs, ajout/suppression, modification des rôles.

API Utiliser JSONPlaceholder pour les utilisateurs (endpoint /users) et un fichier JSON local (ou une base de données) pour clients/produits/commandes.
 

Vous aurez la première moitié du prochain cours pour peaufiner et tester votre application.

## Ce que j'ai deja fait
Tu peux voir dans l'aborescence je me suis deja occupé d'une partie de l'authentification, j'ai fait une api qui permet de s'authentifier et recuperer une bearer token, il faudrait que tu l'utilise pour faire les authentifications depuis la page

Suit ma maniere de developper, par exemple tu peux voir j'ai fait une types/Product.tsx et une fonction createProduct dans database.ts donc fait en sorte de suivre ma maniere de codé, 

Fait en sorte que le code soit simple et concis, pas besoin de faire de choses très compliqué, assure toi de ne pas me fournir du code infonctionnel

## Ma stack 
! Ne surtout pas changer la stack, tu peux installer des packet mais pas en supprimer et pas changer d'engine
j'utilise bun et rien d'autre, aucunemet npm, node ou quoi que ce soit uniquement bun

- bun
- biome
- nexti.js

## Style

Fait moi une style simple pas très poussé, n'utilise pas d'emojis

## Informations supplementaire
si tu es pas certains n'hesite pas a me poser des questions je te donnerai ce que t'auras bsn 
