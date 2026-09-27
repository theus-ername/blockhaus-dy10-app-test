# Branchement du backend Supabase

Le code de la fondation sécurisée est prêt. Il reste à créer le projet qui hébergera réellement les comptes et les messages.

## 1. Créer le projet

Créer un projet Supabase nommé `blockhaus-chat` dans une organisation contrôlée collectivement par l’association.

Conserver dans un gestionnaire de mots de passe :

- l’adresse du projet ;
- la clé publique/publishable ;
- les accès administrateur du projet.

Inviter individuellement tous les administrateurs Forumactif dans l’organisation ou le projet Supabase. Ne pas utiliser un compte ou un mot de passe partagé.

Ne jamais placer la clé `service_role` dans le site ou dans GitHub.

## 2. Installer le schéma

Dans **SQL Editor**, exécuter ces fichiers dans l’ordre :

`supabase/migrations/202609270001_initial_chat.sql`

`supabase/migrations/202609270002_shared_admin.sql`

Ces migrations créent les profils, les rooms, les membres, les messages, les invitations, l’administration partagée, le journal administratif et les règles RLS.

## 3. Préparer la configuration du site

Le fichier `dist/backend-config.js` est déjà présent mais désactivé. Y renseigner :

- `supabaseUrl` avec l’adresse du projet ;
- `supabasePublishableKey` avec la clé publishable/anon publique.

La clé publique peut être exposée dans le navigateur uniquement parce que les règles RLS protègent les données. La clé `service_role`, elle, doit rester secrète.

## 4. Configurer les liens de connexion

Dans les réglages Auth de Supabase :

- définir comme Site URL l’adresse GitHub Pages ;
- ajouter la même adresse dans les Redirect URLs ;
- conserver la connexion par e-mail activée.

Pour une bêta réelle, il faudra également configurer un service SMTP. Le service d’e-mail de démonstration Supabase n’est pas prévu pour envoyer des liens à tous les membres.

## 5. Créer les administrateurs

Après la première connexion de chaque administrateur Forumactif, exécuter en remplaçant le pseudonyme et l’identifiant :

```sql
update public.profiles
set approved = true, role = 'admin', forum_username = '<PSEUDONYME FORUM>'
where id = '<UUID DU COMPTE>';
```

Répéter cette opération pour chaque administrateur. Les autres comptes restent bloqués jusqu’à leur validation.

## 6. Tests obligatoires

Utiliser trois comptes : A, B et C.

1. A crée une room et invite B.
2. B rejoint et répond.
3. C tente de lire la room et doit recevoir zéro résultat ou un refus.
4. L’invitation est révoquée puis refusée.
5. Les messages restent présents après fermeture des trois navigateurs.
