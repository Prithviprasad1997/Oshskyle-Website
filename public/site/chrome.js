(function(){
  const page = document.body.dataset.page || 'home';
  const links = [['home','index.html','Home'],['services','services.html','Services'],['coverage','coverage.html','Coverage'],['track','track.html','Track'],['about','about.html','About'],['careers','careers.html','Careers'],['contact','contact.html','Contact']];
  document.getElementById('nav-slot').innerHTML = `
<div class="announce"><div class="inner">
  <span><span class="d">●</span> Operating 24/7 · +91 6361 212 063 · info@oshskylelogistics.com</span>
  <span>Bengaluru HQ · <a href="track.html">Track a shipment →</a></span>
</div></div>
<div class="nav"><div class="inner">
  <a href="index.html" class="lg" aria-label="Oshskyle Logistics">
    <img src="site/logo-full.png" alt="" style="height:64px;width:64px;object-fit:cover;object-position:center 28%;display:block"/>
    <span style="display:flex;flex-direction:column;line-height:1">
      <span style="font-family:'Fraunces',serif;font-weight:700;font-size:24px;color:#8B1F1F;letter-spacing:-.015em">OSHSKYLE</span>
      <span style="font-family:'JetBrains Mono',monospace;font-size:9px;color:#7A8290;letter-spacing:.26em;margin-top:5px">LOGISTICS PVT LTD</span>
    </span>
  </a>
  <button class="burger" aria-label="Toggle menu" aria-expanded="false"><span></span><span></span><span></span></button>
  <div class="nav-menu">
    <div class="links">${links.map(([k,h,l])=>`<a href="${h}"${page===k?' class="active"':''}>${l}</a>`).join('')}</div>
    <div class="cta"><a href="contact.html#quote" class="btn">Request a quote ↗</a></div>
  </div>
</div></div>`;
  document.getElementById('foot-slot').innerHTML = `
<div class="foot"><div class="container">
  <div class="top">
    <div>
      <div style="display:inline-flex;align-items:center;gap:14px;background:#F8F3E9;padding:14px 20px;border-radius:8px"><img src="site/logo.png" style="height:72px;display:block"/></div>
      <div style="margin-top:18px;line-height:1.7;font-size:14px;color:#C8DDE8"><strong style="color:#fff">Rammahal, 3rd Floor, 2nd Cross</strong><br>Behind Nammura Thindi, Stage 2<br>Naagarbhavi, Bengaluru — 560072<br><br>info@oshskylelogistics.com<br>+91 6361 212 063</div>
      <div class="badges"><span>CHA</span><span>MTO</span><span>ISO 9001</span><span>MSME</span></div>
    </div>
    <div><h4>Services</h4><ul><li><a href="air-freight.html">Air Freight</a></li><li><a href="ocean-freight.html">Ocean Freight</a></li><li><a href="road-trucking.html">Road · Trucking</a></li><li><a href="rail-freight.html">Rail Freight</a></li><li><a href="cold-chain.html">Cold Chain</a></li><li><a href="customs-brokerage.html">Customs Brokerage</a></li></ul></div>
    <div><h4>Company</h4><ul><li><a href="about.html">About</a></li><li><a href="coverage.html">Coverage</a></li><li><a href="about.html#leadership">Leadership</a></li><li><a href="careers.html">Careers</a></li><li><a href="contact.html">Contact</a></li></ul></div>
    <div><h4>Resources</h4><ul><li><a href="track.html">Track shipment</a></li><li><a href="contact.html">Request a quote</a></li><li><a href="https://img1.wsimg.com/blobby/go/fcbd3b7b-36b1-405f-b502-4049056e4132/downloads/79b3814f-84df-4ed1-8258-85a7f3036b6e/Incoterms_2025.pdf?ver=1779978152580" target="_blank" rel="noopener">Incoterms 2025</a></li><li><a href="contact.html#quote">Quote enquiries</a></li></ul></div>
  </div>
  <div class="bot"><span>© 2026 Oshskyle Logistics Private Limited</span><span>Let's move your business forward — together.</span></div>
</div></div>`;

  // Mobile nav toggle
  const nav=document.querySelector('.nav');
  const burger=nav&&nav.querySelector('.burger');
  if(burger){
    burger.addEventListener('click',()=>{const o=nav.classList.toggle('open');burger.setAttribute('aria-expanded',o)});
    nav.querySelectorAll('.nav-menu a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');burger.setAttribute('aria-expanded','false')}));
  }

  // Reveal on scroll
  const io = new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.style.animationDelay=(e.target.dataset.delay||0)+'ms';e.target.classList.add('reveal');io.unobserve(e.target)}}), {threshold:.15});
  document.querySelectorAll('[data-reveal]').forEach(el=>io.observe(el));
})();
const enquiry=document.querySelector('form.quote');
if(enquiry)enquiry.addEventListener('submit',event=>{
  event.preventDefault();
  const fields=Array.from(new FormData(enquiry),([label,value])=>label+': '+value);
  fields.push('Mode: '+(enquiry.querySelector('.mode-btn.on')?.textContent||'Unspecified'));
  location.href='mailto:info@oshskylelogistics.com?subject=Freight%20quote%20enquiry&body='+encodeURIComponent(fields.join('\n'));
});
const directory=document.querySelector('.map-side');
if(directory){
 const entries=[
 [['New Mangalore'],['Kempegowda International'],['ICD Whitefield']],
 [['Chennai','Tuticorin'],['Chennai','Coimbatore','Trichy'],[]],
 [['Cochin','Vizhinjam'],['Cochin','Trivandrum','Calicut'],[]],
 [['Nhava Sheva'],['Chhatrapati Shivaji'],[]],
 [['Mundra'],['Ahmedabad','Surat'],[]],
 [['Visakhapatnam'],['Visakhapatnam'],[]],
 [[],['Indira Gandhi International'],[]]
 ];
 const rows=[...directory.querySelectorAll('.lrow')],buttons=[...directory.querySelectorAll('.tabs button')];
 const original=rows.map(row=>[row.querySelector('.d').textContent,row.querySelector('.c').textContent]);
 buttons.forEach((button,i)=>{button.setAttribute('aria-pressed',String(!i));button.onclick=()=>{
 buttons.forEach(b=>{b.classList.toggle('on',b===button);b.setAttribute('aria-pressed',String(b===button))});
 rows.forEach((row,n)=>{const list=i?entries[n][i-1]:null;row.hidden=!!list&&!list.length;row.querySelector('.d').textContent=list?list.join(' · '):original[n][0];row.querySelector('.c').textContent=list?list.length:original[n][1]});
 }});
}
document.querySelectorAll('.mode-btn').forEach(button=>{
 button.setAttribute('aria-pressed',String(button.classList.contains('on')));
 button.addEventListener('click',()=>document.querySelectorAll('.mode-btn').forEach(b=>{
 b.classList.toggle('on',b===button);b.setAttribute('aria-pressed',String(b===button));
 }));
});
