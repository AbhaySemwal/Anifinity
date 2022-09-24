// var myCarousel = document.querySelector('.trending #myCarousel')
// var carousel = new bootstrap.Carousel(myCarousel, {
//   interval: 10000000
// });

$('.trending .carousel .carousel-item').each(function(){
    var minPerSlide = 6;
    var next = $(this).next();
    if (!next.length) {
    next = $(this).siblings(':first');
    }
    next.children(':first-child').clone().appendTo($(this));
    
    for (var i=0;i<minPerSlide;i++) {
        next=next.next();
        if (!next.length) {
        	next = $(this).siblings(':first');
      	}
        
        next.children(':first-child').clone().appendTo($(this));
      }
});

//   $(function() {
//     var header = $(".navbar");

//     $(window).scroll(function() {
//         var scroll = $(window).scrollTop();
//         if (scroll >= 50) {
//             header.addClass("navbar-dark");
//             header.style.position="fixed";

//         } else {
//             header.removeClass("navbar-dark");
//         }
//     });
// });
