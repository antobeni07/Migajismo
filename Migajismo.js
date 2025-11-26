// ================= MENÚ LATERAL =================
const botonLateral = document.getElementById("botonLateral");
const latMenu = document.getElementById("latMenu");
const cerrar = document.getElementById("cerrar");
const overlay = document.getElementById("overlay");

botonLateral?.addEventListener("click", () => {
    latMenu.classList.add("abrir");
    overlay.classList.add("activar");
    document.body.style.overflow = "hidden";
});

function cerrarMenu() {
    latMenu.classList.remove("abrir");
    overlay.classList.remove("activar");
    document.body.style.overflow = "";
}

cerrar?.addEventListener("click", cerrarMenu);
overlay?.addEventListener("click", cerrarMenu);
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrarMenu();
});


// ===================== LOGIN MEJORADO =====================
const loginModal = document.getElementById("loginModal");
const btnLogin = document.getElementById("btnLogin");
const loginCerrar = document.getElementById("loginCerrar");
const loginEnviar = document.getElementById("loginEnviar");

// Abrir modal
if (btnLogin) {
  btnLogin.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    loginModal.style.visibility = "visible";
    loginModal.style.opacity = "1";
  });
}

// Cerrar modal
if (loginCerrar) {
  loginCerrar.addEventListener("click", () => {
    loginModal.style.visibility = "hidden";
    loginModal.style.opacity = "0";
  });
}

// Enviar login
if (loginEnviar) {
  loginEnviar.addEventListener("click", async () => {
    const correo = document.getElementById("loginCorreo").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!correo || !password) {
      alert("Debe llenar ambos campos");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: correo,
            password: password
        })
      });

      if (!res.ok) {
        alert("Credenciales incorrectas");
        return;
      }

      const data = await res.json();

      // Guardar sesión
      localStorage.setItem("empleadoLogueado", JSON.stringify(data));

      // Cerrar modal
      loginModal.style.visibility = "hidden";
      loginModal.style.opacity = "0";

      // Ir al panel admin
      window.location.href = "admin.html";

    } catch (error) {
      console.error("Error login:", error);
      alert("Error conectando al servidor");
    }
  });
}
