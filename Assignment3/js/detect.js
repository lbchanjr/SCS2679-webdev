var percent = 60;

function detectProgbarInit() {
	if (Modernizr.progressbar) {
		var pbar = document.getElementById("pbardiv_id");
		var pbarval = document.getElementById("pbar_id");
		pbar.style.display = "block";
		pbarval.value = percent;
	} else {
		var ptext = document.getElementById("ptextdiv_id");
		ptext.style.display = "block";
		var ptextlabel = document.getElementById("ptext_id");
		ptextlabel.innerHTML = "Progress: "+ percent + "% done.";
		ptextlabel.style.fontWeight = "bold";
		ptextlabel.style.color = "white";
	}
}

function detectGeoLocation() {
	if (Modernizr.geolocation) {
		var geostatus = document.getElementById("geodetect_yes");
		geostatus.style.display = "block";
	} else {
		var geostatus = document.getElementById("geodetect_no");
		geostatus.style.display = "block";
		geostatus.style.color = "white";
	}
}
