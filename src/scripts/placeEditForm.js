// Creates form to edit a place

const placeEditForm = {

    buildEditForm() {

        // Create & append form w/ save button

        // Display "Name" (not editable)
        let name = document.createElement("div");
        name.textContent = `Name: ${placeObj.name}`;

        // Display "Description" (not editable)
        let description = document.createElement("div");
        description.textContent = `Description: ${placeObj.description}`;

        // Create "Cost" field
        let cost = document.createElement("fieldset");
        let costLabel = document.createElement("label");
        costLabel.textContent = "Cost";
        costLabel.setAttribute("for", "place_cost");
        let costInput = document.createElement("input");
        costInput.setAttribute("id", "place_cost");
        costInput.setAttribute("name", "place_cost");
        cost.appendChild(costLabel);
        cost.appendChild(costInput);

        // Create "City" drop-down
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
        `
        cityInput.innerHTML = cityOptions;
        city.appendChild(cityLabel);
        city.appendChild(cityInput);

        // When saved, PUT to database (and reload placeList)

    }

}

export default placeEditForm;