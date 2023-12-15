function getPlan(){
  // const xhr = new XMLHttpRequest();
  // url = window.location.href + "&format=pins";
  // xhr.open("GET", url, false);
  // xhr.send();
  // return JSON.parse(xhr.response);
  pins = document.querySelector("#pins");

  return JSON.parse(pins.value);
}

async function setOrderedMarkers(){
  const { InfoWindow } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
    "marker",
  );

  var stops = getPlan();
  const infoWindow = new InfoWindow();

  stops.forEach(({ position, title }, i) => {
    const pin = new PinElement({
      glyph: `${i + 1}`,
      glyphColor: "white",
    })

    const marker = new AdvancedMarkerElement({
      position,
      map,
      title: `${i + 1}. ${title}`,
      content: pin.element,
    });

    boundMarkers(stops);

    marker.addListener("click", ({ domEvent, latLng }) => {
      const { target } = domEvent;
      infoWindow.close();
      infoWindow.setContent(marker.title);
      infoWindow.open(marker.map, marker);
    });

  });
}

initMap();
setOrderedMarkers();