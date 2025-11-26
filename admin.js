document.addEventListener("DOMContentLoaded", cargarPedidos);

async function cargarPedidos() {
    const tabla = document.getElementById("tabla-pedidos-body");
    tabla.innerHTML = "<tr><td colspan='6'>Cargando...</td></tr>";

    try {
        const response = await fetch("http://localhost:8080/api/pedidos");
        
        if (!response.ok) throw new Error("No se pudieron obtener los pedidos");

        const pedidos = await response.json();

        if (pedidos.length === 0) {
            tabla.innerHTML = "<tr><td colspan='6'>No hay pedidos</td></tr>";
            return;
        }

        tabla.innerHTML = "";

        pedidos.forEach(p => {
            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${p.id}</td>
                <td>${p.clienteNombre}</td>
                <td>${p.clienteTelefono}</td>
                <td>${p.total}</td>
                <td>${p.estado}</td>
                <td>
                    <button class="ver" data-id="${p.id}">Ver</button>
                </td>
            `;

            tabla.appendChild(fila);
        });

    } catch (err) {
        console.error("Error cargando pedidos:", err);
        tabla.innerHTML = "<tr><td colspan='6' style='color:red'>Error al cargar pedidos</td></tr>";
    }
}
