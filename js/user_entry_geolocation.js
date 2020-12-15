let mapPinLocation;
let zoomLevel;
let getCurrentLocation;
let currentLocation;
let currentLocationMarker;
let map;
let markers = [];

setLocation({ lat: 16.8409, lng: 96.1735 });
setZoomLevel(12);

function initMap(){
    let center = this.mapPinLocation;
    let zoom = this.zoomLevel;
    let txtUserLocation = document.getElementById("txt_user_location");
    let jsonCurrentLat = document.getElementById("json_current_lat");
    let jsonCurrentLng = document.getElementById("json_current_lng");


    let options = {
        center : center,
        zoom : zoom,
    }
    map = new google.maps.Map(document.getElementById('map'), options);


    //get current location and map settings
    getCurrentLocation = () => {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
                (position )=> {
                    let pos = {
                        lat : position.coords.latitude,
                        lng : position.coords.longitude,
                    };
                    // setCurrentLocation(pos);
                    // setLocation(pos);
                    currentLocation = pos;
                    let posStr = pos.lat + "," + pos.lng;
                    txtUserLocation.value = posStr;
                    currentLocationMarker = addMarker({coords : currentLocation, label : "Current Position"});
                    jsonCurrentLat.value = position.coords.latitude;
                    jsonCurrentLng.value = position.coords.longitude;

                    map.setCenter(currentLocation);
                    map.setZoom(17)


                },
                ()=> {
                    handleLocationError(true, txtUserLocation, map.getCenter());
                }
            )
        }
    }

    function addMarker(props) {

        var marker = new google.maps.Marker({
            position: props.coords,
            map: map,
            draggable:true

        });

        //Check if lablel
        if (props.label) {
            marker.setLabel(props.label);
        }

        //Check if for custom
        if (props.icon) {
            //set icon
            marker.setIcon(props.icon);
        }

        //Check content
        if (props.content) {
            marker.addListener('click', function () {
                //added marker listener event

            });

        }
        markers.push(marker);
        return marker;
    }





}


function setLocation(location){
    this.mapPinLocation = location;
}

function setCurrentLocation(location){
    this.currentLocation = location;
}

function setZoomLevel(zoomLvl){
    this.zoomLevel = zoomLvl;
}

$(document).ready(function(){
     $("#get_current_location").click(function(){
         getCurrentLocation();

     });

     $("#btnSaveLocation").click(function(){
         let currentLat = $("#json_current_lat").val();
         let currentLng = $("#json_current_lng").val();
         currentLocation = { lat : currentLat, lng : currentLng};
         setLocation(currentLocation);
         // console.log(currentLocation);

         // let defaultLocation = require('../storage/user_entry_geolocation.json');
         // console.log(defaultLocation);
         let currentURL = window.location.href;
         let currentHostSegment = currentURL.replace("user_entry_geolocation.html?#", "");
         let phpSetUserLocationURL = currentHostSegment + "php/user_entry_location.php?action=setLocation";
         // console.log(phpSetUserLocationURL);

         $.ajax({
             url : phpSetUserLocationURL,
             method : 'POST',
             header : "Content-Type: application/json",
             data : currentLocation,
             success : function(res){
                 console.log(res);
             },
             error : function(res){
                 console.log(res);
             }
         })


     });
});