var table
var elementEditar = null
var filaEditar = null
var accion = 'Nuevo'
const idFormEnviar = $('#formEnviar')
const btnEnviarForm = $('.btnEnviarForm')
const btnAperturarModal = $('.btnAperturarModal')

/**
 * If the current month is less than the birth month, or if the current month is the same as the birth
 * month but the current day is less than the birth day, then subtract one from the age.
 * @param dateString - The date string to be parsed.
 * @returns The age of the person.
 */
const edad = (dateString) => {
    let hoy = new Date()
    let fechaNacimiento = new Date(dateString)
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear()
    let diferenciaMeses = hoy.getMonth() - fechaNacimiento.getMonth()
    if (diferenciaMeses < 0 || (diferenciaMeses === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
        edad--
    }
    return edad
}

/**
 * 
 * Se envia el formulario para crear o editar
 * 
 */
btnEnviarForm.click(function () {  
    $.ajax({
        type: accion == 'Nuevo' ? idFormEnviar.attr('method') : 'put',
        dataType: "json",
        url: accion == 'Nuevo' ? idFormEnviar.attr('action') : `/cliente/update/${elementEditar._id}`,
        data: idFormEnviar.serialize(),
        success: function (response) {
            console.log(response); 
            swal({   
                title: "Formulario",   
                text: "Fue enviado correctamente",   
                timer: 1000,   
                showConfirmButton: false 
            });
            if (accion == 'Nuevo') {
                table.rows.add( [ response.data] )
                .draw();
            }else{
                table.row(filaEditar).data(response.data).draw()
            }
            
            $('.modalForm').modal('hide')
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
 * Cambiar estado 
 */
$(document).on('click','.cambiarEstado',function () {  
    let tr = $(this).closest("tr")
    filaEditar = tr

    $.ajax({
        type: 'put',
        dataType: "json",
        url: `/cliente/estado/${table.row(tr).data()._id}`,
        data: {itmEstado:table.row(tr).data().Estado},
        success: function (response) {
            table.row(filaEditar).data(response.data).draw()
            $(filaEditar).removeClass('tdInhabilitado')
            if (response.data.Estado == 'Inhabilitado')
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

/**
 * 
 * Aperturar modal para poder registrar uno nuevo
 * 
 */
btnAperturarModal.click(function () {  
    idFormEnviar[0].reset()
    accion = 'Nuevo'
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
    return (`<table class="table" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">
                <tr><td>Documento</td><td>${row.Documento}</td></tr>
                <tr><td>Nombre</td><td>${row.Nombre} ${row.Apellido}</td></tr>
                <tr><td>Edad</td><td>${row.Nacimiento != '' ? edad(row.Nacimiento) : '--'}</td></tr>
                <tr><td>Estado</td><td><span class='badge ${row.Estado == 'Habilitado' ? 'bg-success':'bg-danger'} '>${row.Estado}</span></td></tr>
            </table>`);
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
            url: '/cliente/list',
            type:'post',
            dataSrc:  function(response) {        
                if (response.success) {
                    return response.data
                }
                return []
            }
        },
        createdRow: function( row, data, dataIndex ) {
            if (data.Estado == 'Inhabilitado')                 
                $(row).addClass('tdInhabilitado')

        },
        columnDefs: [
            {title: "",targets: [ 0 ],visible: true},
            {title: "#",targets: [ 1 ],visible: false},
            {title: "Documento",targets: [ 2 ],visible: true},
            {title: "Cliente",targets: [ 3 ],visible: true},
            {title: "Edad",targets: [ 4 ],visible: true},
            {title: "Estado",targets: [ 5 ],visible: true},
            {title: "Opción",targets: [ 6 ],visible: true},
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
            {className:'text-center hide-xs',orderable:false,data:'Documento',defaultContent: ''},
            {className:'text-center',orderable:false,data:'Nombre',defaultContent: '',
                render: function (data, type, row) {  
                    return `${row.Nombre} ${row.Apellido}`
                }
            },
            {className:'text-center hide-xs',orderable:false,data:'Nacimiento',defaultContent: '',
                render : function (data,type,row) {  
                    return `${row.Nacimiento != '' ? edad(row.Nacimiento) : '--'}`
                }
            },
            {className:'text-center hide-xs',orderable:false,data:'Estado',defaultContent: '',
                render: function (data, type, row, index) { 
                    return `<span class='badge ${row.Estado == 'Habilitado' ? 'bg-success':'bg-danger'} '>${row.Estado}</span>`
                }
            },
            {className:'text-center',orderable:false,data:'Estado',defaultContent: '',
                render: function (data, type, row) {  
                    return `<div class="btn-group">
                                <button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Acción
                                </button>
                                <div class="dropdown-menu">
                                    <a class="dropdown-item editarInfo"  href="javascript:void(0)"><i class="fa fa-edit"></i> Editar</a>
                                    <a class="dropdown-item cambiarEstado"  href="javascript:void(0)"><i class="fas fa-undo"></i> ${row.Estado == 'Habilitado' ? 'Inhabilitar' : 'Habilitar' }</a>
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