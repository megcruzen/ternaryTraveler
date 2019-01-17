// Contains fetch calls to GET, POST, DELETE, and PUT

const placeData = {

    // GET
    getPlaces() {
        return fetch("http://localhost:8088/places?_expand=cityName")
        .then(response => response.json())
    },

    // POST
    postNewPlace(placeToSave) {
        return fetch("http://localhost:8088/places",{
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
        })
    },

    // PUT
    getPlace(placeId) {
        return fetch(`http://localhost:8088/places/${placeId}?_expand=cityName`)
        .then(response => response.json())
    },

    // Need the id to identify which place item we want to edit, as well as the new data we want to replace the existing data with. So we need two arguments for the method.
    putExistingPlace(placeId, placeToEdit) {
    return fetch(`http://localhost:8088/places/${placeId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(placeToEdit)
    })
    }
}

export default placeData;