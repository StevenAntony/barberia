const cargarResumenMes = async () => {
  let headersList = {
    "Accept": "*/*",
    "Content-Type": "application/json"
  }

  let bodyContent = JSON.stringify({
    mes: 1,
    year: 2023
  });

  let response = await fetch("/analisis/resumen-mes/atencion", {
    method: "POST",
    body: bodyContent,
    headers: headersList
  });

  let data = await response.json();
  let itemChart = [];
  data.data.forEach(element => {
    itemChart.push({
      y:`2023-0${element._id.moth}-${element._id.day}`,
      item: element.Total
    });
  });
  console.log(itemChart);
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
  console.log(data);
}

cargarResumenMes();