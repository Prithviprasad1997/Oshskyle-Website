const form=document.getElementById('lookup'),input=document.getElementById('hbl'),notice=document.getElementById('notice'),report=document.getElementById('report');
let sequence=0;
const format=value=>value?new Intl.DateTimeFormat('en-GB',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Kolkata'}).format(new Date(value))+' IST':'Not yet recorded';
const elem=(tag,text)=>{const node=document.createElement(tag);node.textContent=text;return node};
input.oninput=()=>{sequence++;report.hidden=true;notice.textContent='';form.querySelector('button').disabled=false};
form.onsubmit=async e=>{
 e.preventDefault();const hbl=input.value.trim(),id=++sequence,btn=form.querySelector('button');report.hidden=true;
 if(!hbl){notice.textContent='Enter the HBL number printed on your document.';input.focus();return}
 btn.disabled=true;notice.textContent='Looking up your shipment…';
 try{
 const r=await fetch('/.netlify/functions/hbl',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({hbl}),signal:AbortSignal.timeout(12000)});
 const data=await r.json();if(id!==sequence)return;
 if(r.status===404){notice.textContent='No issued shipment matched that HBL. Check the number or contact the shipment desk.';return}
 if(!r.ok)throw Error();
 const events=data.events;document.getElementById('status').textContent=events[0]?.status||'HBL issued';
 const details=document.getElementById('details');details.replaceChildren();
 for(const [label,value] of [['HBL',hbl],['Port of loading',data.origin],['Port of discharge',data.destination],['Estimated arrival',format(data.eta)]]){const d=document.createElement('div');d.append(elem('dt',label),elem('dd',value||'Not yet recorded'));details.append(d)}
 const list=document.getElementById('events');list.replaceChildren(...events.map(v=>elem('li',[v.status,v.place,format(v.date)].filter(Boolean).join(' · '))));if(!events.length)list.append(elem('li','No movement milestones recorded yet.'));
 report.hidden=false;notice.textContent='Shipment found.';
 }catch{if(id===sequence)notice.textContent='Online tracking is unavailable. Please call the shipment desk for an update.'}
 finally{if(id===sequence)btn.disabled=false}
};
