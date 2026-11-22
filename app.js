const peopleEl=document.getElementById("people"), output=document.getElementById("output");
let people=[]; let nextId=1;
function renderPeople(){
  peopleEl.innerHTML="";
  people.forEach(p=>{
    const wrap=document.createElement("div"); wrap.className="person";
    wrap.innerHTML=`<input aria-label="Generic person name" value="${p.name}" data-id="${p.id}"><span>${p.age?`Age ${p.age}`:""}</span>`;
    const input=wrap.querySelector("input");
    input.oninput=e=>{p.name=e.target.value.replace(/[^\w -]/g,"").slice(0,30)};
    peopleEl.appendChild(wrap);
  });
}
document.getElementById("addPerson").onclick=()=>{people.push({id:nextId++,name:["John","Jane","Michael","Sarah","Alex","Taylor"][people.length%6],age:""});renderPeople()};
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function hasPII(s){
  const patterns=[/\b\d{3}[-.\s]\d{2}[-.\s]\d{4}\b/i,/\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b/,/\b\d{1,5}\s+[A-Za-z0-9.'-]+\s+(Street|St|Road|Rd|Avenue|Ave|Drive|Dr|Lane|Ln|Court|Ct|Boulevard|Blvd)\b/i,/\b[A-Z]{1,3}\s*[-]?\s*\d{2,6}\b/i];
  return patterns.some(r=>r.test(s));
}
function safeText(){
  const s=document.getElementById("scenario").value;
  document.getElementById("scenario").value=s
    .replace(/\b\d{3}[-.\s]\d{2}[-.\s]\d{4}\b/g,"[SSN REMOVED]")
    .replace(/\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b/g,"[PHONE REMOVED]")
    .replace(/\b\d{1,5}\s+[A-Za-z0-9.'-]+\s+(Street|St|Road|Rd|Avenue|Ave|Drive|Dr|Lane|Ln|Court|Ct|Boulevard|Blvd)\b/gi,"[ADDRESS REMOVED]");
  document.getElementById("question").value=document.getElementById("question").value.replace(/\b\d{3}[-.\s]\d{2}[-.\s]\d{4}\b/g,"[IDENTIFIER REMOVED]");
}
document.getElementById("safe").onclick=()=>{safeText(); alert("I removed common identifying information patterns. Review the text before submitting.")};
function analyze(){
  const scenario=document.getElementById("scenario").value.trim(), question=document.getElementById("question").value.trim();
  if(!scenario&&!question){output.innerHTML="<h2>Legal Analysis</h2><p class='warning'>Enter a generic situation and/or question first.</p>";return}
  if(hasPII(scenario+" "+question)){output.innerHTML="<h2>Submission Stopped</h2><div class='warning'><strong>Possible identifying information detected.</strong><br>Remove real names, addresses, phone numbers, identifiers, plates, VINs, case numbers, or other confidential information before submitting.</div><button class='secondary' id='safe2'>Make My Question Safe</button>";document.getElementById("safe2").onclick=()=>{safeText();};return}
  const src=document.getElementById("source").value;
  output.innerHTML=`<div class="result"><h2>Legal Analysis</h2><div class="warning"><strong>Prototype mode.</strong> The secure AI/legal research backend is not connected yet.</div><h3>Question</h3><p>${escapeHtml(question||"No separate question entered.")}</p><h3>Source Requested</h3><p>${escapeHtml(src)}</p><h3>Recommended Analysis Structure</h3><ol><li>Actual current Texas statute or controlling case law</li><li>Plain-language explanation</li><li>Elements / legal requirements</li><li>Facts supported by the scenario</li><li>Questions still to answer</li><li>Report considerations</li><li>Related Texas law and case law</li><li>Official source and current verification date</li></ol><p class="muted">Do not rely on this prototype for an enforcement decision. The next build step is connecting a secure backend to current official Texas law sources and the AI.</p></div>`;
}
document.getElementById("ask").onclick=analyze;
document.querySelectorAll(".tile").forEach(b=>b.onclick=()=>{const a=b.dataset.action; const q={research:"Research a Texas legal issue.",situation:"Analyze this police situation under Texas law.",report:"Check my report for missing legal elements or important facts.",missing:"Help determine whether this is a missing, endangered, Silver Alert, AMBER Alert, or other notification situation.",law:"Show the actual Texas statute first, then explain it in plain English."}[a];document.getElementById("question").value=q;document.getElementById("scenario").focus()});
if("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(()=>{});
renderPeople();
