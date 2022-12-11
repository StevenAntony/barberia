var table
var elementEditar = null
var filaEditar = null
const idFormEnviar = $('#formEnviar')
const btnEnviarForm = $('.btnEnviarForm')
const btnAperturarModal = $('.btnAperturarModal')

var moneda = {
    B200: 0, B100:0, B50:0, B20:0, B10:0,
    S5:0, S2: 0, S1:0, C50:0, C20:0, C10:0
}


/**
 * 
 * Se envia el formulario para crear o editar
 * 
 */
btnEnviarForm.click(function () {  
    $.ajax({
        type: idFormEnviar.attr('method') ,
        dataType: "json",
        url: idFormEnviar.attr('action'),
        data: idFormEnviar.serialize(),
        success: function (response) {
            console.log(response); 
            swal({   
                title: "Formulario",   
                text: "Fue enviado correctamente",   
                timer: 1000,   
                showConfirmButton: false 
            });
            // table.rows.add( [ response.data] )
            // .draw();
            
            $('.modalForm').modal('hide')
            
            location.reload()
        },
        beforeSend:function () {  
            console.log('cargando...');
        },
        error:function (error) {  
            console.error(error);
        }
    });
});

/**
 * 
 * Adaptar el formulario para editar
 * 
 */
$(document).on('click','.editarInfo', function () {
    let key = $(this).data().key
    let tr = $(this).closest("tr")
    filaEditar = tr
    elementEditar = table.row(tr).data()

    $('input[name="itmDocumento"]').val(elementEditar.Documento)
    $('input[name="itmNombre"]').val(elementEditar.Nombre)
    $('input[name="itmApellido"]').val(elementEditar.Apellido)
    $('input[name="itmNacimiento"]').val(elementEditar.Nacimiento)
    accion = 'Editar'
    $('.modalForm').modal('show')
});

/**
 * 
 * Aperturar modal para poder registrar uno nuevo
 * 
 */
btnAperturarModal.click(function () {  
    let verificar = verificarAperturada()
    
    if (verificar != null) {
        Swal.fire({
            title: "Caja Aperturada",
            text: "Se encontro una caja aperturada, si continua y apertura, la caja actual se cerrara.",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Continuar",
            closeOnConfirm: false,
        }).then((result) => {
            if (result.value) {         
                $('.modalForm').modal({backdrop: 'static', keyboard: false})
            }
        })
    }else{
        $('.modalForm').modal({backdrop: 'static', keyboard: false})
    }
})

/**
 * 
 * Verificar si hay caja aperturada
 * 
 */
const verificarAperturada =async () => {
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json"
       }
    
    let response = await fetch("/caja/verificar", { 
        method: "POST",
        headers: headersList
    });
  
  let data = await response.json();
  return data.data
}

const consultarArqueo = async () => {
    
}

$(document).on('click','.arqueoCaja',function () {  
    var tr = $(this).closest("tr");
    var filaEditar = table.row(tr);

})

$(document).on("click", ".details-control", function () {
    var tr = $(this).closest("tr");
    var row = table.row(tr);
    if (row.child.isShown()) {
      row.child.hide();
      tr.removeClass("shown");
    } else {
      row.child(formatRow(row.data())).show();
      tr.addClass("shown");
    }
});

const formatRow = (row) => {
    let date = moment(row.Cierre).format('DD/MM/YYYY h:mm a') 
    return (`<table class="table" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">
                <tr><td>Apertura</td><td>${moment(row.Apertura).format('DD/MM/YYYY h:mm a')}</td></tr>
                <tr><td>Cierre</td><td>${date == 'Invalid date' ? '--' : date }</td></tr>
                <tr><td>Usuario</td><td>${row.Usuario.Nombre}</td></tr>
                <tr><td>Estado</td><td><span class='badge ${row.Estado == 'Aperturado' ? 'bg-success':'bg-info'} '>${row.Estado}</span></td></tr>
                <tr><td>Total</td><td>${money(row.Total)}</td></tr>
            </table>`);
}

$(document).ready(function () {
    table = $("#dataTableInfo").DataTable({
        // scrollY: "400px",
        paging: true,
        order: [[ 4, "asc" ]],
        deferRender: true,
        responsive: true,
        pageLength: 10,
        ordering: true,
        info: true,
        processing: false,
        ajax: {
            url: '/caja/list',
            type:'post',
            dataSrc:  function(response) {        
                if (response.success) {
                    return response.data
                }
                return []
            }
        },
        columnDefs: [
            {title: "",targets: [ 0 ],visible: true},
            {title: "Apertura",targets: [ 1 ],visible: true},
            {title: "Cierre",targets: [ 2 ],visible: true},
            {title: "Usuario",targets: [ 3 ],visible: true},
            {title: "Estado",targets: [ 4 ],visible: true},
            {title: "Total",targets: [ 5 ],visible: true},
            {title: "Opción",targets: [ 6 ],visible: true},
        ],
        columns: [
            {width: "3%",className:'details-control',orderable:false,data:null,defaultContent: '',
                render:function (data,type,row,index) {
                    return `<button type="button" class="btn-info btn" style="font-size: 12px;padding: 2px 5px;"><i class="fa fa-plus"></i></button>`;
                }
            },
            {className:'text-center ',orderable:true,data:'Apertura',defaultContent: '',
                render: function (data, type, row, index) { 
                    return moment(row.Apertura).format('DD/MM/YYYY h:mm a')
                }
            },
            {className:'text-center hide-xs',orderable:false,data:'Cierre',defaultContent: '',
                render: function (data, type, row, index) { 
                    let date = moment(row.Cierre).format('DD/MM/YYYY h:mm a') 
                    return date == 'Invalid date' || row.Cierre == undefined ? '--' : date
                }
            },
            {className:'text-center hide-xs',orderable:false,data:'Usuario.Nombre',defaultContent: ''},
            {className:'text-center hide-xs',orderable:false,data:'Estado',defaultContent: '',
                render: function (data, type, row, index) { 
                    return `<span class='badge ${row.Estado == 'Aperturado' ? 'bg-success':'bg-info'} '>${row.Estado}</span>`
                }
            },
            {className:'text-center hide-xs',orderable:false,data:'Total',defaultContent: '',
                render:function (data,type,row,index) {  
                    return money(row.Total)
                }
            },
            {className:'text-center',orderable:false,data:'Estado',defaultContent: '',
                render: function (data, type, row) {  
                    return `<div class="btn-group">
                                <button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Acción
                                </button>
                                <div class="dropdown-menu">
                                    ${row.Estado == 'Aperturado' ? '<a class="dropdown-item cerrarCaja"  href="javascript:void(0)"><i class="mdi mdi-archive"></i> Cerrar Caja</a>' : ''} 
                                    <a class="dropdown-item arqueoCaja"  href="javascript:void(0)"><i class="mdi mdi-chart-areaspline"></i> Arqueo Caja</a>
                                    <a class="dropdown-item detalleCaja"  href="javascript:void(0)"><i class="mdi mdi-clipboard-text"></i> Detalle</a>
                                    
                                </div>
                            </div>`;
                }
            }
        ],
        language: {
            url: 'assets/template/language.json'
        }
      });
});

