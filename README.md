# Records-API-Data-Fetcher
Certainly! Here's a README template based on your code for the `retrieve` function in your project:

---

# Fetch Records API Integration

This project demonstrates the integration of a front-end application with a RESTful API, specifically focusing on fetching and transforming JSON data from a `/records` endpoint. The primary functionality revolves around the `retrieve` function which processes and manipulates data according to specified parameters.

## Features

- Fetch data from the `/records` API endpoint using the Fetch API.
- Process and transform API responses into a user-friendly format.
- Support for fetching data based on page number and specific color filters.
- Error handling for bad network responses and invalid parameters.


## Functionality

The `retrieve` function in `api/managed-records.js` is designed to:

- Accept an options object containing `page` and `colors`.
- Fetch data from the API based on the specified options.
- Transform the fetched data into an object containing `ids`, `open`, `closedPrimaryCount`, `previousPage`, and `nextPage`.

### Usage Example

```javascript
retrieve({ page: 2, colors: ["red", "blue"] }).then(data => {
  console.log(data);
});
```

## Built With

- JavaScript ES2015
- Fetch API
- URI.js - For constructing query strings

## Authors

- **[Bryce Greene]** - *Initial work* - [brycegreene20]
https://github.com/brycegreene20
