function addAttraction(element) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/attractions", true)
  xhr.send(JSON.stringify({"selected_attraction": element}));

  xhr.onload = () => {
    let attraction = JSON.parse(xhr.response);
    let attraction_list = document.querySelector("#attraction-list");

    var chosen_attraction = document.createElement("li");
    chosen_attraction.setAttribute("class", "list-group-item");

    var chosen_attraction_card_body = document.createElement("div");
    chosen_attraction_card_body.setAttribute("class", "card-body");

    var chosen_attraction_card_title = document.createElement("h5");
    chosen_attraction_card_title.setAttribute("class", "card-title");
    chosen_attraction_card_title.innerHTML = attraction["name"] + " (" + attraction["rating"] + ")";
    var chosen_attraction_card_text = document.createElement("p");
    chosen_attraction_card_text.setAttribute("class", "card-text");
    chosen_attraction_card_text.innerHTML = attraction["address"];
    var remove_button = document.createElement("button");
    remove_button.setAttribute("class", "btn btn-danger btn-small");
    remove_button.setAttribute("onclick", "removeAttraction('" + attraction["place_id"] + "', this)");
    remove_button.innerHTML = "-";

    chosen_attraction_card_body.appendChild(chosen_attraction_card_title);
    chosen_attraction_card_body.appendChild(chosen_attraction_card_text);
    chosen_attraction_card_body.appendChild(remove_button);
    chosen_attraction.appendChild(chosen_attraction_card_body);
    attraction_list.appendChild(chosen_attraction);
  }
}

function removeAttraction(place_id, element) {
  const xhr = new XMLHttpRequest();
  xhr.open("DELETE", "/attractions", true)
  xhr.send(JSON.stringify({"removed": place_id}));

  xhr.onload = () => {
    element.parentElement.parentElement.remove();
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
let searchForm = document.querySelector("#attraction-search-form");
let searchButton = document.querySelector("#attraction-search-button");
let searchResults = document.querySelector("#attraction-search-results");

searchButton.addEventListener("click", () => {
  searchResults.innerHTML='';
  search_term = document.querySelector("#attraction-search-term").value;
  url = searchForm.action;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.send(JSON.stringify({"search_term": search_term}));

  xhr.onload = () => {
    if (xhr.status == 200) {
      res = JSON.parse(xhr.response);
      var attractions = res["attractions"];
      attractions.forEach((attraction) => {
        var attraction_list = document.createElement("li");
        attraction_list.setAttribute("class", "list-group-item");

        var attraction_card = document.createElement("div");
        attraction_card.setAttribute("class", "card border-light mb-3");

        var attraction_card_body = document.createElement("div");
        attraction_card_body.setAttribute("class", "card-body");
        var attraction_card_title = document.createElement("h5");
        attraction_card_title.setAttribute("class", "card-title");
        attraction_card_title.innerHTML = attraction["name"] + " (" + attraction["rating"] + ")";
        var attraction_card_text = document.createElement("p");
        attraction_card_text.setAttribute("class", "card-text");
        attraction_card_text.innerHTML = attraction["address"]; 

        var add_button = document.createElement("a");
        add_button.setAttribute("class", "btn btn-success btn-small");
        add_button.setAttribute("onclick", "addAttraction('" + JSON.stringify(attraction) + "')");
        add_button.innerHTML = "+";

        attraction_card_body.appendChild(attraction_card_title);
        attraction_card_body.appendChild(attraction_card_text);
        attraction_card_body.appendChild(add_button);
        attraction_card.appendChild(attraction_card_body);
        attraction_list.appendChild(attraction_card);
        searchResults.appendChild(attraction_list);
      });
    } else {
      window.location.href = '/';
    }
  }
});

clear_button.addEventListener("click", () => {
  let attraction_list = document.querySelector("#attraction-list");
  const xhr = new XMLHttpRequest();
  xhr.open("DELETE", "/attractions", true)
  xhr.send(JSON.stringify({"removed": "all"}));
  xhr.onload = () => {
    window.location.reload();
  }
});