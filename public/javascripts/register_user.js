document.addEventListener("DOMContentLoaded", () => {
  configurarMenu();
  configurarLogout();
  configurarAlternarSenha();
  configurarCadastroUsuario();
});

function configurarCadastroUsuario() {
  const form = document.getElementById("register-form");
  const submitButton = document.getElementById("submitButton");

  if (!form || !submitButton) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = {
      username: document.getElementById("username")?.value.trim(),
      password: document.getElementById("password")?.value,
      email: document.getElementById("email")?.value.trim()
    };

    if (!payload.username || !payload.password || !payload.email) {
      mostrarFeedback("error", "Preencha todos os campos obrigatorios.");
      return;
    }

    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';

    try {
      const response = await fetch("/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Nao foi possivel cadastrar o usuario.");
      }

      mostrarFeedback("success", result.message || "Usuario registrado com sucesso.");
      form.reset();

      window.setTimeout(() => {
        window.location.href = "list_users.html";
      }, 900);
    } catch (error) {
      mostrarFeedback("error", `Falha ao cadastrar usuario: ${error.message}`);
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = '<i class="fas fa-floppy-disk"></i> Salvar usuario';
    }
  });
}

function configurarAlternarSenha() {
  document.querySelectorAll(".password-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.getElementById(button.dataset.target);
      const icon = button.querySelector("i");

      if (!input || !icon) return;

      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      icon.classList.toggle("fa-eye", !isPassword);
      icon.classList.toggle("fa-eye-slash", isPassword);
    });
  });
}

function configurarMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");

  if (!menuToggle || !sidebar || !overlay) return;

  const fecharMenu = () => {
    sidebar.classList.add("-translate-x-full");
    overlay.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  };

  const alternarMenu = () => {
    sidebar.classList.toggle("-translate-x-full");
    overlay.classList.toggle("hidden");
    document.body.classList.toggle("overflow-hidden");
  };

  menuToggle.addEventListener("click", alternarMenu);
  overlay.addEventListener("click", fecharMenu);

  sidebar.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", fecharMenu);
  });
}

function configurarLogout() {
  const logoutButton = document.getElementById("logoutButton");
  if (!logoutButton) return;

  logoutButton.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

function mostrarFeedback(tipo, mensagem) {
  const feedback = document.getElementById("formFeedback");
  if (!feedback) return;

  const estilos = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    error: "border-rose-200 bg-rose-50 text-rose-800"
  };

  feedback.className = `mb-6 rounded-lg border p-4 text-sm ${estilos[tipo] || estilos.success}`;
  feedback.textContent = mensagem;
  feedback.classList.remove("hidden");
  feedback.scrollIntoView({ behavior: "smooth", block: "start" });
}
