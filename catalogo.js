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

    // Validar que todos los campos estén llenos
    if (!nombre || !telefono || !direccion) {
      alert('Por favor, complete todos los campos obligatorios');
      return;
    }

    // Preparar los datos del pedido (formato EXACTO para tu script)
    const productosPedido = carrito.map(item => ({
      id: item.nombre,
      precio: item.precio,
      cantidad: item.cantidad
    }));

    const totalPedido = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);

    // Generar número de pedido único (como en el ejemplo)
    const numeroPedido = Math.random().toString(36).substring(2, 9).toUpperCase();

    const pedido = {
      numero_pedido: numeroPedido,
      fecha: new Date().toISOString(),
      nombre_cliente: nombre,
      telefono_cliente: telefono,
      direccion_cliente: direccion,
      productos: JSON.stringify(productosPedido), // 👈 IMPORTANTE: stringify
      valor_total: totalPedido
    };

    try {
      // Deshabilitar botón y mostrar loading
      const btnConfirmar = document.querySelector('.btn-confirmar');
      btnConfirmar.textContent = 'Enviando...';
      btnConfirmar.disabled = true;

      console.log('Enviando pedido:', pedido); // 👈 Para debug

      // 🔥 SOLUCIÓN: Usar mode: 'no-cors' como en el ejemplo
      await fetch('https://script.google.com/macros/s/AKfycbziDzJgw-l7vmZoRCwi25ZzmN1z3M1JcjqjDsvPCFHan-QztAwImefy0fDx22OPuPQ3/exec', {
        method: 'POST',
        mode: 'no-cors', // 👈 ESTO EVITA EL ERROR CORS
        body: JSON.stringify(pedido)
      });

      // Éxito - asumimos que se envió correctamente
      // Mostrar modal elegante
      document.getElementById("textoConfirmacion").innerText =
        `Número de pedido: ${numeroPedido}\nGracias ${nombre}, tu pedido llegará a:\n${direccion}`;

      document.getElementById("modalConfirmacion").style.display = "flex";

      document.getElementById("cerrarConfirmacion").onclick = () => {
        document.getElementById("modalConfirmacion").style.display = "none";
      };


      // Cerrar modal
      modal.style.display = 'none';

      // Limpiar carrito
      carrito = [];
      localStorage.removeItem('carrito');
      renderCarrito();

      btnConfirmar.textContent = 'Confirmar Pedido';
      btnConfirmar.disabled = false;

    } catch (error) {
      console.error('Error completo:', error);
      alert('Error al enviar el pedido. Por favor, intente nuevamente.');

      // Rehabilitar botón
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

  const res = await fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, password })
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
