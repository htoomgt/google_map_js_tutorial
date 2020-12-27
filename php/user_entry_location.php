<?php
$fileLocation = __DIR__."/../storage/user_entry_geolocation.json";

if(isset($_REQUEST['action']) && $_REQUEST['action'] == 'setLocation'){
    $currentLat = $_POST['lat'];
    $currentLng = $_POST['lng'];






    $contentToPut = [
        "lat" => $currentLat,
        "lng" => $currentLng
    ];



    $jsonContentToPut = json_encode($contentToPut);
    file_put_contents($fileLocation,"");
    file_put_contents($fileLocation,$jsonContentToPut);
    fclose($fileLocation);
    $location = file_get_contents($fileLocation);
    $location = json_decode($location, JSON_UNESCAPED_SLASHES);


    header("Content-Type:application/json; charset:UTF-8;");
    echo json_encode(["status" => "ok", "location" => $location], JSON_PRETTY_PRINT );
}

if(isset($_REQUEST['action']) && $_REQUEST['action'] == 'getLocation'){
    $location = file_get_contents($fileLocation);
    $location = json_decode($location, JSON_UNESCAPED_SLASHES);


    header("Content-Type:application/json; charset:UTF-8;");
    echo json_encode(["status" => "ok", "location" => $location], JSON_PRETTY_PRINT );
}






