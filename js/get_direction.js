$(document).ready(function(){

});

let map;
function initMap() {
    let options = {
        center: { lat: 16.8409, lng: 96.1735 },
        zoom: 12
    }

    map = new google.maps.Map(document.getElementById("map"), options);
    // console.log(map);



}
