var addressOne = "";
var addressTwo = "";
var hereAppID = "y6vNNavqmOIg2Qln308m"
var hereAppCode = "3cpZDQ3h70lnf5pf7tlncg"
var hereJsAPIkey = "htn_qGlLDzfKu2uOjQcLE6_82CZyJHHK_VAr9aI-Az4"
var pointsArray = [];
var coord = {};
var platform = new H.service.Platform({
    'apikey': hereJsAPIkey
});

// Obtain the default map types from the platform object:
var defaultLayers = platform.createDefaultLayers();

// Instantiate (and display) a map object:
var map = new H.Map(
    document.getElementById('mapArea'),
    defaultLayers.vector.normal.map,
    {
        zoom: 10,
        center: { lat: 36.174, lng: -86.768 }
    });

//  Find midpoint between two coordinates points

// Define radius function
if (typeof (Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function () {
        return this * Math.PI / 180;
    }
}

// Define degrees function
if (typeof (Number.prototype.toDeg) === "undefined") {
    Number.prototype.toDeg = function () {
        return this * (180 / Math.PI);
    }
}

// Define middle point function
function middlePoint(lat1, lng1, lat2, lng2) {

    // Longitude difference
    var dLng = (lng2 - lng1).toRad();

    // Convert to radians
    lat1 = lat1.toRad();
    lat2 = lat2.toRad();
    lng1 = lng1.toRad();

    var bX = Math.cos(lat2) * Math.cos(dLng);
    var bY = Math.cos(lat2) * Math.sin(dLng);
    var lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + bX) * (Math.cos(lat1) + bX) + bY * bY));
    var lng3 = lng1 + Math.atan2(bY, Math.cos(lat1) + bX);

    // Return result
    return [lng3.toDeg(), lat3.toDeg()];
}

//var midPoint = middlePoint(35.1495, 90.0490, 36.1627, 86.7816);
//document.getElementById("longitude").innerHTML = "Longitude : "+midPoint[0];
//document.getElementById("latitude").innerHTML = "Latitude : "+midPoint[1];
//console.log(middlePoint(35.1495, 90.0490, 36.1627, 86.7816));

function getAddr1(address) {
    //Using Here API call
    var local;
    //console.log("addr with spaces: " + address); 

    // replace all space characters with %20 to build the correct url
    address = address.replace(/ /g, "%20");
    //console.log("addr with no spaces: " + address);

    //Build url for ajax call
    var queryURL = "https://geocoder.api.here.com/6.2/geocode.json?searchtext=" + address + "&app_id=" + hereAppID + "&app_code=" + hereAppCode + "&gen=8";
    //"https://places.api.here.com/places/v1/discover/search?app_id=y6vNNavqmOIg2Qln308m&app_code=3cpZDQ3h70lnf5pf7tlncg&at=36.16785,-86.77816&q=114%20Northcrest%20Commons%20Cir%20Nashville%20TN"
    //console.log("URL: " + queryURL);

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        // capturing .data in a variable did not work but using the raw response did
        // var results = response.data;
        //console.log(JSON.stringify(response));
        console.log("Lat is: " + JSON.stringify(response.Response.View[0].Result[0].Location.NavigationPosition[0].Latitude));
        console.log("Lng is: " + JSON.stringify(response.Response.View[0].Result[0].Location.NavigationPosition[0].Longitude));

        //Return the coordinates object
        pointsArray.push(response.Response.View[0].Result[0].Location.NavigationPosition[0].Latitude);
        pointsArray.push(response.Response.View[0].Result[0].Location.NavigationPosition[0].Longitude);
        console.log("array: " + pointsArray);

        if (pointsArray.length == 4) {
            var midP = middlePoint(pointsArray[0], pointsArray[1], pointsArray[2], pointsArray[3]);
            console.log("mipoint array: " + midP);

            $("#mapArea").empty();
            map = new H.Map(
                document.getElementById('mapArea'),
                defaultLayers.vector.normal.map,
                {
                    zoom: 15,
                    center: { lat: midP[1], lng: midP[0] }
                });

            // Define a variable holding SVG mark-up that defines an icon image:
            var svgMarkup = '<svg width="24" height="24" ' +
                'xmlns="http://www.w3.org/2000/svg">' +
                '<rect stroke="white" fill="#1b468d" x="1" y="1" width="22" ' +
                'height="22" /><text x="12" y="18" font-size="12pt" ' +
                'font-family="Arial" font-weight="bold" text-anchor="middle" ' +
                'fill="white">M</text></svg>';

            // Create an icon, an object holding the latitude and longitude, and a marker:
            var icon = new H.map.Icon(svgMarkup),
                coords = { lat: midP[1], lng: midP[0] },
                marker = new H.map.Marker(coords, { icon: icon });

            // Add the marker to the map and center the map at the location of the marker:
            map.addObject(marker);
            map.setCenter(coords);

            //Reset pointsArray array
            pointsArray = [];
        }

        //local = response.Response.View[0].Result[0].Location.NavigationPosition[0];
        //console.log("coord object in ajax is - " + JSON.stringify(local));

        //coord = local;
        //console.log("cooord object in ajax is - " + JSON.stringify(coord));
        //Why doesn't this work!   
        //return local;
        //return lat;

    });
}

/* function renderMap() {
    var queryURL;

    var midP = middlePoint(pointsArray[0], pointsArray[1], pointsArray[2], pointsArray[3]);

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

};
 */

// console.log("cooord object before call is - " + JSON.stringify(coord)); 
$(document).ready(function () {
    getAddr1("1 University Park Dr. Nashville TN");
    getAddr1("114 Northest Commons Cir Nashville TN");
    //console.log("cooord object is - " + JSON.stringify(coord)); 
});

