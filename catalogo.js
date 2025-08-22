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

  let params = new URLSearchParams();
  carrito.forEach(item => {
    params.append("producto", `${item.nombre}x${item.cantidad}`);
  });

  params.append("total", total.textContent);

  // Redirige con parámetros
  window.location.search = params.toString();
}

document.getElementById("finalizar").addEventListener("click", finalizarPedido);
// js de la barra del catalogo