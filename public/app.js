/* Painel mínimo: login (JWT), lista e cria clientes, lista produtos. */
(function () {
  const $ = (id) => document.getElementById(id);
  let token = null; // em memória: some ao recarregar a página (mais seguro que localStorage para este exemplo)

  function show(el, msg, isError) {
    el.textContent = msg;
    el.className = isError ? 'error' : '';
  }

  async function api(path, options = {}) {
    const res = await fetch(path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
    const body = res.status === 204 ? null : await res.json();
    if (!res.ok) throw new Error((body && body.error) || `Erro ${res.status}`);
    return body;
  }

  function renderList(listId, items, label) {
    const ul = $(listId);
    ul.textContent = '';
    if (!items.length) {
      const li = document.createElement('li');
      li.textContent = 'Nenhum registro.';
      ul.appendChild(li);
      return;
    }
    items.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = label(item); // textContent evita injeção de HTML (XSS)
      ul.appendChild(li);
    });
  }

  async function refresh() {
    const [clients, products] = await Promise.all([api('/clients'), api('/products')]);
    renderList('clients', clients, (c) => `${c.name} <${c.email}>`);
    renderList('products', products, (p) => `${p.name} — R$ ${p.price.toFixed(2)} (estoque: ${p.stock})`);
  }

  async function authenticate(path, form) {
    const data = Object.fromEntries(new FormData(form));
    return api(path, { method: 'POST', body: JSON.stringify(data) });
  }

  $('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      token = (await authenticate('/auth/login', e.target)).token;
      $('login-section').hidden = true;
      $('app-section').hidden = false;
      await refresh();
    } catch (err) {
      show($('login-msg'), err.message, true);
    }
  });

  $('register-btn').addEventListener('click', async () => {
    const form = $('login-form');
    if (!form.reportValidity()) return;
    try {
      await authenticate('/auth/register', form);
      show($('login-msg'), 'Usuário cadastrado. Agora é só entrar.');
    } catch (err) {
      show($('login-msg'), err.message, true);
    }
  });

  $('client-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await api('/clients', { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(e.target))) });
      e.target.reset();
      show($('app-msg'), 'Cliente adicionado.');
      await refresh();
    } catch (err) {
      show($('app-msg'), err.message, true);
    }
  });

  $('logout-btn').addEventListener('click', () => {
    token = null;
    $('app-section').hidden = true;
    $('login-section').hidden = false;
  });
})();
