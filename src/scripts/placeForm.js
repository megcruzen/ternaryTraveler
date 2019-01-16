// Creates form to save a new place item to database

const placeForm = {

    buildForm() {

        // Create container, title, etc.
        let output = document.querySelector("#output");
        let formContainer = document.createElement("div");
        formContainer.setAttribute("id", "form_container");
        let formContainerTitle = document.createElement("h3");
        formContainerTitle.textContent = "Add New Place";
        formContainer.appendChild(formContainerTitle);

        // Create "Name" field
        let name = document.createElement("fieldset");
        let nameLabel = document.createElement("label");
        nameLabel.textContent = "Name";
        nameLabel.setAttribute("for", "place_name");
        let nameInput = document.createElement("input");
        nameInput.setAttribute("id", "place_name");
        nameInput.setAttribute("name", "place_name");
        name.appendChild(nameLabel);
        name.appendChild(nameInput);

        // Create "Description" field
        let description = document.createElement("fieldset");
        let descriptionLabel = document.createElement("label");
        descriptionLabel.textContent = "Description";
        descriptionLabel.setAttribute("for", "place_description");
        let descriptionInput = document.createElement("textarea");
        descriptionInput.setAttribute("id", "place_description");
        descriptionInput.setAttribute("name", "place_description");
        description.appendChild(descriptionLabel);
        description.appendChild(descriptionInput);

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

        // Create "Save" button and attach event listener
        let saveBtn = document.createElement("button");
        saveBtn.textContent = "Save Place";
        saveBtn.setAttribute("class", "save_new_place");

        // Append each field/button to form container

        formContainer.appendChild(name);
        formContainer.appendChild(description);
        formContainer.appendChild(cost);
        formContainer.appendChild(city);
        formContainer.appendChild(saveBtn);

        output.appendChild(formContainer);

    },

    postPlace() {

        // Get user input (value of each field)
        let inputPlaceName = document.querySelector("#place_name").value;
        let inputPlaceDescription = document.querySelector("#place_description").value;
        let inputPlaceCost = document.querySelector("#place_cost").value;
        let inputPlaceCity = document.querySelector("#place_city").value;

        // Create new object with correct DB structure to represent a single place item:

        let placeToSave = {
            name: inputPlaceName,
            description: inputPlaceDescription,
            cost: inputPlaceCost,
            review: "",
            city: inputPlaceCity
          }

    }

}

export default placeForm;