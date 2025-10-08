// Elementos principales
const botonesAgregar = document.querySelectorAll(".agregar");
const listaCarrito = document.getElementById("listaCarrito");
const total = document.getElementById("total");
let carrito = [];

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
    carrito.push({ nombre, precio, cantidad: 1 });
  }

  renderCarrito();
}

// Escuchar clicks en los botones "Agregar"
botonesAgregar.forEach(boton => {
  boton.addEventListener("click", () => {
    const nombre = boton.dataset.nombre;
    const precio = parseInt(boton.dataset.precio);
    agregarAlCarrito(nombre, precio);
  });
});

// Eliminar productos
listaCarrito.addEventListener("click", (e) => {
  if (e.target.classList.contains("eliminar")) {
    const index = e.target.dataset.index;
    carrito.splice(index, 1);
    renderCarrito();
  }
});

// Finalizar pedido y enviar a query params
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

    // Preparar los datos del pedido
    const productosPedido = carrito.map(item => ({
      id: item.nombre,
      precio: item.precio,
      cantidad: item.cantidad
    }));

    const totalPedido = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);

    const pedido = {
      nombre_cliente: nombre,
      telefono_cliente: telefono,
      direccion_cliente: direccion,
      productos: productosPedido,
      total_pedido: totalPedido,
    };

    try {
      // Deshabilitar botón y mostrar loading
      const btnConfirmar = document.querySelector('.btn-confirmar');
      btnConfirmar.textContent = 'Enviando...';
      btnConfirmar.disabled = true;

      // Enviar pedido al servidor
      const response = await fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent('https://script.google.com/macros/echo?user_content_key=AehSKLjFDjsYbtlOHFab7B6--UfJzHtkoJl8d7_mNbSV-7daT6MkmLJSQZonXbszldeyBADVASXc2KGZnnsKZphhGADew0M7iRht8LY9RPLT4kEj49qEdNcA-5LUBbnRAuxuZL0xPh7rWdppw1qoz29bMYH3zF4HraYn_RxDmsfUf81Q8rzDpjKKX4PyMWV1KYrtjZSaIyItv58qm6yMEOVsAttWBQLsYymgc1NGbjJlHLdgtUyr6cHN39Xg8zleLv7yVvgI5_EdsCUQ5ZQiG7ty2UuSQZ4VRw&lib=MeiQ3xzAzdNN_sKogUfUHNb4_lG3s3Ts6'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedido)
      });

      if (!response.ok) {
        throw new Error('Error al enviar el pedido');
      }

      // Éxito
      alert(`¡Pedido enviado con éxito!\nGracias ${nombre}, tu pedido llegará a:\n${direccion}`);

      // Cerrar modal
      modal.style.display = 'none';

      // Limpiar carrito
      carrito = [];
      localStorage.removeItem('carrito');
      renderCarrito();

    } catch (error) {
      console.error('Error:', error);
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

document.getElementById("finalizar").addEventListener("click", finalizarPedido);