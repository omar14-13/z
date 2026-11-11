'use strict';
const $=i=>document.getElementById(i),cv=$('c'),cx=cv.getContext('2d'),hd=$('hand'),hx=hd.getContext('2d');let W=480,H=270,PL=.66,zb=new Float32Array(W),pitch=0,mrun=0,hs=0,pa=0,FL=1,cpOn=0,CPL=0,cpInv=[],cpBought=[],lastSz=1,HG=null,CG=null,ct=0,cvl=1,Ep=0,chgUsed=0,cpChg=0,gt=0,songDone=0,CABH=.9;
function rs(){H=270;W=Math.max(360,Math.min(640,Math.round(H*innerWidth/innerHeight)));cv.width=W;cv.height=H;zb=new Float32Array(W);PL=Math.max(.5,Math.min(.9,.66*(W/H)/(16/9)));const r=Math.min(devicePixelRatio||1,1.5);hd.width=innerWidth*r|0;hd.height=innerHeight*r|0}
addEventListener('resize',rs);rs();
const IM={};for(const[n,e]of Object.entries({e1:'png',e2:'png',e3:'png',e4:'png',pc:'webp',pl:'png',crow:'png',can:'png',usb:'png',chg:'png',cab:'png'})){IM[n]=new Image;IM[n].src=`assets/${n}.${e}`}
const SND={};for(const[n,f]of Object.entries({walk:'walk.wav',eat:'eat.mp3',shop:'shop.wav',js:'scare.wav',mw:'mwalk.wav',fin:'last.mp3',talk1:'talk1.mp3',talk2:'talk2.mp3',drink:'drink.mp3',tired:'tired.mp3',song:'song.mp3'})){SND[n]=new Audio('assets/'+f)}SND.walk.loop=SND.eat.loop=SND.mw.loop=SND.tired.loop=true;SND.walk.volume=.7;SND.tired.volume=.22;
function sfx(k,v=1){const a=SND[k];if(!a)return;a.currentTime=0;a.volume=v;a.play().catch(()=>{})}
const SZ=[[15,15],[23,23],[33,33]],PRE='hr-dark-';
let mob=0,peer,gp,conns=[],hc=null,isH=1,myId='H',G=null,M=[],AC,keys={},E=0,mv={x:0,y:0},look={dx:0,dy:0},tch={},inv=[0,0,0],nm=()=>$('nm').value.trim().slice(0,12);
const P={H:{x:1.5,y:1.5,a:0,d:0,l:0}};
const S=n=>{for(let i=0;i<5;i++)$('s'+i).hidden=i!=n},bc=d=>conns.forEach(c=>c.open&&c.send(d));
function msg(t,ms=2500){$('msg').textContent=t;setTimeout(()=>$('msg').textContent='',ms)}
// ---------- audio ----------
function au(){if(AC)return;AC=new(window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),f=AC.createBiquadFilter();HG=AC.createGain();o.type='sawtooth';o.frequency.value=58;f.type='lowpass';f.frequency.value=260;HG.gain.value=0;o.connect(f).connect(HG).connect(AC.destination);o.start();const nb=AC.createBuffer(1,AC.sampleRate*2,AC.sampleRate),a=nb.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1;const ns=AC.createBufferSource(),bp=AC.createBiquadFilter();ns.buffer=nb;ns.loop=true;bp.type='bandpass';bp.frequency.value=1100;bp.Q.value=.5;CG=AC.createGain();CG.gain.value=0;ns.connect(bp).connect(CG).connect(AC.destination);ns.start()}
const tn=(f,d,v,ty='sine',f2)=>{if(!AC)return;const t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.type=ty;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(Math.max(v,.002),t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g).connect(AC.destination);o.start(t);o.stop(t+d)};
const noise=(d,v)=>{if(!AC)return;const b=AC.createBuffer(1,AC.sampleRate*d|0,AC.sampleRate),a=b.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=(Math.random()*2-1)*(1-i/a.length);const o=AC.createBufferSource(),g=AC.createGain();g.gain.value=v;o.buffer=b;o.connect(g).connect(AC.destination);o.start()};
const scare=()=>{const a=SND.js.cloneNode();a.playbackRate=.6;a.preservesPitch=false;a.volume=1;a.play().catch(()=>{});setTimeout(()=>{const b=SND.js.cloneNode();b.volume=1;b.play().catch(()=>{})},350)};
// ---------- candle (procedural: brass chamberstick + wax candle + hand) ----------
function candle(c,x,y,s,t,f,hand){
 const br=(a,b)=>{const g=c.createLinearGradient(a,0,b,0);g.addColorStop(0,'#4a300f');g.addColorStop(.35,'#e6bb62');g.addColorStop(.62,'#b98a35');g.addColorStop(1,'#3d280c');return g};
 if(hand){const g=c.createLinearGradient(x+1.5*s,y,x+4.5*s,y+6*s);g.addColorStop(0,`rgb(${95+70*f|0},${60+35*f|0},${45+20*f|0})`);g.addColorStop(.5,'#3d241a');g.addColorStop(1,'#120907');c.fillStyle=g;
  c.beginPath();c.moveTo(x+.9*s,y+.5*s);c.bezierCurveTo(x+2.4*s,y-.1*s,x+3*s,y+.4*s,x+3.5*s,y+1.2*s);c.lineTo(x+6*s,y+7*s);c.lineTo(x+2.2*s,y+7*s);c.bezierCurveTo(x+1.6*s,y+3.5*s,x+.9*s,y+1.8*s,x+.9*s,y+.5*s);c.fill()}
 c.fillStyle='#2a1a07';c.beginPath();c.ellipse(x,y+.14*s,1.5*s,.36*s,0,0,6.3);c.fill();
 c.fillStyle=br(x-1.5*s,x+1.5*s);c.beginPath();c.ellipse(x,y,1.5*s,.36*s,0,0,6.3);c.fill();
 c.fillStyle='#3a2509';c.beginPath();c.ellipse(x,y-.04*s,1.1*s,.24*s,0,0,6.3);c.fill();
 c.strokeStyle='#c79a43';c.lineWidth=.17*s;c.beginPath();c.ellipse(x+1.85*s,y+.05*s,.45*s,.33*s,0,0,6.3);c.stroke();
 c.fillStyle=br(x-.42*s,x+.42*s);c.fillRect(x-.42*s,y-.62*s,.84*s,.6*s);c.beginPath();c.ellipse(x,y-.62*s,.46*s,.1*s,0,0,6.3);c.fill();
 const cg=c.createLinearGradient(x-.3*s,0,x+.3*s,0);cg.addColorStop(0,'#8b7a56');cg.addColorStop(.45,'#f4e7c4');cg.addColorStop(1,'#9a8760');
 c.fillStyle=cg;c.fillRect(x-.3*s,y-1.9*s,.6*s,1.3*s);c.beginPath();c.ellipse(x,y-.6*s,.3*s,.07*s,0,0,6.3);c.fill();
 c.fillStyle='#fff6d6';c.beginPath();c.ellipse(x,y-1.9*s,.3*s,.08*s,0,0,6.3);c.fill();
 c.fillStyle='#e9dbb4';c.beginPath();c.moveTo(x+.1*s,y-1.88*s);c.quadraticCurveTo(x+.34*s,y-1.5*s,x+.28*s,y-1.2*s);c.lineTo(x+.18*s,y-1.2*s);c.closePath();c.fill();
 c.strokeStyle='#1a1208';c.lineWidth=.04*s;c.beginPath();c.moveTo(x,y-1.9*s);c.lineTo(x,y-2*s);c.stroke();
 const fy=y-2*s,sw=Math.sin(t*6.3)*.05*s+Math.sin(t*13)*.025*s,fh=.85*s*(.88+.25*f);
 c.save();c.globalCompositeOperation='lighter';const gl=c.createRadialGradient(x,fy-fh*.4,0,x,fy-fh*.4,4.5*s);gl.addColorStop(0,`rgba(255,170,70,${.42*f})`);gl.addColorStop(1,'rgba(255,120,30,0)');c.fillStyle=gl;c.fillRect(x-5*s,fy-5*s,10*s,10*s);c.restore();
 const fg=c.createLinearGradient(0,fy,0,fy-fh);fg.addColorStop(0,'#3a6bff');fg.addColorStop(.12,'#fff0b0');fg.addColorStop(.5,'#ffb43c');fg.addColorStop(1,'rgba(255,80,10,.1)');c.fillStyle=fg;
 c.beginPath();c.moveTo(x,fy);c.bezierCurveTo(x-.32*s,fy-.3*s,x-.2*s,fy-fh*.7,x+sw,fy-fh);c.bezierCurveTo(x+.2*s,fy-fh*.7,x+.32*s,fy-.3*s,x,fy);c.fill();
 if(hand){c.fillStyle=`rgb(${105+70*f|0},${66+36*f|0},${50+22*f|0})`;for(let i=0;i<4;i++){c.beginPath();c.ellipse(x+1.7*s,y-.2*s+i*.27*s,.52*s,.15*s,.2,0,6.3);c.fill()}c.beginPath();c.ellipse(x+1.0*s,y+.02*s,.5*s,.17*s,-.5,0,6.3);c.fill()}}
