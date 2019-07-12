function getToken(){
	var token = localStorage.token;
	if(token){
		return token;
	}else{
		window.location.href = "/app/login";
		return;
	}
}