const inputValue = document.querySelector('#input-value');
const inputDate = document.querySelector('#input-date');
const form = document.querySelector('#form');

const formPlan = document.querySelector('#form-plan');
const inputPlan = document.querySelector('#input-plan');

let yDataPlan = [100, 100];

const getCurrentDate = () => {
  const date = new Date();
  return date;
};

const nowDate = (date) => {
  let dd = date.getDate();
  if (dd < 10) dd = '0' + dd;
  let mm = date.getMonth() + 1;
  if (mm < 10) mm = '0' + mm;
  let yyyy = date.getFullYear();
  if (yyyy < 10) yyyy = '0' + yyyy;
  return yyyy + '-' + mm + '-' + dd;
};

const initCurrentDate = () => {
  const today = getCurrentDate();
  const todayMs = today.getTime();

  const tomorrowMs = todayMs + 86400000;
  const tomorrow = new Date(tomorrowMs);

  return [nowDate(today), nowDate(tomorrow)];
};
let currentDate = initCurrentDate();
let data = [];
let layout;

let dataObj = [
  {
    x: `${currentDate.at(-2)} 00:00`,
    y: 16,
  },
  {
    x: `${currentDate.at(-2)} 01:00`,
    y: 20,
  },
];

let dataObjTrace2 = [
  {
    x: `${currentDate.at(-2)} 00:00`,
    y: 16,
  },
  {
    x: `${currentDate.at(-2)} 01:00`,
    y: 4,
  },
];

let heightGraf = window.innerHeight - 200;

window.addEventListener('resize', () => {
  heightGraf = window.innerHeight - 200;
  console.log(heightGraf);
  startGraf();
});

const getNumberForDate = (date) => {
  const newDate = new Date(date);
  const dateNumber = newDate.getTime();
  return dateNumber;
};

const getNumbersForDates = (dateArr) => {
  let dateString = [];
  dateArr.forEach((date) => {
    const newDate = new Date(date.x);
    const value = date.y;
    const dateNumber = newDate.getTime();
    const objNew = {
      x: dateNumber,
      y: value,
    };
    dateString = [...dateString, objNew];
  });
  return dateString;
};

const sortDates = (arr) => {
  const sortedArr = arr.sort((a, b) => a.x - b.x);
  return sortedArr;
};

const getPrognosies = () => {
  if (dataObj.length >= 2) {
    let x1 = getNumberForDate(dataObj.at(-2).x);
    let x2 = getNumberForDate(dataObj.at(-1).x);
    let y1 = dataObj.at(-2).y;
    let y2 = dataObj.at(-1).y;
    let x = getNumberForDate(currentDate.at(-1));
    const k = (y1 - y2) / (x1 - x2);
    const b = y2 - k * x2;
    const result = k * x + b;
    return result;
  }
};

const calculateValuePerHour = (data, hour) => {
  const valueY = data.at(-1).y - data.at(-2).y;
  let valueX;
  if (hour.getMinutes() > 0) {
    valueX = hour.getHours() + 1;
  } else {
    valueX = hour.getHours();
  }
  const x = `${nowDate(hour)} ${valueX}:00`;

  const result = {
    x: x,
    y: valueY,
  };
  return result;
};

const initTraces = () => {
  let xd = [];
  let yd = [];

  let xdTrace2 = [];
  let ydTrace2 = [];

  for (let i = 0; i < dataObj.length; i++) {
    xd = [...xd, dataObj[i].x];
    yd = [...yd, dataObj[i].y];
  }
  for (let i = 0; i < dataObjTrace2.length; i++) {
    xdTrace2 = [...xdTrace2, dataObjTrace2[i].x];
    ydTrace2 = [...ydTrace2, dataObjTrace2[i].y];
  }
  const trace1 = {
    x: dataObj.length > 1 ? xd : [],
    y: dataObj.length > 1 ? yd : [],
    mode: 'lines',
    line: { color: '#bf00a0' },
    type: 'line',
    name: '<b>Добыто (сутки)</b>',
    hovertemplate: 'День: %{x}<br>Добыто (сутки): <b>%{y}</b> тыс. м',
  };

  const trace2 = {
    x: xdTrace2,
    y: ydTrace2,
    marker: {
      color: '#8dee84',
    },
    type: 'bar',
    name: '<b>Добыто (час)</b>',
    hovertemplate: 'День: %{x}<br>Добыто (час): <b>%{y}</b> тыс. м',
  };

  const trace3 = {
    x: dataObj.length >= 2 ? [xd.at(-1), currentDate.at(-1)] : [],
    y: dataObj.length >= 2 ? [yd.at(-1), getPrognosies()] : [],
    mode: 'lines',
    line: {
      dash: 'dot',
      width: 4,
      color: getPrognosies() >= yDataPlan.at(-1) ? 'orange' : 'red',
    },
    name: '<b>Прогноз добычи</b>',
    hovertemplate: 'День: %{x}<br>Будет добыто (сутки): <b>%{y}</b> тыс. м',
  };

  const trace0 = {
    x: currentDate,
    y: yDataPlan,
    mode: 'lines',
    line: { color: '#4CA6FB' },
    type: 'line',
    name: '<b>План добычи</b>',
  };

  data = [trace0, trace1, trace2, trace3];
};

