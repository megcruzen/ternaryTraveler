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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zY3JpcHRzL2V2ZW50TGlzdGVuZXJzLmpzIiwiLi4vc2NyaXB0cy9tYWluLmpzIiwiLi4vc2NyaXB0cy9wbGFjZS5qcyIsIi4uL3NjcmlwdHMvcGxhY2VEYXRhLmpzIiwiLi4vc2NyaXB0cy9wbGFjZUVkaXRGb3JtLmpzIiwiLi4vc2NyaXB0cy9wbGFjZUZvcm0uanMiLCIuLi9zY3JpcHRzL3BsYWNlTGlzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7QUNFQTs7QUFDQTs7OztBQUhBO0FBS0EsTUFBTSxjQUFjLEdBQUc7QUFFbkI7QUFDQSxFQUFBLFNBQVMsR0FBRztBQUVSO0FBQ0EsUUFBSSxjQUFjLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsYUFBdkIsRUFBc0MsS0FBM0Q7QUFDQSxRQUFJLHFCQUFxQixHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLG9CQUF2QixFQUE2QyxLQUF6RTtBQUNBLFFBQUksY0FBYyxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLGFBQXZCLEVBQXNDLEtBQTNEO0FBQ0EsUUFBSSxjQUFjLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsYUFBdkIsRUFBc0MsS0FBM0QsQ0FOUSxDQVFSOztBQUNBLFFBQUksV0FBVyxHQUFHO0FBQ2QsTUFBQSxJQUFJLEVBQUUsY0FEUTtBQUVkLE1BQUEsV0FBVyxFQUFFLHFCQUZDO0FBR2QsTUFBQSxJQUFJLEVBQUUsY0FIUTtBQUlkLE1BQUEsTUFBTSxFQUFFLEVBSk07QUFLZCxNQUFBLFVBQVUsRUFBRSxNQUFNLENBQUMsY0FBRCxDQUxKLENBUWxCO0FBQ0E7O0FBVGtCLEtBQWxCOztBQVVBLHVCQUFVLFlBQVYsQ0FBdUIsV0FBdkIsRUFDQyxJQURELENBQ00sTUFBTTtBQUNSLHlCQUFVLFNBQVY7QUFDSCxLQUhEO0FBSUgsR0ExQmtCLENBNEJuQjtBQUVBOzs7QUE5Qm1CLENBQXZC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LFNBQVMsQ0FBQyxPQUFWLENBQWtCLFNBQVMsSUFBSTtBQUMvQjtBQUNJLFlBQUksUUFBUSxHQUFHLGVBQU0sVUFBTixDQUFpQixTQUFqQixDQUFmLENBRjJCLENBRWlCOzs7QUFDNUMsUUFBQSxZQUFZLENBQUMsV0FBYixDQUF5QixRQUF6QjtBQUNILE9BSkQsRUFEZSxDQU9mOztBQUNBLE1BQUEsYUFBYSxDQUFDLFdBQWQsQ0FBMEIsWUFBMUI7QUFDSCxLQVZEOztBQVlBLElBQUEsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsYUFBbkI7QUFFSDs7QUFwQ2EsQ0FBbEI7ZUF3Q2UsUyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8vIENvbnRhaW5zIGFsbCBldmVudCBsaXN0ZW5lcnNcblxuaW1wb3J0IHBsYWNlRGF0YSBmcm9tIFwiLi9wbGFjZURhdGFcIlxuaW1wb3J0IHBsYWNlTGlzdCBmcm9tIFwiLi9wbGFjZUxpc3RcIlxuXG5jb25zdCBldmVudExpc3RlbmVycyA9IHtcblxuICAgIC8vIEFkZCBuZXcgYXJ0aWNsZVxuICAgIHBvc3RQbGFjZSgpIHtcblxuICAgICAgICAvLyBHZXQgdXNlciBpbnB1dCAodmFsdWUgb2YgZWFjaCBmaWVsZClcbiAgICAgICAgbGV0IGlucHV0UGxhY2VOYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwbGFjZV9uYW1lXCIpLnZhbHVlO1xuICAgICAgICBsZXQgaW5wdXRQbGFjZURlc2NyaXB0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwbGFjZV9kZXNjcmlwdGlvblwiKS52YWx1ZTtcbiAgICAgICAgbGV0IGlucHV0UGxhY2VDb3N0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwbGFjZV9jb3N0XCIpLnZhbHVlO1xuICAgICAgICBsZXQgaW5wdXRQbGFjZUNpdHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3BsYWNlX2NpdHlcIikudmFsdWU7XG5cbiAgICAgICAgLy8gQ3JlYXRlIG5ldyBvYmplY3Qgd2l0aCBjb3JyZWN0IERCIHN0cnVjdHVyZSB0byByZXByZXNlbnQgYSBzaW5nbGUgcGxhY2UgaXRlbTpcbiAgICAgICAgbGV0IHBsYWNlVG9TYXZlID0ge1xuICAgICAgICAgICAgbmFtZTogaW5wdXRQbGFjZU5hbWUsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogaW5wdXRQbGFjZURlc2NyaXB0aW9uLFxuICAgICAgICAgICAgY29zdDogaW5wdXRQbGFjZUNvc3QsXG4gICAgICAgICAgICByZXZpZXc6IFwiXCIsXG4gICAgICAgICAgICBjaXR5TmFtZUlkOiBOdW1iZXIoaW5wdXRQbGFjZUNpdHkpXG4gICAgICAgICAgfVxuXG4gICAgICAgIC8vIFNhdmUgYXJ0aWNsZSB0byBkYXRhYmFzZVxuICAgICAgICAvLyBUaGVuIHJlYnVpbGQgdGhlIGFydGljbGUgbGlzdCBvbiBET01cbiAgICAgICAgcGxhY2VEYXRhLnBvc3ROZXdQbGFjZShwbGFjZVRvU2F2ZSlcbiAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgcGxhY2VMaXN0LmJ1aWxkTGlzdCgpXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgLy8gRGVsZXRlIGFydGljbGVcblxuICAgIC8vIEVkaXQgYXJ0aWNsZVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IGV2ZW50TGlzdGVuZXJzOyIsImltcG9ydCBwbGFjZUxpc3QgZnJvbSBcIi4vcGxhY2VMaXN0XCI7XG5cbi8vIENhbGxzIHBsYWNlTGlzdC5idWlsZExpc3QgZnVuY3Rpb25cbnBsYWNlTGlzdC5idWlsZExpc3QoKTsiLCIvLyBDcmVhdGVzIGVhY2ggcGxhY2UgaXRlbSB0aGF0IHdpbGwgYmUgYXBwZW5kZWQgdG8gRE9NXG5cbmltcG9ydCBwbGFjZUxpc3QgZnJvbSBcIi4vcGxhY2VMaXN0XCJcbmltcG9ydCBwbGFjZURhdGEgZnJvbSBcIi4vcGxhY2VEYXRhXCJcbmltcG9ydCBwbGFjZUVkaXRGb3JtIGZyb20gXCIuL3BsYWNlRWRpdEZvcm1cIlxuXG5jb25zdCBwbGFjZUl0ZW0gPSB7XG5cbiAgICBidWlsZFBsYWNlKHBsYWNlT2JqKSB7ICAgICAgICAgICAgICAgIC8vIGFyZ3VtZW50IHBhc3NlZCBmcm9tIHBsYWNlTGlzdFxuXG4gICAgICAgIC8vIEJ1aWxkIGVhY2ggcGxhY2UgaXRlbVxuXG4gICAgICAgIC8vIENyZWF0ZSBjb250YWluZXIgZm9yIGVhY2ggaXRlbVxuICAgICAgICBsZXQgcGxhY2VTZWN0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNlY3Rpb25cIik7XG4gICAgICAgIHBsYWNlU2VjdGlvbi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcInBsYWNlX3NlY3Rpb25cIik7XG4gICAgICAgIHBsYWNlU2VjdGlvbi5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBgcGxhY2UtLSR7cGxhY2VPYmouaWR9YClcblxuICAgICAgICAvLyBOYW1lXG4gICAgICAgIGxldCBwbGFjZU5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDNcIik7XG4gICAgICAgIHBsYWNlTmFtZS50ZXh0Q29udGVudCA9IHBsYWNlT2JqLm5hbWU7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHBsYWNlT2JqLm5hbWUpO1xuXG4gICAgICAgIC8vIERlc2NyaXB0aW9uXG4gICAgICAgIGxldCBwbGFjZURlc2MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgcGxhY2VEZXNjLnRleHRDb250ZW50ID0gcGxhY2VPYmouZGVzY3JpcHRpb247XG5cbiAgICAgICAgLy8gQ29zdFxuICAgICAgICBsZXQgcGxhY2VDb3N0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgIGlmIChwbGFjZU9iai5jb3N0ID09PSBcIjBcIiB8fCBwbGFjZU9iai5jb3N0ID09PSBcIkZSRUVcIikge1xuICAgICAgICAgICAgbGV0IGNvc3REaXNwbGF5ID0gYENvc3Q6ICR7cGxhY2VPYmouY29zdH1gO1xuICAgICAgICAgICAgcGxhY2VDb3N0LnRleHRDb250ZW50ID0gY29zdERpc3BsYXk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgY29zdERpc3BsYXkgPSBgQ29zdDogJCR7cGxhY2VPYmouY29zdH1gO1xuICAgICAgICAgICAgcGxhY2VDb3N0LnRleHRDb250ZW50ID0gY29zdERpc3BsYXk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXZpZXdcbiAgICAgICAgbGV0IHBsYWNlUmV2aWV3ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgIGxldCByZXZpZXdEaXNwbGF5ID0gYFJldmlldzogJHtwbGFjZU9iai5yZXZpZXd9YDtcbiAgICAgICAgcGxhY2VSZXZpZXcudGV4dENvbnRlbnQgPSByZXZpZXdEaXNwbGF5O1xuXG4gICAgICAgIC8vIENpdHlcbiAgICAgICAgbGV0IHBsYWNlQ2l0eSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICBsZXQgY2l0eURpc3BsYXkgPSBgQ2l0eTogJHtwbGFjZU9iai5jaXR5TmFtZS5uYW1lfWA7XG4gICAgICAgIHBsYWNlQ2l0eS50ZXh0Q29udGVudCA9IGNpdHlEaXNwbGF5O1xuXG4gICAgICAgIC8vIEFkZCBidXR0b24gc2VjdGlvblxuICAgICAgICBsZXQgYnV0dG9uSG9sZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgYnV0dG9uSG9sZGVyLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiYnV0dG9uX2hvbGRlclwiKTtcblxuICAgICAgICAvLyBFZGl0IGJ1dHRvblxuICAgICAgICBsZXQgZWRpdEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIGVkaXRCdG4udGV4dENvbnRlbnQgPSBcIkVkaXRcIjtcbiAgICAgICAgZWRpdEJ0bi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImVkaXRfcGxhY2VcIik7XG4gICAgICAgIGVkaXRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBzZWN0aW9uSWQgPSBldmVudC50YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlLmlkO1xuICAgICAgICAgICAgbGV0IHBsYWNlSWQgPSBzZWN0aW9uSWQuc3BsaXQoXCItLVwiKVsxXTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHBsYWNlSWQpO1xuICAgICAgICAgICAgcGxhY2VEYXRhLmdldFBsYWNlKHBsYWNlSWQpXG4gICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgICAgcGxhY2VFZGl0Rm9ybS5idWlsZEVkaXRGb3JtKHBsYWNlSWQsIHJlc3BvbnNlKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBEZWxldGUgYnV0dG9uXG4gICAgICAgIGxldCBkZWxldGVCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICBkZWxldGVCdG4udGV4dENvbnRlbnQgPSBcIkRlbGV0ZVwiO1xuICAgICAgICBkZWxldGVCdG4uc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJkZWxldGVfcGxhY2VcIik7XG4gICAgICAgIGRlbGV0ZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGNvbmZpcm0oXCJBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlIHRoaXMgZW50cnk/XCIpKSB7XG4gICAgICAgICAgICAgICAgbGV0IHBsYWNlSWQgPSBwbGFjZU9iai5pZDtcbiAgICAgICAgICAgICAgICBwbGFjZURhdGEuZGVsZXRlUGxhY2UocGxhY2VJZClcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7IHBsYWNlTGlzdC5idWlsZExpc3QoKX0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWRkIFwiRWRpdFwiIGFuZCBcIkRlbGV0ZVwiIGJ1dHRvbnMgdG8gYnV0dG9uIGhvbGRlclxuICAgICAgICBidXR0b25Ib2xkZXIuYXBwZW5kQ2hpbGQoZWRpdEJ0bik7XG4gICAgICAgIGJ1dHRvbkhvbGRlci5hcHBlbmRDaGlsZChkZWxldGVCdG4pO1xuXG4gICAgICAgIC8vIEFwcGVuZCBlYWNoIGVsZW1lbnQgdG8gcGxhY2VTZWN0aW9uXG4gICAgICAgIHBsYWNlU2VjdGlvbi5hcHBlbmRDaGlsZChwbGFjZU5hbWUpO1xuICAgICAgICBwbGFjZVNlY3Rpb24uYXBwZW5kQ2hpbGQocGxhY2VEZXNjKTtcbiAgICAgICAgcGxhY2VTZWN0aW9uLmFwcGVuZENoaWxkKHBsYWNlQ29zdCk7XG4gICAgICAgIHBsYWNlU2VjdGlvbi5hcHBlbmRDaGlsZChwbGFjZVJldmlldyk7XG4gICAgICAgIHBsYWNlU2VjdGlvbi5hcHBlbmRDaGlsZChwbGFjZUNpdHkpO1xuICAgICAgICBwbGFjZVNlY3Rpb24uYXBwZW5kQ2hpbGQoYnV0dG9uSG9sZGVyKTtcblxuICAgICAgICAvLyBjb25zb2xlLmxvZyhwbGFjZVNlY3Rpb24pO1xuXG4gICAgICAgIHJldHVybiBwbGFjZVNlY3Rpb25cblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBwbGFjZUl0ZW07IiwiLy8gQ29udGFpbnMgZmV0Y2ggY2FsbHMgdG8gR0VULCBQT1NULCBERUxFVEUsIGFuZCBQVVRcblxuY29uc3QgcGxhY2VEYXRhID0ge1xuXG4gICAgLy8gR0VUXG4gICAgZ2V0UGxhY2VzKCkge1xuICAgICAgICByZXR1cm4gZmV0Y2goXCJodHRwOi8vbG9jYWxob3N0OjgwODgvcGxhY2VzP19leHBhbmQ9Y2l0eU5hbWVcIilcbiAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgIH0sXG5cbiAgICAvLyBQT1NUXG4gICAgcG9zdE5ld1BsYWNlKHBsYWNlVG9TYXZlKSB7XG4gICAgICAgIHJldHVybiBmZXRjaChcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4OC9wbGFjZXNcIix7XG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkocGxhY2VUb1NhdmUpXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvLyBERUxFVEVcbiAgICBkZWxldGVQbGFjZShwbGFjZUlkKSB7XG4gICAgICAgIHJldHVybiBmZXRjaChgaHR0cDovL2xvY2FsaG9zdDo4MDg4L3BsYWNlcy8ke3BsYWNlSWR9YCwge1xuICAgICAgICAgIG1ldGhvZDogXCJERUxFVEVcIixcbiAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICAvLyBQVVRcbiAgICBnZXRQbGFjZShwbGFjZUlkKSB7XG4gICAgICAgIHJldHVybiBmZXRjaChgaHR0cDovL2xvY2FsaG9zdDo4MDg4L3BsYWNlcy8ke3BsYWNlSWR9P19leHBhbmQ9Y2l0eU5hbWVgKVxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgfSxcblxuICAgIC8vIE5lZWQgdGhlIGlkIHRvIGlkZW50aWZ5IHdoaWNoIHBsYWNlIGl0ZW0gd2Ugd2FudCB0byBlZGl0LCBhcyB3ZWxsIGFzIHRoZSBuZXcgZGF0YSB3ZSB3YW50IHRvIHJlcGxhY2UgdGhlIGV4aXN0aW5nIGRhdGEgd2l0aC4gU28gd2UgbmVlZCB0d28gYXJndW1lbnRzIGZvciB0aGUgbWV0aG9kLlxuICAgIHB1dEV4aXN0aW5nUGxhY2UocGxhY2VJZCwgcGxhY2VUb0VkaXQpIHtcbiAgICByZXR1cm4gZmV0Y2goYGh0dHA6Ly9sb2NhbGhvc3Q6ODA4OC9wbGFjZXMvJHtwbGFjZUlkfWAsIHtcbiAgICAgICAgbWV0aG9kOiBcIlBVVFwiLFxuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxuICAgICAgICB9LFxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShwbGFjZVRvRWRpdClcbiAgICB9KVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgcGxhY2VEYXRhOyIsIi8vIENyZWF0ZXMgZm9ybSB0byBlZGl0IGEgcGxhY2VcblxuaW1wb3J0IHBsYWNlRGF0YSBmcm9tIFwiLi9wbGFjZURhdGFcIlxuaW1wb3J0IHBsYWNlTGlzdCBmcm9tIFwiLi9wbGFjZUxpc3RcIlxuXG5jb25zdCBwbGFjZUVkaXRGb3JtID0ge1xuXG4gICAgYnVpbGRFZGl0Rm9ybShwbGFjZUlkLCBwbGFjZVRvRWRpdCkge1xuXG4gICAgICAgIC8vIENyZWF0ZSAmIGFwcGVuZCBmb3JtIHcvIHNhdmUgYnV0dG9uXG5cbiAgICAgICAgLy8gRGlzcGxheSBcIk5hbWVcIiAobm90IGVkaXRhYmxlKVxuICAgICAgICBsZXQgbmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoM1wiKTtcbiAgICAgICAgbmFtZS50ZXh0Q29udGVudCA9IGAke3BsYWNlVG9FZGl0Lm5hbWV9YDtcblxuICAgICAgICAvLyBEaXNwbGF5IFwiRGVzY3JpcHRpb25cIiAobm90IGVkaXRhYmxlKVxuICAgICAgICBsZXQgZGVzY3JpcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBkZXNjcmlwdGlvbi50ZXh0Q29udGVudCA9IHBsYWNlVG9FZGl0LmRlc2NyaXB0aW9uO1xuXG4gICAgICAgIC8vIENyZWF0ZSBcIkNvc3RcIiBmaWVsZFxuICAgICAgICBsZXQgY29zdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmaWVsZHNldFwiKTtcbiAgICAgICAgbGV0IGNvc3RMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcbiAgICAgICAgY29zdExhYmVsLnRleHRDb250ZW50ID0gXCJDb3N0XCI7XG4gICAgICAgIGNvc3RMYWJlbC5zZXRBdHRyaWJ1dGUoXCJmb3JcIiwgXCJwbGFjZV9jb3N0XCIpO1xuICAgICAgICBsZXQgY29zdElucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgICAgICBjb3N0SW5wdXQuc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJwbGFjZV9jb3N0XCIpO1xuICAgICAgICBjb3N0SW5wdXQuc2V0QXR0cmlidXRlKFwibmFtZVwiLCBcInBsYWNlX2Nvc3RcIik7XG4gICAgICAgIGNvc3RJbnB1dC52YWx1ZSA9IHBsYWNlVG9FZGl0LmNvc3Q7XG4gICAgICAgIGNvc3QuYXBwZW5kQ2hpbGQoY29zdExhYmVsKTtcbiAgICAgICAgY29zdC5hcHBlbmRDaGlsZChjb3N0SW5wdXQpO1xuXG4gICAgICAgIC8vIFNob3cgXCJDaXR5XCIgKG5vdCBlZGl0YWJsZSlcbiAgICAgICAgbGV0IGNpdHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBjaXR5LnRleHRDb250ZW50ID0gYENpdHk6ICR7cGxhY2VUb0VkaXQuY2l0eU5hbWUubmFtZX1gO1xuXG4gICAgICAgIC8vIENyZWF0ZSBcIlJldmlld1wiIGZpZWxkXG4gICAgICAgIGxldCByZXZpZXcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZmllbGRzZXRcIik7XG4gICAgICAgIGxldCByZXZpZXdMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcbiAgICAgICAgcmV2aWV3TGFiZWwudGV4dENvbnRlbnQgPSBcIlJldmlld1wiO1xuICAgICAgICByZXZpZXdMYWJlbC5zZXRBdHRyaWJ1dGUoXCJmb3JcIiwgXCJwbGFjZV9yZXZpZXdcIik7XG4gICAgICAgIGxldCByZXZpZXdJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZXh0YXJlYVwiKTtcbiAgICAgICAgcmV2aWV3SW5wdXQuc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJwbGFjZV9yZXZpZXdcIik7XG4gICAgICAgIHJldmlld0lucHV0LnNldEF0dHJpYnV0ZShcIm5hbWVcIiwgXCJwbGFjZV9yZXZpZXdcIik7XG4gICAgICAgIHJldmlld0lucHV0LnZhbHVlID0gcGxhY2VUb0VkaXQucmV2aWV3O1xuICAgICAgICByZXZpZXcuYXBwZW5kQ2hpbGQocmV2aWV3TGFiZWwpO1xuICAgICAgICByZXZpZXcuYXBwZW5kQ2hpbGQocmV2aWV3SW5wdXQpO1xuXG4gICAgICAgIC8vIENyZWF0ZSBcIlVwZGF0ZVwiIGJ1dHRvblxuICAgICAgICBsZXQgdXBkYXRlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKVxuICAgICAgICB1cGRhdGVCdXR0b24udGV4dENvbnRlbnQgPSBcIlVwZGF0ZVwiO1xuXG4gICAgICAgIC8vIEFkZCBldmVudCBsaXN0ZW5lciB0byB0aGUgXCJVcGRhdGVcIiBidXR0b25cbiAgICAgICAgLy8gVGFrZXMgdGhlIG5ldyB2YWx1ZXMgaW4gdGhlIGlucHV0IGZpZWxkcyBhbmQgYnVpbGRzIGFuIG9iamVjdCBmb3IgdGhlIHBsYWNlIGl0ZW0gdG8gYmUgZWRpdGVkLlxuICAgICAgICAvLyBNYWtlIGEgSFRUUCBQVVQgcmVxdWVzdCB3aGVyZSB3ZSB0YXJnZXQgdGhlIHBsYWNlIGl0ZW0gd2Ugd2FudCB0byBlZGl0IGJ5IHNwZWNpZnlpbmcgdGhlIGlkIGluIHRoZSBVUkwuXG4gICAgICAgIC8vIFBhc3MgdGhlIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIHBsYWNlIGl0ZW0gd2l0aCB0aGUgbmV3IHZhbHVlcyBhcyBkYXRhIGluIG91ciBIVFRQIHJlcXVlc3QuXG5cbiAgICAgICAgdXBkYXRlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgZWRpdGVkUGxhY2UgPSB7XG4gICAgICAgICAgICAgICAgbmFtZTogcGxhY2VUb0VkaXQubmFtZSxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogcGxhY2VUb0VkaXQuZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAgICAgY29zdDogY29zdElucHV0LnZhbHVlLFxuICAgICAgICAgICAgICAgIHJldmlldzogcmV2aWV3SW5wdXQudmFsdWUsXG4gICAgICAgICAgICAgICAgY2l0eU5hbWVJZDogcGxhY2VUb0VkaXQuY2l0eU5hbWUuaWRcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHBsYWNldG9FZGl0SWQgPSBwbGFjZVRvRWRpdC5pZDtcbiAgICAgICAgICAgIHBsYWNlRGF0YS5wdXRFeGlzdGluZ1BsYWNlKHBsYWNldG9FZGl0SWQsIGVkaXRlZFBsYWNlKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHBsYWNlTGlzdC5idWlsZExpc3QoKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBXZSBwYXNzZWQgaW4gdGhlIGlkIG9mIHRoZSBzZWN0aW9uIHNvIHdlIGtub3cgZXhhY3RseSB3aGVyZSB0byBhcHBlbmQgdGhlIGVkaXQgZm9ybS5cbiAgICAgICAgbGV0IHBsYWNlU2VjdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNwbGFjZS0tJHtwbGFjZUlkfWApO1xuXG4gICAgICAgIC8vIEJlY2F1c2Ugd2Ugd2FudCB0byByZXBsYWNlIHdoYXQgaXMgY3VycmVudGx5IGluIHRoZSBhcnRpY2xlIGVsZW1lbnQgd2l0aCB0aGUgZWRpdCBmb3JtLCB3ZSBjbGVhciBvdXQgYWxsIGNoaWxkcmVuIEhUTUwgZWxlbWVudHMgaW4gb3VyIHRhcmdldGVkIGVsZW1lbnQgYmVmb3JlIGFwcGVuZGluZyBvdXIgZWRpdCBmb3JtIHRvIGl0LlxuICAgICAgICB3aGlsZSAocGxhY2VTZWN0aW9uLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgIHBsYWNlU2VjdGlvbi5yZW1vdmVDaGlsZChwbGFjZVNlY3Rpb24uZmlyc3RDaGlsZCk7XG4gICAgICAgIH1cblxuICAgICAgICBwbGFjZVNlY3Rpb24uYXBwZW5kQ2hpbGQobmFtZSk7XG4gICAgICAgIHBsYWNlU2VjdGlvbi5hcHBlbmRDaGlsZChkZXNjcmlwdGlvbik7XG4gICAgICAgIHBsYWNlU2VjdGlvbi5hcHBlbmRDaGlsZChjb3N0KTtcbiAgICAgICAgcGxhY2VTZWN0aW9uLmFwcGVuZENoaWxkKHJldmlldyk7XG4gICAgICAgIHBsYWNlU2VjdGlvbi5hcHBlbmRDaGlsZChjaXR5KTtcbiAgICAgICAgcGxhY2VTZWN0aW9uLmFwcGVuZENoaWxkKHVwZGF0ZUJ1dHRvbik7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgcGxhY2VFZGl0Rm9ybTsiLCIvLyBDcmVhdGVzIGZvcm0gdG8gc2F2ZSBhIG5ldyBwbGFjZSBpdGVtIHRvIGRhdGFiYXNlXG5cbmltcG9ydCBldmVudExpc3RlbmVycyBmcm9tIFwiLi9ldmVudExpc3RlbmVyc1wiXG5cbmNvbnN0IHBsYWNlRm9ybSA9IHtcblxuICAgIGJ1aWxkRm9ybSgpIHtcblxuICAgICAgICAvLyBDcmVhdGUgY29udGFpbmVyLCB0aXRsZSwgZXRjLlxuICAgICAgICBsZXQgb3V0cHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNvdXRwdXRcIik7XG4gICAgICAgIGxldCBmb3JtQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgZm9ybUNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcImZvcm1fY29udGFpbmVyXCIpO1xuICAgICAgICBsZXQgZm9ybUNvbnRhaW5lclRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgzXCIpO1xuICAgICAgICBmb3JtQ29udGFpbmVyVGl0bGUudGV4dENvbnRlbnQgPSBcIkFkZCBOZXcgUGxhY2VcIjtcbiAgICAgICAgZm9ybUNvbnRhaW5lci5hcHBlbmRDaGlsZChmb3JtQ29udGFpbmVyVGl0bGUpO1xuXG4gICAgICAgIC8vIENyZWF0ZSBcIk5hbWVcIiBmaWVsZFxuICAgICAgICBsZXQgbmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmaWVsZHNldFwiKTtcbiAgICAgICAgbGV0IG5hbWVMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcbiAgICAgICAgbmFtZUxhYmVsLnRleHRDb250ZW50ID0gXCJOYW1lXCI7XG4gICAgICAgIG5hbWVMYWJlbC5zZXRBdHRyaWJ1dGUoXCJmb3JcIiwgXCJwbGFjZV9uYW1lXCIpO1xuICAgICAgICBsZXQgbmFtZUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgICAgICBuYW1lSW5wdXQuc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJwbGFjZV9uYW1lXCIpO1xuICAgICAgICBuYW1lSW5wdXQuc2V0QXR0cmlidXRlKFwibmFtZVwiLCBcInBsYWNlX25hbWVcIik7XG4gICAgICAgIG5hbWUuYXBwZW5kQ2hpbGQobmFtZUxhYmVsKTtcbiAgICAgICAgbmFtZS5hcHBlbmRDaGlsZChuYW1lSW5wdXQpO1xuXG4gICAgICAgIC8vIENyZWF0ZSBcIkRlc2NyaXB0aW9uXCIgZmllbGRcbiAgICAgICAgbGV0IGRlc2NyaXB0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZpZWxkc2V0XCIpO1xuICAgICAgICBsZXQgZGVzY3JpcHRpb25MYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcbiAgICAgICAgZGVzY3JpcHRpb25MYWJlbC50ZXh0Q29udGVudCA9IFwiRGVzY3JpcHRpb25cIjtcbiAgICAgICAgZGVzY3JpcHRpb25MYWJlbC5zZXRBdHRyaWJ1dGUoXCJmb3JcIiwgXCJwbGFjZV9kZXNjcmlwdGlvblwiKTtcbiAgICAgICAgbGV0IGRlc2NyaXB0aW9uSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGV4dGFyZWFcIik7XG4gICAgICAgIGRlc2NyaXB0aW9uSW5wdXQuc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJwbGFjZV9kZXNjcmlwdGlvblwiKTtcbiAgICAgICAgZGVzY3JpcHRpb25JbnB1dC5zZXRBdHRyaWJ1dGUoXCJuYW1lXCIsIFwicGxhY2VfZGVzY3JpcHRpb25cIik7XG4gICAgICAgIGRlc2NyaXB0aW9uLmFwcGVuZENoaWxkKGRlc2NyaXB0aW9uTGFiZWwpO1xuICAgICAgICBkZXNjcmlwdGlvbi5hcHBlbmRDaGlsZChkZXNjcmlwdGlvbklucHV0KTtcblxuICAgICAgICAvLyBDcmVhdGUgXCJDb3N0XCIgZmllbGRcbiAgICAgICAgbGV0IGNvc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZmllbGRzZXRcIik7XG4gICAgICAgIGxldCBjb3N0TGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XG4gICAgICAgIGNvc3RMYWJlbC50ZXh0Q29udGVudCA9IFwiQ29zdFwiO1xuICAgICAgICBjb3N0TGFiZWwuc2V0QXR0cmlidXRlKFwiZm9yXCIsIFwicGxhY2VfY29zdFwiKTtcbiAgICAgICAgbGV0IGNvc3RJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICAgICAgY29zdElucHV0LnNldEF0dHJpYnV0ZShcImlkXCIsIFwicGxhY2VfY29zdFwiKTtcbiAgICAgICAgY29zdElucHV0LnNldEF0dHJpYnV0ZShcIm5hbWVcIiwgXCJwbGFjZV9jb3N0XCIpO1xuICAgICAgICBjb3N0LmFwcGVuZENoaWxkKGNvc3RMYWJlbCk7XG4gICAgICAgIGNvc3QuYXBwZW5kQ2hpbGQoY29zdElucHV0KTtcblxuICAgICAgICAvLyBDcmVhdGUgXCJDaXR5XCIgZHJvcC1kb3duXG4gICAgICAgIGxldCBjaXR5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZpZWxkc2V0XCIpO1xuICAgICAgICBsZXQgY2l0eUxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xuICAgICAgICBjaXR5TGFiZWwudGV4dENvbnRlbnQgPSBcIkNpdHlcIjtcbiAgICAgICAgbGV0IGNpdHlJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzZWxlY3RcIik7XG4gICAgICAgIGNpdHlJbnB1dC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcInBsYWNlX2NpdHlcIik7XG4gICAgICAgIGNpdHlJbnB1dC5zZXRBdHRyaWJ1dGUoXCJuYW1lXCIsIFwicGxhY2VfY2l0eVwiKTtcbiAgICAgICAgbGV0IGNpdHlPcHRpb25zID0gYFxuICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIjFcIj5Mb3MgQW5nZWxlczwvb3B0aW9uPlxuICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIjJcIj5TYW4gRnJhbmNpc2NvPC9vcHRpb24+XG4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiM1wiPlRvcm9udG88L29wdGlvbj5cbiAgICAgICAgYFxuICAgICAgICBjaXR5SW5wdXQuaW5uZXJIVE1MID0gY2l0eU9wdGlvbnM7XG4gICAgICAgIGNpdHkuYXBwZW5kQ2hpbGQoY2l0eUxhYmVsKTtcbiAgICAgICAgY2l0eS5hcHBlbmRDaGlsZChjaXR5SW5wdXQpO1xuXG4gICAgICAgIC8vIENyZWF0ZSBcIlNhdmVcIiBidXR0b24gYW5kIGF0dGFjaCBldmVudCBsaXN0ZW5lclxuICAgICAgICBsZXQgc2F2ZUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIHNhdmVCdG4udGV4dENvbnRlbnQgPSBcIlNhdmUgUGxhY2VcIjtcbiAgICAgICAgc2F2ZUJ0bi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcInNhdmVfbmV3X3BsYWNlXCIpO1xuXG4gICAgICAgIC8vIEF0dGFjaCBldmVudCBsaXN0ZW5lciB0byBidXR0b24sIHRvIFBPU1QgdG8gZGF0YWJhc2VcbiAgICAgICAgc2F2ZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZXZlbnRMaXN0ZW5lcnMucG9zdFBsYWNlKTtcblxuICAgICAgICAvLyBBcHBlbmQgZWFjaCBmaWVsZC9idXR0b24gdG8gZm9ybSBjb250YWluZXJcblxuICAgICAgICBmb3JtQ29udGFpbmVyLmFwcGVuZENoaWxkKG5hbWUpO1xuICAgICAgICBmb3JtQ29udGFpbmVyLmFwcGVuZENoaWxkKGRlc2NyaXB0aW9uKTtcbiAgICAgICAgZm9ybUNvbnRhaW5lci5hcHBlbmRDaGlsZChjb3N0KTtcbiAgICAgICAgZm9ybUNvbnRhaW5lci5hcHBlbmRDaGlsZChjaXR5KTtcbiAgICAgICAgZm9ybUNvbnRhaW5lci5hcHBlbmRDaGlsZChzYXZlQnRuKTtcblxuICAgICAgICBvdXRwdXQuYXBwZW5kQ2hpbGQoZm9ybUNvbnRhaW5lcik7XG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IHBsYWNlRm9ybTsiLCIvLyBCdWlsZHMgb3V0IHBsYWNlIGxpc3QgYW5kIGFwcGVuZHMgdG8gRE9NXG5cbmltcG9ydCBwbGFjZURhdGEgZnJvbSBcIi4vcGxhY2VEYXRhXCI7XG5pbXBvcnQgcGxhY2UgZnJvbSBcIi4vcGxhY2VcIlxuaW1wb3J0IHBsYWNlRm9ybSBmcm9tIFwiLi9wbGFjZUZvcm1cIjtcbi8vIGltcG9ydCBldmVudExpc3RlbmVycyBmcm9tIFwiLi9ldmVudExpc3RlbmVyc1wiXG5cbmNvbnN0IHBsYWNlTGlzdCA9IHtcblxuICAgIGJ1aWxkTGlzdCgpIHtcblxuICAgICAgICAvLyBDcmVhdGUgY29udGFpbmVyLCB0aXRsZSwgZXRjLlxuICAgICAgICBsZXQgb3V0cHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNvdXRwdXRcIik7XG4gICAgICAgIG91dHB1dC5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgICAgIGxldCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoMVwiKTtcbiAgICAgICAgdGl0bGUudGV4dENvbnRlbnQgPSBcIlRoZSBUZXJuYXJ5IFRyYXZlbGVyXCI7XG4gICAgICAgIG91dHB1dC5hcHBlbmRDaGlsZCh0aXRsZSk7XG5cbiAgICAgICAgbGV0IGxpc3RDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBsaXN0Q29udGFpbmVyLnNldEF0dHJpYnV0ZShcImlkXCIsIFwibGlzdF9jb250YWluZXJcIik7XG5cbiAgICAgICAgLy8gQWRkIGZvcm0gaGVyZVxuICAgICAgICBwbGFjZUZvcm0uYnVpbGRGb3JtKCk7XG5cbiAgICAgICAgLy8gQ3JlYXRlIGRvYyBmcmFnIHRvIGhvbGQgZWFjaCBwbGFjZSBpdGVtXG4gICAgICAgIGxldCBwbGFjZURvY0ZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cbiAgICAgICAgLy8gR0VUIHBsYWNlIGRhdGFcbiAgICAgICAgcGxhY2VEYXRhLmdldFBsYWNlcygpXG4gICAgICAgIC50aGVuKGFsbFBsYWNlcyA9PiB7XG4gICAgICAgICAgICBhbGxQbGFjZXMuZm9yRWFjaChwbGFjZUl0ZW0gPT4ge1xuICAgICAgICAgICAgLy8gZm9yRWFjaCBwbGFjZSwgY2FsbCBmdW5jdGlvbiB0byBidWlsZCBIVE1MIGZvciBlYWNoIG9uZSBhbmQgYXBwZW5kIGVhY2ggdG8gZG9jIGZyYWdcbiAgICAgICAgICAgICAgICBsZXQgbmV3UGxhY2UgPSBwbGFjZS5idWlsZFBsYWNlKHBsYWNlSXRlbSk7IC8vIG5ld1BsYWNlID0gcGxhY2VTZWN0aW9uXG4gICAgICAgICAgICAgICAgcGxhY2VEb2NGcmFnLmFwcGVuZENoaWxkKG5ld1BsYWNlKTtcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIC8vIEFwcGVuZCB0aGUgZG9jIGZyYWcgdG8gdGhlIERPTVxuICAgICAgICAgICAgbGlzdENvbnRhaW5lci5hcHBlbmRDaGlsZChwbGFjZURvY0ZyYWcpO1xuICAgICAgICB9KVxuXG4gICAgICAgIG91dHB1dC5hcHBlbmRDaGlsZChsaXN0Q29udGFpbmVyKTtcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBwbGFjZUxpc3Q7Il19
