## Description of the problem and solution:

Problem: Users need a comprehensive and intuitive way to find mobile food facilities in San Francisco, and the interface should include the following product requirements:

1) Search by applicant's name
2) Search by street name, including partial matches
3) Filtering by permit status (Approved, Expired, Requested)

Solution: I built a React application that displays a paginated list of food trucks. It includes an interactive search bar, which includes a dropdown to change the search based on applicant's name or street name. Additionally, I included a filter dropdown for status and responsive pagination. The user input in the search bar is debounced for performance, and loading/error states are included in case API calls fail.

## Reasoning behind technical decisions:

1) Splitting into components: I chose to split core UI elements (seach bar, filter dropdown, and the table) into reusable components to have better readability; this also simplies state and prop management, making the components easier to test in isolation. Instead of including one large App.tsx file with all this logic in there, splitting up the components into separate files helps reduce cognitive load when modifying UI sections in the future. 

2) Debounce for search: I wanted to avoid excessive state updates when users were typing so I implemented debounce for the search input. In a production scenario (with API-based filtering instead of the current client-side), this would also limit the number of network requests being made, which would facilitate reduced server load and lead to a better user experience.

3) API Documentation in ReadME: I chose to include the API documentation at the bottom of the ReadME instead, as I had implemented client-side filtering in my application, so there was only an initial GET call to the API to fetch the data. Since it was a more simple approach to filtering, I opted for a more simple way of API documentation.

## Critique Section

### What would you have done differently if you had spent more time on this?

1) Include a skeleton loading state for the table. If I had a bit more time, I'd enhance the current loading UI with pulsing animation and a structured table skeleton to better emulate the table layout. Especially when scaling the application to larger users, if the data takes longer to load, it would improve the perceived performance to the users with a structured loading state.

2) I wrote the tests at the integration level in App.test.tsx to cover core user flows, such as searching, filtering, and pagination. If I had more time, I'd split the tests into individual components to allow for better isolated logic validation at the component-level.

3) I implemented basic accessibility features, such as aria-labels, aria-expanded, etc. If I had more time, I would conduct a more extensive accessibility audit to ensure WCAG compliance, including color-contrast ratios, keyboard navigation, and screen reader support for the interactive CTAs, inputs, and table.

### What are the trade-offs you might have made?

1) One of the tradeoffs I made was scalability vs. velocity. I opted for client-side filtering given the small dataset size and thought that it was sufficient for meeting the feature requirements without introducing added complexity. However, for a significantly larger dataset and/or if I were to scale this to production, I would move filtering, search, and pagination to the backend to improve performance and reduce client load on the frontend.

2) Another tradeoff I made was prioritizing functionality over aesthetic. For example, the table doesn't group multiple entries for the same food truck. While I could have included accordion-style grouping/hierarchy, I chose to keep the implementation simple and focused on delivering the fundamental requirements and functionality for the first iteration. 

### What are the things you left out?

1) One of the things I left out is responsive design for all viewports. If I had more time, I would have designed the table to be more dynamic across all screen sizes to ensure that the table and search functionality is accessibility for users on all devices. Currently, the table is designed for desktop view.

2) I also left out the feature to return the 5 nearest food trucks given a latitude and longitude. This would require distance calculations and/or integration with a mapping API. Due to time constraints and additional complexity, I decided to leave this out in the initial implementation of the table. If I had more time, I would include an input for manual coordinates from the users and then filter the mobile facility trucks based on geographic proximity with adjustable status filters (approved, expired, etc.).

### What are the problems with your implementation and how would you solve them if we had to scale the application to a large number of users?

One of the problems with my implementation is that the entire dataset is fetched at load time and filtered from the client-side. This is manageable for small datasets but would not scale to a large number of users. With a large-scale app, I would implement server-side filtering, pagination, and search to improve performance. To achieve this, I'd utilize query params for filtering and make GET API calls to return the filtered data from the backend.

The returned API response from these GET calls would look something like this:

```
{
  "elements": [{...}, {...}],
  "total": 300,
  "page": 1,
  "pageSize": 10
}
```

Additionally, I would move the debounce logic to the query params so that the URL only updates when the debounced search term changes to reduce unnecessary re-renders and API calls. I would also implement paginated fetching, requesting only the data needed for the current page and loading additional data as users navigate to the subsequent pages to improve efficiency.

## API Documentation

This app consumes data taken from the San Francisco Open Data portal:
https://data.sfgov.org/Economy-and-Community/Mobile-Food-Facility-Permit/rqzj-sfat/about_data.

### Source

**GET** https://data.sfgov.org/resource/rqzj-sfat.json

This returns a list of the mobile food facilities in San Francisco, including information on permit, status, location, etc.


### Example JSON
```json
[
  {
    "objectid": "123456",
    "applicant": "Bob's Donut Truck",
    "facilitytype": "Truck",
    "status": "APPROVED",
    "fooditems": "Donuts: Coffee: Soft Drinks",
    "latitude": "12.3456",
    "longitude": "45.6789",
    "address": "123 VAN NESS AVE",
    ...
  }
]
```

## Instructions to Run and Test App

### test

```
npm test
```

### run the application

```
npm install
npm start
```