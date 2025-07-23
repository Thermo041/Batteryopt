const voltageDisplay = document.getElementById("voltage");
const currentDisplay = document.getElementById("current");
const socDisplay = document.getElementById("soc");
const logTable = document.getElementById("logTable");
const alertBox = document.getElementById("alert");

const ctx = document.getElementById("batteryChart").getContext("2d");
const batteryChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Voltage (V)",
        borderColor: "#007bff",
        data: [],
        fill: false,
        tension: 0.1
      },
      {
        label: "Current (A)",
        borderColor: "#28a745",
        data: [],
        fill: false,
        tension: 0.1
      },
      {
        label: "SOC (%)",
        borderColor: "#ffc107",
        data: [],
        fill: false,
        tension: 0.1
      }
    ]
  },
  options: {
    responsive: true,
    scales: {
      x: { display: true },
      y: { display: true, min: 0 }
    }
  }
});

function submitData() {
  const voltage = parseFloat(document.getElementById("inputVoltage").value);
  const current = parseFloat(document.getElementById("inputCurrent").value);
  const soc = parseInt(document.getElementById("inputSOC").value);

  if (isNaN(voltage) || isNaN(current) || isNaN(soc)) {
    alert("Please enter valid data for all fields!");
    return;
  }

  updateDashboard(voltage, current, soc);
}

function updateDashboard(voltage, current, soc) {
  const time = new Date().toLocaleTimeString();

  voltageDisplay.textContent = `Voltage: ${voltage} V`;
  currentDisplay.textContent = `Current: ${current} A`;
  socDisplay.textContent = `SOC: ${soc} %`;


  batteryChart.data.labels.push(time);
  batteryChart.data.datasets[0].data.push(voltage);
  batteryChart.data.datasets[1].data.push(current);
  batteryChart.data.datasets[2].data.push(soc);

  if (batteryChart.data.labels.length > 10) {
    batteryChart.data.labels.shift();
    batteryChart.data.datasets.forEach(dataset => dataset.data.shift());
  }
  batteryChart.update();


  const row = `<tr>
                <td>${time}</td>
                <td>${voltage}</td>
                <td>${current}</td>
                <td>${soc}</td>
              </tr>`;
  logTable.innerHTML = row + logTable.innerHTML;

  
  if (voltage < 3.2) {
    alertBox.textContent = "Warning: Low Voltage!";
    alertBox.style.display = "block";
  } else if (voltage > 4.1) {
    alertBox.textContent = "Warning: High Voltage!";
    alertBox.style.display = "block";
  } else {
    alertBox.style.display = "none";
  }
}
