//Creación de variable constante. tendrá la URL de la API
const API_URL = "https://retoolapi.dev/SjC1H1/data";

//Función que llama al JSON
//La palabra async indica que la función es asíncrona, es decir, puede contener operaciones que esperan resultados que tardan un poco
async function obtenerPersonas(){
    //Respuesta del servidor
    const res = await fetch(API_URL); //Se hace una llamada al endpoint

    //Convertimos a JSON la respuesta del servidor. La tabla (API) opera con JSON
    const data = await res.json(); //Esto es un JSON

    //Enviamos el JSON que nos manda la API a la función que crea la tabla en HTML
    mostrarDatos(data);
}
//La función contiene un parámetro "datos" que representa al archivo JSON
function mostrarDatos(datos){
    //Constante tabla. Se instancia la tabla en el index.html, con el contenido (tbody). Se debe de poner '#' antes del nombre
    //para denotar el tipo de dato (clase).
const tabla = document.querySelector('#tabla tbody')
    //Para inyectar código HTML se usa innerHTML
    tabla.innerHTML = ''; //Vaciamos el contenido de la tabla usando ''
        datos.forEach(persona => {
        tabla.innerHTML += `
            <tr> 
                <td>${persona.id}</td>
                <td>${persona.nombre}</td>
                <td>${persona.apellido}</td>
                <td>${persona.correo}</td>
                <td>${persona.edad}</td>
                <td>
                    <button onclick="AbrirModalEditar(${persona.id}, '${persona.nombre}', '${persona.apellido}', '${persona.email}', '${persona.edad}')">Editar</button>
                    <button onClick="EliminarPersona(${persona.id})">Eliminar</button>
                </td>
            </tr>
            `
        });

}

//Llamada inicial para que se carguen los datos que vienen al servidor
obtenerPersonas();



//Agregar un nuevo registro
const modal = document.getElementById("modal-agregar"); //Cuadro de diálogo
const btnAgregar = document.getElementById("btnAbrirModal"); //+ para abrir
const btnCerrar = document.getElementById("btnCerrarModal"); //X para cerrar

btnAgregar.addEventListener("click", () => {
    modal.showModal(); //Abrir el modal al hacer clic en el botón
});

btnCerrar.addEventListener("click", () => {
    modal.close(); //Cerrar modal
});

//Agregar nuevo integrante desde el formulario
document.getElementById("frmAgregar").addEventListener("submit", async e => {
    e.preventDefault(); //"e" representa "submit" - Evita que el formulario se envíe

    //Capturar los valores del formulario
    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const correo = document.getElementById("email").value.trim();
    const edad = document.getElementById("edad").value.trim();

    //Validación básica
    if(!nombre || !apellido || !correo || !edad){
        alert("Complete todos los campos");
        return; //Evitar que el formulario se envíe
    }

    //Llamar a la API para enviar el usuario
    const respuesta = await fetch(API_URL, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({nombre, apellido, correo, edad})
    });

    if (respuesta.ok){
        alert("El registro fue agregado correctamente");

        //Limpiar el formulario y cerrar el modal
        document.getElementById("frmAgregar").reset();

        modal.close();

        //Recargar la tabla
        obtenerPersonas();
    }
    else{
        alert("Hubo un error al agregar");
    }

});



//Función para borrar registros
async function EliminarPersona(id){
    const confirmacion = confirm("¿Realmente deseas eliminar el registro?");

    //Validamos si el usuario dijo que sí desea borrar
    if(confirmacion){
        await fetch(`${API_URL}/${id}`, {method:"DELETE"});

        //Recargamos la tabla para ver la eliminación
        obtenerPersonas();
    }
}


//Proceso para editar un registro
const modalEditar = document.getElementById("modal-editar");
const btnCerrarEditar = document.getElementById("btnCerrarEditar");

btnCerrarEditar.addEventListener("click", ()=>{
    modalEditar.close(); //Cerrar Modal de Editar
});

function AbrirModalEditar(id, nombre, apellido, email, edad){
    //Se agregan los valores del registro en los input
    document.getElementById("idEditar").value = id;
    document.getElementById("nombreEditar").value = nombre;
    document.getElementById("apellidoEditar").value = apellido;
    document.getElementById("emailEditar").value = email;
    document.getElementById("edadEditar").value = edad;

    //Modal se abre después de agregar los valores a los input
    modalEditar.showModal();
}

document.getElementById("frmEditar").addEventListener("submit", async e=>{
    e.preventDefault(); //Evita que el formulario se envíe

    const id = document.getElementById("idEditar").value;
    const nombre = document.getElementById("nombreEditar").value.trim();
    const apellido = document.getElementById("apellidoEditar").value.trim();
    const correo = document.getElementById("emailEditar").value.trim();
    const edad = document.getElementById("edadEditar").value.trim();

    if(!id || !nombre || !apellido || !correo || !edad){
        alert("Complete todos los campos");
        return; //Evita que el código se siga ejecutando
    }

    //Llamada a la API
    const respuesta = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({edad, correo, nombre, apellido})
    });

    if(respuesta.ok){
        alert("Registro actualizado con éxito"); //Confirmación
        modalEditar.close(); //Cerramos el modal
        obtenerPersonas(); //Actualizamos la lista
    }
    else{
        alert("Hubo un erro al actualizar");
    }

});