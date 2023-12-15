function setAllPins() {
  const tourStops = getAllPins();
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
    boundMarkers(markers);
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
setAllPins();