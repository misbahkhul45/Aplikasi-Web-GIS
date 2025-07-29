let map = L.map('map').setView([-6.9147, 107.6098], 12); // Bandung

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

let geojsonLayer;
let fasilitasData;

// Fungsi warna marker
function getColor(jenis) {
  switch (jenis) {
    case 'Puskesmas': return 'green';
    case 'Rumah Sakit': return 'blue';
    case 'Klinik': return 'orange';
    default: return 'gray';
  }
}

// Fungsi menggambar marker
function drawMarkers(data, filter = 'all') {
  if (geojsonLayer) geojsonLayer.remove();

  geojsonLayer = L.geoJSON(data, {
    filter: feature => filter === 'all' || feature.properties.jenis === filter,
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: 8,
        fillColor: getColor(feature.properties.jenis),
        color: '#000',
        weight: 1,
        fillOpacity: 0.8
      });
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`<b>${feature.properties.nama}</b><br/>Jenis: ${feature.properties.jenis}`);
    }
  }).addTo(map);
}

// Ambil data GeoJSON
fetch('data/fasilitas_kesehatan.geojson')
  .then(res => res.json())
  .then(data => {
    fasilitasData = data;
    drawMarkers(data);
  });

// Event filter
document.getElementById('filter').addEventListener('change', function () {
  drawMarkers(fasilitasData, this.value);
});
