const { app, BrowserWindow } = require('electron');
const path = require('path');


if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });


  mainWindow.loadFile(path.join(__dirname, 'index.html'));


  mainWindow.webContents.openDevTools();
};


app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


function buttonClicked() {    
    const country = document.getElementById("country_input").value;

    if (!country) {
        document.getElementById("demo1").innerHTML = "Please enter a country name.";
        document.getElementById("demo2").innerHTML = "";
        return;
    }

    fetch('https://restcountries.com/v3.1/all')
        .then((response) => response.json())
        .then((data) => {
            const countryData = data.find(c => c.name.common.toLowerCase() === country.toLowerCase());

            if (countryData) {
                const languages = countryData.languages ? Object.values(countryData.languages).join(", ") : "N/A";
                const timezones = countryData.timezones ? countryData.timezones.join(", ") : "N/A";
                const region = countryData.region || "N/A";
                const subregion = countryData.subregion || "N/A";
                const area = countryData.area ? `${countryData.area.toLocaleString()} km²` : "N/A";
                const population = countryData.population ? countryData.population.toLocaleString() : "N/A";
                const capital = countryData.capital ? countryData.capital[0] : "N/A";
                
                document.getElementById("demo1").innerHTML = `
                    <strong>Country:</strong> ${countryData.name.common} <br>
                    <strong>Continent:</strong> ${region} <br>
                    <strong>Region:</strong> ${subregion} <br>
                    <strong>Capital:</strong> ${capital} <br>
                    <strong>Languages:</strong> ${languages} <br>
                    <strong>Timezone(s):</strong> ${timezones} <br>
                    <strong>Area:</strong> ${area} <br>
                    <strong>Population:</strong> ${population}
                `;

                document.getElementById("demo2").innerHTML = `
                    <img src="${countryData.flags.svg}" alt="Flag of ${countryData.name.common}" width="100">
                    <img src="${countryData.coatOfArms && countryData.coatOfArms.svg ? countryData.coatOfArms.svg : ''}" alt="Coat of Arms" width="100"><br>
                    <a href="https://www.google.com/maps/search/?api=1&query=${countryData.latlng[0]},${countryData.latlng[1]}" target="_blank">
                        View on Map
                    </a>
                `;
            } else {
                document.getElementById("demo1").innerHTML = "Country not found. Please try again.";
                document.getElementById("demo2").innerHTML = "";
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            document.getElementById("demo1").innerHTML = "An error occurred while fetching data. Please try again later.";
            document.getElementById("demo2").innerHTML = "";
        });
}


window.buttonClicked = buttonClicked;

document.getElementById("yourButtonID").addEventListener("click", buttonClicked);
