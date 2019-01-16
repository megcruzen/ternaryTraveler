// Contains all event listeners

import placeData from "./placeData"
import placeList from "./placeList"

const eventListeners = {

    // Add new article
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
            cityNameId: Number(inputPlaceCity)
          }

        // Save article to database
        // Then rebuild the article list on DOM
        placeData.postNewPlace(placeToSave)
        .then(() => {
            placeList.buildList()
        })
    }

    // Delete article

    // Edit article

}

export default eventListeners;