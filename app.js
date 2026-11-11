const def=()=>({avatar:'🦁',country:'',wins:0,best:0,right:0,total:0,theme:'nuit',P:{},name:'Joueur',xp:0,games:0,sound:1,voice:1,vol:1,rate:.9,vid:'',time:15,scores:[]});
let D=def();try{D=Object.assign(def(),JSON.parse(localStorage.getItem('aq')||'{}'))}catch(e){}
['xp','games','wins','best','right','total'].forEach(k=>D[k]=+D[k]||0);if(!D.P||typeof D.P!=='object')D.P={};
const TH={nuit:['Nuit','#050b1a','#0b2a3f','#10e2a0','#22d3ee','#f5c542'],emeraude:['Émeraude','#03120d','#0a3a2a','#34d399','#2dd4bf','#fde047'],soleil:['Soleil','#120a05','#3a1f0b','#f5c542','#fb923c','#fde68a']};
function theme(){if(!TH[D.theme])D.theme='nuit';const t=TH[D.theme],r=document.documentElement.style;['bg','bg2','em','cy','gold'].forEach((k,i)=>r.setProperty('--'+k,t[i+1]))}
theme();
const sv=()=>{try{localStorage.setItem('aq',JSON.stringify(D))}catch(e){}};
const $=i=>document.getElementById(i);
function show(i){document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('on',s.id===i));scrollTo(0,0)}
function home(){const l=Math.floor(D.xp/100)+1;$('pn').textContent=D.avatar+' '+D.name+(D.country?' • '+D.country:'');$('lv').textContent='Niveau '+l;$('xb').style.width=(D.xp%100)+'%';$('xt').textContent=(D.xp%100)+' / 100 XP • '+D.games+' parties';show('home')}
let ac;function beep(f,d){if(!D.sound)return;try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator(),g=ac.createGain();o.frequency.value=f;g.gain.value=.08;o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+d)}catch(e){}}
let G,T,S={c:-1,d:-1};
const chips=(a,k)=>a.map((n,i)=>`<button class="chip${S[k]===i-1?' on':''}" onclick="S.${k}=${i-1};pre()">${n}</button>`).join('');
function pre(){$('cc').innerHTML=chips(['🌍 Toutes',...C],'c');$('dc').innerHTML=chips(['Mixte',...DN],'d');show('pre')}
function start(m){if(m==='duo')return duo();const qs=Q.map(r=>({c:r[0],d:r[1],q:r[2],o:r.slice(3),k:(S.c<0||r[0]===S.c?0:2)+(S.d<0||r[1]===S.d?0:1)+Math.random()*.9})).sort((a,b)=>a.k-b.k).slice(0,10).sort(()=>Math.random()-.5);G={mode:m,qs,i:0,sc:[0,0],ok:0,A:[[],[]]};show('game');ask()}
function ask(){clearInterval(T);if(G.i>=10)return fin();const q=G.qs[G.i],cur=G.mode==='duo'?G.i%2:0;G.t=D.time;G.lock=0;
$('who').textContent=G.mode==='duo'?'🎮 Joueur '+(cur+1):'👤 '+D.name;$('pg').textContent='Question '+(G.i+1)+'/10';$('pb').style.width=((G.i+1)*10)+'%';$('tag').textContent=C[q.c]+' • '+DN[q.d];$('sc').textContent='⭐ '+G.sc[cur];$('qt').textContent=q.q;
$('os').innerHTML='';[0,1,2,3].sort(()=>Math.random()-.5).forEach(k=>{const b=document.createElement('button');b.className='btn opt';b.textContent=q.o[k];b.dataset.ok=k===0?1:0;b.onclick=()=>pick(b,k===0);$('os').appendChild(b)});
const f=$('tm').firstElementChild;f.style.transition='none';f.style.width='100%';setTimeout(()=>{f.style.transition='width 1s linear'},20);
T=setInterval(()=>{G.t--;f.style.width=(G.t/D.time*100)+'%';if(G.t<=0){clearInterval(T);pick(null,false)}},1000)}
const esc=t=>t.replace(/[<>&]/g,'');
function duo(){$('n1').value=D.name;$('n2').value=D.p2||'';show('names')}
function dgo(){let a=$('n1').value.trim()||'Joueur 1',b=$('n2').value.trim()||'Joueur 2';if(a.toLowerCase()===b.toLowerCase())b+=' 2';D.p1=a;D.p2=b;sv();
const qs=Q.map(r=>({c:r[0],d:r[1],q:r[2],o:r.slice(3),ord:[0,1,2,3].sort(()=>Math.random()-.5)})).sort(()=>Math.random()-.5).slice(0,10);
G={mode:'duo',qs,i:0,p:0,N:[a,b],sc:[0,0],ok:[0,0],L:[],A:[[],[]]};dpass()}
function dpass(){const n=esc(G.N[G.p]);$('pk').textContent='📱 Passe le téléphone à';$('pw').textContent=n;$('pw').style.color=G.p?'var(--gold)':'var(--cy)';$('pm').innerHTML='Question '+(G.i+1)+'/10<br>🙈 Les réponses sont cachées.<br>Ne regarde l’écran que lorsque tu as le téléphone.';$('pbtn').textContent='Je suis '+n+' — prêt !';$('pbtn').onclick=dturn;show('pass');if(G.i>0||G.p>0)speak('C’est au tour du joueur suivant !',1)}
function dturn(){const q=G.qs[G.i],p=G.p;G.t=D.time;G.lock=0;show('game');
$('who').textContent=(p?'🟡 ':'🔵 ')+G.N[p];$('pg').textContent='Question '+(G.i+1)+'/10';$('pb').style.width=((G.i+1)*10)+'%';$('tag').textContent=C[q.c]+' • '+DN[q.d];$('sc').textContent='⭐ '+G.sc[p];$('qt').textContent=q.q;$('os').innerHTML='';
q.ord.forEach(k=>{const b=document.createElement('button');b.className='btn opt';b.textContent=q.o[k];b.onclick=()=>dans(b,k===0);$('os').appendChild(b)});
const f=$('tm').firstElementChild;f.style.transition='none';f.style.width='100%';setTimeout(()=>{f.style.transition='width 1s linear'},20);
clearInterval(T);T=setInterval(()=>{G.t--;f.style.width=(G.t/D.time*100)+'%';if(G.t<=0)dans(null,false)},1000)}
function dans(b,ok){if(G.lock)return;G.lock=1;clearInterval(T);const p=G.p,q=G.qs[G.i],pts=ok?10+5*q.d+Math.max(G.t,0):0;G.sc[p]+=pts;G.ok[p]+=ok?1:0;G.L[p]=[ok,pts];G.A[p][G.i]={s:b?b.textContent:null,ok,pts};fx(b,ok);setTimeout(()=>{if(p===0){G.p=1;dpass()}else drev()},1100)}
function drev(){const q=G.qs[G.i];$('rq').textContent='Question '+(G.i+1)+'/10';
$('rb').innerHTML='<div class="mut">Bonne réponse</div><div style="text-align:center;font-weight:700;color:var(--em);font-size:1.15rem;margin:6px 0 12px">'+q.o[0]+'</div>'+[0,1].map(p=>`<div class="li"><span>${p?'🟡':'🔵'} ${esc(G.N[p])} ${G.L[p][0]?'✅':'❌'}</span><span style="color:var(--gold)">+${G.L[p][1]} • total ${G.sc[p]}</span></div>`).join('');show('rev')}
function dnext(){G.i++;if(G.i>=10)return dfin();G.p=0;dpass()}
function dfin(){const[a,b]=G.sc;D.duo=D.duo||[];D.duo.unshift({a:G.N[0],b:G.N[1],sa:a,sb:b,ka:G.ok[0],kb:G.ok[1],d:new Date().toLocaleDateString('fr-FR')});D.duo=D.duo.slice(0,20);D.games++;D.xp+=(Math.max(a,b)/2|0);[0,1].forEach(p=>{const win=a!==b&&G.sc[p]>G.sc[1-p];rec(G.N[p],G.sc[p],win);if(G.N[p].toLowerCase()===D.name.toLowerCase()){D.right+=G.ok[p];D.total+=10;D.best=Math.max(D.best,G.sc[p]);D.wins+=win?1:0}});sv();results()}
function fx(b,ok){const e=$('fx');e.className='';void e.offsetWidth;e.className=ok?'gv':'rd';if(b)b.classList.add(ok?'ok':'ko');const m=!b?'Temps écoulé !':ok?'Bonne réponse !':'Mauvaise réponse !';$('tag').textContent=(!b?'⏱ ':ok?'✅ ':'❌ ')+m;speak(m);beep(ok?880:180,ok?.15:.3)}
function pick(b,ok){if(G.lock)return;G.lock=1;clearInterval(T);const q=G.qs[G.i],pts=ok?10+5*q.d+Math.max(G.t,0):0;G.A[0][G.i]={s:b?b.textContent:null,ok,pts};if(ok){G.sc[0]+=pts;G.ok++}fx(b,ok);$('sc').textContent='⭐ '+G.sc[0];G.i++;setTimeout(ask,1100)}
function fin(){const s=G.sc[0];D.games++;D.xp+=s;D.right+=G.ok;D.total+=10;D.best=Math.max(D.best,s);rec(D.name,s,0);D.scores.push({n:D.name,s,d:new Date().toLocaleDateString('fr-FR')});D.scores.sort((a,b)=>b.s-a.s);D.scores=D.scores.slice(0,10);sv();results()}
function summ(p){const A=G.A[p],ok=A.filter(a=>a.ok).length,nr=A.filter(a=>a.s===null).length;return{ok,ko:10-ok-nr,nr,pct:ok*10,xp:G.mode==='solo'?G.sc[p]:G.sc[p]/2|0}}
function card(p){const m=summ(p),n=G.mode==='solo'?D.name:G.N[p],r=(a,b)=>`<div class="li"><span>${a}</span><b>${b}</b></div>`;
return `<div class="glass"><b style="color:${p?'var(--gold)':'var(--cy)'}">${G.mode==='duo'?(p?'🟡 ':'🔵 '):'👤 '}${esc(n)}</b><div class="big" style="font-size:2.2rem">${G.sc[p]} pts</div>${r('✅ Bonnes réponses',m.ok)}${r('❌ Mauvaises réponses',m.ko)}${r('⏱ Non répondues',m.nr)}${r('🎯 Réussite',m.pct+' %')}${r('✨ XP gagnés','+'+m.xp)}<button class="btn gold" style="margin-top:12px" onclick="rv(${p},1)">🔍 REVOIR MES ERREURS</button><button class="btn ghost" style="margin-top:8px" onclick="rv(${p},0)">📋 Toutes les questions</button></div>`}
function results(){let h='',t;if(G.mode==='duo'){const[a,b]=G.sc,tie=a===b,w=a>b?0:1;t=tie?'🤝 Égalité !':'🏆 '+esc(G.N[w])+' gagne !';
const ord=tie?[0,1]:[1-w,w];h='<div class="glass"><div class="pod">'+ord.map(p=>{const top=tie||p===w;return `<div><div style="font-size:1.8rem">${top?'🥇':'🥈'}</div><b>${esc(G.N[p])}</b><div class="st${top?'':' s2'}" style="height:${top?130:90}px">${G.sc[p]}</div></div>`}).join('')+'</div></div>'+card(0)+card(1)}
else{t=G.ok>=8?'🌟 Excellent !':G.ok>=5?'👏 Bien joué !':'💪 Continue !';h=card(0)}
$('et').textContent=t;$('rs').innerHTML=h;show('end');if(G.mode==='duo'||G.ok>=5)speak('Félicitations !');speak('Voici vos résultats !',1)}
function rv(p,e){const L=G.qs.map((q,i)=>[q,G.A[p][i],i]).filter(x=>!e||!x[1].ok);$('rt').textContent=(e?'MES ERREURS':'TOUTES LES QUESTIONS')+(G.mode==='duo'?' – '+esc(G.N[p]):'');
$('rl').innerHTML=L.length?L.map(([q,a,i])=>`<div class="glass"><div class="mut" style="text-align:left">Q${i+1} • ${C[q.c]} • ${DN[q.d]}</div><div style="margin:6px 0">${q.q}</div><div style="color:${a.ok?'var(--em)':'#f87171'}">${a.ok?'✅':'❌'} Ta réponse : ${a.s===null?'<i>non répondue</i>':a.s}</div><div style="color:var(--em)">✔ Bonne réponse : ${q.o[0]}</div></div>`).join(''):'<div class="glass mut">🎉 Aucune erreur, bravo !</div>';show('rv')}
function lb(){$('bl').innerHTML=D.scores.length?D.scores.map((x,i)=>`<div class="li"><span>${['🥇','🥈','🥉'][i]||i+1+'.'} ${x.n.replace(/[<>&]/g,'')}</span><span style="color:var(--gold)">${x.s} pts <small class="mut">${x.d}</small></span></div>`).join(''):'<div class="mut">Aucun score pour l’instant. Lance une partie solo !</div>';$('bd').innerHTML=rank()+((D.duo||[]).length?D.duo.slice(0,10).map(x=>`<div class="li"><span>${x.sa>x.sb?'🏆':''}${esc(x.a)} <b>${x.sa}</b></span><span><b>${x.sb}</b> ${esc(x.b)}${x.sb>x.sa?'🏆':''}</span></div>`).join(''):'<div class="mut">Aucun duel enregistré.</div>');show('board')}
function st(){$('nm').value=D.name;lab();show('set');vui()}
function lab(){$('sb').textContent='Effets sonores : '+(D.sound?'activés':'désactivés');$('tb').textContent='Temps par question : '+D.time+' s';$('vb').textContent='Voix française : '+(D.voice?'activée':'désactivée');$('thb').textContent='Thème : '+TH[D.theme][0];$('vv').value=D.vol;$('vr').value=D.rate;$('vl').textContent='Volume de la voix : '+Math.round(D.vol*100)+' %';$('rtl').textContent='Vitesse de la voix : ×'+(+D.rate).toFixed(1)}
function tg(k){if(k==='sound')D.sound=D.sound?0:1;else if(k==='voice')D.voice=D.voice?0:1;else if(k==='theme'){const ks=Object.keys(TH);D.theme=ks[(ks.indexOf(D.theme)+1)%ks.length];theme()}else D.time=D.time===10?15:D.time===15?20:10;sv();lab()}
function rec(n,sc,win){const P=D.P=D.P||{},r=P[n]=P[n]||{g:0,w:0,pts:0,best:0};r.g++;r.w+=win?1:0;r.pts+=sc;r.best=Math.max(r.best,sc)}
function rank(){const P=Object.entries(D.P||{}),row=(a,i,b)=>`<div class="li"><span>${['🥇','🥈','🥉'][i]||i+1+'.'} ${esc(a)}</span><span style="color:var(--gold)">${b}</span></div>`,h=t=>`<b style="color:var(--cy);display:block;margin:14px 0 4px">${t}</b>`;
const g=[...P].sort((a,b)=>b[1].pts-a[1].pts).slice(0,10),w=P.filter(x=>x[1].w).sort((a,b)=>b[1].w-a[1].w||b[1].pts-a[1].pts).slice(0,10);
return h('Classement général (points cumulés)')+(g.length?g.map((x,i)=>row(x[0],i,x[1].pts+' pts • '+x[1].g+' parties')).join(''):'<div class="mut">Aucun joueur.</div>')+h('Victoires en duel')+(w.length?w.map((x,i)=>row(x[0],i,x[1].w+' victoire'+(x[1].w>1?'s':''))).join(''):'<div class="mut">Aucune victoire.</div>')+h('Duels récents')}
const AV=['🦁','🐘','🦒','🦓','🦅','🐆','🦏','🦩','🐊','🌍','👑','🚀'],CO='Afrique du Sud,Algérie,Angola,Bénin,Botswana,Burkina Faso,Burundi,Cameroun,Cap-Vert,Centrafrique,Comores,Congo,RD Congo,Côte d’Ivoire,Djibouti,Égypte,Érythrée,Eswatini,Éthiopie,Gabon,Gambie,Ghana,Guinée,Guinée-Bissau,Guinée équatoriale,Kenya,Lesotho,Libéria,Libye,Madagascar,Malawi,Mali,Maroc,Maurice,Mauritanie,Mozambique,Namibie,Niger,Nigeria,Ouganda,Rwanda,Sao Tomé-et-Principe,Sénégal,Seychelles,Sierra Leone,Somalie,Soudan,Soudan du Sud,Tanzanie,Tchad,Togo,Tunisie,Zambie,Zimbabwe,Autre'.split(',');let AVs='🦁';
function prof(){AVs=D.avatar;$('pin').value=D.name;$('pco').innerHTML='<option value="">— Choisir —</option>'+CO.map(c=>`<option${c===D.country?' selected':''}>${c}</option>`).join('');pview()}
function pview(){const l=Math.floor(D.xp/100)+1,r=(a,b)=>`<div class="li"><span>${a}</span><b>${b}</b></div>`;$('pav').textContent=AVs;$('plv').textContent='Niveau '+l;$('pxb').style.width=(D.xp%100)+'%';$('pxt').textContent=D.xp+' XP au total • '+(D.xp%100)+'/100 vers le niveau '+(l+1);
$('pav2').innerHTML=AV.map(a=>`<button class="chip av${a===AVs?' on':''}" onclick="AVs='${a}';pview()">${a}</button>`).join('');
$('pst').innerHTML=r('🎮 Parties jouées',D.games)+r('🏆 Victoires (duels)',D.wins)+r('⭐ Meilleur score',D.best)+r('🎯 Réussite',D.total?Math.round(D.right/D.total*100)+' %':'—')+r('✨ Expérience totale',D.xp+' XP');show('prof')}
function psave(){D.name=($('pin').value.trim()||'Joueur').slice(0,14);D.avatar=AVs;D.country=$('pco').value;sv();home()}
window.addEventListener('error',()=>{try{home()}catch(e){}});
home();TTS.welcome();
