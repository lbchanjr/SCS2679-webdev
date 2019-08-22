var htmlView = 0;
var movie_json;
var movie_array = [];

const err_nogeo_msg1 = "No movie theaters have been detected.";
const err_nogeo_msg2 = "Either geolocation is not allowed or not supported by the browser. If this is not the case, please refresh the page and wait for the browser to finish geolocation detection.";
//var cinemas = [];
/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
  // var select_disable = false;
  document.getElementById("mySidebar").style.width = "250px";

  // if (localStorage.getItem("theaters") != null) {
  // 	select_disable = true;
  // }
  
  // document.getElementById("sel_theater").disabled = select_disable;
  // document.getElementById("sel_movie").disabled = select_disable;
  
  //document.getElementById("main").style.marginLeft = "250px";
  //document.getElementById("pageid").style.pointerEvents = "none";
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
  //document.getElementById("pageid").style.pointerEvents = "auto";
}

function showHTMLframe(view) {
	if(view == htmlView) {
		return;
	} 
	else if(localStorage.getItem("theaters") === null && view !== 1) {
		// Vibrate and show error page since geolocation has not yet been performed.
		if(hasVibrate) {
			navigator.vibrate([100, 100, 100]);
		}
		document.getElementById("bodyid").style.backgroundColor = "#ff6666";
		document.getElementById("content").innerHTML = '<h1 align="center">' + err_nogeo_msg1 + '</h1> <br/>' + 
								'<p align="center">' + err_nogeo_msg2 + '</p>' ;
	}
	else {
		// Update global variable for content view index.
		htmlView = view;

		switch(view) {
			case 1:
				// Clear theater list since we will be performing another geo-dectect operation.
				localStorage.removeItem("theaters");

				document.getElementById("bodyid").style.backgroundColor = "#D7E3F7";
				document.getElementById("content").innerHTML='<object id="objhtml" type="text/html" data="html/theaters.html"></object>';
				break;
			
			case 2:
				document.getElementById("bodyid").style.backgroundColor = "#898888";
				break;
			case 3:
				document.getElementById("bodyid").style.backgroundColor = "#ffffcc";
				break;
			case 4:
				document.getElementById("bodyid").style.backgroundColor = "#33c1ff";
				break;
			
			case 5:
				document.getElementById("phone_id").click();
				break;
			
			default:	
				return;
		}

		if(view != 1 && localStorage.getItem("theaters") !== null) {
				// Code does not reside in web server. Manually populate the
				// theater and movie select boxes.
				populateSelectBoxes();
			}
	}
}

function populateSelectBoxes() {
	var isPopulated = populateTheaterSelectBox();
	if(isPopulated === true) {
		// load movies from selected theater and refresh content view
		populateMovieSelectBox();
	}
	else {
		// skip movie list refresh and just refresh the content view
		refreshContentView();
	}
}

function populateTheaterSelectBox() {

	var theater_populated = false;
	var theater = document.getElementById("sel_theater");

	var theater_names = localStorage.getItem("theaters");
	var theater_narray = theater_names.split(',');

	// check first if there's a need to refresh the select box
	if(compareArrayToOptions(theater_narray, theater.options) === false) {
		// Empty the select box options	
		removeOptions(theater);

		// Populate the options for the theater select box.
		populateSelectBox(theater, theater_narray);

		localStorage.removeItem("selectedtheateridx");
		localStorage.setItem("selectedtheateridx", 0);

		theater_populated = true;
	}

	// Enable select box
	theater.disabled = false;
	return theater_populated;
}
	  	
function populateMovieSelectBox() {

	if(document.getElementById("sel_theater").options.length != 0) {
		var movie = document.getElementById("sel_movie");
		removeOptions(movie);

		var sel_idx = document.getElementById("sel_theater").selectedIndex;
		var theater_options = document.getElementById("sel_theater").options;

		var arr_idx = theater_options[sel_idx].index

		retrieveMovieNamesFromUrl(arr_idx);

	}
}

