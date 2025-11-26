// Elementos principales
const listaCarrito = document.getElementById("listaCarrito");
const total = document.getElementById("total");
let carrito = JSON.parse(localStorage.getItem('carrito')) || []; // 👈 Cargar carrito al inicio

// Función para guardar carrito en localStorage
function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función para actualizar la vista del carrito
function renderCarrito() {
  listaCarrito.innerHTML = "";
  let sumaTotal = 0;

  carrito.forEach((item, index) => {
    sumaTotal += item.precio * item.cantidad;

    const li = document.createElement("li");
    li.innerHTML = `
      ${item.nombre} - $${item.precio} x ${item.cantidad}
      <button class="eliminar" data-index="${index}">❌</button>
    `;
    listaCarrito.appendChild(li);
  });

  total.textContent = sumaTotal;
}

// Función para agregar productos
function agregarAlCarrito(nombre, precio) {
  const existe = carrito.find(item => item.nombre === nombre);

  if (existe) {
    existe.cantidad++;
  } else {
    carrito.push({ nombre, precio: parseInt(precio), cantidad: 1 });
  }

  renderCarrito();
  guardarCarrito(); // 👈 Guardar después de agregar
}

// Eliminar productos
listaCarrito.addEventListener("click", (e) => {
  if (e.target.classList.contains("eliminar")) {
    const index = e.target.dataset.index;
    carrito.splice(index, 1);
    renderCarrito();
    guardarCarrito(); // 👈 Guardar después de eliminar
  }
});

// Finalizar pedido
function finalizarPedido() {
  if (carrito.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  // Mostrar el modal
  const modal = document.getElementById('modalCliente');
  const form = document.getElementById('formCliente');

  modal.style.display = 'block';

  // Limpiar formulario
  form.reset();

  // Event listener para el formulario
  form.onsubmit = async function (e) {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const direccion = document.getElementById('direccion').value.trim();

  if (!nombre || !telefono || !direccion) {
    alert('Por favor, complete todos los campos obligatorios');
    return;
  }

  const productosPedido = carrito.map(item => ({
    cantidad: item.cantidad,
    precioUnitario: item.precio,
    subtotal: item.cantidad * item.precio,
    nombreProducto: item.nombre
  }));

  const totalPedido = carrito.reduce((total, item) =>
    total + (item.precio * item.cantidad), 0);

  const numeroPedido = Math.random().toString(36).substring(2, 9).toUpperCase();

  // 👇 NOMBRES EXACTOS QUE TU BACKEND SPRING BOOT ESPERA
  const pedido = {
    clienteNombre: nombre,
    clienteDireccion: direccion,
    clienteTelefono: telefono,
    fecha: new Date().toISOString(),
    total: totalPedido,
    estado: "Pendiente",
    items: productosPedido
  };

  try {
    const btnConfirmar = document.querySelector('.btn-confirmar');
    btnConfirmar.textContent = 'Enviando...';
    btnConfirmar.disabled = true;

    console.log("Enviando al backend:", pedido);

    const res = await fetch("http://localhost:8080/api/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pedido)
    });

    if (!res.ok) throw new Error("El backend rechazó el pedido");

    // 🟩 Pedido exitoso → Mostrar modal
    document.getElementById("textoConfirmacion").innerText =
      `Número de pedido: ${numeroPedido}\nGracias ${nombre}, tu pedido llegará a:\n${direccion}`;

    document.getElementById("modalConfirmacion").style.display = "flex";

    document.getElementById("cerrarConfirmacion").onclick = () => {
      document.getElementById("modalConfirmacion").style.display = "none";
    };

    modal.style.display = 'none';

    carrito = [];
    localStorage.removeItem('carrito');
    renderCarrito();

    btnConfirmar.textContent = 'Confirmar Pedido';
    btnConfirmar.disabled = false;

  } catch (error) {
    console.error("Error:", error);
    alert("Error al enviar el pedido. Por favor, intente nuevamente.");

    const btnConfirmar = document.querySelector('.btn-confirmar');
    btnConfirmar.textContent = 'Confirmar Pedido';
    btnConfirmar.disabled = false;
  }
};

  // Event listener para cancelar
  document.getElementById('cancelarPedido').onclick = function () {
    modal.style.display = 'none';
  };

  // Cerrar modal al hacer clic fuera
  modal.onclick = function (e) {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  };
}

// Inicializar carrito al cargar la página
document.addEventListener("DOMContentLoaded", function () {
  renderCarrito(); // 👈 Mostrar carrito guardado
});

document.getElementById("finalizar").addEventListener("click", finalizarPedido);