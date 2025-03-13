// Initialize the proportional symbols map
const map1 = L.map('map1').setView([37.8, -96], 4); // Center on the US

// Add a base tile layer to map1
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map1);

// Function to calculate radius based on population
function getRadius(population) {
  return Math.sqrt(population) * 0.02; // Adjust scaling factor as needed
}

// Load proportional symbols data (cities)
fetch('/data/USA_Major_Cities.geojson') // point data
  .then(response => response.json())
  .then(cityData => {
    L.geoJSON(cityData, {
      pointToLayer: function (feature, latlng) {
        const population = feature.properties.POPULATION;
        return L.circleMarker(latlng, {
          radius: getRadius(population),
          fillColor: "#ff7800",
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });
      },
      onEachFeature: function (feature, layer) {
        const name = feature.properties.NAME;
        const population = feature.properties.POPULATION;
        layer.bindPopup(`<b>${name}</b><br>Population: ${population.toLocaleString()}`);
      }
    }).addTo(map1);
  });

// Initialize the choropleth map
const map2 = L.map('map2').setView([37.8, -96], 4); // Center on the US

// Add a base tile layer to map2
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map2);

// Function to get color based on population for choropleth
function getColor(population) {
  return population > 10000000 ? '#800026' :
         population > 5000000  ? '#BD0026' :
         population > 2000000  ? '#E31A1C' :
         population > 1000000  ? '#FC4E2A' :
         population > 500000   ? '#FD8D3C' :
         population > 200000   ? '#FEB24C' :
         population > 100000   ? '#FED976' :
                                '#FFEDA0';
}

// Load states data 
fetch('/data/states.geojson') //  states polygon data file
  .then(response => response.json())
  .then(stateData => {
    L.geoJSON(stateData, {
      style: function (feature) {
        return {
          fillColor: getColor(feature.properties.POPULATION), // Use POPULATION field
          weight: 2,
          opacity: 1,
          color: 'white',
          fillOpacity: 0.7
        };
      },
      onEachFeature: function (feature, layer) {
        const name = feature.properties.STATE_NAME; // Use STATE_NAME field
        const population = feature.properties.POPULATION; // Use POPULATION field
        layer.bindPopup(`<b>${name}</b><br>Population: ${population.toLocaleString()}`);
      }
    }).addTo(map2);
  });