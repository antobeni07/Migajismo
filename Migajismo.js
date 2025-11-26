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


// ================= LOGIN =================
const loginModal = document.getElementById("loginModal");
const btnLogin = document.getElementById("btnLogin");
const loginCerrar = document.getElementById("loginCerrar");
const loginEnviar = document.getElementById("loginEnviar");

// ABRIR LOGIN
btnLogin?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    // cerrar menú si está abierto
    cerrarMenu();

    loginModal.style.visibility = "visible";
    loginModal.style.opacity = "1";
});

// CERRAR LOGIN
loginCerrar?.addEventListener("click", () => {
    loginModal.style.visibility = "hidden";
    loginModal.style.opacity = "0";
});

// ENVIAR LOGIN
loginEnviar?.addEventListener("click", async () => {

    const correo = document.getElementById("loginCorreo").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const res = await fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ correo, password })
        });

        if (!res.ok) {
            alert("Credenciales incorrectas");
            return;
        }

        const data = await res.json();

        // GUARDAR LOGIN
        localStorage.setItem("empleadoLogueado", data.correo);

        // CERRAR MODAL
        loginModal.style.visibility = "hidden";
        loginModal.style.opacity = "0";

        // REDIRIGIR
        window.location.href = "admin.html";

    } catch (err) {
        console.log("Error en login:", err);
        alert("Error de conexión con el servidor");
    }
});