function sprC(){const c=document.createElement('canvas');c.width=128;c.height=192;candle(c.getContext('2d'),64,150,34,0,.95,0);c.naturalWidth=128;c.naturalHeight=192;return c}
IM.ca=sprC();
function drawHand(t,g){const hdn=g.dead||g.hid>=0;hd.style.display=hdn?'none':'block';if(hdn)return;const c=hx,w=hd.width,h=hd.height,s=h*.075,me=g.me;c.clearRect(0,0,w,h);
 hs=Math.max(-s*1.4,Math.min(s*1.4,(hs-(me.a-pa)*s*5)*.88));pa=me.a;
 const bx=Math.sin(g.bp*.5)*g.ba*s*.3,by=Math.abs(Math.sin(g.bp))*g.ba*s*.35+Math.sin(t*1.3)*s*.03;
 candle(c,w*(mob?.62:.7)+bx+hs,h*.88+by+pitch*s*2.5,s,t,FL,0);
 if(g.an){const u=(performance.now()/1e3-g.an.s)/1.3;if(u>=1)g.an=null;else itemAnim(c,w,h,u,g.an.k)}}
function itemAnim(c,w,h,u,k){const im=IM[k];if(!im||!im.naturalWidth)return;const sc=h*(k=='can'?.0075:.0042),iw=im.naturalWidth*sc,ih=im.naturalHeight*sc,e=Math.sin(Math.PI*Math.min(1,u*1.15));c.save();
 if(k=='can'){c.translate(w*.38,h*(1.15-.6*e));c.rotate(-1.15*Math.sin(Math.PI*Math.min(1,u*1.15)))}
 else if(k=='usb'){c.translate(w*(1.0-.45*Math.min(1,u*1.8)),h*.62);c.rotate(.15)}
 else{const f=1-.5*u;c.translate(w*.5,h*(1.0-.6*e));c.scale((1+.25*Math.sin(u*55))*f,f)}
 c.globalAlpha=u>.8?Math.max(0,(1-u)/.2):1;c.drawImage(im,-iw/2,-ih/2,iw,ih);c.restore();
 if(k=='usb'&&u>.3){c.strokeStyle=`rgba(80,255,120,${1-u})`;c.lineWidth=5;c.beginPath();c.arc(w*.55,h*.62,(u-.3)*h*.7,0,6.3);c.stroke()}
 if(k=='can'&&u>.3&&u<.8){c.fillStyle='rgba(255,200,80,.8)';for(let i=0;i<10;i++){const p=(u*3+i*.37)%1;c.beginPath();c.arc(w*.38+Math.sin(i*5)*h*.12,h*(.55-p*.3),2+p*3,0,6.3);c.fill()}}}
