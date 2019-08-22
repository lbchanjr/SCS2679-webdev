//var theaterId;

//var slideIndex = 1;
var slideIndex = parseInt(localStorage.getItem("selectedmovieidx")) + 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
  window.parent.document.getElementById("sel_movie").selectedIndex = slideIndex-1;
  if(localStorage.getItem("selectedmovieidx") !== null) {
    localStorage.removeItem("selectedmovieidx");
  }
  localStorage.setItem("selectedmovieidx", (slideIndex-1));
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > dots.length) {slideIndex = 1} 
  if (n < 1) {slideIndex = dots.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none"; 
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block"; 
  dots[slideIndex-1].className += " active";
}
