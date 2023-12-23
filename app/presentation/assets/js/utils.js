const gmaps_script = document.getElementById("gmaps-script");
gmaps_script.remove();

const ZOOM_LEVEL = 15;
const CENTER = { lat: 24.7961217, lng: 120.9966699 }; // NTHU
var map;
var markers = [];
var reccommended_markers = [];

function getAllPins() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "/carts?format=pins", false);
  xhr.send();

  return JSON.parse(xhr.response);
}

async function initMap() {
  // Request needed libraries.
  const { Map } = await google.maps.importLibrary("maps");
  map = new Map(document.getElementById("map"), {
    zoom: ZOOM_LEVEL,
    center: CENTER,
    mapId: "4504f8b37365c3d0",
  });
}

function boundMarkers(markers) {
  const bounds = new google.maps.LatLngBounds();
  markers.forEach(marker => {
    bounds.extend(marker.position);
  });
  map.fitBounds(bounds);
}

function createDiv(className) {
  let div = document.createElement('div');
  div.setAttribute('class', className);
  return div;
}

function createRow() {
  let row = document.createElement('div');
  row.setAttribute('class', 'row');
  return row;
}

function createCol(num=1) {
  let col = document.createElement('div');
  col.setAttribute('class', 'col-' + num);
  return col;
}

function createButton(className, text, type='button') {
  let button = document.createElement('button');
  button.setAttribute('class', className);
  button.setAttribute('type', type);
  button.innerHTML = text;
  return button;
}

function createLink(className, href='#') {
  let link = document.createElement('a');
  link.setAttribute('class', className);
  link.setAttribute('href', href);
  return link;

}

function createDeleteButton() {
  let remove_button = createLink('btn btn-secondary btn-lg fas fa-trash')
  return remove_button;
}

function createLabel(labelFor) {
  let label = document.createElement('label');
  label.setAttribute('for', labelFor);
  label.setAttribute('class', 'form-check-label');
  return label;
}

function createRadioInput(name, id, value, onclick=null) {
  let radio = createInput('radio', name, 'form-check-input', onclick);
  radio.setAttribute('id', id);
  radio.setAttribute('value', value);
  return radio;
}

function createInput(type, name, className=null, onclick=null) {
  let input = document.createElement('input');
  if (className) {
    input.setAttribute('class', className);
  }
  if (onclick) {
    input.setAttribute('onclick', onclick);
  }
  input.setAttribute('type', type);
  input.setAttribute('name', name);
  return input;
}

function createHeader(level, className, text) {
  let header = document.createElement('h' + level);
  header.setAttribute('class', className);
  header.innerHTML = text;
  return header;
}

function createParagraph(className, text) {
  let paragraph = document.createElement('p');
  paragraph.setAttribute('class', className);
  paragraph.innerHTML = text;
  return paragraph;
}

function createRating(rating) {
  let ratingElement = document.createElement('small');
  ratingElement.innerHTML = rating;
  let star = document.createElement('i');
  star.setAttribute('class', 'fas fa-star');
  ratingElement.insertBefore(star, ratingElement.firstChild);
  return ratingElement;
}

function createReccomendationInfo(rec) {
  let info = createDiv('info');
  let info_header = createHeader(5, 'card-title', rec['name']);
  let info_rating = createRating(rec['rating']);
  let info_text = createParagraph('card-text', rec['description']);
  let info_button = createButton('btn btn-primary', 'Add to Plan');
  info_button.setAttribute('id', rec['place_id']);
  info_button.setAttribute('onclick', 'addAttraction(this)');
  info_button.setAttribute('name', rec['name']);
  info.appendChild(info_header);
  info.appendChild(info_rating);
  info.appendChild(info_text);
  info.appendChild(info_button);
  return info;
}

async function createMarker(position, marker_info, pin = null) {
  const { InfoWindow } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
    "marker",
  );

  const infoWindow = new InfoWindow();
  const marker = new AdvancedMarkerElement({
    position,
    map,
    title: marker_info['title'],
    content: pin ? pin.element : pin,
  });

  marker.addListener("click", ({ domEvent, latLng }) => {
    const { target } = domEvent;
    infoWindow.close();
    marker_info['info'] ? infoWindow.setContent(marker_info['info']) : infoWindow.setContent(marker_info['title']);
    infoWindow.open(marker.map, marker);
  });
  return marker;
}

function addDropAnimation(element, time = 1) {
  element.style.opacity = "0";
  element.addEventListener("animationend", (event) => {
    element.opacity = "1";
  });

  element.style.setProperty("--delay-time", time + "s");
  element.classList.add("drop");
}