function retrieveMovieNamesFromUrl(index) {
	var urlArray = localStorage.getItem("theater_urls").split(",");

	var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          // Strip response to contain only the json data that will be processed.
          var raw_json = xmlHttp.responseText;
          var startidx = raw_json.lastIndexOf("json-data='") + "json-data='".length;
          var endidx = raw_json.indexOf("' is-missing-attr-enabled");
          movie_json = "{\"data\":" + raw_json.slice(startidx, endidx) + "}";

          startidx = raw_json.indexOf("href=\"tel:") + "href=\"tel:".length;
          endidx = raw_json.indexOf("\">", startidx);
          var theater_phonenum =  raw_json.slice(startidx, endidx);
          document.getElementById("phone_id").href = "tel:" + theater_phonenum;


          var myObj = JSON.parse(movie_json);

          //console.log(myObj);
          
          movie_array.length = 0;

          for(var i = 0; i < myObj.data.length; i++) {
          	  movie_array.push(myObj.data[i].filmName);
          }

          localStorage.removeItem("movielist");
          localStorage.removeItem("theater_json");
        
          localStorage.setItem("movielist", movie_array);
          localStorage.setItem("theater_json", movie_json);


		  document.getElementById("sel_movie").selectedIndex = 0;
          localStorage.removeItem("selectedmovieidx");
		  localStorage.setItem("selectedmovieidx", 0);

	      // TODO: Explore using promises and deferred objects...
		  populateSelectBox(document.getElementById("sel_movie"), movie_array);

		  document.getElementById("sel_movie").disabled = false;

		  refreshContentView();
        }

    }
    
    xmlHttp.open("GET", "https://cors-anywhere.herokuapp.com/" +
      urlArray[index]);
    xmlHttp.send(null);
}

function refreshContentView() {
	switch(htmlView) {
		case 2: 
			document.getElementById("content").innerHTML = '<object id="objhtml" type="text/html" data="html/nowplaying.html"></object>';
			//document.getElementById("sel_movie").disabled = true;
			break;
		case 3: 
			document.getElementById("content").innerHTML = '<object id="objhtml" type="text/html" data="html/showtimes.html"></object>';
			break;

		case 4: 
			document.getElementById("content").innerHTML = '<object id="objhtml" type="text/html" data="html/visit.html"></object>';
			break;	
	}
}

function populateSelectBox(selectBox, dataArray) {
	for(var i = 0; i < dataArray.length; i++) {
		  	var opt_element = document.createElement("option");
		  	opt_element.text = dataArray[i];
		  	selectBox.appendChild(opt_element);
		}
}

function removeOptions(selectbox)
{
    var i;

    if(selectbox.options.length != 0) {
	    for(i = selectbox.options.length - 1 ; i >= 0 ; i--)
	    {
	        selectbox.remove(i);
	    }	
    }
    
}

function theaterChange() {
	// Clear phone number link if theather name has changed.
	// This will be updated when the list of movies have been re-populated.
	document.getElementById("phone_id").href = "javascript:void(0)";

	populateMovieSelectBox();
	var sel_idx = document.getElementById("sel_theater").selectedIndex;
	var theater_options = document.getElementById("sel_theater").options;

	var sel_theater_idx = theater_options[sel_idx].index;
	localStorage.removeItem("selectedtheateridx");
	localStorage.setItem("selectedtheateridx", sel_theater_idx);

}
function movieChange() {
	var sel_idx = document.getElementById("sel_movie").selectedIndex;
	var movie_options = document.getElementById("sel_movie").options;

	var sel_movie_idx = movie_options[sel_idx].index;
	localStorage.removeItem("selectedmovieidx");
	localStorage.setItem("selectedmovieidx", sel_movie_idx);

	refreshContentView();
}

function compareArrayToOptions(arr, opt) {

	// Check if the arrays are the same length
	if (arr.length !== opt.length) {
		return false;
	}

	// Check if all items exist and are in the same order
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] !== opt[i].innerText) {
			return false;
		}
	}

	// Otherwise, return true
	return true;

};

// function handlePhoneCall() {
// 	var phonelink = document.getElementById("phone_id");

// 	if(phonelink.href == "javascript:void(0)") {
// 		// Link is still empty, vibrate device (if available) and show alert.
// 		if(hasVibrate) {
// 			navigator.vibrate([100, 100, 100]);
// 		}
// 		alert("No theater has been selected!\nWait for your location and nearby theaters to be detected before clicking on this link.");
// 	}
// 	else {
// 		// Simulate a click operation to launch the phone app.
// 		phonelink.click();
// 	}
// }

