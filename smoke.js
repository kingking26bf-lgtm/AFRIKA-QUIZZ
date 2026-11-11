// Test de fumée sans navigateur : faux DOM + faux plugin TextToSpeech. Vérifie les annonces vocales et le jeu.
const fs=require('fs'),vm=require('vm');
const src=['questions','voice','app'].map(n=>fs.readFileSync(__dirname+'/../www/js/'+n+'.js','utf8')).join('\n');
function build(plug){
 const els={},store={},ss={};
 const mk=()=>({style:{setProperty(){}},classList:{add(){},toggle(){},remove(){}},dataset:{},children:[],firstElementChild:{style:{}},appendChild(c){this.children.push(c)},set innerHTML(v){this._h=v;this.children=[]},get innerHTML(){return this._h||''},value:'',textContent:''});
 const ctx={document:{getElementById:i=>els[i]=els[i]||mk(),querySelectorAll:()=>[],createElement:()=>mk(),documentElement:mk(),addEventListener(){}},
  localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v},sessionStorage:{getItem:k=>ss[k]||null,setItem:(k,v)=>ss[k]=v},
  window:{addEventListener(){},Capacitor:{isNativePlatform:()=>true,Plugins:{TextToSpeech:plug}}},
  setTimeout:()=>0,clearInterval(){},setInterval:()=>1,scrollTo(){},confirm:()=>true,console,tick:()=>new Promise(r=>setImmediate(r))};
 vm.createContext(ctx);vm.runInContext(src,ctx);return ctx}
const ok=(c,m)=>{if(!c)throw new Error('ÉCHEC : '+m)};
(async()=>{
 const calls=[],plug={getSupportedLanguages:async()=>({languages:['en-US','fr-FR']}),
  getSupportedVoices:async()=>({voices:[{name:'Voix Homme',lang:'fr-FR',voiceURI:'fr-fr-x-frd-local',localService:true},{name:'Voix Femme frc',lang:'fr-FR',voiceURI:'fr-fr-x-frc-local',localService:true},{name:'English',lang:'en-US',voiceURI:'en'}]}),
  speak:async o=>{calls.push(o)},stop:async()=>{},openInstall:async()=>{}};
 const c=build(plug);
 await vm.runInContext('TTS.welcome()',c);await c.tick();
 ok(calls.length===1&&calls[0].text==='Bienvenue dans Afrika Quiz !','bienvenue exacte, une seule fois');
 ok(calls[0].lang==='fr-FR'&&calls[0].voice===1,'voix féminine française choisie (index 1)');
 await vm.runInContext('TTS.welcome()',c);await c.tick();ok(calls.length===1,'pas de répétition');
 const heard=()=>calls.map(x=>x.text);
 await vm.runInContext(`start('solo');G.lock=0;G.t=5;pick({textContent:'x',classList:{add(){}}},true)`,c);await c.tick();
 await vm.runInContext(`G.lock=0;pick({textContent:'x',classList:{add(){}}},false)`,c);await c.tick();
 await vm.runInContext(`G.lock=0;pick(null,false)`,c);await c.tick();
 ok(heard().includes('Bonne réponse !')&&heard().includes('Mauvaise réponse !')&&heard().includes('Temps écoulé !'),'annonces de réponse');
 await vm.runInContext(`for(let i=3;i<10;i++){G.lock=0;pick(null,false)}fin()`,c);await c.tick();
 ok(heard().includes('Voici vos résultats !'),'résultats annoncés');
 await vm.runInContext(`$('n1').value='Awa';$('n2').value='Koffi';dgo();dpass();`,c);await c.tick();
 ok(!heard().includes('C’est au tour du joueur suivant !'),'pas d’annonce au tout premier tour');
 await vm.runInContext(`G.p=1;dpass()`,c);await c.tick();
 const l=calls[calls.length-1];ok(l.text==='C’est au tour du joueur suivant !'&&l.queueStrategy===1,'annonce du joueur suivant (file d’attente)');
 await vm.runInContext(`G.mode='duo';G.A=[Array(10).fill({s:null,ok:false,pts:0}),Array(10).fill({s:'a',ok:true,pts:10})];G.sc=[0,100];G.ok=[0,10];G.N=['Awa','Koffi'];results()`,c);await c.tick();
 ok(heard().includes('Félicitations !'),'félicitations');
 const n=calls.length;await vm.runInContext(`D.voice=0;speak('Bonne réponse !')`,c);await c.tick();ok(calls.length===n,'voix désactivée = silence');
 await vm.runInContext(`D.voice=1;D.vid='fr-fr-x-frd-local';vtest()`,c);await c.tick();await c.tick();ok(calls[calls.length-1].voice===0,'voix choisie dans les paramètres');
 ok(calls.every(x=>x.rate===0.9&&x.volume===1),'vitesse 0,9 et volume appliqués');
 // moteur absent / erreur d'initialisation
 const bad=build({getSupportedLanguages:async()=>{throw new Error('moteur absent')},speak:async()=>{throw new Error('x')}});
 await vm.runInContext('TTS.say("Test")',bad);const st=vm.runInContext('TTS.status()',bad);
 ok(!st.ok&&/Initialisation/.test(st.err),'erreur d’initialisation gérée sans plantage');
 const nofr=build({getSupportedLanguages:async()=>({languages:['en-US']}),getSupportedVoices:async()=>({voices:[]}),speak:async()=>{}});
 await vm.runInContext('TTS.init()',nofr);ok(!vm.runInContext('TTS.status()',nofr).ok,'absence de voix française détectée');
 console.log('OK : 12 vérifications vocales + parcours de jeu');
})().catch(e=>{console.error(e.message);process.exit(1)});
