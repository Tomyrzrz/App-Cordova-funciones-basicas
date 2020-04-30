$(document).ready(function() {
    onLoad();
});

function onLoad() //Evento basico e indispensable para cargar CORDOVA
{
	document.addEventListener('deviceready', onDeviceReady, false);
}

function onDeviceReady() {
  document.getElementById("btn_logout").addEventListener('click', logout, false);
  checarDatos();
}

function logout(){
  cordova.plugins.firebase.auth.signOut();
  url = "index.html";
  $(location).attr("href", url);
}


function checarDatos() {

  var options = {
    "datePrefix": '__DATE:',
    "fieldValueDelete": "__DELETE",
    "fieldValueServerTimestamp" : "__SERVERTIMESTAMP",
    "persist": true,
//    "config" : {}
  };
  if (cordova.platformId === "browser") {
    options.config = {
        apiKey: "AIzaSyA_Y-0SYrRdeoXHpY5j7vqPiQbrU3tdNYE",
        authDomain: "localhost",
        projectId: "app1cordovaphonegap"
      };
  }
  var tabla = document.getElementById("datos");
  Firestore.initialise(options).then(function(db) {
    db.get().collection("users").get()
    .then(function(querySnapshot) {
      tabla.innerHTML = '';
      querySnapshot.forEach(function(doc) {
        tabla.innerHTML += `<tr>
        <td>${doc.data().nombre}</td>
        <td>${doc.data().apellidos}</td>
        <td>${doc.data().edad}</td>
        <td>${doc.data().nacionalidad}</td>
        <td><button class="btn btn-danger" onclick="eliminarDatos('${doc.id}');">Eliminar</button>
        <button class="btn btn-warning" data-toggle="modal" data-target="#modalEditar" onclick="cargarDatos('${doc.id}');" >Editar</button></td>
        </tr>`;
      });
    })
    .catch(function(error) {
      console.error("Error reading document: ", error);
    });
  });
}


function eliminarDatos(idoc){
  var options = {
    "datePrefix": '__DATE:',
    "fieldValueDelete": "__DELETE",
    "fieldValueServerTimestamp" : "__SERVERTIMESTAMP",
    "persist": true,
//    "config" : {}
  };
  if (cordova.platformId === "browser") {
    options.config = {
        apiKey: "AIzaSyA_Y-0SYrRdeoXHpY5j7vqPiQbrU3tdNYE",
        authDomain: "localhost",
        projectId: "app1cordovaphonegap"
      };
  }

  Firestore.initialise(options).then(function(db) {
    db.get().collection('users').doc(idoc).delete()
      .then(function(){
        location.reload()
      })
      .catch(function(){
        alert("Error, no pudimos eliminar, intenta mas tarde");
      });
  });
}


function cargarDatos(idoc){
  var options = {
    "datePrefix": '__DATE:',
    "fieldValueDelete": "__DELETE",
    "fieldValueServerTimestamp" : "__SERVERTIMESTAMP",
    "persist": true,
//    "config" : {}
  };
  if (cordova.platformId === "browser") {
    options.config = {
        apiKey: "AIzaSyA_Y-0SYrRdeoXHpY5j7vqPiQbrU3tdNYE",
        authDomain: "localhost",
        projectId: "app1cordovaphonegap"
      };
  }
  
  Firestore.initialise(options).then(function(db) {
    db.get().collection("users").doc(idoc).get()
    .then(function(querySnapshot) {
      $('#idocument').val(idoc);
      $('#nombre').val(querySnapshot.data().nombre);
      $('#apellidos').val(querySnapshot.data().apellidos);
      $('#edad').val(querySnapshot.data().edad);
      $('#nacionalidad').val(querySnapshot.data().nacionalidad);
    })
    .catch(function(){
      alert("No pudimos allar el documento");
    });
  });
}

function editarDatos(){

  let idoc = $('#idocument').val();
  let nomb = $('#nombre').val();
  let apell = $('#apellidos').val();
  let eda = $('#edad').val();
  let nacio = $('#nacionalidad').val();

  var options = {
    "datePrefix": '__DATE:',
    "fieldValueDelete": "__DELETE",
    "fieldValueServerTimestamp" : "__SERVERTIMESTAMP",
    "persist": true,
//    "config" : {}
  };
  if (cordova.platformId === "browser") {
    options.config = {
        apiKey: "AIzaSyA_Y-0SYrRdeoXHpY5j7vqPiQbrU3tdNYE",
        authDomain: "localhost",
        projectId: "app1cordovaphonegap"
      };
  }
  
  Firestore.initialise(options).then(function(db) {
    var referencia = db.get().collection("users").doc(idoc);
    return referencia.update({
      nombre: nomb,
      apellidos: apell,
      edad: eda,
      nacionalidad: nacio,
    })
    .then(function(){
      console.log('Datos actualizados');
    })
    .catch(function(){
      console.log('No se pudo');
    });
  });
}






