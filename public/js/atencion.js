import { Config } from './../Config.js';

const btnEnviarForm = $('.btnEnviarForm ')
var table = null
var ClienteSelect = null
var filaEditar = null

const config = new Config();

/**
 * Envio del formulario para la creacion de un nueva atencion mediante api 
 * utilizando fetch
 * @param {*} data - de tipo objeto
 */
const enviarFormulario = async (data) => {
    
    let bodyContent = JSON.stringify(data);
       
    let response = await fetch('/atencion/create', { 
        method: "POST",
        body: bodyContent,
        headers: config.headers()
    });
    
    let result = await response.json();
    // console.log(result);
    if (result.success) {
        table.rows.add( [ result.data] )
                .draw();
        swal({   
            title: "Formulario",   
            text: "Fue enviado correctamente",   
            timer: 1000,   
            showConfirmButton: false 
        });
        $('.modalForm').modal('hide')
    }else{
        swal({   
            title: "Upss",   
            text: result.error.message,   
            icon:'info',
            showConfirmButton: false 
        });
    }
    // console.log(response); 
    //         
            
    //         // location.reload()
}

btnEnviarForm.click(function () {  
    enviarFormulario({
        itmCliente : ClienteSelect,
        itmCorte : $('#itmCorte :selected').text(),
        itmMonto : $('#itmMonto').val() < 0 ? 0 : $('#itmMonto').val(),
        itmAdicional: $('#itmAdicional').val(),
        itmPago: $('#itmPago').val()
    })
})

$('#itmCliente').on('select2:select', function (e) {
        const data = e.params.data;
        ClienteSelect = {
            _id : data.id,
            cliente: data.text 
        }
});

/**
 * Cargar los cortes mediante una api utilizando fetch
 */
const cargarCorte =async () => {

    let response = await fetch("/corte/list", { 
        method: "POST",
        headers: config.headers()
    });
    
    let data = await response.json();
    let htmlRender = ''
    data.data.forEach(element => {
        htmlRender += `<option value="${element.Descripcion}">${element.Descripcion}</option>`
    });   
    $("#itmCorte").html(htmlRender)
    $("#itmCorte").select2({
        dropdownParent:$('.modalForm'),
        language: "es"
    });
}

