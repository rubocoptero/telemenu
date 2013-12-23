window.bootstrap = function() {
    angular.bootstrap(document, ['telemenu']);
};

window.init = function() {
    window.bootstrap();
};

angular.element(document).ready(function() {
    //Fixing facebook bug with redirect
    if (window.location.hash == "#_=_") window.location.hash = "!";

    //Then init the app
    window.init();
});
