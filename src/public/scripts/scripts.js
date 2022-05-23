const map = L.map('mapa');
const cirlceRadius = 150;
var circles = new Array();
map.setView([11.0197889, -74.851362], 14);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
let marcador = null;
let polyline = null;
let polyline2 = null;
var Coords_Ts = new Array();

var marcadores = new Array();
var polilineas = new Array();

const hist_btn = document.querySelector('.hist');
const byplace = document.querySelector('.byplace');
const long = document.getElementById("long");
const lat = document.getElementById("lat");
const time = document.getElementById("time");
const date = document.getElementById("date");
const distancia = document.getElementById('distancia');
const vehiculo1 = document.getElementById('vehicle1');
const vehiculo2 = document.getElementById('vehicle2');

const long2 = document.getElementById("long2");
const lat2 = document.getElementById("lat2");
const time2 = document.getElementById("time2");
const date2 = document.getElementById("date2");
const distancia2 = document.getElementById('distancia2');

let start = 0
let end = 0

hist_btn.addEventListener('click', function(e){
    e.preventDefault();
    window.location.replace('/historicos');
});

map.on('click', function(e){
    byplace.innerHTML = null;

    for(var item of circles){
        map.removeLayer(item);
    }
    const coord = [e.latlng.lat, e.latlng.lng];
    const circle = L.circle(coord, {radius: cirlceRadius}).addTo(map);
    circles.push(circle);

    const centerPoint = circle.getLatLng();
    var into = new Array();
    for(var N of Coords_Ts){
        const point = [N.latitud, N.longitud];
        if(Math.abs(centerPoint.distanceTo(point) <= cirlceRadius)){
            into.push(N);
        }
    }

    console.log(into);
    var cont = 0;
    for(var place of into){
        const item = create_hist_item(place, cont);
        byplace.appendChild(item);
        cont++;
    }
});

let array = [];

async function getData() {  //This is for real time
    const res = await fetch('/data')
    let json = await res.json()
    console.log(json.length)

    for(var i=0; i<json.length; i++) {
        const {latitud, longitud, hora, fecha, idTaxi, distancia} = json[i];

        let LatLng = [latitud, longitud];
        var found = false;

        for(var row of array) {
            if(row[0] == idTaxi) {
                found = true;
                row[1].push(LatLng);
                row[2] = {fecha, hora, distancia}
                break;
            }
        }
        if(!found) {
            array.push([idTaxi, [LatLng], {fecha, hora, distancia}])
        }
    }
    
    console.log(array)

    deleteLayers();
    for(var row of array) {
        // Aquí va una verificacion de qué check está activo.
        console.log(vehiculo1.checked)
        if(vehiculo1.checked && row[0] == 'DEF456') {
            console.log(row[1])
            const polyline = L.polyline(row[1], {color: 'aqua'}).addTo(map)
            polilineas.push(polyline);
            const marcador = L.marker(row[1][row[1].length - 1]).bindPopup('Usted está aquí').addTo(map)
            marcadores.push(marcador)

            lat.innerHTML = row[1][row[1].length - 1][0]
            long.innerHTML = row[1][row[1].length - 1][1]
            date.innerHTML = row[2].fecha;
            time.innerHTML = row[2].hora;
            distancia.innerHTML = row[2].distancia;
        }

        if(vehiculo2.checked && row[0] == 'ABC123') {
            console.log("vehiculo 2")
            const polyline = L.polyline(row[1], {color: 'aqua'}).addTo(map)
            polilineas.push(polyline);
            const marcador = L.marker(row[1][row[1].length - 1]).bindPopup('Usted está aquí').addTo(map)
            marcadores.push(marcador)

            lat2.innerHTML = row[1][row[1].length - 1][0]
            long2.innerHTML = row[1][row[1].length - 1][1]
            date2.innerHTML = row[2].fecha;
            time2.innerHTML = row[2].hora;
            distancia2.innerHTML = row[2].distancia;
        }    
        // Aquí termina la verificación. O sea, es un if.
    }
}

getData();
setInterval(getData, 5000);

function deleteLayers() {
    for(var poly of polilineas) {
        map.removeLayer(poly)
    }

    for(var marker of marcadores) {
        map.removeLayer(marker)
    }
}