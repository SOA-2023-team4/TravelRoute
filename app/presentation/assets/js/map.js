function setAllPins() {
  const tourStops = getAllPins();
  // Create the markers.
  tourStops.forEach(({ position, title }) => {
    setNormalMarker(position, title);
  });
}

async function setNormalMarker(position, title) {
  const marker_info = {"title": title};
  const marker = await createMarker(position, marker_info, title);

  markers.push(marker);
  if  (markers.length > 1) {
    boundMarkers(markers);
  } else {
    map.setCenter(position);
    map.setZoom(ZOOM_LEVEL);
  }
}

async function setReccommendedMarker(reccommended_pin) {
  const { PinElement } = await google.maps.importLibrary(
    "marker",
  );
  clearMarkers(reccommended_markers);

  reccommended_pin.forEach(async ({ position, title, info }) => {
    const star = document.createElement("i");
    star.setAttribute("class", "fas fa-star");
    // Create the markers.
    const pin = new PinElement({
      background: "#FA8072",
      borderColor: "#FA8072",
      glyph: star,
      glyphColor: "white"
    })

    const marker_info = {"title": title, "info": info};
    const marker = await createMarker(position, marker_info, pin);

    // drop animation
    const content = marker.content;
    addDropAnimation(content);
    
    reccommended_markers.push(marker);
    all_markers = markers.concat(reccommended_markers);
    boundMarkers(all_markers);
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

function clearMarkers(marker_array) {
  marker_array.forEach(marker => {
    marker.setMap(null);
  });
  marker_array = [];
}

initMap();
setAllPins();