$(document).ready(function () {
    table = $("#dataTableInfo").DataTable({
        // scrollY: "400px",
        paging: true,
        order: [[ 1, "desc" ]],
        deferRender: true,
        responsive: true,
        pageLength: 10,
        ordering: true,
        info: true,
        processing: false,
        ajax: {
            url: '/atencion/list',
            type:'post',
            headers: config.headers(),
            dataSrc:  function(response) {        
                if (response.success) {
                    return response.data
                }
                return []
            }
        },
        createdRow: function( row, data, dataIndex ) {
            if (data.Estado == 'Anulado')                 
                $(row).addClass('tdInhabilitado')
        },
        columnDefs: [
            {title: "",targets: [ 0 ],visible: true},
            {title: "#",targets: [ 1 ],visible: false},
            {title: "Cliente",targets: [ 2 ],visible: true},
            {title: "Servicio",targets: [ 3 ],visible: true},
            {title: "Usuario",targets: [ 4 ],visible: true},
            {title: "T.P",targets: [ 5 ],visible: true},
            {title: "Monto",targets: [ 6 ],visible: true},
            {title: "Estado",targets: [ 7 ],visible: true},
            {title: "Opción",targets: [ 8 ],visible: true},
        ],
        columns: [
            {width: "3%",className:'details-control',orderable:false,data:null,defaultContent: '',
                render:function (data,type,row,index) {
                    return `<button type="button" class="btn-info btn" style="font-size: 12px;padding: 2px 5px;"><i class="fa fa-plus"></i></button>`;
                }
            },
            {width: "3%",className:'',orderable:true,data:null,defaultContent: '',
                render:function (data,type,row,index) {
                    return index.row;
                }
            },
            {className:'text-center',orderable:false,data:'Cliente.cliente',defaultContent: ''},
            {className:'text-center hide-xs',orderable:false,data:'Corte',defaultContent: ''},
            {className:'text-center hide-xs',orderable:false,data:'Usuario.Nombre',defaultContent: ''},
            {className:'text-center hide-xs',orderable:false,data:'Pago',defaultContent: ''},
            {className:'text-center hide-xs',orderable:false,data:'Monto',defaultContent: '',
                render:function (data, type, row) {  
                    return `${money(data)}`
                }    
            },
            {className:'text-center hide-xs',orderable:false,data:'Estado',defaultContent: '',
                render: function (data, type, row, index) { 
                    return `<span class='badge ${row.Estado == 'Cobrado' ? 'bg-success':'bg-danger'} '>${row.Estado}</span>`
                }
            },
            {className:'text-center',orderable:false,data:'Estado',defaultContent: '',
                render: function (data, type, row) {  
                    return `<div class="btn-group">
                                <button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Acción
                                </button>
                                <div class="dropdown-menu">
                                    <a class="dropdown-item cambiarEstado"  href="javascript:void(0)"><i class="fas fa-undo"></i> ${row.Estado == 'Cobrado' ? 'Anular' : 'Cobrado' }</a>
                                </div>
                            </div>`;
                }
            }
        ],
        language: {
            url: 'assets/template/language.json'
        }
      });

    
    $("#itmCliente").select2({
        placeholder: "Loading remote data",
        ajax: {
            url: "/cliente/buscar",
            method:"post",
            dataType: 'json',
            headers: {
                authorization: `Bearer ${JSON.parse(localStorage.getItem('auth')).token}`
            },
            delay: 250,
            data: function(params) {
                return {
                    itmBuscar: params.term, // search term
                };
            },
            processResults: function(data, params) {
                var items = $.map(data.data, function (obj) {
                                    obj.id =  obj._id;
                                    obj.text = obj.Nombre + ' ' + obj.Apellido;
        
                                    return obj;
                                });
                return {
                    results: items
                };
            },
            cache: true
        },
        dropdownParent:$('.modalForm'),
        minimumInputLength: 1,
        language: "es"
    });


    $("#itmAdicional").select2({
        tags: true,
        language: "es"
    });

    cargarCorte()
});

$(document).on("click", ".details-control", function () {
    let tr = $(this).closest("tr");
    let row = table.row(tr);
    let td = $(this).closest('td');
    if (row.child.isShown()) {
      row.child.hide();
      td.html(`<button type="button" class="btn-info btn" style="font-size: 12px;padding: 2px 5px;"><i class="fa fa-plus"></i></button>`)
      tr.removeClass("shown");
    } else {
      row.child(formatRow(row.data())).show();
      tr.addClass("shown");
      td.html(`<button type="button" class="btn-danger btn" style="font-size: 12px;padding: 2px 5px;"><i class="fa fa-minus"></i></button>`)
                
    }
});

const formatRow = (row) => {
    return (`<table class="table" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">
                <tr><td>Cliente</td><td>${row.Cliente.cliente}</td></tr>
                <tr><td>Servicio</td><td>${row.Corte}</td></tr>
                <tr><td>Usuario</td><td>${row.Usuario.Nombre}</td></tr>
                <tr><td>T.P</td><td>${row.Pago}</td></tr>
                <tr><td>Monto</td><td>${money(row.Monto)}</td></tr>
                <tr><td>Estado</td><td><span class='badge ${row.Estado == 'Cobrado' ? 'bg-success':'bg-danger'} '>${row.Estado}</span></td></tr>
                
            </table>`);
}

/**
 * Cambiar estado 
 */
$(document).on('click','.cambiarEstado',function () {  
    let tr = $(this).closest("tr")
    filaEditar = tr

    $.ajax({
        type: 'put',
        dataType: "json",
        headers: {
            authorization: `Bearer ${JSON.parse(localStorage.getItem('auth')).token}`
        },
        url: `/atencion/estado/${table.row(tr).data()._id}`,
        data: {itmEstado:table.row(tr).data().Estado},
        success: function (response) {
            table.row(filaEditar).data(response.data).draw()
            $(filaEditar).removeClass('tdInhabilitado')
            if (response.data.Estado == 'Anulado')
                $(filaEditar).addClass('tdInhabilitado')
        },
        beforeSend:function () {  
            console.log('cargando...');
        },
        error:function (error) {  
            console.error(error);
        }
    });
})