// ---------- map ----------
function rng(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function maze(w,h,r){const m=Array.from({length:h},()=>Array(w).fill(1)),st=[[1,1]];m[1][1]=0;
 while(st.length){const[x,y]=st[st.length-1],d=[[2,0],[-2,0],[0,2],[0,-2]].filter(([a,b])=>m[y+b]&&m[y+b][x+a]===1);if(!d.length){st.pop();continue}const[a,b]=d[r()*d.length|0];m[y+b/2][x+a/2]=0;m[y+b][x+a]=0;st.push([x+a,y+b])}
 for(let i=0;i<w*h/14;i++)m[1+(r()*(h-2)|0)][1+(r()*(w-2)|0)]=0;return m}
function place(m,ox,w,h,n,r,c){const q=k=>3+((r()*((k-5)/2))|0)*2,o=[];for(let i=0;i<600&&o.length<n;i++){const x=q(w),y=Math.min(q(h),h-4),X=x+ox;if((!ox&&x+y<9)||o.some(k=>Math.abs(k[0]-X-.5)+Math.abs(k[1]-y-.5)<(ox?4:6)))continue;o.push([X+.5,y+.5]);for(let a=-1;a<2;a++)for(let b=-1;b<2;b++)m[y+b][X+a]=0}return o}
const ROOMLV={5:'a',10:'b',15:'f'};
function gen(sd,sz,lv){const[w,h]=SZ[sz],r=rng(sd),k=ROOMLV[lv]||0,m1=maze(w,h,r),nm=k?{a:3,b:4,f:5}[k]:Math.min(2+lv,10),[rw,rh]=!k?[0,0]:k=='a'?[15,11]:k=='b'?[17,13]:[18,9],H2=Math.max(h,rh),m=Array.from({length:H2},()=>Array(w+rw).fill(1));
 for(let y=0;y<h;y++)for(let x=0;x<w;x++)m[y][x]=m1[y][x];
 const c=place(m,0,w,h,nm,r),o={m,w:w+rw,h:H2,c,mw:w,mh:h,nm:c.length,k};o.cab=mkCab(m,w,h,sd,c,sz);
 if(k){if(k=='f'){for(let x=1;x<=10;x++)m[3][w+x]=0;for(let y=1;y<=5;y++)for(let x=11;x<=16;x++)m[y][w+x]=0;c.push([w+16.5,3.5]);o.sm=[[13.5,1.5],[13.5,5.5],[15.5,1.5],[15.5,5.5],[12.5,2.5],[12.5,4.5]].map(([x,y])=>[w+x,y])}
  else{const rm=maze(rw,rh,r);for(let y=0;y<rh;y++)for(let x=0;x<rw;x++)m[y][w+x]=rm[y][x];c.push(...place(m,w,rw,rh,k=='a'?2:3,r));if(k=='b')o.m2=[w+rw-1.5,rh-1.5]}
  m[3][w-1]=2;m[3][w]=0;o.door=[w-1,3]}
 return o}
const free=(x,y)=>M[y|0]&&M[y|0][x|0]===0,blk=(x,y)=>!(free(x-.2,y-.2)&&free(x+.2,y-.2)&&free(x-.2,y+.2)&&free(x+.2,y+.2))||!!(G&&G.cab&&G.cab.some(b=>x+.2>b.x-b.hx&&x-.2<b.x+b.hx&&y+.2>b.y-b.hy&&y-.2<b.y+b.hy));
function cast(px,py,dx,dy){dx=dx||1e-9;dy=dy||1e-9;let mx=px|0,my=py|0,ax=Math.abs(1/dx),ay=Math.abs(1/dy),sx,sy,qx,qy,side=0;
 if(dx<0){sx=-1;qx=(px-mx)*ax}else{sx=1;qx=(mx+1-px)*ax}if(dy<0){sy=-1;qy=(py-my)*ay}else{sy=1;qy=(my+1-py)*ay}
 for(let i=0;i<80;i++){if(qx<qy){qx+=ax;mx+=sx;side=0}else{qy+=ay;my+=sy;side=1}if(!M[my]||M[my][mx]!==0)break}
 return[side?qy-ay:qx-ax,side,M[my]&&M[my][mx]]}
// ---------- network ----------
function mkHost(){const c=[...Array(5)].map(()=>'ABCDEFGHJKLMNPQRSTUVWXYZ'[Math.random()*24|0]).join('');peer=new Peer(PRE+c);
 peer.on('open',()=>$('code').textContent=c);peer.on('error',e=>e.type=='unavailable-id'?mkHost():$('st').textContent='مشكلة اتصال بالإنترنت');
 peer.on('connection',k=>{k.on('open',()=>{conns.push(k);P[k.peer]={x:1.5,y:1.5,a:0,d:0,l:0};lob()});
  k.on('data',d=>{const p=P[k.peer];if(d.t=='s'&&p){p.x=d.x;p.y=d.y;p.a=d.a;p.l=d.l;p.h=d.h|0;p.sn=d.sn|0}else if(d.t=='n'&&p)p.n=String(d.n).slice(0,12);else if(d.t=='r'){rdy[k.peer]=1;chk()}else if(d.t=='k'&&G)G.crow={x:d.x,y:d.y,e:0,r:0,t:70};else if(d.t=='c'&&G)G.done[d.i]=1});
  k.on('close',()=>{conns=conns.filter(c=>c!=k);delete P[k.peer];lob();chk()})})}
function lob(){const t='اللاعبون: '+(1+conns.length);$('pl').textContent=t;bc({t:'lob',s:t})}
function join(){const c=$('ci').value.trim().toUpperCase();if(/^(OMAR|OMER|OMR)$/.test(c))sfx('song',.8);if(!c)return;$('st').textContent='جاري الاتصال...';gp=new Peer();
 gp.on('open',id=>{myId=id;hc=gp.connect(PRE+c,{reliable:true});hc.on('open',()=>{isH=0;hc.send({t:'n',n:nm()});$('hr').hidden=1;$('st').textContent='تم الاتصال ✔ بانتظار المضيف ليبدأ...'});
  hc.on('data',onG);hc.on('close',()=>$('st').textContent='انقطع الاتصال')});gp.on('error',()=>$('st').textContent='تعذر الاتصال بهذا الكود')}
function onG(d){if(d.t=='lob')$('pl').textContent=d.s;else if(d.t=='go')startGame(d);else if(d.t=='over')showOver();else if(d.t=='shop')openShop();else if(d.t=='sn')sfx(d.k);
 else if(d.t=='w'&&G){G.P={};for(const k in d.p){const v=d.p[k];G.P[k]={x:v[0],y:v[1],a:v[2],d:v[3],n:v[4],h:v[5]}}G.crow=d.k?{x:d.k[0],y:d.k[1],e:d.k[2],r:d.k[3]}:null;G.mon={x:d.m[0],y:d.m[1],mv:d.m[2],off:d.m[3]};if(d.m2&&G.m2)Object.assign(G.m2,{x:d.m2[0],y:d.m2[1],mv:d.m2[2],off:d.m2[3]});if(d.m3)G.m3=Object.assign(G.m3||{off:0},{x:d.m3[0],y:d.m3[1],mv:d.m3[2]});else G.m3=null;d.c.split('').forEach((v,i)=>v=='1'&&(G.done[i]=1))}}
function hostStart(){if(!isH)return;const d={t:'go',seed:Math.random()*1e9|0,sz:+$('mp').value,lv:1,cp:+$('cps').value};P.H.n=nm();bc(d);startGame(d)}
const nxt=()=>{if(!G||G.over)return;const d={t:'go',seed:Math.random()*1e9|0,sz:G.sz,lv:G.lv+1,cp:cpOn?1:0};bc(d);startGame(d)};
function dev(m){mob=m;if(m){try{document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen();screen.orientation&&screen.orientation.lock&&screen.orientation.lock('landscape').catch(()=>{})}catch(e){}}$('eb').style.display=m?'block':'none';S(2);mkHost()}
function showOver(){if(HG)HG.gain.value=0;if(CG)CG.gain.value=0;Object.values(SND).forEach(a=>a.pause());document.exitPointerLock&&document.exitPointerLock();const l=G?G.lv:1;G=null;document.body.className='';$('js').style.display='none';$('eb').style.display='none';$('qb').style.display='none';$('tb').style.display='none';$('ot').textContent='العيون وجدتكم... وصلتم للمرحلة '+l;$('cpb').hidden=!(cpOn&&CPL&&isH);$('cpb').textContent='ابدأ من نقطة الحفظ (مرحلة '+CPL+')';$('cpw').textContent=cpOn&&CPL&&!isH?'المضيف يختار نقطة البداية':'';S(3)}
function startGame(d){const g=gen(d.seed,d.sz,d.lv);M=g.m;
 G={...g,lv:d.lv,sz:d.sz,done:g.c.map(()=>0),me:{x:1.5,y:1.5,a:g.m[1][2]===0?0:1.57,l:0},dead:0,load:0,t:0,ts:0,over:0,nx:0,sp:0,fs:0,bt:0,at:5,st:100,ex:0,boost:0,fast:0,mvg:0,crow:null,shop:0,bp:0,ba:0,vg:0,hb:0,tg:null,mon:{x:g.mw-1.5,y:g.mh-1.5,mv:0},m2:g.m2?{x:g.m2[0],y:g.m2[1],mv:0,off:1}:null,hid:-1,hcd:0,hseen:0,nc:-1,tab:0,chgT:0,tk:0,m3:null,dopen:0,fz:g.k=='f',ent:0,fin:0,P:isH?P:{}};
 if(isH)for(const k in P)Object.assign(P[k],{x:1.5,y:1.5,d:0,l:0});
 cpOn=!!d.cp;lastSz=d.sz;if(d.lv==1){inv=[0,0,0];bought=[];CPL=0;chgUsed=0;gt=0;songDone=0}if(d.rs){inv=cpInv.slice();bought=cpBought.slice();chgUsed=cpChg}if(cpOn&&ROOMLV[d.lv]){CPL=d.lv;cpInv=inv.slice();cpBought=bought.slice();cpChg=chgUsed}pitch=0;S(-1);jbHome();document.body.className='g'+(mob?' m':'');$('qb').style.display=mob&&d.lv>=2?'block':'none';$('tb').style.display='none';msg('المرحلة '+d.lv+(mob?'':'  —  Shift للجري'),3000)}
// ---------- loop ----------
let last=performance.now();
function loop(t){requestAnimationFrame(loop);const dt=Math.min(.05,(t-last)/1e3);last=t;if(!G||G.shop)return;upd(dt);if(G)draw(t/1e3)}
function upd(dt){const g=G,me=g.me,mo=g.mon;me.a+=look.dx*.006;look.dx=0;pitch=Math.max(-.45,Math.min(.45,pitch-look.dy*.004));look.dy=0;
 if(g.hid>=0){const b=g.cab[g.hid],ba=Math.atan2(b.fy,b.fx);let df=Math.atan2(Math.sin(me.a-ba),Math.cos(me.a-ba));df=Math.max(-.9,Math.min(.9,df));me.a=ba+df;pitch=Math.max(-.12,Math.min(.12,pitch))}
 const L=Math.cos(me.a),Sn=Math.sin(me.a);
 if(g.door&&!g.dopen&&g.done.slice(0,g.nm).every(x=>x)){g.dopen=1;M[g.door[1]][g.door[0]]=0;msg('انفتح باب الغرفة!',3000);tn(200,.6,.2,'square',80);if(g.k=='f')g.mon.off=1;else if(g.m2)g.m2.off=0}
 if(g.fz&&g.done[g.c.length-1])g.fin=1;
 if(g.fz&&!g.ent&&me.x>g.mw+.5){g.ent=1;const a=SND.fin;a.currentTime=0;a.volume=1;a.play().catch(()=>{})}
 if(isH){P.H.x=me.x;P.H.y=me.y;P.H.a=me.a;P.H.l=me.l;P.H.h=g.hid>=0?1:0;P.H.sn=g.hseen?1:0;if(P.H.d&&!g.dead)die()}else{const p=g.P[myId];if(p&&p.d&&!g.dead)die()}
 if(!g.dead){let ni=-1,nd=1.5;g.c.forEach((c,i)=>{if(g.done[i])return;const rx=c[0]-me.x,ry=c[1]-me.y,d=Math.hypot(rx,ry);if(d<nd&&(rx*L+ry*Sn)/d>.55){nd=d;ni=i}});let nc=-1;if(g.hid<0){let bd=1.35;g.cab.forEach((b,i)=>{const fx0=b.x+b.fx*b.hd,fy0=b.y+b.fy*b.hd,rx=fx0-me.x,ry=fy0-me.y,d=Math.hypot(rx,ry);if(d<bd&&(rx*L+ry*Sn)/(d||1)>.5&&(me.x-fx0)*b.fx+(me.y-fy0)*b.fy>-.05){bd=d;nc=i}})}
  g.nc=nc;if(nc>=0||g.hid>=0)ni=-1;g.ni=ni;
  if(Ep){Ep=0;if(g.hid>=0)unhide();else if(nc>=0)hide(nc)}
  if(g.hid>=0){g.load=0;g.mvg=0}else if(ni>=0&&E){g.load+=dt/(g.fast?1.2:3);if((g.bt-=dt)<0){g.bt=.5;tn(300,.1,.05,'square')}if(g.load>=1){g.load=0;g.done[ni]=1;if(!isH)hc.send({t:'c',i:ni});tn(880,.3,.2);tn(1320,.4,.2)}}
  else{g.load=0;let fw=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0),st=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0);if(mob){fw=-mv.y;st=mv.x}
   const l=Math.hypot(fw,st);if(l>1){fw/=l;st/=l}const mvg=l>.1,rn=mvg&&fw>.1&&(keys.ShiftLeft||keys.ShiftRight||mrun)&&!g.ex&&g.st>0;g.mvg=mvg;if(rn){if(g.boost<=0)g.st-=24*dt;if(g.st<=0){g.st=0;g.ex=1;tn(140,.6,.2,'sine',70)}}else{g.st=Math.min(100,g.st+(mvg?9:20)*dt);if(g.ex&&g.st>=35)g.ex=0}
   const sp=(rn?3.7:g.ex?1.6:2.3)*(g.boost>0?1.3:1)*dt,vx=(L*fw-Sn*st)*sp,vy=(Sn*fw+L*st)*sp;if(!blk(me.x+vx,me.y))me.x+=vx;if(!blk(me.x,me.y+vy))me.y+=vy;g.ba+=((mvg?(rn?1:.6):0)-g.ba)*Math.min(1,dt*8);g.bp+=dt*(rn?14:9)*(mvg?1:0)}
  me.l=0;for(const[m,bt]of[[mo,1],[g.m2,2],[g.m3,4]]){if(!m||m.off)continue;const rx=m.x-me.x,ry=m.y-me.y,md=Math.hypot(rx,ry);if(md<12&&(rx*L+ry*Sn)/md>.62&&cast(me.x,me.y,rx/md,ry/md)[0]>md-.3)me.l|=bt}}
 else{me.l=0;Ep=0}
 g.ts+=dt;const send=g.ts>.066;if(send)g.ts=0;
 if(isH){sim(dt);if(send&&G)bc({t:'w',p:Object.fromEntries(Object.keys(P).map(k=>[k,[+P[k].x.toFixed(2),+P[k].y.toFixed(2),+P[k].a.toFixed(2),P[k].d,P[k].n||'',P[k].h?1:0]])),k:g.crow?[+g.crow.x.toFixed(1),+g.crow.y.toFixed(1),g.crow.e?1:0,+(g.crow.r||0).toFixed(0)]:0,m:[+mo.x.toFixed(2),+mo.y.toFixed(2),mo.mv,mo.off?1:0],m2:g.m2?[+g.m2.x.toFixed(2),+g.m2.y.toFixed(2),g.m2.mv,g.m2.off?1:0]:0,m3:g.m3?[+g.m3.x.toFixed(2),+g.m3.y.toFixed(2),g.m3.mv,0]:0,c:g.done.join('')})}
 else if(send&&!g.dead)hc.send({t:'s',x:me.x,y:me.y,a:me.a,l:me.l,h:g.hid>=0?1:0,sn:g.hseen?1:0});
 if(!G)return;
 g.boost=Math.max(0,g.boost-dt);g.hcd=Math.max(0,g.hcd-dt);g.chgT=Math.max(0,g.chgT-dt);gt+=dt;if(gt>60&&!songDone){songDone=1;sfx('song',.7)}
 const td=SND.tired;if(!g.dead&&g.hid<0&&(g.ex||g.st<28)){td.volume=.22;if(td.paused)td.play().catch(()=>{})}else if(!td.paused)td.pause();
 const wk=SND.walk;if(g.mvg&&!g.dead&&!E){wk.playbackRate=g.st>0&&g.ba>.8?1.3:1;if(wk.paused)wk.play().catch(()=>{})}else if(!wk.paused)wk.pause();g.mvg=0;
 const m2=g.m2&&!g.m2.off?g.m2:null,cd=Math.min(mo.off?99:Math.hypot(mo.x-me.x,mo.y-me.y),m2?Math.hypot(m2.x-me.x,m2.y-me.y):99,g.m3?Math.hypot(g.m3.x-me.x,g.m3.y-me.y):99);const ea=SND.eat;if(g.crow&&g.crow.e){ea.volume=Math.max(0,Math.min(1,1.1-cd/14));if(ea.paused)ea.play().catch(()=>{})}else if(!ea.paused)ea.pause();const mw=SND.mw;if((mo.mv||m2&&m2.mv||g.m3&&g.m3.mv)&&!g.dead){mw.volume=Math.max(0,Math.min(1,1.05-cd/16));if(mw.paused)mw.play().catch(()=>{})}else if(!mw.paused)mw.pause();

 if(HG){let dm=9;g.c.forEach((c,i)=>{if(!g.done[i])dm=Math.min(dm,Math.hypot(c[0]-me.x,c[1]-me.y))});HG.gain.value=g.dead?0:dm<3.5?.06*Math.pow(1-dm/3.5,2):0}
 ct+=dt;cvl+=((1-Math.min(1,ct/12)*.75)*(g.ba>.8?.3:1)-cvl)*Math.min(1,dt*3);if(CG)CG.gain.value=g.dead?0:.05*cvl;if((g.ck=(g.ck||0)-dt)<0){g.ck=.12+Math.random()*1.1;if(!g.dead)noise(.025,.09*cvl)}
 g.vg=Math.max(0,1-cd/6);if(cd<8&&!g.dead&&(g.hb-=dt)<0){g.hb=.35+cd/8*.7;tn(60,.2,.5*(1-cd/8),'sine',35)}}
