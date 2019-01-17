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
    let reviewDisplay = `Review: ${placeObj.review}`;
    placeReview.textContent = reviewDisplay; // City

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
      let placeId = sectionId.split("--")[1];
      console.log(placeId);

      _placeData.default.getPlace(placeId).then(response => {
        _placeEditForm.default.buildEditForm(placeId, response);
      });
    }); // Delete button

    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.setAttribute("class", "delete_place");
    deleteBtn.addEventListener("click", () => {
      let placeId = placeObj.id;

      _placeData.default.deletePlace(placeId).then(() => {
        _placeList.default.buildList();
      });
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
  // GET
  getPlaces() {
    return fetch("http://localhost:8088/places?_expand=cityName").then(response => response.json());
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
    cityInput.setAttribute("name", "place_city");
    let cityOptions = `
            <option value="1">Los Angeles</option>
            <option value="2">San Francisco</option>
            <option value="3">Toronto</option>
        `;
    cityInput.innerHTML = cityOptions;
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

},{"./eventListeners":1}],7:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zY3JpcHRzL2V2ZW50TGlzdGVuZXJzLmpzIiwiLi4vc2NyaXB0cy9tYWluLmpzIiwiLi4vc2NyaXB0cy9wbGFjZS5qcyIsIi4uL3NjcmlwdHMvcGxhY2VEYXRhLmpzIiwiLi4vc2NyaXB0cy9wbGFjZUVkaXRGb3JtLmpzIiwiLi4vc2NyaXB0cy9wbGFjZUZvcm0uanMiLCIuLi9zY3JpcHRzL3BsYWNlTGlzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7QUNFQTs7QUFDQTs7OztBQUhBO0FBS0EsTUFBTSxjQUFjLEdBQUc7QUFFbkI7QUFDQSxFQUFBLFNBQVMsR0FBRztBQUVSO0FBQ0EsUUFBSSxjQUFjLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsYUFBdkIsRUFBc0MsS0FBM0Q7QUFDQSxRQUFJLHFCQUFxQixHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLG9CQUF2QixFQUE2QyxLQUF6RTtBQUNBLFFBQUksY0FBYyxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLGFBQXZCLEVBQXNDLEtBQTNEO0FBQ0EsUUFBSSxjQUFjLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsYUFBdkIsRUFBc0MsS0FBM0QsQ0FOUSxDQVFSOztBQUNBLFFBQUksV0FBVyxHQUFHO0FBQ2QsTUFBQSxJQUFJLEVBQUUsY0FEUTtBQUVkLE1BQUEsV0FBVyxFQUFFLHFCQUZDO0FBR2QsTUFBQSxJQUFJLEVBQUUsY0FIUTtBQUlkLE1BQUEsTUFBTSxFQUFFLEVBSk07QUFLZCxNQUFBLFVBQVUsRUFBRSxNQUFNLENBQUMsY0FBRCxDQUxKLENBUWxCO0FBQ0E7O0FBVGtCLEtBQWxCOztBQVVBLHVCQUFVLFlBQVYsQ0FBdUIsV0FBdkIsRUFDQyxJQURELENBQ00sTUFBTTtBQUNSLHlCQUFVLFNBQVY7QUFDSCxLQUhEO0FBSUgsR0ExQmtCLENBNEJuQjtBQUVBOzs7QUE5Qm1CLENBQXZCO2VBa0NlLGM7Ozs7OztBQ3ZDZjs7OztBQUVBO0FBQ0EsbUJBQVUsU0FBVjs7Ozs7Ozs7OztBQ0RBOztBQUNBOztBQUNBOzs7O0FBSkE7QUFNQSxNQUFNLFNBQVMsR0FBRztBQUVkLEVBQUEsVUFBVSxDQUFDLFFBQUQsRUFBVztBQUFpQjtBQUVsQztBQUVBO0FBQ0EsUUFBSSxZQUFZLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsU0FBdkIsQ0FBbkI7QUFDQSxJQUFBLFlBQVksQ0FBQyxZQUFiLENBQTBCLE9BQTFCLEVBQW1DLGVBQW5DO0FBQ0EsSUFBQSxZQUFZLENBQUMsWUFBYixDQUEwQixJQUExQixFQUFpQyxVQUFTLFFBQVEsQ0FBQyxFQUFHLEVBQXRELEVBUGlCLENBU2pCOztBQUNBLFFBQUksU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLElBQXZCLENBQWhCO0FBQ0EsSUFBQSxTQUFTLENBQUMsV0FBVixHQUF3QixRQUFRLENBQUMsSUFBakMsQ0FYaUIsQ0FZakI7QUFFQTs7QUFDQSxRQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixHQUF2QixDQUFoQjtBQUNBLElBQUEsU0FBUyxDQUFDLFdBQVYsR0FBd0IsUUFBUSxDQUFDLFdBQWpDLENBaEJpQixDQWtCakI7O0FBQ0EsUUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsR0FBdkIsQ0FBaEI7O0FBQ0EsUUFBSSxRQUFRLENBQUMsSUFBVCxLQUFrQixHQUFsQixJQUF5QixRQUFRLENBQUMsSUFBVCxLQUFrQixNQUEvQyxFQUF1RDtBQUNuRCxVQUFJLFdBQVcsR0FBSSxTQUFRLFFBQVEsQ0FBQyxJQUFLLEVBQXpDO0FBQ0EsTUFBQSxTQUFTLENBQUMsV0FBVixHQUF3QixXQUF4QjtBQUNILEtBSEQsTUFJSztBQUNELFVBQUksV0FBVyxHQUFJLFVBQVMsUUFBUSxDQUFDLElBQUssRUFBMUM7QUFDQSxNQUFBLFNBQVMsQ0FBQyxXQUFWLEdBQXdCLFdBQXhCO0FBQ0gsS0EzQmdCLENBNkJqQjs7O0FBQ0EsUUFBSSxXQUFXLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsR0FBdkIsQ0FBbEI7QUFDQSxRQUFJLGFBQWEsR0FBSSxXQUFVLFFBQVEsQ0FBQyxNQUFPLEVBQS9DO0FBQ0EsSUFBQSxXQUFXLENBQUMsV0FBWixHQUEwQixhQUExQixDQWhDaUIsQ0FrQ2pCOztBQUNBLFFBQUksU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLEdBQXZCLENBQWhCO0FBQ0EsUUFBSSxXQUFXLEdBQUksU0FBUSxRQUFRLENBQUMsUUFBVCxDQUFrQixJQUFLLEVBQWxEO0FBQ0EsSUFBQSxTQUFTLENBQUMsV0FBVixHQUF3QixXQUF4QixDQXJDaUIsQ0F1Q2pCOztBQUNBLFFBQUksWUFBWSxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBQW5CO0FBQ0EsSUFBQSxZQUFZLENBQUMsWUFBYixDQUEwQixPQUExQixFQUFtQyxlQUFuQyxFQXpDaUIsQ0EyQ2pCOztBQUNBLFFBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLFFBQXZCLENBQWQ7QUFDQSxJQUFBLE9BQU8sQ0FBQyxXQUFSLEdBQXNCLE1BQXRCO0FBQ0EsSUFBQSxPQUFPLENBQUMsWUFBUixDQUFxQixPQUFyQixFQUE4QixZQUE5QjtBQUNBLElBQUEsT0FBTyxDQUFDLGdCQUFSLENBQXlCLE9BQXpCLEVBQWtDLE1BQU07QUFDcEMsVUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDLE1BQU4sQ0FBYSxVQUFiLENBQXdCLFVBQXhCLENBQW1DLEVBQW5EO0FBQ0EsVUFBSSxPQUFPLEdBQUcsU0FBUyxDQUFDLEtBQVYsQ0FBZ0IsSUFBaEIsRUFBc0IsQ0FBdEIsQ0FBZDtBQUNBLE1BQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxPQUFaOztBQUNBLHlCQUFVLFFBQVYsQ0FBbUIsT0FBbkIsRUFDQyxJQURELENBQ00sUUFBUSxJQUFJO0FBQ2QsK0JBQWMsYUFBZCxDQUE0QixPQUE1QixFQUFxQyxRQUFyQztBQUNILE9BSEQ7QUFJSCxLQVJELEVBL0NpQixDQXlEakI7O0FBQ0EsUUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBaEI7QUFDQSxJQUFBLFNBQVMsQ0FBQyxXQUFWLEdBQXdCLFFBQXhCO0FBQ0EsSUFBQSxTQUFTLENBQUMsWUFBVixDQUF1QixPQUF2QixFQUFnQyxjQUFoQztBQUNBLElBQUEsU0FBUyxDQUFDLGdCQUFWLENBQTJCLE9BQTNCLEVBQW9DLE1BQU07QUFDdEMsVUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLEVBQXZCOztBQUNBLHlCQUFVLFdBQVYsQ0FBc0IsT0FBdEIsRUFDQyxJQURELENBQ00sTUFBTTtBQUNSLDJCQUFVLFNBQVY7QUFDSCxPQUhEO0FBSUgsS0FORCxFQTdEaUIsQ0FxRWpCOztBQUNBLElBQUEsWUFBWSxDQUFDLFdBQWIsQ0FBeUIsT0FBekI7QUFDQSxJQUFBLFlBQVksQ0FBQyxXQUFiLENBQXlCLFNBQXpCLEVBdkVpQixDQXlFakI7O0FBQ0EsSUFBQSxZQUFZLENBQUMsV0FBYixDQUF5QixTQUF6QjtBQUNBLElBQUEsWUFBWSxDQUFDLFdBQWIsQ0FBeUIsU0FBekI7QUFDQSxJQUFBLFlBQVksQ0FBQyxXQUFiLENBQXlCLFNBQXpCO0FBQ0EsSUFBQSxZQUFZLENBQUMsV0FBYixDQUF5QixXQUF6QjtBQUNBLElBQUEsWUFBWSxDQUFDLFdBQWIsQ0FBeUIsU0FBekI7QUFDQSxJQUFBLFlBQVksQ0FBQyxXQUFiLENBQXlCLFlBQXpCLEVBL0VpQixDQWlGakI7O0FBRUEsV0FBTyxZQUFQO0FBRUg7O0FBdkZhLENBQWxCO2VBMkZlLFM7Ozs7Ozs7Ozs7QUNqR2Y7QUFFQSxNQUFNLFNBQVMsR0FBRztBQUVkO0FBQ0EsRUFBQSxTQUFTLEdBQUc7QUFDUixXQUFPLEtBQUssQ0FBQywrQ0FBRCxDQUFMLENBQ04sSUFETSxDQUNELFFBQVEsSUFBSSxRQUFRLENBQUMsSUFBVCxFQURYLENBQVA7QUFFSCxHQU5hOztBQVFkO0FBQ0EsRUFBQSxZQUFZLENBQUMsV0FBRCxFQUFjO0FBQ3RCLFdBQU8sS0FBSyxDQUFDLDhCQUFELEVBQWdDO0FBQ3hDLE1BQUEsTUFBTSxFQUFFLE1BRGdDO0FBRXhDLE1BQUEsT0FBTyxFQUFFO0FBQ0wsd0JBQWdCO0FBRFgsT0FGK0I7QUFLeEMsTUFBQSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQUwsQ0FBZSxXQUFmO0FBTGtDLEtBQWhDLENBQVo7QUFPSCxHQWpCYTs7QUFtQmQ7QUFDQSxFQUFBLFdBQVcsQ0FBQyxPQUFELEVBQVU7QUFDakIsV0FBTyxLQUFLLENBQUUsZ0NBQStCLE9BQVEsRUFBekMsRUFBNEM7QUFDdEQsTUFBQSxNQUFNLEVBQUUsUUFEOEM7QUFFdEQsTUFBQSxPQUFPLEVBQUU7QUFDTCx3QkFBZ0I7QUFEWDtBQUY2QyxLQUE1QyxDQUFaO0FBTUgsR0EzQmE7O0FBNkJkO0FBQ0EsRUFBQSxRQUFRLENBQUMsT0FBRCxFQUFVO0FBQ2QsV0FBTyxLQUFLLENBQUUsZ0NBQStCLE9BQVEsbUJBQXpDLENBQUwsQ0FDTixJQURNLENBQ0QsUUFBUSxJQUFJLFFBQVEsQ0FBQyxJQUFULEVBRFgsQ0FBUDtBQUVILEdBakNhOztBQW1DZDtBQUNBLEVBQUEsZ0JBQWdCLENBQUMsT0FBRCxFQUFVLFdBQVYsRUFBdUI7QUFDdkMsV0FBTyxLQUFLLENBQUUsZ0NBQStCLE9BQVEsRUFBekMsRUFBNEM7QUFDcEQsTUFBQSxNQUFNLEVBQUUsS0FENEM7QUFFcEQsTUFBQSxPQUFPLEVBQUU7QUFDTCx3QkFBZ0I7QUFEWCxPQUYyQztBQUtwRCxNQUFBLElBQUksRUFBRSxJQUFJLENBQUMsU0FBTCxDQUFlLFdBQWY7QUFMOEMsS0FBNUMsQ0FBWjtBQU9DOztBQTVDYSxDQUFsQjtlQStDZSxTOzs7Ozs7Ozs7OztBQy9DZjs7QUFDQTs7OztBQUhBO0FBS0EsTUFBTSxhQUFhLEdBQUc7QUFFbEIsRUFBQSxhQUFhLENBQUMsT0FBRCxFQUFVLFdBQVYsRUFBdUI7QUFFaEM7QUFFQTtBQUNBLFFBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLElBQXZCLENBQVg7QUFDQSxJQUFBLElBQUksQ0FBQyxXQUFMLEdBQW9CLEdBQUUsV0FBVyxDQUFDLElBQUssRUFBdkMsQ0FOZ0MsQ0FRaEM7O0FBQ0EsUUFBSSxXQUFXLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBbEI7QUFDQSxJQUFBLFdBQVcsQ0FBQyxXQUFaLEdBQTBCLFdBQVcsQ0FBQyxXQUF0QyxDQVZnQyxDQVloQzs7QUFDQSxRQUFJLElBQUksR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixVQUF2QixDQUFYO0FBQ0EsUUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsT0FBdkIsQ0FBaEI7QUFDQSxJQUFBLFNBQVMsQ0FBQyxXQUFWLEdBQXdCLE1BQXhCO0FBQ0EsSUFBQSxTQUFTLENBQUMsWUFBVixDQUF1QixLQUF2QixFQUE4QixZQUE5QjtBQUNBLFFBQUksU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLE9BQXZCLENBQWhCO0FBQ0EsSUFBQSxTQUFTLENBQUMsWUFBVixDQUF1QixJQUF2QixFQUE2QixZQUE3QjtBQUNBLElBQUEsU0FBUyxDQUFDLFlBQVYsQ0FBdUIsTUFBdkIsRUFBK0IsWUFBL0I7QUFDQSxJQUFBLFNBQVMsQ0FBQyxLQUFWLEdBQWtCLFdBQVcsQ0FBQyxJQUE5QjtBQUNBLElBQUEsSUFBSSxDQUFDLFdBQUwsQ0FBaUIsU0FBakI7QUFDQSxJQUFBLElBQUksQ0FBQyxXQUFMLENBQWlCLFNBQWpCLEVBdEJnQyxDQXdCaEM7O0FBQ0EsUUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBWDtBQUNBLElBQUEsSUFBSSxDQUFDLFdBQUwsR0FBb0IsU0FBUSxXQUFXLENBQUMsUUFBWixDQUFxQixJQUFLLEVBQXRELENBMUJnQyxDQTRCaEM7O0FBQ0EsUUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsVUFBdkIsQ0FBYjtBQUNBLFFBQUksV0FBVyxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLE9BQXZCLENBQWxCO0FBQ0EsSUFBQSxXQUFXLENBQUMsV0FBWixHQUEwQixRQUExQjtBQUNBLElBQUEsV0FBVyxDQUFDLFlBQVosQ0FBeUIsS0FBekIsRUFBZ0MsY0FBaEM7QUFDQSxRQUFJLFdBQVcsR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixVQUF2QixDQUFsQjtBQUNBLElBQUEsV0FBVyxDQUFDLFlBQVosQ0FBeUIsSUFBekIsRUFBK0IsY0FBL0I7QUFDQSxJQUFBLFdBQVcsQ0FBQyxZQUFaLENBQXlCLE1BQXpCLEVBQWlDLGNBQWpDO0FBQ0EsSUFBQSxXQUFXLENBQUMsS0FBWixHQUFvQixXQUFXLENBQUMsTUFBaEM7QUFDQSxJQUFBLE1BQU0sQ0FBQyxXQUFQLENBQW1CLFdBQW5CO0FBQ0EsSUFBQSxNQUFNLENBQUMsV0FBUCxDQUFtQixXQUFuQixFQXRDZ0MsQ0F3Q2hDOztBQUNBLFFBQUksWUFBWSxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLFFBQXZCLENBQW5CO0FBQ0EsSUFBQSxZQUFZLENBQUMsV0FBYixHQUEyQixRQUEzQixDQTFDZ0MsQ0E0Q2hDO0FBQ0E7QUFDQTtBQUNBOztBQUVBLElBQUEsWUFBWSxDQUFDLGdCQUFiLENBQThCLE9BQTlCLEVBQXVDLE1BQU07QUFDekMsVUFBSSxXQUFXLEdBQUc7QUFDZCxRQUFBLElBQUksRUFBRSxXQUFXLENBQUMsSUFESjtBQUVkLFFBQUEsV0FBVyxFQUFFLFdBQVcsQ0FBQyxXQUZYO0FBR2QsUUFBQSxJQUFJLEVBQUUsU0FBUyxDQUFDLEtBSEY7QUFJZCxRQUFBLE1BQU0sRUFBRSxXQUFXLENBQUMsS0FKTjtBQUtkLFFBQUEsVUFBVSxFQUFFLFdBQVcsQ0FBQyxRQUFaLENBQXFCO0FBTG5CLE9BQWxCO0FBUUEsVUFBSSxhQUFhLEdBQUcsV0FBVyxDQUFDLEVBQWhDOztBQUNBLHlCQUFVLGdCQUFWLENBQTJCLGFBQTNCLEVBQTBDLFdBQTFDLEVBQ0MsSUFERCxDQUNNLE1BQU07QUFDUiwyQkFBVSxTQUFWO0FBQ0gsT0FIRDtBQUlILEtBZEQsRUFqRGdDLENBaUVoQzs7QUFDQSxRQUFJLFlBQVksR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF3QixXQUFVLE9BQVEsRUFBMUMsQ0FBbkIsQ0FsRWdDLENBb0VoQzs7QUFDQSxXQUFPLFlBQVksQ0FBQyxVQUFwQixFQUFnQztBQUM1QixNQUFBLFlBQVksQ0FBQyxXQUFiLENBQXlCLFlBQVksQ0FBQyxVQUF0QztBQUNIOztBQUVELElBQUEsWUFBWSxDQUFDLFdBQWIsQ0FBeUIsSUFBekI7QUFDQSxJQUFBLFlBQVksQ0FBQyxXQUFiLENBQXlCLFdBQXpCO0FBQ0EsSUFBQSxZQUFZLENBQUMsV0FBYixDQUF5QixJQUF6QjtBQUNBLElBQUEsWUFBWSxDQUFDLFdBQWIsQ0FBeUIsTUFBekI7QUFDQSxJQUFBLFlBQVksQ0FBQyxXQUFiLENBQXlCLElBQXpCO0FBQ0EsSUFBQSxZQUFZLENBQUMsV0FBYixDQUF5QixZQUF6QjtBQUVIOztBQWxGaUIsQ0FBdEI7ZUFzRmUsYTs7Ozs7Ozs7Ozs7QUN6RmY7Ozs7QUFGQTtBQUlBLE1BQU0sU0FBUyxHQUFHO0FBRWQsRUFBQSxTQUFTLEdBQUc7QUFFUjtBQUNBLFFBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLFNBQXZCLENBQWI7QUFDQSxRQUFJLGFBQWEsR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUFwQjtBQUNBLElBQUEsYUFBYSxDQUFDLFlBQWQsQ0FBMkIsSUFBM0IsRUFBaUMsZ0JBQWpDO0FBQ0EsUUFBSSxrQkFBa0IsR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixJQUF2QixDQUF6QjtBQUNBLElBQUEsa0JBQWtCLENBQUMsV0FBbkIsR0FBaUMsZUFBakM7QUFDQSxJQUFBLGFBQWEsQ0FBQyxXQUFkLENBQTBCLGtCQUExQixFQVJRLENBVVI7O0FBQ0EsUUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsVUFBdkIsQ0FBWDtBQUNBLFFBQUksU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLE9BQXZCLENBQWhCO0FBQ0EsSUFBQSxTQUFTLENBQUMsV0FBVixHQUF3QixNQUF4QjtBQUNBLElBQUEsU0FBUyxDQUFDLFlBQVYsQ0FBdUIsS0FBdkIsRUFBOEIsWUFBOUI7QUFDQSxRQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixPQUF2QixDQUFoQjtBQUNBLElBQUEsU0FBUyxDQUFDLFlBQVYsQ0FBdUIsSUFBdkIsRUFBNkIsWUFBN0I7QUFDQSxJQUFBLFNBQVMsQ0FBQyxZQUFWLENBQXVCLE1BQXZCLEVBQStCLFlBQS9CO0FBQ0EsSUFBQSxJQUFJLENBQUMsV0FBTCxDQUFpQixTQUFqQjtBQUNBLElBQUEsSUFBSSxDQUFDLFdBQUwsQ0FBaUIsU0FBakIsRUFuQlEsQ0FxQlI7O0FBQ0EsUUFBSSxXQUFXLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsVUFBdkIsQ0FBbEI7QUFDQSxRQUFJLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLE9BQXZCLENBQXZCO0FBQ0EsSUFBQSxnQkFBZ0IsQ0FBQyxXQUFqQixHQUErQixhQUEvQjtBQUNBLElBQUEsZ0JBQWdCLENBQUMsWUFBakIsQ0FBOEIsS0FBOUIsRUFBcUMsbUJBQXJDO0FBQ0EsUUFBSSxnQkFBZ0IsR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixVQUF2QixDQUF2QjtBQUNBLElBQUEsZ0JBQWdCLENBQUMsWUFBakIsQ0FBOEIsSUFBOUIsRUFBb0MsbUJBQXBDO0FBQ0EsSUFBQSxnQkFBZ0IsQ0FBQyxZQUFqQixDQUE4QixNQUE5QixFQUFzQyxtQkFBdEM7QUFDQSxJQUFBLFdBQVcsQ0FBQyxXQUFaLENBQXdCLGdCQUF4QjtBQUNBLElBQUEsV0FBVyxDQUFDLFdBQVosQ0FBd0IsZ0JBQXhCLEVBOUJRLENBZ0NSOztBQUNBLFFBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLFVBQXZCLENBQVg7QUFDQSxRQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixPQUF2QixDQUFoQjtBQUNBLElBQUEsU0FBUyxDQUFDLFdBQVYsR0FBd0IsTUFBeEI7QUFDQSxJQUFBLFNBQVMsQ0FBQyxZQUFWLENBQXVCLEtBQXZCLEVBQThCLFlBQTlCO0FBQ0EsUUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsT0FBdkIsQ0FBaEI7QUFDQSxJQUFBLFNBQVMsQ0FBQyxZQUFWLENBQXVCLElBQXZCLEVBQTZCLFlBQTdCO0FBQ0EsSUFBQSxTQUFTLENBQUMsWUFBVixDQUF1QixNQUF2QixFQUErQixZQUEvQjtBQUNBLElBQUEsSUFBSSxDQUFDLFdBQUwsQ0FBaUIsU0FBakI7QUFDQSxJQUFBLElBQUksQ0FBQyxXQUFMLENBQWlCLFNBQWpCLEVBekNRLENBMkNSOztBQUNBLFFBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLFVBQXZCLENBQVg7QUFDQSxRQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixPQUF2QixDQUFoQjtBQUNBLElBQUEsU0FBUyxDQUFDLFdBQVYsR0FBd0IsTUFBeEI7QUFDQSxRQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixRQUF2QixDQUFoQjtBQUNBLElBQUEsU0FBUyxDQUFDLFlBQVYsQ0FBdUIsSUFBdkIsRUFBNkIsWUFBN0I7QUFDQSxJQUFBLFNBQVMsQ0FBQyxZQUFWLENBQXVCLE1BQXZCLEVBQStCLFlBQS9CO0FBQ0EsUUFBSSxXQUFXLEdBQUk7Ozs7U0FBbkI7QUFLQSxJQUFBLFNBQVMsQ0FBQyxTQUFWLEdBQXNCLFdBQXRCO0FBQ0EsSUFBQSxJQUFJLENBQUMsV0FBTCxDQUFpQixTQUFqQjtBQUNBLElBQUEsSUFBSSxDQUFDLFdBQUwsQ0FBaUIsU0FBakIsRUF6RFEsQ0EyRFI7O0FBQ0EsUUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBZDtBQUNBLElBQUEsT0FBTyxDQUFDLFdBQVIsR0FBc0IsWUFBdEI7QUFDQSxJQUFBLE9BQU8sQ0FBQyxZQUFSLENBQXFCLE9BQXJCLEVBQThCLGdCQUE5QixFQTlEUSxDQWdFUjs7QUFDQSxJQUFBLE9BQU8sQ0FBQyxnQkFBUixDQUF5QixPQUF6QixFQUFrQyx3QkFBZSxTQUFqRCxFQWpFUSxDQW1FUjs7QUFFQSxJQUFBLGFBQWEsQ0FBQyxXQUFkLENBQTBCLElBQTFCO0FBQ0EsSUFBQSxhQUFhLENBQUMsV0FBZCxDQUEwQixXQUExQjtBQUNBLElBQUEsYUFBYSxDQUFDLFdBQWQsQ0FBMEIsSUFBMUI7QUFDQSxJQUFBLGFBQWEsQ0FBQyxXQUFkLENBQTBCLElBQTFCO0FBQ0EsSUFBQSxhQUFhLENBQUMsV0FBZCxDQUEwQixPQUExQjtBQUVBLElBQUEsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsYUFBbkI7QUFDSDs7QUE5RWEsQ0FBbEI7ZUFrRmUsUzs7Ozs7Ozs7Ozs7QUNwRmY7O0FBQ0E7O0FBQ0E7Ozs7QUFKQTtBQUtBO0FBRUEsTUFBTSxTQUFTLEdBQUc7QUFFZCxFQUFBLFNBQVMsR0FBRztBQUVSO0FBQ0EsUUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsU0FBdkIsQ0FBYjtBQUNBLElBQUEsTUFBTSxDQUFDLFNBQVAsR0FBbUIsRUFBbkI7QUFFQSxRQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixJQUF2QixDQUFaO0FBQ0EsSUFBQSxLQUFLLENBQUMsV0FBTixHQUFvQixzQkFBcEI7QUFDQSxJQUFBLE1BQU0sQ0FBQyxXQUFQLENBQW1CLEtBQW5CO0FBRUEsUUFBSSxhQUFhLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBcEI7QUFDQSxJQUFBLGFBQWEsQ0FBQyxZQUFkLENBQTJCLElBQTNCLEVBQWlDLGdCQUFqQyxFQVhRLENBYVI7O0FBQ0EsdUJBQVUsU0FBVixHQWRRLENBZ0JSOzs7QUFDQSxRQUFJLFlBQVksR0FBRyxRQUFRLENBQUMsc0JBQVQsRUFBbkIsQ0FqQlEsQ0FtQlI7O0FBQ0EsdUJBQVUsU0FBVixHQUNDLElBREQsQ0FDTSxTQUFTLElBQUk7QUFDZixNQUFBLFNBQVMsQ0FBQyxPQUFWLENBQWtCLFNBQVMsSUFBSTtBQUMvQjtBQUNJLFlBQUksUUFBUSxHQUFHLGVBQU0sVUFBTixDQUFpQixTQUFqQixDQUFmLENBRjJCLENBRWlCOzs7QUFDNUMsUUFBQSxZQUFZLENBQUMsV0FBYixDQUF5QixRQUF6QjtBQUNILE9BSkQsRUFEZSxDQU9mOztBQUNBLE1BQUEsYUFBYSxDQUFDLFdBQWQsQ0FBMEIsWUFBMUI7QUFDSCxLQVZEOztBQVlBLElBQUEsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsYUFBbkI7QUFFSDs7QUFwQ2EsQ0FBbEI7ZUF3Q2UsUyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8vIENvbnRhaW5zIGFsbCBldmVudCBsaXN0ZW5lcnNcblxuaW1wb3J0IHBsYWNlRGF0YSBmcm9tIFwiLi9wbGFjZURhdGFcIlxuaW1wb3J0IHBsYWNlTGlzdCBmcm9tIFwiLi9wbGFjZUxpc3RcIlxuXG5jb25zdCBldmVudExpc3RlbmVycyA9IHtcblxuICAgIC8vIEFkZCBuZXcgYXJ0aWNsZVxuICAgIHBvc3RQbGFjZSgpIHtcblxuICAgICAgICAvLyBHZXQgdXNlciBpbnB1dCAodmFsdWUgb2YgZWFjaCBmaWVsZClcbiAgICAgICAgbGV0IGlucHV0UGxhY2VOYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwbGFjZV9uYW1lXCIpLnZhbHVlO1xuICAgICAgICBsZXQgaW5wdXRQbGFjZURlc2NyaXB0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwbGFjZV9kZXNjcmlwdGlvblwiKS52YWx1ZTtcbiAgICAgICAgbGV0IGlucHV0UGxhY2VDb3N0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwbGFjZV9jb3N0XCIpLnZhbHVlO1xuICAgICAgICBsZXQgaW5wdXRQbGFjZUNpdHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3BsYWNlX2NpdHlcIikudmFsdWU7XG5cbiAgICAgICAgLy8gQ3JlYXRlIG5ldyBvYmplY3Qgd2l0aCBjb3JyZWN0IERCIHN0cnVjdHVyZSB0byByZXByZXNlbnQgYSBzaW5nbGUgcGxhY2UgaXRlbTpcbiAgICAgICAgbGV0IHBsYWNlVG9TYXZlID0ge1xuICAgICAgICAgICAgbmFtZTogaW5wdXRQbGFjZU5hbWUsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogaW5wdXRQbGFjZURlc2NyaXB0aW9uLFxuICAgICAgICAgICAgY29zdDogaW5wdXRQbGFjZUNvc3QsXG4gICAgICAgICAgICByZXZpZXc6IFwiXCIsXG4gICAgICAgICAgICBjaXR5TmFtZUlkOiBOdW1iZXIoaW5wdXRQbGFjZUNpdHkpXG4gICAgICAgICAgfVxuXG4gICAgICAgIC8vIFNhdmUgYXJ0aWNsZSB0byBkYXRhYmFzZVxuICAgICAgICAvLyBUaGVuIHJlYnVpbGQgdGhlIGFydGljbGUgbGlzdCBvbiBET01cbiAgICAgICAgcGxhY2VEYXRhLnBvc3ROZXdQbGFjZShwbGFjZVRvU2F2ZSlcbiAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgcGxhY2VMaXN0LmJ1aWxkTGlzdCgpXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgLy8gRGVsZXRlIGFydGljbGVcblxuICAgIC8vIEVkaXQgYXJ0aWNsZVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IGV2ZW50TGlzdGVuZXJzOyIsImltcG9ydCBwbGFjZUxpc3QgZnJvbSBcIi4vcGxhY2VMaXN0XCI7XG5cbi8vIENhbGxzIHBsYWNlTGlzdC5idWlsZExpc3QgZnVuY3Rpb25cbnBsYWNlTGlzdC5idWlsZExpc3QoKTsiLCIvLyBDcmVhdGVzIGVhY2ggcGxhY2UgaXRlbSB0aGF0IHdpbGwgYmUgYXBwZW5kZWQgdG8gRE9NXG5cbmltcG9ydCBwbGFjZUxpc3QgZnJvbSBcIi4vcGxhY2VMaXN0XCJcbmltcG9ydCBwbGFjZURhdGEgZnJvbSBcIi4vcGxhY2VEYXRhXCJcbmltcG9ydCBwbGFjZUVkaXRGb3JtIGZyb20gXCIuL3BsYWNlRWRpdEZvcm1cIlxuXG5jb25zdCBwbGFjZUl0ZW0gPSB7XG5cbiAgICBidWlsZFBsYWNlKHBsYWNlT2JqKSB7ICAgICAgICAgICAgICAgIC8vIGFyZ3VtZW50IHBhc3NlZCBmcm9tIHBsYWNlTGlzdFxuXG4gICAgICAgIC8vIEJ1aWxkIGVhY2ggcGxhY2UgaXRlbVxuXG4gICAgICAgIC8vIENyZWF0ZSBjb250YWluZXIgZm9yIGVhY2ggaXRlbVxuICAgICAgICBsZXQgcGxhY2VTZWN0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNlY3Rpb25cIik7XG4gICAgICAgIHBsYWNlU2VjdGlvbi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcInBsYWNlX3NlY3Rpb25cIik7XG4gICAgICAgIHBsYWNlU2VjdGlvbi5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBgcGxhY2UtLSR7cGxhY2VPYmouaWR9YClcblxuICAgICAgICAvLyBOYW1lXG4gICAgICAgIGxldCBwbGFjZU5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDNcIik7XG4gICAgICAgIHBsYWNlTmFtZS50ZXh0Q29udGVudCA9IHBsYWNlT2JqLm5hbWU7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHBsYWNlT2JqLm5hbWUpO1xuXG4gICAgICAgIC8vIERlc2NyaXB0aW9uXG4gICAgICAgIGxldCBwbGFjZURlc2MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgcGxhY2VEZXNjLnRleHRDb250ZW50ID0gcGxhY2VPYmouZGVzY3JpcHRpb247XG5cbiAgICAgICAgLy8gQ29zdFxuICAgICAgICBsZXQgcGxhY2VDb3N0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgIGlmIChwbGFjZU9iai5jb3N0ID09PSBcIjBcIiB8fCBwbGFjZU9iai5jb3N0ID09PSBcIkZSRUVcIikge1xuICAgICAgICAgICAgbGV0IGNvc3REaXNwbGF5ID0gYENvc3Q6ICR7cGxhY2VPYmouY29zdH1gO1xuICAgICAgICAgICAgcGxhY2VDb3N0LnRleHRDb250ZW50ID0gY29zdERpc3BsYXk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgY29zdERpc3BsYXkgPSBgQ29zdDogJCR7cGxhY2VPYmouY29zdH1gO1xuICAgICAgICAgICAgcGxhY2VDb3N0LnRleHRDb250ZW50ID0gY29zdERpc3BsYXk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXZpZXdcbiAgICAgICAgbGV0IHBsYWNlUmV2aWV3ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgIGxldCByZXZpZXdEaXNwbGF5ID0gYFJldmlldzogJHtwbGFjZU9iai5yZXZpZXd9YDtcbiAgICAgICAgcGxhY2VSZXZpZXcudGV4dENvbnRlbnQgPSByZXZpZXdEaXNwbGF5O1xuXG4gICAgICAgIC8vIENpdHlcbiAgICAgICAgbGV0IHBsYWNlQ2l0eSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICBsZXQgY2l0eURpc3BsYXkgPSBgQ2l0eTogJHtwbGFjZU9iai5jaXR5TmFtZS5uYW1lfWA7XG4gICAgICAgIHBsYWNlQ2l0eS50ZXh0Q29udGVudCA9IGNpdHlEaXNwbGF5O1xuXG4gICAgICAgIC8vIEFkZCBidXR0b24gc2VjdGlvblxuICAgICAgICBsZXQgYnV0dG9uSG9sZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgYnV0dG9uSG9sZGVyLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiYnV0dG9uX2hvbGRlclwiKTtcblxuICAgICAgICAvLyBFZGl0IGJ1dHRvblxuICAgICAgICBsZXQgZWRpdEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIGVkaXRCdG4udGV4dENvbnRlbnQgPSBcIkVkaXRcIjtcbiAgICAgICAgZWRpdEJ0bi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImVkaXRfcGxhY2VcIik7XG4gICAgICAgIGVkaXRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBzZWN0aW9uSWQgPSBldmVudC50YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlLmlkO1xuICAgICAgICAgICAgbGV0IHBsYWNlSWQgPSBzZWN0aW9uSWQuc3BsaXQoXCItLVwiKVsxXTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHBsYWNlSWQpO1xuICAgICAgICAgICAgcGxhY2VEYXRhLmdldFBsYWNlKHBsYWNlSWQpXG4gICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgICAgcGxhY2VFZGl0Rm9ybS5idWlsZEVkaXRGb3JtKHBsYWNlSWQsIHJlc3BvbnNlKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBEZWxldGUgYnV0dG9uXG4gICAgICAgIGxldCBkZWxldGVCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICBkZWxldGVCdG4udGV4dENvbnRlbnQgPSBcIkRlbGV0ZVwiO1xuICAgICAgICBkZWxldGVCdG4uc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJkZWxldGVfcGxhY2VcIik7XG4gICAgICAgIGRlbGV0ZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHBsYWNlSWQgPSBwbGFjZU9iai5pZDtcbiAgICAgICAgICAgIHBsYWNlRGF0YS5kZWxldGVQbGFjZShwbGFjZUlkKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHBsYWNlTGlzdC5idWlsZExpc3QoKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBZGQgXCJFZGl0XCIgYW5kIFwiRGVsZXRlXCIgYnV0dG9ucyB0byBidXR0b24gaG9sZGVyXG4gICAgICAgIGJ1dHRvbkhvbGRlci5hcHBlbmRDaGlsZChlZGl0QnRuKTtcbiAgICAgICAgYnV0dG9uSG9sZGVyLmFwcGVuZENoaWxkKGRlbGV0ZUJ0bik7XG5cbiAgICAgICAgLy8gQXBwZW5kIGVhY2ggZWxlbWVudCB0byBwbGFjZVNlY3Rpb25cbiAgICAgICAgcGxhY2VTZWN0aW9uLmFwcGVuZENoaWxkKHBsYWNlTmFtZSk7XG4gICAgICAgIHBsYWNlU2VjdGlvbi5hcHBlbmRDaGlsZChwbGFjZURlc2MpO1xuICAgICAgICBwbGFjZVNlY3Rpb24uYXBwZW5kQ2hpbGQocGxhY2VDb3N0KTtcbiAgICAgICAgcGxhY2VTZWN0aW9uLmFwcGVuZENoaWxkKHBsYWNlUmV2aWV3KTtcbiAgICAgICAgcGxhY2VTZWN0aW9uLmFwcGVuZENoaWxkKHBsYWNlQ2l0eSk7XG4gICAgICAgIHBsYWNlU2VjdGlvbi5hcHBlbmRDaGlsZChidXR0b25Ib2xkZXIpO1xuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHBsYWNlU2VjdGlvbik7XG5cbiAgICAgICAgcmV0dXJuIHBsYWNlU2VjdGlvblxuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IHBsYWNlSXRlbTsiLCIvLyBDb250YWlucyBmZXRjaCBjYWxscyB0byBHRVQsIFBPU1QsIERFTEVURSwgYW5kIFBVVFxuXG5jb25zdCBwbGFjZURhdGEgPSB7XG5cbiAgICAvLyBHRVRcbiAgICBnZXRQbGFjZXMoKSB7XG4gICAgICAgIHJldHVybiBmZXRjaChcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4OC9wbGFjZXM/X2V4cGFuZD1jaXR5TmFtZVwiKVxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgfSxcblxuICAgIC8vIFBPU1RcbiAgICBwb3N0TmV3UGxhY2UocGxhY2VUb1NhdmUpIHtcbiAgICAgICAgcmV0dXJuIGZldGNoKFwiaHR0cDovL2xvY2FsaG9zdDo4MDg4L3BsYWNlc1wiLHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShwbGFjZVRvU2F2ZSlcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8vIERFTEVURVxuICAgIGRlbGV0ZVBsYWNlKHBsYWNlSWQpIHtcbiAgICAgICAgcmV0dXJuIGZldGNoKGBodHRwOi8vbG9jYWxob3N0OjgwODgvcGxhY2VzLyR7cGxhY2VJZH1gLCB7XG4gICAgICAgICAgbWV0aG9kOiBcIkRFTEVURVwiLFxuICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSxcblxuICAgIC8vIFBVVFxuICAgIGdldFBsYWNlKHBsYWNlSWQpIHtcbiAgICAgICAgcmV0dXJuIGZldGNoKGBodHRwOi8vbG9jYWxob3N0OjgwODgvcGxhY2VzLyR7cGxhY2VJZH0/X2V4cGFuZD1jaXR5TmFtZWApXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICB9LFxuXG4gICAgLy8gTmVlZCB0aGUgaWQgdG8gaWRlbnRpZnkgd2hpY2ggcGxhY2UgaXRlbSB3ZSB3YW50IHRvIGVkaXQsIGFzIHdlbGwgYXMgdGhlIG5ldyBkYXRhIHdlIHdhbnQgdG8gcmVwbGFjZSB0aGUgZXhpc3RpbmcgZGF0YSB3aXRoLiBTbyB3ZSBuZWVkIHR3byBhcmd1bWVudHMgZm9yIHRoZSBtZXRob2QuXG4gICAgcHV0RXhpc3RpbmdQbGFjZShwbGFjZUlkLCBwbGFjZVRvRWRpdCkge1xuICAgIHJldHVybiBmZXRjaChgaHR0cDovL2xvY2FsaG9zdDo4MDg4L3BsYWNlcy8ke3BsYWNlSWR9YCwge1xuICAgICAgICBtZXRob2Q6IFwiUFVUXCIsXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiXG4gICAgICAgIH0sXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHBsYWNlVG9FZGl0KVxuICAgIH0pXG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBwbGFjZURhdGE7IiwiLy8gQ3JlYXRlcyBmb3JtIHRvIGVkaXQgYSBwbGFjZVxuXG5pbXBvcnQgcGxhY2VEYXRhIGZyb20gXCIuL3BsYWNlRGF0YVwiXG5pbXBvcnQgcGxhY2VMaXN0IGZyb20gXCIuL3BsYWNlTGlzdFwiXG5cbmNvbnN0IHBsYWNlRWRpdEZvcm0gPSB7XG5cbiAgICBidWlsZEVkaXRGb3JtKHBsYWNlSWQsIHBsYWNlVG9FZGl0KSB7XG5cbiAgICAgICAgLy8gQ3JlYXRlICYgYXBwZW5kIGZvcm0gdy8gc2F2ZSBidXR0b25cblxuICAgICAgICAvLyBEaXNwbGF5IFwiTmFtZVwiIChub3QgZWRpdGFibGUpXG4gICAgICAgIGxldCBuYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgzXCIpO1xuICAgICAgICBuYW1lLnRleHRDb250ZW50ID0gYCR7cGxhY2VUb0VkaXQubmFtZX1gO1xuXG4gICAgICAgIC8vIERpc3BsYXkgXCJEZXNjcmlwdGlvblwiIChub3QgZWRpdGFibGUpXG4gICAgICAgIGxldCBkZXNjcmlwdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGRlc2NyaXB0aW9uLnRleHRDb250ZW50ID0gcGxhY2VUb0VkaXQuZGVzY3JpcHRpb247XG5cbiAgICAgICAgLy8gQ3JlYXRlIFwiQ29zdFwiIGZpZWxkXG4gICAgICAgIGxldCBjb3N0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZpZWxkc2V0XCIpO1xuICAgICAgICBsZXQgY29zdExhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xuICAgICAgICBjb3N0TGFiZWwudGV4dENvbnRlbnQgPSBcIkNvc3RcIjtcbiAgICAgICAgY29zdExhYmVsLnNldEF0dHJpYnV0ZShcImZvclwiLCBcInBsYWNlX2Nvc3RcIik7XG4gICAgICAgIGxldCBjb3N0SW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgICAgIGNvc3RJbnB1dC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcInBsYWNlX2Nvc3RcIik7XG4gICAgICAgIGNvc3RJbnB1dC5zZXRBdHRyaWJ1dGUoXCJuYW1lXCIsIFwicGxhY2VfY29zdFwiKTtcbiAgICAgICAgY29zdElucHV0LnZhbHVlID0gcGxhY2VUb0VkaXQuY29zdDtcbiAgICAgICAgY29zdC5hcHBlbmRDaGlsZChjb3N0TGFiZWwpO1xuICAgICAgICBjb3N0LmFwcGVuZENoaWxkKGNvc3RJbnB1dCk7XG5cbiAgICAgICAgLy8gU2hvdyBcIkNpdHlcIiAobm90IGVkaXRhYmxlKVxuICAgICAgICBsZXQgY2l0eSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGNpdHkudGV4dENvbnRlbnQgPSBgQ2l0eTogJHtwbGFjZVRvRWRpdC5jaXR5TmFtZS5uYW1lfWA7XG5cbiAgICAgICAgLy8gQ3JlYXRlIFwiUmV2aWV3XCIgZmllbGRcbiAgICAgICAgbGV0IHJldmlldyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmaWVsZHNldFwiKTtcbiAgICAgICAgbGV0IHJldmlld0xhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xuICAgICAgICByZXZpZXdMYWJlbC50ZXh0Q29udGVudCA9IFwiUmV2aWV3XCI7XG4gICAgICAgIHJldmlld0xhYmVsLnNldEF0dHJpYnV0ZShcImZvclwiLCBcInBsYWNlX3Jldmlld1wiKTtcbiAgICAgICAgbGV0IHJldmlld0lucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRleHRhcmVhXCIpO1xuICAgICAgICByZXZpZXdJbnB1dC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcInBsYWNlX3Jldmlld1wiKTtcbiAgICAgICAgcmV2aWV3SW5wdXQuc2V0QXR0cmlidXRlKFwibmFtZVwiLCBcInBsYWNlX3Jldmlld1wiKTtcbiAgICAgICAgcmV2aWV3SW5wdXQudmFsdWUgPSBwbGFjZVRvRWRpdC5yZXZpZXc7XG4gICAgICAgIHJldmlldy5hcHBlbmRDaGlsZChyZXZpZXdMYWJlbCk7XG4gICAgICAgIHJldmlldy5hcHBlbmRDaGlsZChyZXZpZXdJbnB1dCk7XG5cbiAgICAgICAgLy8gQ3JlYXRlIFwiVXBkYXRlXCIgYnV0dG9uXG4gICAgICAgIGxldCB1cGRhdGVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpXG4gICAgICAgIHVwZGF0ZUJ1dHRvbi50ZXh0Q29udGVudCA9IFwiVXBkYXRlXCI7XG5cbiAgICAgICAgLy8gQWRkIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBcIlVwZGF0ZVwiIGJ1dHRvblxuICAgICAgICAvLyBUYWtlcyB0aGUgbmV3IHZhbHVlcyBpbiB0aGUgaW5wdXQgZmllbGRzIGFuZCBidWlsZHMgYW4gb2JqZWN0IGZvciB0aGUgcGxhY2UgaXRlbSB0byBiZSBlZGl0ZWQuXG4gICAgICAgIC8vIE1ha2UgYSBIVFRQIFBVVCByZXF1ZXN0IHdoZXJlIHdlIHRhcmdldCB0aGUgcGxhY2UgaXRlbSB3ZSB3YW50IHRvIGVkaXQgYnkgc3BlY2lmeWluZyB0aGUgaWQgaW4gdGhlIFVSTC5cbiAgICAgICAgLy8gUGFzcyB0aGUgb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgcGxhY2UgaXRlbSB3aXRoIHRoZSBuZXcgdmFsdWVzIGFzIGRhdGEgaW4gb3VyIEhUVFAgcmVxdWVzdC5cblxuICAgICAgICB1cGRhdGVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBlZGl0ZWRQbGFjZSA9IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBwbGFjZVRvRWRpdC5uYW1lLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBwbGFjZVRvRWRpdC5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgICBjb3N0OiBjb3N0SW5wdXQudmFsdWUsXG4gICAgICAgICAgICAgICAgcmV2aWV3OiByZXZpZXdJbnB1dC52YWx1ZSxcbiAgICAgICAgICAgICAgICBjaXR5TmFtZUlkOiBwbGFjZVRvRWRpdC5jaXR5TmFtZS5pZFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgcGxhY2V0b0VkaXRJZCA9IHBsYWNlVG9FZGl0LmlkO1xuICAgICAgICAgICAgcGxhY2VEYXRhLnB1dEV4aXN0aW5nUGxhY2UocGxhY2V0b0VkaXRJZCwgZWRpdGVkUGxhY2UpXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcGxhY2VMaXN0LmJ1aWxkTGlzdCgpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIFdlIHBhc3NlZCBpbiB0aGUgaWQgb2YgdGhlIHNlY3Rpb24gc28gd2Uga25vdyBleGFjdGx5IHdoZXJlIHRvIGFwcGVuZCB0aGUgZWRpdCBmb3JtLlxuICAgICAgICBsZXQgcGxhY2VTZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3BsYWNlLS0ke3BsYWNlSWR9YCk7XG5cbiAgICAgICAgLy8gQmVjYXVzZSB3ZSB3YW50IHRvIHJlcGxhY2Ugd2hhdCBpcyBjdXJyZW50bHkgaW4gdGhlIGFydGljbGUgZWxlbWVudCB3aXRoIHRoZSBlZGl0IGZvcm0sIHdlIGNsZWFyIG91dCBhbGwgY2hpbGRyZW4gSFRNTCBlbGVtZW50cyBpbiBvdXIgdGFyZ2V0ZWQgZWxlbWVudCBiZWZvcmUgYXBwZW5kaW5nIG91ciBlZGl0IGZvcm0gdG8gaXQuXG4gICAgICAgIHdoaWxlIChwbGFjZVNlY3Rpb24uZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgcGxhY2VTZWN0aW9uLnJlbW92ZUNoaWxkKHBsYWNlU2VjdGlvbi5maXJzdENoaWxkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBsYWNlU2VjdGlvbi5hcHBlbmRDaGlsZChuYW1lKTtcbiAgICAgICAgcGxhY2VTZWN0aW9uLmFwcGVuZENoaWxkKGRlc2NyaXB0aW9uKTtcbiAgICAgICAgcGxhY2VTZWN0aW9uLmFwcGVuZENoaWxkKGNvc3QpO1xuICAgICAgICBwbGFjZVNlY3Rpb24uYXBwZW5kQ2hpbGQocmV2aWV3KTtcbiAgICAgICAgcGxhY2VTZWN0aW9uLmFwcGVuZENoaWxkKGNpdHkpO1xuICAgICAgICBwbGFjZVNlY3Rpb24uYXBwZW5kQ2hpbGQodXBkYXRlQnV0dG9uKTtcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBwbGFjZUVkaXRGb3JtOyIsIi8vIENyZWF0ZXMgZm9ybSB0byBzYXZlIGEgbmV3IHBsYWNlIGl0ZW0gdG8gZGF0YWJhc2VcblxuaW1wb3J0IGV2ZW50TGlzdGVuZXJzIGZyb20gXCIuL2V2ZW50TGlzdGVuZXJzXCJcblxuY29uc3QgcGxhY2VGb3JtID0ge1xuXG4gICAgYnVpbGRGb3JtKCkge1xuXG4gICAgICAgIC8vIENyZWF0ZSBjb250YWluZXIsIHRpdGxlLCBldGMuXG4gICAgICAgIGxldCBvdXRwdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI291dHB1dFwiKTtcbiAgICAgICAgbGV0IGZvcm1Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBmb3JtQ29udGFpbmVyLnNldEF0dHJpYnV0ZShcImlkXCIsIFwiZm9ybV9jb250YWluZXJcIik7XG4gICAgICAgIGxldCBmb3JtQ29udGFpbmVyVGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDNcIik7XG4gICAgICAgIGZvcm1Db250YWluZXJUaXRsZS50ZXh0Q29udGVudCA9IFwiQWRkIE5ldyBQbGFjZVwiO1xuICAgICAgICBmb3JtQ29udGFpbmVyLmFwcGVuZENoaWxkKGZvcm1Db250YWluZXJUaXRsZSk7XG5cbiAgICAgICAgLy8gQ3JlYXRlIFwiTmFtZVwiIGZpZWxkXG4gICAgICAgIGxldCBuYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZpZWxkc2V0XCIpO1xuICAgICAgICBsZXQgbmFtZUxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xuICAgICAgICBuYW1lTGFiZWwudGV4dENvbnRlbnQgPSBcIk5hbWVcIjtcbiAgICAgICAgbmFtZUxhYmVsLnNldEF0dHJpYnV0ZShcImZvclwiLCBcInBsYWNlX25hbWVcIik7XG4gICAgICAgIGxldCBuYW1lSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgICAgIG5hbWVJbnB1dC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcInBsYWNlX25hbWVcIik7XG4gICAgICAgIG5hbWVJbnB1dC5zZXRBdHRyaWJ1dGUoXCJuYW1lXCIsIFwicGxhY2VfbmFtZVwiKTtcbiAgICAgICAgbmFtZS5hcHBlbmRDaGlsZChuYW1lTGFiZWwpO1xuICAgICAgICBuYW1lLmFwcGVuZENoaWxkKG5hbWVJbnB1dCk7XG5cbiAgICAgICAgLy8gQ3JlYXRlIFwiRGVzY3JpcHRpb25cIiBmaWVsZFxuICAgICAgICBsZXQgZGVzY3JpcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZmllbGRzZXRcIik7XG4gICAgICAgIGxldCBkZXNjcmlwdGlvbkxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xuICAgICAgICBkZXNjcmlwdGlvbkxhYmVsLnRleHRDb250ZW50ID0gXCJEZXNjcmlwdGlvblwiO1xuICAgICAgICBkZXNjcmlwdGlvbkxhYmVsLnNldEF0dHJpYnV0ZShcImZvclwiLCBcInBsYWNlX2Rlc2NyaXB0aW9uXCIpO1xuICAgICAgICBsZXQgZGVzY3JpcHRpb25JbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZXh0YXJlYVwiKTtcbiAgICAgICAgZGVzY3JpcHRpb25JbnB1dC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcInBsYWNlX2Rlc2NyaXB0aW9uXCIpO1xuICAgICAgICBkZXNjcmlwdGlvbklucHV0LnNldEF0dHJpYnV0ZShcIm5hbWVcIiwgXCJwbGFjZV9kZXNjcmlwdGlvblwiKTtcbiAgICAgICAgZGVzY3JpcHRpb24uYXBwZW5kQ2hpbGQoZGVzY3JpcHRpb25MYWJlbCk7XG4gICAgICAgIGRlc2NyaXB0aW9uLmFwcGVuZENoaWxkKGRlc2NyaXB0aW9uSW5wdXQpO1xuXG4gICAgICAgIC8vIENyZWF0ZSBcIkNvc3RcIiBmaWVsZFxuICAgICAgICBsZXQgY29zdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmaWVsZHNldFwiKTtcbiAgICAgICAgbGV0IGNvc3RMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcbiAgICAgICAgY29zdExhYmVsLnRleHRDb250ZW50ID0gXCJDb3N0XCI7XG4gICAgICAgIGNvc3RMYWJlbC5zZXRBdHRyaWJ1dGUoXCJmb3JcIiwgXCJwbGFjZV9jb3N0XCIpO1xuICAgICAgICBsZXQgY29zdElucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgICAgICBjb3N0SW5wdXQuc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJwbGFjZV9jb3N0XCIpO1xuICAgICAgICBjb3N0SW5wdXQuc2V0QXR0cmlidXRlKFwibmFtZVwiLCBcInBsYWNlX2Nvc3RcIik7XG4gICAgICAgIGNvc3QuYXBwZW5kQ2hpbGQoY29zdExhYmVsKTtcbiAgICAgICAgY29zdC5hcHBlbmRDaGlsZChjb3N0SW5wdXQpO1xuXG4gICAgICAgIC8vIENyZWF0ZSBcIkNpdHlcIiBkcm9wLWRvd25cbiAgICAgICAgbGV0IGNpdHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZmllbGRzZXRcIik7XG4gICAgICAgIGxldCBjaXR5TGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XG4gICAgICAgIGNpdHlMYWJlbC50ZXh0Q29udGVudCA9IFwiQ2l0eVwiO1xuICAgICAgICBsZXQgY2l0eUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNlbGVjdFwiKTtcbiAgICAgICAgY2l0eUlucHV0LnNldEF0dHJpYnV0ZShcImlkXCIsIFwicGxhY2VfY2l0eVwiKTtcbiAgICAgICAgY2l0eUlucHV0LnNldEF0dHJpYnV0ZShcIm5hbWVcIiwgXCJwbGFjZV9jaXR5XCIpO1xuICAgICAgICBsZXQgY2l0eU9wdGlvbnMgPSBgXG4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiMVwiPkxvcyBBbmdlbGVzPC9vcHRpb24+XG4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiMlwiPlNhbiBGcmFuY2lzY288L29wdGlvbj5cbiAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCIzXCI+VG9yb250bzwvb3B0aW9uPlxuICAgICAgICBgXG4gICAgICAgIGNpdHlJbnB1dC5pbm5lckhUTUwgPSBjaXR5T3B0aW9ucztcbiAgICAgICAgY2l0eS5hcHBlbmRDaGlsZChjaXR5TGFiZWwpO1xuICAgICAgICBjaXR5LmFwcGVuZENoaWxkKGNpdHlJbnB1dCk7XG5cbiAgICAgICAgLy8gQ3JlYXRlIFwiU2F2ZVwiIGJ1dHRvbiBhbmQgYXR0YWNoIGV2ZW50IGxpc3RlbmVyXG4gICAgICAgIGxldCBzYXZlQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgc2F2ZUJ0bi50ZXh0Q29udGVudCA9IFwiU2F2ZSBQbGFjZVwiO1xuICAgICAgICBzYXZlQnRuLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwic2F2ZV9uZXdfcGxhY2VcIik7XG5cbiAgICAgICAgLy8gQXR0YWNoIGV2ZW50IGxpc3RlbmVyIHRvIGJ1dHRvbiwgdG8gUE9TVCB0byBkYXRhYmFzZVxuICAgICAgICBzYXZlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBldmVudExpc3RlbmVycy5wb3N0UGxhY2UpO1xuXG4gICAgICAgIC8vIEFwcGVuZCBlYWNoIGZpZWxkL2J1dHRvbiB0byBmb3JtIGNvbnRhaW5lclxuXG4gICAgICAgIGZvcm1Db250YWluZXIuYXBwZW5kQ2hpbGQobmFtZSk7XG4gICAgICAgIGZvcm1Db250YWluZXIuYXBwZW5kQ2hpbGQoZGVzY3JpcHRpb24pO1xuICAgICAgICBmb3JtQ29udGFpbmVyLmFwcGVuZENoaWxkKGNvc3QpO1xuICAgICAgICBmb3JtQ29udGFpbmVyLmFwcGVuZENoaWxkKGNpdHkpO1xuICAgICAgICBmb3JtQ29udGFpbmVyLmFwcGVuZENoaWxkKHNhdmVCdG4pO1xuXG4gICAgICAgIG91dHB1dC5hcHBlbmRDaGlsZChmb3JtQ29udGFpbmVyKTtcbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgcGxhY2VGb3JtOyIsIi8vIEJ1aWxkcyBvdXQgcGxhY2UgbGlzdCBhbmQgYXBwZW5kcyB0byBET01cblxuaW1wb3J0IHBsYWNlRGF0YSBmcm9tIFwiLi9wbGFjZURhdGFcIjtcbmltcG9ydCBwbGFjZSBmcm9tIFwiLi9wbGFjZVwiXG5pbXBvcnQgcGxhY2VGb3JtIGZyb20gXCIuL3BsYWNlRm9ybVwiO1xuLy8gaW1wb3J0IGV2ZW50TGlzdGVuZXJzIGZyb20gXCIuL2V2ZW50TGlzdGVuZXJzXCJcblxuY29uc3QgcGxhY2VMaXN0ID0ge1xuXG4gICAgYnVpbGRMaXN0KCkge1xuXG4gICAgICAgIC8vIENyZWF0ZSBjb250YWluZXIsIHRpdGxlLCBldGMuXG4gICAgICAgIGxldCBvdXRwdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI291dHB1dFwiKTtcbiAgICAgICAgb3V0cHV0LmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICAgICAgbGV0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgxXCIpO1xuICAgICAgICB0aXRsZS50ZXh0Q29udGVudCA9IFwiVGhlIFRlcm5hcnkgVHJhdmVsZXJcIjtcbiAgICAgICAgb3V0cHV0LmFwcGVuZENoaWxkKHRpdGxlKTtcblxuICAgICAgICBsZXQgbGlzdENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGxpc3RDb250YWluZXIuc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJsaXN0X2NvbnRhaW5lclwiKTtcblxuICAgICAgICAvLyBBZGQgZm9ybSBoZXJlXG4gICAgICAgIHBsYWNlRm9ybS5idWlsZEZvcm0oKTtcblxuICAgICAgICAvLyBDcmVhdGUgZG9jIGZyYWcgdG8gaG9sZCBlYWNoIHBsYWNlIGl0ZW1cbiAgICAgICAgbGV0IHBsYWNlRG9jRnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblxuICAgICAgICAvLyBHRVQgcGxhY2UgZGF0YVxuICAgICAgICBwbGFjZURhdGEuZ2V0UGxhY2VzKClcbiAgICAgICAgLnRoZW4oYWxsUGxhY2VzID0+IHtcbiAgICAgICAgICAgIGFsbFBsYWNlcy5mb3JFYWNoKHBsYWNlSXRlbSA9PiB7XG4gICAgICAgICAgICAvLyBmb3JFYWNoIHBsYWNlLCBjYWxsIGZ1bmN0aW9uIHRvIGJ1aWxkIEhUTUwgZm9yIGVhY2ggb25lIGFuZCBhcHBlbmQgZWFjaCB0byBkb2MgZnJhZ1xuICAgICAgICAgICAgICAgIGxldCBuZXdQbGFjZSA9IHBsYWNlLmJ1aWxkUGxhY2UocGxhY2VJdGVtKTsgLy8gbmV3UGxhY2UgPSBwbGFjZVNlY3Rpb25cbiAgICAgICAgICAgICAgICBwbGFjZURvY0ZyYWcuYXBwZW5kQ2hpbGQobmV3UGxhY2UpO1xuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgLy8gQXBwZW5kIHRoZSBkb2MgZnJhZyB0byB0aGUgRE9NXG4gICAgICAgICAgICBsaXN0Q29udGFpbmVyLmFwcGVuZENoaWxkKHBsYWNlRG9jRnJhZyk7XG4gICAgICAgIH0pXG5cbiAgICAgICAgb3V0cHV0LmFwcGVuZENoaWxkKGxpc3RDb250YWluZXIpO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IHBsYWNlTGlzdDsiXX0=
