$(document).ready(function() {

    //------------------------------------------------------------
    // Toggle mobile-menu button click event
    //------------------------------------------------------------
    $(".navmenu a.more").click(function(event) {

        event.preventDefault();

        $(".navmenu").toggleClass("responsive");
    });


    //------------------------------------------------------------
    // Initialize popup
    //------------------------------------------------------------
    $("a.popup").magnificPopup({
        type: 'image',
        closeOnContentClick: true,
        closeBtnInside: true
    });

    //------------------------------------------------------------
    // Initialize galleries
    //------------------------------------------------------------
    $('div.gallery').each(function() {
        $(this).magnificPopup({
            delegate: 'a',
            type: 'image',
            closeOnContentClick: true,
            gallery: {
                enabled: true,
                navigateByImgClick: false,
                preload: [1,3]
            },
            callbacks: {
                buildControls: function() {
                    //this.contentContainer.append(this.arrowLeft.add(this.arrowRight));
                }
            }
        });
    });

    

});
