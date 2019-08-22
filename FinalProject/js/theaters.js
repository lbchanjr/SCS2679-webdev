
var cinemas = [];
var cinema_ids = [];
var cinema_urls = [];

var map;
var service;
var infowindow;

var current_loc;
// var json_dist = [];
// var json_idx_sorted = [];

function initMap() {
    
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 43.662778, lng: -79.395813},
      zoom: 10
    });
    infoWindow = new google.maps.InfoWindow;

    if (Modernizr.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

    var image = "../img/blue-dot.png";
	  var myMarker = new google.maps.Marker({
	          position: pos,
	          map: map,
	          icon: image
	          //title: 'Current Location'
	  });

	  google.maps.event.addListener(myMarker, 'click', function() {
	      infoWindow.setContent('Current location.');
	      infoWindow.open(map, this);
	  });
        
    infoWindow.setPosition(pos);
    infoWindow.setContent('Current location.');
    infoWindow.open(map, myMarker);
    map.setCenter(pos);

    // NOTE: Comment out since we will find theaters using the cinexplex theatre api
    //findMovieTheaterGoogleMaps(pos);
    current_loc = pos;
    findMovieTheaterCineplexAPI();
    }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
    });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
      return;
    }
    
  }

  function findMovieTheaterCineplexAPI() {
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          var myObj = JSON.parse(xmlHttp.responseText);
          
          //console.log(myObj);
          var theater_cnt = myObj.data.length;
          if (theater_cnt > 5) {
            theater_cnt = 5;
          }
          //console.log(json_idx_sorted);
          for(var i = 0; i < theater_cnt; i++) {
            cinemas.push(myObj.data[i].name);
            cinema_urls.push("https://www.cineplex.com/Theatre/" + myObj.data[i].urlSlug);

            //console.log("Theater: " + myObj.data[/*json_idx_sorted[i]*/i].name + ", Distance: " +
            //  /*json_dist[json_idx_sorted[i]]*/myObj.data[i].distance.toFixed(2));  
            
            createMarkerFromAPI(myObj.data[i]);
          }

          localStorage.setItem("theaters", cinemas);
          localStorage.setItem("theater_urls", cinema_urls);  

          window.parent.populateSelectBoxes();

        }
        
    }
    
    xmlHttp.open("GET", "https://cors-anywhere.herokuapp.com/" +
      "https://www.cineplex.com/api/v1/theatres?language=en-us");
    xmlHttp.send(null);

  }


  function findMovieTheaterGoogleMaps(myLocation) {
  	var request = {
      location: myLocation,
      name: 'Cineplex',
      type: ['movie_theater'],
      rankBy: google.maps.places.RankBy.DISTANCE
    };

    map.setZoom(10);

    service = new google.maps.places.PlacesService(map);

    service.nearbySearch(request, function(results, status) {
      
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        // var maxcnt = results.length;
        // if( maxcnt > 5) {
        //   maxcnt = 5;
        // }
        
        for (var i = 0; i < /*maxcnt*/results.length; i++) {
          if(results[i].name.includes("Cineplex") == true) {
              cinemas.push(results[i].name);
              cinema_ids.push(results[i].place_id)
              createMarker(results[i], myLocation);

              if(cinemas.length == 5) {
                break;
              }
          }
        }

        //console.log("DEBUG: "+cinemas);
        localStorage.setItem("theaters", cinemas);
        localStorage.setItem("theater_ids", cinema_ids);

        window.parent.populateSelectBoxes();

      }
    });
  }

  function createMarkerFromAPI(theaterJSONdata) {
    var pos = new google.maps.LatLng(theaterJSONdata.latitude, theaterJSONdata.longitude);
    var marker = new google.maps.Marker({
      map: map,
      position: pos/*place.geometry.location*/
    });

    // var start = new google.maps.LatLng(startPos.lat, startPos.lng); 
    // var dest = new google.maps.LatLng(theaterJSONdata.latitude, theaterJSONdata.longitude);
    // var distance = getDistance(start, dest).toFixed(2);
     var gmapurl = "<a href=\"https://www.google.com/maps/search/?api=1&query=" +
        theaterJSONdata.name + "&nbsp;" + theaterJSONdata.address1 + "\" target=\"_blank\">Open in Google Maps</a>";
    
    var cinemaurl = "<a href=\"https://www.cineplex.com/Theatre/" + theaterJSONdata.urlSlug + "\" target=\"_blank\">" + theaterJSONdata.name + "</a>";
    // var placeurl = "<a href=\"" + place.url + "\" target=\"_blank\"> url = " + place.url +"</a>";
    // var placewebsite = "<a href=\"" + place.url + "\" target=\"_blank\"> website = " + place.website +"</a>";

    google.maps.event.addListener(marker, 'click', function() {
      // infoWindow.setContent("<p><b>" + place.name + "</b><br />Address&nbsp;:&nbsp;" + 
      //  place.vicinity + "<br /> Distance:&nbsp;" + distance.toString() + 
      //  " km <br />" + gmapurl + " <br /> url:&nbsp;"+ placeurl +
      //   "<br />  Place website:&nbsp;" + placewebsite + "</p>");
      //
      infoWindow.setContent("<p><b>" + cinemaurl + "</b><br />Address&nbsp;:&nbsp;" + 
        theaterJSONdata.address1 +",&nbsp;" + theaterJSONdata.city + /*"<br /> Distance:&nbsp;" + theaterJSONdata.distance.toFixed(2) + 
        "km <br />"*/"<br />" + gmapurl + "</p>"); 
      infoWindow.open(map, this);
    });
  }

  function createMarker(place, startPos) {
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location
    });

    var start = new google.maps.LatLng(startPos.lat, startPos.lng); 
    var distance = getDistance(start, place.geometry.location).toFixed(2);
    var gmapurl = "<a href=\"https://www.google.com/maps/search/?api=1&query=" +
      	place.name + "&nbsp;" + place.vicinity + "\" target=\"_blank\">Open in Google Maps</a>";
    // var placeurl = "<a href=\"" + place.url + "\" target=\"_blank\"> url = " + place.url +"</a>";
    // var placewebsite = "<a href=\"" + place.url + "\" target=\"_blank\"> website = " + place.website +"</a>";

    google.maps.event.addListener(marker, 'click', function() {
      // infoWindow.setContent("<p><b>" + place.name + "</b><br />Address&nbsp;:&nbsp;" + 
      // 	place.vicinity + "<br /> Distance:&nbsp;" + distance.toString() + 
      // 	" km <br />" + gmapurl + " <br /> url:&nbsp;"+ placeurl +
      //   "<br />  Place website:&nbsp;" + placewebsite + "</p>");
      //
      infoWindow.setContent("<p><b>" + place.name + "</b><br />Address&nbsp;:&nbsp;" + 
        place.vicinity + "<br /> Distance:&nbsp;" + distance.toString() + 
        " km <br />" + gmapurl + "</p>"); 
      infoWindow.open(map, this);
    });
  }

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }

  var rad = function(x) {
		return x * Math.PI / 180;
};

var getDistance = function(p1, p2) {
  var R = 6378.137; // Earth’s mean radius in meter
  var dLat = rad(p2.lat() - p1.lat());
  var dLong = rad(p2.lng() - p1.lng());
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d; // returns the distance in meter
};

