$( document ).ready(function() {
    moment.locale('es');
    getProducts();
});

function getProducts(){
    var token  = getToken();

    $.ajax({
        type : 'GET',
        url : '/api/allproducts',
        headers: {
            'x-access-token': token
        },              
        dataType: "json",
        success: function(data){
        	if(data.status){
                
        	}
        }
    });
}