var token = "";
var myCompanyDetails = {};
var myProducts = [];
var productsBoleta = [];
var productSelected = {};

$( document ).ready(function() {
    token  = getToken();
    moment.locale('es');
    init();
});


function init(){
    $('#fechas').daterangepicker({
        "locale": {
            "applyLabel": "Aplicar",
            "cancelLabel": "Cerrar",
            "fromLabel": "Desde",
            "toLabel": "Hasta"
        }
    });
    getMyCompanyDetails();
    getMyProducts();
    getBoletas();
}

function getMyProducts(){
    $.ajax({
        type : 'GET',
        url : '/api/allproducts',
        async : false,
        headers: {
            'x-access-token': token
        },              
        dataType: "json",
        success: function(data){
            if(data.status){
                myProducts = data.data;
                var dropdown = $("#addProductSelectProduct");
                $.each(data.data, function() {
                    dropdown.append($("<option />").val(this._id).text(this.code + " - " + this.name));
                });
            }
        }
    });
}

function getMyCompanyDetails(){
    $.ajax({
        type : 'GET',
        url : '/api/mycompanydetails',
        headers: {
            'x-access-token': token
        },
        async : false,              
        dataType: "json",
        success: function(data){
            if(data.status){
                myCompanyDetails = data.data;
            }
        }
    });
}

function getBoletas(){
    $.ajax({
        type : 'GET',
        url : '/api/allboletas',
        async: true,
        headers: {
            'x-access-token': token
        },              
        dataType: "json",
        success: function(data){
        	if(data.status){
                var rows = data.data.map((boleta, index) => {
                    var tds = [];
                    tds.push($('<td>', {
                        text: ("#" + boleta.serie + "-" + boleta.correlativo)
                    }));
                    tds.push($('<td>', {
                        text: moment(boleta.created_at).format('DD/MM/YYYY hh:mm')
                    }));
                    tds.push($('<td>', {
                        text: boleta.cliente.razonSocial
                    }));
                    tds.push($('<td>', {
                        text: "S/." + Number(boleta.mtoImpVenta).toFixed(2)
                    }));
                    tds.push($('<td>',{
                        class: 'text-center',
                        html: $('<i>', {
                            style: 'cursor:pointer',
                            class: 'mdi mdi-eye-outline icon-md',
                            onclick: 'getBoletaDetails(this, "'+ boleta._id +'")'
                        })
                    }));
                    return $('<tr>', {
                        html: tds
                    });
                });

                $("#mainTableboletas").append(rows);
        	}
            hideLoading();
        }
    });
}

function createBoleta(){
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
                                     "<td value='"+category+"'>"+getCategoryName(category)+"</td>"+
                                     "<td>"+price+"</td>"+
                                     "<td>"+quantity+"</td>"+
                                     '<td class="text-center"><i class="mdi mdi-pencil-outline icon-md" style="cursor:pointer" onclick="getProductDetails(this, '+"'"+ data.data +"'"+')"></i></td>'
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

function onSelectProduct(element){
    $.each( myProducts, function( index, product ){
        if(product._id == element.value){
            productSelected = product;
            $("#addProductPrice").val(product.price);
        }
    });
}

function addProduct(){
    var quantity = $("#addProductQuantity").val();
    var price    = $("#addProductPrice").val();
    var igv      = $("#addProductIgv").val();
    productsBoleta.push({codProducto: productSelected.code, 
                         cantidad: quantity, 
                         descripcion: productSelected.name, 
                         igv: igv,
                         mtoValorVenta: (quantity * price),
                         mtoValorUnitario : price});
    $('#addProduct').modal('toggle');
    updateTableProducts();
    cleanAddProductModal();
}

function cleanAddProductModal(){
    $("#addProductSelectProduct").val("");
    $("#addProductQuantity").val("");
    $("#addProductPrice").val("");
    $("#addProductIgv").val("");
}

function updateTableProducts(){
    var rows = data.data.map((productsBoleta, index) => {
        var tds = [];
        tds.push($('<td>', {
            text: productsBoleta.codProducto
        }));
        tds.push($('<td>', {
            text: moment(boleta.created_at).format('DD/MM/YYYY hh:mm')
        }));
        tds.push($('<td>', {
            text: boleta.cliente.razonSocial
        }));
        tds.push($('<td>', {
            text: "S/." + Number(boleta.mtoImpVenta).toFixed(2)
        }));
        tds.push($('<td>',{
            class: 'text-center',
            html: $('<i>', {
                style: 'cursor:pointer',
                class: 'mdi mdi-eye-outline icon-md',
                onclick: 'getBoletaDetails(this, "'+ boleta._id +'")'
            })
        }));
        return $('<tr>', {
            html: tds
        });
    });

    $("#tableProducts").append(rows);
}