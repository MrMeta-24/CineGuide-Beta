document.addEventListener('DOMContentLoaded', () => { 
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const loginFormElement = document.getElementById('login');
  const registerFormElement = document.getElementById('register');
  const logoutBtn = document.getElementById('logoutBtn');
  const aside = document.getElementById('asside');

  window.toggleForm = () => {
    loginForm.classList.toggle('hidden');
    registerForm.classList.toggle('hidden');
  };

  registerFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();

    if (!username || !email || !password) {
      alert('Preencha todos os campos.');
      return;
    }

    fetch('http://localhost:5500/api/usuarios/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    })
    .then(res => {
      if (!res.ok) return res.json().then(err => { throw new Error(err.error) });
      return res.json();
    })
    .then(data => {
      alert('Cadastro realizado com sucesso!');
      toggleForm();
      registerFormElement.reset();
    })
    .catch(err => alert(err.message));
  });

  loginFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!email || !password) {
      alert('Preencha todos os campos.');
      return;
    }

    fetch('http://localhost:5500/api/usuarios/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    .then(res => {
      if (!res.ok) throw new Error('Email ou senha incorretos.');
      return res.json();
    })
    .then(user => {
      localStorage.setItem('isLoggedIn', JSON.stringify(user));
      window.location.href = 'homePage.html';
    })
    .catch(err => alert(err.message));
  });

  function updateLogoutButtonVisibility() {
    const loggedInUser = JSON.parse(localStorage.getItem('isLoggedIn'));
    logoutBtn.style.display = loggedInUser ? 'block' : 'none';
  }

  updateLogoutButtonVisibility();

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('isLoggedIn');
    alert('Você foi desconectado.');
    updateLogoutButtonVisibility();
    window.location.href = 'login.html';
  });

  window.toggleAside = () => { aside.classList.toggle('active'); };
  window.fecharAside = () => { aside.classList.remove('active'); };
});