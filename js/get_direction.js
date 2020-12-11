let map;
let autoCompleteStartPoint;
let autoCompleteEndPoint;
let startCordPoint;
let endCordPoint;
let mapPinLocation = { lat: 16.8409, lng: 96.1735 };
let apiKey = "AIzaSyDgOGbuvuKu-fJmwmzP45Vveq7U4EwLhNk";
let zoomLevel = 0;



$(document).ready(function(){
    $("#btnGetDirection").click(function (e){
        e.preventDefault();

    });

    $("#btnGoToMapApp").click(function(e){
        let startPointValue = $("#txtStartPoint").val();
        let endPointValue = $("#txtEndPoint").val();
        // startCordPoint = "converted lat,lng";
        // endCordPoint = "converted lat, lng";
        console.log(startPointValue);
        startLatLng = ""+startCordPoint.lat+","+startCordPoint.lng+"";
        endLatLng = ""+endCordPoint.lat+","+endCordPoint.lng+"";

        let URLToGo = "http://maps.google.com/?saddr="+startLatLng+"&daddr="+endLatLng;
        console.log(URLToGo);
        window.location=URLToGo;

    });

    $("#btnReset").click(function(e){
        e.preventDefault();
        $("#txtStartPoint").val("");
        $("#txtEndPoint").val("");
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
            //Log full response
            // console.log(response);

            //Formatted address
            let formattedAddress = response.data.results[0].formatted_address;



            geolocation = response.data.results[0].geometry.location;
            console.log(geolocation);


            // document.getElementById('map').innerHTML="";
            setLocation(geolocation);
            startCordPoint = geolocation;
            //setStartMarkerPoint
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
            //Log full response
            // console.log(response);

            //Formatted address
            let formattedAddress = response.data.results[0].formatted_address;



            geolocation = response.data.results[0].geometry.location;
            console.log(geolocation);


            // document.getElementById('map').innerHTML="";
            setLocation(geolocation);
            endCordPoint = geolocation;
            //setStartMarkerPoint
            setZoomLevel(17);
            setShowAddress(formattedAddress);
            initMap();



        }).catch(function(error){
            //Log error
            console.log(error);
        })

    });


});

setLocation(mapPinLocation);
setZoomLevel(12);
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

    var center = this.mapPinLocation;
    var zoom = this.zoomLevel;
    var showAddress = this.showAddress;



    let options = {
        center: center,
        zoom: zoom,
    };

    map = new google.maps.Map(document.getElementById("map"), options);

    let startPointVal = document.getElementById("txtStartPoint");
    let endPointVal = document.getElementById("txtEndPoint");




    autoCompleteStartPoint = new google.maps.places.Autocomplete(startPointVal);
    autoCompleteEndPoint = new google.maps.places.Autocomplete(endPointVal);

    autoCompleteStartPoint.bindTo("bounds", map);
    autoCompleteEndPoint.bindTo("bounds", map);

    autoCompleteStartPoint.setFields(["address_components", "geometry", "icon", "name"]);
    autoCompleteEndPoint.setFields(["address_components", "geometry", "icon", "name"]);



}


