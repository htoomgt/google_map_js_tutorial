let map;
let apiKey = "AIzaSyDgOGbuvuKu-fJmwmzP45Vveq7U4EwLhNk";
let defaultLocation = "Yangon Zoo";
let mapPinLocation = {};
let zoomLevel = 0;

//set default coordinate
setLocation({ lat: 16.858486, lng: 96.166710 });

//set default zoom level
setZoomLevel(14);

//Get location form
let locationForm = document.getElementById("location-form");

//Listent for submit
locationForm.addEventListener('submit', geocode);




function initMap() {
    var center = this.mapPinLocation;
    var zoom = this.zoomLevel;


    let options = {
        center: center,
        zoom: zoom,
    };
    map = new google.maps.Map(document.getElementById('map'), options);

    //Add Marker Funciton
    function addMarker(props) {

        var marker = new google.maps.Marker({
            position: props.coords,
            map: map,


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
            var infoWindow = new google.maps.InfoWindow({
                content: props.content
            });

            marker.addListener('click', function () {
                infoWindow.open(map, marker);
            });
        }
        return marker;
    }

    addMarker({ coords: center, label: "A1", content: "<p> North Ooakalapa Golf Club" });

    //To fit zoom all coordinates
    /*var latlngBounds =  new google.maps.LatLngBounds();
    latlngBounds.extend(center);
    map.fitBounds(latlngBounds);*/









}

function setLocation(location){
    this.mapPinLocation = location;
}

function setZoomLevel(zoomLvl){
    this.zoomLevel = zoomLvl;
}



function geocode(e){
    e.preventDefault();
    var location = document.getElementById("location-input").value;

    axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
            address: location,
            key: apiKey
        }
    }).then(function (response){
        //Log full response
        // console.log(response);

        //Formatted address
        var formattedAddress = response.data.results[0].formatted_address;
        var formattedAddressOutput = `
            <ul class='list-group'>
                <li class="list-group-item">${formattedAddress}</li>
            </ul>
        `;
        document.getElementById('formattedAddress').innerHTML = formattedAddressOutput;

        // Address Components
        var addressComponents = response.data.results[0].address_components;
        var addressComponentOutput = `<ul class="list-group">`;
        for(var i = 0; i < addressComponents.length; i++){
            addressComponentOutput += `
                <li class="list-group-item"> <strong> ${addressComponents[i].types[0]}</strong> : ${addressComponents[i].long_name} </li>
            `;
        }
        addressComponentOutput += `</ul>`;
        document.getElementById('addressComponents').innerHTML = addressComponentOutput;



        geolocation = response.data.results[0].geometry.location;
        var lat = geolocation.lat;
        var lng = geolocation.lng;
        // console.log(geolocation);
        // addMarker({coords : geolocation});
        var geometryOutput = `
                <ul class="list-group"> 
                    <li class="list-group-item"><strong> Latitude </strong> : ${lat}</li>
                    <li class="list-group-item"><strong> Longitude </strong> : ${lng}</li>
                </ul>
            `;
        document.getElementById('geoLocation').innerHTML = geometryOutput;

        document.getElementById('map').innerHTML="";
        setLocation(geolocation);
        setZoomLevel(17);
        initMap();



    }).catch(function(error){
        //Log error
        console.log(error);
    })


}



