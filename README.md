# AFRICA QUIZ — projet Android (Capacitor)

Application 100 % hors ligne : aucune requête réseau, aucun serveur. Les données (profil, scores, duels) sont stockées dans le `localStorage` de la WebView Android.

## Structure
```
www/index.html        écrans (accueil, solo, duo, profil, classement, paramètres)
www/css/style.css     thèmes, glassmorphism, animations
www/js/questions.js   base de 70 questions (12 catégories, 3 difficultés)
www/js/voice.js       synthèse vocale (Android TextToSpeech via plugin Capacitor)
www/js/app.js         logique : solo, duo, voix, profil, classement, stockage
tools/check.js        vérifie la syntaxe et l’intégrité des questions
tools/smoke.js        simule une partie solo + un duel
capacitor.config.json id de l’app : com.africaquiz.app
.github/workflows/    compilation automatique de l’APK (GitHub Actions)
```

## Compiler l’APK en local
Prérequis : Node.js 18+, JDK 17, Android Studio (SDK Android installé).
```
npm install
npm run check              # vérifications
npx cap add android        # une seule fois : crée le dossier android/
node tools/patch-manifest.js   # autorise l’accès aux moteurs TextToSpeech (Android 11+)
npx cap sync android
cd android && ./gradlew assembleDebug      # (Windows : gradlew.bat assembleDebug)
```
APK : `android/app/build/outputs/apk/debug/app-debug.apk`
Ou : `npx cap open android` puis *Build > Build APK(s)*.

## Sans installer Android Studio
Poussez le dossier sur GitHub : l’action « Build APK » génère `app-debug.apk` (onglet Actions > Artifacts).

## Installer
Copiez l’APK sur le téléphone, autorisez « sources inconnues », ouvrez le fichier.
Pour publier sur le Play Store, il faut un APK/AAB **signé** (*Build > Generate Signed Bundle*).

## Voix (Android TextToSpeech)
- Plugin : `@capacitor-community/text-to-speech` (moteur `android.speech.tts.TextToSpeech`). Si `npm install` refuse la version `^6.0.0`, adaptez-la à votre version de Capacitor.
- Au démarrage : « Bienvenue dans Afrika Quiz ! », une seule fois par ouverture de l’app.
- La voix est choisie parmi les voix **françaises installées** (fonctionne hors ligne si la voix est téléchargée). Android n’indique pas le genre d’une voix : l’app préfère celles dont le nom évoque une voix féminine ; sinon choisissez-en une dans *Paramètres > Voix* et testez-la.
- Aucune voix française ? Installez-en une : *Réglages Android > Synthèse vocale* (ou bouton « Installer une voix française » dans l’app).
- `npm run check` vérifie la syntaxe, les questions et la logique vocale avec un faux plugin (pas le son réel).

## Notes
- Icône et écran de démarrage : ceux par défaut de Capacitor ; à remplacer dans `android/app/src/main/res`.
