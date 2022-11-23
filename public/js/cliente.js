var table
const idFormEnviar = $('#formEnviar')
const btnEnviarForm = $('.btnEnviarForm')

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

btnEnviarForm.click(function () {  
    $.ajax({
        type: idFormEnviar.attr('method'),
        // contentType: "application/json",
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
            table.rows.add( [ response.data] )
            .draw();
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
            {width: "3%",className:'details-control',orderable:true,data:null,defaultContent: '',
                render:function (data,type,row,index) {
                    return index.row;
                }
            },
            {className:'text-center hide-xs',orderable:false,data:'Documento',defaultContent: ''},
            {className:'text-center',orderable:false,data:'Nombre',defaultContent: ''},
            {className:'text-center hide-xs',orderable:false,data:'Nacimiento',defaultContent: '',
                render : function (data,type,row) {  
                    return `${row.Nacimiento != '' ? edad(row.Nacimiento) : ''}`
                }
            },
            {className:'text-center hide-xs',orderable:false,data:'Estado',defaultContent: '',
                render: function (data, type, row) {  
                    return `${row.Estado == 'Habilitado' 
                                            ? `<span class="badge bg-success">${row.Estado}</span>` 
                                            : `<span class="badge bg-danger">${row.Estado}</span>`}`
                }
            },
            {className:'text-center',orderable:false,data:'Estado',defaultContent: '',
                render: function (data, type, row) {  
                    return `<div class="btn-group">
                                <button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Acción
                                </button>
                                <div class="dropdown-menu">
                                    <a class="dropdown-item" href="javascript:void(0)"><i class="fa fa-edit"></i> Editar</a>
                                    <a class="dropdown-item" href="javascript:void(0)"><i class="fas fa-undo"></i> ${row.Estado == 'Habilitado' ? 'Habilitar' : 'Inhabilitar' }</a>
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