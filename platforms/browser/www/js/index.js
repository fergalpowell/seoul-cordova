var map = L.map('map', { zoomControl:true }).setView([37.543787, 126.990226], 12);

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18
}).addTo(map);

markerClusters = L.markerClusterGroup();

var locations_list = [];


$.ajax({
    type: "GET",
    crossDomain: true,
    dataType: "json",
    url: 'http://fergalpowell.pythonanywhere.com/attractions/', success: function(data){
    new L.GeoJSON(data, {
        onEachFeature: function (feature) {
            var m = L.marker(feature.geometry.coordinates).bindPopup(feature.properties);
            markerClusters.addLayer(m);
            locations_list.push([feature.properties,feature.geometry.coordinates]);
        }
    });
    map.addLayer( markerClusters );
    LocationTable();
}});



function LocationTable(){
    for (var i = 0; i < locations_list.length; i++){
        let list_item = document.createElement('li');
        list_item.classList.add('list-group-item');
        list_item.style.maxHeight = 'calc(184px + 1.5em)';
        let image = document.createElement('img');
        list_item.appendChild(image);
        image.src = '../img/gyeongbokung.jpeg';
        list_item.innerHTML = list_item.innerHTML + String(i + 1) + ") " + locations_list[i][0];
        var button = document.createElement('button');
        button.className = "btn btn-primary";
        button.innerHTML = "View";
        let index = i;
        button.onclick = function(){ShowAttraction(index)};
        list_item.appendChild(button);
        document.getElementById('attractions').appendChild(list_item);
    }
}

function ShowAttraction(index){
    map.setView([locations_list[index][1][0],
        locations_list[index][1][1]], 17);
    markerClusters.eachLayer(function(layer){
        if(layer._latlng.lat == locations_list[index][1][0] && layer._latlng.lon == locations_list[index][1][1]){
            console.log(layer.getAllChildMarkers());
        }
    });
}

function Locate(){
    map.locate({setView: true, maxZoom: 13});
    map.on('locationfound', onLocationFound);
}

function onLocationFound(e){
    new L.marker(e.latlng, {
            draggable: false,
        }).bindPopup("You are here!")
        .addTo(map);
}


function openNav() {
    document.getElementById("mySidenav").style.width = "80%";
    let els = document.getElementsByClassName('content');
    for(let i = 0; i < els.length; i++){
        document.getElementById('nav').classList.add("opaque-content");
        els[i].classList.add("opaque-content");
    }
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    let els = document.getElementsByClassName('content');
    for(let i = 0; i < els.length; i++){
        document.getElementById('nav').classList.remove("opaque-content");
        els[i].classList.remove("opaque-content");
    }
}