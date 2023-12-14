const gmaps_script = document.getElementById("gmaps-script");
gmaps_script.remove();

const ZOOM_LEVEL = 15;
const CENTER = { lat: 24.7961217, lng: 120.9966699 }; // NTHU

function getPins() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "/carts?format=pins", false);
  xhr.send();

  return JSON.parse(xhr.response);
}

var map;
var markers = [];
async function initMap() {
  // Request needed libraries.
  const { Map } = await google.maps.importLibrary("maps");
  map = new Map(document.getElementById("map"), {
    zoom: ZOOM_LEVEL,
    center: CENTER,
    mapId: "4504f8b37365c3d0",
  });
  // Set LatLng and title text for the markers. The first marker (Boynton Pass)
  // receives the initial focus when tab is pressed. Use arrow keys to
  // move between markers; press tab again to cycle through the map controls.

  const tourStops = getPins();
  // Create the markers.
  tourStops.forEach(({ position, title }) => {
    setPin(position, title);
  });
}

async function setPin(position, title) {
  const { InfoWindow } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
    "marker",
  );

  const bounds = new google.maps.LatLngBounds();
  // Create an info window to share between markers.
  const infoWindow = new InfoWindow();

  // Create the markers.
  const marker = new AdvancedMarkerElement({
    position,
    map,
    title: title
  });

  markers.push(marker);
  if  (markers.length > 1) {
    boundMarkers();
  } else {
    map.setCenter(position);
    map.setZoom(ZOOM_LEVEL);
  }

  marker.addListener("click", ({ domEvent, latLng }) => {
    const { target } = domEvent;

    infoWindow.close();
    infoWindow.setContent(marker.title);
    infoWindow.open(marker.map, marker);
  });
}

function boundMarkers() {
  const bounds = new google.maps.LatLngBounds();
  markers.forEach(marker => {
    bounds.extend(marker.position);
  });
  map.fitBounds(bounds);
}

function removePin(obj){
  rem_pin = markers.find(pin => pin['title'] == obj['title']);
  markers = markers.filter(pin => pin['title'] != obj['title']);
  rem_pin.setMap(null);
  if (markers.length > 1) {
    boundMarkers();
  } else {
    map.setCenter(rem_pin.position);
    map.setZoom(ZOOM_LEVEL);
  }
}

initMap();