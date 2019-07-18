var token            = "";
var myCompanyDetails = {};
var myProducts       = [];
var productsBoleta   = [];
var productSelected  = {};

$( document ).ready(function() {
    token  = getToken();
    moment.locale('es');
    onlyAllowNumbers();
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
                putMyCompanyDetails();
            }
        }
    });
}

function putMyCompanyDetails(){
    $("#name").val(myCompanyDetails.name);
    $("#businessName").val(myCompanyDetails.businessName);
    $("#ruc").val(myCompanyDetails.ruc);
    $("#address").val(myCompanyDetails.address);
    $("#telephone").val(myCompanyDetails.telephone);
    $("#email").val(myCompanyDetails.email);
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
    var serie       = $("#serie").val();
    var correlativo = $("#correlativo").val();
    var igv         = $("#correlativo").val();
    if(!serie || !correlativo || !igv){
        alert("Ingrese todos los campos obligatorios");
        return;
    }
    var numeroDoc   = $("#numeroDoc").val();
    var razonSocial = $("#razonSocial").val();
    var direccion   = $("#direccion").val();
    if(!numeroDoc || !razonSocial || !direccion){
        alert("Ingrese todos los campos obligatorios");
        return;
    }
    var company     = { "edited" : 0 };
    if ($('#showCompany').is(":checked")){
        var businessName = $("#businessName").val();
        var name         = $("#name").val();
        var ruc          = $("#ruc").val();
        var address      = $("#address").val();
        var email        = $("#email").val();
        var telephone    = $("#telephone").val();
        if(!businessName || !name || !ruc){
            alert("Ingrese todos los campos obligatorios");
            return;
        }
        company = {
            "edited"          : 1,
            "ruc"             : ruc,
            "nombreComercial" : businessName,
            "razonSocial"     : name,
            "direccion"       : address,
            "email"           : email,
            "telefono"        : telephone
        };
    }
    var sendData = {
        "serie"       : serie,
        "correlativo" : correlativo,
        "mtoIgv"      : igv,
        "cliente"     : {
            "numeroDoc"   : numeroDoc,
            "razonSocial" : razonSocial,
            "direccion"   : direccion
        },
        "items" : productsBoleta,
        "company" : company
    }

    $.ajax({
        type : 'POST',
        url : '/api/createboleta',
        headers: {
            'x-access-token': token
        }, 
        data : sendData,               
        dataType: "json",
        success: function(data){
            
        }
    });
}

function onSelectProduct(element){
    if (element.value === ''){
        $("#addProductQuantity").val("");
        $("#addProductPrice").val("");
        $("#addProductTotal").val(0);
    }
    $.each( myProducts, function( index, product ){
        if(product._id == element.value){
            productSelected = product;
            $("#addProductPrice").val(product.price);
            onChangeValueProduct();
            return false;
        }
    });
}

function disableOptionSelectProduct(){
    var option = $("option[value='" + element.value + "']", element);
    option.attr("disabled","disabled");
}

function enableOptionSelectProduct(){
    var option = $("option[value='" + element.value + "']", element);
    option.attr("disabled","disabled");
}

function addProduct(){
    var quantity = $("#addProductQuantity").val();
    var price    = $("#addProductPrice").val();
    var igv      = $("#addProductIgv").val();
    productsBoleta.push({_id : productSelected._id,
                         codProducto: productSelected.code, 
                         descripcion: productSelected.name, 
                         cantidad: quantity, 
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
    $("#addProductTotal").val(0);
}

function updateTableProducts(){
    $('#tableProducts tbody').empty();
    var rows = productsBoleta.map((product, index) => {
        var tds = [];
        tds.push($('<td>', {
            text: product.codProducto
        }));
        tds.push($('<td>', {
            text: product.descripcion
        }));
        tds.push($('<td>', {
            text: product.cantidad
        }));
        tds.push($('<td>', {
            text: product.mtoValorUnitario
        }));
        tds.push($('<td>', {
            text: "S/." + Number(product.mtoValorVenta).toFixed(2)
        }));
        tds.push($('<td>',{
            class: 'text-center',
            html: $('<i>', {
                style: 'cursor:pointer',
                class: 'mdi mdi-delete-outline icon-md',
                onclick: 'deleteProduct(this, "'+ product._id +'")'
            })
        }));
        return $('<tr>', {
            html: tds
        });
    });

    $("#tableProducts").append(rows);
}

function deleteProduct(element, id){
    $(element).parent().parent().remove();
    console.log(productsBoleta);
    $.each( productsBoleta, function( index, product ){
        if(product._id == id){
            console.log(index);
            productsBoleta.splice(index, 1);
            return false;
        }
    });
}

function onChangeValueProduct(){
    var quantity = $("#addProductQuantity").val();
    var price    = $("#addProductPrice").val();
    if(quantity && price){
        var total = Number(quantity * price).toFixed(2);
        $("#addProductTotal").val(total);
    }
}

function showHideBussiness(){
    $("#myBussinessContent").toggleClass('d-none');
}