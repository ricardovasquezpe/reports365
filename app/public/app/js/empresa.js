var token      = "";

$( document ).ready(function() {
    token  = getToken();
    moment.locale('es');
    init();
});

function init(){
    hideLoading();
}