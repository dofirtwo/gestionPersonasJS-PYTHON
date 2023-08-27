listaPersonas=[]
let mensajeValidarDatos=""

/**
 * Función que valida que los campos de texto
 * no esten vaciós a la hora de hacer peticiones
 * @returns true o false
 * 
 */
function validarDatos(){
    let identificacion = document.getElementById("txtIdentificacion")
    let nombre = document.getElementById("txtNombre")
    let correo = document.getElementById("txtCorreo")
    let fechaNacimiento = document.getElementById("txtFechaNacimiento")
    
    if(identificacion.value==""){
        mensajeValidarDatos="Debe ingresar la Identificación"
        return false;
    }else if(nombre.value==""){
        mensajeValidarDatos="Debe ingresar el nombre"
        return false;
    }else if(correo.value==""){
        mensajeValidarDatos="Debe ingresar el correo electrónico"
        return false;
    }else if(fechaNacimiento.value==""){
        mensajeValidarDatos="Debe seleccionar fecha de Nacimiento"
        return false;
    }else{
        return true;
    }
}

/**
 * Función que muestra la lista de personas
 * en una tabla html
 */
function mostrarDatosTabla(){
    let datos=""
    listaPersonas.forEach(persona => {
        datos += "<tr>"
        datos += "<td>" + persona[0] + "</td>"
        datos += "<td>" + persona[1] + "</td>"
        datos += "<td>" + persona[2] + "</td>"
        datos += "<td>" + persona[3] + "</td>"
        datos += "</tr>"
    });
    document.getElementById("datosPersonas").innerHTML = datos
}

/**
 * Petición al servidor mediante API fetch para agregar
 * una persona
 */
function agregar(){   
    if(validarDatos()){
        const data = new FormData(document.getElementById("frmPersonas"));
        const url = "/agregar";
        fetch(url,{method:"POST",body:data})
        .then(respuesta=>respuesta.json())
        .then(resultado=>{
            console.log(resultado);
            if(resultado.estado){
                limpiar()
                Swal.fire("Registro Persona",resultado.mensaje,"success");
                listaPersonas = resultado.listaPersonas
                mostrarDatosTabla()
            }else{
                Swal.fire("Registro Persona",resultado.mensaje,"warning");
            }
        })
        .catch(error=>console.log(error))

    }else{
        Swal.fire("Registro Persona",mensajeValidarDatos,"warning");
    }

}

/**
 * Petición al servidor mediate API fetch para actualizar una persona.
 */
function actualizar(){   
    if(validarDatos()){
        const data = new FormData(document.getElementById("frmPersonas"));
        const url = "/actualizar";
        fetch(url,{method:"POST",body:data})
        .then(respuesta=>respuesta.json())
        .then(resultado=>{
            console.log(resultado);
            if(resultado.estado){
                limpiar()
                Swal.fire("Actualizar Persona",resultado.mensaje,"success");
                listaPersonas = resultado.listaPersonas
                mostrarDatosTabla()
            }else{
                Swal.fire("Actualizar Persona",resultado.mensaje,"warning");
            }
        })
        .catch(error=>console.log(error))

    }else{
        Swal.fire("Registro Persona",mensajeValidarDatos,"warning");
    }

}

function modalEliminar(){
    Swal.fire({
        title: 'Eliminar Persona',
        text: "¿Estan seguros de eliminar?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'No',
        confirmButtonText: 'Si'
      }).then((result) => {
        if (result.isConfirmed) {
          eliminar()
        }
      })
}

function eliminar(){   
    if (document.getElementById("txtIdAnterior").value!=""){
        const url = "/eliminar";
        const datos ={
            identificacion: document.getElementById("txtIdAnterior").value
        }
        fetch(url,{
            method:"POST",
            body:JSON.stringify(datos),
            "headers":{"Content-Type":"application/json"}
        })
        .then(respuesta=>respuesta.json())
        .then(resultado=>{
            console.log(resultado);
            if(resultado.estado){
                Swal.fire("Eliminar Persona",resultado.mensaje,"success");
                listaPersonas=resultado.listaPersonas
                mostrarDatosTabla()
                limpiar()
            }else{
                Swal.fire("Eliminar Persona",resultado.mensaje,"warning");
            }
        })
        .catch(error=>console.log(error))
    }else{
        Swal.fire("Eliminar Persona","Debe primero consultar la persona","warning");
    }

}

/**
 * Consulta una persona de acuerdo a su identificación en la lista local
 * en el cliente.
 */
function consultarPorIdentificacion(){
    let identificacion = document.getElementById("txtIdentificacion")
    let existe=false
    if(identificacion.value!=""){
        listaPersonas.forEach(persona => {
            if(persona[0]==identificacion.value){
                document.getElementById("txtIdentificacion").value=persona[0]
                document.getElementById("txtNombre").value=persona[1]
                document.getElementById("txtCorreo").value=persona[2]
                document.getElementById("txtFechaNacimiento").value=persona[3]
                document.getElementById("txtIdAnterior").value=persona[0]
                existe=true
            }
        });
        if(!existe){
            document.getElementById("txtNombre").value=""
            document.getElementById("txtCorreo").value=""
            document.getElementById("txtFechaNacimiento").value=""
            let mensaje="No existe persona con esa identificación"
            Swal.fire("Consultar Persona",mensaje,"warning");
        }
    }else{
        Swal.fire("Consultar Persona","Debe ingresar identificación para consultar","warning");
    }
}

/**
 * Limpiar formulario para que las cajas de texto
 * queden sin datos
 */
function limpiar(){
    document.getElementById("txtIdentificacion").value=""
    document.getElementById("txtNombre").value=""
    document.getElementById("txtCorreo").value=""
    document.getElementById("txtFechaNacimiento").value=""
}

/**
 * Pertición al servidor mediante API fetch para obtener
 * la lista de personas al cargar el html
 */
function iniciar(){   
    const url = "/iniciar";
    fetch(url,{method:"GET"})
    .then(respuesta=>respuesta.json())
    .then(resultado=>{
        console.log(resultado);                        
        listaPersonas = resultado.listaPersonas
        mostrarDatosTabla()
    })
    .catch(error=>console.log(error))
}
