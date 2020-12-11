let map;
let autoCompleteStartPoint;
let autoCompleteEndPoint;
let startCordPoint = null;
let endCordPoint = null;
let mapPinLocation = { lat: 16.8409, lng: 96.1735 };
let apiKey = "AIzaSyDgOGbuvuKu-fJmwmzP45Vveq7U4EwLhNk";
let zoomLevel = 0;
let geolocation = {};
let startPointMarker;
let endPointMarker;


let directionService; // for google map direction service
let directionDisplay; // for google map display rendering
let onPointChangeHandler; // for point change handler function


setLocation(mapPinLocation);
setZoomLevel(12);



$(document).ready(function(){
    $("#btnGetDirection").click(function (e){
        e.preventDefault();
        onPointChangeHandler(endCordPoint);
    });

    $("#btnGoToMapApp").click(function(e){

        startLatLng = ""+startCordPoint.lat+","+startCordPoint.lng+"";
        endLatLng = ""+endCordPoint.lat+","+endCordPoint.lng+"";

        let URLToGo = "http://maps.google.com/?saddr="+startLatLng+"&daddr="+endLatLng;
        window.location=URLToGo;

    });

    $("#btnReset").click(function(e){
        e.preventDefault();

        $("#txtStartPoint").val("");
        $("#txtEndPoint").val("");

        document.getElementById("map").innerHTML = "";
        startCordPoint = {};
        endCordPoint = {};
        setLocation({ lat: 16.8409, lng: 96.1735 });
        setZoomLevel(12);
        initMap();

    });

    $("#txtStartPoint").change(function(){
       let startLocation =  $("#txtStartPoint").val();
        axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: startLocation,
                key: apiKey
            }
        }).then(function (response){

            //Formatted address
            let formattedAddress = response.data.results[0].formatted_address;

            geolocation = response.data.results[0].geometry.location;

            setLocation(geolocation);
            startCordPoint = geolocation;

            setZoomLevel(17);
            setShowAddress(formattedAddress);
            initMap();



        }).catch(function(error){
            //Log error
            console.log(error);
        })

    });


    $("#txtEndPoint").change(function(){
        let startLocation =  $("#txtEndPoint").val();
        axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: startLocation,
                key: apiKey
            }
        }).then(function (response){
            let formattedAddress = response.data.results[0].formatted_address;
            geolocation = response.data.results[0].geometry.location;



            setLocation(geolocation);
            endCordPoint = geolocation;


            setZoomLevel(17);
            setShowAddress(formattedAddress);
            initMap();



        }).catch(function(error){
            //Log error
            console.log(error);
        })

    });


});


function setLocation(location){
    this.mapPinLocation = location;
}

function setZoomLevel(zoomLvl){
    this.zoomLevel = zoomLvl;
}

function setShowAddress(address){
    this.showAddress = address;
}




    function initMap() {

    let center = this.mapPinLocation;
    let zoom = this.zoomLevel;


    let options = {
        center: center,
        zoom: zoom,
        disableDoubleClickZoom: true
    };

    map = new google.maps.Map(document.getElementById("map"), options);

    directionService = new google.maps.DirectionsService();
    directionDisplay = new google.maps.DirectionsRenderer();
    let trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);

    directionDisplay.setMap(map);

    onPointChangeHandler = function(varEndCordPoint) {
        // console.log(varEndCordPoint);
        calculateAndDisplayRoute(directionService, directionDisplay, varEndCordPoint);
    }

        function calculateAndDisplayRoute(varDirectionService, varDirectionDisplay, varrEndCordPoint) {
            let startPoint  = document.getElementById("txtStartPoint").value;
            let endPoint = document.getElementById("txtEndPoint").value;
            if(startPoint !== "" && endPoint !== ""){
                varDirectionService.route(
                    {
                        origin: {
                            query: startPoint
                        },
                        destination: {
                          query : endPoint
                        },

                        travelMode: google.maps.TravelMode.DRIVING,
                    },
                    (response, status) => {
                        if (status === "OK") {
                            varDirectionDisplay.setDirections(response);



                        } else {
                            window.alert("Directions request failed due to " + status);
                        }
                    }
                );
            }

        }






    let startPointVal = document.getElementById("txtStartPoint");
    let endPointVal = document.getElementById("txtEndPoint");




    autoCompleteStartPoint = new google.maps.places.Autocomplete(startPointVal);
    autoCompleteEndPoint = new google.maps.places.Autocomplete(endPointVal);

    autoCompleteStartPoint.bindTo("bounds", map);
    autoCompleteEndPoint.bindTo("bounds", map);

    autoCompleteStartPoint.setFields(["address_components", "geometry", "icon", "name"]);
    autoCompleteEndPoint.setFields(["address_components", "geometry", "icon", "name"]);

    if(startCordPoint !== null){
        let props = { coords : {lat: startCordPoint.lat, lng : startCordPoint.lng}};
        addMarker(props);
    }

    if(endCordPoint !== null){
        let props = { coords : {lat: endCordPoint.lat, lng : endCordPoint.lng}, content : "point-B"};
        endPointMarker = addMarker(props);
    }

    google.maps.event.addListener(map, 'dblclick', function (event) {
        if(endPointMarker !== ""){
            endPointMarker.setMap(null);
        }

        endPointMarker = addMarker({ coords: event.latLng, content : "point-B" });
        // console.log(endPointMarker);

        axios.get('https://maps.googleapis.com/maps/api/geocode/json?', {
            params: {
                address: event.latLng,
                key: apiKey
            }
        }).then(function (response){

            if(response.data.results.length > 0){
                document.getElementById("txtEndPoint").value = response.data.results[0].formatted_address;
            }
            else{
                let locationToUpdate =event.latLng;
                endCordPoint = {lat : locationToUpdate.lat(), lng: locationToUpdate.lng()};
                document.getElementById("txtEndPoint").value = endCordPoint.lat+","+endCordPoint.lng;
            }

        }).catch(function(error){
            alert("Error is "+error)
        });



    });

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
                // var infoWindow = new google.maps.InfoWindow({
                //     content: props.content
                // });
                //
                // marker.addListener('click', function () {
                //     infoWindow.open(map, marker);
                // });
                marker.addListener('click', function () {
                    startLatLng = ""+startCordPoint.lat+","+startCordPoint.lng+"";
                    endLatLng = ""+endCordPoint.lat+","+endCordPoint.lng+"";

                    let URLToGo = "http://maps.google.com/?saddr="+startLatLng+"&daddr="+endLatLng;
                    window.location=URLToGo;
                });

            }
            return marker;
        }



}


