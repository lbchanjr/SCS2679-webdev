var bordernum = 2;
var borderstyles = ["none", "solid", "double", "dotted", "dashed"];
var myElement = document.getElementById('gesturebox'); 

// create a simple instance
// by default, it only adds horizontal recognizers
var mc = new Hammer(myElement);

// listen to events...
mc.on("panleft panright tap press", function(ev) {
	bordernum += 1;
	if(bordernum >= borderstyles.length) {
		bordernum = 0;
	}
	document.getElementById('map_id').style.borderStyle = borderstyles[bordernum];
	myElement.innerHTML = ev.type+" detected, bordernum = "+bordernum;
});
