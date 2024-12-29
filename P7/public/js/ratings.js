document.addEventListener('DOMContentLoaded', () => {
  console.log('Iniciando fetch ...');

  // Obtenemos todos los elementos con la clase "stars"
  const ele_stars = document.getElementsByClassName('stars');

  // Iteramos sobre cada elemento para realizar el fetch
  for (const ele of ele_stars) {
      const ide = ele.dataset._id; // ID del producto desde el atributo 'data-_id'
  
      // Realizamos un fetch al endpoint de ratings para el producto específico
      fetch(`/tienda/api/ratings/${ide}`)
          .then(response => {
              if (!response.ok) {
                  throw new Error(`Error al obtener los datos del API para ID: ${ide}`);
              }
              return response.json();
          })
          .then(data => {
              // El rating siempre está presente en el producto según el esquema
              const { rate, count } = data.rating;
      
              // Generamos el HTML para las estrellas
              const html_nuevo_con_las_estrellas = generarEstrellas(rate, count, ide);
      
              // Actualizamos el contenido del elemento con las estrellas generadas
              ele.innerHTML = html_nuevo_con_las_estrellas;

              // Añadimos manejadores de eventos a las estrellas
              añadirManejadores(ele, ide);
          })
          .catch(error => {
              console.error(`Hubo un problema con el fetch para ID: ${ide}`, error);
              ele.innerHTML = 'Error al cargar estrellas'; // Mensaje en caso de error
          });
  }
});

// Función para generar estrellas
function generarEstrellas(rate, count, ide) {
  const estrellasTotales = 5; // Máximo número de estrellas
  let estrellasHTML = '';

  // Generar estrellas llenas y vacías basadas en el rating
  for (let i = 1; i <= estrellasTotales; i++) {
      if (i <= Math.round(rate)) {
          estrellasHTML += `<span class="estrella llena" data-star="${i}" data-_id="${ide}">★</span>`;
      } else {
          estrellasHTML += `<span class="estrella vacia" data-star="${i}" data-_id="${ide}">☆</span>`;
      }
  }

  // Agregar la cantidad de votos al final
  estrellasHTML += ` <span class="contador">(${count} votos)</span>`;

  return estrellasHTML;
}

// Manejador de eventos a las estrellas
function añadirManejadores(ele, ide) {
  if (window.location.pathname.includes('/detalles/')){
    for (const ele_hijo of ele.children) {
        if (ele_hijo.classList.contains('estrella')) {
            ele_hijo.addEventListener('click', Vota);
        }
    }
  }
}

// Función para manejar el clic en una estrella
function Vota(evt) {
  const ele = evt.target.parentElement; // Contenedor de las estrellas
  const ide = evt.target.dataset._id; // ID del producto
  const pun = evt.target.dataset.star; // Estrella seleccionada

  // Bloquear interacción si ya se ha votado
  if (ele.dataset.votado === 'true') {
      alert('Ya has votado para este producto.');
      return;
  }

  if (!pun || !ide) return; // Si no hay datos válidos, salir

  // Obtener los datos actuales
  const contadorEle = ele.querySelector('.contador');
  const votosTexto = contadorEle.textContent.match(/\d+/);
  const votosActuales = votosTexto ? parseInt(votosTexto[0]) : 0;

  // Rating actual (puede no estar redondeado)
  const estrellasLlenas = ele.querySelectorAll('.estrella.llena').length;
  const rateActual = estrellasLlenas;

  // Cálculo del nuevo rating ponderado
  const nuevaPuntuacion = parseFloat(pun); // Nueva puntuación del usuario
  const nuevoVotos = votosActuales + 1;
  const nuevoRating = ((rateActual * votosActuales) + nuevaPuntuacion) / nuevoVotos;

  // Actualización optimista
  const nuevoHTML = generarEstrellas(nuevoRating, nuevoVotos, ide);
  ele.innerHTML = nuevoHTML;

  // Añadimos manejadores nuevamente después de actualizar el DOM
  añadirManejadores(ele, ide);

  // Marcamos como votado
  ele.dataset.votado = 'true';

  // Realizamos el fetch para actualizar el rating en el servidor
  fetch(`/tienda/api/ratings/${ide}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ rate: nuevoRating, count: nuevoVotos })
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Error al actualizar la calificación');
      }
      return response.json();
  })
  .then(data => {
      console.log('Rating actualizado correctamente:', data);
  })
  .catch(error => {
      console.error('Hubo un problema al actualizar el rating:', error);

      // Revertimos la actualización en caso de error
      const revertHTML = generarEstrellas(rateActual, votosActuales, ide);
      ele.innerHTML = revertHTML;

      // Reaplicamos manejadores de eventos
      añadirManejadores(ele, ide);

      // Quitamos el estado de "votado" ya que falló
      ele.dataset.votado = 'false';

      alert('Hubo un problema al guardar la calificación. Inténtalo de nuevo.');
  });
}