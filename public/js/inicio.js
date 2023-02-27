const meses = Array.from({ length: 12 }, (_, i) =>
        (new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date(2022, i, 1))).toUpperCase()
    );

const cargarMeses = () => {
  $('#mesConsultar').html(meses.map((mes, indice) => `<option value="${indice+1}">${mes}</option>`).join(''))
}

$('#mesConsultar').change(function (){
  cargarResumenMes($(this).val(), new Date().getFullYear())
})

$(document).ready(function () {
  cargarMeses()
  $('#mesConsultar').val(new Date().getMonth()+1)
  cargarResumenMes($('#mesConsultar').val(), new Date().getFullYear());
});

const cargarResumenMes = async (mes, year) => {
  
  let headersList = {
    "Accept": "*/*",
    "Content-Type": "application/json"
  }

  let bodyContent = JSON.stringify({
    mes: mes,
    year: year
  });

  let response = await fetch("/analisis/resumen-mes/atencion", {
    method: "POST",
    body: bodyContent,
    headers: headersList
  });

  let data = await response.json();

  $('.mesAnalisis').html(`${meses[mes-1]}-${year}`);
  let itemChart = [];
  data.data.forEach(element => {
    itemChart.push({
      y:`2023-0${element._id.moth}-${element._id.day}`,
      item: element.Total
    });
  });

  $('#morris-line-chart').html('');
  let line = new Morris.Line({
    element: "morris-line-chart",
    resize: true,
    data: itemChart,
    xkey: "y",
    xLabels:'day',
    ykeys: ["item"],
    labels: ["Total"],
    gridLineColor: "#eef0f2",
    lineColors: ["#2962FF"],
    lineWidth: 2,
    hideHover: "auto",
  });
}
