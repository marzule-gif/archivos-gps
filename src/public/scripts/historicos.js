const map = L.map('mapa');
const cirlceRadius = 150;
var circles = new Array();
map.setView([11.0197889, -74.851362], 14);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
let marcador = null;
let polyline = null;
let polyline2 = null;
var Coords_Ts = new Array();

let array = [];
var vector1 = new Array();
var vector2 = new Array();

const checker1 = document.getElementById('vehicle1');
const checker2 = document.getElementById('vehicle2');

polyline2 = new Array();
polyline3 = new Array();

const realtime_btn = document.querySelector('.realtime');
const byplace = document.querySelector('.byplace');
let start = 0
let end = 0

realtime_btn.addEventListener('click', function(e){
    e.preventDefault();
    window.location.replace('/');
});

checker1.addEventListener('change', function(e) {
    e.preventDefault();

    if(polyline2.length > 0) {
        map.removeLayer(polyline2[0]);
        polyline2 = [];
    }

    if(polyline3.length > 0) {
        map.removeLayer(polyline3[0]);
        polyline3 = [];
    }

    if(this.checked) {
        polyline2.push(L.polyline(vector1, {color: 'blue'}).addTo(map));
    }
    if(checker2.checked) {
        polyline3.push(L.polyline(vector2, {color: 'red'}).addTo(map));
    }
});

checker2.addEventListener('change', function(e) {
    e.preventDefault();

    if(polyline2.length > 0) {
        map.removeLayer(polyline2[0]);
        polyline2 = [];
    }

    if(polyline3.length > 0) {
        map.removeLayer(polyline3[0]);
        polyline3 = [];
    }


    if(this.checked) {
        polyline3.push(L.polyline(vector2, {color: 'red'}).addTo(map));
    }
    if(checker1.checked) {
        polyline2.push(L.polyline(vector1, {color: 'blue'}).addTo(map));
    }
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

document.getElementById("start").addEventListener("change", function() {
    var inicio = this.value;
    start = new Date(inicio).getTime();
    document.getElementById("stop").min = this.value
})


document.getElementById("stop").addEventListener("change", function() {
    var fin = this.value
    end = new Date(fin).getTime();
    document.getElementById("start").max = this.value
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




async function getFecha() {     //This is for history
    const res = await fetch('/request')
    let json = await res.json()

    let datos = json.data;
    console.log("datos: ", datos);
    Coords_Ts = datos;
    vector1 = [];
    vector2 = [];
    if(polyline2.length > 0) {
        map.removeLayer(polyline2[0]);
    }
    if(polyline3.length > 0) {
        map.removeLayer(polyline3[0]);
    }
    polyline2 = [];
    polyline3 = [];
    
    for (var i = 0, max = datos.length; i < max; i+=1) {
        if(datos[i].idTaxi == 'DEF456') {
            vector1.push([datos[i].latitud,datos[i].longitud]);
        }
        if(datos[i].idTaxi == 'ABC123') {
            vector2.push([datos[i].latitud,datos[i].longitud]);
        }
    }
    if(checker1.checked) {
        polyline2.push(L.polyline(vector1, {color: 'blue'}).addTo(map));
    }
    if(checker2.checked) {
        polyline3.push(L.polyline(vector2, {color: 'red'}).addTo(map));
    }
}

function create_hist_item(object, id) {
    const place_item = document.createElement('div');
    place_item.classList.add('place-item');

        const index = document.createElement('div');
        index.classList.add('index');
        index.innerHTML = object.idTaxi;

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

        const x_shower = document.createElement('div');
        x_shower.className = 'x-shower';
        x_shower.innerHTML = object.distancia;
    place_item.appendChild(index);
    place_item.appendChild(place_content);
    place_item.appendChild(x_shower);

    return place_item;
}