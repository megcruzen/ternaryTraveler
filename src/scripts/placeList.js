// Builds out place list and appends to DOM

import placeData from "./placeData";
import place from "./place"
import placeForm from "./placeForm";
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
        listContainer.setAttribute("id", "list_container");

        // Add form here
        placeForm.buildForm();

        // Create doc frag to hold each place item
        let placeDocFrag = document.createDocumentFragment();

        // GET place data
        placeData.getPlaces()
        .then(allPlaces => {
            allPlaces.forEach(placeItem => {
            // forEach place, call function to build HTML for each one and append each to doc frag
                let newPlace = place.buildPlace(placeItem); // newPlace = placeSection
                placeDocFrag.appendChild(newPlace);
            })

            // Append the doc frag to the DOM
            listContainer.appendChild(placeDocFrag);
        })

        output.appendChild(listContainer);

    }

}

export default placeList;