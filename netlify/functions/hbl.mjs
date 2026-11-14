import pg from 'pg';
const labels={GATE_IN:'Gated in',LOADED:'Loaded on board',DEPARTED:'Departed',TRANSHIP:'Transshipment',ARRIVED:'Arrived',DISCHARGED:'Discharged',DELIVERED:'Delivered'};
let pool;
const reply=(status,data)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export const config={rateLimit:{windowLimit:20,windowSize:60,aggregateBy:['ip']}};
export async function lookup(request,db,company){
 if(request.method!=='POST')return reply(405,{error:'Use POST'});
 let body;try{body=await request.json()}catch{return reply(400,{error:'Invalid request'})}
 const ref=typeof body?.hbl==='string'?body.hbl.trim():'';
 if(!ref||ref.length>128||/[\x00-\x1f]/.test(ref))return reply(400,{error:'Invalid HBL'});
 if(!db||!company)return reply(503,{error:'Tracking unavailable'});
 try{
 const {rows}=await db.query(`WITH matches AS (
 SELECT j.id,j.pol,j.pod,j.eta FROM bills_of_lading b JOIN jobs j ON j.id=b.job_id
 WHERE j.company_id=$2 AND b.type='HBL' AND b.status IN ('ISSUED','RELEASED')
 AND upper(trim(b.number))=upper($1) LIMIT 2
 ) SELECT pol,pod,eta,COALESCE((SELECT json_agg(e ORDER BY e.actual DESC) FROM
 (SELECT code,location,actual FROM milestones m WHERE m.job_id=matches.id AND actual IS NOT NULL
 AND actual<=now() AND code=ANY($3::text[]) ORDER BY actual DESC LIMIT 25) e),'[]') events
 FROM matches`,[ref,company,Object.keys(labels)]);
 if(rows.length!==1)return reply(404,{error:'No unique shipment found'});
 const {pol,pod,eta,events}=rows[0];return reply(200,{origin:pol,destination:pod,eta,events:events.map(e=>({status:labels[e.code],place:e.location,date:e.actual}))});
 }catch{return reply(503,{error:'Tracking unavailable'})}
}
export default function handler(req){
 const url=process.env.FREIGHT_TRACKING_DATABASE_URL;
 if(url&&!pool)pool=new pg.Pool({connectionString:url,max:2,connectionTimeoutMillis:3500,statement_timeout:4000,idleTimeoutMillis:15000});
 return lookup(req,pool,process.env.FREIGHT_TRACKING_COMPANY_ID);
}
