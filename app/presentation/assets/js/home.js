// make api call to /carts to retrive cart
function getCart() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "/carts", false);
  xhr.send();

  return JSON.parse(xhr.response);
}

function resetOrigin() {
  const all_attraction_list = document.querySelectorAll("#attraction-list-body input");
  all_attraction_list.forEach((attraction) => {
    attraction.removeAttribute("checked");
    attraction.parentElement.parentElement.classList.remove("list-group-item-info");
  });
  const badge = document.querySelector(".origin-badge");
  if (badge) {
    badge.remove();
  }
}

function selectOrigin(element) {
  resetOrigin();

  element.setAttribute("checked", "");
  element.parentElement.parentElement.classList.add("list-group-item-info");
  
  const label = element.parentElement.parentElement.querySelector("label");
  const span = document.createElement("span");
  span.setAttribute("class", "badge bg-primary rounded-pill origin-badge");
  span.innerHTML = "ORIGIN";
  label.appendChild(span);

  console.log(label);
}

function addAttraction(element) {
  const cart = getCart();
  const xhr = new XMLHttpRequest();
  url = "/carts/" + element.id;
  xhr.open("GET", url, true)
  xhr.send();

  xhr.onload = () => {
    let attraction = JSON.parse(xhr.response);
    if (!cart.includes(attraction['place_id'])) {
      let attraction_list = document.querySelector("#attraction-list-body");

      var chosen_attraction = document.createElement("li");
      chosen_attraction.setAttribute("class", "list-group-item");

      var chosen_attraction_card_body = document.createElement("div");
      chosen_attraction_card_body.setAttribute("class", "card-body");

      var row = createRow();
      var col_11 = createCol(11);
      var col_1 = createCol(1);

      var chosen_attraction_card_title = createHeader(5, "card-title", attraction["name"]);
      var chosen_attraction_rating = createRating(attraction["rating"]);

      var chosen_attraction_card_text = createParagraph("card-text", attraction["address"]);

      var remove_button = createDeleteButton();
      remove_button.setAttribute("id", attraction["place_id"]);
      remove_button.setAttribute("onclick", "removeAttraction(this)");


      col_11.appendChild(chosen_attraction_card_title);
      col_11.appendChild(chosen_attraction_rating);
      col_11.appendChild(chosen_attraction_card_text);
      col_1.appendChild(remove_button);
      row.appendChild(col_11);
      row.appendChild(col_1);
      chosen_attraction_card_body.appendChild(row);
      chosen_attraction.appendChild(chosen_attraction_card_body);
      attraction_list.appendChild(chosen_attraction);

      pin = {"position": {"lat": attraction["latitude"], "lng": attraction["longitude"]}, "title": attraction["name"]}
      setPin(pin['position'], pin['title']);
    }
  }
}

function removeAttraction(element) {
  const xhr = new XMLHttpRequest();
  xhr.open("DELETE", "/carts/" + element.id, true)
  xhr.send();

  xhr.onload = () => {
    element.parentElement.parentElement.parentElement.parentElement.remove();
    del_pin = JSON.parse(xhr.response);
    removePin(del_pin);
  }
}

function removeSavedPlan(element) {
  let form = element.parentElement;
  console.log(form.plan_name.value);
  const xhr = new XMLHttpRequest();
  xhr.open("DELETE", "/plans", true)
  xhr.send(JSON.stringify({"plan_name": form.plan_name.value}));
  xhr.onload = () => {
    element.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.remove();
  }
}

let clear_button = document.querySelector("#clear-attraction-list-button");
let searchButton = document.querySelector("#attraction-search-button");
let searchResults = document.querySelector("#attraction-search-results");
let searchTerm = document.querySelector("#attraction-search-term");

function showSearchResults() {
  searchResults.style.display = "block";
}

searchTerm.addEventListener("click", () => {
  showSearchResults()
});

searchButton.addEventListener("click", (event) => {
  event.preventDefault();
  searchResults.innerHTML='';
  search_term = searchTerm.value;
  url = "/attractions?search_term=" + search_term;
  let xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.send();

  xhr.onload = () => {
    if (xhr.status == 200) {
      res = JSON.parse(xhr.response);
      var attractions = res["attractions"];
      attractions.forEach((attraction) => {
        var a = createLink("list-group-item list-group-item-action flex-column align-items-start")
        a.setAttribute("id", attraction["place_id"]);
        a.setAttribute("onclick", "addAttraction(this)");

        var header_div = createDiv("d-flex w-100 justify-content-between");
        var result_title = createHeader(5, "mb-1", attraction["name"]);
        var rating = createRating(attraction["rating"]);
        var content = createParagraph("mb-1", attraction["address"]);

        header_div.appendChild(result_title);
        header_div.appendChild(rating);
        a.appendChild(header_div);
        a.appendChild(content);
        searchResults.appendChild(a);
      });

      showSearchResults()
    } else {
      window.location.href = '/';
    }
  }
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('#attraction-search-form')) {
    searchResults.style.display = 'none';
  }
});