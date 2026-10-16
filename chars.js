// ── 人物紙娃娃產生器（Q 版、方圓臉、六層）：遊戲與示範頁共用。改人物畫法只改這裡 ──
const OUT='#4A3428', SKIN='#F8D9BF', MANNEQUIN='#E6DCCD', SHOE='#3B2E2A';
const STAGES={toddler:{H:96,r:28,W:30,T:22},child:{H:118,r:31,W:36,T:30},teen:{H:138,r:32,W:40,T:38},adult:{H:152,r:34,W:44,T:42},elder:{H:148,r:34,W:48,T:44}};
const ALL=['body','bottom','top','hair','acc','prop'];
const SIN=Math.sin(12*Math.PI/180);
// 方圓形（squircle）：kt/kb 越接近 1 越方；上方偏方、下巴稍圓
const sq=(cx,cy,hw,top,bot,kt=.9,kb=.74)=>`M${cx-hw} ${cy} C${cx-hw} ${cy-(cy-top)*kt} ${cx-hw*kt} ${top} ${cx} ${top} C${cx+hw*kt} ${top} ${cx+hw} ${cy-(cy-top)*kt} ${cx+hw} ${cy} C${cx+hw} ${cy+(bot-cy)*kb} ${cx+hw*kb} ${bot} ${cx} ${bot} C${cx-hw*kb} ${bot} ${cx-hw} ${cy+(bot-cy)*kb} ${cx-hw} ${cy}Z`;
function fig(sp,layers=ALL){
  const cx=60,G=210,on=l=>layers.includes(l),A=on('acc')?(sp.acc||[]):[];
  const wrap=s=>`<g stroke="${OUT}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round">${s}</g>`;
  const cheeks=(y,r)=>`<ellipse cx="${cx-r*.68}" cy="${y}" rx="6" ry="3.4" fill="#F4A6A0" stroke="none" opacity=".75"/><ellipse cx="${cx+r*.68}" cy="${y}" rx="6" ry="3.4" fill="#F4A6A0" stroke="none" opacity=".75"/>`;
  if(sp.stage==='baby'){ // 包巾寶寶
    const hy=G-58;
    return wrap(`<ellipse cx="${cx}" cy="${G-26}" rx="24" ry="27" fill="${sp.wrap}"/><path d="M${cx-20} ${G-34} Q${cx} ${G-16} ${cx+20} ${G-34}" fill="none"/>
      <path d="${sq(cx,hy,22,hy-20,hy+20,.9,.85)}" fill="${sp.wrap}"/><path d="${sq(cx,hy+3,15.5,hy-10,hy+16,.9,.75)}" fill="${SKIN}"/>
      <path d="M${cx-2} ${hy-11} q4 -6 7 -1" fill="none"/>
      <path d="M${cx-9} ${hy+3} q3 3 6 0 M${cx+3} ${hy+3} q3 3 6 0" fill="none" stroke-width="2"/>`)+cheeks(hy+9,15);
  }
  const {H,r,W,T}=STAGES[sp.stage],cy=G-H+r,sh=cy+r-3,hip=sh+T,hc=sp.hairColor,elder=sp.stage==='elder';
  const topOn=on('top'),botOn=on('bottom'),bot=botOn?sp.bottom:'',hair=on('hair')?sp.hair:'';
  const kidLegs=['skirt','shorts','dress'].includes(bot);
  let s='';
  // ── 後層：頭紗、後髮 ──
  if(A.includes('veil'))s+=`<path d="M${cx-r*.5} ${cy-r*.85} Q${cx-r*1.55} ${cy+r*.4} ${cx-r*1.4} ${hip+12} L${cx+r*1.4} ${hip+12} Q${cx+r*1.55} ${cy+r*.4} ${cx+r*.5} ${cy-r*.85}Z" fill="#FFFFFF" fill-opacity=".9" stroke="#C9BBA8"/>`;
  // 頭髮外框＝比臉大一圈的方圓形（hw 半寬、htop 頂、hyc 中線）；前髮＝外框上半＋瀏海邊線
  const hw=r*(hair==='curly'?1.3:1.22),htop=cy-r*(hair==='curly'?1.2:1.12),hyc=cy+r*.04;
  const topHalf=`C${cx-hw} ${hyc-(hyc-htop)*.92} ${cx-hw*.92} ${htop} ${cx} ${htop} C${cx+hw*.92} ${htop} ${cx+hw} ${hyc-(hyc-htop)*.92} ${cx+hw} ${hyc}`;
  const front=(yL,yR,fringe)=>`<path d="M${cx-hw} ${yL} V${hyc} ${topHalf} V${yR} ${fringe}Z" fill="${hc}"/>`;
  const HO=`transform-origin:${cx}px ${cy+r}px`; // 擺頭的轉軸＝脖子
  s+=`<g class="hb" style="${HO}">`;
  if(hair==='side'||hair==='short')s+=`<path d="${sq(cx,hyc,hw,htop,cy+r*.5,.92,.9)}" fill="${hc}"/>`;
  if(hair==='bob')s+=`<path d="${sq(cx,hyc,hw,htop,cy+r*.85,.92,.95)}" fill="${hc}"/>`;
  if(hair==='long')s+=`<path d="${sq(cx,hyc,hw,htop,sh+T*.5,.92,.97)}" fill="${hc}"/>`;
  if(hair==='ponytail')s+=`<path d="${sq(cx+hw*.86,cy+r*.45,r*.32,cy-r*.25,sh+T*.4,.9,.8)}" fill="${hc}"/><path d="${sq(cx,hyc,hw,htop,cy+r*.45,.92,.9)}" fill="${hc}"/>`;
  if(hair==='bun')s+=`<path d="${sq(cx,htop-r*.22,r*.44,htop-r*.64,htop+r*.2,.9,.9)}" fill="${hc}"/><path d="${sq(cx,hyc,hw,htop,cy+r*.5,.92,.9)}" fill="${hc}"/>`;
  if(hair==='curly')s+=`<path d="${sq(cx,hyc,hw,htop,cy+r*.6,.9,.85)}" fill="${hc}"/>`;
  s+='</g>';
  // ── 腿、襪、鞋 ──
  const legC=bot==='pants'?sp.bottomColor:bot?SKIN:MANNEQUIN,lw=W*.32;
  if(bot!=='gown'){
    s+=`<rect x="${cx-W*.36}" y="${hip-4}" width="${lw}" height="${G-hip-2}" rx="4" fill="${legC}"/><rect x="${cx+W*.04}" y="${hip-4}" width="${lw}" height="${G-hip-2}" rx="4" fill="${legC}"/>`;
    if(kidLegs)s+=`<rect x="${cx-W*.37}" y="${G-17}" width="${lw+1}" height="10" fill="#FFFFFF"/><rect x="${cx+W*.03}" y="${G-17}" width="${lw+1}" height="10" fill="#FFFFFF"/>`;
    s+=`<ellipse cx="${cx-W*.21}" cy="${G-4}" rx="${W*.22}" ry="5.5" fill="${sp.shoe||SHOE}"/><ellipse cx="${cx+W*.21}" cy="${G-4}" rx="${W*.22}" ry="5.5" fill="${sp.shoe||SHOE}"/>`;
  }
  if(bot==='pants'&&sp.belt)s+=`<rect x="${cx-W/2+2}" y="${hip-6}" width="${W-4}" height="6" fill="#5A3E2B"/><rect x="${cx-4}" y="${hip-7}" width="8" height="8" rx="1.5" fill="#D9B44A" stroke-width="1.6"/>`;
  if(bot==='shorts')s+=`<path d="M${cx-W*.46} ${hip-6} H${cx+W*.46} L${cx+W*.44} ${hip+14} H${cx+2} L${cx} ${hip+6} L${cx-2} ${hip+14} H${cx-W*.44}Z" fill="${sp.bottomColor}"/>`;
  if(bot==='skirt'||bot==='dress'){const k=(G-hip)*.6,c=bot==='dress'?sp.topColor:sp.bottomColor;
    s+=`<path d="M${cx-W*.46} ${hip-8} L${cx+W*.46} ${hip-8} L${cx+W*.64} ${hip+k} L${cx-W*.64} ${hip+k}Z" fill="${c}"/>`;
    if(bot==='skirt')s+=`<path d="M${cx-W*.22} ${hip-4} L${cx-W*.3} ${hip+k} M${cx} ${hip-4} V${hip+k} M${cx+W*.22} ${hip-4} L${cx+W*.3} ${hip+k}" fill="none" stroke-width="1.6"/>`}
  // ── 身體（上衣） ──
  const bodyC=topOn?sp.topColor:MANNEQUIN;
  s+=`<rect x="${cx-W/2}" y="${sh}" width="${W}" height="${T+3-(bot==='dress'?8:0)}" rx="11" fill="${bodyC}"/>`;
  if(topOn){const t=sp.top;
    if(t==='shirt')s+=`<path d="M${cx-10} ${sh} L${cx} ${sh+7} L${cx-3} ${sh+13}Z M${cx+10} ${sh} L${cx} ${sh+7} L${cx+3} ${sh+13}Z" fill="#FFFFFF" stroke-width="1.8"/><line x1="${cx}" y1="${sh+8}" x2="${cx}" y2="${hip-4}" stroke-width="1.6"/><rect x="${cx+W*.14}" y="${sh+14}" width="${W*.2}" height="${W*.2}" rx="1.5" fill="none" stroke-width="1.6"/>`;
    if(t==='suit')s+=`<path d="M${cx-8} ${sh+1} L${cx+8} ${sh+1} L${cx} ${sh+T*.55}Z" fill="#FFFFFF"/><path d="M${cx-2.5} ${sh+4} L${cx+2.5} ${sh+4} L${cx+4} ${sh+T*.42} L${cx} ${sh+T*.52} L${cx-4} ${sh+T*.42}Z" fill="${sp.tie}" stroke-width="1.6"/>
      <path d="M${cx-8} ${sh+1} L${cx-3} ${sh+T*.6} M${cx+8} ${sh+1} L${cx+3} ${sh+T*.6}" fill="none" stroke-width="1.8"/><circle cx="${cx}" cy="${sh+T*.78}" r="1.8" fill="${OUT}" stroke="none"/>`;
    if(t==='sweater')s+=`<path d="M${cx-9} ${sh} L${cx} ${sh+14} L${cx+9} ${sh}" fill="#FFFFFF" stroke-width="1.8"/><path d="M${cx-12} ${sh+T*.55} l6 -7 l6 7 l-6 7Z M${cx} ${sh+T*.55} l6 -7 l6 7 l-6 7Z" fill="#00000022" stroke="none"/><rect x="${cx-W/2}" y="${hip-5}" width="${W}" height="8" rx="3" fill="${bodyC}" stroke-width="1.8"/>`;
    if(t==='blouse')s+=`<path d="M${cx} ${sh+1} q-9 0 -11 9 q9 2 11 -9Z M${cx} ${sh+1} q9 0 11 9 q-9 2 -11 -9Z" fill="#FFFFFF" stroke-width="1.8"/>`;
    if(t==='sailor')s+=`<path d="M${cx-W/2+2} ${sh+2} L${cx} ${sh+18} L${cx+W/2-2} ${sh+2}" fill="#F19BA8" stroke-width="1.8"/><path d="M${cx-5} ${sh+16} L${cx} ${sh+21} L${cx+5} ${sh+16} L${cx+3} ${sh+27} L${cx} ${sh+23} L${cx-3} ${sh+27}Z" fill="#D9473A" stroke-width="1.6"/>`;
    if(t==='cardigan')s+=`<rect x="${cx-9}" y="${sh}" width="18" height="${T+3}" fill="#FFF6E6"/><g fill="#F19BA8" stroke="none"><circle cx="${cx-4}" cy="${sh+14}" r="2"/><circle cx="${cx+4}" cy="${sh+22}" r="2"/><circle cx="${cx-3}" cy="${sh+31}" r="2"/></g><path d="M${cx-9} ${sh} V${hip+3} M${cx+9} ${sh} V${hip+3}" stroke-width="1.8"/><path d="M${cx} ${sh+1} q-7 0 -9 7 q7 1 9 -7Z M${cx} ${sh+1} q7 0 9 7 q-7 1 -9 -7Z" fill="#FFFFFF" stroke-width="1.6"/>`;
    if(t==='tee')s+=`<path d="M${cx-8} ${sh+1} Q${cx} ${sh+8} ${cx+8} ${sh+1}" fill="none" stroke-width="1.8"/>`;
    if(t==='dress')s+=`<path d="M${cx-6} ${sh+2} L${cx} ${sh+8} L${cx+6} ${sh+2}" fill="#FFFFFF" stroke-width="1.6"/><path d="M${cx-4} ${sh+9} l4 3 l4 -3 l-1 6 l-3 -2 l-3 2Z" fill="#D9473A" stroke-width="1.4"/>`;
    if(t==='bodice')s+=`<path d="M${cx-W/2+4} ${sh+6} Q${cx-W/4} ${sh+12} ${cx} ${sh+7} Q${cx+W/4} ${sh+12} ${cx+W/2-4} ${sh+6}" fill="none" stroke="#C9BBA8" stroke-width="1.8"/>`;
  }
  if(bot==='gown'){const w=hip-T*.35;
    s+=`<path d="M${cx-W*.42} ${w} L${cx+W*.42} ${w} Q${cx+W*.62} ${G-34} ${cx+W*.95} ${G-2} L${cx-W*.95} ${G-2} Q${cx-W*.62} ${G-34} ${cx-W*.42} ${w}Z" fill="${sp.bottomColor}"/>
      <path d="M${cx-W*.2} ${w+10} Q${cx-W*.3} ${G-30} ${cx-W*.45} ${G-4} M${cx+W*.2} ${w+10} Q${cx+W*.3} ${G-30} ${cx+W*.45} ${G-4}" fill="none" stroke="#C9BBA8" stroke-width="1.6"/>`}
  // ── 手臂（袖子）＋手；記下右手位置給道具用 ──
  const L=T*.82,short=topOn&&sp.sleeve==='short';let hand={x:0,y:0};
  for(const d of [-1,1]){const px=cx+d*(W/2-3),py=sh+6,rot=d<0?12:-12,hx=px+d*L*SIN,hy=py+L-4;
    if(d<0)s+=`<g class="arm" style="transform-origin:${px}px ${py}px">`;
    s+=`<rect x="${px-5.5}" y="${py-4}" width="11" height="${L}" rx="5.5" fill="${short?SKIN:bodyC}" transform="rotate(${rot} ${px} ${py})"/>`;
    if(short)s+=`<rect x="${px-6.5}" y="${py-5}" width="13" height="${L*.42}" rx="6" fill="${bodyC}" transform="rotate(${rot} ${px} ${py})"/>`;
    s+=`<circle cx="${hx}" cy="${hy}" r="5.5" fill="${SKIN}"/>`;if(d<0)s+='</g>';if(d>0)hand={x:hx,y:hy}}
  // ── 脖子、耳朵、頭 ──
  s+=`<rect x="${cx-6}" y="${cy+r-9}" width="12" height="10" fill="${SKIN}" stroke="none"/>`;
  s+=`<g class="hf" style="${HO}">`;
  if(!['bob','long'].includes(hair))s+=`<circle cx="${cx-r*1.15}" cy="${cy+r*.14}" r="7" fill="${SKIN}"/><circle cx="${cx+r*1.15}" cy="${cy+r*.14}" r="7" fill="${SKIN}"/>`;
  s+=`<path d="${sq(cx,cy+r*.04,r*1.13,cy-r*.96,cy+r)}" fill="${SKIN}"/>`;
  // ── 臉：眉毛＋眼睛（長輩笑瞇眼＋魚尾紋）＋嘴 ──
  const ey=cy+r*.2,ex=r*.42,bc=sp.brow||(elder?'#9C948A':'#3A2A22');
  s+=`<path d="M${cx-ex-5} ${ey-10} Q${cx-ex} ${ey-13} ${cx-ex+5} ${ey-10} M${cx+ex-5} ${ey-10} Q${cx+ex} ${ey-13} ${cx+ex+5} ${ey-10}" fill="none" stroke="${bc}" stroke-width="${elder?3.2:2.4}"/>`;
  s+=elder
    ?`<path d="M${cx-ex-4.5} ${ey+1} Q${cx-ex} ${ey-4} ${cx-ex+4.5} ${ey+1} M${cx+ex-4.5} ${ey+1} Q${cx+ex} ${ey-4} ${cx+ex+4.5} ${ey+1}" fill="none" stroke-width="2.2"/><path d="M${cx-ex-9} ${ey-2} l-3 -2 M${cx-ex-9} ${ey+2} l-3 2 M${cx+ex+9} ${ey-2} l3 -2 M${cx+ex+9} ${ey+2} l3 2" stroke-width="1.4"/>`
    :`<g stroke="none"><ellipse cx="${cx-ex}" cy="${ey}" rx="4" ry="5" fill="#3A2A22"/><ellipse cx="${cx+ex}" cy="${ey}" rx="4" ry="5" fill="#3A2A22"/><circle cx="${cx-ex+1.3}" cy="${ey-2}" r="1.5" fill="#fff"/><circle cx="${cx+ex+1.3}" cy="${ey-2}" r="1.5" fill="#fff"/></g>`;
  s+=`<path d="M${cx-4.5} ${cy+r*.46} Q${cx} ${cy+r*.46+4.5} ${cx+4.5} ${cy+r*.46}" fill="none" stroke-width="2"/>`;
  // ── 前髮 ──
  const R=r,tuft=(x,y,dx)=>`<path d="M${x} ${y} q${dx*.3} ${-R*.3} ${dx} ${-R*.26} q${-dx*.25} ${R*.14} ${-dx*.05} ${R*.3}Z" fill="${hc}"/>`;
  if(hair==='side')s+=tuft(cx-R*.35,htop+R*.08,R*.32)+tuft(cx+R*.05,htop+R*.02,R*.3)+front(cy+R*.15,cy+R*.15,`Q${cx+hw*.92} ${cy-R*.3} ${cx+R*.6} ${cy-R*.42} Q${cx+R*.15} ${cy-R*.3} ${cx-R*.2} ${cy-R*.64} Q${cx-R*.6} ${cy-R*.38} ${cx-R*.88} ${cy-R*.34} Q${cx-hw*.98} ${cy-R*.2} ${cx-hw} ${cy+R*.15}`);
  if(hair==='short')s+=tuft(cx-R*.2,htop+R*.06,R*.3)+tuft(cx+R*.15,htop+R*.06,R*.28)+front(cy+R*.05,cy+R*.05,`L${cx+R*.85} ${cy-R*.36} L${cx+R*.55} ${cy-R*.3} L${cx+R*.32} ${cy-R*.48} L${cx+R*.06} ${cy-R*.32} L${cx-R*.2} ${cy-R*.5} L${cx-R*.46} ${cy-R*.32} L${cx-R*.85} ${cy-R*.36}`);
  if(hair==='bob')s+=front(cy+R*.8,cy+R*.8,`H${cx+R*.86} V${cy-R*.28} Q${cx} ${cy-R*.36} ${cx-R*.86} ${cy-R*.28} V${cy+R*.8}`);
  if(hair==='ponytail')s+=front(cy+R*.3,cy+R*.3,`H${cx+R*.88} V${cy} Q${cx+R*.7} ${cy-R*.55} ${cx-R*.15} ${cy-R*.66} Q${cx-R*.72} ${cy-R*.42} ${cx-R*.88} ${cy+R*.05} V${cy+R*.3}`);
  if(hair==='long')s+=front(cy+R*.95,cy+R*.95,`H${cx+R*.88} V${cy} Q${cx+R*.7} ${cy-R*.55} ${cx-R*.15} ${cy-R*.66} Q${cx-R*.72} ${cy-R*.42} ${cx-R*.88} ${cy+R*.05} V${cy+R*.95}`);
  if(hair==='bun')s+=front(cy+R*.28,cy+R*.28,`Q${cx+R*.92} ${cy-R*.45} ${cx} ${cy-R*.74} Q${cx-R*.92} ${cy-R*.45} ${cx-hw} ${cy+R*.28}`);
  if(hair==='curly'){let f=`L${cx+R*.95} ${cy-R*.3}`;for(let i=1;i<=5;i++){const x=R*.95-i*R*.38;f+=` Q${cx+x+R*.19} ${cy-R*.06} ${cx+x} ${cy-R*.3}`}
    s+=front(cy+R*.25,cy+R*.25,f+` L${cx-hw} ${cy+R*.25}`)+[[-.75,-.82],[-.3,-.96],[.15,-.9],[.6,-.84],[-.52,-.58],[.02,-.62],[.5,-.56],[-1.05,-.4],[1.05,-.44]].map(([a,b])=>`<path d="M${cx+R*a-4} ${cy+R*b+2} q1 -6 6 -5 q4 1 2 5" fill="none" stroke="#7E5534" stroke-width="1.8"/>`).join('')}
  // ── 配件 ──
  if(A.includes('glasses'))s+=`<g fill="#FFFFFF" fill-opacity=".35" stroke-width="2"><circle cx="${cx-ex}" cy="${ey}" r="8.5"/><circle cx="${cx+ex}" cy="${ey}" r="8.5"/></g><path d="M${cx-ex+8.5} ${ey} H${cx+ex-8.5}" stroke-width="2"/>`;
  if(A.includes('corsage'))s+=`<circle cx="${cx-W*.27}" cy="${sh+10}" r="4.2" fill="#D9473A" stroke-width="1.6"/>`;
  if(A.includes('bow'))s+=`<g fill="#F19BA8" stroke-width="1.8"><path d="M${cx+R*.55} ${cy-R*.9} l-9 -7 v14Z M${cx+R*.55} ${cy-R*.9} l9 -7 v14Z"/><circle cx="${cx+R*.55}" cy="${cy-R*.9}" r="3"/></g>`;
  if(A.includes('pearl'))s+=`<g fill="#FFFFFF" stroke-width="1.4"><circle cx="${cx-r*1.0}" cy="${cy+r*.45}" r="2.8"/><circle cx="${cx+r*1.0}" cy="${cy+r*.45}" r="2.8"/><circle cx="${cx-r*.3}" cy="${cy-r*1.02}" r="2.6"/><circle cx="${cx}" cy="${cy-r*1.1}" r="2.6"/><circle cx="${cx+r*.3}" cy="${cy-r*1.02}" r="2.6"/></g>`;
  s+=cheeks(cy+r*.44,r)+'</g>';
  if(A.includes('bouquet'))s+=`<g stroke-width="1.8"><path d="M${cx-3} ${hip} L${cx} ${hip+16} L${cx+3} ${hip}Z" fill="#6E9A5B"/><circle cx="${cx-7}" cy="${hip-4}" r="6" fill="#F19BA8"/><circle cx="${cx+7}" cy="${hip-4}" r="6" fill="#F7D57A"/><circle cx="${cx}" cy="${hip-10}" r="6" fill="#FFFFFF"/><circle cx="${cx}" cy="${hip+1}" r="5.5" fill="#F19BA8"/></g>`;
  // ── 道具（拿在右手）＝故事線索 ──
  if(on('prop')&&sp.prop){const {x,y}=hand,p=sp.prop;
    if(p==='suitcase')s+=`<path d="M${x-5} ${y+4} V${y-1} H${x+5} V${y+4}" fill="none" stroke-width="2.2"/><rect x="${x-13}" y="${y+3}" width="26" height="19" rx="3" fill="#A0673F"/><path d="M${x-13} ${y+10} H${x+13}" stroke-width="1.6"/><circle cx="${x}" cy="${y+10}" r="1.8" fill="#D9B44A" stroke-width="1.2"/>`;
    if(p==='book')s+=`<rect x="${x-14}" y="${y-18}" width="17" height="21" rx="2" fill="#B5566A" transform="rotate(-10 ${x} ${y})"/><path d="M${x-12} ${y-15} v16" stroke="#FFFFFF" stroke-width="2" transform="rotate(-10 ${x} ${y})"/>`;
    if(p==='letter')s+=`<g transform="rotate(-8 ${x} ${y})"><rect x="${x-9}" y="${y-8}" width="22" height="15" rx="1.5" fill="#FFFFFF"/><path d="M${x-9} ${y-8} L${x+2} ${y} L${x+13} ${y-8}" fill="none" stroke-width="1.6"/><rect x="${x+6}" y="${y-6}" width="5" height="5" fill="#D9473A" stroke="none"/></g>`;
    if(p==='key')s+=`<circle cx="${x+4}" cy="${y+8}" r="5" fill="none" stroke="#B8902C" stroke-width="2.2"/><path d="M${x+6} ${y+12} l6 10 m-2 -3 l3 -2 m-5 -1 l3 -2" fill="none" stroke="#B8902C" stroke-width="2.4"/>`;
    if(p==='teddy')s+=`<g fill="#C98B4E" stroke-width="1.8"><circle cx="${x+2}" cy="${y+14}" r="7"/><circle cx="${x+2}" cy="${y+3}" r="6"/><circle cx="${x-3}" cy="${y-2}" r="2.6"/><circle cx="${x+7}" cy="${y-2}" r="2.6"/></g>`;
    if(p==='stetho')s+=`<path d="M${cx-9} ${sh+1} Q${cx-11} ${sh+T*.45} ${cx-2} ${sh+T*.5} M${cx+9} ${sh+1} Q${cx+11} ${sh+T*.45} ${cx+2} ${sh+T*.5} M${cx} ${sh+T*.5} Q${cx+12} ${sh+T*.62} ${cx+11} ${sh+T*.78}" fill="none" stroke="#3A3A3A" stroke-width="2.4"/><circle cx="${cx+11}" cy="${sh+T*.82}" r="4.5" fill="#C9CED6" stroke-width="1.8"/>`;
    if(p==='wafer')s+=`<g transform="translate(${x+6} ${y-4})"><path d="M-12 -4 A13 13 0 1 1 -4 12 L-12 4Z" fill="#B9C6D9" stroke-width="1.8"/><path d="M-6 -9 V9 M0 -12 V12 M6 -10 V10 M-11 -3 H11 M-10 3 H11 M-7 9 H8 M-7 -9 H8" stroke="#8B99B0" stroke-width="1"/></g>`;
    if(p==='helmet')s+=`<path d="M${cx-hw} ${cy-r*.28} C${cx-hw} ${htop-r*.28} ${cx+hw} ${htop-r*.28} ${cx+hw} ${cy-r*.28}Z" fill="#F2C230"/><rect x="${cx-hw*1.14}" y="${cy-r*.34}" width="${hw*2.28}" height="7" rx="3.5" fill="#E0A91E"/><path d="M${cx} ${htop-r*.02} V${cy-r*.34}" stroke-width="1.8"/>`;
    if(p==='basketball')s+=`<g transform="translate(${x+4} ${y+6})"><circle r="11" fill="#E8792C"/><path d="M-11 0 H11 M0 -11 V11 M-7 -8.5 Q-2 0 -7 8.5 M7 -8.5 Q2 0 7 8.5" fill="none" stroke-width="1.6"/></g>`;
    if(p==='palette')s+=`<g transform="translate(${x+4} ${y-2}) rotate(-12)"><path d="M-14 -2 C-14 -12 10 -14 14 -4 C17 4 8 4 6 8 C4 13 -14 10 -14 -2Z" fill="#F3E3C3"/><circle cx="-7" cy="-6" r="2.6" fill="#D9473A" stroke="none"/><circle cx="0" cy="-8" r="2.6" fill="#F2C230" stroke="none"/><circle cx="7" cy="-5" r="2.6" fill="#2F93B8" stroke="none"/><circle cx="-8" cy="2" r="2.6" fill="#8DB33A" stroke="none"/></g>`;
    if(p==='laptop')s+=`<g transform="translate(${x+2} ${y-4}) rotate(-8)"><rect x="-14" y="-18" width="28" height="19" rx="2.5" fill="#5E6270"/><rect x="-11" y="-15" width="22" height="13" rx="1" fill="#9ED8EA" stroke="none"/><path d="M0 -12 l1.3 3.2 3.2 1.3 -3.2 1.3 -1.3 3.2 -1.3 -3.2 -3.2 -1.3 3.2 -1.3Z" fill="#FFFFFF" stroke="none"/><rect x="-17" y="1" width="34" height="4" rx="2" fill="#8A8F98"/></g>`;
    if(p==='cup')s+=`<path d="M${x-8} ${y-6} h14 l-2 11 h-10Z" fill="#FFFFFF" stroke-width="1.8"/><path d="M${x+6} ${y-3} q5 0 4 4 q-1 3 -5 2" fill="none" stroke-width="1.8"/>`;
  }
  return wrap(s);
}

