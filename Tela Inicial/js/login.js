// 1) Coloque aqui a URL do seu webhook GET no n8n:
const WEBHOOK_LOGIN = "https://lagem.app.n8n.cloud/webhook/login";

const cpfEl = document.getElementById("cpf");
const nascEl = document.getElementById("nasc");
const rememberEl = document.getElementById("remember");
const btnLogin = document.getElementById("btnLogin");
const msg = document.getElementById("msg");

// Preencher automaticamente se o usuário pediu "lembrar"
(function autoFill() {
  const saved = localStorage.getItem("remember_login");
  if (!saved) return;
  try {
    const { cpf, nasc } = JSON.parse(saved);
    cpfEl.value = cpf || "";
    nascEl.value = nasc || "";
    rememberEl.checked = true;
  } catch {}
})();

function onlyNumbers(v) {
  return (v || "").replace(/\D/g, "");
}

btnLogin.addEventListener("click", async () => {
  msg.textContent = "";

  const cpf = onlyNumbers(cpfEl.value);
  const nasc = onlyNumbers(nascEl.value);

  if (cpf.length !== 11) {
    msg.textContent = "CPF inválido (11 números).";
    return;
  }
  if (nasc.length !== 8) {
    msg.textContent = "Data inválida (DDMMAAAA).";
    return;
  }

  btnLogin.disabled = true;
  btnLogin.textContent = "Entrando...";

  try {
    const url = `${WEBHOOK_LOGIN}?cpf=${encodeURIComponent(cpf)}&data_nascimento=${encodeURIComponent(nasc)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.success) {
      msg.textContent = data.message || "Acesso negado.";
      return;
    }

    // Salva sessão
    localStorage.setItem("usuario", JSON.stringify({
      nome: data.nome,
      secao: data.secao
    }));

    // Salva lembrar login
    if (rememberEl.checked) {
      localStorage.setItem("remember_login", JSON.stringify({ cpf, nasc }));
    } else {
      localStorage.removeItem("remember_login");
    }

    window.location.href = "index.html";
  } catch (e) {
    console.error(e);
    msg.textContent = "Falha ao conectar no servidor.";
  } finally {
    btnLogin.disabled = false;
    btnLogin.textContent = "Entrar";
  }
});


