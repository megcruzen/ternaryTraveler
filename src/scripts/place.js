// Creates each place item that will be appended to DOM

// import placeList from "./placeList"

const placeItem = {

    buildPlace(placeObj) {                // argument passed from placeList

        // Build each place item

        // Create container for each item
        let placeSection = document.createElement("section");
        // ex: foodArticle.setAttribute("id", `food--${foodObject.id}`)
        placeSection.setAttribute("class", "place_section");

        // Name
        let placeName = document.createElement("h3");
        placeName.textContent = placeObj.name;
        // console.log(placeObj.name);

        // Description
        let placeDesc = document.createElement("p");
        placeDesc.textContent = placeObj.description;

        // Cost
        let placeCost = document.createElement("p");
        placeCost.textContent = placeObj.cost;

        // Review
        let placeReview = document.createElement("p");
        placeReview.textContent = placeObj.review;

        // City
        let placeCity = document.createElement("p");
        placeCity.textContent = placeObj.cityName.name;

        // Add button section
        let buttonHolder = document.createElement("div");

        // edit button
        let editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.setAttribute("class", "edit_place");
        // GET
        // .then PUT

        // delete button
        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.setAttribute("class", "delete_place");
        // .then (call placeList.buildList to refresh DOM)

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