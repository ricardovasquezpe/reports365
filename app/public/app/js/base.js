function getToken(){
	var token = localStorage.token;
	if(token){
		return token;
	}else{
		window.location.href = "/app/login";
		return;
	}
}

function hideLoading(){
	$(".fullloading").hide();
}

function onlyAllowNumbers(){
	$(document).on("input", ".onlyNumeric", function() {
	    this.value = this.value.replace(/\D/g,'');
	});
}

function isObjectEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}