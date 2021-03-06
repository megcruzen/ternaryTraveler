# The Ternary Traveler

## Story
As a user, I should be able to enter in an point of interest, and associate it with a place.

### Acceptance Criteria
**Given** a user has already has points of interests<br />
**When** the user opens the application<br />
**Then** all points of interests should be displayed with their name, description, cost, review if it's not blank and the place it is located

**Given** a user wants to keep track of a new point of interest<br />
**When** the user opens the application<br />
**Then** a form should be presented to the user in which the following properties of the point of interest can be provided

1. Name of the point of interest
2. Description of the point of interest
3. Cost of visiting the point of interest
4. Dropdown to pick which place the point of interest is located in

**Given** a user has entered in all details of a point of interest<br />
**When** the user performs a gesture to save the point of interest<br />
**Then** the point of interest should be displayed in the application

**Given** a user wants to change the cost of a point of interest or add/change the review to a point of interest<br />
**When** the user performs a gesture to edit the point of interest<br />
**Then** the user should be presented with a form that has the cost and review, if it's not blank, pre-filled<br />
**And** there should be an affordance to save the edited cost and review

**Given** a user has saved a point of interest<br />
**When** the user visits their application<br />
**Then** all points of interest should be displayed<br />
**And** each point of interest should have an affordance to delete it

**Given** a user wants to remove a previously stored point of interest<br />
**When** the user performs a gesture on the delete affordance<br />
**Then** the user should be prompted to confirm the delete

**Given** a user is viewing the delete prompt<br />
**When** the user selects the confirmation affordance<br />
**Then** the point of interest should be deleted<br />
**And** the confirmation message should disappear<br />
**And** the list of points of interest should be refreshed

**Given** a user is viewing the delete prompt<br />
**When** the user selects the cancel affordance<br />
**Then** the point of interest should NOT be deleted<br />
**And** the confirmation message should disappear
