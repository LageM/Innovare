const userStr = localStorage.getItem("usuario");
const hello = document.getElementById("hello");
const secao = document.getElementById("secao");
const btnLogout = document.getElementById("btnLogout");

if (!userStr) {
  window.location.href = "login.html";
} else {
  const user = JSON.parse(userStr);
  hello.textContent = `Olá, ${user.nome}!`;
  secao.textContent = `Seção/Posto: ${user.secao || "-"}`;
}

btnLogout.addEventListener("click", () => {
  localStorage.removeItem("usuario");
  window.location.href = "login.html";
});
