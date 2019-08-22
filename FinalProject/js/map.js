// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
var map, infoWindow, marker;

// function selectProvince() {
// 	var e = document.getElementById("s").value;
	
// 	if (e === '') {
// 		var mapdiv = document.getElementById("map_id");
// 		mapdiv.removeAttribute('style');
// 		return;
// 	}
// 	else {
// 		province = e;
// 		var script = document.createElement("script");
// 	    script.type = "text/javascript";
// 	    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDpnAroegDOkK7_p7IW-niAbkPx3ZFJDS0&callback=loadProvMap"; 
// 	    document.getElementsByTagName("head")[0].appendChild(script);

		
//     	//setCoordsAndPrintMap(e);

//     	//window.alert("Geocoder DONE");
// 	}

// //	window.alert(e);

// }

// function printProvInfo() {
// 	//window.alert("Province Name: "+province+"\nPremier: "+premier[province]);
// 	document.getElementById("prov_info").style.display = "block";
// 	//document.getElementById("provname").innerHTML = "&nbsp;&nbsp;&nbsp;Province Name: "+province+provaddrs;
// 	document.getElementById("provname").innerHTML = "&nbsp;&nbsp;&nbsp;Province Name: "+province;
// 	document.getElementById("provpremier").innerHTML = "&nbsp;&nbsp;&nbsp;Province Premier: "+premier[province];
// 	document.getElementById("provtax").innerHTML = "&nbsp;&nbsp;&nbsp;Provincial Tax Rate: "+provtax[province];
	
// 	var ageElement = document.getElementById("userage").value;
// 	if(parseInt(ageElement) <= 16) {
// 		document.getElementById("provattr").innerHTML = "&nbsp;&nbsp;&nbsp;Provincial Attraction: "+provattrkids[province];
// 	}
// 	else {
// 		document.getElementById("provattr").innerHTML = "&nbsp;&nbsp;&nbsp;Provincial Attraction: "+provattr[province];
// 	}
// }


function loadTheatersMap() {
	infoWindow = new google.maps.InfoWindow;

	map = new google.maps.Map(document.getElementById('map_id'), {
  	center: {lat: 56.1303673, lng: -106.3467712},
  	zoom: 16
	});

	var geocoder = new google.maps.Geocoder;
	geocoder.geocode( { 'address': "Cineplex"}, function(results, status) {
  		//window.alert("result[0] = "+results[0].geometry.location+" province = "+province+", Canada");
  		if (status == 'OK') {
    		//for (var i = 0; i < results.length; i++) {
	    		map.setCenter(results[0].geometry.location);
	    		var marker = new google.maps.Marker({
	        		map: map,
	        		position: results[0].geometry.location
	    		});
    		//}
  		} 
  		else {
    		alert('Geocode was not successful for the following reason: ' + status);
  		}
	});
}

function buttonClicked() {

	// Try HTML5 geolocation.
	if (navigator.geolocation) {
		var script = document.createElement("script");
	    script.type = "text/javascript";
	    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDpnAroegDOkK7_p7IW-niAbkPx3ZFJDS0&callback=initMap"; 
	    document.getElementsByTagName("head")[0].appendChild(script);
	}
	else {
		//window.alert("no geolocation");

		var par_id = document.getElementById("nogeoloc");
		par_id.style.display = "block";
	}
}

function printMap(position) {
	map = new google.maps.Map(document.getElementById('map_id'), {
  	center: {lat: 56.1303673, lng: -106.3467712},
  	zoom: 10
	});

	var pos = {
	    lat: position.coords.latitude,
	    lng: position.coords.longitude
	};

	//window.alert("lat pos = "+position.coords.latitude+" long pos = "+position.coords.longitude);

	//infoWindow.setPosition(pos);
	//infoWindow.setContent('Location found.');
	//infoWindow.open(map);
	map.setCenter(pos);
	marker = new google.maps.Marker({position: pos, map: map});

	var geocoder = new google.maps.Geocoder;
	geocoder.geocode({'location': pos}, function(results, status) {
		if (status === 'OK') {
			if (results[8]) {
			//map.setZoom(11);
			//var marker = new google.maps.Marker({
				//	position: latlng,
				//	map: map
			//});
			
			//window.alert(results[8].formatted_address);

			//infowindow.setContent(results[0].formatted_address);
			//infowindow.open(map, marker);
			
			var idx = results.length - 1;

			// // Reverse geo results for debugging.
			// // Note: Comment out in final version of code.
			// provaddrs = ""
			// for (var i = 0; i < results.length; i++) {
			// 	provaddrs += "--" + results[i].formatted_address;  
			// }
			
			do {
				idx--;
				var province_arr = results[idx].formatted_address.split(',',2);
			} while(province_arr.length < 2 && province_arr[1] != "Canada");

			province = province_arr[0];	
			
			//window.alert("DEBUG: "+province);
			//printProvInfo();
			} 			
			else {
			window.alert('No results found');
			}
		} 			
		else {
			window.alert('Geocoder failed due to: ' + status);
		}
	});
}


function initMap() {
	/*
	map = new google.maps.Map(document.getElementById('map_id'), {
  	center: {lat: 56.1303673, lng: -106.3467712},
  	zoom: 10
	});
*/
	infoWindow = new google.maps.InfoWindow;

	// Try HTML5 geolocation.
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(printMap, function() {
	  		map = new google.maps.Map(document.getElementById('map_id'), {
  				center: {lat: 56.1303673, lng: -106.3467712},
  				zoom: 10
				});

	    	handleLocationError(true, infoWindow, map.getCenter());
	  	});
	} 
	else {
		// Browser doesn't support Geolocation
	  	map = new google.maps.Map(document.getElementById('map_id'), {
  			center: {lat: 56.1303673, lng: -106.3467712},
  			zoom: 10
			});

	  	handleLocationError(false, infoWindow, map.getCenter());
	}
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {

	var errMsg;
	infoWindow.setPosition(pos);
	if(browserHasGeolocation) {
		errMsg = 'Error: The Geolocation service failed.';
	}
	else {
		errMsg = 'Error: Your browser doesn\'t support geolocation.';
	}

	infoWindow.setContent(errMsg);	
	infoWindow.open(map);
	window.alert(errMsg);
}

// Initialize and add the map
/*
function initMap() {
  
  // The location of Canada
  var canada = { 
  	lat: 56.1303673, 
  	lng: -106.3467712
  };
  
  // The map, centered at Canada
  var map = new google.maps.Map(
      document.getElementById('map'), {zoom: 4, center: canada});
  // The marker, positioned at Canada
  var marker = new google.maps.Marker({position: canada, map: map});
}
*/