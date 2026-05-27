const COMMON = ['password', '123456', '12345678', '123456789', 'qwerty', 'admin', 'welcome', 'letmein', 'monkey', 'dragon', 'master', 'iloveyou', 'sunshine', 'princess', 'shadow', 'superman', 'michael', 'football', 'baseball', 'liverpool', 'chelsea'];
const WALKS = ['qwerty', 'asdfgh', 'zxcvbn', 'qwertyuiop', '1234567890', 'abcdefgh'];

function calcEntropy(pw){
  let pool=0;
  if(/[a-z]/.test(pw)) pool+=26;
  if(/[A-Z]/.test(pw)) pool+=26;
  if(/[0-9]/.test(pw)) pool+=10;
  if(/[^a-zA-Z0-9]/.test(pw)) pool+=32;
  
  let bits = pool > 0 ? Math.round(pw.length * Math.log2(pool) * 10) / 10 : 0;
  
  // Apply a severe penalty if a common pattern is detected
  // to reflect dictionary attack vulnerability
  if (detectPatterns(pw)) {
    bits = bits * 0.25; // Reduce entropy by 75%
  }

  return {bits: Math.round(bits * 10) / 10, pool};
}

function crackTime(bits){
  const guessesPerSec = 1e10;
  const combinations = Math.pow(2, bits);
  const secs = combinations / (2 * guessesPerSec);
  if(secs < 1) return 'instant';
  if(secs < 60) return Math.round(secs)+'s';
  if(secs < 3600) return Math.round(secs/60)+'m';
  if(secs < 86400) return Math.round(secs/3600)+'h';
  if(secs < 31536000) return Math.round(secs/86400)+' days';
  if(secs < 3153600000) return Math.round(secs/31536000)+' years';
  if(secs < 3.154e13) return Math.round(secs/3153600000)+'k years';
  return '∞';
}

function detectPatterns(pw){
  const l = pw.toLowerCase();
  if(COMMON.some(c=>l.includes(c))) return 'Contains a common password word';
  if(WALKS.some(w=>l.includes(w))) return 'Contains a keyboard walk (e.g. qwerty)';
  if(/(.)\1{2,}/.test(pw)) return 'Contains repeated characters (e.g. aaa)';
  if(/\b(19|20)\d{2}\b/.test(pw)) return 'Contains a year — easy to guess';
  if(/^[a-zA-Z]+\d{1,4}$/.test(pw)) return 'Word + number pattern is very common';
  return null;
}

function scoreLabel(bits){
  if(bits===0) return {label:'—', color:'var(--color-background-secondary)', tc:'var(--color-text-secondary)', pct:0};
  if(bits<28) return {label:'Very weak', color:'#FCEBEB', tc:'#A32D2D', pct:10, bar:'#E24B4A'};
  if(bits<36) return {label:'Weak', color:'#FAEEDA', tc:'#854F0B', pct:28, bar:'#EF9F27'};
  if(bits<50) return {label:'Fair', color:'#FAEEDA', tc:'#633806', pct:50, bar:'#BA7517'};
  if(bits<65) return {label:'Strong', color:'#EAF3DE', tc:'#3B6D11', pct:72, bar:'#639922'};
  return {label:'Very strong', color:'#E1F5EE', tc:'#0F6E56', pct:100, bar:'#1D9E75'};
}