const PB={};
function pbody(k,rel){const c=PB[k]||(PB[k]=document.createElement('canvas'));c.width=96;c.height=192;c.naturalWidth=96;c.naturalHeight=192;const x=c.getContext('2d'),cw=Math.cos(rel),a=Math.abs(cw),sn=Math.sin(rel),bw=16+22*a,hue=[...k].reduce((q,ch)=>q*31+ch.charCodeAt(0)|0,7)%360,hx0=48+sn*9;
 x.fillStyle=`hsl(${hue},30%,30%)`;x.beginPath();x.moveTo(48-bw,190);x.lineTo(48-bw*.85,92);x.quadraticCurveTo(48,66,48+bw*.85,92);x.lineTo(48+bw,190);x.fill();
 x.fillStyle='rgba(0,0,0,.25)';x.fillRect(48-2,120,4,70);
 x.fillStyle='#c9a27e';x.beginPath();x.ellipse(hx0,52,17,20,0,0,6.3);x.fill();
 x.fillStyle=`hsl(${hue},20%,12%)`;x.beginPath();if(cw>0)x.ellipse(hx0,46,17.5,15,0,Math.PI,6.3);else x.ellipse(hx0,52,17.5,20.5,0,0,6.3);x.fill();
 if(cw>0){x.fillStyle='#111';for(const e of[-1,1]){x.beginPath();x.ellipse(hx0+e*7*a+sn*6,54,2.2,3,0,0,6.3);x.fill()}}
 if(Math.abs(sn)>.35){x.fillStyle='#b88e6a';x.beginPath();x.moveTo(hx0+sn*16,52);x.lineTo(hx0+sn*24,59);x.lineTo(hx0+sn*16,62);x.fill()}
 return c}
