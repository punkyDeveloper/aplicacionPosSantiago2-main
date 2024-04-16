let carroC = JSON.parse(localStorage.getItem('prodcutoCarro')) || [];

function agregarCarro(nombre, precio, id, stock) {
  const repe = carroC.some((repepro) => repepro.id === id);

  if (repe) {
    carroC.map((pordu) => {
      if (pordu.id === id) {
        pordu.cantidad++;

        localStorage.setItem('prodcutoCarro', JSON.stringify(carroC));
        precioTotal();
      }
    });
  } else {
    carroC.push({

      id,
      nombre,
      precio,
      cantidad: 1,
      stock

    });

    localStorage.setItem('prodcutoCarro', JSON.stringify(carroC));
  }

  verCarro();
}

// pinta el carro
function verCarro () {
  contadorMiCarro.innerHTML = '';

  carroC.forEach(miCarro => {
    contadorMiCarro.innerHTML += `
    <div class="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
    <div class="rounded-lg md:w-2/3">
      <div class="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start">
        <img src="https://source.unsplash.com/featured/300x201" alt="product-image" class="w-full rounded-lg sm:w-40" />
        <div class="sm:ml-4 sm:flex sm:w-full sm:justify-between">


          <div class="mt-5 sm:mt-0">
            <h2 class="text-lg font-bold text-gray-900">${miCarro.nombre}</h2>
          </div>
          <div class="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
            <div class="flex items-center border-gray-100">
              <span class="cursor-pointer rounded-l bg-gray-100 py-1 px-3.5 duration-100 hover:bg-blue-500 hover:text-blue-50" onclick="restar('${miCarro.id}')"> - </span>
              <input class="h-8 w-8 border bg-white text-center text-xs outline-none" type="number" value="${miCarro.cantidad}" />
              <span class="cursor-pointer rounded-r bg-gray-100 py-1 px-3 duration-100 hover:bg-blue-500 hover:text-blue-50" onclick="sumar('${miCarro.id}')"> + </span>
            </div>
            <div class="flex items-center space-x-4">
              <p class="text-sm">${miCarro.precio}</p>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5 cursor-pointer duration-150 hover:text-red-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
`;
  });

  precioTotal();
  calcularEnvio();
};
// suma productos precio
function precioTotal () {
  const total = carroC.reduce((acumulador, el) => acumulador + parseFloat(el.precio * el.cantidad), 0).toFixed(2);
  const precio = document.getElementById('precio');
  precio.innerHTML = `$ ${total}`;
};

// Función para calcular el costo de envío
function calcularEnvio () {
  const total = carroC.reduce((acumulador, el) => acumulador + parseFloat(el.precio * el.cantidad), 0).toFixed(2);
  const envioP = document.getElementById('envioP');
  if (total >= 400.00) {
    envioP.innerHTML = `$ ${0}`;
  } else {
    envioP.innerHTML = `$ ${100.00}`;
  }
}

function eliminarp (id) {
  const eliminar = carroC.find((elementop) => elementop.id === id);
  carroC = carroC.filter((carroid) => {
    return carroid !== eliminar;
  });
  localStorage.setItem('prodcutoCarro', JSON.stringify(carroC));
  verCarro();
}

function sumar(id) {
  carroC.map((produ) => {
    if (produ.id === id) {
      if (produ.cantidad < produ.stock) {
        produ.cantidad++;
      } else {
        alert('No hay más stock');
      }
      localStorage.setItem('prodcutoCarro', JSON.stringify(carroC));
      precioTotal();
      verCarro();
      actualizar();
    }
  });
}

function restar(id) {
  carroC.map((produ) => {
    if (produ.id === id) {
      produ.cantidad--;

      if (produ.cantidad === 0) {
        alert('se eliminaron todos los productos');
        eliminarp(id);
      }

      localStorage.setItem('prodcutoCarro', JSON.stringify(carroC));
      precioTotal();
      verCarro();
      actualizar();
    }
  });
}

// actualizar pagina
function actualizar () {
  location.reload();
  return false;
}