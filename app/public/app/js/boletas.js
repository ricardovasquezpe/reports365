var token      = "";

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
    getBoletas();
}

function getBoletas(){
    $.ajax({
        type : 'GET',
        url : '/api/allboletas',
        async: false,
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
                /*var rows = data.data.map((product, index) => {
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
                */

                $("#mainTableboletas").append(rows);
        	}
            hideLoading();
        }
    });
}