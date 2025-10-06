document.addEventListener('DOMContentLoaded', () => {
    async function getData() {
        try {
            //  Cambiar POST por GET
            const response = await fetch("https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLjFDjsYbtlOHFab7B6--UfJzHtkoJl8d7_mNbSV-7daT6MkmLJSQZonXbszldeyBADVASXc2KGZnnsKZphhGADew0M7iRht8LY9RPLT4kEj49qEdNcA-5LUBbnRAuxuZL0xPh7rWdppw1qoz29bMYH3zF4HraYn_RxDmsfUf81Q8rzDpjKKX4PyMWV1KYrtjZSaIyItv58qm6yMEOVsAttWBQLsYymgc1NGbjJlHLdgtUyr6cHN39Xg8zleLv7yVvgI5_EdsCUQ5ZQiG7ty2UuSQZ4VRw&lib=MeiQ3xzAzdNN_sKogUfUHNb4_lG3s3Ts6", {
                method: "GET"  //  CAMBIO PRINCIPAL POST - GET
            });
            if (!response.ok) {
                throw new Error("Estamos teniendo problemas. Por favor intente mas tarde");
            }
            
            console.log(response);
            const json = await response.json();
            const productos = json.data;
            const menu = document.querySelector(".gridProductos");

            menu.innerHTML = '';

            productos.forEach(prod => {
                const productoDiv = document.createElement('div');
                productoDiv.className = 'producto';
                productoDiv.innerHTML = `
                    <h3>${prod.Producto}</h3>
                    <p>$${prod.Precio}</p>
                    ${prod.Imagen ? `<img src="${prod.Imagen}" alt="${prod.Producto}" loading="lazy"/>` : '<div class="sin-imagen">Sin imagen</div>'}
                    <button class="agregar" data-nombre="${prod.Producto}" data-precio="${prod.Precio}">Agregar</button>
                `;

                menu.appendChild(productoDiv);
            });

            menu.addEventListener('click', (e) => {
                if (e.target.classList.contains('agregar')) {
                    const nombre = e.target.getAttribute('data-nombre');
                    const precio = e.target.getAttribute('data-precio');
                    agregarAlCarrito(nombre, precio);
                }
            });

        } catch (error) {
            console.error(error.message);
            document.querySelector(".gridProductos").innerHTML =
                '<p class="error">Error al cargar los productos. Intente más tarde.</p>';
        }
    }

    getData();
});

