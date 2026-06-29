# Living Shops

Module Foundry VTT v14 expérimental pour créer des marchands vivants avec stocks pondérés.

## Installation pour test via GitHub

1. Crée un dépôt public nommé `living-shops`.
2. Mets tous les fichiers de ce dossier à la racine du dépôt.
3. Dans `module.json`, remplace `YOUR_GITHUB_USERNAME` par ton nom GitHub.
4. Dans Foundry, installe le module avec cette Manifest URL :

```text
https://raw.githubusercontent.com/LeoFourthon/living-shops/main/module.json
```

## Important

Pour le test initial, le champ `download` pointe vers l'archive automatique de la branche `main` :

```text
https://github.com/LeoFourthon/living-shops/archive/refs/heads/main.zip
```

Cela évite d'avoir besoin de créer une Release GitHub dès le début.

## Test v0.1.0

Après activation du module dans ton monde :

1. Va dans Configure Settings > Module Settings > Living Shops.
2. Clique sur `Initialiser / réparer le monde`.
3. Vérifie que les acteurs `LS - Forgeron`, `LS - Aubergiste`, `LS - Alchimiste`, `LS - Magasin général` existent.
4. Vérifie que les tables `LS - Stock - ...` existent.
5. Vérifie que chaque acteur a des items dans son inventaire.

Tu peux aussi lancer dans la console Foundry :

```js
game.livingShops.setupWorld()
game.livingShops.refreshAllMerchants()
```
