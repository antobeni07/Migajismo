document.addEventListener('DOMContentLoaded', () => {
    async function getData() {
        try {
            const response = await fetch("https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLjFDjsYbtlOHFab7B6--UfJzHtkoJl8d7_mNbSV-7daT6MkmLJSQZonXbszldeyBADVASXc2KGZnnsKZphhGADew0M7iRht8LY9RPLT4kEj49qEdNcA-5LUBbnRAuxuZL0xPh7rWdppw1qoz29bMYH3zF4HraYn_RxDmsfUf81Q8rzDpjKKX4PyMWV1KYrtjZSaIyItv58qm6yMEOVsAttWBQLsYymgc1NGbjJlHLdgtUyr6cHN39Xg8zleLv7yVvgI5_EdsCUQ5ZQiG7ty2UuSQZ4VRw&lib=MeiQ3xzAzdNN_sKogUfUHNb4_lG3s3Ts6", {
                method: "POST"
            });
            
            if (!response.ok) {
                throw new Error("Estamos teniendo problemas. Por favor intente mas tarde");
            }
            
            const json = await response.json();
            const productos = json.data;
            let menu = document.querySelector(".gridProductos");
            
            productos.forEach(prod => {
                menu.innerHTML += `
                    <div class="producto">
                        <h3>${prod.Producto}</h3>
                        <p>$${prod.Precio}</p>
                        ${prod.Imagen ? <img src="${prod.Imagen}" alt="${prod.Nombre}"/> : ""}
                        <button class="agregar" nombre="${prod.Producto}" precio="${prod.Precio}">Agregar</button>
                    </div>
                `;
            });
            
            document.querySelectorAll(".agregar").forEach(boton => {
                boton.addEventListener("click", () => {
                    const nombre = boton.getAttribute("nombre");
                    const precio = boton.getAttribute("precio");
                    agregarAlCarrito(nombre, precio);
                });
            });
            
        } catch (error) {
            console.error(error.message);
        }
    }
    
    getData();
});