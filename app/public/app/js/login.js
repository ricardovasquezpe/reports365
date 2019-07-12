function login(){
    var uname  = $("#username").val();
 	var upass  = $("#password").val();
    var loginData = {'username': uname,'password':upass};
    $.ajax({
        type : 'POST',
        url : '/api/authenticate',
        data : loginData,               
        dataType: "json",
        success: function(data){
        	if(data.status){
                localStorage.token = data.token;
        		window.location.href = "/app/dashboard";
        	}else{
        		alert("Usuario o contraseña invalida");
        	}
        }
    });
}