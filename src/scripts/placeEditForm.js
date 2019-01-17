// Creates form to edit a place

import placeData from "./placeData"
import placeList from "./placeList"

const placeEditForm = {

    buildEditForm(placeId, placeToEdit) {

        // Create & append form w/ save button

        // Display "Name" (not editable)
        let name = document.createElement("h3");
        name.textContent = `${placeToEdit.name}`;

        // Display "Description" (not editable)
        let description = document.createElement("div");
        description.textContent = placeToEdit.description;

        // Create "Cost" field
        let cost = document.createElement("fieldset");
        let costLabel = document.createElement("label");
        costLabel.textContent = "Cost";
        costLabel.setAttribute("for", "place_cost");
        let costInput = document.createElement("input");
        costInput.setAttribute("id", "place_cost");
        costInput.setAttribute("name", "place_cost");
        costInput.value = placeToEdit.cost;
        cost.appendChild(costLabel);
        cost.appendChild(costInput);

        // Show "City" (not editable)
        let city = document.createElement("div");
        city.textContent = `City: ${placeToEdit.cityName.name}`;

        // Create "Review" field
        let review = document.createElement("fieldset");
        let reviewLabel = document.createElement("label");
        reviewLabel.textContent = "Review";
        reviewLabel.setAttribute("for", "place_review");
        let reviewInput = document.createElement("textarea");
        reviewInput.setAttribute("id", "place_review");
        reviewInput.setAttribute("name", "place_review");
        reviewInput.value = placeToEdit.review;
        review.appendChild(reviewLabel);
        review.appendChild(reviewInput);

        // Create "Update" button
        let updateButton = document.createElement("button")
        updateButton.textContent = "Update";

        // Add event listener to the "Update" button
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
            }

            let placetoEditId = placeToEdit.id;
            placeData.putExistingPlace(placetoEditId, editedPlace)
            .then(() => {
                placeList.buildList()
            })
        })

        // We passed in the id of the section so we know exactly where to append the edit form.
        let placeSection = document.querySelector(`#place--${placeId}`);

        // Because we want to replace what is currently in the article element with the edit form, we clear out all children HTML elements in our targeted element before appending our edit form to it.
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

}

export default placeEditForm;