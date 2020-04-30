//Intalar un plugin
//cordova plugin add cordova-plugin-firestore --save
//1.- Crear el documento completar_datos.html
//2.- Diseñar un formulario con los campos a registrar
//    FIRESTORE
//cordova plugin add cordova-plugin-firestore --save

$(document).ready(function() {
    onLoad();
});

function onLoad() //Evento basico e indispensable para cargar CORDOVA
{
	document.addEventListener('deviceready', onDeviceReady, false);
}

function onDeviceReady() {
  document.getElementById('btn_continuar').addEventListener('click', registrarDatos, false);
}


function registrarDatos() {

  let nom = $("#nombre").val();
  let ape = $("#apellidos").val();
  let eda = $("#edad").val();
  let naciona = $("#nacionalidad").val();
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
    // Add a second document with a generated ID.
    db.get().collection("users").doc().set({
      nombre: nom,
      apellidos: ape,
      edad: eda,
      nacionalidad: naciona,
    })
    .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
      setTimeout(function () {
				$("#mensajes_continuar").fadeIn(1000);
			}, 500);
			$('#mensajes_continuar').html('<strong>Correcto!.</strong>');
			setTimeout(function () {
				$("#mensajes_continuar").fadeOut(1000);
				limpiarDatosL();
			}, 5000);
      let url = 'verDatos.html';
      $(location).attr('href',url);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
      setTimeout(function () {
				$("#mensajes_continuar").fadeIn(1000);
			}, 500);
			$('#mensajes_continuar').html('<strong>Error: ' + error + '.</strong>');
			setTimeout(function () {
				$("#mensajes_continuar").fadeOut(1000);
				limpiarDatosL();
			}, 5000);
    });
  });
}

function limpiarDatosL(){
  let nom = $("#nombre").val("");
  let ape = $("#apellidos").val("");
  let eda = $("#edad").val("");
  let naciona = $("#nacionalidad").val("");
}
