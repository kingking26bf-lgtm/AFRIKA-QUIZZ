// Android 11+ : autorise l'app à voir les moteurs TextToSpeech installés (à lancer après `npx cap add android`).
const fs = require('fs'), f = __dirname + '/../android/app/src/main/AndroidManifest.xml';
if (!fs.existsSync(f)) { console.error('Lancez d’abord : npx cap add android'); process.exit(1); }
let m = fs.readFileSync(f, 'utf8');
if (m.includes('TTS_SERVICE')) { console.log('Manifeste déjà prêt'); process.exit(0); }
m = m.replace('<application', '<queries><intent><action android:name="android.intent.action.TTS_SERVICE" /></intent></queries>\n    <application');
fs.writeFileSync(f, m); console.log('Manifeste mis à jour');
