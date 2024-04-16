let carro = JSON.parse(localStorage.getItem('prodcutoCarro')) || [];

function agregarCarro (nombre, precio, id, stock) {
  const repe = carro.some((repepro) => repepro.id === id);

  if (repe) {
    carro.map((pordu) => {
      if (pordu.id === id) {
        pordu.cantidad++;

        localStorage.setItem('prodcutoCarro', JSON.stringify(carro));
        precioT();
      }
    });
  } else {
    carro.push({

      id,
      nombre,
      precio,
      cantidad: 1,
      stock

    });

    localStorage.setItem('prodcutoCarro', JSON.stringify(carro));
  }

  contadorCarro();
}
// pinta el carro
function pintaCarro () {
  contenidoCarro.innerHTML = '';

  carro.forEach(miCarro => {
    contenidoCarro.innerHTML += `
<div class=" mb-3" >
<div class="row g-0">
  <div class="col-md-4">
    <img src="https://source.unsplash.com/featured/300x201${miCarro.nombre}" class="img-fluid rounded-start" alt="...">
  </div>
  <div class="col-md-8">
    <div class="card-body">
      <h5 class="card-title">${miCarro.nombre}</h5>
      <p class="card-text">$ ${miCarro.precio}</p>
    

      <div class="row ">
      <button class="btn btn-secondary" style="max-height:35px; max-width:30px;  margin:2px;" onclick="menos('${miCarro.id}')">-</button>
      <input type="number" style="max-height:35px; max-width:50px; margin:2px;" class="form-control w-50 card " name="mas"  value="${miCarro.cantidad}" readonly>
      <button class="btn btn-secondary" style="max-height:35px; max-width:30px; margin:2px;" onclick="mas('${miCarro.id}')">+</button>
      <button class="btn btn-danger" style="max-height:35px; max-width:40px; margin:2px;" onclick="eliminar('${miCarro.id}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
      <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
    </svg></button>
      </div>
      
      
      
      
    </div>
  </div>
</div>
</div>
`;
  });

  precioT();
};

function contadorCarro () {
  const cantidad = document.getElementById('cantidad');

  cantidad.style.display = 'block';
  cantidad.innerText = carro.length;
}

// suma productos precio
function precioT () {
  const total = carro.reduce((acumulador, el) => acumulador + parseFloat(el.precio * el.cantidad), 0).toFixed(2);

  const precioTotal = document.getElementById('precioTotal');
  precioTotal.innerHTML = `<p>total: $ ${total}</p>`;
};

// eliminar producto

function eliminar (id) {
  const eliminar = carro.find((elementop) => elementop.id === id);
  carro = carro.filter((carroid) => {
    return carroid !== eliminar;
  });

  localStorage.setItem('prodcutoCarro', JSON.stringify(carro));
  pintaCarro();
}
function mas (id) {
  carro.map((produ) => {
    if (produ.id === id) {
      if (produ.cantidad < produ.stock) {
        produ.cantidad++;
      } else {
        alert('No hay más stock');
      }
      localStorage.setItem('productoCarro', JSON.stringify(carro));
      precioT();
      pintaCarro();
    }
  });
}

function menos (id) {
  carro.map((produ) => {
    if (produ.id === id) {
      produ.cantidad--;

      if (produ.cantidad === 0) {
        eliminar(id);
      }

      localStorage.setItem('prodcutoCarro', JSON.stringify(carro));
      precioT();
      pintaCarro();
    }
  });
}

// actualizar pagina
function actualizar () {
  location.reload();
  return false;
}
