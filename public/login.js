const handleLogin = async (event) => {
  event.preventDefault();
};

const main = () => {
  const form = document.querySelector("form");
  form.addEventListener("submit", handleLogin);
};

globalThis.onload = main;
