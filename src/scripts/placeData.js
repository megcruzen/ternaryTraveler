// Contains fetch calls to GET, POST, DELETE, and PUT

const placeData = {

    // GET
    getPlaces() {
        return fetch("http://localhost:8088/places?_expand=cityName")
        .then(response => response.json())
    }

    // POST

    // DELETE

    // PUT
}

export default placeData;