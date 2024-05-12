/* eslint-disable */
const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    'attribution': 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
});

const map = L.map('example2')
  .setView([51.504789, -0.091624], 15)
  .addLayer(tiles);


map.pm.addControls();

var pmCircle = new L.PMCircle(map);

const m1 = L.circleMarker([51.50313, -0.091223], { radius: 10 });
const m2 = L.marker([51.50614, -0.0989]);
const m3 = L.marker([51.50915, -0.096112]);
const poly = L.polygon([[51.50915, -0.096112],[51.50614, -0.0989],[51.50313, -0.091223]]);
const circle = L.circle([ 51.50227810647,-0.0993],100);

const mGroup = L.layerGroup([m1,m2,m3,poly,circle]).addTo(map);

