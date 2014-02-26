Template.layout.rendered=function (){
    $('li.active').removeClass('active');
    $('li > a[href="' + window.location.pathname + '"]').parent().addClass('active');
};
