$(document).ready(function(){ 
    $(window).scroll(function(){ 
        if ($(this).scrollTop() > $('.ld-img-container').height() / 2 ) { 
            $('#scrollToTop').fadeIn();
        } else { 
            $('#scrollToTop').fadeOut(); 
        }

        if ($(this).scrollTop() > $('.ld-img-container').height() / 5 + $('#ld-general-1').height() + $('#ld-general-2').height() + 80)  {
            $('.ld-feature-list').fadeIn(800);
        }

    });

    $('#scrollToTop').click(function(){ 
        $("html, body").animate({ scrollTop: 0 }, 600); 
        return false; 
    });

   
});