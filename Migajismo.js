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

// ===== LOGIN =====
const loginModal = document.getElementById("loginModal");
const btnLogin = document.getElementById("btnLogin");
const loginCerrar = document.getElementById("loginCerrar");

if (btnLogin) {
    btnLogin.addEventListener("click", (e) => {
        e.preventDefault(); // evita que se comporte como <a>
        e.stopPropagation(); // evita que el click lo capture otro elemento

        loginModal.style.visibility = "visible";
        loginModal.style.opacity = "1";
    });
}

if (loginCerrar) {
    loginCerrar.addEventListener("click", () => {
        loginModal.style.visibility = "hidden";
        loginModal.style.opacity = "0";
    });
}

document.getElementById("loginEnviar").addEventListener("click", async () => {

    const correo = document.getElementById("loginCorreo").value;
    const password = document.getElementById("loginPassword").value;

    const res = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({correo, password})
    });

    const data = await res.json();

    if (data.ok) {
        alert("Bienvenido " + data.nombre);
        loginModal.style.visibility = "hidden";
        loginModal.style.opacity = "0";
    } else {
        alert("Credenciales incorrectas");
    }
});
