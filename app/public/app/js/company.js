var token = "";

$( document ).ready(function() {
    token  = getToken();
    moment.locale('es');
    init();
});

function init(){
	getCompanyDetails();
}

function getCompanyDetails(){
	$.ajax({
        type : 'GET',
        url : '/api/mycompanydetails',
        headers: {
            'x-access-token': token
        },              
        dataType: "json",
        success: function(data){
            if(data.status){
                $("#name").val(data.data.name);
                $("#ruc").val(data.data.ruc);
                $("#address").val(data.data.address);
                $("#telephone").val(data.data.telephone);
            }
            hideLoading();
        }
    });
}

function updateCompany(){
	var name      = $("#name").val();
 	var ruc       = $("#ruc").val();
 	var address   = $("#address").val();
 	var telephone = $("#telephone").val();
    var sendData  = {'name': name,'ruc':ruc,'address':address,'telephone':telephone};
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