// =========== CONFIGURACIÓN INICIAL =========== 

// URL base de la API REST desde la que se consultan los productos.
const API_URL = "https://fakestoreapi.com/products";

// Referencias a los elementos HTML que JavaScript actualizará.
const contenedorProductos = document.getElementById("productos");
const estado = document.getElementById("estado");
const detalleProducto = document.getElementById("detalleProducto");
const tituloProducto = document.getElementById("tituloProducto");

// Creamos una instancia del modal de Bootstrap para mostrar los detalles.
const ventanaProducto = new bootstrap.Modal(
    document.getElementById("ventanaProducto"),
);

// Configuramos el formato de los precios en dólares estadounidenses.
const formatoPrecio = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});


// =========== CONSULTAR TODOS LOS PRODUCTOS (GET ALL PRODUCTS) =========== 

const obtenerProductos = async () => {
    try {
        
        const respuesta = await fetch(API_URL);

        // fetch() no lanza error en respuestas 404 o 500, así que lo comprobamos nosotros
        if (!respuesta.ok) {
        throw new Error(`Error HTTP ${respuesta.status}`);
        }

        const productos = await respuesta.json();
        pintarCards(productos);
        estado.textContent = "";
    } catch (error) {
        console.error(error);
        estado.textContent =
        "No se pudieron cargar los productos. Intenta de nuevo.";
        }
    };

// ===========  CREAR Y MOSTRAR LAS TARJETAS DE PRODUCTOS =========== 
const pintarCards = (productos) => {
    let tarjetas = "";

    productos.forEach((producto) => {
        tarjetas += `
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
            <div class="card tarjeta-producto h-100 shadow-sm">
            <img src="${producto.image}" class="card-img-top p-3"
                style="height: 200px; object-fit: contain;"
                alt="${producto.title}">

            <div class="card-body d-flex flex-column">
                <small class="text-muted">${producto.category}</small>
                <h6 class="card-title">${producto.title}</h6>
                <p class="fw-bold text-primary mt-auto">
                ${formatoPrecio.format(producto.price)}
                </p>
                <button class="btn btn-primary" data-id="${producto.id}">
                Ver detalles
                </button>
            </div>
            </div>
        </div>
        `;
    });

    contenedorProductos.innerHTML = tarjetas;
};



// ===========  CONSULTAR UN PRODUCTO POR SU ID (GET SINGLE PRODUCT) =========== 
// Se ejecuta al hacer click en el botón "Ver detalles" 

const obtenerProducto = async (id) => {
  // Abrimos con un mensaje de carga mientras llega la respuesta
    tituloProducto.textContent = "Cargando...";
    detalleProducto.innerHTML = "";
    ventanaProducto.show();

    try {
        const respuesta = await fetch(`${API_URL}/${id}`);

        // Comprobamos que la petición fue exitosa antes de leer los datos
        if (!respuesta.ok) {
            throw new Error(`Error HTTP ${respuesta.status}`);
        }

        const producto = await respuesta.json();
        mostrarDetalle(producto);
    }   catch (error) {
        console.error(error);
        tituloProducto.textContent = "Error";
        detalleProducto.innerHTML = '<p class="text-danger">No se pudo cargar el producto.</p>';
    }
};

// =========== MOSTRAR LOS DETALLES DEL PRODUCTO EN EL MODAL =========== 
const mostrarDetalle = (producto) => {
    // Actualizamos el título del modal con el nombre del producto.
    tituloProducto.textContent = producto.title;

    // Construimos el contenido con la imagen, categoría, precio y descripción.
    detalleProducto.innerHTML = `
        <div class="row align-items-center">
        <div class="col-md-5 text-center mb-3 mb-md-0">
            <img src="${producto.image}" class="img-fluid"
            style="max-height: 300px;"
            alt="${producto.title}">
        </div>
        <div class="col-md-7">
            <span class="badge text-bg-secondary mb-2">${producto.category}</span>
            <h3 class="text-primary">${formatoPrecio.format(producto.price)}</h3>
            <p>${producto.description}</p>
        </div>
        </div>
    `;
};


// ===========  DETECTAR LOS CLICS EN LOS BOTONES "VER DETALLES" =========== 
// Un solo listener para todos los botones

contenedorProductos.addEventListener("click", (evento) => {
  // Buscamos si el click fue en un botón que tenga data-id
    const boton = evento.target.closest("button[data-id]");
    if (boton) obtenerProducto(boton.dataset.id);
});


//  ===========  INICIAR LA APLICACIÓN  =========== 

obtenerProductos();