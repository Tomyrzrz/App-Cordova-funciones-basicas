$(document).ready(function(){
	onLoad();
});

function onLoad(){
	document.addEventListener('deviceready', onDeviceReady, false);
}

function onDeviceReady(){
	console.log('Phonegap se ha cargado correctamente');
	alert('Gracias amigo ya se cargo PhoneGap');
	//document.addEventListener('volumedownbutton', onVolumeDown, false);
	//document.addEventListener('volumeupbutton', onVolumeUp, false);
	//document.addEventListener('pause', onPause, false);
	//document.addEventListener('resume', onResume, false);
	
	//document.addEventListener('batterystatus', onBatteryStatus, false);
	//document.addEventListener('batterylow', onBatteryLow, false);
	//document.addEventListener('batterycritical', onBatteryCritical, false);
	
	document.addEventListener('click', camara_photo.init, false);
	document.addEventListener('click', mensajeDialogo.init, false);
	document.addEventListener('click', musica.init, false);
document.addEventListener('click', selectedImg.init, false);
document.addEventListener('click', copyImg.init, false);

} 

let mapas = {
	map: null,
	currentMarker: null,
	defaultPosition: {
		coords: {
			latitude: 19.4567,
			longitude: -100.6547
		}
	},
	init: function(){
		document.addEventListener('deviceready', mapas.ready);
	},
	ready: function(){
		let s = document.createElement("script");
		document.head.appendChild(s);
		s.addEventListener("load", mapas.mapScriptReady);
		s.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAHy3BSyebYJhIVGNIDrLZRpjDWflolnd0`;
	},
	mapScriptReady: function(){
		if (navigator.geolocation) {
			let options = {
				enableHighAccuracy: true,
				timeout: 20000,
				maximumAge: 1000 * 60 * 60
			};
			navigator.geolocation.getCurrentPosition(
				mapas.gotPosition,
				mapas.failPosition,
				options
				);
		}else {
			mapas.gotPosition(mapas.defaultPosition);
		}
	},
	gotPosition: function(position){
		let divicion = document.getElementById('mapa');
		console.log('Cargando mapa');
		//divicion.textContent = position;
		mapas.map = new google.maps.Map(document.getElementById("mapa"),{
			zoom: 13,
			center: {
				lat: position.coords.latitude,
				lng: position.coords.longitude,
			},
			disableDoubleClickZoom: true
		});
		mapas.addMapListeners();
	},
	addMapListeners: function(){
		console.log('Agregando Opciones al mapa');
		mapas.map.addListener('dblclick', mapas.addMarker);
	},
	addMarker: function(ev){
		console.log('Marker ', ev);
		let marker = new google.maps.Marker({
			map: mapas.map,
			draggable: false,
			position: {
				lat: ev.latLng.lat(),
				lng: ev.latLng.lng()
			}
		});
		marker.addListener('click', mapas.markerClick);
		marker.addListener('dblclick', mapas.markerDblclick);
	},
	markerClick: function(ev){
		console.log('Click ', ev);
		console.log(this);
		let marker = this;
		mapas.currentMarker = marker;
		mapas.map.panTo(marker.getPosition());
	},
	markerDblclick: function(ev){
		console.log('Double Click ', ev);
		console.log(this);
		let marker = this;
		marker.setMap(null);
		mapas.currentMarker = null;
	},
	failPosition: function(err){
		console.log('Error:',err);
		mapas.gotPosition(mapas.defaultPosition);
	}
}


mapas.init();




var copyImg = {
	tempURL: null,
	folderPermanent: null,
	oldFile: null,
	permanentFile: null,
	KEY: "KuyOldFileName",
	init: () => {
		setTimeout(function() {
			console.log('File plugin ready');
			copyImg.addListeners();
			copyImg.getPermanentFolder();
		}, 2000);
	},
	addListeners: () => {
		document.getElementById('btn_take_picture')
			.addEventListener('click', selectedImg.takephoto);
		document.getElementById('btn_copy_photo')
			.addEventListener('click', copyImg.copyImagen);
	},
	getPermanentFolder: () => {
		let path = cordova.file.dataDirectory;
		resolveLocalFileSystemURL(
			path,
			dirEntry => {
				dirEntry.getDirectory(
					"images",
					{ create: true},
					dirPermanent => {
						copyImg.folderPermanent = dirPermanent;
						console.log('Folder Created');
						copyImg.loadOldImage();
					},
					err => {
						console.log('Error no se pudo crear');
					}
					);
			},
			err => {
				console.log('Tenemos otro error');
			}
			);
	},
	loadOldImage: () =>{
		let rutaImgViejita = localStorage.getItem(copyImg.KEY);
		if (rutaImgViejita) {
			resolveLocalFileSystemURL(
				rutaImgViejita,
				rutaImgEntry => {
					copyImg.rutaImgEntry = rutaImgEntry;
					let img = document.getElementById('imagen_copied');
					img.src = rutaImgEntry.nativeURL;
				},
				err => {
					console.log('Error no se pudo cargar la Imagen');
				}
				); 
		}
	},
	copyImagen: evento => {
		evento.preventDefault();
		evento.stopPropagation();

		let fileName = Date.now().toString() + ".jpg";
		resolveLocalFileSystemURL(
			copyImg.tempURL,
			entry => {
				console.log('Copiando Imagen');
				console.log('Copy', entry.name, "to", 
					copyImg.folderPermanent.nativeURL + fileName);
				entry.copyTo(
					copyImg.folderPermanent,
					fileName,
					permanentFile => {
						let path = permanentFile.nativeURL;
						localStorage.setItem(copyImg.KEY, path);
						copyImg.permanentFile = permanentFile;
						console.log('Imagen copiada y agregada');
						document.getElementById('imagen_copied').src = permanentFile.nativeURL;
						if (copyImg.oldFile !== null) {
							copyImg.oldFile.remove(
								() => {
									console.log('Imagen deleted correctamente');
									copyImg.oldFile = permanentFile;
								},
								err => {
									console.log('Fallo la eliminacion');
								}
								);
						}
					},
					fileErr => {
						console.log('Copiado erroneo');
					}
					);
			},
			err => {
				console.log('Error:', err);
			}
			);
	}
}





var selectedImg = {
	init: function(){
		document.getElementById('btn_take_picture')
			.addEventListener('click', selectedImg.takephoto);
	},
	takephoto: function(){
		let options = {
			quality: 70,
			destinationType: Camera.DestinationType.FILE_URI,
			sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
			mediaType: Camera.MediaType.PICTURE,
			encodingType: Camera.EncodingType.PNG,
			cameraDirection: Camera.Direction.BACK,
			allowEdit: false,
			correctOrientation: true,
			targetWidth: 200,
			targetHeight: 250
		}
		navigator.camera.getPicture(selectedImg.fotografia, selectedImg.infophoto, options);
	},
	fotografia: function(urlphoto){
		console.log('Imagen tomada');
		copyImg.tempURL = urlphoto;
		document.getElementById('imagen1').src = urlphoto
	},
	infophoto: function(message){
		console.log('Error: ' + message);
		//document.getElementById('image_info').textContent = message
	}
}





function mandarNotificacion(){
	cordova.plugins.notification.local.setDefaults({
		led: {color: "#FF0000", on: 1000, off: 1000},
		vibrate: true,
	});
	console.log("Mandando notificacion");
	cordova.plugins.notification.local.schedule({
		id: 12,
		title: 'Reproductor de Musica',
		text: musica.track.title,
		actions: [
			{id: 'yes', title: 'Yes'},
			{id: 'no', title: 'No'}
		]
	});
}


var musica = {
	track: {
		src: 'file:///android_asset/www/media/cuandolosnecesite.mp3',
		title: 'Cuando los necesite',
		volume: 0.6
	},
	media: null,
	status: {
		'0': 'MEDIA_NONE',
		'1': 'MEDIA_STARTING',
		'2': 'MEDIA_RUNNING',
		'3': 'MEDIA_PAUSED',
		'4': 'MEDIA_STOPPED',
	},
	err: {
		'1': 'MEDIA_ERR_ABORTED',
		'2': 'MEDIA_ERR_NETWORK',
		'3': 'MEDIA_ERR_DECODER',
		'4': 'MEDIA_ERR_NONE_SUPPORTED',
	},
	init: function(){
		document.getElementById('btn_play')
			.addEventListener('click', musica.ready);
	},
	ready: function(){
		musica.addListeners();
		let src = musica.track.src;
		musica.media = new Media(src, musica.ftw, musica.wtf, 
			musica.statusChange);
		mandarNotificacion();
	}, 
	ftw: function(){
		mensajeDialogo.mensajeSencillo('Todo bien');
	},
	wtf: function(err){
		mensajeDialogo.mensajeSencillo(err);
	},
	statusChange: function(status){
		mensajeDialogo.mensajeSencillo('Estamos en '
			+ musica.status[status]);
	},
	addListeners: function(){
		document.querySelector('#btn_play').addEventListener('click', 
			musica.play);
		document.querySelector('#btn_pause').addEventListener('click', 
			musica.pause);
		document.querySelector('#btn_volume_up').addEventListener('click', 
			musica.volumeUp);
		document.querySelector('#btn_volume_down').addEventListener('click', 
			musica.volumeDown);
		document.querySelector('#btn_ff').addEventListener('click', 
			musica.ff);
		document.querySelector('#btn_rew').addEventListener('click', 
			musica.rew);
		document.addEventListener('pause', ()=>{
			musica.media.release();
		});
		document.addEventListener('menubutton', ()=>{
			console.log('Button MENU');
		});
		document.addEventListener('resume', ()=>{
			musica.media = new Media(musica.track.src, musica.ftw, 
				musica.wtf, musica.statusChange);
		});
	},
	play: function(){
		musica.media.play();
		console.log("Reproduciendo");
	},
	pause: function(){
		musica.media.pause();
		console.log("Pausado");
	},
	volumeUp: function(){
		vol = parseFloat(musica.track.volume);
		vol += 0.1;
		if (vol > 1) {
			vol = 1.0;
		}
		musica.media.setVolume(vol);
		musica.track.volume = vol;
	},
	volumeDown: function(){
		vol = parseFloat(musica.track.volume);
		vol -= 0.1;
		if (vol < 0) {
			vol = 0.0;
		}
		musica.media.setVolume(vol);
		musica.track.volume = vol;
	},
	ff: function(){
		let posicion = musica.media.getCurrentPosition((posicion)=>{
			let duracion = musica.media.getDuration();
			posicion += 10;
			if (posicion < duracion) {
				musica.media.seekTo(posicion * 1000);
			}
		});
	},
	rew: function(){
		let posicion = musica.media.getCurrentPosition((posicion)=>{
			let duracion = musica.media.getDuration();
			posicion -= 10;
			if (posicion > 0) {
				musica.media.seekTo(posicion * 1000);
			}else{
				musica.media.seekTo(0);
			}
		});
	}
};

var mensajeDialogo = {
	init: function(){
		document.getElementById('btn_dialogs_sencillo').addEventListener('click', mensajeDialogo.mensajeSencillo);
		document.getElementById('btn_dialogs_completo').addEventListener('click', mensajeDialogo.mensajeCompleto);
		document.getElementById('btn_dialogs_prompt').addEventListener('click', mensajeDialogo.mensajeConTexto);
	},
	mensajeSencillo: function(){
		navigator.notification.alert(
			'Este es un mensaje sencillo por Cordova PhoneGap', //message
			alertDismissed,  //Funcion al dar click al boton
			'Mensaje Cordova',  //Titulo del mensaje
			'Aceptar'   //Texto del boton
			);
	},
	mensajeCompleto: function(){
		navigator.notification.confirm(
			'La web te esta preguntando ¿Como Estas?',   //Message
			alertConfirm,   //funcion para confirmar
			'Mensaje de confirmacion',   //Title
			['Bien', 'Mal', 'Con frio']   //Opciones
			);
	},
	mensajeConTexto: function(){
		navigator.notification.beep(3);
		navigator.notification.prompt(
			'Cual es tu correo electronico: ',   //message
			alertPrompt,    //funcion al darle click
			'Email User',	//Title
			['Ok', 'Cancel'],	//Opciones
			'example@email.com'
			);
	}
}

function alertPrompt(results){
	let resultados = 'Your emails is: ' + results.input1 + 
	' y clickaste el boton ' + results.buttonIndex;
	document.getElementById('message_dialog').textContent = resultados;
}

function alertConfirm(buttonIndex){
	let mensajeee = 'You selected the button ' + buttonIndex;
	if (buttonIndex == 0) {
		document.getElementById('message_dialog').textContent = 'Que bueno sigue asi!';
	}else if (buttonIndex == 1){ 
		document.getElementById('message_dialog').textContent = 'No estes mal, sigueme para mas consejos';
	}else{
		document.getElementById('message_dialog').textContent = 'Ponte un sueter';
	}
}

function alertDismissed(){
	document.getElementById('message_dialog').textContent = 'Aceptaste el mensaje';
}


var camara_photo = {
	init: function(){
		document.getElementById('btn_camera').addEventListener('click', camara_photo.takephoto);
	},
	takephoto: function(){
		let options = {
			quality: 70,
			destinationType: Camera.DestinationType.FILE_URI,
			sourceType: Camera.PictureSourceType.CAMERA,
			mediaType: Camera.MediaType.PICTURE,
			encodingType: Camera.EncodingType.PNG,
			cameraDirection: Camera.Direction.BACK,
			allowEdit: false,
			correctOrientation: true,
			targetWidth: 200,
			targetHeight: 250
		}
		navigator.camera.getPicture(camara_photo.fotografia, camara_photo.infophoto, options);
	},
	fotografia: function(urlphoto){
		document.getElementById('image_taked').src = urlphoto
	},
	infophoto: function(message){
		document.getElementById('image_info').textContent = message
	}
}


function onBatteryStatus(status){
	alert('La bateria es ' + status.level + " esta conectado " 
		+ status.isPlugged);
}

function onBatteryLow(status){
	alert('El nivel de bateria es ' + status.level + '%');
}

function onBatteryCritical(status){
	alert('Battery level critical is ' + status.level + '% charger your Phone');
}

function onVolumeDown(){
	alert('Estas presionando el boton de volumen abajo');
}

function onVolumeUp(){
	alert('Gracias por darle click a boton de volumen arriba');
}

function onPause(){
	alert('Ahora la app se ha pausado');
}

function onResume(){
	alert('Nuestra app se ha reanudado');
}