function die(){G.dead=1;G.hid=-1;G.tab=0;scare();const j=$('js');j.style.display='block';j.classList.remove('on');void j.offsetWidth;j.classList.add('on');setTimeout(()=>j.style.display='none',1500);msg('أمسك بك! أنت الآن تشاهد صديقك',4000)}
const bfs=(tx,ty)=>{const D=Array.from({length:G.h},()=>Array(G.w).fill(1e9));D[ty][tx]=0;const q=[[tx,ty]];for(let i=0;i<q.length;i++){const[x,y]=q[i];for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const X=x+a,Y=y+b;if(M[Y]&&M[Y][X]===0&&D[Y][X]>D[y][x]+1){D[Y][X]=D[y][x]+1;q.push([X,Y])}}}return D};
function sim(dt){const g=G,mo=g.mon;if(g.over)return;g.t+=dt;const al=Object.keys(P).filter(k=>!P[k].d);
 for(const k of Object.keys(P)){const p=P[k];if(p.h){if(p.sn&&p.snt===undefined)p.snt=12;if(p.snt>0)p.snt-=dt}else p.snt=undefined}
 const al2=al.filter(k=>!P[k].h||P[k].snt>0),tg=al2.length?al2:al.filter(k=>P[k].h),lurk=!al2.length;
 if(!al.length){g.over=1;bc({t:'over'});setTimeout(showOver,2600);return}
 if(!g.fz&&g.done.every(x=>x)&&!g.nx){g.nx=1;msg('اكتملت الحواسيب!',1500);setTimeout(()=>{if(G){bc({t:'shop'});openShop()}},1600)}
 if(g.nx)return;
 if(g.fz&&g.fin){g.f5=(g.f5||0)+dt;if(g.f5>=5&&!g.nx){g.nx=1;const d={t:'go',seed:Math.random()*1e9|0,sz:g.sz,lv:1,cp:cpOn?1:0};bc(d);startGame(d)}return}
 mo.mv=0;if(g.m2)g.m2.mv=0;if(g.m3)g.m3.mv=0;if(g.t<7)return;
 if(g.m3){g.m3.life-=dt;if(g.m3.life<=0)g.m3=null}
 g.tk-=dt;for(const k of al){const p=P[k];p.ls=p.l&&!p.h?(p.ls||0)+dt:0}
 if(g.tk<=0&&al.length>1){const sg=al.find(k=>P[k].ls>=8),ot=sg&&al.find(k=>k!=sg&&!P[k].l&&!P[k].h);if(sg&&ot){g.tk=50;bc({t:'sn',k:'talk1'});sfx('talk1');if(g.sz==2&&!g.m3){const sm=(P[sg].l&2&&g.m2&&!g.m2.off)?g.m2:mo;g.m3={x:sm.x,y:sm.y,mv:0,off:0,life:45,ft:ot};msg('الوحش انقسم!',2500)}}}
 let cr=g.crow;if(cr){cr.t-=dt;if(cr.t<=0)cr=g.crow=null}
 if(cr&&cr.e){cr.r-=dt;if(cr.r<=0)g.crow=null;return}
 chase(mo,dt,tg,1,cr,'tg',lurk);if(g.m2)chase(g.m2,dt,tg,2,null,'tg2',lurk);if(g.m3)chase(g.m3,dt,tg,4,null,'tg3',lurk);
 for(const k of al)if(!P[k].h)for(const m of[mo,g.m2,g.m3])if(m&&!m.off&&Math.hypot(P[k].x-m.x,P[k].y-m.y)<.65)P[k].d=1}
function chase(mo,dt,al,bit,cr,tk,lk){const g=G;if(mo.off||Object.keys(P).some(k=>!P[k].d&&P[k].l&bit))return;const MD=bfs(mo.x|0,mo.y|0);let b=al[0],bd=1e9;
 for(const k of al){const q=P[k],d=((MD[q.y|0]||[])[q.x|0]??1e9)+(k==g[tk]?-1.5:0)+Math.sin(g.t*.4+k.charCodeAt(k.length-1))*1.5;if(d<bd){bd=d;b=k}}if(mo.ft&&P[mo.ft]&&!P[mo.ft].d&&!P[mo.ft].h)b=mo.ft;g[tk]=b;
 const T=cr||P[b],mx=mo.x|0,my=mo.y|0,D=bfs(T.x|0,T.y|0);let bn=[mx,my],bv=D[my]?D[my][mx]:1e9;
 for(const[a,c]of[[1,0],[-1,0],[0,1],[0,-1]]){const v=D[my+c]&&D[my+c][mx+a];if(v<bv){bv=v;bn=[mx+a,my+c]}}
 const same=bn[0]==mx&&bn[1]==my,tx=same?T.x:bn[0]+.5,ty=same?T.y:bn[1]+.5,dx=tx-mo.x,dy=ty-mo.y,l=Math.hypot(dx,dy)||1,sp=Math.min(1.1+.22*g.lv,2.7)*dt;
 if(lk&&!cr&&Math.hypot(T.x-mo.x,T.y-mo.y)<2.5)return;mo.x+=dx/l*Math.min(sp,l);mo.y+=dy/l*Math.min(sp,l);mo.mv=1;if(cr&&Math.hypot(cr.x-mo.x,cr.y-mo.y)<.6){cr.e=1;cr.r=30}}
