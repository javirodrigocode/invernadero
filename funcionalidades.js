$(document).ready(function () {
	//Declaración de variables
    let selectPlantas = $('#selectPlantas');
    let contenedorPlantas = $('#contenedorPlantas');
	
	//Creación del array de posiciones de plantas con sus imagenes
    let imagenesPlantas = [
        'img/CactusSuculenta.jpg',
        'img/FlorAnimada.jpg',
        'img/FlorecitaInfantil.jpg',
        'img/FlorSencilla.jpg',
        'img/MiniAloeVera.jpg',
        'img/UnaFlorSonriente.jpg',
    ];
	//Creo un evento change en el select de las plantas
    selectPlantas.on('change', function () {
        mostrarPlantas();
    });

	//Creo esta funcion para que muestre las plantas seleccionadas
    function mostrarPlantas() {
    let cantidadPlantas = parseInt(selectPlantas.val());
	// Limpio el contenedor antes de agregar nuevas imágenes
    contenedorPlantas.empty(); 

    // Copio y mezclo el array de imágenes de plantas para que no salgan siempre las mismas
    let imagenesPlantasAleatorias = imagenesPlantas.slice().sort(function() {
        return 0.5 - Math.random();
    });

    // Hago un for para crear un elemento de imagen usando jQuery y agrego la imagen al contenedor de plantas
    for (let i = 0; i < cantidadPlantas; i++) {
        let imagenPlanta = $('<img>').attr('src', imagenesPlantasAleatorias[i]).addClass('planta');
        contenedorPlantas.append(imagenPlanta);
	//Establezco un margen de 20px hacia la derecha entre imagenes	
        imagenPlanta.css({ margin: '0 20px 0 0' }); 
    }
}

	$('#botonIniciar').on('click', function () {
        console.log('Iniciar clicado');
        // Oculto el botón Iniciar y muestra el botón Replantar
        $('#botonReplantar').show();
        $(this).hide();

        // Muevo las plantas cuando se hace clic en Iniciar
        moverPlantas();
    });

	//Creo esta funcion para realizar el desplazamiento de las plantas
    function moverPlantas() {
        // Calculo la posición final hasta donde deben llegar las plantas
        let alturaMaxima = 600;
		// Selecciono todas las imagenes por su atributo img
         let plantas = $('img[src^="img/"]');
        // Variable con la que almaceno el orden de llegada
        let ordenLlegada = [];
        // variable que cuenta cuántas plantas han llegado arriba
        let plantasLlegadas = 0;
        

        // Animo cada planta para que se muevan
        plantas.each(function (index, planta) {
            // Calculo una duración aleatoria
            let duracion = (Math.floor(Math.random() * 10) + 1) * 150;

            // Animo la planta hacia arriba hasta la altura máxima, lo tengo que poner en negativo para conseguirlo
            $(planta).animate(
                {
                    top: '-' + alturaMaxima + 'px',
                },
                {
                    duration: duracion,
                    easing: 'linear',
                    complete: function () {
                        // Incrementar el contador de plantas que han llegado arriba
                        plantasLlegadas++;

                        // Almacena el orden de llegada de la planta
                        let posicion = index + 1;
                        let nombrePlanta = obtenerNombrePlanta($(planta).attr('src'));						
                        ordenLlegada.push({ posicion: posicion, nombrePlanta: nombrePlanta });
						// Ordena el array según el orden de llegada
        
                        // Verificar si todas las plantas han llegado arriba
                        if (plantasLlegadas === plantas.length) {
							ordenLlegada.sort(function (a, b) {
							return a.posicion - b.posicion;
        });
							console.log('Orden de llegada:', ordenLlegada);

                            // Llamamos a la función después de que todas las plantas hayan llegado arriba
                            crearTablaPosiciones(ordenLlegada);
                        }
                    },
                }
            );
        });
    }

	function dejarCaerPlantas() {
        // Configurar la animación con anime.js para dejar caer las plantas
        anime({
            targets: '.planta',
            top: '0', // Volver a la posición original
            easing: 'easeInOutQuad',
            duration: 1000, // Duración fija, ajusta según tus necesidades
            complete: function () {
                // Luego de dejar caer las plantas, ocultar la tabla y vaciar su contenido
                $('.pantallaResultado h2').fadeOut(500, function () {
                    $(this).empty();
                });

                // También ocultar la tabla de resultados
                $('#tablaResultados').hide();

                // Vaciar el contenido de la tabla de resultados
                $('#tablaResultados').empty();
				// Restablecer el valor del selector de plantas a cero
            selectPlantas.val(0);
            },
        });
    }
	
    

    $('#botonReplantar').on('click', function () {
        console.log('Replantar clicado');
        dejarCaerPlantas();
        // Oculta el botón Replantar y muestra el botón Iniciar después de dejar caer las plantas
        setTimeout(function () {
            $('#botonIniciar').show();
            $('#botonReplantar').hide();        
        // Muestra nuevamente la pantalla inicial
        $('.pantallaInicial').show();
        }, 1000); // Ajusta el tiempo según la duración de dejarCaerPlantas
    });
    
        function crearTablaPosiciones(ordenLlegada) {
        // Verifico si hay plantas antes de continuar
        if (ordenLlegada.length > 0) {
            // Crea una tabla y le asigna estilos y clases
            let tablaResultados = $('<table>').attr('id', 'tablaResultados').addClass('miTabla');

            // Crea la fila de encabezado
            let filaEncabezado = $('<tr>');
            filaEncabezado.append($('<th>').text('Posición'));
            filaEncabezado.append($('<th>').text('Nombre de la Planta'));
            tablaResultados.append(filaEncabezado);

            // Agrega cada planta según el orden de llegada
            ordenLlegada.forEach(function (item) {
                let posicion = item.posicion;
                let nombrePlanta = item.nombrePlanta;
                let esPlantaPreferida = posicion === 1;
		
                // Crea una fila de datos
                let filaDatos = $('<tr>');
                // Añade la posición como una celda
                filaDatos.append($('<td>').text(posicion));
                // Añade el nombre de la planta como otra celda
                filaDatos.append($('<td>').text(nombrePlanta));
                // Añade la fila a la tabla
                tablaResultados.append(filaDatos);

                // Si es la planta preferida, agrega una fila adicional con el resultado
                if (esPlantaPreferida) {
                    let filaResultado = $('<tr>').addClass('resultadoFila');
                    filaResultado.append($('<td colspan="2">').text(nombrePlanta + ' (Planta Preferida)'));
                    tablaResultados.prepend(filaResultado);
                }
            });
            // Agrega la tabla al contenedor específico en tu HTML
            $('.pantallaResultado h2').after(tablaResultados);
            // Muestra la pantalla de resultados
            $('.pantallaResultado h2').css('display', 'block');
        }
    }
		//Funcion para que la tabla ponga el nombre y no la ruta
		function obtenerNombrePlanta(rutaImagen) {
		console.log('Ruta de la imagen:', rutaImagen);
		let partesRuta = rutaImagen.split('/');
		console.log('Partes de la ruta:', partesRuta);
		let nombreImagen = partesRuta[partesRuta.length - 1];
		console.log('Nombre de la imagen:', nombreImagen);
		let nombrePlanta = nombreImagen.split('.')[0]; // Elimina la extensión '.jpg'
		console.log('Nombre de la planta:', nombrePlanta);
		return nombrePlanta;
	}
});






