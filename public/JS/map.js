
const coords = window.coords; // [longitude, latitude]
const title = window.title;

const lat = coords[1];
const lon = coords[0];

const redIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const map = L.map('map').setView([lat, lon], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

L.marker([lat, lon],{ icon: redIcon }).addTo(map)
  .bindPopup(`<h6><b>${title}</b></h6>
     <p> Exact location provided after booking</p>`)
//   .openPopup();
// , { icon: customMarker } 