// ---------- render ----------
const lt=(x,y,L)=>{let b=0;for(const l of L){const d=Math.hypot(x-l[0],y-l[1]);if(d<l[2])b+=Math.pow(1-d/l[2],1.2)/(1+.04*d*d)*1.5}return Math.min(1,b)};
function draw(t){const g=G;let cam=g.me;
 if(g.dead){const al=Object.keys(g.P).filter(k=>k!=myId&&!g.P[k].d);if(al.length)cam=g.P[al[g.sp%al.length]]}
 const fl=FL=.93+.05*Math.sin(t*9)+.03*Math.sin(t*23.7)+Math.random()*.025,oth=Object.entries(g.P).filter(([k,p])=>p!==cam&&!p.h&&!(isH?false:k==myId)&&k!==(isH&&cam===g.me?'H':'')&&!(g.dead&&k==(isH?'H':myId)));
 const m3=cam===g.me,eh=.62,hor=H/2+(m3?pitch*H*.9+Math.sin(g.bp)*g.ba*3:0)+(Math.random()-.5)*g.vg*3;
 const px=cam.x,py=cam.y,dx=Math.cos(cam.a),dy=Math.sin(cam.a),plx=-dy*PL,ply=dx*PL;
 const dk=g.fz&&px>=g.mw,R0=(dk?(g.fin?6.5:2.8):11)*fl,amb=dk?(g.fin?.5:.12):1;const L=[[px,py,R0]];for(const[k,p]of oth)L.push([p.x-Math.cos(p.a)*.3,p.y-Math.sin(p.a)*.3,7*fl]);
 cx.fillStyle='#000';cx.fillRect(0,0,W,H);
 for(let y=0;y<H;y++){if((y|0)==(hor|0))continue;const fp=y>hor,rd=(fp?eh:1-eh)*H/Math.abs(y-hor),k=Math.max(0,1-rd/R0),b=Math.min(1,.07*amb+Math.pow(k,1.2)/(1+.04*rd*rd)*1.5)*(fp?1:.6);cx.fillStyle=`rgb(${b*75+3|0},${b*54+3|0},${b*38+5|0})`;cx.fillRect(0,y,W,1)}
 for(let i=0;i<W;i++){const cxm=2*i/W-1,rx=dx+plx*cxm,ry=dy+ply*cxm,[d,s,ct]=cast(px,py,rx,ry);zb[i]=d;const hx2=px+rx*d,hy=py+ry*d,wx=s?hx2%1:hy%1,v=(.85+.15*((wx*10|0)%2))*(.12*amb+lt(hx2,hy,L))*(s?.75:1),lh=H/d,top=hor-(1-eh)*lh;
  cx.fillStyle=ct===2?`rgb(${150*v|0},${46*v|0},${42*v|0})`:`rgb(${155*v|0},${126*v|0},${92*v|0})`;cx.fillRect(i,top,1,lh);cx.fillStyle='rgba(0,0,0,.38)';cx.fillRect(i,top,1,lh*.16);cx.fillRect(i,top+lh*.88,1,lh*.12);if(g.cab.length)cabCol(g,i,px,py,rx,ry,hor,eh,amb,L)}
 const it=[],mo=g.mon,md=Math.hypot(mo.x-px,mo.y-py);
 g.c.forEach((c,i)=>it.push({x:c[0],y:c[1],im:IM.pc,sh:.5,lf:0,al:g.done[i]?.35:.85+.1*Math.sin(t*14+i*3)*(Math.random()<.15?1:.3)}));
 for(const[k,p]of oth)if(!p.d){it.push({x:p.x,y:p.y,im:pbody(k,p.a-Math.atan2(py-p.y,px-p.x)),nm:p.n,sh:.85,lf:0,al:Math.max(.5,lt(p.x,p.y,L))});it.push({x:p.x-Math.cos(p.a)*.35,y:p.y-Math.sin(p.a)*.35,im:IM.ca,sh:.28,lf:.35,al:1})}
 if(g.crow){const c=g.crow;it.push({x:c.x,y:c.y,im:IM.crow,sh:.2*(c.e?.4+.6*c.r/30:1),lf:0,al:1})}
 const mim=d=>d<3?IM.e1:d<5.5?IM.e2:d<9?IM.e3:IM.e4;if(g.m2&&!g.m2.off)it.push({x:g.m2.x,y:g.m2.y,im:mim(Math.hypot(g.m2.x-px,g.m2.y-py)),sh:1.05,lf:0,al:Math.max(.3,lt(g.m2.x,g.m2.y,L))});if(g.m3&&!g.m3.off)it.push({x:g.m3.x,y:g.m3.y,im:mim(Math.hypot(g.m3.x-px,g.m3.y-py)),sh:1.05,lf:0,al:Math.max(.3,lt(g.m3.x,g.m3.y,L))});if(g.fin&&g.sm)for(const[x,y]of g.sm)it.push({x,y,im:mim(Math.hypot(x-px,y-py)),sh:1.05,lf:0,al:Math.max(.35,lt(x,y,L))});
 if(!mo.off)it.push({x:mo.x,y:mo.y,im:mim(md),sh:1.05,lf:0,al:Math.max(.3,lt(mo.x,mo.y,L))});
 it.forEach(o=>{o.ty=0;const rx=o.x-px,ry=o.y-py,iv=1/(plx*dy-dx*ply),tx=iv*(dy*rx-dx*ry);o.ty=iv*(-ply*rx+plx*ry);o.tx=tx}); it.sort((a,b)=>b.ty-a.ty);
 for(const o of it){if(o.ty<.15||!o.im.naturalWidth)continue;const sc=H/o.ty,h=sc*o.sh,w=h*o.im.naturalWidth/o.im.naturalHeight,sx=W/2*(1+o.tx/o.ty),top=hor+sc*eh-sc*o.lf-h,iw=o.im.naturalWidth,ih=o.im.naturalHeight;cx.globalAlpha=o.al;
  for(let x=Math.max(0,sx-w/2|0);x<Math.min(W,sx+w/2);x+=2){if(o.ty>=zb[x])continue;cx.drawImage(o.im,(x-(sx-w/2))/w*iw,0,Math.max(1,2/w*iw),ih,x,top,2,h)}
  if(o.nm&&o.ty<9&&sx>0&&sx<W&&o.ty<zb[sx|0]){cx.font=`bold ${Math.max(7,Math.min(13,sc*.11))|0}px sans-serif`;cx.textAlign='center';cx.fillStyle='#f0e2b0';cx.fillText(o.nm,sx,top-3)}cx.globalAlpha=1}
 if(g.hid>=0&&m3){const sh=H*.075,sy=hor-sh/2,gr=cx.createLinearGradient(0,sy-6,0,sy+sh+6);cx.fillStyle='#030201';cx.fillRect(0,0,W,sy);cx.fillRect(0,sy+sh,W,H-sy-sh);cx.fillStyle='rgba(3,2,1,.6)';cx.fillRect(0,sy-3,W,3);cx.fillRect(0,sy+sh,W,3);cx.fillStyle='#030201';cx.fillRect(0,0,W*.04,H);cx.fillRect(W*.96,0,W*.04,H)}
 const dn=g.done.filter(x=>x).length;$('hud').innerHTML=`المرحلة ${g.lv}<br>الحواسيب: ${dn}/${g.done.length}<br>${g.door&&!g.dopen?'باب الغرفة: '+g.done.slice(0,g.nm).filter(x=>x).length+'/'+g.nm+'<br>':''}${g.dead?'تشاهد صديقك (اضغط للتبديل)':g.hid>=0?'اضغط E للخروج من الخزانة':g.nc>=0?'اضغط E للاختباء':g.ni>=0?'اضغط E وانتظر':''}${g.lv>=2&&!g.dead?'<br><small>Q: التابلت'+(g.chgT>0?' (مشحون '+(g.chgT|0)+'ث)':'')+'</small>':''}`;
 $('bar').style.display=g.load>0?'block':'none';$('bi').style.width=g.load*100+'%';drawHand(t,g);drawTab(g);for(let i=0;i<3;i++){const e=$('sl'+i),v=inv[i]||'';if(e.dataset.v!=v){e.dataset.v=v;e.innerHTML=`<b>${i+1}</b>`+(v?`<img src="assets/${v}.png">`:'')}}$('si').style.width=g.st+'%';$('si').className=g.ex?'ex':'';$('eb').style.background=(g.ni>=0||g.nc>=0||g.hid>=0)?'#c33a':'#0008';
 $('vg').style.boxShadow=`inset 0 0 120px rgba(200,0,0,${g.vg*.7})`}
