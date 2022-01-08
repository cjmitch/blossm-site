$(document).ready(function () {
    $('a').click(function(e) {
        var hash = e.currentTarget.hash;
        if(hash !== ""){
            e.preventDefault();
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 500);
        }
    });
});