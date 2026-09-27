# Administration partagée du chat Blockhaus

## Principe

Chaque administrateur du forum peut recevoir le rôle `admin` dans la webapp. Tous disposent alors des mêmes commandes pour :

- valider, désactiver ou réactiver un membre ;
- attribuer les rôles membre, modérateur ou administrateur ;
- créer, renommer et archiver les salons officiels ;
- ajouter ou retirer des membres dans les salons officiels ;
- accéder aux outils de modération.

Chaque modification administrative est inscrite dans un journal avec l’administrateur, la cible, l’action et l’heure. Le dernier administrateur actif ne peut pas retirer ses propres droits ni être supprimé sans qu’un autre administrateur reste en place.

Les administrateurs ne peuvent pas lire une discussion privée s’ils n’en sont pas participants. Cette séparation évite de transformer les droits techniques en droit de lecture des échanges personnels.

## Trois niveaux d’accès

### Administration Forumactif

Permet d’installer, modifier ou retirer le widget sur le forum.

### Administration de la webapp

Le rôle `admin` stocké dans Supabase donne accès à la gestion quotidienne des membres et salons. Il doit être attribué à chaque administrateur Forumactif validé.

### Maintenance technique

Pour modifier le code, les administrateurs concernés doivent être ajoutés individuellement :

- comme collaborateurs du dépôt GitHub ;
- comme membres du projet ou de l’organisation Supabase.

Il ne faut pas partager un mot de passe commun ni la clé `service_role`. Chaque administrateur utilise son propre compte afin de pouvoir retirer un accès sans changer les accès de tout le monde.

## Mise en service

1. Créer le projet Supabase dans une organisation Blockhaus.
2. Inviter tous les administrateurs officiels avec leur propre adresse e-mail.
3. Leur faire créer un compte dans la webapp.
4. Attribuer à chacun `approved = true` et `role = 'admin'`.
5. Inviter les mainteneurs du code dans GitHub.
6. Vérifier qu’un administrateur peut créer un salon mais ne peut pas lire une discussion privée extérieure.

## Départ d’un administrateur

Le même jour :

1. passer son rôle webapp à `member` ou désactiver son profil ;
2. retirer son accès Supabase ;
3. retirer son accès GitHub ;
4. vérifier ses accès Forumactif ;
5. contrôler le journal des changements récents.
