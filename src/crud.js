const { ipcRenderer } = require('electron');

function loadCountries() {
    ipcRenderer.send('read-countries');
}

// create button
document.getElementById('btnCreate').addEventListener('click', (event) => {
    const fileName = document.getElementById('fileName').value;
    const fileContents = document.getElementById('fileContents').value;
    const newCountry = { fileName, fileContents }; 

    ipcRenderer.send('create-country', newCountry);
});

// read button
document.getElementById('btnRead').addEventListener('click', (event) => {
    const fileName = document.getElementById('fileName').value;
    ipcRenderer.send('read-country', fileName);
});

// update button
document.getElementById('btnUpdate').addEventListener('click', () => {
    const fileName = document.getElementById('fileName').value;
    const fileContents = document.getElementById('fileContents').value;
    const updatedCountry = { fileName, fileContents };

    ipcRenderer.send('update-country', updatedCountry);
});

// delete button
document.getElementById('btnDelete').addEventListener('click', () => {
    const fileName = document.getElementById('fileName').value;
    ipcRenderer.send('delete-country', fileName);
});


ipcRenderer.on('countries-read', (event, countries) => {
    const demo1 = document.getElementById('demo1');
    demo1.innerHTML = ''; 
    countries.forEach(country => {
        const div = document.createElement('div');
        div.textContent = `File: ${country.fileName}, Contents: ${country.fileContents}`;
        demo1.appendChild(div);
    });
    alert('Countries loaded successfully!'); 
});

// Listen for country created event
ipcRenderer.on('country-created', (event) => {
    loadCountries();
    alert('Country created successfully!'); // Alert for successful creation
});

// Listen for country updated event (optional if you don't have updates)
ipcRenderer.on('country-updated', (event) => {
    loadCountries();
    alert('Country updated successfully!'); // Alert for successful update
});

// Listen for country deleted event
ipcRenderer.on('country-deleted', (event) => {
    loadCountries();
    alert('Country deleted successfully!'); // Alert for successful deletion
});

// Initial load of countries
loadCountries();