function analyse(){
  const pw = document.getElementById('pw').value;
  const {bits, pool} = calcEntropy(pw);
  const sc = scoreLabel(bits);

  document.getElementById('meter').style.width = sc.pct+'%';
  document.getElementById('meter').style.background = sc.bar||'transparent';

  const badge = document.getElementById('badge');
  badge.textContent = sc.label;
  badge.style.background = sc.color;
  badge.style.color = sc.tc;

  document.getElementById('entropy-label').textContent = bits.toFixed(1)+' bits entropy';
  document.getElementById('s-entropy').innerHTML = bits.toFixed(1)+' <span style="font-size:13px;font-weight:400">bits</span>';
  document.getElementById('s-crack').textContent = bits>0?crackTime(bits):'—';
  document.getElementById('s-len').textContent = pw.length;
  document.getElementById('s-pool').textContent = pool;

  const pat = pw.length>0?detectPatterns(pw):null;
  const pw2 = document.getElementById('pattern-warn');
  if(pat){pw2.style.display='block';document.getElementById('pattern-text').textContent=pat;}
  else{pw2.style.display='none';}

  const checks = [
    {ok:/[a-z]/.test(pw), label:'Lowercase letters'},
    {ok:/[A-Z]/.test(pw), label:'Uppercase letters'},
    {ok:/[0-9]/.test(pw), label:'Numbers'},
    {ok:/[^a-zA-Z0-9]/.test(pw), label:'Symbols'},
    {ok:pw.length>=12, label:'12+ characters'},
    {ok:pw.length>=16, label:'16+ characters'},
  ];
  document.getElementById('checks').innerHTML = checks.map(c=>`
    <div class="check-row">
      <i class="ti ti-${c.ok?'check':'x'}" style="color:${c.ok?'#1D9E75':'#E24B4A'}" aria-hidden="true"></i>
      <span style="color:${c.ok?'var(--color-text-primary)':'var(--color-text-secondary)'}">${c.label}</span>
    </div>`).join('');

  const tips = [];
  if(pw.length===0){document.getElementById('tips').innerHTML='<li style="color:var(--color-text-secondary);font-size:13px">Start typing…</li>';return;}
  if(pw.length<12) tips.push('Make it at least 12 characters long');
  if(!/[A-Z]/.test(pw)) tips.push('Add uppercase letters');
  if(!/[0-9]/.test(pw)) tips.push('Add at least one number');
  if(!/[^a-zA-Z0-9]/.test(pw)) tips.push('Add symbols like @, #, $, !');
  if(pat) tips.push('Avoid predictable patterns');
  if(bits>=65 && tips.length===0) tips.push('Great password! Consider using a password manager to store it.');

  document.getElementById('tips').innerHTML = tips.map(t=>`<li><i class="ti ti-arrow-right" style="color:var(--color-text-tertiary)" aria-hidden="true"></i>${t}</li>`).join('');
}

function toggleVis(){
  const inp = document.getElementById('pw');
  const icon = document.getElementById('vis-icon');
  if(inp.type==='password'){inp.type='text';icon.className='ti ti-eye-off';}
  else{inp.type='password';icon.className='ti ti-eye';}
}

function copyPw(){
  const input = document.getElementById('pw');
  const v = input.value;
  if(!v) return;

  const btn = document.getElementById('copy-btn');
  const oldHtml = btn.innerHTML;
  
  const showSuccess = () => {
    btn.innerHTML='<i class="ti ti-check" style="color:#1D9E75"></i>';
    setTimeout(()=>{btn.innerHTML=oldHtml;},1500);
  };

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(v).then(showSuccess).catch(() => fallbackCopy(input, showSuccess));
  } else {
    fallbackCopy(input, showSuccess);
  }
}

function fallbackCopy(inputElement, successCallback) {
  const originalType = inputElement.type;
  inputElement.type = 'text';
  inputElement.select();
  inputElement.setSelectionRange(0, 99999);
  try {
    document.execCommand('copy');
    successCallback();
  } catch (err) {}
  inputElement.type = originalType;
  window.getSelection().removeAllRanges();
}

function genPw(){
  const chars='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}';
  let pw='';
  const arr=new Uint32Array(18);
  crypto.getRandomValues(arr);
  arr.forEach(n=>{pw+=chars[n%chars.length];});
  document.getElementById('pw').value=pw;
  document.getElementById('pw').type='text';
  document.getElementById('vis-icon').className='ti ti-eye-off';
  analyse();
}
