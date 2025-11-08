// Simple daily budget tracker (localStorage)
const LS_KEY = 'budget_entries_v1';
const USER_KEY = 'budget_user_name';
let entries = [];

// DOM
const form = document.getElementById('entry-form');
const descInput = document.getElementById('desc');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const dateInput = document.getElementById('date');
const table = document.getElementById('entries-table');
const tableBody = table ? table.querySelector('tbody') : null;
const emptyEl = document.getElementById('empty');
const totalIncomeEl = document.getElementById('total-income');
const totalExpenseEl = document.getElementById('total-expense');
const balanceEl = document.getElementById('balance');
const searchInput = document.getElementById('search');
const exportBtn = document.getElementById('export-btn');
const clearDataBtn = document.getElementById('clear-data');
const clearFormBtn = document.getElementById('clear-form');
const msgEl = document.getElementById('msg');
const profileNameEl = document.getElementById('profile-name');
const editNameBtn = document.getElementById('edit-name');

// Helpers
function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,8); }
function formatCurrency(v){
  const n = Number(v)||0;
  // Use Indian Rupee symbol
  return n.toLocaleString(undefined,{style:'currency',currency:'INR'});
}
function escapeHtml(unsafe){
  if(!unsafe) return '';
  return unsafe.replace(/[&<>\"]/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[m]; });
}
function showMsg(text, timeout=2000){
  if(!msgEl) return; msgEl.textContent = text; msgEl.style.display = 'block';
  clearTimeout(msgEl._t);
  msgEl._t = setTimeout(()=>{ msgEl.style.display = 'none'; }, timeout);
}

// Storage
function loadEntries(){
  try{ const raw = localStorage.getItem(LS_KEY); entries = raw ? JSON.parse(raw) : []; }catch(e){ entries = []; }
}
function saveEntries(){ localStorage.setItem(LS_KEY, JSON.stringify(entries)); }

// Render
function render(){
  if(!tableBody) return;
  const q = (searchInput && searchInput.value) ? searchInput.value.toLowerCase() : '';
  const filtered = entries.filter(e => (e.desc||'').toLowerCase().includes(q));
  tableBody.innerHTML = '';
  if(filtered.length === 0){ if(emptyEl) emptyEl.style.display = 'block'; } else { if(emptyEl) emptyEl.style.display = 'none'; filtered.sort((a,b)=> b.date.localeCompare(a.date)); for(const e of filtered){ const tr = document.createElement('tr'); tr.innerHTML = `<td>${e.date}</td><td>${escapeHtml(e.desc)}</td><td>${e.type}</td><td>${formatCurrency(e.amount)}</td><td><button class="del" data-id="${e.id}">Delete</button></td>`; tableBody.appendChild(tr); } }

  const totalIncome = entries.filter(e=>e.type==='income').reduce((s,e)=>s+Number(e.amount),0);
  const totalExpense = entries.filter(e=>e.type==='expense').reduce((s,e)=>s+Number(e.amount),0);
  if(totalIncomeEl) totalIncomeEl.textContent = formatCurrency(totalIncome);
  if(totalExpenseEl) totalExpenseEl.textContent = formatCurrency(totalExpense);
  if(balanceEl) balanceEl.textContent = formatCurrency(totalIncome - totalExpense);
}

// Actions
form && form.addEventListener('submit', (ev)=>{
  ev.preventDefault();
  const desc = descInput.value.trim();
  const raw = (amountInput.value||'').toString().trim().replace(',','.');
  const amount = parseFloat(raw);
  const type = typeInput.value;
  const date = dateInput.value || new Date().toISOString().slice(0,10);
  if(!desc || Number.isNaN(amount) || amount <= 0){ alert('Please enter a description and an amount greater than 0'); return; }
  const entry = { id: uid(), desc, amount: Math.round(amount*100)/100, type, date };
  entries.push(entry); saveEntries(); render(); form.reset(); setToday(); showMsg('Added');
});

// delegate delete
if(tableBody){ tableBody.addEventListener('click', (ev)=>{ if(ev.target && ev.target.matches('button.del')){ const id = ev.target.dataset.id; entries = entries.filter(e=>e.id!==id); saveEntries(); render(); showMsg('Deleted'); } }); }

searchInput && searchInput.addEventListener('input', ()=>render());
clearFormBtn && clearFormBtn.addEventListener('click', ()=>{ form.reset(); setToday(); });

function exportEntries(){ const data = JSON.stringify(entries, null, 2); const blob = new Blob([data], {type:'application/json'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'budget-entries.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); showMsg('Exported'); }
if(exportBtn) exportBtn.addEventListener('click', exportEntries);

clearDataBtn && clearDataBtn.addEventListener('click', ()=>{ if(confirm('Clear all saved entries? This cannot be undone.')){ entries = []; saveEntries(); render(); showMsg('Cleared'); } });

function setToday(){ if(dateInput) dateInput.value = new Date().toISOString().slice(0,10); }

// username prompt and profile
function ensureUserName(){ let name = localStorage.getItem(USER_KEY); if(!name){ name = prompt('Welcome — what should we call you?',''); if(name) localStorage.setItem(USER_KEY, name.trim()); }
 name = localStorage.getItem(USER_KEY) || 'User'; if(profileNameEl) profileNameEl.textContent = name; }

// allow user to edit their name at any time
if(editNameBtn){
  editNameBtn.addEventListener('click', ()=>{
    const current = localStorage.getItem(USER_KEY) || 'User';
    const next = prompt('Enter your name:', current);
    if(next === null) return; // cancelled
    const trimmed = next.trim();
    if(!trimmed){ alert('Name cannot be empty'); return; }
    localStorage.setItem(USER_KEY, trimmed);
    if(profileNameEl) profileNameEl.textContent = trimmed;
    showMsg('Name updated');
  });
}

// Init
setToday(); ensureUserName(); loadEntries(); render();

// Expose for debugging (optional)
window._budget = { entries, render };
