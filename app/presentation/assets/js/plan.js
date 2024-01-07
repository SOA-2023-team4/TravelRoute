function getPlan(id = 'pin-0'){
  pins = document.querySelector(`#${id}`);

  return JSON.parse(pins.value);
}

function animateRoute(response) {
  const route = response.routes[0].overview_path;

  // Create a polyline
  const animatedPolyline = new google.maps.Polyline({
    path: [],
    map: map,
    strokeColor: '#FA8072',
    strokeOpacity: 0.7,
    strokeWeight: 5,
  });
  let count = 0;
  const interval = window.setInterval(() => {
    animated = animatedPolyline.getPath().push(route[count]);
    count++;

    if (count === route.length) {
      previous_route = route;
      window.clearInterval(interval);
    }
  });
}

let planMarkers = [];

async function drawRoute(pin = 'pin-0') {
  initMap();
  const { PinElement } = await google.maps.importLibrary(
    "marker",
  );
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();

  const plan = getPlan(pin);

  // Clear the markers and the route
  planMarkers.forEach(marker => {
    marker.setMap(null);
  });
  
  // Create an array to store the markers
  directionsService
  .route({
    origin: plan[0].position,
    destination: plan[plan.length - 1].position,
    waypoints: plan.slice(1, plan.length - 1).map(({ position }) => {
      return { location: position, stopover: true };
  }),
  optimizeWaypoints: false,
  travelMode: "DRIVING",
  })
  .then((response) => {
    directionsRenderer.setDirections(response);
    directionsRenderer.setOptions({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: "#FA8072",
        strokeOpacity: 0.7,
        strokeWeight: 5,
      },
    });
    // Iterate over each leg of the route and add markers with animation
    response.routes[0].legs.forEach(async (leg, i) => {
      const glyph = new PinElement({
        glyph: `${i + 1}`,
        glyphColor: "white",
      })

      const marker_info = {'title': plan[i].title}
      const marker = await createMarker(plan[i].position, marker_info, glyph);
      const content = marker.content;
      const time =  0.7 + i * 0.1;
      addDropAnimation(content, time);
      planMarkers.push(marker);

      // Add the end marker
      if ( i == plan.length - 2 ) {
        const glyph = new PinElement({
          glyph: `${plan.length}`,
          glyphColor: "white",
        })
        const marker_info = {'title': plan[i + 1].title}
        const last = await createMarker(plan[i + 1].position, marker_info, glyph);
        const content = last.content;
        const time =  0.7 + (i + 1) * 0.1;
        addDropAnimation(content, time);
        planMarkers.push(last);
      }
      boundMarkers(planMarkers);

      // Animate the route
      // Clear the polyline
      directionsRenderer.setMap(null);
      animateRoute(response);
    });
  });
}

drawRoute();