var token      = "";
var categories = [];
var editProductId = "";
var editProductElement = null;

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
                var rows = data.data.map((product, index) => {
                    var tds = ['code', 'name', 'category_id', 'price', 'quantity'].map((key) => {
                        var text = product[key];
                        var val  = "";
                        if(key == 'category_id') {
                            text = getCategoryName(product[key]);
                            val  = product[key];
                        }
                        return $('<td>', {
                            text: text,
                            value: val
                        })
                    });
                    tds.push($('<td>',{
                        class: 'text-center',
                        html: $('<i>', {
                            style: 'cursor:pointer',
                            class: 'mdi mdi-pencil-outline icon-md',
                            onclick: 'getProductDetails(this, "'+ product._id +'")'
                        })
                    }))
                    return $('<tr>', {
                        html: tds
                    });
                });

                $("#mainTableProducts").append(rows);
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
                var dropdown2 = $("#editProductSelectCategory");
                $.each(data.data, function() {
                    dropdown.append($("<option />").val(this._id).text(this.name));
                    dropdown1.append($("<option />").val(this._id).text(this.name));
                    dropdown2.append($("<option />").val(this._id).text(this.name));
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
    var sendData  = {'code': code,'name':name,'price':price,'quantity':quantity,'category_id':category};
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
                                     "<td>"+getCategoryName(category)+"</td>"+
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

function getProductDetails(element, productId){
    cleanUpdateProductModal();
    editProductId = productId;
    editProductElement = element;
    var detail = $(element).parent().parent().children();
    $("#editProductCode").val($(detail[0]).text());
    $("#editProductName").val($(detail[1]).text());
    $("#editProductSelectCategory").val($(detail[2]).attr("value"));
    $("#editProductPrice").val($(detail[3]).text());
    $("#editProductQuantity").val($(detail[4]).text());
    $('#editProductModal').modal('toggle');
    /*$.ajax({
        type : 'GET',
        url : '/api/productdetail/' + id,
        headers: {
            'x-access-token': token
        },
        async : true,              
        dataType: "json",
        success: function(data){
            if(data.status){
                $("#editProductCode").val(data.data.code);
                $("#editProductName").val(data.data.name);
                $("#editProductPrice").val(data.data.price);
                $("#editProductQuantity").val(data.data.quantity);
                $("#editProductSelectCategory").val(data.data.category_id);
                $('#editProductModal').modal('toggle');
            }
        }
    });*/
}

function updateProduct(){
    var code      = $("#editProductCode").val();
    var name      = $("#editProductName").val();
    var price     = $("#editProductPrice").val();
    var quantity  = $("#editProductQuantity").val();
    var category  = $("#editProductSelectCategory").val();
    var sendData  = {'code': code,'name':name,'price':price,'quantity':quantity,'category_id':category, '_id': editProductId};
    $.ajax({
        type : 'PUT',
        url : '/api/updateproduct',
        headers: {
            'x-access-token': token
        }, 
        data : sendData,               
        dataType: "json",
        success: function(data){
            if(data.status){
                alert("Producto Actualizado");
                $('#editProductModal').modal('toggle');
                var detail = $(editProductElement).parent().parent().children();
                $(detail[0]).text(code);
                $(detail[1]).text(name);
                $(detail[2]).text(getCategoryName(category));
                $(detail[2]).attr("value", category);
                $(detail[3]).text(price);
                $(detail[4]).text(quantity);
            }else if(data.data){
                alert("Complete los campos obligatorios");
            }else{
                alert("Hubo un error, porfavor actualize la página");
            }
        }
    });
}

function getCategoryName(id){
    if(!id){
        return "-";
    }
    var name = "-";
    $.each(categories, function() {
        if(this._id == id){
            name = this.name;
            return false;
        }
    });
    return name;
}

function cleanCreateProductModal(){
    $("#createProductCode").val("");
    $("#createProductName").val("");
    $("#createProductPrice").val("");
    $("#createProductQuantity").val("");
    $("#createProductSelectCategory").val("");
}

function cleanUpdateProductModal(){
    $("#editProductCode").val("");
    $("#editProductName").val("");
    $("#editProductPrice").val("");
    $("#editProductQuantity").val("");
    $("#editProductSelectCategory").val("");
}