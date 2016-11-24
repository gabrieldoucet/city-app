var userCircle = {};
var revealDistance = 150;
var delay = 0;
var markers = [];
var infowindow = new google.maps.InfoWindow();
var latlng = new google.maps.LatLng(55.873979, -4.291680);
var mapOptions = {
  zoom: 16,
  center: latlng,
  mapTypeId: google.maps.MapTypeId.ROADMAP
}
var geocoder = new google.maps.Geocoder(); 
var map = new google.maps.Map(document.getElementById("map"), mapOptions);
var bounds = new google.maps.LatLngBounds();

var locations = [
  {lat: 55.876946, lng:-4.294388, d: 0, title: 'Windows in the West', about: "Location of the famous painting by Glasgow artist Avril Paton.", image: "location0.jpg"},
  {lat: 55.878674, lng: -4.290939, d: 0, title: 'Hidden tunnel', about: 'The old Botanic Gardens station on the now closed Glasgow Central Railway.', image: "location1.jpg"},
  {lat: 55.875014, lng: -4.293316, d: 0, title: 'The Wee Pub', about: 'The smallest bar in Glasgow.', image: "location2.jpg"},
  {lat: 55.875925, lng: -4.291911, d: 0, title: 'De Courcys Arcade', about: 'A hidden cluster of around fifteen curious boutiques, galleries, gift shops, cafés and specialist services.', image: "location3.jpg"},
  {lat: 55.874790, lng: -4.280413, d: 0, title: 'Inn Deep', about: 'An easy to miss bar beside the river Kelvin, near to Kelvinbridge subway station.', image: "location4.jpg"},
  {lat: 55.869565, lng: -4.286043, d: 0, title: 'Kelvingrove Bandstand', about: 'An outdoor entertainment stage set against the green backdrop of Kelvingrove Park, boasting a 2500 capacity and modern facilities .', image: "location5.jpg"},
  {lat: 55.871796, lng: -4.287267, d: 0, title: 'Zoology Museum', about: 'Located in the Graham Kerr Building of Glasgow University, is a show-case for the animal world and highlights its diversity.', image: "location6.jpg"}
];

// Try HTML5 geolocation.
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition( function(position) {
    var fakePosition = {lat: 55.873796, lng: -4.292312};
    var pos = { 
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

  //  pos.lat = fakePosition.lat;
  // pos.lng = fakePosition.lng;
    console.log('current position' , pos);
    map.setCenter(fakePosition);

    userCircle = new google.maps.Circle({
      strokeColor: '#00FF00',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#00FF00',
      fillOpacity: 0.35,
      map: map,
      center: pos,
      radius: 10
    });
    
  //  infoWindow.setPosition(pos);
  //  infoWindow.setContent('Location found.');
    
    // Create the markers for all the locations
    locations.forEach( function(point) {
      createMarker(point, pos);
    });
  }, function() {
    handleLocationError(true, infoWindow, map.getCenter());
  });
} else {
// Browser doesn't support Geolocation
  handleLocationError(false, infoWindow, map.getCenter());
}
    
function success(pos) {
  var crd = {
    lat: pos.coords.latitude,
    lng: pos.coords.longitude
  };
  var minDistance = 100000;
  var closestMarker;
  markers.forEach(function(marker) { 
    if (marker.point.d < minDistance) {
      minDistance = marker.point.d
      closestMarker = marker;
    }
  });

  var distanceToClosest = Math.round(distance(crd, closestMarker.point), 2);
  var paragraph = document.getElementById('debug');
  paragraph.innerHTML = crd.lat + '***' + crd.lng + '***' + distanceToClosest + '\n';
    
  if (distanceToClosest < revealDistance) {
    closestMarker.setVisible(true);
        /*
        var title = document.getElementById('title');
        title.innerHTML = closestMarker.point.title;

        var about = document.getElementById('about');
        about.innerHTML = closestMarker.point.about;

        var image = document.getElementById('picture');
        console.log(image);
        image.setAttribute('src', closestMarker.point.image);
      */
  }

  userCircle.center = crd;

  var box = document.getElementById('box');
  box.style.backgroundColor = colorBox(minDistance);
  userCircle.fillColor = colorBox(minDistance);
  userCircle.strokeColor = colorBox(minDistance);
  console.log('watchPosition' , crd);
}

