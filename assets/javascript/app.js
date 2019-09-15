var addressOne = "";
var addressTwo = "";

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

function getLatLong(address) {
    //Using Here API call
    var hereAppID = "y6vNNavqmOIg2Qln308m"
    var hereAppCode = "3cpZDQ3h70lnf5pf7tlncg"
    var local = {};
    //console.log("addr with spaces: " + address); 
    
    // replace all space characters with %20 to build the correct url
    address = address.replace(/ /g, "%20");
    //console.log("addr with no spaces: " + address);

    //Build url for ajax call
    var queryURL = "https://geocoder.api.here.com/6.2/geocode.json?searchtext=" + address + "&app_id=" + hereAppID + "&app_code=" + hereAppCode + "&gen=8";
    //"https://places.api.here.com/places/v1/discover/search?app_id=y6vNNavqmOIg2Qln308m&app_code=3cpZDQ3h70lnf5pf7tlncg&at=36.16785,-86.77816&q=114%20Northcrest%20Commons%20Cir%20Nashville%20TN"
    console.log("URL: " + queryURL);

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
        var lat = response.Response.View[0].Result[0].Location.NavigationPosition[0].Latitude;
        var lng = response.Response.View[0].Result[0].Location.NavigationPosition[0].Longitude;

        local = response.Response.View[0].Result[0].Location.NavigationPosition[0];
        console.log("local object is - " + JSON.stringify(local));
        return local;

      });

    //   function sleep( millisecondsToWait ) {
    //     var now = new Date().getTime();
        
    //     while ( new Date().getTime() < now + millisecondsToWait ) {
    //     /* do nothing; this will exit once it reaches the time limit */
    //     /* if you want you could do something and exit */
    //     }
    //   }
    //   sleep(1000);
      //return local;
}

var coord = getLatLong("1 University Park Dr. Nashville TN");
console.log("cooord object lat is - " + JSON.stringify(coord));