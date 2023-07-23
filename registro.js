contrasena1 = document.getElementById("contraseña");
contrasena2 = document.getElementById("confirmar_contraseña");
formulario = document.getElementById("formRegistro");


/*
* Es la funcion que se encarga de comprobar si contrasena y confirmar contrasena son identicas.
* en caso de no serlo, nos advierte y nos pide corregir. Una vez corregido, podemos registrarnos exitosamente.
* @method validarContrasena
* @param1 {submitEvent} -
* @return no retorna nada
*/
formulario.addEventListener("submit", function validarContrasena(e){
    e.preventDefault(); //desactiva el evento submit
    if(contrasena1.value !== contrasena2.value){
        alert("Confirme la contrasenia de manera correcta");
    }else{
        alert("Registro exitoso");
        formulario.submit();
    }
});