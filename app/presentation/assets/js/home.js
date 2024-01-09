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

function generatePlan() {
  const start_date = document.querySelector("#start-date");
  const end_date = document.querySelector("#end-date");
  const start_time = document.querySelector("#start-time");
  const end_time = document.querySelector("#end-time");

  const generate_plan_link = document.querySelector("#generate-plan-link");
  generate_plan_link.setAttribute("href",
  `/plans?start_date=${start_date.value}&end_date=${end_date.value}&start_time=${start_time.value}&end_time=${end_time.value}`
  );
  window.location.href = generate_plan_link.getAttribute("href");
}

function requestReccomendation(attraction, exclude) {
  const xhr = new XMLHttpRequest();
    xhr.open("GET", attraction['reccomendation_url'] + `&exclude=${encodeURIComponent(exclude)}`, true)
    xhr.send();

    xhr.onload = () => {
      let progress_div = document.querySelector("#progress-bar");
      if (xhr.status == 202) {
        progress_div.innerHTML = "";
        var response = JSON.parse(xhr.response);
        var message = response.message;
        var request_id = message.request_id;
        var apiHost = message.host
        var client = new Faye.Client(`${apiHost}/faye/faye`)

        var progress_bar = createProgressBar();
        progress_div.appendChild(progress_bar);
        progress_div.style.display = 'block';

        client.subscribe(`/${request_id}`, (msg) => {
          ws_msg = JSON.parse(msg)
          progress_bar.setAttribute("style", `width: ${ws_msg.percent}%`)
          progress_bar.setAttribute("aria-valuenow", ws_msg.percent)
          progress_bar.innerHTML = `${ws_msg.message}`

          if (ws_msg.percent < 30) {
            progress_bar.classList.add("bg-danger");
          } else if (ws_msg.percent < 50) {
            progress_bar.classList.remove("bg-danger");
            progress_bar.classList.add("bg-warning");
          } else if (ws_msg.percent < 80) {
            progress_bar.classList.remove("bg-warning");
            progress_bar.classList.add("bg-info");
          } else if (ws_msg.percent < 95) {
            progress_bar.classList.remove("bg-info");
            progress_bar.style.backgroundColor = "#20B2AA";
          } else {
            progress_bar.classList.remove("bg-info");
            progress_bar.classList.add("bg-success");
          }

          if (ws_msg.percent == 100) {
            requestReccomendation(attraction, exclude)
            client.disconnect()
          }
        })
      } else {
        reccommended_pin = [];
        recommendations = JSON.parse(xhr.response)['attractions'];
        recommendations.forEach((rec) => {
          reccommended_pin.push({
            "position": {"lat": rec["location"]["latitude"], "lng": rec["location"]["longitude"]},
            "title": rec["name"],
            "info": createReccomendationInfo(rec, true)
          });
        });
        setReccommendedMarker(reccommended_pin);
        setTimeout(() => {
          progress_div.style.display = 'none';
        }, 2000);
      }
    }
}

function addAttraction(element) {
  const cart = getCart();
  const key_list = Object.keys(cart);
  const cart_values = Object.values(cart).map((attraction) => attraction['title']);
  cart_values.push(element.name)
  const to_exclude = cart_values.join(',');

  const xhr = new XMLHttpRequest();
  url = "/carts/" + element.id;
  xhr.open("GET", url, true)
  xhr.send();

  xhr.onload = () => {
    let attraction = JSON.parse(xhr.response);

    requestReccomendation(attraction, to_exclude);

    if (!key_list.includes(attraction['place_id'])) {
      let attraction_list = document.querySelector("#attraction-list-body");

      var chosen_attraction = document.createElement("li");
      chosen_attraction.setAttribute("class", "list-group-item list-group-item-action flex-column align-items-start");

      var card_body = document.createElement("div");
      card_body.setAttribute("class", "card-body form-check");

      var radio = createRadioInput("origin", attraction["place_id"], attraction["place_id"]);

      var row = createRow();
      var col_11 = createCol(11);
      var col_1 = createCol(1);
      var label = createLabel(attraction["place_id"]);

      var chosen_attraction_card_title = createHeader(5, "card-title", attraction["name"]);
      var chosen_attraction_rating = createRating(attraction["rating"]);

      var chosen_attraction_card_text = createParagraph("card-text", attraction["address"]);

      var remove_button = createDeleteButton();
      remove_button.setAttribute("id", attraction["place_id"]);
      remove_button.setAttribute("onclick", "removeAttraction(this)");
      col_11.setAttribute("onclick", "selectOrigin(this)");

      label.appendChild(chosen_attraction_card_title);
      label.appendChild(chosen_attraction_rating);
      label.appendChild(chosen_attraction_card_text);
      col_11.appendChild(label);
      col_11.appendChild(radio);
      col_1.appendChild(remove_button);
      row.appendChild(col_11);
      row.appendChild(col_1);
      card_body.appendChild(row);
      chosen_attraction.appendChild(card_body);
      attraction_list.appendChild(chosen_attraction);

      pin = {"position": {"lat": attraction["latitude"], "lng": attraction["longitude"]}, "title": attraction["name"]}
      setNormalMarker(pin['position'], pin['title']);
    }
  }
}

function removeAttraction(element) {
  const xhr = new XMLHttpRequest();
  xhr.open("DELETE", "/carts/" + element.id, true)
  xhr.send();

  xhr.onload = () => {
    var generate_plan_button = document.querySelector("#generate-plan-link");
    var card_list = element.parentElement.parentElement.parentElement.parentElement
    var select = card_list.querySelector("input")
    if (select.checked) {
      generate_plan_button.setAttribute("href", "#");
      generate_plan_button.classList.add("disabled");
      generate_plan_button.classList.add("btn-dark");
      generate_plan_button.classList.remove("btn-info");
    }
    card_list.remove();
    del_pin = JSON.parse(xhr.response);
    removePin(del_pin);
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
        a.setAttribute("name", attraction["name"]);
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