// ---------- input ----------
addEventListener('keydown',e=>{keys[e.code]=1;if(e.code=='KeyE'){E=1;if(!e.repeat)Ep=1}if(e.code=='KeyQ'&&!e.repeat)toggleTab();if(e.code=='Space'&&G)G.sp++;if(/^Digit[123]$/.test(e.code))useItem(+e.code[5]-1)});addEventListener('keyup',e=>{keys[e.code]=0;if(e.code=='KeyE')E=0});
cv.onclick=()=>{if(!mob&&cv.requestPointerLock)cv.requestPointerLock();if(G&&G.dead)G.sp++};
addEventListener('mousemove',e=>{if(document.pointerLockElement===cv){look.dx+=e.movementX*.4;look.dy+=e.movementY*.4}});
cv.addEventListener('touchstart',e=>{for(const t of e.changedTouches){const m=t.clientX<innerWidth*.45;tch[t.identifier]={sx:t.clientX,sy:t.clientY,px:t.clientX,py:t.clientY,m};if(m){const j=$('jb');j.style.display='block';j.style.left=t.clientX+'px';j.style.top=t.clientY+'px'}}if(G&&G.dead)G.sp++;e.preventDefault()},{passive:false});
cv.addEventListener('touchmove',e=>{for(const t of e.changedTouches){const o=tch[t.identifier];if(!o)continue;if(o.m){let x=(t.clientX-o.sx)/55,y=(t.clientY-o.sy)/55;const l=Math.hypot(x,y);if(l>1){x/=l;y/=l}const a=l<.15?0:1;mv={x:x*a,y:y*a};mrun=l>1.15?1:0;$('jk').style.transform=`translate(${x*45}px,${y*45}px)`;$('jb').className=mrun?'r':''}else{look.dx+=(t.clientX-o.px)*1.3;look.dy+=(t.clientY-o.py)*1.3;o.px=t.clientX;o.py=t.clientY}}e.preventDefault()},{passive:false});
const te=e=>{for(const t of e.changedTouches){const o=tch[t.identifier];if(o&&o.m){mv={x:0,y:0};mrun=0;jbHome();$('jb').className='';$('jk').style.transform=''}delete tch[t.identifier]}};cv.addEventListener('touchend',te);cv.addEventListener('touchcancel',te);
$('eb').addEventListener('touchstart',e=>{E=1;Ep=1;e.preventDefault()});$('qb').addEventListener('touchstart',e=>{toggleTab();e.preventDefault()});$('eb').addEventListener('touchend',()=>E=0);
function jbHome(){if(!mob)return;const j=$('jb');j.style.display='block';j.style.left='16vw';j.style.top='68vh'}
function useItem(i){const g=G,it=inv[i];if(!g||g.dead||g.shop||!it||g.hid>=0)return;if(it=='chg'&&g.lv<2){msg('الشاحن يُستخدم من المرحلة الثانية (التابلت)',2500);return}inv[i]=0;g.an={k:it,s:performance.now()/1e3};const f=$('fx');f.className='';void f.offsetWidth;f.className='fx-'+it;
 if(it=='can'){g.boost=25;sfx('drink',.9);msg('مشروب! سرعة أكبر 25 ثانية')}else if(it=='usb'){g.fast=1;msg('الفلاشة: الاختراق أسرع')}
 else if(it=='chg'){g.chgT=45;chgUsed=1;g.tab=1;msg('تم شحن التابلت! يكشف الوحش واللاعبين والحواسيب 45 ثانية',3500)}
 else{const me=g.me,x=me.x+Math.cos(me.a)*.9,y=me.y+Math.sin(me.a)*.9,o=free(x,y)?[x,y]:[me.x,me.y];g.crow={x:o[0],y:o[1],e:0,r:0,t:70};if(!isH)hc.send({t:'k',x:o[0],y:o[1]});msg('وضعت الغراب الميت')}}
$('inv').addEventListener('pointerdown',e=>{const b=e.target.closest('.sl');if(b)useItem(+b.dataset.i);e.preventDefault()});
const ITEMS=[{id:'crow',n:'الغراب الميت',d:'ضعه على الأرض: الوحش يذهب إليه ويأكله 30 ثانية، وتقدر تعدي من جواه'},{id:'usb',n:'الفلاشة',d:'تجعل مهمة الكمبيوتر أسرع بقية المرحلة'},{id:'can',n:'المشروب',d:'سرعة وجري أطول لمدة 25 ثانية'},{id:'chg',n:'الشاحن',d:'يشحن التابلت 45 ثانية: يكشف مكان الوحش واللاعبين والحواسيب. مرة واحدة في اللعبة'}];
let shI=0,picked=0,rdy={},bought=[];const av=()=>ITEMS.filter(i=>!bought.includes(i.id)&&!(i.id=='chg'&&(chgUsed||inv.includes('chg'))));
function shR(){const l=av();shI%=l.length;const it=l[shI];$('shi').src=`assets/${it.id}.png`;$('shn').textContent=it.n;$('shd').textContent=it.d;$('shb').textContent=picked?'تم ✔':'خذ';$('shb').disabled=!!picked}
function openShop(){if(!G)return;if(!av().length)bought=[];if(HG)HG.gain.value=0;if(CG)CG.gain.value=0;G.shop=1;Object.values(SND).forEach(a=>a!==SND.song&&a.pause());document.exitPointerLock&&document.exitPointerLock();shI=0;picked=0;$('shw').textContent='';$('shgo').disabled=false;document.body.className='';$('jb').style.display='none';S(4);shR();SND.shop.currentTime=0;SND.shop.play().catch(()=>{})}
function chk(){if(isH&&G&&G.shop&&rdy.H&&conns.every(c=>rdy[c.peer])){rdy={};nxt()}}
$('sl').onclick=()=>{shI=(shI+1)%av().length;shR()};$('sr').onclick=()=>{shI=(shI+av().length-1)%av().length;shR()};
$('shb').onclick=()=>{if(picked)return;const q=inv.indexOf(0);if(q<0){$('shw').textContent='الحقيبة ممتلئة';return}const it=av()[shI];inv[q]=it.id;bought.push(it.id);picked=1;shR()};
$('shgo').onclick=()=>{$('shgo').disabled=true;$('shw').textContent='بانتظار باقي اللاعبين...';if(isH){rdy.H=1;chk()}else hc.send({t:'r'})};
$('cpb').onclick=()=>{if(!isH)return;const d={t:'go',seed:Math.random()*1e9|0,sz:lastSz,lv:CPL,cp:1,rs:1};bc(d);startGame(d)};