// Watching position changes
navigator.geolocation.watchPosition(success);
        
/*
function colorBox(d){
    if (d <= 50) {
        color = "#FF0000";
        } else if (d >= 51 && d <= 100){
            color = "#E2001C";
        } else if (d >= 101 && d <= 150){
            color = "#C60038";
        } else if (d >= 151 && d <= 200){
            color = "#AA0055";
        } else if (d >= 201 && d <= 250){
            color = "#8D0071";
        } else if (d >= 251 && d <= 300){
            color = "#71008D";
        } else if (d >= 301 && d <= 350){
            color = "#5500AA";
        } else if (d >= 351 && d <= 400){
            color = "#3800C6";
        } else if (d >= 401 && d <= 450){
            color = "#1C00E2";
    } else {
        color = "#0000FF";
    }
    return color;
}; */

function colorBox(d){
  var maxDistance = 1000;
  var color;
  if (d <= maxDistance / 10) {
    color = "#FF0000";
  } else if (d >= maxDistance / 10 + 0.1 && d <= 2 * maxDistance / 10){
    color = "#E2001C";
  } else if (d >= 2 * maxDistance / 10 + 0.1 && d <= 3 * maxDistance / 10){
    color = "#C60038";
  } else if (d >= 3 * maxDistance / 10 + 0.1 && d <= 4 * maxDistance / 10){
    color = "#AA0055";
  } else if (d >= 4 * maxDistance / 10 + 0.1 && d <= 5 * maxDistance / 10){
    color = "#8D0071";
  } else if (d >= 5 * maxDistance / 10 + 0.1 && d <= 6 * maxDistance / 10){
    color = "#71008D";
  } else if (d >= 6 * maxDistance / 10 + 0.1 && d <= 7 * maxDistance / 10){
    color = "#5500AA";
  } else if (d >= 7 * maxDistance / 10 + 0.1 && d <= 8 * maxDistance / 10){
    color = "#3800C6";
  } else if (d >= 8 * maxDistance / 10 + 0.1 && d <= 9 * maxDistance / 10){
    color = "#1C00E2";
  } else {
    color = "#0000FF";
  }
  return color;
};

function createMarker(point, pos) {
  point.d = distance(point, pos);
  var contentString = 
    '<div id="' + point.d + '" class="info">'
    + point.title
    + '</br>' 
    + point.about
    + '</br>' 
    + '<img src="' + point.image + '">'
    + point.lat 
    + point.lng 
    + '</br>' 
    + point.d
    + colorBox(point.d)
    + '</div>'
    ;
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(point.lat, point.lng),
    map: map,
    point: point
  });
  markers.push(marker);
  marker.setVisible(false);

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(contentString); 
    infowindow.open(map,marker);
  });

  bounds.extend(marker.position);
}
        
function toRadians(x) {
  return (Math.PI / 180 * x);
}
        
function distance(p1, p2) {
  console.log(p1, p2);
  var R = 6371e3; // metres
  var f1 = toRadians(p1.lat);
  var f2 = toRadians(p2.lat);
  var df = toRadians((p2.lat-p1.lat));
  var dl = toRadians((p2.lng-p1.lng));
  var a = Math.sin(df/2) * Math.sin(df/2) +
      Math.cos(f1) * Math.cos(f2) *
      Math.sin(dl/2) * Math.sin(dl/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;

  return d;
}

/* ,
  {lat: 55.8734117, lng:-4.2915252, d: 0, title: 'Windows in the West', about: "About debug1", image: "location0.jpg"},
  {lat: 55.873660, lng:-4.291925  , d: 0, title: 'Windows in the West', about: "About debug2", image: "location0.jpg"}   
  */
    