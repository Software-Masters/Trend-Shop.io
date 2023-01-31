

document.addEventListener('DOMContentLoaded', () => {

    // Variables
    const baseDeDatos = [
        {
            id: 1,
            nombre: 'Pantalones Adidas',
            precio: 26.99,

        },
        {
            id: 2,
            nombre: 'Air Jordan 1 Mid',
            precio: 129.99,
        },
        {
            id: 3,
            nombre: 'AJ4 Military Black',
            precio: 149.99,
        },
        {
            id: 4,
            nombre: 'Nike Air Force 1 07 White',
            precio: 109.99,
        },
        {
            id: 5,
            nombre: 'Nike Dunk High Retro',
            precio: 119.99,
        },
        {
            id: 6,
            nombre: 'Essential Velours Trackjacket',
            precio: 55.99,
        },
        {
            id: 7,
            nombre: 'Camiseta Brown',
            precio: 19.99,
        },
        {
            id: 8,
            nombre: 'Dri Fit Shirt',
            precio: 19.99,
        },
        {
            id: 9,
            nombre: 'Polo CK',
            precio: 19.99,
        },
        {
            id: 10,
            nombre: 'Polo Blue Shirt',
            precio: 16.99,
        },
        {
            id: 11,
            nombre: 'Polo Club Sudadera',
            precio: 59.99,
        },
        {
            id: 12,
            nombre: 'Nike Sportswear Air',
            precio: 49.99,
        },
        {
            id: 13,
            nombre: 'Cadena de plata',
            precio: 10.99,
        },
        {
            id: 14,
            nombre: 'Cadena de oro',
            precio: 12.99,
        },
        {
            id: 15,
            nombre: 'Anillo de plata',
            precio: 7.99,
        },
        {
            id: 16,
            nombre: 'Anillo de oro',
            precio: 9.99,
        },
        {
            id: 17,
            nombre: 'Letter Hoddie',
            precio: 34.99,
        },
        {
            id: 18,
            nombre: 'Dri-FIT Sport BC Fleece Hoodie',
            precio: 55.99,
        },
        {
            id: 19,
            nombre: 'Grmy True Roots Reversible Puffy Jacket',
            precio: 99.99,
        },
        {
            id: 20,
            nombre: 'M Puffect II Vest',
            precio: 90.99,
        },
        {
            id: 21,
            nombre: 'Grmy True Roots Sweatpants',
            precio: 59.99,
        },
        {
            id: 22,
            nombre: 'Chicago Bulls Statement Edition',
            precio: 64.99,
        },
        {
            id: 23,
            nombre: 'Jordan Artist Series by Jacob Rochester',
            precio: 69.99,
        },
     
    ];
    
    let carrito = [];
    const divisa = '€';
    const DOMitems = document.querySelector('#items');
    const DOMcarrito = document.querySelector('#carrito');
    const DOMtotal = document.querySelector('#total');
    const DOMbotonVaciar = document.querySelector('#boton-vaciar');
    const miLocalStorage = window.localStorage;
    
    // Funciones
    
    /**
    * Dibuja todos los productos a partir de la base de datos. No confundir con el carrito
    */
    function renderizarProductos() {
        baseDeDatos.forEach((info) => {
            // Estructura
            const miNodo = document.createElement('div');
            
    
            // Body
            const miNodoCardBody = document.createElement('div');
            miNodoCardBody.classList.add('card-body');
             // Imagen
            const miNodoImagen = document.createElement('img');
            miNodoImagen.classList.add('img-fluid');
            miNodoImagen.setAttribute('src', info.imagen);

            // Precio
            const miNodoPrecio = document.createElement('p');
            miNodoPrecio.classList.add('card-text');
            
            // Boton 
            const miNodoBoton = document.createElement('button');
            
            miNodoBoton.classList.add('btn', 'btn-primary');
            miNodoBoton.textContent = 'Añadir al carrito';
            miNodoBoton.setAttribute('marcador', info.id);
            miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);
            // Insertamos
          
        
           
            miNodoCardBody.appendChild(miNodoBoton);
            miNodo.appendChild(miNodoCardBody);
            DOMitems.appendChild(miNodo);
        });
    }
    
    /**
    * Evento para añadir un producto al carrito de la compra
    */
    function anyadirProductoAlCarrito(evento) {
        // Anyadimos el Nodo a nuestro carrito
        carrito.push(evento.target.getAttribute('marcador'))
        // Actualizamos el carrito 
        renderizarCarrito();
        // Actualizamos el LocalStorage
        guardarCarritoEnLocalStorage();
    }
    
    /**
    * Dibuja todos los productos guardados en el carrito
    */
    function renderizarCarrito() {
        // Vaciamos todo el html
        DOMcarrito.textContent = '';
        // Quitamos los duplicados
        const carritoSinDuplicados = [...new Set(carrito)];
        // Generamos los Nodos a partir de carrito
        carritoSinDuplicados.forEach((item) => {
            
            // Obtenemos el item que necesitamos de la variable base de datos
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                // ¿Coincide las id? Solo puede existir un caso
                return itemBaseDatos.id === parseInt(item);
            });
            // Cuenta el número de veces que se repite el producto
            const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                // ¿Coincide las id? Incremento el contador, en caso contrario no mantengo
                return itemId === item ? total += 1 : total;
            }, 0);
            // Creamos el nodo del item del carrito
            const miNodo = document.createElement('li');
            miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
            miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].precio}${divisa}`;
            // Boton de borrar
            const miBoton = document.createElement('button');
            miBoton.classList.add('btn', 'btn-danger', 'mx-5');
            miBoton.textContent = 'X';
            miBoton.style.marginLeft = '1rem';
            miBoton.dataset.item = item;
            miBoton.addEventListener('click', borrarItemCarrito);
            // Mezclamos nodos
            miNodo.appendChild(miBoton);
            DOMcarrito.appendChild(miNodo);
        });
        // Renderizamos el precio total en el HTML
        DOMtotal.textContent = calcularTotal();
    }
    
    /**
    * Evento para borrar un elemento del carrito
    */
    function borrarItemCarrito(evento) {
        // Obtenemos el producto ID que hay en el boton pulsado
        const id = evento.target.dataset.item;
        // Borramos todos los productos
        carrito = carrito.filter((carritoId) => {
            return carritoId !== id;
        });
        // volvemos a renderizar
        renderizarCarrito();
        // Actualizamos el LocalStorage
        guardarCarritoEnLocalStorage();
    
    }
    
    /**
     * Calcula el precio total teniendo en cuenta los productos repetidos
     */
    function calcularTotal() {
        // Recorremos el array del carrito 
        return carrito.reduce((total, item) => {
            // De cada elemento obtenemos su precio
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });
            // Los sumamos al total
            return total + miItem[0].precio;
        }, 0).toFixed(2);
    }
    
    /**
    * Varia el carrito y vuelve a dibujarlo
    */
    function vaciarCarrito() {
        // Limpiamos los productos guardados
        carrito = [];
        // Renderizamos los cambios
        renderizarCarrito();
        // Borra LocalStorage
        localStorage.clear();
    
    }
    
    function guardarCarritoEnLocalStorage () {
        miLocalStorage.setItem('carrito', JSON.stringify(carrito));
    }
    
    function cargarCarritoDeLocalStorage () {
        // ¿Existe un carrito previo guardado en LocalStorage?
        if (miLocalStorage.getItem('carrito') !== null) {
            // Carga la información
            carrito = JSON.parse(miLocalStorage.getItem('carrito'));
        }
    }
    
    // Eventos
    DOMbotonVaciar.addEventListener('click', vaciarCarrito);
    
    // Inicio
    cargarCarritoDeLocalStorage();
    renderizarProductos();
    renderizarCarrito();
    });

   