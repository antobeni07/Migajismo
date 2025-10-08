document.addEventListener('DOMContentLoaded', () => {
    async function getData() {
        try {
            //  Cambiar POST por GET
            const response = await fetch("https://script.google.com/macros/s/AKfycbziDzJgw-l7vmZoRCwi25ZzmN1z3M1JcjqjDsvPCFHan-QztAwImefy0fDx22OPuPQ3/exec", {
                method: "GET"  //  CAMBIO PRINCIPAL POST - GET
            });
            if (!response.ok) {
                throw new Error("Estamos teniendo problemas. Por favor intente mas tarde");
            }
            
            console.log(response);
            const json = await response.json();
            const productos = json.data;
            
            const galletas = document.querySelector(".galletas");
            galletas.innerHTML = '';
            
            productos.forEach(prod => {
                if (prod.Tipo === "Galleta"){
                    const productoDiv = document.createElement('div');
                    productoDiv.className = 'producto';
                    productoDiv.innerHTML = `
                    <h3>${prod.Producto}</h3>
                    <h4>$${prod.Precio}</h4>
                    ${prod.Imagen ? `<img src="${prod.Imagen}" alt="${prod.Producto}" loading="lazy"/>` : '<div class="sin-imagen">Sin imagen</div>'}
                    <button class="agregar" data-nombre="${prod.Producto}" data-precio="${prod.Precio}">Agregar</button>
                    <p>${prod.Descripcion}</p>
                `;
                galletas.appendChild(productoDiv);
                }
            });

            galletas.addEventListener('click', (e) => {
                if (e.target.classList.contains('agregar')) {
                    const nombre = e.target.getAttribute('data-nombre');
                    const precio = e.target.getAttribute('data-precio');
                    agregarAlCarrito(nombre, precio);
                }
            });

            const brownies = document.querySelector(".brownies");
            brownies.innerHTML = '';
            
            productos.forEach(prod => {
                if (prod.Tipo === "Brownie"){
                    const productoDiv = document.createElement('div');
                    productoDiv.className = 'producto';
                    productoDiv.innerHTML = `
                    <h3>${prod.Producto}</h3>
                    <h4>$${prod.Precio}</h4>
                    ${prod.Imagen ? `<img src="${prod.Imagen}" alt="${prod.Producto}" loading="lazy"/>` : '<div class="sin-imagen">Sin imagen</div>'}
                    <button class="agregar" data-nombre="${prod.Producto}" data-precio="${prod.Precio}">Agregar</button>
                    <p>${prod.Descripcion}</p>
                `;
                brownies.appendChild(productoDiv);
                }
            });

            brownies.addEventListener('click', (e) => {
                if (e.target.classList.contains('agregar')) {
                    const nombre = e.target.getAttribute('data-nombre');
                    const precio = e.target.getAttribute('data-precio');
                    agregarAlCarrito(nombre, precio);
                }
            });

        } catch (error) {
            console.error(error.message);
            document.querySelector(".galletas").innerHTML =
                '<p class="error">Error al cargar las galletas. Intente más tarde.</p>';
            document.querySelector(".brownies").innerHTML =
                '<p class="error">Error al cargar las brownies. Intente más tarde.</p>';
        }
    }

    getData();
});

