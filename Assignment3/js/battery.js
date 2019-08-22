function battClicked() {
	navigator.getBattery().then(function(result){
		window.alert("Battery level = "+(result.level*100)+"%\nBattery status: "+((result.charging)?"Charging":"Not charging"));
	})
}