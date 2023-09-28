/* eslint-disable */

const locations = JSON.parse(document.getElementById('map').dataset.locations);

const map = L.map('map').setView([31.111745, -118.113491], 5);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap',
}).addTo(map);

const markerArray = [];

locations.forEach((loc) => {
  const reversedArr = [...loc.coordinates].reverse();

  const myIcon = L.icon({
    iconUrl: './../img/pin.png',
    iconSize: [40, 50], // 30, 35 50, 60
    iconAnchor: [15, 35],
  });

  L.marker(reversedArr, { icon: myIcon })
    .bindPopup(
      `<p class="paragraph-popup">Day ${loc.day}: ${loc.description}</p>`,
    )
    .openPopup()
    .addTo(map);

  markerArray.push(reversedArr);
});

const bounds = L.latLngBounds(markerArray);
map.fitBounds(bounds);
