(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _placeData = _interopRequireDefault(require("./placeData"));

var _placeList = _interopRequireDefault(require("./placeList"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Contains all event listeners
const eventListeners = {
  // Add new article
  postPlace() {
    // Get user input (value of each field)
    let inputPlaceName = document.querySelector("#place_name").value;
    let inputPlaceDescription = document.querySelector("#place_description").value;
    let inputPlaceCost = document.querySelector("#place_cost").value;
    let inputPlaceCity = document.querySelector("#place_city").value; // Create new object with correct DB structure to represent a single place item:

    let placeToSave = {
      name: inputPlaceName,
      description: inputPlaceDescription,
      cost: inputPlaceCost,
      review: "",
      cityNameId: Number(inputPlaceCity) // Save article to database
      // Then rebuild the article list on DOM

    };

    _placeData.default.postNewPlace(placeToSave).then(() => {
      _placeList.default.buildList();
    });
  } // Delete article
  // Edit article


};
var _default = eventListeners;
exports.default = _default;

},{"./placeData":4,"./placeList":7}],2:[function(require,module,exports){
"use strict";

var _placeList = _interopRequireDefault(require("./placeList"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Calls placeList.buildList function
_placeList.default.buildList();

},{"./placeList":7}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _placeList = _interopRequireDefault(require("./placeList"));

var _placeData = _interopRequireDefault(require("./placeData"));

var _placeEditForm = _interopRequireDefault(require("./placeEditForm"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Creates each place item that will be appended to DOM
const placeItem = {
  buildPlace(placeObj) {
    // argument passed from placeList
    // Build each place item
    // Create container for each item
    let placeSection = document.createElement("section");
    placeSection.setAttribute("class", "place_section");
    placeSection.setAttribute("id", `place--${placeObj.id}`); // Name

    let placeName = document.createElement("h3");
    placeName.textContent = placeObj.name; // console.log(placeObj.name);
    // Description

    let placeDesc = document.createElement("p");
    placeDesc.textContent = placeObj.description; // Cost

    let placeCost = document.createElement("p");

    if (placeObj.cost === "0" || placeObj.cost === "FREE") {
      let costDisplay = `Cost: ${placeObj.cost}`;
      placeCost.textContent = costDisplay;
    } else {
      let costDisplay = `Cost: $${placeObj.cost}`;
      placeCost.textContent = costDisplay;
    } // Review


    let placeReview = document.createElement("p");

    if (placeObj.review === "") {
      let reviewDisplay = "Review: No review yet.";
      placeReview.textContent = reviewDisplay;
    } else {
      let reviewDisplay = `Review: ${placeObj.review}`;
      placeReview.textContent = reviewDisplay;
    } // City


    let placeCity = document.createElement("p");
    let cityDisplay = `City: ${placeObj.cityName.name}`;
    placeCity.textContent = cityDisplay; // Add button section

    let buttonHolder = document.createElement("div");
    buttonHolder.setAttribute("class", "button_holder"); // Edit button

    let editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.setAttribute("class", "edit_place");
    editBtn.addEventListener("click", () => {
      let sectionId = event.target.parentNode.parentNode.id;
      let placeId = sectionId.split("--")[1]; // console.log(placeId);

      _placeData.default.getPlace(placeId).then(response => {
        _placeEditForm.default.buildEditForm(placeId, response);
      });
    }); // Delete button

    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.setAttribute("class", "delete_place");
    deleteBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete this entry?")) {
        let placeId = placeObj.id;

        _placeData.default.deletePlace(placeId).then(() => {
          _placeList.default.buildList();
        });
      }
    }); // Add "Edit" and "Delete" buttons to button holder

    buttonHolder.appendChild(editBtn);
    buttonHolder.appendChild(deleteBtn); // Append each element to placeSection

    placeSection.appendChild(placeName);
    placeSection.appendChild(placeDesc);
    placeSection.appendChild(placeCost);
    placeSection.appendChild(placeReview);
    placeSection.appendChild(placeCity);
    placeSection.appendChild(buttonHolder); // console.log(placeSection);

    return placeSection;
  }

};
var _default = placeItem;
exports.default = _default;

},{"./placeData":4,"./placeEditForm":5,"./placeList":7}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
// Contains fetch calls to GET, POST, DELETE, and PUT
const placeData = {
  // GET places
  getPlaces() {
    return fetch("http://localhost:8088/places?_expand=cityName").then(response => response.json());
  },

  // GET cities
  getCities() {
    return fetch("http://localhost:8088/cityNames").then(response => response.json());
  },

  // POST
  postNewPlace(placeToSave) {
    return fetch("http://localhost:8088/places", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(placeToSave)
    });
  },

  // DELETE
  deletePlace(placeId) {
    return fetch(`http://localhost:8088/places/${placeId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });
  },

  // PUT
  getPlace(placeId) {
    return fetch(`http://localhost:8088/places/${placeId}?_expand=cityName`).then(response => response.json());
  },

  // Need the id to identify which place item we want to edit, as well as the new data we want to replace the existing data with. So we need two arguments for the method.
  putExistingPlace(placeId, placeToEdit) {
    return fetch(`http://localhost:8088/places/${placeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(placeToEdit)
    });
  }

};
var _default = placeData;
exports.default = _default;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _placeData = _interopRequireDefault(require("./placeData"));

var _placeList = _interopRequireDefault(require("./placeList"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Creates form to edit a place
const placeEditForm = {
  buildEditForm(placeId, placeToEdit) {
    // Create & append form w/ save button
    // Display "Name" (not editable)
    let name = document.createElement("h3");
    name.textContent = `${placeToEdit.name}`; // Display "Description" (not editable)

    let description = document.createElement("div");
    description.textContent = placeToEdit.description; // Create "Cost" field

    let cost = document.createElement("fieldset");
    let costLabel = document.createElement("label");
    costLabel.textContent = "Cost";
    costLabel.setAttribute("for", "place_cost");
    let costInput = document.createElement("input");
    costInput.setAttribute("id", "place_cost");
    costInput.setAttribute("name", "place_cost");
    costInput.value = placeToEdit.cost;
    cost.appendChild(costLabel);
    cost.appendChild(costInput); // Show "City" (not editable)

    let city = document.createElement("div");
    city.textContent = `City: ${placeToEdit.cityName.name}`; // Create "Review" field

    let review = document.createElement("fieldset");
    let reviewLabel = document.createElement("label");
    reviewLabel.textContent = "Review";
    reviewLabel.setAttribute("for", "place_review");
    let reviewInput = document.createElement("textarea");
    reviewInput.setAttribute("id", "place_review");
    reviewInput.setAttribute("name", "place_review");
    reviewInput.value = placeToEdit.review;
    review.appendChild(reviewLabel);
    review.appendChild(reviewInput); // Create "Update" button

    let updateButton = document.createElement("button");
    updateButton.textContent = "Update"; // Add event listener to the "Update" button
    // Takes the new values in the input fields and builds an object for the place item to be edited.
    // Make a HTTP PUT request where we target the place item we want to edit by specifying the id in the URL.
    // Pass the object representing the place item with the new values as data in our HTTP request.

    updateButton.addEventListener("click", () => {
      let editedPlace = {
        name: placeToEdit.name,
        description: placeToEdit.description,
        cost: costInput.value,
        review: reviewInput.value,
        cityNameId: placeToEdit.cityName.id
      };
      let placetoEditId = placeToEdit.id;

      _placeData.default.putExistingPlace(placetoEditId, editedPlace).then(() => {
        _placeList.default.buildList();
      });
    }); // We passed in the id of the section so we know exactly where to append the edit form.

    let placeSection = document.querySelector(`#place--${placeId}`); // Because we want to replace what is currently in the article element with the edit form, we clear out all children HTML elements in our targeted element before appending our edit form to it.

    while (placeSection.firstChild) {
      placeSection.removeChild(placeSection.firstChild);
    }

    placeSection.appendChild(name);
    placeSection.appendChild(description);
    placeSection.appendChild(cost);
    placeSection.appendChild(review);
    placeSection.appendChild(city);
    placeSection.appendChild(updateButton);
  }

};
var _default = placeEditForm;
exports.default = _default;

},{"./placeData":4,"./placeList":7}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _eventListeners = _interopRequireDefault(require("./eventListeners"));

var _placeData = _interopRequireDefault(require("./placeData"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Creates form to save a new place item to database
const placeForm = {
  buildForm() {
    // Create container, title, etc.
    let output = document.querySelector("#output");
    let formContainer = document.createElement("div");
    formContainer.setAttribute("id", "form_container");
    let formContainerTitle = document.createElement("h3");
    formContainerTitle.textContent = "Add New Place";
    formContainer.appendChild(formContainerTitle); // Create "Name" field

    let name = document.createElement("fieldset");
    let nameLabel = document.createElement("label");
    nameLabel.textContent = "Name";
    nameLabel.setAttribute("for", "place_name");
    let nameInput = document.createElement("input");
    nameInput.setAttribute("id", "place_name");
    nameInput.setAttribute("name", "place_name");
    name.appendChild(nameLabel);
    name.appendChild(nameInput); // Create "Description" field

    let description = document.createElement("fieldset");
    let descriptionLabel = document.createElement("label");
    descriptionLabel.textContent = "Description";
    descriptionLabel.setAttribute("for", "place_description");
    let descriptionInput = document.createElement("textarea");
    descriptionInput.setAttribute("id", "place_description");
    descriptionInput.setAttribute("name", "place_description");
    description.appendChild(descriptionLabel);
    description.appendChild(descriptionInput); // Create "Cost" field

    let cost = document.createElement("fieldset");
    let costLabel = document.createElement("label");
    costLabel.textContent = "Cost";
    costLabel.setAttribute("for", "place_cost");
    let costInput = document.createElement("input");
    costInput.setAttribute("id", "place_cost");
    costInput.setAttribute("name", "place_cost");
    cost.appendChild(costLabel);
    cost.appendChild(costInput); // Create "City" drop-down

    let city = document.createElement("fieldset");
    let cityLabel = document.createElement("label");
    cityLabel.textContent = "City";
    let cityInput = document.createElement("select");
    cityInput.setAttribute("id", "place_city");
    cityInput.setAttribute("name", "place_city"); // fetch cities and build options

    _placeData.default.getCities().then(cities => {
      cities.forEach(city => {
        let cityOption = document.createElement("option");
        cityOption.textContent = city.name;
        cityOption.setAttribute("value", city.id);
        cityInput.appendChild(cityOption);
      });
    }); // let cityOptions = `
    //     <option value="1">Los Angeles</option>
    //     <option value="2">San Francisco</option>
    //     <option value="3">Toronto</option>
    // `
    // cityInput.innerHTML = cityOptions;


    city.appendChild(cityLabel);
    city.appendChild(cityInput); // Create "Save" button and attach event listener

    let saveBtn = document.createElement("button");
    saveBtn.textContent = "Save Place";
    saveBtn.setAttribute("class", "save_new_place"); // Attach event listener to button, to POST to database

    saveBtn.addEventListener("click", _eventListeners.default.postPlace); // Append each field/button to form container

    formContainer.appendChild(name);
    formContainer.appendChild(description);
    formContainer.appendChild(cost);
    formContainer.appendChild(city);
    formContainer.appendChild(saveBtn);
    output.appendChild(formContainer);
  }

};
var _default = placeForm;
exports.default = _default;

},{"./eventListeners":1,"./placeData":4}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _placeData = _interopRequireDefault(require("./placeData"));

var _place = _interopRequireDefault(require("./place"));

var _placeForm = _interopRequireDefault(require("./placeForm"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Builds out place list and appends to DOM
// import eventListeners from "./eventListeners"
const placeList = {
  buildList() {
    // Create container, title, etc.
    let output = document.querySelector("#output");
    output.innerHTML = "";
    let title = document.createElement("h1");
    title.textContent = "The Ternary Traveler";
    output.appendChild(title);
    let listContainer = document.createElement("div");
    listContainer.setAttribute("id", "list_container"); // Add form here

    _placeForm.default.buildForm(); // Create doc frag to hold each place item


    let placeDocFrag = document.createDocumentFragment(); // GET place data

    _placeData.default.getPlaces().then(allPlaces => {
      allPlaces.forEach(placeItem => {
        // forEach place, call function to build HTML for each one and append each to doc frag
        let newPlace = _place.default.buildPlace(placeItem); // newPlace = placeSection


        placeDocFrag.appendChild(newPlace);
      }); // Append the doc frag to the DOM

      listContainer.appendChild(placeDocFrag);
    });

    output.appendChild(listContainer);
  }

};
var _default = placeList;
exports.default = _default;

},{"./place":3,"./placeData":4,"./placeForm":6}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zY3JpcHRzL2V2ZW50TGlzdGVuZXJzLmpzIiwiLi4vc2NyaXB0cy9tYWluLmpzIiwiLi4vc2NyaXB0cy9wbGFjZS5qcyIsIi4uL3NjcmlwdHMvcGxhY2VEYXRhLmpzIiwiLi4vc2NyaXB0cy9wbGFjZUVkaXRGb3JtLmpzIiwiLi4vc2NyaXB0cy9wbGFjZUZvcm0uanMiLCIuLi9zY3JpcHRzL3BsYWNlTGlzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7QUNFQTs7QUFDQTs7OztBQUhBO0FBS0EsTUFBTSxjQUFjLEdBQUc7QUFFbkI7QUFDQSxFQUFBLFNBQVMsR0FBRztBQUVSO0FBQ0EsUUFBSSxjQUFjLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsYUFBdkIsRUFBc0MsS0FBM0Q7QUFDQSxRQUFJLHFCQUFxQixHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLG9CQUF2QixFQUE2QyxLQUF6RTtBQUNBLFFBQUksY0FBYyxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLGFBQXZCLEVBQXNDLEtBQTNEO0FBQ0EsUUFBSSxjQUFjLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsYUFBdkIsRUFBc0MsS0FBM0QsQ0FOUSxDQVFSOztBQUNBLFFBQUksV0FBVyxHQUFHO0FBQ2QsTUFBQSxJQUFJLEVBQUUsY0FEUTtBQUVkLE1BQUEsV0FBVyxFQUFFLHFCQUZDO0FBR2QsTUFBQSxJQUFJLEVBQUUsY0FIUTtBQUlkLE1BQUEsTUFBTSxFQUFFLEVBSk07QUFLZCxNQUFBLFVBQVUsRUFBRSxNQUFNLENBQUMsY0FBRCxDQUxKLENBUWxCO0FBQ0E7O0FBVGtCLEtBQWxCOztBQVVBLHVCQUFVLFlBQVYsQ0FBdUIsV0FBdkIsRUFDQyxJQURELENBQ00sTUFBTTtBQUNSLHlCQUFVLFNBQVY7QUFDSCxLQUhEO0FBSUgsR0ExQmtCLENBNEJuQjtBQUVBOzs7QUE5Qm1CLENBQXZC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QUFLQTtBQUVBLE1BQU0sU0FBUyxHQUFHO0FBRWQsRUFBQSxTQUFTLEdBQUc7QUFFUjtBQUNBLFFBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLFNBQXZCLENBQWI7QUFDQSxJQUFBLE1BQU0sQ0FBQyxTQUFQLEdBQW1CLEVBQW5CO0FBRUEsUUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsSUFBdkIsQ0FBWjtBQUNBLElBQUEsS0FBSyxDQUFDLFdBQU4sR0FBb0Isc0JBQXBCO0FBQ0EsSUFBQSxNQUFNLENBQUMsV0FBUCxDQUFtQixLQUFuQjtBQUVBLFFBQUksYUFBYSxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBQXBCO0FBQ0EsSUFBQSxhQUFhLENBQUMsWUFBZCxDQUEyQixJQUEzQixFQUFpQyxnQkFBakMsRUFYUSxDQWFSOztBQUNBLHVCQUFVLFNBQVYsR0FkUSxDQWdCUjs7O0FBQ0EsUUFBSSxZQUFZLEdBQUcsUUFBUSxDQUFDLHNCQUFULEVBQW5CLENBakJRLENBbUJSOztBQUNBLHVCQUFVLFNBQVYsR0FDQyxJQURELENBQ00sU0FBUyxJQUFJO0FBQ2YsTUFBQSxTQUFTLENBQUMsT0FBVixDQUFrQixTQUFTLElBQUk7QUFDL0I7QUFDSSxZQUFJLFFBQVEsR0FBRyxlQUFNLFVBQU4sQ0FBaUIsU0FBakIsQ0FBZixDQUYyQixDQUVpQjs7O0FBQzVDLFFBQUEsWUFBWSxDQUFDLFdBQWIsQ0FBeUIsUUFBekI7QUFDSCxPQUpELEVBRGUsQ0FPZjs7QUFDQSxNQUFBLGFBQWEsQ0FBQyxXQUFkLENBQTBCLFlBQTFCO0FBQ0gsS0FWRDs7QUFZQSxJQUFBLE1BQU0sQ0FBQyxXQUFQLENBQW1CLGFBQW5CO0FBRUg7O0FBcENhLENBQWxCO2VBd0NlLFMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvLyBDb250YWlucyBhbGwgZXZlbnQgbGlzdGVuZXJzXG5cbmltcG9ydCBwbGFjZURhdGEgZnJvbSBcIi4vcGxhY2VEYXRhXCJcbmltcG9ydCBwbGFjZUxpc3QgZnJvbSBcIi4vcGxhY2VMaXN0XCJcblxuY29uc3QgZXZlbnRMaXN0ZW5lcnMgPSB7XG5cbiAgICAvLyBBZGQgbmV3IGFydGljbGVcbiAgICBwb3N0UGxhY2UoKSB7XG5cbiAgICAgICAgLy8gR2V0IHVzZXIgaW5wdXQgKHZhbHVlIG9mIGVhY2ggZmllbGQpXG4gICAgICAgIGxldCBpbnB1dFBsYWNlTmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcGxhY2VfbmFtZVwiKS52YWx1ZTtcbiAgICAgICAgbGV0IGlucHV0UGxhY2VEZXNjcmlwdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcGxhY2VfZGVzY3JpcHRpb25cIikudmFsdWU7XG4gICAgICAgIGxldCBpbnB1dFBsYWNlQ29zdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcGxhY2VfY29zdFwiKS52YWx1ZTtcbiAgICAgICAgbGV0IGlucHV0UGxhY2VDaXR5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwbGFjZV9jaXR5XCIpLnZhbHVlO1xuXG4gICAgICAgIC8vIENyZWF0ZSBuZXcgb2JqZWN0IHdpdGggY29ycmVjdCBEQiBzdHJ1Y3R1cmUgdG8gcmVwcmVzZW50IGEgc2luZ2xlIHBsYWNlIGl0ZW06XG4gICAgICAgIGxldCBwbGFjZVRvU2F2ZSA9IHtcbiAgICAgICAgICAgIG5hbWU6IGlucHV0UGxhY2VOYW1lLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246IGlucHV0UGxhY2VEZXNjcmlwdGlvbixcbiAgICAgICAgICAgIGNvc3Q6IGlucHV0UGxhY2VDb3N0LFxuICAgICAgICAgICAgcmV2aWV3OiBcIlwiLFxuICAgICAgICAgICAgY2l0eU5hbWVJZDogTnVtYmVyKGlucHV0UGxhY2VDaXR5KVxuICAgICAgICAgIH1cblxuICAgICAgICAvLyBTYXZlIGFydGljbGUgdG8gZGF0YWJhc2VcbiAgICAgICAgLy8gVGhlbiByZWJ1aWxkIHRoZSBhcnRpY2xlIGxpc3Qgb24gRE9NXG4gICAgICAgIHBsYWNlRGF0YS5wb3N0TmV3UGxhY2UocGxhY2VUb1NhdmUpXG4gICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHBsYWNlTGlzdC5idWlsZExpc3QoKVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIC8vIERlbGV0ZSBhcnRpY2xlXG5cbiAgICAvLyBFZGl0IGFydGljbGVcblxufVxuXG5leHBvcnQgZGVmYXVsdCBldmVudExpc3RlbmVyczsiLCJpbXBvcnQgcGxhY2VMaXN0IGZyb20gXCIuL3BsYWNlTGlzdFwiO1xuXG4vLyBDYWxscyBwbGFjZUxpc3QuYnVpbGRMaXN0IGZ1bmN0aW9uXG5wbGFjZUxpc3QuYnVpbGRMaXN0KCk7IiwiLy8gQ3JlYXRlcyBlYWNoIHBsYWNlIGl0ZW0gdGhhdCB3aWxsIGJlIGFwcGVuZGVkIHRvIERPTVxuXG5pbXBvcnQgcGxhY2VMaXN0IGZyb20gXCIuL3BsYWNlTGlzdFwiXG5pbXBvcnQgcGxhY2VEYXRhIGZyb20gXCIuL3BsYWNlRGF0YVwiXG5pbXBvcnQgcGxhY2VFZGl0Rm9ybSBmcm9tIFwiLi9wbGFjZUVkaXRGb3JtXCJcblxuY29uc3QgcGxhY2VJdGVtID0ge1xuXG4gICAgYnVpbGRQbGFjZShwbGFjZU9iaikgeyAgICAgICAgICAgICAgICAvLyBhcmd1bWVudCBwYXNzZWQgZnJvbSBwbGFjZUxpc3RcblxuICAgICAgICAvLyBCdWlsZCBlYWNoIHBsYWNlIGl0ZW1cblxuICAgICAgICAvLyBDcmVhdGUgY29udGFpbmVyIGZvciBlYWNoIGl0ZW1cbiAgICAgICAgbGV0IHBsYWNlU2VjdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzZWN0aW9uXCIpO1xuICAgICAgICBwbGFjZVNlY3Rpb24uc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJwbGFjZV9zZWN0aW9uXCIpO1xuICAgICAgICBwbGFjZVNlY3Rpb24uc2V0QXR0cmlidXRlKFwiaWRcIiwgYHBsYWNlLS0ke3BsYWNlT2JqLmlkfWApXG5cbiAgICAgICAgLy8gTmFtZVxuICAgICAgICBsZXQgcGxhY2VOYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgzXCIpO1xuICAgICAgICBwbGFjZU5hbWUudGV4dENvbnRlbnQgPSBwbGFjZU9iai5uYW1lO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhwbGFjZU9iai5uYW1lKTtcblxuICAgICAgICAvLyBEZXNjcmlwdGlvblxuICAgICAgICBsZXQgcGxhY2VEZXNjID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgIHBsYWNlRGVzYy50ZXh0Q29udGVudCA9IHBsYWNlT2JqLmRlc2NyaXB0aW9uO1xuXG4gICAgICAgIC8vIENvc3RcbiAgICAgICAgbGV0IHBsYWNlQ29zdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICBpZiAocGxhY2VPYmouY29zdCA9PT0gXCIwXCIgfHwgcGxhY2VPYmouY29zdCA9PT0gXCJGUkVFXCIpIHtcbiAgICAgICAgICAgIGxldCBjb3N0RGlzcGxheSA9IGBDb3N0OiAke3BsYWNlT2JqLmNvc3R9YDtcbiAgICAgICAgICAgIHBsYWNlQ29zdC50ZXh0Q29udGVudCA9IGNvc3REaXNwbGF5O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IGNvc3REaXNwbGF5ID0gYENvc3Q6ICQke3BsYWNlT2JqLmNvc3R9YDtcbiAgICAgICAgICAgIHBsYWNlQ29zdC50ZXh0Q29udGVudCA9IGNvc3REaXNwbGF5O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmV2aWV3XG4gICAgICAgIGxldCBwbGFjZVJldmlldyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICBpZiAocGxhY2VPYmoucmV2aWV3ID09PSBcIlwiKSB7XG4gICAgICAgICAgICBsZXQgcmV2aWV3RGlzcGxheSA9IFwiUmV2aWV3OiBObyByZXZpZXcgeWV0LlwiO1xuICAgICAgICAgICAgcGxhY2VSZXZpZXcudGV4dENvbnRlbnQgPSByZXZpZXdEaXNwbGF5O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IHJldmlld0Rpc3BsYXkgPSBgUmV2aWV3OiAke3BsYWNlT2JqLnJldmlld31gO1xuICAgICAgICAgICAgcGxhY2VSZXZpZXcudGV4dENvbnRlbnQgPSByZXZpZXdEaXNwbGF5O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2l0eVxuICAgICAgICBsZXQgcGxhY2VDaXR5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgIGxldCBjaXR5RGlzcGxheSA9IGBDaXR5OiAke3BsYWNlT2JqLmNpdHlOYW1lLm5hbWV9YDtcbiAgICAgICAgcGxhY2VDaXR5LnRleHRDb250ZW50ID0gY2l0eURpc3BsYXk7XG5cbiAgICAgICAgLy8gQWRkIGJ1dHRvbiBzZWN0aW9uXG4gICAgICAgIGxldCBidXR0b25Ib2xkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBidXR0b25Ib2xkZXIuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJidXR0b25faG9sZGVyXCIpO1xuXG4gICAgICAgIC8vIEVkaXQgYnV0dG9uXG4gICAgICAgIGxldCBlZGl0QnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgZWRpdEJ0bi50ZXh0Q29udGVudCA9IFwiRWRpdFwiO1xuICAgICAgICBlZGl0QnRuLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiZWRpdF9wbGFjZVwiKTtcbiAgICAgICAgZWRpdEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHNlY3Rpb25JZCA9IGV2ZW50LnRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUuaWQ7XG4gICAgICAgICAgICBsZXQgcGxhY2VJZCA9IHNlY3Rpb25JZC5zcGxpdChcIi0tXCIpWzFdO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocGxhY2VJZCk7XG4gICAgICAgICAgICBwbGFjZURhdGEuZ2V0UGxhY2UocGxhY2VJZClcbiAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICBwbGFjZUVkaXRGb3JtLmJ1aWxkRWRpdEZvcm0ocGxhY2VJZCwgcmVzcG9uc2UpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIERlbGV0ZSBidXR0b25cbiAgICAgICAgbGV0IGRlbGV0ZUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIGRlbGV0ZUJ0bi50ZXh0Q29udGVudCA9IFwiRGVsZXRlXCI7XG4gICAgICAgIGRlbGV0ZUJ0bi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImRlbGV0ZV9wbGFjZVwiKTtcbiAgICAgICAgZGVsZXRlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoY29uZmlybShcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgdGhpcyBlbnRyeT9cIikpIHtcbiAgICAgICAgICAgICAgICBsZXQgcGxhY2VJZCA9IHBsYWNlT2JqLmlkO1xuICAgICAgICAgICAgICAgIHBsYWNlRGF0YS5kZWxldGVQbGFjZShwbGFjZUlkKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHsgcGxhY2VMaXN0LmJ1aWxkTGlzdCgpfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBZGQgXCJFZGl0XCIgYW5kIFwiRGVsZXRlXCIgYnV0dG9ucyB0byBidXR0b24gaG9sZGVyXG4gICAgICAgIGJ1dHRvbkhvbGRlci5hcHBlbmRDaGlsZChlZGl0QnRuKTtcbiAgICAgICAgYnV0dG9uSG9sZGVyLmFwcGVuZENoaWxkKGRlbGV0ZUJ0bik7XG5cbiAgICAgICAgLy8gQXBwZW5kIGVhY2ggZWxlbWVudCB0byBwbGFjZVNlY3Rpb25cbiAgICAgICAgcGxhY2VTZWN0aW9uLmFwcGVuZENoaWxkKHBsYWNlTmFtZSk7XG4gICAgICAgIHBsYWNlU2VjdGlvbi5hcHBlbmRDaGlsZChwbGFjZURlc2MpO1xuICAgICAgICBwbGFjZVNlY3Rpb24uYXBwZW5kQ2hpbGQocGxhY2VDb3N0KTtcbiAgICAgICAgcGxhY2VTZWN0aW9uLmFwcGVuZENoaWxkKHBsYWNlUmV2aWV3KTtcbiAgICAgICAgcGxhY2VTZWN0aW9uLmFwcGVuZENoaWxkKHBsYWNlQ2l0eSk7XG4gICAgICAgIHBsYWNlU2VjdGlvbi5hcHBlbmRDaGlsZChidXR0b25Ib2xkZXIpO1xuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHBsYWNlU2VjdGlvbik7XG5cbiAgICAgICAgcmV0dXJuIHBsYWNlU2VjdGlvblxuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IHBsYWNlSXRlbTsiLCIvLyBDb250YWlucyBmZXRjaCBjYWxscyB0byBHRVQsIFBPU1QsIERFTEVURSwgYW5kIFBVVFxuXG5jb25zdCBwbGFjZURhdGEgPSB7XG5cbiAgICAvLyBHRVQgcGxhY2VzXG4gICAgZ2V0UGxhY2VzKCkge1xuICAgICAgICByZXR1cm4gZmV0Y2goXCJodHRwOi8vbG9jYWxob3N0OjgwODgvcGxhY2VzP19leHBhbmQ9Y2l0eU5hbWVcIilcbiAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgIH0sXG5cbiAgICAvLyBHRVQgY2l0aWVzXG4gICAgZ2V0Q2l0aWVzKCkge1xuICAgICAgICByZXR1cm4gZmV0Y2goXCJodHRwOi8vbG9jYWxob3N0OjgwODgvY2l0eU5hbWVzXCIpXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICB9LFxuXG4gICAgLy8gUE9TVFxuICAgIHBvc3ROZXdQbGFjZShwbGFjZVRvU2F2ZSkge1xuICAgICAgICByZXR1cm4gZmV0Y2goXCJodHRwOi8vbG9jYWxob3N0OjgwODgvcGxhY2VzXCIse1xuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHBsYWNlVG9TYXZlKVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLy8gREVMRVRFXG4gICAgZGVsZXRlUGxhY2UocGxhY2VJZCkge1xuICAgICAgICByZXR1cm4gZmV0Y2goYGh0dHA6Ly9sb2NhbGhvc3Q6ODA4OC9wbGFjZXMvJHtwbGFjZUlkfWAsIHtcbiAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCIsXG4gICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgLy8gUFVUXG4gICAgZ2V0UGxhY2UocGxhY2VJZCkge1xuICAgICAgICByZXR1cm4gZmV0Y2goYGh0dHA6Ly9sb2NhbGhvc3Q6ODA4OC9wbGFjZXMvJHtwbGFjZUlkfT9fZXhwYW5kPWNpdHlOYW1lYClcbiAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgIH0sXG5cbiAgICAvLyBOZWVkIHRoZSBpZCB0byBpZGVudGlmeSB3aGljaCBwbGFjZSBpdGVtIHdlIHdhbnQgdG8gZWRpdCwgYXMgd2VsbCBhcyB0aGUgbmV3IGRhdGEgd2Ugd2FudCB0byByZXBsYWNlIHRoZSBleGlzdGluZyBkYXRhIHdpdGguIFNvIHdlIG5lZWQgdHdvIGFyZ3VtZW50cyBmb3IgdGhlIG1ldGhvZC5cbiAgICBwdXRFeGlzdGluZ1BsYWNlKHBsYWNlSWQsIHBsYWNlVG9FZGl0KSB7XG4gICAgcmV0dXJuIGZldGNoKGBodHRwOi8vbG9jYWxob3N0OjgwODgvcGxhY2VzLyR7cGxhY2VJZH1gLCB7XG4gICAgICAgIG1ldGhvZDogXCJQVVRcIixcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcbiAgICAgICAgfSxcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkocGxhY2VUb0VkaXQpXG4gICAgfSlcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHBsYWNlRGF0YTsiLCIvLyBDcmVhdGVzIGZvcm0gdG8gZWRpdCBhIHBsYWNlXG5cbmltcG9ydCBwbGFjZURhdGEgZnJvbSBcIi4vcGxhY2VEYXRhXCJcbmltcG9ydCBwbGFjZUxpc3QgZnJvbSBcIi4vcGxhY2VMaXN0XCJcblxuY29uc3QgcGxhY2VFZGl0Rm9ybSA9IHtcblxuICAgIGJ1aWxkRWRpdEZvcm0ocGxhY2VJZCwgcGxhY2VUb0VkaXQpIHtcblxuICAgICAgICAvLyBDcmVhdGUgJiBhcHBlbmQgZm9ybSB3LyBzYXZlIGJ1dHRvblxuXG4gICAgICAgIC8vIERpc3BsYXkgXCJOYW1lXCIgKG5vdCBlZGl0YWJsZSlcbiAgICAgICAgbGV0IG5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDNcIik7XG4gICAgICAgIG5hbWUudGV4dENvbnRlbnQgPSBgJHtwbGFjZVRvRWRpdC5uYW1lfWA7XG5cbiAgICAgICAgLy8gRGlzcGxheSBcIkRlc2NyaXB0aW9uXCIgKG5vdCBlZGl0YWJsZSlcbiAgICAgICAgbGV0IGRlc2NyaXB0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgZGVzY3JpcHRpb24udGV4dENvbnRlbnQgPSBwbGFjZVRvRWRpdC5kZXNjcmlwdGlvbjtcblxuICAgICAgICAvLyBDcmVhdGUgXCJDb3N0XCIgZmllbGRcbiAgICAgICAgbGV0IGNvc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZmllbGRzZXRcIik7XG4gICAgICAgIGxldCBjb3N0TGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XG4gICAgICAgIGNvc3RMYWJlbC50ZXh0Q29udGVudCA9IFwiQ29zdFwiO1xuICAgICAgICBjb3N0TGFiZWwuc2V0QXR0cmlidXRlKFwiZm9yXCIsIFwicGxhY2VfY29zdFwiKTtcbiAgICAgICAgbGV0IGNvc3RJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICAgICAgY29zdElucHV0LnNldEF0dHJpYnV0ZShcImlkXCIsIFwicGxhY2VfY29zdFwiKTtcbiAgICAgICAgY29zdElucHV0LnNldEF0dHJpYnV0ZShcIm5hbWVcIiwgXCJwbGFjZV9jb3N0XCIpO1xuICAgICAgICBjb3N0SW5wdXQudmFsdWUgPSBwbGFjZVRvRWRpdC5jb3N0O1xuICAgICAgICBjb3N0LmFwcGVuZENoaWxkKGNvc3RMYWJlbCk7XG4gICAgICAgIGNvc3QuYXBwZW5kQ2hpbGQoY29zdElucHV0KTtcblxuICAgICAgICAvLyBTaG93IFwiQ2l0eVwiIChub3QgZWRpdGFibGUpXG4gICAgICAgIGxldCBjaXR5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgY2l0eS50ZXh0Q29udGVudCA9IGBDaXR5OiAke3BsYWNlVG9FZGl0LmNpdHlOYW1lLm5hbWV9YDtcblxuICAgICAgICAvLyBDcmVhdGUgXCJSZXZpZXdcIiBmaWVsZFxuICAgICAgICBsZXQgcmV2aWV3ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZpZWxkc2V0XCIpO1xuICAgICAgICBsZXQgcmV2aWV3TGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XG4gICAgICAgIHJldmlld0xhYmVsLnRleHRDb250ZW50ID0gXCJSZXZpZXdcIjtcbiAgICAgICAgcmV2aWV3TGFiZWwuc2V0QXR0cmlidXRlKFwiZm9yXCIsIFwicGxhY2VfcmV2aWV3XCIpO1xuICAgICAgICBsZXQgcmV2aWV3SW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGV4dGFyZWFcIik7XG4gICAgICAgIHJldmlld0lucHV0LnNldEF0dHJpYnV0ZShcImlkXCIsIFwicGxhY2VfcmV2aWV3XCIpO1xuICAgICAgICByZXZpZXdJbnB1dC5zZXRBdHRyaWJ1dGUoXCJuYW1lXCIsIFwicGxhY2VfcmV2aWV3XCIpO1xuICAgICAgICByZXZpZXdJbnB1dC52YWx1ZSA9IHBsYWNlVG9FZGl0LnJldmlldztcbiAgICAgICAgcmV2aWV3LmFwcGVuZENoaWxkKHJldmlld0xhYmVsKTtcbiAgICAgICAgcmV2aWV3LmFwcGVuZENoaWxkKHJldmlld0lucHV0KTtcblxuICAgICAgICAvLyBDcmVhdGUgXCJVcGRhdGVcIiBidXR0b25cbiAgICAgICAgbGV0IHVwZGF0ZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIilcbiAgICAgICAgdXBkYXRlQnV0dG9uLnRleHRDb250ZW50ID0gXCJVcGRhdGVcIjtcblxuICAgICAgICAvLyBBZGQgZXZlbnQgbGlzdGVuZXIgdG8gdGhlIFwiVXBkYXRlXCIgYnV0dG9uXG4gICAgICAgIC8vIFRha2VzIHRoZSBuZXcgdmFsdWVzIGluIHRoZSBpbnB1dCBmaWVsZHMgYW5kIGJ1aWxkcyBhbiBvYmplY3QgZm9yIHRoZSBwbGFjZSBpdGVtIHRvIGJlIGVkaXRlZC5cbiAgICAgICAgLy8gTWFrZSBhIEhUVFAgUFVUIHJlcXVlc3Qgd2hlcmUgd2UgdGFyZ2V0IHRoZSBwbGFjZSBpdGVtIHdlIHdhbnQgdG8gZWRpdCBieSBzcGVjaWZ5aW5nIHRoZSBpZCBpbiB0aGUgVVJMLlxuICAgICAgICAvLyBQYXNzIHRoZSBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBwbGFjZSBpdGVtIHdpdGggdGhlIG5ldyB2YWx1ZXMgYXMgZGF0YSBpbiBvdXIgSFRUUCByZXF1ZXN0LlxuXG4gICAgICAgIHVwZGF0ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGVkaXRlZFBsYWNlID0ge1xuICAgICAgICAgICAgICAgIG5hbWU6IHBsYWNlVG9FZGl0Lm5hbWUsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHBsYWNlVG9FZGl0LmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgICAgIGNvc3Q6IGNvc3RJbnB1dC52YWx1ZSxcbiAgICAgICAgICAgICAgICByZXZpZXc6IHJldmlld0lucHV0LnZhbHVlLFxuICAgICAgICAgICAgICAgIGNpdHlOYW1lSWQ6IHBsYWNlVG9FZGl0LmNpdHlOYW1lLmlkXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBwbGFjZXRvRWRpdElkID0gcGxhY2VUb0VkaXQuaWQ7XG4gICAgICAgICAgICBwbGFjZURhdGEucHV0RXhpc3RpbmdQbGFjZShwbGFjZXRvRWRpdElkLCBlZGl0ZWRQbGFjZSlcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBwbGFjZUxpc3QuYnVpbGRMaXN0KClcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gV2UgcGFzc2VkIGluIHRoZSBpZCBvZiB0aGUgc2VjdGlvbiBzbyB3ZSBrbm93IGV4YWN0bHkgd2hlcmUgdG8gYXBwZW5kIHRoZSBlZGl0IGZvcm0uXG4gICAgICAgIGxldCBwbGFjZVNlY3Rpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjcGxhY2UtLSR7cGxhY2VJZH1gKTtcblxuICAgICAgICAvLyBCZWNhdXNlIHdlIHdhbnQgdG8gcmVwbGFjZSB3aGF0IGlzIGN1cnJlbnRseSBpbiB0aGUgYXJ0aWNsZSBlbGVtZW50IHdpdGggdGhlIGVkaXQgZm9ybSwgd2UgY2xlYXIgb3V0IGFsbCBjaGlsZHJlbiBIVE1MIGVsZW1lbnRzIGluIG91ciB0YXJnZXRlZCBlbGVtZW50IGJlZm9yZSBhcHBlbmRpbmcgb3VyIGVkaXQgZm9ybSB0byBpdC5cbiAgICAgICAgd2hpbGUgKHBsYWNlU2VjdGlvbi5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICBwbGFjZVNlY3Rpb24ucmVtb3ZlQ2hpbGQocGxhY2VTZWN0aW9uLmZpcnN0Q2hpbGQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGxhY2VTZWN0aW9uLmFwcGVuZENoaWxkKG5hbWUpO1xuICAgICAgICBwbGFjZVNlY3Rpb24uYXBwZW5kQ2hpbGQoZGVzY3JpcHRpb24pO1xuICAgICAgICBwbGFjZVNlY3Rpb24uYXBwZW5kQ2hpbGQoY29zdCk7XG4gICAgICAgIHBsYWNlU2VjdGlvbi5hcHBlbmRDaGlsZChyZXZpZXcpO1xuICAgICAgICBwbGFjZVNlY3Rpb24uYXBwZW5kQ2hpbGQoY2l0eSk7XG4gICAgICAgIHBsYWNlU2VjdGlvbi5hcHBlbmRDaGlsZCh1cGRhdGVCdXR0b24pO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IHBsYWNlRWRpdEZvcm07IiwiLy8gQ3JlYXRlcyBmb3JtIHRvIHNhdmUgYSBuZXcgcGxhY2UgaXRlbSB0byBkYXRhYmFzZVxuXG5pbXBvcnQgZXZlbnRMaXN0ZW5lcnMgZnJvbSBcIi4vZXZlbnRMaXN0ZW5lcnNcIlxuaW1wb3J0IHBsYWNlRGF0YSBmcm9tIFwiLi9wbGFjZURhdGFcIjtcblxuY29uc3QgcGxhY2VGb3JtID0ge1xuXG4gICAgYnVpbGRGb3JtKCkge1xuXG4gICAgICAgIC8vIENyZWF0ZSBjb250YWluZXIsIHRpdGxlLCBldGMuXG4gICAgICAgIGxldCBvdXRwdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI291dHB1dFwiKTtcbiAgICAgICAgbGV0IGZvcm1Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBmb3JtQ29udGFpbmVyLnNldEF0dHJpYnV0ZShcImlkXCIsIFwiZm9ybV9jb250YWluZXJcIik7XG4gICAgICAgIGxldCBmb3JtQ29udGFpbmVyVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDNcIik7XG4gICAgICAgIGZvcm1Db250YWluZXJUaXRsZS50ZXh0Q29udGVudCA9IFwiQWRkIE5ldyBQbGFjZVwiO1xuICAgICAgICBmb3JtQ29udGFpbmVyLmFwcGVuZENoaWxkKGZvcm1Db250YWluZXJUaXRsZSk7XG5cbiAgICAgICAgLy8gQ3JlYXRlIFwiTmFtZVwiIGZpZWxkXG4gICAgICAgIGxldCBuYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZpZWxkc2V0XCIpO1xuICAgICAgICBsZXQgbmFtZUxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xuICAgICAgICBuYW1lTGFiZWwudGV4dENvbnRlbnQgPSBcIk5hbWVcIjtcbiAgICAgICAgbmFtZUxhYmVsLnNldEF0dHJpYnV0ZShcImZvclwiLCBcInBsYWNlX25hbWVcIik7XG4gICAgICAgIGxldCBuYW1lSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgICAgIG5hbWVJbnB1dC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcInBsYWNlX25hbWVcIik7XG4gICAgICAgIG5hbWVJbnB1dC5zZXRBdHRyaWJ1dGUoXCJuYW1lXCIsIFwicGxhY2VfbmFtZVwiKTtcbiAgICAgICAgbmFtZS5hcHBlbmRDaGlsZChuYW1lTGFiZWwpO1xuICAgICAgICBuYW1lLmFwcGVuZENoaWxkKG5hbWVJbnB1dCk7XG5cbiAgICAgICAgLy8gQ3JlYXRlIFwiRGVzY3JpcHRpb25cIiBmaWVsZFxuICAgICAgICBsZXQgZGVzY3JpcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZmllbGRzZXRcIik7XG4gICAgICAgIGxldCBkZXNjcmlwdGlvbkxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xuICAgICAgICBkZXNjcmlwdGlvbkxhYmVsLnRleHRDb250ZW50ID0gXCJEZXNjcmlwdGlvblwiO1xuICAgICAgICBkZXNjcmlwdGlvbkxhYmVsLnNldEF0dHJpYnV0ZShcImZvclwiLCBcInBsYWNlX2Rlc2NyaXB0aW9uXCIpO1xuICAgICAgICBsZXQgZGVzY3JpcHRpb25JbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZXh0YXJlYVwiKTtcbiAgICAgICAgZGVzY3JpcHRpb25JbnB1dC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcInBsYWNlX2Rlc2NyaXB0aW9uXCIpO1xuICAgICAgICBkZXNjcmlwdGlvbklucHV0LnNldEF0dHJpYnV0ZShcIm5hbWVcIiwgXCJwbGFjZV9kZXNjcmlwdGlvblwiKTtcbiAgICAgICAgZGVzY3JpcHRpb24uYXBwZW5kQ2hpbGQoZGVzY3JpcHRpb25MYWJlbCk7XG4gICAgICAgIGRlc2NyaXB0aW9uLmFwcGVuZENoaWxkKGRlc2NyaXB0aW9uSW5wdXQpO1xuXG4gICAgICAgIC8vIENyZWF0ZSBcIkNvc3RcIiBmaWVsZFxuICAgICAgICBsZXQgY29zdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmaWVsZHNldFwiKTtcbiAgICAgICAgbGV0IGNvc3RMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcbiAgICAgICAgY29zdExhYmVsLnRleHRDb250ZW50ID0gXCJDb3N0XCI7XG4gICAgICAgIGNvc3RMYWJlbC5zZXRBdHRyaWJ1dGUoXCJmb3JcIiwgXCJwbGFjZV9jb3N0XCIpO1xuICAgICAgICBsZXQgY29zdElucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgICAgICBjb3N0SW5wdXQuc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJwbGFjZV9jb3N0XCIpO1xuICAgICAgICBjb3N0SW5wdXQuc2V0QXR0cmlidXRlKFwibmFtZVwiLCBcInBsYWNlX2Nvc3RcIik7XG4gICAgICAgIGNvc3QuYXBwZW5kQ2hpbGQoY29zdExhYmVsKTtcbiAgICAgICAgY29zdC5hcHBlbmRDaGlsZChjb3N0SW5wdXQpO1xuXG4gICAgICAgIC8vIENyZWF0ZSBcIkNpdHlcIiBkcm9wLWRvd25cbiAgICAgICAgbGV0IGNpdHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZmllbGRzZXRcIik7XG4gICAgICAgIGxldCBjaXR5TGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XG4gICAgICAgIGNpdHlMYWJlbC50ZXh0Q29udGVudCA9IFwiQ2l0eVwiO1xuICAgICAgICBsZXQgY2l0eUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNlbGVjdFwiKTtcbiAgICAgICAgY2l0eUlucHV0LnNldEF0dHJpYnV0ZShcImlkXCIsIFwicGxhY2VfY2l0eVwiKTtcbiAgICAgICAgY2l0eUlucHV0LnNldEF0dHJpYnV0ZShcIm5hbWVcIiwgXCJwbGFjZV9jaXR5XCIpO1xuXG4gICAgICAgIC8vIGZldGNoIGNpdGllcyBhbmQgYnVpbGQgb3B0aW9uc1xuICAgICAgICBwbGFjZURhdGEuZ2V0Q2l0aWVzKClcbiAgICAgICAgLnRoZW4oY2l0aWVzID0+IHtcbiAgICAgICAgICAgIGNpdGllcy5mb3JFYWNoKGNpdHkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBjaXR5T3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcbiAgICAgICAgICAgICAgICBjaXR5T3B0aW9uLnRleHRDb250ZW50ID0gY2l0eS5uYW1lO1xuICAgICAgICAgICAgICAgIGNpdHlPcHRpb24uc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgY2l0eS5pZCk7XG4gICAgICAgICAgICAgICAgY2l0eUlucHV0LmFwcGVuZENoaWxkKGNpdHlPcHRpb24pO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBsZXQgY2l0eU9wdGlvbnMgPSBgXG4gICAgICAgIC8vICAgICA8b3B0aW9uIHZhbHVlPVwiMVwiPkxvcyBBbmdlbGVzPC9vcHRpb24+XG4gICAgICAgIC8vICAgICA8b3B0aW9uIHZhbHVlPVwiMlwiPlNhbiBGcmFuY2lzY288L29wdGlvbj5cbiAgICAgICAgLy8gICAgIDxvcHRpb24gdmFsdWU9XCIzXCI+VG9yb250bzwvb3B0aW9uPlxuICAgICAgICAvLyBgXG4gICAgICAgIC8vIGNpdHlJbnB1dC5pbm5lckhUTUwgPSBjaXR5T3B0aW9ucztcbiAgICAgICAgY2l0eS5hcHBlbmRDaGlsZChjaXR5TGFiZWwpO1xuICAgICAgICBjaXR5LmFwcGVuZENoaWxkKGNpdHlJbnB1dCk7XG5cbiAgICAgICAgLy8gQ3JlYXRlIFwiU2F2ZVwiIGJ1dHRvbiBhbmQgYXR0YWNoIGV2ZW50IGxpc3RlbmVyXG4gICAgICAgIGxldCBzYXZlQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgc2F2ZUJ0bi50ZXh0Q29udGVudCA9IFwiU2F2ZSBQbGFjZVwiO1xuICAgICAgICBzYXZlQnRuLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwic2F2ZV9uZXdfcGxhY2VcIik7XG5cbiAgICAgICAgLy8gQXR0YWNoIGV2ZW50IGxpc3RlbmVyIHRvIGJ1dHRvbiwgdG8gUE9TVCB0byBkYXRhYmFzZVxuICAgICAgICBzYXZlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBldmVudExpc3RlbmVycy5wb3N0UGxhY2UpO1xuXG4gICAgICAgIC8vIEFwcGVuZCBlYWNoIGZpZWxkL2J1dHRvbiB0byBmb3JtIGNvbnRhaW5lclxuXG4gICAgICAgIGZvcm1Db250YWluZXIuYXBwZW5kQ2hpbGQobmFtZSk7XG4gICAgICAgIGZvcm1Db250YWluZXIuYXBwZW5kQ2hpbGQoZGVzY3JpcHRpb24pO1xuICAgICAgICBmb3JtQ29udGFpbmVyLmFwcGVuZENoaWxkKGNvc3QpO1xuICAgICAgICBmb3JtQ29udGFpbmVyLmFwcGVuZENoaWxkKGNpdHkpO1xuICAgICAgICBmb3JtQ29udGFpbmVyLmFwcGVuZENoaWxkKHNhdmVCdG4pO1xuXG4gICAgICAgIG91dHB1dC5hcHBlbmRDaGlsZChmb3JtQ29udGFpbmVyKTtcbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgcGxhY2VGb3JtOyIsIi8vIEJ1aWxkcyBvdXQgcGxhY2UgbGlzdCBhbmQgYXBwZW5kcyB0byBET01cblxuaW1wb3J0IHBsYWNlRGF0YSBmcm9tIFwiLi9wbGFjZURhdGFcIjtcbmltcG9ydCBwbGFjZSBmcm9tIFwiLi9wbGFjZVwiXG5pbXBvcnQgcGxhY2VGb3JtIGZyb20gXCIuL3BsYWNlRm9ybVwiO1xuLy8gaW1wb3J0IGV2ZW50TGlzdGVuZXJzIGZyb20gXCIuL2V2ZW50TGlzdGVuZXJzXCJcblxuY29uc3QgcGxhY2VMaXN0ID0ge1xuXG4gICAgYnVpbGRMaXN0KCkge1xuXG4gICAgICAgIC8vIENyZWF0ZSBjb250YWluZXIsIHRpdGxlLCBldGMuXG4gICAgICAgIGxldCBvdXRwdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI291dHB1dFwiKTtcbiAgICAgICAgb3V0cHV0LmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICAgICAgbGV0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgxXCIpO1xuICAgICAgICB0aXRsZS50ZXh0Q29udGVudCA9IFwiVGhlIFRlcm5hcnkgVHJhdmVsZXJcIjtcbiAgICAgICAgb3V0cHV0LmFwcGVuZENoaWxkKHRpdGxlKTtcblxuICAgICAgICBsZXQgbGlzdENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGxpc3RDb250YWluZXIuc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJsaXN0X2NvbnRhaW5lclwiKTtcblxuICAgICAgICAvLyBBZGQgZm9ybSBoZXJlXG4gICAgICAgIHBsYWNlRm9ybS5idWlsZEZvcm0oKTtcblxuICAgICAgICAvLyBDcmVhdGUgZG9jIGZyYWcgdG8gaG9sZCBlYWNoIHBsYWNlIGl0ZW1cbiAgICAgICAgbGV0IHBsYWNlRG9jRnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblxuICAgICAgICAvLyBHRVQgcGxhY2UgZGF0YVxuICAgICAgICBwbGFjZURhdGEuZ2V0UGxhY2VzKClcbiAgICAgICAgLnRoZW4oYWxsUGxhY2VzID0+IHtcbiAgICAgICAgICAgIGFsbFBsYWNlcy5mb3JFYWNoKHBsYWNlSXRlbSA9PiB7XG4gICAgICAgICAgICAvLyBmb3JFYWNoIHBsYWNlLCBjYWxsIGZ1bmN0aW9uIHRvIGJ1aWxkIEhUTUwgZm9yIGVhY2ggb25lIGFuZCBhcHBlbmQgZWFjaCB0byBkb2MgZnJhZ1xuICAgICAgICAgICAgICAgIGxldCBuZXdQbGFjZSA9IHBsYWNlLmJ1aWxkUGxhY2UocGxhY2VJdGVtKTsgLy8gbmV3UGxhY2UgPSBwbGFjZVNlY3Rpb25cbiAgICAgICAgICAgICAgICBwbGFjZURvY0ZyYWcuYXBwZW5kQ2hpbGQobmV3UGxhY2UpO1xuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgLy8gQXBwZW5kIHRoZSBkb2MgZnJhZyB0byB0aGUgRE9NXG4gICAgICAgICAgICBsaXN0Q29udGFpbmVyLmFwcGVuZENoaWxkKHBsYWNlRG9jRnJhZyk7XG4gICAgICAgIH0pXG5cbiAgICAgICAgb3V0cHV0LmFwcGVuZENoaWxkKGxpc3RDb250YWluZXIpO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IHBsYWNlTGlzdDsiXX0=
