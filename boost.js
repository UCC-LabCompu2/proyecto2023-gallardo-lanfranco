/*
* Calcula el precio en base al rango inical y al rango final y ajusta el
* precio en base a la region que se selecciona
* @method calcularPrecio
* @param {number} rangoInicial - Almacena el rango inicial del cliente
* @param {number} rangoFinal - Almacena el rango deseado del cliente
* @param {string} region - Es la region seleccionada por el cliente
* @return string Precio en el formato MON$XXXX
*/
let calcularPrecio = function(rangoInicial, rangoFinal, region){
    let moneda;
    let ajuste = 1;
    region === "LAS" ? moneda = "ARS$" : moneda = "USD$";
    region === "LAS" ? ajuste = 200 : void(0);


    let precioFinal;
    rangoInicial > 6 ?
        precioFinal = (rangoFinal - rangoInicial) * 1.50 * 200 * ajuste :
        precioFinal = (rangoFinal - rangoInicial) * 200 * ajuste;


    return moneda + precioFinal;
}

/*
* Es la funcion que, al seleccionar rangos, calcula el precio y muestra el canvas.
* En caso de un ingreso erroneo (rangoInicial>rangoFinal) se muestra un error.
* @method mostrar
* @param sin parametros
* @return no retorna nada
*/
let mostrar = function(){
    const rangoInicial = document.getElementById("rango").value;
    const rangoFinal = document.getElementById("rank").value;
    const region = document.getElementById("regionn").value;


    if(rangoInicial > rangoFinal)
    {
        errorDeRango();
    }else{
        document.getElementById("precio").text = calcularPrecio(rangoInicial, rangoFinal, region);
        canvas.animate(rangoInicial, rangoFinal);
    }

}

/*
* Emerge una alerta que nos advierte que ingresamos de manera erronea los rangos (rangoInicial>rangoFinal)
* y colorea los rangos en rojo.
* @method errorDeRango
* @param sin parametros
* @return no retorna nada
*/
let errorDeRango = function(){
    alert("Seleccione un rango actual menor al rango deseado!");
    document.getElementById("rango").style.color = "red";
    document.getElementById("rank").style.color = "red";
}

/*
* Valida que los rangos seleccionados por el usuario sean correctos (rangoFinal>rangoInicial)
* @method validar
* @param sin parametros
* @return no retorna nada
*/
let validar = function(){
    const rangoInicial = document.getElementById("rango").value;
    const rangoFinal = document.getElementById("rank").value;
    if(rangoInicial < rangoFinal) {
        document.getElementById("rango").style.color = "black";
        document.getElementById("rank").style.color = "black";
        mostrar();
    }
    else{
        errorDeRango();
    }
}

/*
* Una vez accionado el boton "pagar", nos envia al apartado "Metodo de Pago" para pagar.
* En caso de no haber calculado el precio previamente, se muestra una alerta.
* @method pagar
* @param sin parametros
* @return no retorna nada
*/
let pagar = function(){
    const precio = Number(document.getElementById("precio").text.split("$")[1]);
    if(precio){
        alert("Muchas gracias!!! Nos comunicaremos con usted via e-mail");
    }
    else{
        alert("Por favor presione el boton de calcular precio");
    }
}


// Objeto de canvas para facilitar el uso de las funciones de canvas
/*
 * @typedef {Object} canvas
 * @property {number} width - El ancho del canvas.
 * @property {number} height - La altura del canvas.
 * @property {Object} artist - Instancia del objeto artist (libreria para canvas).
 * @property {Array<HTMLImageElement>} images - El array donde se guardan las imagenes utilizadas por canvas.
 * @property {Array<HTMLImageElement>} images - El array donde se guardan las imagenes que se mostraran.
 */
let canvas = {

    // Parametros de base de el canvas
    width: 700,
    height: 250,
    artist: null,
    images: [],
    drawingImages: [],

    /*
    * Se ejecuta cuando carga la pagina. Carga todas las imagenes que el canvas va a necesitar
    * @method load
    * @param sin parametros
    * @return no retorna nada
    */
    load: function(){
        this.artist = new Artist(this.width,this.height);
        this.artist.drawRect(0,0,this.width,this.height,"#aaa");


        ////////////////////  IMAGES
        let imageNames = ["fondoboost", "imply", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
        imageNames.forEach(img => {
            //utilizando una imagen, a la clase artista le cargamos una imagen por cada iteracion
            this.images[img] = this.artist.loadImg('./Imagenes/' + img + '.png');
        })

        this.start();
    },

    /*
    * Se ejecuta luego de load. Se asegura que todas las imagenes esten listas para usarse, en caso contrario
    * prepara una pantalla de carga hasta que todas las imagenes lo esten
    * @method start
    * @param sin parametros
    * @return no retorna nada
    */
    start: function(){

        let loaded = true;
        let loadCount = 0;

        //Nos devuelve un array de las enumeraciones dentro de this.images (otro array). A ese array
        //lo iteramos con las posiciones y comprobamos si la imagen de la posicion correspondiente esta lista o no.
        Object.keys(this.images).forEach(img => {
            if(this.images[img].ready === false){
                loaded = false;
                loadCount++;
            }
        })

        if(loaded === false){
            //dibujar pantalla de carga
            canvas.artist.drawRect(0,0, canvas.width, canvas.height, 'black')
            canvas.artist.writeText('Cosas a cargar: ' + loadCount, 50,50,50,'white');
            window.requestAnimationFrame(canvas.start.bind(this)); //bind sirve para apuntar al this de esa instancia (es una especie de callback)
        }else{
            //iniciar canvas
            this.update();
        }
    },

    /*
    * Se ejecuta por primera vez luego de start, y luego en un loop infinito entre update y draw.
    * Actualiza datos del canvas, en este caso ninguno
    * @method update
    * @param sin parametros
    * @return no retorna nada
    */
    update: function(){
        this.draw();
    },

    /*
    * Se ejecuta en un loop infinito con update, genera el animationFrame para cada update
    * Dibuja todas las imagenes que el canvas necesita
    * @method draw
    * @param sin parametros
    * @return no retorna nada
    */
    draw: function(){
        this.artist.drawImage(this.images["fondoboost"], 0,0,canvas.width,canvas.height);
        this.drawingImages.forEach((image, i) => {
            this.artist.drawImage(image, 50 + i * 200, this.height / 2 - image.height / 2, 200, 200);
        })
        window.requestAnimationFrame(canvas.update.bind(canvas)); //aqui aparece el loop infinito, ya que una funcion llama a la otra y asi...
    },

    /*
    * Agrega las imagenes de los rangos para poder ser animadas, es utilizada por la funcion mostrar.
    * @method animate
    * @param {number} rangoInicial- rango en el cual esta la cuenta del cliente al momento de contratar el servicio
    * @param {number} rangoFinal - rango al cual el cliente desea que se suba la cuenta
    * @return no retorna nada
    */
    animate: function(rangoInicial, rangoFinal){
        this.drawingImages = [];

        this.drawingImages.push(this.images[String(rangoInicial)])
        this.drawingImages.push(this.images["imply"])
        this.drawingImages.push(this.images[String(rangoFinal)])
    }

}

// Agrega la funcion load del objeto que creamos a la ventana en la que estamos
window.addEventListener('load', function(){
    canvas.load();
})