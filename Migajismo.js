const botonLateral = document.getElementById("botonLateral");
const latMenu = document.getElementById("latMenu");
const cerrar = document.getElementById("cerrar");
const overlay = document.getElementById("overlay");

botonLateral.addEventListener("click", () => {
    latMenu.classList.add("abrir");
    overlay.classList.add("activar");
    document.body.style.overflow = "hidden";
})

function cerrarMenu() {
    latMenu.classList.remove("abrir");
    overlay.classList.remove("activar");
    document.body.style.overflow = "";
}

cerrar.addEventListener("click", cerrarMenu);
overlay.addEventListener("click", cerrarMenu);
document.addEventListener("keydown", (e) => {
    if(e.key === "Escape"){
        cerrarMenu();
    }
})
// ---- LOGIN EMPLEADO ---- //
const loginModal = document.getElementById("loginModal");
const btnAbrirLogin = document.getElementById("btnAbrirLogin");
const btnCerrarLogin = document.getElementById("btnCerrarLogin");
const btnLoginEmpleado = document.getElementById("btnLoginEmpleado");

btnAbrirLogin.addEventListener("click", () => {
    loginModal.style.display = "flex";
});

btnCerrarLogin.addEventListener("click", () => {
    loginModal.style.display = "none";
});

btnLoginEmpleado.addEventListener("click", async () => {
    const username = document.getElementById("loginUser").value.trim();
    const password = document.getElementById("loginPass").value.trim();
    const error = document.getElementById("loginError");

    const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, password})
    });

    if (!res.ok) {
        error.textContent = "Usuario o contraseña incorrectos";
        error.style.display = "block";
        return;
    }

    const empleado = await res.json();
    localStorage.setItem("empleado", JSON.stringify(empleado));

    window.location.href = "admin.html"; // ir al panel de pedidos
});
