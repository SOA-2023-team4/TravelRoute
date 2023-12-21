function setAllPins() {
  const tourStops = getAllPins();
  // Create the markers.
  tourStops.forEach(({ position, title }) => {
    setNormalMarker(position, title);
  });
}

async function setNormalMarker(position, title) {
  const { InfoWindow } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
    "marker",
  );

  // const bounds = new google.maps.LatLngBounds();
  // Create an info window to share between markers.
  const infoWindow = new InfoWindow();

  // Create the markers.
  const marker = new AdvancedMarkerElement({
    position,
    map,
    title: title
  });

  marker.addListener("click", ({ domEvent, latLng }) => {
    const { target } = domEvent;

    infoWindow.close();
    infoWindow.setContent(marker.title);
    infoWindow.open(marker.map, marker);
  });

  markers.push(marker);
  if  (markers.length > 1) {
    boundMarkers(markers);
  } else {
    map.setCenter(position);
    map.setZoom(ZOOM_LEVEL);
  }
}

async function setReccommendedMarker(reccommended_pin) {
  const { InfoWindow } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
    "marker",
  );
  const infoWindow = new InfoWindow();
  clearMarkers(reccommended_markers);

  reccommended_pin.forEach(({ position, title, info }) => {
    const star = document.createElement("i");
    star.setAttribute("class", "fas fa-star");
    // Create the markers.
    const pin = new PinElement({
      background: "#FA8072",
      borderColor: "#FA8072",
      glyph: star,
      glyphColor: "white"
    })
  
    const marker = new AdvancedMarkerElement({
      position,
      map,
      title: title,
      content: pin.element
    });

    const content = marker.content;
    content.style.opacity = "0";
    content.addEventListener("animationend", (event) => {
      content.opacity = "1";
    });

    const time = 1;
    content.style.setProperty("--delay-time", time + "s");
    content.classList.add("drop");

    marker.addListener("click", ({ domEvent, latLng }) => {
      const { target } = domEvent;

      infoWindow.close();
      infoWindow.setContent(info);
      infoWindow.open(marker.map, marker);
    });
    
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