# Test Blockhaus sur deux téléphones

Cette version sert uniquement à tester les discussions privées en temps réel sur le même réseau Wi-Fi.

## Démarrer

Sur le Mac, lancer :

```bash
./demarrer-test.command
```

Le terminal affiche une adresse du type `http://192.168.1.7:8787`.

## Téléphone A

1. Ouvrir l'adresse affichée par le terminal.
2. Choisir un prénom.
3. Appuyer sur **Créer** dans la carte « Test à 2 téléphones ».
4. Donner un nom à la discussion privée.
5. Copier ou partager le lien d'invitation.

## Téléphone B

1. Vérifier qu'il utilise le même Wi-Fi que le Mac.
2. Ouvrir le lien reçu.
3. Choisir un autre prénom.
4. Envoyer un message dans la discussion.

Le message doit apparaître immédiatement sur le téléphone A.

## Limites de cette V1

- Le Mac doit rester allumé et le terminal ouvert.
- Les deux téléphones doivent utiliser le même Wi-Fi.
- Les messages disparaissent lorsque le serveur est arrêté.
- Il n'y a pas encore de comptes sécurisés ni de chiffrement de bout en bout.
- Ne pas utiliser cette version pour des informations sensibles.
