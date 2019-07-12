var token      = "";
var categories = [];

$( document ).ready(function() {
    token  = getToken();
    moment.locale('es');
    init();
});


function init(){
    getCategories();
    getProducts();
}

function getProducts(){
    $.ajax({
        type : 'GET',
        url : '/api/allproducts',
        headers: {
            'x-access-token': token
        },              
        dataType: "json",
        success: function(data){
        	if(data.status){
                $.each(data.data,function(key,$datum){
                    var htmlstring = "<tr>"+
                                         "<td>"+data.data[key].code+"</td>"+
                                         "<td>"+data.data[key].name+"</td>"+
                                         "<td>"+getCategoryName(data.data[key].category)+"</td>"+
                                         "<td>S/."+data.data[key].price+"</td>"+
                                         '<td class="text-center"><i class="mdi mdi-eye-outline icon-md"></i></td>'
                                       +"</tr>";
                    $("#mainTableProducts").append(htmlstring);
                  });
        	}
            hideLoading();
        }
    });
}

function getCategories(){
    $.ajax({
        type : 'GET',
        url : '/api/allcategories',
        headers: {
            'x-access-token': token
        },
        async : false,              
        dataType: "json",
        success: function(data){
            if(data.status){
                categories = data.data;
                var dropdown = $("#mainSelectCategory");
                var dropdown1 = $("#createProductSelectCategory");
                $.each(data.data, function() {
                    dropdown.append($("<option />").val(this._id).text(this.name));
                    dropdown1.append($("<option />").val(this._id).text(this.name));
                });
            }
        }
    });
}

function createProduct(){
    var code      = $("#createProductCode").val();
    var name      = $("#createProductName").val();
    var price     = $("#createProductPrice").val();
    var quantity  = $("#createProductQuantity").val();
    var category  = $("#createProductSelectCategory").val();
    var sendData = {'code': code,'name':name,'price':price,'quantity':quantity,'category':category};
    $.ajax({
        type : 'POST',
        url : '/api/createproduct',
        headers: {
            'x-access-token': token
        }, 
        data : sendData,               
        dataType: "json",
        success: function(data){
            if(data.status){
                alert("Producto Creado");
                $('#createProductModal').modal('toggle');
                cleanCreateProductModal();
                var htmlstring = "<tr>"+
                                     "<td>"+code+"</td>"+
                                     "<td>"+name+"</td>"+
                                     "<td>"+getCategoryName(quantity)+"</td>"+
                                     "<td>S/."+price+"</td>"+
                                     '<td class="text-center"><i class="mdi mdi-eye-outline icon-md"></i></td>'
                                   +"</tr>";
                $("#mainTableProducts").prepend(htmlstring);
            }else if(data.data){
                alert("Complete los campos obligatorios");
            }else{
                alert("Hubo un error, porfavor actualize la página");
            }
        }
    });
}

function getCategoryName(id){
    $.each(categories, function() {
        if(this._id == id){
            id = this.name;
            return false;
        }
    });
    return id;
}

function cleanCreateProductModal(){
    $("#createProductCode").val("");
    $("#createProductName").val("");
    $("#createProductPrice").val("");
    $("#createProductQuantity").val("");
    $("#createProductSelectCategory").val("");
}