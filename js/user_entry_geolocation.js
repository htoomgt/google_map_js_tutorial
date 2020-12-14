let mapPinLocation;
let zoomLevel;
let getCurrentLocation;
let map;

setLocation({ lat: 16.8409, lng: 96.1735 });
setZoomLevel(12);

function initMap(){
    let center = this.mapPinLocation;
    let zoom = this.zoomLevel;

    let options = {
        center : center,
        zoom : zoom,
    }
    map = new google.maps.Map(document.getElementById('map'), options);

    getCurrentLocation = () => {
        alert("Hello this is your location");
    }

}


function setLocation(location){
    this.mapPinLocation = location;
}

function setZoomLevel(zoomLvl){
    this.zoomLevel = zoomLvl;
}

$(document).ready(function(){
     $("#get_current_location").click(getCurrentLocation);
});