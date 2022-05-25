const map = L.map('mapa');
const cirlceRadius = 150;
var circles = new Array();
map.setView([11.0197889, -74.851362], 14);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
let marcador = null;
let polyline = null;
let polyline2 = null;
let LatLng = [];
let vehicles = {};
let polylines = {};
let markers = {};
var Coords_Ts = new Array();

var marcadores = new Array();
var polilineas = new Array();

var greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
var blueIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const hist_btn = document.querySelector('.hist');
const byplace = document.querySelector('.byplace');
const long = document.getElementById("long");
const lat = document.getElementById("lat");
const time = document.getElementById("time");
const date = document.getElementById("date");
const distance = document.getElementById('distance');
const long2 = document.getElementById("long2");
const lat2 = document.getElementById("lat2");
const time2 = document.getElementById("time2");
const date2 = document.getElementById("date2");
const id2 = document.getElementById("id2");
const vehiculo1 = document.querySelector('#vehicle1');
const vehiculo2 = document.querySelector('#vehicle2');

let start = 0
let end = 0

hist_btn.addEventListener('click', function (e) {
    e.preventDefault();
    window.location.replace('/historicos');
});

let array = [];

vehiculo1.addEventListener('change', function () {
    if (this.checked) {
        try {
            clearInterval(getDataLoop)
        } catch (error) {

        }
        getDataLoop = setInterval(() => getData("ABC123"), 1000);
    } else {
        clearInterval(getDataLoop)
    }
})

vehiculo2.addEventListener('change', function () {
    if (this.checked) {
        try {
            clearInterval(getDataLoop2)
        } catch (error) {

        }
        getDataLoop2 = setInterval(() => getData("DEF456"), 1000)
    } else {
        clearInterval(getDataLoop2);
    }
})

var execute = false;

async function getData(id) {

    const res = await fetch(`/data?id=${id}`)
    let json = await res.json()

    const { latitud, longitud, hora, fecha, distancia, idTaxi } = json.data[0];
    if (idTaxi == "ABC123") {
        if (distancia)
            distance.innerHTML = distancia + "cm";
        else distance.innerHTML = "No data";
        long.innerHTML = longitud;
        lat.innerHTML = latitud;
        time.innerHTML = hora;
        date.innerHTML = fecha;
    } else {
        long2.innerHTML = longitud;
        lat2.innerHTML = latitud;
        time2.innerHTML = hora;
        date2.innerHTML = fecha;

    }

    let LatLng = new L.LatLng(latitud, longitud)

    if (!vehicles[idTaxi]) {
        vehicles[idTaxi] = {};
    }

    if (vehicles[idTaxi].LatLngs) {
        vehicles[idTaxi].LatLngs.push(LatLng)
    } else {
        vehicles[idTaxi].LatLngs = [LatLng];
    }



    let color = {"ABC123":"orange","DEF456":"#EA5455"}
    let markercolor={"ABC123": greenIcon,"DEF456": blueIcon}

    if (vehicles[idTaxi].marcador) vehicles[idTaxi].marcador.setLatLng(LatLng)
    else vehicles[idTaxi].marcador = L.marker(LatLng, { icon: markercolor[idTaxi] }).bindPopup(idTaxi).addTo(map)

    if (vehicles[idTaxi].polyline) {
        vehicles[idTaxi].polyline.setLatLngs(vehicles[idTaxi].LatLngs)
    } else {
        vehicles[idTaxi].polyline = L.polyline(vehicles[idTaxi].LatLngs, { color: color[idTaxi]}).addTo(map)
    }

}



