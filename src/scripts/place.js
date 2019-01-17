// Creates each place item that will be appended to DOM

import placeList from "./placeList"
import placeData from "./placeData"
import placeEditForm from "./placeEditForm"

const placeItem = {

    buildPlace(placeObj) {                // argument passed from placeList

        // Build each place item

        // Create container for each item
        let placeSection = document.createElement("section");
        placeSection.setAttribute("class", "place_section");
        placeSection.setAttribute("id", `place--${placeObj.id}`)

        // Name
        let placeName = document.createElement("h3");
        placeName.textContent = placeObj.name;
        // console.log(placeObj.name);

        // Description
        let placeDesc = document.createElement("p");
        placeDesc.textContent = placeObj.description;

        // Cost
        let placeCost = document.createElement("p");
        if (placeObj.cost === "0" || placeObj.cost === "FREE") {
            let costDisplay = `Cost: ${placeObj.cost}`;
            placeCost.textContent = costDisplay;
        }
        else {
            let costDisplay = `Cost: $${placeObj.cost}`;
            placeCost.textContent = costDisplay;
        }

        // Review
        let placeReview = document.createElement("p");
        let reviewDisplay = `Review: ${placeObj.review}`;
        placeReview.textContent = reviewDisplay;

        // City
        let placeCity = document.createElement("p");
        let cityDisplay = `City: ${placeObj.cityName.name}`;
        placeCity.textContent = cityDisplay;

        // Add button section
        let buttonHolder = document.createElement("div");
        buttonHolder.setAttribute("class", "button_holder");

        // Edit button
        let editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.setAttribute("class", "edit_place");
        editBtn.addEventListener("click", () => {
            let sectionId = event.target.parentNode.parentNode.id;
            let placeId = sectionId.split("--")[1];
            console.log(placeId);
            placeData.getPlace(placeId)
            .then(response => {
                placeEditForm.buildEditForm(placeId, response)
            })
        })

        // Delete button
        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.setAttribute("class", "delete_place");
        deleteBtn.addEventListener("click", () => {
            let placeId = placeObj.id;
            placeData.deletePlace(placeId)
            .then(() => {
                placeList.buildList()
            })
        })

        // Add "Edit" and "Delete" buttons to button holder
        buttonHolder.appendChild(editBtn);
        buttonHolder.appendChild(deleteBtn);

        // Append each element to placeSection
        placeSection.appendChild(placeName);
        placeSection.appendChild(placeDesc);
        placeSection.appendChild(placeCost);
        placeSection.appendChild(placeReview);
        placeSection.appendChild(placeCity);
        placeSection.appendChild(buttonHolder);

        // console.log(placeSection);

        return placeSection

    }

}

export default placeItem;