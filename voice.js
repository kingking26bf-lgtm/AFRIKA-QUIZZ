//#VOICE_START
// Synthèse vocale : Android TextToSpeech natif (plugin Capacitor) ; repli sur speechSynthesis dans un navigateur.
const TTS=(()=>{
const cap=window.Capacitor,native=!!(cap&&typeof cap.isNativePlatform==='function'&&cap.isNativePlatform()),
plug=native?((cap.Plugins&&cap.Plugins.TextToSpeech)||cap.registerPlugin('TextToSpeech')):null,
web=!native&&typeof window.speechSynthesis!=='undefined'&&typeof SpeechSynthesisUtterance!=='undefined'?window.speechSynthesis:null,
FEM=/female|femme|frc|amélie|amelie|audrey|aurélie|céline|julie|marie|virginie|denise|élodie|eloise/i;
let voices=[],ready=null,ok=false,err='',last=['',0],spoken=false;
async function loadNative(){const l=await plug.getSupportedLanguages();const has=(l.languages||[]).some(x=>/^fr/i.test(x));let v=[];
 try{const r=await plug.getSupportedVoices();v=(r.voices||[]).map((x,i)=>({i,n:x.name||x.voiceURI,u:x.voiceURI||x.name,l:x.lang||'',loc:x.localService})).filter(x=>/^fr/i.test(x.l))}catch(e){}
 voices=v;ok=has||v.length>0;if(!ok)err='Aucune voix française installée sur ce téléphone.'}
function loadWeb(){return new Promise(res=>{if(!web){err='Synthèse vocale indisponible.';return res()}
 const g=()=>{voices=web.getVoices().filter(v=>/^fr/i.test(v.lang)).map((v,i)=>({i,n:v.name,u:v.voiceURI||v.name,l:v.lang,loc:v.localService,v}));return voices.length};
 ok=true;if(g())return res();web.onvoiceschanged=()=>{g();res()};setTimeout(()=>{g();if(!voices.length)err='Aucune voix française détectée.';res()},1500)})}
function init(){return ready=ready||(async()=>{try{await(native?loadNative():loadWeb())}catch(e){ok=false;err='Initialisation vocale impossible : '+(e&&e.message||e)}})()}
function pick(){const f=voices.filter(v=>/^fr[-_]fr/i.test(v.l)),L=f.length?f:voices;
 return voices.find(v=>v.u===D.vid)||[...L].sort((a,b)=>(FEM.test(b.n+b.u)-FEM.test(a.n+a.u))||((b.loc?1:0)-(a.loc?1:0)))[0]}
async function say(t,o){o=o||{};try{if(!D.voice&&!o.force)return;const n=Date.now();if(!o.queue&&last[0]===t&&n-last[1]<500)return;last=[t,n];
 await init();if(!ok)return;const v=pick(),rate=+D.rate||.9,vol=D.vol;
 if(native)await plug.speak({text:t,lang:'fr-FR',rate,pitch:1.05,volume:vol,voice:v?v.i:undefined,category:'ambient',queueStrategy:o.queue?1:0});
 else if(web){if(!o.queue)web.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='fr-FR';u.rate=rate;u.pitch=1.05;u.volume=vol;if(v&&v.v)u.voice=v.v;web.speak(u)}
}catch(e){err='Erreur vocale : '+(e&&e.message||e)}}
function stop(){try{if(native)plug.stop();else if(web)web.cancel()}catch(e){}}
async function welcome(){let seen=false;try{seen=sessionStorage.getItem('aqw')==='1'}catch(e){}if(seen||spoken)return;spoken=true;try{sessionStorage.setItem('aqw','1')}catch(e){}
 await init();const go=()=>say('Bienvenue dans Afrika Quiz !');
 if(native||!web)go();else document.addEventListener('pointerdown',go,{once:true})}
if(document.addEventListener)document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
return{init,say,stop,welcome,pick,list:()=>voices,status:()=>({native,ok,err}),install:()=>{try{if(native&&plug.openInstall)plug.openInstall()}catch(e){}}}})();
function speak(t,q){TTS.say(t,{queue:q})}
async function vui(){await TTS.init();const s=TTS.status(),L=TTS.list();$('vsel').innerHTML='<option value="">Automatique (féminine si possible)</option>'+L.map(v=>`<option value="${v.u}"${v.u===D.vid?' selected':''}>${esc(v.n)} (${esc(v.l)})</option>`).join('');$('vst').textContent=(s.native?'Moteur Android TextToSpeech':'Synthèse du navigateur (aperçu)')+' • '+(s.ok?L.length+' voix française(s)':s.err);$('vin').style.display=s.native&&!s.ok?'':'none'}
async function vtest(){await TTS.say('Bienvenue dans Afrika Quiz !',{force:1});vui()}
//#VOICE_END
