// Creates form to save a new place item to database

const placeForm = {

    buildForm() {

        // Create container, title, etc.

        // Create "Name" field

        // Create "Description" field

        // Create "Cost" field

        // Create "City" drop-down

        // Create "Save" button

        // Append each field/button to form container

    },

    postPlace() {

        // Get user input (value of each field)

        // Create new object with correct DB structure to represent a single place item:

        let placeToSave = {
            name: inputArticleName,
            description: inputSynopsis,
            cost: inputURL,
            review: "",
            city: dateDisplay
          }

    }

}

export default placeForm;