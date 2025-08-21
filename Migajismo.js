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