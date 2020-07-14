//Declarations outside functions//
var APIkey = "GBQWe9SfjWzXrEX2QYvxJV6VkkRFzJ9P";
var city = "";
var search = [];
//END Declarations //


// FUNCTIONS // 

function initMap(lat, lng, targetIndex) {
    var latlng = new google.maps.LatLng(lat, lng);

    var map = new google.maps.Map(document.getElementById(`map${targetIndex}`), {
        zoom: 11,
        center: latlng
    });
    var marker = new google.maps.Marker({
        position: latlng,
        map: map
    });
}

function mapEmbed(index) {
    var queryURL =
        "https://app.ticketmaster.com/discovery/v2/events.json?city=" +
        city +
        "&apikey=" +
        APIkey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        var venue = response._embedded.events[index]._embedded.venues[0];
        var latitude = venue.location.latitude;
        var longitude = venue.location.longitude;
        var lat = parseFloat(latitude);
        var lng = parseFloat(longitude);
        initMap(lat, lng, index);
    });
}

function getEvents() {
    var queryURL =
        "https://app.ticketmaster.com/discovery/v2/events.json?city=" +
        city +
        "&apikey=" +
        APIkey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {


        for (var i = 0; i < response._embedded.events.length; i++) {
            var event = response._embedded.events[i];
            var venue = response._embedded.events[i]._embedded.venues[0];
            var eventCards = $(".event-data");
            var card = $("<div class='event-card row'>");
            var column1 = $("<div class='col s7 center vert'></div>");
            var column2 = $("<div class='col s5 center'></div>");
            card.append(column1);
            card.append(column2);
            column2.append(
                `<div id='map${i}' class='map'>`
            );

            mapEmbed(i);

            var time = event.dates.start.localTime
            time = time.split(':');
            var hours = Number(time[0]);
            var minutes = Number(time[1]);
            var timeValue;

            if (hours > 0 && hours <= 12) {
                timeValue = "" + hours;
            } else if (hours > 12) {
                timeValue = "" + (hours - 12);
            } else if (hours == 0) {
                timeValue = "12";
            }

            timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;

            timeValue += (hours >= 12) ? " P.M." : " A.M.";

            var date = event.dates.start.localDate
                .split("-")
                .reverse()
                .join("-");

            var eventNameEl = $("<h2 class='event-title'>" + event.name + "</h2>");
            var eventDateEl = $("<div class='date-info'>" + date + " at: " + timeValue + "</div>");
            var venueNameEl = $("<div class='venue-info'>" + "Venue: " + venue.name + "</div>");
            var eventUrlEl = $("<a class='tickets' target='_blank' href=" + event.url + ">Buy Ticket</a>");

            column1.append(eventNameEl);
            column1.append(eventDateEl);
            column1.append(venueNameEl);
            column1.append(eventUrlEl);
            eventCards.append(card);

        }
    });
}

function previousSearch() {
    var location = document.getElementById("get-city").value;

    var searchInfo = {
        cities: location
    };

    search.push(searchInfo);

    localStorage.setItem("search", JSON.stringify(search));

    document.getElementById('search').textContent = "";

    var oList = document.createElement("ol");
    for (i = 0; i < search.length; i++) {
        var list = document.createElement("li");
        list.textContent = search[i].cities;
        oList.appendChild(list);
        document.getElementById('search').appendChild(oList);
    };

}


// END FUNCTIONS // 

$(".btn").on("click", function() {
    $(".search-area").removeClass();
    $(".search-area").addClass("btn-results");
    var caContent = $("#get-city");

    $(".event-data").empty();
    var letsGo = caContent.val();
    city = letsGo;
    getEvents();
    previousSearch();
    0
});