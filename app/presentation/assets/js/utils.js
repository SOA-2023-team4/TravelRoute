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

function createInput(type, name) {
  let input = document.createElement('input');
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