const map = L.map('mapa');
const cirlceRadius = 150;
var circles = new Array();
map.setView([11.0197889, -74.851362], 14);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
let marcador = null;
let polyline = null;
let polyline2 = null;
var Coords_Ts = new Array();

const byplace = document.querySelector('.byplace');
const long = document.getElementById("long");
const lat = document.getElementById("lat");
const time = document.getElementById("time");
const date = document.getElementById("date");
let start = 0
let end = 0

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

document.getElementById("start").addEventListener("change", function() {
    var inicio = this.value;
    start = new Date(inicio).getTime();
})

document.getElementById("stop").addEventListener("change", function() {
    var fin = this.value
    end = new Date(fin).getTime();
    console.log(end)
})

const button = document.getElementById("button");
button.addEventListener("click",function(e){
    e.preventDefault();

    var fechas =[start, end];
    console.log(fechas)
    fetch('/historicos', {
        headers:{
            'Content-type':'application/json'
        },
        method: 'post',
        body: JSON.stringify(fechas)
    }).then(res => res.json())

    getFecha();
})
//el 2

let array = [];

async function getData() {  //This is for real time
    const res = await fetch('/data')
    let json = await res.json()

    const {latitud, longitud, hora, fecha} = json.data[0];
    long.innerHTML=longitud;
    lat.innerHTML=latitud;
    time.innerHTML=hora;
    date.innerHTML=fecha;

    let LatLng = new L.LatLng(latitud, longitud)
    array.push(LatLng);

    if (marcador) marcador.setLatLng(LatLng)
    else marcador = L.marker(LatLng).bindPopup('Usted está aquí').addTo(map)

    if (polyline) {
        polyline.setLatLngs(array)
    }else {
        polyline = L.polyline(array, {color: 'aqua'}).addTo(map)
    }
}

setInterval(getData, 5000);

async function getFecha() {     //This is for history
    const res = await fetch('/request')
    let json = await res.json()

    let datos = json.data;
    console.log("datos: ", datos);
    Coords_Ts = datos;

    var Nvector = [];
    
    for (var i = 0, max = datos.length; i < max; i+=1) {
        Nvector.push([datos[i].latitud,datos[i].longitud]);
    }
     polyline2 = L.polyline(Nvector, {color: 'blue'}).addTo(map)
}

function create_hist_item(object, id) {
    const place_item = document.createElement('div');
    place_item.classList.add('place-item');

        const index = document.createElement('div');
        index.classList.add('index');
        index.innerHTML = id;

        const place_content = document.createElement('div');
        place_content.classList.add('place-item-content');

            const place_coords = document.createElement('div');
            place_coords.classList.add('place-item-coords');
            place_coords.innerHTML = `${object.latitud}, ${object.longitud}`;

            const place_time = document.createElement('div');
            place_time.classList.add('place-item-time');
            place_time.innerHTML = `${object.fecha} : ${object.hora}`;
        place_content.appendChild(place_coords);
        place_content.appendChild(place_time);
    place_item.appendChild(index);
    place_item.appendChild(place_content);

    return place_item;
}