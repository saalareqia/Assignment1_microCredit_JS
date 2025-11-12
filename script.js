// script.js — wire up the frontend to the MultiAuth functions exposed by multiAuth.js
(function () {
  const codeInput = document.getElementById('codeInput');
  const generateBtn = document.getElementById('generateBtn');
  const checkBtn = document.getElementById('checkBtn');
  const result = document.getElementById('result');
  const list = document.getElementById('passcodeList');

  const FIVE_MINUTES = (window.MultiAuth && window.MultiAuth.DEFAULT_FIVE_MINUTES) || 5 * 60 * 1000;

  function refreshList() {
    list.innerHTML = '';
    const entries = (window.MultiAuth && window.MultiAuth.getActivePasscodes()) || [];
    if (entries.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'No active passcodes';
      list.appendChild(li);
      return;
    }
    entries.sort((a,b)=>a.expiresInMs - b.expiresInMs).forEach(e=>{
      const li = document.createElement('li');
      const left = document.createElement('span');
      left.textContent = e.code;
      const right = document.createElement('span');
      const seconds = Math.ceil(e.expiresInMs / 1000);
      right.textContent = `${seconds}s`;
      li.appendChild(left);
      li.appendChild(right);
      list.appendChild(li);
    });
  }

  generateBtn.addEventListener('click', ()=>{
    const code = codeInput.value.trim();
    if (!code) { result.textContent = 'Enter a numeric passcode.'; return; }
    if (!/^[0-9]+$/.test(code)) { result.textContent = 'Passcode must be numeric.'; return; }
    const existed = window.MultiAuth.generatePasscode(code, FIVE_MINUTES);
    result.textContent = existed ? 'Passcode existed and expiry reset (true).' : 'New passcode created (false).';
    refreshList();
  });

  checkBtn.addEventListener('click', ()=>{
    const code = codeInput.value.trim();
    if (!code) { result.textContent = 'Enter a passcode to check.'; return; }
    const valid = window.MultiAuth.isValid(code);
    result.textContent = valid ? 'Valid (not expired)' : 'Invalid or expired';
    refreshList();
  });

  // refresh every second to update remaining times
  setInterval(refreshList, 1000);
  // initial render
  refreshList();
})();
