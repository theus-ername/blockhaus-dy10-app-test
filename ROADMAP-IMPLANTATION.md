# Roadmap d’implantation — Chat Blockhaus

## Objectif

Remplacer progressivement l’interface de la ChatBox par une webapp mobile intégrée au forum, avec salons et discussions privées sécurisées, tout en conservant Forumactif pour les discussions longues et les archives.

## Phase 1 — Preuve de fonctionnement

Statut : **validée**

- [x] Interface mobile Blockhaus
- [x] Création d’une discussion privée
- [x] Invitation par lien
- [x] Échange en temps réel entre deux téléphones
- [x] Test sur le même réseau Wi-Fi

## Phase 2 — Fondation permanente et sécurisée

Statut : **préparée dans le dépôt**

- [x] Modèle de données : profils, rooms, membres, messages et invitations
- [x] Règles RLS : une room privée n’est lisible que par ses participants
- [x] Fonctions sécurisées de création et de jonction par invitation
- [x] Invitations révocables et limitées dans le temps
- [x] Préparation des messages temps réel
- [x] Adaptateur webapp prêt à basculer vers Supabase
- [x] Administration partagée prévue pour tous les administrateurs Forumactif
- [x] Confidentialité maintenue : un admin extérieur à une discussion privée ne peut pas la lire
- [x] Journal des modifications administratives et protection du dernier compte admin
- [ ] Créer le projet Supabase Blockhaus
- [ ] Exécuter la migration SQL
- [ ] Brancher l’URL et la clé publique du projet

Critère de validation : deux téléphones situés sur des réseaux différents échangent des messages persistants sans que le Mac reste allumé.

## Phase 3 — Comptes des membres

- [x] Écran et code de connexion par lien magique préparés
- [x] Blocage automatique d’un compte en attente de validation
- [ ] Tester l’envoi réel des liens magiques
- [ ] Tester la validation manuelle d’un nouveau membre
- [ ] Pseudonyme Forumactif associé au profil
- [x] Rôles membre, modérateur et administrateur préparés dans la base
- [x] Première interface visuelle de validation, rôles et désactivation des membres
- [ ] Interface avancée pour renommer et archiver les salons
- [ ] Refus d’accès immédiat pour un compte désactivé

Critère de validation : un troisième compte non membre ne peut ni voir ni rejoindre une discussion privée.

## Phase 4 — Expérience Messenger/Discord

- [ ] Discussions privées à deux ou en groupe
- [ ] Recherche et sélection des destinataires
- [ ] Messages non lus et dernière activité
- [ ] Reconnexion automatique et états d’erreur
- [ ] Renommer, quitter et archiver une conversation
- [ ] Salons officiels : Général, Intermix, Transmission, Set/30’ et Archives

Critère de validation : cinq membres utilisent l’application pendant sept jours sans perte de message ni fuite d’accès.

## Phase 5 — Modération et règles collectives

- [ ] Signalement d’un message
- [ ] Suppression logique avec trace de modération
- [ ] Blocage d’un membre
- [ ] Règles de conservation des messages
- [ ] Information claire sur les données stockées
- [ ] Procédure de sauvegarde et de restauration

## Phase 6 — Implantation Forumactif

- [ ] Installer le widget sur une page de test du forum
- [ ] Ouvrir la webapp en panneau sur ordinateur et en plein écran sur téléphone
- [ ] Tester la connexion depuis Safari, Chrome et Firefox
- [ ] Conserver l’ancienne ChatBox pendant la bêta
- [ ] Lancer une bêta avec 5 à 10 membres
- [ ] Recueillir les retours et corriger les blocages
- [ ] Masquer l’ancienne ChatBox après validation collective

## Go / No-Go final

L’implantation est validable uniquement si :

1. les messages survivent à un redémarrage ;
2. les téléphones communiquent depuis des réseaux différents ;
3. les règles d’accès privées ont été testées avec un troisième compte ;
4. un administrateur peut valider et désactiver un membre ;
5. une sauvegarde et un retour à l’ancienne ChatBox sont documentés ;
6. Phil et le groupe pilote ont donné leur accord.
