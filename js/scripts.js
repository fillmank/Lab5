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

// Function to create a legend
function createLegend(map, title, colors, labels) {
  const legend = L.control({ position: 'bottomright' });
  legend.onAdd = function () {
    const div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = `<strong>${title}</strong><br>`;
    colors.forEach((color, i) => {
      div.innerHTML +=
        `<i style="background:${color}"></i> ${labels[i]}<br>`;
    });
    return div;
  };
  legend.addTo(map);
}

// Load proportional symbols data (cities)
fetch('data/USA_Major_Cities.geojson') // point data
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

    // Add legend for proportional symbols map (if needed)
    createLegend(map1, 'Population', ['#ff7800'], ['City Population']);
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
fetch('data/states.geojson') //  states polygon data file
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

    // Add legend for choropleth map
    createLegend(map2, 'Population', ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026', '#800026'], ['0-100k', '100k-200k', '200k-500k', '500k-1M', '1M-2M', '2M-5M', '5M-10M', '10M+']);
  });