const initLayout = () => {
  let xd = [];
  for (let i = 0; i < dataObj.length; i++) {
    xd = [...xd, dataObj[i].x];
  }
  const layoutGraf = {
    title: 'Скважина 1 - 1',
    paper_bgcolor: "rgba(0, 0, 0, 0)",
    plot_bgcolor: "rgba(0, 0, 0, 0)",
    xaxis: {
      linewidth: 2,
      ticks: 'outside',
      linecolor: 'rgb(204,204,204)',
      tickcolor: 'rgb(204,204,204)',
      tickwidth: 2,
      ticklen: 5,
      fixedrange: true,
      dtick: 7200000,
      tickmode: 'linear',
      tickformat: '%H:%M \n %B %d',
    },
    yaxis: {
      title: 'Дебит',
      autorange: true,
      type: 'linear',
      fixedrange: true,
      ticksuffix: ' тыс. м',
      automargin: 'left',
    },
    legend: {
      orientation: 'h',
      xanchor: 'center',
      x: '.5',
    },
    annotations: [],
    height: heightGraf,
  };
  layout = layoutGraf;
};

const initAnnotations = () => {
  let xd = [];
  let yd = [];

  for (let i = 0; i < dataObj.length; i++) {
    xd = [...xd, dataObj[i].x];
    yd = [...yd, dataObj[i].y];

    let annotation = {
      xref: 'x',
      x: xd.at(-1),
      y: yd.at(-1),
      xanchor: 'right',
      yanchor: 'bottom',
      text: `<b>${yd.at(-1)}</b>`,
      showarrow: false,
    };
    let annotation2 = {
      xref: 'x',
      x: currentDate.at(-1),
      y: dataObj.length > 2 ? getPrognosies() : [],
      xanchor: 'right',
      yanchor: 'bottom',
      text: `<b>${Math.round(getPrognosies())}</b>`,
      showarrow: false,
    };
    layout.annotations = [annotation, annotation2];
  }
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const newDate = currentDate[0] + ' ' + inputDate.value;
  const newValue = Number(inputValue.value);
  const newObj = {
    x: newDate,
    y: newValue,
  };
  let checkDuplicated;

  for (let i = 0; i < dataObj.length; i++) {
    if (dataObj[i].x === newDate) {
      dataObj[i].x = newDate;
      dataObj[i].y = newValue;
      checkDuplicated = true;
    }
  }

  if (!checkDuplicated) {
    dataObj = [...dataObj, newObj];
    dataObj = getNumbersForDates(dataObj);
    dataObj = sortDates(dataObj);
  }

  const dateTrace2 = new Date(newDate);
  let dataTrace2 = calculateValuePerHour(dataObj, dateTrace2);
  console.log(dataTrace2);
  let checkMarckDublicate;

  for (let i = 0; i < dataObjTrace2.length; i++) {
    if (dataObjTrace2[i].x === newDate) {
      dataObjTrace2[i].y = dataTrace2.y;
      checkMarckDublicate = true;
    }
    if (dataObjTrace2[i].x !== newDate) {
      checkMarckDublicate = false;
    }
  }

  if (checkMarckDublicate === false) {
    dataObjTrace2 = [...dataObjTrace2, dataTrace2];
  }

  startGraf();
});

formPlan.addEventListener('submit', (e) => {
  e.preventDefault();
  const inputValue = inputPlan.value;
  yDataPlan = [inputValue, inputValue];
  startGraf();
});

const startGraf = () => {
  initCurrentDate();
  initTraces();
  initLayout();
  initAnnotations();
  Plotly.newPlot('myDiv', data, layout);
};

startGraf();
