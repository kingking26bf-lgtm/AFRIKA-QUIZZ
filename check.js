// Vérifie la syntaxe JS et l'intégrité de la base de questions.
const fs = require('fs'), vm = require('vm');
const dir = __dirname + '/../www/';
const q = fs.readFileSync(dir + 'js/questions.js', 'utf8');
const app = fs.readFileSync(dir + 'js/app.js', 'utf8');
const voice = fs.readFileSync(dir + 'js/voice.js', 'utf8');
new vm.Script(voice);
new vm.Script(q); new vm.Script(app);
const ctx = {}; vm.createContext(ctx);
vm.runInContext(q + ';this.out={Q,C,DN}', ctx);
const { Q, C, DN } = ctx.out; let bad = 0;
Q.forEach((r, i) => {
  const [c, d, t, ...o] = r;
  if (r.length !== 7 || !(c in C) || !(d in DN) || new Set(o).size !== 4 || o.some(x => !x)) { console.log('Question invalide #' + i, t); bad++; }
});
C.forEach((n, i) => { const k = Q.filter(r => r[0] === i).length; if (k < 5) { console.log('Catégorie faible', n, k); bad++; } });
console.log(Q.length + ' questions, ' + C.length + ' catégories, ' + bad + ' erreur(s)');
process.exit(bad ? 1 : 0);
