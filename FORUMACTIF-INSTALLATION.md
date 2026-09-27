# Implantation de la ChatBox V10 dans Forumactif

## Comportement

- Sur ordinateur, un bouton `Chat DY10` reste en bas à droite pendant la navigation sur le forum.
- Le bouton ouvre un widget compact inspiré de Messenger/Facebook.
- Le bouton d’agrandissement ouvre la ChatBox en plein écran avec une disposition inspirée de Discord.
- Sur téléphone, le widget occupe tout l’écran et conserve l’ergonomie mobile de la V9.
- Les messages restent envoyés par la ChatBox Forumactif : cette première implantation ne migre ni ne copie les messages.

## Limite temporaire

La version gratuite de Forumactif fournit un seul vrai salon. `Général` fonctionne réellement. Intermix, Transmission, Set/30’ et Archives apparaissent dans la vue ordinateur comme arborescence cible, mais seront activés uniquement après le branchement du backend Supabase.

## Installation active sur le forum

Forumactif traite la ChatBox comme un emplacement séparé. Deux entrées actives sont donc nécessaires dans `Modules > HTML & JAVASCRIPT > Gestion des codes Javascript` :

- `Interface ChatBox Blockhaus V10` — placement `Sur toutes les pages` ;
- `Interface ChatBox Desktop V10` — placement `Sur la ChatBox`.

Les deux entrées chargent le même fichier :

```javascript
(function () {
  var script = document.createElement('script');
  script.src = 'https://theus-ername.github.io/blockhaus-dy10-app-test/blockhaus-chatbox-widget.js?v=11&build=c61c133';
  script.async = true;
  document.head.appendChild(script);
})();
```

Le fichier principal reste ainsi modifiable dans le dépôt GitHub par les administrateurs autorisés.

## Retour arrière

Pour restaurer immédiatement l’ancienne ChatBox :

1. désactiver les deux codes JavaScript V10 dans Forumactif ;
2. vider le cache du navigateur ou recharger la page sans cache ;
3. vérifier que l’entrée native « Rejoindre le Chat » est de nouveau visible.

Ne pas désactiver `Connexion automatique ChatBox` : ce script existant reste indépendant de l’interface V10.

Le script masque uniquement l’ancien bloc dans le navigateur. Il ne supprime aucune donnée ni aucun message Forumactif.