// ---------- cabinets (hiding) ----------
function mkCab(m,mw,mh,sd,c,sz){const r=rng((sd^0x9e3779b9)|0),cand=[];
 for(let y=1;y<mh-1;y++)for(let x=1;x<mw-1;x++){if(m[y][x]!==0||x+y<9)continue;const L=m[y][x-1]===0,R=m[y][x+1]===0,U=m[y-1][x]===0,D=m[y+1][x]===0,w=[];
  if(L&&R&&!U&&!D)w.push([0,-1],[0,1]);else if(U&&D&&!L&&!R)w.push([-1,0],[1,0]);else continue;
  if(c.some(k=>Math.hypot(k[0]-x-.5,k[1]-y-.5)<2.2))continue;cand.push([x,y,w[r()*2|0]])}
 const o=[],n=2+sz;while(cand.length&&o.length<n){const[x,y,w]=cand.splice(r()*cand.length|0,1)[0];if(o.some(b=>Math.abs(b.cx-x)+Math.abs(b.cy-y)<5.5))continue;
  const hw=CABH*.654/2,hd=.2;o.push({i:o.length,cx:x,cy:y,x:x+.5+w[0]*.3,y:y+.5+w[1]*.3,fx:-w[0],fy:-w[1],hw,hd,hx:w[0]?hd:hw,hy:w[1]?hd:hw})}
 return o}
function cabHit(px,py,rx,ry,b){let t0=-1e9,t1=1e9,ax=-1;
 for(let a=0;a<2;a++){const o=a?py:px,r=a?ry:rx,c=a?b.y:b.x,h=a?b.hy:b.hx;
  if(Math.abs(r)<1e-9){if(o<c-h||o>c+h)return null;continue}
  let ta=(c-h-o)/r,tb=(c+h-o)/r;if(ta>tb){const q=ta;ta=tb;tb=q}
  if(ta>t0){t0=ta;ax=a}if(tb<t1)t1=tb}
 if(t0<.05||t0>t1||ax<0)return null;
 const qx=px+rx*t0,qy=py+ry*t0,fa=b.fx?0:1,front=ax==fa&&((fa?ry:rx)*(fa?b.fy:b.fx)<0);
 return[t0,front,((qx-b.x)*b.fy-(qy-b.y)*b.fx)/(2*b.hw)+.5,qx,qy,ax]}
function cabCol(g,i,px,py,rx,ry,hor,eh,amb,L){let bt=zb[i],bh=null;
 for(const b of g.cab){if(b.i==g.hid)continue;const h=cabHit(px,py,rx,ry,b);if(h&&h[0]<bt){bt=h[0];bh=h}}
 if(!bh)return;zb[i]=bt;const lh=H/bt,hg=lh*CABH,top=hor+eh*lh-hg,v=Math.min(1,.12*amb+lt(bh[3],bh[4],L));
 if(bh[1]){const im=IM.cab;if(im.naturalWidth){cx.drawImage(im,Math.max(0,Math.min(im.naturalWidth-1,bh[2]*im.naturalWidth|0)),0,1,im.naturalHeight,i,top,1,hg)}else{cx.fillStyle='#889';cx.fillRect(i,top,1,hg)}
  cx.fillStyle=`rgba(14,9,3,${Math.min(.93,Math.max(0,1-v*.95))})`;cx.fillRect(i,top,1,hg)}
 else{const k=bh[5]?.78:1;cx.fillStyle=`rgb(${118*v*k|0},${121*v*k|0},${126*v*k|0})`;cx.fillRect(i,top,1,hg);cx.fillStyle='rgba(0,0,0,.3)';cx.fillRect(i,top,1,hg*.08)}}
function hide(i){const g=G,b=g.cab[i],me=g.me;if(g.hcd>0){msg('انتظر قليلاً...',1000);return}
 let seen=0;for(const m of[g.mon,g.m2,g.m3]){if(!m||m.off)continue;const rx=m.x-me.x,ry=m.y-me.y,d=Math.hypot(rx,ry);if(d<10&&cast(me.x,me.y,rx/d,ry/d)[0]>d-.3)seen=1}
 g.hid=i;g.hseen=seen;g.tab=0;me.x=b.x+b.fx*b.hd;me.y=b.y+b.fy*b.hd;me.a=Math.atan2(b.fy,b.fx);pitch=0;
 if(seen){sfx('talk2');msg('الوحش شافك وانت داخل!',2500)}}
function unhide(){const g=G,b=g.cab[g.hid],me=g.me;me.x=b.x+b.fx*.45;me.y=b.y+b.fy*.45;g.hid=-1;g.hseen=0;g.hcd=3}
// ---------- tablet ----------
const tcv=$('tbc'),tcx=tcv.getContext('2d');
function toggleTab(){const g=G;if(!g||g.dead||g.shop)return;if(g.lv<2){msg('التابلت يظهر من المرحلة الثانية',2000);return}g.tab=!g.tab}
function drawTab(g){const tb=$('tb');if(!g.tab||g.dead){if(tb.style.display!='none')tb.style.display='none';return}tb.style.display='block';
 const c=tcx,w=tcv.width,h=tcv.height,s=Math.min((w-12)/g.w,(h-34)/g.h),ox=(w-g.w*s)/2,oy=(h-g.h*s)/2+12,X=x=>ox+x*s,Y=y=>oy+y*s,ch=g.chgT>0,me=g.me;
 c.fillStyle='#04120a';c.fillRect(0,0,w,h);
 for(let y=0;y<g.h;y++)for(let x=0;x<g.w;x++){const v=M[y]&&M[y][x];if(v===0){c.fillStyle='#1b5233';c.fillRect(X(x),Y(y),s+.6,s+.6)}else if(v===2){c.fillStyle='#8a3a2a';c.fillRect(X(x),Y(y),s+.6,s+.6)}}
 c.font='bold 15px sans-serif';c.textAlign='center';
 if(ch){g.c.forEach((p,i)=>{c.fillStyle=g.done[i]?'#3a6a4a':'#ffc84a';c.fillRect(X(p[0])-s*.4,Y(p[1])-s*.4,s*.8,s*.8)});
  const self=isH?'H':myId;for(const[k,p]of Object.entries(g.P)){if(k==self||p.d)continue;c.fillStyle='#4aa8ff';c.beginPath();c.arc(X(p.x),Y(p.y),s*.5,0,6.3);c.fill();if(p.n){c.fillStyle='#cfe8ff';c.fillText(p.n,X(p.x),Y(p.y)-s*.7)}}
  for(const m of[g.mon,g.m2,g.m3]){if(!m||m.off)continue;const pu=.6+.4*Math.sin(performance.now()/180);c.fillStyle=`rgba(255,40,40,${.25*pu})`;c.beginPath();c.arc(X(m.x),Y(m.y),s*1.6,0,6.3);c.fill();c.fillStyle='#ff3030';c.beginPath();c.arc(X(m.x),Y(m.y),s*.62,0,6.3);c.fill()}}
 c.save();c.translate(X(me.x),Y(me.y));c.rotate(me.a);c.fillStyle='#ffe066';c.beginPath();c.moveTo(s*.8,0);c.lineTo(-s*.55,s*.55);c.lineTo(-s*.35,0);c.lineTo(-s*.55,-s*.55);c.closePath();c.fill();c.restore();
 c.fillStyle=ch?'#7fff9f':'#7fbf8f';c.fillText(ch?'⚡ مشحون '+(g.chgT|0)+'ث':'موقعك فقط — استخدم الشاحن لكشف الباقي',w/2,15)}

requestAnimationFrame(loop);
