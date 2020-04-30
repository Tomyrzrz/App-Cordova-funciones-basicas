//Para Android
//Instalar este plugin
//cordova plugin add cordova-support-google-services --save
//Colocar el GOOGLE_SERVICES.JSON en la Raiz del proyecto
//Instalar este otro plugin
//cordova plugin add cordova-plugin-firebase-authentication --save
//Colocar este codigo en el archivo config.xml para agregar el json de Google al proyecto
//<platform name="android">
    //<resource-file src="google-services.json" target="app/google-services.json" />
    //...
//</platform>
//Si te marca errores al compilar, instalar los dos siguientes plugins
//cordova plugin add cordova-plugin-androidx
//cordova plugin add cordova-plugin-androidx-adapter

$(document).ready(function() {
    onLoad();
});

function onLoad() //Evento basico e indispensable para cargar CORDOVA
{
	document.addEventListener('deviceready', onDeviceReady, false);
}

function onDeviceReady() {
  document.getElementById('btn_login').addEventListener('click', login, false);
  checarStatus();
}

function checarStatus(){
	cordova.plugins.firebase.auth.onAuthStateChanged(function(user){
		if(user){
			url = "verDatos.html";
			$(location).attr("href", url);
		}
	});
}


function logup(){
	let email = $('#email').val();
	let pass = $('#password').val();
	cordova.plugins.firebase.auth.createUserWithEmailAndPassword(email,pass)
		.then(function(){
			setTimeout(function(){
				$('#mensajes').fadeIn(1000);
			}, 500);
			$('#mensajes')
				.html('<strong>Correct, user created.</strong>');
			setTimeout(function(){
				$('#mensajes').fadeOut(1000);
			}, 5000);
			cleanFields();
			let url = 'completar_datos.html';
			$(location).attr('href',url);
		})
		.catch(function(error){
			setTimeout(function(){
				$('#mensajes').fadeIn(1000);
			}, 500);
			$('#mensajes')
				.html('<strong>Error:' + error.message + '</strong>');
			setTimeout(function(){
				$('#mensajes').fadeOut(1000);
			}, 5000);
		});
}


function login(){
	let email = $('#email').val();
	let pass = $('#password').val();
	cordova.plugins.firebase.auth.signInWithEmailAndPassword(email,pass)
		.then(function(){
			setTimeout(function(){
				$('#mensajes').fadeIn(1000);
			}, 500);
			$('#mensajes')
				.html('<strong>Login Correct.</strong>');
			setTimeout(function(){
				$('#mensajes').fadeOut(1000);
			}, 5000);
			cleanFields();
			url = 'verDatos.html';
			$(location).attr('href',url);
		})
		.catch(function(error){
			setTimeout(function(){
				$('#mensajes').fadeIn(1000);
			}, 500);
			$('#mensajes')
				.html('<strong>Error:' + error.message + '</strong>');
			setTimeout(function(){
				$('#mensajes').fadeOut(1000);
			}, 5000);
		});
}



function cleanFields(){
	$('#email').val('');
	$('#password').val('');
}












