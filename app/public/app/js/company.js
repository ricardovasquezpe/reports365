var token = "";

$( document ).ready(function() {
    token  = getToken();
    moment.locale('es');
    init();
});

function init(){
	getCompanyDetails();
    hideLoading();
}

function getCompanyDetails(){
	
}

function updateCompany(){
	var name  = $("#name").val();
 	var ruc  = $("#ruc").val();
 	var address  = $("#address").val();
 	var telephone  = $("#telephone").val();
    var sendData = {'name': name,'ruc':ruc,'address':address,'telephone':telephone};
    $.ajax({
        type : 'PUT',
        url : '/api/updatemycompany',
        headers: {
            'x-access-token': token
        },   
        data : sendData,               
        dataType: "json",
        success: function(data){
        	console.log(data);
        }
    });
}