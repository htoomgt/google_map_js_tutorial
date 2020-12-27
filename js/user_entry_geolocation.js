let mapPinLocation;
let zoomLevel;
let getCurrentLocation;
let currentLocation;
let currentLocationMarker;
let map;
let markers = [];

setLocation({ lat: 16.8409, lng: 96.1735 });
setZoomLevel(15);

function initMap(){
    let center = this.mapPinLocation;
    let zoom = this.zoomLevel;
    let txtUserLocation = document.getElementById("txt_user_location");
    let jsonCurrentLat = document.getElementById("json_current_lat");
    let jsonCurrentLng = document.getElementById("json_current_lng");


    let options = {
        center : center,
        zoom : zoom,
        draggable: true,
        // mapTypeId: google.maps.MapTypeId.HYBRID // satellite and map view
    }
    map = new google.maps.Map(document.getElementById('map'), options);

    const autocomplete = new google.maps.places.Autocomplete(txtUserLocation);
    // bounds option in the request.
    autocomplete.bindTo("bounds", map);

    // Set the data fields to return when the user selects a place.
    autocomplete.setFields(["address_components", "geometry", "icon", "name"]);

    //
    autocomplete.addListener("place_changed", () => {
        // infowindow.close();
        currentLocationMarker.setVisible(false);
        const place = autocomplete.getPlace();

        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17); // Why 17? Because it looks good.
        }
        console.log(place.geometry.location.lat());
        document.getElementById("json_current_lat").value =place.geometry.location.lat();
        document.getElementById("json_current_lng").value = place.geometry.location.lng();
        currentLocationMarker.setPosition(place.geometry.location);
        currentLocationMarker.setVisible(true);
        let address = "";

        if (place.address_components) {
            address = [
                (place.address_components[0] &&
                    place.address_components[0].short_name) ||
                "",
                (place.address_components[1] &&
                    place.address_components[1].short_name) ||
                "",
                (place.address_components[2] &&
                    place.address_components[2].short_name) ||
                "",
            ].join(" ");
        }
        // infowindowContent.children["place-icon"].src = place.icon;
        // infowindowContent.children["place-name"].textContent = place.name;
        // infowindowContent.children["place-address"].textContent = address;
        // infowindow.open(map, marker);
    });








    //get current location and map settings
    getCurrentLocation = () => {
        if(currentLocationMarker){
            currentLocationMarker.setMap(null);
        }

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
                    map.setZoom(19);


                },
                ()=> {
                    handleLocationError(true, txtUserLocation, map.getCenter());
                }
            )
        }
    }
    getCurrentLocation();

    if(currentLocationMarker){
        google.maps.event.addListener(currentLocationMarker, 'dragend', function () {
            map.setCenter(this.getPosition()); // Set map center to marker position
            let posStr = this.getCenter().lat() + "," + this.getCenter().lng();
            console.log(posStr);
            txtUserLocation.value = posStr;
            // updatePosition(this.getPosition().lat(), this.getPosition().lng()); // update position display
        });
    }

    google.maps.event.addListener(map, 'dragend', function () {
        currentLocationMarker.setPosition(this.getCenter()); // set marker position to map center
        let posStr = this.getCenter().lat() + "," + this.getCenter().lng();
        // txtUserLocation.value = posStr;
        let updatedLocation = {lat : this.getCenter().lat(), lng: this.getCenter().lng()};
        // setCurrentLocation(updatedLocation);
        document.getElementById("json_current_lat").value = updatedLocation.lat;
        document.getElementById("json_current_lng").value = updatedLocation.lng;

        // setLocation(updatedLocation);
        // updatePosition(this.getCenter().lat(), this.getCenter().lng()); // update position display
    });

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

    function clearMarkers() {
        setMapOnAll(null);
    }





}


function setLocation(location){
    this.mapPinLocation = location;
}

function setCurrentLocation(location){
    this.currentLocation = location;
    console.log(this.currentLocation);
}

function setZoomLevel(zoomLvl){
    this.zoomLevel = zoomLvl;
}

$(document).ready(function(){
     $("#get_current_location").click(function(){
         getCurrentLocation();

     });

     $("#txt_user_location").click(function(){

        $(this).val("");
     });

     $("#btnSaveLocation").click(function(){
         let currentLat = $("#json_current_lat").val();
         let currentLng = $("#json_current_lng").val();
         currentLocation = { lat : currentLat, lng : currentLng};
         setLocation(currentLocation);
         console.log(currentLocation);

         // let defaultLocation = require('../storage/user_entry_geolocation.json');
         // console.log(defaultLocation);
         let currentURL = window.location.href;
         let currentHostSegment = currentURL.replace("user_entry_geolocation.html?#", "");
         let phpSetUserLocationURL = currentHostSegment + "php/user_entry_location.php?action=setLocation";
         // console.log(phpSetUserLocationURL); exit;
        // console.log(this.currentLocation);
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