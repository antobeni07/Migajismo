// =============================
// 1. VERIFICAR LOGIN
// =============================
if (!localStorage.getItem("empleadoLogueado")) {
    alert("Debes iniciar sesión primero");
    window.location.href = "index.html";
}

// =============================
// 2. ELEMENTOS DEL DOM
// =============================
const lista = document.getElementById("lista");
const filtro = document.getElementById("filterEstado");
const btnLogout = document.getElementById("btnLogout");

// =============================
// 3. FUNCIÓN: CARGAR PEDIDOS
// =============================
async function cargarPedidos() {
    let url = "http://localhost:8080/api/pedidos";

    const estado = filtro.value;
    if (estado !== "") {
        url = `http://localhost:8080/api/pedidos/estado/${estado}`;
    }

    const res = await fetch(url);
    const pedidos = await res.json();

    renderPedidos(pedidos);
}

// =============================
// 4. FUNCIÓN: RENDERIZAR PEDIDOS
// =============================
function renderPedidos(pedidos) {
    lista.innerHTML = "";

    pedidos.forEach(p => {
        const card = document.createElement("div");
        card.className = "card";

        const itemsHTML = p.items.map(i =>
            `<li>${i.product.nombre} — Cant: ${i.cantidad} — $${i.subtotal}</li>`
        ).join("");

        card.innerHTML = `
            <h3>Pedido #${p.id}</h3>
            <p><strong>Cliente:</strong> ${p.clienteNombre} (${p.clienteCorreo})</p>
            <p><strong>Dirección:</strong> ${p.clienteDireccion}</p>
            <p><strong>Fecha:</strong> ${p.fecha.replace("T", " ").substring(0,16)}</p>
            <p><strong>Estado:</strong> ${p.estado}</p>

            <p><strong>Productos:</strong></p>
            <ul>${itemsHTML}</ul>

            <p><strong>Total:</strong> $${p.total}</p>

            <select class="selectEstado" data-id="${p.id}">
                <option value="Pendiente" ${p.estado === "Pendiente" ? "selected" : ""}>Pendiente</option>
                <option value="En preparacion" ${p.estado === "En preparacion" ? "selected" : ""}>En preparación</option>
                <option value="Enviado" ${p.estado === "Enviado" ? "selected" : ""}>Enviado</option>
                <option value="Entregado" ${p.estado === "Entregado" ? "selected" : ""}>Entregado</option>
                <option value="Cancelado" ${p.estado === "Cancelado" ? "selected" : ""}>Cancelado</option>
            </select>

            <button class="btn btn-primary btnCambiar" data-id="${p.id}">
                Guardar Estado
            </button>
        `;

        lista.appendChild(card);
    });
}

// =============================
// 5. CAMBIAR ESTADO
// =============================
lista.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btnCambiar")) {
        const id = e.target.dataset.id;
        const nuevoEstado = document.querySelector(`.selectEstado[data-id="${id}"]`).value;

        await fetch(`http://localhost:8080/api/pedidos/${id}/estado/${nuevoEstado}`, {
            method: "PATCH"
        });

        alert("Estado actualizado");
        cargarPedidos();
    }
});

// =============================
// 6. FILTRO POR ESTADO
// =============================
filtro.addEventListener("change", cargarPedidos);

// =============================
// 7. LOGOUT
// =============================
btnLogout.addEventListener("click", () => {
    localStorage.removeItem("empleadoLogueado");
    window.location.href = "index.html";
});

// =============================
// 8. CARGAR AL INICIO
// =============================
cargarPedidos();
